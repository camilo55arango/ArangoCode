import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, formatSize, nameField } from '../ui.js';
import { decode } from '../encode.js';
import { createOrderList } from '../order-list.js';

const status = createStatus($('#status'));
const makeBtn = $('#make');
const downloadBtn = $('#download');
const name = nameField();

/* Tamaños en puntos PDF (1/72 de pulgada), en vertical. */
const PAGE = { a4: [595.28, 841.89], letter: [612, 792] };
const HEIC = /\.(heic|heif)$/i;

let result = null;

function invalidate() {
  result = null;
  downloadBtn.hidden = true;
  makeBtn.hidden = false;
}

// Miniatura directa salvo HEIC, que el navegador no sabe mostrar.
const list = createOrderList($('#list'), {
  onChange: () => { invalidate(); update(); },
  thumb: (file) => (HEIC.test(file.name) ? '' : URL.createObjectURL(file))
});

const defaultName = () => `${(list.files[0]?.name.replace(/\.[^.]+$/, '') || 'imagenes')}.pdf`;

function update() {
  const n = list.size;
  $('#merge').hidden = !n;
  name.suggest(defaultName());
  $('#count').textContent = `${n} ${n === 1 ? 'imagen' : 'imágenes'} · orden de las páginas`;
  makeBtn.disabled = !n;
  makeBtn.textContent = n > 1 ? `Crear PDF con ${n} páginas` : 'Crear PDF';
}

/** Imagen lista para pdf-lib: JPEG para fotos y PNG si hay transparencia que conservar. */
async function prepare(file) {
  const bitmap = await decode(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  const keepAlpha = /png|webp|gif/i.test(file.type) && !HEIC.test(file.name);
  if (!keepAlpha) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await canvas.convertToBlob(keepAlpha ? { type: 'image/png' } : { type: 'image/jpeg', quality: 0.92 });
  return { bytes: new Uint8Array(await blob.arrayBuffer()), png: keepAlpha, width: canvas.width, height: canvas.height };
}

makeBtn.addEventListener('click', async () => {
  const files = list.files;
  if (!files.length) return;
  makeBtn.disabled = true;
  const size = $('#pageSize').value;
  const orientation = $('#orientation').value;
  const margin = Number($('#margin').value);
  try {
    status.reset();
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    doc.setCreator('ArangoCode · Imagen a PDF');

    for (const [i, file] of files.entries()) {
      status.set(`Añadiendo imagen ${i + 1} de ${files.length}…`);
      const img = await prepare(file);
      const embedded = img.png ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes);
      const landscape = img.width > img.height;

      let w;
      let h;
      if (size === 'fit') {
        // Una página del tamaño de la foto (a 96 ppp), más el margen.
        w = img.width * 0.75 + margin * 2;
        h = img.height * 0.75 + margin * 2;
      } else {
        [w, h] = PAGE[size];
        const wide = orientation === 'landscape' || (orientation === 'auto' && landscape);
        if (wide) [w, h] = [h, w];
      }

      const page = doc.addPage([w, h]);
      const scale = Math.min((w - margin * 2) / img.width, (h - margin * 2) / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      page.drawImage(embedded, { x: (w - dw) / 2, y: (h - dh) / 2, width: dw, height: dh });
    }

    const bytes = await doc.save();
    result = new Blob([bytes], { type: 'application/pdf' });
    makeBtn.hidden = true;
    downloadBtn.hidden = false;
    downloadBtn.focus();
    status.set(`Listo: PDF de ${files.length} ${files.length === 1 ? 'página' : 'páginas'} (${formatSize(result.size)}).`, 'ok');
  } catch (err) {
    status.error(err);
  } finally {
    makeBtn.disabled = !list.size;
  }
});

for (const id of ['#pageSize', '#orientation', '#margin']) $(id).addEventListener('change', invalidate);
downloadBtn.addEventListener('click', () => result && downloadBlob(result, name.fileName(defaultName())));
$('#clear').addEventListener('click', () => {
  list.clear();
  status.set('Elige una o varias imágenes para empezar.');
});
bindDropzone($('#drop'), (files) => {
  list.add(files);
  status.set('Ordénalas como quieras y pulsa Crear PDF.');
}, { multiple: true });
