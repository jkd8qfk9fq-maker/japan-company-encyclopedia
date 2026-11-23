import { describe, expect, it } from "vitest";
import { bennetA1, bennetAFull, runDecompModule, shapleyProduct3, theilSen, type DecompResult } from "../src/lib/analysis-decomposition";
import { companies } from "../src/data/companies";
import { isReleased } from "../src/lib/release";
import type { Company, FinancialRecord, FinancialStatements, IndustryId, StatementLine } from "../src/types/company";

/**
 * The decomposition layer (JCE-096): golden values hand-computed from printed figures, the algebraic
 * properties the spec rests on (the parts add up to the change they break down), and the display
 * conditions under which a module is suppressed whole rather than approximated. The Misumi fixture
 * copies the figures as printed in its filings (2022年3月期–2026年3月期), so the golden values stay
 * fixed even when the registered data moves on to a newer filing.
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
    netIncomeLabel: "親会社株主に帰属する当期純利益",
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

const company = (id: string, industry: IndustryId, financials: FinancialRecord[]): Company =>
  ({
    id,
    name: id,
    industries: [{ industryId: industry, primary: true }],
    financials,
    businesses: [],
    history: [],
    relatedCompanies: [],
    sources: [],
  }) as unknown as Company;

const ok = (r: DecompResult) => {
  if (r.status !== "ok") throw new Error(`expected ok, got suppressed: ${r.reason}`);
  return r.group;
};
const rowOf = (r: DecompResult, key: string) => ok(r).rows.find((row) => row.key === key);

/** Misumi's printed figures, in yen: [revenue, 経常利益, 純利益, 総資産, 純資産] for 2022–2026年3月期. */
const MISUMI: [number, number, number, number, number][] = [
  [366_160_000_000, 52_500_000_000, 37_557_000_000, 347_390_000_000, 279_959_000_000],
  [373_151_000_000, 47_838_000_000, 34_282_000_000, 378_458_000_000, 314_224_000_000],
  [367_649_000_000, 41_265_000_000, 28_152_000_000, 413_517_000_000, 347_679_000_000],
  [401_987_000_000, 49_901_000_000, 36_549_000_000, 419_574_000_000, 352_064_000_000],
  [441_383_000_000, 49_095_000_000, 40_457_000_000, 464_969_000_000, 382_509_000_000],
];
const misumi = company(
  "misumi-fixture",
  "machinery",
  MISUMI.map(([revenue, profit, netIncome, totalAssets, netAssets], i) =>
    rec({
      fiscalYear: `${2022 + i}年3月期`,
      periodEnd: `${2022 + i}-03-31`,
      revenue,
      profit,
      netIncome,
      totalAssets,
      netAssets,
    }),
  ),
);

