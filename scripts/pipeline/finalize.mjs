/**
 * The pipeline's last three stages, all deterministic and all free of model tokens:
 * **sourceValidation**, **qualityControl** and **registration**.
 *
 *   node scripts/pipeline/finalize.mjs <company-id>              # gate only
 *   node scripts/pipeline/finalize.mjs <company-id> --register   # gate, then register
 *
 * The assembled entry is written to `pipeline/staging/<id>.json` and gated
 * THERE, not in src/data/companies. That ordering is the point: the spec puts
 * sourceValidation and qualityControl before registration, and an entry with a
 * wrong figure or a missing citation must never exist inside src/data even
 * briefly. Registration is the only step that writes into the repository, and it
 * reverts every file it touched if the suite then fails — so a failed
 * registration leaves the tree exactly as it found it, rather than a
 * half-registered company for the next run to trip over.
 *
 * No git operation happens here (§29). Registration writes files; committing
 * them is a human action.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { amendmentIdentity, correctionsCell, loadIndex } from "../research/amendments.mjs";
import { cacheDir, jstToday } from "../research/edinet.mjs";
import { join } from "node:path";
import { mergeEntry } from "./merge-fragments.mjs";
import { finishRegistration } from "./registration-tail.mjs";
import { policyFindings } from "./policy-context.mjs";
import { enrichSources, stampAccessedAt } from "./source-meta.mjs";
import { changedFields } from "./ownership.mjs";
import { inScope, retainPublished, updateScope } from "./update-scope.mjs";
import { loadState, saveState, setStage, syncAgentStages } from "./company-state.mjs";

const companyId = process.argv[2];
const register = process.argv.includes("--register");
const figuresOnly = process.argv.includes("--figures-only");
// Rewriting part of an explanation that is already registered, from a newer filing (diff-filings.mjs, autopilot update).
const update = process.argv.includes("--update");
// Stage and stop. register-figures.mjs batches the checks across many companies,
// so it wants the assembled file and not a per-company test run.
const stageOnly = process.argv.includes("--stage-only");
// Bulk registration (autopilot approve-ready): the whole-repository suite runs once, in content:publish, before anything
// is pushed — not once per company (2.5 minutes each). The entry's own schema and integrity checks still run here.
const skipRepoGate = process.argv.includes("--no-repo-gate");
if (!companyId) {
  console.error("usage: node scripts/pipeline/finalize.mjs <company-id> [--figures-only] [--register]");
  process.exit(1);
}

const root = process.cwd();
const entryPath = join(root, "src/data/companies", `${companyId}.json`);
const indexPath = join(root, "src/data/companies/index.ts");
const stagedRelative = `pipeline/staging/${companyId}.json`;
// One clock for every date this script writes or checks: the date in Japan. Filings are dated in JST; a UTC "today"
// made a JST date written in the morning look like the future.
const today = jstToday();

/**
 * Node is the only executable this script launches.
 *
 * Not npx: on Windows it is a .cmd shim, and Node 24 refuses to execFile a .cmd
 * without a shell (EINVAL) — silently, with an empty stdout, which is exactly how
 * this stage failed once, reporting nothing at all. `shell: true` works but hands
 * every argument to a shell unescaped. Both tools ship a plain JS entry point, so
 * run those with the Node already running this script.
 */
const VITEST = "node_modules/vitest/vitest.mjs";
const TSC = "node_modules/typescript/lib/tsc.js";
const run = (args, env = {}) =>
  execFileSync(process.execPath, args, { cwd: root, encoding: "utf8", env: { ...process.env, ...env } });

/** Every sourceId cited anywhere in the entry, so an uncited source becomes visible. */
function citedSourceIds(entry) {
  const ids = new Set();
  const add = (node) => (node?.sourceIds ?? []).forEach((id) => ids.add(id));
  const walk = (list) => (list ?? []).forEach((b) => (add(b), walk(b.children)));
  walk(entry.businesses);
  add(entry.businessModel);
  for (const list of [entry.financials, entry.history, entry.relatedCompanies]) (list ?? []).forEach(add);
  for (const p of Object.values(entry.perspectives ?? {})) {
    add(p?.disclosed);
    add(p?.analysis);
  }
  return ids;
}

