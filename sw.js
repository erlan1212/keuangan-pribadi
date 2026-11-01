// ============================================================
// Service Worker — Keuangan Pribadi
// File: sw.js
// Cache shell statis agar app bisa dibuka offline,
// data tetap diambil dari Google Sheets saat online.
// ============================================================

const CACHE_NAME = 'keuangan-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
];

// ── Install: cache shell ─────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: hapus cache lama ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first untuk shell, network-first untuk API ──
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Selalu ke network untuk request ke Apps Script (API) — jangan di-cache
  if (url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first untuk file statis
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
