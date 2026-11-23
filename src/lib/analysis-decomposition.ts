import { median } from "@/lib/industry-figures";
import { industryPosition, PEER_WINDOW_DAYS, profitLineKind, type IndustryPosition } from "@/lib/report-metrics";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";
import type { AnalysisGroup, AnalysisPerspectiveId, AnalysisRow } from "@/lib/company-analysis";

/**
 * The decomposition layer of the analysis SaaS (JCE-096, Phase 1): the macro-style decompositions of the
 * operator's 分析システム提案 (完全版仕様) as pure functions over the printed five-year records — A1 増益分解
 * (Bennet midpoint), A2 業界成長への寄与度 (leave-one-out), B1 純資産の増減分解, C1 資産増減の調達内訳,
 * E1 トレンド乖離 (Theil–Sen extrapolation), F2 利益率の安定性, F3 成長の資産効率, and — under the operator's
 * 2026-11-23 decision recorded in JCE-096 — D1 純資産利益率 and F1 DuPont/Shapley, which live only in this
 * analysis layer, labelled 計算値 like every computed row here.
 *
 * The family rules are the report layer's: a module whose inputs are not all printed, or whose two periods are
 * not comparable (a different accounting standard, a different revenue scope, a fiscal period shorter than
 * twelve months), is suppressed whole — never approximated, never filled in. A suppressed module's reason is
 * kept on the registry for tests and administration and is never shown to readers. Nothing is stored: the
 * values are computed at static generation, like the rest of the analysis layer. No score, no grade, no
 * verdict — a decomposition states how a change is made up, never whether it is good.
 */

export type DecompResult = { status: "ok"; group: AnalysisGroup } | { status: "suppressed"; reason: string };

const suppressed = (reason: string): DecompResult => ({ status: "suppressed", reason });

type Ctx = {
  /** Comparable peers of the primary industry, this company included (the report layer's peer set). */
  peers: Company[];
  /** The company's primary industry is finance (銀行・保険・証券・その他金融). */
  finance: boolean;
};

export type DecompModuleDef = {
  id: string;
  version: number;
  title: string;
  perspectives: AnalysisPerspectiveId[];
  kind: "calculated" | "estimated";
  run: (company: Company, ctx: Ctx) => DecompResult;
};

/* ---------- shared preprocessing ---------- */

const byPeriod = (records: FinancialRecord[]): FinancialRecord[] => [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
const latestOf = (c: Company): FinancialRecord | undefined => byPeriod(c.financials).at(-1);

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

/** The same peer set the report's distributions rest on: primary industry, latest year within the window. */
function comparablePeers(company: Company, companies: Company[]): Company[] {
  const industryId = primaryIndustry(company);
  if (!industryId) return [];
  const members = companies.filter((c) => primaryIndustry(c) === industryId);
  if (!members.some((c) => c.id === company.id)) members.push(company);
  const ownEnd = latestOf(company)?.periodEnd;
  if (ownEnd === undefined) return members;
  return members.filter((c) => {
    const end = latestOf(c)?.periodEnd;
    return end !== undefined && Math.abs(Date.parse(end) - Date.parse(ownEnd)) <= PEER_WINDOW_DAYS * 86_400_000;
  });
}

type Pair = { prev: FinancialRecord; latest: FinancialRecord };

const pairOf = (c: Company): Pair | null => {
  const records = byPeriod(c.financials);
  const latest = records.at(-1);
  const prev = records.at(-2);
  return latest && prev ? { prev, latest } : null;
};

/**
 * A fiscal period shorter than twelve months (決算期変更) cannot carry a year-on-year change. The records
 * hold no month count, so the gap between consecutive period ends is the deterministic proxy: under 340
 * days is a short period (JCE-096).
 */
const SHORT_PERIOD_DAYS = 340;
const shortGap = (a: FinancialRecord, b: FinancialRecord): boolean =>
  Date.parse(b.periodEnd) - Date.parse(a.periodEnd) < SHORT_PERIOD_DAYS * 86_400_000;

const unionSources = (records: FinancialRecord[]): string[] => [...new Set(records.flatMap((r) => r.sourceIds))];

function pairCheck(c: Company, opts: { finance?: boolean; scope?: boolean }): { pair: Pair } | { reason: string } {
  if (opts.finance && primaryIndustry(c) === "finance") return { reason: "金融業は対象外です" };
  const pair = pairOf(c);
  if (!pair) return { reason: "2期分のレコードがありません" };
  if (pair.prev.accountingStandard !== pair.latest.accountingStandard) return { reason: "前期と会計基準が異なります" };
  if (opts.scope && pair.prev.revenueBasis !== pair.latest.revenueBasis) return { reason: "前期と売上の範囲が異なります" };
  if (shortGap(pair.prev, pair.latest)) return { reason: "決算期が12か月未満です" };
  return { pair };
}

/** A swing past ±30% in revenue or total assets flags a likely change of consolidation scope; stated, never explained. */
function bigChangeNote(pair: Pair): string | null {
  const swung = (pick: (r: FinancialRecord) => number | null, label: string): string | null => {
    const prev = pick(pair.prev);
    const latest = pick(pair.latest);
    return prev !== null && latest !== null && prev > 0 && Math.abs(latest / prev - 1) > 0.3 ? label : null;
  };
  const parts = [swung((r) => r.revenue, "売上高"), swung((r) => r.totalAssets, "総資産")].filter((p): p is string => p !== null);
  return parts.length > 0 ? `前期比で${parts.join("と")}が30%を超えて変動しています。連結範囲の変更などが含まれている場合があります。` : null;
}

function position(own: number, peers: Company[], read: (c: Company) => number | null): IndustryPosition | null {
  const values = peers.map(read).filter((v): v is number => v !== null);
  return industryPosition(own, values);
}

const popStd = (values: number[]): number => {
  const mean = values.reduce((a, v) => a + v, 0) / values.length;
  return Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length);
};

