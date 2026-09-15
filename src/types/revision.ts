/**
 * Publication state of an entry.
 *
 * `needs-attention` is set by whoever produced the entry when something could
 * not be verified. The entry is still published — the spec does not make human
 * approval a gate — but the flag is carried in the data and surfaced in admin,
 * so an unverified gap is never indistinguishable from a verified one.
 */
export type ContentStatus =
  | { state: "published" }
  | { state: "needs-attention"; notes: string[] };

export type RevisionTargetType = "company" | "industry" | "term" | "feature";

/**
 * One change to published content — the answer to "what changed, why, and
 * when". Stored as its own file in src/data/revisions/, never inside the entry
 * it describes, so an entry cannot quietly rewrite its own history and each
 * revision maps to one row if revisions ever move to a database.
 *
 * A revision is not a report. A report is a reader's claim that something is
 * wrong; a revision is a change actually made. A revision may cite a report in
 * `reason`, but neither depends on the other.
 */
export type Revision = {
  /** kebab-case, e.g. "2026-09-15-company-toyota-8f3a1c". Also the file name. */
  id: string;
  targetType: RevisionTargetType;
  targetId: string;
  /** ISO 8601. Date-only for revisions migrated from before the editor existed. */
  changedAt: string;
  /** Why the change was made: the evidence, or the report that prompted it. */
  reason?: string;
  /** What changed, in one line. */
  summary: string;
  /** The changed top-level fields as they were. Absent for a first version. */
  before?: unknown;
  /** The changed top-level fields as they became. */
  after?: unknown;
};
