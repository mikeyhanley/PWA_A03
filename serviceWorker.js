


const cacheName = 'PWAa03';

const appShellFiles = [
    '/PWA_A03/index.html',
    '/PWA_A03/index2.html',
    '/PWA_A03/style.css',
    '/PWA_A03/icons/white.png',
    '/PWA_A03/favicon.png',
    '/PWA_A03/PWAa03.webmanifest'

];

//var flickImage = []

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        // console.log('[Service Worker] Caching all: app shell');
        await cache.addAll(appShellFiles);
    })());
});



self.addEventListener('fetch', (e) => {
    var reqURL = e.request.url.toString()
    console.log(reqURL)
    if (reqURL.includes('api.flickr')) {
        console.log('api.flickr')


        e.respondWith((async () => {

            try {
                const response = await fetch(e.request);
                console.log(response)
                return response;
            }
            catch {
                console.log('catch')
                return new Response(
                    '{"offline": "true"}',
                    { headers: { "Content-Type": "application/json" } }
                );

            }

        })())




    }
    else if (reqURL == 'https://mikeyhanley.github.io/PWA_A03/movieObj.js') {
        console.log('contains movieObj.js')
        caches.delete('movieObj.js')


        e.respondWith((async () => {

            try {
                const response = await fetch(e.request);
                console.log(response)
                return response;
            }
            catch {
                console.log('catch')
                return new Response(
                    "processFilms({ offline: true })",
                    { headers: { "Content-Type": "text/javascript" } }
                );

            }

        })())



    }
    else {

        e.respondWith((async () => {
            const r = await caches.match(e.request);
            //  console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            if (r) { return r; }
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            //  console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;

        })())

    }

});
onmessage = function (e) {
    searchTerm = e.data;
    importScripts("movieObj.js")



}
function processFilms(data) {
    console.log(data)

    if (data.offline == true) {
        messageObj = {
            checkedFilms: 0,
            filmScriptObjFormatted: null,
            totalFilms: 0,
            offline: true

        }
        postMessage(messageObj)

    }

    else {

        var checkedFilms = 0
        var filmScriptArray = Object.keys(data).map(key => {
            return data[key];
        })
        var totalFilms = filmScriptArray.length

        for (const filmScriptObj of filmScriptArray) {
            checkedFilms++
            messageObj = {
                checkedFilms: checkedFilms,
                filmScriptObjFormatted: null,
                totalFilms: totalFilms,
                offline: false

            }



            //  console.log(checkedFilms, '/', filmScriptArray.length)
            if (filmScriptObj.title.toUpperCase().includes(searchTerm.toUpperCase())) {



                var regex = new RegExp(searchTerm, 'ig');
                titleMarked = filmScriptObj.title.replace(regex, '<mark>$&</mark>');
                let filmScriptObjFormatted = { title: titleMarked, URL: filmScriptObj.link }
                messageObj.filmScriptObjFormatted = filmScriptObjFormatted

            }
            postMessage(messageObj)

        }

    }
}
