/**
 * Taxonomy gaps: "the data is right, but the closed vocabulary cannot say it".
 *
 * Two different things used to travel in one list, `needsReview`, and became one status:
 *
 *   needsReview    a person must look, because something may be WRONG (a period that is not twelve
 *                  months, a listing that may have ended, a figure that disagrees with the filing).
 *   taxonomyGaps   nothing is wrong. The filing says the counterparty is this company's parent, and
 *                  RELATIONSHIP_KINDS had no `parent`; the company is a staffing firm and INDUSTRY_IDS
 *                  had no such industry. This is a request for a vocabulary decision, recorded so the
 *                  decision can be made once for every company that hits it — never a reason to
 *                  flag the company.
 *
 * A gap changes no status. It is carried in the research log (docs/research/<id>.md) and in
 * pipeline/taxonomy-gaps.tsv, which is what answers "which category is missing, and for whom".
 *
 * An agent writes them in its fragment next to `needsReview`:
 *
 *   "taxonomyGaps": [
 *     { "kind": "relationship", "subject": "ライトオン→W&D", "actual": "親会社（被所有52.0%）",
 *       "proposed": "parent", "reason": "…" },
 *     { "kind": "industry", "subject": "トライト", "actual": "it（暫定）", "proposed": "human-resources", "reason": "…" }
 *   ]
 *
 * Fragments written before this existed carried the same thing as a `needsReview` string beginning
 * 「TAXONOMY: relationship: …」 / 「TAXONOMY: industry: …」. Those are read as gaps too, so they stop
 * flagging companies without anyone rewriting them.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const GAP_KINDS = ["relationship", "industry"];

/**
 * @typedef {{ kind: "relationship" | "industry", subject: string, actual: string, proposed: string, reason: string, stage?: string }} TaxonomyGap
 */

const text = (/** @type {unknown} */ v) => (typeof v === "string" ? v.trim() : "");

/**
 * A gap an agent wrote as an object. Returns the gap, or why it is unusable.
 * @param {any} raw
 * @param {string} [stage]
 * @returns {{ gap: TaxonomyGap | null, problem: string | null }}
 */
export function normalizeGap(raw, stage) {
  if (!raw || typeof raw !== "object") return { gap: null, problem: "オブジェクトではない" };
  if (!GAP_KINDS.includes(raw.kind)) return { gap: null, problem: `kind は ${GAP_KINDS.join(" / ")} のどちらか（受け取った値: ${String(raw.kind)}）` };
  const subject = text(raw.subject);
  const reason = text(raw.reason);
  if (!subject || !reason) return { gap: null, problem: "subject と reason は必須" };
  return { gap: { kind: raw.kind, subject, actual: text(raw.actual), proposed: text(raw.proposed), reason, ...(stage ? { stage } : {}) }, problem: null };
}

/**
 * A `needsReview` string written in the old convention, as a gap — or null if it is not one.
 *   TAXONOMY: relationship: A→B / 実際の関係=… / 理由: …
 *   TAXONOMY: industry: <company> / 暫定=… / 提案=… / 理由: …
 * The fields are read where the text has them and the whole string is kept as `reason`.
 * @param {string} line
 * @param {string} [stage]
 * @returns {TaxonomyGap | null}
 */
export function parseLegacyTaxonomyNote(line, stage) {
  const head = /^\s*TAXONOMY:\s*(relationship|industry)\s*:\s*/.exec(line);
  if (!head) return null;
  const kind = /** @type {"relationship" | "industry"} */ (head[1]);
  const parts = line.slice(head[0].length).split(/\s*[/／]\s*/);
  const value = (/** @type {RegExp} */ re) => parts.find((p) => re.test(p))?.replace(re, "").trim() ?? "";
  return {
    kind,
    subject: parts[0]?.trim() || "(不明)",
    actual: value(/^(?:実際の関係|暫定)\s*[=＝]\s*/),
    proposed: value(/^提案\s*[=＝]\s*/),
    reason: line.slice(head[0].length).trim(),
    ...(stage ? { stage } : {}),
  };
}

/** One of each: the same gap reported by two stages (or twice) is one request. */
export function dedupeGaps(/** @type {TaxonomyGap[]} */ gaps) {
  const seen = new Set();
  return gaps.filter((g) => {
    const key = [g.kind, g.subject, g.actual, g.proposed].join("\u0001");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const FILE = "pipeline/taxonomy-gaps.tsv";
const HEADER = "# 分類の不足（status には反映しない）\n# companyId\tkind\tsubject\tactual\tproposed\treason\n";
const cell = (/** @type {string} */ s) => String(s ?? "").replace(/[\t\r\n]+/g, " ").slice(0, 300);

/**
 * Make `pipeline/taxonomy-gaps.tsv` say exactly this company's current gaps: its earlier rows are
 * replaced, every other company's are untouched. Idempotent, so registering twice (or promoting a
 * figures-only entry) never duplicates a row.
 * @param {string} companyId
 * @param {TaxonomyGap[]} gaps
 * @param {string} [root]
 */
export function recordTaxonomyGaps(companyId, gaps, root = process.cwd()) {
  const path = join(root, FILE);
  const existing = existsSync(path)
    ? readFileSync(path, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#") && l.split("\t")[0] !== companyId)
    : [];
  if (existing.length === 0 && gaps.length === 0 && !existsSync(path)) return;
  mkdirSync(join(root, "pipeline"), { recursive: true });
  const rows = gaps.map((g) => [companyId, g.kind, cell(g.subject), cell(g.actual), cell(g.proposed), cell(g.reason)].join("\t"));
  writeFileSync(path, `${HEADER}${[...existing, ...rows].join("\n")}${existing.length + rows.length > 0 ? "\n" : ""}`);
}
