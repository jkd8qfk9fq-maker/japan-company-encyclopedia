/**
 * Who may write which field of a company entry — the three layers of docs/continuous-pipeline-design.md §4.1.
 *
 *   facts   extracted from EDINET by a program and verified (identity, the five-year table). Automation may update
 *           them, but only when the checks pass; a person corrects them through the admin editor (with a Revision).
 *   detail  the explanation: written by a model as a draft, published only after a person approves it. Automation
 *           never writes these.
 *   meta    where the facts and the explanation come from, and their state: written alongside the other two.
 *
 * The layers are not separate files: splitting the entry would rebuild the schema, the repositories, the editor and the
 * release line. The separation is enforced instead — `assertMachineWrite` is called by every automated writer before
 * it writes, and tests/field-ownership.test.ts keeps this table complete against the schema.
 */

export const FIELD_LAYERS = /** @type {const} */ ({
  facts: ["code", "officialName", "nameEn", "listings", "financials"],
  detail: ["name", "shortNameEn", "description", "industries", "businesses", "businessModel", "history", "relatedCompanies", "perspectives"],
  meta: ["id", "sources", "status", "updatedAt"],
});

/** @param {string} field @returns {"facts" | "detail" | "meta" | null} */
export function layerOf(field) {
  for (const [layer, fields] of Object.entries(FIELD_LAYERS)) if (/** @type {readonly string[]} */ (fields).includes(field)) return /** @type {any} */ (layer);
  return null;
}

/** Top-level fields whose value differs between two versions of an entry (added and removed fields included). */
export function changedFields(/** @type {Record<string, unknown>} */ before, /** @type {Record<string, unknown>} */ after) {
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  return [...keys].filter((k) => JSON.stringify(before?.[k]) !== JSON.stringify(after?.[k])).sort();
}

/**
 * An automated writer (refresh-financials, apply-amendment, …) may change facts and meta only. Throws, naming the
 * fields, if it would change the explanation or a field nobody owns — the write must not happen.
 * @param {Record<string, unknown>} before
 * @param {Record<string, unknown>} after
 * @param {string} writer the script, for the message
 */
export function assertMachineWrite(before, after, writer) {
  const offending = changedFields(before, after).filter((f) => layerOf(f) !== "facts" && layerOf(f) !== "meta");
  if (offending.length > 0) {
    throw new Error(`${writer}: 自動の更新は事実データとメタデータだけを書ける。人の承認が要る項目（${offending.join(", ")}）を書こうとした`);
  }
}
