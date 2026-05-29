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
  'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js',
  'https://cdn-icons-png.flaticon.com/512/854/854878.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ZettBOT SW] Melakukan Caching Aset Dasar...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; 
      }
      return fetch(event.request); 
    })
  );
});
