import { describe, expect, it } from "vitest";
import { classifyAmendment, diffFigures, diffNumericFacts } from "../scripts/research/amendments.mjs";

/**
 * A 訂正有価証券報告書 re-files the whole report, so "what did it change?" is answered by comparing
 * the two filings' XBRL, not by reading. accrete and achilles had that done by hand in the pilot.
 */

const num = (id: string, value: string, context = "CurrentYearDuration") => ({ 要素ID: id, 値: value, コンテキストID: context, ユニットID: "JPY" });
const text = (id: string, value: string) => ({ 要素ID: id, 値: value, コンテキストID: "FilingDateInstant", ユニットID: "" });
const cover = (n: string) => [num("jpcrp_cor:NumberOfSubmissionCoverPage", n), num("jpdei_cor:AmendmentFlagDEI", n), text("jpcrp_cor:DocumentTitleCoverPage", n === "1" ? "有価証券報告書" : "訂正有価証券報告書")];
const base = [
  ...cover("1"),
  num("jppfs_cor:NetSales", "1000"),
  num("jppfs_cor:NetCashProvidedByUsedInOperatingActivities", "200"),
  num("jpcrp_cor:TotalAmountOfRemunerationEtc", "50"),
  text("jpcrp_cor:RemunerationForDirectorsAndOtherOfficersTextBlock", "<p>報酬は取締役会で決議</p>"),
  text("jpcrp_cor:CompanyHistoryTextBlock", "<p>2000年設立</p>"),
];
const unchangedFigures: { changed: boolean; differences: unknown[] } = { changed: false, differences: [] };
const prose = ["jpcrp_cor:CompanyHistoryTextBlock", "jpcrp_cor:ShareholdingsTextBlock"];
const classify = (rows: unknown[], figures = unchangedFigures) => classifyAmendment({ figures, baseRows: base, rows, proseElements: prose });

describe("classifyAmendment", () => {
  it("is record-only when only the cover differs", () => {
    const rows = base.map((r) => r).filter((r) => !r.要素ID.includes("CoverPage") && !r.要素ID.includes("DEI")).concat(cover("2"));
    expect(classify(rows)).toMatchObject({ classification: "record-only", numericFactsChanged: 0, proseTextChanged: [], otherTextChanged: [] });
  });

  it("stays record-only when only text and numbers no entry quotes changed, and lists them", () => {
    const rows = base
      .map((r) => (r.要素ID.endsWith("RemunerationForDirectorsAndOtherOfficersTextBlock") ? text(r.要素ID, "<p>報酬は取締役会で決議。追記あり</p>") : r))
      .map((r) => (r.要素ID.endsWith("TotalAmountOfRemunerationEtc") ? num(r.要素ID, "55") : r));
    expect(classify(rows)).toMatchObject({ classification: "record-only", otherTextChanged: ["RemunerationForDirectorsAndOtherOfficersTextBlock"], otherNumericChanged: ["TotalAmountOfRemunerationEtc"] });
  });

  it("is financial-change when a statement figure outside the five series moved (operating cash flow)", () => {
    const rows = base.map((r) => (r.要素ID.endsWith("NetCashProvidedByUsedInOperatingActivities") ? num(r.要素ID, "210") : r));
    expect(classify(rows)).toMatchObject({ classification: "financial-change", numericFactsChanged: 1, numericElements: ["NetCashProvidedByUsedInOperatingActivities"] });
  });

  it("is financial-change when the extracted series differ, even if no fact differs", () => {
    expect(classify(base, { changed: true, differences: [{}] }).classification).toBe("financial-change");
  });

  it("is text-change when a section an entry rests on reads differently and no figure moved", () => {
    const rows = base.map((r) => (r.要素ID.endsWith("CompanyHistoryTextBlock") ? text(r.要素ID, "<p>2001年設立</p>") : r));
    expect(classify(rows)).toMatchObject({ classification: "text-change", proseTextChanged: ["CompanyHistoryTextBlock"] });
  });

  it("lets a figure change outrank a text change", () => {
    const rows = base.map((r) => (r.要素ID.endsWith("CompanyHistoryTextBlock") ? text(r.要素ID, "<p>2001年設立</p>") : r.要素ID.endsWith(":NetSales") ? num(r.要素ID, "999") : r));
    expect(classify(rows).classification).toBe("financial-change");
  });

  it("sees a fact that exists on one side only", () => {
    expect(diffNumericFacts(base, [...base, num("jppfs_cor:Goodwill", "5")]).financial.elements).toEqual(["Goodwill"]);
  });

  it("ignores the order the same fact is listed in", () => {
    const a = [num("jppfs_cor:NetSales", "1"), num("jppfs_cor:NetSales", "2")];
    expect(diffNumericFacts(a, [...a].reverse()).financial.count).toBe(0);
  });
});

describe("diffFigures with an explicit set of series", () => {
  const figures = (employees: number) => ({ revenue: [], employees: [{ years: [{ fiscalYearEnd: "2026-03-31", value: employees }] }] });
  it("compares only the five series by default, and employees when asked", () => {
    expect(diffFigures(figures(10), figures(12)).changed).toBe(false);
    expect(diffFigures(figures(10), figures(12), ["employees"])).toMatchObject({ changed: true, differences: [{ kind: "employees", before: [10], after: [12] }] });
  });
});

describe("evidence-pack.mjs module load order", () => {
  it("declares PROSE_ELEMENTS above the command-line block that runs packFor at load time", async () => {
    // packFor reaches PROSE_ELEMENTS for any company with a 訂正. Declared below the CLI block it is in its
    // temporal dead zone when the script runs, and every such rebuild failed ("Cannot access 'PROSE_ELEMENTS'
    // before initialization") — a failure no import of the module can show, because tests never run the CLI block.
    const { readFile } = await import("node:fs/promises");
    const source = await readFile("scripts/research/evidence-pack.mjs", "utf8");
    const declared = source.indexOf("export const PROSE_ELEMENTS");
    const cli = source.indexOf('if (process.argv[1]?.endsWith("evidence-pack.mjs"))');
    expect(declared).toBeGreaterThan(-1);
    expect(cli).toBeGreaterThan(-1);
    expect(declared).toBeLessThan(cli);
  });
});
