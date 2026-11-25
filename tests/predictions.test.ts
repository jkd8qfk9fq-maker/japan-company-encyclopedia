import { describe, expect, it } from "vitest";
import {
  addPrediction,
  buildPredictionData,
  predictableMetrics,
  predictionDataFor,
  verifyPrediction,
  type CompanyPredictionData,
  type Prediction,
  type PredictionRecord,
} from "../src/lib/predictions";
import type { Company, FinancialRecord } from "../src/types/company";

/**
 * Predictions (JCE-083): a reading recorded against the latest printed year is checked only against the
 * site's own data — never against anything stored with the prediction — and only when the two years are
 * comparable. A second prediction for the same company, metric and baseline is refused, so a recorded
 * reading cannot be replaced after the fact.
 */

const rec = (over: Partial<PredictionRecord> = {}): PredictionRecord => ({
  fiscalYear: "2026年3月期",
  periodEnd: "2026-03-31",
  revenue: 100_000_000_000,
  revenueLabel: "売上高",
  netIncome: 5_000_000_000,
  netIncomeLabel: "当期純利益",
  accountingStandard: "jgaap",
  sourceIds: ["yuho-2026"],
  ...over,
});

const next = (over: Partial<PredictionRecord> = {}): PredictionRecord =>
  rec({ fiscalYear: "2027年3月期", periodEnd: "2027-03-31", revenue: 120_000_000_000, netIncome: 4_000_000_000, sourceIds: ["yuho-2027"], ...over });

const data = (records: PredictionRecord[]): CompanyPredictionData => ({
  name: "会社a",
  records,
  sources: { "yuho-2026": "有価証券報告書－第1期", "yuho-2027": "有価証券報告書－第2期" },
});

const prediction = (over: Partial<Prediction> = {}): Prediction => ({
  companyId: "a",
  metric: "revenue",
  direction: "up",
  baselinePeriodEnd: "2026-03-31",
  baselineFiscalYear: "2026年3月期",
  recordedAt: "2026-11-22T00:00:00.000Z",
  ...over,
});

describe("verifyPrediction", () => {
  it("is pending while no newer year is on the site", () => {
    expect(verifyPrediction(prediction(), data([rec()]))).toEqual({ status: "pending" });
  });

  it("matches when the new printed figure moved the predicted way, with both figures and sources", () => {
    const v = verifyPrediction(prediction(), data([rec(), next()]));
    expect(v.status).toBe("verified");
    if (v.status !== "verified") return;
    expect(v.outcome).toBe("matched");
    expect(v.baseline).toEqual({ fiscalYear: "2026年3月期", value: 100_000_000_000 });
    expect(v.actual).toEqual({ fiscalYear: "2027年3月期", periodEnd: "2027-03-31", value: 120_000_000_000 });
    expect(v.change).toBeCloseTo(0.2);
    expect(v.sourceIds).toEqual(["yuho-2026", "yuho-2027"]);
  });

  it("misses when the figure moved the other way, per metric", () => {
    const v = verifyPrediction(prediction({ metric: "net-income", direction: "up" }), data([rec(), next()]));
    expect(v.status).toBe("verified");
    if (v.status !== "verified") return;
    expect(v.outcome).toBe("missed"); // net income fell 50億 → 40億
    expect(v.change).toBeCloseTo(-0.2);
  });

  it("reads an unchanged figure as flat, neither matched nor missed", () => {
    const v = verifyPrediction(prediction(), data([rec(), next({ revenue: 100_000_000_000 })]));
    expect(v.status).toBe("verified");
    if (v.status !== "verified") return;
    expect(v.outcome).toBe("flat");
  });

  it("judges against the first newer year, not a later one", () => {
    const later = rec({ fiscalYear: "2028年3月期", periodEnd: "2028-03-31", revenue: 90_000_000_000, sourceIds: ["yuho-2027"] });
    const v = verifyPrediction(prediction(), data([rec(), next(), later]));
    expect(v.status).toBe("verified");
    if (v.status !== "verified") return;
    expect(v.actual.fiscalYear).toBe("2027年3月期");
    expect(v.outcome).toBe("matched");
  });

  it("refuses to judge across a change of accounting standard or revenue scope (JCE-047)", () => {
    expect(verifyPrediction(prediction(), data([rec(), next({ accountingStandard: "ifrs" })])).status).toBe("unverifiable");
    expect(verifyPrediction(prediction(), data([rec(), next({ revenueBasis: "金融事業を除く" })])).status).toBe("unverifiable");
  });

  it("is unverifiable when a figure is missing or the baseline year is gone", () => {
    expect(verifyPrediction(prediction(), data([rec(), next({ revenue: null })])).status).toBe("unverifiable");
    expect(verifyPrediction(prediction(), data([next()])).status).toBe("unverifiable");
  });
});

