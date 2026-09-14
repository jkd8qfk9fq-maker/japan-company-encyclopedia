import { useCallback, useRef, useSyncExternalStore } from "react";
import { readRaw, subscribe } from "@/lib/storage/storage";
import type { LocalStore } from "@/lib/storage/stores";

/**
 * Read a typed local store in a component, re-rendering when it changes (in
 * this tab or another).
 *
 * The server snapshot is always the store's fallback, because the server has
 * no localStorage. That means user-local UI renders its empty state first and
 * fills in after hydration — acceptable for favorites and history, which are
 * never the primary content of a page.
 *
 * useSyncExternalStore requires getSnapshot to return the same reference until
 * the data changes, so the parsed value is cached against the raw string.
 */
export function useLocalStore<T>(store: LocalStore<T>): T {
  const cache = useRef<{ raw: string | null; value: T } | null>(null);

  const getSnapshot = useCallback(() => {
    const raw = readRaw(store.key);
    if (cache.current && cache.current.raw === raw) return cache.current.value;
    const value = store.fromRaw(raw);
    cache.current = { raw, value };
    return value;
  }, [store]);

  const subscribeToStore = useCallback(
    (onChange: () => void) => subscribe(store.key, onChange),
    [store],
  );

  return useSyncExternalStore(subscribeToStore, getSnapshot, () => store.fallback);
}
