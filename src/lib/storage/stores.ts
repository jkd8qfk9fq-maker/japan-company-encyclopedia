import { STORAGE_KEYS, parseRaw, read, write, remove, type StorageKey } from "./storage";

/**
 * Typed repositories over the raw storage layer, one per kind of user-local
 * state. Components use these (through the hooks in `src/hooks/`) and never
 * see a storage key or a JSON string.
 */

export type LocalStore<T> = {
  key: StorageKey;
  fallback: T;
  parse: (value: unknown) => T | null;
  get: () => T;
  /** Parse an already-read raw string. Lets hooks cache by raw value. */
  fromRaw: (raw: string | null) => T;
  set: (value: T) => boolean;
  clear: () => boolean;
};

function createStore<T>(
  key: StorageKey,
  fallback: T,
  parse: (value: unknown) => T | null,
): LocalStore<T> {
  return {
    key,
    fallback,
    parse,
    get: () => read(key, parse, fallback),
    fromRaw: (raw) => parseRaw(raw, parse, fallback),
    set: (value) => write(key, value),
    clear: () => remove(key),
  };
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

/** Only kebab-case ids are accepted back, so a stale or hostile value cannot become a route. */
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const parseIdList = (value: unknown): string[] | null =>
  isStringArray(value) ? value.filter((id) => ID_PATTERN.test(id)) : null;

// ---------------------------------------------------------------------------
// Favorites — companies the reader wants to revisit. Not a portfolio: no
// quantities, no prices, no dates of purchase. Just ids, newest first.

export const favoritesStore = createStore<string[]>(STORAGE_KEYS.favorites, [], parseIdList);

export function toggleFavorite(companyId: string): boolean {
  const current = favoritesStore.get();
  const next = current.includes(companyId)
    ? current.filter((id) => id !== companyId)
    : [companyId, ...current];
  favoritesStore.set(next);
  return next.includes(companyId);
}

// ---------------------------------------------------------------------------
// Recently viewed — bounded, newest first, no duplicates.

export const RECENTLY_VIEWED_LIMIT = 12;

export const recentlyViewedStore = createStore<string[]>(
  STORAGE_KEYS.recentlyViewed,
  [],
  (value) => parseIdList(value)?.slice(0, RECENTLY_VIEWED_LIMIT) ?? null,
);

export function recordView(companyId: string): void {
  const current = recentlyViewedStore.get();
  if (current[0] === companyId) return; // avoid a write (and a re-render) on every revisit
  const next = [companyId, ...current.filter((id) => id !== companyId)].slice(
    0,
    RECENTLY_VIEWED_LIMIT,
  );
  recentlyViewedStore.set(next);
}

// ---------------------------------------------------------------------------
// Settings

export type ThemePreference = "system" | "light" | "dark";

export type UserSettings = {
  theme: ThemePreference;
};

const THEMES: readonly ThemePreference[] = ["system", "light", "dark"];

export const defaultSettings: UserSettings = { theme: "system" };

export const settingsStore = createStore<UserSettings>(
  STORAGE_KEYS.settings,
  defaultSettings,
  (value) => {
    if (typeof value !== "object" || value === null) return null;
    const theme = (value as { theme?: unknown }).theme;
    return {
      theme: THEMES.includes(theme as ThemePreference) ? (theme as ThemePreference) : "system",
    };
  },
);
