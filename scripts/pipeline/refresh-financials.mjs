/**
 * Keep the financial figures of registered companies current: when a company files a NEWER 有価証券報告書,
 * add its new fiscal year to `financials` — and nothing else.
 *
 *   node scripts/pipeline/refresh-financials.mjs <company-id> [more-ids …] [--apply]
 *   node scripts/pipeline/refresh-financials.mjs --all [--tier promoted|all] [--limit N] [--apply] [--retry]
 *   node scripts/pipeline/refresh-financials.mjs --rehearse <company-id>
 *   … [--report <file.json>] [--summary <file.md>]
 *
 * Which companies have something new is decided from the ENTRY alone: the newest filing EDINET lists for the
 * company has a fiscal year end later than the newest year in `financials`. Nothing in pipeline/state is
 * needed, so a clean checkout (GitHub Actions) and the operator's machine reach the same answer.
 *
 * Without --apply it is a dry run: the evidence pack (cache only) is built, the change is planned and gated,
 * and nothing under src/data or pipeline/state is written (a transient pipeline/staging file is removed
 * again). With --apply an entry, a Revision and the pipeline state are written — never git: the operator
 * reviews `npm run content:diff` and commits (CLAUDE.md invariant 9). Unattended runs use the dry run only.
 *
 * --rehearse <id> proves the whole path on real data without waiting for a real new filing: it pretends the
 * company's newest registered year is missing (in memory), then fetches, extracts, plans and gates that year
 * from EDINET exactly as a real update would. It cannot write: --apply and --all are refused with it. It
 * exits 0 only if the rehearsal reached "would-update".
 *
 * What changes, and what never does:
 *  - The new year's row is read from the new filing's XBRL (draft-entry.mjs) and the filing is added to
 *    `sources` under its own id. Rows for years already in the entry are KEPT as they are, with their notes,
 *    bases and source ids; the oldest year falls out so the entry keeps the filing's five-year window.
 *  - Prose, status and every other field are untouched. A published page stays published: its explanation
 *    describes the filing it was written from, and `queue.mjs check` keeps reporting that a newer 有報
 *    exists for a person to re-research it.
 *  - Nothing is guessed. If the new filing prints DIFFERENT values for a year the entry already has (a
 *    restatement), changes the fiscal year end, prints an irregular period, mixes accounting standards or
 *    clashes with an existing source id, the company is HELD with the reason — not written, not an error.
 *  - A company whose evidence cannot be fetched or extracted, or whose result fails verify-financials or the
 *    schema and integrity rules, is FAILED with the reason: the run exits 1 so that nothing passes quietly.
 *  - A day of the EDINET index that cannot be vouched for fails the whole run (`FATAL`): "no newer filing"
 *    is not an answer to guess.
 *
 * Exit code: 0 = ran to the end (held companies and "nothing new" included); 1 = a failure above.
 * Default scope is the promoted tiers; figures-only entries have no public page, and promotion rebuilds
 * them from the newest filing anyway. `--tier all` includes them.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
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

/** The newest fiscal year end in an entry's `financials` ("" if it has none). */
export function latestPeriod(/** @type {any} */ entry) {
  return (entry.financials ?? []).reduce((/** @type {string} */ max, /** @type {any} */ r) => (r.periodEnd > max ? r.periodEnd : max), "");
}

/**
 * Is the newest filing for this company a LATER fiscal year than the entry holds? The same answer for a
 * manual run and for CI, because it depends on the entry alone. `unknown` is a filing the index prints
 * without a fiscal year end — it cannot be compared, and is reported rather than skipped.
 * @param {{ periodEnd: string } | undefined} newest
 * @param {any} entry
 * @returns {"newer" | "current" | "unknown"}
 */
export function filingStatus(newest, entry) {
  if (!newest) return "current";
  if (!newest.periodEnd) return "unknown";
  return newest.periodEnd > latestPeriod(entry) ? "newer" : "current";
}

