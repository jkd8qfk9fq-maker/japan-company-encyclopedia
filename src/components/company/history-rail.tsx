import type { HistoryEvent } from "@/types/company";

/** Round years for the axis: every 50 years over a long history, every 10 over a short one. */
function ticks(first: number, last: number): number[] {
  const step = last - first > 60 ? 50 : 10;
  const out: number[] = [];
  for (let year = Math.ceil(first / step) * step; year < last; year += step) out.push(year);
  // A tick a few years from either end would print on top of that end's own label.
  return out.filter((year) => year - first >= step / 4 && last - year >= step / 4);
}

/**
 * The whole history on one line, before the table: where the turning points cluster, and how far back the company
 * goes. Each point jumps to its row in the table, which stays the readable (and screen-reader) version — this line
 * is an overview for sighted readers, so it is hidden from assistive technology and its points are not tab stops.
 * Wide screens only: a phone already reads the history as a vertical timeline.
 */
export function HistoryRail({ events, rowId }: { events: HistoryEvent[]; rowId: (index: number) => string }) {
  if (events.length < 2) return null;
  const first = events[0].year;
  const last = events.at(-1)!.year;
  if (first === last) return null;
  const at = (year: number) => `${((year - first) / (last - first)) * 100}%`;

  return (
    <div aria-hidden className="mb-12 hidden px-3 md:block">
      <div className="relative h-16">
        <div className="absolute inset-x-0 top-6 h-px bg-foreground" />
        {events.map((event, i) => (
          <a
            key={`${event.year}-${event.title}`}
            href={`#${rowId(i)}`}
            tabIndex={-1}
            title={`${event.year}年 ${event.title}`}
            className="absolute top-6 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground transition-transform hover:scale-150"
            style={{ left: at(event.year) }}
          />
        ))}
        {[first, ...ticks(first, last), last].map((year, i, all) => (
          <span
            key={year}
            className={`wordmark figures absolute top-10 text-lg text-muted-foreground ${
              i === 0 ? "" : i === all.length - 1 ? "-translate-x-full" : "-translate-x-1/2"
            }`}
            style={{ left: at(year) }}
          >
            {year}
          </span>
        ))}
      </div>
    </div>
  );
}
