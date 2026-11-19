import type { Placement, Unit } from "@/lib/company-report";

/**
 * 見比べ (JCE-061): two to five companies side by side. Type imports only — the browser runs this, and src/lib/site.ts
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

/**
 * 業界の中での位置 (JCE-073) for the comps table: each company's computed layer exactly as its 企業レポート shows it —
 * built by `companyReport` at build time, so the two can never disagree. Each company is placed among its own
 * industry, whatever the others in the table are.
 */
export type CompareMetric = {
  key: string;
  label: string;
  formula: string;
  computed: boolean;
  unit: Unit;
  value: number;
  placement: Placement | null;
  note?: string;
};

export type CompareReportRow = {
  industry: string | null;
  industryMembers: number;
  comparableMembers: number;
  fiscalYear: string;
  metrics: CompareMetric[];
};

/**
 * The file as sent: 3,900 companies' placements come to about 6.5 MB written out, but they share fewer than 200
 * industry distributions and mostly the same wording, so each distribution is written once and a metric carries
 * its wording only where the filing's labels make it differ. `expandReportRow` gives back the full row.
 */
export type CompactMetric = {
  key: string;
  value: number;
  label?: string;
  formula?: string;
  note?: string;
  /** Index into `distributions`, with the company's rank in it; absent when there is no placement. */
  distribution?: number;
  rank?: number;
};

export type CompareReportIndex = {
  asOf: string;
  /** Each metric's kind and its most common wording. */
  definitions: Record<string, { label: string; formula: string; computed: boolean; unit: Unit }>;
  /** [members, median, q1, q3] */
  distributions: [number, number, number, number][];
  rows: Record<string, { industry: string | null; industryMembers: number; comparableMembers: number; fiscalYear: string; metrics: CompactMetric[] }>;
};

/** The same rule as `placementOf`: the rank as a share of members, rounded up. */
export const topPercentOf = (rank: number, members: number) => Math.ceil((rank / members) * 100);

export function expandReportRow(index: CompareReportIndex, id: string): CompareReportRow | null {
  const row = index.rows[id];
  if (!row) return null;
  const metrics: CompareMetric[] = [];
  for (const m of row.metrics) {
    const d = index.definitions[m.key];
    const dist = m.distribution === undefined ? undefined : index.distributions[m.distribution];
    if (!d || (m.distribution !== undefined && (!dist || m.rank === undefined))) return null;
    metrics.push({
      key: m.key,
      label: m.label ?? d.label,
      formula: m.formula ?? d.formula,
      computed: d.computed,
      unit: d.unit,
      value: m.value,
      placement: dist ? { members: dist[0], median: dist[1], q1: dist[2], q3: dist[3], rank: m.rank!, topPercent: topPercentOf(m.rank!, dist[0]) } : null,
      ...(m.note ? { note: m.note } : {}),
    });
  }
  return { industry: row.industry, industryMembers: row.industryMembers, comparableMembers: row.comparableMembers, fiscalYear: row.fiscalYear, metrics };
}

/**
 * How many companies a reader can line up: free and with the premium plan (JCE-043). A setting, so the plan can be
 * redesigned (P2-1) without touching the page. Five with the plan since JCE-073 (comps of two to five companies).
 */
export const COMPARE_LIMITS = { free: 2, premium: 5 } as const;
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