/** The first day a filing for a newer year could have been submitted: after the newest registered filing. */
export function scanFrom(/** @type {any} */ entry) {
  const latest = [...(entry.financials ?? [])].sort((/** @type {any} */ a, /** @type {any} */ b) => b.periodEnd.localeCompare(a.periodEnd))[0];
  const source = latest?.sourceIds?.map((/** @type {string} */ id) => entry.sources.find((/** @type {any} */ s) => s.id === id)).find((/** @type {any} */ s) => s?.publishedAt);
  return source?.publishedAt ?? latest?.periodEnd ?? "";
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

/**
 * The entry as it would have been before its newest year was registered — for `--rehearse`. The newest row is
 * removed, and so is its source if nothing else cites it, so the rehearsal also exercises "add the source".
 * @param {any} entry
 * @returns {{ entry: any, removed: any } | null} null if the entry has no financial rows
 */
export function rehearsalEntry(entry) {
  const sorted = [...entry.financials].sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));
  const removed = sorted[0];
  if (!removed) return null;
  const rest = { ...entry, financials: entry.financials.filter((/** @type {any} */ r) => r !== removed) };
  const unused = (removed.sourceIds ?? []).filter((/** @type {string} */ id) => {
    const withoutSource = JSON.stringify({ ...rest, sources: [] });
    return !withoutSource.includes(`"${id}"`);
  });
  return { entry: { ...rest, sources: rest.sources.filter((/** @type {any} */ s) => !unused.includes(s.id)) }, removed };
}

/**
 * @typedef {{
 *   id: string, tier?: string,
 *   result: "up-to-date" | "unknown" | "updated" | "would-update" | "current" | "held" | "failed",
 *   detail: string, reasons?: string[],
 *   newFiling?: { docID: string, submitted: string, periodEnd: string },
 *   added?: any[], dropped?: any[], source?: any,
 *   undo?: () => void,
 * }} Outcome
 */

/**
 * 1 when anything failed or the run could not vouch for its inputs; 0 otherwise. A held company is a
 * decision for a person, and "no new filing" is the normal day — neither is an error.
 * @param {Outcome[]} outcomes
 * @param {string | null} fatal
 */
export function exitCodeFor(outcomes, fatal) {
  return fatal || outcomes.some((o) => o.result === "failed" || o.result === "unknown") ? 1 : 0;
}

const figuresOf = (/** @type {any} */ r) => ({ fiscalYear: r.fiscalYear, periodEnd: r.periodEnd, ...Object.fromEntries(FIGURES.map((f) => [f, r[f] ?? null])) });

/**
 * The run as data, for the Actions artifact. `undo` is a function and is left out on purpose.
 * @param {{ mode: "dry-run" | "apply" | "rehearse", today: string, scope: { companies: number, from: string | null, to: string | null }, outcomes: Outcome[], fatal: string | null }} input
 */
export function buildReport({ mode, today, scope, outcomes, fatal }) {
  const count = (/** @type {string} */ r) => outcomes.filter((o) => o.result === r).length;
  return {
    mode,
    date: today,
    scope,
    fatal,
    exitCode: exitCodeFor(outcomes, fatal),
    counts: { companies: scope.companies, withNewFiling: outcomes.length, updated: count("updated"), wouldUpdate: count("would-update"), current: count("current"), held: count("held"), failed: count("failed"), unknown: count("unknown") },
    outcomes: outcomes.map((o) => ({
      id: o.id,
      tier: o.tier ?? null,
      result: o.result,
      detail: o.detail,
      ...(o.reasons ? { reasons: o.reasons } : {}),
      ...(o.newFiling ? { newFiling: o.newFiling } : {}),
      ...(o.added ? { added: o.added.map(figuresOf) } : {}),
      ...(o.dropped ? { dropped: o.dropped.map((r) => r.fiscalYear) } : {}),
      ...(o.source ? { source: { id: o.source.id, url: o.source.url, title: o.source.title } } : {}),
    })),
  };
}

