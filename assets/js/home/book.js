/* La libreta que se hojea: page-flip, marcadores, teclado y los dibujos que se trazan al abrir cada página. */

import { PageFlip } from 'page-flip/dist/js/page-flip.module.js';

const $ = (sel) => document.querySelector(sel);

export function initBook() {
  const el = $('#book');
  const stage = el.parentElement;
  const pages = [...el.querySelectorAll('.nb-page')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const last = pages.length - 1;

  const flip = new PageFlip(el, {
    width: 460,
    height: 620,
    size: 'stretch',
    minWidth: 250,
    maxWidth: 560,
    minHeight: 340,
    maxHeight: 760,
    showCover: true,
    usePortrait: true,
    mobileScrollSupport: true,
    maxShadowOpacity: 0.45,
    drawShadow: !reduce,
    flippingTime: reduce ? 1 : 900,
    showPageCorners: !reduce,
    // Un clic solo pasa la hoja en las esquinas: así tocar un enlace (o su texto) no hojea de más.
    // Arrastrar y deslizar siguen funcionando en toda la hoja.
    disableFlipByClick: true
  });
  flip.loadFromHTML(pages);
  el.classList.add('is-ready');

  let picked = -1; // Página del último marcador tocado: si comparte pliego con otro, se marca ese.
  const titleOf = (i) => (i === 0 ? 'Portada' : i === last ? 'Contratapa' : null);

  /** Páginas a la vista: una en celular (o con las tapas), dos con la libreta abierta. */
  function visible(i) {
    if (flip.getOrientation() === 'portrait' || i === 0 || i === last) return [i];
    const left = i % 2 ? i : i - 1;
    return [left, left + 1].filter((n) => n > 0 && n < last);
  }

  function update(i = flip.getCurrentPageIndex()) {
    const shown = visible(i);
    pages.forEach((p, n) => p.classList.toggle('is-open', shown.includes(n)));
    const landscape = flip.getOrientation() === 'landscape';
    stage.classList.toggle('is-spread', shown.length === 2);
    stage.classList.toggle('is-front', landscape && i === 0);
    stage.classList.toggle('is-back', landscape && i === last);
    $('#pageInfo').textContent = titleOf(i) ?? (shown.length === 2 ? `Págs. ${shown[0]}–${shown[1]}` : `Pág. ${i}`);
    $('#prevPage').disabled = i === 0;
    $('#nextPage').disabled = i >= last;
    // El marcador activo: el del capítulo que empieza en la hoja más a la izquierda que se ve,
    // o si no empieza ninguno aquí, el del último capítulo que ya empezó.
    const marks = [...document.querySelectorAll('.nb-mark')];
    const at = (m) => Number(m.dataset.goto);
    const current = marks.find((m) => at(m) === picked && shown.includes(picked))
      ?? marks.find((m) => shown.includes(at(m)))
      ?? marks.filter((m) => at(m) <= Math.min(...shown)).pop();
    marks.forEach((m) => m.classList.toggle('is-active', m === current && i > 0 && i < last));
  }

  flip.on('flip', (e) => update(e.data));
  flip.on('changeOrientation', () => update());
  update(0);

  const go = (n) => {
    if (n === flip.getCurrentPageIndex()) return;
    // Saltos largos: sin animar cada hoja, como cuando abres la libreta por un marcador.
    if (reduce || Math.abs(n - flip.getCurrentPageIndex()) > 4) flip.turnToPage(n);
    else flip.flip(n);
    update(n);
  };

  // La tapa y la contratapa se abren con un clic en cualquier parte.
  pages[0].addEventListener('click', (e) => { if (!e.target.closest('a, button')) flip.flipNext(); });
  pages[last].addEventListener('click', (e) => { if (!e.target.closest('a, button')) flip.flipPrev(); });

  $('#prevPage').addEventListener('click', () => flip.flipPrev());
  $('#nextPage').addEventListener('click', () => flip.flipNext());

  // Índice y marcadores: enlaces normales (#cap-pdf…) que con JS hojean hasta su página.
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-goto]');
    if (!link) return;
    e.preventDefault();
    picked = Number(link.dataset.goto);
    go(picked);
    history.replaceState(null, '', link.getAttribute('href'));
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select, [contenteditable]') || document.querySelector('.drop-note:not([hidden]), .finder-note:not([hidden])')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); flip.flipNext(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); flip.flipPrev(); }
  });

  // Entrar con #cap-pdf, #notas… abre la libreta en esa página.
  const start = pages.findIndex((p) => p.id && `#${p.id}` === location.hash);
  if (start > 0) { flip.turnToPage(start); update(start); }

  return flip;
}
