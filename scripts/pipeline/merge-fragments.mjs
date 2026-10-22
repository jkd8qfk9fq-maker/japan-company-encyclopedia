/**
 * Assemble a company entry from the mechanical draft plus the agents' fragments.
 *
 *   node scripts/pipeline/merge-fragments.mjs <company-id> [--write]
 *
 * Inputs:
 *   <pack>/draft-entry.json              identity + the five-year financials (no AI)
 *   pipeline/results/<id>-<stage>.json   one file per agent stage, in the §18 shape
 *
 * Also exported as `mergeEntry(companyId)` for scripts/pipeline/finalize.mjs, so
 * the gate runs against the same object registration would write.
 *
 * Output: `src/data/companies/<id>.json` — only with `--write`, and never over an
 * existing file. Without it, the merged entry is printed and validated so a
 * missing or malformed fragment is visible before anything touches the repo.
 *
 * Each fragment is `{ companyId, agent, status, data, sources, warnings,
 * needsReview }`. Only `data` is merged, and only the keys that stage owns — a
 * stage cannot reach outside its own fields, so two agents can never quietly
 * overwrite each other. `sources` are unioned by id and the first definition of
 * an id wins, so a later stage citing the same filing does not restate it.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "../research/edinet.mjs";
import { fragmentFiles, loadState } from "./company-state.mjs";
import { dedupeGaps, normalizeGap, parseLegacyTaxonomyNote } from "./taxonomy-gaps.mjs";

/** Which top-level entry keys each agent stage is allowed to write. */
export const STAGE_FIELDS = {
  // This stage reads the cover page for the segment note anyway, so it also owns
  // the three identity fields that need judgement rather than transcription: the
  // common display name, the hero wordmark, and which market segment the filing
  // actually states (it often names only the exchange).
  businessStructure: ["businesses", "name", "shortNameEn", "listings"],
  // `financialNotes` is not an entry field: it is [{ fiscalYear, note }] applied to financials[].note
  // below, because the five-year table is mechanical and a stage cannot write into it directly.
  businessModel: ["businessModel", "description", "financialNotes", "perspectives"],
  history: ["history"],
  industry: ["industries"],
  relatedCompanies: ["relatedCompanies"],
  // Advisory only. A Company has no terms field: a term is linked inline as
  // [[term:id]] inside text another stage writes, and the term itself lives in
  // src/data/terms/. So this stage reports which existing terms a reader needs
  // and proposes new ones, and writes nothing into the entry.
  terms: [],
};


/**
 * Put researcher-written notes on the mechanical five-year table: `[{ fiscalYear, note }]` →
 * `financials[].note`. The year must be one the table has (a note about a year that is not there
 * is a mistake worth a person's look), and a year is noted once.
 * @param {any[]} financials
 * @param {unknown} notes
 * @param {string} stage
 * @param {string[]} warnings
 * @param {string[]} needsReview
 */
export function applyFinancialNotes(financials, notes, stage, warnings, needsReview) {
  if (!Array.isArray(notes)) {
    warnings.push(`${stage}: financialNotes が配列でない — 無視しました`);
    return;
  }
  for (const item of notes) {
    const note = typeof item?.note === "string" ? item.note.trim() : "";
    const row = financials.find((r) => r.fiscalYear === item?.fiscalYear);
    if (!row) {
      needsReview.push(`${stage}: financialNotes の年度「${item?.fiscalYear}」が5年表にありません`);
    } else if (!note) {
      warnings.push(`${stage}: financialNotes の ${item.fiscalYear} が空 — 無視しました`);
    } else if (row.note) {
      warnings.push(`${stage}: ${item.fiscalYear} の note は既にあります — 先のものを保持しました`);
    } else {
      row.note = note;
    }
  }
}

/**
 * Assemble the entry in memory. Exported so the finalize stages gate the very
 * object that would be registered, rather than re-deriving it and risking a
 * difference between what was checked and what gets written.
 */
