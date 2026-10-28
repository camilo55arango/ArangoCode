/* Catálogo del Estudio Creativo. Lo usan el inicio, las páginas de /estudio y vite.config.js (SEO estático). */

export const SITE = 'https://arangocode.com';

export const LAB_TOOLS = [
  {
    slug: 'editar-pdf',
    accepts: ['pdf'],
    keywords: 'editar modificar escribir agregar texto imagen tachar resaltar tapar borrar rellenar formulario girar eliminar paginas anotar',
    name: 'Editar PDF',
    task: 'Editar',
    cat: 'Documentos',
    color: '#ff8a65',
    desc: 'Escribe, resalta, tapa, dibuja, añade imágenes y rellena formularios en tu PDF.',
    weight: 'Motor ~2 MB',
    feature: 'Formularios y páginas',
    credits: [['PDF.js', 'https://github.com/mozilla/pdf.js', 'Apache-2.0'], ['pdf-lib', 'https://github.com/Hopding/pdf-lib', 'MIT']],
    seoTitle: 'Editar PDF gratis online: añade texto, imágenes y firmas',
    seoDesc: 'Edita un PDF gratis y sin subirlo: escribe texto, resalta, tapa datos, dibuja, añade imágenes o tu firma, rellena formularios y gira, ordena o elimina páginas. Todo en tu navegador.',
    steps: [
      'Suelta tu PDF y elige una herramienta: texto, resaltar, tapar, dibujar, imagen o firma.',
      'Haz clic o arrastra sobre la página. Mueve y cambia el tamaño de lo que añadas; gira, ordena o elimina páginas.',
      'Pulsa Guardar PDF y descarga el documento editado.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de páginas y sin marcas de agua.'],
      ['¿Mi PDF se sube a internet?', 'No. El PDF se abre y se edita dentro de tu navegador; nunca sale de tu dispositivo.'],
      ['¿Puedo cambiar el texto que ya tiene el PDF?', 'No directamente: un PDF guarda el texto como dibujo en posiciones fijas, así que reescribirlo rompe el diseño. Lo que sí puedes hacer es taparlo con un rectángulo blanco (herramienta Tapar) y escribir encima el texto nuevo.'],
      ['¿Puedo rellenar formularios?', 'Sí. Si el PDF tiene campos de formulario, aparecen en un panel para que los completes. Si es un formulario escaneado, escribe encima con la herramienta Texto.'],
      ['¿Tapar oculta el dato de verdad?', 'Tapa el dato a la vista y al imprimir, pero el texto original puede seguir dentro del archivo y copiarse. Para documentos sensibles, después de editar pásalo por PDF a imagen y luego por Imagen a PDF.']
    ]
  },
  {
    slug: 'comprimir-pdf',
    accepts: ['pdf'],
    keywords: 'comprimir reducir peso tamaño achicar optimizar pdf liviano enviar correo whatsapp',
    name: 'Comprimir PDF',
    task: 'Optimizar',
    cat: 'Documentos',
    color: '#e5484d',
    desc: 'Reduce el peso de un PDF para enviarlo por correo o WhatsApp.',
    weight: 'Motor ~2 MB',
    feature: 'Tres niveles',
    credits: [['qpdf', 'https://github.com/qpdf/qpdf', 'Apache-2.0'], ['pdf-lib', 'https://github.com/Hopding/pdf-lib', 'MIT']],
    seoTitle: 'Comprimir PDF gratis: reduce el peso sin subirlo',
    seoDesc: 'Comprime un PDF gratis y sin subirlo a ningún servidor. Reduce el peso de las imágenes y optimiza el archivo para enviarlo por correo o WhatsApp, con tres niveles de compresión.',
    steps: [
      'Suelta el PDF que quieres comprimir.',
      'Elige el nivel: sin pérdida, recomendado o fuerte.',
      'Compara el peso antes y después, y descarga el PDF comprimido.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de archivos y sin marcas de agua.'],
      ['¿Mi PDF se sube a internet?', 'No. La compresión ocurre en tu navegador: el archivo nunca sale de tu dispositivo.'],
      ['¿Cuánto se reduce?', 'Depende del contenido. Los PDF con fotos o escaneados suelen bajar entre un 40 % y un 80 % en el nivel recomendado. Los que son solo texto ya pesan poco y bajan menos.'],
      ['¿Se pierde calidad?', '«Sin pérdida» solo reorganiza el archivo. «Recomendado» reduce las fotos a una resolución buena para pantalla e impresión normal, y «Fuerte» prioriza el peso. El texto siempre queda nítido.'],
      ['¿Y si el resultado pesa más?', 'La herramienta te lo dice y te deja el original: nunca descargas un archivo más grande.']
    ]
  },
  {
    slug: 'unir-pdf',
    accepts: ['pdf'],
    keywords: 'juntar combinar fusionar pegar varios pdf en uno merge',
    name: 'Unir PDF',
    task: 'Unir',
    cat: 'Documentos',
    color: '#8b7cf6',
    desc: 'Junta varios PDF en uno solo, en el orden que tú elijas.',
    weight: 'Motor ~1.4 MB',
    feature: 'Varios a la vez',
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
    slug: 'dividir-pdf',
    accepts: ['pdf'],
    keywords: 'separar cortar extraer paginas partir split',
    name: 'Dividir PDF',
    task: 'Dividir',
    cat: 'Documentos',
    color: '#2bb3a3',
    desc: 'Separa un PDF por rangos o extrae las páginas que necesites.',
    weight: 'Motor ~3 MB',
    feature: 'Por rangos o páginas',
    credits: [['qpdf', 'https://github.com/qpdf/qpdf', 'Apache-2.0'], ['qpdf-wasm', 'https://github.com/neslinesli93/qpdf-wasm', 'ISC'], ['PDF.js', 'https://github.com/mozilla/pdf.js', 'Apache-2.0']],
    seoTitle: 'Dividir PDF gratis: separa por rangos o extrae páginas',
    seoDesc: 'Divide un PDF por rangos de páginas, cada cierto número de páginas o extrae las páginas que elijas, gratis y sin subirlo a ningún servidor. Descarga cada parte o todo en un ZIP.',
    steps: [
      'Suelta o elige el PDF que quieres dividir y mira sus páginas en miniatura.',
      'Elige rangos personalizados, partes de un número fijo de páginas, o las páginas a extraer.',
      'Pulsa Dividir y descarga cada parte, todas en un ZIP o unidas en un solo PDF.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de páginas y sin marcas de agua.'],
      ['¿Mi PDF se sube a internet?', 'No. La división ocurre en tu navegador con qpdf: el archivo nunca sale de tu dispositivo.'],
      ['¿Puedo sacar solo algunas páginas?', 'Sí. En «Páginas», escribe las que quieres (por ejemplo 1, 3, 5-8) o haz clic en sus miniaturas. Puedes descargarlas por separado o unidas en un solo PDF.'],
      ['¿Qué pasa con la calidad?', 'Nada cambia: las páginas se copian tal cual, con su texto, imágenes y enlaces.']
    ]
  },
  {
    slug: 'pdf-a-word',
    accepts: ['pdf'],
    keywords: 'convertir pdf a docx word editable ocr escaneado',
    name: 'PDF a Word',
    task: 'Convertir',
    cat: 'Documentos',
    color: '#4f8cf7',
    desc: 'Convierte un PDF en un Word editable que se ve igual que el original.',
    weight: 'Motor ~1.7 MB',
    feature: 'Con OCR gratis',
    credits: [['PDF.js', 'https://github.com/mozilla/pdf.js', 'Apache-2.0'], ['docx', 'https://github.com/dolanmiu/docx', 'MIT'], ['PP-OCRv6', 'https://huggingface.co/PaddlePaddle/PP-OCRv6_small_rec_onnx', 'Apache-2.0']],
    seoTitle: 'PDF a Word gratis, con el mismo diseño y OCR',
    seoDesc: 'Convierte PDF a Word (.docx) gratis conservando el diseño: tablas, casillas, logos y firmas en su sitio y el texto editable. Con OCR para PDF escaneados y sin subir tu archivo.',
    steps: [
      'Elige si quieres conservar el diseño o solo el texto, y activa OCR si el PDF es escaneado.',
      'Suelta tu PDF: cada página se reconstruye en tu navegador con su texto, líneas e imágenes.',
      'Descarga el .docx y edítalo en Word o LibreOffice.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de páginas y sin marcas de agua.'],
      ['¿Mi PDF se sube a internet?', 'No. La conversión ocurre en tu navegador: el documento nunca sale de tu dispositivo.'],
      ['¿Conserva el diseño?', 'Sí, con «Conservar diseño»: el tamaño de página, las tablas, casillas, líneas, logos y firmas quedan en su sitio, y cada línea de texto queda editable en su posición, con su fuente, tamaño y negrita. Si prefieres párrafos que fluyan para reescribir mucho texto, elige «Solo texto».'],
      ['¿Funciona con PDF escaneados?', 'Sí. Activa OCR: reconoce el texto de las páginas escaneadas y lo deja editable sobre la imagen original. El OCR también es gratis y funciona en tu dispositivo.'],
      ['¿Se ve igual en Google Docs?', 'Para el diseño exacto, abre el archivo en Microsoft Word o LibreOffice. Google Docs no respeta los elementos posicionados y los acomoda en una columna.']
    ]
  },
  {
    slug: 'firmar-pdf',
    accepts: ['pdf'],
    keywords: 'firmar firma rubrica firma digital electronica dibujar firma contrato documento',
    name: 'Firmar PDF',
    task: 'Firmar',
    cat: 'Documentos',
    color: '#36b37e',
    desc: 'Dibuja, escribe o sube tu firma y colócala en el PDF.',
    weight: 'Motor ~2 MB',
    feature: 'Dibujada o escrita',
    credits: [['PDF.js', 'https://github.com/mozilla/pdf.js', 'Apache-2.0'], ['pdf-lib', 'https://github.com/Hopding/pdf-lib', 'MIT']],
    seoTitle: 'Firmar PDF gratis: dibuja o escribe tu firma sin subir el documento',
    seoDesc: 'Firma un PDF gratis y sin subirlo: dibuja tu firma con el mouse o el dedo, escríbela o sube una foto, colócala donde quieras y añade la fecha. El documento nunca sale de tu dispositivo.',
    steps: [
      'Suelta el PDF que vas a firmar.',
      'Crea tu firma: dibújala, escríbela o sube una imagen. Colócala y ajusta su tamaño.',
      'Añade la fecha o tu nombre si hace falta, y descarga el PDF firmado.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro y sin límite de documentos.'],
      ['¿Mi documento se sube a internet?', 'No. El PDF y tu firma se quedan en tu navegador: nunca salen de tu dispositivo.'],
      ['¿Es una firma digital certificada?', 'No. Es una firma electrónica simple: la imagen de tu firma sobre el documento, como cuando firmas a mano y escaneas. Sirve para la mayoría de trámites cotidianos; para trámites que exigen firma digital certificada necesitas un certificado de una entidad autorizada.'],
      ['¿Puedo firmar desde el celular?', 'Sí. Dibuja la firma con el dedo y colócala tocando la página.']
    ]
  },
  {
    slug: 'pdf-a-imagen',
    accepts: ['pdf'],
    keywords: 'pdf a jpg pdf a png convertir pagina imagen foto exportar',
    name: 'PDF a imagen',
    task: 'Convertir',
    cat: 'Documentos',
    color: '#00a3bf',
    desc: 'Convierte cada página de un PDF en una imagen JPG o PNG.',
    weight: 'Motor ~1.7 MB',
    feature: 'Todas en un ZIP',
    credits: [['PDF.js', 'https://github.com/mozilla/pdf.js', 'Apache-2.0'], ['fflate', 'https://github.com/101arrowz/fflate', 'MIT']],
    seoTitle: 'PDF a JPG o PNG gratis: convierte cada página en imagen',
    seoDesc: 'Convierte un PDF a imágenes JPG o PNG gratis y sin subirlo. Elige la calidad, descarga cada página por separado o todas en un ZIP.',
    steps: [
      'Suelta el PDF.',
      'Elige el formato (JPG o PNG) y la calidad.',
      'Descarga cada página o todas juntas en un ZIP.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de páginas y sin marcas de agua.'],
      ['¿Mi PDF se sube a internet?', 'No. Las páginas se dibujan en tu navegador con PDF.js; el archivo nunca sale de tu dispositivo.'],
      ['¿JPG o PNG?', 'JPG pesa menos y es ideal para compartir. PNG conserva cada detalle del texto y las líneas, pero pesa más.'],
      ['¿Qué calidad elijo?', 'Pantalla (96 ppp) para ver en el celular, Alta (150 ppp) para casi todo e Impresión (300 ppp) si vas a imprimir o ampliar.']
    ]
  },
  {
    slug: 'imagen-a-pdf',
    accepts: ['image'],
    keywords: 'jpg a pdf png a pdf foto a pdf imagenes a pdf convertir escanear heic iphone',
    name: 'Imagen a PDF',
    task: 'Convertir',
    cat: 'Documentos',
    color: '#6554c0',
    desc: 'Junta fotos JPG, PNG o HEIC en un PDF, en el orden que quieras.',
    weight: 'Motor < 1 MB',
    feature: 'Varias a la vez',
    credits: [['pdf-lib', 'https://github.com/Hopding/pdf-lib', 'MIT'], ['heic-to', 'https://github.com/hoppergee/heic-to', 'LGPL-3.0']],
    seoTitle: 'JPG a PDF gratis: convierte tus fotos e imágenes en un PDF',
    seoDesc: 'Convierte imágenes JPG, PNG, WebP y fotos HEIC del iPhone a PDF gratis y sin subirlas. Ordénalas, elige tamaño de página y márgenes, y descarga un solo PDF.',
    steps: [
      'Suelta o elige tus imágenes (JPG, PNG, WebP o HEIC).',
      'Ordénalas y elige el tamaño de página, la orientación y el margen.',
      'Pulsa Crear PDF y descárgalo.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí. Sin registro, sin límite de imágenes y sin marcas de agua.'],
      ['¿Mis fotos se suben a internet?', 'No. El PDF se arma en tu navegador: tus imágenes nunca salen de tu dispositivo.'],
      ['¿Puedo usar fotos del iPhone?', 'Sí. Las fotos HEIC se convierten automáticamente.'],
      ['¿Qué tamaño de página elijo?', 'A4 o Carta si lo vas a imprimir; «Igual a la imagen» si solo quieres compartirlo y que cada foto ocupe toda la página.']
    ]
  },
  {
    slug: 'desbloquear-pdf',
    accepts: ['pdf'],
    keywords: 'quitar contraseña clave proteccion restricciones imprimir copiar',
    name: 'Desbloquear PDF',
    task: 'Seguridad',
    cat: 'Documentos',
    color: '#f2b84b',
    desc: 'Quita la contraseña y las restricciones de imprimir, copiar o editar.',
    weight: 'Motor ~1.4 MB',
    feature: 'Sin adivinar claves',
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
      ['¿Se pierde calidad?', 'No. El contenido del PDF queda igual; solo se elimina el cifrado.'],
      ['¿Puedo usarlo con cualquier PDF?', 'Úsalo solo con documentos tuyos o con permiso de su autor. Sirve para recuperar el control de tus propios archivos, por ejemplo un extracto bancario o un PDF al que le pusiste restricciones y ya no las necesitas.']
    ]
  },
  {
    slug: 'quitar-fondo',
    accepts: ['image'],
    keywords: 'borrar eliminar fondo transparente recortar png foto',
    name: 'Quitar fondo',
    task: 'Recorte',
    cat: 'Imagen',
    feature: 'Personas y objetos',
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
    accepts: ['image'],
    keywords: 'cambiar formato jpg png webp avif heic iphone',
    name: 'Convertir imágenes',
    task: 'Convertir',
    cat: 'Imagen',
    color: '#38c793',
    desc: 'Pasa tus imágenes entre JPG, PNG, WebP y AVIF, también desde HEIC.',
    weight: 'Motor < 1 MB',
    feature: 'Varias a la vez',
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
    accepts: ['image'],
    keywords: 'reducir peso optimizar foto mas liviana tamaño',
    name: 'Comprimir imágenes',
    task: 'Optimizar',
    cat: 'Imagen',
    color: '#ef6f9b',
    desc: 'Reduce el peso de tus fotos sin que se note la diferencia.',
    weight: 'Motor < 1 MB',
    feature: 'Varias a la vez',
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
    slug: 'imagen-a-texto',
    accepts: ['image'],
    keywords: 'ocr extraer copiar texto foto captura escaneo',
    name: 'Imagen a texto',
    task: 'OCR',
    cat: 'Imagen',
    feature: 'Offline tras el primer uso',
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
    accepts: ['audio'],
    keywords: 'transcribir transcripcion voz nota de voz whisper subtitulos video',
    name: 'Audio a texto',
    task: 'Transcripción',
    cat: 'Audio',
    feature: 'Con marcas de tiempo',
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
    slug: 'traductor',
    accepts: [],
    keywords: 'traducir ingles español idiomas traduccion',
    name: 'Traductor',
    task: 'Traducción',
    cat: 'Texto',
    feature: 'Offline tras el primer uso',
    color: '#e09cf0',
    desc: 'Traduce texto entre más de 50 idiomas mientras escribes.',
    size: '~22–55 MB por idioma',
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
      ['¿Funciona sin conexión?', 'Sí, después del primer uso. Cada combinación de idiomas (por ejemplo, español → inglés) se descarga una vez (unos 22–55 MB) y después funciona sin conexión.']
    ]
  },
  {
    slug: 'generador-qr',
    accepts: [],
    keywords: 'qr codigo qr generar crear wifi enlace url contacto vcard menu',
    name: 'Generador de QR',
    task: 'Crear',
    cat: 'Texto',
    color: '#ffab00',
    desc: 'Crea códigos QR para enlaces, WiFi o contactos, con tus colores y logo.',
    weight: 'Sin descarga',
    feature: 'PNG y SVG',
    credits: [['qrcode-generator', 'https://github.com/kazuhikoarase/qrcode-generator', 'MIT']],
    seoTitle: 'Generador de códigos QR gratis: enlaces, WiFi y contactos',
    seoDesc: 'Crea códigos QR gratis para enlaces, texto, redes WiFi o contactos. Personaliza colores, añade tu logo y descárgalo en PNG o SVG. Sin registro y sin caducidad.',
    steps: [
      'Elige qué quieres compartir: un enlace, un texto, tu WiFi o un contacto.',
      'Personaliza los colores y, si quieres, añade tu logo en el centro.',
      'Descarga el QR en PNG o SVG.'
    ],
    faq: [
      ['¿Es gratis?', 'Sí, sin registro ni límites.'],
      ['¿El QR caduca?', 'No. El contenido va dentro del propio código, sin pasar por ningún servidor ni redirección, así que funciona para siempre.'],
      ['¿Se guardan mis datos, como la clave del WiFi?', 'No. El QR se genera en tu navegador y nada se envía a internet.'],
      ['¿El logo afecta la lectura?', 'Al añadir un logo el QR usa la máxima corrección de errores para seguir leyéndose. Prueba siempre con tu celular antes de imprimirlo.']
    ]
  },
  {
    slug: 'mapa-de-profundidad',
    accepts: ['image'],
    keywords: 'profundidad 3d paralaje desenfoque depth',
    name: 'Mapa de profundidad',
    task: 'Profundidad 3D',
    cat: 'Experimental',
    feature: 'Experimental',
    color: '#a78bfa',
    desc: 'Calcula qué tan lejos está cada punto de una foto, para efectos 3D o desenfocar el fondo.',
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
  },
  {
    slug: 'descargar-videos',
    accepts: [],
    keywords: 'bajar video youtube instagram tiktok facebook x mp4',
    name: 'Descargar videos',
    task: 'Video',
    cat: 'Externo',
    color: '#5b8def',
    desc: 'Pega el enlace de YouTube, Instagram, Facebook o X y guarda el video.',
    // Mientras se construye la herramienta propia, se abre SaveFrom en una pestaña nueva.
    external: 'https://es.savefrom.net/267hP/',
    weight: 'Enlace externo',
    feature: 'SaveFrom.net'
  }
];

