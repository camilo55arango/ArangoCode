import '../shell.js';
import { isWebGPUAvailable } from 'runonweb/core';
import { $ } from '../ui.js';

/* Las fichas ya vienen en el HTML (vite.config.js → src/lab/seo.js); aquí solo se avisa si falta WebGPU. */
isWebGPUAvailable().then((ok) => {
  if (ok) return;
  const pill = $('#gpu');
  pill.dataset.device = 'wasm';
  pill.textContent = 'Tu navegador no tiene aceleración gráfica: las herramientas de IA irán más lentas, pero funcionan.';
  pill.hidden = false;
});
