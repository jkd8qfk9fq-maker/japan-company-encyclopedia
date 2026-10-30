/**
 * Do the one correct next mechanical thing for one company, and say what it
 * was. This never writes prose and never calls an agent — it only wraps the
 * repetitive, deterministic glue that today has to be run by hand around
 * every agent dispatch: confirm the evidence pack is still there and still
 * the right filing (rebuilding it if the cache was cleared), report which
 * agent stage group is next, or — once both groups are done — gate and
 * (with --register) register the entry through the existing finalize.mjs.
 *
 *   node scripts/pipeline/advance.mjs <company-id> [--register] [--update]
 *
 * --update: the company is registered and part of its explanation is being rewritten from a newer filing
 * (start-update.mjs set that up). It is not "done", and finalize runs with --update.
 *
 * A company that has not been promoted (no entry, or figures-only) and has a NEWER 有報 than the one
 * it was built on is moved onto it automatically, first thing: the old fragments and staged entry are
 * archived under pipeline/analysis/superseded/, the pack is rebuilt, the agent stages restart. Before
 * looking, the day indexes since its filing are made trustworthy (ensureIndexCache); if that cannot
 * be done the script says FAIL: cache and changes nothing. A company parked for another reason, and
 * one already promoted, are never refreshed here.
 *
 * Prints one of:
 *   done                 — already fully registered (status is not figures-only). Lock released.
 *   needs-review          — parked for a human; this script will not touch it.
 *   need: group1|group2   — an agent must write these stages next (also reserves the company).
 *   ready: finalize        — both agent groups are in, finalize.mjs <id> gate passed.
 *   registered             — finalize.mjs <id> --register succeeded. Lock released.
 *   FAIL: <stage>: <reason> — recorded via setStage, lock left in place for a human to clear.
 *   FAIL: cache: <reason>   — the evidence-pack cache rebuild failed, but the underlying
 *                             pipeline stage was already completed — see classifyPackFailure.
 *
 * Any failure is caught and recorded with setStage(..., "failed", …) rather
 * than thrown, and this script always exits 0 — so a loop that calls this
 * once per company in a queue never dies on one bad company (CLAUDE.md "絶対
 * 条件": a failed company must not stop the rest, and must not be silently
 * dropped either — it ends up in needs-review after three failures, the
 * existing company-state.mjs retry rule, unchanged here).
 *
 * The decision logic below is split into small, pure, exported functions —
 * no file I/O, no process state — so `tests/pipeline-state.test.ts` can
 * exercise the success/failure/retry/needs-review/already-done branches
 * directly, without needing EDINET_API_KEY or a live evidence pack. The
 * actual script body (file reads, subprocess calls, pipeline/state writes)
 * runs only when this file is executed directly, the same convention
 * company-state.mjs already uses for its own CLI.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir, ensureIndexCache, jstToday } from "../research/edinet.mjs";
import { loadState, nextAgentGroup, reserve, release, saveState, setStage, syncAgentStages } from "./company-state.mjs";
import { describeEvents, scanPostFilingEvents } from "./post-filing.mjs";
import { newerFiling, packMatchesIdentity, packProblem, readPack, rebuildPack, refreshIdentity } from "./pack.mjs";

// Kept as a re-export: tests and older callers import it from here.
export { packMatchesIdentity };

/** A company's tier from its entry file's own `status.state` — `null` if no
 * entry exists yet (not even figures-only). */
