import { describe, expect, it } from "vitest";
import { industryComparison } from "../src/lib/industry-comparison";
import type { Company, IndustryId } from "../src/types/company";

/** 業界比較 ranks and medians printed figures; a company without a figure gets no comparison for it. */

const years = (revenues: number[], netIncomes: (number | null)[]) =>
  revenues.map((revenue, i) => ({
    fiscalYear: `${2022 + i}年3月期`,
    periodEnd: `${2022 + i}-03-31`,
    revenue,
    revenueLabel: "売上高",
    netIncome: netIncomes[i] ?? null,
    netIncomeLabel: "当期純利益",
    employees: null,
    sourceIds: ["s"],
  }));

const company = (id: string, industry: IndustryId, revenues: number[], netIncome: number | null, extra: Partial<Company> = {}): Company =>
  ({ id, name: id, industries: [{ industryId: industry, primary: true }], relatedCompanies: [], financials: years(revenues, revenues.map((_, i) => (i === revenues.length - 1 ? netIncome : null))), ...extra }) as unknown as Company;

const members = [
  company("a", "retail", [100, 100, 100, 100, 200], 20),
  company("b", "retail", [100, 100, 100, 100, 150], 3),
  company("c", "retail", [100, 100, 100, 100, 120], 12),
  company("x", "food", [1, 1, 1, 1, 1], 1),
];

describe("industryComparison", () => {
  it("ranks the company by revenue and by margin among its industry, with the industry median", () => {
    const c = industryComparison(members[2], members)!;
    expect(c.industryName).toBe("小売");
    expect(c.members).toBe(3);
    expect(c.revenue).toMatchObject({ value: 120, rank: 3, members: 3 });
    expect(c.revenue!.share).toBeCloseTo(120 / 470);
    // margins: a 0.10, b 0.02, c 0.10 → c ties a for rank 1; median 0.10
    expect(c.netProfitMargin).toMatchObject({ value: 0.1, industryMedian: 0.1, rank: 1, members: 3 });
    // growth: a 2.0, b 1.5, c 1.2 → c rank 3, median 1.5
    expect(c.revenueGrowth5y).toMatchObject({ value: 1.2, industryMedian: 1.5, rank: 3 });
    expect(c.overseasSalesRatio).toBeNull();
    expect(c.averageAnnualSalary).toBeNull();
    expect(c.index.company?.values.map(Math.round)).toEqual([100, 100, 100, 100, 120]);
    expect(c.index.industry?.companies).toBe(3);
  });

  it("gives no comparison to a company alone in its industry, or without the figure", () => {
    expect(industryComparison(members[3], members)).toBeNull();
    const silent = company("d", "retail", [100, 100, 100, 100, 100], null);
    const c = industryComparison(silent, [...members, silent])!;
    expect(c.netProfitMargin).toBeNull();
    expect(c.revenue).toMatchObject({ rank: 4, members: 4 });
  });
});
