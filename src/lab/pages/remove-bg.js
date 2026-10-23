import '../shell.js';
import { RemoveBackground } from 'runonweb/remove-bg';
import { $, bindDropzone, createStatus, downloadBlob, nameField, outName, showDevice } from '../ui.js';
import { fileToCanvas } from '../image.js';

// BEN2 trabaja a 1024 px; más resolución solo cuesta decodificar y copiar.
const MAX_SIDE = 2048;

const status = createStatus($('#status'));
const original = $('#original');
const output = $('#output');
const remover = new RemoveBackground({ onProgress: status.onProgress });
const name = nameField();

let current = null;
let runId = 0;

function setSrc(img, blob) {
  if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  img.src = URL.createObjectURL(blob);
}

async function run(file) {
  const id = ++runId;
  try {
    const canvas = await fileToCanvas(file, MAX_SIDE);
    setSrc(original, file);
    status.reset();
    await remover.load();
    showDevice($('#device'), remover.device);

    status.set('Quitando el fondo…');
    const t0 = performance.now();
    const png = await remover.remove(canvas);
    if (id !== runId) return;

    // remove() puede caer a WASM si el shader de WebGPU falla en tiempo de ejecución.
    showDevice($('#device'), remover.device);
    setSrc(output, png);
    current = { png, name: outName(file, 'sin-fondo') };
    name.suggest(current.name);
    $('#result').hidden = false;
    $('#actions').hidden = false;
    status.set(`Listo en ${Math.round(performance.now() - t0)} ms`, 'ok');
  } catch (err) {
    if (id === runId) status.error(err);
  }
}

bindDropzone($('#drop'), run);
$('#download').addEventListener('click', () => current && downloadBlob(current.png, name.fileName(current.name)));
