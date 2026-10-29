/* "Tus notas": una hoja de la libreta para escribir notas temporales. Se guardan solas en el navegador. */

const KEY = 'ac-notes-text';

export function initWrite() {
  const area = document.querySelector('#notesText');
  if (!area) return;
  const saved = document.querySelector('#notesSaved');
  const clear = document.querySelector('#notesTextClear');

  try { area.value = localStorage.getItem(KEY) ?? ''; } catch (e) { /* storage no disponible */ }
  const status = (msg) => { saved.textContent = msg; };
  status(area.value ? 'Guardado en tu navegador' : '');

  let timer = 0;
  area.addEventListener('input', () => {
    status('Escribiendo…');
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        if (area.value) localStorage.setItem(KEY, area.value);
        else localStorage.removeItem(KEY);
        status(area.value ? 'Guardado ✓' : '');
      } catch (e) {
        status('No se pudo guardar (almacenamiento bloqueado)');
      }
    }, 400);
  });

  // Borrar pide confirmación con un segundo toque, para no perder las notas por accidente.
  let armed = 0;
  clear.addEventListener('click', () => {
    if (!area.value) return;
    if (!armed) {
      clear.textContent = '¿Seguro? Toca otra vez';
      armed = setTimeout(() => { armed = 0; clear.textContent = 'Borrar'; }, 3000);
      return;
    }
    clearTimeout(armed);
    armed = 0;
    clear.textContent = 'Borrar';
    area.value = '';
    try { localStorage.removeItem(KEY); } catch (e) { /* storage no disponible */ }
    status('');
    area.focus();
  });

  // En la libreta, arrastrar hojea: aquí arrastrar es seleccionar texto y tocar es escribir.
  for (const el of [area, clear]) {
    el.addEventListener('mousedown', (e) => e.stopPropagation());
    el.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
  }
}
