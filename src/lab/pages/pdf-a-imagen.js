import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, formatSize, nameField } from '../ui.js';
import { loadPdf } from '../pdf-docx.js';

const status = createStatus($('#status'));
const name = nameField();
const shots = $('#shots');
const goBtn = $('#go');

let file = null;
let doc = null;      // { pdf, task } de PDF.js
let outputs = [];    // { n, blob, name, url }
let runId = 0;

const baseName = () => (file?.name.replace(/\.pdf$/i, '') || 'documento');
const format = () => $('[name="format"]:checked').value;
const dpi = () => Number($('[name="dpi"]:checked').value);

/** "1-3, 5" → [1, 2, 3, 5] dentro de 1..total; vacío = todas. Devuelve null si hay algo inválido. */
function parsePages(text, total) {
  if (!text.trim()) return Array.from({ length: total }, (_, i) => i + 1);
  const out = new Set();
  for (const part of text.split(/[,;\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return null;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b > total || a > b) return null;
    for (let n = a; n <= b; n++) out.add(n);
  }
  return [...out].sort((x, y) => x - y);
}

function clearOutputs() {
  outputs.forEach((o) => URL.revokeObjectURL(o.url));
  outputs = [];
  shots.innerHTML = '';
  $('#zipRow').hidden = true;
}

function updateButton() {
  const pages = doc && parsePages($('#pagesInput').value, doc.pdf.numPages);
  goBtn.disabled = !pages;
  goBtn.textContent = !pages ? 'Revisa las páginas' : `Convertir ${pages.length} ${pages.length === 1 ? 'página' : 'páginas'}`;
}

async function load(f) {
  const id = ++runId;
  clearOutputs();
  await doc?.task.destroy();
  doc = null;
  file = f;
  try {
    status.reset();
    status.set('Abriendo el PDF…');
    const loaded = await loadPdf(new Uint8Array(await f.arrayBuffer()));
    if (id !== runId) return loaded.task.destroy();
    doc = loaded;
    $('#drop').hidden = true;
    $('#opts').hidden = false;
    $('#fileName').textContent = f.name;
    $('#fileInfo').textContent = `${doc.pdf.numPages} ${doc.pdf.numPages === 1 ? 'página' : 'páginas'} · ${formatSize(f.size)}`;
    name.suggest(`${baseName()}-imagenes.zip`);
    updateButton();
    status.set('Elige el formato y la calidad, y pulsa Convertir.');
  } catch (err) {
    if (/password/i.test(err?.name + err?.message)) {
      status.html('Este PDF pide contraseña. Quítasela con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a> y vuelve a intentarlo.', 'error');
    } else status.error(err);
  }
}

async function convert() {
  const pages = parsePages($('#pagesInput').value, doc.pdf.numPages);
  if (!pages) return;
  const id = ++runId;
  const fmt = format();
  const scale = dpi() / 72;
  const ext = fmt === 'png' ? 'png' : 'jpg';
  clearOutputs();
  goBtn.disabled = true;
  try {
    for (const [i, n] of pages.entries()) {
      status.set(`Convirtiendo página ${n} (${i + 1} de ${pages.length})…`);
      const page = await doc.pdf.getPage(n);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      await page.render({ canvas, viewport, background: '#ffffff' }).promise;
      page.cleanup();
      const blob = await new Promise((r) => canvas.toBlob(r, fmt === 'png' ? 'image/png' : 'image/jpeg', 0.9));
      canvas.width = canvas.height = 0;
      if (id !== runId) return;

      const out = { n, blob, name: `${baseName()}-pagina-${n}.${ext}`, url: URL.createObjectURL(blob) };
      outputs.push(out);
      shots.insertAdjacentHTML('beforeend', `
        <li class="lab-shot">
          <img src="${out.url}" alt="Página ${n}" loading="lazy" />
          <span class="lab-shot__meta">Página ${n} · ${formatSize(blob.size)}</span>
          <button class="btn btn--ghost btn--sm" type="button" data-n="${n}" aria-label="Descargar página ${n}">Descargar</button>
        </li>`);
    }
    $('#zipRow').hidden = outputs.length < 2;
    status.set(`Listo: ${outputs.length} ${outputs.length === 1 ? 'imagen' : 'imágenes'} en ${fmt.toUpperCase().replace('JPEG', 'JPG')}.`, 'ok');
    (outputs.length > 1 ? $('#zip') : shots.querySelector('button'))?.focus();
  } catch (err) {
    status.error(err);
  } finally {
    updateButton();
  }
}

shots.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-n]');
  const out = btn && outputs.find((o) => o.n === Number(btn.dataset.n));
  if (out) downloadBlob(out.blob, out.name);
});

$('#zip').addEventListener('click', async () => {
  const { zip } = await import('fflate');
  const files = {};
  for (const o of outputs) files[o.name] = [new Uint8Array(await o.blob.arrayBuffer()), { level: 0 }];
  zip(files, (err, data) => {
    if (err) status.error(err);
    else downloadBlob(new Blob([data], { type: 'application/zip' }), name.fileName(`${baseName()}-imagenes.zip`));
  });
});

goBtn.addEventListener('click', convert);
$('#pagesInput').addEventListener('input', updateButton);
$('#opts').addEventListener('change', (e) => { if (e.target.name) clearOutputs(); });
$('#change').addEventListener('click', async () => {
  runId++;
  clearOutputs();
  await doc?.task.destroy();
  doc = null;
  file = null;
  $('#opts').hidden = true;
  $('#drop').hidden = false;
  status.set('Elige otro PDF.');
});
bindDropzone($('#drop'), load);

// Al salir de la página se liberan las imágenes generadas.
addEventListener('pagehide', () => outputs.forEach((o) => URL.revokeObjectURL(o.url)));
