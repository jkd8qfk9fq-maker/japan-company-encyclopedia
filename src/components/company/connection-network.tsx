import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";
import type { Connection, Lane } from "./connection-map";

/**
 * Where each kind of tie sits around the company, in degrees (0 = right, 90 = down): owners above, suppliers to the
 * left and customers to the right — the direction goods flow, as in the business model above — the group below,
 * and ties without a direction in the lower left. Lanes are placed in this order, each taking the free places
 * nearest its own direction, so a crowded lane spreads around the circle instead of stacking.
 */
const ORDER: Lane[] = ["up", "down", "owners", "group", "other"];
const CENTER: Record<Lane, number> = { up: 180, down: 0, owners: 270, group: 90, other: 135 };
const MAX_NODES = 8;
const W = 640;
const H = 440;

const LINE: Record<Lane, { stroke: string; width: number; dash?: string }> = {
  owners: { stroke: "var(--foreground)", width: 1.5 },
  group: { stroke: "var(--foreground)", width: 1.5 },
  up: { stroke: "var(--ink)", width: 2.5 },
  down: { stroke: "var(--ink)", width: 2.5 },
  other: { stroke: "var(--muted-foreground)", width: 1.5, dash: "6 5" },
};

/**
 * The connection map as a network, after the approved mockup: the company in the middle, every company it is tied
 * to around it, the kind of tie told by the line (solid = capital, blue = trade, dashed = no direction in the
 * filing) and by the label under the name. Placement is by kind, not by importance — nothing on this diagram ranks.
 *
 * The lines and the boxes share one fixed-aspect coordinate space, so they stay joined at any width. Wide screens
 * only: on a phone eight boxes around a circle would overlap, and the lane layout (ConnectionMap) is used instead.
 * Past eight companies the last place links to the full list, which always has every tie.
 */
export function ConnectionNetwork({ company, lanes }: { company: Company; lanes: Record<Lane, Connection[]> }) {
  const all = ORDER.flatMap((lane) => lanes[lane].map((connection) => ({ lane, connection })));
  if (all.length === 0) return null;
  const shown = all.length > MAX_NODES ? all.slice(0, MAX_NODES - 1) : all;
  const rest = all.length - shown.length;
  const slots = Math.max(MAX_NODES, shown.length + (rest > 0 ? 1 : 0));
  const slotAngle = (k: number) => (k * 360) / slots;
  const distance = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
  const taken = new Set<number>();
  const take = (center: number) => {
    let best = -1;
    for (let k = 0; k < slots; k++) {
      if (taken.has(k)) continue;
      if (best < 0 || distance(slotAngle(k), center) < distance(slotAngle(best), center)) best = k;
    }
    taken.add(best);
    return best;
  };
  const placed = shown.map((node) => ({ ...node, slot: take(CENTER[node.lane]) }));
  const restSlot = rest > 0 ? take(45) : -1;

  const at = (slot: number) => {
    const angle = (slotAngle(slot) * Math.PI) / 180;
    return { x: W / 2 + W * 0.36 * Math.cos(angle), y: H / 2 + H * 0.37 * Math.sin(angle) };
  };
  const pct = (p: { x: number; y: number }) => ({ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` });

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="absolute inset-0 h-full w-full">
        {placed.map(({ lane, connection, slot }) => {
          const p = at(slot);
          const line = LINE[lane];
          return (
            <line
              key={`${lane}-${connection.company.id}`}
              x1={W / 2}
              y1={H / 2}
              x2={p.x}
              y2={p.y}
              stroke={line.stroke}
              strokeWidth={line.width}
              strokeDasharray={line.dash}
            />
          );
        })}
        {rest > 0 && (
          <line x1={W / 2} y1={H / 2} x2={at(restSlot).x} y2={at(restSlot).y} stroke="var(--border)" strokeWidth={1.5} />
        )}
      </svg>

      <div className="absolute top-1/2 left-1/2 flex min-h-20 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md bg-foreground px-3 py-3 text-center text-background">
        {company.shortNameEn && (
          <span aria-hidden className="wordmark text-lg leading-tight">
            {company.shortNameEn}
          </span>
        )}
        <span className={cn("text-xs", company.shortNameEn && "mt-1 opacity-80")}>{company.name}</span>
      </div>

      <ul>
        {placed.map(({ lane, connection, slot }) => (
          <li
            key={`${lane}-${connection.company.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={pct(at(slot))}
          >
            <Link
              href={`/companies/${connection.company.id}`}
              className={cn(
                "flex min-h-12 w-36 flex-col items-center justify-center rounded-md border bg-card px-2 py-1.5 text-center leading-tight transition-colors hover:bg-paper",
                lane === "up" || lane === "down" ? "border-ink" : lane === "other" ? "border-dashed border-muted-foreground" : "border-foreground",
              )}
            >
              <span className="font-serif text-sm font-semibold">{connection.company.name}</span>
              <span className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                {connection.label}
                {connection.inbound && <span className="sr-only">（{connection.company.name}の項目に記載）</span>}
              </span>
            </Link>
          </li>
        ))}
        {rest > 0 && (
          <li className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(at(restSlot))}>
            <a
              href="#related-companies-list"
              className="flex min-h-12 w-28 items-center justify-center rounded-md border border-border bg-card text-sm hover:border-foreground"
            >
              ほか{rest}社
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
