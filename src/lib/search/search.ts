import { normalizeForSearch } from "./normalize";

/*
 * The client-safe half of search: types and matching only. It must never
 * import a repository — this module is bundled into the /search page's
 * JavaScript, and a repository import would ship every entry to the browser.
 */

export type SearchKind = "company" | "industry" | "term" | "feature";

export type SearchEntry = {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** Pre-normalised text the query is matched against. */
  haystack: string;
  /** Pre-normalised fields that count as an exact hit, ranked first. */
  keys: string[];
};

/**
 * Exact key match first, then prefix of a key, then anywhere in the text.
 * Deliberately simple: at this corpus size, predictable ranking beats clever
 * ranking, and a reader can see why each result matched.
 */
export function searchEntries(entries: SearchEntry[], rawQuery: string): SearchEntry[] {
  const q = normalizeForSearch(rawQuery);
  if (!q) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    let score = 0;
    if (entry.keys.includes(q)) score = 3;
    else if (entry.keys.some((k) => k.startsWith(q))) score = 2;
    else if (entry.haystack.includes(q)) score = 1;
    if (score > 0) scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.entry);
}
