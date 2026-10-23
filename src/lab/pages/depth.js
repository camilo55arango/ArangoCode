import '../shell.js';
import { DepthEstimator } from 'runonweb/depth';
import { $, bindDropzone, createStatus, downloadBlob, nameField, outName, showDevice } from '../ui.js';
import { fileToCanvas } from '../image.js';

// Depth Anything V2 trabaja a 518 px; más resolución solo cuesta decodificar y copiar.
const MAX_SIDE = 2048;

const status = createStatus($('#status'));
const original = $('#original');
const output = $('#output');
const estimator = new DepthEstimator({ onProgress: status.onProgress });

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
    await estimator.load();
    showDevice($('#device'), estimator.device);

    status.set('Calculando profundidad…');
    const t0 = performance.now();
    const { depth } = await estimator.estimate(canvas);
    if (id !== runId) return;

    setSrc(output, depth);
    current = { png: depth, name: outName(file, 'profundidad') };
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
