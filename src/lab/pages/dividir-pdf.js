import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, esc, formatSize, nameField } from '../ui.js';
import { loadPdf } from '../pdf-docx.js';
import { qpdfSession } from '../qpdf.js';

const status = createStatus($('#status'));
const preview = $('#preview');
const rangesList = $('#ranges');
const pagesInput = $('#pagesInput');
const mergeCheck = $('#merge');
const outList = $('#outList');
const zipBtn = $('#zip');
const name = nameField($('#split'));

const THUMB_WIDTH = 120;

const state = {
  file: null,
  bytes: null,
  doc: null,          // { task, pdf } de pdf.js, para las miniaturas
  pages: 0,
  mode: 'range',      // 'range' | 'pages'
  rangeMode: 'custom',// 'custom' | 'fixed'
  pagesMode: 'all',   // 'all' | 'select'
  ranges: [],
  every: 1,
  selected: new Set()
};
let outputs = [];
let loadId = 0;

const base = () => state.file?.name.replace(/\.pdf$/i, '') || 'documento';
const clampPage = (n) => Math.min(state.pages, Math.max(1, Math.round(Number(n) || 1)));
const span = (pages) => (pages.length === 1 ? `página ${pages[0]}` : `páginas ${pages[0]}–${pages.at(-1)}`);

/** [1,2,3,5,7,8] → "1-3,5,7-8" (el formato de rangos de qpdf). */
function toRanges(pages) {
  const parts = [];
  for (let i = 0; i < pages.length; i++) {
    let j = i;
    while (j + 1 < pages.length && pages[j + 1] === pages[j] + 1) j++;
    parts.push(i === j ? `${pages[i]}` : `${pages[i]}-${pages[j]}`);
    i = j;
  }
  return parts.join(',');
}

/** "1, 3, 5-8" → Set {1,3,5,6,7,8}, ignorando lo que no sea válido o esté fuera del documento. */
function parsePages(text) {
  const set = new Set();
  for (const part of text.split(/[,;\s]+/)) {
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    let a = Number(m[1]);
    let b = Number(m[2] ?? m[1]);
    if (a > b) [a, b] = [b, a];
    for (let n = Math.max(1, a); n <= Math.min(state.pages, b); n++) set.add(n);
  }
  return set;
}

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, k) => from + k);

/** Los archivos que se van a crear, cada uno con sus páginas en orden. */
function groups() {
  let list = [];
  if (state.mode === 'range' && state.rangeMode === 'custom') {
    list = state.ranges.map(({ from, to }) => range(Math.min(from, to), Math.max(from, to)));
  } else if (state.mode === 'range') {
    const k = Math.max(1, state.every);
    for (let p = 1; p <= state.pages; p += k) list.push(range(p, Math.min(state.pages, p + k - 1)));
  } else if (state.pagesMode === 'all') {
    list = range(1, state.pages).map((p) => [p]);
  } else {
    list = [...state.selected].sort((a, b) => a - b).map((p) => [p]);
  }
  list = list.filter((g) => g.length);
  return mergeCheck.checked && list.length > 1 ? [list.flat()] : list;
}

/** Nombre por defecto de cada archivo, según lo que contiene. */
function defaultNames(list) {
  if (mergeCheck.checked && list.length === 1 && state.mode === 'pages') return [`${base()}-extraido.pdf`];
  if (mergeCheck.checked && list.length === 1 && list[0].length !== state.pages) return [`${base()}-rangos.pdf`];
  return list.map((g) => {
    const contiguous = g.every((p, i) => i === 0 || p === g[i - 1] + 1);
    if (g.length === 1) return `${base()}-pagina-${g[0]}.pdf`;
    return contiguous ? `${base()}-paginas-${g[0]}-${g.at(-1)}.pdf` : `${base()}-parte.pdf`;
  });
}

/* --- Miniaturas: se dibujan solo cuando entran en pantalla, una a la vez --- */

const thumbs = new Map();   // página → URL de la imagen
let queue = Promise.resolve();

function renderThumb(n) {
  if (thumbs.has(n)) return Promise.resolve(thumbs.get(n));
  const { pdf } = state.doc;
  const job = queue.then(async () => {
    if (thumbs.has(n) || state.doc?.pdf !== pdf) return thumbs.get(n);
    const page = await pdf.getPage(n);
    const natural = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: THUMB_WIDTH * 2 / natural.width });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, viewport, background: '#ffffff' }).promise;
    page.cleanup();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
    const url = URL.createObjectURL(blob);
    thumbs.set(n, url);
    return url;
  });
  queue = job.catch(() => {});
  return job;
}

