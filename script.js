window.addEventListener('load',async()=>{
    if('serverWorker' in navigator){
        try {
            await navigator.serviceWorker.register('/serviceworker.js')
        } catch (error) {
            console.log(error)
        }
    }
});
