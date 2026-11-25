import { runDecompModule } from "@/lib/analysis-decomposition";
import type { AnalysisGroup } from "@/lib/company-analysis";
import { meaningSummary, sentenceText } from "@/lib/meaning-layer";
import type { Company, FinancialRecord } from "@/types/company";

/**
 * Predictions (JCE-083): the reader's own reading of a company's next filing, recorded before the figures
 * exist on this site, and checked against the filing when it arrives. This is the step that turns the
 * micro-lessons' predict-then-check form (JCE-082, which trains on two already-printed years) into the real
 * cycle the five steps describe: predict → disclosure → check → feedback → accumulate.
 *
 * A prediction is a learning record, never a trade signal: it asks only whether the next printed revenue /
 * net income will be above or below the latest printed year, and the site shows it back to the reader with
 * the two printed figures it was judged against. Nothing here recommends anything (invariant 4).
 *
 * Tamper-resistance is structural, not cryptographic (the record lives in the reader's own browser):
 * - a prediction is written once per company, metric and baseline period — the store refuses a second one,
 *   so a recorded reading cannot be quietly replaced after the fact;
 * - the record fixes the day it was made and the baseline period it was made against, and carries no result:
 *   the outcome is derived at display time from the site's own data alone, so editing the stored record
 *   cannot invent a hit;
 * - the check follows the free summary's comparability rule (JCE-047): when the new year's accounting
 *   standard or revenue scope differs from the baseline's, no direction is judged at all.
 */

export type PredictionMetric = "revenue" | "net-income";
export type PredictionDirection = "up" | "down";

export type Prediction = {
  companyId: string;
  metric: PredictionMetric;
  direction: PredictionDirection;
  /** The periodEnd of the latest printed year when the prediction was made — the baseline it is judged against. */
  baselinePeriodEnd: string;
  /** That year's label, e.g. "2026年3月期", kept so the record reads even if the entry's labels change. */
  baselineFiscalYear: string;
  /** When the prediction was recorded (ISO 8601, with time). Fixed at write time and never rewritten. */
  recordedAt: string;
};

/** One prediction per company, metric and baseline: the identity that makes a second write a refusal. */
export const predictionKey = (p: Pick<Prediction, "companyId" | "metric" | "baselinePeriodEnd">): string =>
  `${p.companyId}|${p.metric}|${p.baselinePeriodEnd}`;

/** Append a prediction unless one already stands for the same company, metric and baseline. */
export function addPrediction(list: Prediction[], next: Prediction): { list: Prediction[]; added: boolean } {
  if (list.some((p) => predictionKey(p) === predictionKey(next))) return { list, added: false };
  return { list: [...list, next], added: true };
}

// ---------------------------------------------------------------------------------------------------------------
// The per-company figures a prediction is judged against — the smallest slice of an entry the training layer
// needs, shared by the company page (as props), the report page and /predictions.json.

export type PredictionRecord = {
  fiscalYear: string;
  periodEnd: string;
  revenue: number | null;
  revenueLabel: string;
  netIncome: number | null;
  netIncomeLabel: string;
  accountingStandard: FinancialRecord["accountingStandard"];
  revenueBasis?: string;
  sourceIds: string[];
};

export type CompanyPredictionData = {
  name: string;
  /** Annual records only, oldest first. A prediction is about the next annual filing, never a quarter. */
  records: PredictionRecord[];
  /** The sources the records rest on, by id — titles only, for the citation under a check. */
  sources: Record<string, string>;
  /**
   * STEP 4 フィードバック (JCE-110): the newest year's 「この会社の今」 sentences on what made the profit move —
   * shown under a check only when they are about the very year the check was made against, so 「なぜ外れたか」 is
   * read from the decomposition, not guessed. Company and report pages only; the bulk /predictions.json omits it.
   */
  explanation?: { fiscalYear: string; sentences: { text: string; basis: string }[] };
};

export type PredictionData = Record<string, CompanyPredictionData>;

const byPeriodEnd = (records: FinancialRecord[]): FinancialRecord[] =>
  [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));

/** The Q1 sentences a check is explained with: the net-income change, its two parts, and capex beside operating CF. */
const EXPLAIN_IDS = new Set(["q1-net-income", "q1-profit-split", "q1-capex-cash"]);

function explanationFor(company: Company): CompanyPredictionData["explanation"] {
  // The sentences read the company's own rows only; the peer set (industry positions) does not enter them.
  const groups = ["a1", "c2"]
    .map((id) => runDecompModule(id, company, [company]))
    .flatMap((r): AnalysisGroup[] => (r.status === "ok" ? [r.group] : []));
  const sentences = meaningSummary(groups).filter((s) => EXPLAIN_IDS.has(s.id));
  if (sentences.length === 0) return undefined;
  return {
    fiscalYear: sentences[0]!.fiscalYear,
    sentences: sentences.map((s) => ({ text: sentenceText(s), basis: `${s.groupTitle}・${s.kind === "printed" ? "印字値" : "計算値"}` })),
  };
}

