import map from "@/assets/japan/prefectures.json";
import { BASE_PATH } from "@/lib/site";
import { PREFECTURES } from "@/lib/prefectures";
import { cn } from "@/lib/utils";

/** Company counts at which a prefecture's shade steps up. Steps, not a continuous scale: Tokyo alone is over half. */
export const MAP_STEPS = [
  { from: 1, label: "1–2社", opacity: 0.16 },
  { from: 3, label: "3–9社", opacity: 0.32 },
  { from: 10, label: "10–29社", opacity: 0.5 },
  { from: 30, label: "30–99社", opacity: 0.72 },
  { from: 100, label: "100社以上", opacity: 1 },
];

const opacityFor = (count: number) => [...MAP_STEPS].reverse().find((s) => count >= s.from)?.opacity ?? 0;

/**
 * Japan by prefecture, shaded by how many of the encyclopedia's companies have their head office there, each
 * prefecture a link to its page. A server-rendered SVG with plain links: it needs no script, and a phone opens a
 * prefecture with one tap.
 *
 * The outlines are Natural Earth's (public domain), simplified, with Okinawa set apart in a frame in the Pacific
 * (scripts/maps/build-japan-map.mjs). It shows where companies are registered, not where they work: a factory town
 * can be pale because the company's head office is in Tokyo.
 */
export function JapanMap({
  counts,
  current,
  className,
}: {
  /** Companies per prefecture id. */
  counts: Record<string, number>;
  /** The prefecture whose page this is, drawn in the seal colour. */
  current?: string;
  className?: string;
}) {
  const byCode = new Map<string, (typeof PREFECTURES)[number]>(PREFECTURES.map((p) => [p.code, p]));
  return (
    <svg viewBox={map.viewBox} role="group" aria-label="都道府県ごとの掲載企業の本社の数" className={cn("h-auto w-full", className)}>
      <rect
        x={map.inset.x}
        y={map.inset.y}
        width={map.inset.width}
        height={map.inset.height}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1}
      />
      <text x={map.inset.x + 5} y={map.inset.y + map.inset.height - 5} fontSize={9} fill="var(--muted-foreground)">
        沖縄県
      </text>
      {map.prefectures.map((shape) => {
        const prefecture = byCode.get(shape.code)!;
        const count = counts[prefecture.id] ?? 0;
        const here = prefecture.id === current;
        return (
          <a
            key={shape.code}
            href={`${BASE_PATH}/prefectures/${prefecture.id}`}
            aria-label={`${prefecture.name} ${count}社`}
            className="group outline-none"
          >
            <title>{`${prefecture.name}　${count.toLocaleString("ja-JP")}社`}</title>
            {/* A grey base under the shade, so a prefecture with no company is still a shape and not a hole. */}
            <path d={shape.d} fill="var(--muted)" />
            <path
              d={shape.d}
              fill={here ? "var(--seal)" : "var(--ink)"}
              fillOpacity={here ? 1 : opacityFor(count)}
              stroke="var(--background)"
              strokeWidth={0.8}
              strokeLinejoin="round"
              className="transition-[fill-opacity] group-hover:fill-[var(--seal)] group-hover:[fill-opacity:0.85] group-focus-visible:fill-[var(--seal)]"
            />
          </a>
        );
      })}
    </svg>
  );
}

/** The key under a map: what each shade means. */
export function JapanMapLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground" aria-label="色の目安">
      {MAP_STEPS.map((step) => (
        <li key={step.from} className="flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-[2px] bg-ink" style={{ opacity: step.opacity }} />
          {step.label}
        </li>
      ))}
    </ul>
  );
}