/** 純利益率 is readable only when net income covers the same perimeter as revenue (the report layer's rule). */
const marginReadable = (r: FinancialRecord): boolean => r.netIncomeBasis === undefined || r.netIncomeBasis === r.revenueBasis;

/* ---------- A1: 増益分解 (Bennet midpoint) ---------- */

/** The Bennet midpoint split of a profit change: the two effects add up to the change itself, exactly. */
export function bennetA1(r0: number, p0: number, r1: number, p1: number): { revenueEffect: number; marginEffect: number; profitChange: number } {
  const m0 = p0 / r0;
  const m1 = p1 / r1;
  return {
    revenueEffect: (r1 - r0) * ((m0 + m1) / 2),
    marginEffect: (m1 - m0) * ((r0 + r1) / 2),
    profitChange: p1 - p0,
  };
}

type A1Values = ReturnType<typeof bennetA1> & { bridge: number; netIncomeChange: number };

function a1Values(c: Company): A1Values | null {
  const checked = pairCheck(c, { finance: true, scope: true });
  if ("reason" in checked) return null;
  const { prev, latest } = checked.pair;
  const kind = profitLineKind(latest.profitLabel);
  if (!kind || profitLineKind(prev.profitLabel) !== kind) return null;
  if (prev.revenue === null || latest.revenue === null || prev.revenue <= 0 || latest.revenue <= 0) return null;
  if (prev.profit === null || latest.profit === null || prev.netIncome === null || latest.netIncome === null) return null;
  return {
    ...bennetA1(prev.revenue, prev.profit, latest.revenue, latest.profit),
    bridge: latest.netIncome - latest.profit - (prev.netIncome - prev.profit),
    netIncomeChange: latest.netIncome - prev.netIncome,
  };
}

const a1: DecompModuleDef = {
  id: "a1",
  version: 1,
  title: "利益増減の内訳",
  perspectives: ["growth", "profitability"],
  kind: "calculated",
  run: (company, ctx) => {
    const checked = pairCheck(company, { finance: true, scope: true });
    if ("reason" in checked) return suppressed(checked.reason);
    const { prev, latest } = checked.pair;
    const kind = profitLineKind(latest.profitLabel);
    if (!kind || profitLineKind(prev.profitLabel) !== kind) return suppressed("利益行の種類が前期と異なります");
    const values = a1Values(company);
    if (!values) return suppressed("分解に必要な印字値が揃っていません");
    const fiscalYear = latest.fiscalYear;
    const sourceIds = unionSources([prev, latest]);
    const row = (key: string, title: string, formula: string, value: number, read: (v: A1Values) => number): AnalysisRow => ({
      key,
      title,
      formula,
      kind: "computed",
      unit: "yen",
      value,
      fiscalYear,
      sourceIds,
      industry: position(value, ctx.peers, (c) => {
        const v = a1Values(c);
        return v ? read(v) : null;
      }),
    });
    const notes = [
      bigChangeNote(checked.pair),
      prev.profit !== null && latest.profit !== null && (prev.profit < 0 || latest.profit < 0)
        ? "前期または最新期が赤字のため、利益率効果は赤字幅の拡大・縮小として読んでください。"
        : null,
    ].filter((n): n is string => n !== null);
    return {
      status: "ok",
      group: {
        id: "a1",
        title: "利益増減の内訳（寄与度分解）",
        rows: [
          row("a1-revenue-effect", "売上効果", "売上高の増減 ×（前期と最新期の利益率の平均）", values.revenueEffect, (v) => v.revenueEffect),
          row("a1-margin-effect", "利益率効果", "利益率の増減 ×（前期と最新期の売上高の平均）", values.marginEffect, (v) => v.marginEffect),
          row("a1-profit-change", `${kind}の増減`, `最新期の${kind} − 前期の${kind}`, values.profitChange, (v) => v.profitChange),
          row("a1-bridge", "税・特別損益・非支配株主帰属分などの変動", "純利益と利益の差の増減", values.bridge, (v) => v.bridge),
          row("a1-net-income-change", "純利益の増減", `最新期の${latest.netIncomeLabel} − 前期の${prev.netIncomeLabel}`, values.netIncomeChange, (v) => v.netIncomeChange),
        ],
        ...(notes.length > 0 ? { note: notes.join("") } : {}),
      },
    };
  },
};

