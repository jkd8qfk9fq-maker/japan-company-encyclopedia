/**
 * Checks a company entry's figures against the filing's own tagged XBRL.
 *
 *   node scripts/research/verify-financials.mjs <company-id>
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
 * Net income is profit attributable to the owners of the parent, and its label
 * has to say so: 「当期純利益」 alone is the line that still includes
 * non-controlling interests, and a reader cannot tell the two apart.
 */
const PARENT_ATTRIBUTION = /(親会社株主に帰属|親会社の所有者に帰属|当社株主に帰属|当社の所有者に帰属)/;
/** A top line is 〜高 / 〜収益 / 〜収入 — never a profit row, never a truncation. */
const TOP_LINE_ENDING = /(高|収益|収入)$/;

const companyId = process.argv[2];
if (!companyId) {
  console.error("usage: node scripts/research/verify-financials.mjs <company-id>");
  process.exit(1);
}

const entry = JSON.parse(readFileSync(join(process.cwd(), "src/data/companies", `${companyId}.json`), "utf8"));
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

const revenue = index(evidence.figures.revenue);
const netIncome = index(evidence.figures.netIncome);
const problems = [];
let checked = 0;

for (const row of entry.financials) {
  for (const [kind, stored, tagged, label] of [
    ["売上", row.revenue, revenue, row.revenueLabel],
    ["純利益", row.netIncome, netIncome, row.netIncomeLabel],
  ]) {
    const candidates = tagged.get(row.periodEnd);
    if (!candidates) {
      problems.push(`${row.fiscalYear} ${kind}: この決算期 (${row.periodEnd}) は有報のXBRLに含まれていません`);
      continue;
    }
    if (stored === null) {
      problems.push(`${row.fiscalYear} ${kind}: 空欄ですが、XBRLには ${candidates[0].yen.toLocaleString("ja-JP")} 円 があります`);
      continue;
    }
    checked++;
    if (!candidates.some((c) => c.yen === stored)) {
      problems.push(
        `${row.fiscalYear} ${kind}: 記載 ${stored.toLocaleString("ja-JP")} 円 ≠ XBRL ${candidates.map((c) => `${c.yen.toLocaleString("ja-JP")}（${c.label}）`).join(" / ")}`,
      );
      continue;
    }
    // The label must be printed in the filing's own 主要な経営指標等の推移.
    if (indicators && !indicators.includes(normalize(label))) {
      problems.push(`${row.fiscalYear} ${kind}: ラベル「${label}」が有報の主要な経営指標等の推移に見当たりません`);
    }
    // The printed table runs labels into their figures, so the check above cannot
    // tell a label from a shorter piece of one. These two rules cover the
    // difference that would actually mislead a reader.
    if (kind === "純利益" && !PARENT_ATTRIBUTION.test(label)) {
      problems.push(
        `${row.fiscalYear} 純利益: ラベル「${label}」に親会社帰属の明示がありません。` +
          `非支配株主分を含む当期純利益と区別できないため、有報の表記をそのまま使うこと`,
      );
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
  const d = [...restatement.revenue.differences, ...restatement.netIncome.differences];
  console.log(
    d.length === 0
      ? `前期有報との比較: ${restatement.revenue.comparedRows + restatement.netIncome.comparedRows} 行一致（修正再表示なし）`
      : `前期有報との差異（修正再表示の可能性・要記録）: ${JSON.stringify(d)}`,
  );
}
for (const warning of evidence.warnings ?? []) console.log(`注意: ${warning}`);
if (problems.length > 0) {
  console.error(`\n不一致 ${problems.length} 件:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("すべて一致しました。");
