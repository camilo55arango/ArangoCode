/* Catálogo del Estudio Creativo. Lo usan el inicio, las páginas de /estudio y vite.config.js (SEO estático). */

export const SITE = 'https://arangocode.com';

export const LAB_TOOLS = [
  {
    slug: 'unir-pdf',
    name: 'Unir PDF',
    task: 'Unir',
    cat: 'Documentos',
    color: '#8b7cf6',
    desc: 'Junta varios PDF en uno solo, en el orden que tú elijas.',
    foot: 'Motor ~1.3 MB',
    credits: [['qpdf', 'https://github.com/qpdf/qpdf', 'Apache-2.0'], ['qpdf-wasm', 'https://github.com/neslinesli93/qpdf-wasm', 'ISC']],
    seoTitle: 'Unir PDF gratis: junta varios PDF en uno en el orden que quieras',
    seoDesc: 'Une varios archivos PDF en uno solo, gratis y sin subirlos a ningún servidor. Ordénalos arrastrando y descarga el PDF combinado al instante.',
    steps: [
      'Suelta o elige todos los PDF que quieres unir. Puedes añadir más después.',
      'Ordénalos arrastrándolos o con las flechas: así quedarán en el PDF final.',
      'Pulsa Unir y descarga un solo PDF con todas las páginas.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de archivos y sin marcas de agua.'],
      ['¿Mis PDF se suben a internet?', 'No. La unión ocurre en tu navegador con qpdf: los archivos nunca salen de tu dispositivo.'],
      ['¿Puedo cambiar el orden?', 'Sí. Arrastra cada archivo a su lugar o usa las flechas. El PDF final respeta exactamente ese orden.'],
      ['¿Funciona con PDF protegidos?', 'Si un PDF pide contraseña para abrirse, primero quítasela con Desbloquear PDF y luego únelo.']
    ]
  },
  {
    slug: 'pdf-a-word',
    name: 'PDF a Word',
    task: 'Convertir',
    cat: 'Documentos',
    color: '#4f8cf7',
    desc: 'Convierte un PDF en un documento de Word (.docx) editable.',
    foot: 'Motor ~1 MB',
    credits: [['PDF.js', 'https://github.com/mozilla/pdf.js', 'Apache-2.0'], ['docx', 'https://github.com/dolanmiu/docx', 'MIT']],
    seoTitle: 'PDF a Word gratis: convierte PDF a DOCX editable',
    seoDesc: 'Convierte PDF a Word (.docx) gratis, sin registro y sin subir tu archivo. El texto, los párrafos, los títulos y las negritas pasan a un documento editable.',
    steps: [
      'Suelta o elige tu archivo PDF.',
      'El texto de cada página se extrae en tu navegador, con párrafos, títulos y negritas.',
      'Descarga el documento .docx y edítalo en Word, Google Docs o LibreOffice.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de páginas y sin marcas de agua.'],
      ['¿Mi PDF se sube a internet?', 'No. La conversión ocurre en tu navegador: el documento nunca sale de tu dispositivo.'],
      ['¿Conserva el diseño exacto?', 'Conserva el texto, los párrafos, los títulos, las negritas, las cursivas y los saltos de página. Las tablas, columnas e imágenes complejas se convierten en texto simple.'],
      ['¿Funciona con PDF escaneados?', 'Un PDF escaneado es una imagen, no tiene texto. Para esos usa la herramienta Imagen a texto.']
    ]
  },
  {
    slug: 'desbloquear-pdf',
    name: 'Desbloquear PDF',
    task: 'Seguridad',
    cat: 'Documentos',
    color: '#f2b84b',
    desc: 'Quita la contraseña y las restricciones de imprimir, copiar o editar.',
    foot: 'Motor ~1.3 MB',
    credits: [['qpdf', 'https://github.com/qpdf/qpdf', 'Apache-2.0'], ['qpdf-wasm', 'https://github.com/neslinesli93/qpdf-wasm', 'ISC']],
    seoTitle: 'Desbloquear PDF gratis: quitar contraseña y restricciones',
    seoDesc: 'Quita la contraseña de un PDF y las restricciones para imprimir, copiar o editar, gratis y sin subirlo a ningún servidor. Todo ocurre en tu navegador.',
    steps: [
      'Suelta o elige el PDF protegido.',
      'Si pide contraseña para abrirlo, escríbela. Si solo tiene restricciones, no hace falta.',
      'Descarga el PDF desbloqueado, sin contraseña ni restricciones.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro y sin límite de archivos.'],
      ['¿Mi PDF se sube a internet?', 'No. qpdf funciona dentro de tu navegador y el archivo nunca sale de tu dispositivo.'],
      ['¿Puede adivinar una contraseña que no conozco?', 'No. Si el PDF pide contraseña para abrirse, necesitas conocerla. Las restricciones de imprimir, copiar o editar sí se quitan sin contraseña.'],
      ['¿Se pierde calidad?', 'No. El contenido del PDF queda igual; solo se elimina el cifrado.']
    ]
  },
  {
    slug: 'descargar-videos',
    name: 'Descargar videos',
    task: 'Video',
    cat: 'Video',
    soon: true,
    desc: 'Pega el enlace de YouTube, Instagram, Facebook o X y guarda el video.'
  },
  {
    slug: 'quitar-fondo',
    name: 'Quitar fondo',
    task: 'Recorte',
    cat: 'Imagen',
    color: '#f08a5d',
    desc: 'Suelta una foto y descarga un PNG con fondo transparente.',
    size: '~219 MB',
    model: 'BEN2',
    author: 'Prama LLC',
    license: 'MIT',
    modelUrl: 'https://huggingface.co/onnx-community/BEN2-ONNX',
    seoTitle: 'Quitar fondo de una imagen gratis y sin subirla',
    seoDesc: 'Elimina el fondo de cualquier foto y descarga un PNG transparente gratis. Funciona con personas, pelo y objetos, y la imagen nunca sale de tu dispositivo.',
    steps: [
      'Suelta, elige o pega una foto.',
      'La IA separa el sujeto del fondo, incluso en pelo y bordes difíciles.',
      'Descarga el resultado como PNG con fondo transparente.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí, sin registro, sin límite de imágenes y sin marcas de agua.'],
      ['¿Mi foto se sube a algún servidor?', 'No. El recorte se calcula en tu navegador con WebGPU o WASM: tu foto se queda en tu dispositivo.'],
      ['¿En qué formato se descarga?', 'En PNG con transparencia, listo para usar en diseños, presentaciones o tiendas online.'],
      ['¿Por qué tarda la primera vez?', 'El modelo pesa unos 219 MB y se descarga una sola vez. Después queda en caché y el recorte es casi inmediato.']
    ]
  },
  {
    slug: 'convertir-imagen',
    name: 'Convertir imágenes',
    task: 'Convertir',
    cat: 'Imagen',
    color: '#38c793',
    desc: 'Pasa tus imágenes entre JPG, PNG, WebP y AVIF, también desde HEIC.',
    foot: 'Varias a la vez',
    credits: [['jSquash', 'https://github.com/jamsinclair/jSquash', 'Apache-2.0'], ['heic-to', 'https://github.com/hoppergee/heic-to', 'LGPL-3.0']],
    seoTitle: 'Convertir imágenes gratis: JPG, PNG, WebP, AVIF y HEIC',
    seoDesc: 'Convierte imágenes entre JPG, PNG, WebP y AVIF, y fotos HEIC del iPhone a JPG, gratis y sin subirlas. Convierte varias a la vez y descárgalas en un ZIP.',
    steps: [
      'Suelta o elige una o varias imágenes (JPG, PNG, WebP, AVIF, GIF, BMP o HEIC).',
      'Elige el formato de salida y la calidad.',
      'Descarga cada imagen o todas juntas en un ZIP.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de imágenes y sin marcas de agua.'],
      ['¿Mis fotos se suben a internet?', 'No. La conversión ocurre en tu navegador y las imágenes nunca salen de tu dispositivo.'],
      ['¿Puedo convertir fotos HEIC del iPhone?', 'Sí. Suelta las fotos .heic y elige JPG, PNG, WebP o AVIF como salida.'],
      ['¿Qué pasa con la transparencia al pasar a JPG?', 'JPG no admite transparencia, así que las zonas transparentes se rellenan con blanco. PNG, WebP y AVIF la conservan.']
    ]
  },
  {
    slug: 'comprimir-imagen',
    name: 'Comprimir imágenes',
    task: 'Optimizar',
    cat: 'Imagen',
    color: '#ef6f9b',
    desc: 'Reduce el peso de tus fotos sin que se note la diferencia.',
    foot: 'Varias a la vez',
    credits: [['jSquash', 'https://github.com/jamsinclair/jSquash', 'Apache-2.0'], ['MozJPEG', 'https://github.com/mozilla/mozjpeg', 'BSD'], ['OxiPNG', 'https://github.com/shssoichiro/oxipng', 'MIT']],
    seoTitle: 'Comprimir imágenes gratis: reduce el peso de JPG, PNG y WebP',
    seoDesc: 'Comprime fotos JPG, PNG y WebP gratis y sin perder calidad visible. Sin subirlas a ningún servidor, varias a la vez y con descarga en ZIP.',
    steps: [
      'Suelta o elige una o varias imágenes.',
      'Ajusta la calidad y, si quieres, el tamaño máximo.',
      'Compara el antes y el después, y descarga cada imagen o todas en un ZIP.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de imágenes y sin marcas de agua.'],
      ['¿Mis fotos se suben a internet?', 'No. La compresión ocurre en tu navegador con MozJPEG, WebP y OxiPNG: tus fotos no salen de tu dispositivo.'],
      ['¿Cuánto se reduce el peso?', 'Depende de la foto. Con la calidad por defecto, una foto de cámara suele pesar entre un 50 % y un 80 % menos.'],
      ['¿Y si la imagen ya estaba optimizada?', 'Si el resultado pesa más que el original, la herramienta conserva el original y te lo indica.']
    ]
  },
  {
    slug: 'traductor',
    name: 'Traductor',
    task: 'Traducción',
    cat: 'Texto',
    color: '#e09cf0',
    desc: 'Traduce texto entre más de 50 idiomas mientras escribes.',
    size: '~22–55 MB por par',
    model: 'Firefox Translations',
    author: 'Mozilla',
    license: 'MPL-2.0',
    modelUrl: 'https://huggingface.co/midudev/firefox-translations',
    seoTitle: 'Traductor gratis y privado: traduce texto sin enviarlo',
    seoDesc: 'Traduce texto entre más de 50 idiomas gratis y sin enviarlo a ningún servidor. Los modelos de Firefox Translations funcionan en tu navegador, incluso sin conexión.',
    steps: [
      'Elige el idioma de origen y el de destino.',
      'Escribe o pega tu texto: se traduce mientras escribes.',
      'Copia la traducción con un clic.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí, sin registro ni límite de caracteres.'],
      ['¿Mi texto se envía a internet?', 'No. A diferencia de los traductores en línea, la traducción ocurre en tu dispositivo: ideal para textos privados.'],
      ['¿Qué idiomas soporta?', 'Más de 50, entre ellos español, inglés, portugués, francés, alemán e italiano.'],
      ['¿Funciona sin conexión?', 'Sí. Cada par de idiomas se descarga una vez (unos 22–55 MB) y después funciona offline.']
    ]
  },
  {
    slug: 'imagen-a-texto',
    name: 'Imagen a texto',
    task: 'OCR',
    cat: 'Imagen',
    color: '#b5e43c',
    desc: 'Copia el texto de cualquier foto, captura o documento escaneado.',
    size: '~31 MB',
    model: 'PP-OCRv6',
    author: 'PaddlePaddle',
    license: 'Apache-2.0',
    modelUrl: 'https://huggingface.co/PaddlePaddle/PP-OCRv6_small_rec_onnx',
    seoTitle: 'Imagen a texto gratis (OCR): extrae el texto de una foto',
    seoDesc: 'Convierte una imagen a texto gratis y sin subirla a ningún servidor. OCR que lee fotos, capturas, recibos y documentos directamente en tu navegador.',
    steps: [
      'Suelta, elige o pega (Ctrl+V) una foto o captura.',
      'El OCR detecta cada línea y reconoce el texto en tu dispositivo.',
      'Copia el texto con un clic y pégalo donde lo necesites.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. No hay registro, ni límites de uso, ni marcas de agua.'],
      ['¿Mi imagen se sube a internet?', 'No. El modelo se descarga una vez y todo el reconocimiento ocurre en tu navegador: la foto nunca sale de tu dispositivo.'],
      ['¿Qué imágenes puedo usar?', 'Cualquier formato que tu navegador abra: JPG, PNG, WebP, capturas de pantalla, fotos de documentos o recibos.'],
      ['¿Funciona sin conexión?', 'Después de la primera descarga el modelo queda en caché, así que puedes usarlo aunque no tengas internet.']
    ]
  },
  {
    slug: 'audio-a-texto',
    name: 'Audio a texto',
    task: 'Transcripción',
    cat: 'Audio',
    color: '#4dd4f0',
    desc: 'Graba tu voz o sube un audio y obtén la transcripción en 99 idiomas.',
    size: '~44 MB',
    model: 'Whisper tiny',
    author: 'OpenAI',
    license: 'Apache-2.0',
    modelUrl: 'https://huggingface.co/onnx-community/whisper-tiny',
    seoTitle: 'Audio a texto gratis: transcribe audio y voz en español',
    seoDesc: 'Transcribe audios, notas de voz y videos a texto gratis, con marcas de tiempo. Whisper funciona en tu navegador: tu audio no se sube a ningún servidor.',
    steps: [
      'Graba tu voz o suelta un archivo de audio o video.',
      'Whisper transcribe el audio en tu dispositivo, por segmentos.',
      'Copia el texto completo o revisa cada fragmento con su marca de tiempo.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. No hay registro ni límite de minutos.'],
      ['¿Mi audio se envía a internet?', 'No. La transcripción ocurre en tu navegador y el audio nunca sale de tu dispositivo.'],
      ['¿Qué formatos acepta?', 'MP3, WAV, M4A, OGG, MP4 y casi cualquier audio o video que tu navegador pueda reproducir.'],
      ['¿Entiende español?', 'Sí, y otros 98 idiomas. También puede detectar el idioma automáticamente.']
    ]
  },
  {
    slug: 'mapa-de-profundidad',
    name: 'Mapa de profundidad',
    task: 'Profundidad 3D',
    cat: 'Imagen',
    color: '#a78bfa',
    desc: 'Calcula qué tan lejos está cada punto de una foto.',
    size: '~27–50 MB',
    model: 'Depth Anything V2 Small',
    author: 'Depth Anything',
    license: 'Apache-2.0',
    modelUrl: 'https://huggingface.co/onnx-community/depth-anything-v2-small',
    seoTitle: 'Mapa de profundidad gratis a partir de una foto',
    seoDesc: 'Genera un mapa de profundidad desde una sola imagen, gratis y sin subirla. Útil para efectos 3D, edición, paralaje y diseño, directamente en tu navegador.',
    steps: [
      'Suelta, elige o pega una foto.',
      'La IA estima la distancia de cada píxel: claro es cerca y oscuro, lejos.',
      'Descarga el mapa en PNG para usarlo en edición, 3D o efectos de paralaje.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí, sin registro ni límites.'],
      ['¿Para qué sirve un mapa de profundidad?', 'Para crear efectos 3D y de paralaje, desenfocar fondos, generar relieves o guiar herramientas de edición e IA.'],
      ['¿Mi foto se sube a un servidor?', 'No. Todo el cálculo ocurre en tu navegador.'],
      ['¿Funciona sin conexión?', 'Sí, después de la primera descarga del modelo.']
    ]
  }
];

