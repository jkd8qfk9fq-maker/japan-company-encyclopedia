"use client";

import { Minus, Pause, Play, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FavoriteButton } from "@/components/company/favorite-button";
import { loadConnections } from "@/components/engagement/load";
import type { ConnectionsData } from "@/lib/engagement-data";
import { subgraphAround, type Subgraph } from "@/lib/network-layout";
import { GROUP_LABEL, type RelationGroup } from "@/lib/relationship-labels";
import { recordDiscovered, recordExploreStep } from "@/lib/storage/stores";

/** Read ?from= without useSearchParams, so the static page needs no Suspense boundary. */
const fromQuery = () => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("from"));

// The stage is drawn on a canvas, which cannot read CSS variables per stroke cheaply; these are the site's ivory,
// charcoal and vermilion (globals.css --paper, --rule, --seal) as plain colours.
const IVORY = "#f6f4ef";
const CHARCOAL = "#161616";
const VERMILION = "#d2452d";
const EDGE: Record<RelationGroup, { color: string; dash: number[] }> = {
  trade: { color: VERMILION, dash: [] },
  capital: { color: IVORY, dash: [] },
  peers: { color: "#8d8a83", dash: [3, 5] },
};
const SHORT: Record<RelationGroup, string> = { trade: "取引", capital: "資本", peers: "競合・同業" };

const subscribeNothing = () => () => {};

type View = { yaw: number; pitch: number; zoom: number };
type Projected = { x: number; y: number; scale: number; depth: number };

function project(p: { x: number; y: number; z: number }, v: View, w: number, h: number): Projected {
  const cy = Math.cos(v.yaw), sy = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const y2 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp;
  // A camera 3.2 radii away: enough perspective to read depth, not so much that the far side shrinks to nothing.
  const scale = 3.2 / (3.2 - z2);
  const r = Math.min(w, h) * 0.44 * v.zoom;
  return { x: w / 2 + x1 * r * scale, y: h / 2 + y2 * r * scale, scale, depth: z2 };
}

/**
 * The 3D company network (JCE-053): one company in the middle, the companies its entries tie it to around it, turned
 * by dragging, zoomed by pinching or the wheel, and entered by tapping. Drawn with the canvas the browser has — no 3D
 * library — because the map is at most a few dozen points. Every line is a relation an entry states with a source;
 * the list under the stage says the same thing in words, for readers who cannot use the canvas.
 */
