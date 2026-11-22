import { describe, expect, it } from "vitest";
import { buildDigest } from "../src/lib/digest";
import type { QuizQuestion, UpdatesData } from "../src/lib/engagement-data";
import { weekEnd, weekStart } from "../src/lib/jst-dates";
import { buildLessonQuestions, type LessonQuestion } from "../src/lib/lesson-questions";
import { buildMicroCourse, MICRO_LESSON_IDS } from "../src/lib/micro-lessons";
import { dueReviewIds, scheduleReview } from "../src/lib/review-queue";
import type { Company, FinancialRecord, IndustryId, InterimRecord } from "../src/types/company";

/**
 * The micro-lesson layer (JCE-082, course rebuilt in JCE-090): questions generated per company from
 * printed figures only — asking for a reading, never for a value — a course bound deterministically
 * from the pools and the authored structure questions, a review schedule that widens and resets, and a
 * digest that splits filings by week. A figure the records do not hold — or a year too flat to ask a
 * direction about, or a company no clue can be built for — produces no question, never an invented one.
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

const prev2 = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  rec({ fiscalYear: "2024年3月期", periodEnd: "2024-03-31", revenue: 64_000_000_000, netIncome: 3_200_000_000, employees: 80, ...over });

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

describe("buildLessonQuestions — directions, always with a clue (JCE-090)", () => {
  const qs = buildLessonQuestions([company("a", [prev2(), prev(), rec()])]);

  it("asks the direction of revenue and of net income as computed values, with a clue to read first", () => {
    const rev = qs.find((x) => x.kind === "growth-revenue");
    expect(rev?.answer).toBe("up"); // 800億 → 1,000億
    expect(rev?.explain).toContain("計算値");
    expect(rev?.clue).toContain("手がかり");
    expect(rev?.clue).toContain("計算値"); // the prior year's move, from the two printed figures before the pair
    const profit = qs.find((x) => x.kind === "growth-profit");
    expect(profit?.answer).toBe("up"); // 40億 → 50億
    expect(profit?.clue).toBeDefined();
    expect(rev?.period).toBe("2025年3月期 → 2026年3月期");
  });

  it("builds the clue from the business mix when the segment note has a clear largest business", () => {
    const c = {
      ...company("seg", [prev(), rec()]),
      businesses: [
        { id: "b1", name: "事業1" },
        { id: "b2", name: "事業2" },
      ],
      segmentRevenue: {
        fiscalYear: "2026年3月期",
        periodEnd: "2026-03-31",
        label: "外部顧客への売上高",
        items: [
          { businessId: "b1", amount: 70_000_000_000 },
          { businessId: "b2", amount: 30_000_000_000 },
        ],
        sourceIds: ["yuho-2026"],
      },
    } as unknown as Company;
    const rev = buildLessonQuestions([c]).find((x) => x.kind === "growth-revenue");
    expect(rev?.clue).toContain("最大の事業は「事業1」");
    expect(rev?.clue).toContain("70%");
  });

  it("asks no direction when no clue can be built — two records and no segment note is a coin toss", () => {
    const two = buildLessonQuestions([company("nc", [prev(), rec()])]);
    expect(two.some((x) => x.kind === "growth-revenue")).toBe(false);
    expect(two.some((x) => x.kind === "growth-profit")).toBe(false);
  });

  it("does not ask a direction about a near-flat year, nor about a loss-making one", () => {
    const flat = buildLessonQuestions([company("b", [prev2(), prev({ revenue: 99_000_000_000 }), rec()])]);
    expect(flat.some((x) => x.kind === "growth-revenue")).toBe(false);
    const loss = buildLessonQuestions([company("c", [prev2(), prev({ netIncome: -1_000_000_000 }), rec()])]);
    expect(loss.some((x) => x.kind === "growth-profit")).toBe(false);
  });

  it("asks the headcount's direction with the same clue rule and guard", () => {
    const qs2 = buildLessonQuestions([company("e", [prev2({ employees: 64 }), prev({ employees: 80 }), rec({ employees: 100 })])]);
    const dir = qs2.find((x) => x.kind === "growth-employees");
    expect(dir?.answer).toBe("up"); // 80人 → 100人
    expect(dir?.clue).toBeDefined();
    const flat = buildLessonQuestions([company("e2", [prev2({ employees: 99 }), prev({ employees: 100 }), rec({ employees: 101 })])]);
    expect(flat.some((x) => x.kind === "growth-employees")).toBe(false); // +1% is under the guard
  });

  it("never asks for a value: the retired kinds are not generated", () => {
    const kinds = new Set(qs.map((x) => x.kind as string));
    for (const retired of ["figure", "shares", "employees", "overseas-ratio", "quarterly-progress"]) expect(kinds.has(retired)).toBe(false);
  });

  it("is deterministic for the same companies", () => {
    expect(buildLessonQuestions([company("a", [prev2(), prev(), rec()])])).toEqual(qs);
  });
});

describe("buildLessonQuestions — the JCE-090 readings", () => {
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

  it("asks which row of the company's own table a stage is — the answer is a row, never a value", () => {
    const q = buildLessonQuestions([company("fr", [prev(), rec()])]).find((x) => x.kind === "find-row");
    expect(q).toBeDefined();
    expect(q!.table).toBeDefined();
    expect(q!.table!.rows.flat().join(" ")).toContain("1,000億"); // the printed figures ride along in the excerpt
    expect(q!.options.map((o) => o.id)).toContain(q!.answer);
    expect(["revenue", "profit", "net", "assets", "liabilities", "net-assets"]).toContain(q!.answer);
    expect(q!.sourceIds).toContain("yuho-2026");
    expect(q!.period).toBe("2026年3月期");
  });

  it("asks which stage decided the last line's move, when the stages diverged", () => {
    // Middle line +12.5%, last line +100%: the gap opened below the middle line.
    const after = buildLessonQuestions([
      company("ra", [prev({ profit: 8_000_000_000, netIncome: 4_000_000_000 }), rec({ profit: 9_000_000_000, netIncome: 8_000_000_000 })]),
    ]).find((x) => x.kind === "relation-stages");
    expect(after?.answer).toBe("after-middle");
    expect(after?.table).toBeDefined();
    expect(after?.explain).toContain("計算値");
    // Revenue +50%, middle line +10%, last line tracking the middle: the gap opened above the middle line.
    const toMiddle = buildLessonQuestions([
      company("rb", [prev({ revenue: 80_000_000_000, profit: 10_000_000_000, netIncome: 5_000_000_000 }), rec({ revenue: 120_000_000_000, profit: 11_000_000_000, netIncome: 5_500_000_000 })]),
    ]).find((x) => x.kind === "relation-stages");
    expect(toMiddle?.answer).toBe("to-middle");
    // Stages moving together ask nothing: revenue, the middle line and the last line all +25%.
    const together = buildLessonQuestions([company("rc", [prev2({ profit: 8_000_000_000 }), prev({ profit: 10_000_000_000 }), rec({ profit: 12_500_000_000 })])]);
    expect(together.some((x) => x.kind === "relation-stages")).toBe(false);
  });

  it("reads the company's own labels: the yardstick from the middle line, the owner from the last line", () => {
    const standard = buildLessonQuestions([company("ls", [prev(), rec({ netIncomeLabel: "純利益" })])]).find((x) => x.kind === "label-reading");
    expect(standard?.answer).toBe("jgaap"); // 経常利益 is printed, and the record's standard is jgaap
    const owner = buildLessonQuestions([company("lo", [prev(), rec({ profitLabel: null, profit: null, netIncomeLabel: "親会社株主に帰属する当期純利益" })])]).find(
      (x) => x.kind === "label-reading",
    );
    expect(owner?.answer).toBe("parent");
    // A label and a standard that disagree ask nothing.
    const disagree = buildLessonQuestions([company("ld", [prev(), rec({ accountingStandard: "ifrs" as FinancialRecord["accountingStandard"], netIncomeLabel: "純利益" })])]);
    expect(disagree.some((x) => x.kind === "label-reading" && x.id.startsWith("label-standard"))).toBe(false);
  });

  it("asks what piled up in net assets, against the printed profit", () => {
    const q = buildLessonQuestions([company("na", [prev({ netAssets: 75_000_000_000 }), rec({ netAssets: 80_000_000_000, netIncome: 5_000_000_000 })])]).find(
      (x) => x.kind === "relation-net-assets",
    );
    expect(q?.answer).toBe("about"); // +50億 of net assets against 50億 of profit
    expect(q?.table).toBeDefined();
    expect(q?.explain).toContain("計算値");
    const less = buildLessonQuestions([company("na2", [prev({ netAssets: 79_000_000_000 }), rec({ netAssets: 80_000_000_000, netIncome: 5_000_000_000 })])]).find(
      (x) => x.kind === "relation-net-assets",
    );
    expect(less?.answer).toBe("less"); // +10億 against 50億 of profit
  });

  it("asks which amounts feed the overseas ratio, on the regional table as printed", () => {
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
    const q = buildLessonQuestions([c]).find((x) => x.kind === "region-find");
    expect(q?.answer).toBe("non-domestic");
    expect(q?.table?.rows.map((r) => r[0])).toEqual(["日本", "北米"]);
    expect(q?.explain).toContain("計算値");
    expect(q?.sourceIds).toContain("yuho-2026");
  });

  it("asks the quarter's direction predict-first, with a clue, and not about a near-flat half", () => {
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
    const withSegments = (id: string, halves: InterimRecord[]) =>
      ({
        ...company(id, [prev(), rec()]),
        businesses: [
          { id: "b1", name: "事業1" },
          { id: "b2", name: "事業2" },
        ],
        segmentRevenue: {
          fiscalYear: "2026年3月期",
          periodEnd: "2026-03-31",
          label: "外部顧客への売上高",
          items: [
            { businessId: "b1", amount: 70_000_000_000 },
            { businessId: "b2", amount: 30_000_000_000 },
          ],
          sourceIds: ["yuho-2026"],
        },
        interimFinancials: halves,
      }) as unknown as Company;
    const dir = buildLessonQuestions([withSegments("q", [half("2026年3月期", "2025-09-30", 50_000_000_000), half("2027年3月期", "2026-09-30", 60_000_000_000)])]).find(
      (x) => x.kind === "quarterly-direction",
    );
    expect(dir?.answer).toBe("up"); // 中間期 500億 → 600億
    expect(dir?.prompt).toContain("手がかりを読んでから");
    expect(dir?.clue).toContain("最大の事業は「事業1」");
    expect(dir?.explain).toContain("計算値");
    expect(dir?.period).toContain("2027年3月期");
    const flat = buildLessonQuestions([withSegments("q2", [half("2026年3月期", "2025-09-30", 59_000_000_000), half("2027年3月期", "2026-09-30", 60_000_000_000)])]);
    expect(flat.some((x) => x.kind === "quarterly-direction")).toBe(false); // +1.7% is under the guard
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

const PREDICT_KINDS: LessonQuestion["kind"][] = ["growth-revenue", "growth-profit", "growth-employees", "quarterly-direction"];

const lessonQ = (id: string, kind: LessonQuestion["kind"]): LessonQuestion => ({
  id,
  kind,
  companyId: "x",
  companyName: "X社",
  industry: "retail",
  // The generator never emits a direction question without a clue (JCE-090); the fake pool honours the same contract.
  ...(PREDICT_KINDS.includes(kind) ? { clue: "手がかり：テスト用の手がかり（計算値）。" } : {}),
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

describe("buildMicroCourse — the JCE-090 course", () => {
  const pool: QuizQuestion[] = [poolQ("dsc-1", "describe"), poolQ("dsc-2", "describe")];
  const lessonPool: LessonQuestion[] = [
    ...[1, 2, 3, 4, 5].map((n) => lessonQ(`fr-${n}`, "find-row")),
    ...[1, 2, 3, 4, 5].map((n) => lessonQ(`rs-${n}`, "relation-stages")),
    ...[1, 2, 3].map((n) => lessonQ(`lr-${n}`, "label-reading")),
    lessonQ("st-1", "segment-top"),
    lessonQ("ge-1", "growth-employees"),
    lessonQ("rna-1", "relation-net-assets"),
    lessonQ("rf-1", "region-find"),
    lessonQ("qd-1", "quarterly-direction"),
    lessonQ("gr-1", "growth-revenue"),
    lessonQ("gp-1", "growth-profit"),
  ];
  const units = buildMicroCourse(pool, lessonPool);
  const allQuestions = units.flatMap((u) => u.lessons.flatMap((l) => l.questions));

  it("binds six units of 27 lessons, in the order the stumbling points are resolved", () => {
    expect(units.map((u) => u.id)).toEqual(["five-profits", "why-net-moves", "consolidated-yardstick", "balance-sheet-photo", "two-statements-linked", "reading-the-real-thing"]);
    expect(units.map((u) => u.lessons.length)).toEqual([5, 4, 4, 5, 5, 4]);
    for (const unit of units) expect(unit.plannedLessons).toHaveLength(0);
  });

  it("gives every lesson at least two questions, and uses no question twice", () => {
    for (const unit of units) for (const lesson of unit.lessons) expect(lesson.questions.length).toBeGreaterThanOrEqual(2);
    const ids = allQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps the citations honest on both sides of the rebuild (JCE-085, JCE-090)", () => {
    for (const q of allQuestions) {
      expect(q.sourceTitle.length).toBeGreaterThan(0);
      if (q.companyId !== null) {
        // A question about a company carries the filing's citation and the figures' period.
        expect(q.sourceIds.length).toBeGreaterThan(0);
        expect(q.period.length).toBeGreaterThan(0);
      } else {
        // An authored structure question states no company fact: no company, no records, no period —
        // its citation is the general basis in sourceTitle.
        expect(q.sourceIds).toHaveLength(0);
        expect(q.period).toBe("");
      }
    }
  });

  it("binds the kept questions and none of the retired ones", () => {
    const kinds = allQuestions.map((q) => q.kind);
    expect(kinds.filter((k) => k === "segment-top")).toHaveLength(1); // the one structure-reading question of the old course, kept
    expect(kinds.filter((k) => k === "describe")).toHaveLength(2); // kept, as the finale's business-reading material
    for (const retired of ["figure", "shares", "employees", "overseas-ratio", "quarterly-progress", "revenue", "segment", "overseas", "quarterly"]) {
      expect(kinds).not.toContain(retired);
    }
  });

  it("gives the ordering questions the order format, with the answer as the arranged ids", () => {
    const orders = allQuestions.filter((q) => q.format === "order");
    expect(orders.map((q) => q.id).sort()).toEqual(["order-bs-sections", "order-pl-stages", "order-tax-steps"]);
    for (const q of orders) {
      expect(q.answer.split(",").sort()).toEqual(q.options.map((o) => o.id).sort());
    }
  });

  it("concentrates the predict-first questions where a clue exists — the consolidated unit and the finale", () => {
    const predictFirst = new Set(["growth-revenue", "growth-profit", "growth-employees", "quarterly-direction"]);
    const byUnit = units.map((u) => u.lessons.flatMap((l) => l.questions.map((q) => q.kind)));
    expect(byUnit[2]!.some((k) => predictFirst.has(k))).toBe(true);
    expect(byUnit[5]!.some((k) => predictFirst.has(k))).toBe(true);
    // Every bound direction question carries its clue through the binding.
    for (const q of allQuestions) if (predictFirst.has(q.kind)) expect(q.clue).toBeDefined();
  });

  it("is deterministic, and leaves a generated slot empty rather than padding it", () => {
    expect(buildMicroCourse(pool, lessonPool)).toEqual(units);
    const thin = buildMicroCourse([], []);
    // The authored structure questions bind without any pool; the balance-sheet unit's later lessons are
    // all authored, while its first lesson's generated slot stays empty.
    expect(thin[3]!.lessons.slice(1).every((l) => l.questions.length === 2)).toBe(true);
    expect(thin[3]!.lessons[0]!.questions).toHaveLength(1);
    // A generated slot the pools cannot fill leaves the lesson shorter — never padded.
    expect(thin[0]!.lessons[0]!.questions.map((q) => q.id)).toEqual(["order-pl-stages"]);
  });

  it("derives MICRO_LESSON_IDS from the same specs the course binds — all 27 lessons, in course order", () => {
    // The static export pre-renders /learn/lesson/[lesson-id] from this list (generateStaticParams). If it
    // drifted from the specs, a lesson would silently vanish from the export — the JCE-088 deploy failure.
    expect(MICRO_LESSON_IDS).toHaveLength(27);
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
