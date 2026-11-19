import { STORAGE_KEYS, parseRaw, read, write, remove, type StorageKey } from "./storage";
import { isConditions, type Conditions } from "@/lib/screening";

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
  // Unfollowing also stops that company's notifications (JCE-059): one is a subset of the other.
  if (!next.includes(companyId) && pushCompaniesStore.get().includes(companyId)) {
    pushCompaniesStore.set(pushCompaniesStore.get().filter((id) => id !== companyId));
  }
  return next.includes(companyId);
}

// JCE-059: which followed companies this browser receives notifications for. The list itself stays here; when
// notifications are on, the same ids are sent to the site's push service so it knows whom to notify.
export const pushCompaniesStore = createStore<string[]>(STORAGE_KEYS.pushCompanies, [], parseIdList);

export function setPushForCompany(companyId: string, on: boolean): void {
  const current = pushCompaniesStore.get().filter((id) => id !== companyId);
  pushCompaniesStore.set(on ? [companyId, ...current] : current);
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
  recordActivity();
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
// Premium plan (JCE-043) — the purchase code of the YUGENQ premium plan (sold on the 企業タイプ診断 site, shared by
// the YUGENQ services) and what its server said about it. Only the code and dates: no name, no payment detail.

export type StoredPlan = {
  code: string;
  /** Until when the subscription is paid (ms since epoch). */
  paidUntil: number;
  /** After this (ms) the code is checked again. */
  checkAfter: number;
};

const CODE_PATTERN = /^sub_[A-Za-z0-9]{8,64}$/;

export const planStore = createStore<StoredPlan | null>(STORAGE_KEYS.plan, null, (value) => {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Partial<StoredPlan>;
  if (typeof v.code !== "string" || !CODE_PATTERN.test(v.code) || typeof v.paidUntil !== "number" || typeof v.checkAfter !== "number") return null;
  return { code: v.code, paidUntil: v.paidUntil, checkAfter: v.checkAfter };
});

// ---------------------------------------------------------------------------
// マイ企業図鑑 (JCE-046) — every company the reader has met in the discovery feed, oldest first so the
// collection reads as the order they were found. Ids only, like favorites; it never leaves the browser.

export const discoveredStore = createStore<string[]>(STORAGE_KEYS.discovered, [], parseIdList);

export function recordDiscovered(companyId: string): void {
  recordActivity();
  const current = discoveredStore.get();
  if (current.includes(companyId)) return;
  discoveredStore.set([...current, companyId]);
}

// ---------------------------------------------------------------------------
// Followed industries (JCE-048) — industry ids, in the order the reader followed them. Like every store here it
// stays in this browser: following is a reading preference, not an account.

export const followedIndustriesStore = createStore<string[]>(STORAGE_KEYS.followedIndustries, [], parseIdList);

export function toggleFollowedIndustry(industryId: string): boolean {
  const current = followedIndustriesStore.get();
  const next = current.includes(industryId) ? current.filter((id) => id !== industryId) : [...current, industryId];
  followedIndustriesStore.set(next);
  return next.includes(industryId);
}

// ---------------------------------------------------------------------------------------------------------------
// Engagement (JCE-052). All of it stays in this browser: no account, no server, nothing about the reader sent.

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Today in Japan, the day boundary every reader shares. */
export const jstToday = (now: Date = new Date()) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);

/** The days this reader explored something, oldest first, the last 400 kept. */
export const activityStore = createStore<string[]>(STORAGE_KEYS.activityDays, [], (value) =>
  isStringArray(value) ? value.filter((d) => DAY.test(d)).slice(-400) : null,
);

export function recordActivity(day: string = jstToday()): void {
  const current = activityStore.get();
  if (current.at(-1) === day || current.includes(day)) return;
  activityStore.set([...current, day].sort().slice(-400));
}

