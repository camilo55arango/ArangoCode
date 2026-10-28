/* Lista de archivos reordenable (flechas, quitar y arrastrar), compartida por Unir PDF e Imagen a PDF. */

import { esc, formatSize } from './ui.js';

const ICON = {
  up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
  remove: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};

/**
 * `list` es el <ol>; `onChange` se llama tras cada cambio de orden o al quitar un archivo.
 * `thumb(file)` (opcional) devuelve la URL de una miniatura para mostrar junto al nombre.
 */
export function createOrderList(list, { onChange, thumb } = {}) {
  let items = [];
  let nextId = 0;

  function render(focus) {
    list.innerHTML = items.map(({ id, file, url }, i) => `
      <li class="lab-order__item" draggable="true" data-id="${id}">
        <span class="lab-order__grip" aria-hidden="true">⋮⋮</span>
        <span class="lab-order__num">${i + 1}</span>
        <span class="lab-order__name" title="${esc(file.name)}">${url ? `<img class="lab-order__thumb" src="${url}" alt="" />` : ''}${esc(file.name)}</span>
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

  const changed = (focus) => { render(focus); onChange?.(); };

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = Number(btn.closest('li').dataset.id);
    const i = items.findIndex((it) => it.id === id);
    const act = btn.dataset.act;
    if (act === 'remove') {
      if (items[i].url) URL.revokeObjectURL(items[i].url);
      items.splice(i, 1);
    } else {
      const j = act === 'up' ? i - 1 : i + 1;
      [items[i], items[j]] = [items[j], items[i]];
    }
    changed(act === 'remove' ? null : { id, act });
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
    const moved = order.some((id, i) => id !== items[i].id);
    items = order.map((id) => items.find((it) => it.id === id));
    if (moved) changed(); else render();
  });

  return {
    /** Archivos en el orden actual. */
    get files() { return items.map((it) => it.file); },
    get size() { return items.length; },
    add(files) {
      items.push(...files.map((file) => ({ id: ++nextId, file, url: thumb?.(file) })));
      changed();
    },
    clear() {
      items.forEach((it) => it.url && URL.revokeObjectURL(it.url));
      items = [];
      changed();
    }
  };
}
