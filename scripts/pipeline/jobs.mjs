/**
 * One company = one job: a READ-ONLY view over the state the pipeline already keeps.
 *
 * There is deliberately no new state file and no new schema here. A company's job is
 * the join of five things that already exist —
 *
 *   pipeline/universe.tsv        who exists (discover.mjs)
 *   pipeline/state/<id>.json     what each stage did (company-state.mjs)
 *   src/data/companies/<id>.json what has been registered, and at which tier
 *   pipeline/reserved.tsv        who is being worked on right now
 *   pipeline/intake-failures.tsv what intake could not read
 *
 * — and `jobStage` names where that join says the company is. Because it is derived,
 * it cannot drift from the files it reads, and a stopped run needs no recovery step:
 * the next `queue.mjs` call simply recomputes.
 *
 * The stage names, and what they are made of:
 *
 *   queued              in the universe, no id yet (intake has not run)
 *   intake              identity + edinet done (pack and draft exist), nothing registered
 *   figures-only        registered with figures only, no agent work yet
 *   research            some agent stages done (businessStructure … terms)
 *   registration-ready  every agent stage done, still figures-only: finalize is next
 *   published           registered with prose
 *   needs-attention     a human has to look (reasons attached)
 *   failed              permanently out (e.g. not listed): nothing to retry
 *
 * `retryable` (a stage failed fewer than three times, so running it again is allowed) and
 * `reserved` are flags on top, not stages: a company can be in `research` and reserved.
 * The editorial design is one shared template, not a per-company step, and the schema +
 * integrity gates (sourceValidation, qualityControl) run inside finalize.mjs, so neither
 * appears as a stage a company sits in.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { AGENT_STAGE_GROUPS, allStates, reservations } from "./company-state.mjs";

const AGENT_STAGES = AGENT_STAGE_GROUPS.flat();
const MAX_ATTEMPTS = 3;
/** A stage "running" for longer than this was left by a process that died. */
export const STALE_RUNNING_MS = 60 * 60 * 1000;
/** A reservation older than this is almost certainly a leak. */
export const STALE_RESERVATION_MS = 24 * 60 * 60 * 1000;
/** How many days the universe may lag behind today before `queue.mjs check` says so. */
export const UNIVERSE_MAX_AGE_DAYS = 3;

/**
 * @typedef {{ stage: string, reserved: boolean, retryable: boolean, reasons: string[] }} Job
 */

/**
 * Where is this company? Pure: facts in, a name and the reasons out.
 * @param {{
 *   intakeFailure?: string | null,
 *   state: any | null,
 *   tier: string | null,
 *   entryNotes?: string[],
 *   reserved?: boolean,
 *   amendmentAction?: string | null,
 * }} facts
 * @returns {Job}
 */
export function jobStage({ intakeFailure = null, state, tier, entryNotes = [], reserved = false, amendmentAction = null }) {
  const reasons = [];
  const stages = state?.stages ?? null;
  const status = (s) => stages?.[s]?.status;
  const done = (s) => ["completed", "skipped"].includes(status(s));
  const out = (stage, retryable = false) => ({ stage, reserved, retryable, reasons });

  // A correction that changes what is registered is an exception on its own, whatever
  // tier the company sits in — it is the one place a published page can become wrong
  // without anything in the pipeline having failed.
  const amendmentNeedsLook = amendmentAction && ["needs-attention", "update-financials", "update-financials+needs-attention"].includes(amendmentAction);
  if (amendmentNeedsLook) reasons.push(`訂正有価証券報告書: ${amendmentAction}`);

  if (tier === "needs-attention") {
    reasons.push(...(entryNotes.length > 0 ? entryNotes : ["エントリーの status が needs-attention"]));
    return out("needs-attention");
  }
  if (tier === "published") return amendmentNeedsLook ? out("needs-attention") : out("published");

  // No entry yet.
  if (tier === null) {
    if (!state) {
      if (intakeFailure === null) return out("queued");
      reasons.push(`intake が失敗: ${intakeFailure}`);
      // EDINET serves no XBRL for a foreign issuer: there is nothing to retry. Any other failure
      // is an extractor gap, and a re-run picks the company up once that is fixed.
      return /外国会社/.test(intakeFailure) ? out("failed") : out("queued", true);
    }
    if (status("registration") === "needs-review") {
      const note = stages.registration.note ?? "";
      reasons.push(note || "registration が needs-review");
      // Not listed: a deliberate, permanent exclusion — nothing a person can fix.
      return /非上場|上場していない/.test(note) ? out("failed") : out("needs-attention");
    }
    const parked = Object.keys(stages).filter((s) => status(s) === "needs-review");
    if (parked.length > 0) {
      reasons.push(...parked.map((s) => `${s}: needs-review（${stages[s].note ?? ""}）`));
      return out("needs-attention");
    }
    const failing = Object.keys(stages).filter((s) => status(s) === "failed");
    if (failing.length > 0) {
      reasons.push(...failing.map((s) => `${s}: ${stages[s].note ?? "failed"}`));
      return out("intake", true);
    }
    if (!done("identity") || !done("edinet")) {
      if (!state.identity?.code) reasons.push("identity が無い");
      return out(state.identity?.code ? "queued" : "needs-attention");
    }
    return out("intake");
  }

  // Registered at the figures-only tier: how far has the prose work got?
  const agentDone = AGENT_STAGES.filter(done).length;
  const agentParked = AGENT_STAGES.filter((s) => status(s) === "needs-review");
  const gateParked = ["sourceValidation", "qualityControl"].filter((s) => status(s) === "needs-review");
  if (agentParked.length > 0 || gateParked.length > 0) {
    reasons.push(...[...agentParked, ...gateParked].map((s) => `${s}: needs-review（${stages[s].note ?? ""}）`));
    return out("needs-attention");
  }
  const failing = [...AGENT_STAGES, "sourceValidation", "qualityControl"].filter((s) => status(s) === "failed");
  const retryable = failing.some((s) => (stages[s].attempts ?? 0) < MAX_ATTEMPTS);
  if (failing.length > 0) reasons.push(...failing.map((s) => `${s}: ${stages[s].note ?? "failed"}`));
  if (amendmentNeedsLook) return out("needs-attention");
  if (agentDone === AGENT_STAGES.length) return out("registration-ready", retryable);
  if (agentDone > 0) return out("research", retryable);
  return out("figures-only", retryable);
}

