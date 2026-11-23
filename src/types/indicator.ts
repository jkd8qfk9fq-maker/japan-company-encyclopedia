import type { IndustryId } from "@/types/company";

/**
 * An economic-indicator snapshot (JCE-078, spec §4): one public statistic, held as repo content so
 * the static site never fetches at runtime. Values are the publisher's own, without transformation:
 * the US series, the USD/JPY reference rate and the Cabinet Office's GDP come from FRED (the public
 * aggregator the spec allows) — a monthly-average conversion, where one is used, is FRED's own
 * published conversion and is named in the unit — and the remaining Japanese series come from the
 * publisher's own distribution (Statistics Bureau, Bank of Japan, METI, and the MHLW / MOF files on
 * e-Stat; JCE-107). Nothing here is a forecast, and no observation is ever filled in by hand.
 */
export type Indicator = {
  id: string;
  name: string;
  source: { name: string; url: string };
  unit: string;
  frequency: "monthly" | "quarterly";
  observations: { date: string; value: number }[];
  updatedAt: string;
};

/** One industry → indicator link of the mapping table, with its structural (never causal) note. */
export type IndustryIndicatorLink = {
  industryId: IndustryId;
  indicatorId: string;
  note: string;
};

export type IndustryIndicators = {
  links: IndustryIndicatorLink[];
};
