import { describe, expect, it } from "vitest";
import { workforceFigures } from "../scripts/research/evidence-pack.mjs";

/**
 * 【従業員の状況】（提出会社の状況）, JCE-038. The headcount element is shared with the group's, so its context is what
 * keeps the group's number out; tenure stays in the units the filing printed.
 */

const row = (element: string, context: string, value: string | number) => ({
  要素ID: `jpcrp_cor:${element}`,
  項目名: element,
  コンテキストID: context,
  単位: "",
  値: String(value),
});
const about = (name: string) => `${name}InformationAboutReportingCompanyInformationAboutEmployees`;
const own = "CurrentYearInstant_NonConsolidatedMember";

describe("workforceFigures", () => {
  it("takes the filing company's headcount, salary and tenure", () => {
    const rows = [
      row("NumberOfEmployees", "CurrentYearInstant", 380_000),
      row("NumberOfEmployees", own, 70_000),
      row(about("AverageAnnualSalary"), own, 8_950_000),
      row(about("AverageLengthOfServiceYears"), own, 15.3),
    ];
    expect(workforceFigures(rows)).toEqual({
      employees: 70_000,
      averageAnnualSalary: 8_950_000,
      averageTenureYears: 15.3,
      averageTenureMonths: null,
    });
  });

  it("keeps years and months apart when the filing prints 「15年3ヶ月」", () => {
    const rows = [row(about("AverageLengthOfServiceYears"), own, 15), row(about("AverageLengthOfServiceMonths"), own, 3)];
    expect(workforceFigures(rows)).toMatchObject({ averageTenureYears: 15, averageTenureMonths: 3 });
  });

  it("never takes the group's headcount for a filer that consolidates", () => {
    expect(workforceFigures([row("NumberOfEmployees", "CurrentYearInstant", 380_000)]).employees).toBeNull();
  });

  it("takes the plain headcount for a filer with no consolidated statements", () => {
    expect(workforceFigures([row("NumberOfEmployees", "CurrentYearInstant", 120)], true).employees).toBe(120);
  });

  it("ignores prior years and segment contexts, and drops a value tagged twice with different numbers", () => {
    const rows = [
      row(about("AverageAnnualSalary"), "Prior1YearInstant_NonConsolidatedMember", 8_000_000),
      row("NumberOfEmployees", `${own}_jpcrp030000-asr_E00000-000AutomotiveReportableSegmentMember`, 50_000),
      row(about("AverageLengthOfServiceYears"), own, 15.3),
      row(about("AverageLengthOfServiceYears"), own, 16.1),
    ];
    expect(workforceFigures(rows)).toEqual({ employees: null, averageAnnualSalary: null, averageTenureYears: null, averageTenureMonths: null });
  });
});
