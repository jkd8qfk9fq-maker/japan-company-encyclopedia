/**
 * Sync listing status, industry and new listings from the EDINET code list (EDINETコードリスト).
 *
 *   node scripts/pipeline/sync-listing.mjs [--file <Edinetcode.zip | EdinetcodeDlInfo.csv>] [--download] [--force]
 *                                          [--write] [--accept-large-change] [--report <file.json>] [--summary <file.md>]
 *
 * What it does: reads the code list, compares it with what the project holds, and says what differs — which
 * registered companies the list no longer shows as listed, which listed companies have no entry, how the
 * entries spread over the 33 industries, and what changed since the last sync. It answers the question
 * docs/pipeline.md leaves open ("会社マスターに上場／上場廃止の区別そのものがない").
 *
 * What it never does: change an entry, a state file or pipeline/universe.tsv. The only file it can write is its
 * own ledger, pipeline/listing.tsv (with --write), a derived table that later steps may read; every other effect is
 * a report. Acting on a difference — registering a new listing, deciding what to do with a delisted company that
 * has a page — stays a separate, reviewed step.
 *
 * Where the file comes from (terms of use, checked 2026-10-17 against EDINET 利用規約, WZEK0030):
 *  - EDINET content may be used under 公共データ利用規約 (PDL 1.0): the source must be named, and an edited or
 *    processed result must say that it is edited and by whom (see the site's /about).
 *  - Machine retrieval from the website is prohibited, EXCEPT through the API or for content the API cannot give.
 *    The code list is not in the API, and the terms do not mention it either way — so by default nothing is
 *    downloaded: pass the file you downloaded yourself with --file. --download fetches it once, at most once
 *    every 20 hours (one 0.6 MB file, no retries), and is not wired into any scheduled job. Short-term bulk access
 *    is prohibited by the same terms, which is what the interval is for.
 *
 * Exit code: 0 = ran (differences are information, not errors); 1 = the file could not be read, failed its sanity
 * checks, or --write was refused.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { inflateRawSync } from "node:zlib";
import { cacheDir } from "../research/edinet.mjs";

export const CODELIST_URL = "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/codelist/Edinetcode.zip";
export const CSV_NAME = "EdinetcodeDlInfo.csv";
const MIN_HOURS_BETWEEN_DOWNLOADS = 20;
/** A list with fewer listed companies than this is not the code list (about 3,800 are listed). */
const MIN_LISTED = 3000;

// ------------------------------------------------------------------------------ reading the file

/**
 * The first file of a ZIP, with no tool outside Node: found through the central directory (the local header can
 * carry sizes of 0 when a data descriptor follows). Stored and deflated entries only.
 * @param {Buffer} zip
 * @returns {{ name: string, data: Buffer }}
 */
