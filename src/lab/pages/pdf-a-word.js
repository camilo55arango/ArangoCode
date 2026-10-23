import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, nameField, showDevice } from '../ui.js';
import { pdfToDocx } from '../pdf-docx.js';

// El OCR emite el progreso de descarga ya agregado.
const status = createStatus($('#status'), { mode: 'total' });
const textOut = $('#text');
const ocrCheck = $('#ocr');
const fileName = nameField();

let current = null;
let lastFile = null;
let ocr = null;
let runId = 0;

const mode = () => $('#modes input:checked').value;

async function getOcr() {
  if (ocr) return ocr;
  const { OCR } = await import('runonweb/ocr');
  ocr = new OCR({ onProgress: status.onProgress });
  status.set('Descargando el modelo de OCR (solo la primera vez)…');
  await ocr.load();
  showDevice($('#device'), ocr.device, { threads: false });
  return ocr;
}

async function run(file) {
  const id = ++runId;
  lastFile = file;
  $('#result').hidden = true;
  current = null;
  try {
    status.reset();
    status.set('Cargando el motor de PDF…');
    const useOcr = ocrCheck.checked && mode() === 'layout';
    const engine = useOcr ? await getOcr() : null;
    const result = await pdfToDocx(new Uint8Array(await file.arrayBuffer()), {
      mode: mode(),
      ocr: engine,
      onStep: (msg) => { if (id === runId) status.set(msg); },
      isCancelled: () => id !== runId
    });
    if (!result || id !== runId) return;

    const name = file.name.replace(/\.pdf$/i, '') || 'documento';
    current = { blob: result.blob, name: `${name}.docx` };
    fileName.suggest(current.name);
    textOut.value = result.preview.map((t, i) => `— Página ${i + 1} —\n\n${t}`).join('\n\n');
    const pages = `${result.pages} ${result.pages === 1 ? 'página' : 'páginas'}`;
    $('#summary').textContent = `${pages} · ${mode() === 'layout' ? 'diseño conservado' : 'solo texto'} · vista previa del texto`;
    $('#result').hidden = false;

    if (result.scanned && !result.ocrPages) {
      const which = result.scanned === result.pages ? 'El PDF es escaneado' : `${result.scanned} ${result.scanned === 1 ? 'página es escaneada' : 'páginas son escaneadas'}`;
      status.html(`Listo, pero ${which.charAt(0).toLowerCase() + which.slice(1)}: ${mode() === 'layout' ? 'en el Word se ve igual, pero como imagen' : 'no tiene texto'}. Activa <b>OCR</b> para poder editarlo.`, 'ok');
    } else if (result.ocrPages) {
      status.set(`Listo. Se reconoció el texto de ${result.ocrPages} ${result.ocrPages === 1 ? 'página escaneada' : 'páginas escaneadas'} con OCR.`, 'ok');
    } else {
      status.set('Listo. Descarga tu documento de Word.', 'ok');
    }
  } catch (err) {
    if (id !== runId) return;
    if (err?.name === 'PasswordException') {
      status.html('Este PDF tiene contraseña. Primero quítasela con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a>.', 'error');
    } else if (err?.name === 'InvalidPDFException') {
      status.set('El archivo no es un PDF válido o está dañado.', 'error');
    } else {
      status.error(err);
    }
  }
}

function syncOptions() {
  // El OCR coloca el texto sobre el diseño: solo tiene sentido en "Conservar diseño".
  const layout = mode() === 'layout';
  ocrCheck.disabled = !layout;
  $('#ocrField').classList.toggle('is-disabled', !layout);
}

syncOptions();
bindDropzone($('#drop'), run);
$('#modes').addEventListener('change', () => { syncOptions(); if (lastFile) run(lastFile); });
ocrCheck.addEventListener('change', () => { if (lastFile) run(lastFile); });
$('#download').addEventListener('click', () => current && downloadBlob(current.blob, fileName.fileName(current.name)));
