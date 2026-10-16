import { describe, expect, it } from "vitest";
import { applyFinancialNotes } from "../scripts/pipeline/merge-fragments.mjs";
import { noteCandidates } from "../scripts/research/note-candidates.mjs";

const rows = (...standards: (string | null)[]) =>
  standards.map((accountingStandard, i) => ({ fiscalYear: `${2022 + i}年3月期`, periodEnd: `${2022 + i}-03-31`, accountingStandard }));

describe("noteCandidates: facts that may need a financials[].note", () => {
  it("says nothing for an ordinary company", () => {
    expect(noteCandidates({ restatementCheck: { revenue: { comparedRows: 4, differences: [] } }, irregularPeriods: [], fiscalYearChange: null, amendments: { records: [] } }, rows("jgaap", "jgaap", "jgaap"))).toEqual([]);
  });
  it("reports a change of accounting standard at the year it happens", () => {
    const out = noteCandidates({}, rows("jgaap", "jgaap", "ifrs"));
    expect(out).toHaveLength(1);
    expect(out[0]).toContain("2024年3月期: 会計基準が 日本基準（2023年3月期）から IFRS");
  });
  it("reports a prior-year figure that differs from the previous filing", () => {
    const out = noteCandidates({ restatementCheck: { netIncome: { comparedRows: 4, differences: [{ key: "x:NetIncome|2025-03-31", previousFiling: 100, latestFiling: 90 }] } } }, rows("jgaap"));
    expect(out[0]).toMatch(/^2025年3月期: 純利益が前期有報と違う（前期有報 100 → 今期有報 90）/);
  });
  it("reports irregular periods, a fiscal-year change, and a figure-changing 訂正", () => {
    const out = noteCandidates(
      { irregularPeriods: [{ yearEnd: "2025-03-31", months: 15 }], fiscalYearChange: { printed: ["2024年12月"], assumed: ["2024-03-31"] }, amendments: { effectiveDocID: "A", records: [{ docID: "A", classification: "financial-change", comparedToBase: { differenceCount: 2 }, numericFactsChanged: 1 }] } },
      rows("jgaap"),
    );
    expect(out).toHaveLength(3);
  });
  it("ignores a record-only 訂正", () => {
    expect(noteCandidates({ amendments: { effectiveDocID: "A", records: [{ docID: "A", classification: "record-only" }] } }, rows("jgaap"))).toEqual([]);
  });
});

describe("applyFinancialNotes", () => {
  const table = () => rows("jgaap", "jgaap") as { fiscalYear: string; note?: string }[];
  const run = (notes: unknown, fin = table()) => {
    const warnings: string[] = [];
    const needsReview: string[] = [];
    applyFinancialNotes(fin, notes, "businessModel", warnings, needsReview);
    return { fin, warnings, needsReview };
  };
  it("puts a note on the year it names", () => {
    expect(run([{ fiscalYear: "2023年3月期", note: " 収益認識基準の適用前の数値です。 " }]).fin[1].note).toBe("収益認識基準の適用前の数値です。");
  });
  it("sends a year the table does not have to a person", () => {
    const r = run([{ fiscalYear: "2030年3月期", note: "x" }]);
    expect(r.needsReview).toHaveLength(1);
    expect(r.fin.every((f) => !f.note)).toBe(true);
  });
  it("keeps the first note for a year, ignores empty notes and non-arrays", () => {
    const r = run([{ fiscalYear: "2022年3月期", note: "a" }, { fiscalYear: "2022年3月期", note: "b" }, { fiscalYear: "2023年3月期", note: "  " }]);
    expect(r.fin.map((f) => f.note)).toEqual(["a", undefined]);
    expect(r.warnings).toHaveLength(2);
    expect(run("nope").warnings).toHaveLength(1);
  });
});
