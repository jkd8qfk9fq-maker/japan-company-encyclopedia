/**
 * Checks a company entry's figures against the filing's own tagged XBRL.
 *
 *   node scripts/research/verify-financials.mjs <company-id> [--entry <path>]
 *
 * `--entry` points the check at an entry that is not (yet) registered — the
 * pipeline stages an assembled entry under pipeline/staging/ and gates it there,
 * so a wrong figure never reaches src/data/companies in the first place.
 *
 * Every `financials` row must equal the value EDINET serves for that fiscal
 * year, to the yen. This replaces the throwaway comparison script each
 * research agent used to write, and it is stricter: it compares against the
 * filing's tags, not against text scraped out of a PDF.
 *
 * Exit code 0 = every row matches. Anything else is a failure to fix, never
 * to explain away.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "./edinet.mjs";

/** Compare Japanese labels without tripping over width or spacing differences. */
const normalize = (s) => s.normalize("NFKC").replace(/\s+/g, "");

/**
 * A filing can shorten a row label by dropping the loss alternative: the
 * 第49期 report of クラウディアホールディングス prints 「経常利益又は経常損失（△）」
 * while its 第50期 prints just 「経常利益」 for the very same row (JCE-095). The
 * stored label is the wording of the filing it was registered from and is never
 * rewritten, so the printed-table check also accepts the label with that
 * trailing alternative removed. Only that suffix is forgiven — it must start
 * with 「又は」 and end with 「（△）」 at the very end of the label; any other
 * wording difference still fails.
 */
const LOSS_ALTERNATIVE = /又は.*\(△\)$/;
const labelIsPrinted = (table, label) => {
  const printed = normalize(label);
  if (table.includes(printed)) return true;
  const shortened = printed.replace(LOSS_ALTERNATIVE, "");
  return shortened.length > 0 && shortened !== printed && table.includes(shortened);
};

/**
 * Net income is profit attributable to the owners of the parent, and its label
 * has to say so: 「当期純利益」 alone is the line that still includes
 * non-controlling interests, and a reader cannot tell the two apart.
 *
 * Filers word the attribution differently — 親会社株主, 親会社の所有者, 当社株主,
 * 当社の所有者, and NTT's plain 「当社に帰属する当期利益」, whose tagged element is
 * ProfitLossAttributableToOwnersOfParentIFRS all the same. All are accepted.
 */
/**
 * …or 「持分」 instead of 「帰属」: some filers print 「当期利益(親会社株主持分)」, which
 * names the parent's shareholders just as plainly and is the fourth wording this
 * rule has had to learn.
 */
const PARENT_ATTRIBUTION = /((親会社|当社)の?(株主|所有者)に?帰属|当社に帰属|(親会社|当社)(株主|所有者)持分)/;
/**
 * The one element that names the TOTAL bottom line — 当期利益 including
 * non-controlling interests. It can appear among the pack's netIncome
 * candidates only via the extractor's last-resort fallback (JCE-039), which
 * fires solely when the filer's five-year table tags no parent-attributable
 * row at all, so its presence here is itself the proof of that condition.
 */
const TOTAL_PROFIT_ELEMENT = /(^|:)ProfitLossIFRSSummaryOfBusinessResults$/;
/** The disclosure the exception below demands, in the entry row's own note. */
const TOTAL_PROFIT_DISCLOSURE = /非支配株主/;
/**
 * …but never the comprehensive-income row, which sits directly beneath net income
 * in these tables and is worded almost identically (NTT prints both
 * 「当社に帰属する当期利益」 and 「当社に帰属する当期包括利益」).
 */
