import { describe, expect, it } from "vitest";
import { crossCheck, dueFromCalendar, planQuarterly, sameFigure, toRecords } from "../scripts/pipeline/quarterly-earnings.mjs";

/** Q1/Q3 from EDINET DB (JCE-049): only quarters 1 and 3, held when EDINET DB disagrees with EDINET, sourced and attributed. */

const row = (quarter: number, fye: string, revenue: number, netIncome: number, extra: Record<string, unknown> = {}) => ({
  quarter,
  fiscal_year_end: fye,
  revenue,
  operating_income: revenue / 10,
  net_income: netIncome,
  accounting_standard: "JP_GAAP",
  is_consolidated: true,
  is_correction: false,
  disclosure_date: "Wed, 05 Aug 2026 00:00:00 GMT",
  pdf_url: null,
  edinet_code: "E00001",
  title: "",
  ...extra,
});

describe("toRecords", () => {
  it("keeps only Q1 and Q3, in yen, with a source attributed to EDINET DB", () => {
    const out = toRecords([row(1, "2027-03-31", 89157, 4000), row(2, "2027-03-31", 175992, 9000), row(3, "2026-03-31", 252990, 12000), row(4, "2026-03-31", 347200, 15000)], "2026-11-15");
    expect(out.map((o: { record: { quarter: number; fiscalYearEnd: string } }) => `${o.record.fiscalYearEnd}:Q${o.record.quarter}`)).toEqual(["2026-03-31:Q3", "2027-03-31:Q1"]);
    const q1 = out[1];
    expect(q1.record).toMatchObject({ fiscalYear: "2027年3月期", revenue: 89_157_000_000, netIncome: 4_000_000_000, accountingStandard: "jgaap", disclosedAt: "2026-08-05", sourceIds: ["tanshin-202703-q1"] });
    expect(q1.source.publisher).toContain("EDINET DB");
    expect(q1.source.url).toBe("https://edinetdb.jp/company/E00001");
  });

  it("keeps only the latest three fiscal years", () => {
    const out = toRecords([row(3, "2011-08-31", 10, 1), row(1, "2025-08-31", 100, 1), row(1, "2027-08-31", 120, 1)], "2026-11-15");
    expect(out.map((o: { record: { fiscalYearEnd: string } }) => o.record.fiscalYearEnd)).toEqual(["2025-08-31", "2027-08-31"]);
  });

  it("drops a row whose accounting standard it does not know, rather than guessing", () => {
    expect(toRecords([row(1, "2027-03-31", 100, 1, { accounting_standard: "XYZ" })], "2026-11-15")).toEqual([]);
  });

  it("prefers the consolidated row and the later (corrected) disclosure", () => {
    const out = toRecords(
      [
        row(1, "2027-03-31", 100, 1, { is_consolidated: false }),
        row(1, "2027-03-31", 200, 2),
        row(1, "2027-03-31", 210, 2, { disclosure_date: "Mon, 10 Aug 2026 00:00:00 GMT", is_correction: true }),
      ],
      "2026-11-15",
    );
    expect(out).toHaveLength(1);
    expect(out[0].record.revenue).toBe(210_000_000);
    expect(out[0].source.title).toContain("訂正");
  });
});

describe("crossCheck", () => {
  const entry = {
    financials: [{ periodEnd: "2026-03-31", revenue: 347_200_400_000, netIncome: 15_000_900_000 }],
    interimFinancials: [{ periodEnd: "2026-09-30", revenue: 175_992_123_000, netIncome: 9_000_000_000 }],
  };
  it("passes when EDINET DB's 百万円 match EDINET's yen", () => {
    const r = crossCheck(entry, [row(4, "2026-03-31", 347200, 15000), row(2, "2027-03-31", 175992, 9000)]);
    expect(r.compared).toHaveLength(2);
    expect(r.mismatches).toEqual([]);
  });
  it("holds the company when revenue differs", () => {
    const r = crossCheck(entry, [row(4, "2026-03-31", 340000, 15000)]);
    expect(r.mismatches).toHaveLength(1);
  });
  it("sets net income apart when only it differs (a group-wide profit, not the parent's share)", () => {
    const r = crossCheck(entry, [row(4, "2026-03-31", 347200, 17000)]);
    expect(r.mismatches).toEqual([]);
    expect(r.netIncomeMismatches).toHaveLength(1);
  });
  it("treats a difference below one million yen as the same figure", () => {
    expect(sameFigure(-243_843_000, -243)).toBe(true);
    expect(sameFigure(-243_843_000, -245)).toBe(false);
    expect(sameFigure(3_696_018_000, 3698)).toBe(false);
  });
});

describe("planQuarterly", () => {
  const [incoming] = toRecords([row(1, "2027-03-31", 100, 1)], "2026-11-15");
  it("adds a quarter not held, with its source", () => {
    const plan = planQuarterly({ sources: [], quarterlyEarnings: undefined }, [incoming]);
    expect(plan.added).toHaveLength(1);
    expect(plan.sources.map((s: { id: string }) => s.id)).toEqual(["tanshin-202703-q1"]);
  });
  it("does nothing for a quarter already held with the same figures, and replaces a corrected one", () => {
    const held = { sources: [incoming.source], quarterlyEarnings: [incoming.record] };
    expect(planQuarterly(held, [incoming]).added).toHaveLength(0);
    const [corrected] = toRecords([row(1, "2027-03-31", 101, 1)], "2026-11-16");
    const plan = planQuarterly(held, [corrected]);
    expect(plan.replaced).toHaveLength(1);
    expect(plan.next[0].revenue).toBe(101_000_000);
  });
});

describe("dueFromCalendar", () => {
  it("picks companies we list that announced a Q1/Q3 we do not hold", () => {
    const calendar = [
      { periodTypeEn: "Q1", secCode: "72030", edinetCode: "E02144", fiscalYearEnd: "2027-03-31", announcementDate: "2026-08-04" },
      { periodTypeEn: "Q2", secCode: "72030", edinetCode: "E02144", fiscalYearEnd: "2027-03-31", announcementDate: "2026-11-05" },
      { periodTypeEn: "Q3", secCode: "99990", edinetCode: "E09999", fiscalYearEnd: "2027-03-31", announcementDate: "2026-11-05" },
      { periodTypeEn: "Q1", secCode: "52010", edinetCode: "E01121", fiscalYearEnd: "2026-12-31", announcementDate: "2026-05-10" },
    ];
    const due = dueFromCalendar(calendar, new Map([["7203", "toyota"], ["5201", "agc"]]), (id: string) => id === "agc");
    expect([...due.keys()]).toEqual(["toyota"]);
  });
});
