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
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
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
 * @param {string} companyId
 * @param {string} stage
 * @param {string} status
 * @param {string | null} [note]
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

/**
 * The next agent job group whose dependencies are met, or null.
 *
 * A stage parked as `needs-review` (three failed attempts) is excluded from
 * what's offered — an agent should not be sent to redo work a human needs to
 * look at — but it is NOT "done": a group with any needs-review stage must
 * still block every later group, the same as a group with a pending stage
 * would. Treating needs-review as equivalent to done here would let a
 * company whose businessStructure/history both failed three times slide
 * straight into group 2 as if group 1 had actually finished, which silently
 * drops the failure instead of surfacing it (found 2026-10-01: a group whose
 * every stage was needs-review produced an empty `todo` and fell through to
 * offer the next group).
 */
export function nextAgentGroup(companyId) {
  const state = loadState(companyId);
  const done = (s) => ["completed", "skipped"].includes(state.stages[s].status);
  if (!done("identity") || !done("edinet")) return null;
  for (const group of AGENT_STAGE_GROUPS) {
    const todo = group.filter((s) => !done(s) && state.stages[s].status !== "needs-review");
    if (todo.length > 0) return todo;
    if (!group.every(done)) return null;
  }
  return null;
}

/**
 * The fragment files of ONE company: `<id>-<stage>.json` for a stage an agent owns, exactly.
 *
 * Matching on the prefix `<id>-` is wrong, and was: ヤマハ (`yamaha`) and ヤマハ発動機
 * (`yamaha-motor`) are two companies, and `yamaha-motor-businessStructure.json` starts with
 * `yamaha-`. The stage is the part after the id, so it must be one of the agent stages.
 * @param {string} companyId
 * @param {string} dir the pipeline/results directory
 * @returns {string[]} file names
 */
export function fragmentFiles(companyId, dir) {
  if (!existsSync(dir)) return [];
  const stages = new Set(AGENT_STAGE_GROUPS.flat());
  return readdirSync(dir).filter((f) => {
    if (!f.startsWith(`${companyId}-`) || !f.endsWith(".json")) return false;
    return stages.has(f.slice(companyId.length + 1, -".json".length));
  });
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
  for (const file of fragmentFiles(companyId, dir)) {
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

const reservedPath = () => join(process.cwd(), "pipeline/reserved.tsv");
const RESERVED_HEADER = "# 作業中の会社（id<TAB>持ち主<TAB>予約時刻）。register-figures.mjs と queue はここにある会社を取らない\n";

/**
 * Every reservation: `id<TAB>owner<TAB>ISO time`. The last two columns are optional so
 * a line written before they existed (a bare id) still reads — it just has no owner and
 * no age, which `queue.mjs check` reports rather than guesses at.
 * @returns {{ id: string, owner: string | null, at: string | null }[]}
 */
export function reservations() {
  const path = reservedPath();
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => {
      const [id, owner, at] = l.split("\t").map((c) => c.trim());
      return { id, owner: owner || null, at: at || null };
    });
}

function reservedIds() {
  return new Set(reservations().map((r) => r.id));
}

/**
 * Run `fn` holding the pipeline's lock — a directory, because mkdir is atomic on every
 * filesystem this runs on and "check then write" on reserved.tsv is not: two workers
 * that both saw a company unreserved would both take it. A lock older than `staleMs`
 * belongs to a process that died, and is taken over rather than waited on forever.
 * @template T
 * @param {() => T} fn
 * @param {{ timeoutMs?: number, staleMs?: number }} [options]
 * @returns {T}
 */
export function withLock(fn, { timeoutMs = 10_000, staleMs = 30_000 } = {}) {
  const lock = join(process.cwd(), "pipeline/.lock");
  mkdirSync(join(process.cwd(), "pipeline"), { recursive: true });
  const started = Date.now();
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== "EEXIST") throw error;
      let age = 0;
      try {
        age = Date.now() - statSync(lock).mtimeMs;
      } catch {
        continue; // released between the two calls — try again
      }
      if (age > staleMs) {
        rmSync(lock, { recursive: true, force: true });
        continue;
      }
      if (Date.now() - started > timeoutMs) throw new Error("pipeline のロックを取れない（別のプロセスが保持している）");
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
  try {
    return fn();
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
}

function reserveUnlocked(companyId, owner) {
  if (reservedIds().has(companyId)) return false;
  const path = reservedPath();
  const existing = existsSync(path) ? readFileSync(path, "utf8") : RESERVED_HEADER;
  const line = `${companyId}\t${owner}\t${new Date().toISOString()}\n`;
  writeFileSync(path, existing.endsWith("\n") ? `${existing}${line}` : `${existing}\n${line}`);
  return true;
}

/**
 * Reserve a company so register-figures.mjs and the queue skip it while someone works on
 * it. Exclusive: returns true only for the caller that took it, false if it was already
 * held — so two workers can never both get the same company. Callers that only mean
 * "make sure it is reserved" may ignore the result (it is idempotent, as before).
 * @param {string} companyId
 * @param {string} [owner]
 * @returns {boolean}
 */
export function reserve(companyId, owner = "pipeline") {
  return withLock(() => reserveUnlocked(companyId, owner));
}

/**
 * Is the process that holds this reservation still running? An owner is `name:pid`; one with no
 * pid (a hand reservation, or one written before pids were recorded) cannot be judged, so is null.
 * @param {string | null} owner
 * @returns {boolean | null}
 */
export function ownerAlive(owner) {
  const pid = Number(/:(\d+)$/.exec(owner ?? "")?.[1]);
  if (!Number.isInteger(pid) || pid <= 0) return null;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return /** @type {NodeJS.ErrnoException} */ (error).code === "EPERM";
  }
}

