/* Codificadores de jSquash (WASM), cargados bajo demanda dentro del Worker de src/lab/encode.js. */

async function encodeBuffer(imageData, format, quality) {
  if (format === 'jpeg') {
    const { default: enc } = await import('@jsquash/jpeg/encode.js');
    return enc(imageData, { quality });
  }
  if (format === 'webp') {
    const { default: enc } = await import('@jsquash/webp/encode.js');
    return enc(imageData, { quality });
  }
  if (format === 'avif') {
    const { default: enc } = await import('@jsquash/avif/encode.js');
    // speed 8: un poco más pesado que el máximo de compresión, pero segundos en vez de minutos.
    return enc(imageData, { quality, speed: 8 });
  }
  if (format === 'png') {
    const { default: optimise } = await import('@jsquash/oxipng/optimise.js');
    return optimise(imageData, { level: 2 });
  }
  throw new Error(`Formato no soportado: ${format}`);
}

self.addEventListener('message', async ({ data: { id, imageData, format, quality } }) => {
  try {
    const buffer = await encodeBuffer(imageData, format, quality);
    self.postMessage({ id, buffer }, [buffer]);
  } catch (err) {
    self.postMessage({ id, error: err?.message ?? String(err) });
  }
});