const cell = (/** @type {unknown} */ v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const yen = (/** @type {number | null} */ v) => (typeof v !== "number" ? "—" : v % 1_000_000 === 0 ? `${(v / 1_000_000).toLocaleString("ja-JP")}百万円` : `${(v / 1000).toLocaleString("ja-JP")}千円`);

/** The job summary a person reads first. @param {ReturnType<typeof buildReport>} report */
export function renderSummary(report) {
  const c = report.counts;
  const lines = [
    `## 財務データの更新検知（${report.mode === "dry-run" ? "ドライラン" : report.mode === "rehearse" ? "予行演習" : "書き込みあり"}） ${report.date}`,
    "",
    report.fatal ? `**失敗: ${cell(report.fatal)}**\n` : report.exitCode === 0 ? "結果: 正常終了（データは書き換えていません）。\n" : "**結果: 失敗あり（下の「失敗」を確認）**\n",
    `| 対象の会社 | 新しい有報あり | 更新候補 | 変更なし | 保留 | 失敗 |`,
    `|---:|---:|---:|---:|---:|---:|`,
    `| ${c.companies} | ${c.withNewFiling} | ${c.wouldUpdate + c.updated} | ${c.current} | ${c.held} | ${c.failed + c.unknown} |`,
    "",
    report.scope.from ? `索引の確認範囲: ${report.scope.from} 〜 ${report.scope.to}` : "",
    "",
  ];
  const by = (/** @type {string[]} */ ...results) => report.outcomes.filter((o) => results.includes(o.result));
  const candidates = by("would-update", "updated");
  if (candidates.length > 0) {
    lines.push("### 更新候補（人が確認してから反映する）", "", "| 会社 | 追加される年度 | 売上高 | 純利益 | 新しい有報 |", "|---|---|---:|---:|---|");
    for (const o of candidates) {
      for (const r of o.added ?? []) lines.push(`| ${cell(o.id)}（${cell(o.tier)}） | ${cell(r.fiscalYear)} | ${yen(r.revenue)} | ${yen(r.netIncome)} | ${cell(o.newFiling?.docID)}（${cell(o.newFiling?.submitted)} 提出） |`);
    }
    lines.push("", "反映: `git pull` のあと手元で `npm run content:refresh-financials -- <会社ID> --apply`、`npm run content:diff` で差分を確認して人がコミットする。", "");
  }
  const held = by("held");
  if (held.length > 0) {
    lines.push("### 保留（書き込まない。理由を人が確認する）", "");
    for (const o of held) lines.push(`- **${cell(o.id)}** — ${cell((o.reasons ?? [o.detail]).join(" ／ "))}`);
    lines.push("");
  }
  const failed = by("failed", "unknown");
  if (failed.length > 0) {
    lines.push("### 失敗（ジョブを失敗にした）", "");
    for (const o of failed) lines.push(`- **${cell(o.id)}** — ${cell(o.detail)}`);
    lines.push("");
  }
  if (report.outcomes.length === 0 && !report.fatal) lines.push("新しい有価証券報告書はありません。", "");
  return `${lines.filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n")}\n`;
}

// ----------------------------------------------------------------------------- the effects

const root = process.cwd();
const VITEST = "node_modules/vitest/vitest.mjs";
const run = (/** @type {string[]} */ args, env = {}) => execFileSync(process.execPath, args, { cwd: root, encoding: "utf8", env: { ...process.env, ...env }, stdio: "pipe" });

/** An error as one line, with the API key scrubbed — the key travels in EDINET URLs and must never reach a log. */
export function message(/** @type {any} */ error) {
  let text = String(error?.stdout ?? error?.message ?? error).trim().split("\n").slice(-6).join(" / ").slice(0, 600);
  const key = process.env.EDINET_API_KEY;
  if (key) text = text.split(key).join("***");
  return text;
}

/**
 * Refresh one company. Throws nothing the caller must handle. With `apply`, the returned `undo` restores every
 * file it wrote (used if the integrity suite fails afterwards).
 * @param {string} id
 * @param {{ apply: boolean, newest: Map<string, any>, today: string, retry?: boolean, rehearse?: boolean }} options
 * @returns {Outcome}
 */
export function refreshOne(id, { apply, newest, today, retry = false, rehearse = false }) {
  const entryPath = join(root, "src/data/companies", `${id}.json`);
  if (!existsSync(entryPath)) return { id, result: "failed", detail: "登録済みエントリーがありません" };
  const entryText = readFileSync(entryPath, "utf8");
  const registered = JSON.parse(entryText);
  const tier = registered.status?.state ?? "published";
  const latest = newest.get(registered.code);
  const status = filingStatus(latest, registered);
  const base = { id, tier };

  let entry = registered;
  if (rehearse) {
    const rehearsal = rehearsalEntry(registered);
    if (!rehearsal || !latest || latest.periodEnd !== rehearsal.removed.periodEnd) {
      return { ...base, result: "failed", detail: `予行演習は、最新の有報が登録済みの最新年度（${rehearsal?.removed.periodEnd ?? "なし"}）と同じ会社でしか行えない（索引の最新: ${latest?.periodEnd ?? "なし"}）` };
    }
    entry = rehearsal.entry;
  } else if (status === "current") {
    return { ...base, result: "up-to-date", detail: "" };
  } else if (status === "unknown" || !latest) {
    return { ...base, result: "unknown", detail: `最新の有報 ${latest?.docID} の決算期末が索引に無く、新しい年度かどうか判定できない` };
  }
  if (!latest) return { ...base, result: "failed", detail: "索引に有報が無い" };
  const newFiling = { docID: latest.docID, submitted: latest.submitted, periodEnd: latest.periodEnd };

  // pipeline/state is only a memory of what a person already looked at; it never decides what is new.
  const identity = loadState(id).identity;
  if (!rehearse && !retry && identity?.financialsCheck?.result === "held" && identity.financialsCheck.docID === latest.docID) {
    return { ...base, newFiling, result: "held", detail: `保留のまま（${identity.financialsCheck.reasons.join(" ／ ")}）。--retry で再試行`, reasons: identity.financialsCheck.reasons };
  }
  const hold = (/** @type {string[]} */ reasons) => {
    if (apply && identity) {
      const s = loadState(id);
      s.identity = { ...s.identity, financialsCheck: { at: today, result: "held", docID: latest.docID, reasons } };
      saveState(s);
    }
    return { ...base, newFiling, result: /** @type {const} */ ("held"), detail: reasons.join(" ／ "), reasons };
  };

  try {
    // The cache holds packs per company id; this one is rebuilt for the NEW filing, over the same ±21-day window.
    rebuildPack(id, { code: registered.code, submitted: latest.submitted });
  } catch (error) {
    return { ...base, newFiling, result: "failed", detail: `証拠パックを作れない: ${message(error)}` };
  }
  const pack = readPack(id);
  const draftPath = join(cacheDir(), "evidence", id, "draft-entry.json");
  if (!pack || !existsSync(draftPath) || (pack.filing?.originalDocID ?? pack.filing?.docID) !== latest.docID) {
    return { ...base, newFiling, result: "failed", detail: `証拠パックが新しい有報 ${latest.docID} になっていない` };
  }
  const draft = JSON.parse(readFileSync(draftPath, "utf8"));

  const plan = planFinancialsRefresh({ entry, draft, pack, today });
  if (plan.kind === "hold") return hold(plan.reasons);
  if (plan.kind === "current") return { ...base, newFiling, result: "current", detail: `新しい有報 ${latest.docID} に、登録に無い年度はありません` };

  const next = {
    ...entry,
    financials: plan.financials,
    sources: plan.source ? [...entry.sources, plan.source] : entry.sources,
    updatedAt: today,
  };

  // Gates, on a staged copy. A result that fails them is a FAILURE, not a hold: the extraction or the data
  // is wrong somewhere and a person must look.
  const stagedRelative = `pipeline/staging/${id}.json`;
  const stagedPath = join(root, stagedRelative);
  mkdirSync(join(root, "pipeline/staging"), { recursive: true });
  writeFileSync(stagedPath, `${JSON.stringify(next, null, 2)}\n`);
  try {
    run(["scripts/research/verify-financials.mjs", id, "--entry", stagedRelative]);
    run([VITEST, "run", "tests/validate-file.test.ts"], { CONTENT_FILE: stagedRelative });
  } catch (error) {
    return { ...base, newFiling, result: "failed", detail: `検査に通らない: ${message(error)}` };
  } finally {
    rmSync(stagedPath, { force: true });
  }

  const years = plan.added.map((/** @type {any} */ r) => r.fiscalYear).join("・");
  const droppedYears = plan.dropped.map((/** @type {any} */ r) => r.fiscalYear).join("・");
  const planned = { newFiling, added: plan.added, dropped: plan.dropped, source: plan.source ?? undefined };
  if (!apply) return { ...base, ...planned, result: "would-update", detail: `${years} を追加（${droppedYears ? `${droppedYears} は五年の窓から外れる、` : ""}出典 ${plan.source?.id ?? "既存"}）` };

  const revisionBase = `${today}-company-${id}-financials-refreshed`;
  let revisionId = revisionBase;
  for (let n = 2; existsSync(join(root, "src/data/revisions", `${revisionId}.json`)); n++) revisionId = `${revisionBase}-${n}`;
  const revisionPath = join(root, "src/data/revisions", `${revisionId}.json`);
  const revision = {
    id: revisionId,
    targetType: "company",
    targetId: id,
    changedAt: today,
    reason: "新しい有価証券報告書が提出されたため、財務データに新しい年度を追加した（登録済みの年度は変更していない。解説は変更していない）",
    summary: `${strip(draft._有報)}（docID ${draft._docID}、提出 ${draft._提出日}）から ${years} を追加${droppedYears ? `。${droppedYears} は五年の表示から外れた` : ""}`,
    ...revisionChange(plan.dropped, plan.added),
  };
  const stateBefore = identity ? loadState(id) : null;
  writeFileSync(entryPath, `${JSON.stringify(next, null, 2)}\n`);
  writeFileSync(revisionPath, `${JSON.stringify(revision, null, 2)}\n`);
  if (identity) {
    const s = loadState(id);
    s.identity = {
      ...s.identity,
      financials: { docID: draft._docID, originalDocID: draft._原本docID, submitted: draft._提出日, periodEnd: draft._決算期, refreshedAt: today },
      financialsCheck: undefined,
    };
    saveState(s);
  }
  const undo = () => {
    writeFileSync(entryPath, entryText);
    rmSync(revisionPath, { force: true });
    if (stateBefore) saveState(stateBefore);
  };
  return { ...base, ...planned, result: "updated", detail: `${years} を追加（改訂記録 ${revisionId}）`, undo };
}

// ---------------------------------------------------------------------------------- the CLI

if (process.argv[1]?.endsWith("refresh-financials.mjs")) {
  const args = process.argv.slice(2);
  const flag = (/** @type {string} */ name) => args.includes(`--${name}`);
  const value = (/** @type {string} */ name) => {
    const i = args.indexOf(`--${name}`);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const valueIndexes = new Set(["--tier", "--limit", "--rehearse", "--report", "--summary"].map((f) => args.indexOf(f) + 1).filter((i) => i > 0));
  const rehearseId = value("rehearse");
  const ids = rehearseId ? [rehearseId] : args.filter((a, i) => !a.startsWith("--") && !valueIndexes.has(i));
  const apply = flag("apply");
  const usage = (/** @type {string} */ problem) => {
    console.error(`${problem}\nusage: node scripts/pipeline/refresh-financials.mjs <company-id …> | --all | --rehearse <company-id>  [--tier promoted|all] [--limit N] [--apply] [--retry] [--report f.json] [--summary f.md]`);
    process.exit(1);
  };
  if (ids.length === 0 && !flag("all")) usage("対象の会社がありません");
  if (ids.some((id) => !/^[a-z0-9][a-z0-9-]*$/.test(id))) usage("会社 ID は kebab-case で指定する");
  if (rehearseId && (apply || flag("all"))) usage("--rehearse は --apply、--all と併用できない（予行演習は何も書かない）");
  const mode = rehearseId ? "rehearse" : apply ? "apply" : "dry-run";
  const today = jstToday();

  /** @type {Outcome[]} */
  const outcomes = [];
  /** @type {string | null} */
  let fatal = null;
  const scope = { companies: 0, from: /** @type {string | null} */ (null), to: /** @type {string | null} */ (null) };

  try {
    // The registered companies this run is about, promoted entries first.
    const tierFilter = value("tier") ?? "promoted";
    const entries = loadEntries(root).filter((e) => (ids.length > 0 ? ids.includes(e.id) : tierFilter === "all" || e.tier !== "figures-only"));
    entries.sort((a, b) => Number(b.tier === "published") - Number(a.tier === "published") || a.id.localeCompare(b.id));
    const entryOf = (/** @type {string} */ id) => JSON.parse(readFileSync(join(root, "src/data/companies", `${id}.json`), "utf8"));
    const missing = ids.filter((id) => !entries.some((e) => e.id === id));
    if (missing.length > 0) throw new Error(`登録済みエントリーがありません: ${missing.join(", ")}`);
    scope.companies = entries.length;

    // "No newer filing" is only an answer if every day since the oldest registered filing in play is vouched for.
    // A rehearsal needs the entry's own newest filing too, so it scans from that fiscal year end.
    const startOf = (/** @type {string} */ id) => (rehearseId ? latestPeriod(entryOf(id)) : scanFrom(entryOf(id)));
    const oldest = entries.map((e) => startOf(e.id)).filter(Boolean).sort()[0];
    if (oldest) {
      scope.from = new Date(Date.parse(`${oldest}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
      scope.to = new Date(Date.parse(`${today}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
      const { unresolved } = await ensureIndexCache(scope.from, scope.to);
      if (unresolved.length > 0) throw new Error(`EDINET の日次索引 ${unresolved.length} 日（${unresolved.slice(0, 3).join(", ")}…）を確認できず、新しい有報の有無を保証できない。何も変更していない`);
    }
    const newest = newestFilings(indexDir(), oldest ?? "");
    const limit = Number(value("limit") ?? Infinity);
    const todo = (rehearseId ? entries : entries.filter((e) => filingStatus(newest.get(e.code), entryOf(e.id)) !== "current")).slice(0, limit);
    console.log(`対象 ${entries.length} 社のうち、${rehearseId ? "予行演習の対象は 1 社" : `新しい有報が出ているのは ${todo.length} 社`}（${mode}）`);

    for (const e of todo) {
      let outcome;
      try {
        outcome = refreshOne(e.id, { apply, newest, today, retry: flag("retry"), rehearse: Boolean(rehearseId) });
      } catch (error) {
        outcome = { id: e.id, tier: e.tier, result: /** @type {const} */ ("failed"), detail: message(error) };
      }
      outcomes.push(outcome);
      console.log(`${outcome.result.padEnd(12)} ${e.id}${outcome.detail ? ` — ${outcome.detail}` : ""}`);
    }

    // The integrity suite reads every entry and revision; run once for the whole batch, and put every
    // file back if it fails — an update must never leave the repository failing its own tests.
    const written = outcomes.filter((o) => o.result === "updated");
    if (written.length > 0) {
      try {
        run([VITEST, "run", "tests/data-integrity.test.ts"]);
      } catch (error) {
        for (const o of written) o.undo?.();
        for (const o of written) {
          o.result = "failed";
          o.detail = "統合テストに通らなかったため元に戻した";
        }
        fatal = `統合テストに通らなかったため ${written.length} 社すべてを元に戻した: ${message(error)}`;
      }
    }
  } catch (error) {
    fatal = message(error);
  }

  const report = buildReport({ mode, today, scope, outcomes, fatal });
  for (const [path, body] of [[value("report"), `${JSON.stringify(report, null, 2)}\n`], [value("summary"), renderSummary(report)]]) {
    if (!path) continue;
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
  }
  const c = report.counts;
  if (fatal) console.log(`FATAL: ${fatal}`);
  console.log(`\n更新 ${c.updated} ／ 更新予定 ${c.wouldUpdate} ／ 変更なし ${c.current} ／ 保留 ${c.held} ／ 失敗 ${c.failed + c.unknown}`);
  if (c.updated > 0) console.log("コミットは人が行うこと（このスクリプトは git を触りません）。差分: npm run content:diff");
  if (c.held > 0) console.log("保留は上の理由を人が確認すること（書き込みなしの実行では記録されない。--apply の実行で pipeline/state の financialsCheck に残る）。");
  // A rehearsal exists to show the path works; one that stopped anywhere else has proved nothing.
  process.exit(rehearseId ? (outcomes[0]?.result === "would-update" && !fatal ? 0 : 1) : report.exitCode);
}
