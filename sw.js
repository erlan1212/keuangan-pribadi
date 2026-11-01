// ============================================================
// Service Worker — Keuangan Pribadi v3
// ============================================================

const CACHE_NAME = 'keuangan-v3';  // naikkan versi → cache lama otomatis dihapus
const SHELL_FILES = [
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: hapus semua cache versi lama ───────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Jangan intercept JSONP/script tag ke Apps Script — biarkan browser handle
  if (url.includes('script.google.com')) return;

  // Jangan intercept request non-GET
  if (event.request.method !== 'GET') return;

  // Cache-first untuk file statis shell
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
