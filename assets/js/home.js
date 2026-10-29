/* Portada: la libreta que se hojea, su página para dibujar, soltar un archivo y el buscador. */

import { initBook } from './home/book.js';
import { initNotes } from './home/notes.js';
import { initWrite } from './home/write.js';
import { initDrop } from './home/drop.js';
import { initFinder } from './home/finder.js';

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

const avatar = $('.site-brand__avatar');
const avatarImg = $('#avatarImg');
avatarImg.addEventListener('error', () => avatar.classList.add('is-fallback'));
if (avatarImg.complete && avatarImg.naturalWidth === 0) avatar.classList.add('is-fallback');

/* --- Libreta --- */
const drop = initDrop();
initFinder({ onPickFile: drop.pick });
// La libreta va al final: si page-flip fallara, lo demás ya funciona y las páginas se ven apiladas.
try {
  initBook();
} catch (err) {
  console.error(err);
}
initNotes();
initWrite();

/* --- Indicador de conexión: la prueba de que todo pasa en el navegador --- */
const net = $('#net');
const netText = $('#netText');
const NET_TEXT = {
  online: 'Pruébalo: usa una herramienta, apaga el WiFi y vuelve a usarla.',
  offline: 'Estás sin conexión… y todo sigue funcionando.'
};
function updateNet() {
  if (!net) return;
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
