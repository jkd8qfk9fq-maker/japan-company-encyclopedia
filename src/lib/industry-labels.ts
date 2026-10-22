import type { IndustryId } from "@/types/company";

/**
 * Names for every id in the taxonomy. These are labels, not claims, so they
 * need no source — and every industry needs one even before its explanation
 * has been researched, because a company can already point at it. `reading` (ひらがな) orders them in 50音順 in
 * search.
 */
export const INDUSTRY_LABELS: Record<IndustryId, { name: string; nameEn: string; reading: string }> = {
  automotive: { name: "自動車", nameEn: "Automotive", reading: "じどうしゃ" },
  semiconductors: { name: "半導体", nameEn: "Semiconductors", reading: "はんどうたい" },
  electronics: { name: "電機・エレクトロニクス", nameEn: "Electronics", reading: "でんき・えれくとろにくす" },
  it: { name: "IT・ソフトウェア", nameEn: "IT", reading: "あいてぃー・そふとうぇあ" },
  finance: { name: "金融", nameEn: "Finance", reading: "きんゆう" },
  trading: { name: "商社", nameEn: "Trading", reading: "しょうしゃ" },
  food: { name: "食品", nameEn: "Food", reading: "しょくひん" },
  retail: { name: "小売", nameEn: "Retail", reading: "こうり" },
  "real-estate": { name: "不動産", nameEn: "Real Estate", reading: "ふどうさん" },
  construction: { name: "建設", nameEn: "Construction", reading: "けんせつ" },
  chemicals: { name: "化学", nameEn: "Chemicals", reading: "かがく" },
  pharmaceuticals: { name: "医薬品", nameEn: "Pharmaceuticals", reading: "いやくひん" },
  transportation: { name: "運輸", nameEn: "Transportation", reading: "うんゆ" },
  energy: { name: "エネルギー", nameEn: "Energy", reading: "えねるぎー" },
  telecommunications: { name: "通信", nameEn: "Telecommunications", reading: "つうしん" },
  media: { name: "メディア", nameEn: "Media", reading: "めでぃあ" },
  entertainment: { name: "エンターテインメント", nameEn: "Entertainment", reading: "えんたーていんめんと" },
  machinery: { name: "機械", nameEn: "Machinery", reading: "きかい" },
  "human-resources": { name: "人材サービス", nameEn: "Human Resources", reading: "じんざいさーびす" },
  "funeral-memorial": { name: "葬祭・供養関連", nameEn: "Funeral & Memorial Services", reading: "そうさい・くようかんれん" },
};
