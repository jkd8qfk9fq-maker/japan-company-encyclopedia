import { Pool } from "pg";
import type { ReportRepository } from "./report-repository";
import { isReportStatus, REPORT_CATEGORIES, type ContentReport, type ReportCategory, type ReportInput, type ReportStatus } from "./report-types";

type Row = {
  id: string;
  company_id: string | null;
  industry_id: string | null;
  feature_id: string | null;
  category: string;
  message: string;
  page_path: string | null;
  status: string;
  created_at: Date;
};

/**
 * Postgres (any provider reachable by a DATABASE_URL — Neon's free plan is
 * the documented default). Schema: db/migrations/0001-content-reports.sql.
 *
 * Every query is parameterised; report text is untrusted input and never
 * reaches SQL as anything but a bound value.
 */
export class PostgresReportRepository implements ReportRepository {
  constructor(private readonly pool: Pool) {}

  private static toReport(row: Row): ContentReport {
    return {
      id: row.id,
      companyId: row.company_id ?? undefined,
      industryId: row.industry_id ?? undefined,
      featureId: row.feature_id ?? undefined,
      // The table's CHECK constraints make these safe; the guards keep the type honest.
      category: (REPORT_CATEGORIES.includes(row.category as ReportCategory) ? row.category : "other") as ReportCategory,
      message: row.message,
      pagePath: row.page_path ?? undefined,
      status: isReportStatus(row.status) ? row.status : "open",
      createdAt: row.created_at.toISOString(),
    };
  }

  async add(input: ReportInput, submitterHash: string): Promise<ContentReport> {
    const { rows } = await this.pool.query<Row>(
      `insert into content_reports (id, company_id, industry_id, feature_id, category, message, page_path, submitter_hash)
       values (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
       returning id, company_id, industry_id, feature_id, category, message, page_path, status, created_at`,
      [input.companyId ?? null, input.industryId ?? null, input.featureId ?? null, input.category, input.message, input.pagePath ?? null, submitterHash],
    );
    return PostgresReportRepository.toReport(rows[0]);
  }

  async countSince(submitterHash: string, since: Date): Promise<number> {
    const { rows } = await this.pool.query<{ n: string }>(
      "select count(*) as n from content_reports where submitter_hash = $1 and created_at >= $2",
      [submitterHash, since],
    );
    return Number(rows[0].n);
  }

  async list(options?: { statuses?: readonly ReportStatus[] }): Promise<ContentReport[]> {
    const { rows } = options?.statuses
      ? await this.pool.query<Row>(
          `select id, company_id, industry_id, feature_id, category, message, page_path, status, created_at
           from content_reports where status = any($1) order by created_at desc limit 500`,
          [options.statuses],
        )
      : await this.pool.query<Row>(
          `select id, company_id, industry_id, feature_id, category, message, page_path, status, created_at
           from content_reports order by created_at desc limit 500`,
        );
    return rows.map(PostgresReportRepository.toReport);
  }

  async count(options?: { statuses?: readonly ReportStatus[] }): Promise<number> {
    const { rows } = options?.statuses
      ? await this.pool.query<{ n: string }>("select count(*) as n from content_reports where status = any($1)", [options.statuses])
      : await this.pool.query<{ n: string }>("select count(*) as n from content_reports");
    return Number(rows[0].n);
  }

  async updateStatus(id: string, status: ReportStatus): Promise<boolean> {
    // A malformed id would make Postgres throw on the uuid cast; treat it as "not found".
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return false;
    const result = await this.pool.query("update content_reports set status = $1, updated_at = now() where id = $2", [status, id]);
    return (result.rowCount ?? 0) > 0;
  }
}
