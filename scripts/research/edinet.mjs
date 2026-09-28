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
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

async function fetchWithRetry(url, { binary = false, attempts = 4 } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return binary ? Buffer.from(await response.arrayBuffer()) : await response.text();
    } catch (error) {
      if (attempt >= attempts) throw error;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

/** One day's filing index, cached. `type=2` includes both metadata and the document list. */
export async function documentsOn(date) {
  const file = join(cacheDir(), "index", `${date}.json`);
  mkdirSync(join(cacheDir(), "index"), { recursive: true });
  if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  // EDINET has no index for a day that has not happened, and answers a future
  // date with a non-200 metadata status rather than an empty list. Callers build
  // a window around a filing date, so a company that filed in the last three
  // weeks always produces one — レーザーテック, whose 有報 lands in late September,
  // failed here. An empty day is the honest answer and is not cached, so the
  // real index is fetched once the day exists.
  if (date > new Date().toISOString().slice(0, 10)) return { metadata: { status: "200" }, results: [] };
  const text = await fetchWithRetry(`${API}/documents.json?date=${date}&type=2&Subscription-Key=${apiKey()}`);
  const json = JSON.parse(text);
  if (json.metadata?.status !== "200") throw new Error(`EDINET ${date}: ${json.metadata?.status} ${json.metadata?.message}`);
  writeFileSync(file, JSON.stringify(json));
  return json;
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
      throw new Error(`EDINET がこの書類のXBRL（CSV）を提供していない（外国会社の可能性）: ${zipPath}`);
    }
    mkdirSync(dir, { recursive: true });
    execFileSync("unzip", ["-o", "-q", zipPath, "-d", dir]);
  }
  const csvDir = join(dir, "XBRL_TO_CSV");
  // An extraction directory left behind by a failed run exists but holds nothing,
  // and existsSync(dir) above would skip the check that produced the real reason.
  if (!existsSync(csvDir)) {
    throw new Error(`EDINET がこの書類のXBRL（CSV）を提供していない（外国会社の可能性）: ${zipPath}`);
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
