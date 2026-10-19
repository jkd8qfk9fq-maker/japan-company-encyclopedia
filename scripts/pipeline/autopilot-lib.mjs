/**
 * The registration autopilot's logic, with every effect injected so it can be tested without a network, a model or
 * the real repository. The CLI (autopilot.mjs) supplies the real effects; tests supply fakes.
 *
 * What it automates is the SEQUENCE a person used to drive by hand for each company:
 *
 *   check the company can be taken → build the evidence (advance) → ask the model for group 1 → check it
 *   → ask for group 2 → check it → run the gate (advance) → write the review sheet → STOP.
 *
 * It stops there. Registering writes src/data, and a person confirms first (`approve`): that is the operator's
 * rule (CLAUDE.md invariants 5 and 9, JCE-016), and it is also the only place the sequence is not repeatable.
 * Everything before it can be re-run any number of times and never registers anything twice.
 *
 * Models are used for exactly two things — the prose of group 1 and group 2 — and for repairing the specific lines
 * a program found wrong. Figures, duplicates, state, retries, checks and the review sheet are programs.
 */
import { createHash } from "node:crypto";
import { visibleText } from "./prose-policy.mjs";

/** How many times each kind of step may be tried before the company is held for a person. */
export const LIMITS = { agent: 2, repair: 2, network: 3, advance: 3 };

/** Run-record statuses, in the order a company moves through them. */
export const STATUSES = ["queued", "running", "awaiting-ai", "paused", "held", "ready", "ready-with-flags", "registered", "discarded"];
/** Statuses that need nothing more from the autopilot. */
export const SETTLED = new Set(["held", "ready", "ready-with-flags", "registered", "discarded"]);

export const now = () => new Date().toISOString();

/** @param {string} id */
export const newRecord = (id, at = now()) => ({
  version: 1,
  id,
  status: "queued",
  step: "queued",
  attempts: { agent1: 0, agent2: 0, repair1: 0, repair2: 0, advance: 0, network: 0 },
  holds: /** @type {{ kind: string, reason: string }[]} */ ([]),
  errors: /** @type {{ at: string, step: string, kind: string, message: string }[]} */ ([]),
  cost: { usd: 0, calls: 0 },
  awaiting: /** @type {{ group: string, order: string } | null} */ (null),
  pause: /** @type {{ kind: string, hint: string | null, at: string } | null} */ (null),
  review: /** @type {{ hash: string, path: string, readiness: string, errors: number, reviews: number } | null} */ (null),
  approval: /** @type {{ at: string, hash: string } | null} */ (null),
  startedAt: at,
  updatedAt: at,
});

// ------------------------------------------------------------------------------------------------ the queue

/**
 * Resolve what a person typed into queue ids. A 4-character securities code or an id is accepted.
 * @param {string[]} tokens
 * @param {{ byId: Map<string, { id: string, code: string, tier: string }>, byCode: Map<string, { id: string, code: string, tier: string }> }} registry
 * @returns {{ add: string[], skipped: { token: string, reason: string }[] }}
 */
export function resolveCandidates(tokens, registry) {
  const add = [];
  const skipped = [];
  for (const token of tokens) {
    const entry = registry.byId.get(token) ?? registry.byCode.get(token.toUpperCase());
    if (!entry) skipped.push({ token, reason: "掲載済みのエントリーがありません（universe → intake → register-figures で数値のみ登録してから）" });
    else if (entry.tier !== "figures-only") skipped.push({ token, reason: `すでに ${entry.tier}（再調査は autopilot の対象外。本文の更新は別の作業）` });
    else if (!add.includes(entry.id)) add.push(entry.id);
  }
  return { add, skipped };
}

/**
 * @param {{ items: { id: string, addedAt: string, note?: string }[] }} queue
 * @param {string[]} ids
 */
export function enqueue(queue, ids, at = now(), note = "") {
  const have = new Set(queue.items.map((i) => i.id));
  const added = [];
  for (const id of ids) {
    if (have.has(id)) continue;
    queue.items.push({ id, addedAt: at, ...(note ? { note } : {}) });
    added.push(id);
  }
  return added;
}

// ------------------------------------------------------------------------------------------------ pre-checks

