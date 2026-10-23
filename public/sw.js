const CACHE_NAME = 'arangocode-v4';
// Los JS/CSS de /_app llevan hash y se cachean al vuelo; aquí solo lo que tiene URL fija.
const APP_SHELL = [
  '/',
  '/estudio/',
  '/assets/img/code.png',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const put = (req, res) => {
  // El clon se hace ya: cuando abra la caché, la página puede haber leído el cuerpo.
  if (res && res.ok) {
    const copy = res.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Los modelos vienen de otros orígenes y runonweb los guarda en su propia Cache Storage.
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin) || req.headers.has('range')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => put(req, res))
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  const url = new URL(req.url);
  if (url.pathname.startsWith('/_app/')) {
    event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => put(req, res))));
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => put(req, res)).catch(() => cached);
      return cached || network;
    })
  );
});
