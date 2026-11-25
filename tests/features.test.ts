import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { features } from "@/data/features";
import { companyMetrics } from "@/lib/company-metrics";
import { buildIndustryFigures, median } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { isReleased } from "@/lib/release";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";
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
const people = (n: number) => `${n.toLocaleString("ja-JP", { maximumFractionDigits: 1 })}人`;
const manYen0 = (v: number) => `${Math.round(v / 10000).toLocaleString("ja-JP")}万円`;
const count = (n: number) => `${n.toLocaleString("ja-JP")}社`;

const latestOf = (c: Company): FinancialRecord | undefined =>
  [...c.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
const primaryId = (c: Company): IndustryId | null =>
  (c.industries.find((ref) => ref.primary) ?? c.industries[0])?.industryId ?? null;

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
  it("publishes the six editorial features", () => {
    expect(features.map((f) => f.id).sort()).toEqual([
      "average-salary-by-industry",
      "employees-by-industry",
      "five-year-revenue-growth",
      "how-many-companies-pay-dividends",
      "overseas-sales-geography",
      "revenue-per-employee-by-industry",
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

  it("employees tables are the industry figures' totals, the raw-data medians and the largest employers", () => {
    const [totalTable, medianTable, companyTable] = tables("employees-by-industry");
    const byTotal = [...figures.industries].sort((a, b) => b.employees.total - a.employees.total);
    expect(totalTable!.rows).toHaveLength(byTotal.length);
    totalTable!.rows.forEach((row, k) => {
      expect(row.label).toBe(INDUSTRY_LABELS[byTotal[k]!.id].name);
      expect(row.values[0]).toBe(people(byTotal[k]!.employees.total));
      expect(row.values[1]).toBe(count(byTotal[k]!.employees.companies));
    });

    const withEmp = released
      .map((c) => ({ c, latest: latestOf(c) }))
      .filter((x): x is { c: Company; latest: FinancialRecord } => x.latest !== undefined && x.latest.employees !== null);
    const expectedMedians = figures.industries
      .map((i) => {
        const values = withEmp.filter((x) => primaryId(x.c) === i.id).map((x) => x.latest.employees!);
        return { i, m: median(values), n: values.length };
      })
      .filter((x) => x.m !== null && x.n >= 10)
      .sort((a, b) => b.m! - a.m!);
    expect(medianTable!.rows).toHaveLength(expectedMedians.length);
    medianTable!.rows.forEach((row, k) => {
      expect(row.values[0]).toBe(people(expectedMedians[k]!.m!));
      expect(row.values[1]).toBe(count(expectedMedians[k]!.n));
    });

    const top = [...withEmp].sort((a, b) => b.latest.employees! - a.latest.employees!).slice(0, 10);
    expect(companyTable!.rows).toHaveLength(top.length);
    companyTable!.rows.forEach((row, k) => {
      expect(row.href).toBe(`/companies/${top[k]!.c.id}`);
      expect(row.values[0]).toBe(people(top[k]!.latest.employees!));
      expect(row.values[1]).toBe(top[k]!.latest.fiscalYear);
    });

    // The prose's headline numbers are the same aggregates (injected, not retyped).
    const text = prose("employees-by-industry");
    expect(text).toContain(people(figures.totals.employees));
    expect(text).toContain(pct1(byTotal.slice(0, 3).reduce((acc, i) => acc + i.employees.total, 0) / figures.totals.employees));
  });

  it("dividend tables count the printed 1株当たり配当額: payers, the zero companies and the amount bands", () => {
    const [industryTable, zeroTable, bandTable] = tables("how-many-companies-pay-dividends");
    const withDiv = released.filter((c) => c.shareFacts && c.shareFacts.dividendPerShare !== null);
    const paying = withDiv.filter((c) => c.shareFacts!.dividendPerShare! > 0);

    const expectedIndustries = [...new Set(withDiv.map(primaryId).filter((v): v is IndustryId => v !== null))]
      .map((id) => {
        const cs = withDiv.filter((c) => primaryId(c) === id);
        const pay = cs.filter((c) => c.shareFacts!.dividendPerShare! > 0).length;
        return { id, n: cs.length, pay, share: pay / cs.length };
      })
      .filter((x) => x.n >= 10)
      .sort((a, b) => b.share - a.share || b.n - a.n);
    expect(industryTable!.rows).toHaveLength(expectedIndustries.length);
    industryTable!.rows.forEach((row, k) => {
      expect(row.label).toBe(INDUSTRY_LABELS[expectedIndustries[k]!.id].name);
      // JCE-111: the share comes first because the bar draws it; the bar is that share, not a figure of its own.
      expect(row.values[0]).toBe(pct1(expectedIndustries[k]!.share));
      expect(row.values[1]).toBe(count(expectedIndustries[k]!.pay));
      expect(row.values[2]).toBe(count(expectedIndustries[k]!.n));
      expect(row.bar).toBe(expectedIndustries[k]!.share);
    });

    const zero = withDiv.filter((c) => c.shareFacts!.dividendPerShare === 0).sort((a, b) => a.id.localeCompare(b.id));
    expect(zeroTable!.rows).toHaveLength(zero.length);
    zeroTable!.rows.forEach((row, k) => {
      expect(row.href).toBe(`/companies/${zero[k]!.id}`);
      expect(row.values[0]).toBe("0円");
      expect(row.values[1]).toBe(zero[k]!.shareFacts!.fiscalYear);
    });

    const bands: [(v: number) => boolean, string][] = [
      [(v) => v < 10, "10円未満"],
      [(v) => v >= 10 && v < 50, "10円以上50円未満"],
      [(v) => v >= 50 && v < 100, "50円以上100円未満"],
      [(v) => v >= 100, "100円以上"],
    ];
    expect(bandTable!.rows).toHaveLength(bands.length);
    bandTable!.rows.forEach((row, k) => {
      const n = paying.filter((c) => bands[k]![0](c.shareFacts!.dividendPerShare!)).length;
      expect(row.label).toBe(bands[k]![1]);
      expect(row.values[0]).toBe(pct1(n / paying.length));
      expect(row.values[1]).toBe(count(n));
      expect(row.bar).toBe(n / paying.length);
    });

    const text = prose("how-many-companies-pay-dividends");
    expect(text).toContain(pct1(paying.length / withDiv.length));
    expect(text).toContain(count(withDiv.length));
  });

  it("revenue-per-employee table rows are the raw-data industry medians of 最新期の売上高 ÷ 従業員数", () => {
    const [table] = tables("revenue-per-employee-by-industry");
    const withRpe = released
      .map((c) => ({ c, latest: latestOf(c) }))
      .filter(
        (x): x is { c: Company; latest: FinancialRecord } =>
          x.latest !== undefined && x.latest.revenue !== null && x.latest.employees !== null && x.latest.employees > 0,
      )
      .map((x) => ({ c: x.c, value: x.latest.revenue! / x.latest.employees! }));
    const expected = figures.industries
      .map((i) => {
        const values = withRpe.filter((x) => primaryId(x.c) === i.id).map((x) => x.value);
        return { i, m: median(values), n: values.length };
      })
      .filter((x) => x.m !== null && x.n >= 10)
      .sort((a, b) => b.m! - a.m!);
    expect(table!.rows).toHaveLength(expected.length);
    table!.rows.forEach((row, k) => {
      expect(row.label).toBe(INDUSTRY_LABELS[expected[k]!.i.id].name);
      expect(row.values[0]).toBe(manYen0(expected[k]!.m!));
      expect(row.values[1]).toBe(count(expected[k]!.n));
    });

    const text = prose("revenue-per-employee-by-industry");
    expect(text).toContain(manYen0(median(withRpe.map((x) => x.value))!));
    expect(text).toContain(manYen0(figures.reference.revenuePerEmployee!));
    expect(text).toContain(times2(expected[0]!.m! / expected.at(-1)!.m!));
  });

  it("gives every feature its card and top-of-article material (JCE-111), built from the same data", () => {
    for (const f of features) {
      expect(f.topic, f.id).toBeTruthy();
      expect(f.keyFigures?.length, f.id).toBeGreaterThanOrEqual(2);
      expect(f.keyFigures!.length, f.id).toBeLessThanOrEqual(3);
      expect(f.takeaways?.length, f.id).toBeGreaterThanOrEqual(2);
      expect(f.takeaways!.length, f.id).toBeLessThanOrEqual(3);
      // A bar draws the row's own value: present on a chart's every row or none, and never negative.
      for (const b of f.body) {
        if (b.type !== "data-table") continue;
        const withBar = b.rows.filter((r) => r.bar !== undefined);
        expect([0, b.rows.length], `${f.id}: ${b.title}`).toContain(withBar.length);
        for (const r of withBar) expect(r.bar!, `${f.id}: ${r.label}`).toBeGreaterThanOrEqual(0);
      }
      // Every table sits under a heading, so the table of contents reaches it.
      const firstTable = f.body.findIndex((b) => b.type === "data-table");
      const firstHeading = f.body.findIndex((b) => b.type === "heading");
      if (firstTable >= 0) expect(firstHeading, f.id).toBeLessThan(firstTable);
    }
    // The headline figure of the overseas feature is the median the body states.
    const overseas = features.find((f) => f.id === "overseas-sales-geography")!;
    expect(prose("overseas-sales-geography")).toContain(overseas.keyFigures![0]!.value);
  });
});

describe("feature photographs (JCE-112)", () => {
  it("are keyed by published feature ids only", async () => {
    const { FEATURE_IMAGES } = await import("@/assets/features");
    const ids = new Set(features.map((f) => f.id));
    for (const id of Object.keys(FEATURE_IMAGES)) expect(ids, id).toContain(id);
  });
});
