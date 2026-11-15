import { beforeAll, describe, expect, it } from "vitest";
import { buildConnections } from "@/lib/engagement-data";
import { MAX_NODES, subgraphAround } from "@/lib/network-layout";
import { companyRepository } from "@/lib/repositories";

describe("3D company network (JCE-053)", () => {
  let data: ReturnType<typeof buildConnections>;
  beforeAll(async () => {
    data = buildConnections(await companyRepository.list());
  });

  it("draws only relations the entries state, around the company asked for", () => {
    const stated = new Set(data.edges.flatMap(([a, b]) => [`${a}|${b}`, `${b}|${a}`]));
    for (const id of ["toyota", data.nodes[0].id, data.nodes.at(-1)!.id]) {
      const graph = subgraphAround(data, id);
      if (!graph) continue;
      expect(graph.nodes[0].id).toBe(id);
      expect(graph.nodes[0].depth).toBe(0);
      expect(graph.nodes.length).toBeLessThanOrEqual(MAX_NODES);
      for (const e of graph.edges) expect(stated.has(`${graph.nodes[e.a].id}|${graph.nodes[e.b].id}`)).toBe(true);
      // Every company drawn is reachable: nothing floats in without a stated relation.
      for (const [i, n] of graph.nodes.entries()) if (i > 0) expect(graph.edges.some((e) => e.a === i || e.b === i), n.id).toBe(true);
    }
  });

  it("is the same map every time, inside the unit sphere", () => {
    const a = subgraphAround(data, "toyota")!;
    const b = subgraphAround(data, "toyota")!;
    expect(a.nodes.map((n) => [n.id, n.x, n.y, n.z])).toEqual(b.nodes.map((n) => [n.id, n.x, n.y, n.z]));
    for (const n of a.nodes) {
      expect(Number.isFinite(n.x + n.y + n.z)).toBe(true);
      expect(Math.hypot(n.x, n.y, n.z)).toBeLessThanOrEqual(1.0001);
    }
    expect(Math.hypot(a.nodes[0].x, a.nodes[0].y, a.nodes[0].z)).toBeLessThan(1e-9);
  });

  it("answers null for a company with no entry in the graph", () => {
    expect(subgraphAround(data, "no-such-company")).toBeNull();
  });
});
