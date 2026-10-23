/*
 * Decodificar y codificar imágenes para Comprimir y Convertir.
 * Los códecs (WASM de jSquash y heic-to) se cargan solo cuando se necesitan.
 */

export const FORMATS = {
  jpeg: { label: 'JPG', mime: 'image/jpeg', ext: 'jpg', lossy: true },
  png:  { label: 'PNG', mime: 'image/png', ext: 'png', lossy: false },
  webp: { label: 'WebP', mime: 'image/webp', ext: 'webp', lossy: true },
  avif: { label: 'AVIF', mime: 'image/avif', ext: 'avif', lossy: true }
};

const HEIC = /\.(heic|heif)$/i;

/** Formato de un archivo de entrada, o null si no es uno de los que sabemos codificar. */
export function formatOf(file) {
  const byMime = Object.keys(FORMATS).find((k) => FORMATS[k].mime === file.type);
  if (byMime) return byMime;
  const ext = file.name.split('.').pop().toLowerCase();
  return ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : (FORMATS[ext] ? ext : null);
}

/** Decodifica cualquier imagen que abra el navegador, y también HEIC/HEIF (fotos de iPhone). */
export async function decode(file) {
  if (HEIC.test(file.name) || /image\/hei[cf]/.test(file.type)) {
    const { heicTo } = await import('heic-to');
    return heicTo({ blob: file, type: 'bitmap' });
  }
  // `createImageBitmap` respeta la orientación EXIF.
  return createImageBitmap(file);
}

/**
 * Dibuja el bitmap a su tamaño (o reducido a `maxSide`) y devuelve sus píxeles.
 * `background` rellena la transparencia, necesario para JPG.
 */
export function toImageData(bitmap, { maxSide = Infinity, background } = {}) {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/*
 * La codificación va en un Worker: no congela la página con fotos grandes, y el codificador AVIF
 * multihilo de jSquash solo funciona fuera del hilo principal.
 */
let worker = null;
let nextId = 0;
const waiting = new Map();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./encode.worker.js', import.meta.url), { type: 'module' });
  worker.addEventListener('message', ({ data }) => {
    const job = waiting.get(data.id);
    waiting.delete(data.id);
    if (data.error) job.reject(new Error(data.error));
    else job.resolve(data.buffer);
  });
  worker.addEventListener('error', (e) => {
    for (const job of waiting.values()) job.reject(new Error(e.message || 'Falló el codificador.'));
    waiting.clear();
    worker = null;
  });
  return worker;
}

/** Codifica con MozJPEG, libwebp, libavif u OxiPNG. `quality` va de 1 a 100 (PNG lo ignora). */
export async function encode(imageData, format, { quality = 75 } = {}) {
  if (!FORMATS[format]) throw new Error(`Formato no soportado: ${format}`);
  const id = ++nextId;
  const buffer = await new Promise((resolve, reject) => {
    waiting.set(id, { resolve, reject });
    getWorker().postMessage({ id, imageData, format, quality }, [imageData.data.buffer]);
  });
  return new Blob([buffer], { type: FORMATS[format].mime });
}
