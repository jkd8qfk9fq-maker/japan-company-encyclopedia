/**
 * 決算短信 Q1/Q3 via EDINET DB → `quarterlyEarnings` on a company entry (JCE-049).
 *
 *   node scripts/pipeline/quarterly-earnings.mjs <company-id> [more-ids …] [--apply]
 *   node scripts/pipeline/quarterly-earnings.mjs --due [--days 21] [--backfill] [--budget 80] [--plan-only] [--apply] [--report f.json]
 *
 * Since 2024 the first and third quarters exist only in 決算短信 (TDnet), which EDINET does not hold. The operator
 * decided (2026-11-15) to take them from EDINET DB's structured copy of the 決算短信, shown with its attribution.
 * EDINET stays the basis of everything else: the first half comes from the 半期報告書 (interim-financials.mjs) and
 * the full year from the 有価証券報告書, never from here.
 *
 * Before a company's quarters are written, EDINET DB's own Q2 and full-year figures for that company are compared
 * with the ones the entry already holds from EDINET. A difference beyond EDINET DB's 百万円 rounding means the two
 * are not describing the same thing (a different perimeter, a mismatched company), and the company is held.
 *
 * Calls are rationed: the plan allows a fixed number of requests a day (X-Ratelimit-Remaining). `--due` reads the
 * announcement calendar (one or two requests) and fetches only companies that announced a Q1/Q3 we do not hold;
 * `--backfill` then spends what is left of `--budget` on companies never checked, remembered in the EDINET cache so
 * the backfill moves through the list over the days. `--plan-only` reads the calendar alone and says who is due.
 *
 * Without --apply nothing under src/data is written. With --apply the entry, its sources and a Revision are written —
 * never git. The key is EDINETDB_API_KEY; without it the script reports that and exits 0, so the rest of the
 * workflow runs on.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { jstToday } from "../research/edinet.mjs";
import { loadEntries } from "./jobs.mjs";
import { assertMachineWrite } from "./ownership.mjs";
import { loadLedger } from "./policy-context.mjs";

const API = "https://edinetdb.jp/v1";
// EDINET DB spells the standard several ways (JP_GAAP and JP on the same company's rows, 2026-11-15). An unknown
// spelling drops the row rather than guessing a standard.
const STANDARD = { IFRS: "ifrs", JP_GAAP: "jgaap", JP: "jgaap", JGAAP: "jgaap", "Japan GAAP": "jgaap", 日本基準: "jgaap", US_GAAP: "usgaap", US: "usgaap", "US GAAP": "usgaap", USGAAP: "usgaap", 米国基準: "usgaap" };
const PUBLISHER = "EDINET DB（Cabocia株式会社）が会社の決算短信を構造化したデータ";
/** EDINET DB prints 百万円 with the rest cut off; anything closer than this is the same figure. */
const MILLION = 1_000_000;

export const fiscalYearLabel = (/** @type {string} */ fye) => `${fye.slice(0, 4)}年${Number(fye.slice(5, 7))}月期`;
const isoDate = (/** @type {string} */ text) => {
  const d = new Date(text);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};
const yen = (/** @type {number | null | undefined} */ millions) => (millions == null ? null : Math.round(millions * MILLION));

/** Same figure within EDINET DB's rounding: below 百万円 is cut, so a difference under one million is no difference. */
export function sameFigure(/** @type {number | null} */ ours, /** @type {number | null} */ theirsMillions) {
  if (ours == null || theirsMillions == null) return true;
  // Strictly under one million: a proportional tolerance let ¥3,696 million pass as ¥3,698 million (adish, 2026-11-15).
  return Math.abs(ours - theirsMillions * MILLION) < MILLION;
}

/**
 * EDINET DB's Q2 and full-year rows against what the entry holds from EDINET. Returns the comparisons made and the
 * ones that disagree. A company with nothing to compare is not held for that: the operator accepted the source.
 */
