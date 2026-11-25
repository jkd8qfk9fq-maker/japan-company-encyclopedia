import { describe, expect, it } from "vitest";
import { buildQuizPool, type QuizQuestion } from "../src/lib/engagement-data";
import { buildCourseSteps, COURSE_SIZE, LEARN_THEMES } from "../src/lib/learn-course";
import { companyRepository } from "../src/lib/repositories";
import type { Company } from "../src/types/company";

/**
 * JCE-072: the course is an arrangement of the quiz pool and nothing else — twelve steps in the order a filing is
 * read, chosen deterministically from each question's kind and industry, each ending in the company-page section
 * the question came from.
 */

const q = (id: string, kind: QuizQuestion["kind"], industry: string | null): QuizQuestion => ({
  id,
  kind,
  prompt: id,
  options: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
  answer: "a",
  explain: id,
  industry,
  sourceIds: ["yuho-2026"],
  sourceTitle: "有価証券報告書－第1期",
  period: "2026年3月期",
});

/** A pool rich in every kind: 6 per kind, spread over 6 industries. */
const richPool = (): QuizQuestion[] =>
  LEARN_THEMES.flatMap((t) => [1, 2, 3, 4, 5, 6].map((i) => q(`${t.kind}-${i}`, t.kind, `ind-${i}`)));

