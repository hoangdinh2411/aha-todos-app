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