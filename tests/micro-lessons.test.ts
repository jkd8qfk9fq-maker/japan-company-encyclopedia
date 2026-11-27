import { describe, expect, it } from "vitest";
import { buildDigest } from "../src/lib/digest";
import type { QuizQuestion, UpdatesData } from "../src/lib/engagement-data";
import { weekEnd, weekStart } from "../src/lib/jst-dates";
import { buildLessonQuestions, type LessonQuestion } from "../src/lib/lesson-questions";
import { LESSON_GUIDES } from "../src/lib/lesson-guide";
import { buildMicroCourse, MICRO_LESSON_IDS } from "../src/lib/micro-lessons";
import { STRUCTURE_QUESTIONS } from "../src/lib/structure-questions";
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

  it("no longer asks which row of the table a stage is — row-finding is retired (JCE-145)", () => {
    // The course's goal is reading what the figures say, not locating a row's position; the generator
    // emits no row-finding question, and the two-period readings below take its place.
    const kinds = new Set(buildLessonQuestions([company("fr", [prev(), rec()])]).map((x) => x.kind as string));
    expect(kinds.has("find-row")).toBe(false);
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

describe("buildLessonQuestions — the JCE-092 detail readings (Phase B)", () => {
  // A company whose entry carries the full statements, transcribed from its filing: the stage
  // arithmetic closes (100 − 60 = 40, 40 − 25 = 15, 15.5 + 2 − 6.5 = 11, 11 − 2 = 9) and the
  // five-year record agrees with the same rows, as the integrity rules demand of the real data.
  const line = (role: string, label: string, amount: number) => ({ role, label, amount });
  const stmtCompany = (id: string, sga: [string, number][] = [["給料及び手当", 12_000_000_000], ["広告宣伝費", 5_000_000_000], ["研究開発費", 3_000_000_000]]): Company =>
    ({
      ...company(id, [
        prev({ profit: 12_000_000_000, netIncome: 4_000_000_000 }),
        rec({ profit: 15_500_000_000, netIncome: 9_000_000_000 }),
      ]),
      financialStatements: [
        {
          fiscalYear: "2026年3月期",
          periodEnd: "2026-03-31",
          accountingStandard: "jgaap",
          sourceIds: ["yuho-2026"],
          incomeStatement: [
            line("revenue", "売上高", 100_000_000_000),
            line("cost-of-sales", "売上原価", 60_000_000_000),
            line("gross-profit", "売上総利益", 40_000_000_000),
            line("selling-general-and-administrative-expenses", "販売費及び一般管理費", 25_000_000_000),
            ...sga.map(([label, amount]) => line("sga-item", label, amount)),
            line("operating-income", "営業利益", 15_000_000_000),
            line("non-operating-income", "営業外収益", 1_000_000_000),
            line("non-operating-expense", "営業外費用", 500_000_000),
            line("ordinary-income", "経常利益", 15_500_000_000),
            line("extraordinary-income-item", "固定資産売却益", 2_000_000_000),
            line("extraordinary-income", "特別利益", 2_000_000_000),
            line("extraordinary-loss-item", "減損損失", 6_000_000_000),
            line("extraordinary-loss-item", "災害損失", 500_000_000),
            line("extraordinary-loss", "特別損失", 6_500_000_000),
            line("income-before-income-taxes", "税引前当期純利益", 11_000_000_000),
            line("income-taxes", "法人税等", 2_000_000_000),
            line("net-income", "当期純利益", 9_000_000_000),
          ],
          balanceSheet: [
            line("cash-and-deposits", "現金及び預金", 30_000_000_000),
            line("accounts-receivable", "受取手形及び売掛金", 25_000_000_000),
            line("inventories", "商品及び製品", 10_000_000_000),
            line("inventories", "仕掛品", 4_000_000_000),
            line("other-current-assets", "その他、流動資産", 1_000_000_000),
            line("total-current-assets", "流動資産合計", 70_000_000_000),
            line("ppe-gross", "建物及び構築物", 50_000_000_000),
            line("accumulated-depreciation", "減価償却累計額、建物及び構築物", -30_000_000_000),
            line("ppe-net", "建物及び構築物（純額）", 20_000_000_000),
            line("total-property-plant-and-equipment", "有形固定資産合計", 20_000_000_000),
            line("goodwill", "のれん", 8_000_000_000),
            line("intangible-asset-item", "ソフトウエア", 3_000_000_000),
            line("total-intangible-assets", "無形固定資産合計", 11_000_000_000),
            line("total-investments-and-other-assets", "投資その他の資産合計", 99_000_000_000),
            line("total-non-current-assets", "固定資産合計", 130_000_000_000),
            line("total-assets", "資産合計", 200_000_000_000),
            line("accounts-payable", "買掛金", 15_000_000_000),
            line("short-term-borrowings", "短期借入金", 10_000_000_000),
            line("current-portion-of-long-term-borrowings", "１年内返済予定の長期借入金", 5_000_000_000),
            line("other-current-liabilities", "その他、流動負債", 10_000_000_000),
            line("total-current-liabilities", "流動負債合計", 40_000_000_000),
            line("bonds", "社債", 20_000_000_000),
            line("long-term-borrowings", "長期借入金", 60_000_000_000),
            line("total-non-current-liabilities", "固定負債合計", 80_000_000_000),
            line("total-liabilities", "負債合計", 120_000_000_000),
            line("total-shareholders-equity", "株主資本合計", 78_000_000_000),
            line("total-net-assets", "純資産合計", 80_000_000_000),
          ],
        },
      ],
    }) as unknown as Company;

  const qs = buildLessonQuestions([stmtCompany("stmt")]);
  const ofKind = (kind: string) => qs.find((x) => x.kind === kind);

  it("asks for the largest line of the SG&A breakdown, on the real P/L excerpt", () => {
    const q = ofKind("detail-sga");
    expect(q).toBeDefined();
    expect(q?.options.find((o) => o.id === q?.answer)?.label).toBe("給料及び手当");
    expect(q?.table?.rows.some((r) => r[0] === "販売費及び一般管理費")).toBe(true);
    expect(q?.explain).toContain("計算値");
  });

  it("asks for the largest special item, between ordinary and pre-tax income", () => {
    const q = ofKind("detail-special");
    expect(q?.options.find((o) => o.id === q?.answer)?.label).toBe("減損損失");
    expect(q?.explain).toContain("特別損失");
  });

  it("asks which rows are not yet cash, among the current assets", () => {
    const q = ofKind("detail-working-capital");
    expect(q?.answer).toBe("both");
    expect(q?.options.find((o) => o.id === "both")?.label).toContain("受取手形及び売掛金");
    expect(q?.options.find((o) => o.id === "both")?.label).toContain("仕掛品");
  });

  it("asks how many rows the borrowings are split across, current and non-current together", () => {
    const q = ofKind("detail-borrowings");
    expect(q?.options.find((o) => o.id === q?.answer)?.label).toBe("4行");
    expect(q?.explain).toContain("計算値");
  });

  it("asks for the largest of the intangible assets, goodwill among them", () => {
    const q = ofKind("detail-goodwill");
    expect(q?.options.find((o) => o.id === q?.answer)?.label).toBe("のれん");
  });

  it("asks how a book value is built from the three printed lines — the construction, not a value", () => {
    const q = ofKind("detail-depreciation");
    expect(q?.answer).toBe("minus");
    expect(q?.table?.rows.map((r) => r[0])).toEqual(["建物及び構築物", "減価償却累計額、建物及び構築物", "建物及び構築物（純額）"]);
    expect(q?.explain).toContain("計算値");
  });

  it("keeps the statement's own citation and period on every detail question", () => {
    for (const kind of ["detail-sga", "detail-special", "detail-working-capital", "detail-borrowings", "detail-goodwill", "detail-depreciation"]) {
      const q = ofKind(kind);
      expect(q?.sourceIds).toEqual(["yuho-2026"]);
      expect(q?.sourceTitle).toBe("有価証券報告書－第1期");
      expect(q?.period).toBe("2026年3月期");
      expect(q?.table).toBeDefined();
    }
  });

  it("asks nothing of a company whose entry carries no statements", () => {
    const plain = buildLessonQuestions([company("plain", [prev(), rec()])]);
    expect(plain.some((x) => x.kind.startsWith("detail-"))).toBe(false);
  });

  it("asks no largest-line question when the top two of a breakdown are level", () => {
    const tied = buildLessonQuestions([stmtCompany("tied", [["給料及び手当", 12_000_000_000], ["広告宣伝費", 12_000_000_000], ["研究開発費", 3_000_000_000]])]);
    expect(tied.some((x) => x.kind === "detail-sga")).toBe(false);
  });

  it("binds each detail reading into the lesson the design assigns it to", () => {
    // Two statement companies: since JCE-145 more lessons draw on each detail pool (flow-and-stock
    // also reads the working-capital breakdown, current-or-fixed the borrowings), so a single
    // company's questions no longer reach every designated lesson.
    const units = buildMicroCourse([], buildLessonQuestions([stmtCompany("bind"), stmtCompany("bind2")]));
    const lesson = (id: string) => units.flatMap((u) => u.lessons).find((l) => l.id === id);
    expect(lesson("gross-vs-operating")?.questions.some((q) => q.kind === "detail-sga")).toBe(true);
    expect(lesson("special-items-gap")?.questions.some((q) => q.kind === "detail-special")).toBe(true);
    expect(lesson("assets-not-cash")?.questions.some((q) => q.kind === "detail-working-capital")).toBe(true);
    expect(lesson("find-all-borrowings")?.questions.some((q) => q.kind === "detail-borrowings")).toBe(true);
    expect(lesson("invisible-assets")?.questions.some((q) => q.kind === "detail-goodwill")).toBe(true);
    expect(lesson("book-value")?.questions.some((q) => q.kind === "detail-depreciation")).toBe(true);
    // The three-question lessons size their minutes to the enlarged form.
    for (const id of ["gross-vs-operating", "special-items-gap", "assets-not-cash", "find-all-borrowings", "invisible-assets", "book-value"]) {
      expect(lesson(id)?.minutes).toBe(7);
    }
  });
});

describe("buildLessonQuestions — the JCE-145 analysis readings", () => {
  const line = (role: string, label: string, amount: number) => ({ role, label, amount });

  it("asks how the margin moved between the two printed periods, as a computed value", () => {
    // 営業利益率 10.0% (80億/800億) → 15.0% (150億/1,000億): a five-point rise.
    const q = buildLessonQuestions([
      company("ms", [prev({ revenue: 80_000_000_000, profit: 8_000_000_000, profitLabel: "営業利益" }), rec({ profit: 15_000_000_000, profitLabel: "営業利益" })]),
    ]).find((x) => x.kind === "margin-shift");
    expect(q).toBeDefined();
    expect(q?.answer).toBe("up");
    expect(q?.table).toBeDefined();
    expect(q?.explain).toContain("計算値");
    expect(q?.explain).toContain("10.0%");
    expect(q?.explain).toContain("15.0%");
    expect(q?.explain).toContain("5.0ポイント");
    expect(q?.sourceIds).toContain("yuho-2026");
    expect(q?.period).toBe("2025年3月期 → 2026年3月期");
    // A margin that barely moved asks nothing.
    const flat = buildLessonQuestions([
      company("msf", [prev({ revenue: 80_000_000_000, profit: 10_000_000_000, profitLabel: "営業利益" }), rec({ profit: 12_500_000_000, profitLabel: "営業利益" })]),
    ]);
    expect(flat.some((x) => x.kind === "margin-shift")).toBe(false); // 12.5% → 12.5%
  });

  it("asks which stage's change accounts for the last line's move, when one stage dominates", () => {
    const stmt = (fiscalYear: string, periodEnd: string, rows: [string, string, number][]) => ({
      fiscalYear,
      periodEnd,
      accountingStandard: "jgaap" as const,
      sourceIds: ["yuho-2026"],
      incomeStatement: rows.map(([role, label, amount]) => line(role, label, amount)),
      balanceSheet: [],
      cashFlowStatement: [],
    });
    // Gross +140億, operating +70億, ordinary +65億, pre-tax +25億, net +30億: the top stage moved most.
    const twoYears = {
      ...company("sd", [prev(), rec()]),
      financialStatements: [
        stmt("2025年3月期", "2025-03-31", [
          ["revenue", "売上高", 80_000_000_000],
          ["gross-profit", "売上総利益", 32_000_000_000],
          ["operating-income", "営業利益", 10_000_000_000],
          ["ordinary-income", "経常利益", 11_000_000_000],
          ["income-before-income-taxes", "税引前当期純利益", 10_500_000_000],
          ["net-income", "当期純利益", 7_000_000_000],
        ]),
        stmt("2026年3月期", "2026-03-31", [
          ["revenue", "売上高", 100_000_000_000],
          ["gross-profit", "売上総利益", 46_000_000_000],
          ["operating-income", "営業利益", 17_000_000_000],
          ["ordinary-income", "経常利益", 17_500_000_000],
          ["income-before-income-taxes", "税引前当期純利益", 13_000_000_000],
          ["net-income", "当期純利益", 10_000_000_000],
        ]),
      ],
    } as unknown as Company;
    const q = buildLessonQuestions([twoYears]).find((x) => x.kind === "stage-driver");
    expect(q).toBeDefined();
    expect(q?.options.find((o) => o.id === q?.answer)?.label).toBe("売上総利益");
    expect(q?.table).toBeDefined();
    expect(q?.explain).toContain("計算値");
    expect(q?.sourceIds).toContain("yuho-2026");
    expect(q?.period).toBe("2025年3月期 → 2026年3月期");
    // Stages moving in step ask nothing: no stage dominates.
    const inStep = {
      ...company("sd2", [prev(), rec()]),
      financialStatements: [
        stmt("2025年3月期", "2025-03-31", [
          ["gross-profit", "売上総利益", 32_000_000_000],
          ["operating-income", "営業利益", 10_000_000_000],
          ["ordinary-income", "経常利益", 11_000_000_000],
          ["income-before-income-taxes", "税引前当期純利益", 10_500_000_000],
          ["net-income", "当期純利益", 7_000_000_000],
        ]),
        stmt("2026年3月期", "2026-03-31", [
          ["gross-profit", "売上総利益", 37_000_000_000],
          ["operating-income", "営業利益", 15_000_000_000],
          ["ordinary-income", "経常利益", 16_000_000_000],
          ["income-before-income-taxes", "税引前当期純利益", 15_500_000_000],
          ["net-income", "当期純利益", 12_000_000_000],
        ]),
      ],
    } as unknown as Company;
    expect(buildLessonQuestions([inStep]).some((x) => x.kind === "stage-driver")).toBe(false);
  });

  it("asks which business drove the segment revenue change, from the two printed periods", () => {
    const withSegments = {
      ...company("sgd", [prev(), rec()]),
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
          { businessId: "b2", amount: 32_000_000_000 },
        ],
        previous: {
          fiscalYear: "2025年3月期",
          periodEnd: "2025-03-31",
          label: "外部顧客への売上高",
          items: [
            { businessId: "b1", amount: 50_000_000_000 },
            { businessId: "b2", amount: 30_000_000_000 },
          ],
        },
        sourceIds: ["yuho-2026"],
      },
    } as unknown as Company;
    const q = buildLessonQuestions([withSegments]).find((x) => x.kind === "segment-driver");
    expect(q).toBeDefined();
    expect(q?.answer).toBe("b1"); // +200億 of a +220億 total
    expect(q?.table?.rows.map((r) => r[0])).toContain("合計");
    expect(q?.explain).toContain("計算値");
    expect(q?.sourceIds).toContain("yuho-2026");
    expect(q?.period).toBe("2025年3月期 → 2026年3月期");
  });

  it("asks the relation among the cash-flow figures — outlay against wear, covered or not", () => {
    const cfCompany = (id: string, op: number, capex: number, dep: number) =>
      ({
        ...company(id, [prev(), rec()]),
        financialStatements: [
          {
            fiscalYear: "2026年3月期",
            periodEnd: "2026-03-31",
            accountingStandard: "jgaap",
            sourceIds: ["yuho-2026"],
            incomeStatement: [line("revenue", "売上高", 100_000_000_000), line("net-income", "当期純利益", 9_000_000_000)],
            balanceSheet: [],
            cashFlowStatement: [
              line("operating-cash-flow", "営業活動によるキャッシュ・フロー", op),
              line("depreciation", "減価償却費", dep),
              line("capital-expenditure", "有形固定資産の取得による支出", capex),
            ],
          },
        ],
      }) as unknown as Company;
    const up = buildLessonQuestions([cfCompany("cf1", 20_000_000_000, -12_000_000_000, 8_000_000_000)]).find((x) => x.kind === "cf-investment");
    expect(up?.answer).toBe("up-covered"); // outlay 1.50× depreciation, operating inflow 1.67× the outlay
    expect(up?.explain).toContain("計算値");
    expect(up?.explain).toContain("1.50倍");
    expect(up?.sourceIds).toContain("yuho-2026");
    expect(up?.period).toBe("2026年3月期");
    const down = buildLessonQuestions([cfCompany("cf2", 5_000_000_000, -10_000_000_000, 20_000_000_000)]).find((x) => x.kind === "cf-investment");
    expect(down?.answer).toBe("down-uncovered"); // outlay 0.50× depreciation, operating inflow half the outlay
    // A relation too close to call asks nothing.
    const close = buildLessonQuestions([cfCompany("cf3", 11_000_000_000, -10_000_000_000, 10_000_000_000)]);
    expect(close.some((x) => x.kind === "cf-investment")).toBe(false);
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

/** The kinds whose generated questions carry an excerpt table (JCE-090); the fake pool honours that too,
 *  so the JCE-091 walkthrough has a table to lift. */
const TABLE_KINDS: LessonQuestion["kind"][] = [
  "relation-stages",
  "relation-net-assets",
  "region-find",
  "detail-sga",
  "detail-special",
  "detail-working-capital",
  "detail-borrowings",
  "detail-goodwill",
  "detail-depreciation",
  "margin-shift",
  "stage-driver",
  "segment-driver",
  "cf-investment",
];

const lessonQ = (id: string, kind: LessonQuestion["kind"]): LessonQuestion => ({
  id,
  kind,
  companyId: "x",
  companyName: "X社",
  industry: "retail",
  // The generator never emits a direction question without a clue (JCE-090); the fake pool honours the same contract.
  ...(PREDICT_KINDS.includes(kind) ? { clue: "手がかり：テスト用の手がかり（計算値）。" } : {}),
  ...(TABLE_KINDS.includes(kind) ? { table: { columns: ["項目", "2026年3月期"], rows: [["売上高", "1,000億円"]] } } : {}),
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

describe("buildMicroCourse — the JCE-090 course, graded and extended in JCE-145", () => {
  const pool: QuizQuestion[] = [poolQ("dsc-1", "describe"), poolQ("dsc-2", "describe"), poolQ("dec-1", "decompose"), poolQ("dec-2", "decompose")];
  const lessonPool: LessonQuestion[] = [
    ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => lessonQ(`rs-${n}`, "relation-stages")),
    ...[1, 2, 3, 4, 5, 6].map((n) => lessonQ(`lr-${n}`, "label-reading")),
    ...[1, 2, 3].map((n) => lessonQ(`st-${n}`, "segment-top")),
    ...[1, 2, 3].map((n) => lessonQ(`rna-${n}`, "relation-net-assets")),
    ...[1, 2, 3, 4, 5, 6].map((n) => lessonQ(`ms-${n}`, "margin-shift")),
    ...[1, 2, 3, 4, 5].map((n) => lessonQ(`sd-${n}`, "stage-driver")),
    ...[1, 2, 3, 4].map((n) => lessonQ(`sgd-${n}`, "segment-driver")),
    ...[1, 2, 3].map((n) => lessonQ(`cf-${n}`, "cf-investment")),
    ...[1, 2].map((n) => lessonQ(`ds-${n}`, "detail-special")),
    ...[1, 2].map((n) => lessonQ(`db-${n}`, "detail-borrowings")),
    ...[1, 2].map((n) => lessonQ(`dwc-${n}`, "detail-working-capital")),
    ...[1, 2].map((n) => lessonQ(`qd-${n}`, "quarterly-direction")),
    lessonQ("ge-1", "growth-employees"),
    lessonQ("rf-1", "region-find"),
    lessonQ("gr-1", "growth-revenue"),
    lessonQ("gp-1", "growth-profit"),
  ];
  const units = buildMicroCourse(pool, lessonPool);
  const allQuestions = units.flatMap((u) => u.lessons.flatMap((l) => l.questions));

  it("binds eight units of 35 lessons, in the order the stumbling points are resolved", () => {
    expect(units.map((u) => u.id)).toEqual([
      "five-profits",
      "why-net-moves",
      "consolidated-yardstick",
      "balance-sheet-photo",
      "two-statements-linked",
      "reading-the-real-thing",
      "reading-changes",
      "reading-business-and-cash",
    ]);
    expect(units.map((u) => u.lessons.length)).toEqual([5, 4, 4, 5, 5, 4, 4, 4]);
    for (const unit of units) expect(unit.plannedLessons).toHaveLength(0);
  });

  it("grades the units into four levels, the way bookkeeping study climbs its grades (JCE-145)", () => {
    expect(units.map((u) => u.level)).toEqual(["入門級", "入門級", "基礎級", "基礎級", "基礎級", "実践級", "分析級", "分析級"]);
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
    expect(kinds.filter((k) => k === "segment-top")).toHaveLength(3); // kept, and now also the analysis units' weight-reading material
    expect(kinds.filter((k) => k === "describe")).toHaveLength(2); // kept, as the finale's business-reading material
    for (const retired of ["figure", "shares", "employees", "overseas-ratio", "quarterly-progress", "revenue", "segment", "overseas", "quarterly", "find-row"]) {
      expect(kinds).not.toContain(retired);
    }
  });

  it("binds no ordering question — the course reads and analyses, it does not memorise arrangement (JCE-145)", () => {
    expect(allQuestions.some((q) => q.format === "order")).toBe(false);
    const ids = allQuestions.map((q) => q.id);
    for (const orderId of ["order-pl-stages", "order-bs-sections", "order-tax-steps"]) expect(ids).not.toContain(orderId);
    // The authored data itself stays in the pool — only the lesson bindings retired.
    expect(STRUCTURE_QUESTIONS.map((q) => q.id)).toEqual(expect.arrayContaining(["order-pl-stages", "order-bs-sections", "order-tax-steps"]));
  });

  it("binds the analysis readings into the two new units (JCE-145)", () => {
    const byId = new Map(units.flatMap((u) => u.lessons).map((l) => [l.id, l]));
    expect(byId.get("reading-margin-shift")?.questions.map((q) => q.kind)).toEqual(["margin-shift", "margin-shift"]);
    expect(byId.get("which-stage-moved")?.questions.map((q) => q.kind)).toEqual(["stage-driver", "stage-driver"]);
    expect(byId.get("toward-prediction")?.questions.map((q) => q.kind)).toEqual(["decompose", "decompose", "stage-driver"]);
    expect(byId.get("investment-and-profit")?.questions.map((q) => q.kind)).toEqual(["cf-investment", "cf-investment"]);
    expect(byId.get("capstone-three-questions")?.questions.map((q) => q.kind)).toEqual(["segment-driver", "cf-investment", "stage-driver"]);
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
    // The authored structure questions bind without any pool: in the balance-sheet unit, the lessons
    // whose slots are all authored keep their two questions, and a lesson with generated slots keeps
    // only its authored questions — never padded.
    const thinUnit4 = new Map(thin[3]!.lessons.map((l) => [l.id, l.questions.length]));
    expect(thinUnit4.get("flow-and-stock")).toBe(1);
    expect(thinUnit4.get("left-and-right")).toBe(2);
    expect(thinUnit4.get("current-or-fixed")).toBe(2);
    expect(thinUnit4.get("assets-not-cash")).toBe(2);
    expect(thinUnit4.get("find-all-borrowings")).toBe(2);
    // A generated slot the pools cannot fill leaves the lesson shorter — never padded.
    expect(thin[0]!.lessons[0]!.questions.map((q) => q.id)).toEqual(["diff-revenue-gross"]);
  });

  it("derives MICRO_LESSON_IDS from the same specs the course binds — all 35 lessons, in course order", () => {
    // The static export pre-renders /learn/lesson/[lesson-id] from this list (generateStaticParams). If it
    // drifted from the specs, a lesson would silently vanish from the export — the JCE-088 deploy failure.
    expect(MICRO_LESSON_IDS).toHaveLength(35);
    expect(MICRO_LESSON_IDS).toEqual(units.flatMap((u) => u.lessons.map((l) => l.id)));
  });
});

describe("buildMicroCourse — the JCE-091 learn block", () => {
  const pool: QuizQuestion[] = [poolQ("dsc-1", "describe"), poolQ("dsc-2", "describe"), poolQ("dec-1", "decompose"), poolQ("dec-2", "decompose")];
  const lessonPool: LessonQuestion[] = [
    ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => lessonQ(`rs-${n}`, "relation-stages")),
    ...[1, 2, 3, 4, 5, 6].map((n) => lessonQ(`lr-${n}`, "label-reading")),
    ...[1, 2, 3].map((n) => lessonQ(`st-${n}`, "segment-top")),
    ...[1, 2, 3].map((n) => lessonQ(`rna-${n}`, "relation-net-assets")),
    ...[1, 2, 3, 4, 5, 6].map((n) => lessonQ(`ms-${n}`, "margin-shift")),
    ...[1, 2, 3, 4, 5].map((n) => lessonQ(`sd-${n}`, "stage-driver")),
    ...[1, 2, 3, 4].map((n) => lessonQ(`sgd-${n}`, "segment-driver")),
    ...[1, 2, 3].map((n) => lessonQ(`cf-${n}`, "cf-investment")),
    ...[1, 2].map((n) => lessonQ(`ds-${n}`, "detail-special")),
    ...[1, 2].map((n) => lessonQ(`db-${n}`, "detail-borrowings")),
    ...[1, 2].map((n) => lessonQ(`dwc-${n}`, "detail-working-capital")),
    ...[1, 2].map((n) => lessonQ(`qd-${n}`, "quarterly-direction")),
    lessonQ("ge-1", "growth-employees"),
    lessonQ("rf-1", "region-find"),
    lessonQ("gr-1", "growth-revenue"),
    lessonQ("gp-1", "growth-profit"),
  ];
  const units = buildMicroCourse(pool, lessonPool);
  const lessons = units.flatMap((u) => u.lessons);

  it("covers every lesson id with an authored guide — no lesson reaches its questions untaught", () => {
    expect(Object.keys(LESSON_GUIDES).sort()).toEqual([...MICRO_LESSON_IDS].sort());
  });

  it("gives all 35 lessons the full learn block: stumbling point, concept prose, guided reading", () => {
    // The learn block is authored per lesson, so it is present even when the pools are empty.
    for (const unit of buildMicroCourse([], [])) {
      for (const lesson of unit.lessons) {
        expect(lesson.stumble, lesson.id).toBeTruthy();
        expect(lesson.body.length, lesson.id).toBeGreaterThanOrEqual(2);
        expect(lesson.guide?.length, lesson.id).toBeGreaterThanOrEqual(1);
      }
    }
    for (const lesson of lessons) {
      expect(lesson.stumble, lesson.id).toBeTruthy();
      expect(lesson.guide?.length, lesson.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("sizes the minutes to the enlarged lesson, not to the old four steps", () => {
    for (const lesson of lessons) {
      expect(lesson.minutes, lesson.id).toBeGreaterThanOrEqual(5);
      expect(lesson.minutes, lesson.id).toBeLessThanOrEqual(7);
    }
    expect(lessons.find((l) => l.id === "predict-with-clues")?.minutes).toBe(7); // the finale: 4 questions
    expect(lessons.find((l) => l.id === "capstone-three-questions")?.minutes).toBe(7); // the analysis capstone
  });

  it("lifts a bound question's table into the walkthrough, with that question's citation", () => {
    const plMap = lessons.find((l) => l.id === "pl-map")!;
    const tableQuestion = plMap.questions.find((q) => q.table);
    expect(tableQuestion).toBeDefined();
    expect(plMap.guideTable).toEqual(tableQuestion!.table);
    expect(plMap.guideCite).toEqual({ period: "2026年3月期", sourceTitle: "有価証券報告書" });
    const piles = lessons.find((l) => l.id === "profit-piles-up")!;
    expect(piles.guideTable).toBeDefined();
    expect(piles.guideCite?.sourceTitle).toBe("有価証券報告書");
  });

  it("lets a lesson opt out of the lift, when the excerpt that binds may be the other statement's", () => {
    // shades-of-red binds a stages-relation question whose excerpt is the five-year summary; its
    // guided reading is about the profit stages' signs, so it walks through in prose instead.
    const shades = lessons.find((l) => l.id === "shades-of-red")!;
    expect(shades.questions.some((q) => q.table)).toBe(true);
    expect(shades.guideTable).toBeUndefined();
    expect(shades.guideCite).toBeUndefined();
    expect(shades.guide?.length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to the authored excerpt of the form where no bound question carries a table", () => {
    // left-and-right binds two authored questions — no company table exists — so its walkthrough reads
    // the balance sheet's form itself, and carries no company citation.
    const thin = buildMicroCourse([], []);
    const leftRight = thin[3]!.lessons.find((l) => l.id === "left-and-right")!;
    expect(leftRight.guideTable).toBeDefined();
    expect(leftRight.guideCite).toBeUndefined();
    // A lesson whose questions never carry a table and which authors no excerpt walks through in prose.
    const longName = lessons.find((l) => l.id === "the-long-name")!;
    expect(longName.guideTable).toBeUndefined();
    expect(longName.guide?.length).toBeGreaterThanOrEqual(1);
  });

  it("teaches with authored diagrams of the form — structure only, on the lessons that need a picture", () => {
    const withDiagram = lessons.filter((l) => l.diagram);
    expect(withDiagram.length).toBeGreaterThanOrEqual(15);
    const plMap = lessons.find((l) => l.id === "pl-map")!;
    expect(plMap.diagram?.rows.map((r) => r[0])).toContain("売上総利益");
    expect(plMap.diagram?.rows.map((r) => r[0])).toContain("当期純利益");
    // A diagram names items and sections; it never carries an amount.
    for (const lesson of withDiagram) for (const row of lesson.diagram!.rows) for (const cell of row) expect(cell).not.toMatch(/円|億|,/);
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