const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    observer.unobserve(e.target);
    const n = Number(e.target.dataset.page);
    renderThumb(n).then((url) => {
      const img = e.target.querySelector('img');
      if (url && img) { img.src = url; img.closest('.lab-thumb').classList.add('is-ready'); }
    }).catch(() => {});
  }
}, { rootMargin: '200px' });

function thumbMarkup(n, { selectable = false } = {}) {
  const selected = selectable && state.selected.has(n);
  const tag = selectable ? 'button' : 'figure';
  const attrs = selectable ? ` type="button" aria-pressed="${selected}" aria-label="Página ${n}${selected ? ', elegida' : ''}"` : '';
  return `<${tag} class="lab-thumb${selected ? ' is-selected' : ''}" data-page="${n}"${attrs}>
    <span class="lab-thumb__paper"><img alt="" /></span><span class="lab-thumb__num">${n}</span></${tag}>`;
}

/** Vista previa: cada archivo resultante es un recuadro; un rango largo muestra la primera y la última página. */
function renderPreview() {
  if (!state.pages) return;
  if (state.mode === 'pages' && state.pagesMode === 'select') {
    preview.innerHTML = `<div class="lab-group lab-group--pick"><span class="lab-group__label">Haz clic en las páginas que quieres extraer</span>
      <div class="lab-group__pages">${range(1, state.pages).map((n) => thumbMarkup(n, { selectable: true })).join('')}</div></div>`;
  } else {
    const list = groups();
    const names = defaultNames(list);
    preview.innerHTML = list.slice(0, 200).map((g, i) => {
      const contiguous = g.every((p, k) => k === 0 || p === g[k - 1] + 1);
      const shown = contiguous && g.length > 2 ? [g[0], null, g.at(-1)] : g.length > 8 ? [...g.slice(0, 3), null, ...g.slice(-2)] : g;
      return `<div class="lab-group">
        <span class="lab-group__label">${list.length > 1 ? `Archivo ${i + 1} · ` : ''}${esc(span(g))}${g.length > 2 ? ` (${g.length})` : ''}</span>
        <div class="lab-group__pages">${shown.map((n) => (n === null ? '<span class="lab-group__more" aria-hidden="true">…</span>' : thumbMarkup(n))).join('')}</div>
        <span class="sr-only">${esc(names[i])}</span>
      </div>`;
    }).join('') + (list.length > 200 ? `<p class="lab-hint">…y ${list.length - 200} archivos más.</p>` : '');
    if (!list.length) preview.innerHTML = '<p class="lab-hint">No hay páginas para dividir con estas opciones.</p>';
  }
  preview.querySelectorAll('.lab-thumb').forEach((el) => {
    const url = thumbs.get(Number(el.dataset.page));
    if (url) { el.querySelector('img').src = url; el.classList.add('is-ready'); } else observer.observe(el);
  });
  updateSummary();
}

function updateSummary() {
  const list = groups();
  const n = list.length;
  const btn = $('#splitBtn');
  btn.disabled = !n;
  btn.textContent = !n ? 'Elige qué páginas dividir' : n === 1 ? 'Crear 1 PDF' : `Dividir en ${n} PDF`;
  $('#fixedHint').textContent = `Se crearán ${Math.ceil(state.pages / Math.max(1, state.every))} PDF.`;
  $('#pagesHint').textContent = state.mode === 'pages'
    ? (state.pagesMode === 'all' ? `Se extraerán las ${state.pages} páginas` : `${state.selected.size} ${state.selected.size === 1 ? 'página elegida' : 'páginas elegidas'}`)
      + (mergeCheck.checked && n === 1 ? ', unidas en un solo PDF.' : ', cada una en su propio PDF.')
    : '';
  const names = defaultNames(list);
  name.suggest(n > 1 ? `${base()}-dividido.zip` : names[0] ?? `${base()}.pdf`);
}

function renderRanges(focus) {
  rangesList.innerHTML = state.ranges.map((r, i) => `
    <li class="lab-range-item" data-i="${i}">
      <span class="lab-range-item__label">Rango ${i + 1}</span>
      <label>de la página <input class="lab-input lab-input--num" type="number" data-field="from" min="1" max="${state.pages}" value="${r.from}" inputmode="numeric" /></label>
      <label>a <input class="lab-input lab-input--num" type="number" data-field="to" min="1" max="${state.pages}" value="${r.to}" inputmode="numeric" /></label>
      <button class="lab-range-item__remove" type="button" data-remove aria-label="Quitar rango ${i + 1}"${state.ranges.length === 1 ? ' disabled' : ''}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </li>`).join('');
  if (focus != null) rangesList.querySelector(`[data-i="${focus}"] input`)?.focus();
}

