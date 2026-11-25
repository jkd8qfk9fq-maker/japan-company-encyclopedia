/**
 * Add the two Q3 facts (JCE-110, 「何に力を入れているか」) to registered entries, from filings they already cite:
 * - `segmentRevenue.capex` — capex by segment, from the filing the segment table cites (segment-revenue.mjs
 *   segmentCapexBlock: one element closing against the filing's total, every business covered, a dash not a zero);
 * - `researchAndDevelopment` — the group's R&D for the newest financial year, from the filing that year cites
 *   (research-development.mjs: the consolidated printed total, below the year's revenue).
 *
 *   node scripts/pipeline/backfill-q3.mjs [--tier published|all] [--limit N] [--ids a,b] [--write] [--summary out.md]
 *
 * Never a newer filing (refresh-financials' job). All-or-nothing per fact; the reason is logged and nothing guessed.
 * Dry run unless --write. Facts-layer writes only (ownership.mjs). Needs EDINET_API_KEY.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { downloadDocument, readCsvRows, scrubSecrets } from "../research/edinet.mjs";
import { assertMachineWrite } from "./ownership.mjs";
import { researchDevelopmentFact } from "./research-development.mjs";
import { labelDocumentsFor, memberLabels, segmentCapexBlock } from "./segment-revenue.mjs";

const arg = (name, fallback = null) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : fallback;
};
const write = process.argv.includes("--write");
const tier = arg("tier", "published");
const limit = Number(arg("limit", "100000"));
const ids = arg("ids") ? new Set(arg("ids").split(",").map((s) => s.trim())) : null;

const dir = join(process.cwd(), "src/data/companies");
const read = (id) => JSON.parse(readFileSync(join(dir, `${id}.json`), "utf8"));

/** The EDINET document id one of the given sources names, or null. */
function docOf(entry, sourceIds) {
  for (const id of sourceIds) {
    const source = entry.sources.find((s) => s.id === id);
    const docID = source?.docId ?? source?.url?.match(/\/(S[0-9A-Z]{7})\.pdf$/)?.[1];
    if (docID) return docID;
  }
  return null;
}

/** @type {Map<string, Record<string, string>[]>} */
const rowCache = new Map();
async function rowsOf(docID) {
  if (!rowCache.has(docID)) {
    const zip = await downloadDocument(docID, 5);
    if (!zip) throw new Error(`EDINET が CSV を返さなかった（${docID}）`);
    rowCache.clear(); // one company at a time: keep memory flat over ~3,000 entries
    rowCache.set(docID, readCsvRows(zip));
  }
  return /** @type {Record<string, string>[]} */ (rowCache.get(docID));
}

const latestOf = (entry) => [...entry.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);

const candidates = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((id) => !ids || ids.has(id))
  .map((id) => ({ id, entry: read(id) }))
  .filter(({ entry }) => tier === "all" || entry.status.state === "published")
  .filter(({ entry }) => (entry.segmentRevenue && entry.segmentRevenue.items.length >= 2 && !entry.segmentRevenue.capex) || (!entry.researchAndDevelopment && latestOf(entry)))
  .slice(0, limit);

const counts = { capex: 0, rnd: 0, failed: 0 };
/** @type {Map<string, number>} */
const reasons = new Map();
const note = (r) => {
  const key = r.replace(/事業 \S+ /, "事業 … ").replace(/「[^」]*」/g, "「…」").replace(/ \(.*\)$/, "");
  reasons.set(key, (reasons.get(key) ?? 0) + 1);
};
const lines = [];
for (const { id, entry } of candidates) {
  try {
    let next = entry;
    const seg = entry.segmentRevenue;
    if (seg && seg.items.length >= 2 && !seg.capex) {
      const docID = docOf(entry, seg.sourceIds);
      if (!docID) note("設備投資: 事業別の売上の出典に書類 ID がない");
      else {
        const block = segmentCapexBlock(await rowsOf(docID), memberLabels(await labelDocumentsFor(docID)), entry.businesses, seg);
        if ("problem" in block) note(block.problem);
        else {
          next = { ...next, segmentRevenue: { ...next.segmentRevenue, capex: block } };
          counts.capex++;
        }
      }
    }
    const latest = latestOf(entry);
    if (!entry.researchAndDevelopment && latest) {
      const docID = docOf(entry, latest.sourceIds);
      if (!docID) note("研究開発費: 最新期の出典に書類 ID がない");
      else {
        const fact = researchDevelopmentFact(await rowsOf(docID), latest.revenue);
        if ("problem" in fact) note(fact.problem);
        else {
          const sourceId = latest.sourceIds.find((s) => docOf(entry, [s]) === docID);
          next = { ...next, researchAndDevelopment: { fiscalYear: latest.fiscalYear, periodEnd: latest.periodEnd, label: fact.label, amount: fact.amount, sourceIds: [sourceId], locator: fact.locator } };
          counts.rnd++;
        }
      }
    }
    if (next !== entry) {
      assertMachineWrite(entry, next, "backfill-q3");
      if (write) writeFileSync(join(dir, `${id}.json`), `${JSON.stringify(next, null, 2)}\n`);
    }
  } catch (error) {
    counts.failed++;
    lines.push(`- ${id}: 失敗 ${scrubSecrets(String(error.message)).slice(0, 160)}`);
  }
}

const summary = [
  `## 事業別の設備投資・研究開発費の追加（JCE-110 Q3、${write ? "書き込み" : "試行"}）`,
  "",
  `対象 ${candidates.length} 社: 事業別の設備投資 ${counts.capex}・研究開発費 ${counts.rnd}・失敗 ${counts.failed}`,
  "",
  "追加しなかった理由（推測では埋めない）:",
  ...[...reasons].sort((a, b) => b[1] - a[1]).map(([r, n]) => `- ${r}: ${n} 件`),
  "",
  ...lines.slice(0, 200),
].join("\n");
console.log(summary);
const out = arg("summary");
if (out) writeFileSync(out, `${summary}\n`);
