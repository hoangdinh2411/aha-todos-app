window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker
        .register('/serviceworker.js')
        .then((reg) =>
          console.log('Service worker registered')
        )
        .catch((err) =>
          console.error(`Service Worker Error: ${err}`)
        );
    } catch (error) {
      console.log(error);
    }
  }
});

const cacheName = 'v1';
const cacheAssets = [
  'index.html',
  'js/app.js',
  'scss/main.css',
];

self.addEventListener('install', (e) => {
  e.waitUtil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(cacheAssets))
      .then(() => self.skipWaiting())
  );
});


self.addEventListener('activate',(e)=>{
    e.waitUtil(caches.keys().then(cacheNames=>{
        return Promise.all(
            cacheNames.map(cache=>{
                if(cache !== cacheName){
                    return caches.delete(cache)
                }
            })
        )
    }))
});

self.addEventListener("fetch", (event) => {
  console.log(event)
  console.log('fetching server worker')
    event.respondWith(
        fetch(event.request)
            .then((res) => {
                //Make clone of response
                const resClone = res.clone();
                // Open cache
                caches.open(cacheName).then((cache) => {
                    // Add response to the cache
                    cache.put(event.request, resClone);
                });
                return res;
            })
            .catch((err) =>
                caches
                    .match(event.request)
                    .then((res) => res)
                    .catch((err) => console.error(err))
            )
    );
});