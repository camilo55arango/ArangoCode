/* qpdf compilado a WASM, compartido por Desbloquear PDF y Unir PDF. */

import createQpdf from '@neslinesli93/qpdf-wasm';
import wasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';

/**
 * Ejecuta qpdf como en la línea de comandos. `inputs` son los bytes de cada PDF de entrada:
 * en `args`, `{in}` es el primero y `{in0}`, `{in1}`… cada uno. La salida se lee de `/out.pdf`.
 * qpdf es un programa de línea de comandos: cada ejecución usa una instancia nueva
 * (callMain no se puede repetir). El navegador cachea el .wasm entre ejecuciones.
 */
export async function qpdf(args, inputs) {
  const files = Array.isArray(inputs) ? inputs : [inputs];
  // Esta compilación de qpdf ignora `printErr`: guarda `console.error` al crearse y escribe ahí sus errores.
  // Se intercepta desde antes de crear la instancia, y se sigue mostrando en la consola.
  const errors = [];
  const consoleError = console.error;
  console.error = (...parts) => { errors.push(parts.join(' ')); consoleError(...parts); };
  let code;
  let instance;
  try {
    instance = await createQpdf({ locateFile: () => wasmUrl, noInitialRun: true });
    files.forEach((bytes, i) => instance.FS.writeFile(`/in${i}.pdf`, bytes));
    const argv = args.map((a) => a.replace('{in}', '/in0.pdf').replace(/\{in(\d+)\}/, '/in$1.pdf'));
    try { code = instance.callMain(argv); }
    catch (e) { code = typeof e?.status === 'number' ? e.status : 2; }
  } finally {
    console.error = consoleError;
  }
  // 0 = bien, 3 = bien con advertencias (PDF con errores menores que qpdf corrige).
  const out = args.includes('/out.pdf') && (code === 0 || code === 3) ? instance.FS.readFile('/out.pdf') : null;
  return { code, out, log: errors.join('\n') };
}
