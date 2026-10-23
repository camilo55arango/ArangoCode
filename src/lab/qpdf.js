/* qpdf compilado a WASM, compartido por Unir, Dividir y Desbloquear PDF. */

import createQpdf from '@neslinesli93/qpdf-wasm';
import wasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';

/**
 * Una instancia de qpdf con los PDF de entrada ya cargados, para ejecutar varios comandos seguidos
 * (por ejemplo, un archivo por cada rango al dividir). En `args`, `{in}` es el primer archivo y
 * `{in0}`, `{in1}`… cada uno; la salida se lee de `/out.pdf`.
 */
export async function qpdfSession(inputs) {
  const files = Array.isArray(inputs) ? inputs : [inputs];
  // Esta compilación de qpdf ignora `printErr`: guarda la función `console.error` que hay al crearse y
  // escribe ahí sus errores. Se crea con un interceptor, que la instancia conserva aunque luego se restaure.
  let errors = [];
  const consoleError = console.error;
  console.error = (...parts) => { errors.push(parts.join(' ')); consoleError(...parts); };
  let instance;
  try {
    instance = await createQpdf({ locateFile: () => wasmUrl, noInitialRun: true });
  } finally {
    console.error = consoleError;
  }
  files.forEach((bytes, i) => instance.FS.writeFile(`/in${i}.pdf`, bytes));

  return {
    run(args) {
      errors = [];
      try { instance.FS.unlink('/out.pdf'); } catch { /* aún no existe */ }
      const argv = args.map((a) => a.replace('{in}', '/in0.pdf').replace(/\{in(\d+)\}/, '/in$1.pdf'));
      let code;
      try { code = instance.callMain(argv); }
      catch (e) { code = typeof e?.status === 'number' ? e.status : 2; }
      // 0 = bien, 3 = bien con advertencias (PDF con errores menores que qpdf corrige).
      const out = args.includes('/out.pdf') && (code === 0 || code === 3) ? instance.FS.readFile('/out.pdf') : null;
      return { code, out, log: errors.join('\n') };
    }
  };
}

/** Una sola ejecución de qpdf (ver `qpdfSession`). */
export async function qpdf(args, inputs) {
  return (await qpdfSession(inputs)).run(args);
}
