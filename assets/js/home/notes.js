/* "Tu página": una hoja de la libreta para dibujar. Los trazos se guardan en el navegador. */

const KEY = 'ac-notes';
const MAX_POINTS = 20000; // Para no llenar el almacenamiento si alguien dibuja muchísimo.

export function initNotes() {
  const canvas = document.querySelector('#notesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const pens = [...document.querySelectorAll('.nb-pen')];
  let color = pens[0]?.dataset.color ?? '#1f2a44';
  let strokes = [];
  try { strokes = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { /* storage no disponible */ }
  let current = null;

  pens.forEach((b) => b.style.setProperty('--c', b.dataset.color));

  /* Los puntos se guardan de 0 a 1: el dibujo se adapta al tamaño de la hoja. */
  function draw() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = ctx.lineJoin = 'round';
    for (const s of strokes) {
      const marker = s.c === '#f2b84b';
      ctx.strokeStyle = s.c;
      ctx.globalAlpha = marker ? 0.45 : 1;
      ctx.lineWidth = (marker ? 0.03 : 0.008) * w;
      ctx.beginPath();
      s.p.forEach(([x, y], i) => (i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)));
      if (s.p.length === 1) ctx.lineTo(s.p[0][0] * w + 0.5, s.p[0][1] * h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    draw();
  }

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(strokes)); } catch (e) { /* lleno o bloqueado */ }
  };
  const point = (e) => {
    const r = canvas.getBoundingClientRect();
    return [+((e.clientX - r.left) / r.width).toFixed(4), +((e.clientY - r.top) / r.height).toFixed(4)];
  };

  // La libreta hojea al arrastrar en cualquier parte: aquí el arrastre es para dibujar.
  for (const type of ['mousedown', 'touchstart', 'touchmove']) {
    canvas.addEventListener(type, (e) => e.stopPropagation(), { passive: true });
  }
  canvas.closest('.nb-draw').querySelector('.nb-draw__tools').addEventListener('mousedown', (e) => e.stopPropagation());
  canvas.closest('.nb-draw').querySelector('.nb-draw__tools').addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    current = { c: color, p: [point(e)] };
    strokes.push(current);
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!current) return;
    current.p.push(point(e));
    draw();
  });
  const end = () => {
    if (!current) return;
    current = null;
    while (strokes.reduce((n, s) => n + s.p.length, 0) > MAX_POINTS) strokes.shift();
    save();
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  pens.forEach((b) => b.addEventListener('click', () => {
    color = b.dataset.color;
    pens.forEach((x) => x.classList.toggle('is-active', x === b));
  }));
  document.querySelector('#notesClear').addEventListener('click', () => {
    strokes = [];
    save();
    draw();
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
}
