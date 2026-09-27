/**
 * Run every pipeline stage that needs no judgement, for one company or a batch.
 *
 *   node scripts/pipeline/run-mechanical.mjs <company-id> <検索語> [--from …] [--to …]
 *   node scripts/pipeline/run-mechanical.mjs --batch pipeline/batch-003.tsv
 *
 * Stages covered: **identity** (resolve the filer and its securities code from
 * EDINET's own indexes) and **edinet** (build the evidence pack and the draft
 * entry). Both are deterministic and cost no model tokens, which is the point of
 * separating them from the agents: the spec's §31 — the same information must not
 * be researched twice — is enforced by doing this once, here, and caching it.
 *
 * It refuses to touch a company that already exists (§17, §27): an entry in
 * src/data/companies is never overwritten, and its state is marked `skipped`.
 */
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { cacheDir } from "../research/edinet.mjs";
import { documentsOn } from "../research/edinet.mjs";
import { loadState, setStage } from "./company-state.mjs";

const normalize = (s) => s.normalize("NFKC").replace(/\s+/g, "").replace(/[（）()]/g, "");

/** Every 有報/訂正有報 in a window, from the cached day indexes. */
async function annualReports(from, to) {
  const out = [];
  for (let d = new Date(`${from}T00:00:00Z`); d <= new Date(`${to}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    let day;
    try {
      day = await documentsOn(date);
    } catch {
      continue;
    }
    for (const row of day.results ?? []) {
      if ((row.docTypeCode === "120" || row.docTypeCode === "130") && row.secCode) out.push(row);
    }
  }
  return out;
}

/**
 * Identity: resolve one company to its filer, securities code and latest annual
 * report — from EDINET, never from memory. An ambiguous or missing match fails
 * the stage rather than guessing; that refusal is what caught 「イオン」 inside
 * 「ライオン株式会社」 and 第一生命ホールディングス having been renamed.
 */
export async function identity(companyId, term, from, to) {
  const reports = await annualReports(from, to);
  const needle = normalize(term);
  const byCode = new Map();
  for (const r of reports.filter((r) => normalize(r.filerName ?? "").includes(needle))) {
    if (!byCode.has(r.secCode)) byCode.set(r.secCode, []);
    byCode.get(r.secCode).push(r);
  }
  if (byCode.size === 0) throw new Error(`「${term}」に一致する有価証券報告書が ${from}〜${to} に見つかりません`);
  if (byCode.size > 1) {
    throw new Error(
      `「${term}」が複数の会社に一致します（${[...byCode.entries()].map(([c, rs]) => `${c}:${rs[0].filerName}`).join(" / ")}）。検索語を具体的にしてください`,
    );
  }
  const [secCode, rows] = [...byCode.entries()][0];
  rows.sort((a, b) => b.submitDateTime.localeCompare(a.submitDateTime));
  const original = rows.find((r) => r.docTypeCode === "120") ?? rows[0];
  return {
    code: secCode.slice(0, 4),
    filerName: original.filerName,
    docID: original.docID,
    submitted: original.submitDateTime.slice(0, 10),
    periodEnd: original.periodEnd,
    corrections: rows.filter((r) => r.docTypeCode === "130").map((r) => r.docID),
  };
}

const run = (args) => execFileSync("node", args, { cwd: process.cwd(), encoding: "utf8", env: process.env });

function alreadyPublished(companyId) {
  return existsSync(join(process.cwd(), "src/data/companies", `${companyId}.json`));
}

async function processOne(companyId, term, from, to) {
  if (alreadyPublished(companyId)) {
    setStage(companyId, "identity", "skipped", "既存エントリーがあるため上書きしません");
    return { companyId, skipped: true };
  }

  const state = loadState(companyId);
  let resolved = state.stages.identity.status === "completed" ? state.identity : null;
  if (!resolved) {
    setStage(companyId, "identity", "running");
    try {
      resolved = await identity(companyId, term, from, to);
    } catch (error) {
      setStage(companyId, "identity", "failed", String(error.message));
      return { companyId, error: error.message };
    }
    const next = loadState(companyId);
    next.identity = resolved;
    setStage(companyId, "identity", "completed", `${resolved.filerName} / ${resolved.code} / docID ${resolved.docID}`);
    const saved = loadState(companyId);
    saved.identity = resolved;
    const { saveState } = await import("./company-state.mjs");
    saveState(saved);
  }

  if (loadState(companyId).stages.edinet.status !== "completed") {
    setStage(companyId, "edinet", "running");
    try {
      // The window is derived from the filing's own submission date, not a
      // fiscal-year guess: December, February and August filers submit at
      // different times of year, and アサヒGHD filed seven months late.
      const submitted = new Date(`${resolved.submitted}T00:00:00Z`);
      const shift = (days) => {
        const d = new Date(submitted);
        d.setUTCDate(d.getUTCDate() + days);
        return d.toISOString().slice(0, 10);
      };
      run(["scripts/research/evidence-pack.mjs", companyId, resolved.code, "--from", shift(-21), "--to", shift(21)]);
      run(["scripts/research/draft-entry.mjs", companyId]);
      const pack = JSON.parse(readFileSync(join(cacheDir(), "evidence", companyId, "summary.json"), "utf8"));
      const warnings = (pack.warnings ?? []).length;
      setStage(companyId, "edinet", "completed", `pack + draft 作成（warnings ${warnings} 件）`);
    } catch (error) {
      setStage(companyId, "edinet", "failed", String(error.message).slice(0, 300));
      return { companyId, error: error.message };
    }
  }
  return { companyId, code: resolved.code, ok: true };
}

const args = process.argv.slice(2);
const options = Object.fromEntries(args.map((a, i, all) => (a.startsWith("--") ? [a.slice(2), all[i + 1]] : [])).filter((e) => e.length));
const from = options.from ?? "2025-09-01";
const to = options.to ?? "2026-09-30";

if (options.batch) {
  const lines = readFileSync(options.batch, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
  for (const line of lines) {
    const [companyId, term] = line.split(/\t+/);
    const result = await processOne(companyId, term, from, to);
    console.log(
      result.skipped ? `SKIP ${companyId} — 既存` : result.error ? `FAIL ${companyId} — ${result.error}` : `OK   ${companyId} (${result.code})`,
    );
  }
} else {
  const [companyId, term] = args.filter((a) => !a.startsWith("--") && args[args.indexOf(a) - 1]?.startsWith("--") !== true);
  if (!companyId || !term) {
    console.error("usage: node scripts/pipeline/run-mechanical.mjs <company-id> <検索語> [--from …] [--to …]");
    console.error("   or: node scripts/pipeline/run-mechanical.mjs --batch <list.tsv>");
    process.exit(1);
  }
  const result = await processOne(companyId, term, from, to);
  console.log(JSON.stringify(result, null, 2));
}
