/**
 * The evidence pack of a company that is NOT yet registered: is it usable, and if not, make it so.
 *
 * Packs live in the EDINET cache (`%TEMP%/edinet-cache/evidence/<id>/`), not in the repository,
 * so a pack can be missing (cache cleared), the wrong filing (identity changed) or stale (built
 * by an older generation of the extractor). All three are repaired the same way — rebuild from the
 * filings already cached, over the same ±21-day window the company was first resolved with — and
 * all three are decided here, once, for `advance.mjs` and `register-figures.mjs` alike.
 *
 * This only ever touches the cache. A company that is already registered keeps what it has: a
 * stale pack on the machine does not rewrite a published entry, and the back-fill of an old
 * extractor fix over existing entries is its own, separate job.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { amendmentIdentity, windowCorrections } from "../research/amendments.mjs";
import { cacheDir, indexDir } from "../research/edinet.mjs";
import { AGENT_STAGE_GROUPS, fragmentFiles, loadState, saveState } from "./company-state.mjs";
import { EXTRACTOR_VERSION } from "../research/evidence-pack.mjs";

/**
 * Is this pack built from the filing the identity resolved?
 *
 * Compared on the ORIGINAL's docID: a pack is built from the filing of record, which is a 訂正
 * when a complete one supersedes the original, so `filing.docID` legitimately differs from the
 * universe row's id while still being that company's pack.
 * @param {{ filing?: { docID?: string, originalDocID?: string } }} summary
 * @param {{ docID?: string, originalDocID?: string }} identity
 */
export function packMatchesIdentity(summary, identity) {
  const packOriginal = summary.filing?.originalDocID ?? summary.filing?.docID;
  return packOriginal !== undefined && packOriginal === (identity.originalDocID ?? identity.docID);
}

/**
 * Why a pack cannot be used as it is, or null if it can. Pure.
 * @param {any | null} summary the pack's summary.json, or null if there is none
 * @param {{ docID?: string, originalDocID?: string }} identity
 * @returns {"missing" | "wrong-filing" | "stale-extractor" | null}
 */
export function packProblem(summary, identity) {
  if (!summary) return "missing";
  if (!packMatchesIdentity(summary, identity)) return "wrong-filing";
  if ((summary.extractorVersion ?? 1) < EXTRACTOR_VERSION) return "stale-extractor";
  return null;
}

export const packPath = (/** @type {string} */ id) => join(cacheDir(), "evidence", id, "summary.json");