describe("buildCourseSteps", () => {
  it("arranges twelve steps in theme order, from the pool alone", () => {
    const pool = richPool();
    const steps = buildCourseSteps(pool);
    expect(steps).toHaveLength(COURSE_SIZE);
    expect(steps.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(steps.map((s) => s.theme)).toEqual([
      "事業の姿", "事業の姿", "事業の姿",
      "5期の数字", "5期の数字", "5期の数字",
      "事業別の売上", "事業別の売上",
      "海外の売上", "海外の売上",
      "四半期の動き", "四半期の動き",
    ]);
    const poolIds = new Set(pool.map((x) => x.id));
    expect(steps.every((s) => poolIds.has(s.question.id))).toBe(true);
    expect(new Set(steps.map((s) => s.question.id)).size).toBe(COURSE_SIZE);
  });

  it("is deterministic: the same pool yields the same course", () => {
    const pool = richPool();
    expect(buildCourseSteps(pool)).toEqual(buildCourseSteps(pool));
    expect(buildCourseSteps([...pool].reverse())).toEqual(buildCourseSteps([...pool].reverse()));
  });

  it("prefers an industry the theme has not used yet", () => {
    const pool = [
      q("describe-1", "describe", "ind-1"),
      q("describe-2", "describe", "ind-1"),
      q("describe-3", "describe", "ind-2"),
      q("describe-4", "describe", "ind-3"),
    ];
    const steps = buildCourseSteps(pool);
    // The theme's three steps walk across industries first; the leftover question follows when the short course
    // is topped up from what the pool has.
    expect(steps.map((s) => s.question.id)).toEqual(["describe-1", "describe-3", "describe-4", "describe-2"]);
  });

  it("hands a short theme's steps round the others, and stops at the pool's end", () => {
    const pool = richPool().filter((x) => x.kind !== "quarterly");
    const steps = buildCourseSteps(pool);
    expect(steps).toHaveLength(COURSE_SIZE);
    expect(steps.some((s) => s.kind === "quarterly")).toBe(false);
    expect(buildCourseSteps(pool.slice(0, 5))).toHaveLength(5);
    expect(buildCourseSteps([])).toEqual([]);
  });

  it("ends each step in the section its question came from", () => {
    const steps = buildCourseSteps(richPool());
    for (const s of steps) expect(s.section).toBe(s.kind === "describe" ? "business" : "financials");
  });
});

// ---------------------------------------------------------------------------------------------------------------
// The two pool kinds the course adds (JCE-072): generated from printed figures like the rest of the pool.

const company = (over: Record<string, unknown>): Company =>
  ({
    name: "サンプル",
    officialName: null,
    shortNameEn: null,
    nameEn: null,
    description: "",
    industries: [{ industryId: "food", primary: true }],
    businesses: [],
    financials: [],
    sources: [],
    ...over,
  }) as unknown as Company;

const segmentCompany = (id: string, top: number, rest: number) =>
  company({
    id,
    name: id,
    sources: [{ id: "s1", title: "有価証券報告書－第1期", publisher: "会社", url: "https://example.jp", publishedAt: "2026-06-01", accessedAt: "2026-10-01" }],
    businesses: [
      { id: "b1", name: "主力事業" },
      { id: "b2", name: "副次事業" },
    ],
    segmentRevenue: {
      fiscalYear: "2026年3月期",
      periodEnd: "2026-03-31",
      label: "外部顧客への売上高",
      sourceIds: ["s1"],
      items: [
        { businessId: "b1", amount: top },
        { businessId: "b2", amount: rest },
      ],
    },
  });

const quarter = (fiscalYearEnd: string, revenue: number) => ({
  fiscalYearEnd,
  fiscalYear: `${fiscalYearEnd.slice(0, 4)}年3月期`,
  quarter: 1,
  revenue,
  operatingIncome: null,
  netIncome: null,
  accountingStandard: "jgaap",
  consolidated: true,
  disclosedAt: "2026-08-04",
  sourceIds: ["tanshin"],
});

const quarterlyCompany = (id: string, now: number, before: number) =>
  company({
    id,
    name: id,
    sources: [{ id: "tanshin", title: "決算短信", publisher: "会社", url: "https://example.jp", publishedAt: "2026-08-04", accessedAt: "2026-10-01" }],
    quarterlyEarnings: [quarter("2027-03-31", now), quarter("2026-03-31", before)],
  });

describe("buildQuizPool — segment and quarterly questions", () => {
  it("asks which company's largest business takes the bigger share, from the segment note", () => {
    const pool = buildQuizPool([segmentCompany("concentrated", 80, 20), segmentCompany("spread", 55, 45)]);
    const found = pool.filter((x) => x.kind === "segment");
    expect(found).toHaveLength(1);
    expect(found[0]!.answer).toBe("concentrated");
    expect(found[0]!.explain).toContain("80%");
    expect(found[0]!.explain).toContain("計算値");
    expect(found[0]!.options.map((o) => o.id).sort()).toEqual(["concentrated", "spread"]);
    expect(found[0]!.sourceIds).toEqual(["s1"]);
    expect(found[0]!.sourceTitle).toContain("有価証券報告書");
    expect(found[0]!.period).toBe("2026年3月期");
  });

  it("skips a segment pair whose shares are too close to call", () => {
    const pool = buildQuizPool([segmentCompany("one", 60, 40), segmentCompany("two", 55, 45)]);
    expect(pool.filter((x) => x.kind === "segment")).toEqual([]);
  });

  it("asks which company's newest quarter grew more than the same period a year earlier", () => {
    const pool = buildQuizPool([quarterlyCompany("growing", 120, 100), quarterlyCompany("shrinking", 90, 100)]);
    const found = pool.filter((x) => x.kind === "quarterly");
    expect(found).toHaveLength(1);
    expect(found[0]!.answer).toBe("growing");
    expect(found[0]!.explain).toContain("+20%");
    expect(found[0]!.explain).toContain("-10%");
    expect(found[0]!.explain).toContain("計算値");
    expect(found[0]!.sourceIds).toEqual(["tanshin"]);
    expect(found[0]!.sourceTitle).toBe("決算短信");
    expect(found[0]!.period).toContain("2027年3月期");
  });

  it("skips a quarterly pair whose growth is too close to call", () => {
    const pool = buildQuizPool([quarterlyCompany("one", 105, 100), quarterlyCompany("two", 103, 100)]);
    expect(pool.filter((x) => x.kind === "quarterly")).toEqual([]);
  });
});

const a1Record = (fiscalYear: string, periodEnd: string, revenue: number, profit: number) => ({
  fiscalYear,
  periodEnd,
  revenue,
  revenueLabel: "売上高",
  profit,
  profitLabel: "経常利益",
  netIncome: Math.round(profit / 2),
  netIncomeLabel: "当期純利益",
  totalAssets: 900_000_000_000,
  netAssets: 500_000_000_000,
  employees: 1000,
  currency: "JPY",
  accountingStandard: "jgaap",
  sourceIds: ["y"],
});
const decomposeCompany = (id: string, profitNow: number) =>
  company({
    id,
    name: id,
    sources: [{ id: "y", title: "有価証券報告書－第2期", publisher: "会社", url: "https://example.jp", publishedAt: "2026-06-01", accessedAt: "2026-10-01" }],
    financials: [a1Record("2025年3月期", "2025-03-31", 100_000_000_000, 10_000_000_000), a1Record("2026年3月期", "2026-03-31", 102_000_000_000, profitNow)],
  });

describe("buildQuizPool — the meaning layer's reading question (JCE-110)", () => {
  it("asks which part moved the profit, with the 「この会社の今」 sentence as the answer", () => {
    // Revenue +2%, profit 10 → 6: almost all of the fall is the margin.
    const found = buildQuizPool([decomposeCompany("squeezed", 6_000_000_000)]).filter((x) => x.kind === "decompose");
    expect(found).toHaveLength(1);
    expect(found[0]!.prompt).toBe("squeezedの経常利益は前期から減りました。この増減に大きく効いたのは？");
    expect(found[0]!.answer).toBe("a1-margin-effect");
    expect(found[0]!.explain).toMatch(/^経常利益の増減 −40億円 のうち、売上の増減による分は \+1億5,882万円、利益率の変化による分は −42億円。/);
    expect(found[0]!.links).toEqual([{ href: "/companies/squeezed/report", label: "squeezedの分析（この会社の今）を見る" }]);
    expect(found[0]!.period).toBe("2026年3月期");
  });

  it("asks nothing when the two parts are too close to call", () => {
    // Revenue +20% and margin up a little: the two effects are of similar size.
    const c = company({
      id: "even",
      name: "even",
      sources: [{ id: "y", title: "有価証券報告書", publisher: "会社", url: "https://example.jp", publishedAt: "2026-06-01", accessedAt: "2026-10-01" }],
      financials: [a1Record("2025年3月期", "2025-03-31", 100_000_000_000, 10_000_000_000), a1Record("2026年3月期", "2026-03-31", 120_000_000_000, 14_400_000_000)],
    });
    expect(buildQuizPool([c]).filter((x) => x.kind === "decompose")).toEqual([]);
  });
});

describe("the course on the real entries", () => {
  it("fills all twelve steps, with every theme present", async () => {
    const pool = buildQuizPool(await companyRepository.list());
    const steps = buildCourseSteps(pool);
    expect(steps).toHaveLength(COURSE_SIZE);
    expect(new Set(steps.map((s) => s.kind))).toEqual(new Set(LEARN_THEMES.map((t) => t.kind)));
    const poolIds = new Set(pool.map((x) => x.id));
    expect(steps.every((s) => poolIds.has(s.question.id))).toBe(true);
  }, 180_000);

  it("gives every pool question a source and a period, on the real entries", async () => {
    const pool = buildQuizPool(await companyRepository.list());
    expect(pool.length).toBeGreaterThan(0);
    for (const q of pool) {
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceTitle.length).toBeGreaterThan(0);
      expect(q.period.length).toBeGreaterThan(0);
    }
    // The two describe questions that shipped without a source in JCE-084: both are now attributed to the filing
    // the business structure cites.
    const pole = pool.find((x) => x.id === "describe-pole-to-win-holdings");
    expect(pole?.sourceIds).toEqual(["yuho-2026"]);
    expect(pole?.sourceTitle).toContain("有価証券報告書－第17期");
    expect(pole?.period).toBe("2026年1月期");
    const agora = pool.find((x) => x.id === "describe-agora-hospitality-group");
    expect(agora?.sourceIds).toEqual(["yuho-2025"]);
    expect(agora?.sourceTitle).toContain("有価証券報告書－第88期");
    expect(agora?.period).toBe("2025年12月期");
  }, 180_000);
});

