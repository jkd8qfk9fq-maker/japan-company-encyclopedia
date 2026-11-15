import type { RelationshipKind } from "@/types/company";

/**
 * How a relation reads from each end (JCE-052). A relation is stored on one company and names the other
 * (`supplier` = the other company is this one's supplier); walking it backwards, the same fact reads the other way
 * round — the supplier's customer. Symmetric kinds read the same from both ends. Used by the connection explorer,
 * which follows relations in both directions.
 */
export const OUTWARD_LABEL: Record<RelationshipKind, string> = {
  "same-industry": "同じ業界",
  competitor: "競合",
  supplier: "仕入先",
  customer: "顧客",
  technology: "技術のつながり",
  "same-business-model": "似たビジネスモデル",
  "business-partner": "取引関係",
  parent: "親会社",
  subsidiary: "子会社",
  affiliate: "関連会社",
  "other-affiliated-company": "その他の関係会社",
  "major-shareholder": "大株主",
};

export const INWARD_LABEL: Record<RelationshipKind, string> = {
  ...OUTWARD_LABEL,
  supplier: "顧客",
  customer: "仕入先",
  parent: "子会社",
  subsidiary: "親会社",
  affiliate: "出資元",
  "other-affiliated-company": "出資先",
  "major-shareholder": "出資先",
};

/** The three ways two companies can be tied, in the order a reader asks about them. */
export type RelationGroup = "trade" | "peers" | "capital";

export const GROUP_OF: Record<RelationshipKind, RelationGroup> = {
  supplier: "trade",
  customer: "trade",
  "business-partner": "trade",
  competitor: "peers",
  "same-industry": "peers",
  "same-business-model": "peers",
  technology: "peers",
  parent: "capital",
  subsidiary: "capital",
  affiliate: "capital",
  "other-affiliated-company": "capital",
  "major-shareholder": "capital",
};

export const GROUP_LABEL: Record<RelationGroup, string> = {
  trade: "取引でつながる（サプライチェーン）",
  peers: "競合・同業",
  capital: "資本でつながる",
};
