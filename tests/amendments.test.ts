import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addAmendments,
  amendmentIdentity,
  amendmentRows,
  amendmentsOf,
  chooseEffective,
  correctionsCell,
  diffFigures,
  diffTextBlocks,
  emptyIndex,
  ensureIndex,
  entryMismatches,
  extendFromCache,
  filingCompleteness,
  financialsDifferences,
  indexFile,
  loadIndex,
  windowCorrections,
} from "../scripts/research/amendments.mjs";
import { auditAction } from "../scripts/pipeline/amendment-audit.mjs";
import { packMatchesIdentity } from "../scripts/pipeline/advance.mjs";

/**
 * 訂正有価証券報告書 tracking: the reverse index, which filing is of record, and the
 * differences that decide whether anything may change. Everything here runs on
 * fixtures and a throwaway directory — no EDINET, and never the real pipeline/.
 */

const row = (docID: string, parentDocID: string, submitDateTime: string) => ({
  docID,
  parentDocID,
  submitDateTime,
  docDescription: `訂正有価証券報告書－${docID}`,
  edinetCode: "E00001",
  secCode: "12340",
});

describe("reverse index by parentDocID", () => {
  it("keeps only corrections that name a parent", () => {
    const rows = amendmentRows([
      { docID: "A", docTypeCode: "120", submitDateTime: "2026-01-01 09:00" },
      { docID: "B", docTypeCode: "130", parentDocID: "A", submitDateTime: "2026-02-01 09:00", docDescription: "訂正有価証券報告書" },
      { docID: "C", docTypeCode: "130", parentDocID: null, submitDateTime: "2026-02-02 09:00" },
    ]);
    expect(rows.map((r) => r.docID)).toEqual(["B"]);
  });

  it("lists a filing's corrections oldest first, once each", () => {
    const index = emptyIndex();
    addAmendments(index, [row("C2", "O", "2026-03-01 10:00"), row("C1", "O", "2026-02-01 10:00")]);
    const added = addAmendments(index, [row("C1", "O", "2026-02-01 10:00")]);
    expect(added).toEqual([]);
    expect(amendmentsOf(index, "O").map((a) => a.docID)).toEqual(["C1", "C2"]);
  });

  it("returns nothing for a filing with no corrections", () => {
    expect(amendmentsOf(emptyIndex(), "NOPE")).toEqual([]);
  });

  it("follows a correction that names another correction back to its original", () => {
    const index = emptyIndex();
    addAmendments(index, [row("C1", "O", "2026-02-01 10:00"), row("C2", "C1", "2026-03-01 10:00")]);
    expect(amendmentsOf(index, "O").map((a) => a.docID)).toEqual(["C1", "C2"]);
  });

  it("does not loop on a cycle", () => {
    const index = emptyIndex();
    addAmendments(index, [row("C1", "O", "2026-02-01 10:00"), row("O", "C1", "2026-03-01 10:00")]);
    expect(amendmentsOf(index, "O").map((a) => a.docID)).toEqual(["C1"]);
  });
});

describe("the filing of record", () => {
  const complete = () => ({ complete: true, missing: [] as string[] });

  it("is the original when nothing amends it", () => {
    const c = chooseEffective("O", []);
    expect(c).toMatchObject({ effectiveDocID: "O", effectiveIsAmendment: false, status: "none", amendmentDocIDs: [] });
  });

  it("is the LATEST correction when it is complete", () => {
    const c = chooseEffective("O", [{ docID: "C1" }, { docID: "C2" }], complete);
    expect(c).toMatchObject({ effectiveDocID: "C2", effectiveIsAmendment: true, status: "adopted", amendmentDocIDs: ["C1", "C2"] });
  });

  it("is NOT adopted when the latest correction lacks what the pack needs — and does not fall back to an earlier one", () => {
    const c = chooseEffective("O", [{ docID: "C1" }, { docID: "C2" }], (id) => (id === "C2" ? { complete: false, missing: ["沿革"] } : complete()));
    expect(c).toMatchObject({ effectiveDocID: "O", effectiveIsAmendment: false, status: "incomplete", blockedBy: "C2", missing: ["沿革"] });
  });
});