describe("golden values (Misumi, hand-computed from the printed figures)", () => {
  it("A1 splits the profit change into the Bennet revenue and margin effects", () => {
    const r = runDecompModule("a1", misumi, [misumi]);
    expect(rowOf(r, "a1-revenue-effect")!.value).toBeCloseTo(4_636_235_227, -2);
    expect(rowOf(r, "a1-margin-effect")!.value).toBeCloseTo(-5_442_235_227, -2);
    expect(rowOf(r, "a1-profit-change")!.value).toBe(-806_000_000);
    expect(rowOf(r, "a1-bridge")!.value).toBe(4_714_000_000);
    expect(rowOf(r, "a1-net-income-change")!.value).toBe(3_908_000_000);
  });

  it("B1 splits the net-assets change into net income and the rest", () => {
    const r = runDecompModule("b1", misumi, [misumi]);
    expect(rowOf(r, "b1-net-assets-change")!.value).toBe(30_445_000_000);
    expect(rowOf(r, "b1-net-income")!.value).toBe(40_457_000_000);
    expect(rowOf(r, "b1-net-income")!.kind).toBe("printed");
    expect(rowOf(r, "b1-other-change")!.value).toBe(-10_012_000_000);
    expect(rowOf(r, "b1-net-assets-growth")!.value).toBeCloseTo(30_445_000_000 / 352_064_000_000, 10);
    expect(rowOf(r, "b1-buildup-ratio")!.value).toBeCloseTo(0.75253, 4);
  });

  it("C1 splits asset growth into the equity and liability contributions", () => {
    const r = runDecompModule("c1", misumi, [misumi]);
    expect(rowOf(r, "c1-asset-growth")!.value).toBeCloseTo(0.108193, 5);
    expect(rowOf(r, "c1-equity-contribution")!.value).toBeCloseTo(0.072562, 5);
    expect(rowOf(r, "c1-liability-contribution")!.value).toBeCloseTo(0.035631, 5);
    expect(rowOf(r, "c1-equity-ratio-change")!.value).toBeCloseTo(-0.016444, 5);
    expect(rowOf(r, "c1-self-financing-ratio")!.value).toBeCloseTo(0.670669, 5);
  });

  it("E1 extrapolates the first four years' Theil–Sen trend and compares the fifth", () => {
    const r = runDecompModule("e1", misumi, [misumi]);
    expect(rowOf(r, "e1-trend-growth")!.value).toBeCloseTo(0.02533, 4);
    expect(rowOf(r, "e1-deviation")!.value).toBeCloseTo(0.093994, 4);
    expect(rowOf(r, "e1-cagr")!.value).toBeCloseTo(0.047819, 5);
    expect(rowOf(r, "e1-trend-growth")!.kind).toBe("estimated");
    expect(rowOf(r, "e1-cagr")!.kind).toBe("computed");
  });

  it("F2 measures the net margin's stability over five years", () => {
    const r = runDecompModule("f2", misumi, [misumi]);
    expect(rowOf(r, "f2-margin-sd")!.value).toBeCloseTo(0.00828, 4);
    expect(rowOf(r, "f2-margin-range")!.value).toBeCloseTo(0.025997, 5);
  });

  it("F3 states the gap between revenue growth and asset growth", () => {
    const r = runDecompModule("f3", misumi, [misumi]);
    expect(rowOf(r, "f3-growth-gap")!.value).toBeCloseTo(-0.01019, 4);
  });

  it("D1 pools five years for the ROE approximation and adds the lagged incremental rate", () => {
    const r = runDecompModule("d1", misumi, [misumi]);
    expect(rowOf(r, "d1-pooled-roe")!.value).toBeCloseTo(0.105579, 5);
    expect(rowOf(r, "d1-incremental-roe")!.value).toBeCloseTo(0.085639, 5);
  });

  it("F1 decomposes the ROE change into margin, turnover and leverage effects (Shapley)", () => {
    const r = runDecompModule("f1", misumi, [misumi]);
    expect(rowOf(r, "f1-roe")!.value).toBeCloseTo(0.110151, 5);
    expect(rowOf(r, "f1-margin-effect")!.value).toBeCloseTo(0.000868, 5);
    expect(rowOf(r, "f1-turnover-effect")!.value).toBeCloseTo(0.003601, 5);
    expect(rowOf(r, "f1-leverage-effect")!.value).toBeCloseTo(0.001218, 5);
    const sum = ["f1-margin-effect", "f1-turnover-effect", "f1-leverage-effect"].reduce((a, k) => a + rowOf(r, k)!.value, 0);
    expect(sum).toBeCloseTo(rowOf(r, "f1-roe-change")!.value, 12);
  });
});