/**
 * Release every reservation whose owning process has died — a run killed mid-batch (the shell
 * closed, the session hit its limit) leaves its reservations behind, and a reserved company is
 * invisible to every queue until someone releases it. Only reservations that name a pid are
 * judged; a reservation that cannot be judged is left alone for a person.
 * @returns {string[]} the ids released
 */
export function reapDeadReservations() {
  return withLock(() => {
    const dead = reservations().filter((r) => ownerAlive(r.owner) === false).map((r) => r.id);
    if (dead.length === 0) return [];
    const path = reservedPath();
    const kept = readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => !dead.includes(l.split("\t")[0].trim()));
    writeFileSync(path, `${kept.join("\n").replace(/\n+$/, "")}\n`);
    return dead;
  });
}

/** Remove a company from pipeline/reserved.tsv. Idempotent. */
export function release(companyId) {
  withLock(() => {
    const path = reservedPath();
    if (!existsSync(path)) return;
    const kept = readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.split("\t")[0].trim() !== companyId);
    writeFileSync(path, `${kept.join("\n").replace(/\n+$/, "")}\n`);
  });
}

/**
 * Pick up to `limit` ready companies for a stage AND reserve them, as one step under the
 * lock. This — not readyForStage followed by reserve — is how a worker takes work: with
 * the two apart, a second worker could read the same list in between.
 * @param {"group1" | "group2" | "finalize"} stage
 * @param {number} limit
 * @param {string} [owner]
 * @returns {string[]}
 */
export function claim(stage, limit, owner = "worker") {
  return withLock(() => {
    const taken = [];
    for (const id of readyForStage(stage)) {
      if (taken.length >= limit) break;
      if (reserveUnlocked(id, owner)) taken.push(id);
    }
    return taken;
  });
}

/**
 * Company ids ready for the next unattended step, skipping anything already
 * reserved (an agent is working on it). Built on `nextAgentGroup`/`allStates`
 * rather than re-deriving readiness, so there is one definition of "done" in
 * this file, not two that can drift apart.
 *
 *   "group1"    — identity+edinet done, businessStructure/history still open.
 *   "group2"    — group 1 done, businessModel/industry/relatedCompanies/terms still open.
 *   "finalize"  — both agent groups done, entry not yet promoted past figures-only.
 *
 * "finalize" deliberately does not look at the `registration` pipeline stage:
 * that stage is already `completed` for every figures-only company (it IS the
 * figures-only write), so by itself it cannot say whether the prose
 * promotion this queue exists for has happened. The entry file's own
 * `status.state` is the only thing that actually distinguishes the two.
 */
export function readyForStage(stage) {
  if (!["group1", "group2", "finalize"].includes(stage)) throw new Error(`unknown stage: ${stage}`);
  const reserved = reservedIds();
  const out = [];
  for (const state of allStates()) {
    const id = state.companyId;
    if (reserved.has(id)) continue;
    // Permanently parked (e.g. a delisted company excluded on purpose, like
    // ntt-data-group) — registration:needs-review is the park signal even
    // when businessStructure/history were never individually touched, so
    // nextAgentGroup alone would not catch it.
    if (state.stages.registration.status === "needs-review") continue;
    if (stage === "finalize") {
      const done = (s) => ["completed", "skipped"].includes(state.stages[s].status);
      if (!AGENT_STAGE_GROUPS.every((g) => g.every(done))) continue;
      // sourceValidation/qualityControl are finalize.mjs's own mechanical
      // stages (not agent work), so unlike businessStructure/history a
      // needs-review here is never "one stage parked, the rest still worth
      // offering" — it means finalize itself cannot pass this entry (found
      // 2026-10-01: a-tie's empty `industries`, with no fitting
      // INDUSTRY_IDS category, blocks qualityControl permanently). Excluding
      // it here, not just at the `registration` check above, is what makes
      // the 3-strikes needs-review promotion actually a stopping point
      // instead of a label nothing reads.
      if (["sourceValidation", "qualityControl"].some((s) => state.stages[s].status === "needs-review")) continue;
      const companyPath = join(process.cwd(), "src/data/companies", `${id}.json`);
      if (existsSync(companyPath)) {
        const tier = JSON.parse(readFileSync(companyPath, "utf8")).status?.state ?? "published";
        if (tier !== "figures-only") continue;
      }
      out.push(id);
      continue;
    }
    const group = nextAgentGroup(id);
    if (!group || group.length === 0) continue;
    const isGroup1 = AGENT_STAGE_GROUPS[0].includes(group[0]);
    if ((stage === "group1") === isGroup1) out.push(id);
  }
  return out;
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
