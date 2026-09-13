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

export type RevisionKind = "ai-generated" | "correction" | "update";

/**
 * Every change to published content leaves a revision. Published information
 * stays editable after publication, and the history of edits stays visible.
 */
export type Revision = {
  /** YYYY-MM-DD */
  date: string;
  kind: RevisionKind;
  summary: string;
};
