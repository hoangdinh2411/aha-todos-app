window.addEventListener('load',async()=>{
    if('serverWorker' in navigator){
        try {
            await navigator.serviceWorker.register('serviceworker.js')
            .then(function(registration) {
                console.log('Service worker registration succeeded:', registration);
              }, /*catch*/ function(error) {
                console.log('Service worker registration failed:', error);
              });
        } catch (error) {
            console.log(error)
        }
    }
});