// ---------------------------------------------------------------------------------------------------------------
// JCE-085: every pool question carries its source and period, so a lesson can always show its citation.

const fin = (revenue: number, fiscalYear = "2026年3月期", periodEnd = "2026-03-31") => ({
  fiscalYear,
  periodEnd,
  revenue,
  revenueLabel: "売上高",
  profit: null,
  profitLabel: null,
  netIncome: 5_000_000_000,
  netIncomeLabel: "当期純利益",
  totalAssets: null,
  totalAssetsLabel: null,
  netAssets: null,
  netAssetsLabel: null,
  employees: null,
  currency: "JPY",
  accountingStandard: "jgaap",
  sourceIds: ["yuho-2026"],
});

const citedCompany = (id: string, over: Record<string, unknown> = {}) =>
  company({
    id,
    name: id,
    financials: [fin(100_000_000_000)],
    sources: [{ id: "yuho-2026", title: "有価証券報告書－第1期", publisher: "会社", url: "https://example.jp", publishedAt: "2026-06-01", accessedAt: "2026-10-01" }],
    ...over,
  });

const describedCompany = (id: string, over: Record<string, unknown> = {}) =>
  citedCompany(id, {
    description: "ゲームデバッグやソフトウェアテストなど、サービスの開発・運用の各工程を支援するソリューションを提供する持株会社です。",
    businesses: [{ id: "b1", name: "サービス事業", description: "事業", sourceIds: ["yuho-2026"] }],
    ...over,
  });

