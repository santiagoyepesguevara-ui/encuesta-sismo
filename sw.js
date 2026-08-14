const CACHE_NAME = 'sismo-app-v1';
const urlsToCache = [
  './',
  './index.html'
];

// Instalación: Guarda el index.html en la memoria del celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activación
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Intercepción de red: Si no hay internet, entrega el archivo guardado en memoria
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Devuelve la versión offline
        }
        return fetch(event.request); // Si hay red, usa la red
      })
  );
});
