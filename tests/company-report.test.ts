import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { companyReport, placementOf, quantile } from "../src/lib/company-report";
import { median } from "../src/lib/industry-figures";
import type { Company, IndustryId } from "../src/types/company";

/** 企業レポート (JCE-073): printed figures, arithmetic on them labelled 計算値, and a place in the industry — no judgement. */

const years = (revenues: number[], opts: { netIncome?: number | null; profit?: number | null; profitLabel?: string | null; netAssets?: number | null; totalAssets?: number | null } = {}) =>
  revenues.map((revenue, i) => {
    const last = i === revenues.length - 1;
    return {
      fiscalYear: `${2022 + i}年3月期`,
      periodEnd: `${2022 + i}-03-31`,
      revenue,
      revenueLabel: "売上高",
      profit: last ? (opts.profit ?? null) : null,
      profitLabel: opts.profitLabel === undefined ? "経常利益" : opts.profitLabel,
      netIncome: last ? (opts.netIncome ?? null) : null,
      netIncomeLabel: "当期純利益",
      totalAssets: last ? (opts.totalAssets ?? null) : null,
      totalAssetsLabel: "総資産額",
      netAssets: last ? (opts.netAssets ?? null) : null,
      netAssetsLabel: "純資産額",
      employees: null,
      sourceIds: [`yuho-${2022 + i}`],
    };
  });

const company = (id: string, industry: IndustryId, revenues: number[], opts: Parameters<typeof years>[1] = {}, extra: Partial<Company> = {}): Company =>
  ({
    id,
    name: id,
    officialName: id,
    code: "0000",
    description: null,
    industries: [{ industryId: industry, primary: true }],
    businesses: [],
    relatedCompanies: [],
    sources: [],
    financials: years(revenues, opts),
    ...extra,
  }) as unknown as Company;

describe("quantile and placement", () => {
  it("uses the same rule as the median, so the middle quartile is the median", () => {
    for (const values of [[1], [1, 2], [3, 1, 2], [5, 1, 4, 2, 3, 9]]) expect(quantile(values, 0.5)).toBeCloseTo(median(values)!);
    expect(quantile([1, 2, 3, 4, 5], 0.25)).toBe(2);
    expect(quantile([1, 2, 3, 4, 5], 0.75)).toBe(4);
    expect(quantile([], 0.5)).toBeNull();
  });

  it("ranks the highest first, ties share the higher rank, and the share above is rounded up", () => {
    expect(placementOf(10, [10, 10, 5, 1])).toMatchObject({ rank: 1, members: 4, topPercent: 25 });
    expect(placementOf(5, [10, 10, 5, 1])).toMatchObject({ rank: 3, topPercent: 75 });
    expect(placementOf(1, [10, 10, 5, 1])).toMatchObject({ rank: 4, topPercent: 100, median: 7.5, q1: 4, q3: 10 });
  });
});

describe("companyReport", () => {
  const members = [
    company("a", "retail", [100, 100, 100, 100, 200], { netIncome: 20, profit: 30, netAssets: 50, totalAssets: 100 }),
    company("b", "retail", [100, 100, 100, 100, 150], { netIncome: 3, profit: 9, netAssets: 20, totalAssets: 100 }),
    company("c", "retail", [100, 100, 100, 100, 120], { netIncome: 12, profit: 18, netAssets: 30, totalAssets: 100 }),
    // An IFRS filer prints 税引前利益: its profit line is a different line and is not ranked with 経常利益.
    company("d", "retail", [100, 100, 100, 100, 110], { netIncome: 5, profit: 50, profitLabel: "税引前利益", netAssets: 10, totalAssets: 100 }),
    company("x", "food", [1, 1, 1, 1, 1], { netIncome: 1 }),
  ];

  it("holds five printed periods and places each computed metric among the industry", () => {
    const r = companyReport(members[2], members)!;
    expect(r.industryName).toBe("小売");
    expect(r.industryMembers).toBe(4);
    expect(r.periods).toHaveLength(5);
    const net = r.metrics.find((m) => m.key === "net-margin")!;
    // margins: a 0.10, b 0.02, c 0.10, d 0.045 → c ties a for 1st of 4
    expect(net).toMatchObject({ value: 0.1, computed: true, formula: "当期純利益 ÷ 売上高" });
    expect(net.placement).toMatchObject({ rank: 1, members: 4, topPercent: 25 });
    const revenue = r.metrics.find((m) => m.key === "revenue")!;
    expect(revenue).toMatchObject({ value: 120, computed: false, formula: "有価証券報告書の印字値" });
    expect(revenue.placement).toMatchObject({ rank: 3, members: 4 });
  });

  it("compares the profit line only with companies that print the same line", () => {
    const r = companyReport(members[2], members)!;
    const margin = r.metrics.find((m) => m.key === "profit-margin")!;
    expect(margin.label).toBe("経常利益率");
    // 経常利益 filers a 0.15, b 0.06, c 0.15 — d (税引前利益 0.45) is not among them
    expect(margin.placement).toMatchObject({ members: 3, rank: 1 });
    expect(margin.note).toContain("経常利益");
    const ifrs = companyReport(members[3], members)!.metrics.find((m) => m.key === "profit-margin")!;
    expect(ifrs.label).toBe("税引前利益率");
    expect(ifrs.placement).toBeNull();
  });

  it("gives no metric for a figure the filing does not print, and no placement without another company", () => {
    const lone = company("lone", "media", [10, 10, 10, 10, 10], { netIncome: null });
    const r = companyReport(lone, [lone, ...members])!;
    expect(r.metrics.find((m) => m.key === "net-margin")).toBeUndefined();
    expect(r.metrics.find((m) => m.key === "revenue")!.placement).toBeNull();
    expect(companyReport(company("empty", "retail", []), members)).toBeNull();
  });

  it("lists the sources of every figure it shows", () => {
    expect(companyReport(members[0], members)!.sourceIds).toEqual(["yuho-2022", "yuho-2023", "yuho-2024", "yuho-2025", "yuho-2026"]);
  });
});

describe("what the report never says (invariant 4, JCE-073)", () => {
  it("names no price, valuation, rating or advice anywhere in its code", () => {
    for (const file of ["src/lib/company-report.ts", "src/components/company/company-report.tsx"]) {
      const code = readFileSync(file, "utf8")
        // The footer states what is NOT included; that sentence is the one place these words may appear.
        .replace(/株価・時価総額・バリュエーション、信用評価や格付け、投資の推奨は含みません/g, "")
        .replace(/no rating, no score, no price or valuation/g, "");
      expect(code).not.toMatch(/PER|PBR|ROE|ROA|配当利回り|目標株価|格付け|評点|倒産|おすすめ|買い|売り推奨/);
    }
  });
});
