/**
 * The 30-day unattended-operation proof (JCE-106, SaaS Step 4): one daily record, and the
 * reconciliation that shows nothing EDINET received was missed.
 *
 *   node scripts/pipeline/unattended-proof.mjs [--date YYYY-MM-DD] [--out log.jsonl]
 *   node scripts/pipeline/unattended-proof.mjs --from YYYY-MM-DD --to YYYY-MM-DD [--out log.jsonl]
 *
 * What "unattended" covers (the lanes that already run without a person, all inside the
 * refresh-financials workflow and the local watcher): detection of new annual reports, interim
 * reports and corrections, verification, application to a branch and a pull request, and the run
 * records committed under pipeline/runs/. Merging a pull request stays a person's act (JCE-024),
 * so it is outside the unattended scope — the record keeps the held/failed counts that show what
 * is waiting for that person instead.
 *
 * For each day this reads the EDINET day index (documentsOn; the EDINET API, never EDINET DB, so
 * the shared EDINET DB allowance is untouched) and takes every filing of a type the lanes handle
 * — 120 有価証券報告書, 130 訂正有価証券報告書, 160 半期報告書, 170 訂正半期報告書 — whose filer is a
 * registered company. A filing is ACCOUNTED when a lane provably has it:
 *
 *   120  the entry's newest financials reach the filing's period end, or the entry cites the
 *        docID, or a committed refresh run record names it, or the local watcher queue holds it
 *   130  the amendments index (pipeline/amendments-index.json) holds it under its parent, or the
 *        entry cites it (an applied correction rewrites the figures' source to it), or the
 *        watcher queue holds it
 *   160  the entry cites the docID (its interimFinancials source), or a run record / the watcher
 *   170  queue names it. The day index's periodEnd cannot be used for interim reports: for some
 *        filers it is the fiscal year end, for others the half's end (interim-financials.mjs),
 *        and the true half end exists only inside the filing — so the proof never guesses from it.
 *        Two refinements keep the rule honest: the interim lane's mandate is published companies
 *        only (JCE-045), so a 160/170 of any other tier is out-of-scope, never a leak; and a 160
 *        older than the newest half the entry already cites is superseded by it. A 170 stays
 *        strict — a correction to a held half is pending until something cites or names it.
 *
 * A filing that is not accounted and was submitted more than --grace days ago (default 3: the
 * lanes run daily, EDINET's index is final after its nightly batch) is a LEAK — the proof fails
 * (exit 1) and names it. Younger unaccounted filings are "pending", not leaks. A day whose index
 * is not final or cannot be read stops the run (exit 2) without writing a record, like the
 * watcher: a gap in the proof is never written up as a clean day.
 *
 * The record also carries the day's lane outcomes from the committed run records
 * (pipeline/runs/<lane>-<date>-*.json): processed, updated, held and failed per lane.
 */
import { appendFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { documentsOn, indexProblem, jstToday, scrubSecrets } from "../research/edinet.mjs";
import { loadIndex } from "../research/amendments.mjs";

export const HANDLED_TYPES = new Set(["120", "130", "160", "170"]);
const dayMs = 86_400_000;
const toMs = (/** @type {string} */ d) => Date.parse(`${d}T00:00:00Z`);
const addDays = (/** @type {string} */ d, /** @type {number} */ n) => new Date(toMs(d) + n * dayMs).toISOString().slice(0, 10);

/**
 * Decide, for one filing, whether a lane provably has it. Pure.
 * @param {{ docID: string, docTypeCode: string, parentDocID?: string|null, periodEnd?: string|null, submitDateTime?: string }} filing
 * @param {{ newestPeriodEnd: string|null, citedDocIds: Set<string>, tier: string, newestHalfSourceDate: string|null }} entry the registered company the filing belongs to
 * @param {{ amendmentsIndex: any, runDocIds: Set<string>, watcherDocIds: Set<string>, asOf: string, graceDays: number }} ctx
 * @returns {"accounted"|"pending"|"held"|"out-of-scope"|"leak"}
 */
export function filingStatus(filing, entry, ctx) {
  if ((filing.docTypeCode === "160" || filing.docTypeCode === "170") && entry.tier !== "published") return "out-of-scope";
  let accounted = entry.citedDocIds.has(filing.docID);
  if (filing.docTypeCode === "120") {
    accounted = accounted || Boolean((entry.newestPeriodEnd && filing.periodEnd && entry.newestPeriodEnd >= filing.periodEnd)
      || ctx.runDocIds.has(filing.docID) || ctx.watcherDocIds.has(filing.docID));
  } else if (filing.docTypeCode === "130") {
    const siblings = ctx.amendmentsIndex?.byParent?.[filing.parentDocID ?? ""] ?? [];
    accounted = accounted || siblings.some((/** @type {any} */ a) => a.docID === filing.docID) || ctx.watcherDocIds.has(filing.docID);
  } else if (filing.docTypeCode === "160" || filing.docTypeCode === "170") {
    accounted = accounted || ctx.runDocIds.has(filing.docID) || ctx.watcherDocIds.has(filing.docID);
    const submitted = (filing.submitDateTime ?? "").slice(0, 10);
    if (filing.docTypeCode === "160" && entry.newestHalfSourceDate && submitted && entry.newestHalfSourceDate >= submitted) accounted = true;
  }
  if (accounted) return "accounted";
  const submitted = (filing.submitDateTime ?? "").slice(0, 10);
  if (submitted && addDays(submitted, ctx.graceDays) >= ctx.asOf) return "pending";
  return "leak";
}

/** Registered companies by EDINET secCode (4 digits + trailing 0), with the ends their data reaches and every docID they cite. */
export function entryIndex(root = process.cwd()) {
  const dir = join(root, "src/data/companies");
  /** @type {Map<string, { id: string, newestPeriodEnd: string|null, citedDocIds: Set<string>, tier: string, newestHalfSourceDate: string|null }>} */
  const bySecCode = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const entry = JSON.parse(readFileSync(join(dir, file), "utf8"));
    if (!entry.code) continue;
    const ends = (entry.financials ?? []).map((/** @type {any} */ f) => f.periodEnd).filter(Boolean).sort();
    const citedDocIds = new Set();
    let newestHalfSourceDate = null;
    for (const s of entry.sources ?? []) {
      if (s.docId) citedDocIds.add(s.docId);
      const fromUrl = /(S[0-9A-Z]{7})\.pdf/.exec(s.url ?? "")?.[1];
      if (fromUrl) citedDocIds.add(fromUrl);
      if (String(s.title ?? "").includes("半期報告書") && s.publishedAt && (!newestHalfSourceDate || s.publishedAt > newestHalfSourceDate)) newestHalfSourceDate = s.publishedAt;
    }
    bySecCode.set(`${entry.code}0`, { id: entry.id, newestPeriodEnd: ends.at(-1) ?? null, citedDocIds, tier: entry.status?.state ?? "published", newestHalfSourceDate });
  }
  return bySecCode;
}

/**
 * DocIDs the committed run records name, and the per-lane tallies for one day. A docID is
 * harvested from an outcome's own fields and from its detail text (the interim lane names the
 * filing it failed on only in prose). An outcome that ended held/failed still proves the lane
 * SAW the filing: those docIDs come back separately as heldDocIds, so the proof can tell a
 * detection leak from an application hold. Records are read as they stand today — a pull
 * request that has not merged yet is invisible here, which is why the weekly reconciliation
 * re-runs the past days with the evidence then committed (see JCE-106).
 */
export function runRecords(root, date) {
  const dir = join(root, "pipeline/runs");
  const docIds = new Set();
  const heldDocIds = new Set();
  /** @type {Record<string, any>} */
  const lanes = {};
  if (!existsSync(dir)) return { docIds, heldDocIds, lanes };
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    let record;
    try { record = JSON.parse(readFileSync(join(dir, file), "utf8")); } catch { continue; }
    const lane = file.split("-")[0];
    const recordDate = record.date ?? record.today ?? null;
    for (const o of record.outcomes ?? []) {
      const named = [o.newFiling?.docID, o.docID, ...String(o.detail ?? "").match(/S[0-9A-Z]{7}/g) ?? []].filter(Boolean);
      for (const docID of named) {
        docIds.add(docID);
        if (o.result === "held" || o.result === "failed") heldDocIds.add(docID);
      }
    }
    if (recordDate !== date) continue;
    if (lane === "financials" && record.counts) {
      lanes.financials = { withNewFiling: record.counts.withNewFiling ?? 0, updated: record.counts.updated ?? 0, held: record.counts.held ?? 0, failed: record.counts.failed ?? 0 };
    } else if (lane === "amendment") {
      lanes.amendment = { added: record.added ?? 0, rows: (record.rows ?? []).length };
    } else if (Array.isArray(record.outcomes)) {
      const tally = /** @type {Record<string, number>} */ ({});
      for (const o of record.outcomes) tally[o.result] = (tally[o.result] ?? 0) + 1;
      lanes[lane] = tally;
    }
  }
  return { docIds, heldDocIds, lanes };
}