/** Deterministic pseudo-random generator, so the property tests are reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("algebraic properties", () => {
  it("Bennet effects add up to the profit change and flip sign when the years are swapped", () => {
    const rand = mulberry32(42);
    for (let i = 0; i < 200; i++) {
      const r0 = 1 + rand() * 1e12;
      const r1 = 1 + rand() * 1e12;
      const p0 = (rand() - 0.3) * 2e11;
      const p1 = (rand() - 0.3) * 2e11;
      const d = bennetA1(r0, p0, r1, p1);
      const tol = Math.max(1, 1e-9 * Math.abs(d.profitChange));
      expect(Math.abs(d.revenueEffect + d.marginEffect - d.profitChange)).toBeLessThanOrEqual(tol);
      const swapped = bennetA1(r1, p1, r0, p0);
      expect(swapped.revenueEffect).toBeCloseTo(-d.revenueEffect, 3);
      expect(swapped.marginEffect).toBeCloseTo(-d.marginEffect, 3);
    }
  });

  it("Shapley effects add up to the change in the product, for any factor movements", () => {
    const rand = mulberry32(7);
    for (let i = 0; i < 200; i++) {
      const oldF: [number, number, number] = [rand() * 0.3 - 0.05, rand() * 2 + 0.1, rand() * 3 + 0.5];
      const newF: [number, number, number] = [rand() * 0.3 - 0.05, rand() * 2 + 0.1, rand() * 3 + 0.5];
      const effects = shapleyProduct3(oldF, newF);
      const delta = newF[0] * newF[1] * newF[2] - oldF[0] * oldF[1] * oldF[2];
      expect(effects[0] + effects[1] + effects[2]).toBeCloseTo(delta, 12);
    }
  });

  it("Theil–Sen recovers a straight log trend exactly", () => {
    const ys = [0, 0.1, 0.2, 0.3].map((v) => v + 5);
    const { slope, intercept } = theilSen(ys);
    expect(slope).toBeCloseTo(0.1, 12);
    expect(intercept).toBeCloseTo(5, 12);
  });

  it("B1 and C1 parts add up to the changes they break down, on random companies", () => {
    const rand = mulberry32(99);
    for (let i = 0; i < 100; i++) {
      const prevR = rec({
        fiscalYear: "2025年3月期",
        periodEnd: "2025-03-31",
        revenue: 1e9 + rand() * 1e11,
        profit: (rand() - 0.2) * 1e10,
        netIncome: (rand() - 0.2) * 8e9,
        totalAssets: 1e10 + rand() * 1e11,
        netAssets: 5e9 + rand() * 5e10,
      });
      const latestR = rec({
        revenue: 1e9 + rand() * 1e11,
        profit: (rand() - 0.2) * 1e10,
        netIncome: (rand() - 0.2) * 8e9,
        totalAssets: 1e10 + rand() * 1e11,
        netAssets: 5e9 + rand() * 5e10,
      });
      const c = company(`rand${i}`, "retail", [prevR, latestR]);
      const b1 = runDecompModule("b1", c, [c]);
      expect(rowOf(b1, "b1-net-income")!.value + rowOf(b1, "b1-other-change")!.value).toBeCloseTo(rowOf(b1, "b1-net-assets-change")!.value, 3);
      const c1 = runDecompModule("c1", c, [c]);
      const parts = rowOf(c1, "c1-equity-contribution")!.value + rowOf(c1, "c1-liability-contribution")!.value;
      expect(parts).toBeCloseTo(rowOf(c1, "c1-asset-growth")!.value, 12);
    }
  });
});

describe("display conditions (suppressed whole, never approximated)", () => {
  const pair = (over0: Partial<FinancialRecord> = {}, over1: Partial<FinancialRecord> = {}): FinancialRecord[] => [
    rec({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 800, netAssets: 700, ...over0 }),
    rec({ ...over1 }),
  ];

  it("excludes finance from A1 and C1 but not from B1", () => {
    const bank = company("bank", "finance", pair());
    expect(runDecompModule("a1", bank, [bank]).status).toBe("suppressed");
    expect(runDecompModule("c1", bank, [bank]).status).toBe("suppressed");
    expect(runDecompModule("b1", bank, [bank]).status).toBe("ok");
  });

  it("suppresses a pair across an accounting-standard change", () => {
    const c = company("sw", "retail", pair({ accountingStandard: "ifrs" }));
    expect(runDecompModule("a1", c, [c]).status).toBe("suppressed");
    expect(runDecompModule("b1", c, [c]).status).toBe("suppressed");
  });

  it("suppresses a pair whose profit lines are of different kinds", () => {
    const c = company("pk", "retail", pair({ profitLabel: "税引前利益" }));
    expect(runDecompModule("a1", c, [c]).status).toBe("suppressed");
  });

  it("suppresses a fiscal period shorter than twelve months", () => {
    const c = company("short", "retail", [
      rec({ fiscalYear: "2025年12月期", periodEnd: "2025-12-31", revenue: 800, netAssets: 700 }),
      rec({ fiscalYear: "2026年9月期", periodEnd: "2026-09-30" }),
    ]);
    expect(runDecompModule("a1", c, [c]).status).toBe("suppressed");
    expect(runDecompModule("c1", c, [c]).status).toBe("suppressed");
  });

  it("A2 needs ten companies with both years, and states the leave-one-out gap", () => {
    const members = Array.from({ length: 12 }, (_, i) =>
      company(`m${i}`, "retail", pair({ revenue: 800 + i * 10 }, { revenue: 1000 + i * 100 })),
    );
    expect(runDecompModule("a2", members[0]!, members.slice(0, 9)).status).toBe("suppressed");
    const r = runDecompModule("a2", members[0]!, members);
    expect(r.status).toBe("ok");
    // Own growth is 1000/800 − 1 = 25%; the other eleven grow from 9,460 to 17,600 (≈86%), so the gap is negative.
    expect(rowOf(r, "a2-relative-growth")!.value).toBeLessThan(0);
    expect(rowOf(r, "a2-revenue-share")!.value).toBeCloseTo(1000 / 18_600, 10);
    expect(ok(r).note).toContain("HHI");
  });

  it("E1 refuses a series with a jump past ±30%", () => {
    const jumped = company("jump", "machinery", [
      ...MISUMI.slice(0, 4).map(([revenue, profit, netIncome, totalAssets, netAssets], i) =>
        rec({ fiscalYear: `${2022 + i}年3月期`, periodEnd: `${2022 + i}-03-31`, revenue, profit, netIncome, totalAssets, netAssets }),
      ),
      rec({ revenue: 700_000_000_000 }),
    ]);
    expect(runDecompModule("e1", jumped, [jumped]).status).toBe("suppressed");
  });

  it("D1 drops only the incremental row when equity has not grown enough", () => {
    const flat = company(
      "flat",
      "machinery",
      [0, 1, 2, 3, 4].map((i) =>
        rec({ fiscalYear: `${2022 + i}年3月期`, periodEnd: `${2022 + i}-03-31`, netIncome: 50 + i, netAssets: 800 }),
      ),
    );
    const r = runDecompModule("d1", flat, [flat]);
    expect(r.status).toBe("ok");
    expect(rowOf(r, "d1-pooled-roe")).toBeDefined();
    expect(rowOf(r, "d1-incremental-roe")).toBeUndefined();
  });

  it("D1 is suppressed when a year's net assets are not positive", () => {
    const neg = company(
      "neg",
      "machinery",
      [0, 1, 2, 3, 4].map((i) =>
        rec({ fiscalYear: `${2022 + i}年3月期`, periodEnd: `${2022 + i}-03-31`, netAssets: i === 2 ? -10 : 800 }),
      ),
    );
    expect(runDecompModule("d1", neg, [neg]).status).toBe("suppressed");
  });

  it("B1 shows amounts without the buildup ratio when the ratio leaves its range", () => {
    const c = company("range", "retail", pair({ netAssets: 100 }, { netIncome: 1, netAssets: 800 }));
    const r = runDecompModule("b1", c, [c]);
    expect(r.status).toBe("ok");
    expect(rowOf(r, "b1-net-assets-change")!.value).toBe(700);
    expect(rowOf(r, "b1-buildup-ratio")).toBeUndefined();
  });
});

describe("A3 segment contribution (JCE-097)", () => {
  const segCompany = (over: { current?: [string, number][]; prior?: [string, number][]; revenue1?: number; priorEnd?: string } = {}): Company =>
    ({
      ...company("seg-fixture", "machinery", [
        rec({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31", revenue: 1000 }),
        rec({ revenue: over.revenue1 ?? 1200 }),
      ]),
      businesses: [
        { id: "alpha", name: "アルファ事業" },
        { id: "beta", name: "ベータ事業" },
        { id: "gamma", name: "ガンマ事業" },
        { id: "other", name: "その他" },
      ],
      segmentRevenue: {
        fiscalYear: "2026年3月期",
        periodEnd: "2026-03-31",
        label: "外部顧客への売上高",
        items: (over.current ?? [["alpha", 700], ["beta", 380], ["other", 100]]).map(([businessId, amount]) => ({ businessId, amount })),
        previous: {
          fiscalYear: "2025年3月期",
          periodEnd: over.priorEnd ?? "2025-03-31",
          items: (over.prior ?? [["alpha", 600], ["beta", 300], ["other", 90]]).map(([businessId, amount]) => ({ businessId, amount })),
        },
        sourceIds: ["s"],
        locator: "【セグメント情報】",
      },
      sources: [{ id: "s" }],
    }) as unknown as Company;

  it("splits the revenue change into per-business contributions in points, with the adjustment as its own row", () => {
    const r = runDecompModule("a3", segCompany(), [segCompany()]);
    expect(rowOf(r, "a3-alpha")!.value).toBeCloseTo(0.1, 12);
    expect(rowOf(r, "a3-beta")!.value).toBeCloseTo(0.08, 12);
    expect(rowOf(r, "a3-other")!.value).toBeCloseTo(0.01, 12);
    expect(rowOf(r, "a3-revenue-change")!.value).toBe(200);
    expect(rowOf(r, "a3-adjustment")!.value).toBe(10);
    expect(ok(r).rows.map((row) => row.key)).toEqual(["a3-alpha", "a3-beta", "a3-other", "a3-revenue-change", "a3-adjustment"]);
  });

  it("property: the contributions over the prior revenue, plus the adjustment, add up to the revenue change", () => {
    const c = segCompany();
    const g = ok(runDecompModule("a3", c, [c]));
    const parts = g.rows.filter((row) => row.unit === "points").reduce((a, row) => a + row.value * 1000, 0);
    const adjustment = g.rows.find((row) => row.key === "a3-adjustment")!.value;
    expect(parts + adjustment).toBe(200);
  });

  it("omits the adjustment row when the common businesses explain the whole change", () => {
    const c = segCompany({ prior: [["alpha", 600], ["beta", 300], ["other", 80]] });
    const r = runDecompModule("a3", c, [c]);
    expect(r.status).toBe("ok");
    expect(rowOf(r, "a3-adjustment")).toBeUndefined();
  });

  it("puts a business that exists in only one year into the adjustment, and says so", () => {
    const c = segCompany({ current: [["alpha", 700], ["beta", 380], ["gamma", 50], ["other", 100]] });
    const g = ok(runDecompModule("a3", c, [c]));
    expect(g.rows.some((row) => row.key === "a3-gamma")).toBe(false);
    expect(g.note).toContain("片方の期にしかない事業");
  });

  it("is suppressed without a prior-year column, with fewer than two common businesses, or on a year mismatch", () => {
    const bare = company("bare", "machinery", [rec({ fiscalYear: "2025年3月期", periodEnd: "2025-03-31" }), rec({})]);
    expect(runDecompModule("a3", bare, [bare]).status).toBe("suppressed");
    const oneCommon = segCompany({ prior: [["alpha", 600], ["gamma", 300]] });
    expect(runDecompModule("a3", oneCommon, [oneCommon]).status).toBe("suppressed");
    const mismatch = segCompany({ priorEnd: "2024-03-31" });
    expect(runDecompModule("a3", mismatch, [mismatch]).status).toBe("suppressed");
  });
});

describe("real data reconciliation", () => {
  it("computes every module for the registered Misumi entry", () => {
    const released = companies.filter(isReleased);
    const target = released.find((c) => c.id === "misumi-group")!;
    expect(target).toBeDefined();
    for (const id of ["a1", "a2", "a3", "b1", "c1", "e1", "f2", "f3", "d1", "f1", "a-full", "b2", "d2"]) {
      expect(runDecompModule(id, target, released).status, id).toBe("ok");
    }
  });
});

/* ---------- Phase 2 detail modules (JCE-098) ---------- */

