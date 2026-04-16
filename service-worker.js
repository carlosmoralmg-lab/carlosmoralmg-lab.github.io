const CACHE_NAME = "fasterlearn-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./game.html",
  "./styles.css",
  "./data.js",
  "./game.js",
  "./pwa.js",
  "./manifest.json",
  "./icon.svg",
  "./sonidos/exito.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("fasterlearn-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      const fetchPromise = fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();

        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
        );

        return networkResponse;
      });

      return fetchPromise.catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return new Response("", { status: 503, statusText: "Offline" });
      });
    })
  );
});
