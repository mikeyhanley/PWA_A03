


const cacheName = 'PWAa03';
const appShellFiles = [
    '/',
    '/index.html',
    '/index2.html',
    '/myWorker.js',
    '/style.css',
    'icons/white.png',
    '/favicon.png',

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
    console.log(e)
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }

        try {
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;

        } catch (error) {


        }


    }));
});