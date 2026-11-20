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
  });

  it("skips a quarterly pair whose growth is too close to call", () => {
    const pool = buildQuizPool([quarterlyCompany("one", 105, 100), quarterlyCompany("two", 103, 100)]);
    expect(pool.filter((x) => x.kind === "quarterly")).toEqual([]);
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
});