/* Herramientas con página propia (las `soon` solo se anuncian y las `external` abren otro sitio). */
export const READY_TOOLS = LAB_TOOLS.filter((t) => !t.soon && !t.external);

export const LAB_SECTION = {
  id: 'lab',
  href: '/estudio/',
  title: 'Estudio Creativo',
  desc: 'Herramientas gratis que funcionan en tu navegador. Sin registro y sin subir tus archivos.'
};

/* Iconos de píxeles al estilo de runonweb, uno por herramienta. */
export const ICONS = {
  'editar-pdf': '<path d="M8 0h32l16 16v40H8z" opacity=".35"/><path d="M40 0v16h16z" opacity=".6"/><path d="M16 22h20v4H16zM16 30h14v4H16z" opacity=".7"/><path d="M44 24l8 8-18 18h-8v-8z"/><path d="M48 20l8 8-3 3-8-8z" opacity=".7"/>',
  'comprimir-pdf': '<path d="M8 0h32l16 16v40H8z" opacity=".35"/><path d="M40 0v16h16z" opacity=".6"/><path d="M28 6h8v12h8L32 30 20 18h8zM28 50h8V38h8L32 26 20 38h8z"/>',
  'firmar-pdf': '<path d="M8 0h32l16 16v40H8z" opacity=".35"/><path d="M40 0v16h16z" opacity=".6"/><path d="M14 40h6v-6h6v6h6v-6h6v6h6v4H14z"/><path d="M14 48h36v3H14z" opacity=".7"/>',
  'pdf-a-imagen': '<path d="M0 0h26v34H0z" opacity=".45"/><path d="M5 8h16v3H5zM5 14h16v3H5zM5 20h10v3H5z" opacity=".8"/><path d="M28 14h8v-6l10 10-10 10v-6h-8z" opacity=".8"/><path d="M38 22h26v34H38z"/><path d="M42 48l7-9 5 6 4-4 4 7z" fill-opacity=".35" opacity=".5"/>',
  'imagen-a-pdf': '<path d="M0 6h28v24H0z"/><path d="M4 26l7-9 5 6 4-4 6 7z" opacity=".35"/><path d="M30 14h8v-6l10 10-10 10v-6h-8z" opacity=".8"/><path d="M38 22h26v34H38z" opacity=".45"/><path d="M43 30h16v3H43zM43 36h16v3H43zM43 42h10v3H43z" opacity=".8"/>',
  'generador-qr': '<path d="M4 0h20v20H4zM40 0h20v20H40zM4 36h20v20H4z"/><path d="M10 6h8v8h-8zM46 6h8v8h-8zM10 42h8v8h-8z" opacity=".35"/><path d="M30 4h6v6h-6zM30 16h6v6h-6zM30 28h6v6h-6zM42 28h6v6h-6zM54 28h6v6h-6zM42 40h6v6h-6zM30 46h6v6h-6zM54 46h6v6h-6zM48 52h6v4h-6z" opacity=".8"/>',
  'imagen-a-texto': '<rect x="0" y="4" width="64" height="6"/><rect x="0" y="18" width="40" height="6"/><rect x="0" y="32" width="54" height="6"/><rect x="0" y="46" width="30" height="6"/>',
  'quitar-fondo': '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M6 6h26v44H6z" opacity=".6"/><path d="M14 14h10v10H14zM10 28h18v16H10z"/><path d="M32 6h8v8h-8zM48 6h8v8h-8zM40 14h8v8h-8zM56 14h2v8h-2zM32 22h8v8h-8zM48 22h8v8h-8zM40 30h8v8h-8zM32 38h8v8h-8zM48 38h8v8h-8z" opacity=".8"/>',
  'audio-a-texto': '<path d="M0 24h6v8H0zM8 16h6v24H8zM16 8h6v40h-6zM24 20h6v16h-6zM34 20h6v16h-6zM42 8h6v40h-6zM50 16h6v24h-6zM58 24h6v8h-6z"/>',
  'mapa-de-profundidad': '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M8 8h48v40H8z" opacity=".6"/><path d="M16 16h32v24H16z"/><path d="M24 24h16v8H24z" opacity=".35"/>',
  traductor: '<path d="M2 4h30v24H14l-6 8v-8H2z"/><path d="M8 10h18v12H8z" opacity=".35"/><path d="M34 22h28v22h-6v8l-6-8H34z" opacity=".6"/><path d="M40 28h16v10H40z" opacity=".35"/>',
  'pdf-a-word': '<path d="M8 0h32l16 16v40H8z" opacity=".35"/><path d="M40 0v16h16z" opacity=".6"/><path d="M16 26h32v5H16zM16 36h32v5H16zM16 46h20v5H16z"/>',
  'comprimir-imagen': '<path d="M0 0h64v56H0z" opacity=".35"/><path d="M28 4h8v14h8L32 30 20 18h8zM28 52h8V38h8L32 26 20 38h8z"/>',
  'convertir-imagen': '<path d="M0 6h28v24H0z" opacity=".6"/><path d="M36 26h28v24H36z"/><path d="M34 8h14v8h6l-10 10-10-10h6z" opacity=".8"/>',
  'unir-pdf': '<path d="M0 4h26v34H0z" opacity=".45"/><path d="M38 4h26v34H38z" opacity=".45"/><path d="M6 12h14v3H6zM6 19h14v3H6zM44 12h14v3H44zM44 19h14v3H44z" opacity=".8"/><path d="M10 38h8v6h28v-6h8v12H10z"/><path d="M28 30h8v8h6l-10 10-10-10h6z"/>',
  'dividir-pdf': '<path d="M14 6h36v44H14z" opacity=".35"/><path d="M20 14h24v3H20zM20 21h24v3H20z" opacity=".8"/><path d="M8 28h4v2H8zM16 28h6v2h-6zM26 28h6v2h-6zM36 28h6v2h-6zM46 28h6v2h-6zM56 28h4v2h-4z"/><path d="M20 35h24v3H20zM20 42h16v3H20z" opacity=".8"/>',
  'desbloquear-pdf': '<path d="M8 0h32l16 16v40H8z" opacity=".35"/><path d="M22 22h6v-6a8 8 0 0 1 16 0h-6a2 2 0 0 0-4 0v6h6v6H22z" opacity=".7"/><path d="M18 28h28v20H18z"/><path d="M30 34h4v8h-4z" opacity=".35"/>',
  'descargar-videos': '<path d="M0 8h64v40H0z" opacity=".35"/><path d="M0 8h6v6H0zM0 22h6v6H0zM0 36h6v6H0zM58 8h6v6h-6zM58 22h6v6h-6zM58 36h6v6h-6z" opacity=".7"/><path d="M28 14h8v14h8L32 42 20 28h8z"/>'
};