/** 東京証券取引所プライム市場 → { exchange: "tse", market: "プライム" } */
const EXCHANGES = [
  ["東京", "tse"],
  ["名古屋", "nse"],
  ["福岡", "fse"],
  ["札幌", "sse"],
];
const MARKETS = ["プライム", "スタンダード", "グロース", "プレミア", "メイン", "ネクスト", "アンビシャス", "Q-Board", "セントレックス"];

function listingsFrom(text) {
  const normalized = (text ?? "").normalize("NFKC").replace(/\s+/g, "");
  const listings = [];
  for (const [jp, exchange] of EXCHANGES) {
    const at = normalized.indexOf(jp);
    if (at === -1) continue;
    // The segment, when the filing names one, is whatever market word follows this
    // exchange before the next exchange begins. A filing that names only the
    // exchange leaves `market` off, which is what Listing.market is optional for.
    const nextAt = EXCHANGES.map(([other]) => normalized.indexOf(other))
      .filter((i) => i > at)
      .sort((a, b) => a - b)[0];
    const slice = normalized.slice(at, nextAt === undefined ? normalized.length : nextAt);
    const market = MARKETS.find((m) => slice.includes(m));
    listings.push(market ? { exchange, market } : { exchange });
  }
  /*
    Some filings print only the segment — 「グロース市場」 with no exchange at all.
    プライム, スタンダード and グロース are Tokyo own segment names and no other
    exchange uses them, so the exchange follows from the segment rather than being
    assumed. Only those three, because they are the only unambiguous ones.
  */
  if (listings.length === 0) {
    const tokyoOnly = ["プライム", "スタンダード", "グロース"].find((m) => normalized.includes(m));
    if (tokyoOnly) listings.push({ exchange: "tse", market: tokyoOnly });
  }
  return listings;
}

/**
 * Point `identity.docID` at the document the pack was built from.
 *
 * sourceValidation requires every EDINET source URL to contain `identity.docID` — the
 * document the data was taken from. When a complete 訂正 supersedes the original the
 * pack is built from the 訂正 (and the agents cite what the pack names), so the identity
 * has to say so before that check runs. `originalDocID` keeps the universe row's id and
 * is never changed. A pack of a different original is not adopted: that is a mismatch
 * for sourceValidation to report, not something to paper over here.
 */
function syncIdentityToPack() {
  const summaryPath = join(cacheDir(), "evidence", companyId, "summary.json");
  if (!existsSync(summaryPath)) return;
  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  const state = loadState(companyId);
  const id = state.identity;
  if (!id || !summary.filing?.docID) return;
  const original = summary.filing.originalDocID ?? summary.filing.docID;
  if (original !== (id.originalDocID ?? id.docID)) return;
  id.originalDocID ??= original;
  id.docID = summary.filing.docID;
  id.amendments = amendmentIdentity(summary) ?? id.amendments;
  saveState(state);
}

/**
 * An entry with the figures and nothing written: the floor tier (§ContentStatus).
 *
 * Everything here is a transcription of the filing or of EDINET's own index. The
 * display name is the 商号 with its corporate form removed, which is the same
 * mechanical step a researcher takes; nothing infers what the company does,
 * because that is precisely the part nobody has done yet.
 */
