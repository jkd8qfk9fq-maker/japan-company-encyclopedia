import { indicators } from "@/data/indicators";
import industryIndicatorsData from "@/data/industry-indicators.json";
import { industryIndicatorsSchema, parseContent } from "@/lib/content/schemas";
import type { Indicator, IndustryIndicatorLink } from "@/types/indicator";
import type { IndustryId } from "@/types/company";

/**
 * Reading the indicator snapshots and the industry mapping (JCE-078 §4). The mapping is editorial
 * content: each link carries one structural sentence about why the two are shown side by side, and
 * never a claim that the indicator moves the industry (causality is not this site's to assert).
 */

export { indicators };

const links: IndustryIndicatorLink[] = parseContent(
  industryIndicatorsSchema,
  industryIndicatorsData,
  "src/data/industry-indicators.json",
).links;

const byId = new Map(indicators.map((i) => [i.id, i]));

export function getIndicator(id: string): Indicator | null {
  return byId.get(id) ?? null;
}

export function indicatorsForIndustry(industryId: IndustryId): { indicator: Indicator; note: string }[] {
  return links
    .filter((l) => l.industryId === industryId)
    .map((l) => ({ indicator: byId.get(l.indicatorId)!, note: l.note }))
    .filter((x) => x.indicator !== undefined);
}

export function industriesForIndicator(indicatorId: string): { industryId: IndustryId; note: string }[] {
  return links.filter((l) => l.indicatorId === indicatorId).map((l) => ({ industryId: l.industryId, note: l.note }));
}

export function latestObservation(indicator: Indicator): { date: string; value: number } | null {
  return indicator.observations.at(-1) ?? null;
}

export function previousObservation(indicator: Indicator): { date: string; value: number } | null {
  return indicator.observations.at(-2) ?? null;
}

/** "2026年10月" for a monthly point; "2026年7〜9月期" for a quarterly one (the date is the quarter's first day). */
export function observationPeriodLabel(indicator: Indicator, date: string): string {
  const [year, month] = date.split("-").map(Number);
  if (indicator.frequency === "monthly") return `${year}年${month}月`;
  return `${year}年${month}〜${month! + 2}月期`;
}

/** Snapshot values as printed by the publisher: thousands grouped, no rounding beyond two decimals. */
export function formatIndicatorValue(indicator: Indicator, value: number): string {
  void indicator;
  return value.toLocaleString("ja-JP", { maximumFractionDigits: 2 });
}
