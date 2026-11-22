/**
 * Assign identity codes (JCE-093): copy each filer's EDINET code and corporate number from the
 * official EDINET code list (金融庁 EDINETコードリスト) into its encyclopedia entry.
 *
 *   node scripts/pipeline/assign-identity-codes.mjs --file <Edinetcode.zip | EdinetcodeDlInfo.csv> [--write] [--report <path>]
 *   node scripts/pipeline/assign-identity-codes.mjs --download [--write] [--report <path>]
 *
 * The join key is the securities code, exactly as the master ledger (sync-listing.mjs) is keyed.
 * The match is never made by name and never inferred: an entry whose code the list does not carry
 * as a listed filer is left untouched and reported with the reason (delisted filers stay in the
 * list as 非上場 with no securities code; some names match more than one row). A value already in
 * an entry is never overwritten — a disagreement is a conflict for a person, not a write.
 *
 * Without --write nothing is written: the plan and the report are printed (and saved with
 * --report) so the operator can read them first. `updatedAt` is not touched: this is identity
 * plumbing from an official list, not a content edit, and no page renders these fields yet.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { cacheDir } from "../research/edinet.mjs";
import { assertMachineWrite } from "./ownership.mjs";
import { CODELIST_URL, ledgerProblems, parseCodeList, readCodeListFile, toLedger } from "./sync-listing.mjs";

// ---------------------------------------------------------------------------------- planning

/**
 * Names as the two sources write them: the list uses full-width Latin and keeps the corporate
 * form, the entry's officialName is the registered 商号. Normalised, they should agree; where
 * they do not, the list usually records a rename the entry has not caught up with (or the other
 * way round) — worth a person's look, never a reason to drop an official code.
 * @param {string} s
 */
export const normalizeName = (s) =>
  (s ?? "")
    .normalize("NFKC")
    .replace(/株式会社|有限会社|合同会社/g, "")
    .replace(/（旧会社名.*$/, "")
    .replace(/\s/g, "");

/**
 * @typedef {{ id: string, code: string, name: string, officialName: string, tier: string, edinetCode?: string, corporateNumber?: string }} EntryIdentity
 * @typedef {{ id: string, code: string, edinetCode: string, corporateNumber: string }} Assignment
 * @typedef {{ id: string, code: string, field: string, entryValue: string, listValue: string }} Conflict
 * @typedef {{ id: string, code: string, entryName: string, listName: string }} NameWarning
 * @typedef {{ id: string, code: string, officialName: string, tier: string, reason: string, detail: string }} Unmatched
 */

/**
 * Why an entry's code found no listed filer, from the raw list rows. Pure.
 * @param {EntryIdentity} entry
 * @param {ReturnType<typeof parseCodeList>["rows"]} rows
 * @returns {{ reason: string, detail: string }}
 */
export function classifyUnmatched(entry, rows) {
  const targets = new Set([normalizeName(entry.officialName), normalizeName(entry.name)]);
  const hits = rows.filter((r) => targets.has(normalizeName(r.name)));
  if (hits.length === 1 && hits[0].listing === "非上場" && !hits[0].secCode) {
    return { reason: "delisted-in-list", detail: `リストでは非上場（EDINETコード ${hits[0].edinetCode}、証券コードなし）` };
  }
  if (hits.length > 1) {
    return { reason: "ambiguous-name", detail: `同名の行が ${hits.length} 件あり同定できない（${hits.map((h) => h.edinetCode).join("、")}）` };
  }
  if (hits.length === 1) {
    return { reason: "name-only-row", detail: `上場提出者としての行がない（同名行: ${hits[0].edinetCode}、提出者種別「${hits[0].kind}」）` };
  }
  return { reason: "not-in-list", detail: "証券コードでも名称でもリストに該当行がない" };
}

/**
 * The whole plan, as data. Pure.
 * @param {EntryIdentity[]} entries
 * @param {ReturnType<typeof parseCodeList>["rows"]} rows the raw code list rows
 * @returns {{ assignments: Assignment[], alreadyOk: string[], conflicts: Conflict[], nameWarnings: NameWarning[], unmatched: Unmatched[] }}
 */
