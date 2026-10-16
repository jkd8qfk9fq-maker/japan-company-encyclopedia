import { describe, expect, it } from "vitest";
import { fiveYearFigures } from "../scripts/research/evidence-pack.mjs";

/**
 * The label a series carries is the row heading the filing prints. 西日本旅客鉄道 prints the unit
 * BEFORE the heading ("百万円  営業収益  1,031,103…"), and walking back from the figures used to
 * return 「百万円営業収益」 — which verify-financials accepted, because that text is in the table.
 */

const CTX = ["Prior4Year", "Prior3Year", "Prior2Year", "Prior1Year", "CurrentYear"];
const row = (element: string, context: string, value: number) => ({ 要素ID: `jpcrp_cor:${element}`, 項目名: element, コンテキストID: context, 単位: "円", 値: String(value) });

const REVENUE = [1_031_103, 1_395_531, 1_635_023, 1_707_944, 1_845_840].map((m) => m * 1_000_000);
const NET = [-113_198, 88_528, 98_761, 113_958, 127_499].map((m) => m * 1_000_000);
const rows = CTX.flatMap((c, i) => [
  row("NetSalesSummaryOfBusinessResults", `${c}Duration`, REVENUE[i]),
  row("ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults", `${c}Duration`, NET[i]),
  row("TotalAssetsSummaryOfBusinessResults", `${c}Instant`, 3_702_421_000_000 + i * 1_000_000_000),
]);

const table = (unitFirst: boolean) =>
  unitFirst
    ? "連結経営指標等 回次第35期第36期第37期第38期第39期決算年月2022年３月2023年３月2024年３月2025年３月2026年３月 百万円    営業収益1,031,1031,395,5311,635,0231,707,9441,845,840 百万円    親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）△113,19888,52898,761113,958127,499"
    : "連結経営指標等 回次第35期第36期第37期第38期第39期決算年月2022年３月2023年３月2024年３月2025年３月2026年３月 営業収益(百万円)1,031,1031,395,5311,635,0231,707,9441,845,840 親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）(百万円)△113,19888,52898,761113,958127,499";

const labels = (unitFirst: boolean) => {
  const f = (fiveYearFigures as (...args: unknown[]) => unknown)(rows, "2026-03-31", [], table(unitFirst)) as { revenue: { label: string }[]; netIncome: { label: string }[] };
  return { revenue: f.revenue[0].label, netIncome: f.netIncome[0].label };
};

describe("printed row labels", () => {
  it("do not start with a unit printed before the heading", () => {
    expect(labels(true).revenue).toBe("営業収益");
    expect(labels(true).netIncome).toBe("親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）");
  });

  it("are unchanged when the unit follows the heading, as most filings print it", () => {
    expect(labels(false).revenue).toBe("営業収益");
    expect(labels(false).netIncome).toBe("親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）");
  });

  it("do not keep the 期 of a 「2026年９月期」 header, which survived as 「期売上収益」", () => {
    const text =
      "連結経営指標等 回次第35期第36期第37期第38期第39期決算年月2022年９月期2023年９月期2024年９月期2025年９月期2026年９月期売上収益(百万円)1,031,1031,395,5311,635,0231,707,9441,845,840 親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）(百万円)△113,19888,52898,761113,958127,499";
    const f = (fiveYearFigures as (...args: unknown[]) => unknown)(rows, "2026-09-30", [], text) as { revenue: { label: string }[] };
    expect(f.revenue[0].label).toBe("売上収益");
  });
});
