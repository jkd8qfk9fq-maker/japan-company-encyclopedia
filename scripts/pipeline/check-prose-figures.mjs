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
  return out.join("\n").normalize("NFKC");
}

let prose;
if (useFragments) {
  const dir = join(process.cwd(), "pipeline/results");
  const parts = readdirSync(dir)
    .filter((f) => f.startsWith(`${companyId}-`) && f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")).data ?? {});
  prose = parts.map(proseOf).join("\n");
} else {
  const path = entryFlag !== -1 && process.argv[entryFlag + 1] ? process.argv[entryFlag + 1] : `src/data/companies/${companyId}.json`;
  prose = proseOf(JSON.parse(readFileSync(join(process.cwd(), path), "utf8")));
}

/** 「6兆2,929億67百万円」「3,553億41百万円」「244億53百万円」「1,370,304百万円」「725億円」 */
const AMOUNT = /(?:([\d,]+)兆)?(?:([\d,]+)億)?(?:([\d,]+)百万)?([\d,]+)?円/g;
const digits = (s) => (s ? Number(s.replace(/,/g, "")) : 0);

const problems = [];
let checked = 0;
const seen = new Set();

for (const m of prose.matchAll(AMOUNT)) {
  const [expression, cho, oku, million] = m;
  if (seen.has(expression)) continue;
  seen.add(expression);
  checked++;

  // The filing's own wording, separators stripped.
  if (packText.includes(expression.normalize("NFKC").replace(/[,\s]/g, ""))) continue;

  // A bare 「34,961,619,000円」 has no 兆/億/百万 to convert — and converting it
  // would not give a whole number of 百万円 — so the filing's exact printing above
  // is the only test there is. Skipping these instead (the first version did)
  // let a whole class of amount through unchecked.
  if (!cho && !oku && !million) {
    problems.push(`${expression}（単位のない円額。有報の印字どおりでないと照合できません）が有報の本文に見当たりません`);
    continue;
  }

  // Or the same amount expressed in 百万円, which is the unit every 有報 table uses.
  const inMillions = digits(cho) * 1_000_000 + digits(oku) * 100 + digits(million);
  if (packText.includes(String(inMillions))) continue;

  problems.push(`${expression}（${inMillions.toLocaleString("ja-JP")}百万円として照合）が有報の本文に見当たりません`);
}

console.log(`${companyId}: 本文の金額 ${checked} 件を照合`);
if (problems.length > 0) {
  console.error(`\n裏付けの取れない金額 ${problems.length} 件:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log("すべて有報の印字に一致しました。");
