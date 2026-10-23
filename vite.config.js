import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { READY_TOOLS } from './src/lab/tools.js';
import { renderPlaceholders } from './src/lab/seo.js';

const root = import.meta.dirname;
const ESTUDIO_PAGES = ['index', ...READY_TOOLS.map((t) => t.slug)];

const estudioSeo = {
  name: 'estudio-seo',
  transformIndexHtml: { order: 'pre', handler: renderPlaceholders }
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
  plugins: [estudioSeo, omitOversizedAssets],
  build: {
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
