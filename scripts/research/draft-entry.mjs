/**
 * Write the mechanical half of a company entry, so a researcher spends its
 * tokens only on the half that needs judgement.
 *
 *   node scripts/research/draft-entry.mjs <company-id> [more-ids …]
 *
 * Emits `<pack>/draft-entry.json` containing the fields that are
 * already settled by the filing: 証券コード, 商号, 英訳名, and the full five-year
 * financials block — all six figures per year with the filer's own labels and
 * the accounting standard from the DEI header.
 *
 * Every value here is copied from the filing's XBRL tags and is re-checked
 * afterwards by verify-financials.mjs, so this removes transcription, not
 * verification. What it deliberately does NOT write is anything requiring
 * judgement: the 3-second description, the business structure, the business
 * model, history, industries, sources, and `revenueBasis`/`netIncomeBasis`/
 * `note` — a scope change or a restatement still has to be reasoned about
 * against the filing, and the researcher does that.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "./edinet.mjs";

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("usage: node scripts/research/draft-entry.mjs <company-id> [more-ids …]");
  process.exit(1);
}

const STANDARD = { IFRS: "ifrs", "Japan GAAP": "jgaap", "US GAAP": "usgaap" };

/** Which accounting standard a tagged element belongs to. */
const standardOf = (element) => (/IFRS/.test(element) ? "ifrs" : /USGAAP/.test(element) ? "usgaap" : "jgaap");
const RANK = { ifrs: 3, usgaap: 2, jgaap: 1 };

/**
 * The value and printed label for one fiscal year, from the pack's series.
 *
 * `standard` matters more than it looks. A filer in the year it changed
 * standards prints BOTH tables, so the same fiscal year has an IFRS 売上収益 and
 * a J-GAAP 売上高, an IFRS 税引前利益 and a J-GAAP 経常利益, and so on. Taking
 * whichever series happened to come first per field built rows that mixed the
 * two — いすゞ's 2024/2025 rows had IFRS revenue beside J-GAAP equity, and
 * 純資産 then appeared to fall by 127 billion yen between 2025 and 2026 purely
 * because the row changed from 純資産額 (including non-controlling interests) to
 * 親会社の所有者に帰属する持分. Every figure in a row now comes from one standard.
 *
 * Revenue and net income carry their amount as `yen`, the four series added
 * later as `value`; reading only one of the two silently produced entries with
 * no revenue at all, because JSON.stringify drops undefined.
 */
function at(series, periodEnd, standard = null) {
  const covering = (series ?? []).filter((s) => s.years.some((y) => y.fiscalYearEnd === periodEnd));
  const preferred = standard ? covering.filter((s) => standardOf(s.element) === standard) : covering;
  const chosen = (preferred.length > 0 ? preferred : covering)[0];
  if (!chosen) return { value: null, label: null, standard: null };
  const y = chosen.years.find((y) => y.fiscalYearEnd === periodEnd);
  return { value: y.value ?? y.yen ?? null, label: chosen.label, standard: standardOf(chosen.element) };
}

/**
 * The standard a fiscal year is reported on: the highest-ranked one whose top
 * line covers that year. A company that has moved to IFRS reports the overlap
 * years on both, and the entry follows the basis the company reports on now —
 * the same choice スズキ's researcher made and recorded.
 */
/**
 * EDINET stores cover-page names with Latin letters and digits in their full-width
 * forms — 「株式会社ＡＤＥＫＡ」, 「ＡＦＣ－ＨＤアムスライフサイエンス」 — which is a
 * storage convention, not how the company writes itself or how a reader searches
 * for it. Only the alphanumerics are narrowed: 「（旧会社名…）」 keeps its full-width
 * brackets, because those are Japanese punctuation and half-width ones would be
 * wrong beside Japanese text.
 */