export function readFirstZipEntry(zip) {
  let eocd = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65_557); i--) {
    if (zip.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("ZIP として読めない（終端の記録が無い）");
  const cd = zip.readUInt32LE(eocd + 16);
  if (zip.readUInt32LE(cd) !== 0x02014b50) throw new Error("ZIP として読めない（中央ディレクトリが壊れている）");
  const method = zip.readUInt16LE(cd + 10);
  const compressed = zip.readUInt32LE(cd + 20);
  const nameLength = zip.readUInt16LE(cd + 28);
  const local = zip.readUInt32LE(cd + 42);
  const name = zip.toString("utf8", cd + 46, cd + 46 + nameLength);
  const dataStart = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
  const raw = zip.subarray(dataStart, dataStart + compressed);
  if (method === 0) return { name, data: Buffer.from(raw) };
  if (method === 8) return { name, data: inflateRawSync(raw) };
  throw new Error(`ZIP の圧縮方式 ${method} には対応していない`);
}

/** The code list's text, from the ZIP EDINET distributes or from the CSV inside it (Windows-31J). */
export function readCodeListFile(/** @type {string} */ path) {
  const bytes = readFileSync(path);
  const csv = bytes.readUInt32LE(0) === 0x04034b50 ? readFirstZipEntry(bytes).data : bytes;
  return new TextDecoder("shift_jis").decode(csv);
}

/** One CSV line, with quoted fields (names contain commas) and doubled quotes. */
export function parseCsvLine(/** @type {string} */ line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const COLUMNS = { edinetCode: "ＥＤＩＮＥＴコード", kind: "提出者種別", listing: "上場区分", closing: "決算日", name: "提出者名", industry: "提出者業種", secCode: "証券コード" };

/**
 * @param {string} text the decoded CSV
 * @returns {{ asOf: string | null, declared: number, rows: { edinetCode: string, kind: string, listing: string, closing: string, name: string, industry: string, secCode: string }[] }}
 */
export function parseCodeList(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l !== "");
  if (lines.length < 3) throw new Error("コードリストとして読めない（行が足りない）");
  const meta = parseCsvLine(lines[0]);
  const date = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(meta[1] ?? "");
  const header = parseCsvLine(lines[1]);
  const at = Object.fromEntries(Object.entries(COLUMNS).map(([key, label]) => [key, header.indexOf(label)]));
  const missing = Object.entries(at).filter(([, i]) => i < 0).map(([k]) => COLUMNS[/** @type {keyof typeof COLUMNS} */ (k)]);
  if (missing.length > 0) throw new Error(`コードリストの列が変わった（無い列: ${missing.join("、")}）`);
  const rows = lines.slice(2).map((line) => {
    const c = parseCsvLine(line);
    return { edinetCode: c[at.edinetCode], kind: c[at.kind], listing: c[at.listing], closing: c[at.closing], name: c[at.name], industry: c[at.industry], secCode: c[at.secCode] };
  });
  return {
    asOf: date ? `${date[1]}-${date[2].padStart(2, "0")}-${date[3].padStart(2, "0")}` : null,
    declared: Number(String(meta[3] ?? "").replace(/[^\d]/g, "")) || 0,
    rows,
  };
}

// ----------------------------------------------------------------------------------- the ledger

/** @typedef {{ code: string, edinetCode: string, name: string, industry: string, listing: string, closing: string }} LedgerRow */

/**
 * One row per securities code (4 characters; a code can end in a letter, "285A"). When a code has two filers — an old
 * unlisted entity and the listed one — the listed one wins.
 * @param {ReturnType<typeof parseCodeList>["rows"]} rows
 * @returns {LedgerRow[]}
 */
export function toLedger(rows) {
  /** @type {Map<string, LedgerRow>} */
  const byCode = new Map();
  for (const r of rows) {
    if (!r.secCode || r.secCode.length < 4) continue;
    const row = { code: r.secCode.slice(0, 4), edinetCode: r.edinetCode, name: r.name, industry: r.industry, listing: r.listing, closing: r.closing };
    const known = byCode.get(row.code);
    if (!known || (known.listing !== "上場" && row.listing === "上場")) byCode.set(row.code, row);
  }
  return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code));
}

const HEADER = "# code\tedinetCode\tname\tindustry\tlisting\tclosing";

/** The ledger file's text. `asOf` is the code list's own date, so the same list always gives the same file. */
export function formatLedger(/** @type {LedgerRow[]} */ rows, /** @type {string | null} */ asOf) {
  return [
    `# EDINET コードリスト（金融庁。公共データ利用規約 第1.0版）を、この百科事典が整理したもの。リスト作成日 ${asOf ?? "不明"}`,
    "# scripts/pipeline/sync-listing.mjs が作る。手で直さない（次の同期で置き換わる）。",
    HEADER,
    ...rows.map((r) => [r.code, r.edinetCode, r.name, r.industry, r.listing, r.closing].join("\t")),
    "",
  ].join("\n");
}

/** @returns {{ asOf: string | null, rows: LedgerRow[] }} */
export function parseLedger(/** @type {string} */ text) {
  const asOf = /リスト作成日 (\d{4}-\d{2}-\d{2})/.exec(text)?.[1] ?? null;
  const rows = text.split(/\r?\n/).filter((l) => l && !l.startsWith("#")).map((l) => {
    const [code, edinetCode, name, industry, listing, closing] = l.split("\t");
    return { code, edinetCode, name, industry, listing, closing };
  });
  return { asOf, rows };
}

/**
 * What changed between two ledgers. Pure.
 * @param {LedgerRow[]} previous
 * @param {LedgerRow[]} next
 */
export function diffLedgers(previous, next) {
  const before = new Map(previous.map((r) => [r.code, r]));
  const after = new Map(next.map((r) => [r.code, r]));
  return {
    added: next.filter((r) => !before.has(r.code)),
    removed: previous.filter((r) => !after.has(r.code)),
    listing: next.filter((r) => before.has(r.code) && before.get(r.code)?.listing !== r.listing).map((r) => ({ code: r.code, name: r.name, from: before.get(r.code)?.listing, to: r.listing })),
    industry: next.filter((r) => before.has(r.code) && before.get(r.code)?.industry !== r.industry).map((r) => ({ code: r.code, name: r.name, from: before.get(r.code)?.industry, to: r.industry })),
    name: next.filter((r) => before.has(r.code) && before.get(r.code)?.name !== r.name).map((r) => ({ code: r.code, from: before.get(r.code)?.name, to: r.name })),
  };
}

