/* Lista de resultados por archivo y descarga en ZIP, compartida por Comprimir y Convertir. */

import { $, downloadBlob, esc, formatSize, nameField } from './ui.js';

/**
 * `root` contiene un `<ul data-files>`, un botón `[data-zip]` y, opcional, el campo de nombre (`nameField`).
 * Cada resultado: { name, before, blob, kept } (`kept`: se conservó el original porque pesaba menos).
 * Con un nombre elegido: un solo archivo se llama así; varios, "nombre-1", "nombre-2"… y el ZIP "nombre.zip".
 */
export function createBatch(root, { zipName = 'imagenes.zip' } = {}) {
  const list = $('[data-files]', root);
  const zipBtn = $('[data-zip]', root);
  const name = nameField(root);
  let results = [];

  const fileName = (r, i) => (results.length === 1 ? name.fileName(r.name) : name.fileName(r.name, i + 1));

  function row(r, i) {
    const after = r.blob.size;
    const pct = Math.round((1 - after / r.before) * 100);
    const delta = pct > 0 ? `−${pct} %` : pct < 0 ? `+${-pct} %` : '0 %';
    const note = r.kept ? ' · <em>se conservó el original</em>' : '';
    return `
      <li class="lab-file${pct > 0 ? ' is-smaller' : ''}" style="--saved:${Math.max(0, Math.min(100, pct))}%">
        <span class="lab-file__name" title="${esc(r.name)}">${esc(r.name)}</span>
        <span class="lab-file__meta">${formatSize(r.before)} → <b>${formatSize(after)}</b> <span class="lab-file__delta">${delta}</span>${note}</span>
        <span class="lab-file__bar" aria-hidden="true"></span>
        <button class="btn btn--ghost btn--sm" type="button" data-download="${i}">Descargar</button>
      </li>`;
  }

  function render() {
    list.innerHTML = results.map(row).join('');
    root.hidden = !results.length;
    zipBtn.hidden = results.length < 2;
    if (results.length) name.suggest(results.length === 1 ? results[0].name : zipName);
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-download]');
    if (!btn) return;
    const i = Number(btn.dataset.download);
    downloadBlob(results[i].blob, fileName(results[i], i));
  });

  zipBtn.addEventListener('click', async () => {
    const { zip } = await import('fflate');
    const used = new Set();
    const files = {};
    for (const [i, r] of results.entries()) {
      const wanted = fileName(r, i);
      let entry = wanted;
      for (let n = 2; used.has(entry); n++) entry = wanted.replace(/(\.[^.]+)$/, `-${n}$1`);
      used.add(entry);
      // Las imágenes ya están comprimidas: guardarlas sin deflate es igual de pequeño y mucho más rápido.
      files[entry] = [new Uint8Array(await r.blob.arrayBuffer()), { level: 0 }];
    }
    zip(files, (err, data) => {
      if (!err) downloadBlob(new Blob([data], { type: 'application/zip' }), name.fileName(zipName));
    });
  });

  return {
    reset() { results = []; render(); },
    add(result) { results.push(result); render(); },
    get size() { return results.length; }
  };
}
