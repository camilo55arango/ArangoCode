import '../shell.js';
import { $, bindDropzone, createStatus, downloadBlob, formatSize, nameField } from '../ui.js';
import { createEditor } from '../pdf-editor.js';

const status = createStatus($('#status'));
const name = nameField();
const editor = createEditor({ status, name });

async function open(file) {
  try {
    if (await editor.open(file)) $('#drop').hidden = true;
  } catch (err) {
    status.error(err);
  }
}

$('#save').addEventListener('click', async () => {
  const btn = $('#save');
  btn.disabled = true;
  try {
    status.set('Guardando el PDF…');
    const blob = await editor.save();
    const fallback = `${editor.file.name.replace(/\.pdf$/i, '')}-editado.pdf`;
    downloadBlob(blob, name.fileName(fallback));
    status.set(`Listo: PDF guardado (${formatSize(blob.size)}). Puedes seguir editando y volver a guardar.`, 'ok');
  } catch (err) {
    status.error(err);
  } finally {
    btn.disabled = false;
  }
});

$('#change').addEventListener('click', async () => {
  await editor.close();
  $('#editor').hidden = true;
  $('#drop').hidden = false;
  status.set('Elige otro PDF.');
});

bindDropzone($('#drop'), open);
