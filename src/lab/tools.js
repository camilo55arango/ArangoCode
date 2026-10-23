/* Catálogo del laboratorio. Lo usan el inicio (tarjeta y Ctrl+K) y las páginas de /lab. */

export const LAB_TOOLS = [
  {
    slug: 'ocr',
    name: 'Scan',
    task: 'OCR',
    cat: 'Imagen',
    color: '#b5e43c',
    desc: 'Lee el texto de cualquier foto. Elige el tamaño del modelo.',
    size: '~31 MB',
    model: 'PP-OCRv6',
    author: 'PaddlePaddle',
    license: 'Apache-2.0',
    modelUrl: 'https://huggingface.co/PaddlePaddle/PP-OCRv6_small_rec_onnx'
  },
  {
    slug: 'remove-bg',
    name: 'Remover',
    task: 'Quitar fondo',
    cat: 'Imagen',
    color: '#f08a5d',
    desc: 'Suelta una foto y descarga un PNG con fondo transparente.',
    size: '~219 MB',
    model: 'BEN2',
    author: 'Prama LLC',
    license: 'MIT',
    modelUrl: 'https://huggingface.co/onnx-community/BEN2-ONNX'
  },
  {
    slug: 'stt',
    name: 'Scribe',
    task: 'Voz a texto',
    cat: 'Audio',
    color: '#4dd4f0',
    desc: 'Transcribe audio en español y otros 98 idiomas sin servidor.',
    size: '~44 MB',
    model: 'Whisper tiny',
    author: 'OpenAI',
    license: 'Apache-2.0',
    modelUrl: 'https://huggingface.co/onnx-community/whisper-tiny'
  },
  {
    slug: 'depth',
    name: 'Depth',
    task: 'Profundidad',
    cat: 'Imagen',
    color: '#a78bfa',
    desc: 'Un mapa de profundidad a partir de una sola foto.',
    size: '~27–50 MB',
    model: 'Depth Anything V2 Small',
    author: 'Depth Anything',
    license: 'Apache-2.0',
    modelUrl: 'https://huggingface.co/onnx-community/depth-anything-v2-small'
  },
  {
    slug: 'translate',
    name: 'Lingo',
    task: 'Traducción',
    cat: 'Texto',
    color: '#e09cf0',
    desc: 'Traduce texto entre más de 50 idiomas sin servidor.',
    size: '~22–55 MB por par',
    model: 'Firefox Translations',
    author: 'Mozilla',
    license: 'MPL-2.0',
    modelUrl: 'https://huggingface.co/midudev/firefox-translations'
  }
];

export const LAB_SECTION = {
  id: 'lab',
  href: '/lab/',
  title: 'IA en tu navegador',
  desc: 'OCR, quitar fondos, transcribir audio, profundidad y traducción. Todo corre en tu dispositivo, sin servidores.',
  grad: 'linear-gradient(135deg, #4d7c0f 0%, #84cc16 45%, #facc15 100%)',
  glow: 'rgba(132, 204, 22, .5)',
  icon: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9zM9 1.5V4M15 1.5V4M9 20v2.5M15 20v2.5M1.5 9H4M1.5 15H4M20 9h2.5M20 15h2.5"/></svg>'
};
