/**
 * Resolve companies to their 有価証券報告書 by name, from EDINET itself.
 *
 *   node scripts/research/find-filings.mjs <list-file> [--from YYYY-MM-DD] [--to YYYY-MM-DD]
 *
 * The list file has one `company-id<TAB>検索語` line per company, where the
 * search term is matched against EDINET's own 提出者名.
 *
 * Why this exists: a securities code recalled from memory is exactly the kind of
 * plausible-but-unverified fact CLAUDE.md invariant 1 forbids, and one wrong
 * digit silently produces a complete, confident entry about the wrong company.
 * So nothing here is typed from memory: the day indexes are scanned, filings of
 * docTypeCode 120/130 are collected, and each company is matched to the filer
 * EDINET names. It also removes a per-company web search from every researcher.
 *
 * Fiscal year ends vary (March, February, August, December …), so the window has
 * to span more than a year to catch every filer's annual report. Day indexes are
 * cached, so a second run costs no requests.
 */
import { readFileSync } from "node:fs";
import { documentsOn } from "./edinet.mjs";

const [listFile, ...rest] = process.argv.slice(2);
if (!listFile) {
  console.error("usage: node scripts/research/find-filings.mjs <list-file> [--from YYYY-MM-DD] [--to YYYY-MM-DD]");
  process.exit(1);
}
const options = Object.fromEntries(rest.map((a, i, all) => (a.startsWith("--") ? [a.slice(2), all[i + 1]] : [])).filter((e) => e.length));
const from = options.from ?? "2025-09-01";
const to = options.to ?? "2026-09-20";

const wanted = readFileSync(listFile, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const [id, term] = line.split(/\t+/);
    return { id, term };
  });

/** EDINET writes 全角 alphanumerics in filer names; compare without that or spacing. */
const normalize = (s) => s.normalize("NFKC").replace(/\s+/g, "").replace(/[（）()]/g, "");

function* eachDate(start, end) {
  for (let d = new Date(`${start}T00:00:00Z`); d <= new Date(`${end}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    yield d.toISOString().slice(0, 10);
  }
}

const annualReports = [];
let days = 0;
for (const date of eachDate(from, to)) {
  let day;
  try {
    day = await documentsOn(date);
  } catch (error) {
    console.error(`# ${date}: ${error.message}`);
    continue;
  }
  days++;
  for (const row of day.results ?? []) {
    if (row.docTypeCode !== "120" && row.docTypeCode !== "130") continue;
    if (!row.secCode) continue;
    annualReports.push(row);
  }
}
console.error(`# scanned ${days} days, ${annualReports.length} annual reports with a securities code`);

const lines = [];
for (const { id, term } of wanted) {
  const needle = normalize(term);
  const matches = annualReports.filter((r) => normalize(r.filerName ?? "").includes(needle));
  const byCode = new Map();
  for (const m of matches) {
    if (!byCode.has(m.secCode)) byCode.set(m.secCode, []);
    byCode.get(m.secCode).push(m);
  }
  if (byCode.size === 0) {
    lines.push(`${id}\t?\t?\t?\tNOT FOUND: ${term}`);
    continue;
  }
  if (byCode.size > 1) {
    const names = [...byCode.entries()].map(([code, rows]) => `${code}:${rows[0].filerName}`).join(" / ");
    lines.push(`${id}\t?\t?\t?\tAMBIGUOUS: ${names}`);
    continue;
  }
  const [secCode, rows] = [...byCode.entries()][0];
  rows.sort((a, b) => b.submitDateTime.localeCompare(a.submitDateTime));
  const original = rows.find((r) => r.docTypeCode === "120") ?? rows[0];
  const submitted = original.submitDateTime.slice(0, 10);
  lines.push(
    [
      id,
      secCode.slice(0, 4),
      original.periodEnd ?? "?",
      submitted,
      original.filerName,
      rows.length > 1 ? `(+${rows.length - 1} filings incl. 訂正)` : "",
    ].join("\t"),
  );
}
console.log(lines.join("\n"));
