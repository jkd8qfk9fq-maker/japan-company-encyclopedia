import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { checkConsistency } from "../scripts/pipeline/jobs.mjs";
import { describeEvents, scanPostFilingEvents } from "../scripts/pipeline/post-filing.mjs";

/**
 * Four pilot companies turned out, only at quality review, to have been renamed or taken over after
 * the 有報 they were built on. The scan reports candidate documents from the day indexes; it never
 * decides anything.
 */
describe("scanPostFilingEvents", () => {
  let cache: string;
  beforeEach(async () => {
    cache = await mkdtemp(join(tmpdir(), "post-filing-"));
    await mkdir(join(cache, "index"), { recursive: true });
  });
  afterEach(async () => {
    await rm(cache, { recursive: true, force: true });
  });

  const row = (over: Record<string, unknown>) => ({ docID: "D", edinetCode: "E1", secCode: "12340", filerName: "株式会社テスト", docTypeCode: "120", docDescription: "有価証券報告書", ...over });
  const day = (date: string, ...rows: unknown[]) => writeFile(join(cache, "index", `${date}.json`), JSON.stringify({ results: rows }));
  const company = { id: "test", code: "1234", submitted: "2026-06-26", filerName: "株式会社テスト" };
  const scan = (c = company) => scanPostFilingEvents([c], cache).get(c.id);

  it("finds a later filing under a different name, once per new name", async () => {
    await day("2026-06-26", row({ docID: "A" }));
    await day("2026-07-10", row({ docID: "B", docTypeCode: "180", docDescription: "臨時報告書", filerName: "新テスト株式会社" }));
    await day("2026-08-01", row({ docID: "C", docTypeCode: "135", docDescription: "確認書", filerName: "新テスト株式会社" }));
    expect(scan()).toEqual([expect.objectContaining({ kind: "name-change", docID: "B", from: "株式会社テスト", to: "新テスト株式会社" })]);
  });

  it("does not mistake full-width/half-width or spacing for a rename", async () => {
    await day("2026-06-26", row({ docID: "A" }));
    await day("2026-07-10", row({ docID: "B", filerName: "株式会社　テスト" }));
    expect(scan({ ...company, filerName: "株式会社テスト" })).toBeUndefined();
    await day("2026-07-11", row({ docID: "C", secCode: "56780", edinetCode: "E2", filerName: "ＡＢＣ株式会社" }));
    await day("2026-06-26", row({ docID: "A" }), row({ docID: "A2", secCode: "56780", edinetCode: "E2", filerName: "ABC株式会社" }));
    expect(scan({ id: "abc", code: "5678", submitted: "2026-06-26", filerName: "ABC株式会社" })).toBeUndefined();
  });

  it("ignores the filing it is built on, earlier days, and a shareholder's report", async () => {
    await day("2026-06-25", row({ docID: "OLD", filerName: "旧テスト株式会社" }));
    await day("2026-06-26", row({ docID: "A", filerName: "旧テスト株式会社" }));
    await day("2026-07-10", row({ docID: "H", docTypeCode: "350", filerName: "某ファンド", edinetCode: "E1" }));
    expect(scan()).toBeUndefined();
  });

  it("finds a tender offer whether the company filed it or is named as its subject", async () => {
    await day("2026-06-26", row({ docID: "A" }));
    await day("2026-07-10", row({ docID: "OPN", docTypeCode: "290", docDescription: "意見表明報告書" }));
    await day("2026-07-11", row({ docID: "TOB", docTypeCode: "240", docDescription: "公開買付届出書", edinetCode: "E999", secCode: "", filerName: "買収者合同会社", subjectEdinetCode: "E1" }));
    expect(scan()?.map((e) => e.docID)).toEqual(["OPN", "TOB"]);
    expect(describeEvents(scan() ?? [])).toContain("公開買付届出書（2026-07-11、TOB）");
  });

  it("leaves other companies' tender offers alone", async () => {
    await day("2026-06-26", row({ docID: "A" }));
    await day("2026-07-10", row({ docID: "X", docTypeCode: "240", edinetCode: "E999", secCode: "99990", subjectEdinetCode: "E777" }));
    expect(scan()).toBeUndefined();
  });

  it("notices a company whose last 有報 ended 14+ months ago with none after it", async () => {
    await day("2025-05-30", row({ docID: "A" }));
    const stale = { id: "old", code: "1234", submitted: "2025-05-30", filerName: "株式会社テスト", periodEnd: "2025-02-28" };
    expect(scanPostFilingEvents([stale], cache, "2026-10-09").get("old")).toEqual([expect.objectContaining({ kind: "stopped-filing", docID: "stopped-2025-02-28" })]);
    // not yet 14 months, or a later 有報 exists: nothing
    expect(scanPostFilingEvents([stale], cache, "2026-03-01").get("old")).toBeUndefined();
    await day("2026-05-29", row({ docID: "B" }));
    expect(scanPostFilingEvents([stale], cache, "2026-10-09").get("old")).toBeUndefined();
  });

  it("is empty with no index", () => {
    expect(scanPostFilingEvents([company], join(cache, "nowhere")).size).toBe(0);
  });
});

describe("queue check: post-filing-event", () => {
  const base = { states: [], universe: [], reservations: [] };
  const events = new Map([["a", "意見表明報告書（2026-07-10、OPN）"]]);
  it("is reported for a promoted entry, not for a figures-only one", () => {
    const entries = [{ id: "a", code: "1", tier: "published" }, { id: "b", code: "2", tier: "figures-only" }];
    const rules = (map: Map<string, string>) => checkConsistency({ ...base, entries, postFilingEvents: map }).filter((p) => p.rule === "post-filing-event").map((p) => p.id);
    expect(rules(events)).toEqual(["a"]);
    expect(rules(new Map([["b", "x"]]))).toEqual([]);
  });
});
