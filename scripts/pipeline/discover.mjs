/**
 * Find every listed company that files an 有価証券報告書, from EDINET itself.
 *
 *   node scripts/pipeline/discover.mjs [--from YYYY-MM-DD] [--to YYYY-MM-DD]
 *
 * Writes `pipeline/universe.tsv` — one row per securities code, carrying the most
 * recent 有報 for it. That file is the registration queue for the whole project:
 * everything downstream reads it, and nothing downstream invents a company that
 * is not in it.
 *
 * The window must be at least a full year, because a company appears only in the
 * days around its own filing and fiscal years end in every month (March is 58% of
 * them; December is 14%; the rest are spread across the other ten). The default
 * is two years, which also picks up a company that filed late once.
 *
 * Day indexes are cached, so a re-run costs nothing for days already seen and one
 * request per new day. Discovery spends no model tokens at all.
 *
 * What it deliberately does NOT do: assign ids. An id becomes a URL, and the only
 * sound source for one is the filing's own 提出者名（英語表記）, which is inside the
 * document. run-mechanical.mjs assigns it when it opens the filing.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { documentsOn } from "../research/edinet.mjs";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const today = new Date().toISOString().slice(0, 10);
const twoYearsAgo = (() => {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() - 2);
  return d.toISOString().slice(0, 10);
})();

// Through YESTERDAY by default. documentsOn caches whatever EDINET answers, so asking for today
// would store a half-filled day index that every later run then reads as complete — a company
// that filed this afternoon would be missing from the universe for good.
const yesterday = (() => {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
})();
const from = arg("from", twoYearsAgo);
// An explicit --to is clamped to yesterday as well. The universe that stopped at 2026-09-28 was built
// on 09-28 itself: that day's index was half-filled when read, and Zenken's 第50期 — filed that
// afternoon — never made it in. The next run cannot repair a day that was already read as complete.
const requestedTo = arg("to", yesterday);
const to = requestedTo > yesterday ? yesterday : requestedTo;
if (to !== requestedTo) console.log(`--to ${requestedTo} は未完了の日を含むので ${to}（昨日）までに切り詰めた`);
const universePath = join(process.cwd(), "pipeline/universe.tsv");

/** Ids already published, by securities code, so discovery never proposes a rename. */
function publishedByCode() {
  const dir = join(process.cwd(), "src/data/companies");
  const map = new Map();
  if (!existsSync(dir)) return map;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const entry = JSON.parse(readFileSync(join(dir, file), "utf8"));
    map.set(entry.code, entry.id);
  }
  return map;
}

/**
 * Ids already assigned in the pipeline state — companies queued by hand before the
 * universe existed. Without this, discovery would leave their id blank and the
 * mechanical stage would assign a second id to a company that already has a pack.
 */
function stateByCode() {
  const dir = join(process.cwd(), "pipeline/state");
  const map = new Map();
  if (!existsSync(dir)) return map;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const state = JSON.parse(readFileSync(join(dir, file), "utf8"));
    if (state.identity?.code) map.set(state.identity.code, state.companyId);
  }
  return map;
}

/** Rows already discovered, so an id assigned later survives a re-run. */
function existingRows() {
  const map = new Map();
  if (!existsSync(universePath)) return map;
  for (const line of readFileSync(universePath, "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.startsWith("#")) continue;
    const [code, filerName, docID, submitted, periodEnd, id] = line.split("\t");
    map.set(code, { code, filerName, docID, submitted, periodEnd, id: id ?? "" });
  }
  return map;
}

const known = existingRows();
const published = publishedByCode();
const queued = stateByCode();

let days = 0;
let missed = 0;
const latest = new Map();
for (let d = new Date(`${from}T00:00:00Z`); d <= new Date(`${to}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
  const date = d.toISOString().slice(0, 10);
  let day;
  try {
    day = await documentsOn(date);
  } catch {
    // A day EDINET cannot serve is not a reason to lose the other 700. It is
    // counted and reported, so a gap is visible rather than silently narrowing
    // the universe.
    missed++;
    continue;
  }
  days++;
  for (const row of day.results ?? []) {
    // 120 is the 有報 itself. A 訂正有報 (130) never introduces a company that has
    // no 有報, and taking its docID here would point the pipeline at a correction
    // rather than at the report.
    if (row.docTypeCode !== "120" || !row.secCode) continue;
    const code = row.secCode.slice(0, 4);
    // EDINET serves 00000 for a filer with no securities code of its own. Four
    // digits, or three digits and a letter for the codes issued since 2024.
    if (!/^[0-9][0-9A-Za-z]{3}$/.test(code) || code === "0000") continue;
    const prev = latest.get(code);
    if (!prev || row.submitDateTime > prev.submitDateTime) latest.set(code, row);
  }
}

const rows = [...latest.values()]
  .map((row) => {
    const code = row.secCode.slice(0, 4);
    return {
      code,
      filerName: (row.filerName ?? "").replace(/\t/g, " "),
      docID: row.docID,
      submitted: row.submitDateTime.slice(0, 10),
      periodEnd: row.periodEnd ?? "",
      // A published company keeps the id it already has; otherwise whatever a
      // previous run assigned; otherwise blank, for run-mechanical to fill in.
      // ?? would stop at the empty string a previous run wrote for an
      // unassigned id, so an id learned since would never be picked up.
      id: published.get(code) || known.get(code)?.id || queued.get(code) || "",
    };
  })
  .sort((a, b) => a.code.localeCompare(b.code));

// §27: never lose what is already recorded. A company whose filing fell outside
// this window stays in the file rather than being dropped from the queue.
for (const [code, row] of known) {
  // A row this window did not see is kept (§27), unless its code was never a
  // securities code — an earlier run recorded EDINET's 00000 placeholder.
  if (latest.has(code) || !/^[0-9][0-9A-Za-z]{3}$/.test(code) || code === "0000") continue;
  rows.push({ ...row, id: published.get(code) || row.id || queued.get(code) || "" });
}
rows.sort((a, b) => a.code.localeCompare(b.code));

const header = [
  `# 上場企業の母集団 — EDINET の日次索引から機械的に作成（${today}）`,
  `# 窓: ${from} 〜 ${to}（${days} 日走査${missed > 0 ? `、${missed} 日は取得できず` : ""}）`,
  "# code\tfilerName\tdocID\tsubmitted\tperiodEnd\tid",
].join("\n");

writeFileSync(universePath, `${header}\n${rows.map((r) => [r.code, r.filerName, r.docID, r.submitted, r.periodEnd, r.id].join("\t")).join("\n")}\n`);

const withId = rows.filter((r) => r.id).length;
console.log(`${universePath}`);
console.log(`  ${rows.length} 社（${days} 日分の索引${missed > 0 ? `、取得できなかった日 ${missed}` : ""}）`);
console.log(`  id 確定済み ${withId} 社 / 未割当 ${rows.length - withId} 社`);
console.log(`  うち掲載済み ${published.size} 社`);
