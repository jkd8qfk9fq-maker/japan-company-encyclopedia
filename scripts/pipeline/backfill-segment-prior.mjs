/**
 * Add `segmentRevenue.previous` — the prior year's column of the same filing's segment note (JCE-097) — to
 * registered entries that already carry `segmentRevenue`, so the analysis layer's A3 can difference the two
 * years of one document.
 *
 *   node scripts/pipeline/backfill-segment-prior.mjs [--tier published|all] [--limit N] [--ids a,b] [--write]
 *
 * The filing read is the one the entry's segment table already cites (its source's docID) — never a newer
 * one, which is refresh-financials' job, and never the previous filing: the prior column is taken from the
 * same note as the current one, so a restated prior year is the filing's own restatement. The prior block is
 * all-or-nothing (segment-revenue.mjs): a member that maps to no business, a set that does not add up against
 * the filing's own total, or a sum past the prior year's printed revenue leaves the entry untouched. The
 * prior record must end a normal twelve months before the segment year, and where the filing's contexts can
 * be read, the Prior1YearDuration period end must be that record's period end. Dry run unless --write.
 * Every change is a facts-layer write (ownership.mjs). Needs EDINET_API_KEY.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { contextPeriodEnds, downloadDocument, readCsvRows, scrubSecrets } from "../research/edinet.mjs";
import { assertMachineWrite } from "./ownership.mjs";
import { labelDocumentsFor, namedSegmentFacts, priorRecordFor, segmentRevenuePreviousBlock } from "./segment-revenue.mjs";

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
  const seg = entry.segmentRevenue;
  for (const id of seg.sourceIds) {
    const source = entry.sources.find((s) => s.id === id);
    const docID = source?.docId ?? source?.url?.match(/\/(S[0-9A-Z]{7})\.pdf$/)?.[1];
    if (docID) return { docID };
  }
  return { problem: "事業別の売上の出典に EDINET の書類 ID がない" };
}

async function rowsOf(docID) {
  const zip = await downloadDocument(docID, 5);
  if (!zip) throw new Error(`EDINET が CSV を返さなかった（${docID}）`);
  return readCsvRows(zip);
}

const candidates = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((id) => !ids || ids.has(id))
  .map((id) => ({ id, entry: read(id) }))
  .filter(({ entry }) => entry.segmentRevenue && !entry.segmentRevenue.previous)
  .filter(({ entry }) => tier === "all" || entry.status.state === "published")
  .slice(0, limit);

const counts = { written: 0, none: 0, skipped: 0, failed: 0 };
const lines = [];
for (const { id, entry } of candidates) {
  const found = filingOf(entry);
  if (!found.docID) { counts.skipped++; lines.push(`- ${id}: 見送り（${found.problem}）`); continue; }
  const priorYear = priorRecordFor(entry.financials, entry.segmentRevenue.periodEnd);
  if (!priorYear) { counts.skipped++; lines.push(`- ${id}: 見送り（前期のレコードが通常の12か月前にない）`); continue; }
  try {
    // The filing itself states the day its prior-year column ended; where that can be read, it must be the
    // prior record's period end — the one place a wrong pairing would otherwise slip through silently.
    const ends = await contextPeriodEnds(found.docID).catch(() => null);
    const priorEnd = ends?.get("Prior1YearDuration");
    if (priorEnd && priorEnd !== priorYear.periodEnd) { counts.skipped++; lines.push(`- ${id}: 見送り（有報の前期欄の期末 ${priorEnd} が前期レコードの期末 ${priorYear.periodEnd} と異なる）`); continue; }
    const rows = await rowsOf(found.docID);
    const facts = namedSegmentFacts(rows, await labelDocumentsFor(found.docID), "Prior1YearDuration");
    const previous = segmentRevenuePreviousBlock(facts, entry.businesses, priorYear);
    if (!previous) { counts.none++; continue; }
    const next = { ...entry, segmentRevenue: { ...entry.segmentRevenue, previous } };
    assertMachineWrite(entry, next, "backfill-segment-prior");
    if (write) writeFileSync(join(dir, `${id}.json`), `${JSON.stringify(next, null, 2)}\n`);
    counts.written++;
  } catch (error) {
    counts.failed++;
    lines.push(`- ${id}: 失敗 ${scrubSecrets(String(error.message)).slice(0, 160)}`);
  }
}

const summary = [
  `## 事業別の売上の前期列の追加（${write ? "書き込み" : "試行"}）`,
  "",
  `対象 ${candidates.length} 社: 追加 ${counts.written}・追加なし ${counts.none}・見送り ${counts.skipped}・失敗 ${counts.failed}`,
  "",
  "追加なしの会社は、有報の前期欄がタグ付けされていない、前期のセグメント名が事業に対応付かない、合計が前期の売上を超える、のどれか。推測では埋めない。",
  "",
  ...lines.slice(0, 200),
].join("\n");
console.log(summary);
const out = arg("summary");
if (out) writeFileSync(out, `${summary}\n`);