function narrowLatin(value) {
  return value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

/** The few entities EDINET leaves in the cover-page text. Names, not markup. */
function decodeEntities(value) {
  if (typeof value !== "string") return value ?? null;
  return narrowLatin(value)
    .replace(/&amp;/gi, "&")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&quot;/gi, String.fromCharCode(34))
    .replace(/&(?:apos|#39);/gi, String.fromCharCode(39))
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function standardForYear(revenueSeries, periodEnd) {
  const covering = (revenueSeries ?? []).filter((s) => s.years.some((y) => y.fiscalYearEnd === periodEnd));
  return covering.map((s) => standardOf(s.element)).sort((a, b) => RANK[b] - RANK[a])[0] ?? null;
}

for (const id of ids) {
  const packPath = join(cacheDir(), "evidence", id, "summary.json");
  if (!existsSync(packPath)) {
    console.error(`${id}: no evidence pack`);
    continue;
  }
  const pack = JSON.parse(readFileSync(packPath, "utf8"));
  const cover = pack.coverPage ?? {};
  const standard = STANDARD[cover["会計基準、DEI"]] ?? null;

  // Fiscal years come from the revenue series: it is the one row every filing
  // carries for all five years.
  const years = [...new Set((pack.figures.revenue ?? []).flatMap((s) => s.years.map((y) => y.fiscalYearEnd)))].sort();

  /**
   * The id every row cites for the filing this pack was built from, named after
   * ITS fiscal year rather than the calendar year the pipeline happens to run in.
   * ヤマハ発動機 closes in December, so its 有報 covers 2025年12月期; the id was
   * hardcoded "yuho-2026", and the entry ended up citing a source that no source
   * declared. It surfaced only because all six agents independently wrote
   * yuho-2025 — the filing's own year — and the assembler refused the mismatch.
   */
  const filingSourceId = `yuho-${(years.at(-1) ?? pack.filing?.resolvedPeriodEnd ?? "").slice(0, 4)}`;

  const mixed = [];
  const financials = years.map((periodEnd) => {
    const yearStandard = standardForYear(pack.figures.revenue, periodEnd) ?? standard;
    const revenue = at(pack.figures.revenue, periodEnd, yearStandard);
    const profit = at(pack.figures.profit, periodEnd, yearStandard);
    const netIncome = at(pack.figures.netIncome, periodEnd, yearStandard);
    const totalAssets = at(pack.figures.totalAssets, periodEnd, yearStandard);
    const netAssets = at(pack.figures.netAssets, periodEnd, yearStandard);
    // Standard-specific too: a filer printing both a J-GAAP and an IFRS table
    // reports each table's own consolidation scope (東京海上HD: 51,717 vs 67,526).
    const employees = at(pack.figures.employees, periodEnd, yearStandard);
    // If some figure could only be found on another basis, say so rather than
    // letting a silently mixed row through.
    for (const [name, f] of [["利益", profit], ["総資産", totalAssets], ["純資産", netAssets]]) {
      if (f.standard && f.standard !== yearStandard) mixed.push(`${periodEnd} ${name}: ${f.standard}（この年度は${yearStandard}）`);
    }
    const [y, m] = periodEnd.split("-");
    return {
      fiscalYear: `${y}年${Number(m)}月期`,
      periodEnd,
      revenue: revenue.value,
      revenueLabel: revenue.label,
      profit: profit.value,
      profitLabel: profit.label,
      netIncome: netIncome.value,
      netIncomeLabel: netIncome.label,
      totalAssets: totalAssets.value,
      totalAssetsLabel: totalAssets.label,
      netAssets: netAssets.value,
      netAssetsLabel: netAssets.label,
      employees: employees.value,
      currency: "JPY",
      accountingStandard: yearStandard,
      // A filer with no subsidiaries publishes no consolidated statements, so its
      // 主要な経営指標等の推移 is the parent company alone. Every other entry on the
      // site is consolidated, and the reader cannot see the difference from the
      // figures — so it is stated here, on every year, which is also what the
      // integrity rule requires (all years or none).
      ...(pack.figures.nonConsolidated
        ? {
            revenueBasis: "提出会社単体（連結子会社がなく連結財務諸表を作成していないため）",
            netIncomeBasis: "提出会社単体（連結子会社がなく連結財務諸表を作成していないため）",
          }
        : {}),
      sourceIds: [filingSourceId],
    };
  });

  const draft = {
    id,
    code: pack.securitiesCode,
    // EDINET serves the cover page with HTML entities intact, so 秋川牧園's English
    // name arrives as "AKIKAWA FOODS &amp; FARMS CO., LTD." — which would be shown
    // to a reader exactly like that. These are names, not markup.
    officialName: decodeEntities(cover["会社名、表紙"]),
    nameEn: decodeEntities(cover["英訳名、表紙"]),
    _上場金融商品取引所名: cover["上場金融商品取引所名又は登録認可金融商品取引業協会名"] ?? null,
    _決算期: pack.filing.resolvedPeriodEnd,
    _有報: `${pack.filing.docDescription} (docID ${pack.filing.docID})`,
    _確認すること: [
      "revenueLabel / netIncomeLabel を indicators.txt の印字と突き合わせること",
      "accountingStandard は年度ごとに確認すること（会計基準を変更した会社は年で異なる）",
      "fiscalYear の表記が会社の使い方と合っているか（2月期・8月期・3月20日決算などに注意）",
      "revenueBasis / netIncomeBasis / note は自分で判断して書き足すこと（このファイルには入っていない）",
    ],
    financials,
  };
  if (mixed.length > 0) draft._会計基準がそろわない項目 = mixed;

  // Beside the evidence pack, never in src/data/companies: anything that globs
  // that directory (the integrity suite, verify-all) would otherwise pick up a
  // half-finished draft as though it were a published entry.
  const out = join(cacheDir(), "evidence", id, "draft-entry.json");
  writeFileSync(out, `${JSON.stringify(draft, null, 2)}\n`);
  console.log(`${id}: ${financials.length} 年分 → ${out}`);
}
