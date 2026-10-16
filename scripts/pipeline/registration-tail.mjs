/**
 * What happens AFTER a registration has written its files and passed the gate — and the recovery of a
 * registration that was interrupted before it got here.
 *
 * `finalize.mjs --register` writes the entry, the revision, the research log and (for a new company)
 * the index line, runs the integrity suite and the type check, and only then does the bookkeeping in
 * `finishRegistration`: stamp `registeredAt`, mark the `registration` stage completed, record the
 * company's taxonomy gaps, and delete the staging file. If the process dies between the files being
 * written and that bookkeeping (a laptop going to sleep during the test run left ahresty exactly
 * there on 2026-10-09), the entry is already published but `registration` stays `running`, and the
 * normal commands cannot finish the job: `advance.mjs` calls an already-published company "done", and
 * `finalize.mjs --register` refuses to overwrite an existing entry that is not figures-only.
 *
 * `recoverRegistration` finishes only that bookkeeping, and only when everything the registration
 * wrote can be shown to be there and to be exactly what the fragments would produce now. It never
 * writes an entry, a revision, a research log or an index line; anything it cannot verify makes it
 * stop and change nothing.
 *
 *   node scripts/pipeline/recover-registration.mjs <company-id> [--dry-run]
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadState, saveState, setStage } from "./company-state.mjs";
import { mergeEntry } from "./merge-fragments.mjs";
import { recordTaxonomyGaps } from "./taxonomy-gaps.mjs";

/**
 * The bookkeeping that completes a registration, in the order `finalize.mjs` has always done it.
 * Taxonomy gaps come after the stage is marked complete — "a vocabulary gap must not be able to undo
 * a registration" — and the staging file goes last, so a crash in between leaves the evidence.
 * @param {{ companyId: string, entryState: string, taxonomyGaps?: any[], stagedPath: string, root?: string }} input
 */
export function finishRegistration({ companyId, entryState, taxonomyGaps = [], stagedPath, root = process.cwd() }) {
  const state = loadState(companyId);
  state.registeredAt = new Date().toISOString();
  saveState(state);
  setStage(companyId, "registration", "completed", `登録済み（状態 ${entryState}）`);
  recordTaxonomyGaps(companyId, taxonomyGaps, root);
  rmSync(stagedPath, { force: true });
}

/** The gate `finalize.mjs` runs after writing: the whole-repository integrity suite, then the type check. */
export function runIntegrityGate(root = process.cwd()) {
  const run = (args) => execFileSync(process.execPath, args, { cwd: root, encoding: "utf8", env: process.env });
  run(["node_modules/vitest/vitest.mjs", "run", "tests/data-integrity.test.ts"]);
  run(["node_modules/typescript/lib/tsc.js", "--noEmit"]);
}

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

/**
 * @typedef {{ ok: boolean, changed: boolean, reason: string, actions: string[] }} RecoveryResult
 */

/**
 * @param {string} companyId
 * @param {{ root?: string, dryRun?: boolean, buildEntry?: (id: string) => any, gate?: () => void }} [options]
 *   `buildEntry` and `gate` are injectable so the checks can be tested without the evidence cache and
 *   without running the whole test suite.
 * @returns {RecoveryResult}
 */
export function recoverRegistration(companyId, { root = process.cwd(), dryRun = false, buildEntry = mergeEntry, gate = () => runIntegrityGate(root) } = {}) {
  const refuse = (/** @type {string} */ reason) => ({ ok: false, changed: false, reason, actions: [] });

  // 1. The company is mid-registration and nothing else.
  const statePath = join(root, "pipeline/state", `${companyId}.json`);
  if (!existsSync(statePath)) return refuse(`pipeline/state/${companyId}.json がありません`);
  const registration = loadState(companyId).stages.registration;
  if (registration.status === "completed") return { ok: true, changed: false, reason: "registration は既に completed — 何もしません", actions: [] };
  if (registration.status !== "running") return refuse(`registration が ${registration.status} です（running の会社だけが対象）`);

  // 2. The entry exists, is a described one, and is the entry the fragments produce now.
  const entryPath = join(root, "src/data/companies", `${companyId}.json`);
  if (!existsSync(entryPath)) return refuse("エントリーがありません（登録がファイルを書く前に止まった。通常の登録をやり直すこと）");
  const entry = readJson(entryPath);
  if (entry.id !== companyId) return refuse(`エントリーの id が ${entry.id} です`);
  if (!["published", "needs-attention"].includes(entry.status?.state)) return refuse(`エントリーの状態が ${entry.status?.state} です（解説付きの published / needs-attention だけが対象）`);

  /** @type {any} */
  let built;
  try {
    built = buildEntry(companyId);
  } catch (error) {
    return refuse(`フラグメントからエントリーを作り直せません: ${String(/** @type {Error} */ (error).message).slice(0, 200)}`);
  }
  if (built.missing?.length > 0) return refuse(`工程が未完了です（${built.missing.join(", ")}）`);
  // `updatedAt` is the day the registration ran; the rebuild stamps today.
  const rebuilt = { ...built.entry, updatedAt: entry.updatedAt };
  if (JSON.stringify(rebuilt) !== JSON.stringify(entry)) return refuse("現在のエントリーが、既存のフラグメントから作り直したエントリーと一致しません");

  // 3. Everything else the registration wrote is there, once.
  const revisionsDir = join(root, "src/data/revisions");
  const revisions = existsSync(revisionsDir)
    ? readdirSync(revisionsDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => readJson(join(revisionsDir, f)))
        .filter((r) => r.targetType === "company" && r.targetId === companyId && r.changedAt === entry.updatedAt)
    : [];
  if (revisions.length !== 1) return refuse(`${entry.updatedAt} の改訂記録が ${revisions.length} 件です（1件のはず）`);
  if (!existsSync(join(root, "docs/research", `${companyId}.md`))) return refuse(`リサーチログ docs/research/${companyId}.md がありません`);
  const indexPath = join(root, "src/data/companies/index.ts");
  if (!existsSync(indexPath) || !readFileSync(indexPath, "utf8").includes(`${companyId}.json`)) return refuse("src/data/companies/index.ts に載っていません");

  // 4. The staging file, if it is still there, is this very entry — otherwise it is somebody else's evidence.
  const stagedPath = join(root, "pipeline/staging", `${companyId}.json`);
  if (existsSync(stagedPath)) {
    let staged;
    try {
      staged = readJson(stagedPath);
    } catch {
      return refuse("ステージングファイルを読めません");
    }
    if (JSON.stringify(staged) !== JSON.stringify(entry)) return refuse("ステージングファイルがエントリーと一致しません");
  }

  const actions = [
    "registeredAt を記録",
    "registration を completed にする",
    `taxonomyGaps ${built.taxonomyGaps?.length ?? 0} 件を台帳に記録（その会社の行を置き換えるので重複しない）`,
    ...(existsSync(stagedPath) ? ["ステージングファイルを削除（エントリーと同一であることを確認済み）"] : []),
  ];
  if (dryRun) return { ok: true, changed: false, reason: "dry-run: 上の確認はすべて通った。何も変更していません", actions };

  // 5. Nothing is known about whether the gate finished before the interruption: run it again.
  try {
    gate();
  } catch (error) {
    return refuse(`整合性テストまたは型チェックが通りません: ${String(/** @type {any} */ (error).stdout ?? /** @type {Error} */ (error).message).slice(-300)}`);
  }

  finishRegistration({ companyId, entryState: entry.status.state, taxonomyGaps: built.taxonomyGaps ?? [], stagedPath, root });
  return { ok: true, changed: true, reason: "登録の後処理を完了しました", actions };
}
