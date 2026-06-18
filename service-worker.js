// ===============================
// ROBO CONTROL — SERVICE WORKER
// ===============================

const CACHE_NAME = "robo-cache-v2";

// Alle Dateien, die offline verfügbar sein sollen
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/maskable-icon-512.png"
];

// INSTALL — Dateien in Cache speichern
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// ACTIVATE — Alte Caches löschen
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// FETCH — Erst Cache, dann Netzwerk
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return (
                cached ||
                fetch(event.request).catch(() => {
                    // Offline fallback für HTML
                    if (event.request.mode === "navigate") {
                        return caches.match("./index.html");
                    }
                })
            );
        })
    );
});
