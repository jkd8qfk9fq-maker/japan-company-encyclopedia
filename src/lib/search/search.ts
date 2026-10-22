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
  /**
   * What the entry sorts by in 50音順: a kana reading where the content has one (terms, industries), else the
   * name. Company entries carry no reading, so a name in kanji sorts by Japanese collation of the characters,
   * which follows the kanji's 音読み order rather than the company's own reading.
   */
  sortKey: string;
};

const collator = new Intl.Collator("ja", { sensitivity: "base", numeric: true });

/**
 * Exact key match first — typing "7203" or a full name goes straight to it — then every other match in 50音順
 * (operator request, 2026-10-22). A key that starts with the query and text that merely contains it are both
 * matches; neither outranks the other, so the list reads like an index, not a guess at relevance.
 */
export function searchEntries(entries: SearchEntry[], rawQuery: string): SearchEntry[] {
  const q = normalizeForSearch(rawQuery);
  if (!q) return [];
  const exact: SearchEntry[] = [];
  const rest: SearchEntry[] = [];
  for (const entry of entries) {
    if (entry.keys.includes(q)) exact.push(entry);
    else if (entry.keys.some((k) => k.startsWith(q)) || entry.haystack.includes(q)) rest.push(entry);
  }
  const byReading = (a: SearchEntry, b: SearchEntry) => collator.compare(a.sortKey, b.sortKey);
  return [...exact.sort(byReading), ...rest.sort(byReading)];
}