export function crossCheck(entry, rows) {
  const compared = [];
  const mismatches = [];
  // EDINET DB's net_income is, for some companies, the profit of the whole group including non-controlling
  // interests (AGC, イオン, 2026-11-15), not the parent's share the entry shows. Then the quarters keep their revenue
  // and operating income and drop net income; a revenue that differs holds the company entirely.
  const netIncomeMismatches = [];
  for (const r of rows) {
    const fye = r.fiscal_year_end;
    if (!fye || r.is_consolidated === false) continue;
    let ours = null;
    if (r.quarter === 4) ours = (entry.financials ?? []).find((f) => f.periodEnd.slice(0, 7) === fye.slice(0, 7));
    if (r.quarter === 2) {
      // The half that ends six months before this fiscal year's end. Year and month only: Date arithmetic on the
      // 31st turns "31 September" into 1 October.
      const months = Number(fye.slice(0, 4)) * 12 + Number(fye.slice(5, 7)) - 1 - 6;
      const halfMonth = `${Math.floor(months / 12)}-${String((months % 12) + 1).padStart(2, "0")}`;
      ours = (entry.interimFinancials ?? []).find((h) => h.periodEnd.slice(0, 7) === halfMonth);
    }
    if (!ours) continue;
    const what = `${fiscalYearLabel(fye)} ${r.quarter === 4 ? "通期" : "第2四半期"}`;
    compared.push(what);
    if (!sameFigure(ours.revenue, r.revenue)) mismatches.push(`${what}: 売上 ${ours.revenue} と ${r.revenue}百万円`);
    if (!sameFigure(ours.netIncome, r.net_income)) netIncomeMismatches.push(`${what}: 純利益 ${ours.netIncome} と ${r.net_income}百万円`);
  }
  return { compared, mismatches, netIncomeMismatches };
}

/** The Q1/Q3 rows as records, one per fiscal year and quarter: consolidated over not, the latest disclosure (a correction) over an earlier one. */
export function toRecords(rows, today) {
  const chosen = new Map();
  // The latest three fiscal years: EDINET DB carries the odd row from long ago (a 2011 third quarter, 2026-11-15)
  // that no reader of the year in progress needs and no EDINET figure here could check.
  const latest = rows.map((r) => r.fiscal_year_end).filter(Boolean).sort().at(-1) ?? "";
  const oldest = latest ? `${Number(latest.slice(0, 4)) - 2}${latest.slice(4)}` : "";
  for (const r of rows) {
    if (r.quarter !== 1 && r.quarter !== 3) continue;
    const fye = r.fiscal_year_end;
    if (fye < oldest) continue;
    const disclosedAt = isoDate(r.disclosure_date);
    const standard = STANDARD[r.accounting_standard];
    if (!fye || !/^\d{4}-\d{2}-\d{2}$/.test(fye) || !disclosedAt || !standard || r.revenue == null) continue;
    const key = `${fye}:${r.quarter}`;
    const prev = chosen.get(key);
    const better = !prev || (r.is_consolidated !== false && prev.row.is_consolidated === false) || (r.is_consolidated === prev.row.is_consolidated && disclosedAt > prev.disclosedAt);
    if (better) chosen.set(key, { row: r, disclosedAt, standard });
  }
  return [...chosen.values()]
    .map(({ row, disclosedAt, standard }) => {
      const sourceId = `tanshin-${row.fiscal_year_end.slice(0, 7).replace("-", "")}-q${row.quarter}`;
      const pdf = typeof row.pdf_url === "string" && row.pdf_url.startsWith("https://") ? row.pdf_url : null;
      return {
        record: {
          fiscalYearEnd: row.fiscal_year_end,
          fiscalYear: fiscalYearLabel(row.fiscal_year_end),
          quarter: row.quarter,
          revenue: yen(row.revenue),
          operatingIncome: yen(row.operating_income),
          netIncome: yen(row.net_income),
          accountingStandard: standard,
          consolidated: row.is_consolidated !== false,
          disclosedAt,
          sourceIds: [sourceId],
        },
        source: {
          id: sourceId,
          title: `${fiscalYearLabel(row.fiscal_year_end)} 第${row.quarter}四半期 決算短信${row.is_correction ? "（訂正）" : ""}`,
          publisher: PUBLISHER,
          // The company's own document where EDINET DB links one; otherwise EDINET DB's page for the company.
          url: pdf ?? `https://edinetdb.jp/company/${row.edinet_code ?? ""}`.replace(/\/$/, ""),
          publishedAt: disclosedAt,
          accessedAt: today,
        },
      };
    })
    .sort((a, b) => a.record.fiscalYearEnd.localeCompare(b.record.fiscalYearEnd) || a.record.quarter - b.record.quarter);
}