describe("addPrediction", () => {
  it("appends a first prediction and refuses a second for the same company, metric and baseline", () => {
    const first = addPrediction([], prediction());
    expect(first.added).toBe(true);
    const second = addPrediction(first.list, prediction({ direction: "down" }));
    expect(second.added).toBe(false);
    expect(second.list).toHaveLength(1);
    expect(second.list[0]!.direction).toBe("up"); // the recorded reading stands
  });

  it("allows another metric, and the same metric against a newer baseline", () => {
    const base = addPrediction([], prediction()).list;
    expect(addPrediction(base, prediction({ metric: "net-income" })).added).toBe(true);
    expect(addPrediction(base, prediction({ baselinePeriodEnd: "2027-03-31", baselineFiscalYear: "2027年3月期" })).added).toBe(true);
  });
});

describe("predictableMetrics", () => {
  it("offers both metrics on a profitable latest year", () => {
    expect(predictableMetrics(data([rec()]))).toEqual(["revenue", "net-income"]);
  });

  it("does not offer a metric whose latest figure is a loss or missing", () => {
    expect(predictableMetrics(data([rec({ netIncome: -1_000_000_000 })]))).toEqual(["revenue"]);
    expect(predictableMetrics(data([rec({ revenue: null })]))).toEqual(["net-income"]);
    expect(predictableMetrics(data([]))).toEqual([]);
  });
});

describe("predictionDataFor / buildPredictionData", () => {
  const company = (financials: FinancialRecord[]): Company =>
    ({
      id: "a",
      name: "会社a",
      financials,
      sources: [
        { id: "yuho-2026", title: "有価証券報告書－第1期", publisher: "会社a", url: "https://example.jp", accessedAt: "2026-10-01" },
        { id: "other", title: "公式サイト", publisher: "会社a", url: "https://example.jp", accessedAt: "2026-10-01" },
      ],
    }) as unknown as Company;

  const fin = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
    ({
      fiscalYear: "2026年3月期",
      periodEnd: "2026-03-31",
      revenue: 100_000_000_000,
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
      ...over,
    }) as FinancialRecord;

  it("keeps the annual records in order and only the sources they rest on", () => {
    const d = predictionDataFor(company([fin({ fiscalYear: "2027年3月期", periodEnd: "2027-03-31" }), fin()]));
    expect(d.records.map((r) => r.periodEnd)).toEqual(["2026-03-31", "2027-03-31"]);
    expect(Object.keys(d.sources)).toEqual(["yuho-2026"]);
  });

  it("explains the newest year with the 「この会社の今」 sentences only when asked (company and report pages)", () => {
    const two = company([
      fin({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", profit: 10_000_000_000, profitLabel: "経常利益" }),
      fin({ profit: 6_000_000_000, profitLabel: "経常利益", netIncome: 3_000_000_000 }),
    ]);
    (two as unknown as { industries: unknown[] }).industries = [{ industryId: "food", primary: true }];
    expect(predictionDataFor(two).explanation).toBeUndefined();
    const explained = predictionDataFor(two, { explain: true }).explanation;
    expect(explained?.fiscalYear).toBe("2026年3月期");
    expect(explained?.sentences.map((s) => s.text)).toEqual([
      "純利益の増減は前期比 −20億円。",
      "経常利益の増減 −40億円 のうち、売上の増減による分は 0円、利益率の変化による分は −40億円。",
    ]);
    expect(explained?.sentences[0]!.basis).toBe("利益増減の内訳（寄与度分解）・計算値");
    // The bulk file every page can fetch stays lean.
    expect(buildPredictionData([two]).a!.explanation).toBeUndefined();
  });

  it("skips companies with no annual figures", () => {
    expect(buildPredictionData([company([])])).toEqual({});
    expect(Object.keys(buildPredictionData([company([fin()])]))).toEqual(["a"]);
  });
});