/* ---------- A2: 業界成長への寄与度 (leave-one-out) ---------- */

function a2Member(c: Company): { r0: number; r1: number } | null {
  const checked = pairCheck(c, { scope: true });
  if ("reason" in checked) return null;
  const { prev, latest } = checked.pair;
  if (prev.revenue === null || latest.revenue === null || prev.revenue <= 0 || latest.revenue <= 0) return null;
  return { r0: prev.revenue, r1: latest.revenue };
}

const a2: DecompModuleDef = {
  id: "a2",
  version: 1,
  title: "業界の成長と自社の寄与",
  perspectives: ["scale"],
  kind: "calculated",
  run: (company, ctx) => {
    const members = ctx.peers
      .map((c) => ({ company: c, m: a2Member(c) }))
      .filter((x): x is { company: Company; m: { r0: number; r1: number } } => x.m !== null);
    const own = members.find((x) => x.company.id === company.id);
    if (!own) return suppressed("自社の両期の売上高がありません");
    if (members.length < 10) return suppressed("業界の対象会社が10社未満です");
    const sum0 = members.reduce((a, x) => a + x.m.r0, 0);
    const sum1 = members.reduce((a, x) => a + x.m.r1, 0);
    const growth = sum1 / sum0 - 1;
    const stats = members.map((x) => {
      const rest0 = sum0 - x.m.r0;
      const rest1 = sum1 - x.m.r1;
      return {
        growth: x.m.r1 / x.m.r0 - 1,
        relative: x.m.r1 / x.m.r0 - 1 - (rest1 / rest0 - 1),
        contribution: (x.m.r1 - x.m.r0) / sum0,
        share: x.m.r1 / sum1,
      };
    });
    const ownStats = stats[members.indexOf(own)]!;
    const latest = latestOf(company)!;
    const hhi = Math.round(stats.reduce((a, s) => a + s.share * s.share, 0) * 10_000);
    const maxShare = Math.max(...stats.map((s) => s.share));
    const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
    const rows: AnalysisRow[] = [
      {
        key: "a2-relative-growth",
        title: "自社を除く業界との成長差",
        formula: "自社の売上成長率 − 自社を除いた業界の売上成長率",
        kind: "computed",
        unit: "percent-change",
        value: ownStats.relative,
        fiscalYear: latest.fiscalYear,
        sourceIds: latest.sourceIds,
        industry: industryPosition(ownStats.relative, stats.map((s) => s.relative)),
      },
      {
        key: "a2-contribution",
        title: "業界成長への寄与度",
        formula: "自社の売上高の増減 ÷ 前期の業界売上高の合計",
        kind: "computed",
        unit: "points",
        value: ownStats.contribution,
        fiscalYear: latest.fiscalYear,
        sourceIds: latest.sourceIds,
        industry: industryPosition(ownStats.contribution, stats.map((s) => s.contribution)),
      },
      ...(Math.abs(growth) >= 0.005
        ? [
            {
              key: "a2-contribution-share",
              title: "業界成長に占める割合",
              formula: "自社の寄与度 ÷ 業界成長率",
              kind: "computed",
              unit: "percent" as const,
              value: ownStats.contribution / growth,
              fiscalYear: latest.fiscalYear,
              sourceIds: latest.sourceIds,
              industry: null,
            } satisfies AnalysisRow,
          ]
        : []),
      {
        key: "a2-revenue-share",
        title: "業界の売上シェア",
        formula: "自社の売上高 ÷ 業界の売上高の合計",
        kind: "computed",
        unit: "percent",
        value: ownStats.share,
        fiscalYear: latest.fiscalYear,
        sourceIds: latest.sourceIds,
        industry: industryPosition(ownStats.share, stats.map((s) => s.share)),
      },
    ];
    return {
      status: "ok",
      group: {
        id: "a2",
        title: "業界の成長と自社の寄与",
        rows,
        note:
          `対象は主たる産業が同じ掲載企業のうち両期の売上高がある${members.length}社で、業界全体の売上成長率は${pct(growth)}です。` +
          `集中度（HHI）は${hhi}、最大手のシェアは${pct(maxShare)}です。` +
          (maxShare > 0.5 ? "最大手のシェアが業界売上の半分を超えています。" : "") +
          "親子上場の会社同士では、売上が二重に数えられている場合があります。",
      },
    };
  },
};

