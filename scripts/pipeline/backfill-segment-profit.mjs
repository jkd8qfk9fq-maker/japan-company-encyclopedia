/**
 * Add `segmentRevenue.profit` — each segment's profit and its own sales from the same filing's segment note — to
 * registered entries that already carry `segmentRevenue` (JCE-110, 意味の層 第3段階), so the analysis layer can
 * state which business earns the highest margin.
 *
 *   node scripts/pipeline/backfill-segment-profit.mjs [--tier published|all] [--limit N] [--ids a,b] [--write] [--summary out.md]
 *
 * The filing read is the one the entry's segment table already cites (its source's docID) — the same note, the same
 * year, so the profit sits beside the revenue it was printed with. All-or-nothing (segment-revenue.mjs
 * segmentProfitBlock): exactly one profit measure and one sales element must close against the filing's own totals,
 * and every business of the revenue table must get both; otherwise the entry is left untouched and the reason logged.
 * Dry run unless --write. Every change is a facts-layer write (ownership.mjs). Needs EDINET_API_KEY.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { downloadDocument, readCsvRows, scrubSecrets } from "../research/edinet.mjs";
import { assertMachineWrite } from "./ownership.mjs";
import { labelDocumentsFor, memberLabels, segmentProfitBlock, segmentProfitFacts } from "./segment-revenue.mjs";

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

/** The EDINET document the entry's segment table cites, or why there is none. */
function filingOf(entry) {
  for (const id of entry.segmentRevenue.sourceIds) {
    const source = entry.sources.find((s) => s.id === id);
    const docID = source?.docId ?? source?.url?.match(/\/(S[0-9A-Z]{7})\.pdf$/)?.[1];
    if (docID) return { docID };
  }
  return { problem: "事業別の売上の出典に EDINET の書類 ID がない" };
}

const candidates = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((id) => !ids || ids.has(id))
  .map((id) => ({ id, entry: read(id) }))
  .filter(({ entry }) => entry.segmentRevenue && !entry.segmentRevenue.profit && entry.segmentRevenue.items.length >= 2)
  .filter(({ entry }) => tier === "all" || entry.status.state === "published")
  .slice(0, limit);

const counts = { written: 0, none: 0, skipped: 0, failed: 0 };
/** @type {Map<string, number>} */
const reasons = new Map();
const lines = [];
for (const { id, entry } of candidates) {
  const found = filingOf(entry);
  if (!found.docID) { counts.skipped++; lines.push(`- ${id}: 見送り（${found.problem}）`); continue; }
  try {
    const zip = await downloadDocument(found.docID, 5);
    if (!zip) throw new Error(`EDINET が CSV を返さなかった（${found.docID}）`);
    const rows = readCsvRows(zip);
    const block = segmentProfitBlock(segmentProfitFacts(rows), memberLabels(await labelDocumentsFor(found.docID)), entry.businesses, entry.segmentRevenue);
    if ("problem" in block) {
      counts.none++;
      const key = block.problem.replace(/事業 \S+ /, "事業 … ").replace(/「[^」]*」/g, "「…」");
      reasons.set(key, (reasons.get(key) ?? 0) + 1);
      continue;
    }
    const next = { ...entry, segmentRevenue: { ...entry.segmentRevenue, profit: block } };
    // Appended last in the block, after `previous` (JCE-097 did the same), so the diff is a pure addition.
    assertMachineWrite(entry, next, "backfill-segment-profit");
    if (write) writeFileSync(join(dir, `${id}.json`), `${JSON.stringify(next, null, 2)}\n`);
    counts.written++;
  } catch (error) {
    counts.failed++;
    lines.push(`- ${id}: 失敗 ${scrubSecrets(String(error.message)).slice(0, 160)}`);
  }
}

const summary = [
  `## セグメント利益の追加（JCE-110、${write ? "書き込み" : "試行"}）`,
  "",
  `対象 ${candidates.length} 社: 追加 ${counts.written}・追加なし ${counts.none}・見送り ${counts.skipped}・失敗 ${counts.failed}`,
  "",
  "追加なしの理由（推測では埋めない）:",
  ...[...reasons].sort((a, b) => b[1] - a[1]).map(([r, n]) => `- ${r}: ${n} 社`),
  "",
  ...lines.slice(0, 200),
].join("\n");
console.log(summary);
const out = arg("summary");
if (out) writeFileSync(out, `${summary}\n`);
