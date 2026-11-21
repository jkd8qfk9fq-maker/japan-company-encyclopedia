import { describe, expect, it } from "vitest";
import { buildDigest } from "../src/lib/digest";
import type { QuizQuestion, UpdatesData } from "../src/lib/engagement-data";
import { weekEnd, weekStart } from "../src/lib/jst-dates";
import { buildLessonQuestions, type LessonQuestion } from "../src/lib/lesson-questions";
import { buildMicroCourse } from "../src/lib/micro-lessons";
import { dueReviewIds, scheduleReview } from "../src/lib/review-queue";
import type { Company, FinancialRecord, IndustryId } from "../src/types/company";

/**
 * The micro-lesson layer (JCE-082): questions generated per company from printed figures only, a course
 * bound deterministically from the pools, a review schedule that widens and resets, and a digest that
 * splits filings by week. A figure the records do not hold — or a year too flat to ask a direction about —
 * produces no question, never an invented one.
 */

const rec = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  ({
    fiscalYear: "2026年3月期",
    periodEnd: "2026-03-31",
    revenue: 100_000_000_000,
    revenueLabel: "売上高",
    profit: 10_000_000_000,
    profitLabel: "経常利益",
    netIncome: 5_000_000_000,
    netIncomeLabel: "当期純利益",
    totalAssets: 200_000_000_000,
    totalAssetsLabel: "総資産",
    netAssets: 80_000_000_000,
    netAssetsLabel: "純資産",
    employees: 100,
    currency: "JPY",
    accountingStandard: "jgaap",
    sourceIds: ["yuho-2026"],
    ...over,
  }) as FinancialRecord;

const prev = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  rec({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 80_000_000_000, netIncome: 4_000_000_000, ...over });

const company = (id: string, financials: FinancialRecord[], industry: IndustryId = "retail"): Company =>
  ({
    id,
    name: `会社${id}`,
    industries: [{ industryId: industry, primary: true }],
    financials,
    businesses: [],
    history: [],
    relatedCompanies: [],
    sources: [{ id: "yuho-2026", title: "有価証券報告書－第1期", publisher: "会社", url: "https://example.jp", publishedAt: "2026-06-01", accessedAt: "2026-10-01" }],
  }) as unknown as Company;

describe("buildLessonQuestions", () => {
  const qs = buildLessonQuestions([company("a", [prev(), rec()])]);

  it("asks the latest printed revenue as a four-choice question, with its source", () => {
    // The previous year at half the latest figure is far enough away to be a fair distractor.
    const q = buildLessonQuestions([company("a2", [prev({ revenue: 50_000_000_000 }), rec()])]).find((x) => x.kind === "figure");
    expect(q).toBeDefined();
    expect(q!.options).toHaveLength(4);
    expect(q!.options.find((o) => o.id === q!.answer)?.label).toContain("1,000億");
    expect(q!.sourceIds).toContain("yuho-2026");
    expect(q!.sourceTitle).toContain("有価証券報告書");
    expect(q!.period).toBe("2026年3月期");
  });

  it("asks the direction of revenue and of net income as computed values", () => {
    const rev = qs.find((x) => x.kind === "growth-revenue");
    expect(rev?.answer).toBe("up"); // 800億 → 1,000億
    expect(rev?.explain).toContain("計算値");
    const profit = qs.find((x) => x.kind === "growth-profit");
    expect(profit?.answer).toBe("up"); // 40億 → 50億
    expect(rev?.period).toBe("2025年3月期 → 2026年3月期");
  });

  it("does not ask a direction about a near-flat year, nor about a loss-making one", () => {
    const flat = buildLessonQuestions([company("b", [prev({ revenue: 99_000_000_000 }), rec()])]);
    expect(flat.some((x) => x.kind === "growth-revenue")).toBe(false);
    const loss = buildLessonQuestions([company("c", [prev({ netIncome: -1_000_000_000 }), rec()])]);
    expect(loss.some((x) => x.kind === "growth-profit")).toBe(false);
  });

  it("is deterministic for the same companies", () => {
    expect(buildLessonQuestions([company("a", [prev(), rec()])])).toEqual(qs);
  });
});

const poolQ = (id: string, kind: QuizQuestion["kind"], industry: string | null = "retail"): QuizQuestion => ({
  id,
  kind,
  prompt: `問題 ${id}`,
  options: [
    { id: "x", label: "X社" },
    { id: "y", label: "Y社" },
  ],
  answer: "x",
  explain: "根拠",
  industry,
});