/* ---------- B1: 純資産の増減分解 ---------- */

type B1Values = { dE: number; ni: number; other: number; growth: number | null; ratio: number | null };

function b1Values(c: Company): B1Values | null {
  const checked = pairCheck(c, {});
  if ("reason" in checked) return null;
  const { prev, latest } = checked.pair;
  if (prev.netAssets === null || latest.netAssets === null || latest.netIncome === null) return null;
  const dE = latest.netAssets - prev.netAssets;
  return {
    dE,
    ni: latest.netIncome,
    other: dE - latest.netIncome,
    growth: prev.netAssets > 0 ? dE / prev.netAssets : null,
    ratio: latest.netIncome > 0 ? dE / latest.netIncome : null,
  };
}

const b1: DecompModuleDef = {
  id: "b1",
  version: 1,
  title: "純資産の増減の内訳",
  perspectives: ["stability"],
  kind: "calculated",
  run: (company, ctx) => {
    const checked = pairCheck(company, {});
    if ("reason" in checked) return suppressed(checked.reason);
    const values = b1Values(company);
    if (!values) return suppressed("純資産または純利益の印字値がありません");
    const { prev, latest } = checked.pair;
    const fiscalYear = latest.fiscalYear;
    const sourceIds = unionSources([prev, latest]);
    const yen = (key: string, title: string, formula: string, value: number, read: (v: B1Values) => number | null, kind: AnalysisRow["kind"] = "computed"): AnalysisRow => ({
      key,
      title,
      formula,
      kind,
      unit: "yen",
      value,
      fiscalYear,
      sourceIds,
      industry: position(value, ctx.peers, (c) => {
        const v = b1Values(c);
        return v ? read(v) : null;
      }),
    });
    const rows: AnalysisRow[] = [
      yen("b1-net-assets-change", "純資産の増減", `最新期の${latest.netAssetsLabel ?? "純資産"} − 前期の${prev.netAssetsLabel ?? "純資産"}`, values.dE, (v) => v.dE),
      ...(values.growth !== null
        ? [
            {
              key: "b1-net-assets-growth",
              title: "純資産の前期比",
              formula: `最新期の${latest.netAssetsLabel ?? "純資産"} ÷ 前期の${prev.netAssetsLabel ?? "純資産"} − 1`,
              kind: "computed" as const,
              unit: "percent-change" as const,
              value: values.growth,
              fiscalYear,
              sourceIds,
              industry: position(values.growth, ctx.peers, (c) => b1Values(c)?.growth ?? null),
            } satisfies AnalysisRow,
          ]
        : []),
      yen("b1-net-income", `うち${latest.netIncomeLabel}`, "有価証券報告書に印字された値", values.ni, (v) => v.ni, "printed"),
      yen("b1-other-change", "その他増減", "純資産の増減 − 当期純利益", values.other, (v) => v.other),
      ...(values.ratio !== null && values.ratio >= -5 && values.ratio <= 5
        ? [
            {
              key: "b1-buildup-ratio",
              title: "純利益の純資産積上げ率",
              formula: "純資産の増減 ÷ 当期純利益",
              kind: "computed" as const,
              unit: "times" as const,
              value: values.ratio,
              fiscalYear,
              sourceIds,
              industry: position(values.ratio, ctx.peers, (c) => {
                const r = b1Values(c)?.ratio ?? null;
                return r !== null && r >= -5 && r <= 5 ? r : null;
              }),
            } satisfies AnalysisRow,
          ]
        : []),
    ];
    return {
      status: "ok",
      group: {
        id: "b1",
        title: "純資産の増減の内訳",
        rows,
        note: "その他増減には、配当や自己株式の取得、その他包括利益、資本取引のほか、非支配株主持分の変動も含まれます。",
      },
    };
  },
};

/* ---------- C1: 資産増減の調達内訳 ---------- */

type C1Values = { assetGrowth: number; equityContribution: number; liabilityContribution: number; equityRatioChange: number; selfFinancing: number | null };

function c1Values(c: Company): C1Values | null {
  const checked = pairCheck(c, { finance: true });
  if ("reason" in checked) return null;
  const { prev, latest } = checked.pair;
  if (prev.totalAssets === null || latest.totalAssets === null || prev.netAssets === null || latest.netAssets === null) return null;
  if (prev.totalAssets <= 0 || latest.totalAssets <= 0) return null;
  const dA = latest.totalAssets - prev.totalAssets;
  const dE = latest.netAssets - prev.netAssets;
  const dL = latest.totalAssets - latest.netAssets - (prev.totalAssets - prev.netAssets);
  return {
    assetGrowth: dA / prev.totalAssets,
    equityContribution: dE / prev.totalAssets,
    liabilityContribution: dL / prev.totalAssets,
    equityRatioChange: latest.netAssets / latest.totalAssets - prev.netAssets / prev.totalAssets,
    selfFinancing: dA > 0 && dA / prev.totalAssets >= 0.01 ? dE / dA : null,
  };
}

