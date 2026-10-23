import '../shell.js';
import { $, bindDropzone, createStatus } from '../ui.js';
import { FORMATS, decode, encode, toImageData } from '../encode.js';
import { createBatch } from '../batch.js';

const status = createStatus($('#status'));
const batch = createBatch($('#batch'), { zipName: 'imagenes-convertidas.zip' });
const quality = $('#quality');
const format = $('#format');

let files = [];
let runId = 0;

const base = (file) => file.name.replace(/\.[^.]+$/, '') || 'imagen';

function syncQuality() {
  $('#qualityField').hidden = !FORMATS[format.value].lossy;
}

async function run() {
  if (!files.length) return;
  const id = ++runId;
  const out = format.value;
  batch.reset();
  try {
    for (const [i, file] of files.entries()) {
      status.set(files.length > 1 ? `Convirtiendo ${i + 1} de ${files.length} a ${FORMATS[out].label}…` : `Convirtiendo a ${FORMATS[out].label}…`);
      const bitmap = await decode(file);
      // JPG no tiene transparencia: se rellena con blanco en vez de negro.
      const data = toImageData(bitmap, { background: out === 'jpeg' ? '#ffffff' : undefined });
      bitmap.close?.();
      const blob = await encode(data, out, { quality: Number(quality.value) });
      if (id !== runId) return;
      batch.add({ name: `${base(file)}.${FORMATS[out].ext}`, before: file.size, blob });
    }
    status.set(`Listo: ${files.length} ${files.length === 1 ? 'imagen convertida' : 'imágenes convertidas'} a ${FORMATS[out].label}.`, 'ok');
  } catch (err) {
    if (id === runId) status.error(err);
  }
}

syncQuality();
bindDropzone($('#drop'), (list) => { files = list; run(); }, { multiple: true });
quality.addEventListener('input', () => { $('#qualityOut').value = quality.value; });
quality.addEventListener('change', run);
format.addEventListener('change', () => { syncQuality(); run(); });
