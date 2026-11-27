/**
 * 見比べ (JCE-061): two or three companies side by side. No imports — the browser runs this, and src/lib/site.ts
 * must never reach client code (tests/client-imports.test.ts).
 *
 * Each figure is one the company page already shows: the latest year's revenue, net income and employees as printed
 * (with the filing's own labels), the two ratios of JCE-038, and 5期の売上高の伸び (JCE-041/043). A figure the filing
 * does not give is shown as 「データなし」, never as zero. Facts side by side only — no verdict, no "which to buy".
 */

export type CompareRow = {
  id: string;
  name: string;
  industry: string | null;
  fiscalYear: string | null;
  revenue: number | null;
  revenueLabel: string | null;
  netIncome: number | null;
  netIncomeLabel: string | null;
  /** 純利益 ÷ 売上高, percent, same year. */
  netMargin: number | null;
  /** Latest ÷ the oldest of five years (×), and the years it spans. */
  growth5y: number | null;
  growthFrom: string | null;
  /** Overseas share of regional revenue, percent. */
  overseas: number | null;
  employees: number | null;
  /** The filing the latest year's figures come from. */
  source: { title: string; url: string } | null;
};

export type CompareIndex = { asOf: string; rows: CompareRow[] };

/** The light index the tool opens with: enough to search and to suggest peers, a fraction of the full rows. */
export type CompareLightRow = Pick<CompareRow, "id" | "name" | "industry" | "revenue">;
export type CompareLightIndex = { asOf: string; rows: CompareLightRow[] };

/** One shard of the full rows, holding every company whose id hashes to it. */
export type CompareShard = { asOf: string; rows: CompareRow[] };

/**
 * The full index is split into this many shards (JCE-148): the tool downloads only the shards holding the
 * companies being compared — two or three companies live in at most three shards — instead of every
 * company's row before anything can be shown. The hash is a plain string hash, identical on the server
 * that builds the shards and in the browser that asks for them; it must never change casually, or a shard
 * would silently hold the wrong companies (tests pin the distribution).
 */
export const COMPARE_SHARDS = 8;

export function compareShardOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % COMPARE_SHARDS;
}

/**
 * How many companies a reader can line up: free and with the premium plan (JCE-043). A setting, so the plan can be
 * redesigned (P2-1) without touching the page.
 */
export const COMPARE_LIMITS = { free: 2, premium: 3 } as const;
export const COMPARE_MAX = Math.max(COMPARE_LIMITS.free, COMPARE_LIMITS.premium);

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** `?ids=a,b,c` → the distinct well-formed ids, in order, at most COMPARE_MAX. Unknown ids are dropped by the page. */
export function parseIds(param: string | null): string[] {
  if (!param) return [];
  const ids: string[] = [];
  for (const raw of param.split(",")) {
    const id = raw.trim();
    if (ID.test(id) && !ids.includes(id)) ids.push(id);
    if (ids.length === COMPARE_MAX) break;
  }
  return ids;
}

export const compareHref = (ids: string[]) => (ids.length > 0 ? `/compare?ids=${ids.join(",")}` : "/compare");

/**
 * Bar widths for one figure across the companies, as a share of the largest absolute value. A loss is drawn the same
 * length as a profit of the same size and marked by the page; a missing figure has no bar.
 */
export function barShares(values: (number | null)[]): (number | null)[] {
  const max = Math.max(0, ...values.filter((v): v is number => v !== null).map(Math.abs));
  return values.map((v) => (v === null ? null : max === 0 ? 0 : Math.abs(v) / max));
}
