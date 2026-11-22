import { describe, expect, it } from "vitest";
import { buildDigest } from "../src/lib/digest";
import type { QuizQuestion, UpdatesData } from "../src/lib/engagement-data";
import { weekEnd, weekStart } from "../src/lib/jst-dates";
import { buildLessonQuestions, type LessonQuestion } from "../src/lib/lesson-questions";
import { buildMicroCourse, MICRO_LESSON_IDS } from "../src/lib/micro-lessons";
import { dueReviewIds, scheduleReview } from "../src/lib/review-queue";
import type { Company, FinancialRecord, IndustryId, InterimRecord } from "../src/types/company";

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

describe("buildLessonQuestions — the JCE-084 kinds", () => {
  it("asks for the largest business of the segment note, and not when the top two are close", () => {
    const withSegments = (topAmount: number, secondAmount: number) =>
      ({
        ...company("s", [prev(), rec()]),
        businesses: [
          { id: "b1", name: "事業1" },
          { id: "b2", name: "事業2" },
        ],
        segmentRevenue: {
          fiscalYear: "2026年3月期",
          periodEnd: "2026-03-31",
          label: "外部顧客への売上高",
          items: [
            { businessId: "b1", amount: topAmount },
            { businessId: "b2", amount: secondAmount },
          ],
          sourceIds: ["yuho-2026"],
        },
      }) as unknown as Company;
    const q = buildLessonQuestions([withSegments(60_000_000_000, 40_000_000_000)]).find((x) => x.kind === "segment-top");
    expect(q?.answer).toBe("b1");
    expect(q?.explain).toContain("計算値");
    expect(q?.explain).toContain("60%");
    expect(q?.period).toBe("2026年3月期");
    const close = buildLessonQuestions([withSegments(52_000_000_000, 48_000_000_000)]);
    expect(close.some((x) => x.kind === "segment-top")).toBe(false);
  });

  it("asks the overseas share as a computed ratio, from the regional breakdown", () => {
    const c = {
      ...company("o", [prev(), rec()]),
      regionalRevenue: {
        fiscalYear: "2026年3月期",
        periodEnd: "2026-03-31",
        label: "売上高",
        items: [
          { region: "日本", domestic: true, amount: 60_000_000_000 },
          { region: "北米", domestic: false, amount: 40_000_000_000 },
        ],
        sourceIds: ["yuho-2026"],
      },
    } as unknown as Company;
    const q = buildLessonQuestions([c]).find((x) => x.kind === "overseas-ratio");
    expect(q?.answer).toBe("p40");
    expect(q?.explain).toContain("計算値");
    expect(q?.sourceIds).toContain("yuho-2026");
  });

  it("asks revenue per employee as a computed value, and the headcount's direction with a guard", () => {
    const qs2 = buildLessonQuestions([company("e", [prev({ employees: 80 }), rec({ employees: 100 })])]);
    const per = qs2.find((x) => x.kind === "employees");
    expect(per?.options.find((o) => o.id === per.answer)?.label).toBe("10億円");
    expect(per?.explain).toContain("計算値");
    const dir = qs2.find((x) => x.kind === "growth-employees");
    expect(dir?.answer).toBe("up"); // 80人 → 100人
    const flat = buildLessonQuestions([company("e2", [prev({ employees: 100 }), rec({ employees: 101 })])]);
    expect(flat.some((x) => x.kind === "growth-employees")).toBe(false); // +1% is under the guard
  });

  it("asks the issued share count as printed", () => {
    const c = {
      ...company("h", [prev(), rec()]),
      shareFacts: { fiscalYear: "2026年3月期", asOf: "2026-03-31", dividendPerShare: 50, issuedShares: 1_000_000, sourceIds: ["yuho-2026"] },
    } as unknown as Company;
    const q = buildLessonQuestions([c]).find((x) => x.kind === "shares");
    expect(q?.options.find((o) => o.id === q.answer)?.label).toBe("1,000,000株");
    expect(q?.period).toBe("2026年3月期");
  });

  it("asks the quarter's direction predict-first, and its progress against the previous full year", () => {
    const half = (fiscalYear: string, periodEnd: string, revenue: number): InterimRecord =>
      ({
        fiscalYear,
        period: "H1",
        periodStart: periodEnd.slice(0, 4) + "-04-01",
        periodEnd,
        revenue,
        revenueLabel: "売上高",
        profit: null,
        profitLabel: null,
        netIncome: 1_000_000_000,
        netIncomeLabel: "当期純利益",
        currency: "JPY",
        accountingStandard: "jgaap",
        sourceIds: ["yuho-2026"],
      }) as InterimRecord;
    const c = {
      ...company("q", [prev(), rec()]),
      interimFinancials: [half("2026年3月期", "2025-09-30", 50_000_000_000), half("2027年3月期", "2026-09-30", 60_000_000_000)],
    } as unknown as Company;
    const qs3 = buildLessonQuestions([c]);
    const dir = qs3.find((x) => x.kind === "quarterly-direction");
    expect(dir?.answer).toBe("up"); // 中間期 500億 → 600億
    expect(dir?.prompt).toContain("予想してから確かめましょう");
    expect(dir?.explain).toContain("計算値");
    expect(dir?.period).toContain("2027年3月期");
    const progress = qs3.find((x) => x.kind === "quarterly-progress");
    expect(progress?.options.find((o) => o.id === progress.answer)?.label).toBe("約6割"); // 600億 ÷ 前年通期 1,000億
    expect(progress?.explain).toContain("途中経過");
  });

  it("does not ask a quarterly direction about a near-flat half", () => {
    const half = (fiscalYear: string, periodEnd: string, revenue: number): InterimRecord =>
      ({
        fiscalYear,
        period: "H1",
        periodStart: periodEnd.slice(0, 4) + "-04-01",
        periodEnd,
        revenue,
        revenueLabel: "売上高",
        profit: null,
        profitLabel: null,
        netIncome: 1_000_000_000,
        netIncomeLabel: "当期純利益",
        currency: "JPY",
        accountingStandard: "jgaap",
        sourceIds: ["yuho-2026"],
      }) as InterimRecord;
    const c = {
      ...company("q2", [prev(), rec()]),
      interimFinancials: [half("2026年3月期", "2025-09-30", 59_000_000_000), half("2027年3月期", "2026-09-30", 60_000_000_000)],
    } as unknown as Company;
    expect(buildLessonQuestions([c]).some((x) => x.kind === "quarterly-direction")).toBe(false); // +1.7% is under the guard
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
  sourceIds: ["s"],
  sourceTitle: "有価証券報告書",
  period: "2026年3月期",
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
    poolQ("qtr-2", "quarterly"),
    poolQ("qtr-3", "quarterly"),
    poolQ("seg-1", "segment"),
    poolQ("seg-2", "segment"),
    poolQ("ovs-1", "overseas"),
    poolQ("ovs-2", "overseas"),
    poolQ("dsc-1", "describe"),
    poolQ("dsc-2", "describe"),
  ];
  const lessonPool: LessonQuestion[] = [
    lessonQ("fig-1", "figure"),
    lessonQ("fig-2", "figure"),
    lessonQ("fig-3", "figure"),
    lessonQ("gr-1", "growth-revenue"),
    lessonQ("gr-2", "growth-revenue"),
    lessonQ("gr-3", "growth-revenue"),
    lessonQ("gp-1", "growth-profit"),
    lessonQ("gp-2", "growth-profit"),
    lessonQ("st-1", "segment-top"),
    lessonQ("or-1", "overseas-ratio"),
    lessonQ("em-1", "employees"),
    lessonQ("ge-1", "growth-employees"),
    lessonQ("sh-1", "shares"),
    lessonQ("sh-2", "shares"),
    lessonQ("qd-1", "quarterly-direction"),
    lessonQ("qd-2", "quarterly-direction"),
    lessonQ("qd-3", "quarterly-direction"),
    lessonQ("qd-4", "quarterly-direction"),
    lessonQ("qp-1", "quarterly-progress"),
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

  it("binds units two and three to five lessons each, with no question used twice in the course", () => {
    expect(units.map((u) => u.id)).toEqual(["revenue-and-profit", "reading-the-business", "quarterly-motion"]);
    for (const unit of units.slice(1)) {
      expect(unit.lessons).toHaveLength(5);
      expect(unit.plannedLessons).toHaveLength(0);
      for (const lesson of unit.lessons) expect(lesson.questions.length).toBeGreaterThanOrEqual(2);
    }
    const ids = units.flatMap((u) => u.lessons.flatMap((l) => l.questions.map((q) => q.id)));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every bound question a source and a period (JCE-085)", () => {
    // The pool is the leak: a pool question that loses its citation in fromPool reaches /lessons.json without
    // one, as eleven did in JCE-084. The type now requires the three fields on both sides of the binding.
    for (const unit of units) {
      for (const lesson of unit.lessons) {
        for (const q of lesson.questions) {
          expect(q.sourceIds.length).toBeGreaterThan(0);
          expect(q.sourceTitle.length).toBeGreaterThan(0);
          expect(q.period.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("gives every unit at least one predict-first question", () => {
    const predictFirst = new Set(["growth-revenue", "growth-profit", "growth-employees", "quarterly-direction"]);
    for (const unit of units) {
      const kinds = unit.lessons.flatMap((l) => l.questions.map((q) => q.kind));
      expect(kinds.some((k) => predictFirst.has(k))).toBe(true);
    }
  });

  it("is deterministic, and leaves a lesson shorter rather than padding it", () => {
    expect(buildMicroCourse(pool, lessonPool)).toEqual(units);
    const thin = buildMicroCourse([], []);
    expect(thin[0]!.lessons.every((l) => l.questions.length === 0)).toBe(true);
  });

  it("derives MICRO_LESSON_IDS from the same specs the course binds — all fifteen lessons, in course order", () => {
    // The static export pre-renders /learn/lesson/[lesson-id] from this list (generateStaticParams). If it
    // drifted from the specs, a lesson would silently vanish from the export — the JCE-088 deploy failure.
    expect(MICRO_LESSON_IDS).toHaveLength(15);
    expect(MICRO_LESSON_IDS).toEqual(units.flatMap((u) => u.lessons.map((l) => l.id)));
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
