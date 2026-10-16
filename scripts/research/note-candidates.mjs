/**
 * Facts in an evidence pack that may need a `financials[].note` — the sentence under the chart that
 * tells a reader how to read a year. Only FACTS the pack can state; whether a year deserves a note,
 * and what the filing says about why, is the researcher's call, and the note is written from the
 * filing's own words (never from a guess at the cause).
 *
 * A note is warranted when the reader would otherwise misread comparability: the accounting standard
 * changed between years, a prior year was restated, the period is not twelve months, the fiscal year
 * end moved, or a 訂正 changed a figure. Everything else stays out.
 */

const KIND_LABEL = { revenue: "売上", netIncome: "純利益", profit: "利益", totalAssets: "総資産", netAssets: "純資産", employees: "従業員数" };
const STANDARD_LABEL = { jgaap: "日本基準", ifrs: "IFRS", usgaap: "米国基準" };

/** `2026-03-31` → `2026年3月期`, as the entry labels it. */
const yearLabel = (/** @type {string} */ periodEnd) => {
  const [y, m] = periodEnd.split("-");
  return `${y}年${Number(m)}月期`;
};

/**
 * @param {any} pack a pack's summary.json
 * @param {{ fiscalYear: string, periodEnd: string, accountingStandard: string | null }[]} financials the draft's rows
 * @returns {string[]}
 */
export function noteCandidates(pack, financials) {
  const out = [];

  // 1. The accounting standard changed inside the window.
  const rows = [...financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  for (let i = 1; i < rows.length; i++) {
    const before = rows[i - 1].accountingStandard;
    const after = rows[i].accountingStandard;
    if (before && after && before !== after) {
      out.push(`${rows[i].fiscalYear}: 会計基準が ${STANDARD_LABEL[before] ?? before}（${rows[i - 1].fiscalYear}）から ${STANDARD_LABEL[after] ?? after} に変わっている。年度をまたぐ比較に影響する`);
    }
  }

  // 2. A prior year's figure differs between this filing and the previous one (a restatement).
  for (const [kind, result] of Object.entries(pack?.restatementCheck ?? {})) {
    for (const d of /** @type {any} */ (result)?.differences ?? []) {
      const periodEnd = String(d.key).split("|")[1];
      if (!periodEnd) continue;
      out.push(`${yearLabel(periodEnd)}: ${KIND_LABEL[/** @type {keyof typeof KIND_LABEL} */ (kind)] ?? kind}が前期有報と違う（前期有報 ${d.previousFiling.toLocaleString("ja-JP")} → 今期有報 ${d.latestFiling.toLocaleString("ja-JP")}）。有報の注記に理由がある。値は今期有報のもの`);
    }
  }

  // 3. Not a twelve-month period, or the fiscal year end moved.
  for (const p of pack?.irregularPeriods ?? []) out.push(`${yearLabel(p.yearEnd)}: ${p.months} か月の期。他の年と期間の長さが違う`);
  if (pack?.fiscalYearChange) {
    out.push(`決算期の変更: 有報は決算年月を ${pack.fiscalYearChange.printed.join("・")} と印字している（5年表の日付は ${pack.fiscalYearChange.assumed.join("・")} になっている）`);
  }

  // 4. A 訂正 of the filing changed a figure — the figures here are the corrected ones.
  const effective = (pack?.amendments?.records ?? []).find((/** @type {any} */ r) => r.docID === pack.amendments.effectiveDocID);
  if (effective?.classification === "financial-change") {
    out.push(`訂正有報（${effective.docID}）で数値が原本から変わっている。値は訂正後のもの（主要財務 ${effective.comparedToBase?.differenceCount ?? 0} 件、その他 ${effective.numericFactsChanged} 件）`);
  }

  return out;
}
