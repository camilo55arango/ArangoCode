import '../shell.js';
import qrcode from 'qrcode-generator';
import { $, createStatus, downloadBlob, nameField } from '../ui.js';

// Acentos, eñes y emojis: el contenido se codifica en UTF-8.
qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

const status = createStatus($('#status'));
const name = nameField();
const preview = $('#qr');
const QUIET = 4; // Margen en módulos que exige el estándar para leerse bien.

let logo = null; // { img, url }

const type = () => $('[name="type"]:checked').value;
const val = (id) => $(id).value.trim();

/* WiFi y vCard usan \ para escapar sus separadores. */
const escWifi = (s) => s.replace(/([\\;,:"])/g, '\\$1');
const escCard = (s) => s.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n');

function content() {
  switch (type()) {
    case 'url': {
      const url = val('#url');
      return url && !/^[a-z][\w+.-]*:/i.test(url) ? `https://${url}` : url;
    }
    case 'text': return $('#text').value;
    case 'wifi': {
      const ssid = val('#ssid');
      if (!ssid) return '';
      const sec = $('#wifiSec').value;
      const pass = sec === 'nopass' ? '' : `P:${escWifi($('#wifiPass').value)};`;
      return `WIFI:T:${sec};S:${escWifi(ssid)};${pass}${$('#wifiHidden').checked ? 'H:true;' : ''};`;
    }
    case 'contact': {
      const fields = [
        val('#cName') && `FN:${escCard(val('#cName'))}\nN:${escCard(val('#cName'))};;;;`,
        val('#cPhone') && `TEL;TYPE=CELL:${escCard(val('#cPhone'))}`,
        val('#cEmail') && `EMAIL:${escCard(val('#cEmail'))}`,
        val('#cOrg') && `ORG:${escCard(val('#cOrg'))}`,
        val('#cWeb') && `URL:${escCard(val('#cWeb'))}`
      ].filter(Boolean);
      return fields.length ? `BEGIN:VCARD\nVERSION:3.0\n${fields.join('\n')}\nEND:VCARD` : '';
    }
    default: return '';
  }
}

/** Matriz del QR, o null si el contenido está vacío o no cabe. Con logo se usa la máxima corrección (H). */
function build(text) {
  if (!text) return null;
  const qr = qrcode(0, logo ? 'H' : 'M');
  qr.addData(text, 'Byte');
  qr.make();
  return qr;
}

function colors() {
  return { fg: $('#fg').value, bg: $('#transparent').checked ? null : $('#bg').value };
}

/** Dibuja el QR en un canvas de `px` píxeles de lado. */
function draw(canvas, qr, px) {
  const { fg, bg } = colors();
  const count = qr.getModuleCount();
  const cell = px / (count + QUIET * 2);
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, px, px);
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, px, px); }
  ctx.fillStyle = fg;
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      // Se redondea hacia fuera para que no queden líneas finas entre módulos.
      if (qr.isDark(r, c)) ctx.fillRect(Math.floor((c + QUIET) * cell), Math.floor((r + QUIET) * cell), Math.ceil(cell), Math.ceil(cell));
    }
  }
  if (logo) {
    const box = px * 0.22;
    const pad = box * 0.12;
    const x = (px - box) / 2;
    ctx.fillStyle = bg ?? '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - pad, x - pad, box + pad * 2, box + pad * 2, pad * 1.5);
    ctx.fill();
    const s = Math.min(box / logo.img.width, box / logo.img.height);
    const w = logo.img.width * s;
    const h = logo.img.height * s;
    ctx.drawImage(logo.img, (px - w) / 2, (px - h) / 2, w, h);
  }
}

function svgMarkup(qr) {
  const { fg, bg } = colors();
  const count = qr.getModuleCount();
  const size = count + QUIET * 2;
  let d = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) if (qr.isDark(r, c)) d += `M${c + QUIET} ${r + QUIET}h1v1h-1z`;
  }
  let logoSvg = '';
  if (logo) {
    const box = size * 0.22;
    const pad = box * 0.12;
    const x = (size - box) / 2;
    logoSvg = `<rect x="${x - pad}" y="${x - pad}" width="${box + pad * 2}" height="${box + pad * 2}" rx="${pad * 1.5}" fill="${bg ?? '#ffffff'}"/>`
      + `<image href="${logo.url}" x="${x}" y="${x}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="1024" height="1024" shape-rendering="crispEdges">`
    + `${bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''}<path d="${d}" fill="${fg}"/>${logoSvg}</svg>`;
}

let current = null;

function render() {
  const text = content();
  try {
    current = build(text);
  } catch (e) {
    current = null;
    status.set('El contenido es demasiado largo para un código QR. Acórtalo un poco.', 'error');
    return;
  }
  $('#png').disabled = $('#svg').disabled = !current;
  if (!current) {
    preview.getContext('2d').clearRect(0, 0, preview.width, preview.height);
    $('#qrInfo').textContent = '';
    status.set('Escribe el contenido: el QR se actualiza al instante.');
    return;
  }
  draw(preview, current, 320 * Math.min(2, devicePixelRatio || 1));
  $('#qrInfo').textContent = `${current.getModuleCount()} × ${current.getModuleCount()} módulos · ${new TextEncoder().encode(text).length} bytes`;
  status.set(logo ? 'Listo. Con logo, prueba a escanearlo con tu celular antes de imprimirlo.' : 'Listo. Escanéalo con la cámara de tu celular para probarlo.', 'ok');
}

const fileBase = () => {
  const map = { url: 'qr-enlace', text: 'qr-texto', wifi: 'qr-wifi', contact: 'qr-contacto' };
  return map[type()];
};

document.querySelectorAll('[name="type"]').forEach((r) => r.addEventListener('change', () => {
  document.querySelectorAll('.lab-qr__fields').forEach((el) => { el.hidden = el.dataset.type !== type(); });
  name.suggest(`${fileBase()}.png`);
  render();
}));
$('.lab-qr__form').addEventListener('input', render);
$('.lab-qr__form').addEventListener('change', render);

$('#logo').addEventListener('change', async () => {
  const file = $('#logo').files[0];
  if (!file) return;
  // Se guarda como data URL para que el SVG descargado sea autónomo.
  const url = await new Promise((resolve) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(file); });
  const img = new Image();
  img.src = url;
  await img.decode();
  logo = { img, url };
  $('#logoRemove').hidden = false;
  $('#logo').value = '';
  render();
});
$('#logoRemove').addEventListener('click', () => {
  logo = null;
  $('#logoRemove').hidden = true;
  render();
});

$('#png').addEventListener('click', () => {
  if (!current) return;
  const canvas = document.createElement('canvas');
  draw(canvas, current, Number($('#size').value));
  canvas.toBlob((blob) => downloadBlob(blob, name.fileName(`${fileBase()}.png`)), 'image/png');
});
$('#svg').addEventListener('click', () => {
  if (!current) return;
  const file = name.fileName(`${fileBase()}.png`).replace(/\.png$/, '.svg');
  downloadBlob(new Blob([svgMarkup(current)], { type: 'image/svg+xml' }), file);
});

name.suggest(`${fileBase()}.png`);
render();
