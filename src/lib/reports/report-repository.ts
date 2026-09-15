import type { ContentReport, ReportInput, ReportStatus } from "./report-types";

/**
 * Where reports are kept. SERVER ONLY — never import this from a Client
 * Component; the implementations hold a database connection.
 *
 * Like the content repositories, this is an interface so the storage can
 * change (file in development, Postgres in production) without the form or
 * the admin changing.
 */
export interface ReportRepository {
  /** `submitterHash` is an irreversible per-sender key used only for rate limiting. */
  add(input: ReportInput, submitterHash: string): Promise<ContentReport>;
  countSince(submitterHash: string, since: Date): Promise<number>;
  /** Newest first. */
  list(options?: { statuses?: readonly ReportStatus[] }): Promise<ContentReport[]>;
  count(options?: { statuses?: readonly ReportStatus[] }): Promise<number>;
  get(id: string): Promise<ContentReport | null>;
  /** Returns false when no report has that id. */
  updateStatus(id: string, status: ReportStatus): Promise<boolean>;
  /** Empty string clears the note. Returns false when no report has that id. */
  updateNote(id: string, note: string): Promise<boolean>;
}