function figuresOnlyEntry() {
  const draftPath = join(cacheDir(), "evidence", companyId, "draft-entry.json");
  if (!existsSync(draftPath)) throw new Error(`${companyId}: draft-entry.json がありません（edinet 工程が未完了）`);
  const draft = JSON.parse(readFileSync(draftPath, "utf8"));
  const state = loadState(companyId);
  const identity = state.identity ?? {};

  const listings = listingsFrom(draft["_上場金融商品取引所名"]);
  if (listings.length === 0) {
    throw new Error(`上場金融商品取引所名「${draft["_上場金融商品取引所名"] ?? ""}」から上場先を読み取れません`);
  }

  const sourceIds = [...new Set(draft.financials.flatMap((f) => f.sourceIds ?? []))];
  if (sourceIds.length !== 1) throw new Error(`draft の sourceIds が1つではありません（${sourceIds.join(", ")}）`);

  return {
    id: companyId,
    code: draft.code,
    name: (draft.officialName ?? "").replace(/株式会社/g, "").replace(/\s+/g, "").trim() || draft.officialName,
    officialName: draft.officialName,
    ...(draft.nameEn ? { nameEn: draft.nameEn } : {}),
    description: null,
    listings,
    industries: [],
    businesses: [],
    financials: draft.financials,
    history: [],
    relatedCompanies: [],
    sources: [
      {
        id: sourceIds[0],
        title: (identity.docID ? draft["_有報"]?.replace(/\s*\(docID [^)]+\)/, "") : draft["_有報"]) ?? "有価証券報告書",
        publisher: draft.officialName,
        // The document the draft was read from — a 訂正 when one is of record.
        url: `https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/${draft._docID ?? identity.docID}.pdf`,
        ...((draft._提出日 ?? identity.submitted) ? { publishedAt: draft._提出日 ?? identity.submitted } : {}),
        accessedAt: today,
      },
    ],
    status: { state: "figures-only" },
    updatedAt: today,
  };
}