export function companyTier(root, id) {
  const path = join(root, "src/data/companies", `${id}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")).status?.state ?? "published";
}

/**
 * What to do before even looking at the evidence pack or agent stages —
 * "already finished" and "permanently parked" both short-circuit everything
 * else. Returns `"done" | "needs-review" | null`; `null` means keep going
 * (check the evidence pack and nextAgentGroup next, which need file I/O this
 * function deliberately does not do).
 *
 * `tier` must come from the entry file's `status.state`, not from
 * `registrationStatus` — that pipeline stage is already "completed" for
 * every figures-only company (the figures-only write IS that stage), so by
 * itself it cannot say whether the prose promotion this script exists for
 * has happened yet. `registrationStatus === "needs-review"` is checked
 * separately because a permanently-parked company (e.g. a delisted one a
 * human excluded on purpose) may have no entry file at all (`tier === null`)
 * to otherwise signal that it should never be touched again.
 */
export function decideEntryAction(tier, registrationStatus) {
  if (tier && tier !== "figures-only") return "done";
  if (registrationStatus === "needs-review") return "needs-review";
  return null;
}

/**
 * Whether a failed evidence-pack rebuild should be recorded against the
 * `edinet` pipeline stage itself, or treated as a cache-only hiccup that
 * must leave that stage alone.
 *
 * The `edinet` stage already succeeded once if it reads "completed" — a
 * rebuild failing now (missing EDINET_API_KEY in this shell, a transient
 * network error, the %TEMP% cache having been cleared …) is an
 * infrastructure problem, not a re-failure of that stage, and must not
 * overwrite its legitimate "completed" status. Calling setStage("edinet",
 * "failed", …) unconditionally here corrupted chubu-electric-power's real
 * state exactly this way during this script's own first test run
 * (2026-10-01) — nextAgentGroup then refused to offer group 1 again because
 * `edinet` no longer read as done. Fixed by only returning "stage" when the
 * stage was not already completed; "cache" must never call setStage at all.
 */
export function classifyPackFailure(edinetStatus) {
  return edinetStatus === "completed" ? "cache" : "stage";
}

if (process.argv[1]?.endsWith("advance.mjs")) {
  const companyId = process.argv[2];
  const register = process.argv.includes("--register");
  const update = process.argv.includes("--update");
  if (!companyId) {
    console.error("usage: node scripts/pipeline/advance.mjs <company-id> [--register]");
    process.exit(1);
  }

  const root = process.cwd();
  const run = (args) => execFileSync(process.execPath, args, { cwd: root, encoding: "utf8", env: process.env });

  const fail = (stage, reason) => {
    // "running" first so `attempts` increments — setStage only promotes to
    // needs-review after MAX_ATTEMPTS "failed" calls that each followed a
    // "running" call (the same running→failed pairing finalize.mjs and
    // run-mechanical.mjs already use); skipping it would leave this stage
    // retried forever on every advance.mjs call and never escalated to a human.
    setStage(companyId, stage, "running");
    setStage(companyId, stage, "failed", reason);
    console.log(`FAIL: ${stage}: ${reason}`);
  };

  const tier = companyTier(root, companyId);

  // 0. Is the filing this company is built on still the newest one? A promotion writes prose and
  //    figures for ONE fiscal year. For a company that has NOT been promoted (no entry, or figures-only)
  //    moving to a newer 有報 is safe and automatic: nothing a reader sees is rewritten except by the
  //    promotion that follows, and the old fragments are archived, not deleted (refreshIdentity).
  //    The boundary: a company parked for another reason (registration needs-review) is never touched,
  //    and a company that is already promoted keeps what it has (companyTier below answers "done") —
  //    queue.mjs check reports those as 'entry-built-on-old-filing' for a human.
  if (!tier || tier === "figures-only") {
    const current = loadState(companyId).identity;
    // newerFiling only reads the cached day indexes, so a day the cache lost (or took before the day
    // was over) would hide a newer 有報 without a word. Make the days since this filing trustworthy
    // first; if EDINET cannot supply them, say so and touch nothing — "no newer filing" is not an
    // answer we may guess.
    if (current?.code && current.submitted) {
      const from = new Date(Date.parse(`${current.submitted}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
      const to = new Date(Date.parse(`${jstToday()}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
      const { unresolved, reasons } = await ensureIndexCache(from, to);
      if (unresolved.length > 0) {
        const why = reasons.slice(0, 2).map((r) => `${r.date} ${r.kind}: ${r.detail.slice(0, 80)}`).join(" ／ ");
        console.log(`FAIL: cache: 日次索引 ${unresolved.length} 日（${unresolved.slice(0, 3).join(", ")}…）を確認できず、新しい有報の有無を保証できない。状態は変更していない — ${why}`);
        process.exit(0);
      }
    }
    const newer = current?.code ? newerFiling(current) : null;
    const parked = loadState(companyId).stages.registration.status === "needs-review";
    if (newer && !parked) {
      try {
        refreshIdentity(companyId, newer, root);
        release(companyId);
        console.log(`identity: ${current.originalDocID ?? current.docID} → ${newer.docID}（${newer.submitted} 提出、${newer.periodEnd} 期）に更新（未昇格のため自動）。旧成果物は pipeline/analysis/superseded/ に退避`);
      } catch (error) {
        console.log(`FAIL: identity: 新しい有報への更新に失敗: ${String(error.message).slice(0, 300)}`);
        process.exit(0);
      }
    }

    // 0b. Did anything happen to the company AFTER this 有報 that its page would have to say — a new
    //     name, a tender offer? Only candidates are found (post-filing.mjs); the entry is never
    //     rewritten and a person decides. --ack-post-filing records that the person has looked, so
    //     the same documents do not park the company again.
    const now = loadState(companyId);
    const identity = now.identity;
    if (identity?.code && identity.submitted) {
      const acknowledged = new Set(identity.postFilingAcknowledged ?? []);
      const events = (scanPostFilingEvents([{ id: companyId, code: identity.code, submitted: identity.submitted, filerName: identity.filerName, periodEnd: identity.periodEnd }]).get(companyId) ?? []).filter((e) => !acknowledged.has(e.docID));
      if (events.length > 0 && process.argv.includes("--ack-post-filing")) {
        identity.postFilingAcknowledged = [...acknowledged, ...events.map((e) => e.docID)];
        saveState(now);
        if (now.stages.registration.status === "needs-review" && String(now.stages.registration.note ?? "").startsWith("有報提出後の変更の可能性")) {
          setStage(companyId, "registration", tier ? "completed" : "pending", "有報提出後の変更を確認済み（--ack-post-filing）");
        }
        console.log(`post-filing: ${events.length} 件を確認済みとして記録: ${describeEvents(events)}`);
      } else if (events.length > 0 && now.stages.registration.status !== "needs-review") {
        setStage(companyId, "registration", "needs-review", `有報提出後の変更の可能性: ${describeEvents(events)}。内容を人が確認し、問題なければ node scripts/pipeline/advance.mjs ${companyId} --ack-post-filing`);
        release(companyId);
        console.log(`needs-review: 有報提出後の変更の可能性 — ${describeEvents(events)}`);
        process.exit(0);
      }
    }
  }

  // 1/2. Already finished, or permanently parked — nothing left to do.
  // An update of a registered company was set up on purpose (start-update.mjs), so the entry existing is not "done".
  const entryAction = decideEntryAction(update && tier !== "figures-only" ? null : tier, loadState(companyId).stages.registration.status);
  if (entryAction === "done") {
    release(companyId);
    console.log("done");
    process.exit(0);
  }
  if (entryAction === "needs-review") {
    console.log("needs-review");
    process.exit(0);
  }

  // 3. Bring pipeline/state into line with any fragments already on disk.
  syncAgentStages(companyId);
  const state = loadState(companyId);

  // 4. Evidence pack must exist and must be the SAME filing identity resolved —
  //    the cache lives under %TEMP% by default and does not survive every
  //    session (found and documented 2026-09-30 in docs/pipeline.md).
  const identity = state.identity;
  if (!identity?.docID || !identity?.code) {
    fail("identity", "pipeline/state に identity（code/docID）が無い — identity/edinet 未完了の会社は対象外");
    process.exit(0);
  }
  const packDir = join(cacheDir(), "evidence", companyId);
  // missing / the wrong filing / built by an older extractor: all repaired by rebuilding (pack.mjs).
  if (packProblem(readPack(companyId), identity)) {
    const failureKind = classifyPackFailure(state.stages.edinet.status);
    try {
      // Same ±21 day window the company was first resolved with — re-running it over the
      // identical window reproduces the same docID, since the day indexes are fixed history.
      rebuildPack(companyId, identity);
      const problem = packProblem(readPack(companyId), identity);
      if (problem) {
        const rebuilt = readPack(companyId);
        const reason = `証拠パック再構築後も使えない（${problem}。期待 ${identity.originalDocID ?? identity.docID}、実際 ${rebuilt?.filing?.originalDocID ?? rebuilt?.filing?.docID}）`;
        if (failureKind === "stage") fail("edinet", reason);
        else console.log(`FAIL: cache: ${reason}`);
        process.exit(0);
      }
    } catch (error) {
      const reason = `証拠パック再構築に失敗: ${String(error.message).slice(0, 300)}`;
      if (failureKind === "stage") fail("edinet", reason);
      else console.log(`FAIL: cache: ${reason}`);
      process.exit(0);
    }
  }

  // 5. What does this company need next?
  const group = nextAgentGroup(companyId);
  if (group) {
    const isGroup1 = group.some((s) => ["businessStructure", "history"].includes(s));
    reserve(companyId);
    console.log(`need: ${isGroup1 ? "group1" : "group2"}`);
    console.log(`stages: ${group.join(", ")}`);
    console.log(`docID: ${identity.docID}`);
    console.log(`evidence pack: ${packDir}`);
    process.exit(0);
  }

  // 6. Both agent groups are in — the reservation's job was protecting that
  //    agent work from a concurrent bulk figures-only run; that work is done
  //    now, win or lose, so release it before attempting finalize rather than
  //    only on success. A finalize failure (schema/integrity — a-tie's empty
  //    `industries` and a banned-term catch, found 2026-10-01) used to leave
  //    the company reserved forever: invisible to every future queue.mjs
  //    call, and — since a reserved company is never retried — never able to
  //    reach setStage's own 3-strikes needs-review promotion either. Gate,
  //    and register only if asked. finalize.mjs already records
  //    sourceValidation/qualityControl/registration in pipeline/state itself,
  //    on both success and failure, so nothing here duplicates that
  //    bookkeeping.
  release(companyId);
  try {
    const args = ["scripts/pipeline/finalize.mjs", companyId];
    if (register) args.push("--register");
    if (update) args.push("--update");
    if (process.argv.includes("--no-repo-gate")) args.push("--no-repo-gate");
    const output = run(args);
    console.log(output.trim());
    console.log(register ? "registered" : "ready: finalize");
  } catch (error) {
    // finalize reports what failed on stderr and its progress on stdout; the reason a person needs comes first.
    console.log(`FAIL: finalize: ${String(`${error.stderr ?? ""}${error.stdout ?? ""}` || error.message).trim().slice(0, 500)}`);
  }
  process.exit(0);
}
