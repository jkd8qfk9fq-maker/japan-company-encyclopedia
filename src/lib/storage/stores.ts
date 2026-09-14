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

// ---------------------------------------------------------------------------
// Content reports
//
// KNOWN LIMITATION, deliberately visible: a report stored in localStorage stays
// on the reader's device. It does not reach an editor. The report form says so
// in its confirmation. Delivering reports needs a server endpoint, which is a
// decision with running cost (docs/decisions.md, JCE-008) — not something to fake
// by pretending a local write was "sent".

export const REPORT_CATEGORIES = [
  "company-information",
  "business-information",
  "financial-information",
  "history",
  "industry-classification",
  "other",
] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export type ReportStatus = "open" | "investigating" | "resolved" | "rejected";

export type ContentReport = {
  id: string;
  companyId?: string;
  industryId?: string;
  featureId?: string;
  category: ReportCategory;
  message: string;
  /** The page the reader was on, so an editor can find the claim. */
  pagePath?: string;
  createdAt: string;
  status: ReportStatus;
};

/** A same-origin path of lowercase kebab segments. A second "/" or "\" after the first makes it off-site. */
const PAGE_PATH_PATTERN = /^\/(?![/\\])[a-z0-9/-]*$/;

export const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  "company-information": "企業の基本情報",
  "business-information": "事業の説明",
  "financial-information": "売上・利益の数値",
  history: "歴史",
  "industry-classification": "業界の分類",
  other: "その他",
};

const REPORT_STATUSES: readonly ReportStatus[] = ["open", "investigating", "resolved", "rejected"];

function parseReport(value: unknown): ContentReport | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.message !== "string") return null;
  if (typeof v.createdAt !== "string") return null;
  if (!REPORT_CATEGORIES.includes(v.category as ReportCategory)) return null;
  const optionalId = (x: unknown) => (typeof x === "string" && ID_PATTERN.test(x) ? x : undefined);
  return {
    id: v.id,
    companyId: optionalId(v.companyId),
    industryId: optionalId(v.industryId),
    featureId: optionalId(v.featureId),
    category: v.category as ReportCategory,
    message: v.message,
    // Not merely startsWith("/"): "//example.com" and "/\example.com" are off-site links.
    pagePath: typeof v.pagePath === "string" && PAGE_PATH_PATTERN.test(v.pagePath) ? v.pagePath : undefined,
    createdAt: v.createdAt,
    status: REPORT_STATUSES.includes(v.status as ReportStatus) ? (v.status as ReportStatus) : "open",
  };
}

export const reportsStore = createStore<ContentReport[]>(STORAGE_KEYS.reports, [], (value) =>
  Array.isArray(value)
    ? value.map(parseReport).filter((r): r is ContentReport => r !== null)
    : null,
);

export const MAX_REPORT_LENGTH = 2000;

export function addReport(
  input: Omit<ContentReport, "id" | "createdAt" | "status">,
): ContentReport | null {
  const message = input.message.trim().slice(0, MAX_REPORT_LENGTH);
  if (message.length === 0) return null;
  const report: ContentReport = {
    ...input,
    message,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `report-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  return reportsStore.set([report, ...reportsStore.get()]) ? report : null;
}

export function updateReportStatus(id: string, status: ReportStatus): void {
  reportsStore.set(reportsStore.get().map((r) => (r.id === id ? { ...r, status } : r)));
}
