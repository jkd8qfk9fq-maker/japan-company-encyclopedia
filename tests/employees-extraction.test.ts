import { describe, expect, it } from "vitest";
import { fiveYearFigures } from "../scripts/research/evidence-pack.mjs";

/**
 * 従業員数 in 主要な経営指標等の推移. Most filers tag it as the plain
 * `jpcrp_cor:NumberOfEmployees`, with no table suffix; a pick that demanded the
 * suffix left it empty for nearly every filing (yamaha-motor, 2026-09-28 regression).
 * The context test is what keeps a segment's headcount out, so it is tested too.
 */

const CONTEXTS = ["Prior4Year", "Prior3Year", "Prior2Year", "Prior1Year", "CurrentYear"];
const row = (element: string, context: string, value: string | number, unit = "") => ({
  要素ID: element,
  項目名: element,
  コンテキストID: context,
  単位: unit,
  値: String(value),
});

/** The rows every pack needs (a top line, net income, total assets) so only the headcount varies. */
function filing({ filerOnly = false }: { filerOnly?: boolean } = {}) {
  const dim = filerOnly ? "_NonConsolidatedMember" : "";
  const rows = [];
  for (const [i, c] of CONTEXTS.entries()) {
    rows.push(row("jpcrp_cor:NetSalesSummaryOfBusinessResults", `${c}Duration${dim}`, 1000 + i, "円"));
    rows.push(row(filerOnly ? "jpcrp_cor:NetIncomeLossSummaryOfBusinessResults" : "jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults", `${c}Duration${dim}`, 10 + i, "円"));
    rows.push(row("jpcrp_cor:TotalAssetsSummaryOfBusinessResults", `${c}Instant${dim}`, 5000 + i, "円"));
  }
  return rows;
}
const headcount = (element: string, dim = "") => CONTEXTS.map((c, i) => row(element, `${c}Instant${dim}`, 100 + i));
type Figures = { employees: { element: string; years: { fiscalYearEnd: string; value: number }[] }[]; nonConsolidated: boolean };
const figuresOf = (rows: object[]) => fiveYearFigures(rows, "2025-03-31") as unknown as Figures;
const employeesOf = (rows: object[]) => figuresOf(rows).employees as { element: string; years: { fiscalYearEnd: string; value: number }[] }[];
const values = (rows: object[]) => employeesOf(rows).flatMap((s) => s.years.map((y) => y.value));

describe("employee counts in the five-year table", () => {
  it("takes the plain NumberOfEmployees (no table suffix)", () => {
    const series = employeesOf([...filing(), ...headcount("jpcrp_cor:NumberOfEmployees")]);
    expect(series.map((s) => s.element)).toEqual(["NumberOfEmployees"]);
    expect(series[0].years.map((y) => [y.fiscalYearEnd, y.value])).toEqual([
      ["2021-03-31", 100],
      ["2022-03-31", 101],
      ["2023-03-31", 102],
      ["2024-03-31", 103],
      ["2025-03-31", 104],
    ]);
  });

  it("still takes an element that carries the table suffix", () => {
    const series = employeesOf([...filing(), ...headcount("jpcrp_cor:NumberOfEmployeesJGAAPSummaryOfBusinessResults")]);
    expect(series.map((s) => s.element)).toEqual(["NumberOfEmployeesJGAAPSummaryOfBusinessResults"]);
    expect(values([...filing(), ...headcount("jpcrp_cor:NumberOfEmployeesIFRSSummaryOfBusinessResults")])).toEqual([100, 101, 102, 103, 104]);
  });

  it("keeps the preference order: a suffixed series comes before the plain one, and both are kept", () => {
    const rows = [
      ...filing(),
      ...headcount("jpcrp_cor:NumberOfEmployees"),
      // J-GAAP table covers only the older years; the plain element covers all five.
      row("jpcrp_cor:NumberOfEmployeesJGAAPSummaryOfBusinessResults", "Prior4YearInstant", 100),
      row("jpcrp_cor:NumberOfEmployeesJGAAPSummaryOfBusinessResults", "Prior3YearInstant", 101),
    ];
    expect(employeesOf(rows).map((s) => s.element)).toEqual(["NumberOfEmployeesJGAAPSummaryOfBusinessResults", "NumberOfEmployees"]);
  });

  it("takes the plain element in the 提出会社 table of a filer with no consolidated statements", () => {
    const rows = [...filing({ filerOnly: true }), ...headcount("jpcrp_cor:NumberOfEmployees", "_NonConsolidatedMember")];
    const figures = figuresOf(rows);
    expect(figures.nonConsolidated).toBe(true);
    expect(values(rows)).toEqual([100, 101, 102, 103, 104]);
  });

  it("does not take the 提出会社 headcount for a filer that does consolidate", () => {
    const rows = [...filing(), ...headcount("jpcrp_cor:NumberOfEmployees", "_NonConsolidatedMember")];
    expect(employeesOf(rows)).toEqual(null);
  });

  it("does not take a headcount that carries a segment, region or any other dimension", () => {
    const rows = [
      ...filing(),
      row("jpcrp_cor:NumberOfEmployees", "CurrentYearInstant_jpcrp030000-asr_E02168-000LandmobilityReportableSegmentMember", 39990),
      row("jpcrp_cor:NumberOfEmployees", "CurrentYearInstant_ReportableSegmentsMember", 52436),
      row("jpcrp_cor:NumberOfEmployees", "CurrentYearInstant_JapanMember", 7000),
      row("jpcrp_cor:NumberOfEmployees", "CurrentYearInstant_NonConsolidatedMember_CorporateSharedMember", 21),
    ];
    expect(employeesOf(rows)).toEqual(null);
    // …and beside a real bare row, only the bare one is returned.
    const withBare = [...rows, row("jpcrp_cor:NumberOfEmployees", "CurrentYearInstant", 55176)];
    expect(values(withBare)).toEqual([55176]);
  });

  it("does not take the plain element from another namespace", () => {
    const rows = [...filing(), ...headcount("jpcrp030000-asr_E02168-000:NumberOfEmployees")];
    expect(employeesOf(rows)).toEqual(null);
  });

  it("keeps a year the filing prints as a dash out of the series", () => {
    const rows = [...filing(), ...headcount("jpcrp_cor:NumberOfEmployees").slice(1), row("jpcrp_cor:NumberOfEmployees", "Prior4YearInstant", "－")];
    expect(values(rows)).toEqual([101, 102, 103, 104]);
  });

  it("collapses a year the filing prints twice (five-year table and 従業員の状況), so the series gains no years", () => {
    const rows = [...filing(), ...headcount("jpcrp_cor:NumberOfEmployees"), ...headcount("jpcrp_cor:NumberOfEmployees").slice(1, 4)];
    const series = employeesOf(rows);
    expect(series[0].years).toHaveLength(5);
    expect(values(rows)).toEqual([100, 101, 102, 103, 104]);
  });

  it("leaves a year out when its repeats disagree, rather than choosing one", () => {
    const rows = [...filing(), ...headcount("jpcrp_cor:NumberOfEmployees"), row("jpcrp_cor:NumberOfEmployees", "Prior2YearInstant", 999)];
    expect(values(rows)).toEqual([100, 101, 103, 104]);
  });

  it("is null, not a guess, when the filing carries no headcount at all", () => {
    expect(employeesOf(filing())).toEqual(null);
  });
});