/** DocIDs in the local watcher queue, when this machine holds it. */
export function watcherDocIds(queuePath) {
  const ids = new Set();
  if (!queuePath || !existsSync(queuePath)) return ids;
  for (const line of readFileSync(queuePath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      const record = parsed.record ?? parsed;
      if (record.docID) ids.add(record.docID);
      if (record.amendmentDocID) ids.add(record.amendmentDocID);
    } catch { /* a torn last line is not evidence either way */ }
  }
  return ids;
}

async function main() {
  const args = process.argv.slice(2);
  const valueOf = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
  const outPath = valueOf("--out");
  const graceDays = Number(valueOf("--grace") ?? "3") || 3;
  const asOf = jstToday();
  const from = valueOf("--from") ?? valueOf("--date") ?? addDays(asOf, -1);
  const to = valueOf("--to") ?? valueOf("--date") ?? addDays(asOf, -1);
  const queuePath = valueOf("--watcher-queue") ?? join(process.env.HOME ?? "", "workspace/goals/japan-company-encyclopedia-multi-ai-registration/hidden_files/new-filings-queue.jsonl");

  const bySecCode = entryIndex();
  const amendmentsIndex = loadIndex();
  const watcher = watcherDocIds(queuePath);

  /** @type {any[]} */
  const records = [];
  const seen = new Set();
  let stopped = null;
  for (let date = from; date <= to && !stopped; date = addDays(date, 1)) {
    const json = await documentsOn(date);
    const problem = indexProblem(json, date);
    if (problem) { stopped = { date, problem: scrubSecrets(String(problem)) }; break; }
    const { docIds, heldDocIds, lanes } = runRecords(process.cwd(), date);
    const ctx = { amendmentsIndex, runDocIds: docIds, watcherDocIds: watcher, asOf, graceDays };
    // A docID can surface in more than one day's list (EDINET re-lists updated filings); count it once per run.
    const filings = (json.results ?? []).filter((/** @type {any} */ r) => HANDLED_TYPES.has(r.docTypeCode) && bySecCode.has(r.secCode) && !seen.has(r.docID) && seen.add(r.docID));
    const tally = { detected: filings.length, accounted: 0, pending: 0, held: 0, outOfScope: 0, leak: 0 };
    /** @type {any[]} */
    const leaks = [];
    for (const filing of filings) {
      let status = filingStatus(filing, /** @type {any} */ (bySecCode.get(filing.secCode)), ctx);
      // Seen by a lane but held back by its gates: detected, not leaked. It stays visible here
      // until the entry cites it, so a hold that never resolves keeps being counted.
      if (status === "leak" && heldDocIds.has(filing.docID)) status = "held";
      tally[status === "out-of-scope" ? "outOfScope" : status]++;
      if (status === "leak") leaks.push({ docID: filing.docID, docTypeCode: filing.docTypeCode, companyId: bySecCode.get(filing.secCode)?.id, periodEnd: filing.periodEnd ?? null, submitted: (filing.submitDateTime ?? "").slice(0, 10) });
    }
    const record = { date, scope: "registered-companies", filings: tally, leaks, lanes };
    records.push(record);
    console.log(`${date}: 検知 ${tally.detected}（accounted ${tally.accounted} / pending ${tally.pending} / 保留 ${tally.held} / 対象外 ${tally.outOfScope} / 漏れ ${tally.leak}）`);
    for (const leak of leaks) console.log(`  漏れ: ${leak.companyId} ${leak.docTypeCode} ${leak.docID}（提出 ${leak.submitted}、期末 ${leak.periodEnd}）`);
  }
  if (stopped) {
    console.error(`索引が使えないため止まりました: ${stopped.date}: ${stopped.problem}（この日の記録は書きません）`);
    process.exit(2);
  }
  if (outPath) {
    for (const record of records) appendFileSync(outPath, `${JSON.stringify(record)}\n`);
    console.log(`記録を追記しました: ${outPath}`);
  }
  process.exit(records.some((r) => r.leaks.length > 0) ? 1 : 0);
}

if (process.argv[1]?.endsWith("unattended-proof.mjs")) await main();
