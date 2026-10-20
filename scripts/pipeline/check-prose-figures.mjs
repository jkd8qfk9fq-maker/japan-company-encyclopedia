/**
 * Every monetary figure written in an entry's prose must be in the filing.
 *
 *   node scripts/pipeline/check-prose-figures.mjs <company-id> [--entry <path>]
 *   node scripts/pipeline/check-prose-figures.mjs <company-id> --fragments
 *
 * verify-financials.mjs checks the `financials` rows against the XBRL tags. It
 * cannot see the figures an agent writes into a sentence — 「2026年3月期の外部顧客
 * への売上高は2,517億71百万円」 — and those are most of the numbers a reader
 * actually reads. This closes that gap mechanically: pull every 円 amount out of
 * the prose, convert 兆・億・百万 to 百万円, and require it to appear in the
 * evidence pack's own text.
 *
 * A figure passes if EITHER the expression appears in the filing verbatim (the
 * filing's own rounded wording, e.g. 「725億円」) OR its value in 百万円 does (the
 * agent reformatted 251,771百万円 as 2,517億71百万円, which is the house style).
 * Only a figure that is neither is reported: that is a number with no printed
 * source, which is the one thing no amount of careful writing can excuse.
 *
 * Two things it cannot settle, so a human still reads the sentence: a round
 * amount (1,000百万円 → "1000") will almost always appear somewhere in the pack
 * by coincidence, and an amount written with no unit can only be matched against
 * the filing's exact printing.
 *
 * Exit 0 when every figure is accounted for.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "../research/edinet.mjs";
import { fragmentFiles, loadState } from "./company-state.mjs";
import { updateScope } from "./update-scope.mjs";

const companyId = process.argv[2];
if (!companyId) {
  console.error("usage: node scripts/pipeline/check-prose-figures.mjs <company-id> [--entry <path>] [--fragments]");
  process.exit(1);
}
const entryFlag = process.argv.indexOf("--entry");
const useFragments = process.argv.includes("--fragments");

const packDir = join(cacheDir(), "evidence", companyId);
if (!existsSync(packDir)) {
  console.error(`${companyId}: 証拠パックがありません（${packDir}）`);
  process.exit(1);
}

/** The filing's own text, with separators removed so 1,370,304 and 1370304 match. */
const packText = readdirSync(packDir)
  .filter((f) => f.endsWith(".txt") || f === "sections.json")
  .map((f) => readFileSync(join(packDir, f), "utf8"))
  .join("\n")
  .normalize("NFKC")
  .replace(/[,\s、]/g, "");

/**
 * Prose an agent wrote, as one string. Identifiers, labels and the mechanical
 * financials are excluded: their figures are verified elsewhere, and a
 * `fiscalYear` like 「2026年3月期」 is not an amount.
 */
function proseOf(source) {
  const out = [];
  const push = (v) => typeof v === "string" && v.length > 0 && out.push(v);
  const business = (b) => {
    push(b.description);
    (b.children ?? []).forEach(business);
  };
  push(source.description);
  (source.businesses ?? []).forEach(business);
  if (source.businessModel) {
    push(source.businessModel.description);
    (source.businessModel.flow ?? []).forEach((s) => push(s.description));
  }
  for (const h of source.history ?? []) {
    push(h.description);
    push(h.significance);
  }
  for (const r of source.relatedCompanies ?? []) push(r.description);
  for (const f of source.financials ?? []) push(f.note);
  // A fragment carries its notes unmerged (see merge-fragments applyFinancialNotes).
  for (const n of source.financialNotes ?? []) push(n?.note);
  for (const n of source.businessModel?.financialNotes ?? []) push(n?.note);
  return out.join("\n").normalize("NFKC");
}

/*
  During an update (update-scope.mjs) only the rewritten part is checked against this pack, which is the NEW filing.
  The kept part is the published text, checked against its own filing when it was registered; its amounts are that
  year's and would not be found here. Said in the output, so a reader of the report knows what was not looked at.
*/
const scope = updateScope(loadState(companyId).identity);
let prose;
let financials;
if (useFragments) {
  const dir = join(process.cwd(), "pipeline/results");
  const bodies = fragmentFiles(companyId, dir).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
  const kept = bodies.filter((b) => b.retained);
  if (kept.length > 0) console.log(`${companyId}: 公開中の文章を引き継いだ成果物 ${kept.length} 件は照合しない（前の有報で照合済み）`);
  prose = bodies.filter((b) => !b.retained).map((b) => proseOf(b.data ?? {})).join("\n");
  // A fragment carries no financials — the five-year table is mechanical, and the
  // draft is where it lives until the entry is assembled.
  financials = JSON.parse(readFileSync(join(packDir, "draft-entry.json"), "utf8")).financials ?? [];
} else {
  const path = entryFlag !== -1 && process.argv[entryFlag + 1] ? process.argv[entryFlag + 1] : `src/data/companies/${companyId}.json`;
  const entry = JSON.parse(readFileSync(join(process.cwd(), path), "utf8"));
  if (scope) {
    console.log(`${companyId}: 更新中。照合するのは書き直した部分（${[...scope.fields].join("・")}${scope.notes ? "・財務の注記" : ""}）だけ`);
    prose = proseOf({
      ...Object.fromEntries([...scope.fields].map((f) => [f, entry[f]])),
      financials: scope.notes ? entry.financials : [],
    });
  } else prose = proseOf(entry);
  financials = entry.financials ?? [];
}