const line = (role: StatementLine["role"], amount: number, label: string = role): StatementLine => ({ role, label, amount });

/**
 * Misumi's printed statement lines for 2025年3月期 → 2026年3月期 (yen), copied from its filings as
 * registered — the golden values below are hand-computed from these figures, so they stay fixed
 * even when the registered data moves on to a newer filing.
 */
const MISUMI_STMT: { prev: FinancialStatements; latest: FinancialStatements } = {
  prev: {
    fiscalYear: "2025年3月期",
    periodEnd: "2025-03-31",
    accountingStandard: "jgaap",
    docId: "S100YB3N",
    sourceIds: ["s"],
    incomeStatement: [
      line("revenue", 401_987_000_000),
      line("gross-profit", 186_990_000_000),
      line("selling-general-and-administrative-expenses", 140_509_000_000),
      line("operating-income", 46_480_000_000),
      line("income-before-income-taxes", 49_940_000_000),
      line("income-taxes", 13_285_000_000),
      line("net-income", 36_654_000_000),
      line("non-controlling-interests", 105_000_000),
      line("net-income-attributable-to-parent", 36_549_000_000),
    ],
    balanceSheet: [
      line("cash-and-deposits", 159_296_000_000),
      line("total-assets", 419_574_000_000),
      line("share-capital", 14_483_000_000),
      line("capital-surplus", 24_585_000_000),
      line("treasury-shares", -28_352_000_000),
      line("accumulated-other-comprehensive-income", 45_020_000_000),
      line("non-controlling-interests", 1_116_000_000),
      line("total-net-assets", 352_064_000_000),
    ],
  },
  latest: {
    fiscalYear: "2026年3月期",
    periodEnd: "2026-03-31",
    accountingStandard: "jgaap",
    docId: "S100YB3N",
    sourceIds: ["s"],
    incomeStatement: [
      line("revenue", 441_383_000_000),
      line("gross-profit", 206_015_000_000),
      line("selling-general-and-administrative-expenses", 158_402_000_000),
      line("operating-income", 47_613_000_000),
      line("income-before-income-taxes", 48_498_000_000),
      line("income-taxes", 7_873_000_000),
      line("net-income", 40_625_000_000),
      line("non-controlling-interests", 167_000_000),
      line("net-income-attributable-to-parent", 40_457_000_000),
    ],
    balanceSheet: [
      line("cash-and-deposits", 112_941_000_000),
      line("total-assets", 464_969_000_000),
      line("share-capital", 14_727_000_000),
      line("capital-surplus", 24_721_000_000),
      line("treasury-shares", -52_392_000_000),
      line("accumulated-other-comprehensive-income", 70_094_000_000),
      line("non-controlling-interests", 1_383_000_000),
      line("total-net-assets", 382_509_000_000),
    ],
  },
};

