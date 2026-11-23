import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

/**
 * JCE-095: a filing can shorten a row label by dropping the loss alternative —
 * クラウディアホールディングス prints 「経常利益又は経常損失（△）」 in its 第49期 report and
 * just 「経常利益」 in its 第50期. verify-financials runs as a subprocess against a
 * fixture evidence pack whose indicators.txt prints the SHORT labels, while the
 * entry keeps the LONG labels it was registered with. Only that trailing
 * 「又は…（△）」 difference is forgiven; every other wording difference still fails.
 */

const COMPANY = "label-fixture";
const PERIOD_END = "2026-08-31";

const summary = {
  filing: { filerName: "株式会社テスト", docDescription: "有価証券報告書－第2期", docID: "TESTDOC" },
  figures: {
    revenue: [{ element: "NetSales", label: "売上高", years: [{ fiscalYearEnd: PERIOD_END, yen: 1_000_000_000 }] }],
    netIncome: [
      { element: "NI", label: "親会社株主に帰属する当期純利益", years: [{ fiscalYearEnd: PERIOD_END, yen: 100_000_000 }] },
    ],
    profit: [{ element: "OI", label: "経常利益", years: [{ fiscalYearEnd: PERIOD_END, value: 200_000_000 }] }],
    totalAssets: [{ element: "TA", label: "総資産", years: [{ fiscalYearEnd: PERIOD_END, value: 5_000_000_000 }] }],
    netAssets: [{ element: "NA", label: "純資産", years: [{ fiscalYearEnd: PERIOD_END, value: 2_000_000_000 }] }],
    employees: [{ element: "EMP", label: "従業員数", years: [{ fiscalYearEnd: PERIOD_END, value: 100 }] }],
    nonConsolidated: false,
  },
  warnings: [],
};

/** The table as the newer filing prints it: short labels, no loss alternative. */
const SHORT_TABLE =
  "（１）連結経営指標等 回次第2期 決算年月2026年８月 売上高（百万円）1,000 経常利益（百万円）200 " +
  "親会社株主に帰属する当期純利益（百万円）100 総資産（百万円）5,000 純資産（百万円）2,000";

/** The same table in the older filing's wording: the loss alternative is printed. */
const LONG_TABLE =
  "（１）連結経営指標等 回次第1期 決算年月2025年８月 売上高（百万円）900 経常利益又は経常損失（△）（百万円）150 " +
  "親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）（百万円）80 総資産（百万円）4,800 純資産（百万円）1,900";

const entryWith = (over: Record<string, unknown>) => ({
  financials: [
    {
      fiscalYear: "2026年8月期",
      periodEnd: PERIOD_END,
      revenue: 1_000_000_000,
      revenueLabel: "売上高",
      profit: 200_000_000,
      profitLabel: "経常利益又は経常損失（△）",
      netIncome: 100_000_000,
      netIncomeLabel: "親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）",
      totalAssets: 5_000_000_000,
      totalAssetsLabel: "総資産",
      netAssets: 2_000_000_000,
      netAssetsLabel: "純資産",
      employees: 100,
      ...over,
    },
  ],
});

let workDir: string | null = null;
afterEach(() => {
  if (workDir) rmSync(workDir, { recursive: true, force: true });
  workDir = null;
});

function run(entry: unknown, indicators: string): { code: number; stderr: string } {
  workDir = mkdtempSync(join(process.cwd(), ".tmp-verify-financials-"));
  const packDir = join(workDir, "cache", "evidence", COMPANY);
  mkdirSync(packDir, { recursive: true });
  writeFileSync(join(packDir, "summary.json"), JSON.stringify(summary));
  writeFileSync(join(packDir, "indicators.txt"), indicators);
  const entryPath = join(workDir, "entry.json");
  writeFileSync(entryPath, JSON.stringify(entry));
  try {
    execFileSync("node", ["scripts/research/verify-financials.mjs", COMPANY, "--entry", relative(process.cwd(), entryPath)], {
      cwd: process.cwd(),
      env: { ...process.env, RESEARCH_CACHE: join(workDir, "cache") },
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, stderr: "" };
  } catch (e) {
    const err = e as { status?: number; stderr?: Buffer };
    return { code: err.status ?? -1, stderr: err.stderr?.toString() ?? "" };
  }
}

describe("verify-financials label check (JCE-095)", () => {
  it("accepts a stored long label when the new filing prints the shortened row", () => {
    const r = run(entryWith({}), SHORT_TABLE);
    expect(r.code, r.stderr).toBe(0);
  });

  it("still accepts the long label when the filing prints it in full", () => {
    const r = run(entryWith({}), LONG_TABLE);
    expect(r.code, r.stderr).toBe(0);
  });

  it("rejects an alternative that does not end in （△）", () => {
    const r = run(entryWith({ profitLabel: "経常利益又は経常損失" }), SHORT_TABLE);
    expect(r.code).toBe(1);
    expect(r.stderr).toContain("経常利益又は経常損失");
  });

  it("rejects a different row that merely shares the suffix shape", () => {
    const r = run(entryWith({ profitLabel: "営業利益又は営業損失（△）" }), SHORT_TABLE);
    expect(r.code).toBe(1);
    expect(r.stderr).toContain("営業利益又は営業損失（△）");
  });

  it("rejects the suffix when it is not at the very end of the label", () => {
    const r = run(entryWith({ profitLabel: "経常利益又は経常損失（△）等" }), SHORT_TABLE);
    expect(r.code).toBe(1);
    expect(r.stderr).toContain("経常利益又は経常損失（△）等");
  });
});
