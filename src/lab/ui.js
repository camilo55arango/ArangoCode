/* Piezas de interfaz compartidas por las páginas del laboratorio. */

import { formatBytes } from 'runonweb/core';

export const $ = (sel, root = document) => root.querySelector(sel);

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/**
 * Barra de estado + progreso de descarga.
 * Transformers.js emite `progress` por archivo y `progress_total` agregado; OCR ya emite el total
 * en cada evento (`mode: 'total'`), y Bergamot emite por archivo.
 */
export function createStatus(root, { mode = 'files' } = {}) {
  const text = $('[data-status-text]', root);
  const bar = $('[data-status-bar]', root);
  const fill = $('[data-status-fill]', root);
  const files = new Map();
  let sawTotal = false;

  function setProgress(loaded, total) {
    if (!total) return;
    const pct = Math.min(100, (loaded / total) * 100);
    bar.hidden = pct >= 100;
    fill.style.width = `${pct}%`;
    text.textContent = `Descargando modelo… ${formatBytes(loaded)} de ${formatBytes(total)}`;
  }

  return {
    set(msg, kind = '') {
      text.textContent = msg;
      root.dataset.kind = kind;
    },
    /** Como `set`, pero con marcado propio (enlaces a otra herramienta). Nunca con texto del usuario. */
    html(markup, kind = '') {
      bar.hidden = true;
      text.innerHTML = markup;
      root.dataset.kind = kind;
    },
    error(err) {
      console.error(err);
      bar.hidden = true;
      root.dataset.kind = 'error';
      text.textContent = `Error: ${err?.message ?? err}`;
    },
    /** Callback para el `onProgress` de runonweb. */
    onProgress: (info) => {
      root.dataset.kind = '';
      if (info.status === 'progress_total') {
        sawTotal = true;
        setProgress(info.loaded, info.total);
      } else if (info.status === 'progress' && info.loaded != null && info.total) {
        if (mode === 'total') return setProgress(info.loaded, info.total);
        if (sawTotal) return;
        files.set(info.file, [info.loaded, info.total]);
        let loaded = 0, total = 0;
        for (const [l, t] of files.values()) { loaded += l; total += t; }
        setProgress(loaded, total);
      } else if (info.status === 'loading' && !files.size) {
        text.textContent = 'Preparando modelo…';
      }
    },
    reset() {
      files.clear();
      sawTotal = false;
      bar.hidden = true;
      fill.style.width = '0%';
    }
  };
}

/**
 * Muestra el backend real (WebGPU / WASM) y si hay multihilo.
 * `threads: false` para motores que no usan hilos aunque la página esté aislada (Bergamot).
 */
export function showDevice(el, device, { threads: canThread = true } = {}) {
  if (!el || !device) return;
  const threads = canThread && device === 'wasm' && globalThis.crossOriginIsolated ? ' · multihilo' : '';
  el.textContent = device === 'webgpu' ? 'WebGPU' : `WASM${threads}`;
  el.dataset.device = device;
  el.hidden = false;
}

/**
 * Zona para soltar / elegir / pegar archivos. Con `multiple`, `onFile` recibe un array.
 * `accept` admite tipos MIME (`image/*`) y extensiones (`.heic`): algunos navegadores no dan tipo a los HEIC.
 */
export function bindDropzone(zone, onFile, { multiple = false } = {}) {
  const input = $('input[type="file"]', zone);
  const accept = (input.accept || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const ok = (file) => !accept.length || accept.some((a) => {
    if (a.startsWith('.')) return file.name.toLowerCase().endsWith(a);
    return a.endsWith('/*') ? file.type.startsWith(a.slice(0, -1)) : file.type === a;
  });
  const pick = (files) => {
    const valid = [...files].filter((f) => f && ok(f));
    if (!valid.length) return;
    onFile(multiple ? valid : valid[0]);
  };

  if (multiple) input.multiple = true;
  input.addEventListener('change', () => { pick(input.files); input.value = ''; });
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('is-over');
    pick(e.dataTransfer.files);
  });
  document.addEventListener('paste', (e) => {
    if (e.target.closest?.('input, textarea')) return;
    const files = [...(e.clipboardData?.items ?? [])].filter((i) => i.kind === 'file').map((i) => i.getAsFile());
    if (files.length) pick(files);
  });
}

export { formatBytes as formatSize };

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const prev = btn.textContent;
    btn.textContent = 'Copiado';
    setTimeout(() => { btn.textContent = prev; }, 1400);
  } catch (e) { /* sin permiso de portapapeles */ }
}

/** Nombre de archivo de salida: foto.jpg → foto-sin-fondo.png */
export const outName = (file, suffix, ext = 'png') =>
  `${(file?.name || 'imagen').replace(/\.[^.]+$/, '')}-${suffix}.${ext}`;
