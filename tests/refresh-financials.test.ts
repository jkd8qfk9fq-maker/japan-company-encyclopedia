import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildReport, exitCodeFor, filingStatus, latestPeriod, message, newestFilings, planFinancialsRefresh, rehearsalEntry, renderSummary, revisionChange, scanFrom } from "../scripts/pipeline/refresh-financials.mjs";

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

describe("which filing is newer — decided from the entry alone", () => {
  const e = entry([2022, 2023, 2024, 2025, 2026]);
  it("is newer only when the newest filing's fiscal year ends after the newest registered year", () => {
    expect(latestPeriod(e)).toBe("2026-03-31");
    expect(filingStatus({ periodEnd: "2027-03-31" }, e)).toBe("newer");
    expect(filingStatus({ periodEnd: "2026-03-31" }, e)).toBe("current");
    expect(filingStatus({ periodEnd: "2025-03-31" }, e)).toBe("current");
    expect(filingStatus(undefined, e)).toBe("current");
  });

  it("never skips a filing it cannot date: a missing fiscal year end is 'unknown', not 'current'", () => {
    expect(filingStatus({ periodEnd: "" }, e)).toBe("unknown");
  });

  it("starts scanning after the newest registered filing was submitted, or after its year end when that is not known", () => {
    const dated = entry([2025, 2026]);
    dated.sources[0] = { ...dated.sources[0], publishedAt: "2026-06-26" } as (typeof dated.sources)[number];
    expect(scanFrom(dated)).toBe("2026-06-26");
    expect(scanFrom(entry([2025, 2026]))).toBe("2026-03-31");
  });
});

describe("rehearsalEntry", () => {
  it("removes the newest year, and its source when nothing else cites it, so the rehearsal re-adds both", () => {
    const rehearsal = rehearsalEntry(entry([2022, 2023, 2024, 2025, 2026]));
    expect(rehearsal?.removed.fiscalYear).toBe("2026年3月期");
    expect(rehearsal?.entry.financials.map((r: { periodEnd: string }) => r.periodEnd).at(-1)).toBe("2025-03-31");
    expect(rehearsal?.entry.sources).toEqual([]);
  });

  it("keeps a source that other rows still cite", () => {
    const e = entry([2025, 2026]);
    e.financials[0] = { ...e.financials[0], sourceIds: ["yuho-2025", "yuho-2026"] } as (typeof e.financials)[number];
    expect(rehearsalEntry(e)?.entry.sources).toHaveLength(1);
  });

  it("does not change the entry it is given, and refuses an entry with no figures", () => {
    const e = entry([2025, 2026]);
    const before = JSON.stringify(e);
    rehearsalEntry(e);
    expect(JSON.stringify(e)).toBe(before);
    expect(rehearsalEntry({ ...e, financials: [] })).toBeNull();
  });

  it("round-trips: planning against the rehearsal entry re-adds exactly the removed year", () => {
    const full = entry([2022, 2023, 2024, 2025, 2026]);
    const rehearsal = rehearsalEntry(full)!;
    const d = draft([2022, 2023, 2024, 2025, 2026]);
    const result = plan(rehearsal.entry as typeof full, d);
    expect(result.kind).toBe("update");
    if (result.kind === "update") {
      expect(result.added.map((r: { fiscalYear: string }) => r.fiscalYear)).toEqual(["2026年3月期"]);
      expect(result.source?.id).toBe("yuho-2026");
    }
  });
});

describe("exit code and report", () => {
  const o = (result: string, over: object = {}) => ({ id: "a", result, detail: "", ...over }) as Parameters<typeof exitCodeFor>[0][number];
  it("is 0 for a quiet day, for candidates, and for held companies — a held company is a decision for a person", () => {
    expect(exitCodeFor([], null)).toBe(0);
    expect(exitCodeFor([o("would-update"), o("held"), o("current")], null)).toBe(0);
  });

  it("is 1 for a failed company, an undatable filing, or a fatal problem — never green on failure", () => {
    expect(exitCodeFor([o("would-update"), o("failed")], null)).toBe(1);
    expect(exitCodeFor([o("unknown")], null)).toBe(1);
    expect(exitCodeFor([], "EDINET の日次索引 3 日を確認できず")).toBe(1);
  });

  const scope = { companies: 258, from: "2026-06-26", to: "2027-07-01" };
  const candidate = o("would-update", { id: "acme", tier: "published", newFiling: { docID: "S1", submitted: "2027-06-26", periodEnd: "2027-03-31" }, added: [row(2027)], dropped: [row(2022)], source: { id: "yuho-2027", url: "u", title: "t", accessedAt: "x" } });

  it("reports counts, the added figures and the reasons, and leaves out functions", () => {
    const report = buildReport({ mode: "dry-run", today: "2027-07-01", scope, outcomes: [{ ...candidate, undo: () => {} }, o("held", { id: "b", reasons: ["遡及修正の可能性"] }), o("failed", { id: "c", detail: "証拠パックを作れない" })], fatal: null });
    expect(report.counts).toMatchObject({ companies: 258, withNewFiling: 3, wouldUpdate: 1, held: 1, failed: 1 });
    expect(report.exitCode).toBe(1);
    expect(report.outcomes[0]).toMatchObject({ id: "acme", added: [{ fiscalYear: "2027年3月期", revenue: 2027 * 1_000_000 }], dropped: ["2022年3月期"], source: { id: "yuho-2027" } });
    expect(JSON.stringify(report)).not.toContain("undo");
  });

  it("renders a summary a person can act on: candidates with figures, held reasons, failures", () => {
    const text = renderSummary(buildReport({ mode: "dry-run", today: "2027-07-01", scope, outcomes: [candidate, o("held", { id: "b", reasons: ["遡及修正の可能性"] }), o("failed", { id: "c", detail: "証拠パックを作れない" })], fatal: null }));
    expect(text).toContain("更新候補");
    expect(text).toContain("acme（published） | 2027年3月期 | 2,027百万円");
    expect(text).toContain("遡及修正の可能性");
    expect(text).toContain("証拠パックを作れない");
  });

  it("says plainly that there was nothing new, and says so loudly when the run failed", () => {
    expect(renderSummary(buildReport({ mode: "dry-run", today: "2027-07-01", scope, outcomes: [], fatal: null }))).toContain("新しい有価証券報告書はありません");
    expect(renderSummary(buildReport({ mode: "dry-run", today: "2027-07-01", scope, outcomes: [], fatal: "索引を確認できない" }))).toContain("**失敗: 索引を確認できない**");
  });
});

describe("message", () => {
  it("scrubs the EDINET API key from anything it prints", () => {
    process.env.EDINET_API_KEY = "secret-key-123";
    try {
      expect(message(new Error("GET https://api.edinet-fsa.go.jp/x?Subscription-Key=secret-key-123 failed"))).not.toContain("secret-key-123");
    } finally {
      delete process.env.EDINET_API_KEY;
    }
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
