import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { FileReportRepository } from "@/lib/reports/file-report-repository";
import { MAX_REPORT_LENGTH, validateReportInput } from "@/lib/reports/report-types";

/**
 * Reports are posted by anyone. validateReportInput is the single gate, so it
 * is tested with hostile input; the file repository is tested for the
 * behaviour the admin relies on.
 */

describe("validateReportInput", () => {
  const base = { category: "history", message: "創業年が違います" };

  it("accepts a normal report and trims the message", () => {
    const result = validateReportInput({ ...base, message: "  創業年が違います\r\n" });
    expect(result).toEqual({ ok: true, value: expect.objectContaining({ category: "history", message: "創業年が違います" }) });
  });

  it.each([
    [{ ...base, category: "<img onerror>" }, "category"],
    [{ ...base, category: undefined }, "category"],
    [{ ...base, message: "   " }, "message"],
    [{ ...base, message: 42 }, "message"],
    [{ ...base, message: "あ".repeat(MAX_REPORT_LENGTH + 1) }, "too-long"],
  ])("rejects %j as %s", (input, error) => {
    expect(validateReportInput(input)).toEqual({ ok: false, error });
  });

  it.each(["//example.com", "/\example.com", "https://example.com", "javascript:alert(1)", "/Companies/Toyota"])(
    "drops an off-site or malformed page path but keeps the report: %s",
    (pagePath) => {
      const result = validateReportInput({ ...base, pagePath });
      expect(result.ok && result.value.pagePath).toBeUndefined();
      expect(result.ok).toBe(true);
    },
  );

  it("drops a company id that is not a kebab-case slug", () => {
    const result = validateReportInput({ ...base, companyId: "../../etc/passwd" });
    expect(result.ok && result.value.companyId).toBeUndefined();
  });
});

describe("FileReportRepository", () => {
  let dir: string;
  let repo: FileReportRepository;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "reports-"));
    repo = new FileReportRepository(join(dir, "nested", "reports.json"));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("stores, lists newest first, and never returns the sender key", async () => {
    await repo.add({ category: "history", message: "一件目" }, "sender-a");
    await new Promise((r) => setTimeout(r, 5));
    await repo.add({ category: "other", message: "二件目" }, "sender-b");
    const list = await repo.list();
    expect(list.map((r) => r.message)).toEqual(["二件目", "一件目"]);
    expect(JSON.stringify(list)).not.toContain("sender-");
    expect(list[0].status).toBe("open");
  });

  it("does not lose reports submitted at the same moment", async () => {
    await Promise.all(Array.from({ length: 20 }, (_, i) => repo.add({ category: "other", message: `同時${i}` }, "s")));
    expect(await repo.count()).toBe(20);
  });

  it("counts a sender's recent reports for rate limiting", async () => {
    await repo.add({ category: "other", message: "a" }, "sender-a");
    await repo.add({ category: "other", message: "b" }, "sender-a");
    await repo.add({ category: "other", message: "c" }, "sender-b");
    expect(await repo.countSince("sender-a", new Date(Date.now() - 60_000))).toBe(2);
    expect(await repo.countSince("sender-a", new Date(Date.now() + 60_000))).toBe(0);
  });

  it("updates status and filters by it", async () => {
    const report = await repo.add({ category: "history", message: "x" }, "s");
    expect(await repo.updateStatus(report.id, "resolved")).toBe(true);
    expect(await repo.updateStatus("no-such-id", "resolved")).toBe(false);
    expect(await repo.count({ statuses: ["open", "investigating"] })).toBe(0);
    expect(await repo.count({ statuses: ["resolved"] })).toBe(1);
  });

  it("re-validates a hand-edited file and skips rows that fail", async () => {
    const path = join(dir, "hand.json");
    await writeFile(path, JSON.stringify([
      { id: "1", category: "history", message: "ok", createdAt: "2026-09-15T00:00:00.000Z", status: "open" },
      { id: "2", category: "not-a-category", message: "bad", createdAt: "2026-09-15T00:00:00.000Z" },
      { id: "3", category: "history", message: "", createdAt: "2026-09-15T00:00:00.000Z" },
    ]));
    const handRepo = new FileReportRepository(path);
    expect((await handRepo.list()).map((r) => r.id)).toEqual(["1"]);
    expect(JSON.parse(await readFile(path, "utf8"))).toHaveLength(3); // reading never rewrites
  });
});

describe("FileReportRepository notes", () => {
  it("stores, reads and clears a correction note", async () => {
    const dir = await mkdtemp(join(tmpdir(), "reports-note-"));
    try {
      const repo = new FileReportRepository(join(dir, "r.json"));
      const report = await repo.add({ category: "history", message: "x" }, "s");
      expect(await repo.updateNote(report.id, "  有報 p.4 で確認。誤りではない  ")).toBe(true);
      expect((await repo.get(report.id))?.adminNote).toBe("有報 p.4 で確認。誤りではない");
      expect(await repo.updateNote(report.id, "")).toBe(true);
      expect((await repo.get(report.id))?.adminNote).toBeUndefined();
      expect(await repo.updateNote("missing", "n")).toBe(false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
