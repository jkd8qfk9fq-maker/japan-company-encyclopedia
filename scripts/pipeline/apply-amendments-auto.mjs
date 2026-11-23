/**
 * Batch auto-application of 訂正有価証券報告書 (JCE-106, SaaS Step 4).
 *
 *   node scripts/pipeline/apply-amendments-auto.mjs                 dry run over every tracked company
 *   node scripts/pipeline/apply-amendments-auto.mjs <id> [<id> …]   dry run for those companies
 *   node scripts/pipeline/apply-amendments-auto.mjs --apply [--limit N] [--report f.json] [--summary f.md]
 *
 * The daily amendment audit (amendment-audit.mjs, run inside refresh-financials) is report-only:
 * applying a correction was `apply-amendment.mjs`, one company at a time, by hand, and only on the
 * machine that holds pipeline/state. This driver closes that gap for the classes a fixed rule can
 * decide, and holds everything else — it never widens what apply-amendment itself would do:
 *
 *   record-only        the audit proved the filing of record prints the same five-year figures and
 *                      the same prose sections the entry rests on. Nothing in the entry can change;
 *                      the correction is recorded as processed and the company leaves the queue.
 *   already-current    figures differ between the original and the filing of record, but the entry
 *                      already matches the filing of record (an earlier refresh took it). No write.
 *   apply              action update-financials, the entry agrees with the ORIGINAL filing
 *                      (registeredMismatchOriginal = 0, so it is amended, not stale), and the entry
 *                      does not yet match the filing of record → apply-amendment.mjs --apply.
 *   apply-flag-text    action needs-attention (text only) or update-financials+needs-attention with
 *                      the same agreement → apply-amendment.mjs --apply --flag-text. Prose is never
 *                      rewritten; a published entry is only marked needs-attention.
 *   hold               anything else (incomplete correction, error, entry disagrees with the
 *                      original, no entry yet). Reported, never written.
 *
 * apply-amendment.mjs keeps its own gates (verify-financials, schema/integrity, the data-integrity
 * suite on write, rollback on failure); a non-zero exit from it is a hold here, with its exit code.
 * It needs pipeline/state identity, which only the registration machine holds. When a state file is
 * absent this driver synthesises the minimal identity from the entry alone (the same facts
 * amendment-audit's identityFromEntry reads, plus the cited source's publishedAt as the submission
 * date) — it never overwrites an existing state file.
 *
 * Without --apply every company is only dry-run through apply-amendment (which writes nothing under
 * src/data) and this driver writes nothing at all. With --apply the writes are apply-amendment's:
 * the entry, a Revision and the pipeline state. Never git.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { amendmentsOf, ensureIndex } from "../research/amendments.mjs";
import { scrubSecrets } from "../research/edinet.mjs";
import { auditCompany, identityFromEntry } from "./amendment-audit.mjs";
import { loadState, saveState } from "./company-state.mjs";

/**
 * The fixed rule that turns one audit row into an auto-apply decision. Pure.
 * @param {{ action: string, status: string, tier: string, registeredMismatch: number|null, registeredMismatchOriginal: number|null }} row
 * @returns {{ mode: "record-only"|"already-current"|"apply"|"apply-flag-text"|"hold", reason: string }}
 */
export function autoApplyPlan(row) {
  if (row.status === "none") return { mode: "hold", reason: "訂正がない" };
  if (row.status === "error") return { mode: "hold", reason: "監査がエラーで終わった" };
  if (row.status === "incomplete") return { mode: "hold", reason: "最新の訂正が不完全で採用できない" };
  if (row.tier === "no-entry") return { mode: "hold", reason: "未登録の会社は登録時に有効文書から作る" };
  if (row.action === "record-only") return { mode: "record-only", reason: "財務も本文も変わらない" };
  if (row.action === "update-financials" || row.action === "update-financials+needs-attention") {
    if (row.registeredMismatch === 0) return { mode: "already-current", reason: "登録値は既に有効文書と一致" };
    if (row.registeredMismatchOriginal !== 0) return { mode: "hold", reason: "登録値が原本とも一致しない（訂正ではなく陳腐化）" };
    return row.action === "update-financials"
      ? { mode: "apply", reason: "財務が変わり、登録値は原本と一致している" }
      : { mode: "apply-flag-text", reason: "財務と本文が変わり、登録値は原本と一致している" };
  }
  if (row.action === "needs-attention") {
    if (row.registeredMismatch !== null && row.registeredMismatch !== 0) return { mode: "hold", reason: "財務の登録値が有効文書と一致しない" };
    return { mode: "apply-flag-text", reason: "本文だけが変わった" };
  }
  return { mode: "hold", reason: `推奨 ${row.action} は自動適用の対象外` };
}

/** The submission date of the filing an entry's newest figures cite, from the entry alone. Pure. */
export function submittedFromEntry(entry) {
  const latest = [...(entry.financials ?? [])].sort((a, b) => String(a.periodEnd).localeCompare(String(b.periodEnd))).at(-1);
  const source = (entry.sources ?? []).find((/** @type {any} */ s) => (latest?.sourceIds ?? []).includes(s.id));
  return source?.publishedAt ?? null;
}