const COMPREHENSIVE_INCOME = /包括利益/;
/**
 * A top line ends 〜高 / 〜収益 / 〜収入 / 〜計, optionally with a qualifier in
 * parentheses — never a profit row, never a truncation. 「計」 is here because
 * 野村's printed top line is 「収益合計」 and its filing prints no row ending in
 * 高/収益/収入 at all; the rule was forcing a choice between failing the check
 * and writing 「収益」, which is exactly the truncation it exists to stop.
 * 「売上」 still fails, which is the case that matters.
 *
 * The parenthetical is matched in both widths: most filings print （） but
 * 中部電力 and its regulated-utility peers print 「売上高(営業収益)」 with plain
 * ASCII parens, and the half-width-only form rejected every one of their own
 * labels for it.
 */
const TOP_LINE_ENDING = /(高|収益|収入|計)([（(][^）)]*[）)])?$/;

const companyId = process.argv[2];
if (!companyId) {
  console.error("usage: node scripts/research/verify-financials.mjs <company-id> [--entry <path>]");
  process.exit(1);
}

// The pipeline gates an assembled entry before it is registered, so the entry
// being checked is not always the published one.
const entryFlag = process.argv.indexOf("--entry");
const entryPath =
  entryFlag !== -1 && process.argv[entryFlag + 1]
    ? join(process.cwd(), process.argv[entryFlag + 1])
    : join(process.cwd(), "src/data/companies", `${companyId}.json`);
const entry = JSON.parse(readFileSync(entryPath, "utf8"));
const packDir = join(cacheDir(), "evidence", companyId);
const evidence = JSON.parse(readFileSync(join(packDir, "summary.json"), "utf8"));

/**
 * 主要な経営指標等の推移 as the filing prints it. The entry's labels must be the
 * filing's own wording, and this table — not the XBRL taxonomy label — is that
 * wording: the taxonomy calls Sony's top line "売上高（IFRS）" while the filing
 * prints 「売上高及び金融ビジネス収入」.
 */
const indicatorsPath = join(packDir, "indicators.txt");
const indicators = existsSync(indicatorsPath) ? normalize(readFileSync(indicatorsPath, "utf8")) : null;

/** fiscalYearEnd → { yen, label } for every tagged candidate. */
function index(candidates) {
  const map = new Map();
  for (const candidate of candidates) {
    for (const year of candidate.years) {
      if (!map.has(year.fiscalYearEnd)) map.set(year.fiscalYearEnd, []);
      map.get(year.fiscalYearEnd).push({ yen: year.yen, label: candidate.label, element: candidate.element });
    }
  }
  return map;
}

/** A dash year tags no value at all; format it as the filing prints it rather than crash on null. */
const fmtYen = (v) => (v === null || v === undefined ? "－" : v.toLocaleString("ja-JP"));

const revenue = index(evidence.figures.revenue);
const netIncome = index(evidence.figures.netIncome);
const problems = [];
let checked = 0;

/**
 * The pack derives each year's end by shifting the filing's own year end back a
 * year at a time, which is wrong for a company that CHANGED its year end:
 * ニトリ moved from 2月20日 to 3月31日, so its 第50期 really ended 2022-02-20
 * while the pack keys that column 2022-03-31. The entry must carry the true
 * date, so when a row's periodEnd is not among the tagged dates, fall back to
 * matching by position — but only when the row count matches exactly, and say
 * out loud that it happened, so this can never quietly excuse a wrong year.
 */
const taggedDates = [...new Set([...revenue.keys(), ...netIncome.keys()])].sort();
const entryDates = entry.financials.map((r) => r.periodEnd).sort();
const positional =
  taggedDates.length === entryDates.length && entryDates.some((d) => !taggedDates.includes(d))
    ? new Map(entryDates.map((d, i) => [d, taggedDates[i]]))
    : null;
/** The tagged date this row's figures should be compared against. */
const taggedDateFor = (periodEnd) => (taggedDates.includes(periodEnd) ? periodEnd : (positional?.get(periodEnd) ?? periodEnd));
if (positional) {
  const remapped = [...positional].filter(([a, b]) => a !== b).map(([a, b]) => `${a}→${b}`);
  console.log(`注意: 決算期の変更により、次の年度はXBRLの派生日付に読み替えて照合しました（${remapped.join(", ")}）`);
}

