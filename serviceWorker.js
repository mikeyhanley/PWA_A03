


const cacheName = 'PWAa03';

const appShellFiles = [
    '/PWA_A03/index.html',
    '/PWA_A03/index2.html',
    '/PWA_A03/myWorker.js',
    '/PWA_A03/style.css',
    '/PWA_A03/icons/white.png',
    '/PWA_A03/favicon.png',

];

var flickImage = []

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell');
        console.log(cache);
        await cache.addAll(appShellFiles);
    })());
});

self.addEventListener('activate', e => {

});



self.addEventListener('fetch', (e) => {
    console.log(e.request.url)
    if (e.request.url.includes('movieObj.js')) {
        e.respondWith((async () => {

            console.log(hit)
            try {
                const response = await fetch(e.request);
                const cache = await caches.open(cacheName);
                console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                cache.put(e.request, response.clone());
                return response;
            }
            catch {
                var data = { foo: "bar" };
                var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

                var init = { "status": 200, "statusText": "SuperSmashingGreat!" };
                var myResponse = new Response(blob, init);
                return myResponse
            }
        }))
    }
    else {
        e.respondWith((async () => {
            const r = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            if (r) { return r; }
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;

        }))
    };
});