export function readPack(/** @type {string} */ id) {
  const path = packPath(id);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/** ±21 days around the original's submission date — the window run-mechanical/intake first used. */
function window(/** @type {string} */ submitted) {
  const shift = (/** @type {number} */ days) => {
    const d = new Date(`${submitted}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const today = new Date().toISOString().slice(0, 10);
  return { from: shift(-21), to: shift(21) > today ? today : shift(21) };
}

/**
 * Rebuild a company's pack and draft from its identity. Throws on failure; the caller decides
 * whether that is a stage failure or only a cache hiccup (see advance.mjs `classifyPackFailure`).
 * @param {string} id
 * @param {{ code: string, submitted: string }} identity
 */
export function rebuildPack(id, identity) {
  const { from, to } = window(identity.submitted);
  const run = (/** @type {string[]} */ args) => execFileSync(process.execPath, args, { cwd: process.cwd(), encoding: "utf8", env: process.env, stdio: "pipe" });
  run(["scripts/research/evidence-pack.mjs", id, identity.code, "--from", from, "--to", to]);
  run(["scripts/research/draft-entry.mjs", id]);
}

/**
 * A 有価証券報告書 for this securities code filed AFTER the one the company is built on, from the
 * cached EDINET day indexes — or null.
 *
 * Why this exists: the universe is a snapshot, and a snapshot taken before a company's next annual
 * report goes stale without anything saying so (Zenken's 第50期 was filed on the last day the
 * universe covered, and the whole pilot was built on 第49期). Registering prose and figures from the
 * previous year's report is not a transient problem to retry; it is a different filing, so it is
 * reported, never silently swapped. Only 120 counts: a 訂正 (130) of the same report is the
 * amendment layer's business, not a newer year.
 * @param {{ code: string, submitted?: string, originalDocID?: string, docID?: string }} identity
 * @param {string} [root] cache root (default: the EDINET cache)
 * @returns {{ docID: string, submitted: string, periodEnd: string, filerName: string } | null}
 */
export function newerFiling(identity, root = undefined) {
  const dir = root ? join(root, "index") : indexDir();
  if (!existsSync(dir) || !identity.submitted) return null;
  const known = identity.originalDocID ?? identity.docID;
  let best = null;
  for (const file of readdirSync(dir).sort()) {
    const day = file.slice(0, 10);
    if (!file.endsWith(".json") || day <= identity.submitted) continue;
    for (const row of JSON.parse(readFileSync(join(dir, file), "utf8")).results ?? []) {
      if (row.docTypeCode !== "120" || !row.secCode || row.secCode.slice(0, 4) !== identity.code || row.docID === known) continue;
      if (!best || row.submitDateTime > best.submittedAt) {
        best = { submittedAt: row.submitDateTime, docID: row.docID, submitted: row.submitDateTime.slice(0, 10), periodEnd: row.periodEnd ?? "", filerName: row.filerName ?? "" };
      }
    }
  }
  return best && { docID: best.docID, submitted: best.submitted, periodEnd: best.periodEnd, filerName: best.filerName };
}

/**
 * Point a company that has not been promoted yet at its newer filing and start it over.
 *
 * Everything written about the old filing — the six agent fragments and the staged entry — is
 * MOVED (not deleted) to pipeline/analysis/superseded/<id>-<old docID>/, because the prose and the
 * numbers in it describe a different fiscal year and must not be reused, but they are evidence of
 * what was done. The identity is rewritten, the pack and draft are rebuilt from the cache over the
 * window around the new filing, and the agent stages go back to pending. The registered
 * figures-only entry is not touched here; it is replaced by the normal promotion.
 * @param {string} id
 * @param {{ docID: string, submitted: string, periodEnd: string }} newer
 * @param {string} [root] repository root
 */
export function refreshIdentity(id, newer, root = process.cwd()) {
  const state = loadState(id);
  const old = state.identity;
  const oldDoc = old.originalDocID ?? old.docID;
  const archive = join(root, "pipeline/analysis/superseded", `${id}-${oldDoc}`);
  mkdirSync(archive, { recursive: true });
  const results = join(root, "pipeline/results");
  for (const f of fragmentFiles(id, results)) {
    copyFileSync(join(results, f), join(archive, f));
    rmSync(join(results, f));
  }
  const staged = join(root, "pipeline/staging", `${id}.json`);
  if (existsSync(staged)) {
    copyFileSync(staged, join(archive, `staging-${id}.json`));
    rmSync(staged);
  }

  state.identity = { ...old, docID: newer.docID, originalDocID: newer.docID, submitted: newer.submitted, periodEnd: newer.periodEnd, corrections: [], amendments: null };
  saveState(state);
  rebuildPack(id, state.identity);
  const summary = readPack(id);
  if (!summary || (summary.filing?.originalDocID ?? summary.filing?.docID) !== newer.docID) {
    throw new Error(`再構築した証拠パックが新しい有報 ${newer.docID} になっていない`);
  }
  const fresh = loadState(id);
  fresh.identity = { ...fresh.identity, docID: summary.filing?.docID ?? newer.docID, corrections: windowCorrections(summary), amendments: amendmentIdentity(summary) };
  const at = new Date().toISOString();
  const reset = (/** @type {string} */ stage, /** @type {string} */ status, /** @type {string | null} */ note) => {
    fresh.stages[stage] = { status, attempts: 0, ...(note ? { note, at } : {}) };
  };
  for (const stage of AGENT_STAGE_GROUPS.flat()) reset(stage, "pending", null);
  reset("sourceValidation", "pending", null);
  reset("qualityControl", "pending", null);
  reset("identity", "completed", `${old.filerName} / ${old.code} / docID ${newer.docID}（${oldDoc} から新しい有報に更新。旧成果物は pipeline/analysis/superseded/${id}-${oldDoc}/）`);
  reset("edinet", "completed", `pack + draft 再作成（${newer.docID}）`);
  // The figures-only entry is what "registered" means for this company until it is promoted.
  reset("registration", "completed", "figures-only 登録のまま（新しい有報での昇格はこれから）");
  saveState(fresh);
  return fresh;
}
