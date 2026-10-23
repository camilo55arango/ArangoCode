import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { READY_TOOLS } from './src/lab/tools.js';
import { renderPlaceholders } from './src/lab/seo.js';

const root = import.meta.dirname;
const ESTUDIO_PAGES = ['index', ...READY_TOOLS.map((t) => t.slug)];

/** Escribe en el HTML las metaetiquetas, el JSON-LD y las fichas del Estudio (ver src/lab/seo.js). */
const estudioSeo = {
  name: 'estudio-seo',
  transformIndexHtml: { order: 'pre', handler: renderPlaceholders }
};

/**
 * Cloudflare rechaza archivos de más de 25 MiB. Los .wasm de ONNX Runtime (25–27 MiB) se emiten por
 * referencias `new URL()`, pero en ejecución Transformers.js y runonweb/ocr los descargan de jsDelivr
 * (`wasmPaths`), así que sobran en dist/.
 */
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
  plugins: [estudioSeo, omitOversizedAssets],
  build: {
    // Los JS/CSS con hash van a /_app para no chocar con public/assets/img.
    assetsDir: '_app',
    target: 'es2022',
    rolldownOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...Object.fromEntries(ESTUDIO_PAGES.map((p) => [`estudio-${p}`, resolve(root, `estudio/${p}.html`)]))
      }
    }
  },
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    // Igual que runonweb: estas librerías cargan sus .wasm por URL y no deben pre-empaquetarse.
    // runonweb publica .ts sin compilar: el pre-empaquetado lo leería como JS.
    exclude: [
      'runonweb', '@huggingface/transformers', 'onnxruntime-web', 'paddleocr', 'phonemizer',
      // jSquash resuelve sus .wasm con `new URL(..., import.meta.url)`.
      '@jsquash/jpeg', '@jsquash/webp', '@jsquash/avif', '@jsquash/oxipng'
    ]
  },
  server: {
    // En desarrollo aislamos todo el sitio para probar WASM multihilo en /estudio.
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless'
    }
  }
});