/**
 * Universe rows intake should take next: no id yet, no failure on record, and — the part
 * that makes a stopped run safe to resume — no pipeline state already carrying that
 * securities code. Intake used to write the ids back only at the END of a run, so a run
 * that died midway left states with no id in the universe, and the next run assigned the
 * same company a second id (`name-1234`): a duplicate company under a second URL.
 * @param {{ code: string, id: string }[]} rows
 * @param {{ identity?: { code?: string } }[]} states
 * @param {Set<string>} [failedCodes]
 */
export function intakeCandidates(rows, states, failedCodes = new Set()) {
  const codes = new Set(states.map((s) => s.identity?.code).filter(Boolean));
  return rows.filter((r) => !r.id && !codes.has(r.code) && !failedCodes.has(r.code));
}

/**
 * Things that should not be true of the pipeline's files, and are worth stopping for.
 * Pure: it reads nothing, so each rule is testable on a few lines of fixture.
 * `error` blocks a mass run; `warn` is for a person to look at.
 * @param {{
 *   states: { companyId: string, identity?: { code?: string }, stages: any }[],
 *   entries: { id: string, code: string, tier: string }[],
 *   universe: { code: string, id: string, docID?: string, submitted?: string }[],
 *   reservations: { id: string, owner: string | null, at: string | null }[],
 *   now?: number,
 *   ownerAlive?: (owner: string | null) => boolean | null,
 *   universeWindowEnd?: string | null,
 *   postFilingEvents?: Map<string, string> | null,
 *   indexAudit?: { from: string, to: string, missing: string[], corrupt: string[], notFinal: string[] } | null,
 * }} input
 * @returns {{ level: "error" | "warn", rule: string, id: string, message: string }[]}
 */
