/*
 * Editor de PDF en el navegador, compartido por Editar PDF y Firmar PDF.
 *
 * - PDF.js dibuja cada página (sin rotar) en un canvas; encima, una capa con lo que añade la persona.
 * - Todo se guarda en puntos PDF con origen arriba a la izquierda de la página sin rotar, así que la
 *   misma anotación sirve para la vista (× escala) y para pdf-lib al guardar (y = alto − y).
 * - Las páginas giradas se muestran rotando la hoja con CSS. Texto, imágenes y firmas guardan `rot`
 *   (el giro de la página al crearlos) y se contra-rotan para verse derechos.
 * - Al guardar, pdf-lib escribe sobre el PDF original: el texto sigue siendo texto y los formularios siguen vivos.
 */

import { $, esc, formatSize } from './ui.js';
import { loadPdf } from './pdf-docx.js';

const FONT_CSS = { sans: 'Helvetica, Arial, sans-serif', serif: '"Times New Roman", Times, serif', mono: '"Courier New", Courier, monospace' };
// Posición de la línea base dentro de una línea de 1.2 em, por familia (medido con las fuentes del sistema).
const BASELINE = { sans: 0.95, serif: 0.94, mono: 0.87 };
const LINE = 1.2;
const HIGHLIGHT = '#ffe066';

const HINTS = {
  select: 'Haz clic en algo que añadiste para moverlo, cambiar su tamaño o borrarlo. Doble clic en un texto para editarlo.',
  text: 'Haz clic donde quieras escribir.',
  date: 'Haz clic donde quieras poner la fecha de hoy.',
  highlight: 'Arrastra sobre lo que quieres resaltar.',
  whiteout: 'Arrastra sobre lo que quieres tapar con blanco. Luego puedes escribir encima.',
  rect: 'Arrastra para dibujar un recuadro.',
  ink: 'Dibuja a mano alzada con el mouse o con el dedo.',
  image: 'Elige una imagen; aparecerá en la página para que la coloques.',
  sign: 'Crea tu firma; aparecerá en la página para que la coloques.'
};

const uid = () => Math.random().toString(36).slice(2, 10);
const clone = (s) => structuredClone(s);
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** Gira el vector (x, y) `deg` grados en sentido horario (como CSS rotate en pantalla). */
function rotate([x, y], deg) {
  const r = (deg * Math.PI) / 180;
  const c = Math.round(Math.cos(r));
  const s = Math.round(Math.sin(r));
  return [x * c - y * s, x * s + y * c];
}

