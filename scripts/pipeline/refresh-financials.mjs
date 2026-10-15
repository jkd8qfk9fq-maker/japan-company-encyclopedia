/**
 * Keep the financial figures of registered companies current: when a company files a NEWER 有価証券報告書,
 * add its new fiscal year to `financials` — and nothing else.
 *
 *   node scripts/pipeline/refresh-financials.mjs <company-id> [more-ids …] [--apply]
 *   node scripts/pipeline/refresh-financials.mjs --all [--tier promoted|all] [--limit N] [--apply] [--retry]
 *
 * Without --apply it is a dry run: the evidence pack (cache only) is built, the change is planned and gated,
 * and nothing in the repository is written. With --apply an entry, a Revision and the pipeline state are
 * written — never git: the operator reviews `npm run content:diff` and commits (CLAUDE.md invariant 9).
 *
 * What changes, and what never does:
 *  - The new year's row is read from the new filing's XBRL (draft-entry.mjs) and the filing is added to
 *    `sources` under its own id. Rows for years already in the entry are KEPT as they are, with their notes,
 *    bases and source ids; the oldest year falls out so the entry keeps the filing's five-year window.
 *  - Prose, status and every other field are untouched. A published page stays published: its explanation
 *    describes the filing it was written from (pipeline/state identity), and `queue.mjs check` keeps
 *    reporting that a newer 有報 exists for a person to re-research it.
 *  - Nothing is guessed. If the new filing prints DIFFERENT values for a year the entry already has (a
 *    restatement), changes the fiscal year end, prints an irregular period, mixes accounting standards, or
 *    fails verify-financials / the schema and integrity rules, the entry is NOT written; the company is
 *    reported as held, with the reason, and recorded in its state so it is not re-attempted every day.
 *  - A day of the EDINET index that cannot be vouched for stops the run (`FAIL: cache`): "no newer filing"
 *    is not an answer to guess (the same rule as advance.mjs).
 *
 * Only figures-only entries are skipped by default: they have no public page, and promoting one starts from
 * the newest filing anyway (advance.mjs moves its identity forward). `--tier all` includes them.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { financialsDifferences } from "../research/amendments.mjs";
import { cacheDir, ensureIndexCache, indexDir, jstToday } from "../research/edinet.mjs";
import { loadState, saveState } from "./company-state.mjs";
import { loadEntries } from "./jobs.mjs";
import { readPack, rebuildPack } from "./pack.mjs";

const FIGURES = ["revenue", "profit", "netIncome", "totalAssets", "netAssets", "employees"];

// ------------------------------------------------------------------------------ pure parts

/**
 * The newest 有価証券報告書 (120) per 4-digit securities code in the cached day indexes, in one pass.
 * A withdrawn filing is not a filing of record. `onlyAfter` skips days that cannot matter.
 * @param {string} [dir] the index directory (default: the EDINET index cache)
 * @param {string} [onlyAfter] YYYY-MM-DD
 * @returns {Map<string, { docID: string, submittedAt: string, submitted: string, periodEnd: string, filerName: string }>}
 */
export function newestFilings(dir = indexDir(), onlyAfter = "") {
  /** @type {Map<string, any>} */
  const best = new Map();
  if (!existsSync(dir)) return best;
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".json") || file.slice(0, 10) <= onlyAfter) continue;
    for (const row of JSON.parse(readFileSync(join(dir, file), "utf8")).results ?? []) {
      if (row.docTypeCode !== "120" || !row.secCode) continue;
      if (row.withdrawalStatus && row.withdrawalStatus !== "0") continue;
      const code = row.secCode.slice(0, 4);
      const known = best.get(code);
      if (!known || row.submitDateTime > known.submittedAt) {
        best.set(code, { docID: row.docID, submittedAt: row.submitDateTime, submitted: row.submitDateTime.slice(0, 10), periodEnd: row.periodEnd ?? "", filerName: row.filerName ?? "" });
      }
    }
  }
  return best;
}

/**
 * The filing a company's FIGURES were last taken from: the last refresh if there was one, otherwise the
 * filing its identity was resolved on.
 * @param {any} identity
 */
export function financialsBase(identity) {
  return identity.financials ?? identity;
}

/**
 * Is `newest` a later filing than the one `identity`'s figures come from? Pure.
 * @param {{ docID: string, submitted: string } | undefined} newest
 * @param {any} identity
 */
export function isNewer(newest, identity) {
  const base = financialsBase(identity);
  const known = base.originalDocID ?? base.docID;
  return Boolean(newest && base.submitted && newest.submitted > base.submitted && newest.docID !== known);
}

const strip = (/** @type {string} */ s) => s.replace(/\s*\(docID [^)]+\)/, "");

