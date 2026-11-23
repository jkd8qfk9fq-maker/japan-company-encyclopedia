import { describe, expect, it } from "vitest";
import { companyAnalysis } from "../src/lib/company-analysis";
import type { Company, FinancialRecord, IndustryId } from "../src/types/company";

/**
 * The five-perspective analysis layer (JCE-078 Phase 1): the report's computed layer regrouped,
 * plus the printed figures' own positions. The rules under test are the spec's: a perspective is
 * never combined into a score, a distribution appears only at five or more comparable peers, the
 * printed rows stay printed (kind "printed", never dressed as computation), and a change is
 * computed only across the same accounting standard.
 */

const rec = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  ({
    fiscalYear: "2026年3月期",
    periodEnd: "2026-03-31",
    revenue: 1000,
    revenueLabel: "売上高",
    profit: 100,
    profitLabel: "経常利益",
    netIncome: 50,
    netIncomeLabel: "当期純利益",
    totalAssets: 2000,
    totalAssetsLabel: "総資産",
    netAssets: 800,
    netAssetsLabel: "純資産",
    employees: 100,
    currency: "JPY",
    accountingStandard: "jgaap",
    sourceIds: ["s"],
    ...over,
  }) as FinancialRecord;

const prev = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  rec({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 800, netIncome: 40, netAssets: 700, ...over });

const company = (id: string, industry: IndustryId, financials: FinancialRecord[]): Company =>
  ({
    id,
    name: id,
    industries: [{ industryId: industry, primary: true }],
    financials,
    businesses: [],
    history: [],
    relatedCompanies: [],
    sources: [],
  }) as unknown as Company;

/** Six retailers with revenues 100..600 and net assets 700 in the previous year. */
const retailers = [100, 200, 300, 400, 500, 600].map((revenue, i) =>
  company(`r${i}`, "retail", [prev(), rec({ revenue, netIncome: revenue / 10 })]),
);
const target = retailers[3]!; // revenue 400

describe("companyAnalysis", () => {
  it("groups rows under the five perspectives, in spec order", () => {
    const analysis = companyAnalysis(target, retailers);
    // No regional revenue in the fixture, so 外部環境との接続 has no row and is not drawn.
    expect(analysis.perspectives.map((p) => p.id)).toEqual(["scale", "growth", "profitability", "stability"]);
    const profitability = analysis.perspectives.find((p) => p.id === "profitability")!;
    expect(profitability.rows.map((r) => r.key)).toContain("net-margin");
    expect(profitability.rows.every((r) => r.kind === "computed")).toBe(true);
  });

  it("keeps the scale rows printed, with rank and percentile over the industry", () => {
    const analysis = companyAnalysis(target, retailers);
    const scale = analysis.perspectives.find((p) => p.id === "scale")!;
    const revenue = scale.rows.find((r) => r.key === "printed-revenue")!;
    expect(revenue.kind).toBe("printed");
    expect(revenue.value).toBe(400);
    expect(revenue.industry).not.toBeNull();
    expect(revenue.industry!.rank).toBe(3); // 600 and 500 are above 400
    expect(revenue.industry!.members).toBe(6);
    expect(scale.rows.map((r) => r.key)).toEqual(["printed-revenue", "printed-total-assets", "printed-net-assets", "printed-employees"]);
  });

  it("gives a value without a distribution when the industry is thinner than five", () => {
    const few = retailers.slice(0, 3);
    const analysis = companyAnalysis(few[1]!, few);
    const scale = analysis.perspectives.find((p) => p.id === "scale")!;
    expect(scale.rows.length).toBeGreaterThan(0);
    expect(scale.rows.every((r) => r.industry === null)).toBe(true);
  });

  it("carries the net-assets change in the B1 group, only across the same accounting standard", () => {
    const same = companyAnalysis(target, retailers);
    const stability = same.perspectives.find((p) => p.id === "stability")!;
    const b1 = stability.groups.find((g) => g.id === "b1")!;
    expect(b1).toBeDefined();
    const change = b1.rows.find((r) => r.key === "b1-net-assets-growth")!;
    expect(change.value).toBeCloseTo(800 / 700 - 1);
    // The old stand-alone row is gone: the change now stands inside its decomposition.
    expect(stability.rows.some((r) => r.key === "net-assets-growth-1y")).toBe(false);

    const switched = company("sw", "retail", [prev({ accountingStandard: "ifrs" }), rec()]);
    const analysis2 = companyAnalysis(switched, [...retailers, switched]);
    const stability2 = analysis2.perspectives.find((p) => p.id === "stability")!;
    expect(stability2.groups.some((g) => g.id === "b1")).toBe(false);
  });

  it("attaches the printed trends to growth and stability, never a combined score", () => {
    const analysis = companyAnalysis(target, retailers);
    expect(analysis.perspectives.find((p) => p.id === "growth")!.series?.points).toHaveLength(2);
    expect(analysis.perspectives.find((p) => p.id === "stability")!.series?.title).toContain("純資産");
    const serialized = JSON.stringify(analysis);
    expect(serialized).not.toContain("score");
    expect(serialized).not.toContain("grade");
  });
});