/** Merge into the entry: add a quarter not held, replace one whose figures changed (a corrected 決算短信). */
export function planQuarterly(entry, incoming) {
  const existing = entry.quarterlyEarnings ?? [];
  const next = [...existing];
  const added = [];
  const replaced = [];
  let sources = [...entry.sources];
  for (const { record, source } of incoming) {
    const i = next.findIndex((q) => q.fiscalYearEnd === record.fiscalYearEnd && q.quarter === record.quarter);
    const same = (a, b) => a.revenue === b.revenue && a.operatingIncome === b.operatingIncome && a.netIncome === b.netIncome;
    if (i === -1) {
      next.push(record);
      added.push(record);
    } else if (!same(next[i], record)) {
      replaced.push(next[i]);
      next[i] = record;
    } else continue;
    sources = [...sources.filter((s) => s.id !== source.id), source];
  }
  next.sort((a, b) => a.fiscalYearEnd.localeCompare(b.fiscalYearEnd) || a.quarter - b.quarter);
  return { next, added, replaced, sources };
}

// ---------------------------------------------------------------------------------------------------------------

let remaining = Infinity;
async function api(path) {
  const key = process.env.EDINETDB_API_KEY;
  const res = await fetch(`${API}${path}`, { headers: key ? { "X-API-Key": key } : {} });
  const left = Number(res.headers.get("x-ratelimit-remaining"));
  if (Number.isFinite(left)) remaining = left;
  // The day's allowance is spent (the key is shared with anyone checking by hand): ask nothing more today.
  if (res.status === 429) remaining = 0;
  if (!res.ok) throw new Error(`${res.status} ${path}: ${(await res.text()).slice(0, 160)}`);
  return res.json();
}

const VITEST = "node_modules/.bin/vitest";
const checkedPath = () => join(process.env.RESEARCH_CACHE ?? ".cache/edinet", "edinetdb-checked.json");
const readChecked = () => (existsSync(checkedPath()) ? JSON.parse(readFileSync(checkedPath(), "utf8")) : {});
function writeChecked(checked) {
  mkdirSync(dirname(checkedPath()), { recursive: true });
  writeFileSync(checkedPath(), `${JSON.stringify(checked, null, 2)}\n`);
}

/** Companies that announced a Q1/Q3 in the window and whose entry does not hold that quarter. */
export function dueFromCalendar(calendar, entriesByCode, held) {
  const due = new Map();
  for (const c of calendar) {
    if (c.periodTypeEn !== "Q1" && c.periodTypeEn !== "Q3") continue;
    const id = entriesByCode.get(String(c.secCode ?? "").slice(0, 4));
    if (!id) continue;
    const quarter = c.periodTypeEn === "Q1" ? 1 : 3;
    if (c.fiscalYearEnd && held(id, c.fiscalYearEnd, quarter)) continue;
    due.set(id, { edinetCode: c.edinetCode, announced: c.announcementDate });
  }
  return due;
}

async function calendarWindow(days, today) {
  const from = new Date(`${today}T00:00:00Z`);
  from.setUTCDate(from.getUTCDate() - days);
  const out = [];
  // The endpoint returns at most 500 rows per call, oldest first; walk the window forward from the last date seen.
  let start = from.toISOString().slice(0, 10);
  for (let page = 0; page < 6; page++) {
    const data = (await api(`/calendar?from=${start}&to=${today}`)).data?.calendar ?? [];
    out.push(...data);
    if (data.length < 500) break;
    const last = data.at(-1).announcementDate;
    if (last === start) break;
    start = last;
  }
  return out;
}

