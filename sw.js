/* Bump on every deploy — `node scripts/release.mjs` does it for you.
   The browser re-fetches this file, sees new bytes, and installs a new worker. */
const VERSION = 'vk-2026-09-08-12';
const SHELL = [
  '/',
  '/assets/css/app.css',
  '/assets/js/app.js',
  '/assets/js/views.js',
  '/assets/js/views-kinetic.js',
  '/assets/js/shell.js',
  '/assets/css/kinetic.css',
  '/assets/js/data.js',
  '/assets/img/icon.svg',
  '/manifest.webmanifest',
];

/* No skipWaiting here on purpose: the new worker sits in `waiting` until the
   page tells us the user accepted the update. That keeps a running tab from
   swapping its JS out mid-session. */
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)));
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  /* Every route is the same shell — serve it from cache so navigation is instant offline. */
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/')),
    );
    return;
  }

  /* Assets: cache first, refresh in the background. */
  e.respondWith(
    caches.match(request).then((hit) => {
      const net = fetch(request).then((res) => {
        if (res.ok) caches.open(VERSION).then((c) => c.put(request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || net;
    }),
  );
});
