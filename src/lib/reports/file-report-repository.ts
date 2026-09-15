import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { renameWithRetry } from "@/lib/fs/atomic-rename";
import type { ReportRepository } from "./report-repository";
import { isReportStatus, validateReportInput, type ContentReport, type ReportInput, type ReportStatus } from "./report-types";

type StoredReport = ContentReport & { submitterHash: string; updatedAt: string };

/**
 * A JSON file, for local development only (the selector never uses it in
 * production: a serverless host's filesystem is not persistent, and reports
 * written there would silently vanish).
 *
 * Writes are serialised through one promise chain and land via a temp-file
 * rename, so two reports submitted at once cannot clobber each other or leave
 * a half-written file.
 */
export class FileReportRepository implements ReportRepository {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly path: string) {}

  private async readAll(): Promise<StoredReport[]> {
    let text: string;
    try {
      text = await readFile(this.path, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error(`${this.path} is not a JSON array`);
    // Re-validate on read: the file is editable by hand.
    return parsed.flatMap((row): StoredReport[] => {
      const checked = validateReportInput(row ?? {});
      if (!checked.ok || typeof row.id !== "string" || typeof row.createdAt !== "string") return [];
      return [
        {
          ...checked.value,
          id: row.id,
          createdAt: row.createdAt,
          updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : row.createdAt,
          status: isReportStatus(row.status) ? row.status : "open",
          submitterHash: typeof row.submitterHash === "string" ? row.submitterHash : "",
          adminNote: typeof row.adminNote === "string" && row.adminNote !== "" ? row.adminNote : undefined,
        },
      ];
    });
  }

  private async writeAll(rows: StoredReport[]): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    const temp = `${this.path}.${randomUUID()}.tmp`;
    await writeFile(temp, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
    await renameWithRetry(temp, this.path);
  }

  private exclusive<T>(task: () => Promise<T>): Promise<T> {
    const run = this.queue.then(task, task);
    this.queue = run.catch(() => undefined);
    return run;
  }

  /** The sender key and bookkeeping fields never leave the repository. */
  private static toReport(row: StoredReport): ContentReport {
    return {
      id: row.id,
      companyId: row.companyId,
      industryId: row.industryId,
      featureId: row.featureId,
      category: row.category,
      message: row.message,
      pagePath: row.pagePath,
      createdAt: row.createdAt,
      status: row.status,
      adminNote: row.adminNote,
    };
  }

  add(input: ReportInput, submitterHash: string): Promise<ContentReport> {
    return this.exclusive(async () => {
      const rows = await this.readAll();
      const now = new Date().toISOString();
      const stored: StoredReport = { ...input, id: randomUUID(), createdAt: now, updatedAt: now, status: "open", submitterHash };
      await this.writeAll([stored, ...rows]);
      return FileReportRepository.toReport(stored);
    });
  }

  async countSince(submitterHash: string, since: Date): Promise<number> {
    const rows = await this.readAll();
    return rows.filter((r) => r.submitterHash === submitterHash && new Date(r.createdAt) >= since).length;
  }

  async list(options?: { statuses?: readonly ReportStatus[] }): Promise<ContentReport[]> {
    const rows = await this.readAll();
    return rows
      .filter((r) => !options?.statuses || options.statuses.includes(r.status))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(FileReportRepository.toReport);
  }

  async count(options?: { statuses?: readonly ReportStatus[] }): Promise<number> {
    return (await this.list(options)).length;
  }

  async get(id: string): Promise<ContentReport | null> {
    return (await this.list()).find((r) => r.id === id) ?? null;
  }

  updateNote(id: string, note: string): Promise<boolean> {
    return this.exclusive(async () => {
      const rows = await this.readAll();
      const index = rows.findIndex((r) => r.id === id);
      if (index < 0) return false;
      rows[index] = { ...rows[index], adminNote: note.trim() === "" ? undefined : note.trim(), updatedAt: new Date().toISOString() };
      await this.writeAll(rows);
      return true;
    });
  }

  updateStatus(id: string, status: ReportStatus): Promise<boolean> {
    return this.exclusive(async () => {
      const rows = await this.readAll();
      const index = rows.findIndex((r) => r.id === id);
      if (index < 0) return false;
      rows[index] = { ...rows[index], status, updatedAt: new Date().toISOString() };
      await this.writeAll(rows);
      return true;
    });
  }
}
