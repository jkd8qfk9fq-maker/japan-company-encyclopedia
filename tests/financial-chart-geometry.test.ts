import { describe, expect, it } from "vitest";
import { computeChartGeometry, niceStep } from "@/lib/charts/financial-chart-geometry";
import type { FinancialRecord } from "@/types/company";

// Synthetic values: this suite tests geometry, not any company's figures.
function record(fy: number, revenue: number | null, netIncome: number | null, standard: FinancialRecord["accountingStandard"] = "ifrs"): FinancialRecord {
  return {
    fiscalYear: `${fy}年3月期`,
    periodEnd: `${fy}-03-31`,
    revenue,
    revenueLabel: "売上収益",
    netIncome,
    netIncomeLabel: "親会社の所有者に帰属する当期利益",
    currency: "JPY",
    accountingStandard: standard,
    sourceIds: ["test"],
  };
}

describe("niceStep", () => {
  it("rounds to 1, 2, 2.5 or 5 times a power of ten", () => {
    expect(niceStep(10_000, 4)).toBe(2_500);
    expect(niceStep(50_000_000_000_000, 4)).toBe(20_000_000_000_000);
    expect(niceStep(900, 4)).toBe(250);
  });
});

describe("computeChartGeometry", () => {
  const W = 640;
  const H = 320;

  it("uses one zero-based axis, so the net-income column is proportionally shorter", () => {
    const g = computeChartGeometry([record(2025, 1000, 100)], W, H);
    const [revenue, netIncome] = g.bands[0].bars;
    expect(g.ticks[0].value).toBe(0);
    expect(netIncome.height / revenue.height).toBeCloseTo(0.1, 5);
  });

  it("sorts by period end regardless of input order", () => {
    const g = computeChartGeometry([record(2026, 3, 1), record(2024, 1, 1), record(2025, 2, 1)], W, H);
    expect(g.bands.map((b) => b.record.fiscalYear)).toEqual(["2024年3月期", "2025年3月期", "2026年3月期"]);
  });

  it("extends the domain below zero for a net loss and draws the column downward", () => {
    const g = computeChartGeometry([record(2025, 1000, -200)], W, H);
    const netIncome = g.bands[0].bars[1];
    expect(g.ticks[0].value).toBeLessThan(0);
    expect(netIncome.y).not.toBeNull();
    expect(netIncome.y!).toBeGreaterThan(g.baselineY);
  });

  it("draws nothing for an unavailable value rather than a zero-height column", () => {
    const g = computeChartGeometry([record(2025, null, 100)], W, H);
    const revenue = g.bands[0].bars[0];
    expect(revenue.path).toBeNull();
    expect(revenue.y).toBeNull();
  });

  it("marks where the accounting standard changes", () => {
    const g = computeChartGeometry(
      [record(2020, 10, 1, "usgaap"), record(2021, 10, 1, "usgaap"), record(2022, 10, 1, "ifrs")],
      W,
      H,
    );
    expect(g.breaks).toHaveLength(1);
    expect(g.breaks[0].reason).toBe("standard");
    expect(g.breaks[0].after.fiscalYear).toBe("2022年3月期");
  });

  it("marks where what the revenue covers changes, even under one standard", () => {
    const withScope = (fy: number, basis: string) => ({ ...record(fy, 10, 1), revenueBasis: basis });
    const g = computeChartGeometry(
      [withScope(2023, "金融事業を含む"), withScope(2024, "金融事業を除く"), withScope(2025, "金融事業を除く")],
      W,
      H,
    );
    expect(g.breaks).toHaveLength(1);
    expect(g.breaks[0].reason).toBe("basis");
    expect(g.breaks[0].after.fiscalYear).toBe("2024年3月期");
  });

  it("caps column width at 24px however wide the chart is", () => {
    const g = computeChartGeometry([record(2025, 10, 1)], 4000, H);
    expect(g.bands[0].bars[0].width).toBe(24);
  });
});
