/*
 * PDF → Word (.docx) en el navegador.
 *
 * - "layout" (Conservar diseño): cada página del PDF es una sección del mismo tamaño. Todo lo que no es
 *   texto (líneas, casillas, tablas, logos, firmas, fotos) va como imagen de fondo, y encima cada línea de
 *   texto es un párrafo editable en su posición exacta, con su fuente, tamaño, negrita y cursiva.
 * - "flow" (Solo texto): párrafos que fluyen, con títulos, sangrías y espaciado, sin gráficos.
 * - OCR: las páginas sin texto (escaneadas) se leen con PP-OCR y su texto se coloca igual que en "layout".
 */

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const PT = 20;             // twips por punto
const PX = 96 / 72;        // píxeles (96 ppp, unidad de docx para imágenes) por punto
const BG_SCALE = 2;        // resolución del fondo: 144 ppp, nítido al imprimir y sin pesar demasiado

const BOLD = /bold|black|heavy|semibold|demi/i;
const ITALIC = /italic|oblique/i;

export async function loadPdf(bytes) {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const task = pdfjs.getDocument({ data: bytes });
  return { pdfjs, task, pdf: await task.promise };
}

/**
 * "ABCDEF+TimesNewRomanPS-BoldMT" → "Times New Roman". Devuelve null si el PDF no guarda el nombre real
 * (muchos generadores escriben "CIDFont+F1", "F2", "TT3"…): entonces la fuente se adivina midiendo.
 */
function familyOf(name) {
  const clean = (name || '')
    .replace(/^[A-Z]{6}\+/, '')
    .replace(/[-,_].*$/, '')
    .replace(/(PSMT|PS|MT|Std|Pro|LT)$/g, '')
    .replace(/(Bold|Italic|Oblique|Regular|Roman|Medium|Light|Semibold|Black)+$/i, '');
  if (!clean || /^(g_d\d|CIDFont|F\d|TT\d|T\d|C\d|Font\d*$)/i.test(clean)) return null;
  if (/^helvetica/i.test(clean)) return 'Arial';
  if (/^times$/i.test(clean)) return 'Times New Roman';
  if (/^courier$/i.test(clean)) return 'Courier New';
  // CamelCase → palabras: "CenturyGothic" → "Century Gothic".
  return clean.replace(/([a-z])([A-Z])/g, '$1 $2');
}

/* --- Medir texto con las fuentes del sistema (para adivinar fuentes sin nombre y ajustar anchos) --- */

const CANDIDATES = ['Arial', 'Times New Roman', 'Calibri', 'Cambria', 'Verdana', 'Georgia', 'Tahoma', 'Courier New', 'Segoe UI', 'Garamond'];
let measureCtx = null;
let installed = null;

function ctx2d() {
  measureCtx ??= document.createElement('canvas').getContext('2d');
  return measureCtx;
}

