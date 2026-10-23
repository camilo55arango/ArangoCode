/* Marco común de /lab: tema, créditos del modelo y service worker. */

import { LAB_TOOLS } from './tools.js';
import { $, esc } from './ui.js';

try {
  const saved = localStorage.getItem('ac-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
} catch (e) { /* storage no disponible */ }

$('#themeToggle')?.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ac-theme', next); } catch (e) { /* modo privado */ }
});

export const tool = LAB_TOOLS.find((t) => t.slug === document.body.dataset.tool);

const credits = $('#credits');
if (credits && tool) {
  credits.innerHTML = `Modelo: <a href="${esc(tool.modelUrl)}" target="_blank" rel="noopener noreferrer">${esc(tool.model)}</a>
    (${esc(tool.author)}, ${esc(tool.license)}) · Basado en
    <a href="https://github.com/midudev/runonweb.ai" target="_blank" rel="noopener noreferrer">runonweb</a> (MIT).
    Todo se procesa en tu dispositivo: tus archivos no salen del navegador.`;
}

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* sin soporte o bloqueado */ });
  });
}