/**
 * Sanity checks before a ledger is written: a list that is empty, short, or very different from the last one is a
 * changed format or a broken download, not news. Returns the reasons it must not be written (empty = fine).
 * @param {ReturnType<typeof parseCodeList>} parsed
 * @param {LedgerRow[]} ledger
 * @param {LedgerRow[] | null} previous
 * @param {boolean} acceptLargeChange
 */
export function ledgerProblems(parsed, ledger, previous, acceptLargeChange = false) {
  const problems = [];
  if (!parsed.asOf) problems.push("リストの作成日が読めない");
  if (parsed.declared && parsed.declared !== parsed.rows.length) problems.push(`リストが宣言する件数 ${parsed.declared} と読めた行数 ${parsed.rows.length} が違う`);
  const listed = ledger.filter((r) => r.listing === "上場").length;
  if (listed < MIN_LISTED) problems.push(`上場の会社が ${listed} 社しかない（${MIN_LISTED} 社以上あるはず）`);
  if (previous && !acceptLargeChange) {
    const before = previous.filter((r) => r.listing === "上場").length;
    if (before > 0 && Math.abs(listed - before) / before > 0.05) problems.push(`上場の会社が前回の ${before} 社から ${listed} 社へ 5% を超えて変わった（--accept-large-change で承知のうえ書く）`);
  }
  return problems;
}

// ------------------------------------------------------------------ comparing with the project

/**
 * @typedef {{ id: string, code: string, name: string, tier: string }} EntryInfo
 * @typedef {{ failed: Set<string>, parked: Set<string>, universe: Set<string> }} PipelineKnowledge  securities codes
 */

/**
 * The comparison itself, as data. Pure.
 * @param {LedgerRow[]} ledger
 * @param {EntryInfo[]} entries
 * @param {PipelineKnowledge} known
 */
export function reconcile(ledger, entries, known) {
  const byCode = new Map(ledger.map((r) => [r.code, r]));
  const listed = ledger.filter((r) => r.listing === "上場");
  const entryCodes = new Set(entries.map((e) => e.code));

  // Registered, but the list does not show the company as listed.
  const registeredNotListed = entries
    .filter((e) => byCode.get(e.code)?.listing !== "上場")
    .map((e) => ({ id: e.id, code: e.code, name: e.name, tier: e.tier, ledger: byCode.get(e.code)?.listing ?? "（コードが無い）" }))
    .sort((a, b) => Number(b.tier !== "figures-only") - Number(a.tier !== "figures-only") || a.code.localeCompare(b.code));

  // Listed, but no entry: why, and what the next step would be.
  const listedWithoutEntry = listed
    .filter((r) => !entryCodes.has(r.code))
    .map((r) => ({
      code: r.code,
      name: r.name,
      industry: r.industry,
      why: known.failed.has(r.code) ? "intake-failed" : known.parked.has(r.code) ? "parked" : known.universe.has(r.code) ? "in-universe" : "new-listing",
    }));

  /** @type {Map<string, { industry: string, listed: number, published: number, "needs-attention": number, "figures-only": number, unregistered: number }>} */
  const industry = new Map();
  const row = (/** @type {string} */ name) => industry.get(name) ?? industry.set(name, { industry: name, listed: 0, published: 0, "needs-attention": 0, "figures-only": 0, unregistered: 0 }).get(name);
  for (const r of listed) {
    const t = row(r.industry || "（業種なし）");
    t.listed++;
    const entry = entries.find((e) => e.code === r.code);
    if (entry) t[/** @type {"published" | "needs-attention" | "figures-only"} */ (entry.tier)]++;
    else t.unregistered++;
  }
  return {
    listedCount: listed.length,
    registeredNotListed,
    listedWithoutEntry,
    industry: [...industry.values()].sort((a, b) => b.listed - a.listed),
  };
}

const WHY = { "intake-failed": "取り込みに失敗している", parked: "工程の途中で保留されている", "in-universe": "母集団にはあるが記録がない", "new-listing": "母集団にない（新規上場の可能性。discover.mjs で拾えるか確認）" };

