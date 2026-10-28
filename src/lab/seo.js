/*
 * SEO estático del Estudio Creativo. vite.config.js lo usa en transformIndexHtml para escribir en el
 * HTML (no con JS en el navegador) las metaetiquetas, el JSON-LD, la guía de uso y las preguntas frecuentes.
 */

import { SITE, READY_TOOLS, LAB_SECTION, toolGridMarkup, toolCardMarkup } from './tools.js';
import { SECTIONS, DEV_TOOLS, AI_TOOLS, PROMPTS } from '../../assets/js/data.js';
import { VIEW_PATH } from '../../assets/js/cards.js';

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

/* Portada: las herramientas que más se buscan, en este orden (las que aún no existan se saltan). */
const FEATURED = ['quitar-fondo', 'comprimir-pdf', 'pdf-a-word', 'editar-pdf', 'unir-pdf', 'imagen-a-pdf', 'audio-a-texto', 'comprimir-imagen', 'imagen-a-texto'];

function homeFeatured() {
  const tools = FEATURED.map((slug) => READY_TOOLS.find((t) => t.slug === slug)).filter(Boolean).slice(0, 6);
  return `<div class="tool-grid">${tools.map((t, i) => toolCardMarkup(t, { h: 'h3', i })).join('')}</div>`;
}

function homeSections() {
  const count = { dev: `${DEV_TOOLS.length} enlaces`, ia: `${AI_TOOLS.length} enlaces`, prompts: `${PROMPTS.length} prompts` };
  return `<ul class="home-dirs">${SECTIONS.map((s, i) => `
        <li style="--tab:${s.color};--i:${i}">
          <a class="home-dir" href="${VIEW_PATH[s.id]}">
            <span class="home-dir__icon" aria-hidden="true">${s.icon}</span>
            <span class="home-dir__title">${esc(s.title)}</span>
            <span class="home-dir__desc">${esc(s.desc)}</span>
            <span class="home-dir__count">${count[s.id]} →</span>
          </a>
        </li>`).join('')}
      </ul>`;
}

/** Sustituye los marcadores <!--seo:*-->, <!--estudio:*--> y <!--site:*--> de cada HTML. */
export function renderPlaceholders(html) {
  const slug = html.match(/<body[^>]*data-tool="([^"]+)"/)?.[1];
  const tool = slug && READY_TOOLS.find((t) => t.slug === slug);
  return html
    .replace('<!--site:footer-->', siteFooter())
    .replace('<!--seo:tool-head-->', tool ? toolHead(tool) : '')
    .replace('<!--seo:tool-info-->', tool ? toolInfo(tool) : '')
    .replace('<!--seo:studio-->', studioJsonLd())
    .replace('<!--seo:home-->', homeJsonLd())
    .replace('<!--estudio:grid-->', toolGridMarkup({ h: 'h2' }))
    .replace('<!--home:featured-->', homeFeatured())
    .replace('<!--home:sections-->', homeSections())
    .replaceAll('<!--home:count-->', String(READY_TOOLS.length));
}
