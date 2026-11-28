"use client";

import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { T } from "@/components/i18n/t";
import type { IndustryMapData } from "@/lib/industry-map";
import type { IndustryId } from "@/types/company";

// Client components cannot import @/lib/site (it resolves the server-only SITE_URL at load); the base path is
// read from the public env instead, as in search-suggest (tests/client-imports guards this).
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const W = 820;
const H = 640;
const CX = W / 2;
const CY = H / 2;
const MAX_COMPANIES = 28;
const TONES = 6;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.5;

type Point = { x: number; y: number };
type View = { k: number; tx: number; ty: number };

const on = (rx: number, ry: number, angle: number): Point => ({ x: CX + rx * Math.cos(angle), y: CY + ry * Math.sin(angle) });
// Spread n points round a ring, starting at the top.
const around = (i: number, n: number, offset = 0) => -Math.PI / 2 + ((i + offset) * 2 * Math.PI) / Math.max(n, 1);
const clampZoom = (k: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));

/**
 * How many company labels are drawn at a given zoom. The member chips sit on one ring, so at the fit-to-page
 * zoom neighbouring names overlap however they are placed; labels are therefore rationed by tie count (the
 * order `members` is already sorted in) and released as the reader zooms in — where, because a chip's drawn
 * size stops growing with the zoom (see `chipScale` below), the gaps between chips grow faster than the
 * chips themselves and the names separate.
 */
const labelBudget = (k: number) => (k < 1.4 ? 12 : k < 2.3 ? 20 : MAX_COMPANIES);

/** How much of the drawing's bounding box must stay inside the view when panning, in viewBox units. */
const PAN_KEEP = 60;

/**
 * A generous bound on where anything is drawn, from the layout's own constants: outer chips sit on
 * `on(360, 285)` and no chip is wider than ~200 units, members on `on(200, 176)` or inside it, the centre
 * at (CX, CY). The fitted viewBox is tighter; this bound only has to contain the drawing (with a margin
 * smaller than PAN_KEEP, so the clamp below still guarantees part of the real drawing stays in view).
 */
const DRAWING_BOUNDS = { minX: CX - 480, maxX: CX + 480, minY: CY - 330, maxY: CY + 330 };

/**
 * The estimated width of a label, without measuring: the drawing is server-rendered, so there is no canvas to
 * measure with. Half-width characters (ASCII) count as 0.55 of the font size, everything else — Japanese text is
 * full width — as the whole size. Every frame below is sized from this estimate, so a name is never cut off.
 */
const textWidth = (text: string, fontSize: number): number =>
  [...text].reduce((sum, ch) => sum + (/[ -~]/.test(ch) ? 0.55 : 1) * fontSize, 0);

/** A pointer position, in the drawing's own coordinates (before the reader's pan and zoom are applied). */
const svgPoint = (svg: SVGSVGElement, clientX: number, clientY: number): Point | null => {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
};

/**
 * An industry as a network, after the operator's reference (2026-11-01): the industry in the middle, its companies on
 * the inner ring, and on the outer ring every other industry they trade with — a line for each tie a company's entry
 * states as 仕入先 or 顧客 (the same ties the industry map counts), coloured by the industry it reaches, and the other
 * industry's frame carrying how many ties reach it. Ties between two companies of this industry are drawn across
 * the inner ring. Nothing is placed or sized by anything but those ties; a company with none is drawn without lines.
 *
 * Every labelled node is a frame with its whole name inside it — the centre circle is sized to the industry's name,
 * companies and other industries are chips — because a name cut off beside a dot cannot be read where lines cross
 * it. On a crowded ring not every company can be labelled at once, so companies past the zoom's label budget are
 * dots (still links, named by their title) until zooming releases their labels. The reader can drag the map —
 * clamped so the drawing can never be panned out of sight — and zoom it with the wheel or a pinch (JCE-134); the
 * first rendering is still the server's, links included, and the list under the map carries the same industries
 * and counts.
 */
