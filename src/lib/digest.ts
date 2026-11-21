import type { UpdateKind, UpdatesData } from "@/lib/engagement-data";
import { addDays, weekEnd, weekStart } from "@/lib/jst-dates";

/**
 * The earnings digest — 決算定期便 (JCE-082): the filing events the updates data already holds (JCE-052,
 * with the figures each filing prints, JCE-071), arranged into this week and last week. The digest is not a
 * news feed: each filing arrives with the way to read it — the micro-lesson that teaches the relevant
 * reading, and the company's own report page, where the five-perspective analysis waits. What is practised
 * in the lessons is meant to be used here, on filings that have just come out.
 */

export type DigestEvent = {
  companyId: string;
  companyName: string;
  kind: UpdateKind;
  date: string;
  title: string;
  /** What the filing itself says — its period and printed revenue and net income (JCE-071), when it has them. */
  summary?: string;
  /** The reading this filing calls for: a lesson or a place on the company page. */
  reading: { label: string; href: string };
};

export type Digest = {
  thisWeek: DigestEvent[];
  lastWeek: DigestEvent[];
};

const readingFor = (kind: UpdateKind, companyId: string): DigestEvent["reading"] => {
  switch (kind) {
    case "tanshin":
      return { label: "読み方：先に予想して、答え合わせ（マイクロレッスン）", href: "/learn#micro-revenue-and-profit" };
    case "correction":
      return { label: "読み方：訂正は企業ページの数字で確かめる", href: `/companies/${companyId}#financials` };
    default:
      return { label: "読み方：売上と利益の違い（マイクロレッスン）", href: "/learn#micro-revenue-and-profit" };
  }
};

export function buildDigest(updates: UpdatesData, today: string): Digest {
  const thisStart = weekStart(today);
  const thisEnd = weekEnd(today);
  const lastStart = addDays(thisStart, -7);
  const lastEnd = addDays(thisEnd, -7);
  const events: DigestEvent[] = updates.events.map(([companyId, kind, date, title, summary]) => ({
    companyId,
    companyName: updates.names[companyId] ?? companyId,
    kind,
    date,
    title,
    summary,
    reading: readingFor(kind, companyId),
  }));
  const inRange = (e: DigestEvent, start: string, end: string) => e.date >= start && e.date <= end;
  return {
    thisWeek: events.filter((e) => inRange(e, thisStart, thisEnd)),
    lastWeek: events.filter((e) => inRange(e, lastStart, lastEnd)),
  };
}
