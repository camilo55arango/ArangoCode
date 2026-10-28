import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, formatSize, nameField } from '../ui.js';
import { qpdf } from '../qpdf.js';

const status = createStatus($('#status'));
const name = nameField();
const goBtn = $('#go');
const downloadBtn = $('#download');

/* Lado mayor y calidad JPEG de las fotos en cada nivel. "Sin pérdida" no toca las imágenes. */
const LEVELS = {
  lossless: null,
  recommended: { maxSide: 1600, quality: 0.72 },
  strong: { maxSide: 1100, quality: 0.55 }
};

let file = null;
let result = null;

const level = () => $('#levels input:checked').value;
const baseName = () => (file?.name.replace(/\.pdf$/i, '') || 'documento');

function invalidate() {
  result = null;
  $('#result').hidden = true;
  downloadBtn.hidden = true;
  goBtn.hidden = false;
}

function load(f) {
  file = f;
  invalidate();
  $('#drop').hidden = true;
  $('#opts').hidden = false;
  $('#fileName').textContent = f.name;
  $('#fileInfo').textContent = formatSize(f.size);
  name.suggest(`${baseName()}-comprimido.pdf`);
  status.set('Elige el nivel y pulsa Comprimir.');
  goBtn.focus();
}

/** Lee una imagen del PDF como bitmap si sabemos reconstruirla; si no, null (se deja como está). */
async function readImage(stream, lib) {
  const { PDFName, PDFArray, PDFNumber } = lib;
  const dict = stream.dict;
  const get = (k) => dict.lookup(PDFName.of(k));
  if (get('ImageMask')?.toString() === 'true' || get('Decode') || get('Mask')) return null;
  const width = get('Width')?.asNumber?.();
  const height = get('Height')?.asNumber?.();
  if (!width || !height || width * height < 64 * 64) return null;

  let filter = get('Filter');
  if (filter instanceof PDFArray) filter = filter.size() === 1 ? filter.lookup(0) : null;
  const filterName = filter?.toString();
  const cs = get('ColorSpace')?.toString();
  const bpc = get('BitsPerComponent') instanceof PDFNumber ? get('BitsPerComponent').asNumber() : 8;
  const bytes = stream.getContents();

  if (filterName === '/DCTDecode') {
    if (cs && !['/DeviceRGB', '/DeviceGray'].includes(cs)) return null; // CMYK e ICC: mejor no arriesgar colores.
    return { bitmap: await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' })), gray: cs === '/DeviceGray', width, height };
  }
  if (filterName === '/FlateDecode' && !get('DecodeParms') && bpc === 8 && ['/DeviceRGB', '/DeviceGray'].includes(cs)) {
    const { unzlibSync } = await import('fflate');
    const raw = unzlibSync(bytes);
    const ch = cs === '/DeviceRGB' ? 3 : 1;
    if (raw.length < width * height * ch) return null;
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let i = 0, j = 0; i < width * height; i++, j += ch) {
      rgba[i * 4] = raw[j];
      rgba[i * 4 + 1] = raw[j + (ch === 3 ? 1 : 0)];
      rgba[i * 4 + 2] = raw[j + (ch === 3 ? 2 : 0)];
      rgba[i * 4 + 3] = 255;
    }
    return { bitmap: await createImageBitmap(new ImageData(rgba, width, height)), gray: cs === '/DeviceGray', width, height };
  }
  return null;
}