/* Herramientas con página propia (las que tienen `soon` solo se anuncian). */
export const READY_TOOLS = LAB_TOOLS.filter((t) => !t.soon);

export const LAB_SECTION = {
  id: 'lab',
  href: '/estudio/',
  title: 'Estudio Creativo',
  desc: 'Herramientas gratis que funcionan en tu navegador. Sin registro y sin subir tus archivos.'
};

/* Iconos de píxeles al estilo de runonweb, uno por herramienta. */
const ICONS = {
  'imagen-a-texto': '<rect x="0" y="4" width="64" height="6"/><rect x="0" y="18" width="40" height="6"/><rect x="0" y="32" width="54" height="6"/><rect x="0" y="46" width="30" height="6"/>',
  'quitar-fondo': '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M6 6h26v44H6z" opacity=".6"/><path d="M14 14h10v10H14zM10 28h18v16H10z"/><path d="M32 6h8v8h-8zM48 6h8v8h-8zM40 14h8v8h-8zM56 14h2v8h-2zM32 22h8v8h-8zM48 22h8v8h-8zM40 30h8v8h-8zM32 38h8v8h-8zM48 38h8v8h-8z" opacity=".8"/>',
  'audio-a-texto': '<path d="M0 24h6v8H0zM8 16h6v24H8zM16 8h6v40h-6zM24 20h6v16h-6zM34 20h6v16h-6zM42 8h6v40h-6zM50 16h6v24h-6zM58 24h6v8h-6z"/>',
  'mapa-de-profundidad': '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M8 8h48v40H8z" opacity=".6"/><path d="M16 16h32v24H16z"/><path d="M24 24h16v8H24z" opacity=".35"/>',
  traductor: '<path d="M2 4h30v24H14l-6 8v-8H2z"/><path d="M8 10h18v12H8z" opacity=".35"/><path d="M34 22h28v22h-6v8l-6-8H34z" opacity=".6"/><path d="M40 28h16v10H40z" opacity=".35"/>',
  'pdf-a-word': '<path d="M8 0h32l16 16v40H8z" opacity=".35"/><path d="M40 0v16h16z" opacity=".6"/><path d="M16 26h32v5H16zM16 36h32v5H16zM16 46h20v5H16z"/>',
  'comprimir-imagen': '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M28 4h8v14h8L32 30 20 18h8zM28 52h8V38h8L32 26 20 38h8z"/>',
  'convertir-imagen': '<path d="M0 6h28v24H0z" opacity=".6"/><path d="M36 26h28v24H36z"/><path d="M34 8h14v8h6l-10 10-10-10h6z" opacity=".8"/>',
  'unir-pdf': '<path d="M0 4h26v34H0z" opacity=".45"/><path d="M38 4h26v34H38z" opacity=".45"/><path d="M6 12h14v3H6zM6 19h14v3H6zM44 12h14v3H44zM44 19h14v3H44z" opacity=".8"/><path d="M10 38h8v6h28v-6h8v12H10z"/><path d="M28 30h8v8h6l-10 10-10-10h6z"/>',
  'desbloquear-pdf': '<path d="M8 0h32l16 16v40H8z" opacity=".35"/><path d="M22 22h6v-6a8 8 0 0 1 16 0h-6a2 2 0 0 0-4 0v6h6v6H22z" opacity=".7"/><path d="M18 28h28v20H18z"/><path d="M30 34h4v8h-4z" opacity=".35"/>',
  'descargar-videos': '<path d="M0 8h64v40H0z" opacity=".35"/><path d="M0 8h6v6H0zM0 22h6v6H0zM0 36h6v6H0zM58 8h6v6h-6zM58 22h6v6h-6zM58 36h6v6h-6z" opacity=".7"/><path d="M28 14h8v14h8L32 42 20 28h8z"/>'
};

