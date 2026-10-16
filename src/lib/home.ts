import type { Company, FinancialRecord } from "@/types/company";

/**
 * Which companies the front page shows, decided here rather than in the page so the rule is testable.
 *
 * Both lists only ever offer companies whose page has been written and is not under review: a
 * `figures-only` page is a table with no explanation, and `needs-attention` is not what a first-time
 * reader should land on from the cover. Neither list is a ranking — the cards are labelled
 * 「解説つきの企業」, and the order is only a stable way to pick which three to show.
 */

/** A year with both revenue and net income, which is what the card's chart can draw. */
const hasBoth = (r: FinancialRecord) => r.revenue !== null && r.netIncome !== null;

const MIN_YEARS_FOR_CHART = 4;

export function latestRecord(company: Company): FinancialRecord | null {
  return [...company.financials].sort((a, b) => b.periodEnd.localeCompare(a.periodEnd))[0] ?? null;
}

/**
 * Published companies with enough complete years for the chart to say something, largest latest
 * revenue first, ties by id. The five most recent years are what the card draws.
 */
export function featuredCompanies(companies: Company[], limit = 3): Company[] {
  return companies
    .filter((c) => c.status.state === "published" && c.description !== null && c.financials.filter(hasBoth).length >= MIN_YEARS_FOR_CHART)
    .sort((a, b) => (latestRecord(b)?.revenue ?? 0) - (latestRecord(a)?.revenue ?? 0) || a.id.localeCompare(b.id))
    .slice(0, limit);
}

/** The five most recent years that have both figures, oldest first, for the card's chart. */
export function chartRecords(company: Company, years = 5): FinancialRecord[] {
  return company.financials
    .filter(hasBoth)
    .sort((a, b) => b.periodEnd.localeCompare(a.periodEnd))
    .slice(0, years)
    .reverse();
}

/** Described companies, most recently updated first (ties by id), skipping figures-only pages. */
export function recentlyUpdated(companies: Company[], limit = 5): Company[] {
  return companies
    .filter((c) => c.status.state !== "figures-only")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id))
    .slice(0, limit);
}

/** "2026-10-11" → "10/11". Text, not Date, so the server's time zone cannot move the day. */
export function shortDate(isoDate: string): string {
  const match = /^\d{4}-(\d{2})-(\d{2})/.exec(isoDate);
  return match ? `${Number(match[1])}/${Number(match[2])}` : isoDate;
}
