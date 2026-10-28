import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { READY_TOOLS, SITE } from './src/lab/tools.js';
import { renderPlaceholders } from './src/lab/seo.js';
import { renderDirectory } from './src/site/directory.js';

const root = import.meta.dirname;
const ESTUDIO_PAGES = ['index', ...READY_TOOLS.map((t) => t.slug)];
/* Páginas sueltas de la raíz, cada una en su carpeta (/privacidad/, /terminos/…). */
const SITE_PAGES = ['privacidad', 'terminos', 'contacto', 'herramientas', 'ia', 'prompts', 'guardados'];

const estudioSeo = {
  name: 'estudio-seo',
  // Primero el directorio: su cuerpo trae marcadores (<!--site:footer-->) que resuelve renderPlaceholders.
  transformIndexHtml: { order: 'pre', handler: (html) => renderPlaceholders(renderDirectory(html)) }
};


/* sitemap.xml sale del catálogo en cada build, así nunca se queda atrás cuando se añade una herramienta. */
const sitemap = {
  name: 'sitemap',
  apply: 'build',
  generateBundle() {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [
      ['/', 'weekly', '1.0'],
      ['/estudio/', 'weekly', '1.0'],
      ...READY_TOOLS.map((t) => [`/estudio/${t.slug}`, 'monthly', '0.9']),
      ['/herramientas/', 'weekly', '0.7'],
      ['/ia/', 'weekly', '0.7'],
      ['/prompts/', 'weekly', '0.7'],
      ['/privacidad/', 'yearly', '0.3'],
      ['/terminos/', 'yearly', '0.2'],
      ['/contacto/', 'yearly', '0.3']
    ];
    const body = urls.map(([path, freq, prio]) =>
      `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>`).join('\n');
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
    });
  }
};

const CF_FILE_LIMIT = 25 * 1024 * 1024;
const omitOversizedAssets = {
  name: 'omit-oversized-assets',
  apply: 'build',
  generateBundle(_, bundle) {
    for (const [name, file] of Object.entries(bundle)) {
      const size = file.type === 'asset' ? file.source.length : file.code.length;
      if (size <= CF_FILE_LIMIT && !/ort-wasm-.*\.wasm$/.test(name)) continue;
      this.info(`omitido ${(size / 1024 / 1024).toFixed(1)} MiB: ${name}`);
      delete bundle[name];
    }
  }
};

export default defineConfig({
  plugins: [estudioSeo, sitemap, omitOversizedAssets],
  build: {
    assetsDir: '_app',
    target: 'es2022',
    rolldownOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...Object.fromEntries(SITE_PAGES.map((p) => [p, resolve(root, `${p}/index.html`)])),
        ...Object.fromEntries(ESTUDIO_PAGES.map((p) => [`estudio-${p}`, resolve(root, `estudio/${p}.html`)]))
      }
    }
  },
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    exclude: [
      'runonweb', '@huggingface/transformers', 'onnxruntime-web', 'paddleocr', 'phonemizer',
      '@jsquash/jpeg', '@jsquash/webp', '@jsquash/avif', '@jsquash/oxipng'
    ]
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    }
  }
});
