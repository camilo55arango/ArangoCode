/*
 * La libreta de la portada. vite.config.js (vía src/lab/seo.js) escribe este HTML en index.html en el build,
 * así todo el contenido y los enlaces están en la página aunque no haya JS. assets/js/home/book.js lo
 * convierte después en una libreta que se hojea.
 */

import { LAB_TOOLS, READY_TOOLS, ICONS, toolCardMarkup } from '../lab/tools.js';
import { SECTIONS, DEV_TOOLS, AI_TOOLS, PROMPTS } from '../../assets/js/data.js';
import { VIEW_PATH } from '../../assets/js/cards.js';
import { DOODLES } from './doodles.js';
import { SOCIAL_ICONS } from './icons.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/*
 * Capítulos: un pliego cada uno, con el título y el dibujo a la izquierda y todas sus herramientas a la derecha.
 * `tools` va en el orden en que se muestran (incluye enlaces externos como Descargar videos).
 */
const CHAPTERS = [
  { id: 'pdf', title: 'Documentos PDF', mark: 'Documentos', color: '#e5484d', doodle: 'pdf',
    tools: ['unir-pdf', 'pdf-a-word', 'editar-pdf', 'firmar-pdf', 'desbloquear-pdf', 'dividir-pdf', 'pdf-a-imagen', 'imagen-a-pdf', 'comprimir-pdf'],
    intro: 'Une, edita, firma, comprime o separa tus PDF, y pásalos a Word o a imagen. Sin subirlos a ningún lado.' },
  { id: 'imagen', title: 'Fotos e imágenes', mark: 'Fotos', color: '#f08a5d', doodle: 'imagen',
    tools: ['quitar-fondo', 'convertir-imagen', 'imagen-a-texto', 'comprimir-imagen', 'mapa-de-profundidad'],
    intro: 'Quita fondos, cambia formatos, reduce el peso o saca el texto de una foto. La IA corre en tu propio equipo.' },
  { id: 'audio', title: 'Audio y texto', mark: 'Audio y Texto', color: '#4dd4f0', doodle: 'audio',
    tools: ['audio-a-texto', 'traductor', 'generador-qr', 'descargar-videos'],
    intro: 'Convierte tu voz en texto, traduce sin enviar nada a internet, crea códigos QR y guarda videos.' }
];

/* Hasta 5 herramientas caben como filas; con más, las primeras van en fila y el resto en una cuadrícula pequeña. */
const MAX_ROWS = 5;
const ROWS_WHEN_GRID = 3;

const toolHref = (t) => (t.external
  ? `href="${esc(t.external)}" target="_blank" rel="noopener noreferrer"`
  : `href="/estudio/${t.slug}"`);

function toolRow(t) {
  return `<a class="nb-tool" ${toolHref(t)} style="--tool:${t.color}">
          <svg class="nb-tool__icon" viewBox="0 0 64 56" aria-hidden="true">${ICONS[t.slug] ?? ''}</svg>
          <span class="nb-tool__text"><b>${esc(t.name)}</b><small>${esc(t.desc)}</small></span>
          <span class="nb-tool__go" aria-hidden="true">${t.external ? 'abrir ↗' : 'abrir →'}</span>
        </a>`;
}

function toolTile(t) {
  return `<a class="nb-tile" ${toolHref(t)} style="--tool:${t.color}">
            <svg viewBox="0 0 64 56" aria-hidden="true">${ICONS[t.slug] ?? ''}</svg>
            <span>${esc(t.name)}${t.external ? ' ↗' : ''}</span>
          </a>`;
}

function toolsPage(list) {
  if (list.length <= MAX_ROWS) return `<div class="nb-tools">${list.map(toolRow).join('')}</div>`;
  const rows = list.slice(0, ROWS_WHEN_GRID);
  const tiles = list.slice(ROWS_WHEN_GRID);
  return `<div class="nb-tools">${rows.map(toolRow).join('')}</div>
        <p class="nb-more">y también:</p>
        <div class="nb-tiles">${tiles.map(toolTile).join('')}</div>`;
}

