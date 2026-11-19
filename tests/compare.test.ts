import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { companies as allCompanies } from "@/data/companies";
import { barShares, COMPARE_LIMITS, COMPARE_MAX, compareHref, expandReportRow, parseIds } from "@/lib/compare";
import { buildCompareIndex, buildCompareReportIndex, compareRow } from "@/lib/compare-index";
import { companyReport } from "@/lib/company-report";
import { formatMetric } from "@/lib/utils/format";
import { isReleased } from "@/lib/release";
import { companyRepository } from "@/lib/repositories";
import type { Company } from "@/types/company";

/** 見比べ (JCE-061): facts side by side, from the figures each company page already shows. */

describe("the address", () => {
  it("reads distinct well-formed ids, in order, at most COMPARE_MAX", () => {
    expect(parseIds("toyota,honda,toyota,,Bad_Id,nissan,mazda")).toEqual(["toyota", "honda", "nissan", "mazda"].slice(0, COMPARE_MAX));
    expect(parseIds(null)).toEqual([]);
    expect(parseIds("../etc,<script>")).toEqual([]);
  });
  it("round-trips through compareHref", () => {
    expect(parseIds(new URL(compareHref(["toyota", "honda"]), "https://x").searchParams.get("ids"))).toEqual(["toyota", "honda"]);
    expect(compareHref([])).toBe("/compare");
  });
  it("lets the free view line up two and the plan five (a setting, P2-1; comps of two to five, JCE-073)", () => {
    expect(COMPARE_LIMITS).toEqual({ free: 2, premium: 5 });
    expect(parseIds("a,b,c,d,e,f")).toEqual(["a", "b", "c", "d", "e"]);
  });
});

describe("barShares", () => {
  it("scales by the largest absolute value, draws a loss by its size, and no bar for a missing figure", () => {
    expect(barShares([100, -50, null])).toEqual([1, 0.5, null]);
    expect(barShares([0, 0])).toEqual([0, 0]);
    expect(barShares([null])).toEqual([null]);
  });
});

describe("compareRow", () => {
  const fin = (y: number, revenue: number | null, netIncome: number | null, sourceIds = ["y"]) => ({
    fiscalYear: `${y}年3月期`,
    periodEnd: `${y}-03-31`,
    revenue,
    revenueLabel: "売上収益",
    netIncome,
    netIncomeLabel: "親会社の所有者に帰属する当期利益",
    employees: 10,
    sourceIds,
  });
  const company = (financials: ReturnType<typeof fin>[]): Company =>
    ({
      id: "x",
      name: "X",
      industries: [{ industryId: "chemicals" }, { industryId: "automotive", primary: true }],
      businesses: [],
      sources: [{ id: "y", title: "有価証券報告書（2025年3月期）", url: "https://example.com/y.pdf" }],
      financials,
    }) as unknown as Company;
  const names = (id: string) => ({ automotive: "自動車", chemicals: "化学" })[id] ?? null;

  it("takes the latest year whatever the stored order, with the filing's labels and source", () => {
    const r = compareRow(company([fin(2025, 200, -10), fin(2021, 100, 1), fin(2022, 1, 1), fin(2023, 1, 1), fin(2024, 1, 1)]), names);
    expect(r).toMatchObject({
      industry: "自動車",
      fiscalYear: "2025年3月期",
      revenue: 200,
      revenueLabel: "売上収益",
      netIncome: -10,
      netMargin: -5,
      growth5y: 2,
      growthFrom: "2021年3月期",
      overseas: null,
      source: { title: "有価証券報告書（2025年3月期）", url: "https://example.com/y.pdf" },
    });
  });
  it("leaves out what is not printed: no growth under five years, no source that does not resolve", () => {
    const r = compareRow(company([fin(2025, null, 5, ["missing"])]), names);
    expect(r).toMatchObject({ revenue: null, netMargin: null, growth5y: null, growthFrom: null, source: null });
  });
});

