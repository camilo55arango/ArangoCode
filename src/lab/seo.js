/*
 * SEO estático del Estudio Creativo. vite.config.js lo usa en transformIndexHtml para escribir en el
 * HTML (no con JS en el navegador) las metaetiquetas, el JSON-LD, la guía de uso y las preguntas frecuentes.
 */

import { SITE, READY_TOOLS, LAB_SECTION, toolGridMarkup } from './tools.js';
import { homeBook, homeFeatured, homeAbout } from '../site/home.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const toolUrl = (t) => `${SITE}/estudio/${t.slug}`;

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item }))
});

const itemList = () => ({
  '@type': 'ItemList',
  name: LAB_SECTION.title,
  itemListElement: READY_TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: toolUrl(t) }))
});

function social({ title, desc, url, image }) {
  return `
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ArangoCode" />
  <meta property="og:locale" content="es_CO" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="og:image" content="${SITE}/og/${image}.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${SITE}/og/${image}.png" />`;
}

export function toolHead(t) {
  const title = `${t.seoTitle} | Estudio Creativo`;
  const url = toolUrl(t);
  return `<title>${esc(title)}</title>
  <meta name="description" content="${esc(t.seoDesc)}" />
  <link rel="canonical" href="${url}" />${social({ title, desc: t.seoDesc, url, image: t.slug })}
  ${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: t.name,
        url,
        description: t.seoDesc,
        applicationCategory: { Audio: 'MultimediaApplication', Documentos: 'BusinessApplication' }[t.cat] ?? 'UtilitiesApplication',
        operatingSystem: 'Cualquiera (navegador web)',
        browserRequirements: t.model ? 'Requiere un navegador moderno con WebAssembly; WebGPU opcional' : 'Requiere un navegador moderno con WebAssembly',
        inLanguage: 'es',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Person', name: 'Camilo Arango', url: `${SITE}/` }
      },
      crumbs([['ArangoCode', `${SITE}/`], [LAB_SECTION.title, `${SITE}/estudio/`], [t.name, url]]),
      {
        '@type': 'FAQPage',
        mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
      }
    ]
  })}`;
}