describe("buildQuizPool — JCE-085: a source and a period on every question", () => {
  it("cites both companies and both years on a revenue comparison", () => {
    const pool = buildQuizPool([
      citedCompany("big", { financials: [fin(1_000_000_000_000)] }),
      citedCompany("small", { financials: [fin(100_000_000_000, "2025年12月期", "2025-12-31")] }),
    ]);
    const found = pool.filter((x) => x.kind === "revenue");
    expect(found).toHaveLength(1);
    expect(found[0]!.answer).toBe("big");
    expect(found[0]!.sourceIds).toEqual(expect.arrayContaining(["yuho-2026"]));
    expect(found[0]!.sourceTitle).toContain("有価証券報告書");
    expect(found[0]!.period).toBe("2026年3月期／2025年12月期");
  });

  it("attributes a description question to the filing the business structure cites", () => {
    const pool = buildQuizPool([describedCompany("target"), citedCompany("other1"), citedCompany("other2"), citedCompany("other3")]);
    const found = pool.filter((x) => x.kind === "describe");
    expect(found).toHaveLength(1);
    expect(found[0]!.answer).toBe("target");
    expect(found[0]!.sourceIds).toEqual(["yuho-2026"]);
    expect(found[0]!.sourceTitle).toContain("有価証券報告書");
    expect(found[0]!.period).toBe("2026年3月期");
    expect(found[0]!.explain).toContain("2026年3月期");
    expect(found[0]!.explain).not.toContain("日本企業百科事典の解説から");
  });

  it("asks no describe question when the description's basis cannot be named", () => {
    const noBusiness = describedCompany("target-a", { businesses: [] });
    const staleBusiness = describedCompany("target-b", {
      businesses: [{ id: "b1", name: "サービス事業", description: "事業", sourceIds: ["yuho-2020"] }],
    });
    const pool = buildQuizPool([noBusiness, staleBusiness, citedCompany("o1"), citedCompany("o2"), citedCompany("o3")]);
    expect(pool.filter((x) => x.kind === "describe")).toEqual([]);
  });
});