export async function refreshQuarterly(id, edinetCode, { apply, today, root = process.cwd() }) {
  const entryPath = join(root, "src/data/companies", `${id}.json`);
  const entry = JSON.parse(readFileSync(entryPath, "utf8"));
  const base = { id, name: entry.name };
  if (!edinetCode) return { ...base, result: "none", detail: "EDINET コードが listing.tsv にない" };
  let rows;
  try {
    rows = (await api(`/companies/${edinetCode}/earnings?limit=12`)).data?.earnings ?? [];
  } catch (error) {
    return { ...base, result: "failed", detail: `EDINET DB から読めない: ${String(error?.message ?? error).slice(0, 200)}` };
  }
  // Kept beside the EDINET downloads (never committed): a held company can be re-examined without spending a request
  // of the day's allowance. The terms allow a cache that is refreshed from the API, which every run does.
  const responseDir = join(process.env.RESEARCH_CACHE ?? ".cache/edinet", "edinetdb");
  mkdirSync(responseDir, { recursive: true });
  writeFileSync(join(responseDir, `${edinetCode}.json`), `${JSON.stringify({ fetchedAt: today, earnings: rows })}\n`);
  rows = rows.map((r) => ({ ...r, edinet_code: edinetCode }));
  const check = crossCheck(entry, rows);
  if (check.mismatches.length > 0) return { ...base, result: "held", detail: `EDINET の数値と一致しない（${check.mismatches.join("／")}）` };
  const incoming = toRecords(rows, today);
  if (check.netIncomeMismatches.length > 0) for (const { record } of incoming) record.netIncome = null;
  if (incoming.length === 0) return { ...base, result: "none", detail: "第1・第3四半期の決算短信が EDINET DB にない" };
  const plan = planQuarterly(entry, incoming);
  if (plan.added.length + plan.replaced.length === 0) return { ...base, result: "current", detail: "新しい四半期はない" };
  const quarters = [...plan.added, ...plan.replaced.map(() => null)].filter(Boolean).map((q) => `${q.fiscalYear} 第${q.quarter}四半期`).join("・") || "訂正";
  const checked = `${check.compared.length > 0 ? `照合 ${check.compared.join("・")}` : "照合できる EDINET の数値なし"}${check.netIncomeMismatches.length > 0 ? `。純利益は定義が違うため載せない（${check.netIncomeMismatches.join("／")}）` : ""}`;
  if (!apply) return { ...base, result: "would-update", detail: `${quarters}（${checked}）`, added: plan.added };

  const next = { ...entry, quarterlyEarnings: plan.next, sources: plan.sources, updatedAt: today };
  assertMachineWrite(entry, next, "quarterly-earnings");
  const stagedRelative = `pipeline/staging/${id}.json`;
  mkdirSync(join(root, "pipeline/staging"), { recursive: true });
  writeFileSync(join(root, stagedRelative), `${JSON.stringify(next, null, 2)}\n`);
  try {
    execFileSync("node", [VITEST, "run", "tests/validate-file.test.ts"], { stdio: "pipe", env: { ...process.env, CONTENT_FILE: stagedRelative } });
  } catch (error) {
    return { ...base, result: "failed", detail: `検査に通らない: ${String(error?.message ?? error).slice(0, 200)}` };
  } finally {
    rmSync(join(root, stagedRelative), { force: true });
  }
  const revisionBase = `${today}-company-${id}-quarterly-added`;
  let revisionId = revisionBase;
  for (let n = 2; existsSync(join(root, "src/data/revisions", `${revisionId}.json`)); n++) revisionId = `${revisionBase}-${n}`;
  const revision = {
    id: revisionId,
    targetType: "company",
    targetId: id,
    changedAt: today,
    reason: "決算短信の第1・第3四半期の数値を EDINET DB から追加した（JCE-049。年次・半期の数値と解説は変更していない）",
    summary: `EDINET DB（${edinetCode}）から ${quarters} を追加。${checked}`,
    before: plan.replaced.length ? plan.replaced : undefined,
    after: plan.added.length ? plan.added : plan.next,
  };
  writeFileSync(entryPath, `${JSON.stringify(next, null, 2)}\n`);
  writeFileSync(join(root, "src/data/revisions", `${revisionId}.json`), `${JSON.stringify(revision, null, 2)}\n`);
  return { ...base, result: "updated", detail: `${quarters}（${checked}、改訂記録 ${revisionId}）`, added: plan.added };
}

