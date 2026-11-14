import { describe, expect, it } from "vitest";
import { allTargets, extractInterim, latestHalf, planInterim, sourceFor } from "../scripts/pipeline/interim-financials.mjs";
import { loadEntries } from "../scripts/pipeline/jobs.mjs";
import type { InterimRecord } from "../src/types/company";

type Extracted = { current: InterimRecord; prior: InterimRecord | null; docID: string };
const extract = (rows: object[], ids: { docID: string; sourceId: string }) => extractInterim(rows, ids) as Extracted | null;

/** The 半期報告書 reader: the half's cumulative figures and the previous year's half, each cited to the filing. */

const row = (element: string, context: string, value: string | number, name: string, period = "") => ({
  要素ID: element,
  項目名: name,
  コンテキストID: context,
  相対年度: "",
  "期間・時点": period,
  単位: typeof value === "number" ? "円" : "",
  値: String(value),
});

const rows = [
  row("jpdei_cor:AccountingStandardsDEI", "FilingDateInstant", "Japan GAAP", "会計基準、DEI"),
  row("jpdei_cor:WhetherConsolidatedFinancialStatementsArePreparedDEI", "FilingDateInstant", "true", "連結決算の有無、DEI"),
  row("jpdei_cor:CurrentFiscalYearStartDateDEI", "FilingDateInstant", "2025-04-01", "当事業年度開始日、DEI"),
  row("jpdei_cor:CurrentPeriodEndDateDEI", "FilingDateInstant", "2025-09-30", "当会計期間終了日、DEI"),
  row("jpdei_cor:CurrentFiscalYearEndDateDEI", "FilingDateInstant", "2026-03-31", "当事業年度終了日、DEI"),
  row("jpcrp_cor:NetSalesSummaryOfBusinessResults", "CurrentYTDDuration", 5_000_000_000, "売上高、経営指標等", "2025-04-01 〜 2025-09-30"),
  row("jpcrp_cor:NetSalesSummaryOfBusinessResults", "Prior1YTDDuration", 4_500_000_000, "売上高、経営指標等", "2024-04-01 〜 2024-09-30"),
  row("jpcrp_cor:NetSalesSummaryOfBusinessResults", "Prior1YearDuration", 9_800_000_000, "売上高、経営指標等"),
  row("jpcrp_cor:OrdinaryIncomeLossSummaryOfBusinessResults", "CurrentYTDDuration", 400_000_000, "経常利益又は経常損失（△）、経営指標等"),
  row("jpcrp_cor:OrdinaryIncomeLossSummaryOfBusinessResults", "Prior1YTDDuration", -50_000_000, "経常利益又は経常損失（△）、経営指標等"),
  row("jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults", "CurrentYTDDuration", 300_000_000, "親会社株主に帰属する中間純利益、経営指標等"),
  row("jpcrp_cor:NetSalesSummaryOfBusinessResults", "CurrentYTDDuration_NonConsolidatedMember", 1, "売上高、経営指標等"),
];

describe("extractInterim", () => {
  it("reads the current half and the previous year's half from the summary table, consolidated rows only", () => {
    const x = extract(rows, { docID: "S100TEST", sourceId: "hanki-202509" })!;
    expect(x.current).toMatchObject({
      fiscalYear: "2026年3月期",
      period: "H1",
      periodStart: "2025-04-01",
      periodEnd: "2025-09-30",
      revenue: 5_000_000_000,
      revenueLabel: "売上高",
      profit: 400_000_000,
      profitLabel: "経常利益又は経常損失（△）",
      netIncome: 300_000_000,
      netIncomeLabel: "親会社株主に帰属する中間純利益",
      accountingStandard: "jgaap",
      sourceIds: ["hanki-202509"],
    });
    expect(x.prior).toMatchObject({ fiscalYear: "2025年3月期", periodStart: "2024-04-01", periodEnd: "2024-09-30", revenue: 4_500_000_000, profit: -50_000_000, netIncome: null });
    expect(x.current).not.toHaveProperty("note");
  });

  it("falls back to the parent-company table only when the filer has no consolidated statements", () => {
    const solo = rows.map((r) => (r.要素ID.endsWith("ArePreparedDEI") ? { ...r, 値: "false" } : r));
    const x = extract(solo, { docID: "S100TEST", sourceId: "s" })!;
    expect(x.current.revenue).toBe(1);
    expect(x.current.note).toMatch(/提出会社単体/);
  });

  it("gives nothing when no top line is tagged", () => {
    expect(extract(rows.slice(0, 5), { docID: "S100TEST", sourceId: "s" })).toBeNull();
  });
});

describe("planInterim", () => {
  const filing = { docID: "S100TEST", docTypeCode: "160", submitted: "2025-11-14", periodEnd: "2025-09-30", filerName: "x" };
  const source = sourceFor(filing, "2025-11-15");
  const x = extract(rows, { docID: "S100TEST", sourceId: source.id })!;

  it("adds both halves to an entry without any, oldest first, with the filing as a new source", () => {
    const plan = planInterim({ sources: [], interimFinancials: undefined }, x, filing, source);
    expect(plan.added).toHaveLength(2);
    expect(plan.next.map((h: InterimRecord) => h.periodEnd)).toEqual(["2024-09-30", "2025-09-30"]);
    expect(plan.sources.map((s: { id: string }) => s.id)).toEqual(["hanki-202509"]);
    expect(source).toMatchObject({ title: "半期報告書（2025年9月中間期）", docId: "S100TEST", asOf: "2025-09-30", publisher: "EDINET（金融庁）" });
  });

  it("keeps a half already held, and replaces it only for a 訂正 of a later filing", () => {
    const held = { sources: [source], interimFinancials: [x.prior!] };
    const plan = planInterim(held, x, filing, source);
    expect(plan.added.map((h: InterimRecord) => h.periodEnd)).toEqual(["2025-09-30"]);
    const amended = { ...filing, docID: "S100AMND", docTypeCode: "170" };
    const amendedSource = { ...sourceFor(amended, "2025-12-01"), id: "hanki-202509-2" };
    const y = extract(rows, { docID: "S100AMND", sourceId: amendedSource.id })!;
    const plan2 = planInterim({ sources: [source], interimFinancials: plan.next }, y, amended, amendedSource);
    expect(plan2.added).toHaveLength(0);
    expect(plan2.replaced).toHaveLength(2);
    expect(plan2.next.every((h: InterimRecord) => h.sourceIds[0] === "hanki-202509-2")).toBe(true);
  });

  it("knows the newest half an entry holds", () => {
    expect(latestHalf({})).toBe("");
    expect(latestHalf({ interimFinancials: [x.prior, x.current] })).toBe("2025-09-30");
  });
});

describe("allTargets", () => {
  it("takes the published companies from the entries as loadEntries gives them", () => {
    expect(allTargets([{ id: "a", tier: "published" }, { id: "b", tier: "figures-only" }])).toEqual(["a"]);
    // Against the real data: --all must find companies, not an empty list (the bug of 2026-11-14).
    expect(allTargets(loadEntries()).length).toBeGreaterThan(500);
  });
});