export function IndustryNetwork({ industryId, data }: { industryId: IndustryId; data: IndustryMapData }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>({ k: 1, tx: 0, ty: 0 });
  const viewRef = useRef(view);
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, Point>());
  const dragMoved = useRef(0);
  const suppressClick = useRef(false);

  const applyView = useCallback((next: View) => {
    // Pan clamp: the drawing may slide, but at least PAN_KEEP units of its bounds stay inside the fitted
    // viewBox's span on every side, so no pan can carry the whole map — or its edge nodes with it — out of
    // sight. The viewBox always lies inside DRAWING_BOUNDS, so clamping against the viewBox span is done
    // through the bounds themselves: tx is limited as if the view were the bounds' own span.
    const b = DRAWING_BOUNDS;
    const tx = Math.min(Math.max(next.tx, b.minX + PAN_KEEP - next.k * b.maxX), b.maxX - PAN_KEEP - next.k * b.minX);
    const ty = Math.min(Math.max(next.ty, b.minY + PAN_KEEP - next.k * b.maxY), b.maxY - PAN_KEEP - next.k * b.minY);
    const clamped = { k: next.k, tx, ty };
    viewRef.current = clamped;
    setView(clamped);
  }, []);

  // Zoom by a factor, keeping the drawing point under `at` (in viewBox coordinates) where it is.
  const zoomAt = useCallback(
    (at: Point, factor: number) => {
      const v = viewRef.current;
      const k = clampZoom(v.k * factor);
      if (k === v.k) return;
      const cx = (at.x - v.tx) / v.k;
      const cy = (at.y - v.ty) / v.k;
      applyView({ k, tx: at.x - cx * k, ty: at.y - cy * k });
    },
    [applyView],
  );

  // The wheel zooms the map instead of scrolling the page while the pointer is over it, so the listener cannot
  // be passive; it is attached to the element itself rather than through React for that reason.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = svgPoint(svg, e.clientX, e.clientY);
      if (p) zoomAt(p, Math.exp(-e.deltaY * 0.0015));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const primaryOf = new Map<string, IndustryId>();
  for (const industry of data.industries) {
    for (const company of industry.companies) if (company.primary) primaryOf.set(company.id, industry.id);
  }
  const self = data.industries.find((i) => i.id === industryId);
  const members = (self?.companies.filter((c) => c.primary) ?? [])
    .sort((a, b) => b.ties.length - a.ties.length)
    .slice(0, MAX_COMPANIES);
  if (members.length === 0) return null;

  // Ties out of the industry, counted per industry reached; and ties inside it, between two members.
  const outward = new Map<IndustryId, number>();
  const edges: { from: string; to: IndustryId }[] = [];
  const inner: { from: string; to: string }[] = [];
  const memberIds = new Set(members.map((m) => m.id));
  for (const member of members) {
    for (const tie of member.ties) {
      const other = primaryOf.get(tie.companyId);
      if (!other) continue;
      if (other === industryId) {
        if (memberIds.has(tie.companyId) && member.id < tie.companyId) inner.push({ from: member.id, to: tie.companyId });
        continue;
      }
      outward.set(other, (outward.get(other) ?? 0) + 1);
      edges.push({ from: member.id, to: other });
    }
  }
  const others = [...outward.entries()].sort((a, b) => b[1] - a[1]);
  const name = new Map(data.industries.map((i) => [i.id, i.name]));
  const tone = new Map(others.map(([id], i) => [id, `var(--segment-${(i % TONES) + 1})`]));

  // Companies that trade with the same industry sit together on the ring, so their lines run side by side to it
  // instead of crossing the circle: each company is grouped under the industry it has most ties with, groups in the
  // order of the outer ring, companies with no tie outward last.
  const mainOf = (id: string) => {
    const counts = new Map<IndustryId, number>();
    for (const e of edges) if (e.from === id) counts.set(e.to, (counts.get(e.to) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  };
  const rank = new Map(others.map(([id], i) => [id, i]));
  const ordered = [...members].sort((a, b) => {
    const ra = rank.get(mainOf(a.id)!) ?? others.length;
    const rb = rank.get(mainOf(b.id)!) ?? others.length;
    return ra - rb || a.name.localeCompare(b.name, "ja");
  });
  const memberAngle = new Map(ordered.map((m, i) => [m.id, around(i, ordered.length)]));
  // Neighbours alternate between two radii 30 units apart — more than a chip's height — so two adjacent
  // names can share an angle without their frames touching; only every second neighbour can collide.
  const memberAt = new Map(
    ordered.map((m, i) => {
      const lift = i % 2 === 0 ? 0 : 30;
      return [m.id, on(170 + lift, 150 + lift * 0.88, memberAngle.get(m.id)!)] as const;
    }),
  );
  // Label priority is the tie-count order `members` was sorted in before the ring regrouping above.
  const labelRank = new Map(members.map((m, i) => [m.id, i]));

  // Each outer industry faces the companies tied to it (the circular mean of their angles), then neighbours are
  // pushed apart so no two frames overlap.
  const MIN_GAP = (2 * Math.PI) / Math.max(others.length * 1.6, 8);
  const facing = others.map(([id]) => {
    const angles = edges.filter((e) => e.to === id).map((e) => memberAngle.get(e.from)!);
    const angle = Math.atan2(
      angles.reduce((sum, a) => sum + Math.sin(a), 0),
      angles.reduce((sum, a) => sum + Math.cos(a), 0),
    );
    return { id, angle };
  });
  facing.sort((a, b) => a.angle - b.angle);
  for (let pass = 0; pass < 8; pass++) {
    for (let i = 1; i < facing.length; i++) {
      const gap = facing[i].angle - facing[i - 1].angle;
      if (gap < MIN_GAP) {
        const shift = (MIN_GAP - gap) / 2;
        facing[i - 1].angle -= shift;
        facing[i].angle += shift;
      }
    }
  }
  const otherAt = new Map(facing.map(({ id, angle }) => [id, on(360, 285, angle)]));

  // Frames: the centre circle grows until the industry's name fits inside it, and each chip is as wide as what it
  // carries — a company's whole name, or a colour dot, the industry's name and its count side by side.
  const centerR = Math.max(46, textWidth(name.get(industryId) ?? "", 17) / 2 + 20);
  const memberChipW = new Map(ordered.map((m) => [m.id, textWidth(m.name, 11.5) + 16]));
  const otherChip = new Map<IndustryId, { w: number; nameW: number }>();
  for (const [id, count] of others) {
    const nameW = textWidth(name.get(id) ?? "", 12.5);
    const countW = textWidth(String(count), 11.5);
    otherChip.set(id, { w: 12 + 10 + 6 + nameW + 6 + countW + 12, nameW });
  }

  // Fit the drawing to what is on it, frame by frame: a sparse industry should not sit in a field of empty space,
  // and no frame may be clipped by the edge.
  const boxes = [
    { x0: CX - centerR, y0: CY - centerR, x1: CX + centerR, y1: CY + centerR },
    ...ordered.map((m) => {
      const p = memberAt.get(m.id)!;
      const hw = memberChipW.get(m.id)! / 2;
      return { x0: p.x - hw, y0: p.y - 11, x1: p.x + hw, y1: p.y + 11 };
    }),
    ...others.map(([id]) => {
      const p = otherAt.get(id)!;
      const hw = otherChip.get(id)!.w / 2;
      return { x0: p.x - hw, y0: p.y - 13, x1: p.x + hw, y1: p.y + 13 };
    }),
  ];
  const PAD = 10;
  const minX = Math.min(...boxes.map((b) => b.x0)) - PAD;
  const maxX = Math.max(...boxes.map((b) => b.x1)) + PAD;
  const minY = Math.min(...boxes.map((b) => b.y0)) - PAD;
  const maxY = Math.max(...boxes.map((b) => b.y1)) + PAD;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  const viewCenter = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  // Frames and the centre stop growing once the zoom passes 1: past that point the reader's zoom widens the
  // gaps between nodes while the names keep the size they had, so names that overlapped at the first view
  // separate as the map is enlarged — and the centre circle no longer swells to fill the screen.
  const chipScale = 1 / Math.max(1, view.k);
  const labelsShown = labelBudget(view.k);
  const href = (path: string) => `${BASE_PATH}${path}`;

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    // A press that starts on a node link is not captured by the svg: capturing retargets the pointer events
    // (and with them the click) to the svg itself, which can swallow the link's navigation.
    if (!(e.target as Element).closest("a")) e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragMoved.current = 0;
    setDragging(true);
  };
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const prevPointers = new Map(pointers.current);
    const prev = prevPointers.get(e.pointerId);
    if (!prev) return;
    const now = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, now);
    dragMoved.current += Math.hypot(now.x - prev.x, now.y - prev.y);
    const svg = svgRef.current;
    if (!svg) return;
    const v = viewRef.current;
    if (pointers.current.size === 2) {
      // A pinch: zoom by the change in distance, around the midpoint of the two fingers.
      if (prevPointers.size !== 2) return;
      const [pa, pb] = [...prevPointers.values()];
      const [na, nb] = [...pointers.current.values()];
      const prevDist = Math.hypot(pa.x - pb.x, pa.y - pb.y);
      const nextDist = Math.hypot(na.x - nb.x, na.y - nb.y);
      const prevMid = svgPoint(svg, (pa.x + pb.x) / 2, (pa.y + pb.y) / 2);
      const nextMid = svgPoint(svg, (na.x + nb.x) / 2, (na.y + nb.y) / 2);
      if (!prevMid || !nextMid || prevDist === 0) return;
      const k = clampZoom(v.k * (nextDist / prevDist));
      const cx = (prevMid.x - v.tx) / v.k;
      const cy = (prevMid.y - v.ty) / v.k;
      applyView({ k, tx: nextMid.x - cx * k, ty: nextMid.y - cy * k });
    } else if (pointers.current.size === 1) {
      const from = svgPoint(svg, prev.x, prev.y);
      const to = svgPoint(svg, now.x, now.y);
      if (!from || !to) return;
      applyView({ k: v.k, tx: v.tx + (to.x - from.x), ty: v.ty + (to.y - from.y) });
    }
  };
  const endPointer = (e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      setDragging(false);
      // A drag that ends on a link must not follow it: the click that follows is swallowed once, below.
      if (dragMoved.current > 4) suppressClick.current = true;
    }
  };
  const onClickCapture = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const zoomButtonClass = "grid size-9 place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-sm hover:border-foreground";

  return (
    <figure className="m-0">
      <div className="relative overflow-hidden rounded-md border border-border bg-card">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          role="img"
          aria-label={`${name.get(industryId)}業界の企業${members.length}社と、取引でつながる${others.length}の業界の図`}
          className={`h-auto w-full touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onClickCapture={onClickCapture}
        >
          <g transform={`translate(${view.tx} ${view.ty}) scale(${view.k})`}>
            <g fill="none" strokeLinecap="round">
              {edges.map((edge, i) => {
                const a = memberAt.get(edge.from)!;
                const b = otherAt.get(edge.to)!;
                // Curved toward the centre, so lines bundle the way the reference's do instead of crossing straight.
                return (
                  <path
                    key={`e${i}`}
                    d={`M${a.x} ${a.y} Q${(a.x + b.x) / 2 + (CX - (a.x + b.x) / 2) * 0.35} ${(a.y + b.y) / 2 + (CY - (a.y + b.y) / 2) * 0.35} ${b.x} ${b.y}`}
                    stroke={tone.get(edge.to)}
                    strokeOpacity={0.75}
                    strokeWidth={1.75}
                  />
                );
              })}
              {inner.map((edge, i) => {
                const a = memberAt.get(edge.from)!;
                const b = memberAt.get(edge.to)!;
                return (
                  <path
                    key={`i${i}`}
                    d={`M${a.x} ${a.y} Q${CX} ${CY} ${b.x} ${b.y}`}
                    stroke="var(--ink)"
                    strokeOpacity={0.5}
                    strokeWidth={1.25}
                  />
                );
              })}
              <ellipse cx={CX} cy={CY} rx={185} ry={163} stroke="var(--border)" strokeWidth={1} />
            </g>

            <g transform={`translate(${CX} ${CY}) scale(${chipScale})`}>
              <circle r={centerR} fill="var(--foreground)" />
              <text textAnchor="middle" dominantBaseline="central" fontSize={17} fontWeight={700} fill="var(--background)">
                {name.get(industryId)}
              </text>
            </g>

            {ordered.map((m) => {
              const p = memberAt.get(m.id)!;
              const w = memberChipW.get(m.id)!;
              // Companies past the zoom's label budget are drawn as a dot on the ring: still a link to the
              // company page, with the name as its title, until zooming in releases its label.
              if ((labelRank.get(m.id) ?? 0) >= labelsShown) {
                return (
                  <a key={m.id} href={href(`/companies/${m.id}`)} aria-label={`${m.name}の企業ページ`}>
                    <title>{m.name}</title>
                    <circle cx={p.x} cy={p.y} r={6} fill="var(--card)" stroke="var(--border)" />
                    <circle cx={p.x} cy={p.y} r={2} fill="var(--foreground)" />
                  </a>
                );
              }
              return (
                <a key={m.id} href={href(`/companies/${m.id}`)} aria-label={`${m.name}の企業ページ`}>
                  <title>{m.name}</title>
                  <g transform={`translate(${p.x} ${p.y}) scale(${chipScale})`}>
                    <rect x={-w / 2} y={-11} width={w} height={22} rx={11} fill="var(--card)" stroke="var(--border)" />
                    <text fontSize={11.5} textAnchor="middle" dominantBaseline="central" fill="var(--foreground)">
                      {m.name}
                    </text>
                  </g>
                </a>
              );
            })}

            {others.map(([id, count]) => {
              const p = otherAt.get(id)!;
              const chip = otherChip.get(id)!;
              const x0 = -chip.w / 2;
              return (
                <a key={id} href={href(`/industries/${id}`)} aria-label={`${name.get(id)}業界のページ`}>
                  <title>{name.get(id)}</title>
                  <g transform={`translate(${p.x} ${p.y}) scale(${chipScale})`}>
                    <rect x={x0} y={-13} width={chip.w} height={26} rx={13} fill="var(--card)" stroke="var(--border)" />
                    <circle cx={x0 + 17} r={5} fill={tone.get(id)} />
                    <text x={x0 + 28} fontSize={12.5} fontWeight={700} dominantBaseline="central" fill="var(--foreground)">
                      {name.get(id)}
                    </text>
                    <text x={x0 + 28 + chip.nameW + 6} fontSize={11.5} dominantBaseline="central" fill="var(--muted-foreground)">
                      {count}
                    </text>
                  </g>
                </a>
              );
            })}
          </g>
        </svg>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <button type="button" aria-label="拡大" onClick={() => zoomAt(viewCenter, 1.3)} className={zoomButtonClass}>
            <Plus className="size-4" aria-hidden />
          </button>
          <button type="button" aria-label="縮小" onClick={() => zoomAt(viewCenter, 1 / 1.3)} className={zoomButtonClass}>
            <Minus className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="全体を表示（リセット）"
            onClick={() => applyView({ k: 1, tx: 0, ty: 0 })}
            className="inline-flex h-9 items-center rounded-full border border-border bg-card/90 px-3 text-xs text-foreground shadow-sm hover:border-foreground"
          >
            全体を表示
          </button>
        </div>
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
        <span data-l="ja">中心が{name.get(industryId)}業界、内側の枠がこの業界の企業（主な業界で数えて{members.length}社
        {(self?.companies.filter((c) => c.primary).length ?? 0) > members.length ? <T m={{ ja: "まで表示", en: "Showing up to" }} /> : ""}
        ）、外側の枠が取引でつながる業界です。線は有価証券報告書に「仕入先」「顧客」と書かれた関係で、枠の数字はその数です。ドラッグで移動、ホイールやピンチで拡大縮小できます。企業の枠や点はその企業のページへのリンクです。最初の表示では名前が重ならないよう、つながりの多い企業から表示し、拡大するにつれて残りの企業の名前も順に表示されます。
      </span><span data-l="en">The center is the {name.get(industryId)} industry, the inner frames are companies in this industry ({members.length} companies counted by main industry{(self?.companies.filter((c) => c.primary).length ?? 0) > members.length ? <T m={{ ja: "まで表示", en: "Showing up to" }} /> : ""}), and the outer frames are industries connected through trade. Lines are relationships described as &quot;suppliers&quot; or &quot;customers&quot; in annual securities reports, and the numbers in the frames are their counts. Drag to move the map, and zoom with the wheel or a pinch. Each company frame or dot links to that company&apos;s page. So names do not overlap, the first view labels the most-connected companies first, and zooming in reveals the remaining companies&apos; names in turn.</span></figcaption>
      {others.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2 text-xs">
          {others.map(([id, count]) => (
            <li key={id}>
              <a
                href={href(`/industries/${id}`)}
                className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border px-3 hover:border-foreground"
              >
                <span aria-hidden className="size-2.5 rounded-full" style={{ background: tone.get(id) }} />
                {name.get(id)}
                <span className="figures text-muted-foreground">{count}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
