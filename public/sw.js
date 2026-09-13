/*
 * Service worker — hand-written, no library.
 *
 * Offline promise, and no more than that: pages the reader has already opened
 * stay readable, the app shell loads, and anything else gets an honest offline
 * page. It never serves a cached page when the network is available, because
 * a stale company entry shown as current would undo the point of corrections.
 *
 *   navigations          network-first → cached copy of that page → /offline
 *   /_next/static/*      cache-first (content-hashed, immutable)
 *   /icons/*, manifest   cache-first
 *   everything else      untouched (straight to network)
 *
 * Bump VERSION when this strategy changes; old caches are deleted on activate.
 */
const VERSION = "v1";
const SHELL_CACHE = `shell-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;
const STATIC_CACHE = `static-${VERSION}`;
const PAGE_CACHE_LIMIT = 60;

const SHELL_URLS = ["/", "/offline", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL_CACHE, PAGE_CACHE, STATIC_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trimCache(name, limit) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  // Cache keys come back in insertion order: drop the oldest first.
  for (let i = 0; i < keys.length - limit; i++) await cache.delete(keys[i]);
}

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    // Only complete, successful HTML is worth keeping. A 404 cached as a page
    // would keep saying "not found" after the entry is published.
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open(PAGE_CACHE).then((cache) =>
        cache.put(request, copy).then(() => trimCache(PAGE_CACHE, PAGE_CACHE_LIMIT)),
      );
    }
    return response;
  } catch {
    const cached =
      (await caches.match(request, { ignoreSearch: true })) ??
      (await caches.match("/offline"));
    return cached ?? Response.error();
  }
}

async function handleStatic(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const copy = response.clone();
    caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(handleStatic(request));
  }
});
