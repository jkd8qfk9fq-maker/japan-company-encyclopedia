import type { ConnectionsData } from "@/lib/engagement-data";
import { GROUP_OF, INWARD_LABEL, OUTWARD_LABEL, type RelationGroup } from "@/lib/relationship-labels";
import type { RelationshipKind } from "@/types/company";

/**
 * The part of the connection graph drawn around one company (JCE-053): the company, everything one stated relation
 * away, and — while there is room — what lies one step further, so a reader sees where a path would lead. Only
 * relations an entry states with a source are in `ConnectionsData`; nothing is inferred here.
 */
export type NetNode = { id: string; name: string; industryName: string; description: string; depth: 0 | 1 | 2; x: number; y: number; z: number };
export type NetEdge = { a: number; b: number; group: RelationGroup; /** How b reads from a, and a from b. */ ab: string; ba: string };
export type Subgraph = { nodes: NetNode[]; edges: NetEdge[] };

/** More than this and labels on a phone turn to noise; the list below the map still names every relation. */
export const MAX_NODES = 56;

// Deterministic, so the same company always draws the same map (and tests can pin it).
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function subgraphAround(data: ConnectionsData, centerId: string, maxNodes = MAX_NODES): Subgraph | null {
  const byId = new Map(data.nodes.map((n) => [n.id, n]));
  if (!byId.has(centerId)) return null;
  const adjacency = new Map<string, Set<string>>();
  for (const [a, b] of data.edges) {
    if (!byId.has(a) || !byId.has(b)) continue;
    (adjacency.get(a) ?? adjacency.set(a, new Set()).get(a)!).add(b);
    (adjacency.get(b) ?? adjacency.set(b, new Set()).get(b)!).add(a);
  }
  const depth = new Map<string, 0 | 1 | 2>([[centerId, 0]]);
  const first = [...(adjacency.get(centerId) ?? [])].sort();
  for (const id of first.slice(0, maxNodes - 1)) depth.set(id, 1);
  // Second ring: the best-connected first, shared out so one busy neighbour cannot take every slot.
  const second = new Map<string, number>();
  for (const id of first) for (const next of adjacency.get(id) ?? []) if (!depth.has(next)) second.set(next, (second.get(next) ?? 0) + 1);
  const ranked = [...second.entries()].sort((x, y) => y[1] - x[1] || (adjacency.get(y[0])?.size ?? 0) - (adjacency.get(x[0])?.size ?? 0) || x[0].localeCompare(y[0]));
  for (const [id] of ranked) {
    if (depth.size >= maxNodes) break;
    depth.set(id, 2);
  }

  const ids = [...depth.keys()];
  const index = new Map(ids.map((id, i) => [id, i]));
  const random = seeded(centerId);
  const nodes: NetNode[] = ids.map((id) => {
    const n = byId.get(id)!;
    const d = depth.get(id)!;
    // Start on a shell by depth, at a random direction; the simulation below settles it.
    const u = random() * 2 - 1;
    const t = random() * Math.PI * 2;
    const r = d === 0 ? 0 : d === 1 ? 1 : 1.9;
    const s = Math.sqrt(1 - u * u);
    return { id, name: n.name, industryName: n.industryName ?? "", description: n.description ?? "", depth: d, x: r * s * Math.cos(t), y: r * s * Math.sin(t), z: r * u };
  });
  const seen = new Set<string>();
  const edges: NetEdge[] = [];
  for (const [a, b, kind] of data.edges) {
    const ia = index.get(a);
    const ib = index.get(b);
    if (ia === undefined || ib === undefined) continue;
    const k = kind as RelationshipKind;
    const key = `${Math.min(ia, ib)}-${Math.max(ia, ib)}-${GROUP_OF[k]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push({ a: ia, b: ib, group: GROUP_OF[k], ab: OUTWARD_LABEL[k], ba: INWARD_LABEL[k] });
  }
  settle(nodes, edges);
  return { nodes, edges };
}

/** A small force layout in three dimensions: linked companies pull together, all companies push apart. */
function settle(nodes: NetNode[], edges: NetEdge[], steps = 220) {
  const n = nodes.length;
  for (let step = 0; step < steps; step++) {
    const cool = 0.12 * (1 - step / steps) + 0.01;
    const fx = new Float64Array(n);
    const fy = new Float64Array(n);
    const fz = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const d2 = dx * dx + dy * dy + dz * dz + 0.01;
        const f = 2.4 / d2;
        const d = Math.sqrt(d2);
        fx[i] += (dx / d) * f; fy[i] += (dy / d) * f; fz[i] += (dz / d) * f;
        fx[j] -= (dx / d) * f; fy[j] -= (dy / d) * f; fz[j] -= (dz / d) * f;
      }
    }
    for (const e of edges) {
      const a = nodes[e.a];
      const b = nodes[e.b];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
      const f = (d - 1.6) * 0.35;
      fx[e.a] += (dx / d) * f; fy[e.a] += (dy / d) * f; fz[e.a] += (dz / d) * f;
      fx[e.b] -= (dx / d) * f; fy[e.b] -= (dy / d) * f; fz[e.b] -= (dz / d) * f;
    }
    for (let i = 0; i < n; i++) {
      if (nodes[i].depth === 0) continue; // the company asked about stays in the middle
      nodes[i].x += Math.max(-0.5, Math.min(0.5, fx[i] * cool));
      nodes[i].y += Math.max(-0.5, Math.min(0.5, fy[i] * cool));
      nodes[i].z += Math.max(-0.5, Math.min(0.5, fz[i] * cool));
    }
  }
  // Fit in a unit sphere so the view can frame every map the same way. Scaled by a typical far company rather than
  // the farthest, and stragglers pulled onto the surface: one loose end must not shrink everyone else into a knot.
  const radii = nodes.map((p) => Math.hypot(p.x, p.y, p.z)).sort((a, b) => a - b);
  const far = Math.max(1e-6, radii[Math.floor((radii.length - 1) * 0.85)]);
  for (const p of nodes) {
    const r = Math.hypot(p.x, p.y, p.z) / far;
    const k = r > 1 ? 1 / (r * far) : 1 / far;
    p.x *= k; p.y *= k; p.z *= k;
  }
}
