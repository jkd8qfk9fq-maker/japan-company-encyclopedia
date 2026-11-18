import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { shareFigures } from "../scripts/research/evidence-pack.mjs";

/**
 * 1株当たり配当額・発行済株式総数 (JCE-066): the 提出会社's own figures from 主要な経営指標等の推移, as printed. Never a
 * price, a yield or a market value.
 */
const row = (element: string, context: string, value: string | number) => ({ 要素ID: `jpcrp_cor:${element}`, 項目名: element, コンテキストID: context, 単位: "", 値: String(value) });
const DPS = "DividendPaidPerShareSummaryOfBusinessResults";
const SHARES = "TotalNumberOfIssuedSharesSummaryOfBusinessResults";

describe("shareFigures", () => {
  it("takes the filer's own (non-consolidated) current-year figures", () => {
    const rows = [
      row(DPS, "CurrentYearDuration_NonConsolidatedMember", "90.00"),
      row(DPS, "Prior1YearDuration_NonConsolidatedMember", "75.00"),
      row(SHARES, "CurrentYearInstant_NonConsolidatedMember", "15,794,987,460"),
    ];
    expect(shareFigures(rows)).toEqual({ dividendPerShare: 90, issuedShares: 15_794_987_460 });
  });

  it("falls back to the plain context for a filer without consolidated statements", () => {
    expect(shareFigures([row(DPS, "CurrentYearDuration", "12.5"), row(SHARES, "CurrentYearInstant", "1000000")])).toEqual({ dividendPerShare: 12.5, issuedShares: 1_000_000 });
  });

  it("leaves a figure out when it is missing, ambiguous or not a valid count — never guessed", () => {
    expect(shareFigures([])).toEqual({ dividendPerShare: null, issuedShares: null });
    expect(shareFigures([row(DPS, "CurrentYearDuration_NonConsolidatedMember", "10"), row(DPS, "CurrentYearDuration_NonConsolidatedMember", "20")]).dividendPerShare).toBeNull();
    expect(shareFigures([row(SHARES, "CurrentYearInstant_NonConsolidatedMember", "-")]).issuedShares).toBeNull();
    expect(shareFigures([row(DPS, "CurrentYearDuration_NonConsolidatedMember", "0")]).dividendPerShare).toBe(0);
  });
});

describe("invariant 4 holds on the page", () => {
  it("shows the printed figures and says price, market value and yield are not shown", () => {
    const view = readFileSync("src/components/company/company-metrics.tsx", "utf8");
    expect(view).toContain("1株当たり配当額（提出会社）");
    expect(view).toContain("株価・時価総額・配当利回りは扱いません");
    expect(view).not.toMatch(/利回り[^は]|時価総額[^・]|PER|PBR/);
  });
});
