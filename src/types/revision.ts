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
  | { state: "needs-attention"; notes: string[] }
  /**
   * Identity, listings, the five-year figures and their sources — all extracted
   * mechanically from the filing and verified against its XBRL — with none of the
   * writing yet. There are ~3,900 listed companies and the explanation of each one
   * takes a researcher; this tier exists so that a reader who looks one up finds
   * verified numbers today instead of nothing, and so that the absence of the
   * explanation is stated on the page rather than implied by empty sections.
   *
   * It is a floor, not a destination: an entry moves to `published` when the
   * writing is done, and never the other way.
   */
  | { state: "figures-only" };

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
  /** Who approved the change, when, and what they read — for changes a person had to approve (an explanation). */
  approval?: Approval;
  /**
   * The id of an earlier revision whose RECORD this one corrects — e.g. an approval recorded as a person's that an AI
   * agent executed. `before`/`after` hold that record's fields as they were written and as they should read. The
   * earlier file is never edited: the history only grows.
   */
  corrects?: string;
};

/**
 * Who approved. Today every formal approval is the operator (YUGENQ); `kind` and `id` let individual approvers be
 * recorded later without changing this shape. `agent` is an AI that executed an approval on someone's authority: that
 * is recorded as what it is, never as a formal approval (a person did not read what was approved).
 */
export type Approver = {
  /** kebab-case, e.g. "yugenq". */
  id: string;
  /** As shown, e.g. "YUGENQ". */
  name: string;
  kind: "operator" | "person" | "agent";
};

export type Approval = {
  approver: Approver;
  /** ISO 8601. */
  approvedAt: string;
  /** The hash of the review sheet the approver read (the registration autopilot's `approve`). */
  reviewHash?: string;
  /** The top-level fields the approval covered. */
  fields?: string[];
  /** Only for an agent: the person whose authority it acted on. */
  onBehalfOf?: Approver;
  /** Only for an agent: what that authority was (an instruction, a standing permission) and what was not done. */
  basis?: string;
};