export function planAssignments(entries, rows) {
  const byCode = new Map(toLedger(rows).map((r) => [r.code, r]));
  /** @type {Assignment[]} */ const assignments = [];
  /** @type {string[]} */ const alreadyOk = [];
  /** @type {Conflict[]} */ const conflicts = [];
  /** @type {NameWarning[]} */ const nameWarnings = [];
  /** @type {Unmatched[]} */ const unmatched = [];
  for (const entry of entries) {
    const row = byCode.get(entry.code);
    if (!row) {
      unmatched.push({ id: entry.id, code: entry.code, officialName: entry.officialName, tier: entry.tier, ...classifyUnmatched(entry, rows) });
      continue;
    }
    const desired = { edinetCode: row.edinetCode, corporateNumber: row.corporateNumber };
    let conflicted = false;
    for (const field of ["edinetCode", "corporateNumber"]) {
      const have = entry[/** @type {"edinetCode" | "corporateNumber"} */ (field)];
      const want = desired[/** @type {"edinetCode" | "corporateNumber"} */ (field)];
      if (have && have !== want) {
        conflicts.push({ id: entry.id, code: entry.code, field, entryValue: have, listValue: want });
        conflicted = true;
      }
    }
    if (conflicted) continue;
    if (entry.edinetCode === desired.edinetCode && (entry.corporateNumber ?? "") === desired.corporateNumber) {
      alreadyOk.push(entry.id);
      continue;
    }
    assignments.push({ id: entry.id, code: entry.code, edinetCode: desired.edinetCode, corporateNumber: desired.corporateNumber });
    const listName = normalizeName(row.name);
    if (listName !== normalizeName(entry.officialName) && listName !== normalizeName(entry.name)) {
      nameWarnings.push({ id: entry.id, code: entry.code, entryName: entry.officialName, listName: row.name });
    }
  }
  return { assignments, alreadyOk, conflicts, nameWarnings, unmatched };
}

const REASON_LABELS = {
  "delisted-in-list": "上場廃止（リストに非上場として残り、証券コードがない）",
  "ambiguous-name": "同名の行が複数あり同定できない",
  "name-only-row": "上場提出者としての行がリストにない",
  "not-in-list": "リストに該当行がない",
};

/**
 * @param {{ asOf: string | null, total: number, plan: ReturnType<typeof planAssignments>, wrote: boolean }} r
 */
