/**
 * Take companies off the universe queue: assign an id, build the evidence pack,
 * build the draft entry. Deterministic, no model tokens.
 *
 *   node scripts/pipeline/intake.mjs --limit 20
 *   node scripts/pipeline/intake.mjs --code 6301
 *
 * This is the identity and edinet stages for a company nobody has named by hand.
 * run-mechanical.mjs resolves a company from a search term a person typed;
 * this one works from `pipeline/universe.tsv`, where the filer and its docID are
 * already known, so there is nothing to search and nothing to guess.
 *
 * **The id becomes a URL**, so it is taken from the one authoritative source for
 * it: 提出者名（英語表記）on the filing's own cover page. The pack has to exist
 * before that can be read, so the pack is built under a provisional directory
 * named after the securities code and moved once the name is known. Rebuilding it
 * under the real id instead would parse a 30,000-row CSV a second time, 3,900
 * times over.
 *
 * Nothing here ever renames an id that already exists (§27). A company whose id
 * is already in the universe file, in the pipeline state, or in src/data is
 * skipped outright.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "../research/edinet.mjs";
import { loadState, saveState, setStage } from "./company-state.mjs";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const limit = Number(arg("limit", "10"));
const onlyCode = arg("code", null);
const universePath = join(process.cwd(), "pipeline/universe.tsv");

if (!existsSync(universePath)) {
  console.error("pipeline/universe.tsv がありません。先に discover.mjs を実行してください");
  process.exit(1);
}

const lines = readFileSync(universePath, "utf8").split(/\r?\n/);
const rows = lines.map((line, index) => {
  if (!line.trim() || line.startsWith("#")) return null;
  const [code, filerName, docID, submitted, periodEnd, id] = line.split("\t");
  return { index, code, filerName, docID, submitted, periodEnd, id: id ?? "" };
}).filter(Boolean);

/**
 * A company id from the filing's English name.
 *
 * Corporate-form words carry no information and would put 「-corporation」 on a
 * third of the site's URLs, so they come off the end — but only off the end:
 * 「Holdings」 stays because SCREENホールディングス and SCREEN would otherwise be the
 * same id, and 「Co」 inside a name is not a suffix.
 */
