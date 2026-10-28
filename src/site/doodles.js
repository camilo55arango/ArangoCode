/*
 * Dibujos "a mano" de la libreta de la portada. Cada trazo lleva pathLength="1" para que
 * assets/css/home.css lo dibuje con stroke-dashoffset (efecto lápiz) cuando la página se abre.
 * Los trazos tienen pequeñas curvas a propósito: que parezcan hechos a pulso, no con regla.
 */

const svg = (body, { w = 220, h = 170, label = '' } = {}) =>
  `<svg class="doodle" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">${body}</svg>`;

const p = (d, cls = '') => `<path pathLength="1" class="ink${cls ? ` ${cls}` : ''}" d="${d}"/>`;

export const DOODLES = {
  /* Hojas con la esquina doblada, un clip y un lápiz. */
  pdf: svg([
    p('M58 30c18-1 46 0 64 1l22 22c1 30 0 66 1 96-28 1-58 0-86 1-2-40-1-80-1-120z'),
    p('M122 31c0 8-1 16 0 22 7 1 15 0 22 0'),
    p('M74 70c16 1 36-1 54 1M74 86c20-1 40 1 56-1M74 102c14 1 30 0 46 0M74 118c10 0 22 1 30 0', 'ink--soft'),
    p('M46 44c-1 34 1 72 0 106 26 2 52 0 78 1', 'ink--soft'),
    p('M96 18c-1 14 0 30 1 40 1 8 10 8 11 0 0-12-1-26 0-36 0-6-6-6-6 0l1 30', 'ink--accent'),
    p('M160 140l34-62 10 6-34 62-12 6z M194 78l4-8c2-4 8-1 6 3l-4 8', 'ink--accent'),
    p('M170 140c-2 4-6 8-10 6')
  ].join(''), { label: 'Hojas de papel, un clip y un lápiz' }),

  /* Cámara de fotos con destellos y una foto que sale. */
  imagen: svg([
    p('M40 62c40-2 100-1 140 0 4 0 6 3 6 7l-1 64c0 4-3 6-7 6-44 1-90 0-136 0-4 0-6-3-6-7 0-20 1-44 0-63 0-4 2-7 4-7z'),
    p('M80 62l10-18c14-1 28 0 40 0l10 18'),
    p('M110 76c18-1 30 14 29 30-1 18-16 28-31 27-17-1-28-15-27-31 1-14 14-27 29-26z'),
    p('M110 92c8 0 13 6 13 13s-6 13-13 13-13-6-12-13 5-13 12-13z', 'ink--soft'),
    p('M56 74c6 0 12 0 16 1', 'ink--accent'),
    p('M178 30l4 12 12 4-12 4-4 12-4-12-12-4 12-4z', 'ink--accent'),
    p('M30 26l2 7 7 2-7 2-2 7-2-7-7-2 7-2z', 'ink--accent')
  ].join(''), { label: 'Una cámara de fotos con destellos' }),

  /* Micrófono, ondas de sonido y un globo que traduce. */
  audio: svg([
    p('M64 40c0-12 22-12 22 0l1 40c0 14-24 14-24 0z'),
    p('M50 74c0 22 14 34 26 34s25-12 25-34M76 108v20M60 130c10 1 22 0 32 0'),
    p('M104 58c6 6 6 18 0 24M114 50c11 11 11 30 0 41', 'ink--accent'),
    p('M134 36c20-2 48-1 64 0 6 0 8 4 8 8l-1 32c0 5-3 8-8 8h-36l-14 14 2-14h-12c-5 0-8-3-8-8l1-32c0-5 3-8 8-8z'),
    p('M146 54c4 0 6 3 6 6M146 66c8 0 14 0 18 0M172 54l6 12 6-12M170 64h16', 'ink--soft')
  ].join(''), { label: 'Un micrófono y un globo de diálogo' }),

  /* Archivo → navegador → descarga, y una nube tachada. */
  privacidad: svg([
    p('M24 52c10 0 20 0 26 1l8 8c0 14 1 30 0 44-12 0-24 1-34 0-1-18 0-36 0-53z'),
    p('M70 80c8 0 18 1 26-1M90 72l8 8-8 8', 'ink--accent'),
    p('M108 44c26-1 54 0 80 0 4 0 6 2 6 6l-1 52c0 3-2 5-5 5-26 1-54 0-80 0-3 0-5-2-5-5 0-18 1-36 0-53 0-3 2-5 5-5z'),
    p('M108 58c28 0 56 1 86 0M116 51c1 0 2 0 3 0M124 51h3', 'ink--soft'),
    p('M140 76c8-8 20-8 24 2 8-2 14 4 12 12-1 4-4 6-8 6-12 0-24 1-34 0-8 0-10-12-2-14 0-2 2-5 8-6z', 'ink--soft'),
    p('M134 70l44 34', 'ink--accent'),
    p('M150 116c1 10 0 22 0 30M140 136l10 10 10-10M130 152c14 1 28 0 40 0')
  ].join(''), { label: 'Tu archivo pasa a tu navegador y vuelve como descarga, sin pasar por la nube' }),

  /* Bombillo y una estrella: ideas y recursos. */
  recursos: svg([
    p('M110 30c26-1 42 20 40 42-1 14-10 22-16 30-3 4-4 10-4 16-12 1-26 0-38 0 0-6-1-12-4-16-6-8-16-16-17-30-1-22 16-42 39-42z'),
    p('M94 126c10 1 24 0 34 0M98 136c8 1 18 0 26 0M104 146c4 1 10 0 14 0'),
    p('M104 100c0-12 4-22 8-30M118 100c0-10-2-20-6-30', 'ink--soft'),
    p('M60 46l-14-8M58 74l-16 2M164 46l14-8M166 74l16 2M112 16v-10', 'ink--accent'),
    p('M178 112l4 10 10 2-8 6 2 10-8-6-10 6 2-10-8-6 10-2z', 'ink--accent')
  ].join(''), { label: 'Un bombillo encendido' }),

  /* Garabato de flecha para "ábreme". */
  arrow: `<svg class="doodle doodle--arrow" viewBox="0 0 120 50" aria-hidden="true">${p('M6 30c22-18 52-22 96-10M86 8l18 12-16 14')}</svg>`
};
