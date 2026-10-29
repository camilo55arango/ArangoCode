/* Buscador "¿Qué quieres hacer?": herramientas propias primero, luego directorios y prompts. */

import { READY_TOOLS } from '../../../src/lab/tools.js';
import { DEV_TOOLS, AI_TOOLS, PROMPTS } from '../data.js';
import { esc, normalize, KIND_LABEL, promptUrl } from '../cards.js';

const $ = (sel) => document.querySelector(sel);

const INDEX = [
  ...READY_TOOLS.map((t) => ({
    name: t.name, sub: `Estudio · ${t.desc}`, url: `/estudio/${t.slug}`, color: t.color, boost: 2,
    text: normalize(`${t.name} ${t.task} ${t.desc} ${t.keywords ?? ''}`)
  })),
  ...[['dev', DEV_TOOLS], ['ia', AI_TOOLS]].flatMap(([kind, list]) => list.map((it) => ({
    name: it.name, sub: `${KIND_LABEL[kind]} · ${it.cat}`, url: it.url, external: true, boost: 0,
    text: normalize(`${it.name} ${it.cat} ${it.desc}`)
  }))),
  ...PROMPTS.map((p) => ({
    name: p.name, sub: `Prompt · ${p.cat}`, url: promptUrl(p.name), boost: 0,
    text: normalize(`${p.name} ${p.cat} ${p.desc}`)
  }))
];

/* Cada palabra de la búsqueda debe aparecer; las herramientas propias y los aciertos en el nombre van primero. */
function search(query) {
  const words = normalize(query).split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  return INDEX
    .filter((it) => words.every((w) => it.text.includes(w)))
    .map((it) => ({ it, score: it.boost + words.filter((w) => normalize(it.name).includes(w)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ it }) => it);
}

export function initFinder({ onPickFile } = {}) {
  const dialog = $('#finder');
  const input = $('#finderInput');
  const results = $('#finderResults');
  let matches = [];
  let active = -1;
  let lastFocus = null;

  function render() {
    matches = search(input.value);
    active = matches.length ? 0 : -1;
    const typed = input.value.trim().length > 1;
    input.setAttribute('aria-expanded', String(typed));
    results.innerHTML = !typed ? '' : matches.length
      ? matches.map((m, i) => `
        <li role="option" id="finder-${i}" aria-selected="${i === active}" class="finder__item${i === active ? ' is-active' : ''}" data-i="${i}"${m.color ? ` style="--tool:${m.color}"` : ''}>
          <strong>${esc(m.name)}${m.external ? ' <span class="finder__ext">↗</span>' : ''}</strong>
          <span>${esc(m.sub)}</span>
        </li>`).join('')
      : `<li class="finder__empty">No encontré nada para «${esc(input.value)}». <a href="/contacto/">Sugiéreme la herramienta</a>.</li>`;
    input.setAttribute('aria-activedescendant', active >= 0 ? `finder-${active}` : '');
  }

  function setActive(i) {
    active = i;
    results.querySelectorAll('.finder__item').forEach((el, idx) => {
      el.classList.toggle('is-active', idx === i);
      el.setAttribute('aria-selected', String(idx === i));
      if (idx === i) el.scrollIntoView({ block: 'nearest' });
    });
    input.setAttribute('aria-activedescendant', `finder-${i}`);
  }

  function choose(i) {
    const m = matches[i];
    if (!m) return;
    if (m.external) window.open(m.url, '_blank', 'noopener,noreferrer');
    else location.href = m.url;
  }

  const open = () => {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    input.focus();
    input.select();
  };
  const close = () => {
    dialog.hidden = true;
    lastFocus?.focus();
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && matches.length) { e.preventDefault(); setActive(Math.min(active + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp' && matches.length) { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
  });
  results.addEventListener('click', (e) => {
    const item = e.target.closest('[data-i]');
    if (item) choose(Number(item.dataset.i));
  });
  dialog.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  $('#pickFile').addEventListener('click', () => { close(); onPickFile?.(); });
  $('#searchOpen').addEventListener('click', open);
  // Desde otras páginas, el post-it "Buscar" trae aquí con #buscar.
  if (location.hash === '#buscar') {
    history.replaceState(null, '', location.pathname + location.search);
    open();
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (dialog.hidden) open(); else close(); }
    else if (e.key === 'Escape' && !dialog.hidden) close();
  });
}