/** Ancho en puntos de `text` con esa fuente y tamaño. */
function measure(text, { family, bold, italic, size }) {
  const ctx = ctx2d();
  ctx.font = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}100px "${family}", sans-serif`;
  return (ctx.measureText(text).width / 100) * size;
}

/** Fuentes candidatas que de verdad están instaladas (si no, el navegador mediría con otra). */
function installedFonts() {
  if (installed) return installed;
  const ctx = ctx2d();
  const probe = 'mmmmmmmmmmlli1WQ@#&ñ';
  installed = CANDIDATES.filter((f) => ['monospace', 'serif'].some((generic) => {
    ctx.font = `72px ${generic}`;
    const base = ctx.measureText(probe).width;
    ctx.font = `72px "${f}", ${generic}`;
    return ctx.measureText(probe).width !== base;
  }));
  return installed;
}

/**
 * La familia y el grosor cuyo ancho se parece más al del PDF. Pesan más los fragmentos sin espacios:
 * en texto justificado los espacios se estiran y engañarían a la medida.
 */
function guessFont(samples, generic) {
  let best = null;
  for (const family of installedFonts()) {
    for (const bold of [false, true]) {
      let err = 0;
      let total = 0;
      for (const sm of samples) {
        const w = measure(sm.text, { family, bold, italic: sm.italic, size: sm.size });
        if (!w || !sm.width) continue;
        const weight = sm.text.length / (1 + 3 * (sm.text.match(/ /g)?.length ?? 0));
        err += Math.abs(Math.log(w / sm.width)) * weight;
        total += weight;
      }
      if (total && (!best || err / total < best.err)) best = { family, bold, err: err / total };
    }
  }
  if (best) return best;
  return { family: /serif/.test(generic) && !/sans/.test(generic) ? 'Times New Roman' : /mono/.test(generic) ? 'Courier New' : 'Arial', bold: false };
}

/**
 * Fragmentos de texto de la página en coordenadas de página (origen arriba a la izquierda, en puntos).
 * `y` es la línea base.
 */
async function textItems(pdfjs, page) {
  const viewport = page.getViewport({ scale: 1 });
  const content = await page.getTextContent();
  // El operator list carga las fuentes en commonObjs: de ahí salen el nombre real, la negrita y la cursiva.
  await page.getOperatorList();
  const fontOf = (id) => {
    try { return page.commonObjs.has(id) ? page.commonObjs.get(id) : null; } catch { return null; }
  };

  const items = [];
  for (const item of content.items) {
    if (!('str' in item) || !item.str.trim()) continue;
    const [a, b, c, d, x, y] = pdfjs.Util.transform(viewport.transform, item.transform);
    // Texto girado (sellos, marcas verticales): se omite del texto posicionado; queda en el fondo.
    if (Math.abs(b) > Math.abs(a) * 0.2 || Math.abs(c) > Math.abs(d) * 0.2) continue;
    const size = Math.hypot(c, d) || item.height || 10;
    const style = content.styles[item.fontName] ?? {};
    const realName = fontOf(item.fontName)?.name ?? '';
    items.push({
      text: item.str,
      fontId: item.fontName,
      x,
      y,
      size,
      width: item.width,
      ascent: style.ascent > 0.5 && style.ascent < 1.2 ? style.ascent : 0.88,
      descent: style.descent < 0 && style.descent > -0.6 ? style.descent : -0.22,
      generic: style.fontFamily ?? '',
      family: familyOf(realName),
      // Solo el nombre de la fuente es fiable para la negrita (la marca ForceBold no lo es).
      bold: BOLD.test(realName),
      italic: ITALIC.test(realName)
    });
  }

  // Fuentes sin nombre real: se elige la familia y el grosor que mejor reproducen los anchos del PDF.
  const unnamed = new Map();
  for (const it of items) {
    if (it.family) continue;
    if (!unnamed.has(it.fontId)) unnamed.set(it.fontId, []);
    unnamed.get(it.fontId).push(it);
  }
  for (const group of unnamed.values()) {
    const sample = group.slice(0, 60);
    const guess = guessFont(sample, sample[0].generic);
    for (const it of group) { it.family = guess.family; it.bold = guess.bold; }
  }
  return { items, width: viewport.width, height: viewport.height };
}

/** Agrupa fragmentos en líneas (misma línea base) ordenadas de arriba abajo y de izquierda a derecha. */
function toLines(items) {
  const sorted = [...items].sort((p, q) => p.y - q.y || p.x - q.x);
  const lines = [];
  for (const it of sorted) {
    const line = lines.at(-1);
    if (line && Math.abs(line.y - it.y) <= Math.min(line.size, it.size) * 0.35) {
      line.items.push(it);
      line.size = Math.max(line.size, it.size);
    } else {
      lines.push({ y: it.y, size: it.size, items: [it] });
    }
  }
  for (const l of lines) l.items.sort((p, q) => p.x - q.x);
  return lines;
}

/**
 * Parte cada línea en bloques separados por huecos grandes (columnas, celdas de tabla, casillas de un
 * formulario) y une los fragmentos de cada bloque en "runs" con el mismo estilo.
 */
function toSegments(lines) {
  const segments = [];
  for (const line of lines) {
    let seg = null;
    let end = -Infinity;
    for (const it of line.items) {
      const gap = it.x - end;
      if (!seg || gap > Math.max(it.size, 4)) {
        seg = { x: it.x, y: it.y, size: it.size, ascent: it.ascent, descent: it.descent, right: it.x, runs: [] };
        segments.push(seg);
      } else if (gap > it.size * 0.15 && !/\s$/.test(seg.runs.at(-1).text) && !/^\s/.test(it.text)) {
        seg.runs.at(-1).text += ' ';
      }
      const last = seg.runs.at(-1);
      if (last && last.family === it.family && last.bold === it.bold && last.italic === it.italic && Math.abs(last.size - it.size) < 0.3) {
        last.text += it.text;
      } else {
        seg.runs.push({ text: it.text, family: it.family, bold: it.bold, italic: it.italic, size: it.size });
      }
      seg.size = Math.max(seg.size, it.size);
      seg.right = Math.max(seg.right, it.x + it.width);
      end = it.x + it.width;
    }
  }
  return segments;
}

/**
 * Marca las líneas de párrafos justificados: líneas seguidas con la misma sangría y el mismo borde
 * derecho. Todas menos la última de cada párrafo se justifican hasta ese borde (`s.justify`).
 */
function markJustified(segments) {
  const sorted = [...segments].sort((p, q) => p.y - q.y);
  const nextOf = new Map();
  const hasPrev = new Set();
  for (const s of sorted) {
    const next = sorted.find((t) => t.y > s.y + s.size * 0.5 && t.y - s.y <= s.size * 1.9
      && Math.abs(t.x - s.x) < 2 && Math.abs(t.size - s.size) < 0.6);
    if (next && !hasPrev.has(next)) { nextOf.set(s, next); hasPrev.add(next); }
  }
  for (const start of sorted) {
    if (hasPrev.has(start) || !nextOf.has(start)) continue;
    const chain = [start];
    while (nextOf.has(chain.at(-1))) chain.push(nextOf.get(chain.at(-1)));
    const right = Math.max(...chain.map((s) => s.right));
    // Las líneas (menos la última) que llegan al mismo borde derecho: en un párrafo justificado son todas.
    const full = chain.slice(0, -1).filter((s) => right - s.right < 1.5);
    // En un texto alineado a la izquierda solo coincide alguna por casualidad: no se justifica.
    if (!full.length || full.length < (chain.length - 1) * 0.6) continue;
    for (const s of full) if (s.runs.some((r) => /\s/.test(r.text))) s.justify = right;
  }
}

/**
 * Dibuja la página sin texto: líneas, rellenos, imágenes y anotaciones. pdf.js pinta los glifos con
 * fillText/strokeText, así que se anulan mientras dura el render (también en lienzos intermedios).
 * Devuelve null si la página no tiene nada más que texto.
 */
async function renderBackground(page, { withText = false } = {}) {
  const viewport = page.getViewport({ scale: BG_SCALE });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const proto = CanvasRenderingContext2D.prototype;
  const { fillText, strokeText } = proto;
  if (!withText) {
    proto.fillText = function () {};
    proto.strokeText = function () {};
  }
  try {
    await page.render({ canvas, viewport, background: '#ffffff' }).promise;
  } finally {
    proto.fillText = fillText;
    proto.strokeText = strokeText;
  }
  return canvas;
}

/** ¿Tiene el lienzo algo distinto de blanco? Se mira una versión reducida: es rápido y suficiente. */
function hasInk(canvas) {
  const w = Math.min(300, canvas.width);
  const h = Math.round(canvas.height * (w / canvas.width));
  const small = document.createElement('canvas');
  small.width = w;
  small.height = h;
  const ctx = small.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(canvas, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < data.length; i += 4) if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) return true;
  return false;
}

/** Tapa con el color del entorno el texto que el OCR ya convirtió, para que no se vea dos veces. */
function eraseBoxes(canvas, boxes) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  for (const { xmin, ymin, xmax, ymax } of boxes) {
    const pad = 2;
    const x = Math.max(0, Math.floor(xmin) - pad);
    const y = Math.max(0, Math.floor(ymin) - pad);
    const w = Math.min(canvas.width - x, Math.ceil(xmax - xmin) + pad * 2);
    const h = Math.min(canvas.height - y, Math.ceil(ymax - ymin) + pad * 2);
    if (w <= 0 || h <= 0) continue;
    // Color de fondo: el más claro del borde de la caja (el papel, no la tinta).
    const edge = ctx.getImageData(x, y, w, 1).data;
    let best = [255, 255, 255];
    let bestSum = -1;
    for (let i = 0; i < edge.length; i += 4) {
      const sum = edge[i] + edge[i + 1] + edge[i + 2];
      if (sum > bestSum) { bestSum = sum; best = [edge[i], edge[i + 1], edge[i + 2]]; }
    }
    ctx.fillStyle = `rgb(${best.join(',')})`;
    ctx.fillRect(x, y, w, h);
  }
}

async function canvasToPng(canvas) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  // Fondos con fotos pesan mucho en PNG: si pasa de 1.5 MB, JPEG de buena calidad.
  if (blob.size <= 1.5 * 1024 * 1024) return { type: 'png', data: await blob.arrayBuffer() };
  const jpg = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
  return { type: 'jpg', data: await jpg.arrayBuffer() };
}

/**
 * Convierte el PDF. `onStep(texto)` informa del avance; `ocr` es una instancia de runonweb/ocr (o null).
 * Devuelve { blob, preview, pages, scanned, ocrPages }.
 */
export async function pdfToDocx(bytes, { mode = 'layout', ocr = null, onStep = () => {}, isCancelled = () => false }) {
  const docx = await import('docx');
  const { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType, LineRuleType,
    FrameAnchorType, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom } = docx;

  const { pdfjs, task, pdf } = await loadPdf(bytes);
  const sections = [];
  const preview = [];
  let scanned = 0;
  let ocrPages = 0;

  const run = (r, scale = 100) => new TextRun({
    text: r.text,
    font: r.family,
    bold: r.bold,
    italics: r.italic,
    // docx usa medios puntos; se limita para que un PDF raro no genere letras gigantes o invisibles.
    size: Math.round(Math.min(96, Math.max(4, r.size)) * 2),
    scale: scale === 100 ? undefined : scale
  });

  try {
    for (let n = 1; n <= pdf.numPages; n++) {
      if (isCancelled()) return null;
      onStep(`Leyendo página ${n} de ${pdf.numPages}…`);
      const page = await pdf.getPage(n);
      const { items, width, height } = await textItems(pdfjs, page);
      const children = [];
      let segments = [];

      if (!items.length) scanned++;

      if (mode === 'flow') {
        children.push(...flowParagraphs(toLines(items), { Paragraph, run, HeadingLevel, AlignmentType, width }));
        if (!children.length) children.push(new Paragraph({ children: [new TextRun({ text: '[Página sin texto: usa la opción OCR]', italics: true })] }));
        preview.push(toLines(items).map((l) => l.items.map((i) => i.text).join(' ')).join('\n'));
        sections.push({
          properties: { page: { size: { width: width * PT, height: height * PT }, margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
          children
        });
        continue;
      }

      // Conservar diseño (y OCR).
      const scan = !items.length && ocr;
      onStep(scan ? `Reconociendo texto de la página ${n} de ${pdf.numPages} (OCR)…` : `Componiendo página ${n} de ${pdf.numPages}…`);
      const background = await renderBackground(page, { withText: !items.length });
      segments = toSegments(toLines(items));

      if (scan) {
        const { lines } = await ocr.read(background);
        eraseBoxes(background, lines.map((l) => l.box));
        ocrPages++;
        segments = lines.filter((l) => l.text.trim()).map((l) => {
          const h = (l.box.ymax - l.box.ymin) / BG_SCALE;
          const w = (l.box.xmax - l.box.xmin) / BG_SCALE;
          // La altura de la caja depende de las letras de cada línea (sin tildes ni "g" es más baja); el ancho
          // es más estable: tamaño = el que hace que el texto en Arial mida lo mismo, dentro de un margen razonable.
          const perPoint = measure(l.text, { family: 'Arial', bold: false, italic: false, size: 1 });
          const size = Math.max(5, Math.min(h * 0.95, Math.max(h * 0.55, perPoint ? w / perPoint : h * 0.72)));
          return {
            x: l.box.xmin / BG_SCALE,
            // La caja del OCR va de lo más alto a lo más bajo de las letras: la línea base queda cerca del 80 %.
            y: l.box.ymin / BG_SCALE + h * 0.8,
            size, ascent: 0.88, descent: -0.22,
            right: l.box.xmax / BG_SCALE,
            runs: [{ text: l.text, family: 'Arial', bold: false, italic: false, size }]
          };
        });
      }

      if (hasInk(background)) {
        const image = await canvasToPng(background);
        children.push(new Paragraph({
          spacing: { before: 0, after: 0, line: 20, lineRule: LineRuleType.EXACT },
          children: [new ImageRun({
            type: image.type,
            data: image.data,
            transformation: { width: Math.round(width * PX), height: Math.round(height * PX) },
            floating: {
              horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
              verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
              behindDocument: true,
              allowOverlap: true,
              lockAnchor: true
            }
          })]
        }));
      }

      // Con OCR no se justifica: las medidas son estimadas y estirar los espacios se nota más que un borde irregular.
      if (!scan) markJustified(segments);
      for (const s of segments) {
        const lineHeight = s.size * (s.ascent - s.descent);
        const top = s.y - s.size * s.ascent;
        const target = s.right - s.x;
        const natural = s.runs.reduce((sum, r) => sum + measure(r.text, r), 0);
        // Escala horizontal (w:w) para que la línea mida lo mismo que en el PDF aunque la fuente difiera un poco.
        // Si va justificada, solo se encoge cuando no cabría: el justificado reparte el resto.
        let scale = natural ? (target / natural) * 100 : 100;
        if (s.justify) scale = Math.min(100, scale);
        scale = Math.round(Math.min(130, Math.max(70, scale)));
        if (Math.abs(scale - 100) <= 1) scale = 100;
        const frameWidth = s.justify ? s.justify - s.x + 0.6 : Math.min(width - s.x, target * 1.06 + s.size);
        const runs = s.runs.map((r) => run(r, scale));
        // Una línea justificada debe terminar en salto de línea: Word no justifica la última línea de un párrafo.
        if (s.justify) runs.push(new TextRun({ break: 1 }));
        children.push(new Paragraph({
          frame: {
            type: 'absolute',
            position: { x: Math.round(s.x * PT), y: Math.round(Math.max(0, top) * PT) },
            width: Math.round(Math.max(frameWidth, s.size) * PT),
            anchor: { horizontal: FrameAnchorType.PAGE, vertical: FrameAnchorType.PAGE }
          },
          alignment: s.justify ? AlignmentType.JUSTIFIED : undefined,
          spacing: { before: 0, after: 0, line: Math.round(lineHeight * PT), lineRule: LineRuleType.EXACT },
          children: runs
        }));
      }
      if (!children.length) children.push(new Paragraph({ children: [] }));

      preview.push(toLines(segments.map((s) => ({ ...s, text: s.runs.map((r) => r.text).join(''), width: s.right - s.x })))
        .map((l) => l.items.map((i) => i.text).join('   ')).join('\n'));
      sections.push({
        properties: {
          page: {
            size: { width: Math.round(width * PT), height: Math.round(height * PT) },
            // Sin márgenes: todo va posicionado respecto a la página, como en el PDF.
            margin: { top: 0, right: 0, bottom: 0, left: 0, header: 0, footer: 0 }
          }
        },
        children
      });
      page.cleanup();
    }

    onStep('Creando el documento de Word…');
    const doc = new Document({
      creator: 'ArangoCode · Estudio Creativo',
      styles: { default: { document: { run: { font: 'Arial' } } } },
      sections
    });
    return { blob: await Packer.toBlob(doc), preview, pages: pdf.numPages, scanned, ocrPages };
  } finally {
    await task.destroy();
  }
}

/** Modo "Solo texto": párrafos con títulos, sangría, espaciado y alineación aproximados. */
function flowParagraphs(lines, { Paragraph, run, HeadingLevel, AlignmentType, width }) {
  if (!lines.length) return [];
  const count = new Map();
  for (const l of lines) for (const it of l.items) count.set(Math.round(it.size), (count.get(Math.round(it.size)) ?? 0) + it.text.length);
  const body = [...count].sort((a, b) => b[1] - a[1])[0][0];
  const left = Math.min(...lines.map((l) => l.items[0].x));
  const right = Math.max(...lines.map((l) => { const e = l.items.at(-1); return e.x + e.width; }));

  const paras = [];
  let para = null;
  let prev = null;
  for (const l of lines) {
    const segs = toSegments([l]);
    const runs = segs.flatMap((s, i) => (i ? [{ ...s.runs[0], text: `\t${s.runs[0].text}` }, ...s.runs.slice(1)] : s.runs));
    const x0 = l.items[0].x;
    const x1 = l.items.at(-1).x + l.items.at(-1).width;
    const gap = prev ? l.y - prev.y : 0;
    const continues = para && Math.abs(para.size - l.size) <= para.size * 0.12 && gap > 0 && gap <= l.size * 1.7 && Math.abs(x0 - para.x) < l.size * 2;
    if (continues) {
      const last = para.runs.at(-1);
      if (/[a-záéíóúñü]-$/i.test(last.text) && /^[a-záéíóúñü]/.test(runs[0].text)) last.text = last.text.slice(0, -1);
      else if (!/\s$/.test(last.text)) last.text += ' ';
      para.runs.push(...runs.map((r) => ({ ...r })));
      para.x1 = Math.max(para.x1, x1);
    } else {
      para = { size: l.size, x: x0, x1, before: prev ? Math.max(0, gap - l.size * 1.25) : 0, runs: runs.map((r) => ({ ...r })) };
      paras.push(para);
    }
    prev = l;
  }

  return paras.map((p) => {
    const ratio = p.size / body;
    const center = Math.abs((p.x + p.x1) / 2 - width / 2) < width * 0.04 && p.x - left > p.size * 3;
    const alignRight = !center && right - p.x1 < p.size && p.x - left > width * 0.3;
    return new Paragraph({
      heading: ratio >= 1.45 ? HeadingLevel.HEADING_1 : ratio >= 1.18 ? HeadingLevel.HEADING_2 : undefined,
      alignment: center ? AlignmentType.CENTER : alignRight ? AlignmentType.RIGHT : undefined,
      indent: !center && !alignRight && p.x - left > 4 ? { left: Math.round((p.x - left) * PT) } : undefined,
      spacing: { before: Math.round(Math.min(p.before, 40) * PT), after: 60 },
      children: p.runs.map(run)
    });
  });
}
