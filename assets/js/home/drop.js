/* Soltar (o pegar) un archivo en la portada: un post-it propone las herramientas y se lo pasa a la elegida. */

import { READY_TOOLS } from '../../../src/lab/tools.js';
import { saveHandoff, HANDOFF_PARAM } from '../../../src/lab/handoff.js';
import { esc } from '../cards.js';

const $ = (sel) => document.querySelector(sel);

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|bmp|heic|heif)$/i;
const AUDIO_EXT = /\.(mp3|wav|m4a|ogg|opus|flac|aac|mp4|mov|webm|mkv)$/i;
const KIND_NAME = { pdf: 'PDF', image: 'Imagen', audio: 'Audio o video' };

function kindOf(file) {
  const type = file.type || '';
  if (type === 'application/pdf' || /\.pdf$/i.test(file.name)) return 'pdf';
  if (type.startsWith('image/') || IMAGE_EXT.test(file.name)) return 'image';
  if (type.startsWith('audio/') || type.startsWith('video/') || AUDIO_EXT.test(file.name)) return 'audio';
  return null;
}

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
};

export function initDrop() {
  const note = $('#dropNote');
  const veil = $('#dropVeil');
  const input = $('#dropInput');
  const actions = $('#dropActions');
  let current = null;
  let thumbUrl = '';
  let lastFocus = null;

  function close() {
    note.hidden = true;
    if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    thumbUrl = '';
    current = null;
    lastFocus?.focus();
  }

  function show(file) {
    const kind = kindOf(file);
    current = file;
    lastFocus = document.activeElement;
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
      : 'Aún no tengo herramientas para este tipo de archivo. Prueba con un PDF, una imagen o un audio.';
    actions.innerHTML = tools.map((t, i) => `
      <button class="drop-action" type="button" data-slug="${t.slug}" style="--tool:${t.color};--i:${i}">
        <strong>${esc(t.name)}</strong><span>${esc(t.desc)}</span>
      </button>`).join('');
    note.hidden = false;
    (actions.querySelector('button') ?? note.querySelector('.drop-note__close')).focus();
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

  // Arrastrar sobre la página muestra un aviso; se cuenta para no parpadear al pasar sobre elementos hijos.
  let depth = 0;
  const hasFiles = (e) => [...(e.dataTransfer?.types ?? [])].includes('Files');
  document.addEventListener('dragenter', (e) => { if (hasFiles(e)) { depth++; veil.classList.add('is-on'); } });
  document.addEventListener('dragleave', () => { depth = Math.max(0, depth - 1); if (!depth) veil.classList.remove('is-on'); });
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    depth = 0;
    veil.classList.remove('is-on');
    const file = e.dataTransfer?.files[0];
    if (file) show(file);
  });
  document.addEventListener('paste', (e) => {
    if (e.target.closest?.('input, textarea')) return;
    const file = [...(e.clipboardData?.items ?? [])].find((i) => i.kind === 'file')?.getAsFile();
    if (file) show(file);
  });
  input.addEventListener('change', () => { if (input.files[0]) show(input.files[0]); input.value = ''; });

  actions.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-slug]');
    if (btn && current) goTo(btn.dataset.slug);
  });
  note.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !note.hidden) close(); });

  return { pick: () => input.click() };
}