export function NetworkStage() {
  const [data, setData] = useState<ConnectionsData | null>(null);
  const [failed, setFailed] = useState(false);
  const [centerId, setCenterId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number>(0);
  // Motion is decoration here; a reader who asked for less gets a still map they can turn themselves, until they
  // press play. null = the reader has not chosen.
  const reducedMotion = useSyncExternalStore(subscribeNothing, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const [spinChoice, setSpinChoice] = useState<boolean | null>(null);
  const spinning = spinChoice ?? !reducedMotion;
  const [query, setQuery] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const view = useRef<View>({ yaw: 0.6, pitch: -0.25, zoom: 1 });
  const projected = useRef<Projected[]>([]);
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    loadConnections().then((d) => {
      setData(d);
      const start = fromQuery();
      if (start && d.nodes.some((n) => n.id === start)) setCenterId(start);
    }, () => setFailed(true));
  }, []);

  const graph: Subgraph | null = useMemo(() => (data && centerId ? subgraphAround(data, centerId) : null), [data, centerId]);

  const recenter = useCallback((id: string, record = true) => {
    setCenterId(id);
    setSelected(0);
    view.current.zoom = 1;
    if (record) {
      recordExploreStep();
      recordDiscovered(id);
    }
    window.history.replaceState(null, "", `?from=${encodeURIComponent(id)}`);
  }, []);

  // Drawing and input. Kept in one effect: they share the canvas, the view and the frame loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graph) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let dragging = false;
    let moved = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const pts = graph.nodes.map((n) => project(n, view.current, w, h));
      projected.current = pts;

      for (const e of graph.edges) {
        const a = pts[e.a], b = pts[e.b];
        const touches = e.a === selected || e.b === selected;
        const near = (a.depth + b.depth) / 2;
        ctx.globalAlpha = touches ? 0.95 : 0.16 + 0.3 * ((near + 1) / 2);
        ctx.strokeStyle = EDGE[e.group].color;
        ctx.lineWidth = touches ? 1.8 : 1;
        ctx.setLineDash(EDGE[e.group].dash);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      const order = graph.nodes.map((_, i) => i).sort((i, j) => pts[i].depth - pts[j].depth);
      const linked = new Set<number>([selected]);
      for (const e of graph.edges) {
        if (e.a === selected) linked.add(e.b);
        if (e.b === selected) linked.add(e.a);
      }
      // Dots first, far to near.
      const radiusOf = (i: number) => (graph.nodes[i].depth === 0 ? 9 : graph.nodes[i].depth === 1 ? 5.5 : 3.5) * pts[i].scale * Math.sqrt(view.current.zoom);
      for (const i of order) {
        const n = graph.nodes[i], p = pts[i];
        const front = (p.depth + 1) / 2;
        ctx.globalAlpha = 0.4 + 0.6 * front;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radiusOf(i), 0, Math.PI * 2);
        ctx.fillStyle = n.depth === 0 ? VERMILION : IVORY;
        ctx.fill();
        if (i === selected) {
          ctx.globalAlpha = 1;
          ctx.strokeStyle = n.depth === 0 ? IVORY : VERMILION;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radiusOf(i) + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      // Then names, most important first — the middle, the selection, what it touches, then whatever is nearest —
      // each only where it does not sit on a name already drawn. An unnamed dot is one tap from its name.
      const rank = (i: number) => (i === selected ? 0 : graph.nodes[i].depth === 0 ? 1 : linked.has(i) ? 2 : 3 + graph.nodes[i].depth) - pts[i].depth * 0.5;
      const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (const i of [...order].sort((a, b) => rank(a) - rank(b))) {
        const n = graph.nodes[i], p = pts[i];
        const strong = i === selected || n.depth === 0;
        if (!strong && !linked.has(i) && n.depth === 2 && view.current.zoom < 1.4) continue;
        ctx.font = `${strong ? "600 14px" : "12px"} "Noto Sans JP", "Hiragino Sans", system-ui, sans-serif`;
        const label = n.name.length > 12 ? `${n.name.slice(0, 11)}…` : n.name;
        const half = ctx.measureText(label).width / 2 + 4;
        const top = p.y + radiusOf(i) + 5;
        const box = { x0: p.x - half, x1: p.x + half, y0: top - 2, y1: top + (strong ? 18 : 16) };
        // Keep clear of the edges and of the legend along the bottom.
        if (box.x0 < 0 || box.x1 > w || box.y1 > h - 64) continue;
        if (!strong && placed.some((q) => box.x0 < q.x1 && box.x1 > q.x0 && box.y0 < q.y1 && box.y1 > q.y0)) continue;
        placed.push(box);
        ctx.globalAlpha = strong ? 1 : 0.55 + 0.45 * ((p.depth + 1) / 2);
        // A charcoal halo keeps a name legible where it crosses a line.
        ctx.lineWidth = 4;
        ctx.strokeStyle = CHARCOAL;
        ctx.strokeText(label, p.x, top);
        ctx.fillStyle = IVORY;
        ctx.fillText(label, p.x, top);
      }
      ctx.globalAlpha = 1;
    };
    redraw.current = draw;

    const tick = () => {
      if (spinning && !dragging && pointers.size === 0 && !document.hidden) {
        view.current.yaw += 0.0022;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    draw();
    frame = requestAnimationFrame(tick);

    const at = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, at(e));
      dragging = true;
      moved = 0;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const move = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const now = at(e);
      pointers.set(e.pointerId, now);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch > 0) view.current.zoom = Math.max(0.6, Math.min(3.2, view.current.zoom * (d / pinch)));
        pinch = d;
        moved += 10;
      } else {
        view.current.yaw += (now.x - prev.x) * 0.008;
        view.current.pitch = Math.max(-1.3, Math.min(1.3, view.current.pitch + (now.y - prev.y) * 0.008));
        moved += Math.abs(now.x - prev.x) + Math.abs(now.y - prev.y);
      }
      draw();
    };
    const up = (e: PointerEvent) => {
      const p = pointers.get(e.pointerId);
      pointers.delete(e.pointerId);
      if (pointers.size === 0) dragging = false;
      pinch = 0;
      // A tap, not a drag: choose the nearest company within a finger's reach.
      if (p && moved < 8) {
        let best = -1, bestD = 30;
        projected.current.forEach((q, i) => {
          const d = Math.hypot(q.x - p.x, q.y - p.y) - (q.depth > 0 ? 4 : 0);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        if (best >= 0) setSelected(best);
      }
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      view.current.zoom = Math.max(0.6, Math.min(3.2, view.current.zoom * Math.exp(-e.deltaY * 0.0015)));
      draw();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    // Not passive: the wheel zooms the map instead of scrolling the page while the pointer is over it.
    canvas.addEventListener("wheel", wheel, { passive: false });
    const resize = new ResizeObserver(draw);
    resize.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel);
    };
  }, [graph, selected, spinning]);

  if (failed) return <p className="text-sm text-muted-foreground">つながりを読み込めませんでした。通信状態を確かめて、もう一度開いてください。</p>;
  if (!data) return <p className="text-sm text-muted-foreground">つながりを集めています…</p>;

  if (!graph) {
    const degree = new Map<string, number>();
    for (const [a, b] of data.edges) {
      degree.set(a, (degree.get(a) ?? 0) + 1);
      degree.set(b, (degree.get(b) ?? 0) + 1);
    }
    const hubs = [...degree.entries()].sort((a, b) => b[1] - a[1]).slice(0, 9).map(([id, n]) => ({ node: data.nodes.find((x) => x.id === id)!, n })).filter((h) => h.node);
    const matches = query.trim() ? data.nodes.filter((n) => n.name.includes(query.trim())).slice(0, 12) : [];
    return (
      <div className="grid gap-8">
        <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <span className="sr-only">会社名で探す</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="会社名で探す（例：トヨタ）" className="min-h-11 w-full bg-transparent text-sm outline-none" />
        </label>
        {matches.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {matches.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => recenter(n.id)} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground">{n.name}</button>
              </li>
            ))}
          </ul>
        )}
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">つながりの多い会社から始める</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {hubs.map(({ node, n }) => (
              <li key={node.id}>
                <button type="button" onClick={() => recenter(node.id)} className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-left hover:border-foreground">
                  <span className="block truncate text-sm font-medium">{node.name}</span>
                  <span className="block text-xs text-muted-foreground">{node.industryName} ・ {n}のつながり</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const center = graph.nodes[0];
  const current = graph.nodes[selected] ?? center;
  const relations = graph.edges
    .filter((e) => e.a === selected || e.b === selected)
    .map((e) => ({ other: e.a === selected ? e.b : e.a, label: e.a === selected ? e.ab : e.ba, group: e.group }));
  const toCenter = selected === 0 ? [] : graph.edges.filter((e) => (e.a === 0 && e.b === selected) || (e.b === 0 && e.a === selected)).map((e) => (e.a === 0 ? e.ab : e.ba));
  const zoomBy = (factor: number) => {
    view.current.zoom = Math.max(0.6, Math.min(3.2, view.current.zoom * factor));
    redraw.current();
  };
  const groups: RelationGroup[] = ["trade", "capital", "peers"];

  return (
    <div className="grid gap-6">
      <div className="relative overflow-hidden rounded-xl bg-[#161616] text-[#f6f4ef]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${center.name}を中心にした企業ネットワーク。${graph.nodes.length}社、${graph.edges.length}本のつながり。内容は下の一覧と同じです。`}
          className="block h-[62svh] max-h-[640px] min-h-[380px] w-full cursor-grab touch-none active:cursor-grabbing"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <div>
            <p className="font-display text-[0.6875rem] tracking-[0.28em] text-[#d2452d]">NETWORK</p>
            <p className="mt-1 font-serif text-lg leading-tight font-semibold">{center.name}</p>
            <p className="figures mt-0.5 text-xs text-white/55">{graph.nodes.length}社 ・ {graph.edges.length}本のつながり</p>
          </div>
          <div className="pointer-events-auto flex flex-col gap-1.5">
            <button type="button" onClick={() => zoomBy(1.3)} aria-label="拡大" className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/40 hover:bg-white/10"><Plus className="size-4" aria-hidden /></button>
            <button type="button" onClick={() => zoomBy(1 / 1.3)} aria-label="縮小" className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/40 hover:bg-white/10"><Minus className="size-4" aria-hidden /></button>
            <button type="button" onClick={() => setSpinChoice(!spinning)} aria-label={spinning ? "回転を止める" : "回転させる"} className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/40 hover:bg-white/10">
              {spinning ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
          </div>
        </div>
        <ul className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-x-4 gap-y-1 p-4 text-[0.6875rem] text-white/70">
          {groups.map((g) => (
            <li key={g} className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block w-5 border-t-2" style={{ borderColor: EDGE[g].color, borderTopStyle: g === "peers" ? "dashed" : "solid" }} />
              {SHORT[g]}
            </li>
          ))}
          <li className="ml-auto text-white/45">ドラッグで回転・ピンチで拡大・タップで選ぶ</li>
        </ul>
      </div>

      <section aria-live="polite" className="rounded-md border border-foreground/20 bg-card p-5">
        <p className="text-xs font-semibold text-seal">
          {current.industryName}
          {selected !== 0 && <span className="ml-2 font-normal text-muted-foreground">{toCenter.length > 0 ? `${center.name}の${[...new Set(toCenter)].join("・")}` : `${center.name}から2歩先`}</span>}
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold">{current.name}</h2>
        {current.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{current.description}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {selected !== 0 && (
            <button type="button" onClick={() => recenter(current.id)} className="inline-flex min-h-11 items-center rounded-full bg-seal px-4 text-sm font-medium text-white">
              この会社を中心にする
            </button>
          )}
          <Link href={`/companies/${current.id}`} className="inline-flex min-h-11 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background">企業ページ</Link>
          <FavoriteButton companyId={current.id} companyName={current.name} />
          <Link href={`/discover/#companies=${current.id}`} className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm hover:border-foreground">発見で読む</Link>
        </div>

        {groups.map((g) => {
          const items = relations.filter((r) => r.group === g);
          if (items.length === 0) return null;
          return (
            <div key={g} className="mt-6">
              <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">{GROUP_LABEL[g]}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {items.map((r) => (
                  <li key={`${r.other}-${r.label}`}>
                    <button type="button" onClick={() => setSelected(r.other)} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground">
                      <span className="mr-1.5 text-[0.6875rem] font-semibold text-seal">{r.label}</span>
                      {graph.nodes[r.other].name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {relations.length === 0 && <p className="mt-4 text-sm text-muted-foreground">この会社について、百科事典に記載されたつながりはまだありません。</p>}
      </section>

      <p className="text-xs leading-5 text-muted-foreground">
        線はどれも、各社の有価証券報告書などの出典にもとづく記載です。文と出典は各社のページの「つながり」にあります。図に出すのは中心の会社から2歩先まで、最大{graph.nodes.length >= 56 ? "56" : graph.nodes.length}社です。
        <button type="button" onClick={() => { setCenterId(null); window.history.replaceState(null, "", window.location.pathname); }} className="ml-2 underline underline-offset-2 hover:text-foreground">別の会社から始める</button>
      </p>
    </div>
  );
}
