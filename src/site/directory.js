/*
 * Páginas de directorio (/herramientas/, /ia/, /prompts/, /guardados/). vite.config.js sustituye
 * <!--dir:head--> y <!--dir:body--> según <body data-view>, con las tarjetas ya escritas en el HTML
 * para que se indexen sin JS. Después assets/js/app.js toma el control (filtros, favoritos, prompts).
 */

import { SECTIONS, DEV_TOOLS, AI_TOOLS, PROMPTS, LAST_UPDATED } from '../../assets/js/data.js';
import { cardMarkup, esc, VIEW_PATH } from '../../assets/js/cards.js';
import { SITE } from '../lab/tools.js';

const DATA = { dev: DEV_TOOLS, ia: AI_TOOLS, prompts: PROMPTS };

const PAGES = {
  dev: {
    title: 'Directorio de herramientas para programar | ArangoCode',
    desc: `Directorio curado de ${DEV_TOOLS.length} herramientas para construir software: editores, frameworks, bases de datos, testing y despliegue, todas con plan gratuito.`
  },
  ia: {
    title: 'Directorio de IA 2026: las mejores inteligencias artificiales | ArangoCode',
    desc: `Las ${AI_TOOLS.length} mejores IA organizadas por lo que necesitas: chat, programar, crear imágenes, video, audio y música.`
  },
  prompts: {
    title: 'Prompts listos para copiar en ChatGPT, Claude y Gemini | ArangoCode',
    desc: `${PROMPTS.length} prompts completos y probados para resúmenes, código, imágenes, video y análisis. Rellena los campos y cópialos con un clic.`
  },
  favoritos: {
    title: 'Mis guardados | ArangoCode',
    desc: 'Las herramientas, IA y prompts que guardaste con la estrella, en un solo lugar.'
  }
};

const viewOf = (html) => html.match(/<body[^>]*data-view="([^"]+)"/)?.[1];

const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function head(view) {
  const page = PAGES[view];
  const url = `${SITE}${VIEW_PATH[view]}`;
  const items = DATA[view] ?? [];
  const section = SECTIONS.find((s) => s.id === view);
  const ld = section ? jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: section.title, url, description: page.desc, inLanguage: 'es' },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [['ArangoCode', `${SITE}/`], [section.title, url]].map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item }))
      },
      {
        '@type': 'ItemList',
        name: section.title,
        itemListElement: items.map((it, i) => ({
          '@type': 'ListItem', position: i + 1, name: it.name,
          url: it.url ?? `${SITE}${VIEW_PATH.prompts}?prompt=${encodeURIComponent(it.name)}`
        }))
      }
    ]
  }) : '';

  return `<title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.desc)}" />
  <link rel="canonical" href="${url}" />${view === 'favoritos' ? '\n  <meta name="robots" content="noindex" />' : ''}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ArangoCode" />
  <meta property="og:locale" content="es_CO" />
  <meta property="og:title" content="${esc(page.title)}" />
  <meta property="og:description" content="${esc(page.desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/og/${view}.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(page.title)}" />
  <meta name="twitter:description" content="${esc(page.desc)}" />
  <meta name="twitter:image" content="${SITE}/og/${view}.png" />
  ${ld}`;
}

function tabs(view) {
  const tab = (s) => `<a class="tab${s.id === view ? ' is-active' : ''}" href="${VIEW_PATH[s.id]}" style="--tab:${s.color}"${s.id === view ? ' aria-current="page"' : ''}>${esc(s.short)}</a>`;
  return `<nav class="tabs" aria-label="Secciones">
      <a class="tab tab--studio" href="/estudio/">Estudio Creativo</a>
      ${SECTIONS.map(tab).join('\n      ')}
    </nav>`;
}