const stmtCompany = (
  id: string,
  industry: IndustryId,
  prev: FinancialStatements,
  latest: FinancialStatements,
  over: Partial<Company> = {},
): Company =>
  ({
    ...company(id, industry, [
      rec({ fiscalYear: prev.fiscalYear, periodEnd: prev.periodEnd, revenue: 1000, totalAssets: 2000, netAssets: 800 }),
      rec({ fiscalYear: latest.fiscalYear, periodEnd: latest.periodEnd, revenue: 1200, totalAssets: 2200, netAssets: 900 }),
    ]),
    financialStatements: [prev, latest],
    ...over,
  }) as unknown as Company;

const misumiStmt = stmtCompany("misumi-stmt", "machinery", MISUMI_STMT.prev, MISUMI_STMT.latest);

describe("golden values, Phase 2 (Misumi statements, hand-computed from the printed lines)", () => {
  it("A-full splits the operating-income change into revenue, gross-margin and SG&A effects", () => {
    const r = runDecompModule("a-full", misumiStmt, [misumiStmt]);
    expect(rowOf(r, "a-full-revenue-effect")!.value).toBeCloseTo(4_402_462_246, -2);
    expect(rowOf(r, "a-full-gross-effect")!.value).toBeCloseTo(668_175_185, -2);
    expect(rowOf(r, "a-full-sga-effect")!.value).toBeCloseTo(-3_938_686_433, -2);
    // The residue of the lines' own rounding is its own row, never absorbed into an effect.
    expect(rowOf(r, "a-full-residual")!.value).toBeCloseTo(1_049_002, -2);
    expect(rowOf(r, "a-full-op-change")!.value).toBe(1_133_000_000);
  });

  it("B2 opens B1's residual into the balance sheet's own sections", () => {
    const r = runDecompModule("b2", misumiStmt, [misumiStmt]);
    expect(rowOf(r, "b2-net-assets-change")!.value).toBe(30_445_000_000);
    expect(rowOf(r, "b2-net-income")!.value).toBe(40_457_000_000);
    expect(rowOf(r, "b2-net-income")!.kind).toBe("printed");
    expect(rowOf(r, "b2-aoci-change")!.value).toBe(25_074_000_000);
    expect(rowOf(r, "b2-capital-change")!.value).toBe(380_000_000);
    expect(rowOf(r, "b2-treasury-change")!.value).toBe(-24_040_000_000);
    expect(rowOf(r, "b2-nci-change")!.value).toBe(267_000_000);
    expect(rowOf(r, "b2-residual")!.value).toBe(-11_693_000_000);
    expect(ok(r).note).toContain("1%を超えています");
  });

  it("D2 reads the incremental return on the capital Misumi added, with no funding rate where there is no debt", () => {
    const r = runDecompModule("d2", misumiStmt, [misumiStmt]);
    expect(rowOf(r, "d2-incremental-roic")!.value).toBeCloseTo(0.0751073, 6);
    expect(rowOf(r, "d2-nopat-change")!.value).toBeCloseTo(5_768_241_371, -2);
    expect(rowOf(r, "d2-ic-change")!.value).toBe(76_800_000_000);
    expect(rowOf(r, "d2-funding-rate")).toBeUndefined();
  });
});