/** Una página de la libreta. `hard` = tapa de cartón. */
const page = ({ id, n, hard = false, cls = '', body }) =>
  `<section class="nb-page${hard ? ' nb-page--hard' : ''}${cls ? ` ${cls}` : ''}" data-density="${hard ? 'hard' : 'soft'}"${id ? ` id="${id}"` : ''}>
      <div class="nb-page__inner">${body}</div>${n ? `<span class="nb-page__num" aria-hidden="true">${n}</span>` : ''}
    </section>`;

const socials = () => `<nav class="socials" aria-label="Redes sociales">
          <a class="social social--gh" href="https://github.com/camilo55arango" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${SOCIAL_ICONS.gh}</a>
          <a class="social social--x" href="https://x.com/Soy_Breve" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">${SOCIAL_ICONS.x}</a>
          <a class="social social--ig" href="https://instagram.com/arangoypunto" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${SOCIAL_ICONS.ig}</a>
        </nav>`;

/* Debajo de la libreta: las herramientas más usadas, en este orden. */
const FEATURED = ['unir-pdf', 'editar-pdf', 'firmar-pdf', 'pdf-a-word', 'descargar-videos', 'generador-qr'];

export function homeFeatured() {
  const tools = FEATURED.map((slug) => LAB_TOOLS.find((t) => t.slug === slug)).filter(Boolean);
  return `<section class="home-block" aria-labelledby="featuredTitle">
      <h2 class="note-title" id="featuredTitle">Las más usadas</h2>
      <div class="tool-grid">${tools.map((t, i) => toolCardMarkup(t, { h: 'h3', i })).join('')}</div>
      <a class="studio-hero__more" href="/estudio/">Ver todas en el Estudio Creativo <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></a>
    </section>`;
}

/* "Sobre mí", con la foto, la frase y las redes. */
export function homeAbout() {
  return `<section class="about home-about" id="about" aria-labelledby="aboutTitle">
      <div class="home-about__head">
        <span class="avatar home-about__avatar">
          <img src="/assets/img/perfil.webp" alt="Foto de Camilo Arango" width="72" height="72" loading="lazy" />
          <span class="avatar__fallback" aria-hidden="true">CA</span>
        </span>
        <h2 class="note-title" id="aboutTitle">Sobre mí</h2>
      </div>
      <p class="about__quote">Demasiado cuerdo para ser artista, <br> demasiado loco para ser normal.</p>
      <p>Soy Camilo, estudiante de Ingeniería de Sistemas 🧑🏼‍💻. Aquí reúno las herramientas que construyo y los recursos que uso para crear, aprender y programar con IA.</p>
      ${socials()}
    </section>`;
}

