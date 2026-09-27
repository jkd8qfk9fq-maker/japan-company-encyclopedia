/**
 * Assemble a company entry from the mechanical draft plus the agents' fragments.
 *
 *   node scripts/pipeline/merge-fragments.mjs <company-id> [--write]
 *
 * Inputs:
 *   <pack>/draft-entry.json              identity + the five-year financials (no AI)
 *   pipeline/results/<id>-<stage>.json   one file per agent stage, in the §18 shape
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
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cacheDir } from "../research/edinet.mjs";
import { loadState } from "./company-state.mjs";

/** Which top-level entry keys each agent stage is allowed to write. */
const STAGE_FIELDS = {
  businessStructure: ["businesses"],
  businessModel: ["businessModel", "description"],
  history: ["history"],
  industry: ["industries"],
  relatedCompanies: ["relatedCompanies"],
  terms: ["termIds"],
};

const companyId = process.argv[2];
const write = process.argv.includes("--write");
if (!companyId) {
  console.error("usage: node scripts/pipeline/merge-fragments.mjs <company-id> [--write]");
  process.exit(1);
}

const draftPath = join(cacheDir(), "evidence", companyId, "draft-entry.json");
if (!existsSync(draftPath)) {
  console.error(`${companyId}: draft-entry.json がありません（edinet 工程が未完了）`);
  process.exit(1);
}
const draft = JSON.parse(readFileSync(draftPath, "utf8"));

const resultsDir = join(process.cwd(), "pipeline/results");
const fragments = existsSync(resultsDir)
  ? readdirSync(resultsDir)
      .filter((f) => f.startsWith(`${companyId}-`) && f.endsWith(".json"))
      .map((f) => ({ file: f, body: JSON.parse(readFileSync(join(resultsDir, f), "utf8")) }))
  : [];

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
      warnings.push(`${stage}: この工程は「${key}」を書けません（担当は ${allowed.join(", ")}）— 無視しました`);
      continue;
    }
    if (seen.has(key)) {
      warnings.push(`「${key}」が複数の工程から来ています — 先のものを保持しました`);
      continue;
    }
    entry[key] = body.data[key];
    seen.add(key);
  }
  // Identity-ish fields any stage may legitimately supply once.
  for (const key of ["name", "shortNameEn", "listings"]) {
    if (body.data?.[key] !== undefined && !seen.has(key)) {
      entry[key] = body.data[key];
      seen.add(key);
    }
  }
  for (const s of body.sources ?? []) if (!sourcesById.has(s.id)) sourcesById.set(s.id, s);
  warnings.push(...(body.warnings ?? []).map((w) => `${stage}: ${w}`));
  needsReview.push(...(body.needsReview ?? []).map((w) => `${stage}: ${w}`));
}

entry.sources = [...sourcesById.values()];
if (needsReview.length > 0) entry.status = { state: "needs-attention", notes: needsReview };

const missing = Object.entries(STAGE_FIELDS)
  .filter(([stage]) => !fragments.some((f) => f.file === `${companyId}-${stage}.json`))
  .map(([stage]) => stage);

console.log(`${companyId}: fragments ${fragments.length}/${Object.keys(STAGE_FIELDS).length}`);
if (missing.length > 0) console.log(`  未着手の工程: ${missing.join(", ")}`);
for (const w of warnings) console.log(`  警告: ${w}`);
for (const n of needsReview) console.log(`  要確認: ${n}`);
console.log(`  財務: ${entry.financials.length} 年分（機械的に取得・${state.identity?.docID ?? "docID 不明"}）`);

const target = join(process.cwd(), "src/data/companies", `${companyId}.json`);
if (!write) {
  console.log("\n--write を付けると書き出します（既存ファイルは上書きしません）");
  process.exit(missing.length > 0 ? 1 : 0);
}
if (existsSync(target)) {
  console.error(`${companyId}: 既存エントリーがあるため上書きしません`);
  process.exit(1);
}
if (missing.length > 0) {
  console.error(`${companyId}: 工程が未完了のため書き出しません（${missing.join(", ")}）`);
  process.exit(1);
}
writeFileSync(target, `${JSON.stringify(entry, null, 2)}\n`);
console.log(`\n書き出しました: ${target}`);
