/* Portada: soltar un archivo y elegir herramienta, buscador "¿Qué quieres hacer?" e indicador sin conexión. */

import { READY_TOOLS } from '../../src/lab/tools.js';
import { saveHandoff, HANDOFF_PARAM } from '../../src/lab/handoff.js';
import { DEV_TOOLS, AI_TOOLS, PROMPTS } from './data.js';
import { esc, normalize, KIND_LABEL, promptUrl } from './cards.js';

const $ = (sel) => document.querySelector(sel);

/* --- Tema, año, guardados y foto --- */
$('#themeToggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ac-theme', next); } catch (e) { /* modo privado */ }
});
$('#year').textContent = new Date().getFullYear();

try {
  const saved = JSON.parse(localStorage.getItem('ac-favorites') || '[]').length;
  const count = $('#favoritesCount');
  count.textContent = saved;
  count.hidden = !saved;
} catch (e) { /* storage no disponible */ }

const avatar = $('.avatar');
const avatarImg = $('#avatarImg');
avatarImg.addEventListener('error', () => avatar.classList.add('is-fallback'));
if (avatarImg.complete && avatarImg.naturalWidth === 0) avatar.classList.add('is-fallback');

/* --- Suelta cualquier archivo --- */
const zone = $('#dropZone');
const input = $('#dropInput');
const result = $('#dropResult');
const actions = $('#dropActions');

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|bmp|heic|heif)$/i;
const AUDIO_EXT = /\.(mp3|wav|m4a|ogg|opus|flac|aac|mp4|mov|webm|mkv)$/i;

function kindOf(file) {
  const type = file.type || '';
  if (type === 'application/pdf' || /\.pdf$/i.test(file.name)) return 'pdf';
  if (type.startsWith('image/') || IMAGE_EXT.test(file.name)) return 'image';
  if (type.startsWith('audio/') || type.startsWith('video/') || AUDIO_EXT.test(file.name)) return 'audio';
  return null;
}

const KIND_NAME = { pdf: 'PDF', image: 'Imagen', audio: 'Audio o video' };

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
};

let current = null;
let thumbUrl = '';

function showFile(file) {
  const kind = kindOf(file);
  current = file;
  if (thumbUrl) URL.revokeObjectURL(thumbUrl);
  thumbUrl = '';

  const thumb = $('#dropThumb');
  if (kind === 'image' && !/\.hei[cf]$/i.test(file.name)) {
    thumbUrl = URL.createObjectURL(file);
    thumb.innerHTML = `<img src="${thumbUrl}" alt="" />`;
  } else {
    thumb.textContent = kind === 'pdf' ? 'PDF' : kind === 'audio' ? '♪' : '?';
  }
  $('#dropName').textContent = file.name || 'Archivo pegado';
  $('#dropInfo').textContent = `${KIND_NAME[kind] ?? 'Formato no reconocido'} · ${formatSize(file.size)}`;

  const tools = kind ? READY_TOOLS.filter((t) => t.accepts?.includes(kind)) : [];
  $('#dropAsk').textContent = tools.length
    ? '¿Qué quieres hacer con él?'
    : 'Por ahora no hay herramientas para este tipo de archivo. Prueba con un PDF, una imagen o un audio.';
  actions.innerHTML = tools.map((t, i) => `
    <button class="drop-action" type="button" data-slug="${t.slug}" style="--tool:${t.color};--i:${i}">
      <strong>${esc(t.name)}</strong>
      <span>${esc(t.desc)}</span>
    </button>`).join('');

  zone.hidden = true;
  result.hidden = false;
  actions.querySelector('button')?.focus({ preventScroll: true });
}

function reset() {
  current = null;
  if (thumbUrl) URL.revokeObjectURL(thumbUrl);
  thumbUrl = '';
  result.hidden = true;
  zone.hidden = false;
  input.value = '';
}

async function goTo(slug) {
  const url = `/estudio/${slug}`;
  try {
    await saveHandoff(current);
    location.href = `${url}?${HANDOFF_PARAM}=portada`;
  } catch (e) {
    location.href = url; // Sin IndexedDB: la herramienta abre vacía y la persona elige el archivo allí.
  }
}