const c1: DecompModuleDef = {
  id: "c1",
  version: 1,
  title: "総資産の増減と調達の内訳",
  perspectives: ["stability"],
  kind: "calculated",
  run: (company, ctx) => {
    const checked = pairCheck(company, { finance: true });
    if ("reason" in checked) return suppressed(checked.reason);
    const values = c1Values(company);
    if (!values) return suppressed("総資産または純資産の印字値がありません");
    const { prev, latest } = checked.pair;
    const fiscalYear = latest.fiscalYear;
    const sourceIds = unionSources([prev, latest]);
    const row = (key: string, title: string, formula: string, unit: AnalysisRow["unit"], value: number, read: (v: C1Values) => number | null): AnalysisRow => ({
      key,
      title,
      formula,
      kind: "computed",
      unit,
      value,
      fiscalYear,
      sourceIds,
      industry: position(value, ctx.peers, (c) => {
        const v = c1Values(c);
        return v ? read(v) : null;
      }),
    });
    const rows: AnalysisRow[] = [
      row("c1-asset-growth", "総資産成長率", "総資産の増減 ÷ 前期の総資産", "percent-change", values.assetGrowth, (v) => v.assetGrowth),
      row("c1-equity-contribution", "純資産による寄与", "純資産の増減 ÷ 前期の総資産", "points", values.equityContribution, (v) => v.equityContribution),
      row("c1-liability-contribution", "負債による寄与", "負債（総資産 − 純資産）の増減 ÷ 前期の総資産", "points", values.liabilityContribution, (v) => v.liabilityContribution),
      row("c1-equity-ratio-change", "自己資本比率の変化", "最新期の自己資本比率 − 前期の自己資本比率", "points", values.equityRatioChange, (v) => v.equityRatioChange),
      ...(values.selfFinancing !== null
        ? [row("c1-self-financing-ratio", "自己調達比率", "純資産の増減 ÷ 総資産の増減", "percent", values.selfFinancing, (v) => v.selfFinancing)]
        : []),
    ];
    const note = bigChangeNote(checked.pair);
    return { status: "ok", group: { id: "c1", title: "総資産の増減と調達の内訳", rows, ...(note ? { note } : {}) } };
  },
};

/* ---------- E1: トレンド乖離 (Theil–Sen extrapolation) ---------- */

/** Theil–Sen fit of log values at t = 0..n-1: the median pairwise slope, the median intercept. */
export function theilSen(logValues: number[]): { slope: number; intercept: number } {
  const slopes: number[] = [];
  for (let i = 0; i < logValues.length; i++) {
    for (let j = i + 1; j < logValues.length; j++) slopes.push((logValues[j]! - logValues[i]!) / (j - i));
  }
  const slope = median(slopes)!;
  const intercept = median(logValues.map((y, t) => y - slope * t))!;
  return { slope, intercept };
}

type E1Values = { trendGrowth: number; deviation: number; cagr: number };

function e1Values(c: Company): E1Values | null {
  const records = byPeriod(c.financials).slice(-5);
  if (records.length < 5) return null;
  const first = records[0]!;
  if (!records.every((r) => r.accountingStandard === first.accountingStandard && r.revenueBasis === first.revenueBasis)) return null;
  if (!records.every((r) => r.revenue !== null && r.revenue > 0)) return null;
  for (let i = 1; i < records.length; i++) {
    if (shortGap(records[i - 1]!, records[i]!)) return null;
    if (Math.abs(records[i]!.revenue! / records[i - 1]!.revenue! - 1) > 0.3) return null;
  }
  const { slope, intercept } = theilSen(records.slice(0, 4).map((r) => Math.log(r.revenue!)));
  const predicted = Math.exp(intercept + slope * 4);
  const actual = records[4]!.revenue!;
  return {
    trendGrowth: Math.exp(slope) - 1,
    deviation: actual / predicted - 1,
    cagr: Math.pow(actual / records[0]!.revenue!, 1 / 4) - 1,
  };
}

