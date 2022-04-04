window.addEventListener('load',async()=>{
    if('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('/serviceworker.js')
        } catch (error) {
            console.log(error)
        }
    }
});