export function checkConsistency({ states, entries, universe, reservations: reserved, now = Date.now(), ownerAlive = () => null, universeWindowEnd = null, indexAudit = null, postFilingEvents = null }) {
  const problems = [];
  const add = (level, rule, id, message) => problems.push({ level, rule, id, message });
  const entryById = new Map(entries.map((e) => [e.id, e]));
  const stateById = new Map(states.map((s) => [s.companyId, s]));

  // No company twice: by securities code, in each place a company lives.
  const dup = (items, key) => {
    const seen = new Map();
    for (const item of items) {
      const k = key(item);
      if (!k) continue;
      if (seen.has(k)) add("error", "duplicate-code", item.id ?? item.companyId, `証券コード ${k} が ${seen.get(k)} と重複`);
      else seen.set(k, item.id ?? item.companyId);
    }
  };
  dup(states, (s) => s.identity?.code);
  dup(entries, (e) => e.code);
  dup(universe.filter((u) => u.id), (u) => u.code);

  for (const state of states) {
    const id = state.companyId;
    const entry = entryById.get(id);
    if (entry && state.identity?.code && entry.code !== state.identity.code) {
      add("error", "code-mismatch", id, `state の証券コード ${state.identity.code} とエントリーの ${entry.code} が違う`);
    }
    if (state.stages.registration.status === "completed" && !entry) {
      add("error", "registered-without-entry", id, "registration が completed なのにエントリーが無い");
    }
    if (entry && entry.tier !== "figures-only" && state.stages.registration.status === "pending") {
      add("warn", "entry-without-registration", id, `エントリー（${entry.tier}）があるが registration が pending`);
    }
    for (const [stage, s] of Object.entries(state.stages)) {
      if (s.status === "running" && (!s.at || now - Date.parse(s.at) > STALE_RUNNING_MS)) {
        add("warn", "stale-running", id, `${stage} が running のまま（${s.at ?? "時刻なし"}）。中断された可能性。再開するなら: node scripts/pipeline/company-state.mjs ${id} ${stage} pending`);
      }
    }
  }

  // The universe is a snapshot of EDINET up to the last day it scanned. Past that day a company may
  // have filed its next 有報 without the row noticing — the Zenken pilot was built on a year-old filing
  // for exactly this reason. Anything older than UNIVERSE_MAX_AGE_DAYS before today is stale.
  if (universeWindowEnd) {
    const age = Math.floor((now - Date.parse(`${universeWindowEnd}T00:00:00Z`)) / 86_400_000);
    if (age > UNIVERSE_MAX_AGE_DAYS) add("warn", "universe-window-stale", "-", `universe.tsv の窓は ${universeWindowEnd} まで（${age} 日前）。それ以降に出た有報を知らない。node scripts/pipeline/discover.mjs で更新できる`);
  }

  // The day indexes are the universe's only source and the only thing newerFiling reads. A day the
  // cache lost, cannot parse, or captured before the day was over (EDINET's batch ran on the day
  // itself) makes both quietly wrong, so it is surfaced — the next discover.mjs / advance.mjs
  // refetches exactly those days.
  if (indexAudit) {
    const days = [["欠落", indexAudit.missing], ["破損", indexAudit.corrupt], ["確定前に取得", indexAudit.notFinal]].filter(([, list]) => list.length > 0);
    for (const [label, list] of days) {
      add("warn", "index-cache-gap", "-", `日次索引 ${indexAudit.from}〜${indexAudit.to} のうち ${label} ${list.length} 日（${list.slice(0, 5).join(", ")}${list.length > 5 ? " …" : ""}）。node scripts/pipeline/discover.mjs が取り直す`);
    }
  }

  // A promoted entry (published / needs-attention) is prose and figures for ONE filing. When the
  // universe now carries a LATER 有報 for the same code, the entry describes last year's filing. It is
  // never refreshed automatically — a human decides — but it must not go unseen.
  const universeByCode = new Map(universe.map((u) => [u.code, u]));
  for (const entry of entries) {
    if (entry.tier === "figures-only") continue;
    const identity = stateById.get(entry.id)?.identity;
    const row = universeByCode.get(entry.code);
    if (!identity?.submitted || !row?.submitted || !row.docID) continue;
    const built = identity.originalDocID ?? identity.docID;
    if (row.submitted > identity.submitted && row.docID !== built) {
      add("warn", "entry-built-on-old-filing", entry.id, `${entry.tier} のエントリーは ${built}（${identity.submitted} 提出）が出典だが、より新しい有報 ${row.docID}（${row.submitted} 提出）がある。自動更新はしない — 人が判断`);
    }
  }

  // Something happened to a promoted company after the 有報 its page is built on (a new name, a
  // tender offer). Candidates only — see post-filing.mjs. A person decides; nothing is rewritten.
  if (postFilingEvents) {
    for (const entry of entries) {
      if (entry.tier === "figures-only") continue; // an unpromoted company is parked by advance.mjs
      const text = postFilingEvents.get(entry.id);
      if (text) add("warn", "post-filing-event", entry.id, `有報提出後の変更の可能性: ${text}`);
    }
  }

  // Universe ↔ state: a row's id must belong to a state that carries the row's code.
  for (const u of universe) {
    if (!u.id) continue;
    const state = stateById.get(u.id);
    if (state?.identity?.code && state.identity.code !== u.code) {
      add("error", "universe-id-mismatch", u.id, `universe の ${u.code} と state の ${state.identity.code} が食い違う`);
    }
  }

  // Reservations: held once, by someone, and not on a company that is already done.
  const seen = new Set();
  for (const r of reserved) {
    if (seen.has(r.id)) add("error", "duplicate-reservation", r.id, "予約が二重");
    seen.add(r.id);
    const entry = entryById.get(r.id);
    if (ownerAlive(r.owner) === false) add("error", "reservation-dead-owner", r.id, `予約したプロセス（${r.owner}）はもう動いていない。queue.mjs reap で解放できる`);
    if (!stateById.has(r.id) && !entry) add("warn", "reservation-unknown-company", r.id, "state もエントリーも無い会社が予約されている");
    if (entry && entry.tier !== "figures-only") add("error", "reservation-leak", r.id, `既に ${entry.tier} なのに予約が残っている`);
    else if (!r.at) add("warn", "reservation-no-age", r.id, "予約に時刻がない（旧形式）。まだ作業中か確認して release すること");
    else if (now - Date.parse(r.at) > STALE_RESERVATION_MS) add("warn", "reservation-stale", r.id, `予約から ${Math.round((now - Date.parse(r.at)) / 3_600_000)} 時間経過（持ち主 ${r.owner ?? "不明"}）`);
  }
  return problems;
}

