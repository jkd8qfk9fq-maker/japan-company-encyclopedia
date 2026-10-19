import { RichText } from "@/components/rich-text/rich-text";
import { SourceList } from "@/components/sources/source-list";
import { firstSentence } from "@/lib/rich-text";
import type { HistoryEvent } from "@/types/company";
import type { Source } from "@/types/source";

const COLUMN = 176;

/**
 * Turning points as a timeline, after the approved mockup. On a wide screen every event sits on one horizontal
 * line, labels alternating above and below so neighbours never collide; a long history scrolls sideways inside the
 * section rather than shrinking. On a phone the same events run down a vertical line. Both show year and title —
 * what the line is for — and the full year | 出来事 | 意味 table opens below, so the 意味 column (why the event
 * explains the company today, the reason this section exists) is one click away, never dropped.
 */
export function HistoryTimeline({ events, sources }: { events: HistoryEvent[]; sources: Source[] }) {
  const sorted = [...events].sort((a, b) => a.year - b.year);
  const allSourceIds = [...new Set(sorted.flatMap((e) => e.sourceIds))];
  const width = Math.max(sorted.length * COLUMN, 0);

  return (
    <div>
      <div className="hidden overflow-x-auto pb-2 md:block">
        <ol aria-label="年表" className="relative h-60" style={{ width, minWidth: "100%" }}>
          <li aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-foreground" />
          {sorted.map((event, i) => {
            const above = i % 2 === 0;
            return (
              <li
                key={`${event.year}-${event.title}`}
                className="absolute top-0 h-full"
                style={{ left: i * COLUMN, width: COLUMN }}
              >
                <span aria-hidden className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 rounded-full border-2 border-paper bg-foreground" />
                <div className={above ? "absolute bottom-[calc(50%+1.25rem)] left-4 w-[10rem]" : "absolute top-[calc(50%+1.25rem)] left-4 w-[10rem]"}>
                  <p className="wordmark figures text-[1.375rem] leading-none">{event.year}</p>
                  <p className="mt-1.5 line-clamp-3 text-[0.8125rem] leading-5">{event.title}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <ol className="relative space-y-6 border-l-2 border-foreground pl-6 md:hidden">
        {sorted.map((event) => (
          <li key={`${event.year}-${event.title}`} className="relative">
            <span aria-hidden className="absolute top-2.5 -left-[1.9rem] size-3 rounded-full bg-foreground" />
            <p className="wordmark figures text-2xl leading-none">{event.year}</p>
            <p className="mt-1.5 font-serif leading-snug font-semibold">{event.title}</p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              <RichText text={firstSentence(event.description)} />
            </p>
          </li>
        ))}
      </ol>

      <details className="group mt-6">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
          全{sorted.length}件を「出来事」と「意味」で読む
        </summary>
        <table className="mt-4 hidden w-full border-collapse text-left md:table">
          <caption className="sr-only">主な転換点（年・出来事・意味）</caption>
          <thead>
            <tr className="border-b border-foreground text-xs tracking-[0.08em] text-muted-foreground">
              <th scope="col" className="w-24 py-3 pr-6 font-semibold">年</th>
              <th scope="col" className="w-[42%] py-3 pr-8 font-semibold">出来事</th>
              <th scope="col" className="py-3 font-semibold">意味</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((event) => (
              <tr key={`${event.year}-${event.title}`} className="border-b border-border align-top">
                <th scope="row" className="wordmark figures py-5 pr-6 text-2xl font-normal">
                  {event.year}
                </th>
                <td className="py-5 pr-8">
                  <p className="font-serif leading-snug font-semibold">{event.title}</p>
                  <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                    <RichText text={event.description} />
                  </p>
                </td>
                <td className="py-5 text-sm leading-7">
                  <RichText text={event.significance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="mt-4 space-y-6 md:hidden">
          {sorted.map((event) => (
            <div key={`${event.year}-${event.title}`} className="border-b border-border pb-5">
              <dt>
                <span className="wordmark figures mr-2 text-xl">{event.year}</span>
                <span className="font-serif font-semibold">{event.title}</span>
              </dt>
              <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                <RichText text={event.description} />
              </dd>
              <dd className="mt-3 rounded-md bg-paper p-3 text-sm leading-7">
                <span className="mr-2 text-xs font-semibold text-muted-foreground">意味</span>
                <RichText text={event.significance} />
              </dd>
            </div>
          ))}
        </dl>
      </details>

      <SourceList sources={sources} sourceIds={allSourceIds} className="mt-2" />
    </div>
  );
}