/**
 * Reasons a company must not be taken at all, from facts alone — before any model is called.
 * @param {{
 *   entry: { id: string, code: string, tier: string } | null,
 *   sameCode: string[],
 *   ledger: { listing: string } | null,
 *   registrationNote?: string | null,
 *   reservedBy?: string | null,
 *   self?: string,
 * }} facts
 * @returns {{ kind: string, reason: string }[]}
 */
export function precheck({ entry, sameCode, ledger, registrationNote = null, reservedBy = null, self = "autopilot" }) {
  const holds = [];
  if (!entry) return [{ kind: "no-entry", reason: "掲載済みのエントリーがない（数値のみの登録が先）" }];
  if (entry.tier !== "figures-only") holds.push({ kind: "not-figures-only", reason: `エントリーが ${entry.tier}（すでに解説がある。本文の更新は別の作業）` });
  if (sameCode.length > 0) holds.push({ kind: "duplicate-code", reason: `同じ証券コード ${entry.code} の別エントリーがある: ${sameCode.join(", ")}` });
  if (!ledger) holds.push({ kind: "not-in-ledger", reason: `証券コード ${entry.code} が EDINET コードリストにない（上場を確認できない）` });
  else if (ledger.listing !== "上場") holds.push({ kind: "not-listed", reason: `EDINET コードリストの上場区分が「${ledger.listing}」` });
  if (registrationNote) holds.push({ kind: "parked", reason: `登録が保留されている: ${registrationNote}` });
  if (reservedBy && !reservedBy.startsWith(self)) holds.push({ kind: "reserved", reason: `別の作業（${reservedBy}）が予約している` });
  return holds;
}

// ------------------------------------------------------------------------------------------------ reading advance.mjs

/**
 * advance.mjs always exits 0 and speaks in short lines; this turns them into a decision.
 * @param {string} stdout
 * @returns {{ kind: "need", group: "group1" | "group2" } | { kind: "ready" } | { kind: "registered" } | { kind: "done" } | { kind: "needs-review", reason: string } | { kind: "fail", stage: string, reason: string } | { kind: "unknown", reason: string }}
 */
export function parseAdvance(stdout) {
  const text = String(stdout ?? "");
  const fail = /^FAIL: ([A-Za-z]+): ([\s\S]*)$/m.exec(text);
  if (fail) return { kind: "fail", stage: fail[1], reason: fail[2].replace(/\s+/g, " ").slice(0, 400) };
  const need = /^need: (group1|group2)\s*$/m.exec(text);
  if (need) return { kind: "need", group: /** @type {"group1" | "group2"} */ (need[1]) };
  if (/^registered\s*$/m.test(text)) return { kind: "registered" };
  if (/^ready: finalize\s*$/m.test(text)) return { kind: "ready" };
  if (/^done\s*$/m.test(text)) return { kind: "done" };
  const review = /^needs-review(?:: ([\s\S]*))?$/m.exec(text);
  if (review) return { kind: "needs-review", reason: (review[1] ?? "工程が needs-review").replace(/\s+/g, " ").slice(0, 400) };
  return { kind: "unknown", reason: text.trim().replace(/\s+/g, " ").slice(0, 300) || "advance.mjs が何も出力しなかった" };
}

// ------------------------------------------------------------------------------------------------ prompts

/** The stage names a group writes, for the prompt. */
export const GROUPS = {
  group1: { stages: ["businessStructure", "history"], files: ["businessStructure", "history"], label: "グループ1（businessStructure, history）" },
  group2: { stages: ["businessModel", "industry", "relatedCompanies", "terms"], files: ["businessModel", "industry", "relatedCompanies", "terms"], label: "グループ2（businessModel, industry, relatedCompanies, terms[助言のみ]）" },
};

/**
 * The prompt for one agent group. Short on purpose: the rules are in docs/agent-brief.md and docs/pipeline.md, which
 * the agent reads itself — repeating them here would cost tokens on every call and drift from the source.
 * @param {{ id: string, name: string, code: string, group: "group1" | "group2", cache: string }} p
 */
