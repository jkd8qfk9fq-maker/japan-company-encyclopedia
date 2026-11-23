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
  /** A short identifying line shown beside the title: a company's code and industry (2026-11-23). */
  meta?: string;
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
 * Four tiers, each in 50音順 (2026-11-23 redesign, revising the 2026-10-22 index order): an exact key — typing
 * "7203" or a full name goes straight to it; a name or code that starts with the query; a name that contains it;
 * then text that merely mentions it (a business, a product). In the index order a query like トヨタ listed
 * カメイ — whose business text mentions Toyota — above トヨタ自動車, because both were "matches" sorted by reading.
 * Within a tier the list still reads like an index, not a guess at relevance.
 */
export function searchEntries(entries: SearchEntry[], rawQuery: string): SearchEntry[] {
  const q = normalizeForSearch(rawQuery);
  if (!q) return [];
  const tiers: SearchEntry[][] = [[], [], [], []];
  for (const entry of entries) {
    if (entry.keys.includes(q)) tiers[0]!.push(entry);
    else if (entry.keys.some((k) => k.startsWith(q))) tiers[1]!.push(entry);
    else if (entry.keys.some((k) => k.includes(q))) tiers[2]!.push(entry);
    else if (entry.haystack.includes(q)) tiers[3]!.push(entry);
  }
  const byReading = (a: SearchEntry, b: SearchEntry) => collator.compare(a.sortKey, b.sortKey);
  return tiers.flatMap((tier) => tier.sort(byReading));
}
