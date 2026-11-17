import { isConditions, SAVED_CONDITIONS_LIMITS, type Conditions } from "./screening";

/**
 * What moves to another device (JCE-065): the reader's own lists, nothing else. Shared by the browser and the Worker,
 * so both hold the same shape and limits. Relative import: the Worker's bundle has no "@/" alias.
 *
 * Not included: the purchase code (it has its own e-mail recovery on the 診断 site), notification subscriptions (each
 * belongs to one browser; the new device switches them on for itself), and the reader's activity counts.
 */
export type SyncData = {
  favorites: string[];
  recentlyViewed: string[];
  followedIndustries: string[];
  savedScreenings: { name: string; conditions: Conditions }[];
};

export const SYNC_LIMITS = { favorites: 2000, recentlyViewed: 12, followedIndustries: 100, savedScreenings: SAVED_CONDITIONS_LIMITS.premium } as const;

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ids = (value: unknown, max: number): string[] | null =>
  Array.isArray(value) && value.length <= max && value.every((x) => typeof x === "string" && x.length <= 120 && ID.test(x)) ? (value as string[]) : null;

/** The lists as sent, or null if anything is not what this site writes. */
export function parseSyncData(value: unknown): SyncData | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const favorites = ids(v.favorites, SYNC_LIMITS.favorites);
  const recentlyViewed = ids(v.recentlyViewed, SYNC_LIMITS.recentlyViewed);
  const followedIndustries = ids(v.followedIndustries, SYNC_LIMITS.followedIndustries);
  const s = v.savedScreenings;
  const savedScreenings =
    Array.isArray(s) &&
    s.length <= SYNC_LIMITS.savedScreenings &&
    s.every((x) => x && typeof x === "object" && typeof x.name === "string" && x.name.length <= 200 && isConditions(x.conditions))
      ? (s as SyncData["savedScreenings"])
      : null;
  if (!favorites || !recentlyViewed || !followedIndustries || !savedScreenings) return null;
  return { favorites, recentlyViewed, followedIndustries, savedScreenings };
}

const union = (mine: string[], theirs: string[]) => [...new Set([...mine, ...theirs])];

/**
 * Both devices' lists together — nothing on this device is dropped (the plan asked for merging, not overwriting).
 * Recently viewed takes the arriving device's first (it was the one in use), then this one's, to the usual length.
 */
export function mergeSyncData(here: SyncData, arriving: SyncData): SyncData {
  const names = new Set(here.savedScreenings.map((s) => s.name));
  return {
    favorites: union(here.favorites, arriving.favorites),
    recentlyViewed: union(arriving.recentlyViewed, here.recentlyViewed).slice(0, SYNC_LIMITS.recentlyViewed),
    followedIndustries: union(here.followedIndustries, arriving.followedIndustries),
    savedScreenings: [...here.savedScreenings, ...arriving.savedScreenings.filter((s) => !names.has(s.name))].slice(0, SYNC_LIMITS.savedScreenings),
  };
}

/** What merging would add, for the confirmation shown before anything is written. */
export function syncDiff(here: SyncData, arriving: SyncData) {
  const merged = mergeSyncData(here, arriving);
  return {
    favorites: merged.favorites.length - here.favorites.length,
    followedIndustries: merged.followedIndustries.length - here.followedIndustries.length,
    savedScreenings: merged.savedScreenings.length - here.savedScreenings.length,
    hereHasData: here.favorites.length + here.followedIndustries.length + here.savedScreenings.length > 0,
  };
}
