/* =====================================================
   ERDENE NUTAG – SERVICE WORKER
===================================================== */

const CACHE_NAME = "erdene-nutag-v1";

// Root-д байгаа бүх essential файлууд
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./ai.js",
  "./app.js",
  "./manifest.json"
];

// Install event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        )
      )
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