function body(view) {
  const section = SECTIONS.find((s) => s.id === view);
  const items = DATA[view] ?? [];
  const title = section ? section.title : 'Mis guardados';
  const desc = section ? section.pageDesc : 'Todo lo que marcaste con ★ en los directorios y los prompts, en un solo lugar.';
  const meta = section ? `Catálogo revisado: ${LAST_UPDATED} · Verifica precios y condiciones antes de elegir.` : '';
  const cards = items.length
    ? `<div class="grid-items">${items.map((it, i) => cardMarkup(it, i, view)).join('')}</div>`
    : '<div class="empty"><strong>Aún no guardas nada</strong>Toca la ★ en cualquier herramienta o prompt para agregarlo aquí.</div>';

  return `<a class="skip-link" href="#content">Saltar al contenido</a>
  <div class="bg-fx" aria-hidden="true"></div>

  <div class="top-actions">
    <a class="top-actions__btn" id="favoritesToggle" href="${VIEW_PATH.favoritos}" aria-label="Mis guardados"${view === 'favoritos' ? ' aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.3l-6.16 3.6 1.64-7L2 9.3l7.1-.6L12 2.2l2.9 6.5 7.1.6-5.48 4.6 1.64 7z"/></svg>
      <span class="top-actions__count" id="favoritesCount" hidden>0</span>
    </a>
    <button class="top-actions__btn" id="cmdPaletteToggle" type="button" aria-label="Buscar en todo el sitio (Ctrl/Cmd + K)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
    </button>
    <button class="top-actions__btn theme-toggle" id="themeToggle" type="button" aria-label="Cambiar tema">
      <svg class="ico-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><g><path d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1"/></g></svg>
      <svg class="ico-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.7 8.7 0 1 0 11.1 11.1z"/></svg>
    </button>
  </div>

  <main class="shell">
    <header class="profile" id="profile">
      <a class="profile__back" href="/" aria-label="Volver al inicio">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
        <span>Inicio</span>
      </a>
      <div class="profile__id">
        <div class="avatar">
          <img id="avatarImg" src="/assets/img/perfil.webp" alt="Foto de Camilo Arango" width="56" height="56" />
          <span class="avatar__fallback" aria-hidden="true">CA</span>
        </div>
        <div>
          <p class="profile__name">Camilo Arango</p>
          <p class="profile__brand"><span class="dot"></span>ArangoCode</p>
        </div>
      </div>
    </header>

    ${tabs(view)}

    <section class="view-head" id="viewHead">
      <h1 class="view-head__title" id="viewTitle">${esc(title)}</h1>
      <p class="view-head__desc" id="viewDesc">${esc(desc)}</p>
      <p class="view-head__meta" id="viewMeta">${esc(meta)}</p>
      <div class="chips" id="chips" role="tablist" aria-label="Filtrar por categoría"></div>
      <div class="quick-filters" id="quickFilters" aria-label="Filtros rápidos"></div>
      <div class="search-wrap">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input type="search" id="searchInput" placeholder="Buscar..." aria-label="Buscar" autocomplete="off" />
      </div>
      <div class="view-head__actions">
        <a class="text-link" id="suggestLink" href="/contacto/" target="_blank" rel="noopener noreferrer">+ Sugerir herramienta</a>
        <button class="text-link shortcuts-link" id="shortcutsToggle" type="button">Atajos de teclado</button>
      </div>
    </section>

    <section class="content" id="content" aria-live="polite">${cards}</section>

    <!--site:footer-->
  </main>

  <div class="modal" id="modal" hidden>
    <div class="modal__backdrop" data-close></div>
    <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDesc" tabindex="-1">
      <button class="modal__close" type="button" data-close aria-label="Cerrar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <span class="modal__tag" id="modalTag"></span>
      <h2 class="modal__title" id="modalTitle"></h2>
      <p class="modal__desc" id="modalDesc"></p>
      <div class="modal__vars" id="modalVars" hidden></div>
      <div class="modal__codewrap">
        <pre class="modal__code" id="modalCode" contenteditable="true" spellcheck="false" aria-label="Prompt editable"></pre>
      </div>
      <div class="modal__actions">
        <button class="btn btn--primary" type="button" id="copyBtn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>
          <span id="copyLabel">Copiar prompt</span>
        </button>
        <button class="btn btn--ghost" type="button" id="shareBtn">Compartir</button>
        <button class="btn btn--ghost" type="button" data-close>Cerrar</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>

  <button class="back-to-top" id="backToTop" type="button" aria-label="Volver arriba" hidden>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </button>

  <div class="cmdk" id="cmdPalette" hidden>
    <div class="cmdk__backdrop" data-close-cmdk></div>
    <div class="cmdk__box" role="dialog" aria-modal="true" aria-label="Buscar en todo el sitio">
      <div class="cmdk__search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input type="search" id="cmdkInput" placeholder="Busca en el Estudio, los directorios o los prompts…" aria-label="Buscar en todo el sitio" autocomplete="off" />
        <kbd>Esc</kbd>
      </div>
      <div class="cmdk__results" id="cmdkResults"></div>
    </div>
  </div>

  <div class="modal" id="shortcutsModal" hidden>
    <div class="modal__backdrop" data-close></div>
    <div class="modal__box modal__box--sm" role="dialog" aria-modal="true" aria-labelledby="shortcutsTitle" tabindex="-1">
      <button class="modal__close" type="button" data-close aria-label="Cerrar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <h2 class="modal__title" id="shortcutsTitle">Atajos de teclado</h2>
      <ul class="shortcuts-list">
        <li><kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd><span>Buscar en todo el sitio</span></li>
        <li><kbd>/</kbd><span>Enfocar el buscador de la sección</span></li>
        <li><kbd>?</kbd><span>Mostrar esta ayuda</span></li>
        <li><kbd>Esc</kbd><span>Cerrar ventana o modal abierto</span></li>
        <li><kbd>Enter</kbd><span>Abrir prompt seleccionado</span></li>
      </ul>
    </div>
  </div>`;
}

/** Sustituye <!--dir:head--> y <!--dir:body--> en las páginas con <body data-view>. */
export function renderDirectory(html) {
  const view = viewOf(html);
  if (!view || !PAGES[view]) return html;
  return html.replace('<!--dir:head-->', head(view)).replace('<!--dir:body-->', body(view));
}

export const DIRECTORY_VIEWS = Object.keys(PAGES);
