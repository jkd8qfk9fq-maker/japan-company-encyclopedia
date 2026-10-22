/**
 * Set up the update of a registered company's explanation from its newer 有価証券報告書 — only the parts the filing
 * changed are rewritten (docs/continuous-pipeline-design.md §4.5).
 *
 *   node --env-file=.env.local scripts/pipeline/start-update.mjs <company-id>            the plan (reads only)
 *   node --env-file=.env.local scripts/pipeline/start-update.mjs <company-id> --apply    set it up
 *
 * --apply moves the company onto the new filing the way an unpromoted company is moved (pack.mjs refreshIdentity:
 * fragments archived, pack rebuilt, agent stages back to pending), records what is kept in pipeline/state
 * (identity.retainedStages / retainedDocIDs, update-scope.mjs), and writes each kept stage back as a fragment taken
 * from the PUBLISHED entry. The rewritten stages are left for the agent (autopilot update → run). Nothing in src/data
 * is touched: the entry changes only through finalize --update, after a person approved the review sheet.
 *
 * Refused when the figures do not yet include the new filing's year: the facts are updated first
 * (refresh-financials), so the rewritten text and the table describe the same year.
 *
 * An update already set up for the same new filing is RE-PLANNED instead (a rule changed, or the person asked for more):
 * stages the new plan adds are taken out of the kept set and left for the agent; what was already rewritten is kept.
 *
 * Prints one JSON line last: { id, kind, … } — kind is no-explanation | unknown-source | current | keep | not-refreshed
 * | planned | started | replanned | parked.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadState, saveState, setStage } from "./company-state.mjs";
import { diffCompany, stageLine } from "./diff-filings.mjs";
import { refreshIdentity } from "./pack.mjs";
import { docIdOf } from "./source-meta.mjs";
import { CONTENT_STAGES, fragmentFromEntry } from "./update-scope.mjs";

/** What an update of this company would do, from the diff and the published entry. Pure. */
export function updatePlan(/** @type {any} */ diff, /** @type {any} */ entry) {
  if (diff.kind !== "rewrite") return { kind: diff.kind, detail: diff.detail ?? "新しい有報で変わった部分がしきい値に届かない（解説はそのまま）" };
  if (!(entry.financials ?? []).some((/** @type {any} */ f) => f.periodEnd === diff.newPeriodEnd)) {
    return { kind: "not-refreshed", detail: `財務に新しい有報の期（${diff.newPeriodEnd}）がない。先に refresh-financials で数値を更新する` };
  }
  const retainedDocIDs = [...new Set((entry.sources ?? []).map((/** @type {any} */ s) => s.docId ?? docIdOf(s.url)).filter((/** @type {string | null} */ d) => d && d !== diff.newDoc))];
  return {
    kind: "planned",
    newer: { docID: diff.newDoc, submitted: diff.newSubmitted, periodEnd: diff.newPeriodEnd },
    rewrite: diff.rewrite,
    retainedStages: CONTENT_STAGES.filter((s) => !diff.rewrite.includes(s)),
    retainedDocIDs,
  };
}

if (process.argv[1]?.endsWith("start-update.mjs")) {
  const id = process.argv[2];
  if (!id) {
    console.error("usage: node --env-file=.env.local scripts/pipeline/start-update.mjs <company-id> [--apply]");
    process.exit(1);
  }
  const root = process.cwd();
  const entry = JSON.parse(readFileSync(join(root, "src/data/companies", `${id}.json`), "utf8"));
  const diff = await diffCompany(id, root);
  const plan = updatePlan(diff, entry);
  for (const s of diff.stages ?? []) console.log(stageLine(s));
  if (plan.kind !== "planned" || !process.argv.includes("--apply")) {
    console.log(JSON.stringify({ id, ...plan, ...(diff.oldDoc ? { oldDoc: diff.oldDoc, newDoc: diff.newDoc } : {}) }));
    process.exit(0);
  }
  if (loadState(id).stages.registration.status === "needs-review") {
    console.log(JSON.stringify({ id, kind: "parked", detail: String(loadState(id).stages.registration.note ?? "needs-review") }));
    process.exit(0);
  }

  const oldDoc = diff.oldDoc;
  const before = loadState(id).identity ?? {};
  if (before.docID === plan.newer?.docID && Array.isArray(before.retainedStages)) {
    const added = (plan.rewrite ?? []).filter((s) => before.retainedStages.includes(s));
    const retainedStages = before.retainedStages.filter((/** @type {string} */ s) => !added.includes(s));
    const rewrite = CONTENT_STAGES.filter((s) => !retainedStages.includes(s));
    // A kept stage's fragment is the published text; it is set aside, not lost (the published entry is unchanged).
    const aside = join(root, "pipeline/analysis/superseded", `${id}-${plan.newer?.docID}-replan-${Date.now()}`);
    for (const stage of added) {
      const p = join(root, "pipeline/results", `${id}-${stage}.json`);
      if (existsSync(p)) {
        mkdirSync(aside, { recursive: true });
        renameSync(p, join(aside, `${id}-${stage}.json`));
      }
      setStage(id, stage, "pending", `更新の範囲を広げた（${plan.newer?.docID}）。書き直す`);
    }
    const state = loadState(id);
    state.identity.retainedStages = retainedStages;
    saveState(state);
    console.log(JSON.stringify({ id, kind: "replanned", oldDoc, newDoc: plan.newer?.docID, added, rewrite, retainedStages, retainedDocIDs: before.retainedDocIDs }));
    process.exit(0);
  }
  const archived = join(root, "pipeline/analysis/superseded", `${id}-${before.originalDocID ?? before.docID}`);
  refreshIdentity(id, /** @type {any} */ (plan.newer), root, {
    identity: { retainedStages: plan.retainedStages, retainedDocIDs: plan.retainedDocIDs },
    registrationNote: `登録済み（${oldDoc} の解説）。新しい有報 ${plan.newer?.docID} で ${plan.rewrite?.join("・")} を書き直す更新の途中`,
  });
  const results = join(root, "pipeline/results");
  for (const stage of plan.retainedStages ?? []) {
    writeFileSync(join(results, `${id}-${stage}.json`), `${JSON.stringify(fragmentFromEntry(entry, stage, plan.retainedDocIDs ?? []), null, 2)}\n`);
  }
  // The terms stage is advice and writes nothing into the entry, so an update does not redo it: the earlier advice is
  // carried over (an empty one when there was none), and the stage counts as done.
  const archivedTerms = join(archived, `${id}-terms.json`);
  const termsPath = join(results, `${id}-terms.json`);
  if (existsSync(archivedTerms)) copyFileSync(archivedTerms, termsPath);
  else writeFileSync(termsPath, `${JSON.stringify({ companyId: id, agent: "start-update", status: "completed", retained: plan.retainedDocIDs, data: {}, sources: [], warnings: [], needsReview: [] }, null, 2)}\n`);
  console.log(JSON.stringify({ id, kind: "started", oldDoc, newDoc: plan.newer?.docID, rewrite: plan.rewrite, retainedStages: plan.retainedStages, retainedDocIDs: plan.retainedDocIDs }));
}