const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/** Pie de la ficha: siempre dos etiquetas fijas, el peso de lo que se descarga y lo que la distingue. */
const footLabels = (t) => `<span class="tool-card__labels"><span class="tool-card__weight">${escHtml(t.weight ?? `Descarga ${t.size}`)}</span>${t.feature ? `<span class="tool-card__feature">${escHtml(t.feature)}</span>` : ''}</span>`;

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
  if (t.external) {
    return `<a class="tool-card tool-card--external" href="${escHtml(t.external)}" target="_blank" rel="noopener noreferrer" aria-label="${escHtml(t.name)}: enlace externo, se abre en una pestaña nueva" style="--tool:${t.color};--i:${i}">${icon}<span class="tool-card__body">${body}</span>
    <span class="tool-card__foot" aria-hidden="true">${footLabels(t)}<span class="tool-card__go">Abrir <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg></span></span></a>`;
  }
  return `<a class="tool-card" href="/estudio/${t.slug}" aria-label="${escHtml(t.name)}" style="--tool:${t.color};--i:${i}">${icon}<span class="tool-card__body">${body}</span>
    <span class="tool-card__foot" aria-hidden="true">${footLabels(t)}<span class="tool-card__go">Abrir <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></span></a>`;
}

/** Rejilla en el orden del catálogo; `upcoming: false` deja fuera las que vienen pronto. */
export function toolGridMarkup({ h = 'h2', upcoming = true, exclude } = {}) {
  const items = LAB_TOOLS.filter((t) => (upcoming || !t.soon) && t.slug !== exclude);
  return `<div class="tool-grid">${items.map((t, i) => toolCardMarkup(t, { h, i })).join('')}</div>`;
}
