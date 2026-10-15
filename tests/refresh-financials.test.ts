import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { financialsBase, isNewer, newestFilings, planFinancialsRefresh, revisionChange } from "../scripts/pipeline/refresh-financials.mjs";

/**
 * The refresh adds a new fiscal year and never rewrites what is registered: a restated year, a changed
 * year end, an irregular period or a clashing source id each hold the entry instead of changing it.
 */

const row = (year: number, over: Record<string, unknown> = {}) => ({
  fiscalYear: `${year}年3月期`,
  periodEnd: `${year}-03-31`,
  revenue: year * 1_000_000,
  revenueLabel: "売上高",
  profit: year * 100_000,
  profitLabel: "経常利益",
  netIncome: year * 10_000,
  netIncomeLabel: "親会社株主に帰属する当期純利益",
  totalAssets: year * 2_000_000,
  totalAssetsLabel: "総資産",
  netAssets: year * 1_000_000,
  netAssetsLabel: "純資産",
  employees: 100,
  currency: "JPY",
  accountingStandard: "jgaap",
  sourceIds: [`yuho-${year}`],
  ...over,
});

const entry = (years: number[]) => ({
  officialName: "株式会社テスト",
  financials: years.map((y) => row(y, { note: `${y}の注記` })),
  sources: [{ id: `yuho-${years.at(-1)}`, title: "有報", publisher: "株式会社テスト", url: `https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/DOC${years.at(-1)}.pdf`, accessedAt: "2026-01-01" }],
});

const draft = (years: number[], over: Record<string, unknown> = {}) => {
  const latest = years.at(-1)!;
  return {
    officialName: "株式会社テスト",
    _有報: `有価証券報告書－第${latest}期 (docID DOC${latest})`,
    _docID: `DOC${latest}`,
    _提出日: `${latest}-06-26`,
    financials: years.map((y) => row(y, { sourceIds: [`yuho-${latest}`] })),
    ...over,
  };
};

const plan = (e: ReturnType<typeof entry>, d: ReturnType<typeof draft>, pack: object = {}) =>
  planFinancialsRefresh({ entry: e, draft: d, pack, today: "2027-07-01" });

