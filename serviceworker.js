const cacheName = 'todos';
const cacheAssets = [
  'index.html',
  '/js/app.js',
  'script.js',
  '/scss/main.css',
  '/assets/icon-add.svg',
  '/assets/icon-selected.svg',
  '/assets/icon-trash.svg',
  '/assets/logo.svg',
  '/assets/icon-filter.svg',
];

self.addEventListener('install', (e) => {
  console.log('installed');
  console.log(e);
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(cacheAssets))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  console.log('activated');
  e.waitUntil(
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
});

self.addEventListener('fetch', async(e) => {
  console.log(e.request.url);
  
  e.respondWith(
    caches
      .match(e.request)
      .then((resp) => resp || await fetch(resp.request))
  );
});
