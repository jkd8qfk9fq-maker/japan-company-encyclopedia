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
 *   /icons/*, manifests  stale-while-revalidate (not content-hashed, so they must refresh)
 *   everything else      untouched (straight to network)
 *
 * One worker serves both apps on this origin: the encyclopedia (shell below) and 分析訓練 (JCE-125), whose
 * shell — /learn, its own manifest and icon — is pre-cached too, so the installed training app opens at once
 * and still shows its screen offline. Registration stays site-wide on purpose: this worker also carries the
 * push notifications (JCE-059), and narrowing registration to /learn would silently take them, and offline
 * reading, away from readers who never open the course.
 *
 * The page that REGISTERED the worker was loaded before the worker existed, so
 * the fetch handler never saw it. On activate, every open same-origin window is
 * fetched once into the page cache — otherwise the first page a reader opens
 * (for a search visitor, often the only one) would not be readable offline.
 *
 * Bump VERSION when this strategy changes; old caches are deleted on activate.
 */
const VERSION = "v3";
const SHELL_CACHE = `shell-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;
const STATIC_CACHE = `static-${VERSION}`;
const PAGE_CACHE_LIMIT = 60;

const SHELL_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  // The training app's shell (JCE-125): its start page, manifest and home-screen icon.
  "/learn/",
  "/learn/manifest.webmanifest",
  "/icons/training-192.png",
];

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
      .then(() => self.clients.claim())
      .then(cacheOpenPages),
  );
});

async function cacheOpenPages() {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  const cache = await caches.open(PAGE_CACHE);
  await Promise.all(
    windows.map(async (client) => {
      const url = new URL(client.url);
      if (url.origin !== self.location.origin) return;
      try {
        const response = await fetch(url.href, { cache: "reload", credentials: "same-origin" });
        if (response.ok && response.type === "basic") await cache.put(url.href, response);
      } catch {
        // Offline at activation: nothing to store, and nothing to break.
      }
    }),
  );
}

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

async function handleRevalidated(request) {
  // Any cache: the shell cache pre-stores the manifest and one icon at install.
  const cached = await caches.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() => cached ?? Response.error());
  return cached ?? refresh;
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

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(handleStatic(request));
    return;
  }

  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/learn/manifest.webmanifest"
  ) {
    event.respondWith(handleRevalidated(request));
  }
});

/*
 * Notifications for followed companies (JCE-059). The site sends only a fact — "〇〇の新しい決算データが公開されました"
 * — and the page it is about; a tap opens that page. Only this site's own pages are ever opened from a notification.
 */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  const title = typeof data.title === "string" ? data.title : "日本企業百科事典";
  const body = typeof data.body === "string" ? data.body : "フォロー中の会社に新しい情報があります";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: typeof data.tag === "string" ? data.tag : undefined,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: typeof data.url === "string" ? data.url : "/notifications" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  let target;
  try {
    target = new URL(event.notification.data && event.notification.data.url ? event.notification.data.url : "/notifications", self.location.origin);
  } catch {
    return;
  }
  if (target.origin !== self.location.origin) return;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const w of windows) if (w.url === target.href && "focus" in w) return w.focus();
      return self.clients.openWindow(target.href);
    }),
  );
});
