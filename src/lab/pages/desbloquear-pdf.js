import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, nameField } from '../ui.js';
import { qpdf } from '../qpdf.js';

const status = createStatus($('#status'));
const pwForm = $('#pwForm');
const pwInput = $('#pw');
const name = nameField();

let file = null;
let current = null;

async function unlock(password = '') {
  const bytes = new Uint8Array(await file.arrayBuffer());
  status.reset();
  status.set('Desbloqueando…');

  // --requires-password: 2 = no está cifrado, 3 = cifrado sin contraseña de apertura.
  // Si pide contraseña, qpdf no puede abrirlo y falla con "invalid password".
  const check = await qpdf(['--requires-password', '{in}'], bytes);
  const needsPassword = check.code === 0 || /invalid password/i.test(check.log);
  if (check.code === 2 && !needsPassword && check.log.trim()) {
    throw new Error('El archivo no es un PDF válido o está dañado.');
  }
  if (check.code === 2 && !needsPassword) {
    status.set('Este PDF no tiene contraseña ni restricciones: ya está desbloqueado.', 'ok');
    current = { blob: file, name: file.name };
    name.suggest(current.name);
    $('#actions').hidden = false;
    return;
  }
  if (needsPassword && !password) {
    pwForm.hidden = false;
    pwInput.focus();
    status.set('Escribe la contraseña de apertura para continuar.');
    return;
  }

  const args = ['--decrypt'];
  if (password) args.push(`--password=${password}`);
  const result = await qpdf([...args, '{in}', '/out.pdf'], bytes);
  if (!result.out) {
    if (/invalid password/i.test(result.log)) {
      pwForm.hidden = false;
      pwInput.select();
      status.set('La contraseña no es correcta. Inténtalo de nuevo.', 'error');
      return;
    }
    throw new Error(result.log || 'No se pudo leer el PDF.');
  }

  pwForm.hidden = true;
  pwInput.value = '';
  current = { blob: new Blob([result.out], { type: 'application/pdf' }), name: file.name.replace(/\.pdf$/i, '') + '-desbloqueado.pdf' };
  name.suggest(current.name);
  $('#actions').hidden = false;
  status.set(password ? 'Listo: se quitaron la contraseña y las restricciones.' : 'Listo: se quitaron las restricciones de imprimir, copiar y editar.', 'ok');
}

function start(f) {
  file = f;
  current = null;
  pwForm.hidden = true;
  pwInput.value = '';
  $('#actions').hidden = true;
  unlock().catch((err) => status.error(err));
}

bindDropzone($('#drop'), start);
pwForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (file) unlock(pwInput.value).catch((err) => status.error(err));
});
$('#download').addEventListener('click', () => current && downloadBlob(current.blob, name.fileName(current.name)));