export function toolInfo(t) {
  return `
    <section class="lab-info" aria-labelledby="how-title">
      <h2 class="note-title" id="how-title">Cómo funciona</h2>
      <ol class="lab-steps">${t.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
    </section>

    <section class="lab-info" aria-labelledby="faq-title">
      <h2 class="note-title" id="faq-title">Preguntas frecuentes</h2>
      <div class="lab-faq">${t.faq.map(([q, a]) => `
        <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
      </div>
    </section>

    <section class="lab-info" aria-labelledby="more-title">
      <h2 class="note-title" id="more-title">Otras herramientas del Estudio</h2>
      ${toolGridMarkup({ h: 'h3', upcoming: false, exclude: t.slug })}
    </section>`;
}

export function studioJsonLd() {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: LAB_SECTION.title,
        url: `${SITE}/estudio/`,
        description: LAB_SECTION.desc,
        inLanguage: 'es'
      },
      crumbs([['ArangoCode', `${SITE}/`], [LAB_SECTION.title, `${SITE}/estudio/`]]),
      itemList()
    ]
  });
}

export function homeJsonLd() {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'ArangoCode',
        url: `${SITE}/`,
        inLanguage: 'es',
        description: 'Herramientas gratis para PDF, imágenes, audio y texto que funcionan en tu navegador sin subir tus archivos, además de directorios de herramientas e IA y prompts listos para usar.'
      },
      {
        '@type': 'Person',
        name: 'Camilo Arango',
        alternateName: 'ArangoCode',
        url: `${SITE}/`,
        image: `${SITE}/assets/img/perfil.webp`,
        jobTitle: 'Estudiante de Ingeniería de Sistemas',
        sameAs: ['https://github.com/camilo55arango', 'https://x.com/Soy_Breve', 'https://instagram.com/arangoypunto']
      },
      itemList()
    ]
  });
}

/** Pie común de todas las páginas; el año lo rellena el JS de cada página en #year. */
export const siteFooter = () => `<footer class="footer">
      <p>&copy; <span id="year"></span> ArangoCode · Camilo Arango</p>
      <nav class="footer__links" aria-label="Información del sitio">
        <a href="/privacidad/">Privacidad</a><a href="/terminos/">Términos</a><a href="/contacto/">Contacto</a>
      </nav>
    </footer>`;

/* Secciones del menú de post-its, el mismo en todas las páginas. */
const NAV = [
  ['estudio', '/estudio/', 'Estudio Creativo', '#ffe27a'],
  ['dev', '/herramientas/', 'Directorio de herramientas', '#b9e3ff'],
  ['ia', '/ia/', 'Directorio de IA', '#ffc2d6'],
  ['prompts', '/prompts/', 'Prompts', '#c6f0c2']
];

const BACK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';

/**
 * Barra superior de todas las páginas: foto + "ArangoCode" y el menú de post-its, con la sección actual marcada.
 * `back` añade el botón "Volver" fijo (src/lab/shell.js y assets/js/app.js lo hacen volver a la página anterior).
 * En la portada, "Buscar" abre el buscador; en las demás páginas lleva a la portada con el buscador abierto.
 */
export function siteHeader({ active = '', back = null, home = false } = {}) {
  const links = NAV.map(([id, href, label, color]) =>
    `<a class="postit" href="${href}" style="--note:${color}"${id === active ? ' aria-current="page"' : ''}>${label}</a>`).join('\n        ');
  const search = home
    ? '<button class="postit postit--search" type="button" id="searchOpen" style="--note:#fff4e0" aria-label="Buscar (Ctrl+K)">'
    : '<a class="postit postit--search" href="/#buscar" style="--note:#fff4e0" aria-label="Buscar en el sitio">';
  const searchEnd = home ? '</button>' : '</a>';
  const backLink = back
    ? `<a class="lab-back" href="${back.href}" data-back aria-label="${back.label}">${BACK_ICON}<span>Volver</span></a>\n    `
    : '';
  return `${backLink}<header class="site-header${back ? ' site-header--back' : ''}">
      <a class="site-brand" href="/" aria-label="ArangoCode, inicio">
        <span class="avatar site-brand__avatar">
          <img id="avatarImg" src="/assets/img/perfil.webp" alt="" width="44" height="44" />
          <span class="avatar__fallback" aria-hidden="true">CA</span>
        </span>
        <span>ArangoCode</span>
      </a>
      <nav class="postits" aria-label="Secciones">
        ${links}
        ${search}<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span>Buscar</span>${searchEnd}
      </nav>
    </header>`;
}

/**
 * Páginas con ruta (herramientas, Estudio, privacidad…): la barra común encima de la ruta, y "Volver".
 * Sin historial, "Volver" lleva a la página de arriba: de una herramienta al Estudio, del resto a la portada.
 */
function withHeader(html, tool) {
  const studio = Boolean(tool) || html.includes('<span aria-current="page">Estudio Creativo</span>');
  const back = tool
    ? { href: '/estudio/', label: 'Volver al Estudio Creativo' }
    : { href: '/', label: 'Volver al inicio' };
  return html.replace('<nav class="lab-crumbs" aria-label="Ruta">',
    `${siteHeader({ active: studio ? 'estudio' : '', back })}
    <nav class="lab-crumbs" aria-label="Ruta">`);
}

/** Sustituye los marcadores <!--seo:*-->, <!--estudio:*--> y <!--site:*--> de cada HTML. */
export function renderPlaceholders(html) {
  const slug = html.match(/<body[^>]*data-tool="([^"]+)"/)?.[1];
  const tool = slug && READY_TOOLS.find((t) => t.slug === slug);
  return withHeader(html, tool)
    .replace('<!--site:header:home-->', () => siteHeader({ home: true }))
    .replace(/<!--site:header:(\w+)-->/, (_, view) => siteHeader({ active: view, back: { href: '/', label: 'Volver al inicio' } }))
    .replace('<!--site:footer-->', siteFooter())
    .replace('<!--seo:tool-head-->', tool ? toolHead(tool) : '')
    .replace('<!--seo:tool-info-->', tool ? toolInfo(tool) : '')
    .replace('<!--seo:studio-->', studioJsonLd())
    .replace('<!--seo:home-->', homeJsonLd())
    .replace('<!--estudio:grid-->', toolGridMarkup({ h: 'h2' }))
    .replace('<!--home:book-->', () => homeBook().book)
    .replace('<!--home:marks-->', () => homeBook().bookmarks)
    .replace('<!--home:featured-->', homeFeatured)
    .replace('<!--home:about-->', homeAbout);
}