if (process.argv[1]?.endsWith("quarterly-earnings.mjs")) {
  const args = process.argv.slice(2);
  const flag = (name) => args.includes(`--${name}`);
  const value = (name) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined);
  const skip = new Set(["--days", "--budget", "--report"].map((f) => args.indexOf(f) + 1).filter((i) => i > 0));
  const report = value("report");
  const today = jstToday();
  const finish = (outcomes, extra = {}) => {
    if (report) {
      mkdirSync(dirname(report), { recursive: true });
      writeFileSync(report, `${JSON.stringify({ today, apply: flag("apply"), remaining: Number.isFinite(remaining) ? remaining : null, ...extra, outcomes }, null, 2)}\n`);
    }
    const counts = outcomes.reduce((c, o) => ({ ...c, [o.result]: (c[o.result] ?? 0) + 1 }), {});
    console.log(Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(" / ") || "nothing to do");
  };
  if (!process.env.EDINETDB_API_KEY) {
    console.log("EDINETDB_API_KEY is not set: the quarterly figures are skipped (JCE-049).");
    finish([], { skipped: "no key" });
    process.exit(0);
  }

  const entries = new Map(loadEntries().map((e) => [e.id, e]));
  // Published entries only, like the half-year job: these are the pages the figures are shown on.
  const targets = [...entries.values()].filter((e) => e.tier !== "figures-only");
  const ledger = loadLedger();
  const edinetCodeOf = (id) => ledger.get(entries.get(id)?.code)?.edinetCode ?? null;
  const byCode = new Map(targets.map((e) => [e.code, e.id]));
  const held = (id, fye, quarter) => {
    const entry = JSON.parse(readFileSync(join("src/data/companies", `${id}.json`), "utf8"));
    return (entry.quarterlyEarnings ?? []).some((q) => q.fiscalYearEnd === fye && q.quarter === quarter);
  };

  let queue = args.filter((a, i) => !a.startsWith("--") && !skip.has(i)).map((id) => ({ id, edinetCode: edinetCodeOf(id), why: "指定" }));
  let dueCount = 0;
  let calendarError = null;
  if (flag("due")) {
    try {
      const calendar = await calendarWindow(Number(value("days") ?? 21), today);
      const due = dueFromCalendar(calendar, byCode, held);
      dueCount = due.size;
      queue.push(...[...due.entries()].map(([id, d]) => ({ id, edinetCode: d.edinetCode ?? edinetCodeOf(id), why: `${d.announced} 発表` })));
    } catch (error) {
      // A refused calendar (the day's allowance spent, 2026-11-15) is reported, not thrown: the rest of the run goes on.
      calendarError = String(error?.message ?? error).slice(0, 200);
      console.log(`calendar unavailable: ${calendarError}`);
    }
  }
  const checked = readChecked();
  if (flag("plan-only")) {
    // The calendar alone: who announced a quarter we lack, and (with --backfill) how many were never checked.
    const backfill = flag("backfill") ? targets.filter((e) => !checked[e.id]).length : 0;
    console.log(`due ${dueCount} / never checked ${backfill}`);
    finish(queue.map((q) => ({ id: q.id, result: "would-update", detail: q.why })), { due: dueCount, backfill, ...(calendarError ? { calendarError } : {}) });
    process.exit(0);
  }
  if (flag("backfill")) {
    const inQueue = new Set(queue.map((q) => q.id));
    const never = targets.filter((e) => !inQueue.has(e.id) && !checked[e.id]).map((e) => ({ id: e.id, edinetCode: edinetCodeOf(e.id), why: "初回" }));
    queue.push(...never);
  }
  const budget = Number(value("budget") ?? 80);
  const outcomes = [];
  let spent = 0;
  for (const item of queue) {
    // Keep a few requests of the day's allowance for a person checking by hand.
    if (spent >= budget || remaining <= 5) break;
    const outcome = await refreshQuarterly(item.id, item.edinetCode, { apply: flag("apply"), today });
    if (item.edinetCode) spent++;
    // Only a company actually read is remembered; one refused (rate limit, network) is tried again on a later day.
    if (outcome.result !== "failed") checked[item.id] = today;
    outcomes.push(outcome);
    console.log(`${outcome.id}: ${outcome.result} — ${outcome.detail}`);
  }
  if (flag("apply")) writeChecked(checked);
  finish(outcomes, { due: dueCount, queued: queue.length, spent, ...(calendarError ? { calendarError } : {}) });
}
