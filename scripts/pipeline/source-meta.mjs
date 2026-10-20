/**
 * Metadata a source carries besides its URL (docs/continuous-pipeline-design.md §4.2): which EDINET document it is, and
 * the point in time that document describes. Pure helpers, shared by the writers (finalize, refresh-financials,
 * apply-amendment) so every writer fills them the same way.
 */

/** The date in Japan of an instant (the pipeline's one clock for dates: filings are dated in JST). */
export const jstDate = (/** @type {string | number | Date} */ at) => new Date(new Date(at).getTime() + 9 * 3_600_000).toISOString().slice(0, 10);

/**
 * When the filing was read is a fact the system knows, so an agent never writes it: the source of the document the
 * evidence pack was built from gets the pack's own time (`summary.json` generatedAt) as a JST date, never later than
 * today (JST). Sources of other documents — the kept parts of an update, read earlier — keep theirs. Returns new objects.
 *
 * Why: agents wrote "today" from their own clock, a JST date, and the gate compared it with UTC's — between 0:00 and
 * 9:00 JST every source was "in the future" (japan-tobacco and nippon-yusen, 2026-10-19).
 * @param {any[]} sources
 * @param {string | null | undefined} docID the document the pack was built from
 * @param {string | null | undefined} fetchedAt ISO time the pack was built
 * @param {string} today JST date
 */
export function stampAccessedAt(sources, docID, fetchedAt, today) {
  if (!docID) return sources;
  const read = fetchedAt ? jstDate(fetchedAt) : today;
  const accessedAt = read > today ? today : read;
  return (sources ?? []).map((s) => (docIdOf(s.url) === docID ? { ...s, accessedAt } : s));
}

/** The EDINET document id in a source URL (…/S100YED6.pdf), or null. */
export const docIdOf = (/** @type {string | undefined} */ url) => /edinet-fsa\.go\.jp\/.*\/(S[0-9A-Z]{7})\.pdf/.exec(url ?? "")?.[1] ?? null;

/**
 * Every EDINET source names its document (`docId`, read from its URL) and, when it is the filing the entry is built on,
 * the point in time it describes (`asOf` = that filing's fiscal year end). Other hosts are left as they are, and so is
 * an `asOf` already set. Returns new objects.
 * @param {any[]} sources
 * @param {{ docID?: string, periodEnd?: string } | null | undefined} identity
 */
export function enrichSources(sources, identity) {
  return (sources ?? []).map((s) => {
    const docId = docIdOf(s.url);
    if (!docId) return s;
    const asOf = s.asOf ?? (identity?.docID === docId && identity?.periodEnd ? identity.periodEnd : undefined);
    return { ...s, docId, ...(asOf ? { asOf } : {}) };
  });
}
