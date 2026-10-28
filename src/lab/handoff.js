/*
 * Traspaso de archivos de la portada a una herramienta: la portada guarda el archivo en IndexedDB
 * (queda en el navegador, mismo origen) y la herramienta lo recoge al abrirse con ?desde=portada.
 */

const DB = 'ac-handoff';
const STORE = 'files';
const KEY = 'pending';
export const HANDOFF_PARAM = 'desde';

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => { db.close(); resolve(req?.result); };
    t.onerror = () => { db.close(); reject(t.error); };
  });
}

/** Guarda el archivo para la herramienta que se va a abrir. */
export const saveHandoff = (file) => tx('readwrite', (s) => s.put(file, KEY));

/** Si la página se abrió desde la portada, devuelve el archivo (y lo borra); si no, null. */
export async function takeHandoff() {
  const params = new URLSearchParams(location.search);
  if (params.get(HANDOFF_PARAM) !== 'portada') return null;
  params.delete(HANDOFF_PARAM);
  history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  try {
    const file = await tx('readonly', (s) => s.get(KEY));
    await tx('readwrite', (s) => s.delete(KEY));
    return file ?? null;
  } catch (e) {
    return null; // IndexedDB bloqueado (modo privado estricto): la persona elige el archivo a mano.
  }
}