/** @param {{ asOf: string | null, result: ReturnType<typeof reconcile>, changes: ReturnType<typeof diffLedgers> | null, affected: { id: string, code: string, tier: string, what: string }[], problems: string[] }} r */
export function renderSummary(r) {
  const cell = (/** @type {unknown} */ v) => String(v ?? "").replace(/\|/g, "\\|");
  const published = r.result.registeredNotListed.filter((e) => e.tier !== "figures-only");
  const lines = [
    `## 上場状況・業種の同期（EDINET コードリスト ${r.asOf ?? "?"} 現在）`,
    "",
    `上場 ${r.result.listedCount} 社 ／ 登録済みで上場と確認できない ${r.result.registeredNotListed.length} 社（公開済み・要確認 ${published.length}） ／ 上場しているのにエントリーがない ${r.result.listedWithoutEntry.length} 社`,
    "",
  ];
  if (r.problems.length > 0) lines.push(`**書き込み不可: ${r.problems.map(cell).join(" ／ ")}**`, "");
  if (published.length > 0) lines.push("### 公開済み・要確認のエントリーで、上場と確認できないもの（人が確認する）", "", ...published.map((e) => `- ${e.code} ${e.name}（${e.id}、${e.tier}） — リスト上: ${e.ledger}`), "");
  if (r.changes) {
    lines.push("### 前回の同期からの変化", "", `追加 ${r.changes.added.length} ／ 消えた ${r.changes.removed.length} ／ 上場区分の変更 ${r.changes.listing.length} ／ 業種の変更 ${r.changes.industry.length} ／ 社名の変更 ${r.changes.name.length}`, "");
    if (r.affected.length > 0) lines.push("影響を受ける登録済みエントリー:", "", ...r.affected.map((a) => `- ${a.code}（${a.id}、${a.tier}）: ${a.what}`), "");
  }
  const why = Object.entries(Object.groupBy(r.result.listedWithoutEntry, (c) => c.why));
  if (why.length > 0) {
    lines.push("### 上場しているのにエントリーがない会社", "");
    for (const [k, list] of why) lines.push(`- **${list?.length}社** ${WHY[/** @type {keyof typeof WHY} */ (k)]}: ${list?.slice(0, 5).map((c) => `${c.code} ${c.name}`).join("、")}${(list?.length ?? 0) > 5 ? " …" : ""}`);
    lines.push("");
  }
  lines.push("### 業種ごとの状況（上場の会社）", "", "| 業種 | 上場 | 公開済み | 要確認 | 数値のみ | 未登録 |", "|---|---:|---:|---:|---:|---:|");
  for (const t of r.result.industry) lines.push(`| ${cell(t.industry)} | ${t.listed} | ${t.published} | ${t["needs-attention"]} | ${t["figures-only"]} | ${t.unregistered} |`);
  return `${lines.join("\n")}\n`;
}

// ------------------------------------------------------------------------------------- the CLI

/** @returns {{ root: string, ledgerPath: string }} */
const paths = () => ({ root: process.cwd(), ledgerPath: join(process.cwd(), "pipeline/listing.tsv") });

function readEntries(/** @type {string} */ root) {
  const dir = join(root, "src/data/companies");
  return readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => {
    const e = JSON.parse(readFileSync(join(dir, f), "utf8"));
    return { id: e.id, code: e.code, name: e.name, tier: e.status?.state ?? "published" };
  });
}

