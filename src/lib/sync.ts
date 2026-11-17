import { mergeSyncData, type SyncData } from "@/lib/sync-data";
import { favoritesStore, followedIndustriesStore, recentlyViewedStore, savedScreeningsStore, syncPendingStore } from "@/lib/storage/stores";

/**
 * The browser's side of moving lists to another device (JCE-065). Reads and writes go through the storage layer
 * (invariant 7); the only things sent are the lists themselves and the address the link is mailed to.
 */
export function collectSyncData(): SyncData {
  return {
    favorites: favoritesStore.get(),
    recentlyViewed: recentlyViewedStore.get(),
    followedIndustries: followedIndustriesStore.get(),
    savedScreenings: savedScreeningsStore.get(),
  };
}

export function applySyncData(arriving: SyncData): void {
  const merged = mergeSyncData(collectSyncData(), arriving);
  favoritesStore.set(merged.favorites);
  recentlyViewedStore.set(merged.recentlyViewed);
  followedIndustriesStore.set(merged.followedIndustries);
  savedScreeningsStore.set(merged.savedScreenings);
}

const post = (path: string, body: unknown) =>
  fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export async function syncAvailable(): Promise<boolean> {
  try {
    const r = await fetch("/api/sync/status");
    return r.ok && ((await r.json()) as { available?: boolean }).available === true;
  } catch {
    return false;
  }
}

export async function startSync(email: string): Promise<"sent" | "input" | "rate" | "error"> {
  const replace = syncPendingStore.get()?.cancelKey;
  const r = await post("/api/sync/start", { email, data: collectSyncData(), ...(replace ? { replace } : {}) });
  if (r.ok) {
    const body = (await r.json()) as { cancelKey: string; expiresAt: number };
    syncPendingStore.set({ cancelKey: body.cancelKey, expiresAt: body.expiresAt });
    return "sent";
  }
  return r.status === 400 ? "input" : r.status === 429 ? "rate" : "error";
}

export async function cancelSync(): Promise<void> {
  const pending = syncPendingStore.get();
  if (pending) await post("/api/sync/cancel", { cancelKey: pending.cancelKey }).catch(() => undefined);
  syncPendingStore.clear();
}

export async function claimSync(token: string): Promise<SyncData | "gone" | "error"> {
  const r = await post("/api/sync/claim", { token });
  if (r.status === 410) return "gone";
  if (!r.ok) return "error";
  return ((await r.json()) as { data: SyncData }).data;
}
