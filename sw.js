const CACHE_NAME = "engim-portfolio-v1";
const PRECACHE_URLS = [
  "./",
  "index.html",
  "style.css",
  "manifest.json",
  "images/icon-192.png",
  "images/icon-512.png",
  "images/icon-maskable.png",
  "images/profile.jpg",
  "images/profil1.jpg",
];
const RUNTIME_CACHE = "engim-runtime-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn("Precache failed:", err);
      });
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const { pathname } = new URL(event.request.url);
  const isImageRequest =
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".webp");
  const isCoreAsset =
    pathname.includes("/images/") || pathname.endsWith("style.css");

  if (isCoreAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
              return networkResponse;
            })
            .catch(() => {
              if (isImageRequest) {
                return caches.match("images/profile.jpg");
              }
              return null;
            })
        );
      }),
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches
            .match(event.request)
            .then(
              (cachedResponse) => cachedResponse || caches.match("index.html"),
            );
        }),
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
