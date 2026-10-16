import { describe, expect, it } from "vitest";
import { detectFiscalYearChange, detectIrregularPeriods, printedYearEnds } from "../scripts/research/evidence-pack.mjs";

/**
 * A filer that changes its fiscal year end inside the five-year window has early columns the pack
 * dates wrongly (it counts whole years back from the current year end). 主要な経営指標等の推移 prints
 * each column's real 決算年月, so the two are compared; a difference parks the company for a person.
 */

// 住友重機械工業, FY2025: moved from March to December in 2022; the table prints six columns.
const SUMITOMO =
  "(1) 連結経営指標等回次第125期第126期第127期第128期第129期第130期決算年月2021年３月2022年３月2022年12月2023年12月2024年12月2025年12月売上高(百万円)849,065943,979854,093";

const col = (fiscalYearEnd: string, relative: string) => ({ fiscalYearEnd, relative });
const assumed = [
  col("2021-12-31", "四期前"),
  col("2022-12-31", "三期前"),
  col("2023-12-31", "前々期"),
  col("2024-12-31", "前期"),
  col("2025-12-31", "当期"),
];

describe("the printed 決算年月 row", () => {
  it("reads year and month, full-width digits included, oldest first", () => {
    expect(printedYearEnds(SUMITOMO)).toEqual(["2021-03", "2022-03", "2022-12", "2023-12", "2024-12", "2025-12"]);
  });

  it("is null when the table prints no such row", () => {
    expect(printedYearEnds("売上高(百万円)100200300")).toBeNull();
    expect(printedYearEnds(null)).toBeNull();
  });
});

describe("a change of fiscal year end", () => {
  it("is found, and names only the columns that disagree (住友重機械工業: 第126期 is 2022年3月, not 2021年12月)", () => {
    expect(detectFiscalYearChange(SUMITOMO, assumed, "2025-12-31")).toEqual({ printed: ["2022-03"], assumed: ["2021-12"] });
  });

  it("is not reported when every column matches", () => {
    const text = "決算年月2021年12月2022年12月2023年12月2024年12月2025年12月売上高";
    expect(detectFiscalYearChange(text, assumed, "2025-12-31")).toBeNull();
  });

  it("matches columns by relative year, so a filing that tags only some years is not misread", () => {
    const text = "決算年月2021年12月2022年12月2023年12月2024年12月2025年12月";
    expect(detectFiscalYearChange(text, [col("2025-12-31", "当期"), col("2022-12-31", "三期前")], "2025-12-31")).toBeNull();
  });

  it("finds the current column in a row printed newest first, and ignores one it cannot orient", () => {
    const newestFirst = "決算年月2025年12月2024年12月2023年12月2022年3月2021年3月";
    expect(detectFiscalYearChange(newestFirst, assumed, "2025-12-31")).toEqual({ printed: ["2021-03", "2022-03"], assumed: ["2021-12", "2022-12"] });
    // 当期 at neither end: another table, or a layout this does not understand — no claim is made.
    expect(detectFiscalYearChange("決算年月2021年3月2023年6月2022年12月", assumed, "2025-12-31")).toBeNull();
  });

  it("is quiet when there is no printed row to compare with", () => {
    expect(detectFiscalYearChange(null, assumed, "2025-12-31")).toBeNull();
    expect(detectFiscalYearChange("売上高", assumed, "2025-12-31")).toBeNull();
  });
});

describe("a fiscal year that is not twelve months long", () => {
  it("is found: 住友重機械工業's 2022年12月期 runs April to December", () => {
    expect(detectIrregularPeriods(SUMITOMO, "2025-12-31")).toEqual([{ yearEnd: "2022-12", months: 9 }]);
  });

  it("is not reported for twelve-month years, or when the row cannot be read", () => {
    expect(detectIrregularPeriods("決算年月2021年12月2022年12月2023年12月2024年12月2025年12月", "2025-12-31")).toEqual([]);
    expect(detectIrregularPeriods(null, "2025-12-31")).toEqual([]);
    expect(detectIrregularPeriods("決算年月2021年3月2023年6月2022年12月", "2025-12-31")).toEqual([]);
  });

  it("looks only at the five columns the table reports on, using the sixth only to measure the oldest", () => {
    // Six printed columns: the oldest (2019年6月) is not one of this filing's years, so only the span
    // from it to the next column (2020年3月, nine months) is reported — never the sixth column's own length.
    expect(detectIrregularPeriods("決算年月2019年6月2020年3月2021年3月2022年3月2023年3月2024年3月", "2024-03-31")).toEqual([{ yearEnd: "2020-03", months: 9 }]);
    expect(detectIrregularPeriods("決算年月2019年6月2020年6月2021年3月2022年3月2023年3月2024年3月", "2024-03-31")).toEqual([{ yearEnd: "2021-03", months: 9 }]);
  });
});
