import { describe, expect, it } from "vitest";
import { buildIndustryFigures, median, revenueGrowth5y } from "../src/lib/industry-figures";
import type { Company, IndustryId } from "../src/types/company";

/** The industry figures are sums and ratios of printed figures: a missing figure is left out, never guessed. */

const years = (revenues: (number | null)[], netIncomes: (number | null)[] = revenues.map(() => null)) =>
  revenues.map((revenue, i) => ({
    fiscalYear: `${2022 + i}年3月期`,
    periodEnd: `${2022 + i}-03-31`,
    revenue,
    revenueLabel: "売上高",
    netIncome: netIncomes[i],
    netIncomeLabel: "当期純利益",
    employees: null,
    sourceIds: ["s"],
  }));

const company = (id: string, industry: IndustryId, financials: ReturnType<typeof years>, extra: Partial<Company> = {}): Company =>
  ({ id, name: id, industries: [{ industryId: industry, primary: true }], relatedCompanies: [], financials, ...extra }) as unknown as Company;

describe("buildIndustryFigures", () => {
  it("sums the latest year per company and counts what it had to leave out", () => {
    const data = buildIndustryFigures([
      company("a", "automotive", years([100, 110, 120, 130, 200], [null, null, null, null, 20])),
      company("b", "automotive", years([50, 50, 50, 50, 100], [null, null, null, null, null])),
      company("c", "automotive", years([null])),
    ]);
    const auto = data.industries[0];
    expect(auto.companies).toBe(3);
    expect(auto.revenue).toEqual({ total: 300, companies: 2, excluded: 1 });
    // Only "a" prints both revenue and net income, so the margin is a's alone — not 20 ÷ 300.
    expect(auto.netProfitMargin).toEqual({ value: 0.1, formula: expect.any(String), companies: 1 });
    // Five full years: a grew ×2, b ×2 → median 2. "c" has one year and is left out.
    expect(auto.revenueGrowth5y).toEqual({ value: 2, formula: expect.any(String), companies: 2 });
    expect(auto.top3Share?.value).toBe(1);
    expect(auto.ranking.map((r) => r.id)).toEqual(["a", "b"]);
    expect(auto.ranking[0]).toMatchObject({ revenue: 200, netProfitMargin: 0.1, revenueGrowth5y: 2 });
    expect(auto.overseasSalesRatio).toBeNull();
    expect(data.totals).toEqual({ companies: 3, revenue: 300, netIncome: 20, employees: 0 });
  });

  it("takes the overseas ratio only from a filing with exactly one domestic region", () => {
    const regional = (items: { region: string; domestic: boolean; amount: number }[]) => ({
      fiscalYear: "2026年3月期",
      periodEnd: "2026-03-31",
      label: "売上高",
      items,
      sourceIds: ["s"],
    });
    const data = buildIndustryFigures([
      company("a", "chemicals", years([1, 1, 1, 1, 1]), { regionalRevenue: regional([{ region: "日本", domestic: true, amount: 30 }, { region: "海外", domestic: false, amount: 70 }]) } as Partial<Company>),
      company("b", "chemicals", years([1, 1, 1, 1, 1]), { regionalRevenue: regional([{ region: "東日本", domestic: true, amount: 1 }, { region: "西日本", domestic: true, amount: 1 }]) } as Partial<Company>),
    ]);
    expect(data.industries[0].overseasSalesRatio).toEqual({ value: 0.7, formula: expect.any(String), companies: 1 });
  });

  it("counts seller → buyer between industries once per pair, from either entry", () => {
    const data = buildIndustryFigures([
      company("steel", "chemicals", years([1]), { relatedCompanies: [{ companyId: "car", relationship: "customer", description: "", sourceIds: ["s"] }] } as Partial<Company>),
      company("car", "automotive", years([1]), { relatedCompanies: [{ companyId: "steel", relationship: "supplier", description: "", sourceIds: ["s"] }] } as Partial<Company>),
    ]);
    expect(data.flows).toEqual([{ from: "chemicals", to: "automotive", ties: 1 }]);
  });

  it("orders industries by revenue, largest first", () => {
    const data = buildIndustryFigures([company("a", "retail", years([5])), company("b", "food", years([9]))]);
    expect(data.industries.map((i) => i.id)).toEqual(["food", "retail"]);
  });
});

describe("revenueGrowth5y", () => {
  it("needs five years with positive revenue at both ends", () => {
    expect(revenueGrowth5y(company("a", "it", years([10, 1, 1, 1, 25])))).toBe(2.5);
    expect(revenueGrowth5y(company("a", "it", years([10, 1, 1, 25])))).toBeNull();
    expect(revenueGrowth5y(company("a", "it", years([null, 1, 1, 1, 25])))).toBeNull();
    expect(revenueGrowth5y(company("a", "it", years([-5, 1, 1, 1, 25])))).toBeNull();
  });
});

describe("median", () => {
  it("is the middle value, or the mean of the two middle values", () => {
    expect(median([])).toBeNull();
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});
