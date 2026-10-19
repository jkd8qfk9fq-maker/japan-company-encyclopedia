/**
 * One company through the autopilot, as a resumable state machine. Every effect comes in through `deps`, so the
 * whole thing is tested with fakes: no network, no model, no repository.
 *
 * Resumable means: it reads the company's record and the pipeline's own state each time it is called, decides
 * what is next from those, and does one thing. Killing it at any point and calling it again repeats at most the
 * step that was interrupted; a step that already finished is never paid for twice (the pipeline's fragments and
 * state are the memory, the run record only adds counters and the reasons).
 */
import { LIMITS, SETTLED, agentPrompt, findingsForGroup, newRecord, now, parseAdvance, precheck, repairPrompt, violationLines } from "./autopilot-lib.mjs";
import { errorsOf } from "./prose-policy.mjs";

/** Thrown to stop the whole queue: the model said "limit reached" (or the login is gone). Nothing is wrong with the company. */
export class PauseRun extends Error {
  /** @param {any} record */
  constructor(record) {
    super(record.pause?.kind ?? "paused");
    this.record = record;
  }
}

/**
 * @typedef {Object} Deps
 * @property {(id: string) => any | null} load
 * @property {(record: any) => void} save
 * @property {(id: string, type: string, data?: object) => void} event
 * @property {(id: string) => { entry: any, sameCode: string[], ledger: any, registrationNote: string | null, reservedBy: string | null }} facts
 * @property {(id: string) => Promise<string>} advance
 * @property {{ mode: string, run: (job: { prompt: string, label: string }) => Promise<any> }} executor
 * @property {(id: string, group: "group1" | "group2") => { missing: boolean, figuresOk: boolean, figuresOutput: string, findings: any[] }} checkGroup
 * @property {((id: string, group: "group1" | "group2") => boolean) | undefined} [fragmentsExist]
 * @property {() => string} fingerprint
 * @property {(id: string, record: any) => Promise<{ path: string, hash: string, readiness: string, errors: number, reviews: number }>} sheet
 * @property {(id: string, group: string, kind: string, prompt: string) => string} order
 * @property {(id: string) => { name: string, code: string }} identity
 * @property {(id: string) => void} release
 * @property {string} cache
 * @property {(ms: number) => Promise<void>} sleep
 */

/** Paths whose fingerprint line differs (one line per file: "path<TAB>size<TAB>mtime"). */
export function changedBetween(/** @type {string} */ a, /** @type {string} */ b) {
  const sa = new Set(a.split("\n"));
  const sb = new Set(b.split("\n"));
  const out = new Set();
  for (const l of sa) if (!sb.has(l)) out.add(l.split("\t")[0]);
  for (const l of sb) if (!sa.has(l)) out.add(l.split("\t")[0]);
  return [...out];
}

const attemptKey = (/** @type {"group1" | "group2"} */ group) => (group === "group1" ? "agent1" : "agent2");
const repairKey = (/** @type {"group1" | "group2"} */ group) => (group === "group1" ? "repair1" : "repair2");

/**
 * @param {string} id
 * @param {Deps} deps
 * @returns {Promise<any>} the run record, saved
 */