describe("completeness of a filing", () => {
  const block = (element: string, value = "text") => ({ "要素ID": `jpcrp_cor:${element}`, 値: value, 単位: "" });
  const table = { "要素ID": "jpcrp_cor:NetSalesSummaryOfBusinessResults", 値: "100", 単位: "円" };
  const full = [block("CompanyHistoryTextBlock"), block("DescriptionOfBusinessTextBlock"), block("CompanyNameCoverPage"), table];

  it("is incomplete with no XBRL at all", () => {
    expect(filingCompleteness([])).toEqual({ complete: false, missing: ["XBRL（CSV）"] });
  });

  it("is complete with every section the pack reads", () => {
    expect(filingCompleteness(full).complete).toBe(true);
  });

  it("names what is missing", () => {
    const r = filingCompleteness(full.filter((x) => !x["要素ID"].endsWith("CompanyHistoryTextBlock")));
    expect(r).toEqual({ complete: false, missing: ["沿革"] });
  });

  it("does not require a section the ORIGINAL never had", () => {
    const original = full.filter((x) => !x["要素ID"].endsWith("CompanyHistoryTextBlock"));
    expect(filingCompleteness(original, original).complete).toBe(true);
  });

  it("treats an empty text block as absent", () => {
    const r = filingCompleteness([block("CompanyHistoryTextBlock", "  "), ...full.slice(1)]);
    expect(r.missing).toEqual(["沿革"]);
  });
});

describe("figure differences", () => {
  const figures = (revenue: number, element = "NetSales") => ({
    revenue: [{ element, years: [{ fiscalYearEnd: "2024-12-31", yen: revenue }] }],
    profit: [],
    netIncome: [],
    totalAssets: [{ element: "TotalAssets", years: [{ fiscalYearEnd: "2024-12-31", value: 5 }] }],
    netAssets: [],
  });

  it("reports no change for the same numbers, even under another element name", () => {
    expect(diffFigures(figures(100), figures(100, "Revenue")).changed).toBe(false);
  });

  it("reports a moved number, per series and year", () => {
    const d = diffFigures(figures(6_057_288_000), figures(875_908_000));
    expect(d.changed).toBe(true);
    expect(d.differences).toEqual([{ kind: "revenue", fiscalYearEnd: "2024-12-31", before: [6_057_288_000], after: [875_908_000] }]);
    expect(d.latestYearChanged).toBe(true);
  });

  it("treats a year present on only one side as a difference", () => {
    const after = figures(100);
    after.revenue[0].years.push({ fiscalYearEnd: "2023-12-31", yen: 90 });
    expect(diffFigures(figures(100), after).differences.map((x) => x.fiscalYearEnd)).toEqual(["2023-12-31"]);
  });

  it("checks a registered entry against a filing", () => {
    const entry = { financials: [{ fiscalYear: "2024年12月期", periodEnd: "2024-12-31", revenue: 6_057_288_000, totalAssets: 5 }] };
    expect(entryMismatches(figures(6_057_288_000), entry)).toEqual([]);
    expect(entryMismatches(figures(875_908_000), entry)).toEqual([{ fiscalYear: "2024年12月期", field: "revenue", registered: 6_057_288_000, filing: [875_908_000] }]);
  });

  it("lists the differences between two financials arrays, including a missing year", () => {
    const a = [{ fiscalYear: "2023年12月期", periodEnd: "2023-12-31", revenue: 1 }, { fiscalYear: "2024年12月期", periodEnd: "2024-12-31", revenue: 2, netIncome: 3 }];
    const b = [{ fiscalYear: "2024年12月期", periodEnd: "2024-12-31", revenue: 2, netIncome: 4 }];
    expect(financialsDifferences(a, b)).toEqual([
      { fiscalYear: "2023年12月期", field: "(行)", registered: "あり", effective: "なし" },
      { fiscalYear: "2024年12月期", field: "netIncome", registered: 3, effective: 4 },
    ]);
  });
});