/**
 * What adding the new filing's year would change. Pure: no file, no process state.
 * @param {{ entry: any, draft: any, pack: any, today: string }} input
 * @returns {{ kind: "hold", reasons: string[] } | { kind: "current" } | { kind: "update", financials: any[], source: any | null, added: any[], dropped: any[] }}
 */
export function planFinancialsRefresh({ entry, draft, pack, today }) {
  const reasons = [];
  if (pack?.fiscalYearChange) reasons.push(`決算期の変更: 有報の決算年月 ${pack.fiscalYearChange.printed.join("・")} に対しパックは ${pack.fiscalYearChange.assumed.join("・")}`);
  if ((pack?.irregularPeriods ?? []).length > 0) reasons.push(`変則決算: ${pack.irregularPeriods.map((/** @type {any} */ x) => `${x.yearEnd} の期は ${x.months} か月`).join("、")}`);
  if (draft._会計基準がそろわない項目) reasons.push("会計基準が年度の途中で揃わない項目がある");
  if (pack?.amendments?.status === "incomplete") reasons.push(`最新の訂正 ${pack.amendments.blockedBy} に必要な項目が無い`);

  const sourceIds = [...new Set(draft.financials.flatMap((/** @type {any} */ f) => f.sourceIds ?? []))];
  if (sourceIds.length !== 1) reasons.push(`draft の sourceIds が1つではない（${sourceIds.join(", ")}）`);
  const url = `https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/${draft._docID}.pdf`;
  const existingSource = entry.sources.find((/** @type {any} */ s) => s.id === sourceIds[0]);
  if (existingSource && existingSource.url !== url) reasons.push(`出典 ${sourceIds[0]} が既に別の書類（${existingSource.url}）を指している`);

  const oldest = draft.financials.map((/** @type {any} */ f) => f.periodEnd).sort()[0];
  const differences = financialsDifferences(entry.financials, draft.financials);
  const restated = differences.filter((d) => d.field !== "(行)");
  if (restated.length > 0) reasons.push(`登録済みの年度が新しい有報で別の値になっている（遡及修正の可能性）: ${restated.slice(0, 3).map((d) => `${d.fiscalYear} ${d.field}`).join("、")}${restated.length > 3 ? ` ほか${restated.length - 3}件` : ""}`);

  const registered = new Map(entry.financials.map((/** @type {any} */ r) => [r.periodEnd, r]));
  const drafted = new Set(draft.financials.map((/** @type {any} */ r) => r.periodEnd));
  const dropped = entry.financials.filter((/** @type {any} */ r) => !drafted.has(r.periodEnd));
  const droppedInside = dropped.filter((/** @type {any} */ r) => r.periodEnd >= oldest);
  if (droppedInside.length > 0) reasons.push(`新しい有報に無い年度が登録値の途中にある: ${droppedInside.map((/** @type {any} */ r) => r.fiscalYear).join("、")}`);

  if (reasons.length > 0) return { kind: "hold", reasons };

  const added = draft.financials.filter((/** @type {any} */ r) => !registered.has(r.periodEnd));
  if (added.length === 0) return { kind: "current" };

  const financials = draft.financials.map((/** @type {any} */ r) => registered.get(r.periodEnd) ?? r);
  const source = existingSource
    ? null
    : {
        id: sourceIds[0],
        title: strip(draft._有報) || "有価証券報告書",
        publisher: draft.officialName ?? entry.officialName,
        url,
        ...(draft._提出日 ? { publishedAt: draft._提出日 } : {}),
        accessedAt: today,
      };
  return { kind: "update", financials, source, added, dropped };
}

/** `before`/`after` for a Revision: the figures of the years that left and the years that arrived. */
export function revisionChange(/** @type {any[]} */ dropped, /** @type {any[]} */ added) {
  const cells = (/** @type {any[]} */ rows) => rows.flatMap((r) => FIGURES.map((field) => ({ fiscalYear: r.fiscalYear, field, value: r[field] ?? null })));
  return { before: cells(dropped), after: cells(added) };
}

// ----------------------------------------------------------------------------- the effects

const root = process.cwd();
const VITEST = "node_modules/vitest/vitest.mjs";
const run = (/** @type {string[]} */ args, env = {}) => execFileSync(process.execPath, args, { cwd: root, encoding: "utf8", env: { ...process.env, ...env }, stdio: "pipe" });
const message = (/** @type {any} */ error) => String(error?.stdout ?? error?.message ?? error).trim().split("\n").slice(-6).join(" / ").slice(0, 600);

/**
 * Refresh one company. Returns what happened; throws nothing the caller must handle except a cache failure.
 * With `apply`, the returned `undo` restores every file it wrote (used if the integrity suite fails afterwards).
 * @param {string} id
 * @param {{ apply: boolean, newest: Map<string, any>, today: string, retry?: boolean }} options
 * @returns {{ id: string, result: "up-to-date" | "no-state" | "updated" | "would-update" | "current" | "held" | "failed", detail: string, undo?: () => void }}
 */