/** The last day the universe scanned, from its header line 「# 窓: 2024-09-01 〜 2026-09-28（…）」, or null. */
export function universeWindowEnd(root = process.cwd()) {
  return universeWindow(root)?.to ?? null;
}

/** The whole window, from the same header line, or null. */
export function universeWindow(root = process.cwd()) {
  const path = join(root, "pipeline/universe.tsv");
  if (!existsSync(path)) return null;
  const header = readFileSync(path, "utf8").split(/\r?\n/).find((l) => l.startsWith("# 窓:"));
  const m = /(\d{4}-\d{2}-\d{2})\s*〜\s*(\d{4}-\d{2}-\d{2})/.exec(header ?? "");
  return m ? { from: m[1], to: m[2] } : null;
}

// ----------------------------------------------------------------------- loading the real files
const read = (path) => JSON.parse(readFileSync(path, "utf8"));

/** @returns {{ code: string, filerName: string, docID: string, submitted: string, periodEnd: string, id: string }[]} */
export function loadUniverse(root = process.cwd()) {
  const path = join(root, "pipeline/universe.tsv");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => {
      const [code, filerName, docID, submitted, periodEnd, id] = l.split("\t");
      return { code, filerName, docID, submitted, periodEnd, id: id ?? "" };
    });
}

export function loadIntakeFailures(root = process.cwd()) {
  const path = join(root, "pipeline/intake-failures.tsv");
  if (!existsSync(path)) return new Map();
  return new Map(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.startsWith("#"))
      .map((l) => {
        const cols = l.split("\t");
        return [cols[0], cols[4] ?? ""];
      }),
  );
}

export function loadEntries(root = process.cwd()) {
  const dir = join(root, "src/data/companies");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const e = read(join(dir, f));
      return { id: e.id, code: e.code, tier: e.status?.state ?? "published", notes: e.status?.notes ?? [] };
    });
}

/** `pipeline/amendment-audit.json` (written by amendment-audit.mjs), by company id. */
export function loadAmendmentActions(root = process.cwd()) {
  const path = join(root, "pipeline/amendment-audit.json");
  if (!existsSync(path)) return new Map();
  return new Map(read(path).rows.map((r) => [r.companyId, r.action]));
}

/**
 * Every company the pipeline knows about, with its job. One row per company: a universe
 * row, a state, an entry, or any mix of them.
 * @param {string} [root]
 */
export function loadJobs(root = process.cwd()) {
  const universe = loadUniverse(root);
  const failures = loadIntakeFailures(root);
  const entries = loadEntries(root);
  const states = allStates();
  const entryById = new Map(entries.map((e) => [e.id, e]));
  const stateById = new Map(states.map((s) => [s.companyId, s]));
  const reserved = new Set(reservations().map((r) => r.id));
  const amendments = loadAmendmentActions(root);

  /** @type {{ id: string, code: string | null, name: string | null, job: Job }[]} */
  const jobs = [];
  const seen = new Set();
  const push = (id, code, name, facts) => {
    seen.add(id);
    jobs.push({ id, code, name, job: jobStage({ ...facts, reserved: reserved.has(id), amendmentAction: amendments.get(id) ?? null }) });
  };
  for (const u of universe) {
    const id = u.id || `(code ${u.code})`;
    const state = u.id ? (stateById.get(u.id) ?? null) : (states.find((s) => s.identity?.code === u.code) ?? null);
    const entry = u.id ? entryById.get(u.id) : undefined;
    if (u.id && seen.has(u.id)) continue;
    push(u.id || state?.companyId || id, u.code, u.filerName, {
      intakeFailure: failures.get(u.code) ?? null,
      state,
      tier: entry?.tier ?? null,
      entryNotes: entry?.notes ?? [],
    });
  }
  // Companies outside the universe file (registered by hand before it existed).
  for (const state of states) {
    if (seen.has(state.companyId)) continue;
    const entry = entryById.get(state.companyId);
    push(state.companyId, state.identity?.code ?? null, state.identity?.filerName ?? null, { state, tier: entry?.tier ?? null, entryNotes: entry?.notes ?? [] });
  }
  for (const entry of entries) {
    if (seen.has(entry.id)) continue;
    push(entry.id, entry.code, null, { state: null, tier: entry.tier, entryNotes: entry.notes });
  }
  return jobs;
}