export function agentPrompt({ id, name, code, group, cache }) {
  const g = GROUPS[group];
  const files = g.files.map((f) => `pipeline/results/${id}-${f}.json`).join(", ");
  return [
    `会社: ${name} (id: ${id}, 証券コード ${code})。${g.label}を担当してください。`,
    "最初に docs/agent-brief.md を読む（その中の指示どおり .claude/agents/data-research.md と docs/pipeline.md の「エージェントへの作業要領」も原文で読む）。",
    `証拠パック: ${cache}/evidence/${id}/ （brief.md から読む。EDINET の取り直し・web 検索はしない）。` +
      (group === "group2" ? " 関連企業は同じフォルダの related-candidates.json（有報に社名がある掲載済み企業。機械抽出）の中からだけ選ぶ。グループ1の成果物は文体・出典を揃えるために読んでよい。" : ""),
    `成果物: ${files}。`,
    `終わったら RESEARCH_CACHE=${cache} node scripts/pipeline/check-prose-figures.mjs ${id} --fragments と node scripts/pipeline/check-policy.mjs ${id} --fragments を実行し、不備が 0 になるまで直す。`,
    "git・pipeline/state・src/data は触らない。最後に、成果物のパスと needsReview / taxonomyGaps の要点だけを短く報告する。",
  ].join("\n");
}

/**
 * The prompt for repairing named lines. Only the violations are sent: the agent edits those spots and leaves the
 * rest, which is both cheaper and safer than asking for a rewrite.
 * @param {{ id: string, group: "group1" | "group2", violations: string[], cache: string }} p
 */
export function repairPrompt({ id, group, violations, cache }) {
  const g = GROUPS[group];
  return [
    `会社 id: ${id}。${g.label}の成果物（pipeline/results/${id}-*.json）に、機械の検査が見つけた不備があります。次の箇所だけを直してください。それ以外は変えない。新しい事実を足さない。`,
    ...violations.slice(0, 30).map((v) => `- ${v}`),
    "規則は docs/agent-brief.md に書いてある。直したら RESEARCH_CACHE=" + cache + ` node scripts/pipeline/check-prose-figures.mjs ${id} --fragments と node scripts/pipeline/check-policy.mjs ${id} --fragments を実行して不備が 0 になったことを確認し、直した箇所を短く報告する。`,
  ].join("\n");
}

/** One line per violation, for a repair prompt and for the record. @param {import("./prose-policy.mjs").Finding[]} findings */
export const violationLines = (findings) => findings.map((f) => `${f.path}: ${f.message}${f.excerpt ? `（…${f.excerpt}…）` : ""}`);

/** Which entry fields a group owns — so the check after group 1 does not complain about group 2's empty fields. */
const OWNED = { group1: /^(businesses|history|name|shortNameEn|listings)/, group2: /^(description|businessModel|industries|relatedCompanies|financials)/ };
/** @param {import("./prose-policy.mjs").Finding[]} findings @param {"group1" | "group2"} group */
export const findingsForGroup = (findings, group) => findings.filter((f) => OWNED[group].test(f.path));

// ------------------------------------------------------------------------------------------------ the review sheet

export const hashOf = (/** @type {string} */ text) => createHash("sha256").update(text).digest("hex").slice(0, 16);

