import '../shell.js';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { $, bindDropzone, createStatus, downloadBlob } from '../ui.js';

const status = createStatus($('#status'));
const textOut = $('#text');

let current = null;
let runId = 0;

async function loadPdfjs() {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  return pdfjs;
}

const BOLD = /bold|black|heavy|semibold|demi/i;
const ITALIC = /italic|oblique/i;

/**
 * Texto de una página como líneas con fragmentos de estilo.
 * pdf.js entrega los fragmentos en orden de lectura; una línea nueva empieza cuando cambia la `y`.
 */
async function pageLines(page) {
  const content = await page.getTextContent();
  // El operator list carga las fuentes en commonObjs: de ahí salen la negrita y la cursiva reales.
  await page.getOperatorList();
  const fontOf = (id) => {
    try { return page.commonObjs.has(id) ? page.commonObjs.get(id) : null; } catch { return null; }
  };

  const lines = [];
  let line = null;
  let prev = null;
  for (const item of content.items) {
    if (!('str' in item)) continue;
    const [, , c, d, x, y] = item.transform;
    const size = Math.hypot(c, d) || item.height || 10;
    if (!item.str) { if (item.hasEOL) prev = null; continue; }

    if (!line || Math.abs(line.y - y) > size * 0.5) {
      line = { y, size, runs: [] };
      lines.push(line);
      prev = null;
    }
    const font = fontOf(item.fontName);
    const name = `${font?.name ?? ''} ${content.styles[item.fontName]?.fontFamily ?? ''}`;
    let text = item.str;
    if (prev && x - (prev.x + prev.width) > size * 0.2 && !/\s$/.test(prev.text) && !/^\s/.test(text)) text = ` ${text}`;

    const run = { text, size, bold: Boolean(font?.bold) || BOLD.test(name), italic: Boolean(font?.italic) || ITALIC.test(name) };
    const last = line.runs.at(-1);
    if (last && last.bold === run.bold && last.italic === run.italic && Math.abs(last.size - size) < 0.5) last.text += text;
    else line.runs.push(run);
    line.size = Math.max(line.size, size);
    prev = { x, width: item.width, text };
    if (item.hasEOL) { line = null; prev = null; }
  }
  return lines.filter((l) => l.runs.some((r) => r.text.trim()));
}

/** Une líneas seguidas del mismo tamaño en párrafos, y quita los guiones de corte de palabra. */
function toParagraphs(lines) {
  const paras = [];
  let para = null;
  let prevLine = null;
  for (const l of lines) {
    const gap = prevLine ? prevLine.y - l.y : Infinity;
    const sameSize = para && Math.abs(para.size - l.size) <= para.size * 0.12;
    if (para && sameSize && gap > 0 && gap <= l.size * 1.7) {
      const last = para.runs.at(-1);
      const next = l.runs[0];
      if (/[a-záéíóúñü]-$/i.test(last.text) && /^[a-záéíóúñü]/.test(next.text)) last.text = last.text.slice(0, -1);
      else if (!/\s$/.test(last.text)) last.text += ' ';
      para.runs.push(...l.runs.map((r) => ({ ...r })));
    } else {
      para = { size: l.size, runs: l.runs.map((r) => ({ ...r })) };
      paras.push(para);
    }
    prevLine = l;
  }
  return paras;
}

/** Tamaño de letra más usado (por cantidad de texto): es el del cuerpo. */
function bodySize(pages) {
  const count = new Map();
  for (const paras of pages) for (const p of paras) for (const r of p.runs) {
    const k = Math.round(r.size);
    count.set(k, (count.get(k) ?? 0) + r.text.length);
  }
  return [...count].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 11;
}

async function buildDocx(pages, title) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
  const body = bodySize(pages);
  const children = [];
  pages.forEach((paras, pageIndex) => {
    paras.forEach((p, i) => {
      const ratio = p.size / body;
      const heading = ratio >= 1.45 ? HeadingLevel.HEADING_1 : ratio >= 1.18 ? HeadingLevel.HEADING_2 : undefined;
      children.push(new Paragraph({
        heading,
        pageBreakBefore: pageIndex > 0 && i === 0,
        spacing: { after: 120 },
        children: p.runs.map((r) => new TextRun({
          text: r.text,
          bold: r.bold,
          italics: r.italic,
          // docx usa medios puntos; se limita para que un PDF raro no genere letras gigantes.
          size: Math.round(Math.min(72, Math.max(7, r.size)) * 2)
        }))
      }));
    });
  });
  const doc = new Document({ creator: 'ArangoCode · Estudio Creativo', title, sections: [{ children }] });
  return Packer.toBlob(doc);
}

async function run(file) {
  const id = ++runId;
  $('#result').hidden = true;
  current = null;
  try {
    status.reset();
    status.set('Cargando el motor de PDF…');
    const pdfjs = await loadPdfjs();
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    const pdf = await task.promise;

    const pages = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      if (id !== runId) return;
      status.set(`Leyendo página ${n} de ${pdf.numPages}…`);
      pages.push(toParagraphs(await pageLines(await pdf.getPage(n))));
    }
    const numPages = pdf.numPages;
    await task.destroy();

    const chars = pages.flat().reduce((sum, p) => sum + p.runs.reduce((s, r) => s + r.text.trim().length, 0), 0);
    if (!chars) {
      status.html('Este PDF no tiene texto: parece escaneado. Pásalo por <a href="/estudio/imagen-a-texto">Imagen a texto</a> para reconocerlo.', 'error');
      return;
    }

    status.set('Creando el documento de Word…');
    const name = file.name.replace(/\.pdf$/i, '') || 'documento';
    const docx = await buildDocx(pages, name);
    if (id !== runId) return;

    current = { blob: docx, name: `${name}.docx` };
    textOut.value = pages.map((paras, i) => `— Página ${i + 1} —\n\n${paras.map((p) => p.runs.map((r) => r.text).join('')).join('\n\n')}`).join('\n\n');
    $('#summary').textContent = `${numPages} ${numPages === 1 ? 'página' : 'páginas'} · vista previa del texto`;
    $('#result').hidden = false;
    status.set('Listo. Descarga tu documento de Word.', 'ok');
  } catch (err) {
    if (id !== runId) return;
    if (err?.name === 'PasswordException') {
      status.html('Este PDF tiene contraseña. Primero quítasela con <a href="/estudio/desbloquear-pdf">Desbloquear PDF</a>.', 'error');
    } else if (err?.name === 'InvalidPDFException') {
      status.set('El archivo no es un PDF válido o está dañado.', 'error');
    } else {
      status.error(err);
    }
  }
}

bindDropzone($('#drop'), run);
$('#download').addEventListener('click', () => current && downloadBlob(current.blob, current.name));