describe("text differences", () => {
  const block = (element: string, text: string) => ({ "要素ID": `jpcrp_cor:${element}`, 値: `<p>${text}</p>`, 単位: "" });
  const read = ["jpcrp_cor:CompanyHistoryTextBlock", "jpcrp_cor:OverviewOfAffiliatedEntitiesTextBlock"];

  it("is quiet when only a section nobody reads changed (4cs-hd: the 資本金の推移 table)", () => {
    const before = [block("CompanyHistoryTextBlock", "沿革"), block("ChangesInNumberOfIssuedSharesTextBlock", "旧")];
    const after = [block("CompanyHistoryTextBlock", "沿革"), block("ChangesInNumberOfIssuedSharesTextBlock", "新")];
    expect(diffTextBlocks(before, after, read)).toEqual({ changed: [], any: false });
  });

  it("names the section a published entry's prose rests on when it changes (yamaha-motor)", () => {
    const before = [block("OverviewOfAffiliatedEntitiesTextBlock", "北米 546,655")];
    const after = [block("OverviewOfAffiliatedEntitiesTextBlock", "北米 579,929")];
    expect(diffTextBlocks(before, after, read)).toEqual({ changed: ["OverviewOfAffiliatedEntitiesTextBlock"], any: true });
  });

  it("ignores whitespace and width differences", () => {
    expect(diffTextBlocks([block("CompanyHistoryTextBlock", "ＡＢＣ 1")], [block("CompanyHistoryTextBlock", "ABC1")], read).any).toBe(false);
  });

  it("sees a section that appears or disappears", () => {
    expect(diffTextBlocks([], [block("CompanyHistoryTextBlock", "x")], read).changed).toEqual(["CompanyHistoryTextBlock"]);
  });
});

describe("what the pipeline records", () => {
  it("never reports 「なし」 beside a correction that exists", () => {
    const index = emptyIndex();
    index.checkedThrough = "2026-09-30";
    addAmendments(index, [row("S100XGUB", "S100XCAO", "2026-01-21 10:00")]);
    // A bulk-built company's identity.corrections was a hardcoded [].
    const identity = { docID: "S100XCAO", corrections: [] as string[] };
    expect(correctionsCell(identity, index)).toBe("S100XGUB（2026-09-30 まで確認）");
    expect(correctionsCell({ docID: "OTHER", corrections: [] }, index)).toBe("なし（2026-09-30 まで確認）");
  });

  it("names the filing of record when it is a correction", () => {
    const index = emptyIndex();
    addAmendments(index, [row("C1", "O", "2026-02-01 10:00")]);
    expect(correctionsCell({ docID: "C1", originalDocID: "O" }, index)).toContain("有効文書 C1");
  });

  it("takes identity.corrections from what the window showed, as before", () => {
    expect(windowCorrections({ corrections: [{ docID: "X" }, { docID: "Y" }] })).toEqual(["X", "Y"]);
    expect(windowCorrections({})).toEqual([]);
  });

  it("records the tracked chain separately from that snapshot", () => {
    const summary = { amendments: { originalDocID: "O", effectiveDocID: "C1", amendmentDocIDs: ["C1"], status: "adopted", blockedBy: null, checkedThrough: "2026-09-30", records: [] } };
    expect(amendmentIdentity(summary)).toEqual({ originalDocID: "O", effectiveDocID: "C1", amendmentDocIDs: ["C1"], status: "adopted", blockedBy: null, checkedThrough: "2026-09-30" });
    expect(amendmentIdentity({})).toBeNull();
  });

  it("matches a pack to its company on the ORIGINAL's docID, whichever filing it was built from", () => {
    expect(packMatchesIdentity({ filing: { docID: "C1", originalDocID: "O" } }, { docID: "O" })).toBe(true);
    expect(packMatchesIdentity({ filing: { docID: "O" } }, { docID: "C1", originalDocID: "O" })).toBe(true);
    expect(packMatchesIdentity({ filing: { docID: "X", originalDocID: "X" } }, { docID: "O" })).toBe(false);
    expect(packMatchesIdentity({}, { docID: "O" })).toBe(false);
  });
});

