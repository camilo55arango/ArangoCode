import { tool } from '../shell.js';
import { OCR, OCR_SIZES, DEFAULT_OCR_SIZE } from 'runonweb/ocr';
import { $, bindDropzone, copyText, createStatus, showDevice } from '../ui.js';
import { fileToCanvas } from '../image.js';

const status = createStatus($('#status'), { mode: 'total' });
const sizes = $('#sizes');
const result = $('#result');
const preview = $('#preview');
const textOut = $('#text');

let size = DEFAULT_OCR_SIZE;
let ocr = null;
let lastFile = null;
let runId = 0;

sizes.insertAdjacentHTML('beforeend', Object.entries(OCR_SIZES).map(([id, s]) => `
  <label class="lab-size">
    <input type="radio" name="size" value="${id}"${id === size ? ' checked' : ''} />
    <span>${s.label}<small>${s.downloadMB} · precisión ${s.recAcc}</small></span>
  </label>`).join(''));

sizes.addEventListener('change', (e) => {
  size = e.target.value;
  // Cada tamaño es otro par de modelos: liberamos el anterior antes de cargar el nuevo.
  const old = ocr;
  ocr = null;
  void old?.dispose();
  if (lastFile) run(lastFile);
});

async function run(file) {
  const id = ++runId;
  lastFile = file;
  try {
    const canvas = await fileToCanvas(file);
    ocr ??= new OCR({ size, onProgress: status.onProgress });
    const engine = ocr;
    status.reset();
    await engine.load();
    // runonweb/ocr fija numThreads = 1 en WASM.
    showDevice($('#device'), engine.device, { threads: false });

    status.set('Leyendo texto…');
    const t0 = performance.now();
    const { text, lines } = await engine.read(canvas);
    if (id !== runId) return;

    drawBoxes(canvas, lines);
    textOut.value = text;
    result.hidden = false;
    status.set(lines.length
      ? `${lines.length} líneas en ${Math.round(performance.now() - t0)} ms`
      : 'No se encontró texto en la imagen.', lines.length ? 'ok' : '');
  } catch (err) {
    if (id === runId) status.error(err);
  }
}

function drawBoxes(source, lines) {
  preview.width = source.width;
  preview.height = source.height;
  const ctx = preview.getContext('2d');
  ctx.drawImage(source, 0, 0);
  ctx.lineWidth = Math.max(2, source.width / 500);
  ctx.strokeStyle = tool.color;
  ctx.fillStyle = `${tool.color}22`;
  for (const { box } of lines) {
    const w = box.xmax - box.xmin;
    const h = box.ymax - box.ymin;
    ctx.fillRect(box.xmin, box.ymin, w, h);
    ctx.strokeRect(box.xmin, box.ymin, w, h);
  }
}

bindDropzone($('#drop'), run);
$('#copy').addEventListener('click', (e) => copyText(textOut.value, e.currentTarget));
