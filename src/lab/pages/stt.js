import { tool } from '../shell.js';
import { SpeechToText } from 'runonweb/stt';
import { $, bindDropzone, confirmDownload, copyText, createStatus, esc, isDownloaded, markDownloaded, showDevice } from '../ui.js';

// runonweb usa whisper-tiny.en (solo inglés). El multilingüe pesa lo mismo y entiende español.
const MODEL = 'onnx-community/whisper-tiny';

const status = createStatus($('#status'));
const lang = $('#lang');
const recordBtn = $('#record');
const player = $('#player');
const textOut = $('#text');
const segmentsOut = $('#segments');
// Whisper tiny genera token a token y cada paso en WebGPU tiene un coste fijo: medido en Chrome,
// 14 s de audio tardan ~26 s en WebGPU fp32 y ~2,2 s en WASM q8 multihilo (que además descarga
// ~44 MB en vez de ~154 MB). Con aislamiento hay hilos garantizados, así que vamos directo a WASM.
const DEVICE = globalThis.crossOriginIsolated ? 'wasm' : 'auto';

const stt = new SpeechToText({ model: MODEL, device: DEVICE, onProgress: status.onProgress });

let runId = 0;
let recorder = null;

const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

async function run(blob) {
  const id = ++runId;
  if (player.src.startsWith('blob:')) URL.revokeObjectURL(player.src);
  player.src = URL.createObjectURL(blob);
  player.hidden = false;

  try {
    status.reset();
    if (!(await confirmDownload({ key: tool.slug, size: tool.size, name: tool.name }))) { status.set('Descarga cancelada. Vuelve a soltar o grabar el audio cuando quieras.'); return; }
    await stt.load();
    markDownloaded(tool.slug);
    showDevice($('#device'), stt.device);

    status.set('Transcribiendo…');
    textOut.value = '';
    segmentsOut.innerHTML = '';
    $('#result').hidden = false;
    const t0 = performance.now();
    const { text, chunks } = await stt.transcribe(blob, {
      language: lang.value || undefined,
      timestamps: 'segment',
      onPartial: (partial) => { if (id === runId) textOut.value = partial; }
    });
    if (id !== runId) return;

    textOut.value = text;
    segmentsOut.innerHTML = chunks.map((c) => `<li><time>${clock(c.start)}</time><span>${esc(c.text)}</span></li>`).join('');
    status.set(text ? `Listo en ${((performance.now() - t0) / 1000).toFixed(1)} s` : 'No se detectó voz en el audio.', text ? 'ok' : '');
  } catch (err) {
    if (id === runId) status.error(err);
  }
}

async function toggleRecording() {
  if (recorder?.state === 'recording') {
    recorder.stop();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const parts = [];
    recorder = new MediaRecorder(stream);
    recorder.addEventListener('dataavailable', (e) => parts.push(e.data));
    recorder.addEventListener('stop', () => {
      stream.getTracks().forEach((t) => t.stop());
      recordBtn.textContent = '● Grabar';
      recordBtn.classList.replace('btn--rec', 'btn--tool');
      run(new Blob(parts, { type: recorder.mimeType }));
    });
    recorder.start();
    recordBtn.textContent = '■ Detener';
    recordBtn.classList.replace('btn--tool', 'btn--rec');
    status.set('Grabando… pulsa Detener cuando termines.');
    // Si el modelo ya se descargó antes, se va cargando mientras la persona habla; si no, se pregunta al terminar.
    if (isDownloaded(tool.slug)) stt.load().then(() => showDevice($('#device'), stt.device)).catch(() => {});
  } catch (err) {
    status.error(new Error('No se pudo acceder al micrófono. Revisa los permisos del navegador.'));
  }
}

bindDropzone($('#drop'), run);
recordBtn.addEventListener('click', toggleRecording);
$('#copy').addEventListener('click', (e) => copyText(textOut.value, e.currentTarget));
