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
import { BLOG } from './blog.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Capítulos de herramientas, en el orden del catálogo. */
const CHAPTERS = [
  { id: 'pdf', title: 'Documentos PDF', color: '#e5484d', cats: ['Documentos'],
    intro: 'Edita, firma, comprime, une o separa tus PDF, y pásalos a Word o a imagen. Sin subirlos a ningún lado.' },
  { id: 'imagen', title: 'Fotos e imágenes', color: '#f08a5d', cats: ['Imagen', 'Experimental'],
    intro: 'Quita fondos, cambia formatos, reduce el peso o saca el texto de una foto. La IA corre en tu propio equipo.' },
  { id: 'audio', title: 'Audio y texto', color: '#4dd4f0', cats: ['Audio', 'Texto'],
    intro: 'Convierte tu voz en texto, traduce sin enviar nada a internet y crea códigos QR.' }
];

const PER_PAGE = 5;
const toolsOf = (ch) => READY_TOOLS.filter((t) => ch.cats.includes(t.cat));
const chunk = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));

function toolRow(t) {
  return `<a class="nb-tool" href="/estudio/${t.slug}" style="--tool:${t.color}">
          <svg class="nb-tool__icon" viewBox="0 0 64 56" aria-hidden="true">${ICONS[t.slug] ?? ''}</svg>
          <span class="nb-tool__text"><b>${esc(t.name)}</b><small>${esc(t.desc)}</small></span>
          <span class="nb-tool__go" aria-hidden="true">abrir →</span>
        </a>`;
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
  const marks = [];

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

  /* 1 · Hola */
  add({ id: 'hola', body: `
        <figure class="nb-polaroid">
          <img src="/assets/img/perfil.webp" alt="Foto de Camilo Arango" width="112" height="112" loading="lazy" />
          <figcaption>yo, programando</figcaption>
        </figure>
        <h2 class="nb-hand nb-hello">¡Hola! Soy Camilo</h2>
        <p>Estudio Ingeniería de Sistemas y en esta libreta guardo las herramientas que construyo.</p>
        <p><mark>Todas funcionan dentro de tu navegador:</mark> tus archivos nunca salen de tu dispositivo.</p>
        <p class="nb-note">¿Por qué es gratis? No pago servidores que procesen tus archivos, así que no necesito cobrarte ni mostrarte anuncios.</p>` });

  /* 2 · Índice (se completa al final, cuando se conocen las páginas) */
  const indexAt = add({ id: 'indice', body: '' });

  /* Capítulos de herramientas */
  const index = [];
  for (const ch of CHAPTERS) {
    const tools = toolsOf(ch);
    const start = add({ id: `cap-${ch.id}`, cls: 'nb-chapter', body: `
        <span class="nb-chapter__tag" style="--tool:${ch.color}">Capítulo</span>
        <h2 class="nb-hand nb-chapter__title">${esc(ch.title)}</h2>
        ${DOODLES[ch.id]}
        <p>${esc(ch.intro)}</p>
        <p class="nb-note">${tools.length} herramientas · pasa la página →</p>` });
    chunk(tools, PER_PAGE).forEach((list, i) => add({ body: `
        ${i ? `<p class="nb-cont">${esc(ch.title)} (sigue)</p>` : ''}
        <div class="nb-tools">${list.map(toolRow).join('')}</div>` }));
    index.push({ title: ch.title, at: start, color: ch.color, href: `#cap-${ch.id}` });
    marks.push({ label: ch.title.split(' ')[0], at: start, color: ch.color, href: `#cap-${ch.id}` });
  }

  /* ¿Cómo que no se sube? */
  const privacy = add({ id: 'privacidad', body: `
        <h2 class="nb-hand">¿Cómo que no se sube?</h2>
        ${DOODLES.privacidad}
        <p>Las páginas normales envían tu archivo a un servidor, lo procesan allá y te lo devuelven. Aquí el "servidor" es <b>tu propio navegador</b>.</p>
        <div class="net" id="net" data-online="true">
          <span class="net__dot" aria-hidden="true"></span>
          <p id="netText" aria-live="polite">Pruébalo: usa una herramienta, apaga el WiFi y vuelve a usarla.</p>
        </div>
        <a class="nb-link" href="/privacidad/">Cómo protegemos tu privacidad →</a>` });
  index.push({ title: '¿Cómo que no se sube?', at: privacy, color: '#38c793', href: '#privacidad' });
  marks.push({ label: 'Privacidad', at: privacy, color: '#38c793', href: '#privacidad' });

  /* Más recursos */
  const count = { dev: `${DEV_TOOLS.length} enlaces`, ia: `${AI_TOOLS.length} enlaces`, prompts: `${PROMPTS.length} prompts` };
  const more = add({ id: 'recursos', body: `
        <h2 class="nb-hand">Más recursos</h2>
        ${DOODLES.recursos}
        <ul class="nb-dirs">${SECTIONS.map((s) => `
          <li><a href="${VIEW_PATH[s.id]}" style="--tool:${s.color}"><b>${esc(s.title)}</b><small>${count[s.id]}</small></a></li>`).join('')}
        </ul>
        <a class="nb-link" href="/estudio/">Ver las ${READY_TOOLS.length} herramientas del Estudio →</a>` });
  index.push({ title: 'Más recursos', at: more, color: '#8b7cf6', href: '#recursos' });
  marks.push({ label: 'Recursos', at: more, color: '#8b7cf6', href: '#recursos' });

  /* Bitácora: el blog de notas (src/site/blog.js), 3 notas por hoja. */
  const BLOG_PER_PAGE = 3;
  let blogAt = -1;
  chunk(BLOG, BLOG_PER_PAGE).forEach((list, i) => {
    const at = add({ id: i ? undefined : 'blog', cls: 'nb-blog', body: `
        ${i ? '<p class="nb-cont">Bitácora (sigue)</p>' : '<h2 class="nb-hand">Bitácora</h2><p class="nb-note">Notas de lo que voy construyendo.</p>'}
        <ol class="nb-posts">${list.map((post, k) => `
          <li class="nb-post" style="--note:${post.color ?? '#ffe27a'};--k:${k}">
            <time>${esc(post.date)}</time>
            <h3>${esc(post.title)}</h3>
            <p>${esc(post.text)}</p>${post.link ? `
            <a class="nb-link" href="${post.link[0]}">${esc(post.link[1])} →</a>` : ''}
          </li>`).join('')}
        </ol>` });
    if (!i) blogAt = at;
  });
  index.push({ title: 'Bitácora', at: blogAt, color: '#e0484b', href: '#blog' });
  marks.push({ label: 'Blog', at: blogAt, color: '#e0484b', href: '#blog' });

  /* Página para dibujar */
  const notes = add({ id: 'notas', cls: 'nb-notes', body: `
        <h2 class="nb-hand">Tu página</h2>
        <p class="nb-note">Dibuja lo que quieras: se queda guardado en tu navegador.</p>
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
  index.push({ title: 'Tu página para dibujar', at: notes, color: '#f2b84b', href: '#notas' });
  marks.push({ label: 'Dibuja', at: notes, color: '#f2b84b', href: '#notas' });

  /* Con la tapa sola al principio y al final, el interior debe tener un número par de páginas. */
  if ((pages.length - 1) % 2) add({ cls: 'nb-blank', body: '<p class="nb-hand nb-blank__text">Esta página la dejé en blanco a propósito ;)</p>' });

  /* Contratapa */
  add({ hard: true, cls: 'nb-back', body: `
        <p class="nb-hand nb-back__thanks">¡Gracias por pasar!</p>
        <p>¿Se te ocurre una herramienta o encontraste un error? Escríbeme.</p>
        ${socials()}
        <p class="nb-back__links"><a href="/contacto/">Contacto</a> · <a href="/privacidad/">Privacidad</a> · <a href="/terminos/">Términos</a></p>` });

  /* Ahora sí, el índice con el número de página de cada capítulo. */
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