export function renderReport(r) {
  const { plan } = r;
  const byReason = Object.groupBy(plan.unmatched, (u) => u.reason);
  const lines = [
    `# ID基盤の付与レポート（JCE-093、EDINETコードリスト ${r.asOf ?? "?"} 現在）`,
    "",
    `対象エントリー ${r.total} 社 ／ 付与${r.wrote ? "した" : "予定"} ${plan.assignments.length} 社 ／ 付与済みで一致 ${plan.alreadyOk.length} 社 ／ 競合 ${plan.conflicts.length} 社 ／ 突合できなかった ${plan.unmatched.length} 社`,
    "",
    "突合は証券コードで行い、値は金融庁の EDINET コードリストの行をそのまま写した。名称での突合や推測での補完はしていない。",
    "",
    "## 突合できなかった会社",
    "",
  ];
  for (const [reason, list] of Object.entries(byReason)) {
    lines.push(`### ${REASON_LABELS[/** @type {keyof typeof REASON_LABELS} */ (reason)] ?? reason}（${list?.length ?? 0}社）`, "");
    for (const u of list ?? []) lines.push(`- ${u.code} ${u.officialName}（${u.id}、${u.tier}） — ${u.detail}`);
    lines.push("");
  }
  if (plan.conflicts.length > 0) {
    lines.push("## 競合（エントリーの既存値とリストが違う。人は確認するまで書き換えない）", "");
    for (const c of plan.conflicts) lines.push(`- ${c.code} ${c.id}: ${c.field} エントリー ${c.entryValue} ／ リスト ${c.listValue}`);
    lines.push("");
  }
  if (plan.nameWarnings.length > 0) {
    lines.push("## 名称の表記がリストと違う会社（コードで突合し付与した。商号変更の反映漏れの可能性があるため人が確認する）", "");
    for (const w of plan.nameWarnings) lines.push(`- ${w.code} ${w.id}: エントリー「${w.entryName}」 ／ リスト「${w.listName}」`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

// -------------------------------------------------------------------------------------- the CLI

/** Insert the identity fields immediately after `code`, in the file's canonical key order. */
function withIdentity(/** @type {Record<string, unknown>} */ entry, /** @type {Assignment} */ a) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(entry)) {
    if (k === "edinetCode" || k === "corporateNumber") continue;
    out[k] = v;
    if (k === "code") {
      out.edinetCode = a.edinetCode;
      if (a.corporateNumber) out.corporateNumber = a.corporateNumber;
    }
  }
  return out;
}

if (process.argv[1]?.endsWith("assign-identity-codes.mjs")) {
  const args = process.argv.slice(2);
  const flag = (/** @type {string} */ n) => args.includes(`--${n}`);
  const value = (/** @type {string} */ n) => (args.indexOf(`--${n}`) !== -1 ? args[args.indexOf(`--${n}`) + 1] : undefined);
  const root = process.cwd();
  const fail = (/** @type {string} */ message) => {
    console.error(message);
    process.exit(1);
  };
  try {
    let file = value("file");
    const cached = join(cacheDir(), "codelist", "Edinetcode.zip");
    if (!file && flag("download")) {
      const response = await fetch(CODELIST_URL, { headers: { "user-agent": "japan-company-encyclopedia identity codes (once a day at most)" }, signal: AbortSignal.timeout(60_000) });
      if (!response.ok || /html/.test(response.headers.get("content-type") ?? "")) fail(`コードリストを取得できない（HTTP ${response.status}）`);
      mkdirSync(dirname(cached), { recursive: true });
      writeFileSync(`${cached}.tmp`, Buffer.from(await response.arrayBuffer()));
      renameSync(`${cached}.tmp`, cached);
      file = cached;
      console.log(`ダウンロードした: ${cached}`);
    }
    file ??= existsSync(cached) ? cached : undefined;
    if (!file) fail("コードリストがない。--file で Edinetcode.zip を渡すか、--download を使う");

    const parsed = parseCodeList(readCodeListFile(file));
    const problems = ledgerProblems(parsed, toLedger(parsed.rows), null);
    if (problems.length > 0) fail(`コードリストが信用できないため止める: ${problems.join(" ／ ")}`);

    const dir = join(root, "src/data/companies");
    /** @type {EntryIdentity[]} */
    const entries = readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const e = JSON.parse(readFileSync(join(dir, f), "utf8"));
        return { id: e.id, code: e.code, name: e.name, officialName: e.officialName, tier: e.status?.state ?? "published", edinetCode: e.edinetCode, corporateNumber: e.corporateNumber };
      });
    const plan = planAssignments(entries, parsed.rows);

    const write = flag("write");
    if (write) {
      for (const a of plan.assignments) {
        const path = join(dir, `${a.id}.json`);
        const entry = JSON.parse(readFileSync(path, "utf8"));
        const next = withIdentity(entry, a);
        assertMachineWrite(entry, next, "assign-identity-codes");
        writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
      }
    }
    const report = renderReport({ asOf: parsed.asOf, total: entries.length, plan, wrote: write });
    const reportPath = value("report");
    if (reportPath) {
      writeFileSync(join(root, reportPath), report);
      console.log(`レポート: ${reportPath}`);
    }
    console.log(
      `対象 ${entries.length} 社 ／ 付与${write ? "した" : "予定"} ${plan.assignments.length} 社 ／ 一致済み ${plan.alreadyOk.length} 社 ／ 競合 ${plan.conflicts.length} 社 ／ 未突合 ${plan.unmatched.length} 社 ／ 名称の表記差異 ${plan.nameWarnings.length} 社`,
    );
    if (!write) console.log("（--write なし: 1件も書いていない）");
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
