import type { IndustryId } from "@/types/company";

/**
 * Names for every id in the taxonomy. These are labels, not claims, so they
 * need no source — and every industry needs one even before its explanation
 * has been researched, because a company can already point at it.
 */
export const INDUSTRY_LABELS: Record<IndustryId, { name: string; nameEn: string }> = {
  automotive: { name: "自動車", nameEn: "Automotive" },
  semiconductors: { name: "半導体", nameEn: "Semiconductors" },
  electronics: { name: "電機・エレクトロニクス", nameEn: "Electronics" },
  it: { name: "IT・ソフトウェア", nameEn: "IT" },
  finance: { name: "金融", nameEn: "Finance" },
  trading: { name: "商社", nameEn: "Trading" },
  food: { name: "食品", nameEn: "Food" },
  retail: { name: "小売", nameEn: "Retail" },
  "real-estate": { name: "不動産", nameEn: "Real Estate" },
  construction: { name: "建設", nameEn: "Construction" },
  chemicals: { name: "化学", nameEn: "Chemicals" },
  pharmaceuticals: { name: "医薬品", nameEn: "Pharmaceuticals" },
  transportation: { name: "運輸", nameEn: "Transportation" },
  energy: { name: "エネルギー", nameEn: "Energy" },
  telecommunications: { name: "通信", nameEn: "Telecommunications" },
  media: { name: "メディア", nameEn: "Media" },
  entertainment: { name: "エンターテインメント", nameEn: "Entertainment" },
};