for (const row of entry.financials) {
  for (const [kind, stored, tagged, label] of [
    ["売上", row.revenue, revenue, row.revenueLabel],
    ["純利益", row.netIncome, netIncome, row.netIncomeLabel],
  ]) {
    const candidates = tagged.get(taggedDateFor(row.periodEnd));
    if (!candidates) {
      // Absent on both sides is a match here too: a first consolidated year
      // consolidated for the balance sheet only prints 「－」 for the year,
      // and the XBRL element does not tag the period at all (リッジアイ
      // 第9期）. Only a stored value against an untagged period is a problem.
      if (stored === null) continue;
      problems.push(`${row.fiscalYear} ${kind}: この決算期 (${row.periodEnd}) は有報のXBRLに含まれていません`);
      continue;
    }
    if (stored === null) {
      // Absent on both sides is a match, not a gap: a pre-revenue filer tags
      // its top line as 「－」 for every year (キャンバス), so the tagged
      // candidate itself carries null. Only a stored null against a tagged
      // value is a gap.
      if (candidates.every((c) => c.yen === null || c.yen === undefined)) continue;
      problems.push(
        `${row.fiscalYear} ${kind}: 空欄ですが、XBRLには ${fmtYen(candidates.find((c) => c.yen !== null && c.yen !== undefined)?.yen)} 円 があります`,
      );
      continue;
    }
    checked++;
    if (!candidates.some((c) => c.yen === stored)) {
      problems.push(
        `${row.fiscalYear} ${kind}: 記載 ${stored.toLocaleString("ja-JP")} 円 ≠ XBRL ${candidates.map((c) => `${fmtYen(c.yen)}（${c.label}）`).join(" / ")}`,
      );
      continue;
    }
    // The label must be printed in the filing's own 主要な経営指標等の推移.
    if (indicators && !labelIsPrinted(indicators, label)) {
      problems.push(`${row.fiscalYear} ${kind}: ラベル「${label}」が有報の主要な経営指標等の推移に見当たりません`);
    }
    // The printed table runs labels into their figures, so the check above cannot
    // tell a label from a shorter piece of one. These two rules cover the
    // difference that would actually mislead a reader.
    // A company with no subsidiaries has no non-controlling interests, so its
    // 「当期純利益」 is already unambiguous and the filing prints no attribution
    // wording to copy. Requiring one would reject every single-entity filer —
    // most small caps — over a distinction that does not exist for them.
    if (kind === "純利益" && !evidence.figures.nonConsolidated && !PARENT_ATTRIBUTION.test(label)) {
      // The narrow exception (operator decision 2026-11-25, JCE-039): the
      // filer's five-year table prints no parent-attributable row, so the
      // bottom line can only be the total 当期利益. It is admitted under its
      // own printed label — never reworded to suggest attribution — and only
      // when the row's note discloses that the figure includes
      // non-controlling interests and differs from the parent-attributable
      // profit. The pack flag plus the matched candidate's element pin the
      // case to the fallback; a filer WITH an attributable row can never
      // reach this branch with the total, because the extractor serves the
      // attributable series instead. Anything else still fails here.
      const matched = candidates.find((c) => c.yen === stored);
      const totalProfitException =
        evidence.figures.netIncomeIsTotalProfit === true &&
        matched !== undefined &&
        TOTAL_PROFIT_ELEMENT.test(matched.element ?? "") &&
        TOTAL_PROFIT_DISCLOSURE.test(row.note ?? "");
      if (!totalProfitException) {
        problems.push(
          `${row.fiscalYear} 純利益: ラベル「${label}」に親会社帰属の明示がありません。` +
            `非支配株主分を含む当期純利益と区別できないため、有報の表記をそのまま使うこと`,
        );
      }
    }
    if (kind === "純利益" && COMPREHENSIVE_INCOME.test(label)) {
      problems.push(`${row.fiscalYear} 純利益: ラベル「${label}」は包括利益の行です。当期純利益の行を使うこと`);
    }
    if (kind === "売上" && (/(利益|損失)/.test(label) || !TOP_LINE_ENDING.test(label))) {
      problems.push(`${row.fiscalYear} 売上: ラベル「${label}」は有報の売上・収益行の表記ではありません`);
    }
  }
}

