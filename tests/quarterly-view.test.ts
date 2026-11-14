import { describe, expect, it } from "vitest";
import { changeOf, quarterlyView } from "../src/lib/quarterly";
import type { Company } from "../src/types/company";

const quarter = (fyEnd: string, quarter: 1 | 3, revenue: number, netIncome: number) => ({
  fiscalYearEnd: fyEnd, fiscalYear: "", quarter, revenue, operatingIncome: null, netIncome, accountingStandard: "jgaap" as const, consolidated: true, disclosedAt: "2026-08-05", sourceIds: [`q-${fyEnd}-${quarter}`],
});
const company = (extra: Partial<Company>) => ({ financials: [], interimFinancials: [], quarterlyEarnings: [], ...extra }) as unknown as Company;

describe("quarterlyView (JCE-049)", () => {
  it("lines up Q1 (EDINET DB), the half (半期報告書) and the previous full year (有報) of the year in progress", () => {
    const v = quarterlyView(
      company({
        quarterlyEarnings: [quarter("2026-03-31", 1, 80, 4), quarter("2026-03-31", 3, 250, 12), quarter("2027-03-31", 1, 90, 5)],
        interimFinancials: [{ periodEnd: "2025-09-30", revenue: 160, netIncome: 8, sourceIds: ["h25"] }, { periodEnd: "2026-09-30", revenue: 176, netIncome: 9, sourceIds: ["h26"] }] as never,
        financials: [{ periodEnd: "2026-03-31", revenue: 347, netIncome: 15, sourceIds: ["y26"] }] as never,
      }),
    )!;
    expect(v.fiscalYear).toBe("2027年3月期");
    expect(v.points.map((p) => [p.key, p.revenue, p.priorRevenue])).toEqual([["q1", 90, 80], ["h1", 176, 160], ["q3", null, 250], ["fy", null, 347]]);
    expect(v.points[0].revenueChange).toBeCloseTo(0.125);
    expect(v.points[0].source).toBe("edinet-db");
    expect(v.points[1].source).toBe("hanki");
    expect(v.usesEdinetDb).toBe(true);
  });

  it("shows the half alone before any quarter is held", () => {
    const v = quarterlyView(company({ interimFinancials: [{ periodEnd: "2026-09-30", revenue: 176, netIncome: 9, sourceIds: ["h26"] }] as never }))!;
    expect(v.points.map((p) => p.key)).toEqual(["h1"]);
    expect(v.usesEdinetDb).toBe(false);
  });

  it("is absent without quarters, or once the year's full year is in", () => {
    expect(quarterlyView(company({}))).toBeNull();
    expect(quarterlyView(company({ quarterlyEarnings: [quarter("2026-03-31", 1, 80, 4)], financials: [{ periodEnd: "2026-03-31", revenue: 300, netIncome: 1, sourceIds: [] }] as never }))).toBeNull();
  });

  it("gives no 前年同期比 over a loss or a zero", () => {
    expect(changeOf(10, -5)).toBeNull();
    expect(changeOf(10, 0)).toBeNull();
    expect(changeOf(12, 10)).toBeCloseTo(0.2);
  });
});