export function homeBook() {
  const pages = [];
  const add = (opts) => { pages.push(opts); return pages.length - 1; };
  const index = [];
  const marks = [];
  const chapter = (at, { title, mark, color, href }) => {
    index.push({ title, at, color, href });
    marks.push({ label: mark, at, color, href });
  };

  /* 0 · Tapa */
  add({ hard: true, cls: 'nb-cover', body: `
        <span class="nb-cover__band" aria-hidden="true"></span>
        <div class="nb-cover__label">
          <span class="nb-cover__kicker">Cuaderno de</span>
          <h1 class="nb-cover__title">ArangoCode</h1>
          <p class="nb-cover__sub">Herramientas gratis que funcionan en tu navegador</p>
        </div>
        <p class="nb-cover__hint">ábreme ${DOODLES.arrow}</p>
        <p class="nb-cover__seal">Gratis · Sin registro · Privado</p>` });

  /* 1 · Hola (izquierda) · 2 · Índice (derecha, se completa al final) */
  add({ id: 'hola', body: `
        <figure class="nb-polaroid">
          <img src="/assets/img/perfil.webp" alt="Foto de Camilo Arango" width="112" height="112" loading="lazy" />
          <figcaption>yo, programando</figcaption>
        </figure>
        <h2 class="nb-hand nb-hello">¡Hola! Soy Camilo</h2>
        <p>Estudio Ingeniería de Sistemas y en esta libreta guardo las herramientas que construyo.</p>
        <p><mark>Todas funcionan dentro de tu navegador:</mark> tus archivos nunca salen de tu dispositivo.</p>
        <p class="nb-note">¿Por qué es gratis? No pago servidores que procesen tus archivos, así que no necesito cobrarte ni mostrarte anuncios.</p>` });
  const indexAt = add({ id: 'indice', body: '' });

  /* Capítulos de herramientas: título a la izquierda (página impar), herramientas a la derecha. */
  for (const ch of CHAPTERS) {
    const tools = ch.tools.map((slug) => LAB_TOOLS.find((t) => t.slug === slug)).filter(Boolean);
    const at = add({ id: `cap-${ch.id}`, cls: 'nb-chapter', body: `
        <span class="nb-chapter__tag" style="--tool:${ch.color}">Capítulo</span>
        <h2 class="nb-hand nb-chapter__title">${esc(ch.title)}</h2>
        ${DOODLES[ch.doodle]}
        <p>${esc(ch.intro)}</p>
        <p class="nb-note">${tools.length} herramientas →</p>` });
    add({ cls: 'nb-toolpage', body: toolsPage(tools) });
    chapter(at, { title: ch.title, mark: ch.mark, color: ch.color, href: `#cap-${ch.id}` });
  }

  /* Más recursos: directorios a la derecha, junto con cómo funciona la privacidad. */
  const count = { dev: `${DEV_TOOLS.length} enlaces`, ia: `${AI_TOOLS.length} enlaces`, prompts: `${PROMPTS.length} prompts` };
  const more = add({ id: 'recursos', cls: 'nb-chapter', body: `
        <span class="nb-chapter__tag" style="--tool:#8b7cf6">Capítulo</span>
        <h2 class="nb-hand nb-chapter__title">Más recursos</h2>
        ${DOODLES.recursos}
        <p>Directorios con las mejores herramientas e IA, y prompts listos para copiar.</p>
        <p class="nb-note">Pasa al lado →</p>` });
  add({ cls: 'nb-toolpage', body: `
        <ul class="nb-dirs">${SECTIONS.map((s) => `
          <li><a href="${VIEW_PATH[s.id]}" style="--tool:${s.color}"><b>${esc(s.title)}</b><small>${count[s.id]}</small></a></li>`).join('')}
        </ul>
        <a class="nb-link" href="/estudio/">Ver las ${READY_TOOLS.length} herramientas del Estudio Creativo →</a>` });
  chapter(more, { title: 'Más recursos', mark: 'Recursos', color: '#8b7cf6', href: '#recursos' });

  /* Tu espacio: notas para escribir (izquierda) y una hoja para dibujar (derecha). Todo queda en el navegador. */
  const write = add({ id: 'notas', cls: 'nb-write-page', body: `
        <h2 class="nb-hand">Tus notas</h2>
        <p class="nb-note">Escribe lo que quieras: se guarda solo en tu navegador.</p>
        <textarea class="nb-write" id="notesText" spellcheck="true" aria-label="Tus notas"
          placeholder="Una idea, una lista de pendientes, un número que no quieres olvidar…"></textarea>
        <div class="nb-write__bar">
          <span class="nb-write__saved" id="notesSaved" aria-live="polite"></span>
          <button type="button" class="nb-draw__clear" id="notesTextClear">Borrar</button>
        </div>` });
  chapter(write, { title: 'Tus notas', mark: 'Notas', color: '#e0484b', href: '#notas' });

  const draw = add({ id: 'dibujo', cls: 'nb-notes', body: `
        <h2 class="nb-hand">Tu página</h2>
        <p class="nb-note">Dibuja lo que quieras: también se queda en tu navegador.</p>
        <div class="nb-draw">
          <canvas id="notesCanvas" aria-label="Página en blanco para dibujar"></canvas>
          <div class="nb-draw__tools" role="group" aria-label="Lápices">
            <button type="button" class="nb-pen is-active" data-color="#1f2a44" aria-label="Lápiz azul oscuro"></button>
            <button type="button" class="nb-pen" data-color="#e5484d" aria-label="Lápiz rojo"></button>
            <button type="button" class="nb-pen" data-color="#2f9e6e" aria-label="Lápiz verde"></button>
            <button type="button" class="nb-pen" data-color="#f2b84b" aria-label="Resaltador amarillo"></button>
            <button type="button" class="nb-draw__clear" id="notesClear">Borrar</button>
          </div>
        </div>` });
  chapter(draw, { title: 'Tu página para dibujar', mark: 'Dibuja', color: '#f2b84b', href: '#dibujo' });

  /* Al final: ¿Cómo que no se sube? Título y dibujo a la izquierda, la explicación a la derecha. */
  const privacy = add({ id: 'privacidad', cls: 'nb-chapter', body: `
        <span class="nb-chapter__tag" style="--tool:#38c793">Privacidad</span>
        <h2 class="nb-hand nb-chapter__title">¿Cómo que no se sube?</h2>
        ${DOODLES.privacidad}
        <p class="nb-note">Pasa al lado →</p>` });
  add({ cls: 'nb-toolpage', body: `
        <p>Las páginas normales envían tu archivo a un servidor, lo procesan allá y te lo devuelven.</p>
        <p>Aquí el "servidor" es <b>tu propio navegador</b>: tus archivos se procesan en tu equipo y nunca viajan por internet.</p>
        <div class="net" id="net" data-online="true">
          <span class="net__dot" aria-hidden="true"></span>
          <p id="netText" aria-live="polite">Pruébalo: usa una herramienta, apaga el WiFi y vuelve a usarla.</p>
        </div>
        <a class="nb-link" href="/privacidad/">Cómo protegemos tu privacidad →</a>` });
  chapter(privacy, { title: '¿Cómo que no se sube?', mark: 'Privacidad', color: '#38c793', href: '#privacidad' });

  /* Con la tapa sola al principio y al final, el interior debe tener un número par de páginas. */
  if ((pages.length - 1) % 2) add({ cls: 'nb-blank', body: '<p class="nb-hand nb-blank__text">Esta página la dejé en blanco a propósito ;)</p>' });

  /* Contratapa */
  add({ hard: true, cls: 'nb-back', body: `
        <p class="nb-hand nb-back__thanks">¡Gracias por pasar!</p>
        <p>¿Se te ocurre una herramienta o encontraste un error? Escríbeme.</p>
        ${socials()}
        <p class="nb-back__links"><a href="/contacto/">Contacto</a> · <a href="/privacidad/">Privacidad</a> · <a href="/terminos/">Términos</a></p>` });

  pages[indexAt].body = `
        <h2 class="nb-hand">Índice</h2>
        <ol class="nb-index">${index.map((it) => `
          <li><a href="${it.href}" data-goto="${it.at}" style="--tool:${it.color}"><span>${esc(it.title)}</span><i aria-hidden="true"></i><b>${it.at}</b></a></li>`).join('')}
        </ol>
        <p class="nb-note">Toca un capítulo para ir directo, o arrastra la esquina de la hoja.</p>`;

  const book = pages.map((pg, i) => page({ ...pg, n: pg.hard ? 0 : i })).join('\n    ');
  const bookmarks = marks.map((m, i) => `<a class="nb-mark" href="${m.href}" data-goto="${m.at}" style="--tool:${m.color};--i:${i}">${esc(m.label)}</a>`).join('');
  return { book, bookmarks, pages: pages.length };
}
