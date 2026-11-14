import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";

/**
 * The industry figures (JCE-041): what the released companies' own filings add up to, industry by industry.
 *
 * Everything here is arithmetic on figures as printed — sums, one ratio of two sums, a median of per-company
 * ratios — computed at build time from `financials` and `regionalRevenue`, never written by hand or by an agent,
 * and each carries its formula. A company whose figure is missing is left out of that figure's sum and counted
 * in `excluded`, never approximated. Nothing here is a stock-market measure (CLAUDE.md invariant 4).
 */

export type IndustrySum = { total: number; companies: number; excluded: number };
export type IndustryRatio = { value: number; formula: string; companies: number };

export type RankedCompany = {
  id: string;
  name: string;
  fiscalYear: string;
  revenue: number;
  /** 純利益 ÷ 売上高 of the same year, when both are printed. */
  netProfitMargin: number | null;
  /** Latest revenue ÷ the oldest of the five years, when the series is complete. */
  revenueGrowth5y: number | null;
};

/** A company and one printed figure of its latest year, for the size rankings. */
export type SizeRow = { id: string; name: string; value: number };

/** How many companies fall in each part of a whole: size bands, accounting standards. */
export type CountPart = { id: string; name: string; companies: number };

export type IndustryFigures = {
  id: IndustryId;
  name: string;
  companies: number;
  revenue: IndustrySum;
  netIncome: IndustrySum;
  employees: IndustrySum;
  totalAssets: IndustrySum;
  netAssets: IndustrySum;
  /** Σ純資産 ÷ Σ総資産 over the companies that print both (JCE-047). */
  equityRatio: IndustryRatio | null;
  /** Σ売上高 ÷ Σ従業員数 over the companies that print both, in yen per person. */
  revenuePerEmployee: IndustryRatio | null;
  /** Companies whose latest 純利益 is below zero, of those that print it. */
  lossMaking: { companies: number; of: number };
  /** Median of the latest revenue. */
  revenueMedian: number | null;
  /** Median of 平均年間給与 (提出会社) as printed, in yen. */
  salaryMedian: IndustryRatio | null;
  /** Companies by size of their latest revenue. */
  sizeBands: CountPart[];
  /** Companies by the accounting standard of their latest year. */
  standards: CountPart[];
  /** Σ of the amounts printed as 日本 and as every other region, over companies with one domestic region. */
  domesticOverseas: { domestic: number; overseas: number; companies: number } | null;
  /** The ten largest by 従業員数 and by 総資産, beside `ranking` (売上高). */
  rankingByEmployees: SizeRow[];
  rankingByAssets: SizeRow[];
  /** Σ純利益 ÷ Σ売上高 over the companies that print both. */
  netProfitMargin: IndustryRatio | null;
  /** Median over companies of (latest revenue ÷ revenue five years earlier). */
  revenueGrowth5y: IndustryRatio | null;
  /** Revenue of the three largest companies ÷ the industry's revenue. */
  top3Share: IndustryRatio | null;
  /** Median over companies of the overseas sales ratio printed in their 地域ごとの情報. */
  overseasSalesRatio: IndustryRatio | null;
  /** How many companies' latest year ends in each fiscal year label — the sums are not of one date. */
  fiscalYears: { fiscalYear: string; companies: number }[];
  ranking: RankedCompany[];
};

export type IndustryFlowCount = { from: IndustryId; to: IndustryId; ties: number };

export type IndustryFiguresData = {
  industries: IndustryFigures[];
  /** The same ratios over every released company, the reference the ▲▼ marks compare against. */
  reference: { netProfitMargin: number | null; revenueGrowth5y: number | null; equityRatio: number | null; revenuePerEmployee: number | null };
  /** The five-year revenue index of every industry and of all companies together (JCE-042). */
  index: { all: IndexSeries; industries: IndexSeries[] };
  /** The same index for 総資産 and 従業員数, each over the companies whose five years of that line are complete (JCE-047). */
  indexes: { totalAssets: { all: IndexSeries; industries: IndexSeries[] }; employees: { all: IndexSeries; industries: IndexSeries[] } };
  /** Every released company by size band and by accounting standard. */
  sizeBands: CountPart[];
  standards: CountPart[];
  /** Seller industry → buyer industry, counted from `supplier` / `customer` relations, each pair once. */
  flows: IndustryFlowCount[];
  totals: { companies: number; revenue: number; netIncome: number; employees: number; totalAssets: number; lossMaking: number; withNetIncome: number };
};