const SUFFIX = /^(corporation|corp|co|ltd|limited|inc|incorporated|company|holdings?corp|kk)$/i;
function idFromEnglishName(name) {
  const tokens = name
    .normalize("NFKC")
    // EDINET serves the cover page with HTML entities intact, so 「Akikawa Foods
    // & Farms」 arrives as "&amp;" — and replacing "&" on that text produced the
    // id akikawa-foods-AND-AMP-farms, which is a URL. Decode first.
    .replace(/&amp;/gi, "&")
    .replace(/&(?:nbsp|#160);/gi, " ")
    // 株式会社 in the Latin form. Handled before the dots go, because afterwards
    // it is indistinguishable from two one-letter words (dai-ichi-cutter-kogyo-K-K).
    .replace(/\bK\.\s*K\.?(?=\s|$)/gi, " ")
    .replace(/[.,]/g, " ")
    .replace(/&/g, " and ")
    .split(/\s+/)
    .filter(Boolean);
  // A corporate-form word preceded by "and" is part of the name, not a suffix:
  // 「グリーンエナジー＆カンパニー」 files as "GreenEnergy & Company Inc.", where Inc.
  // is the form and Company is the company. Stripping both left the id
  // "greenenergy-and". The same rule reproduces the hand-assigned mitsui-and-co
  // from "MITSUI & CO., LTD.", which is a good sign it is drawing the line where
  // a person did.
  while (tokens.length > 1 && SUFFIX.test(tokens.at(-1)) && tokens.at(-2)?.toLowerCase() !== "and") tokens.pop();
  const id = tokens
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return id;
}

/** Every id already spoken for, from all three places one can live. */
function takenIds() {
  const taken = new Map();
  for (const row of rows) if (row.id) taken.set(row.id, row.code);
  const companies = join(process.cwd(), "src/data/companies");
  if (existsSync(companies)) {
    for (const f of readdirSync(companies)) if (f.endsWith(".json")) taken.set(f.replace(/\.json$/, ""), "published");
  }
  const states = join(process.cwd(), "pipeline/state");
  if (existsSync(states)) {
    for (const f of readdirSync(states)) if (f.endsWith(".json")) taken.set(f.replace(/\.json$/, ""), "state");
  }
  return taken;
}

const shift = (iso, days) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
const today = new Date().toISOString().slice(0, 10);
const run = (args) => execFileSync(process.execPath, args, { cwd: process.cwd(), encoding: "utf8", env: process.env, stdio: "pipe" });

/** 提出者名（英語表記）, or the 表紙's 英訳名 when DEI does not carry one. */
function englishNameFrom(coverPath) {
  const text = readFileSync(coverPath, "utf8");
  for (const key of ["提出者名（英語表記）、DEI", "英訳名、表紙"]) {
    const line = text.split("\n").find((l) => l.startsWith(`${key}\t`));
    if (line) {
      const value = line.slice(key.length + 1).trim();
      if (value) return value;
    }
  }
  return null;
}

const taken = takenIds();
const queue = rows.filter((r) => !r.id && (onlyCode ? r.code === onlyCode : true)).slice(0, onlyCode ? 1 : limit);
if (queue.length === 0) {
  console.log("処理する行がありません（id 未割当の行がない、または --code が一致しない）");
  process.exit(0);
}

const assigned = [];
const failed = [];
for (const row of queue) {
  const provisional = `_code-${row.code}`;
  const packRoot = join(cacheDir(), "evidence");
  try {
    // The filing's own submission date fixes the window; a company that filed in
    // the last three weeks would otherwise ask EDINET for a day in the future.
    const to = shift(row.submitted, 21) > today ? today : shift(row.submitted, 21);
    run(["scripts/research/evidence-pack.mjs", provisional, row.code, "--from", shift(row.submitted, -21), "--to", to]);

    const english = englishNameFrom(join(packRoot, provisional, "cover-page.txt"));
    if (!english) throw new Error("表紙に英語表記の会社名がない");
    let id = idFromEnglishName(english);
    if (!id) throw new Error(`英語名「${english}」から id を作れない`);
    // A collision is a real company with the same English name, so the code
    // distinguishes them rather than one of them silently losing.
    if (taken.has(id)) id = `${id}-${row.code.toLowerCase()}`;
    if (taken.has(id)) throw new Error(`id「${id}」が既にある（${taken.get(id)}）`);

    const target = join(packRoot, id);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
    renameSync(join(packRoot, provisional), target);
    const summaryPath = join(target, "summary.json");
    const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
    summary.companyId = id;
    writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

    run(["scripts/research/draft-entry.mjs", id]);

    const state = loadState(id);
    state.identity = {
      code: row.code,
      filerName: row.filerName,
      docID: row.docID,
      submitted: row.submitted,
      periodEnd: row.periodEnd,
      corrections: [],
      englishName: english,
    };
    saveState(state);
    setStage(id, "identity", "completed", `${row.filerName} / ${row.code} / docID ${row.docID}（id は英語表記「${english}」から）`);
    setStage(id, "edinet", "completed", `pack + draft 作成（warnings ${(summary.warnings ?? []).length} 件）`);

    taken.set(id, row.code);
    assigned.push({ ...row, id });
    console.log(`OK   ${row.code} ${row.filerName} → ${id}`);
  } catch (error) {
    rmSync(join(packRoot, provisional), { recursive: true, force: true });
    // execFileSync's own message is just the command line. What a later reader
    // needs is the child's own error — which element was missing, which section
    // was absent — so that failures can be grouped and fixed as families.
    const child = `${error.stdout ?? ""}${error.stderr ?? ""}`
      .split("\n")
      .find((l) => /^\s*(Error|TypeError|RangeError):/.test(l));
    const message = (child ?? String(error.message).split("\n")[0]).replace(/\s+/g, " ").trim().slice(0, 200);
    failed.push({ code: row.code, message });
    console.log(`FAIL ${row.code} ${row.filerName} — ${message.slice(0, 130)}`);
  }
}

// Write the assigned ids back so a re-run never reprocesses them.
if (assigned.length > 0) {
  const byIndex = new Map(assigned.map((a) => [a.index, a.id]));
  const updated = lines.map((line, index) => {
    const id = byIndex.get(index);
    if (!id) return line;
    const parts = line.split("\t");
    parts[5] = id;
    return parts.join("\t");
  });
  writeFileSync(universePath, updated.join("\n"));
}

// A failure is not a dead end: the company keeps its blank id, so a later run
// retries it once the extractor learns whatever element it was missing. The log
// is what makes those failures addressable in families rather than one at a time.
const failuresPath = join(process.cwd(), "pipeline/intake-failures.tsv");
if (failed.length > 0 || (assigned.length > 0 && existsSync(failuresPath))) {
  const path = failuresPath;
  const header = "# code\tfilerName\tdocID\tsubmitted\t理由（抽出器を直せば再実行で自動的に拾われる）";
  // Drop the rows for companies this run settled — the ones that failed again are
  // rewritten below, and the ones that succeeded are no longer failures. Leaving a
  // succeeded company in the log would make the operator's only view of what is
  // stuck untrue, which is worse than having no log.
  const settled = new Set([...failed.map((f) => f.code), ...assigned.map((a) => a.code)]);
  const previous = existsSync(path)
    ? readFileSync(path, "utf8")
        .split(/\r?\n/)
        .filter((l) => l.trim() && !l.startsWith("#") && !settled.has(l.split("\t")[0]))
    : [];
  const rowsOut = failed.map((f) => {
    const row = queue.find((q) => q.code === f.code);
    return [f.code, row.filerName, row.docID, row.submitted, f.message].join("\t");
  });
  writeFileSync(path, `${header}\n${[...previous, ...rowsOut].sort().join("\n")}\n`);
}

console.log(`\n割当 ${assigned.length} 社 / 失敗 ${failed.length} 社`);
for (const f of failed) console.log(`  ${f.code}: ${f.message}`);
if (failed.length > 0) console.log("失敗は pipeline/intake-failures.tsv に記録（id は未割当のまま、抽出器を直せば再実行で拾われる）");
