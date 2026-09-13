/**
 * The only module that touches `window.localStorage`.
 *
 * Everything in localStorage is user-local and untrusted: another tab, an old
 * version of this app, a browser extension or the reader themselves can put
 * anything there. So every read goes through a `parse` function that returns
 * null for a shape it does not recognise, and the caller's fallback is used
 * instead. A corrupt entry degrades to "empty", never to a crash.
 *
 * Writes can fail too (private mode, quota, storage disabled). They report
 * failure by returning false rather than throwing, because losing a favorite
 * must never take a page down.
 */

export const STORAGE_KEYS = {
  favorites: "company-favorites",
  recentlyViewed: "recently-viewed-companies",
  settings: "user-settings",
  reports: "content-reports",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

type Listener = () => void;

const listeners = new Map<StorageKey, Set<Listener>>();

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    // Accessing the property itself throws when storage is blocked.
    return null;
  }
}

function notify(key: StorageKey) {
  listeners.get(key)?.forEach((listener) => listener());
}

export function readRaw(key: StorageKey): string | null {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function read<T>(
  key: StorageKey,
  parse: (value: unknown) => T | null,
  fallback: T,
): T {
  return parseRaw(readRaw(key), parse, fallback);
}

export function parseRaw<T>(
  raw: string | null,
  parse: (value: unknown) => T | null,
  fallback: T,
): T {
  if (raw === null) return fallback;
  try {
    return parse(JSON.parse(raw)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function write(key: StorageKey, value: unknown): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    notify(key);
    return true;
  } catch {
    return false;
  }
}

export function remove(key: StorageKey): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.removeItem(key);
    notify(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Subscribe to changes of one key — from this tab (via `write`/`remove`) and
 * from other tabs (via the `storage` event), so a favorite added in one tab
 * shows up in another without a reload.
 */
export function subscribe(key: StorageKey, listener: Listener): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    set.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export const storage = { read, readRaw, write, remove, subscribe };