/**
 * 「6兆2,929億67百万円」「3,553億41百万円」「1,370,304百万円」「725億円」「1,000千円」
 * 「186.1兆円」— 兆・億のような大きな単位は小数第1位までに丸めて書かれることがある
 * （有報の表そのものではなく、agentが要約するときの house style）。単位グループごとに
 * 小数点を許可しないと、小数点の直後の1桁だけが「1兆円」のように切り出され、しかも
 * `packText.includes("1000000")` は巨大な有報の中でほぼ必ず偶然一致するため、誤った
 * 値のまま黙って通っていた。
 */
const AMOUNT = /(?:([\d,]+(?:\.\d+)?)兆)?(?:([\d,]+(?:\.\d+)?)億)?(?:([\d,]+(?:\.\d+)?)百万)?(?:([\d,]+(?:\.\d+)?)万)?(?:([\d,]+(?:\.\d+)?)千)?([\d,]+)?円/g;
const digits = (s) => (s ? Number(s.replace(/,/g, "")) : 0);

const problems = [];
let checked = 0;
const seen = new Set();

for (const m of prose.matchAll(AMOUNT)) {
  const [expression, cho, oku, million, man, sen] = m;
  // Every unit group is optional, so a 千円 amount used to match as the single
  // character 「円」 — and `packText.includes("円")` is always true, so the whole
  // class passed unread while being counted as checked. A match with no digit in
  // it is not an amount.
  if (!/\d/.test(expression)) continue;
  if (seen.has(expression)) continue;
  seen.add(expression);
  checked++;

  // The filing's own wording, separators stripped.
  if (packText.includes(expression.normalize("NFKC").replace(/[,\s]/g, ""))) continue;

  // 「1,000千円」 and 「34,961,619,000円」 have nothing that converts to a whole
  // number of 百万円, so the filing's exact printing above is the only test there
  // is. Filings do print capital in 千円 — in the 沿革 and in 関係会社の状況.
  // 万 joins 千 and the unit-less form: 「200万円」 is 2百万円 but 「50万円」 is not a
  // whole one, so the filing's exact printing is the only test for them. Before
  // this, 万 was no unit group at all and every such amount matched as the bare
  // character 「円」, which meant it was counted as checked and never read.
  if (!cho && !oku && !million) {
    const kind = man ? "万円額" : sen ? "千円額" : "単位のない円額";
    problems.push(`${expression}（${kind}。有報の印字どおりでないと照合できません）が有報の本文に見当たりません`);
    continue;
  }

  // Or the same amount expressed in 百万円, which is the unit every 有報 table uses.
  // Math.round: 「186.1兆円」→ digits(cho) is 186.1, and 186.1 * 1_000_000 is not
  // exact in floating point (186100000.00000003) — round before formatting, or the
  // string comparison below never matches even a genuinely correct figure.
  const inMillions = Math.round(digits(cho) * 1_000_000 + digits(oku) * 100 + digits(million));
  if (packText.includes(String(inMillions))) continue;

  problems.push(`${expression}（${inMillions.toLocaleString("ja-JP")}百万円として照合）が有報の本文に見当たりません`);
}

/**
 * The fiscal-year labels, which neither check looked at.
 *
 * Two of every batch so far end their year somewhere other than March, and the
 * prose repeats the label in nearly every sentence — so writing 「2026年3月期」 for
 * a June filer would ship silently. The labels the mechanical draft built from
 * the filing's own five-year table are the authority.
 */
const knownYears = new Set(financials.map((f) => f.fiscalYear));
for (const m of new Set([...prose.matchAll(/\d{4}年\d{1,2}月期/g)].map((x) => x[0]))) {
  if (knownYears.has(m)) continue;
  if (packText.includes(m.replace(/[,\s]/g, ""))) continue;
  problems.push(`決算期「${m}」がこの会社の決算期（${[...knownYears].join("・")}）にも有報の本文にもありません`);
}

console.log(`${companyId}: 本文の金額 ${checked} 件を照合`);
if (problems.length > 0) {
  console.error(`\n裏付けの取れない金額 ${problems.length} 件:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("すべて有報の印字に一致しました。");
