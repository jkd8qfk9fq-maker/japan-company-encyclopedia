"use client";

import map from "@/assets/japan/prefectures.json";
import Link from "next/link";
import { Minus, Plus, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PREFECTURES } from "@/lib/prefectures";

/** Company counts at which a prefecture's shade steps up. Steps, not a continuous scale: Tokyo alone is over half. */
export const MAP_STEPS = [
  { from: 1, label: "1–2社", opacity: 0.16 },
  { from: 3, label: "3–9社", opacity: 0.32 },
  { from: 10, label: "10–29社", opacity: 0.5 },
  { from: 30, label: "30–99社", opacity: 0.72 },
  { from: 100, label: "100社以上", opacity: 1 },
];

const opacityFor = (count: number) => [...MAP_STEPS].reverse().find((s) => count >= s.from)?.opacity ?? 0;

const [FX, FY, FW, FH] = map.viewBox.split(" ").map(Number);
const FULL = { x: FX, y: FY, w: FW, h: FH };
type View = typeof FULL;
const MAX_ZOOM = 8;
/** From this zoom on, prefecture names are written on the map; below it the whole country stays unlabelled. */
const LABEL_ZOOM = 1.8;
/** A pointer that travels further than this (px) was a drag, not a tap, and must not open a prefecture. */
const TAP_SLOP = 8;

const byCode = new Map<string, (typeof PREFECTURES)[number]>(PREFECTURES.map((p) => [p.code, p]));
const shortName = (name: string) => (name === "北海道" ? name : name.replace(/[都府県]$/, ""));

/** Zoom in or out by `factor` around the point (cx, cy) in map units, kept inside the country. */
function zoomed(view: View, factor: number, cx: number, cy: number): View {
  const w = Math.min(FULL.w, Math.max(FULL.w / MAX_ZOOM, view.w / factor));
  const h = (w * FULL.h) / FULL.w;
  const x = cx - ((cx - view.x) * w) / view.w;
  const y = cy - ((cy - view.y) * h) / view.h;
  return clamp({ x, y, w, h });
}

/** A view around one prefecture: its outline at about half the map's width or height, its neighbours around it. */
function focusOn(code: string): View {
  const shape = map.prefectures.find((p) => p.code === code);
  if (!shape) return FULL;
  const xs: number[] = [];
  const ys: number[] = [];
  for (const m of shape.d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)) {
    xs.push(Number(m[1]));
    ys.push(Number(m[2]));
  }
  const span = Math.max((Math.max(...xs) - Math.min(...xs)) / FULL.w, (Math.max(...ys) - Math.min(...ys)) / FULL.h);
  const factor = Math.min(5, Math.max(LABEL_ZOOM, 0.5 / span));
  return zoomed(clamp({ ...FULL, x: shape.x - FULL.w / 2, y: shape.y - FULL.h / 2 }), factor, shape.x, shape.y);
}

function clamp(view: View): View {
  return {
    ...view,
    x: Math.min(FULL.x + FULL.w - view.w, Math.max(FULL.x, view.x)),
    y: Math.min(FULL.y + FULL.h - view.h, Math.max(FULL.y, view.y)),
  };
}