describe("planFinancialsRefresh", () => {
  it("adds the new year, keeps registered rows untouched, and lets the oldest year leave the five-year window", () => {
    const result = plan(entry([2022, 2023, 2024, 2025, 2026]), draft([2023, 2024, 2025, 2026, 2027]));
    expect(result.kind).toBe("update");
    if (result.kind !== "update") return;
    expect(result.financials.map((r: { periodEnd: string }) => r.periodEnd)).toEqual(["2023-03-31", "2024-03-31", "2025-03-31", "2026-03-31", "2027-03-31"]);
    // kept rows are the registered ones, with their notes and their own source ids
    expect(result.financials[0]).toMatchObject({ note: "2023の注記", sourceIds: ["yuho-2023"] });
    // the new row comes from the new filing, with the new source
    expect(result.financials[4]).toMatchObject({ revenue: 2027 * 1_000_000, sourceIds: ["yuho-2027"] });
    expect(result.added.map((r: { fiscalYear: string }) => r.fiscalYear)).toEqual(["2027年3月期"]);
    expect(result.dropped.map((r: { fiscalYear: string }) => r.fiscalYear)).toEqual(["2022年3月期"]);
    expect(result.source).toMatchObject({ id: "yuho-2027", title: "有価証券報告書－第2027期", publisher: "株式会社テスト", publishedAt: "2027-06-26", accessedAt: "2027-07-01", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/DOC2027.pdf" });
  });

  it("does not drop anything when the entry has fewer than five years", () => {
    const result = plan(entry([2025, 2026]), draft([2023, 2024, 2025, 2026, 2027]));
    expect(result.kind).toBe("update");
    if (result.kind === "update") expect(result.dropped).toEqual([]);
  });

  it("holds when the new filing prints a different value for a year already registered", () => {
    const d = draft([2023, 2024, 2025, 2026, 2027]);
    d.financials[1] = row(2024, { revenue: 1, sourceIds: ["yuho-2027"] });
    const result = plan(entry([2022, 2023, 2024, 2025, 2026]), d);
    expect(result.kind).toBe("hold");
    if (result.kind === "hold") expect(result.reasons.join()).toContain("遡及修正");
  });

  it("holds on a fiscal-year-end change, an irregular period, mixed standards and an incomplete amendment", () => {
    const e = entry([2022, 2023, 2024, 2025, 2026]);
    const d = draft([2023, 2024, 2025, 2026, 2027]);
    expect(plan(e, d, { fiscalYearChange: { printed: ["3月", "12月"], assumed: ["3月", "3月"] } }).kind).toBe("hold");
    expect(plan(e, d, { irregularPeriods: [{ yearEnd: "2026-12-31", months: 9 }] }).kind).toBe("hold");
    expect(plan(e, d, { amendments: { status: "incomplete", blockedBy: "S1" } }).kind).toBe("hold");
    expect(plan(e, draft([2023, 2024, 2025, 2026, 2027], { _会計基準がそろわない項目: ["x"] })).kind).toBe("hold");
  });

  it("holds when the source id already names a different document", () => {
    const e = entry([2022, 2023, 2024, 2025, 2026]);
    e.sources.push({ id: "yuho-2027", title: "別の書類", publisher: "x", url: "https://example.test/other.pdf", accessedAt: "2027-01-01" });
    expect(plan(e, draft([2023, 2024, 2025, 2026, 2027])).kind).toBe("hold");
  });

  it("holds when a registered year inside the window is missing from the new filing", () => {
    const e = entry([2022, 2023, 2024, 2025, 2026]);
    const d = draft([2023, 2025, 2026, 2027]);
    expect(plan(e, d).kind).toBe("hold");
  });

  it("reports 'current' when the new filing has no year the entry lacks", () => {
    expect(plan(entry([2023, 2024, 2025, 2026, 2027]), draft([2023, 2024, 2025, 2026, 2027])).kind).toBe("current");
  });

  it("does not add the source twice when the entry already has it", () => {
    const e = entry([2022, 2023, 2024, 2025, 2026]);
    e.sources.push({ id: "yuho-2027", title: "有価証券報告書－第2027期", publisher: "x", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/DOC2027.pdf", accessedAt: "2027-01-01" });
    const result = plan(e, draft([2023, 2024, 2025, 2026, 2027]));
    expect(result.kind === "update" && result.source).toBeNull();
  });
});

describe("revisionChange", () => {
  it("lists the figures of the years that left and the years that arrived", () => {
    const { before, after } = revisionChange([row(2022)], [row(2027)]);
    expect(before.every((c: { fiscalYear: string }) => c.fiscalYear === "2022年3月期")).toBe(true);
    expect(after).toContainEqual({ fiscalYear: "2027年3月期", field: "revenue", value: 2027 * 1_000_000 });
    expect(after).toHaveLength(6);
  });
});

describe("which filing is newer", () => {
  const identity = { code: "1000", docID: "S1", submitted: "2026-06-26" };
  it("is newer only when filed later, under another docID", () => {
    expect(isNewer({ docID: "S2", submitted: "2027-06-26" }, identity)).toBe(true);
    expect(isNewer({ docID: "S1", submitted: "2026-06-26" }, identity)).toBe(false);
    expect(isNewer({ docID: "S9", submitted: "2026-06-26" }, identity)).toBe(false);
    expect(isNewer(undefined, identity)).toBe(false);
  });

  it("measures against the last refresh, not the filing the prose was written from", () => {
    const refreshed = { ...identity, financials: { docID: "S2", submitted: "2027-06-26", periodEnd: "2027-03-31" } };
    expect(financialsBase(refreshed).docID).toBe("S2");
    expect(isNewer({ docID: "S2", submitted: "2027-06-26" }, refreshed)).toBe(false);
    expect(isNewer({ docID: "S3", submitted: "2028-06-26" }, refreshed)).toBe(true);
  });
});

describe("newestFilings", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "index-"));
    await mkdir(dir, { recursive: true });
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });
  const day = (date: string, results: object[]) => writeFile(join(dir, `${date}.json`), JSON.stringify({ results }));
  const filing = (docID: string, secCode: string, submitDateTime: string, over: object = {}) => ({ docID, secCode, docTypeCode: "120", submitDateTime, periodEnd: "2026-03-31", filerName: "株式会社テスト", withdrawalStatus: "0", ...over });

  it("picks the latest 有報 per code in one pass and ignores other document types and other codes", async () => {
    await day("2026-06-26", [filing("A", "10000", "2026-06-26 09:00"), filing("X", "20000", "2026-06-26 09:00")]);
    await day("2027-06-25", [filing("B", "10000", "2027-06-25 15:00"), filing("C", "10000", "2027-06-25 16:00", { docTypeCode: "130" })]);
    const found = newestFilings(dir);
    expect(found.get("1000")).toMatchObject({ docID: "B", submitted: "2027-06-25" });
    expect(found.get("2000")?.docID).toBe("X");
  });

  it("does not count a withdrawn filing as the filing of record", async () => {
    await day("2026-06-26", [filing("A", "10000", "2026-06-26 09:00")]);
    await day("2027-06-25", [filing("B", "10000", "2027-06-25 15:00", { withdrawalStatus: "1" })]);
    expect(newestFilings(dir).get("1000")?.docID).toBe("A");
  });

  it("returns nothing for a directory that does not exist", () => {
    expect(newestFilings(join(dir, "missing")).size).toBe(0);
  });
});
