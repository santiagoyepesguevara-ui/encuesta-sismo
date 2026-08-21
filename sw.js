const CACHE_NAME = 'sismo-app-v2'; // <--- Cambiamos a v2 para forzar la actualización
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalación: Guarda los archivos en caché e ignora el caché viejo
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Obliga al nuevo Service Worker a activarse de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Borra cachés antiguas automáticamente
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de búsqueda: Busca en red primero cuando hay conexión, si no hay red usa caché
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
