import { join } from "node:path";
import { Pool } from "pg";
import { FileReportRepository } from "./file-report-repository";
import { PostgresReportRepository } from "./postgres-report-repository";
import type { ReportRepository } from "./report-repository";

let cached: ReportRepository | null | undefined;

/**
 * SERVER ONLY. Chooses where reports live:
 *
 *   DATABASE_URL set        → Postgres
 *   development / test      → .data/content-reports.json (gitignored)
 *   production without a DB → null: the form says it could not send, and
 *                             nothing pretends a report was received
 *
 * Fail closed: a production site must never accept a report into a place the
 * editor will not see — that is the exact failure this module replaced.
 */
export function getReportRepository(): ReportRepository | null {
  if (cached !== undefined) return cached;
  if (process.env.DATABASE_URL) {
    cached = new PostgresReportRepository(
      new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000 }),
    );
  } else if (process.env.NODE_ENV !== "production") {
    cached = new FileReportRepository(join(process.cwd(), ".data", "content-reports.json"));
  } else {
    cached = null;
  }
  return cached;
}

export type { ReportRepository } from "./report-repository";
