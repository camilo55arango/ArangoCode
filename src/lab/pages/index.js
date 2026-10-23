import '../shell.js';
import { isWebGPUAvailable } from 'runonweb/core';
import { $ } from '../ui.js';

/* Las fichas ya vienen en el HTML (vite.config.js → src/lab/seo.js); aquí solo se comprueba el dispositivo. */
isWebGPUAvailable().then((ok) => {
  const pill = $('#gpu');
  pill.dataset.device = ok ? 'webgpu' : 'wasm';
  pill.textContent = ok
    ? 'Tu navegador tiene WebGPU: máxima velocidad'
    : 'Sin WebGPU: se usará WASM (más lento, pero funciona)';
});