/** The evidence pack's summary (which filing, and when it was built), or null. */
function readPackSummary() {
  const p = join(cacheDir(), "evidence", companyId, "summary.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
}

// ------------------------------------------------------------- assemble and stage
function stageEntry() {
  mkdirSync(join(root, "pipeline/staging"), { recursive: true });
  if (figuresOnly) {
    const entry = figuresOnlyEntry();
    entry.sources = enrichSources(entry.sources, loadState(companyId).identity);
    const pack = readPackSummary();
    entry.sources = stampAccessedAt(entry.sources, pack?.filing?.docID ?? loadState(companyId).identity?.docID, pack?.generatedAt, today);
    const path = join(root, stagedRelative);
    writeFileSync(path, `${JSON.stringify(entry, null, 2)}\n`);
    return { entry, missing: [], warnings: [], needsReview: [], fragments: 0, stageCount: 0, docID: loadState(companyId).identity?.docID ?? null, path };
  }
  // The agents left their fragments on disk without recording anything; do that
  // now, so the state file reflects the work before the gate runs on it.
  syncAgentStages(companyId);
  const merged = mergeEntry(companyId);
  if (merged.missing.length > 0) throw new Error(`工程が未完了です（${merged.missing.join(", ")}）`);
  const pack = readPackSummary();
  if (update) {
    // Only the rewritten fields come from the fragments; everything else is the published entry, byte for byte.
    const scope = updateScope(loadState(companyId).identity);
    if (!scope) throw new Error("--update ですが pipeline/state に更新の範囲（identity.retainedStages）がありません。start-update.mjs から始めること");
    if (!existsSync(entryPath)) throw new Error("--update ですが登録済みのエントリーがありません");
    merged.entry = retainPublished(merged.entry, JSON.parse(readFileSync(entryPath, "utf8")), scope);
  }
  merged.entry.sources = enrichSources(merged.entry.sources, loadState(companyId).identity);
  merged.entry.sources = stampAccessedAt(merged.entry.sources, pack?.filing?.docID ?? loadState(companyId).identity?.docID, pack?.generatedAt, today);
  // A Wikipedia page (JCE-030) was read by the agent during this run: the date it was read is today, set here too.
  merged.entry.sources = merged.entry.sources.map((s) => (/^https:\/\/ja\.wikipedia\.org\//.test(s.url) ? { ...s, accessedAt: today } : s));
  mkdirSync(join(root, "pipeline/staging"), { recursive: true });
  const path = join(root, stagedRelative);
  writeFileSync(path, `${JSON.stringify(merged.entry, null, 2)}\n`);
  return { ...merged, path };
}

// -------------------------------------------------------- stage: sourceValidation
/**
 * Are the entry's sources the document the figures actually came from?
 *
 * The docID check is the one that earns its keep. The figures are extracted
 * mechanically from one specific EDINET document; an agent citing a different or
 * invented document would produce an entry whose numbers are right and whose
 * provenance is wrong — the single failure the figure verifier cannot see,
 * because it compares the entry against the pack and never looks at the URL.
 */
/** Hosts the operator has cleared as sources besides EDINET: pipeline/source-allowlist.txt, one per line, # comments. */
function allowedHosts() {
  const path = join(root, "pipeline/source-allowlist.txt");
  if (!existsSync(path)) return new Set();
  return new Set(readFileSync(path, "utf8").split(/\r?\n/).map((l) => l.replace(/#.*/, "").trim()).filter(Boolean));
}

function sourceValidation(entry) {
  const state = loadState(companyId);
  const problems = [];
  const notes = [];
  const docID = state.identity?.docID;

  if ((entry.sources ?? []).length === 0) problems.push("出典が1つもありません");
  for (const s of entry.sources ?? []) {
    const where = `出典「${s.id}」`;
    if (!/^https:\/\//.test(s.url)) problems.push(`${where}: URL が https:// で始まりません`);
    if (!s.accessedAt) problems.push(`${where}: accessedAt がありません`);
    for (const [key, value] of [
      ["accessedAt", s.accessedAt],
      ["publishedAt", s.publishedAt],
    ]) {
      if (value && value > today) problems.push(`${where}: ${key} が未来の日付です（${value}）`);
    }
    const host = s.url.replace(/^https:\/\//, "").split("/")[0];
    if (!/(^|\.)edinet-fsa\.go\.jp$/.test(host)) {
      // A company's own IR page is a primary source in principle (invariant 3), but the sites' terms of use are
      // unconfirmed (docs/source-terms.md), so by the operator's decision of 2026-10-18 only EDINET is accepted
      // until a host is listed in pipeline/source-allowlist.txt (one host per line, after its terms were read).
      if (allowedHosts().has(host)) notes.push(`${where}: EDINET 以外のホスト（${host}）。許可リストにある。一次資料かどうかは人が確認すること`);
      else problems.push(`${where}: EDINET 以外のホスト（${host}）は、利用条件を確認して pipeline/source-allowlist.txt に載せるまで出典にできません`);
    } else if (docID && !s.url.includes(docID) && !(state.identity?.retainedDocIDs ?? []).some((/** @type {string} */ d) => s.url.includes(d))) {
      problems.push(`${where}: EDINET の URL に docID ${docID} が入っていません（数値を取り出した書類と別の書類を引用しています）`);
    }
  }

  const cited = citedSourceIds(entry);
  const known = new Set((entry.sources ?? []).map((s) => s.id));
  for (const id of cited) if (!known.has(id)) problems.push(`出典「${id}」が引用されていますが出典一覧にありません`);
  for (const id of known) if (!cited.has(id)) notes.push(`出典「${id}」はどこからも引用されていません`);

  // Identity must survive assembly: code and official name come from EDINET's own
  // index, and no agent is allowed to have changed them.
  if (state.identity) {
    if (entry.code !== state.identity.code) {
      problems.push(`証券コード ${entry.code} が identity 工程の ${state.identity.code} と違います`);
    }
    if (entry.officialName !== state.identity.filerName) {
      notes.push(`正式名称「${entry.officialName}」が EDINET の提出者名「${state.identity.filerName}」と違います`);
    }
  }

  let figureReport = "";
  try {
    figureReport = run(["scripts/research/verify-financials.mjs", companyId, "--entry", stagedRelative]);
  } catch (error) {
    figureReport = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    problems.push("数値の照合に失敗しました（verify-financials.mjs の出力を見ること）");
  }

  // The figures in the prose, which verify-financials cannot see: it checks the
  // financials rows against the XBRL tags, and most of the numbers a reader
  // actually reads are inside a sentence an agent wrote.
  try {
    figureReport += run(["scripts/pipeline/check-prose-figures.mjs", companyId, "--entry", stagedRelative]);
  } catch (error) {
    figureReport += `${error.stdout ?? ""}${error.stderr ?? ""}`;
    problems.push("本文中の金額に有報の裏付けがないものがあります（check-prose-figures.mjs の出力を見ること）");
  }

  // The writing rules (docs/agent-brief.md): a one-sentence description, the business as the subject, no financial
  // figures but revenue and net income, links that rest on an identity AND a relationship. A program, no model.
  // Errors stop the registration like any other gate; items for a person to look at are carried as notes.
  if (!figuresOnly) {
    // An update answers for what it rewrote. The published part is the correction workflow's (and the open question of
    // how the existing entries meet today's rules); its findings are recorded, not counted.
    const scope = update ? updateScope(state.identity) : null;
    try {
      let kept = 0;
      for (const f of policyFindings(entry)) {
        const line = `[${f.rule}] ${f.path}: ${f.message}${f.excerpt ? `（…${f.excerpt}…）` : ""}`;
        if (!inScope(f.path, scope)) {
          if (f.severity === "error") kept += 1;
          continue;
        }
        if (f.severity === "error") problems.push(`文章の規則: ${line}`);
        else if (f.severity === "review") notes.push(`確認: ${line}`);
      }
      if (kept > 0) notes.push(`公開中のまま残す部分（${scope?.kept.join("・")}）に、今の文章の規則で見た不備が ${kept} 件ある。今回は書き直していないので数えない（node scripts/pipeline/check-policy.mjs ${companyId} --entry src/data/companies/${companyId}.json で一覧）`);
    } catch (error) {
      problems.push(`文章の規則の検査を実行できませんでした: ${String(error.message).slice(0, 200)}`);
    }
  }
  return { problems, notes, figureReport };
}

// ---------------------------------------------------------- stage: qualityControl
/** Schema + the shared integrity rules, on the staged file, through the existing test. */
function qualityControl() {
  try {
    return { ok: true, output: run([VITEST, "run", "tests/validate-file.test.ts"], { CONTENT_FILE: stagedRelative }) };
  } catch (error) {
    const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    // An empty output means the runner itself did not start, not that the entry
    // is fine. Say which, rather than printing nothing and exiting 1.
    return { ok: false, output: output.trim() === "" ? `${VITEST} を起動できませんでした: ${error.message}` : output };
  }
}

// ------------------------------------------------------------ stage: registration
// A JavaScript identifier cannot start with a digit, and securities codes reach
// the id through the English name: 「4Cs HD」 gave the import name 4csHd, which is
// a parse error that took down a whole 148-company batch. The prefix is only
// about the local binding; the id, the file name and the URL are untouched.
const camel = (id) => {
  const name = id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return /^[0-9]/.test(name) ? `c${name}` : name;
};
const keyFor = (id) => (id.includes("-") ? `"${id}"` : id);

/**
 * Insert the import alphabetically and append the map entry, leaving every other
 * byte of index.ts untouched. The map is in registration order, not alphabetical:
 * `companies` is the reading order of the site, so a new company goes last.
 */
function addToIndex(source) {
  const lines = source.split("\n");
  const isImport = (l) => /^import \w+ from "\.\/[a-z0-9-]+\.json";$/.test(l);
  const fileOf = (l) => l.match(/"\.\/([a-z0-9-]+)\.json"/)[1];
  const importIdx = lines.findIndex((l) => isImport(l) && fileOf(l) > companyId);
  const lastImport = lines.reduce((acc, l, i) => (isImport(l) ? i : acc), -1);
  if (lastImport === -1) throw new Error("index.ts に import 行が見つかりません");
  lines.splice(importIdx === -1 ? lastImport + 1 : importIdx, 0, `import ${camel(companyId)} from "./${companyId}.json";`);

  const closeIdx = lines.findIndex((l) => l.startsWith("}).map("));
  if (closeIdx === -1) throw new Error("index.ts の末尾（}).map(…）が見つかりません");
  lines.splice(closeIdx, 0, `  ${keyFor(companyId)}: ${camel(companyId)},`);
  return lines.join("\n");
}

/**
 * The research log for a pipeline-built company.
 *
 * Deliberately not an imitation of the hand-written logs in docs/research/: it
 * records what the pipeline actually knows — which document, which stage did
 * what, and every warning each agent raised. Those warnings are the substantive
 * part, because they are where an agent says what the filing did not support.
 */
function researchLog(entry, validation, merged) {
  const state = loadState(companyId);
  const id = state.identity ?? {};
  const cell = (s) => String(s ?? "").replace(/\|/g, "\\|");
  const stageLines = Object.entries(state.stages)
    .map(([stage, s]) => `| ${stage} | ${s.status} | ${s.attempts ?? 0} | ${cell(s.note)} |`)
    .join("\n");
  const list = (items) => (items.length === 0 ? "なし。" : items.map((w) => `- ${w}`).join("\n"));

  return `# ${entry.name ?? entry.officialName} — research log

Registered: ${today}（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（\`scripts/research/evidence-pack.mjs\`）、
\`scripts/research/verify-financials.mjs\` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ${cell(id.filerName)} |
| 証券コード | ${cell(id.code)} |
| docID（データを取り出した文書） | \`${cell(id.docID)}\` |
| 原本 docID | \`${cell(id.originalDocID ?? id.docID)}\` |
| 提出日（原本） | ${cell(id.submitted)} |
| 決算期 | ${cell(id.periodEnd)} |
| 訂正報告書 | ${cell(correctionsCell(id, loadIndex()))} |

entry の \`sources\`: ${(entry.sources ?? []).map((s) => `\`${s.id}\` ${s.url}`).join(" / ") || "なし"}

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
${stageLines}

## 数値の照合（verify-financials.mjs）

\`\`\`
${validation.figureReport.trim()}
\`\`\`

## 出典の検証

${list(validation.notes)}

## エージェントの判断記録（fragment warnings）

${list(merged.warnings)}

## 要確認（status に反映）

${list(merged.needsReview)}

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は \`pipeline/taxonomy-gaps.tsv\`）。

${list((merged.taxonomyGaps ?? []).map((g) => `[${g.kind}] ${g.subject} → 提案: ${g.proposed || "なし"}。${g.reason}`))}
`;
}

/** The approval autopilot's `approve` hands over (JSON in REGISTRATION_APPROVAL), or null. Malformed is an error. */
function approvalFromEnv() {
  const raw = process.env.REGISTRATION_APPROVAL;
  if (!raw) return null;
  const a = JSON.parse(raw);
  if (!a?.approver?.id || !a?.approver?.name || !a?.approvedAt) throw new Error("REGISTRATION_APPROVAL が不完全です（approver.id・approver.name・approvedAt が要る）");
  return a;
}

function registration(entry, validation, merged) {
  const approval = approvalFromEnv();
  /*
    An existing entry is normally refused (§27). The one exception is the tier
    this pipeline built on purpose: a figures-only entry is a floor, not a
    destination, and replacing it with the researched one is the move it exists
    for. Nothing is lost — its figures came from the same draft, and the revision
    below records the promotion rather than presenting it as a first version.

    This became necessary rather than theoretical: a bulk figures-only run and a
    researcher were working at the same time, and the batch registered 富士電機
    while its five segments and ten history events were still being written.
  */
  const existing = existsSync(entryPath) ? JSON.parse(readFileSync(entryPath, "utf8")) : null;
  const upgrading = existing?.status?.state === "figures-only";
  // An update replaces part of a described entry; it must be approved by a person, and it is the only way to.
  const updating = update && Boolean(existing) && !upgrading;
  if (update && !updating) throw new Error("--update は解説つきの登録済みエントリーにだけ使えます");
  if (updating && !approval) throw new Error("解説の更新には承認が要ります（autopilot approve から実行する）");
  if (existing && !upgrading && !updating) throw new Error("既存エントリーがあるため上書きしません");
  if (upgrading && figuresOnly) throw new Error("既に数値のみで登録されています（解説を書いてから昇格させてください）");

  const logPath = join(root, "docs/research", `${companyId}.md`);
  const revisionBase = `${today}-company-${companyId}-${updating ? "updated" : upgrading ? "described" : "initial"}`;
  let revisionId = revisionBase;
  // Two updates on one day are two revisions; a first version or a promotion happens once.
  if (updating) for (let n = 2; existsSync(join(root, "src/data/revisions", `${revisionId}.json`)); n++) revisionId = `${revisionBase}-${n}`;
  const revisionPath = join(root, "src/data/revisions", `${revisionId}.json`);
  if (existsSync(revisionPath)) throw new Error(`改訂記録 ${revisionId}.json が既にあります`);
  if (existsSync(logPath) && !upgrading && !updating) throw new Error(`リサーチログ docs/research/${companyId}.md が既にあります`);
  const logBefore = existsSync(logPath) ? readFileSync(logPath, "utf8") : null;

  const indexBefore = readFileSync(indexPath, "utf8");
  const written = [];
  const revert = () => {
    for (const p of written) rmSync(p, { force: true });
    // An upgrade replaced a real file; putting it back is the revert, not deleting it.
    if (existing) writeFileSync(entryPath, `${JSON.stringify(existing, null, 2)}\n`);
    if (logBefore !== null) writeFileSync(logPath, logBefore);
    writeFileSync(indexPath, indexBefore);
  };

  try {
    writeFileSync(entryPath, `${JSON.stringify(entry, null, 2)}\n`);
    written.push(entryPath);

    const id = loadState(companyId).identity ?? {};
    const financialsChanged = upgrading && JSON.stringify(existing.financials) !== JSON.stringify(entry.financials);
    const changed = updating ? changedFields(existing, entry).filter((f) => f !== "updatedAt") : [];
    if (updating) {
      const scope = updateScope(id);
      const outside = changed.filter((f) => !scope?.fields.has(f) && !["sources", "status"].includes(f) && !(f === "financials" && scope?.notes));
      if (outside.length > 0) throw new Error(`更新の範囲の外が変わっています（${outside.join(", ")}）`);
    }
    const revision = updating
      ? {
          id: revisionId,
          targetType: "company",
          targetId: companyId,
          changedAt: today,
          reason: `新しい有価証券報告書（docID ${id.docID ?? "不明"}、提出 ${id.submitted ?? "不明"}）で変わった部分だけを書き直した。書き直さなかった部分は、前の有報（${(id.retainedDocIDs ?? []).join("、") || "不明"}）に基づくまま`,
          summary: `${entry.officialName} の解説を更新（${changed.join("、")}）`,
          before: Object.fromEntries(changed.map((f) => [f, existing[f] ?? null])),
          after: Object.fromEntries(changed.map((f) => [f, entry[f] ?? null])),
          approval,
        }
      : {
      id: revisionId,
      targetType: "company",
      targetId: companyId,
      changedAt: today,
      reason: upgrading
        ? financialsChanged
          ? "数値のみで掲載していたエントリーに解説を追加した。財務データも、現在の有効な有価証券報告書（訂正を含む）から取り直した値に変わった。変更点は前後の差分を見ること"
          : "数値のみで掲載していたエントリーに解説を追加した。財務データは変わっていない"
        : "初版。登録パイプラインが EDINET の一次資料から作成し、リサーチログに根拠を記録した",
      summary: `${entry.officialName} 有価証券報告書（docID ${id.docID ?? "不明"}、提出 ${id.submitted ?? "不明"}）に基づき登録パイプラインが${upgrading ? "解説を追加" : "作成"}`,
      // An explanation is published only with a person's approval (autopilot approve passes it in REGISTRATION_APPROVAL).
      ...(approval ? { approval } : {}),
    };
    writeFileSync(revisionPath, `${JSON.stringify(revision, null, 2)}\n`);
    written.push(revisionPath);

    // An update keeps the log of the first registration and adds what changed below it.
    writeFileSync(logPath, updating && logBefore !== null ? `${logBefore.trimEnd()}\n\n---\n\n## 更新 ${today}\n\n${researchLog(entry, validation, merged).replace(/^# .*\n/, "")}` : researchLog(entry, validation, merged));
    written.push(logPath);

    // Already listed when upgrading — the id and the file name do not change.
    if (!upgrading && !updating) writeFileSync(indexPath, addToIndex(indexBefore));

    // The gate. The whole-repository integrity suite is what catches anything
    // that only breaks in the presence of the other entries: a duplicate id, an
    // industry page that does not list the company back, a revision pointing at
    // nothing.
    if (!skipRepoGate) {
      run([VITEST, "run", "tests/data-integrity.test.ts"]);
      run([TSC, "--noEmit"]);
    }
  } catch (error) {
    revert();
    throw new Error(
      `登録を取り消しました（ファイルは元に戻しました）: ${String(error.message).slice(0, 200)}\n${String(error.stdout ?? "").slice(-3000)}`,
    );
  }
}

// --------------------------------------------------------------------------- main
let merged;
try {
  syncIdentityToPack();
  merged = stageEntry();
} catch (error) {
  setStage(companyId, "sourceValidation", "failed", String(error.message));
  console.error(`${companyId}: ${error.message}`);
  process.exit(1);
}
console.log(`${companyId}: ${stagedRelative} に組み立てました（${figuresOnly ? "数値のみ" : `fragments ${merged.fragments}/${merged.stageCount}`}）`);
if (stageOnly) process.exit(0);

setStage(companyId, "sourceValidation", "running");
const validation = sourceValidation(merged.entry);
for (const n of validation.notes) console.log(`  注意: ${n}`);
if (validation.problems.length > 0) {
  for (const p of validation.problems) console.error(`  不備: ${p}`);
  console.error(validation.figureReport);
  setStage(companyId, "sourceValidation", "failed", validation.problems.join(" / "));
  process.exit(1);
}
setStage(companyId, "sourceValidation", "completed", `出典 ${merged.entry.sources.length} 件・数値照合OK（注意 ${validation.notes.length} 件）`);
console.log("  sourceValidation: OK");

setStage(companyId, "qualityControl", "running");
const quality = qualityControl();
if (!quality.ok) {
  console.error(quality.output.slice(-4000));
  setStage(companyId, "qualityControl", "failed", "スキーマまたは整合性ルールに違反（validate-file の出力を見ること）");
  process.exit(1);
}
setStage(companyId, "qualityControl", "completed", "スキーマ・整合性ルールともOK");
console.log("  qualityControl: OK");

if (!register) {
  console.log(`\n--register を付けると登録します（src/data/companies/${companyId}.json、index.ts、改訂記録、リサーチログ）`);
  process.exit(0);
}

setStage(companyId, "registration", "running");
try {
  registration(merged.entry, validation, merged);
} catch (error) {
  setStage(companyId, "registration", "failed", String(error.message).slice(0, 300));
  console.error(error.message);
  process.exit(1);
}
// After the registration is safe, never inside it: a vocabulary gap must not be able to undo one.
// The bookkeeping lives in registration-tail.mjs so that recover-registration.mjs can finish exactly
// this, and only this, for a registration that was interrupted right before it.
finishRegistration({ companyId, entryState: merged.entry.status.state, taxonomyGaps: merged.taxonomyGaps ?? [], stagedPath: merged.path, root });
console.log("  registration: OK — 統合テストと型チェックを通過");
console.log(`\n登録しました: src/data/companies/${companyId}.json / docs/research/${companyId}.md / 改訂記録 / index.ts`);
console.log("コミットは人が行うこと（パイプラインは git を触りません）");
