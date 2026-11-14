import { describe, expect, it } from "vitest";
import { changeBetween, financialCsv, financialSummary } from "../src/lib/financial-summary";
import type { FinancialRecord } from "../src/types/company";

/** 前期比 is printed only between comparable years, and never across a base of zero or a loss (JCE-047). */

const record = (year: number, extra: Partial<FinancialRecord> = {}): FinancialRecord =>
  ({
    fiscalYear: `${year}年3月期`,
    periodEnd: `${year}-03-31`,
    revenue: 1000,
    revenueLabel: "売上高",
    profit: 100,
    profitLabel: "経常利益",
    netIncome: 50,
    netIncomeLabel: "親会社株主に帰属する当期純利益",
    totalAssets: 2000,
    totalAssetsLabel: "総資産額",
    netAssets: 800,
    netAssetsLabel: "純資産額",
    employees: 100,
    currency: "JPY",
    accountingStandard: "jgaap",
    sourceIds: ["s"],
    ...extra,
  }) as FinancialRecord;

describe("financialSummary", () => {
  it("prints each line of the latest year with its 前期比 and the filing's own label", () => {
    const summary = financialSummary([record(2025, { revenue: 1200, employees: 90 }), record(2024)])!;
    expect(summary.fiscalYear).toBe("2025年3月期");
    expect(summary.previousYear).toBe("2024年3月期");
    const revenue = summary.items.find((i) => i.key === "revenue")!;
    expect(revenue.change).toBeCloseTo(0.2);
    expect(summary.items.find((i) => i.key === "profit")!.label).toBe("経常利益");
    expect(summary.items.find((i) => i.key === "employees")!.change).toBeCloseTo(-0.1);
  });

  it("leaves 前期比 out across a change of accounting standard or revenue scope", () => {
    const standard = financialSummary([record(2024), record(2025, { accountingStandard: "ifrs" })])!;
    expect(standard.items.every((i) => i.change === null)).toBe(true);
    const scope = financialSummary([record(2024, { revenueBasis: "金融事業を含む" }), record(2025, { revenueBasis: "金融事業を除く" })])!;
    expect(scope.items.find((i) => i.key === "revenue")!.change).toBeNull();
    expect(scope.items.find((i) => i.key === "netIncome")!.change).toBeNull();
    expect(scope.items.find((i) => i.key === "totalAssets")!.change).toBe(0);
  });

  it("drops a line the filing does not print, and a 前期比 over a loss or a zero", () => {
    const summary = financialSummary([record(2024, { netIncome: -10 }), record(2025, { profit: null, profitLabel: null, netIncome: 30 })])!;
    expect(summary.items.find((i) => i.key === "profit")).toBeUndefined();
    expect(summary.items.find((i) => i.key === "netIncome")!.change).toBeNull();
    expect(changeBetween(10, 0)).toBeNull();
    expect(changeBetween(null, 10)).toBeNull();
  });
});

describe("financialCsv", () => {
  it("writes the printed figures in yen, oldest first, with a BOM and quoted labels", () => {
    const csv = financialCsv("テスト株式会社", [record(2025), record(2024, { revenueLabel: "売上高, 営業収益" })]);
    expect(csv.startsWith("﻿")).toBe(true);
    const lines = csv.trim().split("\r\n");
    expect(lines).toHaveLength(4);
    expect(lines[2]).toContain('2024年3月期,2024-03-31,"売上高, 営業収益",1000');
    expect(lines[3].startsWith("2025年3月期")).toBe(true);
  });
});