const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/** Ficha de una herramienta (o de una que viene pronto). `h` es el nivel del título en su página. */
export function toolCardMarkup(t, { h = 'h2', i = 0 } = {}) {
  const soon = Boolean(t.soon);
  const icon = `<span class="tool-card__icon"><svg viewBox="0 0 64 56" aria-hidden="true">${ICONS[t.slug] ?? ''}</svg></span>`;
  const body = `
    <span class="tool-card__tag">${escHtml(soon ? t.task : `${t.task} · ${t.cat}`)}</span>
    <${h} class="tool-card__name">${escHtml(t.name)}</${h}>
    <span class="tool-card__desc">${escHtml(t.desc)}</span>`;

  if (soon) {
    return `<div class="tool-card tool-card--soon" style="--i:${i}">${icon}<span class="tool-card__body">${body}</span>
      <span class="tool-card__foot"><span class="tool-card__soon">Muy pronto</span></span></div>`;
  }
  return `<a class="tool-card" href="/estudio/${t.slug}" style="--tool:${t.color};--i:${i}">${icon}<span class="tool-card__body">${body}</span>
    <span class="tool-card__foot"><span>${escHtml(t.foot ?? `Descarga ${t.size}`)}</span><span class="tool-card__go">Abrir <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></span></a>`;
}

/** Rejilla en el orden del catálogo; `upcoming: false` deja fuera las que vienen pronto. */
export function toolGridMarkup({ h = 'h2', upcoming = true, exclude } = {}) {
  const items = (upcoming ? LAB_TOOLS : READY_TOOLS).filter((t) => t.slug !== exclude);
  return `<div class="tool-grid">${items.map((t, i) => toolCardMarkup(t, { h, i })).join('')}</div>`;
}
