import { describe, expect, it } from "vitest";
import { financialDeepDive } from "../src/lib/financial-deep-dive";
import type { Company, IndustryId } from "../src/types/company";

/** 財務の深掘り: five-year ratios of printed figures beside the industry's year-by-year median; a gap stays a gap. */

const rec = (i: number, revenue: number | null, netIncome: number | null, totalAssets: number, netAssets: number, employees: number | null) => ({
  fiscalYear: `${2022 + i}年3月期`,
  periodEnd: `${2022 + i}-03-31`,
  revenue,
  revenueLabel: "売上高",
  netIncome,
  netIncomeLabel: "当期純利益",
  profit: null,
  profitLabel: null,
  totalAssets,
  netAssets,
  employees,
  sourceIds: ["s"],
});
const company = (id: string, industry: IndustryId, financials: unknown[]): Company =>
  ({ id, name: id, industries: [{ industryId: industry, primary: true }], relatedCompanies: [], financials }) as unknown as Company;

const a = company("a", "retail", [0, 1, 2, 3, 4].map((i) => rec(i, 100, 10, 200, 100 + i * 10, 10)));
const b = company("b", "retail", [0, 1, 2, 3, 4].map((i) => rec(i, 100, 2, 200, 50, 20)));
const c = company("c", "retail", [0, 1, 2, 3, 4].map((i) => rec(i, 100, 6, 200, 80, 10)));
const target = company("t", "retail", [0, 1, 2, 3, 4].map((i) => rec(i, i === 2 ? null : 100, 5, 400, 100, 5)));

describe("financialDeepDive", () => {
  it("computes the company's ratios year by year and the industry median per position", () => {
    const d = financialDeepDive(target, [a, b, c, target])!;
    expect(d.industryName).toBe("小売");
    const margin = d.trends.find((t) => t.key === "net-margin")!;
    expect(margin.company.map((p) => p.value)).toEqual([0.05, 0.05, null, 0.05, 0.05]);
    // medians over a (0.10), b (0.02), c (0.06) → 0.06; the target itself is not in its own reference.
    expect(margin.industry.map((p) => p.value)).toEqual([0.06, 0.06, 0.06, 0.06, 0.06]);
    expect(margin.industryCompanies).toBe(3);
    const equity = d.trends.find((t) => t.key === "equity-ratio")!;
    expect(equity.company[0]!.value).toBe(0.25);
    const perHead = d.trends.find((t) => t.key === "revenue-per-employee")!;
    expect(perHead.company[0]!.value).toBe(20);
    expect(perHead.industry[0]!.value).toBe(10);
    const assets = d.trends.find((t) => t.key === "net-assets-index")!;
    expect(assets.industry.map((p) => p.value)).toEqual([100, 100, 100, 100, 100]);
  });

  it("gives nothing to a company without five years", () => {
    expect(financialDeepDive(company("s", "retail", [rec(0, 1, 1, 1, 1, 1)]), [a, b])).toBeNull();
  });
});
