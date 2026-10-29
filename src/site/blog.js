/*
 * Bitácora: el blog de notas que aparece en la libreta de la portada.
 * Para publicar una nota, añádela ARRIBA de la lista (la más reciente primero) con:
 *   date: cómo se lee la fecha, text: la nota (corta: cabe en un post-it), y si quieres un enlace.
 * Cada hoja de la libreta muestra 3 notas; si hay más, la bitácora ocupa más hojas sola.
 */

export const BLOG = [
  {
    date: '28 de octubre de 2026',
    title: 'La portada ahora es una libreta',
    text: 'Puedes hojearla, saltar a cada capítulo con los marcadores y hasta dibujar en tu propia página.',
    color: '#ffe27a'
  },
  {
    date: '28 de octubre de 2026',
    title: 'Seis herramientas nuevas',
    text: 'Editar, Firmar y Comprimir PDF, PDF a imagen, Imagen a PDF y el Generador de QR. Todas sin subir tus archivos.',
    link: ['/estudio/', 'Ver el Estudio'],
    color: '#b9e3ff'
  },
  {
    date: '28 de octubre de 2026',
    title: 'Privacidad, por escrito',
    text: 'Ya hay páginas de privacidad, términos y contacto que explican cómo funciona todo por dentro.',
    link: ['/privacidad/', 'Leer'],
    color: '#c6f0c2'
  },
  {
    date: 'Octubre de 2026',
    title: 'Dividir PDF',
    text: 'Separa un PDF por rangos o extrae solo las páginas que necesitas, viendo las miniaturas antes.',
    link: ['/estudio/dividir-pdf', 'Probar'],
    color: '#ffc2d6'
  },
  {
    date: 'Octubre de 2026',
    title: 'Ponle nombre a tus descargas',
    text: 'Antes de descargar, ahora puedes escribir el nombre del archivo en todas las herramientas.',
    color: '#ffd8a8'
  },
  {
    date: 'Octubre de 2026',
    title: 'PDF a Word conserva el diseño',
    text: 'Tablas, casillas, logos y firmas quedan en su sitio, y el texto sigue siendo editable.',
    link: ['/estudio/pdf-a-word', 'Probar'],
    color: '#e3d4ff'
  }
];
