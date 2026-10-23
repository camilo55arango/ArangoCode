import '../shell.js';
import { Translator, LANGUAGES, hasPair, resolveRoute } from 'runonweb/translate';
import { $, copyText, createStatus, esc, showDevice } from '../ui.js';

const DEBOUNCE_MS = 400;

const status = createStatus($('#status'));
const fromSel = $('#from');
const toSel = $('#to');
const src = $('#src');
const dst = $('#dst');
// Se crea con el primer par que se pide: load() siempre descarga el par del constructor.
let translator = null;

const names = new Intl.DisplayNames(['es'], { type: 'language' });
const label = (code) => {
  let name = code;
  try { name = names.of(code) ?? code; } catch (e) { /* código no estándar, p. ej. hbs */ }
  return name.charAt(0).toUpperCase() + name.slice(1);
};
const options = LANGUAGES
  .map((code) => ({ code, name: label(code) }))
  .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  .map(({ code, name }) => `<option value="${esc(code)}">${esc(name)}</option>`)
  .join('');
fromSel.innerHTML = options;
toSel.innerHTML = options;
fromSel.value = 'es';
toSel.value = 'en';

let timer = 0;
let runId = 0;

async function run() {
  const id = ++runId;
  const text = src.value;
  const from = fromSel.value;
  const to = toSel.value;

  if (!text.trim()) { dst.value = ''; status.set(''); return; }
  if (from === to) { dst.value = text; return; }
  if (!hasPair(from, to)) {
    status.set(`No hay modelo para ${label(from)} → ${label(to)}.`, 'error');
    return;
  }

  try {
    status.reset();
    translator ??= new Translator({ from, to, onProgress: status.onProgress });
    const t0 = performance.now();
    const { text: out } = await translator.translate(text, { from, to });
    if (id !== runId) return;
    dst.value = out;
    showDevice($('#device'), translator.device, { threads: false });
    const pivot = resolveRoute(from, to)?.length === 2 ? ' · pasando por inglés' : '';
    status.set(`Traducido en ${Math.round(performance.now() - t0)} ms${pivot}`, 'ok');
  } catch (err) {
    if (id === runId) status.error(err);
  }
}

const schedule = () => { clearTimeout(timer); timer = setTimeout(run, DEBOUNCE_MS); };

src.addEventListener('input', schedule);
fromSel.addEventListener('change', run);
toSel.addEventListener('change', run);
$('#swap').addEventListener('click', () => {
  [fromSel.value, toSel.value] = [toSel.value, fromSel.value];
  if (dst.value) src.value = dst.value;
  run();
});
$('#copy').addEventListener('click', (e) => copyText(dst.value, e.currentTarget));