export function refreshOne(id, { apply, newest, today, retry = false }) {
  const entryPath = join(root, "src/data/companies", `${id}.json`);
  if (!existsSync(entryPath)) return { id, result: "failed", detail: "登録済みエントリーがありません" };
  const state = loadState(id);
  const identity = state.identity;
  if (!identity?.code || !identity.docID || !identity.submitted) return { id, result: "no-state", detail: "pipeline/state に identity が無い" };

  const latest = newest.get(identity.code);
  if (!isNewer(latest, identity)) return { id, result: "up-to-date", detail: "" };
  if (!latest) return { id, result: "up-to-date", detail: "" };
  if (!retry && identity.financialsCheck?.result === "held" && identity.financialsCheck.docID === latest.docID) {
    return { id, result: "held", detail: `保留のまま（${identity.financialsCheck.reasons.join(" ／ ")}）。--retry で再試行` };
  }

  const entryText = readFileSync(entryPath, "utf8");
  const entry = JSON.parse(entryText);
  const hold = (/** @type {string[]} */ reasons) => {
    if (apply) {
      const s = loadState(id);
      s.identity = { ...s.identity, financialsCheck: { at: today, result: "held", docID: latest.docID, reasons } };
      saveState(s);
    }
    return { id, result: /** @type {const} */ ("held"), detail: reasons.join(" ／ ") };
  };

  try {
    // The cache holds packs per company id; this one is rebuilt for the NEW filing, over the same ±21-day window.
    rebuildPack(id, { code: identity.code, submitted: latest.submitted });
  } catch (error) {
    return { id, result: "failed", detail: `証拠パックを作れない: ${message(error)}` };
  }
  const pack = readPack(id);
  const draftPath = join(cacheDir(), "evidence", id, "draft-entry.json");
  if (!pack || !existsSync(draftPath) || (pack.filing?.originalDocID ?? pack.filing?.docID) !== latest.docID) {
    return { id, result: "failed", detail: `証拠パックが新しい有報 ${latest.docID} になっていない` };
  }
  const draft = JSON.parse(readFileSync(draftPath, "utf8"));

  const plan = planFinancialsRefresh({ entry, draft, pack, today });
  if (plan.kind === "hold") return hold(plan.reasons);
  if (plan.kind === "current") return { id, result: "current", detail: `新しい有報 ${latest.docID} に、登録に無い年度はありません` };

  const next = {
    ...entry,
    financials: plan.financials,
    sources: plan.source ? [...entry.sources, plan.source] : entry.sources,
    updatedAt: today,
  };

  // Gates, on a staged copy: the entry is written only if every one passes.
  const stagedRelative = `pipeline/staging/${id}.json`;
  const stagedPath = join(root, stagedRelative);
  mkdirSync(join(root, "pipeline/staging"), { recursive: true });
  writeFileSync(stagedPath, `${JSON.stringify(next, null, 2)}\n`);
  try {
    run(["scripts/research/verify-financials.mjs", id, "--entry", stagedRelative]);
    run([VITEST, "run", "tests/validate-file.test.ts"], { CONTENT_FILE: stagedRelative });
  } catch (error) {
    return hold([`検査に通らない: ${message(error)}`]);
  } finally {
    rmSync(stagedPath, { force: true });
  }

  const years = plan.added.map((/** @type {any} */ r) => r.fiscalYear).join("・");
  if (!apply) return { id, result: "would-update", detail: `${years} を追加（${plan.dropped.length > 0 ? `${plan.dropped.map((/** @type {any} */ r) => r.fiscalYear).join("・")} は五年の窓から外れる、` : ""}出典 ${plan.source?.id ?? "既存"}）` };

  const revisionBase = `${today}-company-${id}-financials-refreshed`;
  let revisionId = revisionBase;
  for (let n = 2; existsSync(join(root, "src/data/revisions", `${revisionId}.json`)); n++) revisionId = `${revisionBase}-${n}`;
  const revisionPath = join(root, "src/data/revisions", `${revisionId}.json`);
  const stateBefore = loadState(id);
  const title = strip(draft._有報);
  const revision = {
    id: revisionId,
    targetType: "company",
    targetId: id,
    changedAt: today,
    reason: "新しい有価証券報告書が提出されたため、財務データに新しい年度を追加した（登録済みの年度は変更していない。解説は変更していない）",
    summary: `${title}（docID ${draft._docID}、提出 ${draft._提出日}）から ${years} を追加${plan.dropped.length > 0 ? `。${plan.dropped.map((/** @type {any} */ r) => r.fiscalYear).join("・")} は五年の表示から外れた` : ""}`,
    ...revisionChange(plan.dropped, plan.added),
  };
  writeFileSync(entryPath, `${JSON.stringify(next, null, 2)}\n`);
  writeFileSync(revisionPath, `${JSON.stringify(revision, null, 2)}\n`);
  const s = loadState(id);
  s.identity = {
    ...s.identity,
    financials: { docID: draft._docID, originalDocID: draft._原本docID, submitted: draft._提出日, periodEnd: draft._決算期, refreshedAt: today },
    financialsCheck: undefined,
  };
  saveState(s);
  const undo = () => {
    writeFileSync(entryPath, entryText);
    rmSync(revisionPath, { force: true });
    saveState(stateBefore);
  };
  return { id, result: "updated", detail: `${years} を追加（改訂記録 ${revisionId}）`, undo };
}