/**
 * Japan by prefecture, shaded by how many of the encyclopedia's companies have their head office there, each
 * prefecture a link to its page. It shows where companies are registered, not where they work: a factory town can be
 * pale because the company's head office is in Tokyo.
 *
 * A Client Component for one reason: on a phone the whole country is too small to tap Tokyo or Kagawa, so the map
 * zooms (pinch, the ＋/− buttons, or a trackpad pinch) and pans (drag, once zoomed). Names are written only once it is
 * zoomed in — on the whole country they would cover the shapes they name. Without script it is still the same SVG
 * of plain links.
 *
 * The outlines are Natural Earth's (public domain), simplified, with the Okinawa Islands in a frame in the Pacific
 * (scripts/maps/build-japan-map.mjs).
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
  const byId = PREFECTURES.find((p) => p.id === current);
  // A prefecture's page opens on that prefecture, named, with its neighbours a tap away; every other map on the whole.
  const start = byId ? focusOn(byId.code) : FULL;
  const [view, setView] = useState<View>(start);
  const [width, setWidth] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const travelled = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const zoom = FULL.w / view.w;
  const toMap = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: view.x + ((clientX - rect.left) / rect.width) * view.w, y: view.y + ((clientY - rect.top) / rect.height) * view.h };
  };
  const zoomBy = (factor: number) => setView((v) => zoomed(v, factor, v.x + v.w / 2, v.y + v.h / 2));

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) travelled.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const before = pointers.current.get(e.pointerId);
    if (!before || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = view.w / rect.width;
    if (pointers.current.size === 1) {
      const dx = e.clientX - before.x;
      const dy = e.clientY - before.y;
      travelled.current += Math.hypot(dx, dy);
      if (zoom > 1) setView((v) => clamp({ ...v, x: v.x - dx * scale, y: v.y - dy * scale }));
    } else if (pointers.current.size === 2) {
      const [other] = [...pointers.current].filter(([id]) => id !== e.pointerId).map(([, p]) => p);
      const was = Math.hypot(before.x - other.x, before.y - other.y);
      const now = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      travelled.current += TAP_SLOP;
      if (was > 0) {
        const mid = toMap((e.clientX + other.x) / 2, (e.clientY + other.y) / 2);
        setView((v) => zoomed(v, now / was, mid.x, mid.y));
      }
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: React.PointerEvent) => pointers.current.delete(e.pointerId);

  // A trackpad pinch arrives as a wheel event with ctrlKey; a plain wheel keeps scrolling the page.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      setView((v) => {
        const cx = v.x + ((e.clientX - rect.left) / rect.width) * v.w;
        const cy = v.y + ((e.clientY - rect.top) / rect.height) * v.h;
        return zoomed(v, Math.exp(-e.deltaY / 100), cx, cy);
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  // Text and lines are sized in map units; these keep them the same size on screen at every zoom.
  const px = width > 0 ? view.w / width : FULL.w / 400;
  const labels = zoom >= LABEL_ZOOM;

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        role="group"
        aria-label="都道府県ごとの掲載企業の本社の数。都道府県を選ぶと、その都道府県の企業が開きます。"
        className="block h-auto w-full touch-pan-y select-none data-[zoomed=true]:touch-none"
        data-zoomed={zoom > 1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onClickCapture={(e) => {
          if (travelled.current > TAP_SLOP) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <rect
          x={map.inset.x}
          y={map.inset.y}
          width={map.inset.width}
          height={map.inset.height}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {map.prefectures.map((shape) => {
          const prefecture = byCode.get(shape.code)!;
          const count = counts[prefecture.id] ?? 0;
          const here = prefecture.id === current;
          return (
            // next/link, not a raw href with BASE_PATH: @/lib/site checks the server-only SITE_URL when it loads, which
            // throws in the browser and took the whole home page down (2026-11-02).
            <Link
              key={shape.code}
              href={`/prefectures/${prefecture.id}`}
              aria-label={`${prefecture.name} ${count}社`}
              className="group outline-none"
              draggable={false}
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
                vectorEffect="non-scaling-stroke"
                className="transition-[fill-opacity] group-hover:fill-[var(--seal)] group-hover:[fill-opacity:0.85] group-focus-visible:fill-[var(--seal)]"
              />
            </Link>
          );
        })}
        {labels && (
          <g aria-hidden className="pointer-events-none" fontSize={11 * px} textAnchor="middle">
            {map.prefectures.map((shape) => {
              const prefecture = byCode.get(shape.code)!;
              const count = counts[prefecture.id] ?? 0;
              return (
                <text
                  key={shape.code}
                  x={shape.x}
                  y={shape.y}
                  fill="var(--foreground)"
                  stroke="var(--background)"
                  strokeWidth={3 * px}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                >
                  <tspan fontWeight={600}>{shortName(prefecture.name)}</tspan>
                  {count > 0 && (
                    <tspan x={shape.x} dy={12 * px} fontSize={9.5 * px} fill="var(--muted-foreground)">
                      {count}社
                    </tspan>
                  )}
                </text>
              );
            })}
          </g>
        )}
        {!labels && (
          <text
            x={map.inset.x + 5 * px}
            y={map.inset.y + map.inset.height - 5 * px}
            fontSize={9 * px}
            fill="var(--muted-foreground)"
            className="pointer-events-none"
          >
            沖縄県
          </text>
        )}
      </svg>

      {/* Under the map, not on it: a control over the map would hide whatever prefecture lies beneath it. */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[0.6875rem] text-muted-foreground">
          {zoom > 1 ? "ドラッグで移動できます" : <span className="md:hidden">2本の指で広げると拡大できます</span>}
        </p>
        <div className="flex shrink-0 overflow-hidden rounded-md border border-border">
          <button type="button" onClick={() => zoomBy(1.6)} disabled={zoom >= MAX_ZOOM} aria-label="拡大" className="flex size-10 items-center justify-center hover:bg-muted disabled:opacity-40">
            <Plus className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={() => zoomBy(1 / 1.6)} disabled={zoom <= 1} aria-label="縮小" className="flex size-10 items-center justify-center border-l border-border hover:bg-muted disabled:opacity-40">
            <Minus className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={() => setView(FULL)} disabled={zoom <= 1} aria-label="全体を表示" className="flex size-10 items-center justify-center border-l border-border hover:bg-muted disabled:opacity-40">
            <Maximize2 className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
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
