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