console.log(`${companyId}: ${checked} 件の数値を有報XBRLと照合`);
console.log(`有報: ${evidence.filing.filerName} ${evidence.filing.docDescription} (docID ${evidence.filing.docID})`);
const restatement = evidence.restatementCheck;
if (restatement?.revenue) {
  // Every series the pack compared, not just revenue and net income.
  const kinds = Object.values(restatement).filter((v) => v && Array.isArray(v.differences));
  const d = kinds.flatMap((v) => v.differences);
  const rows = kinds.reduce((n, v) => n + v.comparedRows, 0);
  // Zero compared rows is not a clean bill of health: it means nothing lined up.
  console.log(
    d.length > 0
      ? `前期有報との差異（修正再表示の可能性・要記録）: ${JSON.stringify(d)}`
      : rows === 0
        ? "前期有報との比較: **突き合わせられる行がない**。一致ではないので、前期有報を直接読んで確認すること"
        : `前期有報との比較: ${rows} 行一致（修正再表示なし）`,
  );
}
/**
 * The four series filled mechanically by backfill-figures.mjs are checked the
 * same way as revenue and net income: every stored figure must still equal a
 * value the filing tags for that fiscal year. A value the filing does not carry
 * must be null — never a number from somewhere else.
 */
let extraChecked = 0;
for (const row of entry.financials) {
  for (const [kind, stored, series] of [
    ["利益", row.profit, evidence.figures.profit],
    ["総資産", row.totalAssets, evidence.figures.totalAssets],
    ["純資産", row.netAssets, evidence.figures.netAssets],
    ["従業員数", row.employees, evidence.figures.employees],
  ]) {
    if (stored === null || stored === undefined) continue;
    const tagged = (series ?? []).flatMap((s) => s.years.filter((y) => y.fiscalYearEnd === taggedDateFor(row.periodEnd)).map((y) => y.value));
    if (tagged.length === 0) {
      problems.push(`${row.fiscalYear} ${kind}: ${stored.toLocaleString("ja-JP")} と記載されていますが、有報のXBRLにこの決算期の値がありません`);
      continue;
    }
    extraChecked++;
    // These labels are shown under the table on the page, so they must be the
    // filing's own wording too — the same rule revenue and net income obey.
    // Without this check a truncated label (「経常利益」 where the filing prints
    // 「経常利益又は経常損失（△）」) reached three drafts unnoticed.
    const shownLabel = { 利益: row.profitLabel, 総資産: row.totalAssetsLabel, 純資産: row.netAssetsLabel }[kind];
    if (shownLabel && indicators && !labelIsPrinted(indicators, shownLabel)) {
      problems.push(`${row.fiscalYear} ${kind}: ラベル「${shownLabel}」が有報の主要な経営指標等の推移に見当たりません`);
    }
    if (!tagged.includes(stored)) {
      problems.push(
        `${row.fiscalYear} ${kind}: 記載 ${stored.toLocaleString("ja-JP")} ≠ XBRL ${tagged.map((v) => v.toLocaleString("ja-JP")).join(" / ")}`,
      );
    }
  }
}
if (extraChecked > 0) console.log(`利益・総資産・純資産・従業員数: ${extraChecked} 件を照合`);

for (const warning of evidence.warnings ?? []) console.log(`注意: ${warning}`);
if (problems.length > 0) {
  console.error(`\n不一致 ${problems.length} 件:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("すべて一致しました。");