const e1: DecompModuleDef = {
  id: "e1",
  version: 1,
  title: "トレンドと乖離",
  perspectives: ["growth"],
  kind: "estimated",
  run: (company, ctx) => {
    const values = e1Values(company);
    if (!values) return suppressed("5期分の売上高が揃わないか、基準の変更・決算期変更・大きな変動を含む系列です");
    const records = byPeriod(company.financials).slice(-5);
    const latest = records.at(-1)!;
    const fiscalYear = latest.fiscalYear;
    const sourceIds = unionSources(records);
    const row = (key: string, title: string, formula: string, kind: AnalysisRow["kind"], value: number, read: (v: E1Values) => number): AnalysisRow => ({
      key,
      title,
      formula,
      kind,
      unit: "percent-change",
      value,
      fiscalYear,
      sourceIds,
      industry: position(value, ctx.peers, (c) => {
        const v = e1Values(c);
        return v ? read(v) : null;
      }),
    });
    return {
      status: "ok",
      group: {
        id: "e1",
        title: "トレンドと乖離（推計）",
        rows: [
          row("e1-trend-growth", "トレンド成長率", "前4期の売上高の対数に Theil–Sen 法で当てはめた傾き", "estimated", values.trendGrowth, (v) => v.trendGrowth),
          row("e1-deviation", "トレンドからの乖離", "最新期の売上高 ÷ トレンドの外挿値 − 1", "estimated", values.deviation, (v) => v.deviation),
          row("e1-cagr", "4年平均成長率", "（最新期の売上高 ÷ 4期前の売上高）の4乗根 − 1", "computed", values.cagr, (v) => v.cagr),
        ],
        note: "簡易推計（4期、外挿）です。当てはめには最新期を含めていません。",
      },
    };
  },
};

/* ---------- F2: 利益率の安定性 ---------- */

type F2Values = { sd: number; range: number; label: string };

function f2Values(c: Company): F2Values | null {
  const records = byPeriod(c.financials).slice(-5);
  if (records.length < 5) return null;
  const first = records[0]!;
  if (!records.every((r) => r.accountingStandard === first.accountingStandard && r.revenueBasis === first.revenueBasis)) return null;
  if (!records.every((r) => r.revenue !== null && r.revenue > 0)) return null;
  let margins: number[] | null = null;
  let label: string | null = null;
  if (records.every((r) => marginReadable(r) && r.netIncome !== null)) {
    margins = records.map((r) => r.netIncome! / r.revenue!);
    label = "純利益率";
  } else {
    const kind = profitLineKind(first.profitLabel);
    if (kind && records.every((r) => profitLineKind(r.profitLabel) === kind && r.profit !== null)) {
      margins = records.map((r) => r.profit! / r.revenue!);
      label = `${kind}率`;
    }
  }
  if (!margins || !label) return null;
  return { sd: popStd(margins), range: Math.max(...margins) - Math.min(...margins), label };
}

const f2: DecompModuleDef = {
  id: "f2",
  version: 1,
  title: "利益率の安定性",
  perspectives: ["profitability"],
  kind: "calculated",
  run: (company, ctx) => {
    const values = f2Values(company);
    if (!values) return suppressed("5期分の利益率が揃いません");
    const records = byPeriod(company.financials).slice(-5);
    const latest = records.at(-1)!;
    const fiscalYear = latest.fiscalYear;
    const sourceIds = unionSources(records);
    const row = (key: string, title: string, formula: string, value: number, read: (v: F2Values) => number): AnalysisRow => ({
      key,
      title,
      formula,
      kind: "computed",
      unit: "percent",
      value,
      fiscalYear,
      sourceIds,
      industry: position(value, ctx.peers, (c) => {
        const v = f2Values(c);
        return v && v.label === values.label ? read(v) : null;
      }),
    });
    return {
      status: "ok",
      group: {
        id: "f2",
        title: "利益率の安定性",
        rows: [
          row("f2-margin-sd", `${values.label}のばらつき（標準偏差）`, `5期の${values.label}の標準偏差`, values.sd, (v) => v.sd),
          row("f2-margin-range", `${values.label}の最大と最小の差`, `5期の${values.label}の最大 − 最小`, values.range, (v) => v.range),
        ],
      },
    };
  },
};

/* ---------- F3: 成長の資産効率 ---------- */

function f3Value(c: Company): number | null {
  const checked = pairCheck(c, { scope: true });
  if ("reason" in checked) return null;
  const { prev, latest } = checked.pair;
  if (prev.revenue === null || latest.revenue === null || prev.totalAssets === null || latest.totalAssets === null) return null;
  if (prev.revenue <= 0 || prev.totalAssets <= 0) return null;
  return latest.revenue / prev.revenue - 1 - (latest.totalAssets / prev.totalAssets - 1);
}