export function mergeEntry(companyId) {
  const draftPath = join(cacheDir(), "evidence", companyId, "draft-entry.json");
  if (!existsSync(draftPath)) throw new Error(`${companyId}: draft-entry.json がありません（edinet 工程が未完了）`);
  const draft = JSON.parse(readFileSync(draftPath, "utf8"));

  const resultsDir = join(process.cwd(), "pipeline/results");
  const fragments = fragmentFiles(companyId, resultsDir).map((f) => ({ file: f, body: JSON.parse(readFileSync(join(resultsDir, f), "utf8")) }));

  const state = loadState(companyId);
  // The draft's underscore-prefixed keys are notes to the researcher, not entry data.
  const entry = {
    id: companyId,
    code: draft.code,
    name: null,
    officialName: draft.officialName,
    nameEn: draft.nameEn,
    shortNameEn: null,
    description: null,
    listings: [],
    industries: [],
    businesses: [],
    businessModel: null,
    financials: draft.financials,
    history: [],
    relatedCompanies: [],
    sources: [],
    status: { state: "published" },
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const sourcesById = new Map();
  const warnings = [];
  const needsReview = [];
  /** @type {import("./taxonomy-gaps.mjs").TaxonomyGap[]} */
  const taxonomyGaps = [];
  const seen = new Set();

  for (const { file, body } of fragments) {
    const stage = file.replace(`${companyId}-`, "").replace(/\.json$/, "");
    const allowed = STAGE_FIELDS[stage];
    if (!allowed) {
      warnings.push(`${file}: 未知の工程「${stage}」— 無視しました`);
      continue;
    }
    if (body.status !== "completed") {
      needsReview.push(`${stage}: status が ${body.status}`);
    }
    for (const key of Object.keys(body.data ?? {})) {
      if (!allowed.includes(key)) {
        warnings.push(
          allowed.length === 0
            ? `${stage}: 助言工程なのでエントリーには書き込みません（「${key}」は無視）`
            : `${stage}: この工程は「${key}」を書けません（担当は ${allowed.join(", ")}）— 無視しました`,
        );
        continue;
      }
      if (seen.has(key)) {
        warnings.push(`「${key}」が複数の工程から来ています — 先のものを保持しました`);
        continue;
      }
      // Researchers write the notes either beside the businessModel (data.financialNotes) or inside it
      // (data.businessModel.financialNotes); both mean the same, and inside is lifted out so the schema
      // never sees it.
      if (key === "businessModel" && Array.isArray(body.data.businessModel?.financialNotes)) {
        const { financialNotes, ...rest } = body.data.businessModel;
        applyFinancialNotes(entry.financials, financialNotes, stage, warnings, needsReview);
        entry[key] = rest;
        seen.add(key);
        continue;
      }
      if (key === "financialNotes") {
        applyFinancialNotes(entry.financials, body.data[key], stage, warnings, needsReview);
        seen.add(key);
        continue;
      }
      entry[key] = body.data[key];
      seen.add(key);
    }
    for (const s of body.sources ?? []) if (!sourcesById.has(s.id)) sourcesById.set(s.id, s);
    warnings.push(...(body.warnings ?? []).map((w) => `${stage}: ${w}`));
    // `needsReview` is "a person must look because something may be wrong" and is the only list
    // that sets the status. A vocabulary gap — in the old convention a needsReview string beginning
    // 「TAXONOMY:」 — is not that: nothing is wrong with the company, so it is a taxonomyGap and
    // changes no status (scripts/pipeline/taxonomy-gaps.mjs).
    for (const w of body.needsReview ?? []) {
      const legacy = parseLegacyTaxonomyNote(w, stage);
      if (legacy) taxonomyGaps.push(legacy);
      else needsReview.push(`${stage}: ${w}`);
    }
    for (const raw of body.taxonomyGaps ?? []) {
      const { gap, problem } = normalizeGap(raw, stage);
      if (gap) taxonomyGaps.push(gap);
      else warnings.push(`${stage}: taxonomyGaps の1件を読めませんでした（${problem}）— 無視しました`);
    }
  }

  // `shortNameEn` and `businessModel` are `z.optional()` in companySchema —
  // not `z.nullable()` like `description` — so the schema wants the KEY
  // absent when a stage legitimately has nothing to say (no English
  // wordmark; no business model worth modelling), not present as `null`.
  // Both start as `null` placeholders above so `entry[key] = body.data[key]`
  // has something to overwrite; if a stage's fragment never supplied the
  // key (a-and-d-holon-holdings' businessStructure correctly omitted
  // shortNameEn — no English name appears anywhere in its filing), the
  // placeholder survives as a literal `null` and fails validation with
  // "expected string, received null" (found 2026-10-01, the first company
  // in this pipeline's history with no English name). `description` is
  // deliberately left alone: it really is `.nullable()`, so `null` there is
  // the correct value for an unfinished figures-only entry, not a bug.
  for (const key of ["shortNameEn", "businessModel"]) {
    if (entry[key] === null) delete entry[key];
  }

  // A company whose fiscal year end changed inside the five-year window has year labels the pack
  // could not date correctly (evidence-pack.mjs detectFiscalYearChange). Whatever the agents
  // said, it is not published as if the table were right.
  const packPath = join(cacheDir(), "evidence", companyId, "summary.json");
  if (existsSync(packPath)) {
    const summary = JSON.parse(readFileSync(packPath, "utf8"));
    const change = summary.fiscalYearChange;
    if ((summary.irregularPeriods ?? []).length > 0) {
      needsReview.push(`財務: 変則決算。${summary.irregularPeriods.map((x) => `${x.yearEnd} の期は ${x.months} か月`).join("、")}。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと`);
    }
    if (change) {
      needsReview.push(`財務: 決算期の変更。有報は決算年月を ${change.printed.join("・")} と印字しているが、5年表はそれぞれ ${change.assumed.join("・")} の日付になっている。年度ラベルと期末日を直し、変則決算の期間の長さを businessModel の data.financialNotes に書くこと`);
    }
  }

  entry.sources = [...sourcesById.values()];
  if (needsReview.length > 0) entry.status = { state: "needs-attention", notes: needsReview };

  const missing = Object.keys(STAGE_FIELDS).filter((stage) => !fragments.some((f) => f.file === `${companyId}-${stage}.json`));

  return {
    entry,
    missing,
    warnings,
    needsReview,
    taxonomyGaps: dedupeGaps(taxonomyGaps),
    fragments: fragments.length,
    stageCount: Object.keys(STAGE_FIELDS).length,
    docID: state.identity?.docID ?? null,
  };
}

// CLI: print the assembled entry, and optionally write it. `--write` is the
// blunt path, kept for a single company assembled by hand; the pipeline uses
// scripts/pipeline/finalize.mjs, which gates the entry before registering it.
if (process.argv[1]?.endsWith("merge-fragments.mjs")) {
  const companyId = process.argv[2];
  const write = process.argv.includes("--write");
  if (!companyId) {
    console.error("usage: node scripts/pipeline/merge-fragments.mjs <company-id> [--write]");
    process.exit(1);
  }

  let merged;
  try {
    merged = mergeEntry(companyId);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.log(`${companyId}: fragments ${merged.fragments}/${merged.stageCount}`);
  if (merged.missing.length > 0) console.log(`  未着手の工程: ${merged.missing.join(", ")}`);
  for (const w of merged.warnings) console.log(`  警告: ${w}`);
  for (const n of merged.needsReview) console.log(`  要確認: ${n}`);
  for (const g of merged.taxonomyGaps) console.log(`  分類の不足（status には反映しない）: ${g.kind}: ${g.subject} → 提案 ${g.proposed || "(なし)"}`);
  console.log(`  財務: ${merged.entry.financials.length} 年分（機械的に取得・${merged.docID ?? "docID 不明"}）`);

  const target = join(process.cwd(), "src/data/companies", `${companyId}.json`);
  if (!write) {
    console.log("\n--write を付けると書き出します（既存ファイルは上書きしません）");
    process.exit(merged.missing.length > 0 ? 1 : 0);
  }
  if (existsSync(target)) {
    console.error(`${companyId}: 既存エントリーがあるため上書きしません`);
    process.exit(1);
  }
  if (merged.missing.length > 0) {
    console.error(`${companyId}: 工程が未完了のため書き出しません（${merged.missing.join(", ")}）`);
    process.exit(1);
  }
  writeFileSync(target, `${JSON.stringify(merged.entry, null, 2)}\n`);
  console.log(`\n書き出しました: ${target}`);
}