/** Vuelve a codificar como JPEG las fotos del PDF que lo merezcan. Devuelve cuántas cambió. */
async function recompressImages(doc, lib, { maxSide, quality }) {
  const { PDFName, PDFRawStream, PDFNumber } = lib;
  const isImage = (obj) => obj instanceof PDFRawStream && obj.dict.lookup(PDFName.of('Subtype'))?.toString() === '/Image';
  const objects = doc.context.enumerateIndirectObjects();
  // Las máscaras de transparencia (SMask) son imágenes en gris de las que dependen otras: no se tocan.
  const masks = new Set(objects.filter(([, obj]) => isImage(obj)).map(([, obj]) => obj.dict.get(PDFName.of('SMask'))?.toString()).filter(Boolean));
  const images = objects.filter(([ref, obj]) => isImage(obj) && !masks.has(ref.toString()));

  let changed = 0;
  for (const [i, [ref, stream]] of images.entries()) {
    status.set(`Optimizando imágenes… ${i + 1} de ${images.length}`);
    let img;
    try { img = await readImage(stream, lib); } catch (e) { img = null; }
    if (!img) continue;

    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const canvas = new OffscreenCanvas(Math.max(1, Math.round(img.width * scale)), Math.max(1, Math.round(img.height * scale)));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img.bitmap, 0, 0, canvas.width, canvas.height);
    img.bitmap.close();
    const jpeg = new Uint8Array(await (await canvas.convertToBlob({ type: 'image/jpeg', quality })).arrayBuffer());
    if (jpeg.length >= stream.getContents().length * 0.9) continue; // No compensa.

    const dict = stream.dict.clone(doc.context);
    dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
    dict.set(PDFName.of('Width'), PDFNumber.of(canvas.width));
    dict.set(PDFName.of('Height'), PDFNumber.of(canvas.height));
    dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
    dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
    dict.set(PDFName.of('Length'), PDFNumber.of(jpeg.length));
    dict.delete(PDFName.of('DecodeParms'));
    doc.context.assign(ref, PDFRawStream.of(dict, jpeg));
    changed++;
  }
  return changed;
}

goBtn.addEventListener('click', async () => {
  if (!file) return;
  goBtn.disabled = true;
  const opts = LEVELS[level()];
  try {
    status.reset();
    let bytes = new Uint8Array(await file.arrayBuffer());
    let images = 0;

    if (opts) {
      status.set('Leyendo el PDF…');
      const lib = await import('pdf-lib');
      let doc;
      try {
        doc = await lib.PDFDocument.load(bytes, { updateMetadata: false });
      } catch (e) {
        if (/encrypt/i.test(e.message)) {
          status.html('Este PDF está protegido. Quítale la protección con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a> y vuelve a intentarlo.', 'error');
          return;
        }
        throw e;
      }
      images = await recompressImages(doc, lib, opts);
      if (images) bytes = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
    }

    // qpdf: comprime de nuevo cada stream y agrupa los objetos; quita lo que ya no se usa.
    status.set('Optimizando la estructura del PDF…');
    const run = await qpdf(['{in}', '--object-streams=generate', '--compress-streams=y', '--recompress-flate',
      '--compression-level=9', '--remove-unreferenced-resources=yes', '/out.pdf'], bytes);
    if (run.out && run.out.length < bytes.length) bytes = run.out;
    if (!run.out && /password/i.test(run.log)) {
      status.html('Este PDF está protegido. Quítale la protección con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a> y vuelve a intentarlo.', 'error');
      return;
    }

    const saved = 1 - bytes.length / file.size;
    if (saved <= 0.01) {
      status.set('Este PDF ya estaba muy optimizado: comprimirlo no reduce su peso. No hace falta descargar nada.', 'ok');
      return;
    }

    result = new Blob([bytes], { type: 'application/pdf' });
    $('#resultName').textContent = `${baseName()}-comprimido.pdf`;
    $('#resultMeta').innerHTML = `Antes <b>${formatSize(file.size)}</b> → después <b>${formatSize(result.size)}</b> · <span class="lab-file__delta">−${Math.round(saved * 100)} %</span>`;
    $('#result').style.setProperty('--saved', `${Math.round(saved * 100)}%`);
    $('#result').classList.add('is-smaller');
    $('#result').hidden = false;
    goBtn.hidden = true;
    downloadBtn.hidden = false;
    downloadBtn.focus();
    status.set(images ? `Listo: ${images} ${images === 1 ? 'imagen optimizada' : 'imágenes optimizadas'}.` : 'Listo.', 'ok');
  } catch (err) {
    status.error(err);
  } finally {
    goBtn.disabled = false;
  }
});

$('#levels').addEventListener('change', invalidate);
downloadBtn.addEventListener('click', () => result && downloadBlob(result, name.fileName(`${baseName()}-comprimido.pdf`)));
$('#change').addEventListener('click', () => {
  file = null;
  invalidate();
  $('#opts').hidden = true;
  $('#drop').hidden = false;
  status.set('El motor (~2 MB) se descarga cuando pulses Comprimir.');
});
bindDropzone($('#drop'), load);