const f3: DecompModuleDef = {
  id: "f3",
  version: 1,
  title: "成長の資産効率",
  perspectives: ["growth"],
  kind: "calculated",
  run: (company, ctx) => {
    const checked = pairCheck(company, { scope: true });
    if ("reason" in checked) return suppressed(checked.reason);
    const value = f3Value(company);
    if (value === null) return suppressed("売上高または総資産の印字値がありません");
    const { prev, latest } = checked.pair;
    return {
      status: "ok",
      group: {
        id: "f3",
        title: "成長の資産効率",
        rows: [
          {
            key: "f3-growth-gap",
            title: "売上と総資産の伸びの差",
            formula: "売上高の前期比 − 総資産の前期比",
            kind: "computed",
            unit: "percent-change",
            value,
            fiscalYear: latest.fiscalYear,
            sourceIds: unionSources([prev, latest]),
            industry: position(value, ctx.peers, f3Value),
          },
        ],
      },
    };
  },
};

/* ---------- D1: 純資産利益率 (ROE の近似) — analysis layer only (JCE-096) ---------- */

type D1Values = { pooled: number; sd: number; incremental: number | null };

function d1Values(c: Company): D1Values | null {
  const records = byPeriod(c.financials).slice(-5);
  if (records.length < 5) return null;
  const first = records[0]!;
  if (!records.every((r) => r.accountingStandard === first.accountingStandard)) return null;
  if (!records.every((r) => r.netIncome !== null && r.netAssets !== null && r.netAssets > 0)) return null;
  const pooled = records.reduce((a, r) => a + r.netIncome!, 0) / records.reduce((a, r) => a + r.netAssets!, 0);
  const sd = popStd(records.map((r) => r.netIncome! / r.netAssets!));
  const den = records[3]!.netAssets! - first.netAssets!;
  const incremental = den > 0 && den >= 0.05 * first.netAssets! ? (records[4]!.netIncome! - records[1]!.netIncome!) / den : null;
  return { pooled, sd, incremental };
}

const d1: DecompModuleDef = {
  id: "d1",
  version: 1,
  title: "純資産利益率（ROEの近似）",
  perspectives: ["profitability"],
  kind: "calculated",
  run: (company, ctx) => {
    const values = d1Values(company);
    if (!values) return suppressed("5期分の純利益・純資産が揃わないか、純資産が正でない期を含みます");
    const records = byPeriod(company.financials).slice(-5);
    const latest = records.at(-1)!;
    const fiscalYear = latest.fiscalYear;
    const sourceIds = unionSources(records);
    const row = (key: string, title: string, formula: string, value: number, read: (v: D1Values) => number | null): AnalysisRow => ({
      key,
      title,
      formula,
      kind: "computed",
      unit: "percent",
      value,
      fiscalYear,
      sourceIds,
      industry: position(value, ctx.peers, (c) => {
        const v = d1Values(c);
        return v ? read(v) : null;
      }),
    });
    const rows: AnalysisRow[] = [
      row("d1-pooled-roe", "純資産利益率（ROEの近似）", "5期の当期純利益の合計 ÷ 5期の純資産の合計", values.pooled, (v) => v.pooled),
      row("d1-roe-sd", "純資産利益率のばらつき（標準偏差）", "各期の当期純利益 ÷ 純資産（期末）の標準偏差（5期）", values.sd, (v) => v.sd),
      ...(values.incremental !== null
        ? [row("d1-incremental-roe", "増分純資産利益率（3年）", "（最新期の純利益 − 3期前の純利益）÷（前期の純資産 − 4期前の純資産）", values.incremental, (v) => v.incremental)]
        : []),
    ];
    return { status: "ok", group: { id: "d1", title: "純資産利益率（ROEの近似）", rows } };
  },
};

/* ---------- F1: DuPont 3要因 + ΔROE の Shapley 分解 — analysis layer only (JCE-096) ---------- */

/**
 * The Shapley split of a change in a product of three factors: each factor's contribution is its average
 * marginal effect over the six orders in which the factors can be switched from the old to the new value.
 * The three contributions add up to the change itself, exactly.
 */
export function shapleyProduct3(oldF: [number, number, number], newF: [number, number, number]): [number, number, number] {
  const perms: [number, number, number][] = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ];
  const product = (v: number[]): number => v[0]! * v[1]! * v[2]!;
  const contrib: [number, number, number] = [0, 0, 0];
  for (const perm of perms) {
    const cur = [...oldF];
    for (const idx of perm) {
      const before = product(cur);
      cur[idx] = newF[idx]!;
      contrib[idx] += product(cur) - before;
    }
  }
  return [contrib[0] / 6, contrib[1] / 6, contrib[2] / 6];
}

type F1Values = { roePrev: number; roeLatest: number; effects: [number, number, number] };