export function predictionDataFor(company: Company, options: { explain?: boolean } = {}): CompanyPredictionData {
  const records = byPeriodEnd(company.financials);
  const usedIds = new Set(records.flatMap((r) => r.sourceIds));
  const sources: Record<string, string> = {};
  for (const s of company.sources) if (usedIds.has(s.id)) sources[s.id] = s.title;
  return {
    name: company.name,
    records: records.map((r) => ({
      fiscalYear: r.fiscalYear,
      periodEnd: r.periodEnd,
      revenue: r.revenue,
      revenueLabel: r.revenueLabel,
      netIncome: r.netIncome,
      netIncomeLabel: r.netIncomeLabel,
      accountingStandard: r.accountingStandard,
      ...(r.revenueBasis !== undefined ? { revenueBasis: r.revenueBasis } : {}),
      sourceIds: r.sourceIds,
    })),
    sources,
    ...(options.explain ? (() => {
      const explanation = explanationFor(company);
      return explanation ? { explanation } : {};
    })() : {}),
  };
}

export function buildPredictionData(companies: Company[]): PredictionData {
  const out: PredictionData = {};
  for (const c of companies) if (c.financials.length > 0) out[c.id] = predictionDataFor(c);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// The check: a prediction against the entry as it now stands.

export type Verification =
  | { status: "pending" }
  | { status: "unverifiable"; reason: string }
  | {
      status: "verified";
      /** How the reading turned out — a record of what happened, not a grade of the reader. */
      outcome: "matched" | "missed" | "flat";
      baseline: { fiscalYear: string; value: number };
      actual: { fiscalYear: string; periodEnd: string; value: number };
      /** Actual ÷ baseline − 1 (計算値). */
      change: number;
      /** The filings the two figures rest on — baseline's first, then the new year's. */
      sourceIds: string[];
    };

const valueOf = (r: PredictionRecord, metric: PredictionMetric): number | null =>
  metric === "revenue" ? r.revenue : r.netIncome;

export function verifyPrediction(prediction: Prediction, data: CompanyPredictionData): Verification {
  const records = data.records;
  const baseline = records.find((r) => r.periodEnd === prediction.baselinePeriodEnd);
  if (!baseline) return { status: "unverifiable", reason: "予測の基準にした期の数字が、いまの掲載データに見つかりません" };
  const actual = records.find((r) => r.periodEnd > prediction.baselinePeriodEnd);
  if (!actual) return { status: "pending" };
  // The comparability rule (JCE-047): a direction across a change of standard or scope is not a direction.
  if (actual.accountingStandard !== baseline.accountingStandard || actual.revenueBasis !== baseline.revenueBasis)
    return { status: "unverifiable", reason: "会計基準または売上の集計範囲が前期と変わったため、単純な増減の照合はしていません" };
  const baseValue = valueOf(baseline, prediction.metric);
  const actualValue = valueOf(actual, prediction.metric);
  if (baseValue === null || actualValue === null)
    return { status: "unverifiable", reason: "どちらかの期の数字が掲載されていないため、照合できません" };
  const change = actualValue / baseValue - 1;
  const outcome = actualValue === baseValue ? "flat" : (actualValue > baseValue) === (prediction.direction === "up") ? "matched" : "missed";
  return {
    status: "verified",
    outcome,
    baseline: { fiscalYear: baseline.fiscalYear, value: baseValue },
    actual: { fiscalYear: actual.fiscalYear, periodEnd: actual.periodEnd, value: actualValue },
    change,
    sourceIds: [...new Set([...baseline.sourceIds, ...actual.sourceIds])],
  };
}

/**
 * Whether a metric can be predicted on at all from the latest printed year: the figure must be printed and
 * positive. A loss year is not offered — "up" from a negative base does not read as one direction (the same
 * guard the lesson questions use, JCE-082).
 */
export function predictableMetrics(data: CompanyPredictionData): PredictionMetric[] {
  const latest = data.records.at(-1);
  if (!latest) return [];
  const out: PredictionMetric[] = [];
  if (latest.revenue !== null && latest.revenue > 0) out.push("revenue");
  if (latest.netIncome !== null && latest.netIncome > 0) out.push("net-income");
  return out;
}

export const METRIC_LABELS: Record<PredictionMetric, string> = { revenue: "売上", "net-income": "純利益" };