/** A small synthetic filer with debt and a printed interest line, for D2's funding rate and the exact-zero cases. */
const syntheticStmt = (over: { prev?: Partial<FinancialStatements>; latest?: Partial<FinancialStatements> } = {}): Company => {
  const prev: FinancialStatements = {
    fiscalYear: "2025年3月期",
    periodEnd: "2025-03-31",
    accountingStandard: "jgaap",
    sourceIds: ["s"],
    incomeStatement: [
      line("revenue", 10_000),
      line("gross-profit", 4_000),
      line("selling-general-and-administrative-expenses", 3_000),
      line("operating-income", 1_000),
      line("income-before-income-taxes", 1_000),
      line("income-taxes", 300),
      line("net-income", 700),
    ],
    balanceSheet: [
      line("cash-and-deposits", 200),
      line("long-term-borrowings", 500),
      line("share-capital", 500),
      line("capital-surplus", 100),
      line("total-net-assets", 1_000),
    ],
    ...over.prev,
  };
  const latest: FinancialStatements = {
    fiscalYear: "2026年3月期",
    periodEnd: "2026-03-31",
    accountingStandard: "jgaap",
    sourceIds: ["s"],
    incomeStatement: [
      line("revenue", 12_000),
      line("gross-profit", 5_100),
      line("selling-general-and-administrative-expenses", 3_600),
      line("operating-income", 1_500),
      line("non-operating-expense-item", 15, "支払利息"),
      line("income-before-income-taxes", 1_500),
      line("income-taxes", 450),
      line("net-income", 1_050),
    ],
    balanceSheet: [
      line("cash-and-deposits", 200),
      line("long-term-borrowings", 800),
      line("share-capital", 500),
      line("capital-surplus", 100),
      line("total-net-assets", 1_300),
    ],
    ...over.latest,
  };
  return stmtCompany("synthetic-stmt", "machinery", prev, latest);
};

