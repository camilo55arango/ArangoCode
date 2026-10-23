import '../shell.js';
import { $, bindDropzone, createStatus, formatSize } from '../ui.js';
import { FORMATS, decode, encode, formatOf, toImageData } from '../encode.js';
import { createBatch } from '../batch.js';

const status = createStatus($('#status'));
const batch = createBatch($('#batch'), { zipName: 'imagenes-comprimidas.zip' });
const quality = $('#quality');
const format = $('#format');
const maxSide = $('#maxSide');
const before = $('#before');
const after = $('#after');

let files = [];
let runId = 0;

const base = (file) => file.name.replace(/\.[^.]+$/, '') || 'imagen';

function setSrc(img, blob) {
  if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  img.src = URL.createObjectURL(blob);
}

function showPreview(file, blob) {
  setSrc(before, file);
  setSrc(after, blob);
  $('#beforeCap').textContent = `Original · ${formatSize(file.size)}`;
  $('#afterCap').textContent = `Comprimida · ${formatSize(blob.size)}`;
  $('#preview').hidden = false;
}

async function run() {
  if (!files.length) return;
  const id = ++runId;
  batch.reset();
  const side = Number(maxSide.value) || Infinity;
  let totalBefore = 0;
  let totalAfter = 0;
  try {
    for (const [i, file] of files.entries()) {
      status.set(files.length > 1 ? `Comprimiendo ${i + 1} de ${files.length}…` : 'Comprimiendo…');
      const inFormat = formatOf(file) ?? 'jpeg';
      const outFormat = format.value === 'same' ? inFormat : format.value;

      const bitmap = await decode(file);
      const data = toImageData(bitmap, { maxSide: side, background: outFormat === 'jpeg' ? '#ffffff' : undefined });
      const resized = data.width < bitmap.width;
      bitmap.close?.();
      let blob = await encode(data, outFormat, { quality: Number(quality.value) });
      if (id !== runId) return;

      // Si no cambia el formato ni el tamaño y el resultado pesa más, se queda el original.
      const kept = blob.size >= file.size && outFormat === inFormat && !resized;
      if (kept) blob = file;
      totalBefore += file.size;
      totalAfter += blob.size;
      batch.add({ name: `${base(file)}-comprimida.${FORMATS[outFormat].ext}`, before: file.size, blob, kept });
      if (i === 0) showPreview(file, blob);
    }
    const saved = Math.max(0, Math.round((1 - totalAfter / totalBefore) * 100));
    status.set(`Listo: ${formatSize(totalBefore)} → ${formatSize(totalAfter)} (${saved} % menos).`, 'ok');
  } catch (err) {
    if (id === runId) status.error(err);
  }
}

bindDropzone($('#drop'), (list) => { files = list; run(); }, { multiple: true });
quality.addEventListener('input', () => { $('#qualityOut').value = quality.value; });
for (const el of [quality, format, maxSide]) el.addEventListener('change', run);