describe("the standing check reads only the days since the last one", () => {
  let root: string;
  let indexDir: string;
  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "amendments-"));
    indexDir = join(root, "day-index");
    await mkdir(indexDir, { recursive: true });
    await mkdir(join(root, "pipeline"), { recursive: true });
  });
  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const day = (date: string, results: object[]) => writeFile(join(indexDir, `${date}.json`), JSON.stringify({ results }));
  const correction = (docID: string, parent: string) => ({ docID, parentDocID: parent, docTypeCode: "130", submitDateTime: "2025-01-10 09:00", docDescription: "訂正" });

  it("folds in cached days once, then only newer ones", async () => {
    await day("2025-01-06", [correction("C1", "O1")]);
    await day("2025-01-07", []);
    const index = emptyIndex();
    expect(extendFromCache(index, indexDir).map((r) => r.docID)).toEqual(["C1"]);
    expect(index.checkedThrough).toBe("2025-01-07");

    // Edit a day already folded in: it must NOT be read again.
    await day("2025-01-06", [correction("C1", "O1"), correction("LATE", "O1")]);
    await day("2025-01-08", [correction("C2", "O2")]);
    const added = extendFromCache(index, indexDir);
    expect(added.map((r) => r.docID)).toEqual(["C2"]);
    expect(index.checkedThrough).toBe("2025-01-08");
    expect(amendmentsOf(index, "O1").map((a) => a.docID)).toEqual(["C1"]);
  });

  it("leaves today alone — its index is still filling up", async () => {
    const today = new Date().toISOString().slice(0, 10);
    await day(today, [correction("C-TODAY", "O")]);
    const index = emptyIndex();
    expect(extendFromCache(index, indexDir)).toEqual([]);
    expect(index.checkedThrough).toBeNull();
  });

  it("persists the watermark so the next run starts after it", async () => {
    await day("2025-01-06", [correction("C1", "O1")]);
    const first = await ensureIndex({ root, indexDir });
    expect(first.added).toHaveLength(1);
    expect(JSON.parse(await readFile(indexFile(root), "utf8")).checkedThrough).toBe("2025-01-06");

    await day("2025-01-07", [correction("C2", "O1")]);
    const second = await ensureIndex({ root, indexDir });
    expect(second.added.map((r) => r.docID)).toEqual(["C2"]);
    expect(loadIndex(root).checkedThrough).toBe("2025-01-07");
    expect(amendmentsOf(loadIndex(root), "O1").map((a) => a.docID)).toEqual(["C1", "C2"]);
  });
});

describe("what to do about a company (a recommendation only)", () => {
  const facts = (over: Partial<{ tier: string; status: string; financialChanged: boolean; textChanged: boolean }>) => ({ tier: "published", status: "adopted", financialChanged: false, textChanged: false, ...over });

  it("does nothing for a company with no correction", () => {
    expect(auditAction(facts({ status: "none" }))).toBe("none");
  });

  it("only records a correction that changes nothing (4cs-hd)", () => {
    expect(auditAction(facts({}))).toBe("record-only");
  });

  it("updates the financials of a figures-only entry whose figures changed (alt)", () => {
    expect(auditAction(facts({ tier: "figures-only", financialChanged: true, textChanged: true }))).toBe("update-financials");
  });

  it("flags a published entry whose text changed while every total stayed (yamaha-motor)", () => {
    expect(auditAction(facts({ textChanged: true }))).toBe("needs-attention");
  });

  it("does both for a published entry whose figures AND text changed", () => {
    expect(auditAction(facts({ financialChanged: true, textChanged: true }))).toBe("update-financials+needs-attention");
  });

  it("uses the filing of record at registration for a company not yet registered (advance-create)", () => {
    expect(auditAction(facts({ tier: "no-entry", financialChanged: true }))).toBe("use-effective-at-registration");
  });

  it("flags an unusable latest correction instead of adopting it", () => {
    expect(auditAction(facts({ status: "incomplete" }))).toBe("needs-attention");
  });

  it("a figures-only entry has no prose, so a text change alone is only recorded", () => {
    expect(auditAction(facts({ tier: "figures-only", textChanged: true }))).toBe("record-only");
  });
});
