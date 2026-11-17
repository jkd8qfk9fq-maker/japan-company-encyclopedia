/**
 * Financial screening (JCE-060): the conditions and their rules. No imports — the browser runs this, and
 * src/lib/site.ts must never reach client code (tests/client-imports.test.ts).
 *
 * Every figure is one the entries already print or one the site already computes from printed figures: latest
 * revenue and employees as printed, 純利益率 and 海外売上高比率 (JCE-038), 5期の売上高の伸び (latest ÷ five years
 * earlier, JCE-041/043). Nothing new is estimated. A company without the figure a condition asks about is left out of
 * that result and counted as 「データなし」 — never treated as zero or as passing.
 */

export type ScreeningRow = {
  id: string;
  name: string;
  /** Industry ids, the primary first. */
  industries: string[];
  prefecture: string | null;
  fiscalYear: string | null;
  /** Latest printed revenue, yen. */
  revenue: number | null;
  /** Latest ÷ five years earlier (×). */
  growth5y: number | null;
  /** 純利益 ÷ 売上高, percent. */
  netMargin: number | null;
  /** Overseas share of regional revenue, percent. */
  overseas: number | null;
  employees: number | null;
};

export type ScreeningIndex = {
  asOf: string;
  industries: { id: string; name: string }[];
  rows: ScreeningRow[];
};

export const REVENUE_BANDS = [
  { id: "1-cho", name: "1兆円以上", min: 1e12, max: Infinity },
  { id: "1000-oku", name: "1,000億〜1兆円", min: 1e11, max: 1e12 },
  { id: "100-oku", name: "100億〜1,000億円", min: 1e10, max: 1e11 },
  { id: "under-100-oku", name: "100億円未満", min: -Infinity, max: 1e10 },
] as const;

export type Conditions = {
  industries: string[];
  prefecture: string | null;
  revenueBand: string | null;
  growthMin: number | null;
  marginMin: number | null;
  overseasMin: number | null;
  employeesMin: number | null;
};

export const EMPTY_CONDITIONS: Conditions = {
  industries: [],
  prefecture: null,
  revenueBand: null,
  growthMin: null,
  marginMin: null,
  overseasMin: null,
  employeesMin: null,
};

export type SortKey = "revenue" | "growth5y" | "employees";
export const SORT_LABELS: Record<SortKey, string> = { revenue: "売上高の大きい順", growth5y: "5期の売上高の伸びの大きい順", employees: "従業員数の多い順" };

/** The figure each numeric condition reads; a company without it cannot be said to meet the condition. */
const NEEDS: { key: keyof Conditions; field: keyof ScreeningRow }[] = [
  { key: "revenueBand", field: "revenue" },
  { key: "growthMin", field: "growth5y" },
  { key: "marginMin", field: "netMargin" },
  { key: "overseasMin", field: "overseas" },
  { key: "employeesMin", field: "employees" },
];

export function applyConditions(rows: ScreeningRow[], c: Conditions): { matches: ScreeningRow[]; withoutData: number } {
  const band = REVENUE_BANDS.find((b) => b.id === c.revenueBand) ?? null;
  const active = NEEDS.filter(({ key }) => c[key] !== null);
  let withoutData = 0;
  const matches = rows.filter((r) => {
    if (c.industries.length > 0 && !r.industries.some((id) => c.industries.includes(id))) return false;
    if (c.prefecture !== null && r.prefecture !== c.prefecture) return false;
    if (active.some(({ field }) => r[field] === null)) {
      withoutData++;
      return false;
    }
    if (band && !(r.revenue! >= band.min && r.revenue! < band.max)) return false;
    if (c.growthMin !== null && !(r.growth5y! >= c.growthMin)) return false;
    if (c.marginMin !== null && !(r.netMargin! >= c.marginMin)) return false;
    if (c.overseasMin !== null && !(r.overseas! >= c.overseasMin)) return false;
    if (c.employeesMin !== null && !(r.employees! >= c.employeesMin)) return false;
    return true;
  });
  return { matches, withoutData };
}

/** Largest first; a company without the figure goes last, then by name, so the order is stable. */
export function sortRows(rows: ScreeningRow[], key: SortKey): ScreeningRow[] {
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (x === null && y === null) return a.name.localeCompare(b.name, "ja");
    if (x === null) return 1;
    if (y === null) return -1;
    return y - x || a.name.localeCompare(b.name, "ja");
  });
}

/** Saved conditions per browser. A free browser keeps this many; the premium plan may raise it (P2-1). */
export const SAVED_CONDITIONS_LIMIT = 3;

export function isConditions(value: unknown): value is Conditions {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const num = (x: unknown) => x === null || (typeof x === "number" && Number.isFinite(x));
  return (
    Array.isArray(v.industries) &&
    v.industries.every((x) => typeof x === "string") &&
    (v.prefecture === null || typeof v.prefecture === "string") &&
    (v.revenueBand === null || REVENUE_BANDS.some((b) => b.id === v.revenueBand)) &&
    num(v.growthMin) &&
    num(v.marginMin) &&
    num(v.overseasMin) &&
    num(v.employeesMin)
  );
}
