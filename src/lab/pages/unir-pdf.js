import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, esc, formatSize } from '../ui.js';
import { qpdf } from '../qpdf.js';

const status = createStatus($('#status'));
const list = $('#list');
const joinBtn = $('#join');
const downloadBtn = $('#download');

/** Archivos en el orden en que irán en el PDF final. */
let items = [];
let nextId = 0;
let result = null;

const ICON = {
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
  remove: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};

/** Cualquier cambio en la lista invalida el PDF ya unido. */
function invalidate() {
  result = null;
  downloadBtn.hidden = true;
  joinBtn.hidden = false;
}

function render(focus) {
  $('#merge').hidden = !items.length;
  $('#count').textContent = `${items.length} ${items.length === 1 ? 'archivo' : 'archivos'} · orden final`;
  joinBtn.disabled = items.length < 2;
  joinBtn.textContent = items.length < 2 ? 'Añade al menos 2 PDF' : `Unir ${items.length} PDF`;

  list.innerHTML = items.map(({ id, file }, i) => `
    <li class="lab-order__item" draggable="true" data-id="${id}">
      <span class="lab-order__grip" aria-hidden="true">⋮⋮</span>
      <span class="lab-order__num">${i + 1}</span>
      <span class="lab-order__name" title="${esc(file.name)}">${esc(file.name)}</span>
      <span class="lab-order__size">${formatSize(file.size)}</span>
      <span class="lab-order__actions">
        <button type="button" data-act="up" aria-label="Subir ${esc(file.name)}"${i === 0 ? ' disabled' : ''}>${ICON.up}</button>
        <button type="button" data-act="down" aria-label="Bajar ${esc(file.name)}"${i === items.length - 1 ? ' disabled' : ''}>${ICON.down}</button>
        <button type="button" data-act="remove" aria-label="Quitar ${esc(file.name)}">${ICON.remove}</button>
      </span>
    </li>`).join('');

  // Tras mover con el teclado, el foco sigue al archivo que se movió.
  if (focus) {
    const btn = list.querySelector(`[data-id="${focus.id}"] [data-act="${focus.act}"]`);
    (btn && !btn.disabled ? btn : list.querySelector(`[data-id="${focus.id}"] button:not([disabled])`))?.focus();
  }
}

function add(files) {
  items.push(...files.map((file) => ({ id: ++nextId, file })));
  invalidate();
  render();
  status.set(items.length < 2 ? 'Añade al menos otro PDF para unirlos.' : 'Ordénalos como quieras y pulsa Unir.');
}

list.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = Number(btn.closest('li').dataset.id);
  const i = items.findIndex((it) => it.id === id);
  const act = btn.dataset.act;
  if (act === 'remove') items.splice(i, 1);
  else {
    const j = act === 'up' ? i - 1 : i + 1;
    [items[i], items[j]] = [items[j], items[i]];
  }
  invalidate();
  render(act === 'remove' ? null : { id, act });
});

/* Arrastrar y soltar: se mueve el nodo mientras se arrastra y al soltar se lee el orden del DOM. */
let dragging = null;
list.addEventListener('dragstart', (e) => {
  dragging = e.target.closest('li');
  if (!dragging) return;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragging.dataset.id);
  requestAnimationFrame(() => dragging?.classList.add('is-dragging'));
});
list.addEventListener('dragover', (e) => {
  if (!dragging) return;
  e.preventDefault();
  const over = e.target.closest('li');
  if (!over || over === dragging) return;
  const { top, height } = over.getBoundingClientRect();
  list.insertBefore(dragging, e.clientY < top + height / 2 ? over : over.nextSibling);
});
list.addEventListener('drop', (e) => { if (dragging) e.preventDefault(); });
list.addEventListener('dragend', () => {
  if (!dragging) return;
  dragging = null;
  const order = [...list.children].map((li) => Number(li.dataset.id));
  const changed = order.some((id, i) => id !== items[i].id);
  items = order.map((id) => items.find((it) => it.id === id));
  if (changed) invalidate();
  render();
});

joinBtn.addEventListener('click', async () => {
  if (items.length < 2) return;
  const snapshot = [...items];
  joinBtn.disabled = true;
  try {
    status.reset();
    status.set(`Uniendo ${snapshot.length} PDF…`);
    const inputs = await Promise.all(snapshot.map(async ({ file }) => new Uint8Array(await file.arrayBuffer())));
    // --empty: documento nuevo; --pages: todas las páginas (1-z) de cada archivo, en este orden.
    // El rango es obligatorio: sin él, qpdf lee el archivo siguiente como si fuera un rango.
    const pages = snapshot.flatMap((_, i) => [`{in${i}}`, '1-z']);
    const run = await qpdf(['--empty', '--pages', ...pages, '--', '/out.pdf'], inputs);

    if (!run.out) {
      const bad = Number(run.log.match(/\/in(\d+)\.pdf/)?.[1]);
      const name = esc(snapshot[bad]?.file.name ?? 'Uno de los archivos');
      if (/invalid password/i.test(run.log)) {
        status.html(`<b>${name}</b> tiene contraseña. Quítasela con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a> y vuelve a añadirlo.`, 'error');
      } else {
        status.html(`<b>${name}</b> no es un PDF válido o está dañado. Quítalo de la lista e inténtalo de nuevo.`, 'error');
      }
      return;
    }

    const first = snapshot[0].file.name.replace(/\.pdf$/i, '') || 'documento';
    result = { blob: new Blob([run.out], { type: 'application/pdf' }), name: `${first}-unido.pdf` };
    joinBtn.hidden = true;
    downloadBtn.hidden = false;
    downloadBtn.focus();
    status.set(`Listo: ${snapshot.length} PDF unidos en uno (${formatSize(result.blob.size)}).`, 'ok');
  } catch (err) {
    status.error(err);
  } finally {
    joinBtn.disabled = items.length < 2;
  }
});

downloadBtn.addEventListener('click', () => result && downloadBlob(result.blob, result.name));
$('#clear').addEventListener('click', () => {
  items = [];
  invalidate();
  render();
  status.set('Elige al menos dos PDF para unirlos.');
});
bindDropzone($('#drop'), add, { multiple: true });
