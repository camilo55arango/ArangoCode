/* Tarjetas de los directorios y prompts. Las usa app.js en el navegador y src/site/directory.js en el build. */

import { PALETTE } from './data.js';

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

export const normalize = (s) => String(s)
  .toLowerCase()
  .normalize('NFD')
  .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');

export const initials = (name) => name.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g, '').trim().charAt(0).toUpperCase();

export const KIND_LABEL = { dev: 'Herramientas', ia: 'IA', prompts: 'Prompt', lab: 'Estudio' };

/* Ruta de cada sección; `favoritos` es la vista de guardados. */
export const VIEW_PATH = { dev: '/herramientas/', ia: '/ia/', prompts: '/prompts/', favoritos: '/guardados/' };

export const promptUrl = (name) => `${VIEW_PATH.prompts}?prompt=${encodeURIComponent(name)}`;

function faviconUrl(url) {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; }
  catch (e) { return ''; }
}

const catColors = new Map();
export function colorFor(cat) {
  if (!catColors.has(cat)) catColors.set(cat, PALETTE[catColors.size % PALETTE.length]);
  return catColors.get(cat);
}

export function labelsFor(item) {
  const text = `${item.name} ${item.desc}`.toLowerCase();
  const labels = [];
  if (/open source|código abierto|open weight|auto-hosped/.test(text)) labels.push('Open source');
  if (/gratis|gratuita|gratuito|free/.test(text)) labels.push('Gratis');
  if (/navegador|web|nube/.test(text)) labels.push('Web');
  return labels.slice(0, 2);
}

/** Tarjeta de un enlace o prompt. `view` es la sección que se está viendo (para marcar las de otra). */
export function cardMarkup(it, i, kind, { favorite = false, view = kind } = {}) {
  const isPrompt = kind === 'prompts';
  const color = colorFor(it.cat);
  const delay = `animation-delay:${Math.min(i, 12) * 45}ms`;
  const style = `--accent-c:${color};${delay}`;

  const foot = isPrompt
    ? '<span class="card__foot">Ver y copiar <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg></span>'
    : '<span class="card__foot">Abrir sitio <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg></span>';

  const labels = labelsFor(it);
  const favBtn = `<button class="card__favorite" type="button" data-favorite="${esc(it.name)}" data-kind="${kind}" aria-pressed="${favorite}" aria-label="${favorite ? 'Quitar de guardados' : 'Guardar'} ${esc(it.name)}">★</button>`;

  const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
  const copyBtn = isPrompt
    ? `<button class="card__copylink" type="button" data-copyprompt="${esc(it.name)}" aria-label="Copiar prompt de ${esc(it.name)}">${copyIcon}</button>`
    : (it.url ? `<button class="card__copylink" type="button" data-copylink="${esc(it.url)}" aria-label="Copiar enlace de ${esc(it.name)}">${copyIcon}</button>` : '');

  const badgeImg = (!isPrompt && it.url)
    ? `<img class="card__badge-img" src="${esc(faviconUrl(it.url))}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()" />`
    : '';

  const kindTag = kind !== view ? `<span class="card__kind">${esc(KIND_LABEL[kind])}</span>` : '';

  const inner = `
    ${kindTag}
    <span class="card__head-actions">
    <span class="card__top">
      <span class="card__badge">${badgeImg}${esc(initials(it.name))}</span>
      <span>
        <span class="card__name">${esc(it.name)}</span>
        <span class="card__cat">${esc(it.cat)}</span>
      </span>
    </span>
    <span class="card__actions">${copyBtn}${favBtn}</span>
    </span>
    <span class="card__desc">${esc(it.desc)}</span>
    ${labels.length ? `<span class="card__badges">${labels.map((label) => `<span class="card__badge-label">${esc(label)}</span>`).join('')}</span>` : ''}
    ${foot}`;

  return isPrompt
    ? `<article class="card card--prompt" style="${style}" data-prompt="${esc(it.name)}" role="button" tabindex="0" aria-label="Abrir prompt: ${esc(it.name)}">${inner}</article>`
    : `<article class="card" style="${style}"><a class="card__link" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${esc(it.name)}">${inner.replace(/<span class="card__actions">[\s\S]*?<\/span>/, '')}</a><span class="card__actions card__actions--overlay">${copyBtn}${favBtn}</span></article>`;
}
