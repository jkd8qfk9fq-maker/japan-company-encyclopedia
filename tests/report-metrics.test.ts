import { describe, expect, it } from "vitest";
import { quantile } from "../src/lib/industry-figures";
import { industryPosition, profitLineKind, reportMetrics } from "../src/lib/report-metrics";
import type { Company, FinancialRecord, IndustryId } from "../src/types/company";

/**
 * The premium report's computed layer (JCE-073): arithmetic on printed figures only, with the industry's
 * distribution beside it. A figure that is not printed — or cannot be read as the metric claims — is left
 * out, and a thin industry gives a value without a distribution, never an invented one.
 */

const rec = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  ({
    fiscalYear: "2026年3月期",
    periodEnd: "2026-03-31",
    revenue: 1000,
    revenueLabel: "売上高",
    profit: 100,
    profitLabel: "経常利益",
    netIncome: 50,
    netIncomeLabel: "当期純利益",
    totalAssets: 2000,
    totalAssetsLabel: "総資産",
    netAssets: 800,
    netAssetsLabel: "純資産",
    employees: 100,
    currency: "JPY",
    accountingStandard: "jgaap",
    sourceIds: ["s"],
    ...over,
  }) as FinancialRecord;

const prev = (over: Partial<FinancialRecord> = {}): FinancialRecord =>
  rec({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 800, netIncome: 40, ...over });

const company = (id: string, industry: IndustryId, financials: FinancialRecord[], extra: Partial<Company> = {}): Company =>
  ({
    id,
    name: id,
    industries: [{ industryId: industry, primary: true }],
    financials,
    businesses: [],
    history: [],
    relatedCompanies: [],
    sources: [],
    ...extra,
  }) as unknown as Company;

/** Six retailers whose latest net margins are 2, 4, 5, 8, 10 and 20 percent. */
const retailers = [0.02, 0.04, 0.05, 0.08, 0.1, 0.2].map((margin, i) =>
  company(`r${i}`, "retail", [prev(), rec({ revenue: 1000, netIncome: 1000 * margin })]),
);
const target = retailers[3]!; // margin 0.08

describe("quantile", () => {
  it("interpolates between ranks, and agrees with the median at q = 0.5", () => {
    expect(quantile([1, 2, 3, 4], 0.25)).toBeCloseTo(1.75);
    expect(quantile([1, 2, 3, 4], 0.5)).toBeCloseTo(2.5);
    expect(quantile([1, 2, 3, 4], 0.75)).toBeCloseTo(3.25);
    expect(quantile([7], 0.25)).toBe(7);
    expect(quantile([], 0.5)).toBeNull();
  });
});

describe("industryPosition", () => {
  it("gives median, quartiles, rank and percentile over the whole list", () => {
    const p = industryPosition(0.08, [0.02, 0.04, 0.05, 0.08, 0.1, 0.2])!;
    expect(p.median).toBeCloseTo(0.065);
    expect(p.q1).toBeCloseTo(0.0425);
    expect(p.q3).toBeCloseTo(0.095);
    expect(p.rank).toBe(3);
    expect(p.members).toBe(6);
    expect(p.percentile).toBe(50);
  });

  it("shares the higher rank on a tie, and refuses a thin list", () => {
    expect(industryPosition(0.1, [0.1, 0.1, 0.05, 0.2, 0.3])!.rank).toBe(3);
    expect(industryPosition(0.1, [0.1, 0.2, 0.3, 0.4])).toBeNull();
  });
});

describe("profitLineKind", () => {
  it("reads the line from its meaning, including the loss wording of the same line", () => {
    expect(profitLineKind("経常利益")).toBe("経常利益");
    expect(profitLineKind("経常利益又は経常損失（△）")).toBe("経常利益");
    expect(profitLineKind("経常損失(△)")).toBe("経常利益");
    expect(profitLineKind("連結経常利益")).toBe("経常利益");
    expect(profitLineKind("税引前利益（△は損失）")).toBe("税引前利益");
    expect(profitLineKind("税金等調整前当期純利益")).toBe("税引前利益");
    expect(profitLineKind("営業利益")).toBe("営業利益");
    expect(profitLineKind("当期利益")).toBeNull();
    expect(profitLineKind(null)).toBeNull();
    expect(profitLineKind(undefined)).toBeNull();
  });
});

