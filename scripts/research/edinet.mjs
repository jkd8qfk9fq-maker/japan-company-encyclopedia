/**
 * EDINET (金融庁) API v2 — find and download 有価証券報告書, and read their XBRL.
 *
 * Why this exists: reading a filing's figures out of a PDF costs a research
 * agent tens of thousands of tokens and can go wrong silently (garbled CJK,
 * a column read from the wrong row). EDINET serves the same filing as tagged
 * XBRL, so the figures, their labels and their fiscal years can be read
 * mechanically — cheaper AND more accurate. Agents then spend their tokens
 * only on what needs judgement.
 *
 * Needs EDINET_API_KEY (free key from EDINET; kept in .env.local, never committed).
 * Everything is cached under the scratchpad directory: re-runs cost no requests.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

/**
 * An absolute path under a Windows user profile names the person and the machine. An error message that will be logged
 * or written to a tracked file (pipeline/intake-failures.tsv) must not carry one: every such path becomes "<local-path>".
 * @param {string} text
 */
export function redactLocalPaths(text) {
  return text.replace(/[A-Za-z]:[\\/]+Users[\\/]+[^\s'"]*/g, "<local-path>");
}

/**
 * Text that is about to be logged, written to a report or put in an error message, with the EDINET API key taken
 * out. The key travels in the query of every EDINET URL, so any message that quotes a URL (or an upstream
 * error that does) could carry it. Applied to everything this module reports about a failure.
 * @param {string} text
 */
export function scrubSecrets(text) {
  const key = process.env.EDINET_API_KEY;
  let out = String(text);
  if (key && key.length >= 6) out = out.split(key).join("***");
  return out.replace(/Subscription-Key=[^&\s"'<>]+/gi, "Subscription-Key=***");
}

const API = "https://api.edinet-fsa.go.jp/api/v2";

export function apiKey() {
  const key = process.env.EDINET_API_KEY;
  if (!key) throw new Error("EDINET_API_KEY is not set (put it in .env.local and load it before running)");
  return key;
}

/** Cache root: keep downloads out of the repository. */
export function cacheDir(root = process.env.RESEARCH_CACHE) {
  const dir = root ?? join(process.env.TEMP ?? "/tmp", "edinet-cache");
  mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Politeness toward EDINET, per process: at least EDINET_MIN_INTERVAL_MS (default 150) between
 * two requests. The pipeline runs one intake at a time, so this is the whole rate limit.
 */
let lastRequestAt = 0;
async function throttle() {
  const gap = Number(process.env.EDINET_MIN_INTERVAL_MS ?? 150);
  const wait = lastRequestAt + gap - Date.now();
  lastRequestAt = Math.max(Date.now(), lastRequestAt + gap);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
}

/**
 * GET with retry. A failure that is worth waiting out (a network error, 429, 5xx) backs off
 * exponentially with jitter — 0.5s, 1s, 2s, … capped at 30s — and honours Retry-After; a failure
 * that waiting will not fix (401/403/400) is thrown at once rather than retried four times.
 */
async function fetchWithRetry(url, { binary = false, attempts = 5 } = {}) {
  for (let attempt = 1; ; attempt++) {
    let retryAfterMs = 0;
    try {
      await throttle();
      const response = await fetch(url);
      if (response.status === 404) return null;
      if (!response.ok) {
        const retryAfter = Number(response.headers.get("retry-after"));
        retryAfterMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 0;
        const error = new Error(`HTTP ${response.status}`);
        // @ts-expect-error — carried so the catch below can tell a permanent failure from a transient one
        error.permanent = response.status >= 400 && response.status < 500 && response.status !== 429 && response.status !== 408;
        // Carried so a caller can say WHY a request failed (classifyIndexFailure) without quoting the URL.
        /** @type {any} */ (error).httpStatus = response.status;
        throw error;
      }
      return binary ? Buffer.from(await response.arrayBuffer()) : await response.text();
    } catch (error) {
      // A request that never got an answer: keep only the error's code (ECONNRESET, ETIMEDOUT …), never its text.
      if (!(/** @type {any} */ (error).httpStatus)) /** @type {any} */ (error).networkCode = /** @type {any} */ (error).cause?.code ?? /** @type {any} */ (error).code ?? /** @type {any} */ (error).name;
      if (attempt >= attempts || /** @type {any} */ (error).permanent) throw error;
      const backoff = Math.min(30_000, 500 * 2 ** (attempt - 1));
      await new Promise((r) => setTimeout(r, Math.max(retryAfterMs, backoff * (0.75 + Math.random() * 0.5))));
    }
  }
}

/**
 * Where the day indexes live. They are the one part of the cache that must outlive a session: the
 * universe and the newer-filing check are only as good as how many of them are present. %TEMP% is
 * cleaned by Windows (Storage Sense deleted ~340 of them on 2026-10-08 and ~460 more on 2026-10-09,
 * every file older than about a week), so on Windows they default to a per-user directory outside
 * it. An explicit cache root (RESEARCH_CACHE, as the tests use) keeps them inside it, and
 * RESEARCH_INDEX_CACHE overrides everything.
 */
export function indexDir(root = process.env.RESEARCH_CACHE) {
  const dir =
    process.env.RESEARCH_INDEX_CACHE ??
    (root
      ? join(root, "index")
      : process.platform === "win32" && process.env.LOCALAPPDATA
        ? join(process.env.LOCALAPPDATA, "japan-company-encyclopedia", "edinet-index")
        : join(cacheDir(), "index"));
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Today's date in Japan (EDINET's calendar), YYYY-MM-DD. */
export function jstToday(now = Date.now()) {
  return new Date(now + 9 * 3_600_000).toISOString().slice(0, 10);
}

/**
 * Why a day's index must not be trusted as the final answer for `date`, or null when it can be.
 *
 * `processDateTime` is the moment EDINET's own batch produced the answer. An answer produced ON the
 * day (or before it) was a half-filled snapshot — filings made later that day were not in it. Found
 * 2026-10-08: the cache held 2026-10-02 as 144 filings, produced at 11:57 that morning, and 10-01 as
 * 211 produced at 23:58; every later run read them as complete, so the universe silently missed the
 * rest of those days (the same failure that hid Zenken's 第50期). A day is final only when the batch
 * ran on a LATER date. Everything else here is plain sanity: status, the date asked for, and that
 * the stated count matches the rows.
 * @returns {{ kind: "invalid" | "not-final", reason: string } | null}
 */
export function indexProblem(json, date) {
  const meta = json?.metadata;
  if (meta?.status !== "200") return { kind: "invalid", reason: `status ${meta?.status}` };
  if (!Array.isArray(json.results)) return { kind: "invalid", reason: "results が配列でない" };
  if (meta.parameter?.date && meta.parameter.date !== date) return { kind: "invalid", reason: `別の日（${meta.parameter.date}）の索引` };
  if (typeof meta.resultset?.count === "number" && meta.resultset.count !== json.results.length) {
    return { kind: "invalid", reason: `件数 ${meta.resultset.count} と実際の ${json.results.length} が食い違う` };
  }
  const processed = String(meta.processDateTime ?? "").slice(0, 10);
  if (processed && processed <= date) return { kind: "not-final", reason: `作成 ${meta.processDateTime} は当日以前（確定前の索引）` };
  return null;
}

/**
 * One day's filing index, cached. `type=2` includes both metadata and the document list.
 *
 * Cache rules (a cache that is wrong looks exactly like one that is right):
 *  - Only a valid, FINAL answer is written (see indexProblem), atomically (temp file + rename), so a
 *    crash can never leave half a file and a bad answer can never replace a good one.
 *  - A cached file that is unreadable or not final is not trusted: it is fetched again. If that
 *    fetch FAILS the cached file is left exactly as it was — never deleted — and is used only if it
 *    parses (a not-final day is better than no day; a corrupt one is an error).
 */
export async function documentsOn(date) {
  const file = join(indexDir(), `${date}.json`);
  let cached = null;
  if (existsSync(file)) {
    try {
      cached = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      cached = null; // unreadable: refetch below, overwritten only by a valid answer
    }
    if (cached && !indexProblem(cached, date)) return cached;
  }
  // EDINET has no index for a day that has not happened, and answers a future
  // date with a non-200 metadata status rather than an empty list. Callers build
  // a window around a filing date, so a company that filed in the last three
  // weeks always produces one — レーザーテック, whose 有報 lands in late September,
  // failed here. An empty day is the honest answer and is not cached, so the
  // real index is fetched once the day exists.
  if (date > jstToday()) return { metadata: { status: "200" }, results: [] };
  let json;
  try {
    const text = await fetchWithRetry(`${API}/documents.json?date=${date}&type=2&Subscription-Key=${apiKey()}`);
    json = JSON.parse(text);
  } catch (error) {
    if (cached && indexProblem(cached, date)?.kind === "not-final") return cached;
    throw error;
  }
  const problem = indexProblem(json, date);
  if (problem?.kind === "invalid") {
    if (cached && indexProblem(cached, date)?.kind === "not-final") return cached;
    // EDINET reports a refused key (and a rate limit) as HTTP 200 with a body like
    // {"StatusCode": 401, "message": "Access denied due to invalid subscription key …"} — no `metadata` at all.
    // Carry that status and message so the failure is named for what it is, not as "status undefined".
    const bodyStatus = Number(json?.StatusCode ?? json?.statusCode);
    const error = new Error(`EDINET ${date}: ${problem.reason} ${json?.metadata?.message ?? json?.message ?? ""}`.trim());
    if (!json?.metadata && bodyStatus) /** @type {any} */ (error).httpStatus = bodyStatus;
    /** @type {any} */ (error).edinetMessage = scrubSecrets(String(json?.message ?? json?.metadata?.message ?? "")).slice(0, 160);
    throw error;
  }
  if (problem) return json; // not final yet (today, or the batch has not run): usable, but never cached
  const temp = `${file}.tmp-${process.pid}`;
  writeFileSync(temp, JSON.stringify(json));
  renameSync(temp, file);
  return json;
}

/**
 * Which days in [from, to] the cache cannot vouch for: no file, an unreadable one, or one that was
 * made before the day was over. Days from today onward are not expected to be final and are skipped.
 * Reads only the cache; fetches nothing.
 * @param {string} from
 * @param {string} to
 * @param {string} [root]
 * @returns {{ missing: string[], corrupt: string[], notFinal: string[] }}
 */
export function auditIndexCache(from, to, root = undefined) {
  const out = { missing: [], corrupt: [], notFinal: [] };
  const last = jstToday();
  for (const date of eachDate(from, to)) {
    if (date >= last) continue;
    const file = join(root ? join(root, "index") : indexDir(), `${date}.json`);
    if (!existsSync(file)) {
      out.missing.push(date);
      continue;
    }
    let json;
    try {
      json = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      out.corrupt.push(date);
      continue;
    }
    const problem = indexProblem(json, date);
    if (problem?.kind === "invalid") out.corrupt.push(date);
    else if (problem) out.notFinal.push(date);
  }
  return out;
}

/**
 * Make the cache trustworthy for [from, to]: fetch every day auditIndexCache flags (documentsOn
 * validates and writes atomically). Returns the days that still could not be vouched for, so a
 * caller that must not guess can stop. Self-healing is deliberate: the cache lives under %TEMP% and
 * Windows Storage Sense can clear it between sessions (340 days vanished on 2026-10-08).
 *
 * Why a day stays unresolved is returned too (`reasons`, one per day, secrets already taken out), because
 * "could not be vouched for" alone hides whether the key was rejected, the network failed, EDINET answered
 * something invalid, or the day simply is not final yet. EDINET finishes yesterday's index in a nightly batch
 * (0:00–0:06 JST), so a run that starts just after midnight finds it not final; `waitForFinalMs` makes the
 * run wait for that — re-asking every `pollMs` — instead of failing. Only reasons that waiting can fix
 * (not final, a network error, 429, 5xx) are waited for; a missing or rejected key fails at once.
 * The default is not to wait, so existing callers behave as before.
 * @param {string} from
 * @param {string} to
 * @param {{ waitForFinalMs?: number, pollMs?: number, sleep?: (ms: number) => Promise<void>, log?: (line: string) => void }} [options]
 * @returns {Promise<{ fetched: number, unresolved: string[], reasons: IndexReason[] }>}
 */
export async function ensureIndexCache(from, to, { waitForFinalMs = 0, pollMs = 60_000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), log = () => {} } = {}) {
  const audit = auditIndexCache(from, to);
  const todo = [...audit.missing, ...audit.corrupt, ...audit.notFinal].sort();
  /** @type {Map<string, IndexReason>} */
  const reasons = new Map();
  let fetched = 0;

  /** Ask EDINET for one day and record why it is (still) unresolved, if it is. */
  const attempt = async (/** @type {string} */ date) => {
    try {
      const json = await documentsOn(date);
      // documentsOn does not throw for a day EDINET still answers as not final: it returns it, uncached.
      const problem = indexProblem(json, date);
      if (problem) reasons.set(date, { date, kind: problem.kind, detail: scrubSecrets(problem.kind === "not-final" ? `${problem.reason}（EDINET の夜間バッチ後に確定する）` : problem.reason), retryable: problem.kind === "not-final" });
      else {
        reasons.delete(date);
        fetched++;
      }
    } catch (error) {
      reasons.set(date, { date, ...classifyIndexFailure(error) });
    }
  };

  for (const date of todo) {
    // A missing or refused key fails every day the same way: say so for the rest without asking again,
    // instead of sending EDINET a hundred more requests it will refuse.
    const keyProblem = [...reasons.values()].find((r) => r.kind === "key-missing" || r.kind === "key-rejected");
    if (keyProblem) reasons.set(date, { ...keyProblem, date });
    else await attempt(date);
  }

  // Wait for what waiting can fix, and only that.
  const maxPolls = pollMs > 0 ? Math.floor(waitForFinalMs / pollMs) : 0;
  for (let poll = 1; poll <= maxPolls && reasons.size > 0 && [...reasons.values()].every((r) => r.retryable); poll++) {
    log(`索引 ${[...reasons.keys()].sort().join(", ")} は未確定（${[...reasons.values()][0].kind}）。${pollMs / 1000}秒後に再取得します（${poll}/${maxPolls}）`);
    await sleep(pollMs);
    for (const date of [...reasons.keys()].sort()) await attempt(date);
  }

  // A not-final day that EDINET still answers as not-final (documentsOn returned it uncached) is
  // unresolved too: re-audit instead of trusting that no exception means success.
  const after = auditIndexCache(from, to);
  for (const date of [...after.missing, ...after.corrupt, ...after.notFinal]) {
    if (!reasons.has(date)) reasons.set(date, { date, kind: "missing", detail: "取得したが、キャッシュに有効な索引が残らなかった", retryable: true });
  }
  const list = [...reasons.values()].sort((a, b) => a.date.localeCompare(b.date));
  return { fetched, unresolved: list.map((r) => r.date), reasons: list };
}

/**
 * @typedef {{ date: string, kind: "not-final" | "invalid" | "key-missing" | "key-rejected" | "rate-limited" | "server-error" | "network" | "http" | "other" | "missing", detail: string, retryable: boolean }} IndexReason
 */

/**
 * Why a request for a day's index failed, in words that are safe to log: an HTTP status, a network error CODE,
 * or EDINET's own status and message — never a URL and never the key.
 * @param {any} error
 * @returns {{ kind: IndexReason["kind"], detail: string, retryable: boolean }}
 */
export function classifyIndexFailure(error) {
  const text = scrubSecrets(String(error?.message ?? error)).slice(0, 240);
  const status = Number(error?.httpStatus);
  if (/EDINET_API_KEY is not set/.test(text)) return { kind: "key-missing", detail: "EDINET_API_KEY が空（渡されていない）", retryable: false };
  const said = error?.edinetMessage ? `（EDINET: ${scrubSecrets(String(error.edinetMessage)).slice(0, 120)}）` : "";
  if (status === 401 || status === 403) return { kind: "key-rejected", detail: `HTTP ${status}: キーが拒否された、またはこの接続元が制限されている${said}`, retryable: false };
  if (status === 429 || status === 408) return { kind: "rate-limited", detail: `HTTP ${status}: 要求が多すぎる／時間切れ${said}`, retryable: true };
  if (status >= 500) return { kind: "server-error", detail: `HTTP ${status}`, retryable: true };
  if (status) return { kind: "http", detail: `HTTP ${status}`, retryable: false };
  if (error?.networkCode) return { kind: "network", detail: `通信エラー ${scrubSecrets(String(error.networkCode))}`, retryable: true };
  if (/^EDINET \d{4}-\d{2}-\d{2}:/.test(text)) return { kind: "invalid", detail: text, retryable: false };
  return { kind: "other", detail: text, retryable: false };
}

function* eachDate(from, to) {
  for (let d = new Date(`${from}T00:00:00Z`); d <= new Date(`${to}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    yield d.toISOString().slice(0, 10);
  }
}

/**
 * The 有価証券報告書 filings for one securities code in a date range, newest
 * first. `secCode` is the 4-digit code plus a trailing 0, as EDINET writes it.
 * docTypeCode 120 = 有価証券報告書; 130 = 訂正有価証券報告書 (kept, so a
 * correction is never missed).
 */
export async function findAnnualReports(code4, from, to) {
  const secCode = `${code4}0`;
  const found = [];
  for (const date of eachDate(from, to)) {
    const day = await documentsOn(date);
    for (const row of day.results ?? []) {
      if (row.secCode !== secCode) continue;
      if (row.docTypeCode !== "120" && row.docTypeCode !== "130") continue;
      found.push({
        docID: row.docID,
        // The original a 訂正 amends. Present on every 130 row EDINET serves, and the
        // only exact link between the two — the title names the period, not the filing.
        parentDocID: row.parentDocID ?? null,
        docTypeCode: row.docTypeCode,
        filerName: row.filerName,
        secCode: row.secCode,
        edinetCode: row.edinetCode,
        periodStart: row.periodStart,
        periodEnd: row.periodEnd,
        submitDateTime: row.submitDateTime,
        docDescription: row.docDescription,
      });
    }
  }
  return found.sort((a, b) => b.submitDateTime.localeCompare(a.submitDateTime));
}

/** Download one document. type 1 = XBRL zip, 2 = PDF, 5 = CSV (XBRL-to-CSV) zip. Cached. */
export async function downloadDocument(docID, type) {
  const extension = type === 2 ? "pdf" : "zip";
  const file = join(cacheDir(), "documents", `${docID}-${type}.${extension}`);
  mkdirSync(join(cacheDir(), "documents"), { recursive: true });
  if (existsSync(file)) return file;
  const buffer = await fetchWithRetry(`${API}/documents/${docID}?type=${type}&Subscription-Key=${apiKey()}`, { binary: true });
  if (!buffer) return null;
  writeFileSync(file, buffer);
  return file;
}

/** The CSV inside a type=5 zip, as rows. EDINET writes UTF-16LE, tab-separated. */
export function readCsvRows(zipPath) {
  const dir = `${zipPath}-extracted`;
  if (!existsSync(dir)) {
    // EDINET answers type=5 for a foreign issuer with something that is not a
    // zip (ワイ・ティー・エル・コーポレーション・バーハッド, a Malaysian company listed
    // in Tokyo, is one). Saying so plainly beats an unzip stack trace, which
    // reads like a corrupted cache rather than a filing with no XBRL.
    const head = readFileSync(zipPath).subarray(0, 2).toString("latin1");
    if (head !== "PK") {
      throw new Error(`EDINET がこの書類のXBRL（CSV）を提供していない（外国会社の可能性）: ${basename(zipPath)}`);
    }
    mkdirSync(dir, { recursive: true });
    execFileSync("unzip", ["-o", "-q", zipPath, "-d", dir]);
  }
  const csvDir = join(dir, "XBRL_TO_CSV");
  // An extraction directory left behind by a failed run exists but holds nothing,
  // and existsSync(dir) above would skip the check that produced the real reason.
  if (!existsSync(csvDir)) {
    throw new Error(`EDINET がこの書類のXBRL（CSV）を提供していない（外国会社の可能性）: ${basename(zipPath)}`);
  }
  const files = readdirSync(csvDir).filter((f) => f.endsWith(".csv"));
  const rows = [];
  for (const file of files) {
    const text = readFileSync(join(csvDir, file), "utf16le");
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = lines[0].split("\t");
    for (const line of lines.slice(1)) {
      const cells = line.split("\t");
      const row = {};
      header.forEach((name, i) => {
        // Both header and cells are quoted; strip the quotes and the BOM.
        const key = name.replace(/^﻿/, "").replace(/^"|"$/g, "");
        row[key] = (cells[i] ?? "").replace(/^"|"$/g, "");
      });
      row._file = file;
      rows.push(row);
    }
  }
  return rows;
}

/** Strip an XBRL TextBlock's HTML down to readable text, keeping table cells separated. */
export function textBlockToText(html) {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|tr|h\d)\s*>/gi, "\n")
    .replace(/<\/\s*(td|th)\s*>/gi, "\t")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