describe("Phase 2 properties and display conditions", () => {
  it("A-full's effects are exact, with a zero residue, when operating income is gross profit minus SG&A", () => {
    const rand = mulberry32(5);
    for (let i = 0; i < 200; i++) {
      const r0 = 1 + rand() * 1e12;
      const r1 = 1 + rand() * 1e12;
      const gp0 = rand() * r0 * 0.6;
      const gp1 = rand() * r1 * 0.6;
      const s0 = rand() * r0 * 0.4;
      const s1 = rand() * r1 * 0.4;
      const d = bennetAFull(r0, gp0, s0, gp0 - s0, r1, gp1, s1, gp1 - s1);
      expect(d.residual).toBeCloseTo(0, 3);
      expect(d.revenueEffect + d.grossEffect + d.sgaEffect).toBeCloseTo(d.opChange, 3);
    }
  });

  it("D2 prices the increment at the clipped tax rate and compares it with the printed funding rate", () => {
    const c = syntheticStmt();
    const r = runDecompModule("d2", c, [c]);
    expect(rowOf(r, "d2-ic-change")!.value).toBe(600);
    expect(rowOf(r, "d2-nopat-change")!.value).toBeCloseTo(350, 9);
    expect(rowOf(r, "d2-incremental-roic")!.value).toBeCloseTo(350 / 600, 12);
    expect(rowOf(r, "d2-funding-rate")!.value).toBeCloseTo(15 / 650, 12);
    expect(ok(r).note).toContain("上回っています");
  });

  it("B2's residual is zero when the named sections explain the whole change, and the NCI row is omitted without NCI", () => {
    const c = syntheticStmt();
    const r = runDecompModule("b2", c, [c]);
    expect(rowOf(r, "b2-residual")!.value).toBe(-750);
    expect(rowOf(r, "b2-nci-change")).toBeUndefined();
    const explained = syntheticStmt({
      latest: {
        balanceSheet: [
          line("cash-and-deposits", 200),
          line("long-term-borrowings", 800),
          line("share-capital", 500),
          line("capital-surplus", 100),
          line("total-net-assets", 1_750),
        ],
      },
    });
    // ΔE = 750 = net income 1,050 with everything else flat except a −300 movement the formula
    // cannot name; give the year a matching AOCI line instead and the residual closes.
    const withAoci = stmtCompany("explained", "machinery", explained.financialStatements![0]!, {
      ...explained.financialStatements![1]!,
      balanceSheet: [...explained.financialStatements![1]!.balanceSheet, line("accumulated-other-comprehensive-income", -300)],
    });
    expect(rowOf(runDecompModule("b2", withAoci, [withAoci]), "b2-residual")!.value).toBe(0);
  });

  it("suppresses all three modules on a single statement year and on a docId mismatch", () => {
    const single = stmtCompany("single", "machinery", MISUMI_STMT.prev, MISUMI_STMT.latest, {
      financialStatements: [MISUMI_STMT.latest],
    });
    for (const id of ["a-full", "b2", "d2"]) expect(runDecompModule(id, single, [single]).status).toBe("suppressed");
    const mixed = stmtCompany("mixed", "machinery", MISUMI_STMT.prev, { ...MISUMI_STMT.latest, docId: "S100ZZZZ" });
    for (const id of ["a-full", "b2", "d2"]) expect(runDecompModule(id, mixed, [mixed]).status).toBe("suppressed");
  });

  it("A-full is suppressed when SG&A is missing in one year or the P/L form changes between years", () => {
    const noSga = stmtCompany("nosga", "machinery", MISUMI_STMT.prev, {
      ...MISUMI_STMT.latest,
      incomeStatement: MISUMI_STMT.latest.incomeStatement.filter((l) => l.role !== "selling-general-and-administrative-expenses"),
    });
    expect(runDecompModule("a-full", noSga, [noSga]).status).toBe("suppressed");
    const ogpPrev: FinancialStatements = {
      ...MISUMI_STMT.prev,
      incomeStatement: [
        line("revenue", 401_987_000_000),
        line("gross-profit", 180_000_000_000),
        line("other-operating-revenue-item", 6_990_000_000),
        line("operating-gross-profit", 186_990_000_000),
        line("selling-general-and-administrative-expenses", 140_509_000_000),
        line("operating-income", 46_480_000_000),
      ],
    };
    const formChanged = stmtCompany("form", "machinery", ogpPrev, MISUMI_STMT.latest);
    expect(runDecompModule("a-full", formChanged, [formChanged]).status).toBe("suppressed");
    const ogpBoth = stmtCompany("ogp", "machinery", ogpPrev, {
      ...MISUMI_STMT.latest,
      incomeStatement: [
        line("revenue", 441_383_000_000),
        line("gross-profit", 198_000_000_000),
        line("other-operating-revenue-item", 8_015_000_000),
        line("operating-gross-profit", 206_015_000_000),
        line("selling-general-and-administrative-expenses", 158_402_000_000),
        line("operating-income", 47_613_000_000),
      ],
    });
    const ogpResult = runDecompModule("a-full", ogpBoth, [ogpBoth]);
    expect(ogpResult.status).toBe("ok");
    expect(ok(ogpResult).note).toContain("営業総利益");
  });

  it("D2 is suppressed for finance, for a shrinking capital base, for a small increment and for a pre-tax loss", () => {
    const bank = stmtCompany("bank-stmt", "finance", MISUMI_STMT.prev, MISUMI_STMT.latest);
    expect(runDecompModule("d2", bank, [bank]).status).toBe("suppressed");
    const shrinking = syntheticStmt({
      latest: {
        balanceSheet: [
          line("cash-and-deposits", 200),
          line("long-term-borrowings", 100),
          line("share-capital", 500),
          line("capital-surplus", 100),
          line("total-net-assets", 900),
        ],
      },
    });
    expect(runDecompModule("d2", shrinking, [shrinking]).status).toBe("suppressed");
    const small = syntheticStmt({
      latest: {
        balanceSheet: [
          line("cash-and-deposits", 200),
          line("long-term-borrowings", 520),
          line("share-capital", 500),
          line("capital-surplus", 100),
          line("total-net-assets", 1_010),
        ],
      },
    });
    expect(runDecompModule("d2", small, [small]).status).toBe("suppressed");
    const loss = syntheticStmt({
      latest: {
        incomeStatement: [
          line("revenue", 12_000),
          line("gross-profit", 5_100),
          line("selling-general-and-administrative-expenses", 3_600),
          line("operating-income", 1_500),
          line("income-before-income-taxes", -100),
          line("income-taxes", 450),
          line("net-income", 1_050),
        ],
      },
    });
    expect(runDecompModule("d2", loss, [loss]).status).toBe("suppressed");
  });
});
