/*
 * Genera las imágenes para compartir (1200×630) de cada herramienta y sección en public/og/.
 * Se corre a mano con `npm run og` cuando cambia el catálogo; las PNG quedan en el repo, así el build
 * no depende de tener las tipografías instaladas.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { READY_TOOLS, ICONS } from '../src/lab/tools.js';
import { SECTIONS } from '../assets/js/data.js';

const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'public/og');
const fonts = ['Outfit-500', 'Outfit-800', 'Caveat-700', 'JetBrainsMono-500'].map((f) => resolve(import.meta.dirname, `fonts/${f}.ttf`));

const W = 1200;
const H = 630;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Parte el texto en líneas de como mucho `max` caracteres. */
function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max && line) { lines.push(line); line = word; }
    else line = (line + ' ' + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function card({ title, desc, tag, color, icon, iconStroke = false }) {
  const titleLines = wrap(title, 20);
  const titleSize = titleLines.length > 1 ? 78 : 92;
  const descLines = wrap(desc, 46).slice(0, titleLines.length > 1 ? 2 : 3);
  const titleY = 300;
  const descY = titleY + (titleLines.length - 1) * titleSize * 1.02 + 70;
  const rules = Array.from({ length: 20 }, (_, i) => `<line x1="0" x2="${W}" y1="${40 + i * 32}" y2="${40 + i * 32}" stroke="#96afff" stroke-opacity=".07" stroke-width="1.5"/>`).join('');
  const holes = Array.from({ length: 10 }, (_, i) => `<circle cx="38" cy="${60 + i * 60}" r="11" fill="#0c0d11"/>`).join('');
  const iconSvg = iconStroke
    ? `<svg x="120" y="96" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon.replace(/<\/?svg[^>]*>/g, '')}</svg>`
    : `<svg x="120" y="104" width="96" height="84" viewBox="0 0 64 56" fill="${color}">${icon}</svg>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#15171d"/>
  ${rules}
  <line x1="84" x2="84" y1="0" y2="${H}" stroke="#ff6e6e" stroke-opacity=".45" stroke-width="2"/>
  ${holes}
  <rect x="${W - 330}" y="-20" width="230" height="64" fill="${color}" fill-opacity=".55" transform="rotate(-4 ${W - 215} 12)"/>
  ${iconSvg}
  <text x="240" y="138" font-family="JetBrains Mono" font-weight="500" font-size="22" letter-spacing="3" fill="${color}">${esc(tag.toUpperCase())}</text>
  <text x="240" y="178" font-family="Caveat" font-weight="700" font-size="40" fill="#b8b5ab">gratis · sin registro · privado</text>
  ${titleLines.map((l, i) => `<text x="120" y="${titleY + i * titleSize * 1.02}" font-family="Outfit" font-weight="800" font-size="${titleSize}" letter-spacing="-2" fill="#ebe7dc">${esc(l)}</text>`).join('')}
  ${descLines.map((l, i) => `<text x="120" y="${descY + i * 44}" font-family="Outfit" font-weight="500" font-size="34" fill="#b8b5ab">${esc(l)}</text>`).join('')}
  <rect x="120" y="${H - 92}" width="${W - 240}" height="2" fill="#ebe7dc" fill-opacity=".22"/>
  <text x="120" y="${H - 46}" font-family="Outfit" font-weight="800" font-size="34" fill="#ebe7dc">ArangoCode</text>
  <text x="${W - 120}" y="${H - 48}" text-anchor="end" font-family="JetBrains Mono" font-weight="500" font-size="24" fill="#8d8b83">Tus archivos no salen de tu dispositivo</text>
</svg>`;
}

function render(name, svg) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'Outfit' } }).render().asPng();
  writeFileSync(resolve(outDir, `${name}.png`), png);
  console.log(`/og/${name}.png  ${(png.length / 1024).toFixed(0)} KB`);
}

mkdirSync(outDir, { recursive: true });

for (const t of READY_TOOLS) {
  render(t.slug, card({ title: t.name, desc: t.desc, tag: `${t.task} · ${t.cat}`, color: t.color, icon: ICONS[t.slug] ?? '' }));
}
for (const s of SECTIONS) {
  render(s.id, card({ title: s.title, desc: s.desc, tag: 'Directorio', color: s.color, icon: s.icon, iconStroke: true }));
}
render('favoritos', card({ title: 'Mis guardados', desc: 'Las herramientas, IA y prompts que guardaste, en un solo lugar.', tag: 'Guardados', color: '#f2b84b', icon: '<path d="M12 17.3l-6.16 3.6 1.64-7L2 9.3l7.1-.6L12 2.2l2.9 6.5 7.1.6-5.48 4.6 1.64 7z"/>', iconStroke: true }));
render('estudio', card({ title: 'Estudio Creativo', desc: `${READY_TOOLS.length} herramientas gratis para PDF, imágenes y audio que funcionan en tu navegador.`, tag: 'Estudio', color: '#8fb0ff', icon: ICONS['unir-pdf'] }));
render('inicio', card({ title: 'Herramientas gratis en tu navegador', desc: 'PDF, imágenes, audio y texto. Sin registro y sin subir tus archivos.', tag: 'arangocode.com', color: '#8fb0ff', icon: ICONS['quitar-fondo'] }));
