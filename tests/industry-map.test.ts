import { describe, expect, it } from "vitest";
import { buildIndustryMap } from "../src/lib/industry-map";
import type { Company, IndustryId, RelationshipKind } from "../src/types/company";

/**
 * The industry map draws a line only where a filing says who sells to whom, and every company on it has a page.
 */

const company = (id: string, industry: IndustryId, ties: [string, RelationshipKind][] = []): Company =>
  ({
    id,
    name: id,
    industries: [{ industryId: industry, primary: true }],
    relatedCompanies: ties.map(([companyId, relationship]) => ({ companyId, relationship, description: "", sourceIds: ["s"] })),
  }) as unknown as Company;

describe("buildIndustryMap", () => {
  it("draws seller → buyer from either entry, once per pair", () => {
    const map = buildIndustryMap([
      company("steel", "chemicals", [["car", "customer"]]),
      company("car", "automotive", [["steel", "supplier"]]),
    ]);
    expect(map.flows).toEqual([
      { from: "chemicals", to: "automotive", pairs: [{ sellerId: "steel", sellerName: "steel", buyerId: "car", buyerName: "car" }] },
    ]);
    const car = map.industries.find((i) => i.id === "automotive")!.companies[0];
    expect(car.ties).toEqual([{ companyId: "steel", companyName: "steel", role: "仕入先" }]);
  });

  it("draws no line for a tie without a direction, or to a company not passed in", () => {
    const map = buildIndustryMap([
      company("a", "it", [["b", "business-partner"], ["c", "same-industry"], ["unreleased", "customer"]]),
      company("b", "retail"),
      company("c", "it"),
    ]);
    expect(map.flows).toEqual([]);
    expect(map.industries.flatMap((i) => i.companies.flatMap((c) => c.ties))).toEqual([]);
  });
});
