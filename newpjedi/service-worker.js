// service-worker.js
const cacheName = 'development';
const cacheAssets = ['/js/bundle.js', '/js/vendor.js'];

self.addEventListener('install', (event) => {
  if (cacheName == 'development') return;
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  clients.claim();
});