/**
 * Give apply-amendment the pipeline/state identity it needs, from the entry alone.
 * An existing state file is never overwritten; returns false when one already has an identity.
 * @param {string} id @param {any} entry @param {{ code: string, docID: string, originalDocID: string, periodEnd: string }} identity
 */
function synthesiseState(id, entry, identity) {
  const state = loadState(id);
  if (state.identity?.docID) return false;
  const submitted = submittedFromEntry(entry);
  if (!submitted) return false;
  state.identity = { docID: identity.docID, originalDocID: identity.originalDocID, code: identity.code, periodEnd: identity.periodEnd, submitted };
  saveState(state);
  return true;
}

const runApplyAmendment = (/** @type {string} */ id, /** @type {boolean} */ apply, /** @type {boolean} */ flagText) => {
  const args = ["scripts/pipeline/apply-amendment.mjs", id];
  if (apply) args.push("--apply");
  if (flagText) args.push("--flag-text");
  try {
    const out = execFileSync(process.execPath, args, { cwd: process.cwd(), encoding: "utf8", env: process.env });
    return { exit: 0, tail: out.trim().split("\n").at(-1) ?? "" };
  } catch (error) {
    const e = /** @type {any} */ (error);
    return { exit: typeof e.status === "number" ? e.status : 1, tail: scrubSecrets(String(e.stdout ?? e.message ?? "")).trim().split("\n").filter(Boolean).at(-1) ?? "" };
  }
};

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const valueOf = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
  const reportPath = valueOf("--report");
  const summaryPath = valueOf("--summary");
  const limit = Number(valueOf("--limit") ?? "0") || 0;
  const only = args.filter((a, i) => !a.startsWith("--") && !["--report", "--summary", "--limit"].includes(args[i - 1]));

  const { index, added, error: indexError } = await ensureIndex({ fetch: true });
  if (indexError) console.error(`索引の取得が途中で止まりました: ${scrubSecrets(String(indexError))}（読み取れた範囲で続けます）`);
  console.log(`索引 ${index.checkedThrough} まで（新しい訂正 ${added.length} 件）`);

  // Every registered entry whose original filing has a correction in the index.
  const dir = join(process.cwd(), "src/data/companies");
  const candidates = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const entry = JSON.parse(readFileSync(join(dir, file), "utf8"));
    if (only.length > 0 && !only.includes(entry.id)) continue;
    const identity = identityFromEntry(entry, index);
    if (!identity) continue;
    if (amendmentsOf(index, identity.originalDocID).length === 0) continue;
    candidates.push({ id: entry.id, entry, identity });
  }
  console.log(`訂正のある登録済み会社: ${candidates.length} 社`);

  /** @type {any[]} */
  const outcomes = [];
  let applied = 0;
  for (const { id, entry, identity } of candidates) {
    const row = await auditCompany({ id, state: { companyId: id, identity }, entry, index });
    const plan = autoApplyPlan(row);
    const outcome = { id, tier: row.tier, action: row.action, mode: plan.mode, reason: plan.reason, effectiveDocID: row.effectiveDocID, result: "queued", detail: "" };
    if (plan.mode === "record-only" || plan.mode === "already-current") {
      outcome.result = plan.mode;
    } else if (plan.mode === "hold") {
      outcome.result = "held";
      outcome.detail = plan.reason;
    } else {
      if (limit > 0 && applied >= limit) { outcome.result = "held"; outcome.detail = `--limit ${limit} に達した`; outcomes.push(outcome); continue; }
      const hadIdentity = Boolean(loadState(id).identity?.docID);
      if (!hadIdentity && !synthesiseState(id, entry, identity)) { outcome.result = "held"; outcome.detail = "state の identity をエントリーから合成できない（提出日が無い）"; outcomes.push(outcome); continue; }
      const r = runApplyAmendment(id, apply, plan.mode === "apply-flag-text");
      applied++;
      outcome.result = r.exit === 0 ? (apply ? "applied" : "would-apply") : "held";
      outcome.detail = r.exit === 0 ? r.tail : `apply-amendment 終了コード ${r.exit}: ${r.tail}`;
    }
    outcomes.push(outcome);
    console.log(`${id}\t${row.action}\t${plan.mode}\t${outcome.result}${outcome.detail ? `\t${outcome.detail}` : ""}`);
  }

  const counts = /** @type {Record<string, number>} */ ({});
  for (const o of outcomes) counts[o.result] = (counts[o.result] ?? 0) + 1;
  const result = { apply, checkedThrough: index.checkedThrough, candidates: candidates.length, counts, outcomes };
  if (reportPath) writeFileSync(reportPath, `${JSON.stringify(result, null, 1)}\n`);
  if (summaryPath) {
    const lines = [`## 訂正有価証券報告書の自動適用（JCE-106、${apply ? "適用" : "ドライラン"}、索引 ${index.checkedThrough} まで）`, "",
      `対象 ${candidates.length} 社: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(" / ") || "なし"}`, ""];
    for (const o of outcomes.filter((o) => o.result === "held")) lines.push(`- 保留 ${o.id}: ${o.detail}`);
    writeFileSync(summaryPath, `${lines.join("\n")}\n`);
  }
  console.log("結果:", JSON.stringify(counts));
  process.exit(outcomes.some((o) => o.result === "held") ? 1 : 0);
}

if (process.argv[1]?.endsWith("apply-amendments-auto.mjs")) await main();
