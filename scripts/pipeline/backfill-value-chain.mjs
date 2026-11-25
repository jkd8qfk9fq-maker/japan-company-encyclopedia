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
 * the same document the entry's figures came from (the source's docID; for an entry citing only the company's own copy,
 * the EDINET filing of the same period, added as a source) — never a newer one, which is
 * refresh-financials' job — so the year it writes is a year the entry already has. Dry run unless --write.
 *
 * Every change is a facts-layer write (ownership.mjs); the run is checked by the integrity suite in the workflow
 * before anything is proposed. Needs EDINET_API_KEY.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { downloadDocument, findAnnualReports, readCsvRows, scrubSecrets, textBlockToText } from "../research/edinet.mjs";
import { shareFigures, workforceFigures } from "../research/evidence-pack.mjs";
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
  return { latest, problem: "最新年度の出典に EDINET の書類 ID がない" };
}

const addMonths = (iso, months) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
};

/**
 * The newest year's 有価証券報告書 on EDINET, for an entry whose sources cite only the company's own copy (the
 * hand-researched entries: toyota, sony-group, …). Matched by securities code and the exact period end of the year the
 * entry already has — one original filing (docTypeCode 120), or nothing. The figures added from it cite it as a new
 * EDINET source; the company's copy is left as it was, so no source is said to be a document it is not.
 */
