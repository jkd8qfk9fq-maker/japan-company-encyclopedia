/**
 * Company state and job queue for the registration pipeline.
 *
 * One JSON file per company under `pipeline/state/<company-id>.json`, holding a
 * status per stage. Nothing here does research: it records what has been done so
 * a stopped run resumes instead of repeating, which is the whole point — a
 * completed stage is never re-run, and a failed one is retried up to three times
 * before it becomes `needs-review`.
 *
 * Deliberately a flat file and a handful of functions rather than a framework.
 * The project already has the expensive parts (the EDINET cache, the evidence
 * packs, the verifier); what was missing was memory of where each company got to.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const STAGES = [
  "identity",
  "edinet",
  "businessStructure",
  "businessModel",
  "history",
  "industry",
  "relatedCompanies",
  "terms",
  "sourceValidation",
  "qualityControl",
  "registration",
];

/** Stages a script can do on its own — no model tokens, fully deterministic. */
export const MECHANICAL_STAGES = new Set(["identity", "edinet", "sourceValidation", "qualityControl", "registration"]);

/**
 * Stages that need judgement, and therefore an agent. Those in the same array
 * depend only on identity+edinet, so they can run together; the spec's parallel
 * group. Kept as one agent job per group because a session rate limit has killed
 * concurrent agents every time it was tried in this project.
 */
export const AGENT_STAGE_GROUPS = [
  ["businessStructure", "history"],
  ["businessModel", "industry", "relatedCompanies", "terms"],
];

export const STATUSES = ["pending", "running", "completed", "failed", "needs-review", "skipped"];
const MAX_ATTEMPTS = 3;

const stateDir = () => {
  const dir = join(process.cwd(), "pipeline/state");
  mkdirSync(dir, { recursive: true });
  return dir;
};

const statePath = (companyId) => join(stateDir(), `${companyId}.json`);

export function loadState(companyId) {
  const path = statePath(companyId);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  return {
    companyId,
    createdAt: new Date().toISOString(),
    stages: Object.fromEntries(STAGES.map((s) => [s, { status: "pending", attempts: 0 }])),
  };
}

export function saveState(state) {
  state.updatedAt = new Date().toISOString();
  writeFileSync(statePath(state.companyId), `${JSON.stringify(state, null, 2)}\n`);
  return state;
}

/**
 * Record the outcome of one stage. `note` is free text the next reader needs —
 * why it failed, what it skipped, which filing it used.
 */
export function setStage(companyId, stage, status, note = null) {
  if (!STAGES.includes(stage)) throw new Error(`unknown stage: ${stage}`);
  if (!STATUSES.includes(status)) throw new Error(`unknown status: ${status}`);
  const state = loadState(companyId);
  const entry = state.stages[stage];
  if (status === "running") entry.attempts = (entry.attempts ?? 0) + 1;
  entry.status = status === "failed" && entry.attempts >= MAX_ATTEMPTS ? "needs-review" : status;
  entry.note = note;
  entry.at = new Date().toISOString();
  if (entry.status === "needs-review" && status === "failed") {
    entry.note = `${note ?? "失敗"}（${entry.attempts}回失敗したため needs-review。原因を人が確認すること）`;
  }
  return saveState(state);
}

/** Stages still to do, in order, skipping anything already completed or parked. */
export function pendingStages(companyId) {
  const state = loadState(companyId);
  return STAGES.filter((s) => !["completed", "skipped", "needs-review"].includes(state.stages[s].status));
}

/** The next agent job group whose dependencies are met, or null. */
export function nextAgentGroup(companyId) {
  const state = loadState(companyId);
  const done = (s) => ["completed", "skipped"].includes(state.stages[s].status);
  if (!done("identity") || !done("edinet")) return null;
  for (const group of AGENT_STAGE_GROUPS) {
    const todo = group.filter((s) => !done(s) && state.stages[s].status !== "needs-review");
    if (todo.length > 0) return todo;
  }
  return null;
}

/**
 * Bring the agent stages into line with the fragments on disk.
 *
 * An agent writes pipeline/results/<id>-<stage>.json and does not touch the
 * state file — asking an agent to also record its own bookkeeping is one more
 * thing it can get wrong, and the fragment is the evidence anyway. So the state
 * is reconciled from the fragments instead: a fragment that says `completed`
 * completes its stage, anything else parks it for a human. Without this a
 * registered company still reported six pending stages and nextAgentGroup kept
 * offering work that was already done.
 */
export function syncAgentStages(companyId) {
  const dir = join(process.cwd(), "pipeline/results");
  if (!existsSync(dir)) return loadState(companyId);
  const agentStages = new Set(AGENT_STAGE_GROUPS.flat());
  let state = loadState(companyId);
  for (const file of readdirSync(dir)) {
    if (!file.startsWith(`${companyId}-`) || !file.endsWith(".json")) continue;
    const stage = file.slice(companyId.length + 1, -".json".length);
    if (!agentStages.has(stage) || state.stages[stage].status === "completed") continue;
    const body = JSON.parse(readFileSync(join(dir, file), "utf8"));
    state = body.status === "completed"
      ? setStage(companyId, stage, "completed", `${body.agent ?? "agent"} の成果物あり（警告 ${(body.warnings ?? []).length} 件）`)
      : setStage(companyId, stage, "needs-review", `成果物の status が ${body.status}`);
  }
  return state;
}
export function summary(companyId) {
  const state = loadState(companyId);
  return STAGES.map((s) => `${s}:${state.stages[s].status}`).join(" ");
}

export function allStates() {
  return readdirSync(stateDir())
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(stateDir(), f), "utf8")));
}

// CLI: node scripts/pipeline/company-state.mjs <company-id> [stage status [note]]
if (process.argv[1]?.endsWith("company-state.mjs")) {
  const [companyId, stage, status, ...note] = process.argv.slice(2);
  if (!companyId) {
    for (const s of allStates()) console.log(`${s.companyId.padEnd(34)} ${STAGES.filter((x) => s.stages[x].status === "completed").length}/${STAGES.length}  ${summary(s.companyId)}`);
  } else if (stage && status) {
    setStage(companyId, stage, status, note.join(" ") || null);
    console.log(`${companyId} ${stage} → ${loadState(companyId).stages[stage].status}`);
  } else {
    console.log(summary(companyId));
    const next = nextAgentGroup(companyId);
    console.log(next ? `next agent job: ${next.join(", ")}` : "no agent job ready");
  }
}
