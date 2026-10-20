/**
 * The approver registry (src/data/approvers.json) for the pipeline scripts. Same file as src/lib/content/approvers.ts.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** @returns {{ id: string, name: string, kind: "operator" | "person" | "agent" }} */
export function resolveApprover(/** @type {string | null | undefined} */ id, root = process.cwd()) {
  const file = JSON.parse(readFileSync(join(root, "src/data/approvers.json"), "utf8"));
  const wanted = id ?? file.default;
  const found = file.approvers.find((/** @type {any} */ a) => a.id === wanted && a.kind !== "agent");
  if (!found) throw new Error(`承認者「${wanted}」は src/data/approvers.json にありません（登録済み: ${file.approvers.filter((/** @type {any} */ a) => a.kind !== "agent").map((/** @type {any} */ a) => a.id).join(", ")}）`);
  return found;
}

/**
 * Is this process an AI agent? Claude Code sets CLAUDECODE=1 in every shell it runs; JCE_AGENT=1 marks any other.
 * @param {Record<string, string | undefined>} env
 */
export const runByAgent = (env = process.env) => env.CLAUDECODE === "1" || env.JCE_AGENT === "1";

/**
 * The approval to record. A person running the command approves formally. An AI agent running it is recorded as the
 * agent, on the person's authority, with the basis — never as the person (2026-10-19: three companies were recorded as
 * YUGENQ's approval although Claude Code ran `approve`; see their approval-correction revisions).
 * @param {{ id?: string | null, root?: string, env?: Record<string, string | undefined>, at: string, reviewHash?: string | null, fields?: string[], basis?: string | null }} p
 * @returns {{ approver: { id: string, name: string, kind: "operator" | "person" | "agent" }, approvedAt: string, reviewHash?: string, fields?: string[], onBehalfOf?: { id: string, name: string, kind: "operator" | "person" | "agent" }, basis?: string }}
 */
export function approvalFor({ id = null, root = process.cwd(), env = process.env, at, reviewHash = null, fields, basis = null }) {
  const person = resolveApprover(id, root);
  const common = { approvedAt: at, ...(reviewHash ? { reviewHash } : {}), ...(fields ? { fields } : {}) };
  if (!runByAgent(env)) return { approver: person, ...common };
  const file = JSON.parse(readFileSync(join(root, "src/data/approvers.json"), "utf8"));
  const agent = file.approvers.find((/** @type {any} */ a) => a.kind === "agent");
  if (!agent) throw new Error("AI エージェントが承認を実行しようとしていますが、src/data/approvers.json に kind: agent の項目がありません");
  return {
    approver: agent,
    ...common,
    onBehalfOf: person,
    basis: basis ?? "AI エージェントが approve を実行した。確認シートを人が読んだ記録はない（正式な承認ではない）",
  };
}