function f1Values(c: Company): F1Values | null {
  const records = byPeriod(c.financials).slice(-3);
  if (records.length < 3) return null;
  const [base, prev, latest] = records as [FinancialRecord, FinancialRecord, FinancialRecord];
  if (!records.every((r) => r.accountingStandard === base.accountingStandard && r.revenueBasis === base.revenueBasis)) return null;
  const year = (r: FinancialRecord, before: FinancialRecord): { m: number; t: number; l: number; roe: number } | null => {
    if (r.revenue === null || r.revenue <= 0 || r.netIncome === null || !marginReadable(r)) return null;
    if (r.totalAssets === null || before.totalAssets === null || r.netAssets === null || before.netAssets === null) return null;
    const avgA = (r.totalAssets + before.totalAssets) / 2;
    const avgE = (r.netAssets + before.netAssets) / 2;
    if (avgA <= 0 || avgE <= 0) return null;
    return { m: r.netIncome / r.revenue, t: r.revenue / avgA, l: avgA / avgE, roe: r.netIncome / avgE };
  };
  const y0 = year(prev, base);
  const y1 = year(latest, prev);
  if (!y0 || !y1) return null;
  return { roePrev: y0.roe, roeLatest: y1.roe, effects: shapleyProduct3([y0.m, y0.t, y0.l], [y1.m, y1.t, y1.l]) };
}

const f1: DecompModuleDef = {
  id: "f1",
  version: 1,
  title: "純資産利益率の分解（DuPont）",
  perspectives: ["profitability"],
  kind: "calculated",
  run: (company, ctx) => {
    const values = f1Values(company);
    if (!values) return suppressed("3期分の印字値が揃わないか、平均純資産・平均総資産が正ではありません");
    const records = byPeriod(company.financials).slice(-3);
    const latest = records.at(-1)!;
    const fiscalYear = latest.fiscalYear;
    const sourceIds = unionSources(records);
    const effect = (key: string, title: string, value: number, read: (v: F1Values) => number): AnalysisRow => ({
      key,
      title,
      formula: "前期との差のうち、この要因の変化による分（Shapley 分解）",
      kind: "computed",
      unit: "points",
      value,
      fiscalYear,
      sourceIds,
      industry: position(value, ctx.peers, (c) => {
        const v = f1Values(c);
        return v ? read(v) : null;
      }),
    });
    const rows: AnalysisRow[] = [
      {
        key: "f1-roe",
        title: "純資産利益率（ROEの近似）",
        formula: "当期純利益 ÷ 平均純資産（前期末と最新期末の平均）",
        kind: "computed",
        unit: "percent",
        value: values.roeLatest,
        fiscalYear,
        sourceIds,
        industry: position(values.roeLatest, ctx.peers, (c) => f1Values(c)?.roeLatest ?? null),
      },
      {
        key: "f1-roe-change",
        title: "純資産利益率の増減",
        formula: "最新期の純資産利益率 − 前期の純資産利益率",
        kind: "computed",
        unit: "points",
        value: values.roeLatest - values.roePrev,
        fiscalYear,
        sourceIds,
        industry: position(values.roeLatest - values.roePrev, ctx.peers, (c) => {
          const v = f1Values(c);
          return v ? v.roeLatest - v.roePrev : null;
        }),
      },
      effect("f1-margin-effect", "利益率の効果", values.effects[0], (v) => v.effects[0]),
      effect("f1-turnover-effect", "総資産回転率の効果", values.effects[1], (v) => v.effects[1]),
      effect("f1-leverage-effect", "財務レバレッジの効果", values.effects[2], (v) => v.effects[2]),
    ];
    return { status: "ok", group: { id: "f1", title: "純資産利益率の分解（DuPont 3要因）", rows } };
  },
};

/* ---------- registry and entry point ---------- */

export const DECOMP_MODULES: DecompModuleDef[] = [a1, a2, b1, c1, e1, f2, f3, d1, f1];

function runDef(def: DecompModuleDef, company: Company, companies: Company[]): DecompResult {
  const peers = comparablePeers(company, companies);
  return def.run(company, { peers, finance: primaryIndustry(company) === "finance" });
}

/** One module's result for a company — the handle tests and administration use to read suppressed reasons. */
export function runDecompModule(id: string, company: Company, companies: Company[]): DecompResult {
  const def = DECOMP_MODULES.find((d) => d.id === id);
  if (!def) throw new Error(`unknown decomposition module: ${id}`);
  return runDef(def, company, companies);
}

/** Every module that can be computed for this company, placed under its perspective(s). */
export function decompositionGroups(company: Company, companies: Company[]): { perspective: AnalysisPerspectiveId; group: AnalysisGroup }[] {
  const peers = comparablePeers(company, companies);
  const ctx: Ctx = { peers, finance: primaryIndustry(company) === "finance" };
  const out: { perspective: AnalysisPerspectiveId; group: AnalysisGroup }[] = [];
  for (const def of DECOMP_MODULES) {
    const result = def.run(company, ctx);
    if (result.status !== "ok") continue;
    for (const perspective of def.perspectives) out.push({ perspective, group: result.group });
  }
  return out;
}
