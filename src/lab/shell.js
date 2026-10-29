/* Marco común de /estudio: tema, créditos del modelo y service worker. */

import { READY_TOOLS } from './tools.js';
import { $, esc } from './ui.js';

/* El tema inicial lo fija un script en línea del <head> para evitar el parpadeo. */
$('#themeToggle')?.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ac-theme', next); } catch (e) { /* modo privado */ }
});

export const tool = READY_TOOLS.find((t) => t.slug === document.body.dataset.tool);

const credits = $('#credits');
const link = (name, url) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a>`;
if (credits && tool?.credits) {
  credits.innerHTML = `Funciona con ${tool.credits.map(([name, url, license]) => `${link(name, url)} (${esc(license)})`).join(', ')}.
    Todo se procesa en tu dispositivo: tus archivos no salen del navegador.`;
} else if (credits && tool) {
  credits.innerHTML = `Modelo: <a href="${esc(tool.modelUrl)}" target="_blank" rel="noopener noreferrer">${esc(tool.model)}</a>
    (${esc(tool.author)}, ${esc(tool.license)}) · Basado en
    <a href="https://github.com/midudev/runonweb.ai" target="_blank" rel="noopener noreferrer">runonweb</a> (MIT).
    Todo se procesa en tu dispositivo: tus archivos no salen del navegador.`;
}

/* "Volver": si llegaste desde otra página de este sitio, regresa a ella (con su scroll); si no, va a la de arriba. */
$('[data-back]')?.addEventListener('click', (e) => {
  let fromHere = false;
  try { fromHere = new URL(document.referrer).origin === location.origin; } catch (err) { /* sin referrer */ }
  if (fromHere && history.length > 1) {
    e.preventDefault();
    history.back();
  }
});

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* sin soporte o bloqueado */ });
  });
}