async function resolveFiling(entry) {
  const found = filingOf(entry);
  if (found.docID || !found.latest || !/^[0-9A-Z]{4}$/.test(entry.code ?? "")) return found;
  const { latest } = found;
  const reports = (await findAnnualReports(entry.code, latest.periodEnd, addMonths(latest.periodEnd, 6))).filter(
    (r) => r.docTypeCode === "120" && r.periodEnd === latest.periodEnd,
  );
  if (reports.length !== 1) return { problem: `最新年度の出典に EDINET の書類 ID がなく、EDINET でも同じ期の有報が${reports.length === 0 ? "見つからない" : "1件に定まらない"}` };
  const report = reports[0];
  const taken = new Set(entry.sources.map((s) => s.id));
  let sourceId = `edinet-yuho-${latest.periodEnd.slice(0, 4)}`;
  for (let n = 2; taken.has(sourceId); n++) sourceId = `edinet-yuho-${latest.periodEnd.slice(0, 4)}-${n}`;
  return {
    latest,
    docID: report.docID,
    sourceId,
    newSource: {
      id: sourceId,
      title: report.docDescription || "有価証券報告書",
      publisher: "EDINET（金融庁）",
      url: `https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/${report.docID}.pdf`,
      publishedAt: report.submitDateTime.slice(0, 10),
      accessedAt: new Date().toISOString().slice(0, 10),
      docId: report.docID,
      asOf: latest.periodEnd,
    },
  };
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

/** JCE-066: 1株当たり配当額・発行済株式総数 of the 提出会社, as printed, or null when the filing tags neither. */
function shareBlock(latest, sourceId, figures) {
  if (figures.dividendPerShare === null && figures.issuedShares === null) return null;
  return { fiscalYear: latest.fiscalYear, asOf: latest.periodEnd, ...figures, sourceIds: [sourceId], locator: "【主要な経営指標等の推移】（提出会社の経営指標等）" };
}

async function rowsOf(docID) {
  const zip = await downloadDocument(docID, 5);
  if (!zip) throw new Error(`EDINET が CSV を返さなかった（${docID}）`);
  return readCsvRows(zip);
}

if (probe) {
  // Read-only: what a filing actually tags, so element names are checked against real filings, not assumed.
  // JCE-110 adds the cash-flow rows (depreciation, investing total) and segment profit, checked here before any bulk run.
  const wanted = /Salary|LengthOfService|AverageAge|NumberOfEmployees$|ExternalCustomers|GeographicalAreas|SegmentInformation|NetSales$|Revenue|PerShare|IssuedShares|Depreciation|Invest(ing|ment)Activities|SegmentProfit|ProfitLoss|OperatingIncome|OperatingProfit|ResearchAndDevelopment|IncreaseIn|CapitalExpenditure|AdditionsTo|Capex/;
  for (const id of probe) {
    const found = await resolveFiling(read(id));
    if (!found.docID) { console.log(`${id}: ${found.problem}`); continue; }
    if (found.newSource) console.log(`${id}: EDINET で見つけた有報 ${JSON.stringify(found.newSource)}`);
    const rows = await rowsOf(found.docID);
    // An entry citing a 訂正有価証券報告書: read the same figures from the original it amends and say whether they agree,
    // so the correction's XBRL is checked against the filing as first submitted rather than trusted on its own.
    const cited = read(id).sources.find((s) => s.id === found.sourceId);
    if (/訂正/.test(cited?.title ?? "") && /^[0-9A-Z]{4}$/.test(read(id).code ?? "")) {
      const reports = await findAnnualReports(read(id).code, found.latest.periodEnd, addMonths(found.latest.periodEnd, 12));
      const parent = reports.find((r) => r.docID === found.docID)?.parentDocID ?? null;
      const originals = reports.filter((r) => r.docTypeCode === "120" && r.periodEnd === found.latest.periodEnd);
      const original = originals.find((r) => r.docID === parent) ?? (originals.length === 1 ? originals[0] : null);
      if (!original) console.log(`AMEND-CHECK ${id} cited=${found.docID} parent=${parent} original=NOT-FOUND`);
      else {
        const a = JSON.stringify(shareFigures(rows));
        const b = JSON.stringify(shareFigures(await rowsOf(original.docID)));
        console.log(`AMEND-CHECK ${id} cited=${found.docID} original=${original.docID} cited=${a} original=${b} ${a === b ? "MATCH" : "DIFFER"}`);
      }
    }
    // Many ids at once is a check, not an investigation: print only the lines above.
    if (probe.length > 12) continue;
    console.log(`=== ${id} ${found.docID} (${rows.length} rows)`);
    for (const r of rows.filter((r) => wanted.test(r["要素ID"] ?? "") && /^CurrentYear/.test(r["コンテキストID"] ?? "") && !/TextBlock$/.test(r["要素ID"]))) {
      console.log([r["要素ID"], r["項目名"], r["コンテキストID"], r["単位"], String(r["値"]).slice(0, 40)].join("\t"));
    }
    console.log(`workforceFigures → ${JSON.stringify(workforceFigures(rows))}`);
    console.log(`shareFigures → ${JSON.stringify(shareFigures(rows))}`);
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
  .filter(({ entry }) => !entry.workforce || !entry.shareFacts || !entry.regionalRevenue || (!entry.segmentRevenue && entry.businesses.length >= 2))
  .filter(({ entry }) => tier === "all" || entry.status.state === "published")
  .slice(0, limit);

const counts = { written: 0, none: 0, skipped: 0, failed: 0, workforce: 0, shareFacts: 0, segmentRevenue: 0, regionalRevenue: 0 };
const lines = [];
for (const { id, entry } of candidates) {
  const found = await resolveFiling(entry).catch((error) => ({ problem: `EDINET の検索に失敗 ${scrubSecrets(String(error.message)).slice(0, 120)}` }));
  if (!found.docID) { counts.skipped++; lines.push(`- ${id}: 見送り（${found.problem}）`); continue; }
  try {
    const rows = await rowsOf(found.docID);
    const nonConsolidated = entry.financials.some((f) => /提出会社単体/.test(f.revenueBasis ?? ""));
    const added = {};
    if (!entry.workforce) {
      const block = workforceBlock(found.latest, found.sourceId, workforceFigures(rows, nonConsolidated));
      if (block) added.workforce = block;
    }
    if (!entry.shareFacts) {
      const block = shareBlock(found.latest, found.sourceId, shareFigures(rows));
      if (block) added.shareFacts = block;
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
    const next = { ...entry, ...added, ...(found.newSource ? { sources: [...entry.sources, found.newSource] } : {}) };
    assertMachineWrite(entry, next, "backfill-value-chain");
    if (write) writeFileSync(join(dir, `${id}.json`), `${JSON.stringify(next, null, 2)}\n`);
    counts.written++;
  } catch (error) {
    counts.failed++;
    lines.push(`- ${id}: 失敗 ${scrubSecrets(String(error.message)).slice(0, 160)}`);
  }
}

const summary = [
  `## 従業員の状況・1株当たり配当額と発行済株式数・事業別の売上・地域別の売上の追加（${write ? "書き込み" : "試行"}）`,
  "",
  `対象 ${candidates.length} 社: 更新 ${counts.written}（従業員の状況 ${counts.workforce}・1株配当と株式数 ${counts.shareFacts}・事業別 ${counts.segmentRevenue}・地域別 ${counts.regionalRevenue}）・追加なし ${counts.none}・見送り ${counts.skipped}・失敗 ${counts.failed}`,
  "",
  "追加なし・一部だけの会社は、有報がタグを付けていない（米国基準など）、合計が合わない、セグメント名が事業名と一致しない、地域の表が省略されている、のどれか。推測では埋めない。",
  "",
  ...lines.slice(0, 200),
].join("\n");
console.log(summary);
const out = arg("summary");
if (out) writeFileSync(out, `${summary}\n`);