export type QuizAnswer = { id: string; choice: string; correct: boolean };
export const quizStore = createStore<Record<string, QuizAnswer>>(STORAGE_KEYS.quizAnswers, {}, (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const out: Record<string, QuizAnswer> = {};
  for (const [day, a] of Object.entries(value as Record<string, unknown>)) {
    const x = a as Partial<QuizAnswer>;
    if (DAY.test(day) && typeof x?.id === "string" && typeof x.choice === "string" && typeof x.correct === "boolean") out[day] = { id: x.id, choice: x.choice, correct: x.correct };
  }
  return out;
});

export function recordQuizAnswer(day: string, answer: QuizAnswer): void {
  const current = quizStore.get();
  if (current[day]) return; // one answer a day: the first one counts
  quizStore.set({ ...current, [day]: answer });
  recordActivity(day);
}

export const notificationsSeenStore = createStore<string>(STORAGE_KEYS.notificationsSeen, "", (value) =>
  typeof value === "string" && (value === "" || DAY.test(value)) ? value : null,
);

// JCE-072: the course's answers, by question id. A step is done by answering it (right or wrong — the explanation
// is the lesson), and the course badge is every step of the current course answered; both are read back from this
// store, never kept anywhere else. The daily question's answer counts too when it is one of the course's steps.
export type LearnAnswer = { choice: string; correct: boolean };
export const learnStore = createStore<Record<string, LearnAnswer>>(STORAGE_KEYS.learnAnswers, {}, (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const out: Record<string, LearnAnswer> = {};
  for (const [id, a] of Object.entries(value as Record<string, unknown>)) {
    const x = a as Partial<LearnAnswer>;
    if (typeof x?.choice === "string" && typeof x.correct === "boolean") out[id] = { choice: x.choice, correct: x.correct };
  }
  return out;
});

export function recordLearnAnswer(questionId: string, answer: LearnAnswer): void {
  const current = learnStore.get();
  if (current[questionId]) return; // the first answer counts, as with the daily question
  learnStore.set({ ...current, [questionId]: answer });
  recordActivity();
}

export const exploreStepsStore = createStore<number>(STORAGE_KEYS.exploreSteps, 0, (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : null,
);

export function recordExploreStep(): void {
  exploreStepsStore.set(exploreStepsStore.get() + 1);
  recordActivity();
}

// ---------------------------------------------------------------------------
// JCE-060: saved screening conditions — this browser only, never sent anywhere.

export type SavedScreening = { name: string; conditions: Conditions };

function parseSavedScreenings(value: unknown): SavedScreening[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((v): v is SavedScreening => !!v && typeof v === "object" && typeof (v as SavedScreening).name === "string" && isConditions((v as SavedScreening).conditions));
}

export const savedScreeningsStore = createStore<SavedScreening[]>(STORAGE_KEYS.screeningSaved, [], parseSavedScreenings);

// ---------------------------------------------------------------------------
// JCE-065: the link this browser mailed to move its lists, until it is used or expires.

export type SyncPending = { cancelKey: string; expiresAt: number };

export const syncPendingStore = createStore<SyncPending | null>(STORAGE_KEYS.syncPending, null, (value) => {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<SyncPending>;
  return typeof v.cancelKey === "string" && typeof v.expiresAt === "number" ? { cancelKey: v.cancelKey, expiresAt: v.expiresAt } : null;
});

// ---------------------------------------------------------------------------
// JCE-069: e-mail notifications. The address itself is not kept here — only a masked form to show which one it was.

export type MailNotify = { manageKey: string; hint: string; kinds: ("results" | "corrections")[]; confirmed: boolean };

export const mailNotifyStore = createStore<MailNotify | null>(STORAGE_KEYS.mailNotify, null, (value) => {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<MailNotify>;
  if (typeof v.manageKey !== "string" || typeof v.hint !== "string" || !Array.isArray(v.kinds)) return null;
  const kinds = v.kinds.filter((k): k is MailNotify["kinds"][number] => k === "results" || k === "corrections");
  return { manageKey: v.manageKey, hint: v.hint, kinds, confirmed: v.confirmed === true };
});