export function createEditor({ status, name, onLoaded }) {
  const root = $('#editor');
  const pagesEl = $('#pages');
  const hint = $('#hint');
  const undoBtn = $('#undo');
  const redoBtn = $('#redo');

  let file = null;
  let bytes = null;
  let pdf = null;           // documento de PDF.js
  let task = null;
  let info = [];            // por página original: { view: [x0, y0, x1, y1], w, h, rotate }
  const canvases = new Map(); // página original → { canvas, scale }
  const images = new Map();   // id → { bytes, url, ratio }
  let form = null;            // { fields: [{ name, kind, options }], values: {} }

  let state = { pages: [], annots: [] };
  let past = [];
  let future = [];
  let tool = 'select';
  let selected = null;
  let editing = null;
  let scale = 1;
  let focusPage = 0; // índice (en state.pages) de la última página tocada

  const props = {
    get color() { return $('#color').value; },
    get size() { return Number($('#fontSize').value); },
    get font() { return $('#fontFamily').value; },
    get bold() { return $('#bold').getAttribute('aria-pressed') === 'true'; },
    get stroke() { return Number($('#stroke').value); }
  };

  /* ---------- Historial ---------- */
  function commit() {
    past.push(clone(state));
    if (past.length > 100) past.shift();
    future = [];
    syncHistory();
  }
  function syncHistory() {
    undoBtn.disabled = !past.length;
    redoBtn.disabled = !future.length;
  }
  function undo() {
    if (!past.length) return;
    finishEditing();
    future.push(clone(state));
    state = past.pop();
    selected = null;
    syncHistory();
    renderPages();
  }
  function redo() {
    if (!future.length) return;
    finishEditing();
    past.push(clone(state));
    state = future.pop();
    selected = null;
    syncHistory();
    renderPages();
  }

  /* ---------- Carga ---------- */
  async function open(f) {
    await close();
    file = f;
    status.reset();
    status.set('Abriendo el PDF…');
    bytes = new Uint8Array(await f.arrayBuffer());
    try {
      ({ pdf, task } = await loadPdf(bytes.slice()));
    } catch (err) {
      if (/password/i.test(`${err?.name} ${err?.message}`)) {
        status.html('Este PDF pide contraseña. Quítasela con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a> y vuelve a intentarlo.', 'error');
        return false;
      }
      throw err;
    }
    info = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const [x0, y0, x1, y1] = page.view;
      info.push({ view: page.view, w: x1 - x0, h: y1 - y0, rotate: page.rotate });
    }
    state = { pages: info.map((_, i) => ({ src: i, rot: 0 })), annots: [] };
    past = [];
    future = [];
    selected = null;
    syncHistory();

    $('#fileName').textContent = f.name;
    $('#fileInfo').textContent = `· ${pdf.numPages} ${pdf.numPages === 1 ? 'página' : 'páginas'} · ${formatSize(f.size)}`;
    name.suggest(`${f.name.replace(/\.pdf$/i, '')}-${root.dataset.suffix || 'editado'}.pdf`);
    root.hidden = false;
    renderPages();
    await loadForm();
    status.set('Listo para editar. Cuando termines, pulsa Guardar PDF.');
    onLoaded?.();
    return true;
  }

  async function close() {
    finishEditing();
    canvases.clear();
    images.forEach((im) => URL.revokeObjectURL(im.url));
    images.clear();
    await task?.destroy();
    pdf = null;
    task = null;
    form = null;
    $('#formPanel').hidden = true;
    pagesEl.innerHTML = '';
  }

  /* ---------- Formularios (pdf-lib) ---------- */
  async function loadForm() {
    try {
      const lib = await import('pdf-lib');
      const doc = await lib.PDFDocument.load(bytes, { updateMetadata: false });
      const fields = doc.getForm().getFields().map((f) => {
        const n = f.getName();
        if (f instanceof lib.PDFTextField) return { name: n, kind: 'text', value: f.getText() ?? '', multiline: f.isMultiline() };
        if (f instanceof lib.PDFCheckBox) return { name: n, kind: 'check', value: f.isChecked() };
        if (f instanceof lib.PDFDropdown) return { name: n, kind: 'select', options: f.getOptions(), value: f.getSelected()[0] ?? '' };
        if (f instanceof lib.PDFRadioGroup) return { name: n, kind: 'select', options: f.getOptions(), value: f.getSelected() ?? '' };
        return null;
      }).filter(Boolean);
      if (!fields.length) return;
      form = { fields, values: Object.fromEntries(fields.map((f) => [f.name, f.value])) };
      renderForm();
    } catch (e) {
      // PDF cifrado o raro: se edita igual, solo que sin panel de formulario.
    }
  }

  function renderForm() {
    const label = (n) => esc(n.replace(/[._\[\]]+/g, ' ').replace(/\s+/g, ' ').trim());
    $('#formFields').innerHTML = form.fields.map((f, i) => {
      const id = `ff-${i}`;
      if (f.kind === 'check') return `<label class="lab-check"><input type="checkbox" id="${id}" data-field="${esc(f.name)}"${f.value ? ' checked' : ''} /><span>${label(f.name)}</span></label>`;
      if (f.kind === 'select') return `<label class="lab-field lab-field--block">${label(f.name)}<select class="lab-select" id="${id}" data-field="${esc(f.name)}"><option value=""></option>${f.options.map((o) => `<option${o === f.value ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
      return `<label class="lab-field lab-field--block">${label(f.name)}${f.multiline
        ? `<textarea class="lab-textarea lab-textarea--sm" id="${id}" data-field="${esc(f.name)}" rows="3">${esc(f.value)}</textarea>`
        : `<input class="lab-input" type="text" id="${id}" data-field="${esc(f.name)}" value="${esc(f.value)}" />`}</label>`;
    }).join('');
    $('#formPanel').hidden = false;
  }

  $('#formFields').addEventListener('input', (e) => {
    const el = e.target.closest('[data-field]');
    if (el && form) form.values[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value;
  });
  $('#formFields').addEventListener('change', (e) => {
    const el = e.target.closest('[data-field]');
    if (el && form) form.values[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value;
  });

  /* ---------- Dibujo de páginas ---------- */
  const totalRot = (p) => (info[p.src].rotate + p.rot) % 360;

  function computeScale() {
    const avail = Math.max(240, pagesEl.clientWidth - 8);
    const widest = Math.max(...state.pages.map((p) => (totalRot(p) % 180 ? info[p.src].h : info[p.src].w)), 1);
    return Math.min(1.6, avail / widest);
  }

  async function paint(src) {
    const cached = canvases.get(src);
    if (cached && cached.scale === scale) return cached.canvas;
    const page = await pdf.getPage(src + 1);
    const dpr = Math.min(2, devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: scale * dpr, rotation: 0 });
    const canvas = cached?.canvas ?? document.createElement('canvas');
    canvas.className = 'pe-canvas';
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    await page.render({ canvas, viewport, background: '#ffffff' }).promise;
    canvases.set(src, { canvas, scale });
    return canvas;
  }

  const ICON = {
    left: '<path d="M9 5H4v5"/><path d="M4 10a8 8 0 1 1 2 6"/>',
    right: '<path d="M15 5h5v5"/><path d="M20 10a8 8 0 1 0-2 6"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    remove: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
  };
  const pageBtn = (act, label, i, disabled) => `<button type="button" class="pe-icon pe-icon--sm" data-page-act="${act}" data-i="${i}" title="${label}"${disabled ? ' disabled' : ''}><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[act]}</svg><span class="sr-only">${label} (página ${i + 1})</span></button>`;

  async function renderPages() {
    if (!pdf) return;
    scale = computeScale();
    const keep = pagesEl.scrollTop;
    pagesEl.innerHTML = state.pages.map((p, i) => {
      const { w, h } = info[p.src];
      const r = totalRot(p);
      const [fw, fh] = r % 180 ? [h, w] : [w, h];
      return `<section class="pe-page" data-i="${i}" aria-label="Página ${i + 1}">
        <header class="pe-page__bar">
          <span class="pe-page__num">Página ${i + 1}</span>
          ${pageBtn('left', 'Girar a la izquierda', i)}${pageBtn('right', 'Girar a la derecha', i)}
          ${pageBtn('up', 'Subir página', i, i === 0)}${pageBtn('down', 'Bajar página', i, i === state.pages.length - 1)}
          ${pageBtn('remove', 'Eliminar página', i, state.pages.length === 1)}
        </header>
        <div class="pe-frame" style="width:${fw * scale}px;height:${fh * scale}px">
          <div class="pe-sheet" data-src="${p.src}" style="width:${w * scale}px;height:${h * scale}px;transform:translate(-50%,-50%) rotate(${r}deg)">
            <div class="pe-layer" data-i="${i}"></div>
          </div>
        </div>
      </section>`;
    }).join('');
    pagesEl.scrollTop = keep;
    state.pages.forEach((p, i) => renderLayer(i));
    for (const sheet of pagesEl.querySelectorAll('.pe-sheet')) {
      const canvas = await paint(Number(sheet.dataset.src));
      if (sheet.isConnected) sheet.prepend(canvas);
    }
  }

  function annotMarkup(a) {
    const s = scale;
    const sel = a.id === selected ? ' is-selected' : '';
    const box = `left:${a.x * s}px;top:${a.y * s}px;width:${a.w * s}px;height:${a.h * s}px`;
    const turn = a.rot ? `;transform:rotate(${-a.rot}deg)` : '';
    const controls = `<button type="button" class="pe-a__del" data-del aria-label="Borrar">×</button><span class="pe-a__resize" data-resize aria-hidden="true"></span>`;
    if (a.type === 'text') {
      const style = `left:${a.x * s}px;top:${a.y * s}px${turn};font:${a.bold ? 700 : 400} ${a.size * s}px/${LINE} ${FONT_CSS[a.font]};color:${a.color}`;
      return `<div class="pe-a pe-a--text${sel}" data-id="${a.id}" style="${style}"><span class="pe-a__text">${esc(a.text)}</span>${controls}</div>`;
    }
    if (a.type === 'image') {
      return `<div class="pe-a pe-a--image${sel}" data-id="${a.id}" style="${box}${turn}"><img src="${images.get(a.img)?.url ?? ''}" alt="" draggable="false" />${controls}</div>`;
    }
    if (a.type === 'ink') {
      const d = a.points.map(([x, y], k) => `${k ? 'L' : 'M'}${(x * a.w * s).toFixed(1)} ${(y * a.h * s).toFixed(1)}`).join(' ');
      return `<div class="pe-a pe-a--ink${sel}" data-id="${a.id}" style="${box}"><svg width="100%" height="100%" overflow="visible"><path d="${d}" fill="none" stroke="${a.color}" stroke-width="${a.stroke * s}" stroke-linecap="round" stroke-linejoin="round"/></svg>${controls}</div>`;
    }
    const fill = a.type === 'whiteout' ? 'background:#fff' : a.type === 'highlight' ? `background:${HIGHLIGHT};opacity:.45;mix-blend-mode:multiply` : `border:${a.stroke * s}px solid ${a.color}`;
    return `<div class="pe-a pe-a--${a.type}${sel}" data-id="${a.id}" style="${box};${fill}">${controls}</div>`;
  }

  function renderLayer(i) {
    const layer = pagesEl.querySelector(`.pe-layer[data-i="${i}"]`);
    if (!layer) return;
    const src = state.pages[i].src;
    layer.innerHTML = state.annots.filter((a) => a.src === src).map(annotMarkup).join('');
    // Los textos miden su caja real para poder seleccionarlos y moverlos.
    layer.querySelectorAll('.pe-a--text').forEach((el) => {
      const a = byId(el.dataset.id);
      if (a) { a.w = el.offsetWidth / scale; a.h = el.offsetHeight / scale; }
    });
  }

  const byId = (id) => state.annots.find((a) => a.id === id);
  const pageIndexOf = (src) => state.pages.findIndex((p) => p.src === src);
  const refresh = (a) => renderLayer(pageIndexOf(a.src));

  /* ---------- Coordenadas ---------- */
  /** De un punto de pantalla a puntos PDF en la página sin rotar (origen arriba a la izquierda). */
  function toLocal(sheet, clientX, clientY) {
    const frame = sheet.parentElement.getBoundingClientRect();
    const r = totalRot(state.pages[pageIndexOf(Number(sheet.dataset.src))]);
    const [x, y] = rotate([clientX - (frame.left + frame.width / 2), clientY - (frame.top + frame.height / 2)], -r);
    return [(x + sheet.offsetWidth / 2) / scale, (y + sheet.offsetHeight / 2) / scale];
  }
  /** Un desplazamiento en pantalla, expresado en puntos de la página sin rotar. */
  const deltaLocal = (src, dx, dy) => rotate([dx, dy], -totalRot(state.pages[pageIndexOf(src)])).map((v) => v / scale);

  /* ---------- Herramientas ---------- */
  function setTool(t) {
    finishEditing();
    if (t === 'image') { $('#imageInput').click(); return; }
    if (t === 'sign') { openSignature(); return; }
    tool = t;
    root.dataset.tool = t;
    root.querySelectorAll('.pe-tool').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === t)));
    hint.textContent = HINTS[t] ?? '';
    if (t !== 'select') select(null);
    syncProps();
  }

  /** La barra muestra las opciones de la herramienta activa o, al mover, las de lo seleccionado. */
  function syncProps() {
    const a = tool === 'select' && selected && byId(selected);
    const kind = a ? a.type : tool;
    root.querySelectorAll('.pe-prop').forEach((p) => { p.hidden = !p.dataset.for.split(' ').includes(kind); });
    if (!a) return;
    if (a.color) $('#color').value = a.color;
    if (a.size) $('#fontSize').value = String(a.size);
    if (a.font) $('#fontFamily').value = a.font;
    if (a.stroke) $('#stroke').value = String(a.stroke);
    if ('bold' in a) $('#bold').setAttribute('aria-pressed', String(a.bold));
  }

  function select(id) {
    if (selected === id) return;
    const prev = selected && byId(selected);
    selected = id;
    if (prev) refresh(prev);
    const a = id && byId(id);
    if (a) refresh(a);
    syncProps();
  }

  function add(a) {
    commit();
    state.annots.push(a);
    refresh(a);
  }

  function removeAnnot(id) {
    const a = byId(id);
    if (!a) return;
    commit();
    state.annots = state.annots.filter((x) => x.id !== id);
    if (selected === id) selected = null;
    refresh(a);
  }

  /** Coloca una imagen (o firma) centrada en la última página tocada y la deja seleccionada. */
  function placeImage(img, { width = 0.35 } = {}) {
    const i = Math.max(0, Math.min(focusPage, state.pages.length - 1));
    const p = state.pages[i];
    const { w, h } = info[p.src];
    const r = totalRot(p);
    const [vw] = r % 180 ? [h, w] : [w, h];
    const aw = vw * width;
    const ah = aw / img.ratio;
    // El centro visible de la hoja es el centro de la página sin rotar; la esquina "de arriba a la izquierda"
    // que ve la persona se calcula girando el medio tamaño.
    const [ox, oy] = rotate([-aw / 2, -ah / 2], -r);
    setTool('select');
    const a = { id: uid(), src: p.src, type: 'image', img: img.id, x: w / 2 + ox, y: h / 2 + oy, w: aw, h: ah, rot: r };
    add(a);
    select(a.id);
    pagesEl.querySelector(`.pe-page[data-i="${i}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  async function addImageFile(fileOrBlob) {
    const bitmap = await createImageBitmap(fileOrBlob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    canvas.getContext('2d').drawImage(bitmap, 0, 0);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    const id = uid();
    images.set(id, { bytes: new Uint8Array(await blob.arrayBuffer()), url: URL.createObjectURL(blob), ratio: bitmap.width / bitmap.height });
    bitmap.close();
    return { id, ratio: images.get(id).ratio };
  }

  /* ---------- Texto ---------- */
  function startEditing(a, el) {
    editing = a.id;
    const span = el.querySelector('.pe-a__text');
    span.contentEditable = 'plaintext-only';
    if (span.contentEditable !== 'plaintext-only') span.contentEditable = 'true';
    span.spellcheck = true;
    el.classList.add('is-editing');
    span.focus();
    const range = document.createRange();
    range.selectNodeContents(span);
    range.collapse(false);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    span.addEventListener('blur', () => finishEditing(), { once: true });
    a._before = a.text;
  }

  function finishEditing() {
    if (!editing) return;
    const a = byId(editing);
    const el = pagesEl.querySelector(`[data-id="${editing}"] .pe-a__text`);
    editing = null;
    if (!a) return;
    const text = (el?.innerText ?? a.text).replace(/\n$/, '');
    const before = a._before;
    delete a._before;
    if (!text.trim()) {
      // Texto vacío: se descarta sin dejar rastro en el historial si acababa de crearse.
      state.annots = state.annots.filter((x) => x.id !== a.id);
      if (before === '') past.pop();
      if (selected === a.id) selected = null;
      syncHistory();
    } else if (text !== before) {
      if (before !== '') { const snap = clone(state); snap.annots.find((x) => x.id === a.id).text = before; past.push(snap); future = []; syncHistory(); }
      a.text = text;
    }
    refresh(a);
  }

  /* ---------- Puntero ---------- */
  let gesture = null;

  pagesEl.addEventListener('pointerdown', (e) => {
    const sheet = e.target.closest('.pe-sheet');
    if (!sheet || e.button > 0) return;
    const i = Number(sheet.querySelector('.pe-layer').dataset.i);
    focusPage = i;
    const src = Number(sheet.dataset.src);
    const annotEl = e.target.closest('.pe-a');

    if (e.target.closest('[data-del]')) { e.preventDefault(); removeAnnot(annotEl.dataset.id); return; }
    if (annotEl && annotEl.dataset.id === editing) return; // Escribiendo: el clic mueve el cursor.

    if (annotEl && (tool === 'select' || e.target.closest('[data-resize]'))) {
      finishEditing();
      const a = byId(annotEl.dataset.id);
      select(a.id);
      e.preventDefault();
      pagesEl.setPointerCapture(e.pointerId);
      gesture = { kind: e.target.closest('[data-resize]') ? 'resize' : 'move', a, start: [e.clientX, e.clientY], orig: { x: a.x, y: a.y, w: a.w, h: a.h, size: a.size }, moved: false };
      return;
    }

    finishEditing();
    const [x, y] = toLocal(sheet, e.clientX, e.clientY);

    if (tool === 'select') { select(null); return; }
    e.preventDefault();

    if (tool === 'text' || tool === 'date') {
      const r = totalRot(state.pages[i]);
      const text = tool === 'date' ? new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
      // El clic queda a media altura de la primera línea, tal como la ve la persona.
      const [ox, oy] = rotate([0, -(props.size * LINE) / 2], -r);
      const a = { id: uid(), src, type: 'text', x: x + ox, y: y + oy, w: 0, h: 0, rot: r, text, color: props.color, size: props.size, font: props.font, bold: props.bold };
      add(a);
      if (tool === 'date') { setTool('select'); select(a.id); return; }
      // En el mismo evento: si el foco llegara un fotograma tarde, las primeras teclas irían a otro campo.
      const el = pagesEl.querySelector(`[data-id="${a.id}"]`);
      if (el) startEditing(a, el);
      return;
    }

    pagesEl.setPointerCapture(e.pointerId);
    if (tool === 'ink') {
      gesture = { kind: 'ink', sheet, src, points: [[x, y]] };
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('pe-draft-ink');
      svg.innerHTML = `<path fill="none" stroke="${props.color}" stroke-width="${props.stroke * scale}" stroke-linecap="round" stroke-linejoin="round"/>`;
      sheet.querySelector('.pe-layer').append(svg);
      gesture.svg = svg;
    } else {
      const draft = document.createElement('div');
      draft.className = `pe-draft pe-a--${tool}`;
      sheet.querySelector('.pe-layer').append(draft);
      gesture = { kind: 'box', sheet, src, start: [x, y], end: [x, y], draft };
    }
  });

  pagesEl.addEventListener('pointermove', (e) => {
    if (!gesture) return;
    if (gesture.kind === 'move' || gesture.kind === 'resize') {
      const { a, orig, start } = gesture;
      const dx = e.clientX - start[0];
      const dy = e.clientY - start[1];
      if (!gesture.moved && Math.hypot(dx, dy) < 3) return;
      if (!gesture.moved) { commit(); gesture.moved = true; }
      if (gesture.kind === 'move') {
        const [lx, ly] = deltaLocal(a.src, dx, dy);
        a.x = orig.x + lx;
        a.y = orig.y + ly;
      } else if (a.type === 'text') {
        // En texto, estirar cambia el tamaño de letra.
        a.size = Math.max(6, Math.round(orig.size * Math.max(0.2, 1 + dx / (Math.max(orig.w, 10) * scale))));
      } else {
        // Los elementos contra-rotados se estiran en el sentido que ve la persona.
        const [ddx, ddy] = a.rot ? [dx / scale, dy / scale] : deltaLocal(a.src, dx, dy);
        a.w = Math.max(8, orig.w + ddx);
        a.h = a.type === 'image' ? a.w * (orig.h / orig.w) : Math.max(4, orig.h + ddy);
      }
      refresh(a);
      return;
    }
    const [x, y] = toLocal(gesture.sheet, e.clientX, e.clientY);
    if (gesture.kind === 'ink') {
      gesture.points.push([x, y]);
      gesture.svg.firstChild.setAttribute('d', gesture.points.map(([px, py], k) => `${k ? 'L' : 'M'}${px * scale} ${py * scale}`).join(' '));
    } else {
      gesture.end = [x, y];
      const [x0, y0] = gesture.start;
      Object.assign(gesture.draft.style, {
        left: `${Math.min(x0, x) * scale}px`, top: `${Math.min(y0, y) * scale}px`,
        width: `${Math.abs(x - x0) * scale}px`, height: `${Math.abs(y - y0) * scale}px`
      });
    }
  });

  function endGesture() {
    if (!gesture) return;
    const g = gesture;
    gesture = null;
    if (g.kind === 'ink') {
      g.svg.remove();
      const pts = g.points;
      if (pts.length < 2) return;
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      const w = Math.max(1, Math.max(...xs) - x);
      const h = Math.max(1, Math.max(...ys) - y);
      add({ id: uid(), src: g.src, type: 'ink', x, y, w, h, color: props.color, stroke: props.stroke, points: pts.map(([px, py]) => [(px - x) / w, (py - y) / h]) });
    } else if (g.kind === 'box') {
      g.draft.remove();
      const [x0, y0] = g.start;
      const [x1, y1] = g.end;
      const w = Math.abs(x1 - x0);
      const h = Math.abs(y1 - y0);
      if (w < 3 || h < 3) return;
      add({ id: uid(), src: g.src, type: tool, x: Math.min(x0, x1), y: Math.min(y0, y1), w, h, color: props.color, stroke: props.stroke });
    }
  }
  pagesEl.addEventListener('pointerup', endGesture);
  pagesEl.addEventListener('pointercancel', endGesture);

  pagesEl.addEventListener('dblclick', (e) => {
    const el = e.target.closest('.pe-a--text');
    if (!el) return;
    setTool('select');
    const a = byId(el.dataset.id);
    select(a.id);
    startEditing(a, pagesEl.querySelector(`[data-id="${a.id}"]`));
  });

  /* ---------- Acciones de página ---------- */
  pagesEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page-act]');
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const act = btn.dataset.pageAct;
    commit();
    if (act === 'left' || act === 'right') state.pages[i].rot = (state.pages[i].rot + (act === 'right' ? 90 : 270)) % 360;
    else if (act === 'remove') {
      const src = state.pages[i].src;
      state.pages.splice(i, 1);
      state.annots = state.annots.filter((a) => a.src !== src);
    } else {
      const j = act === 'up' ? i - 1 : i + 1;
      [state.pages[i], state.pages[j]] = [state.pages[j], state.pages[i]];
    }
    selected = null;
    renderPages().then(() => pagesEl.querySelector(`[data-page-act="${act}"][data-i="${act === 'up' ? i - 1 : act === 'down' ? i + 1 : i}"]`)?.focus());
  });

  /* ---------- Barra ---------- */
  root.querySelector('.pe-bar').addEventListener('click', (e) => {
    const b = e.target.closest('.pe-tool');
    if (b) setTool(b.dataset.tool);
  });
  $('#bold').addEventListener('click', () => {
    const on = !props.bold;
    $('#bold').setAttribute('aria-pressed', String(on));
    applyProp({ bold: on });
  });
  $('#color').addEventListener('input', () => applyProp({ color: props.color }, true));
  $('#fontSize').addEventListener('change', () => applyProp({ size: props.size }));
  $('#fontFamily').addEventListener('change', () => applyProp({ font: props.font }));
  $('#stroke').addEventListener('change', () => applyProp({ stroke: props.stroke }));

  /** Los cambios en la barra también se aplican a lo seleccionado. */
  let colorTimer = 0;
  function applyProp(change, debounce) {
    const a = selected && byId(selected);
    if (!a || a.type === 'image' || a.type === 'whiteout' || a.type === 'highlight') return;
    if (debounce) { clearTimeout(colorTimer); if (!colorTimer) commit(); colorTimer = setTimeout(() => { colorTimer = 0; }, 600); }
    else commit();
    Object.assign(a, Object.fromEntries(Object.entries(change).filter(([k]) => k in a)));
    refresh(a);
  }

  undoBtn.addEventListener('click', undo);
  redoBtn.addEventListener('click', redo);
  $('#imageInput').addEventListener('change', async () => {
    const f = $('#imageInput').files[0];
    $('#imageInput').value = '';
    if (!f) return;
    try { placeImage(await addImageFile(f)); } catch (err) { status.error(new Error('No se pudo abrir esa imagen.')); }
  });

  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    const typing = editing || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && !typing && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
    else if (mod && !typing && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
    else if (!typing && selected && (e.key === 'Delete' || e.key === 'Backspace')) { e.preventDefault(); removeAnnot(selected); }
    else if (e.key === 'Escape') { if (editing) finishEditing(); else select(null); }
  });

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (pdf && Math.abs(computeScale() - scale) > 0.02) renderPages(); }, 150);
  }).observe(pagesEl);

  /* ---------- Firma ---------- */
  const dialog = $('#signDialog');
  const pad = $('#signPad');
  let signMode = 'draw';
  let padStrokes = [];
  let signUpload = null;

  function drawPad() {
    const ctx = pad.getContext('2d');
    ctx.clearRect(0, 0, pad.width, pad.height);
    ctx.strokeStyle = $('#signColor').value;
    ctx.lineWidth = 3.2;
    ctx.lineCap = ctx.lineJoin = 'round';
    for (const s of padStrokes) {
      ctx.beginPath();
      s.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      if (s.length === 1) ctx.lineTo(s[0][0] + 0.1, s[0][1]);
      ctx.stroke();
    }
  }
  const padPoint = (e) => {
    const r = pad.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * pad.width, ((e.clientY - r.top) / r.height) * pad.height];
  };
  pad.addEventListener('pointerdown', (e) => { pad.setPointerCapture(e.pointerId); padStrokes.push([padPoint(e)]); drawPad(); });
  pad.addEventListener('pointermove', (e) => { if (pad.hasPointerCapture(e.pointerId)) { padStrokes.at(-1).push(padPoint(e)); drawPad(); } });
  $('#padClear').addEventListener('click', () => { padStrokes = []; drawPad(); });
  $('#signColor').addEventListener('input', drawPad);

  dialog.querySelectorAll('[data-sign]').forEach((tab) => tab.addEventListener('click', () => {
    signMode = tab.dataset.sign;
    dialog.querySelectorAll('[data-sign]').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    dialog.querySelectorAll('[data-sign-panel]').forEach((p) => { p.hidden = p.dataset.signPanel !== signMode; });
    if (signMode === 'type') $('#signText').focus();
  }));
  $('#signFile').addEventListener('change', () => {
    signUpload = $('#signFile').files[0] ?? null;
    signBitmap?.close();
    signBitmap = null;
    $('#signFile').closest('.lab-drop').querySelector('strong').textContent = signUpload ? signUpload.name : 'Sube una foto de tu firma';
    previewSignature();
  });
  $('#signClean').addEventListener('input', previewSignature);
  $('#signKeep').addEventListener('change', previewSignature);
  $('#signColor').addEventListener('input', previewSignature);

  function openSignature() {
    padStrokes = [];
    drawPad();
    dialog.showModal();
  }

  /** Recorta el lienzo a lo dibujado, con un pequeño margen. */
  function trim(canvas) {
    const ctx = canvas.getContext('2d');
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let x0 = width, y0 = height, x1 = -1, y1 = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
    }
    if (x1 < 0) return null;
    const m = 6;
    const out = document.createElement('canvas');
    out.width = x1 - x0 + 1 + m * 2;
    out.height = y1 - y0 + 1 + m * 2;
    out.getContext('2d').drawImage(canvas, x0 - m, y0 - m, out.width, out.height, 0, 0, out.width, out.height);
    return out;
  }

  async function signatureCanvas() {
    const color = $('#signColor').value;
    if (signMode === 'draw') return padStrokes.length ? trim(pad) : null;
    if (signMode === 'type') {
      const text = $('#signText').value.trim();
      if (!text) return null;
      await document.fonts.load('700 120px Caveat');
      const c = document.createElement('canvas');
      const font = '700 120px Caveat, cursive';
      const measure = c.getContext('2d');
      measure.font = font;
      c.width = Math.ceil(measure.measureText(text).width) + 40;
      c.height = 220;
      const ctx = c.getContext('2d');
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 20, 115);
      return trim(c);
    }
    if (!signUpload) return null;
    return trim(await cleanSignature());
  }

  /**
   * Foto de una firma en papel → trazo con fondo transparente.
   * El papel casi nunca es blanco puro (sombras, luz amarilla, hoja gris), así que en vez de un umbral fijo
   * se estima el tono del papel en cada zona (la foto reducida y desenfocada) y cada píxel se compara con
   * su propio fondo: lo que se parece al papel se vuelve transparente, aunque haya sombras o degradados.
   */
  let signBitmap = null;
  async function cleanSignature() {
    if (!signBitmap) signBitmap = await createImageBitmap(signUpload);
    const k = Math.min(1, 1200 / signBitmap.width);
    const w = Math.round(signBitmap.width * k);
    const h = Math.round(signBitmap.height * k);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(signBitmap, 0, 0, w, h);

    // Fondo estimado: la foto muy reducida (los trazos finos casi desaparecen) y vuelta a ampliar.
    const small = document.createElement('canvas');
    small.width = Math.max(2, Math.round(w / 40));
    small.height = Math.max(2, Math.round(h / 40));
    small.getContext('2d').drawImage(c, 0, 0, small.width, small.height);
    const bg = document.createElement('canvas');
    bg.width = w;
    bg.height = h;
    const bctx = bg.getContext('2d', { willReadFrequently: true });
    bctx.imageSmoothingQuality = 'high';
    bctx.filter = 'blur(6px)';
    bctx.drawImage(small, 0, 0, w, h);
    const back = bctx.getImageData(0, 0, w, h).data;

    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const lum = (a, i) => 0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2];
    // Limpieza 0–100: cuanto más alta, más gris claro se considera papel.
    const strength = Number($('#signClean').value) / 100;
    const hi = 0.95 - strength * 0.3;  // por encima de esto (relativo al papel) es fondo
    const lo = hi - 0.28;              // por debajo es tinta llena
    const keep = $('#signKeep').checked;
    const [r, g, b] = hexToRgb($('#signColor').value).map((v) => v * 255);
    for (let i = 0; i < d.length; i += 4) {
      const ratio = lum(d, i) / Math.max(24, lum(back, i));
      const alpha = Math.max(0, Math.min(1, (hi - ratio) / (hi - lo)));
      if (!keep) { d[i] = r; d[i + 1] = g; d[i + 2] = b; }
      d[i + 3] = Math.round(alpha * d[i + 3]);
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  /** Muestra en el diálogo cómo quedará la firma subida. */
  let previewTimer = 0;
  function previewSignature() {
    clearTimeout(previewTimer);
    if (!signUpload) return;
    previewTimer = setTimeout(async () => {
      const out = trim(await cleanSignature());
      const view = $('#signPreview');
      view.hidden = !out;
      $('#signTweak').hidden = false;
      if (!out) return;
      view.width = out.width;
      view.height = out.height;
      view.getContext('2d').drawImage(out, 0, 0);
    }, 60);
  }

  $('#signUse').addEventListener('click', async () => {
    const canvas = await signatureCanvas();
    if (!canvas) {
      hint.textContent = signMode === 'draw' ? 'Dibuja tu firma antes de usarla.' : signMode === 'type' ? 'Escribe tu nombre antes de usarlo.' : 'Sube una imagen antes de usarla.';
      return;
    }
    dialog.close();
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    placeImage(await addImageFile(blob), { width: 0.3 });
    hint.textContent = 'Arrastra la firma a su sitio y usa la esquina para cambiar su tamaño.';
  });

  /* ---------- Guardar ---------- */
  async function save() {
    finishEditing();
    const lib = await import('pdf-lib');
    const { PDFDocument, StandardFonts, rgb, degrees, BlendMode, LineCapStyle } = lib;
    let doc;
    try {
      doc = await PDFDocument.load(bytes, { updateMetadata: false });
    } catch (e) {
      if (/encrypt/i.test(e.message)) {
        doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
      } else throw e;
    }

    if (form) {
      const f = doc.getForm();
      for (const field of form.fields) {
        const v = form.values[field.name];
        try {
          const target = f.getField(field.name);
          if (target instanceof lib.PDFTextField) target.setText(String(v ?? ''));
          else if (target instanceof lib.PDFCheckBox) (v ? target.check() : target.uncheck());
          else if ((target instanceof lib.PDFDropdown || target instanceof lib.PDFRadioGroup) && v) target.select(v);
        } catch (e) { /* campo con caracteres que la fuente del formulario no admite: se deja como estaba */ }
      }
    }

    const FONTS = {
      sans: [StandardFonts.Helvetica, StandardFonts.HelveticaBold],
      serif: [StandardFonts.TimesRoman, StandardFonts.TimesRomanBold],
      mono: [StandardFonts.Courier, StandardFonts.CourierBold]
    };
    const fontCache = new Map();
    const fontFor = async (family, bold) => {
      const key = FONTS[family][bold ? 1 : 0];
      if (!fontCache.has(key)) fontCache.set(key, await doc.embedFont(key));
      return fontCache.get(key);
    };
    // Las fuentes estándar del PDF solo tienen el alfabeto latino básico: lo demás se cambia por "?".
    const safe = (font, text) => [...text].map((ch) => { try { font.encodeText(ch); return ch; } catch (e) { return '?'; } }).join('');
    const imageCache = new Map();

    const pages = doc.getPages();
    for (const a of state.annots) {
      const page = pages[a.src];
      const [vx0, , , vy1] = info[a.src].view;
      const X = (x) => vx0 + x;
      const Y = (y) => vy1 - y;
      const color = rgb(...hexToRgb(a.color ?? '#000000'));
      const t = (a.rot ?? 0) * (Math.PI / 180);
      const sin = Math.sin(t);
      const cos = Math.cos(t);

      if (a.type === 'whiteout') page.drawRectangle({ x: X(a.x), y: Y(a.y + a.h), width: a.w, height: a.h, color: rgb(1, 1, 1) });
      else if (a.type === 'highlight') page.drawRectangle({ x: X(a.x), y: Y(a.y + a.h), width: a.w, height: a.h, color: rgb(...hexToRgb(HIGHLIGHT)), opacity: 0.45, blendMode: BlendMode.Multiply });
      else if (a.type === 'rect') page.drawRectangle({ x: X(a.x), y: Y(a.y + a.h), width: a.w, height: a.h, borderColor: color, borderWidth: a.stroke });
      else if (a.type === 'ink') {
        const d = a.points.map(([px, py], k) => `${k ? 'L' : 'M'}${(px * a.w).toFixed(2)} ${(py * a.h).toFixed(2)}`).join(' ');
        page.drawSvgPath(d, { x: X(a.x), y: Y(a.y), borderColor: color, borderWidth: a.stroke, borderLineCap: LineCapStyle.Round });
      } else if (a.type === 'image') {
        if (!imageCache.has(a.img)) imageCache.set(a.img, await doc.embedPng(images.get(a.img).bytes));
        // (x, y) es la esquina superior izquierda que ve la persona; pdf-lib gira desde la inferior izquierda.
        page.drawImage(imageCache.get(a.img), { x: X(a.x) + a.h * sin, y: Y(a.y) - a.h * cos, width: a.w, height: a.h, rotate: degrees(a.rot ?? 0) });
      } else if (a.type === 'text') {
        const font = await fontFor(a.font, a.bold);
        const lineH = a.size * LINE;
        a.text.split('\n').forEach((line, k) => {
          const d = k * lineH + a.size * BASELINE[a.font];
          page.drawText(safe(font, line), { x: X(a.x) + d * sin, y: Y(a.y) - d * cos, size: a.size, font, color, rotate: degrees(a.rot ?? 0) });
        });
      }
    }

    // Giros, orden y páginas eliminadas.
    state.pages.forEach((p) => {
      if (p.rot) pages[p.src].setRotation(degrees((info[p.src].rotate + p.rot) % 360));
    });
    const reordered = state.pages.length !== pages.length || state.pages.some((p, i) => p.src !== i);
    if (reordered) {
      for (let i = doc.getPageCount() - 1; i >= 0; i--) doc.removePage(i);
      state.pages.forEach((p) => doc.addPage(pages[p.src]));
    }

    return new Blob([await doc.save()], { type: 'application/pdf' });
  }

  setTool('select');
  return { open, close, save, setTool, get file() { return file; } };
}