const isEdinet = (/** @type {string} */ url) => /(^|\.)edinet-fsa\.go\.jp$/.test(String(url).replace(/^https:\/\//, "").split("/")[0]);

/**
 * What the person confirming a registration needs on one page: the one-sentence explanation, every source and where
 * it is hosted, the investment-term and financial-wording check, each link with the evidence for it, the open
 * questions, the gate results. Pure: the staged entry, the findings and the fragments' notes go in.
 * @param {{
 *   entry: any,
 *   findings: import("./prose-policy.mjs").Finding[],
 *   notes: { warnings: string[], needsReview: string[], taxonomyGaps: any[] },
 *   gate: { sourceValidation: string, qualityControl: string },
 *   registry: Map<string, { id: string, code: string, name: string, tier: string }>,
 *   ledger: Map<string, { listing: string }>,
 *   record: { attempts: Record<string, number>, cost: { usd: number, calls: number } },
 *   hash: string,
 * }} p
 * @returns {{ markdown: string, readiness: "ready" | "ready-with-flags", errors: number, reviews: number }}
 */
export function buildReviewSheet({ entry, findings, notes, gate, registry, ledger, record, hash }) {
  const errors = findings.filter((f) => f.severity === "error");
  const reviews = findings.filter((f) => f.severity === "review");
  const infos = findings.filter((f) => f.severity === "info");
  const flagged = notes.needsReview.length > 0 || reviews.length > 0 || entry.status?.state === "needs-attention";
  const readiness = flagged ? "ready-with-flags" : "ready";
  const cell = (/** @type {unknown} */ s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const list = (/** @type {string[]} */ items) => (items.length === 0 ? "なし。" : items.map((i) => `- ${i}`).join("\n"));
  const byPath = (/** @type {string} */ p) => findings.filter((f) => f.path.startsWith(p));

  const linkRows = (entry.relatedCompanies ?? []).map((/** @type {any} */ l) => {
    const t = registry.get(l.companyId);
    const lg = t ? ledger.get(t.code) : null;
    const flags = byPath(`relatedCompanies[${(entry.relatedCompanies ?? []).indexOf(l)}]`).filter((f) => f.severity !== "info").map((f) => f.rule);
    return `| ${cell(t?.name ?? l.companyId)}（${cell(l.companyId)}） | ${cell(l.relationship)} | ${cell(lg ? lg.listing : "コードリストにない")} / ${cell(t?.tier ?? "?")} | ${cell((l.description ?? "").slice(0, 110))} | ${flags.length ? cell(flags.join(", ")) : "—"} |`;
  });

  const terms = errors.filter((f) => f.rule === "investment-term" || f.rule === "forbidden-financial-term" || f.rule === "forbidden-financial-amount");
  const markdown = `# ${entry.name}（${entry.id} / ${entry.code}）— 登録前の確認シート

- 判定: **${readiness === "ready" ? "公開候補（確認後に登録）" : "要確認つき（下の確認事項を見てから）"}** ／ 登録後の区分: ${entry.status?.state}
- 内容のハッシュ: \`${hash}\`（承認時に一致を確かめる。確認後に内容が変わると承認できない）
- 生成: ${now()} ／ 試行: ${Object.entries(record.attempts).filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join("、") || "なし"} ／ モデル呼び出し ${record.cost.calls} 回・概算 $${record.cost.usd.toFixed(2)}

## 1. 一文の説明（あなたが確認する）

> ${visibleText(entry.businessModel?.description ?? "")}

（一文の説明: ${visibleText(entry.description ?? "（なし）")}）

## 2. 一次資料の出典（あなたが確認する）

| id | 資料 | 掲載元 | 種別 |
|---|---|---|---|
${(entry.sources ?? []).map((/** @type {any} */ s) => `| ${cell(s.id)} | ${cell(s.title)} | ${cell(s.url)} | ${isEdinet(s.url) ? "EDINET" : "**EDINET 以外（一次資料か要確認）**"} |`).join("\n")}

## 3. 投資用語・財務の禁止語（あなたが確認する）

${terms.length === 0 ? "検出なし（投資指標の語、売上高・当期純利益以外の財務数値の語を機械が検査済み）。" : list(terms.map((f) => `${f.path}: ${f.message}`))}

## 4. 関連企業 ${linkRows.length} 社（同一性と関係性）

${linkRows.length === 0 ? "なし。" : `| 相手 | 種類 | 上場 / 掲載の状態 | 関係の説明 | 確認事項 |\n|---|---|---|---|---|\n${linkRows.join("\n")}`}

同一性は EDINET コードリスト（上場区分）と、有報の本文に社名があることを機械が確かめた。関係性の根拠は各行の説明（有報が述べる取引・提携・資本関係）。

## 5. 要確認と分類の不足

要確認（needsReview。空でなければ登録後の区分は要確認になる）:
${list(notes.needsReview)}

分類の不足（taxonomyGaps。区分は変わらない）:
${list(notes.taxonomyGaps.map((g) => `[${g.kind}] ${g.subject} → ${g.proposed || "なし"}。${g.reason}`))}

機械の検査が人の確認を求めたもの:
${list(reviews.map((f) => `[${f.rule}] ${f.path}: ${f.message}${f.excerpt ? `（…${f.excerpt}…）` : ""}`))}

## 6. 自動検査の結果

| 検査 | 結果 |
|---|---|
| 数値の照合・出典の検証（verify-financials / check-prose-figures / 出典の docID） | ${cell(gate.sourceValidation)} |
| スキーマ・整合性ルール | ${cell(gate.qualityControl)} |
| 文章のルール（一文・有報を主語にしない・財務語・関連企業の同一性） | 不備 ${errors.length} 件・確認 ${reviews.length} 件・注意 ${infos.length} 件 |

## 7. 登録するには

\`\`\`
node scripts/pipeline/autopilot.mjs approve ${entry.id} --confirm --hash ${hash}
\`\`\`

登録は \`src/data\` を書き換えるローカルの操作で、git には触れない。公開は、確認したうえでの commit（JCE-016）。
`;
  return { markdown, readiness, errors: errors.length, reviews: reviews.length + notes.needsReview.length };
}

// ------------------------------------------------------------------------------------------------ status

/**
 * The operator's list: what needs a person, in the order to look at it.
 * @param {{ id: string, status: string, step: string, holds: { kind: string, reason: string }[], pause: { kind: string, hint: string | null } | null, awaiting: { group: string } | null, review: { readiness: string, reviews: number } | null, attempts: Record<string, number>, cost: { usd: number } }[]} records
 */
export function operatorList(records) {
  const rank = { "ready-with-flags": 1, ready: 0, held: 2, paused: 3, "awaiting-ai": 4 };
  return records
    .filter((r) => r.status in rank)
    .sort((a, b) => rank[/** @type {keyof typeof rank} */ (a.status)] - rank[/** @type {keyof typeof rank} */ (b.status)] || a.id.localeCompare(b.id))
    .map((r) => {
      const next =
        r.status === "ready" ? "確認シートを読み、問題なければ approve"
        : r.status === "ready-with-flags" ? "確認シートの「確認事項」を読み、判断して approve（または discard）"
        : r.status === "held" ? "原因を直す、または discard。直したら retry"
        : r.status === "paused" ? `${r.pause?.hint ?? "上限が解けたら"} run を再開`
        : `AI の作業（${r.awaiting?.group ?? "?"}）が必要。注文書を実行してから run`;
      const why = r.status === "held" ? r.holds.map((h) => h.reason).join(" ／ ") : r.status === "paused" ? `${r.pause?.kind}` : r.status === "ready-with-flags" ? `確認 ${r.review?.reviews ?? 0} 件` : "";
      return { id: r.id, status: r.status, why, next };
    });
}

/** Counts per status, for the one-line summary. @param {{ status: string }[]} records */
export function tally(records) {
  /** @type {Record<string, number>} */
  const t = {};
  for (const r of records) t[r.status] = (t[r.status] ?? 0) + 1;
  return t;
}

// ------------------------------------------------------------------------------------------------ approval

/**
 * May this company be registered now? Pure: the facts in, the reasons it may not out (empty = go ahead).
 * The point of the hash is that what the person READ is what is registered: if anything changed after the sheet
 * was written — a retry, a repair, a new filing — the approval is refused and the sheet must be read again.
 * @param {{
 *   record: { status: string, review: { hash: string } | null } | null,
 *   confirmed: boolean,
 *   typedHash: string | null,
 *   stagedHash: string | null,
 *   policyErrors: number,
 *   entryTier: string | null,
 * }} f
 * @returns {string[]}
 */
export function approvalProblems({ record, confirmed, typedHash, stagedHash, policyErrors, entryTier }) {
  if (!record) return ["autopilot の記録がありません"];
  if (record.status === "registered") return ["すでに登録済みです（二重登録の防止）"];
  if (!["ready", "ready-with-flags"].includes(record.status)) return [`状態が ${record.status} なので承認できません（ready / ready-with-flags のみ）`];
  const out = [];
  if (!confirmed) out.push("確認シートの一文の説明・出典・投資用語を読んだうえで --confirm を付けること");
  if (stagedHash === null) out.push("pipeline/staging に組み立て済みのエントリーがない");
  else if (stagedHash !== record.review?.hash) out.push(`確認シートを作った後に内容が変わった（シート ${record.review?.hash}、現在 ${stagedHash}）。retry して新しいシートを読み直すこと`);
  if (typedHash !== stagedHash) out.push("--hash に確認シートの値を付けること（読んだ内容と登録する内容が同じであることの確認）");
  if (policyErrors > 0) out.push(`文章の規則の不備が ${policyErrors} 件ある`);
  if (entryTier !== "figures-only") out.push(`エントリーが ${entryTier ?? "ない"}。数値のみのエントリーだけが昇格できる（二重登録の防止）`);
  return out;
}
