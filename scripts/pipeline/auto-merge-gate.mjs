/**
 * Whether a refresh-financials pull request may merge itself (decision JCE-058 — proposed; JCE-024 has a person merge
 * every one). Read-only: it decides, it never merges. The workflow merges only when the repository variable
 * AUTO_MERGE_FINANCIALS is "1" AND this says yes; otherwise the pull request waits for a person, as before.
 *
 *   node scripts/pipeline/auto-merge-gate.mjs --base <ref> --reports out [--json out/gate.json] [--summary out/gate.md]
 *
 * Yes only when every change in the pull request is something the checks vouched for and nothing needs a person:
 *   - the change set is only company entries, new revision files and the pipeline's own bookkeeping, nothing deleted;
 *   - every company entry changed is one a report says it updated (annual 有報, 半期報告書 or 決算短信 Q1/Q3);
 *   - no company's status changed (an update that turns an entry needs-attention, or edits its notes, is for a person);
 *   - the amendment audit ran to the end and found no new 訂正有価証券報告書 for a tracked company;
 *   - the annual run did not stop on a fatal error.
 * Companies the checks held or failed are not in the pull request at all (they are left as they were) and do not stop
 * it; they stay listed in its body for a person. The comparison logic (verify-financials) is not changed here.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COMPANY = /^src\/data\/companies\/([a-z0-9-]+)\.json$/;
const REVISION = /^src\/data\/revisions\/[a-z0-9-]+\.json$/;
const BOOKKEEPING = /^pipeline\/(amendments-index\.json|runs\/[A-Za-z0-9._-]+\.json)$/;

/**
 * @typedef {{ path: string, status: "A" | "M" | "D" | string, before: any, after: any }} Change
 * @typedef {{ outcomes?: { id: string, result: string }[], fatal?: unknown } | null} OutcomeReport
 * @typedef {{ error?: string | null, rows?: unknown[] } | null} AmendmentReport
 * @param {{ changes: Change[], refresh: OutcomeReport, interim: OutcomeReport, quarterly: OutcomeReport, amendment: AmendmentReport }} input
 * @returns {{ eligible: boolean, reasons: string[], companies: string[] }}
 */
export function decideAutoMerge({ changes, refresh, interim, quarterly, amendment }) {
  const reasons = [];
  if (changes.length === 0) reasons.push("変更がない");
  if (!refresh) reasons.push("年次（有報）の報告が無い");
  else if (refresh.fatal) reasons.push("年次（有報）の処理が致命的なエラーで止まった");

  const updated = new Set(
    [refresh, interim, quarterly].flatMap((r) => (r?.outcomes ?? []).filter((o) => o.result === "updated").map((o) => o.id)),
  );
  const companies = [];
  for (const change of changes) {
    if (change.status === "D") {
      reasons.push(`削除がある: ${change.path}`);
      continue;
    }
    const company = COMPANY.exec(change.path);
    if (company) {
      const id = company[1];
      companies.push(id);
      if (!updated.has(id)) reasons.push(`${id}: どの報告も「更新した」と言っていない変更`);
      if (change.status !== "M" || !change.before || !change.after) reasons.push(`${id}: 既存の企業の更新ではない（${change.status}）`);
      else if (JSON.stringify(change.before.status) !== JSON.stringify(change.after.status)) {
        reasons.push(`${id}: 状態または注記が変わった（${change.before.status?.state} → ${change.after.status?.state}）`);
      }
      continue;
    }
    if (REVISION.test(change.path)) {
      if (change.status !== "A") reasons.push(`改訂記録は追加だけのはず: ${change.path}（${change.status}）`);
      continue;
    }
    if (BOOKKEEPING.test(change.path)) continue;
    reasons.push(`自動では扱わない場所の変更: ${change.path}`);
  }

  if (!amendment) reasons.push("訂正報告書の監査の報告が無い");
  else {
    if (amendment.error) reasons.push("訂正報告書の監査が最後まで読めなかった");
    if ((amendment.rows ?? []).length > 0) reasons.push(`新しい訂正報告書がある（${(amendment.rows ?? []).length}社）— 人が確認する`);
  }
  return { eligible: reasons.length === 0, reasons, companies };
}

/** @param {string} path */
function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/** @param {string} base */
function changesSince(base) {
  const lines = execFileSync("git", ["diff", "--name-status", "--no-renames", base, "HEAD"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  return lines.map((line) => {
    const [status, path] = line.split("\t");
    const at = (/** @type {string} */ ref) => {
      try {
        return JSON.parse(execFileSync("git", ["show", `${ref}:${path}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }));
      } catch {
        return null;
      }
    };
    return { path, status, before: status === "A" ? null : at(base), after: status === "D" ? null : at("HEAD") };
  });
}

/** @param {{ eligible: boolean, reasons: string[], companies: string[] }} decision */
export function gateSummary(decision) {
  const head = "### 自動マージの判定（JCE-058 案・変数 AUTO_MERGE_FINANCIALS）";
  if (decision.eligible) return `${head}\n条件をすべて満たす（${decision.companies.length}社の更新がすべて照合済み・要確認なし・新しい訂正なし）。\n`;
  return `${head}\n条件を満たさないため、人がマージする:\n${decision.reasons.map((r) => `- ${r}`).join("\n")}\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const value = (/** @type {string} */ flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const base = value("--base") ?? "HEAD~1";
  const dir = value("--reports") ?? "out";
  const decision = decideAutoMerge({
    changes: changesSince(base),
    refresh: readJson(join(dir, "refresh-report.json")),
    interim: readJson(join(dir, "interim-report.json")),
    quarterly: readJson(join(dir, "quarterly-report.json")),
    amendment: readJson(join(dir, "amendment-report.json")),
  });
  if (value("--json")) writeFileSync(/** @type {string} */ (value("--json")), `${JSON.stringify(decision, null, 1)}\n`);
  if (value("--summary")) writeFileSync(/** @type {string} */ (value("--summary")), gateSummary(decision));
  console.log(`eligible=${decision.eligible}`);
  for (const r of decision.reasons) console.log(`  - ${r}`);
}
