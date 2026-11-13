import { median } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, FinancialRecord, IndustryId } from "@/types/company";

/**
 * 財務の深掘り (JCE-044): how a company's structure moves over its five printed years, beside the median of its
 * industry's released companies year by year.
 *
 * Four readings, all arithmetic on figures as printed in the same year, each with its formula:
 *   利益率の推移      純利益 ÷ 売上高, and the filing's own profit line (営業利益 or 経常利益, as labelled) ÷ 売上高
 *   自己資本比率      純資産 ÷ 総資産 — how much of what the company holds is its own, not borrowed
 *   従業員1人あたり   売上高 ÷ 従業員数, 純利益 ÷ 従業員数 (the consolidated headcount the filing prints)
 *   規模の推移        総資産・純資産・従業員数, each as an index with the oldest year = 100
 * The industry line is the median over companies of the same ratio in the same position of their five-year
 * table (5期前 … 最新期), so it compares the same roster with itself. A year a company does not print is a gap
 * in its line, never a filled-in value. ROE, ROA and every market measure stay out (invariant 4).
 */

export type Point = { label: string; value: number | null };

export type Trend = {
  key: string;
  title: string;
  formula: string;
  /** How the values print: percent (0.1 → 10.0%), yen (whole yen), index (100 = oldest year). */
  unit: "percent" | "yen" | "index";
  company: Point[];
  industry: Point[];
  industryCompanies: number;
};

export type FinancialDeepDive = {
  industryId: IndustryId;
  industryName: string;
  fiscalYears: string[];
  trends: Trend[];
};

const YEARS = 5;

function last5(company: Company): FinancialRecord[] | null {
  const records = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  return records.length >= YEARS ? records.slice(-YEARS) : null;
}

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

type Reader = (r: FinancialRecord, first: FinancialRecord) => number | null;

const ratio = (num: number | null, den: number | null) => (num !== null && den !== null && den > 0 ? num / den : null);

const READERS: { key: string; title: string; formula: string; unit: Trend["unit"]; read: Reader }[] = [
  { key: "net-margin", title: "純利益率", formula: "純利益 ÷ 売上高", unit: "percent", read: (r) => ratio(r.netIncome, r.revenue) },
  { key: "profit-margin", title: "利益率（有報の利益の行）", formula: "有報に印字された利益（営業利益または経常利益） ÷ 売上高", unit: "percent", read: (r) => ratio(r.profit, r.revenue) },
  { key: "equity-ratio", title: "自己資本比率", formula: "純資産 ÷ 総資産", unit: "percent", read: (r) => ratio(r.netAssets, r.totalAssets) },
  { key: "revenue-per-employee", title: "従業員1人あたり売上高", formula: "売上高 ÷ 従業員数（連結）", unit: "yen", read: (r) => ratio(r.revenue, r.employees) },
  { key: "net-income-per-employee", title: "従業員1人あたり純利益", formula: "純利益 ÷ 従業員数（連結）", unit: "yen", read: (r) => (r.employees !== null && r.employees > 0 && r.netIncome !== null ? r.netIncome / r.employees : null) },
  { key: "total-assets-index", title: "総資産の推移（指数）", formula: "各期の総資産 ÷ 5期前の総資産 × 100", unit: "index", read: (r, first) => (first.totalAssets !== null && first.totalAssets > 0 && r.totalAssets !== null ? (r.totalAssets / first.totalAssets) * 100 : null) },
  { key: "net-assets-index", title: "純資産の推移（指数）", formula: "各期の純資産 ÷ 5期前の純資産 × 100", unit: "index", read: (r, first) => (first.netAssets !== null && first.netAssets > 0 && r.netAssets !== null ? (r.netAssets / first.netAssets) * 100 : null) },
  { key: "employees-index", title: "従業員数の推移（指数）", formula: "各期の従業員数 ÷ 5期前の従業員数 × 100", unit: "index", read: (r, first) => (first.employees !== null && first.employees > 0 && r.employees !== null ? (r.employees / first.employees) * 100 : null) },
];

export function financialDeepDive(company: Company, companies: Company[]): FinancialDeepDive | null {
  const own = last5(company);
  const industryId = primaryIndustry(company);
  if (!own || !industryId) return null;
  const members = companies.filter((c) => c.id !== company.id && primaryIndustry(c) === industryId).map(last5).filter((r): r is FinancialRecord[] => r !== null);
  const fiscalYears = own.map((r) => r.fiscalYear);
  // The industry's year labels are positions; the label shown is the company's own year in that position.
  const trends: Trend[] = READERS.map((reader) => {
    const companyPoints = own.map((r, k) => ({ label: fiscalYears[k]!, value: reader.read(r, own[0]!) }));
    let counted = 0;
    const industryPoints = fiscalYears.map((label, k) => {
      const values = members.map((rs) => reader.read(rs[k]!, rs[0]!)).filter((v): v is number => v !== null);
      counted = Math.max(counted, values.length);
      return { label, value: median(values) };
    });
    return { key: reader.key, title: reader.title, formula: reader.formula, unit: reader.unit, company: companyPoints, industry: industryPoints, industryCompanies: counted };
  }).filter((t) => t.company.some((p) => p.value !== null));
  if (trends.length === 0) return null;
  return { industryId, industryName: INDUSTRY_LABELS[industryId].name, fiscalYears, trends };
}
