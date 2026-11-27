import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { companies as allCompanies } from "@/data/companies";
import { isReleased } from "@/lib/release";
import { companyRepository, headquartersRepository } from "@/lib/repositories";
import { EMPTY_CONDITIONS, REVENUE_BANDS, applyConditions, isConditions, sortRows, type Conditions, type ScreeningRow } from "@/lib/screening";
import { buildScreeningIndex, screeningRow } from "@/lib/screening-index";
import type { Company } from "@/types/company";

/**
 * Financial screening (JCE-060). A condition is met only by a figure the entry prints or the site computes from printed
 * figures; a company without that figure is counted as データなし, never passed and never treated as zero.
 */

const row = (id: string, extra: Partial<ScreeningRow> = {}): ScreeningRow => ({
  id,
  name: id,
  industries: ["automotive"],
  prefecture: "東京都",
  fiscalYear: "2025年3月期",
  revenue: 5e10,
  growth5y: 1.2,
  netMargin: 5,
  overseas: 30,
  employees: 1000,
  ...extra,
});
const when = (c: Partial<Conditions>): Conditions => ({ ...EMPTY_CONDITIONS, ...c });

describe("applyConditions", () => {
  it("passes everyone with no condition", () => {
    const rows = [row("a"), row("b", { revenue: null })];
    expect(applyConditions(rows, EMPTY_CONDITIONS)).toEqual({ matches: rows, withoutData: 0 });
  });

  it("matches any of the chosen industries, including a non-primary one", () => {
    const rows = [row("a"), row("b", { industries: ["banking", "automotive"] }), row("c", { industries: ["banking"] })];
    expect(applyConditions(rows, when({ industries: ["automotive"] })).matches.map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("matches the prefecture exactly; a company without one is not in any prefecture", () => {
    const rows = [row("a"), row("b", { prefecture: "大阪府" }), row("c", { prefecture: null })];
    expect(applyConditions(rows, when({ prefecture: "大阪府" })).matches.map((r) => r.id)).toEqual(["b"]);
  });

  it("puts a revenue on a band's lower edge in that band, never in two", () => {
    const rows = [row("edge", { revenue: 1e11 })];
    const hits = REVENUE_BANDS.filter((b) => applyConditions(rows, when({ revenueBand: b.id })).matches.length === 1);
    expect(hits.map((b) => b.id)).toEqual(["1000-oku"]);
  });

  it("counts a company missing an asked-for figure as データなし, and only for the figures asked about", () => {
    const rows = [row("a", { netMargin: 8 }), row("b", { netMargin: null }), row("c", { netMargin: 2 }), row("d", { overseas: null })];
    expect(applyConditions(rows, when({ marginMin: 5 }))).toEqual({ matches: [rows[0], rows[3]], withoutData: 1 });
    expect(applyConditions(rows, when({ marginMin: 5, overseasMin: 10 }))).toEqual({ matches: [rows[0]], withoutData: 2 });
  });

  it("treats a negative margin as a figure, and the minimum as inclusive", () => {
    const rows = [row("loss", { netMargin: -3 }), row("even", { netMargin: 0 })];
    expect(applyConditions(rows, when({ marginMin: 0 })).matches.map((r) => r.id)).toEqual(["even"]);
    expect(applyConditions(rows, when({ marginMin: -5 })).matches).toHaveLength(2);
  });

  it("checks industry and prefecture before data: a company outside them is not counted as データなし", () => {
    const rows = [row("a", { industries: ["banking"], growth5y: null })];
    expect(applyConditions(rows, when({ industries: ["automotive"], growthMin: 1 }))).toEqual({ matches: [], withoutData: 0 });
  });
});

describe("sortRows", () => {
  it("puts the largest first and companies without the figure last, then by name", () => {
    const rows = [row("い", { employees: null }), row("b", { employees: 10 }), row("a", { employees: 500 }), row("あ", { employees: null })];
    expect(sortRows(rows, "employees").map((r) => r.id)).toEqual(["a", "b", "あ", "い"]);
    expect(rows.map((r) => r.id)).toEqual(["い", "b", "a", "あ"]);
  });
});

describe("isConditions (saved conditions read back from this browser)", () => {
  it("accepts the shape the tool saves and rejects anything else", () => {
    expect(isConditions(EMPTY_CONDITIONS)).toBe(true);
    expect(isConditions(when({ industries: ["automotive"], revenueBand: "1-cho", marginMin: -2 }))).toBe(true);
    expect(isConditions(when({ revenueBand: "no-such-band" }))).toBe(false);
    expect(isConditions({ ...EMPTY_CONDITIONS, growthMin: Number.NaN })).toBe(false);
    expect(isConditions({ ...EMPTY_CONDITIONS, industries: [1] })).toBe(false);
    expect(isConditions(null)).toBe(false);
  });
});

describe("screeningRow", () => {
  const fin = (y: number, revenue: number | null, netIncome: number | null, employees: number | null = null) => ({
    fiscalYear: `${y}年3月期`,
    periodEnd: `${y}-03-31`,
    revenue,
    revenueLabel: "売上高",
    netIncome,
    netIncomeLabel: "当期純利益",
    employees,
    sourceIds: ["s"],
  });
  const company = (financials: ReturnType<typeof fin>[]): Company =>
    ({
      id: "x",
      name: "X",
      industries: [{ industryId: "banking" }, { industryId: "automotive", primary: true }],
      businesses: [],
      financials,
    }) as unknown as Company;

  it("reads the latest printed year whatever the stored order, primary industry first", () => {
    const r = screeningRow(company([fin(2025, 200, 10, 50), fin(2021, 100, 1), fin(2022, 120, 1), fin(2023, 140, 1), fin(2024, 160, 1)]), "愛知県");
    expect(r).toMatchObject({ industries: ["automotive", "banking"], prefecture: "愛知県", fiscalYear: "2025年3月期", revenue: 200, growth5y: 2, netMargin: 5, employees: 50, overseas: null });
  });

  it("leaves the growth out with fewer than five years, and every figure out with none", () => {
    expect(screeningRow(company([fin(2024, 160, 1), fin(2025, 200, 10)]), null).growth5y).toBeNull();
    expect(screeningRow(company([]), null)).toMatchObject({ revenue: null, growth5y: null, netMargin: null, employees: null, fiscalYear: null });
  });
});

// The real index, checked against figures read straight from the data files (not through the code under test).
describe("the published index", async () => {
  const released = await companyRepository.list();
  const hq = new Map(await Promise.all(released.map(async (c) => [c.id, (await headquartersRepository.get(c.id))?.prefecture ?? null] as const)));
  const index = buildScreeningIndex(released, (id) => hq.get(id) ?? null, [], "2026-11-17");

  type Raw = { id: string; industries: { industryId: string }[]; financials: { periodEnd: string; revenue: number | null; netIncome: number | null; employees: number | null }[] };
  const raw = (id: string): Raw => JSON.parse(readFileSync(`src/data/companies/${id}.json`, "utf8"));
  const latestOf = (r: Raw) => [...r.financials].sort((a, b) => (a.periodEnd < b.periodEnd ? -1 : 1)).at(-1);

  it("has one row per released company and none for an unreleased one", () => {
    expect(index.rows).toHaveLength(allCompanies.filter(isReleased).length);
    const ids = new Set(index.rows.map((r) => r.id));
    expect(allCompanies.filter((c) => !isReleased(c)).some((c) => ids.has(c.id))).toBe(false);
  });

  it("holds no stock-market figure (invariant 4): only the fields of ScreeningRow", () => {
    const keys = ["id", "name", "industries", "prefecture", "fiscalYear", "revenue", "growth5y", "netMargin", "overseas", "employees"].sort();
    expect(index.rows.every((r) => JSON.stringify(Object.keys(r).sort()) === JSON.stringify(keys))).toBe(true);
  });

  it("例1: 自動車 × 売上高1兆円以上 matches an independent count", { timeout: 60_000 }, () => {
    const expected = released
      .map((c) => raw(c.id))
      .filter((r) => r.industries.some((i) => i.industryId === "automotive"))
      .filter((r) => (latestOf(r)?.revenue ?? -1) >= 1e12)
      .map((r) => r.id)
      .sort();
    expect(expected.length).toBeGreaterThan(0);
    const got = applyConditions(index.rows, when({ industries: ["automotive"], revenueBand: "1-cho" })).matches.map((r) => r.id).sort();
    expect(got).toEqual(expected);
  });

  it("例2: 純利益率 10%以上 × 従業員 1,000人以上 matches an independent count, with データなし counted", { timeout: 60_000 }, () => {
    let missing = 0;
    const expected = released
      .map((c) => raw(c.id))
      .filter((r) => {
        const l = latestOf(r);
        const margin = l && l.revenue !== null && l.revenue > 0 && l.netIncome !== null ? Math.round((l.netIncome / l.revenue) * 1000) / 10 : null;
        const employees = l?.employees ?? null;
        if (margin === null || employees === null) {
          missing++;
          return false;
        }
        return margin >= 10 && employees >= 1000;
      })
      .map((r) => r.id)
      .sort();
    const got = applyConditions(index.rows, when({ marginMin: 10, employeesMin: 1000 }));
    expect(got.matches.map((r) => r.id).sort()).toEqual(expected);
    expect(got.withoutData).toBe(missing);
  });

  it("例3: 東京都 × 5期の売上高が1.5倍以上 matches an independent count", { timeout: 60_000 }, () => {
    const expected = released
      .map((c) => raw(c.id))
      .filter((r) => hq.get(r.id) === "東京都")
      .filter((r) => {
        const f = [...r.financials].sort((a, b) => (a.periodEnd < b.periodEnd ? -1 : 1));
        if (f.length < 5) return false;
        const [first, last] = [f[0].revenue, f.at(-1)!.revenue];
        return first !== null && last !== null && first > 0 && last > 0 && Math.round((last / first) * 100) / 100 >= 1.5;
      })
      .map((r) => r.id)
      .sort();
    expect(expected.length).toBeGreaterThan(0);
    const got = applyConditions(index.rows, when({ prefecture: "東京都", growthMin: 1.5 })).matches.map((r) => r.id).sort();
    expect(got).toEqual(expected);
  });
});