function syncPanels() {
  document.querySelectorAll('.lab-tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.mode === state.mode)));
  $('[data-panel="range"]').hidden = state.mode !== 'range';
  $('[data-panel="pages"]').hidden = state.mode !== 'pages';
  $('[data-sub="custom"]').hidden = state.rangeMode !== 'custom';
  $('[data-sub="fixed"]').hidden = state.rangeMode !== 'fixed';
  $('[data-sub="select"]').hidden = state.pagesMode !== 'select';
  $('#mergeLabel').textContent = state.mode === 'range' ? 'Unir todos los rangos en un único PDF' : 'Unir las páginas extraídas en un único PDF';
}

/** Cualquier cambio de opciones invalida los archivos ya creados. */
function changed() {
  outputs = [];
  $('#outputs').hidden = true;
  renderPreview();
}

async function open(file) {
  const id = ++loadId;
  try {
    status.reset();
    status.set('Leyendo el PDF…');
    const bytes = new Uint8Array(await file.arrayBuffer());
    // pdf.js se queda con su copia: qpdf necesita la suya intacta.
    const { task, pdf } = await loadPdf(bytes.slice());
    if (id !== loadId) { task.destroy(); return; }

    await state.doc?.task.destroy();
    for (const url of thumbs.values()) URL.revokeObjectURL(url);
    thumbs.clear();

    Object.assign(state, { file, bytes, doc: { task, pdf }, pages: pdf.numPages, ranges: [{ from: 1, to: pdf.numPages }], every: 1, selected: new Set() });
    $('#every').max = String(pdf.numPages);
    $('#every').value = '1';
    pagesInput.value = '';
    $('#fileName').textContent = file.name;
    $('#fileInfo').textContent = `${pdf.numPages} ${pdf.numPages === 1 ? 'página' : 'páginas'} · ${formatSize(file.size)}`;
    $('#drop').hidden = true;
    $('#split').hidden = false;
    renderRanges();
    syncPanels();
    changed();
    status.set(pdf.numPages === 1 ? 'Este PDF tiene una sola página: no hay nada que dividir.' : 'Elige cómo dividirlo y pulsa Dividir.');
  } catch (err) {
    if (id !== loadId) return;
    if (err?.name === 'PasswordException') {
      status.html('Este PDF tiene contraseña. Primero quítasela con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a>.', 'error');
    } else if (err?.name === 'InvalidPDFException') {
      status.set('El archivo no es un PDF válido o está dañado.', 'error');
    } else {
      status.error(err);
    }
  }
}

async function split() {
  const list = groups();
  if (!list.length) return;
  const names = defaultNames(list);
  const btn = $('#splitBtn');
  btn.disabled = true;
  try {
    status.reset();
    status.set('Cargando qpdf…');
    // Una sola instancia de qpdf para todos los archivos: el PDF se lee una vez.
    const session = await qpdfSession(state.bytes);
    outputs = [];
    for (const [i, pages] of list.entries()) {
      if (list.length > 1) status.set(`Creando PDF ${i + 1} de ${list.length}…`);
      const run = session.run(['--empty', '--pages', '{in}', toRanges(pages), '--', '/out.pdf']);
      if (!run.out) throw new Error(run.log || 'qpdf no pudo crear el archivo.');
      outputs.push({ pages, name: names[i], blob: new Blob([run.out], { type: 'application/pdf' }) });
      // Cede el turno al navegador para que la página no se congele con documentos grandes.
      if (i % 10 === 9) await new Promise((r) => setTimeout(r));
    }
    renderOutputs();
    const total = outputs.reduce((s, o) => s + o.blob.size, 0);
    status.set(outputs.length === 1 ? `Listo: 1 PDF (${formatSize(total)}).` : `Listo: ${outputs.length} PDF (${formatSize(total)} en total).`, 'ok');
  } catch (err) {
    status.error(err);
  } finally {
    btn.disabled = !groups().length;
  }
}

const outName = (o, i) => (outputs.length === 1 ? name.fileName(o.name) : name.fileName(o.name, i + 1));

function renderOutputs() {
  outList.innerHTML = outputs.map((o, i) => `
    <li class="lab-file is-smaller" style="--saved:100%">
      <span class="lab-file__name" title="${esc(o.name)}">${esc(o.name)}</span>
      <span class="lab-file__meta">${esc(span(o.pages))}${o.pages.length > 2 ? ` (${o.pages.length})` : ''} · <b>${formatSize(o.blob.size)}</b></span>
      <span class="lab-file__bar" aria-hidden="true"></span>
      <button class="btn btn--ghost btn--sm" type="button" data-download="${i}">Descargar</button>
    </li>`).join('');
  zipBtn.hidden = outputs.length < 2;
  $('#outputs').hidden = !outputs.length;
  (outputs.length > 1 ? zipBtn : outList.querySelector('button'))?.focus();
}

/* --- Eventos --- */

bindDropzone($('#drop'), open);
// Abre el mismo selector de la zona de carga (oculta mientras hay un PDF abierto); bindDropzone hace el resto.
$('#change').addEventListener('click', () => { $('#drop input').click(); });

document.querySelector('.lab-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('[data-mode]');
  if (!tab || tab.dataset.mode === state.mode) return;
  state.mode = tab.dataset.mode;
  syncPanels();
  changed();
});

