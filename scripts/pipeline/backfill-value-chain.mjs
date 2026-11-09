/**
 * Fill the JCE-038 facts — `workforce` (【従業員の状況】 of the 提出会社), `segmentRevenue` and `regionalRevenue` — for
 * registered entries that lack them, from the filing their newest financial year already cites.
 *
 *   node scripts/pipeline/backfill-value-chain.mjs [--tier published|all] [--limit N] [--ids a,b] [--write]
 *   node scripts/pipeline/backfill-value-chain.mjs --probe a,b      # print the filing's tagged rows that matter here
 *
 * New registrations get these from draft-entry and merge-fragments, and refresh-financials keeps them current; this
 * is for the entries registered before they existed. Each is transcribed and checked (segment-revenue.mjs): a
 * table that does not add up, or a segment whose name matches no business, is left out, never approximated. It reads
 * the same document the entry's figures came from (the source's docID) — never a newer one, which is
 * refresh-financials' job — so the year it writes is a year the entry already has. Dry run unless --write.
 *
 * Every change is a facts-layer write (ownership.mjs); the run is checked by the integrity suite in the workflow
 * before anything is proposed. Needs EDINET_API_KEY.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { downloadDocument, readCsvRows, scrubSecrets, textBlockToText } from "../research/edinet.mjs";
import { workforceFigures } from "../research/evidence-pack.mjs";
import { assertMachineWrite } from "./ownership.mjs";
import { labelDocumentsFor, namedSegmentFacts, regionalNoteOf, regionalRevenueBlock, segmentRevenueBlock } from "./segment-revenue.mjs";

const arg = (name, fallback = null) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : fallback;
};
const write = process.argv.includes("--write");
const tier = arg("tier", "published");
const limit = Number(arg("limit", "100000"));
const ids = arg("ids") ? new Set(arg("ids").split(",").map((s) => s.trim())) : null;
const probe = arg("probe") ? arg("probe").split(",").map((s) => s.trim()) : null;

const dir = join(process.cwd(), "src/data/companies");
const read = (id) => JSON.parse(readFileSync(join(dir, `${id}.json`), "utf8"));

/** The newest financial year and the EDINET document it cites, or why there is none. */
function filingOf(entry) {
  const latest = [...entry.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
  if (!latest) return { problem: "財務データがない" };
  for (const id of latest.sourceIds) {
    const source = entry.sources.find((s) => s.id === id);
    const docID = source?.docId ?? source?.url?.match(/\/(S[0-9A-Z]{7})\.pdf$/)?.[1];
    if (docID) return { latest, docID, sourceId: id };
  }
  return { problem: "最新年度の出典に EDINET の書類 ID がない" };
}

/** The workforce block an entry gets from those rows, or null when the filing tags none of it. */
function workforceBlock(latest, sourceId, figures) {
  if ([figures.employees, figures.averageAnnualSalary, figures.averageTenureYears].every((v) => v === null)) return null;
  return {
    fiscalYear: latest.fiscalYear,
    asOf: latest.periodEnd,
    ...figures,
    sourceIds: [sourceId],
    locator: "【従業員の状況】（提出会社の状況）",
  };
}

async function rowsOf(docID) {
  const zip = await downloadDocument(docID, 5);
  if (!zip) throw new Error(`EDINET が CSV を返さなかった（${docID}）`);
  return readCsvRows(zip);
}

if (probe) {
  // Read-only: what a filing actually tags, so element names are checked against real filings, not assumed.
  const wanted = /Salary|LengthOfService|AverageAge|NumberOfEmployees$|ExternalCustomers|GeographicalAreas|SegmentInformation|NetSales$|Revenue/;
  for (const id of probe) {
    const found = filingOf(read(id));
    if (!found.docID) { console.log(`${id}: ${found.problem}`); continue; }
    const rows = await rowsOf(found.docID);
    console.log(`=== ${id} ${found.docID} (${rows.length} rows)`);
    for (const r of rows.filter((r) => wanted.test(r["要素ID"] ?? "") && /^CurrentYear/.test(r["コンテキストID"] ?? "") && !/TextBlock$/.test(r["要素ID"]))) {
      console.log([r["要素ID"], r["項目名"], r["コンテキストID"], r["単位"], String(r["値"]).slice(0, 40)].join("\t"));
    }
    console.log(`workforceFigures → ${JSON.stringify(workforceFigures(rows))}`);
    const entry = read(id);
    const facts = namedSegmentFacts(rows, await labelDocumentsFor(found.docID));
    console.log(`segmentFacts → ${JSON.stringify(facts)}`);
    console.log(`segmentRevenue → ${JSON.stringify(segmentRevenueBlock(facts, entry.businesses, found.latest, found.sourceId))}`);
    console.log(`regionalRevenue → ${JSON.stringify(regionalRevenueBlock(regionalNoteOf(rows), found.latest, found.sourceId))}`);
    // The regional and major-customer notes are text blocks; print them as text to see how they are laid out.
    for (const r of rows.filter((r) => /(Geographic|RelatedInformation|MajorCustomers)\w*TextBlock$/.test(r["要素ID"] ?? "") && /^CurrentYear/.test(r["コンテキストID"] ?? ""))) {
      console.log(`--- ${r["要素ID"]} ${r["コンテキストID"]}`);
      console.log(textBlockToText(String(r["値"])).slice(0, 2500));
    }
  }
  process.exit(0);
}

const candidates = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((id) => !ids || ids.has(id))
  .map((id) => ({ id, entry: read(id) }))
  .filter(({ entry }) => !entry.workforce || !entry.regionalRevenue || (!entry.segmentRevenue && entry.businesses.length >= 2))
  .filter(({ entry }) => tier === "all" || entry.status.state === "published")
  .slice(0, limit);

const counts = { written: 0, none: 0, skipped: 0, failed: 0, workforce: 0, segmentRevenue: 0, regionalRevenue: 0 };
const lines = [];
for (const { id, entry } of candidates) {
  const found = filingOf(entry);
  if (!found.docID) { counts.skipped++; lines.push(`- ${id}: 見送り（${found.problem}）`); continue; }
  try {
    const rows = await rowsOf(found.docID);
    const nonConsolidated = entry.financials.some((f) => /提出会社単体/.test(f.revenueBasis ?? ""));
    const added = {};
    if (!entry.workforce) {
      const block = workforceBlock(found.latest, found.sourceId, workforceFigures(rows, nonConsolidated));
      if (block) added.workforce = block;
    }
    if (!entry.segmentRevenue && entry.businesses.length >= 2) {
      const facts = namedSegmentFacts(rows, await labelDocumentsFor(found.docID));
      const block = segmentRevenueBlock(facts, entry.businesses, found.latest, found.sourceId);
      if (block) added.segmentRevenue = block;
    }
    if (!entry.regionalRevenue) {
      const block = regionalRevenueBlock(regionalNoteOf(rows), found.latest, found.sourceId);
      if (block) added.regionalRevenue = block;
    }
    if (Object.keys(added).length === 0) { counts.none++; continue; }
    for (const key of Object.keys(added)) counts[key]++;
    const next = { ...entry, ...added };
    assertMachineWrite(entry, next, "backfill-value-chain");
    if (write) writeFileSync(join(dir, `${id}.json`), `${JSON.stringify(next, null, 2)}\n`);
    counts.written++;
  } catch (error) {
    counts.failed++;
    lines.push(`- ${id}: 失敗 ${scrubSecrets(String(error.message)).slice(0, 160)}`);
  }
}

const summary = [
  `## 従業員の状況・事業別の売上・地域別の売上の追加（${write ? "書き込み" : "試行"}）`,
  "",
  `対象 ${candidates.length} 社: 更新 ${counts.written}（従業員の状況 ${counts.workforce}・事業別 ${counts.segmentRevenue}・地域別 ${counts.regionalRevenue}）・追加なし ${counts.none}・見送り ${counts.skipped}・失敗 ${counts.failed}`,
  "",
  "追加なし・一部だけの会社は、有報がタグを付けていない（米国基準など）、合計が合わない、セグメント名が事業名と一致しない、地域の表が省略されている、のどれか。推測では埋めない。",
  "",
  ...lines.slice(0, 200),
].join("\n");
console.log(summary);
const out = arg("summary");
if (out) writeFileSync(out, `${summary}\n`);
