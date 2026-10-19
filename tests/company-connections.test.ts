import { describe, expect, it } from "vitest";
import { placeConnections } from "../src/components/company/connection-map";
import { companyRepository } from "../src/lib/repositories";
import { isReleased } from "../src/lib/release";
import type { Company, RelationshipKind } from "../src/types/company";

/**
 * The company page's connection map: which side of the company each tie is drawn on, and which other entries'
 * ties are shown on this page. A tie drawn on the wrong side states a relationship the filing does not.
 */

const company = (id: string): Company => ({ id, name: id }) as unknown as Company;
const tie = (id: string, kind: RelationshipKind) => ({ company: company(id), kind });

describe("placeConnections", () => {
  it("reads this company's own ties as 'it is this company's <kind>'", () => {
    const lanes = placeConnections(
      [tie("s", "supplier"), tie("c", "customer"), tie("p", "parent"), tie("sub", "subsidiary"), tie("t", "technology")],
      [],
    );
    expect(lanes.up.map((x) => x.company.id)).toEqual(["s"]);
    expect(lanes.down.map((x) => x.company.id)).toEqual(["c"]);
    expect(lanes.owners.map((x) => x.company.id)).toEqual(["p"]);
    expect(lanes.group.map((x) => x.company.id)).toEqual(["sub"]);
    expect(lanes.other.map((x) => x.company.id)).toEqual(["t"]);
  });

  it("turns another entry's tie around: being X's supplier makes X a customer", () => {
    const lanes = placeConnections(
      [],
      [tie("x", "supplier"), tie("y", "customer"), tie("parentOf", "subsidiary"), tie("childOf", "parent"), tie("holder", "affiliate"), tie("held", "other-affiliated-company")],
    );
    expect(lanes.down).toEqual([{ company: company("x"), label: "顧客", inbound: true }]);
    expect(lanes.up).toEqual([{ company: company("y"), label: "仕入先", inbound: true }]);
    expect(lanes.owners.map((x) => [x.company.id, x.label])).toEqual([["parentOf", "親会社"], ["holder", "出資元"]]);
    expect(lanes.group.map((x) => [x.company.id, x.label])).toEqual([["childOf", "子会社"], ["held", "出資先"]]);
  });

  it("keeps a directionless tie directionless both ways", () => {
    const lanes = placeConnections([], [tie("b", "business-partner"), tie("q", "same-industry")]);
    expect(lanes.other.map((x) => x.label)).toEqual(["取引関係", "同じ業界"]);
  });

  it("shows a company once per side, in this company's own wording first", () => {
    const lanes = placeConnections([tie("x", "customer")], [tie("x", "supplier")]);
    expect(lanes.down).toEqual([{ company: company("x"), label: "顧客", inbound: false }]);
  });
});

describe("companyRepository.listRelatingTo", () => {
  it("returns exactly the released entries that name the company, with the tie as written", async () => {
    const released = await companyRepository.list();
    const target = released.find((c) => released.some((o) => o.relatedCompanies.some((r) => r.companyId === c.id)));
    expect(target).toBeDefined();

    const expected = released.flatMap((o) =>
      o.relatedCompanies.filter((r) => r.companyId === target!.id).map((r) => `${o.id}:${r.relationship}`),
    );
    const actual = (await companyRepository.listRelatingTo(target!.id)).map((x) => `${x.company.id}:${x.relation.relationship}`);
    expect(actual.sort()).toEqual(expected.sort());
  });

  it("never returns an unreleased entry", async () => {
    const all = await companyRepository.listAll();
    const unreleasedNamers = all.filter((c) => !isReleased(c) && c.relatedCompanies.length > 0);
    for (const namer of unreleasedNamers.slice(0, 50)) {
      for (const relation of namer.relatedCompanies) {
        const found = await companyRepository.listRelatingTo(relation.companyId);
        expect(found.some((x) => x.company.id === namer.id)).toBe(false);
      }
    }
  });
});