function readKnowledge(/** @type {string} */ root) {
  const column = (/** @type {string} */ file) => (existsSync(join(root, file)) ? readFileSync(join(root, file), "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith("#")).map((l) => l.split("\t")[0]) : []);
  const stateDir = join(root, "pipeline/state");
  const parked = new Set();
  if (existsSync(stateDir)) {
    for (const f of readdirSync(stateDir)) {
      const s = JSON.parse(readFileSync(join(stateDir, f), "utf8"));
      if (s.identity?.code) parked.add(s.identity.code);
    }
  }
  return { failed: new Set(column("pipeline/intake-failures.tsv")), parked, universe: new Set(column("pipeline/universe.tsv")) };
}

if (process.argv[1]?.endsWith("sync-listing.mjs")) {
  const args = process.argv.slice(2);
  const flag = (/** @type {string} */ n) => args.includes(`--${n}`);
  const value = (/** @type {string} */ n) => (args.indexOf(`--${n}`) !== -1 ? args[args.indexOf(`--${n}`) + 1] : undefined);
  const { root, ledgerPath } = paths();
  const fail = (/** @type {string} */ message) => {
    console.error(message);
    process.exit(1);
  };
  try {
    // 1. the file
    let file = value("file");
    const cached = join(cacheDir(), "codelist", "Edinetcode.zip");
    if (!file && flag("download")) {
      const stamp = join(cacheDir(), "codelist", "downloaded-at.txt");
      if (existsSync(stamp) && !flag("force")) {
        const hours = (Date.now() - Date.parse(readFileSync(stamp, "utf8"))) / 3_600_000;
        if (hours < MIN_HOURS_BETWEEN_DOWNLOADS) fail(`前回のダウンロードから ${hours.toFixed(1)} 時間。${MIN_HOURS_BETWEEN_DOWNLOADS} 時間はあけます（EDINET 利用規約: 短時間の大量アクセスの禁止）。保存済みの ${cached} を使うか、--force`);
      }
      const response = await fetch(CODELIST_URL, { headers: { "user-agent": "japan-company-encyclopedia code-list sync (once a day at most)" }, signal: AbortSignal.timeout(60_000) });
      if (!response.ok || /html/.test(response.headers.get("content-type") ?? "")) fail(`コードリストを取得できない（HTTP ${response.status}）`);
      mkdirSync(dirname(cached), { recursive: true });
      writeFileSync(`${cached}.tmp`, Buffer.from(await response.arrayBuffer()));
      renameSync(`${cached}.tmp`, cached);
      writeFileSync(stamp, new Date().toISOString());
      file = cached;
      console.log(`ダウンロードした: ${cached}`);
    }
    file ??= existsSync(cached) ? cached : undefined;
    if (!file) fail("コードリストがない。EDINET のサイトから Edinetcode.zip を保存して --file で渡すか、--download（20時間に1回まで）を使う");

    // 2. parse, compare
    const parsed = parseCodeList(readCodeListFile(/** @type {string} */ (file)));
    const ledger = toLedger(parsed.rows);
    const previous = existsSync(ledgerPath) ? parseLedger(readFileSync(ledgerPath, "utf8")) : null;
    const entries = readEntries(root);
    const result = reconcile(ledger, entries, readKnowledge(root));
    const changes = previous ? diffLedgers(previous.rows, ledger) : null;
    const tierOf = new Map(entries.map((e) => [e.code, e]));
    const affected = changes
      ? [
          ...changes.listing.filter((c) => tierOf.has(c.code)).map((c) => ({ id: tierOf.get(c.code)?.id ?? "", code: c.code, tier: tierOf.get(c.code)?.tier ?? "", what: `上場区分 ${c.from} → ${c.to}` })),
          ...changes.removed.filter((c) => tierOf.has(c.code)).map((c) => ({ id: tierOf.get(c.code)?.id ?? "", code: c.code, tier: tierOf.get(c.code)?.tier ?? "", what: "リストから消えた" })),
          ...changes.industry.filter((c) => tierOf.has(c.code)).map((c) => ({ id: tierOf.get(c.code)?.id ?? "", code: c.code, tier: tierOf.get(c.code)?.tier ?? "", what: `業種 ${c.from} → ${c.to}` })),
        ]
      : [];
    const problems = ledgerProblems(parsed, ledger, previous?.rows ?? null, flag("accept-large-change"));

    // 3. say what was found, then (only if asked, and only if sane) write the ledger
    const summary = renderSummary({ asOf: parsed.asOf, result, changes, affected, problems });
    console.log(summary);
    const report = { asOf: parsed.asOf, counts: { listed: result.listedCount, registeredNotListed: result.registeredNotListed.length, listedWithoutEntry: result.listedWithoutEntry.length }, problems, ...result, changes, affected };
    for (const [path, body] of [[value("report"), `${JSON.stringify(report, null, 2)}\n`], [value("summary"), summary]]) {
      if (!path) continue;
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, body);
    }
    if (flag("write")) {
      if (problems.length > 0) fail(`台帳を書かない: ${problems.join(" ／ ")}`);
      mkdirSync(dirname(ledgerPath), { recursive: true });
      writeFileSync(`${ledgerPath}.tmp`, formatLedger(ledger, parsed.asOf));
      renameSync(`${ledgerPath}.tmp`, ledgerPath);
      console.log(`台帳を書いた: pipeline/listing.tsv（${ledger.length} 行）。コミットは人が行うこと`);
    } else console.log("台帳は書いていません（--write で pipeline/listing.tsv を書く）。エントリーと母集団は変更しません。");
  } catch (error) {
    fail(`FAIL: ${/** @type {Error} */ (error).message}`);
  }
}
