/**
 * ZETTBOT - PWA Service Worker (sw.js)
 * Membantu pemuatan aplikasi secepat kilat (0.2 dtk) dengan memaketkan aset-aset penting.
 */

const CACHE_NAME = 'zettbot-absensi-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js'
];

// Tahap Install: Simpan aset statis dasar ke dalam cache HP
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ZettBOT SW] Melakukan Caching Aset Dasar...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Tahap Aktifasi: Hapus cache lama jika ada update versi aplikasi terbaru
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ZettBOT SW] Menghapus Cache Lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi Intersepsi Request (Cache First, kemudian Network Fallback)
self.addEventListener('fetch', (event) => {
  // Hanya intercept request GET (mengabaikan POST ke API Google Apps Script)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Load instant dari cache HP
      }
      return fetch(event.request); // Ambil dari internet jika belum di-cache
    })
  );
});