document.querySelectorAll('input[name="rangeMode"]').forEach((r) => r.addEventListener('change', () => {
  state.rangeMode = r.value;
  syncPanels();
  changed();
}));
document.querySelectorAll('input[name="pagesMode"]').forEach((r) => r.addEventListener('change', () => {
  state.pagesMode = r.value;
  syncPanels();
  changed();
}));

rangesList.addEventListener('change', (e) => {
  const input = e.target.closest('input[data-field]');
  if (!input) return;
  const i = Number(input.closest('li').dataset.i);
  const value = clampPage(input.value);
  input.value = value;
  state.ranges[i][input.dataset.field] = value;
  changed();
});
rangesList.addEventListener('click', (e) => {
  if (!e.target.closest('[data-remove]')) return;
  const i = Number(e.target.closest('li').dataset.i);
  state.ranges.splice(i, 1);
  renderRanges(Math.max(0, i - 1));
  changed();
});
$('#addRange').addEventListener('click', () => {
  const last = state.ranges.at(-1);
  const from = last && last.to < state.pages ? last.to + 1 : 1;
  state.ranges.push({ from, to: state.pages });
  renderRanges(state.ranges.length - 1);
  changed();
});

$('#every').addEventListener('input', (e) => {
  state.every = Math.max(1, Math.min(state.pages, Math.round(Number(e.target.value) || 1)));
  changed();
});

pagesInput.addEventListener('input', () => {
  state.selected = parsePages(pagesInput.value);
  // Solo se actualizan las marcas: redibujar mientras se escribe movería el foco.
  preview.querySelectorAll('.lab-thumb[aria-pressed]').forEach((el) => {
    const on = state.selected.has(Number(el.dataset.page));
    el.classList.toggle('is-selected', on);
    el.setAttribute('aria-pressed', String(on));
  });
  outputs = [];
  $('#outputs').hidden = true;
  updateSummary();
});

preview.addEventListener('click', (e) => {
  const thumb = e.target.closest('.lab-thumb[aria-pressed]');
  if (!thumb) return;
  const n = Number(thumb.dataset.page);
  if (state.selected.has(n)) state.selected.delete(n); else state.selected.add(n);
  pagesInput.value = toRanges([...state.selected].sort((a, b) => a - b)).replaceAll(',', ', ');
  const on = state.selected.has(n);
  thumb.classList.toggle('is-selected', on);
  thumb.setAttribute('aria-pressed', String(on));
  thumb.setAttribute('aria-label', `Página ${n}${on ? ', elegida' : ''}`);
  outputs = [];
  $('#outputs').hidden = true;
  updateSummary();
});

mergeCheck.addEventListener('change', changed);
$('#splitBtn').addEventListener('click', split);

outList.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-download]');
  if (!btn) return;
  const i = Number(btn.dataset.download);
  downloadBlob(outputs[i].blob, outName(outputs[i], i));
});

zipBtn.addEventListener('click', async () => {
  const { zip } = await import('fflate');
  const files = {};
  for (const [i, o] of outputs.entries()) {
    // Dos rangos iguales darían el mismo nombre: se numeran para no pisarse dentro del ZIP.
    const wanted = outName(o, i);
    let entry = wanted;
    for (let n = 2; entry in files; n++) entry = wanted.replace(/\.pdf$/, `-${n}.pdf`);
    files[entry] = [new Uint8Array(await o.blob.arrayBuffer()), { level: 6 }];
  }
  zip(files, (err, data) => {
    if (!err) downloadBlob(new Blob([data], { type: 'application/zip' }), name.fileName(`${base()}-dividido.zip`));
  });
});
