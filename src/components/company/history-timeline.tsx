import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import type { HistoryEvent } from "@/types/company";
import type { Source } from "@/types/source";
import { HistoryRail } from "./history-rail";

/**
 * Turning points, not a chronology. The 意味 column is the reason this
 * component exists: an event without "why it made the company what it is
 * today" is trivia.
 *
 * A real <table> on wide screens (年 | 出来事 | 意味 is genuinely tabular) and
 * a stacked timeline on phones, where three columns of Japanese prose would
 * leave four characters per line.
 */
export function HistoryTimeline({ events, sources }: { events: HistoryEvent[]; sources: Source[] }) {
  const sorted = [...events].sort((a, b) => a.year - b.year);
  const allSourceIds = [...new Set(sorted.flatMap((e) => e.sourceIds))];
  const rowId = (index: number) => `history-row-${index}`;

  return (
    <div>
      <HistoryRail events={sorted} rowId={rowId} />
      <table className="hidden w-full border-collapse text-left md:table">
        <caption className="sr-only">主な転換点（年・出来事・意味）</caption>
        <thead>
          <tr className="border-b border-foreground text-xs tracking-[0.08em] text-muted-foreground">
            <th scope="col" className="w-28 py-3 pr-6 font-semibold">年</th>
            <th scope="col" className="w-[42%] py-3 pr-8 font-semibold">出来事</th>
            <th scope="col" className="py-3 font-semibold">意味</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((event, i) => (
            <tr key={`${event.year}-${event.title}`} id={rowId(i)} className="scroll-mt-40 border-b border-border align-top">
              <th scope="row" className="wordmark figures py-7 pr-6 text-3xl font-normal">
                {event.year}
              </th>
              <td className="py-7 pr-8">
                <p className="font-serif text-lg leading-snug font-semibold">{event.title}</p>
                <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
                  <RichText text={event.description} />
                </p>
              </td>
              <td className="py-7 text-[0.9375rem] leading-7">
                <RichText text={event.significance} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ol className="relative space-y-10 border-l border-foreground pl-6 md:hidden">
        {sorted.map((event) => (
          <li key={`${event.year}-${event.title}`} className="relative">
            <span aria-hidden className="absolute top-3 -left-[1.6875rem] size-2 rounded-full bg-foreground" />
            <p className="wordmark figures text-3xl">{event.year}</p>
            <p className="mt-2 font-serif text-lg leading-snug font-semibold">{event.title}</p>
            <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
              <RichText text={event.description} />
            </p>
            <div className="mt-4 rounded-md bg-paper p-4">
              <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">意味</p>
              <p className="mt-1 text-[0.9375rem] leading-7">
                <RichText text={event.significance} />
              </p>
            </div>
          </li>
        ))}
      </ol>

      <SourceList sources={sources} sourceIds={allSourceIds} className="mt-8" />
    </div>
  );
}
