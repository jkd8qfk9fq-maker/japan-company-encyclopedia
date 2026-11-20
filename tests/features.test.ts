import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { features } from "@/data/features";
import { companyMetrics } from "@/lib/company-metrics";
import { buildIndustryFigures } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { isReleased } from "@/lib/release";
import type { FeatureBlock } from "@/types/feature";

/**
 * The editorial features (JCE-074): built from the released companies at build time. The tables are checked
 * here against the same industry figures the industry pages and rankings use, recomputed from the data
 * files — a feature's number must be the encyclopedia's number, not a second copy of it.
 */

const released = companies.filter(isReleased);
const figures = buildIndustryFigures(released);

const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;
const times2 = (v: number) => `${v.toFixed(2)}倍`;
const manYen = (v: number) =>
  `${(v / 10000).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}万円`;

function tables(featureId: string): Extract<FeatureBlock, { type: "data-table" }>[] {
  const feature = features.find((f) => f.id === featureId);
  expect(feature, featureId).toBeDefined();
  return feature!.body.filter((b): b is Extract<FeatureBlock, { type: "data-table" }> => b.type === "data-table");
}

function prose(featureId: string): string {
  const feature = features.find((f) => f.id === featureId)!;
  return feature.body
    .filter((b) => b.type === "paragraph")
    .map((b) => (b as { text: string }).text)
    .join("\n");
}

describe("features (JCE-074)", () => {
  it("publishes the three editorial features", () => {
    expect(features.map((f) => f.id).sort()).toEqual([
      "average-salary-by-industry",
      "five-year-revenue-growth",
      "overseas-sales-geography",
    ]);
    for (const f of features) {
      expect(f.status.state).toBe("published");
      expect(f.body.some((b) => b.type === "data-table")).toBe(true);
      for (const block of f.body) {
        if (block.type === "data-table") expect(block.note).toContain("計算値");
      }
    }
  });

  it("salary table rows are the industry figures' salary medians", () => {
    const [table] = tables("average-salary-by-industry");
    const expected = figures.industries
      .filter((i) => i.salaryMedian && i.salaryMedian.companies >= 10)
      .sort((a, b) => b.salaryMedian!.value - a.salaryMedian!.value);
    expect(table!.rows).toHaveLength(expected.length);
    table!.rows.forEach((row, k) => {
      const industry = expected[k]!;
      expect(row.label).toBe(INDUSTRY_LABELS[industry.id].name);
      expect(row.href).toBe(`/industries/${industry.id}`);
      expect(row.values[0]).toBe(manYen(industry.salaryMedian!.value));
      expect(row.values[1]).toBe(`${industry.salaryMedian!.companies.toLocaleString("ja-JP")}社`);
    });
    // The prose carries the same top and bottom medians (injected, not retyped).
    const text = prose("average-salary-by-industry");
    expect(text).toContain(manYen(expected[0]!.salaryMedian!.value));
    expect(text).toContain(manYen(expected.at(-1)!.salaryMedian!.value));
  });

  it("overseas company table rows match companyMetrics for each company", () => {
    const [, companyTable] = tables("overseas-sales-geography");
    expect(companyTable!.rows.length).toBeGreaterThan(0);
    let previous = Infinity;
    for (const row of companyTable!.rows) {
      const id = row.href!.replace("/companies/", "");
      const company = released.find((c) => c.id === id)!;
      const ratio = companyMetrics(company)!.overseasSalesRatio!;
      expect(row.values[0]).toBe(pct1(ratio.percent / 100));
      expect(row.values[1]).toBe(ratio.fiscalYear);
      expect(ratio.percent).toBeLessThanOrEqual(previous);
      previous = ratio.percent;
    }
  });

  it("growth table rows are the industry figures' five-year growth medians", () => {
    const [table] = tables("five-year-revenue-growth");
    const expected = figures.industries
      .filter((i) => i.revenueGrowth5y && i.revenueGrowth5y.companies >= 10)
      .sort((a, b) => b.revenueGrowth5y!.value - a.revenueGrowth5y!.value);
    expect(table!.rows).toHaveLength(expected.length);
    table!.rows.forEach((row, k) => {
      expect(row.values[0]).toBe(times2(expected[k]!.revenueGrowth5y!.value));
    });
    // No industry median below 1.00 — the prose's central claim is a property of the data, checked here.
    expect(expected.at(-1)!.revenueGrowth5y!.value).toBeGreaterThanOrEqual(1);
  });
});
