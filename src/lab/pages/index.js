import '../shell.js';
import { isWebGPUAvailable } from 'runonweb/core';
import { LAB_TOOLS } from '../tools.js';
import { $, esc } from '../ui.js';

/* Iconos de píxeles al estilo de runonweb, uno por herramienta. */
const ICONS = {
  ocr: '<rect x="0" y="4" width="64" height="6"/><rect x="0" y="18" width="40" height="6"/><rect x="0" y="32" width="54" height="6"/><rect x="0" y="46" width="30" height="6"/>',
  'remove-bg': '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M6 6h26v44H6z" opacity=".6"/><path d="M14 14h10v10H14zM10 28h18v16H10z"/><path d="M32 6h8v8h-8zM48 6h8v8h-8zM40 14h8v8h-8zM56 14h2v8h-2zM32 22h8v8h-8zM48 22h8v8h-8zM40 30h8v8h-8zM32 38h8v8h-8zM48 38h8v8h-8z" opacity=".8"/>',
  stt: '<path d="M0 24h6v8H0zM8 16h6v24H8zM16 8h6v40h-6zM24 20h6v16h-6zM34 20h6v16h-6zM42 8h6v40h-6zM50 16h6v24h-6zM58 24h6v8h-6z"/>',
  depth: '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M8 8h48v40H8z" opacity=".6"/><path d="M16 16h32v24H16z"/><path d="M24 24h16v8H24z" opacity=".35"/>',
  translate: '<path d="M2 4h30v24H14l-6 8v-8H2z"/><path d="M8 10h18v12H8z" opacity=".35"/><path d="M34 22h28v22h-6v8l-6-8H34z" opacity=".6"/><path d="M40 28h16v10H40z" opacity=".35"/>'
};

$('#tools').innerHTML = LAB_TOOLS.map((t, i) => `
  <a class="lab-card" href="/lab/${t.slug}" style="--tool:${t.color}">
    <span class="lab-card__top"><span class="lab-tag">${esc(t.task)}</span><span>${String(i + 1).padStart(2, '0')}</span></span>
    <div class="lab-card__body">
      <div><h2>${esc(t.name)}</h2><p>${esc(t.desc)}</p></div>
      <span class="lab-card__icon"><svg viewBox="0 0 64 56" aria-hidden="true">${ICONS[t.slug]}</svg></span>
    </div>
    <span class="lab-card__foot"><span>Tamaño <b>${esc(t.size)}</b></span><span>Entrada <b>${esc(t.cat)}</b></span></span>
  </a>`).join('');

isWebGPUAvailable().then((ok) => {
  const pill = $('#gpu');
  pill.dataset.device = ok ? 'webgpu' : 'wasm';
  pill.textContent = ok
    ? 'Tu navegador tiene WebGPU: máxima velocidad'
    : 'Sin WebGPU: se usará WASM (más lento, pero funciona)';
});