input.addEventListener('change', () => { if (input.files[0]) showFile(input.files[0]); });
zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-over'); });
zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
zone.addEventListener('drop', (e) => {
  e.preventDefault();
  zone.classList.remove('is-over');
  if (e.dataTransfer.files[0]) showFile(e.dataTransfer.files[0]);
});
// Soltar en cualquier parte de la página también sirve, y evita que el navegador abra el archivo.
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer?.files[0] && !zone.contains(e.target)) showFile(e.dataTransfer.files[0]);
});
document.addEventListener('paste', (e) => {
  if (e.target.closest?.('input, textarea')) return;
  const file = [...(e.clipboardData?.items ?? [])].find((i) => i.kind === 'file')?.getAsFile();
  if (file) showFile(file);
});
$('#dropReset').addEventListener('click', reset);
actions.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-slug]');
  if (btn && current) goTo(btn.dataset.slug);
});

/* --- ¿Qué quieres hacer? --- */
const finder = $('#finderInput');
const results = $('#finderResults');

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

let matches = [];
let active = -1;

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

function render() {
  matches = search(finder.value);
  active = matches.length ? 0 : -1;
  const open = finder.value.trim().length > 1;
  results.hidden = !open;
  finder.setAttribute('aria-expanded', String(open));
  if (!open) return;
  results.innerHTML = matches.length
    ? matches.map((m, i) => `
      <li role="option" id="finder-${i}" aria-selected="${i === active}" class="finder__item${i === active ? ' is-active' : ''}" data-i="${i}"${m.color ? ` style="--tool:${m.color}"` : ''}>
        <strong>${esc(m.name)}${m.external ? ' <span class="finder__ext">↗</span>' : ''}</strong>
        <span>${esc(m.sub)}</span>
      </li>`).join('')
    : `<li class="finder__empty">No encontré nada para «${esc(finder.value)}». <a href="/contacto/">Sugiéreme la herramienta</a>.</li>`;
  finder.setAttribute('aria-activedescendant', active >= 0 ? `finder-${active}` : '');
}

function setActive(i) {
  active = i;
  results.querySelectorAll('.finder__item').forEach((el, idx) => {
    el.classList.toggle('is-active', idx === i);
    el.setAttribute('aria-selected', String(idx === i));
  });
  finder.setAttribute('aria-activedescendant', `finder-${i}`);
}

function choose(i) {
  const m = matches[i];
  if (!m) return;
  if (m.external) window.open(m.url, '_blank', 'noopener,noreferrer');
  else location.href = m.url;
}

finder.addEventListener('input', render);
finder.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' && matches.length) { e.preventDefault(); setActive(Math.min(active + 1, matches.length - 1)); }
  else if (e.key === 'ArrowUp' && matches.length) { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
  else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
  else if (e.key === 'Escape') { finder.value = ''; render(); }
});
results.addEventListener('mousedown', (e) => {
  const item = e.target.closest('[data-i]');
  if (item) { e.preventDefault(); choose(Number(item.dataset.i)); }
});
finder.addEventListener('blur', () => setTimeout(() => { results.hidden = true; finder.setAttribute('aria-expanded', 'false'); }, 120));
finder.addEventListener('focus', () => { if (finder.value.trim().length > 1) render(); });

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    finder.focus();
    finder.select();
  }
});

/* --- Indicador de conexión: la prueba de que todo pasa en el navegador --- */
const net = $('#net');
const netText = $('#netText');
const NET_TEXT = {
  online: 'Pruébalo: usa una herramienta una vez, apaga el WiFi y vuelve a usarla. Seguirá funcionando.',
  offline: 'Estás sin conexión… y todo sigue funcionando. Abre cualquier herramienta que ya hayas usado.'
};
function updateNet() {
  net.dataset.online = String(navigator.onLine);
  netText.textContent = NET_TEXT[navigator.onLine ? 'online' : 'offline'];
}
window.addEventListener('online', updateNet);
window.addEventListener('offline', updateNet);
updateNet();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* sin soporte o bloqueado */ });
  });
}
