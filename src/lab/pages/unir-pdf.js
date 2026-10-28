import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, esc, formatSize, nameField } from '../ui.js';
import { qpdf } from '../qpdf.js';
import { createOrderList } from '../order-list.js';

const status = createStatus($('#status'));
const joinBtn = $('#join');
const downloadBtn = $('#download');
const name = nameField();

let result = null;

/** Cualquier cambio en la lista invalida el PDF ya unido. */
function invalidate() {
  result = null;
  downloadBtn.hidden = true;
  joinBtn.hidden = false;
}

/** Archivos en el orden en que irán en el PDF final. */
const list = createOrderList($('#list'), { onChange: () => { invalidate(); update(); } });

/** Nombre por defecto: el del primer archivo de la lista + "-unido". */
const defaultName = () => `${(list.files[0]?.name.replace(/\.pdf$/i, '') || 'documento')}-unido.pdf`;

function update() {
  const n = list.size;
  $('#merge').hidden = !n;
  name.suggest(defaultName());
  $('#count').textContent = `${n} ${n === 1 ? 'archivo' : 'archivos'} · orden final`;
  joinBtn.disabled = n < 2;
  joinBtn.textContent = n < 2 ? 'Añade al menos 2 PDF' : `Unir ${n} PDF`;
}

function add(files) {
  list.add(files);
  status.set(list.size < 2 ? 'Añade al menos otro PDF para unirlos.' : 'Ordénalos como quieras y pulsa Unir.');
}

joinBtn.addEventListener('click', async () => {
  if (list.size < 2) return;
  const snapshot = list.files;
  joinBtn.disabled = true;
  try {
    status.reset();
    status.set(`Uniendo ${snapshot.length} PDF…`);
    const inputs = await Promise.all(snapshot.map(async (file) => new Uint8Array(await file.arrayBuffer())));
    // --empty: documento nuevo; --pages: todas las páginas (1-z) de cada archivo, en este orden.
    // El rango es obligatorio: sin él, qpdf lee el archivo siguiente como si fuera un rango.
    const pages = snapshot.flatMap((_, i) => [`{in${i}}`, '1-z']);
    const run = await qpdf(['--empty', '--pages', ...pages, '--', '/out.pdf'], inputs);

    if (!run.out) {
      const bad = Number(run.log.match(/\/in(\d+)\.pdf/)?.[1]);
      const name = esc(snapshot[bad]?.name ?? 'Uno de los archivos');
      if (/invalid password/i.test(run.log)) {
        status.html(`<b>${name}</b> tiene contraseña. Quítasela con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a> y vuelve a añadirlo.`, 'error');
      } else {
        status.html(`<b>${name}</b> no es un PDF válido o está dañado. Quítalo de la lista e inténtalo de nuevo.`, 'error');
      }
      return;
    }

    result = { blob: new Blob([run.out], { type: 'application/pdf' }), name: defaultName() };
    joinBtn.hidden = true;
    downloadBtn.hidden = false;
    downloadBtn.focus();
    status.set(`Listo: ${snapshot.length} PDF unidos en uno (${formatSize(result.blob.size)}).`, 'ok');
  } catch (err) {
    status.error(err);
  } finally {
    joinBtn.disabled = list.size < 2;
  }
});

downloadBtn.addEventListener('click', () => result && downloadBlob(result.blob, name.fileName(result.name)));
$('#clear').addEventListener('click', () => {
  list.clear();
  status.set('Elige al menos dos PDF para unirlos.');
});
bindDropzone($('#drop'), add, { multiple: true });