const OKU = 1e8;
const BANDS: { id: string; name: string; min: number }[] = [
  { id: "1-cho", name: "1兆円以上", min: 10000 * OKU },
  { id: "1000-oku", name: "1,000億〜1兆円", min: 1000 * OKU },
  { id: "100-oku", name: "100億〜1,000億円", min: 100 * OKU },
  { id: "under-100-oku", name: "100億円未満", min: -Infinity },
];
const STANDARD_NAMES: Record<FinancialRecord["accountingStandard"], string> = { jgaap: "日本基準", ifrs: "IFRS", usgaap: "米国会計基準" };

const RANKING_SIZE = 10;

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

function byPeriod(records: FinancialRecord[]): FinancialRecord[] {
  return [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function sum(companies: Company[], pick: (latest: FinancialRecord) => number | null): IndustrySum {
  let total = 0;
  let counted = 0;
  for (const company of companies) {
    const latest = byPeriod(company.financials).at(-1);
    const value = latest ? pick(latest) : null;
    // == null: a figure absent from the record is as missing as one printed as null.
    if (value == null) continue;
    total += value;
    counted += 1;
  }
  return { total, companies: counted, excluded: companies.length - counted };
}

/** Latest revenue ÷ the earliest of the five printed years; null unless the window is complete and both positive. */
export function revenueGrowth5y(company: Company): number | null {
  const records = byPeriod(company.financials);
  if (records.length < 5) return null;
  const first = records[0].revenue;
  const last = records.at(-1)!.revenue;
  return first !== null && last !== null && first > 0 && last > 0 ? last / first : null;
}

function overseasRatio(company: Company): number | null {
  const regional = company.regionalRevenue;
  if (!regional || regional.items.filter((i) => i.domestic).length !== 1) return null;
  const total = regional.items.reduce((acc, i) => acc + i.amount, 0);
  if (total <= 0) return null;
  const overseas = regional.items.filter((i) => !i.domestic).reduce((acc, i) => acc + i.amount, 0);
  return overseas / total;
}

function rank(companies: Company[]): RankedCompany[] {
  return companies
    .map((company) => ({ company, latest: byPeriod(company.financials).at(-1) }))
    .filter((x): x is { company: Company; latest: FinancialRecord } => x.latest !== undefined && x.latest.revenue !== null)
    .sort((a, b) => b.latest.revenue! - a.latest.revenue!)
    .map(({ company, latest }) => ({
      id: company.id,
      name: company.name,
      fiscalYear: latest.fiscalYear,
      revenue: latest.revenue!,
      netProfitMargin: latest.netIncome !== null && latest.revenue! > 0 ? latest.netIncome / latest.revenue! : null,
      revenueGrowth5y: revenueGrowth5y(company),
    }));
}

/** Σa ÷ Σb over the companies whose latest year prints both, with b above zero. */
function ratioOfSums(companies: Company[], a: (r: FinancialRecord) => number | null, b: (r: FinancialRecord) => number | null, formula: string): IndustryRatio | null {
  let num = 0;
  let den = 0;
  let counted = 0;
  for (const c of companies) {
    const r = byPeriod(c.financials).at(-1);
    const x = r ? a(r) : null;
    const y = r ? b(r) : null;
    if (x == null || y == null || y <= 0) continue;
    num += x;
    den += y;
    counted += 1;
  }
  return counted > 0 && den > 0 ? { value: num / den, formula, companies: counted } : null;
}

function countBy(companies: Company[], key: (latest: FinancialRecord) => { id: string; name: string } | null, order: string[]): CountPart[] {
  const counts = new Map<string, CountPart>();
  for (const c of companies) {
    const latest = byPeriod(c.financials).at(-1);
    const k = latest ? key(latest) : null;
    if (!k) continue;
    const part = counts.get(k.id) ?? { ...k, companies: 0 };
    part.companies += 1;
    counts.set(k.id, part);
  }
  return [...counts.values()].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

const sizeBandsOf = (companies: Company[]) =>
  countBy(companies, (r) => (r.revenue == null ? null : BANDS.find((b) => r.revenue! >= b.min)!), BANDS.map((b) => b.id));
const standardsOf = (companies: Company[]) =>
  countBy(companies, (r) => ({ id: r.accountingStandard, name: STANDARD_NAMES[r.accountingStandard] }), Object.keys(STANDARD_NAMES));

function topBy(companies: Company[], pick: (r: FinancialRecord) => number | null): SizeRow[] {
  return companies
    .map((c) => ({ c, v: (() => { const r = byPeriod(c.financials).at(-1); return r ? pick(r) : null; })() }))
    .filter((x): x is { c: Company; v: number } => x.v != null && x.v > 0)
    .sort((a, b) => b.v - a.v)
    .slice(0, RANKING_SIZE)
    .map(({ c, v }) => ({ id: c.id, name: c.name, value: v }));
}

function figuresOf(id: IndustryId, companies: Company[]): IndustryFigures {
  const revenue = sum(companies, (r) => r.revenue);
  const netIncome = sum(companies, (r) => r.netIncome);
  const employees = sum(companies, (r) => r.employees);
  const totalAssets = sum(companies, (r) => r.totalAssets);
  const netAssets = sum(companies, (r) => r.netAssets);
  const latestOf = companies.map((c) => byPeriod(c.financials).at(-1)).filter((r): r is FinancialRecord => r !== undefined);
  const withNetIncome = latestOf.filter((r) => r.netIncome != null);
  const salaries = companies.map((c) => c.workforce?.averageAnnualSalary ?? null).filter((v): v is number => v !== null);
  const salary = median(salaries);
  let domestic = 0;
  let overseasSum = 0;
  let regionalCompanies = 0;
  for (const c of companies) {
    const items = c.regionalRevenue?.items;
    if (!items || items.filter((i) => i.domestic).length !== 1) continue;
    domestic += items.filter((i) => i.domestic).reduce((acc, i) => acc + i.amount, 0);
    overseasSum += items.filter((i) => !i.domestic).reduce((acc, i) => acc + i.amount, 0);
    regionalCompanies += 1;
  }

  const both = companies
    .map((c) => byPeriod(c.financials).at(-1))
    .filter((r): r is FinancialRecord => r !== undefined && r.revenue !== null && r.revenue > 0 && r.netIncome !== null);
  const marginDen = both.reduce((acc, r) => acc + r.revenue!, 0);
  const netProfitMargin =
    both.length > 0 && marginDen > 0
      ? { value: both.reduce((acc, r) => acc + r.netIncome!, 0) / marginDen, formula: "純利益の合計 ÷ 売上高の合計（両方が印字された会社）", companies: both.length }
      : null;

  const growths = companies.map(revenueGrowth5y).filter((v): v is number => v !== null);
  const growthMedian = median(growths);
  const revenueGrowth = growthMedian !== null ? { value: growthMedian, formula: "最新期の売上高 ÷ 5期前の売上高（会社ごと）の中央値", companies: growths.length } : null;

  const ranked = rank(companies);
  const top3Share =
    revenue.total > 0 && ranked.length > 0
      ? { value: ranked.slice(0, 3).reduce((acc, c) => acc + c.revenue, 0) / revenue.total, formula: "売上高の上位3社の合計 ÷ 業界の売上高の合計", companies: ranked.length }
      : null;

  const overseas = companies.map(overseasRatio).filter((v): v is number => v !== null);
  const overseasMedian = median(overseas);
  const overseasSalesRatio = overseasMedian !== null ? { value: overseasMedian, formula: "日本以外の売上高 ÷ 地域別売上高の合計（会社ごと）の中央値", companies: overseas.length } : null;

  const years = new Map<string, number>();
  for (const c of companies) {
    const latest = byPeriod(c.financials).at(-1);
    if (latest) years.set(latest.fiscalYear, (years.get(latest.fiscalYear) ?? 0) + 1);
  }

  return {
    id,
    name: INDUSTRY_LABELS[id].name,
    companies: companies.length,
    revenue,
    netIncome,
    employees,
    totalAssets,
    netAssets,
    equityRatio: ratioOfSums(companies, (r) => r.netAssets, (r) => r.totalAssets, "純資産の合計 ÷ 総資産の合計（両方が印字された会社）"),
    revenuePerEmployee: ratioOfSums(companies, (r) => r.revenue, (r) => r.employees, "売上高の合計 ÷ 従業員数の合計（両方が印字された会社）"),
    lossMaking: { companies: withNetIncome.filter((r) => r.netIncome! < 0).length, of: withNetIncome.length },
    revenueMedian: median(latestOf.map((r) => r.revenue).filter((v): v is number => v !== null)),
    salaryMedian: salary !== null ? { value: salary, formula: "平均年間給与（提出会社・印字どおり）の中央値", companies: salaries.length } : null,
    sizeBands: sizeBandsOf(companies),
    standards: standardsOf(companies),
    domesticOverseas: regionalCompanies > 0 ? { domestic, overseas: overseasSum, companies: regionalCompanies } : null,
    rankingByEmployees: topBy(companies, (r) => r.employees),
    rankingByAssets: topBy(companies, (r) => r.totalAssets),
    netProfitMargin,
    revenueGrowth5y: revenueGrowth,
    top3Share,
    overseasSalesRatio,
    fiscalYears: [...years.entries()].map(([fiscalYear, n]) => ({ fiscalYear, companies: n })).sort((a, b) => b.companies - a.companies),
    ranking: ranked.slice(0, RANKING_SIZE),
  };
}

/**
 * Figures for every industry with at least one company, largest revenue first, plus the seller → buyer counts
 * between industries. Pass released companies: nothing unpublished should add to a public sum.
 */
export function buildIndustryFigures(companies: Company[]): IndustryFiguresData {
  const groups = new Map<IndustryId, Company[]>();
  for (const company of companies) {
    const id = primaryIndustry(company);
    if (!id) continue;
    groups.set(id, [...(groups.get(id) ?? []), company]);
  }
  const industries = [...groups.entries()].map(([id, cs]) => figuresOf(id, cs)).sort((a, b) => b.revenue.total - a.revenue.total);

  const industryOf = new Map(companies.map((c) => [c.id, primaryIndustry(c)]));
  const pairs = new Map<string, { from: IndustryId; to: IndustryId }>();
  for (const company of companies) {
    const own = industryOf.get(company.id);
    if (!own) continue;
    for (const relation of company.relatedCompanies) {
      if (relation.relationship !== "supplier" && relation.relationship !== "customer") continue;
      const other = industryOf.get(relation.companyId);
      if (!other || relation.companyId === company.id) continue;
      const [sellerId, buyerId, from, to] =
        relation.relationship === "customer" ? [company.id, relation.companyId, own, other] : [relation.companyId, company.id, other, own];
      pairs.set(`${sellerId}>${buyerId}`, { from, to });
    }
  }
  const counts = new Map<string, IndustryFlowCount>();
  for (const { from, to } of pairs.values()) {
    const key = `${from}>${to}`;
    const flow = counts.get(key) ?? { from, to, ties: 0 };
    flow.ties += 1;
    counts.set(key, flow);
  }

  const both = companies.map((c) => byPeriod(c.financials).at(-1)).filter((r): r is FinancialRecord => r !== undefined && r.revenue !== null && r.revenue > 0 && r.netIncome !== null);
  const refDen = both.reduce((acc, r) => acc + r.revenue!, 0);
  const reference = {
    netProfitMargin: refDen > 0 ? both.reduce((acc, r) => acc + r.netIncome!, 0) / refDen : null,
    revenueGrowth5y: median(companies.map(revenueGrowth5y).filter((v): v is number => v !== null)),
    equityRatio: ratioOfSums(companies, (r) => r.netAssets, (r) => r.totalAssets, "")?.value ?? null,
    revenuePerEmployee: ratioOfSums(companies, (r) => r.revenue, (r) => r.employees, "")?.value ?? null,
  };

  return {
    industries,
    reference,
    index: revenueIndexSeries(companies),
    indexes: { totalAssets: indexSeries(companies, (r) => r.totalAssets), employees: indexSeries(companies, (r) => r.employees) },
    sizeBands: sizeBandsOf(companies),
    standards: standardsOf(companies),
    flows: [...counts.values()].sort((a, b) => b.ties - a.ties),
    totals: {
      companies: industries.reduce((acc, i) => acc + i.companies, 0),
      revenue: industries.reduce((acc, i) => acc + i.revenue.total, 0),
      netIncome: industries.reduce((acc, i) => acc + i.netIncome.total, 0),
      employees: industries.reduce((acc, i) => acc + i.employees.total, 0),
      totalAssets: industries.reduce((acc, i) => acc + i.totalAssets.total, 0),
      lossMaking: industries.reduce((acc, i) => acc + i.lossMaking.companies, 0),
      withNetIncome: industries.reduce((acc, i) => acc + i.lossMaking.of, 0),
    },
  };
}

/**
 * The five-year revenue index (JCE-042): for each industry, the revenue of the companies whose five printed years
 * are complete, added up year by year and set to 100 at the oldest year. Companies with fewer years are left out
 * of the series (not of the sums above), so the line compares the same companies with themselves — a changing
 * roster would otherwise draw growth that is only new entries. Years are positions in the filing's five-year
 * table (5期前 … 最新期); the label is the calendar year most of the companies' periods end in.
 */
export type IndexSeries = { id: IndustryId | "all"; name: string; companies: number; labels: string[]; values: number[] };

export function revenueIndexSeries(companies: Company[]): { all: IndexSeries; industries: IndexSeries[] } {
  return indexSeries(companies, (r) => r.revenue);
}

/** The five-year index of any printed line, built the same way as the revenue index (JCE-042, JCE-047). */
export function indexSeries(companies: Company[], pick: (r: FinancialRecord) => number | null): { all: IndexSeries; industries: IndexSeries[] } {
  const complete = companies
    .map((c) => ({ c, records: byPeriod(c.financials) }))
    .filter(({ records }) => records.length >= 5 && records.slice(-5).every((r) => { const v = pick(r); return v != null && v > 0; }))
    .map(({ c, records }) => ({ c, records: records.slice(-5) }));

  const build = (id: IndexSeries["id"], name: string, members: typeof complete): IndexSeries => {
    const sums = [0, 0, 0, 0, 0];
    const years: Map<string, number>[] = [new Map(), new Map(), new Map(), new Map(), new Map()];
    for (const { records } of members) {
      records.forEach((r, k) => {
        sums[k] += pick(r)!;
        const y = r.periodEnd.slice(0, 4);
        years[k].set(y, (years[k].get(y) ?? 0) + 1);
      });
    }
    const labels = years.map((m) => [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "");
    const base = sums[0];
    return { id, name, companies: members.length, labels, values: base > 0 ? sums.map((s) => (s / base) * 100) : [] };
  };

  const groups = new Map<IndustryId, typeof complete>();
  for (const m of complete) {
    const id = primaryIndustry(m.c);
    if (!id) continue;
    groups.set(id, [...(groups.get(id) ?? []), m]);
  }
  return {
    all: build("all", "全業界", complete),
    industries: [...groups.entries()].map(([id, members]) => build(id, INDUSTRY_LABELS[id].name, members)).sort((a, b) => b.companies - a.companies),
  };
}
