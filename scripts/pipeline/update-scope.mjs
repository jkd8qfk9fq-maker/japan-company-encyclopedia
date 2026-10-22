/**
 * Updating part of a registered explanation from a newer 有価証券報告書 (docs/continuous-pipeline-design.md §4.5):
 * which fields are rewritten, and which stay exactly as they are published. Pure helpers, shared by the steps that must
 * agree on it — start-update.mjs (sets it up), check-prose-figures and finalize (check only the rewritten part, keep the
 * rest byte for byte) and autopilot (counts only the rewritten part's findings, shows the person before and after).
 *
 * The scope lives in pipeline/state: `identity.retainedStages` lists the stages that were NOT rewritten and
 * `identity.retainedDocIDs` the older filings they still cite. A company without `retainedStages` is not being updated.
 */
import { STAGE_FIELDS } from "./merge-fragments.mjs";

/** The agent stages that put something on the page (terms is advice only). */
export const CONTENT_STAGES = Object.keys(STAGE_FIELDS).filter((s) => STAGE_FIELDS[/** @type {keyof typeof STAGE_FIELDS} */ (s)].length > 0);

const fieldsOf = (/** @type {string} */ stage) => (STAGE_FIELDS[/** @type {keyof typeof STAGE_FIELDS} */ (stage)] ?? []).filter((f) => f !== "financialNotes");

/**
 * @param {{ retainedStages?: string[] } | null | undefined} identity
 * @returns {{ kept: string[], rewritten: string[], fields: Set<string>, notes: boolean } | null}
 *   fields: the entry fields that may change; notes: whether the financial notes are rewritten (they belong to businessModel)
 */
export function updateScope(identity) {
  const kept = identity?.retainedStages;
  if (!Array.isArray(kept)) return null;
  const rewritten = CONTENT_STAGES.filter((s) => !kept.includes(s));
  return { kept, rewritten, fields: new Set(rewritten.flatMap(fieldsOf)), notes: rewritten.includes("businessModel") };
}

/** The top-level field a finding's path names: "businesses[0].description" → "businesses". */
export const fieldOf = (/** @type {string} */ path) => String(path).split(/[.[]/)[0];

/** Does this finding concern the part being rewritten? Everything does when nothing is being updated. */
export const inScope = (/** @type {string} */ path, /** @type {ReturnType<typeof updateScope>} */ scope) => !scope || scope.fields.has(fieldOf(path));

/** Every sourceId cited anywhere inside a value. */
export function sourceIdsIn(/** @type {unknown} */ value, out = new Set()) {
  if (Array.isArray(value)) for (const v of value) sourceIdsIn(v, out);
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "sourceIds" && Array.isArray(v)) for (const id of v) out.add(id);
      else sourceIdsIn(v, out);
    }
  }
  return out;
}

/**
 * The fragment a kept stage contributes: what is published, unchanged — not the fragment it was first written from,
 * which a correction made in the admin editor since would silently undo.
 * @param {any} entry the published entry
 * @param {string} stage
 * @param {string[]} retained the older filings it rests on
 */
export function fragmentFromEntry(entry, stage, retained) {
  const data = Object.fromEntries(fieldsOf(stage).filter((f) => entry[f] !== undefined).map((f) => [f, entry[f]]));
  const cited = sourceIdsIn(data);
  return {
    companyId: entry.id,
    agent: "published-entry",
    status: "completed",
    retained,
    data,
    sources: (entry.sources ?? []).filter((/** @type {any} */ s) => cited.has(s.id)),
    warnings: [],
    needsReview: [],
  };
}

/**
 * The entry to register for an update: the rewritten fields from the newly assembled entry, everything else as
 * published. Figures are the facts layer, kept current by refresh-financials — an explanation update never changes a
 * number; when businessModel was rewritten it may change the notes on them. Sources: what anything still cites.
 * Status: the published notes are kept (a person clears them), the new ones added.
 * @param {any} assembled the entry merged from the fragments
 * @param {any} existing the published entry
 * @param {NonNullable<ReturnType<typeof updateScope>>} scope
 */
export function retainPublished(assembled, existing, scope) {
  /** @type {any} */
  const out = { ...existing, id: assembled.id, updatedAt: assembled.updatedAt };
  for (const f of scope.fields) {
    if (assembled[f] === undefined) delete out[f];
    else out[f] = assembled[f];
  }
  out.financials = (existing.financials ?? []).map((/** @type {any} */ row) => {
    if (!scope.notes) return row;
    const { note, ...rest } = row;
    void note;
    const fresh = (assembled.financials ?? []).find((/** @type {any} */ r) => r.periodEnd === row.periodEnd);
    return fresh?.note ? { ...rest, note: fresh.note } : rest;
  });
  const cited = sourceIdsIn(out);
  /** @type {Map<string, any>} */
  const byId = new Map();
  for (const s of [...(assembled.sources ?? []), ...(existing.sources ?? [])]) {
    const known = byId.get(s.id);
    if (known && known.url !== s.url) throw new Error(`出典 id「${s.id}」が2つの文書を指しています（${known.url} と ${s.url}）`);
    if (!known) byId.set(s.id, s);
  }
  out.sources = [...byId.values()].filter((s) => cited.has(s.id));
  const notes = [...new Set([...(existing.status?.notes ?? []), ...(assembled.status?.notes ?? [])])];
  out.status = notes.length > 0 ? { state: "needs-attention", notes } : { state: "published" };
  return out;
}