export async function processCompany(id, deps) {
  const rec = deps.load(id) ?? newRecord(id);
  if (SETTLED.has(rec.status)) return rec;

  const save = (/** @type {object} */ patch = {}) => {
    Object.assign(rec, patch, { updatedAt: now() });
    deps.save(rec);
  };
  const hold = (/** @type {string} */ kind, /** @type {string} */ reason, /** @type {string} */ step) => {
    rec.holds.push({ kind, reason });
    save({ status: "held", step });
    deps.event(id, "held", { kind, reason });
    return rec;
  };
  const fail = (/** @type {string} */ step, /** @type {string} */ kind, /** @type {string} */ message) => {
    rec.errors.push({ at: now(), step, kind, message: String(message).slice(0, 500) });
    deps.event(id, "error", { step, kind, message: String(message).slice(0, 200) });
  };

  save({ status: "running", pause: null, awaiting: null });
  deps.event(id, "start");

  const holds = precheck(deps.facts(id));
  if (holds.length > 0) {
    rec.holds.push(...holds);
    save({ status: "held", step: "precheck" });
    deps.event(id, "held", { kind: "precheck", reason: holds.map((h) => h.reason).join(" / ") });
    return rec;
  }

  // From here the pipeline may reserve the company for itself; a reservation seen later is ours, not someone else's.
  save({ step: "prechecked" });
  const before = deps.fingerprint();
  /** Call the model; classify what came back. Returns the result when it worked, null when the caller should loop again. */
  const callModel = async (/** @type {"group1" | "group2"} */ group, /** @type {string} */ prompt, /** @type {string} */ label, /** @type {string} */ counter) => {
    rec.attempts[counter] = (rec.attempts[counter] ?? 0) + 1;
    save({ step: label });
    const res = await deps.executor.run({ prompt, label });
    rec.cost.calls += 1;
    rec.cost.usd += res.costUsd ?? 0;
    deps.event(id, "model", { label, kind: res.kind, costUsd: res.costUsd, ms: res.durationMs });
    const after = deps.fingerprint();
    if (after !== before) {
      const paths = changedBetween(before, after);
      hold("forbidden-write", `モデルの実行中に、書いてはならない場所のファイルが変わった（${paths.length} 件: ${paths.slice(0, 5).join(", ")}）。モデルは pipeline/results 以外に書かない。原因を確かめてから retry（実行中に人がファイルを編集した場合も同じ表示になる）（${label}）`, label);
      return { stop: true };
    }
    if (res.ok) return { ok: true, res };
    if (res.kind === "rate-limit" || res.kind === "auth") {
      rec.attempts[counter] -= 1; // nothing was wrong with the company: the attempt is not spent
      save({ status: "paused", pause: { kind: res.kind, hint: res.hint ?? null, at: now() } });
      deps.event(id, "paused", { kind: res.kind, hint: res.hint ?? null });
      throw new PauseRun(rec);
    }
    fail(label, res.kind, res.text || "モデルの実行に失敗した");
    return { ok: false, res };
  };

  /**
   * Check what a group's fragments say and repair only the lines that are wrong. Used after the model wrote them, and
   * on fragments that already exist when the company comes in (written by hand, by an earlier run, or before a rule
   * changed): the same checks, the same bounded repair.
   */
  const verifyGroup = async (/** @type {"group1" | "group2"} */ group) => {
    let check = deps.checkGroup(id, group);
    const problems = () => (check.missing ? ["成果物（pipeline/results/<id>-*.json）が見つからない、または読めない"] : [...(check.figuresOk ? [] : [`本文の金額が有報の印字と合わない（check-prose-figures の出力）: ${check.figuresOutput.slice(0, 600)}`]), ...violationLines(errorsOf(findingsForGroup(check.findings, group)))]);
    let repairs = 0;
    while (problems().length > 0 && !check.missing && repairs < LIMITS.repair) {
      repairs += 1;
      const r = await callModel(group, repairPrompt({ id, group, violations: problems(), cache: deps.cache }), `${group}-repair`, repairKey(group));
      if (r.stop) return { stop: true };
      if (!r.ok) break;
      check = deps.checkGroup(id, group);
    }
    if (check.missing) return { missing: true };
    if (problems().length > 0) {
      hold("gate-failed", `${group} の成果物に機械の検査で見つかった不備が残った（修復 ${repairs} 回）: ${problems().slice(0, 4).join(" / ")}`, group);
      return { stop: true };
    }
    return { ok: true };
  };

  // Fragments that are already there are checked before anything else is asked of the model or the gate.
  if (deps.executor.mode !== "work-orders") {
    for (const group of /** @type {const} */ (["group1", "group2"])) {
      if (deps.fragmentsExist?.(id, group) && (await verifyGroup(group)).stop) return rec;
    }
  }

  for (let turn = 0; turn < 16; turn++) {
    const out = await deps.advance(id);
    const step = parseAdvance(out);

    if (step.kind === "need") {
      const group = step.group;
      if (deps.executor.mode === "work-orders") {
        const who = deps.identity(id);
        const path = deps.order(id, group, "write", agentPrompt({ ...who, id, group, cache: deps.cache }));
        save({ status: "awaiting-ai", step: `awaiting-${group}`, awaiting: { group, order: path } });
        deps.event(id, "awaiting-ai", { group, order: path });
        return rec;
      }
      if ((rec.attempts[attemptKey(group)] ?? 0) >= LIMITS.agent) {
        return hold("ai-failed", `${group} をモデルに ${LIMITS.agent} 回依頼したが、使える成果物にならなかった: ${rec.errors.slice(-2).map((e) => e.message).join(" / ")}`, group);
      }
      const who = deps.identity(id);
      const first = await callModel(group, agentPrompt({ ...who, id, group, cache: deps.cache }), `${group}`, attemptKey(group));
      if (first.stop) return rec;
      if (!first.ok) continue; // a failed call spent an attempt; the limit above ends the loop

      const v = await verifyGroup(group);
      if (v.stop) return rec;
      if (v.missing) {
        fail(group, "invalid-output", "成果物が無い");
        continue;
      }
      continue; // the next advance shows what is needed next
    }

    if (step.kind === "ready") {
      const sheet = await deps.sheet(id, rec).catch((/** @type {any} */ e) => ({ error: String(e?.message ?? e) }));
      if ("error" in sheet) return hold("sheet-failed", `確認シートを作れなかった: ${sheet.error}`, "review");
      if (sheet.errors > 0) return hold("gate-failed", `組み立て後の検査に不備が ${sheet.errors} 件ある（確認シート参照）`, "review");
      rec.holds = [];
      save({ status: sheet.readiness, step: "review", review: { hash: sheet.hash, path: sheet.path, readiness: sheet.readiness, errors: sheet.errors, reviews: sheet.reviews } });
      deps.event(id, "ready", { readiness: sheet.readiness, hash: sheet.hash });
      return rec;
    }

    if (step.kind === "fail") {
      fail(step.stage, "advance", step.reason);
      rec.attempts.advance += 1;
      const transient = /EDINET|ECONN|ETIMEDOUT|fetch failed|HTTP 5\d\d|HTTP 429|ネットワーク|日次索引|cache/i.test(step.reason) || step.stage === "cache";
      if (transient && rec.attempts.advance < LIMITS.advance) {
        await deps.sleep(2000 * rec.attempts.advance);
        continue;
      }
      return hold(step.stage === "finalize" ? "gate-failed" : "stage-failed", `${step.stage}: ${step.reason}`, step.stage);
    }

    if (step.kind === "needs-review") return hold("parked", step.reason, "advance");
    if (step.kind === "registered" || step.kind === "done") return hold("unexpected-state", `advance が「${step.kind}」を返した（すでに登録済み、または別の作業が完了させた）。エントリーの状態を確認すること`, "advance");
    return hold("unknown-output", `advance.mjs の出力を解釈できない: ${step.reason}`, "advance");
  }
  return hold("loop-limit", "工程が 16 回の確認で終わらなかった（無限ループの防止）", "loop");
}
