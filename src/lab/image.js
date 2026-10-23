/**
 * Decodifica una imagen a canvas, reduciéndola si su lado mayor supera `maxSide`.
 * BEN2 y Depth Anything redimensionan internamente (1024 / 518 px), así que mandar una foto
 * de 12 MP solo cuesta tiempo de decodificación y memoria. `createImageBitmap` respeta EXIF.
 */
export async function fileToCanvas(file, maxSide = Infinity) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas;
}
