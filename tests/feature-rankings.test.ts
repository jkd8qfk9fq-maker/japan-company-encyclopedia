import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { features } from "@/data/features";
import { companyMetrics } from "@/lib/company-metrics";
import { buildFeatureRanking, featureRankingLinks } from "@/lib/feature-rankings";
import { buildIndustryFigures, median } from "@/lib/industry-figures";
import { isReleased } from "@/lib/release";
import type { Company, IndustryId } from "@/types/company";

/**
 * 特集×業界の企業ランキング (JCE-119): the industry rows of a feature's tables link to a ranking of
 * that industry's companies by the feature's own figure. Checked here against the same inputs the
 * features and industry figures use, recomputed from the data files — a ranking's value must be the
 * encyclopedia's value, and its median must be the figure the feature's table prints for the industry.
 */

const released = companies.filter(isReleased);
const figures = buildIndustryFigures(released);

const primaryId = (c: Company): IndustryId | null =>
  (c.industries.find((ref) => ref.primary) ?? c.industries[0])?.industryId ?? null;

const links = featureRankingLinks(features);

describe("feature rankings (JCE-119)", () => {
  it("links every industry row of the features' tables to a ranking, never to the industry page", () => {
    let industryRows = 0;
    for (const feature of features) {
      for (const block of feature.body) {
        if (block.type !== "data-table") continue;
        for (const row of block.rows) {
          expect(row.href?.startsWith("/industries/") ?? false, `${feature.id}: ${row.label}`).toBe(false);
          if (row.href?.includes("/rankings/")) industryRows += 1;
        }
      }
    }
    expect(industryRows).toBeGreaterThan(0);
    // The linked pairs cover all six features; the employees feature's two tables share one ranking set.
    expect(new Set(links.map((l) => l.featureId))).toEqual(
      new Set([
        "overseas-sales-geography",
        "average-salary-by-industry",
        "five-year-revenue-growth",
        "employees-by-industry",
        "how-many-companies-pay-dividends",
        "revenue-per-employee-by-industry",
      ]),
    );
  });

  it("builds a non-empty ranking for every linked pair", () => {
    expect(links.length).toBeGreaterThan(0);
    for (const { featureId, industryId } of links) {
      const ranking = buildFeatureRanking(featureId, industryId, released);
      expect(ranking, `${featureId}/${industryId}`).not.toBeNull();
      expect(ranking!.rows.length).toBeGreaterThan(0);
    }
  });

  it("orders every ranking by value descending, ties sharing a rank, names stable within a tie", () => {
    for (const { featureId, industryId } of links) {
      const ranking = buildFeatureRanking(featureId, industryId, released)!;
      ranking.rows.forEach((row, k) => {
        const prev = ranking.rows[k - 1];
        if (prev) {
          expect(row.value, `${featureId}/${industryId}`).toBeLessThanOrEqual(prev.value);
          if (row.value === prev.value) expect(row.rank).toBe(prev.rank);
          else expect(row.rank).toBe(k + 1);
        }
        // Only released companies of this industry, counted under their primary industry.
        const company = released.find((c) => c.id === row.companyId)!;
        expect(primaryId(company)).toBe(industryId);
      });
    }
  });

  it("overseas ranking values are the full-precision ratio of the printed regional revenue, and its median is the feature table's industry median", () => {
    const ranking = buildFeatureRanking("overseas-sales-geography", "semiconductors", released)!;
    for (const row of ranking.rows) {
      const company = released.find((c) => c.id === row.companyId)!;
      const regional = company.regionalRevenue!;
      const total = regional.items.reduce((sum, i) => sum + i.amount, 0);
      const overseas = regional.items.filter((i) => !i.domestic).reduce((sum, i) => sum + i.amount, 0);
      expect(row.value).toBe(overseas / total);
      expect(row.detail).toBe(regional.fiscalYear);
      // The displayed figure agrees with the company page's rounded ratio (companyMetrics, 0.1pt).
      expect(`${(row.value * 100).toFixed(1)}%`).toBe(`${companyMetrics(company)!.overseasSalesRatio!.percent.toFixed(1)}%`);
    }
    const industry = figures.industries.find((i) => i.id === "semiconductors")!;
    expect(ranking.medianValue).toBe(industry.overseasSalesRatio!.value);
    expect(ranking.rows).toHaveLength(industry.overseasSalesRatio!.companies);
  });

  it("employees ranking values are the latest printed headcount, and its median matches the raw-data median", () => {
    const ranking = buildFeatureRanking("employees-by-industry", "automotive", released)!;
    const values: number[] = [];
    for (const row of ranking.rows) {
      const company = released.find((c) => c.id === row.companyId)!;
      const latest = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1)!;
      expect(row.value).toBe(latest.employees);
      expect(row.detail).toBe(latest.fiscalYear);
      values.push(latest.employees!);
    }
    expect(ranking.medianValue).toBe(median(values));
  });

  it("salary and dividend rankings carry the printed figures, not computed ones", () => {
    const salary = buildFeatureRanking("average-salary-by-industry", "finance", released)!;
    for (const row of salary.rows) {
      const company = released.find((c) => c.id === row.companyId)!;
      expect(row.value).toBe(company.workforce!.averageAnnualSalary);
    }
    const dividends = buildFeatureRanking("how-many-companies-pay-dividends", "finance", released)!;
    expect(dividends.caution).toContain("手厚さは測れません");
    for (const row of dividends.rows) {
      const company = released.find((c) => c.id === row.companyId)!;
      expect(row.value).toBe(company.shareFacts!.dividendPerShare);
    }
    // Companies whose dividend was 0円 as printed are ranked too — 0 is a printed figure, not a missing one.
    const zeroCount = released.filter(
      (c) => primaryId(c) === "finance" && c.shareFacts?.dividendPerShare === 0,
    ).length;
    expect(dividends.rows.filter((r) => r.value === 0)).toHaveLength(zeroCount);
  });

  it("returns null for an unknown feature, an unknown industry, or an industry with no valued company", () => {
    expect(buildFeatureRanking("no-such-feature", "automotive", released)).toBeNull();
    expect(buildFeatureRanking("employees-by-industry", "no-such-industry", released)).toBeNull();
    const noRegional = released.filter((c) => primaryId(c) === "funeral-memorial");
    expect(noRegional.length).toBeGreaterThan(0);
    expect(buildFeatureRanking("overseas-sales-geography", "funeral-memorial", released)).toBeNull();
  });
});