describe("the published index", async () => {
  const released = await companyRepository.list();
  const index = buildCompareIndex(released, () => null, "2026-11-17");
  const byId = new Map(index.rows.map((r) => [r.id, r]));

  it("has one row per released company and none for an unreleased one", () => {
    expect(index.rows).toHaveLength(allCompanies.filter(isReleased).length);
    expect(allCompanies.filter((c) => !isReleased(c)).some((c) => byId.has(c.id))).toBe(false);
  });

  it("holds no stock-market figure (invariant 4)", () => {
    const keys = ["id", "name", "industry", "fiscalYear", "revenue", "revenueLabel", "netIncome", "netIncomeLabel", "netMargin", "growth5y", "growthFrom", "overseas", "employees", "source"].sort();
    expect(index.rows.every((r) => JSON.stringify(Object.keys(r).sort()) === JSON.stringify(keys))).toBe(true);
  });

  // The example in the PR: three automakers, each figure checked against the data file read directly.
  it.each(["toyota", "honda", "nissan"])("%s matches its data file", (id) => {
    type Raw = { financials: { periodEnd: string; fiscalYear: string; revenue: number | null; netIncome: number | null; employees: number | null; sourceIds: string[] }[]; sources: { id: string; url: string }[] };
    const raw: Raw = JSON.parse(readFileSync(`src/data/companies/${id}.json`, "utf8"));
    const years = [...raw.financials].sort((a, b) => (a.periodEnd < b.periodEnd ? -1 : 1));
    const latest = years.at(-1)!;
    const row = byId.get(id)!;
    expect(row).toBeDefined();
    expect(row.fiscalYear).toBe(latest.fiscalYear);
    expect(row.revenue).toBe(latest.revenue);
    expect(row.netIncome).toBe(latest.netIncome);
    expect(row.employees).toBe(latest.employees);
    expect(row.netMargin).toBe(Math.round((latest.netIncome! / latest.revenue!) * 1000) / 10);
    expect(row.growth5y).toBe(Math.round((latest.revenue! / years[0]!.revenue!) * 100) / 100);
    expect(row.source?.url).toBe(raw.sources.find((s) => s.id === latest.sourceIds[0])!.url);
  });
});

describe("業界の中での位置 for the comps table (JCE-073)", async () => {
  const released = await companyRepository.list();
  const index = buildCompareReportIndex(released, "2026-11-19");

  // The table and the 企業レポート must never disagree: every company's row, expanded from the compact file, prints
  // exactly what its report prints — value, median, quartiles, rank and share, wording and note.
  it("prints for every released company exactly what its 企業レポート prints", () => {
    const printed = (m: { label: string; formula: string; computed: boolean; unit: Parameters<typeof formatMetric>[0]; value: number; note?: string; placement: { members: number; median: number; q1: number; q3: number; rank: number; topPercent: number } | null }) => [
      m.label,
      m.formula,
      m.computed,
      m.note ?? "",
      formatMetric(m.unit, m.value),
      m.placement ? [m.placement.members, m.placement.rank, m.placement.topPercent, ...[m.placement.median, m.placement.q1, m.placement.q3].map((v) => formatMetric(m.unit, v))] : null,
    ];
    let checked = 0;
    for (const company of released) {
      const report = companyReport(company, released);
      const row = expandReportRow(index, company.id);
      if (!report) {
        expect(row).toBeNull();
        continue;
      }
      expect(row, company.id).not.toBeNull();
      expect(row!.fiscalYear).toBe(report.periods.at(-1)!.fiscalYear);
      expect([row!.industry, row!.industryMembers, row!.comparableMembers]).toEqual([report.industryName, report.industryMembers, report.comparableMembers]);
      expect(row!.metrics.map(printed), company.id).toEqual(report.metrics.map(printed));
      checked += row!.metrics.length;
    }
    expect(checked).toBeGreaterThan(released.length * 5);
  }, 120_000);

  it("is written compactly: industry distributions once, and only the wording that differs", () => {
    expect(index.distributions.length).toBeLessThan(Object.keys(index.rows).length / 4);
    expect(JSON.stringify(index).length).toBeLessThan(3_000_000);
    expect(Object.keys(index.definitions).sort()).toEqual(["average-salary", "equity-ratio", "net-margin", "overseas-ratio", "profit-margin", "revenue", "revenue-growth-5y", "revenue-per-employee"]);
  });

  it("holds no stock-market figure (invariant 4)", () => {
    expect(JSON.stringify(index)).not.toMatch(/PER|PBR|ROE|ROA|株価|時価総額|配当利回り|格付け|評点/);
  });

  it("gives no row for an unknown id, and refuses a row whose distribution is missing", () => {
    expect(expandReportRow(index, "no-such-company")).toBeNull();
    const id = Object.keys(index.rows)[0]!;
    const broken = { ...index, distributions: [] };
    if (index.rows[id]!.metrics.some((m) => m.distribution !== undefined)) expect(expandReportRow(broken, id)).toBeNull();
  });
});