describe("reportMetrics", () => {
  it("computes the latest year's ratios from printed figures, with the industry distribution", () => {
    const layer = reportMetrics(target, retailers);
    expect(layer.industryName).toBe("小売");
    const margin = layer.metrics.find((m) => m.key === "net-margin")!;
    expect(margin.value).toBeCloseTo(0.08);
    expect(margin.formula).toBe("当期純利益 ÷ 売上高");
    expect(margin.industry).toMatchObject({ rank: 3, members: 6, percentile: 50 });
    expect(margin.industry!.median).toBeCloseTo(0.065);

    const equity = layer.metrics.find((m) => m.key === "equity-ratio")!;
    expect(equity.value).toBeCloseTo(0.4); // 800 / 2000
    const turnover = layer.metrics.find((m) => m.key === "asset-turnover")!;
    expect(turnover.value).toBeCloseTo(0.5); // 1000 / 2000
    const perEmployee = layer.metrics.find((m) => m.key === "revenue-per-employee")!;
    expect(perEmployee.value).toBeCloseTo(10); // 1000 / 100
  });

  it("computes growth only from comparable years", () => {
    const layer = reportMetrics(target, retailers);
    const growth = layer.metrics.find((m) => m.key === "revenue-growth-1y")!;
    expect(growth.value).toBeCloseTo(0.25); // 1000 / 800 − 1

    const restated = company("restated", "retail", [prev({ accountingStandard: "ifrs" }), rec()]);
    const layer2 = reportMetrics(restated, [...retailers, restated]);
    expect(layer2.metrics.find((m) => m.key === "revenue-growth-1y")).toBeUndefined();
    expect(layer2.metrics.find((m) => m.key === "net-income-growth-1y")).toBeUndefined();
  });

  it("leaves out a metric whose figure is not printed, and the five-year growth without five years", () => {
    const silent = company("silent", "retail", [prev(), rec({ netIncome: null, employees: null })]);
    const layer = reportMetrics(silent, [...retailers, silent]);
    expect(layer.metrics.find((m) => m.key === "net-margin")).toBeUndefined();
    expect(layer.metrics.find((m) => m.key === "net-income-per-employee")).toBeUndefined();
    expect(layer.metrics.find((m) => m.key === "revenue-growth-5y")).toBeUndefined();
    expect(layer.metrics.find((m) => m.key === "equity-ratio")).toBeDefined();
  });

  it("does not read a margin across a change of perimeter (revenue and net income covering different scopes)", () => {
    const split = company("split", "retail", [
      prev(),
      rec({ revenueBasis: "金融事業を含まない", netIncomeBasis: "金融事業を含む" }),
    ]);
    const layer = reportMetrics(split, [...retailers, split]);
    expect(layer.metrics.find((m) => m.key === "net-margin")).toBeUndefined();
  });

  it("reads the overseas ratio from the regional revenue, and nothing without it", () => {
    expect(reportMetrics(target, retailers).metrics.find((m) => m.key === "overseas-ratio")).toBeUndefined();
    const global = company("global", "retail", [prev(), rec()], {
      regionalRevenue: {
        fiscalYear: "2026年3月期",
        periodEnd: "2026-03-31",
        label: "売上高",
        sourceIds: ["s"],
        items: [
          { region: "日本", domestic: true, amount: 700 },
          { region: "北米", domestic: false, amount: 300 },
        ],
      },
    });
    const metric = reportMetrics(global, [...retailers, global]).metrics.find((m) => m.key === "overseas-ratio")!;
    expect(metric.value).toBeCloseTo(0.3);
    expect(metric.formula).toBe("日本以外の売上高 ÷ 地域別の売上高の合計");
  });

  it("shows a value without a distribution when too few companies of the industry print the figure", () => {
    // Only three of the seven retailers print an employee count.
    const few = retailers.map((c, i) => (i < 3 ? c : company(c.id, "retail", [prev({ employees: null }), rec({ employees: null })])));
    const layer = reportMetrics(few[0]!, few);
    const perEmployee = layer.metrics.find((m) => m.key === "revenue-per-employee")!;
    expect(perEmployee.value).toBeCloseTo(10);
    expect(perEmployee.industry).toBeNull();
    // The margin still has six values behind it, so its distribution stands.
    expect(layer.metrics.find((m) => m.key === "net-margin")!.industry).not.toBeNull();
  });

  it("reads the profit line from its meaning, so a loss-worded label stays among its own line's peers", () => {
    const loss = company("loss", "retail", [prev(), rec({ profit: -80, profitLabel: "経常損失(△)" })]);
    const margin = reportMetrics(loss, [...retailers, loss]).metrics.find((m) => m.key === "profit-margin")!;
    expect(margin.title).toBe("経常利益率");
    expect(margin.value).toBeCloseTo(-0.08);
    // The six 経常利益 retailers and the loss-maker: seven values, the loss last.
    expect(margin.industry).toMatchObject({ members: 7, rank: 7 });
    expect(margin.note).toBe("経常利益を印字する会社だけで比べています");
  });

  it("never ranks a different profit line beside this one", () => {
    const ifrs = company("ifrs", "retail", [prev(), rec({ profit: 900, profitLabel: "税引前利益" })]);
    const margin = reportMetrics(target, [...retailers, ifrs]).metrics.find((m) => m.key === "profit-margin")!;
    expect(margin.industry).toMatchObject({ members: 6 });
    const own = reportMetrics(ifrs, [...retailers, ifrs]).metrics.find((m) => m.key === "profit-margin")!;
    expect(own.title).toBe("税引前利益率");
    expect(own.value).toBeCloseTo(0.9);
    expect(own.industry).toBeNull();
  });

  it("leaves out peers whose latest year ends more than about a year away", () => {
    const stale = company("stale", "retail", [rec({ fiscalYear: "2022年3月期", periodEnd: "2022-03-31", netIncome: 990 })]);
    const layer = reportMetrics(target, [...retailers, stale]);
    expect(layer.industryMembers).toBe(7);
    expect(layer.comparableMembers).toBe(6);
    expect(layer.metrics.find((m) => m.key === "net-margin")!.industry).toMatchObject({ members: 6, rank: 3 });
  });

  it("computes the five-year growth from the first and last of five printed years", () => {
    const five = [500, 600, 700, 800, 1000].map((revenue, i) =>
      rec({ fiscalYear: `${2022 + i}年3月期`, periodEnd: `${2022 + i}-03-31`, revenue }),
    );
    const grown = company("grown", "retail", five);
    const metric = reportMetrics(grown, [...retailers, grown]).metrics.find((m) => m.key === "revenue-growth-5y")!;
    expect(metric.value).toBeCloseTo(1); // 1000 / 500 − 1
    expect(metric.sourceIds).toEqual(["s"]);
  });
});