const lessonQ = (id: string, kind: LessonQuestion["kind"]): LessonQuestion => ({
  id,
  kind,
  companyId: "x",
  companyName: "X社",
  industry: "retail",
  prompt: `問題 ${id}`,
  options: [
    { id: "up", label: "増えた" },
    { id: "down", label: "減った" },
  ],
  answer: "up",
  explain: "根拠",
  sourceIds: ["s"],
  sourceTitle: "有価証券報告書",
  period: "2026年3月期",
});

describe("buildMicroCourse", () => {
  const pool: QuizQuestion[] = [
    poolQ("rev-1", "revenue"),
    poolQ("rev-2", "revenue"),
    poolQ("qtr-1", "quarterly"),
    poolQ("seg-1", "segment"),
    poolQ("ovs-1", "overseas"),
  ];
  const lessonPool: LessonQuestion[] = [
    lessonQ("fig-1", "figure"),
    lessonQ("fig-2", "figure"),
    lessonQ("gr-1", "growth-revenue"),
    lessonQ("gr-2", "growth-revenue"),
    lessonQ("gp-1", "growth-profit"),
  ];
  const units = buildMicroCourse(pool, lessonPool);

  it("binds the first unit's five lessons to ten questions, none used twice", () => {
    const first = units[0]!;
    expect(first.lessons).toHaveLength(5);
    const ids = first.lessons.flatMap((l) => l.questions.map((q) => q.id));
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
    for (const lesson of first.lessons) expect(lesson.questions.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps the later units as structure only", () => {
    for (const unit of units.slice(1)) {
      expect(unit.lessons).toHaveLength(0);
      expect(unit.plannedLessons.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic, and leaves a lesson shorter rather than padding it", () => {
    expect(buildMicroCourse(pool, lessonPool)).toEqual(units);
    const thin = buildMicroCourse([], []);
    expect(thin[0]!.lessons.every((l) => l.questions.length === 0)).toBe(true);
  });
});

describe("review queue", () => {
  it("brings a first correct answer back after a day, then widens", () => {
    const first = scheduleReview(undefined, true, "2026-11-21");
    expect(first).toEqual({ stage: 0, due: "2026-11-22" });
    const second = scheduleReview(first, true, "2026-11-22");
    expect(second).toEqual({ stage: 1, due: "2026-11-25" });
    const capped = scheduleReview({ stage: 3, due: "2026-11-01" }, true, "2026-11-21");
    expect(capped.stage).toBe(3);
  });

  it("brings a wrong answer back the next day, whatever its stage", () => {
    expect(scheduleReview({ stage: 2, due: "2026-12-01" }, false, "2026-11-21")).toEqual({ stage: 0, due: "2026-11-22" });
  });

  it("lists what is due, most overdue first, and nothing early", () => {
    const review = {
      a: { stage: 0, due: "2026-11-20" },
      b: { stage: 1, due: "2026-11-18" },
      c: { stage: 0, due: "2026-11-25" },
    };
    expect(dueReviewIds(review, "2026-11-21")).toEqual(["b", "a"]);
  });
});

describe("weeks and the digest", () => {
  it("bounds a week Monday to Sunday", () => {
    expect(weekStart("2026-11-21")).toBe("2026-11-16"); // a Saturday
    expect(weekEnd("2026-11-21")).toBe("2026-11-22");
    expect(weekStart("2026-11-16")).toBe("2026-11-16"); // the Monday itself
  });

  it("splits filings into this week and last week, and no further", () => {
    const updates: UpdatesData = {
      asOf: "2026-11-21",
      days: 120,
      names: { a: "A社", b: "B社", c: "C社" },
      events: [
        ["a", "tanshin", "2026-11-18", "2026年3月期 第2四半期の決算短信", "2026年3月期 第2四半期（累計）：売上 100億円、純利益 5億円"],
        ["b", "yuho", "2026-11-10", "2026年3月期の有価証券報告書"],
        ["c", "yuho", "2026-10-01", "2025年3月期の有価証券報告書"],
      ],
    };
    const digest = buildDigest(updates, "2026-11-21");
    expect(digest.thisWeek.map((e) => e.companyId)).toEqual(["a"]);
    expect(digest.lastWeek.map((e) => e.companyId)).toEqual(["b"]);
    expect(digest.thisWeek[0]!.summary).toContain("売上");
    expect(digest.thisWeek[0]!.reading.href).toContain("/learn");
  });
});