// ---------------------------------------------------------------------------------- the CLI

if (process.argv[1]?.endsWith("refresh-financials.mjs")) {
  const args = process.argv.slice(2);
  const flag = (/** @type {string} */ name) => args.includes(`--${name}`);
  const value = (/** @type {string} */ name) => {
    const i = args.indexOf(`--${name}`);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const valueIndexes = new Set(["--tier", "--limit"].map((f) => args.indexOf(f) + 1).filter((i) => i > 0));
  const ids = args.filter((a, i) => !a.startsWith("--") && !valueIndexes.has(i));
  const apply = flag("apply");
  if (ids.length === 0 && !flag("all")) {
    console.error("usage: node scripts/pipeline/refresh-financials.mjs <company-id …> | --all [--tier promoted|all] [--limit N] [--apply] [--retry]");
    process.exit(1);
  }
  const today = jstToday();

  // The registered companies this run is about, promoted entries first.
  const tierFilter = value("tier") ?? "promoted";
  const entries = loadEntries(root).filter((e) => (ids.length > 0 ? ids.includes(e.id) : tierFilter === "all" || e.tier !== "figures-only"));
  entries.sort((a, b) => Number(b.tier === "published") - Number(a.tier === "published") || a.id.localeCompare(b.id));
  const states = new Map(entries.map((e) => [e.id, loadState(e.id).identity]));

  // "No newer filing" is only an answer if every day since the oldest filing in play is vouched for.
  const oldest = [...states.values()].map((i) => (i ? financialsBase(i).submitted : null)).filter(Boolean).sort()[0];
  if (oldest) {
    const from = new Date(Date.parse(`${oldest}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
    const to = new Date(Date.parse(`${today}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
    const { unresolved } = await ensureIndexCache(from, to);
    if (unresolved.length > 0) {
      console.log(`FAIL: cache: 日次索引 ${unresolved.length} 日（${unresolved.slice(0, 3).join(", ")}…）を確認できず、新しい有報の有無を保証できない。何も変更していない`);
      process.exit(0);
    }
  }
  const newest = newestFilings(indexDir(), oldest ?? "");
  const limit = Number(value("limit") ?? Infinity);
  const todo = entries.filter((e) => states.get(e.id) && isNewer(newest.get(states.get(e.id).code), states.get(e.id))).slice(0, limit);
  console.log(`対象 ${entries.length} 社のうち、新しい有報が出ているのは ${todo.length} 社${apply ? "" : "（ドライラン）"}`);

  const outcomes = [];
  for (const e of todo) {
    let outcome;
    try {
      outcome = refreshOne(e.id, { apply, newest, today, retry: flag("retry") });
    } catch (error) {
      outcome = { id: e.id, result: "failed", detail: message(error) };
    }
    outcomes.push(outcome);
    console.log(`${outcome.result.padEnd(12)} ${e.id}${outcome.detail ? ` — ${outcome.detail}` : ""}`);
  }

  // The integrity suite reads every entry and revision; run once for the whole batch, and put every
  // file back if it fails — an automatic update must never leave the repository failing its own tests.
  const written = outcomes.filter((o) => o.result === "updated");
  if (written.length > 0) {
    try {
      run([VITEST, "run", "tests/data-integrity.test.ts"]);
    } catch (error) {
      for (const o of written) o.undo?.();
      console.log(`FAIL: integrity: 統合テストに通らなかったため ${written.length} 社すべてを元に戻した:\n${message(error)}`);
      process.exit(0);
    }
  }

  const count = (/** @type {string} */ r) => outcomes.filter((o) => o.result === r).length;
  console.log(`\n更新 ${count("updated")} ／ 更新予定 ${count("would-update")} ／ 変更なし ${count("current")} ／ 保留 ${count("held")} ／ 失敗 ${count("failed")} ／ 状態なし ${count("no-state")}`);
  if (written.length > 0) console.log("コミットは人が行うこと（このスクリプトは git を触りません）。差分: npm run content:diff");
  if (count("held") + count("failed") > 0) console.log("保留・失敗は上の理由を人が確認すること（保留は pipeline/state の financialsCheck に記録済み）。");
  process.exit(0);
}
