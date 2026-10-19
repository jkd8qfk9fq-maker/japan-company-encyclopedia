import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company, IndustryId } from "@/types/company";

export type TradeTie = { companyId: string; companyName: string; role: "仕入先" | "顧客" };

export type MapCompany = { id: string; name: string; primary: boolean; ties: TradeTie[] };

export type MapIndustry = { id: IndustryId; name: string; companies: MapCompany[] };

export type MapFlow = {
  from: IndustryId;
  to: IndustryId;
  /** Each seller → buyer pair behind the line, once, whichever entry (or both) states it. */
  pairs: { sellerId: string; sellerName: string; buyerId: string; buyerName: string }[];
};

export type IndustryMapData = { industries: MapIndustry[]; flows: MapFlow[] };

function primaryIndustry(company: Company): IndustryId | null {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

/**
 * The industry map, aggregated from the companies' own `relatedCompanies` — nothing else. Only `supplier` and
 * `customer` say who sells to whom, so only they make a line; a tie with no direction in the filing draws none. A
 * company counts in its primary industry for the lines, and in every industry it belongs to for the lists. Both
 * ends must be in `companies` (the caller passes released companies), so every name on the map has a page.
 */
export function buildIndustryMap(companies: Company[]): IndustryMapData {
  const byId = new Map(companies.map((c) => [c.id, c]));

  // seller → buyer, from either side's entry.
  const pairs = new Map<string, { seller: Company; buyer: Company }>();
  const ties = new Map<string, Map<string, TradeTie>>();
  const addTie = (owner: string, other: Company, role: TradeTie["role"]) => {
    const list = ties.get(owner) ?? new Map<string, TradeTie>();
    list.set(`${role}:${other.id}`, { companyId: other.id, companyName: other.name, role });
    ties.set(owner, list);
  };
  for (const company of companies) {
    for (const relation of company.relatedCompanies) {
      const other = byId.get(relation.companyId);
      if (!other || other.id === company.id) continue;
      if (relation.relationship !== "supplier" && relation.relationship !== "customer") continue;
      const [seller, buyer] = relation.relationship === "supplier" ? [other, company] : [company, other];
      pairs.set(`${seller.id}>${buyer.id}`, { seller, buyer });
      addTie(seller.id, buyer, "顧客");
      addTie(buyer.id, seller, "仕入先");
    }
  }

  const flows = new Map<string, MapFlow>();
  for (const { seller, buyer } of pairs.values()) {
    const from = primaryIndustry(seller);
    const to = primaryIndustry(buyer);
    if (!from || !to) continue;
    const flow = flows.get(`${from}>${to}`) ?? { from, to, pairs: [] };
    flow.pairs.push({ sellerId: seller.id, sellerName: seller.name, buyerId: buyer.id, buyerName: buyer.name });
    flows.set(`${from}>${to}`, flow);
  }

  const industries = new Map<IndustryId, MapIndustry>();
  for (const company of companies) {
    for (const ref of company.industries) {
      const industry = industries.get(ref.industryId) ?? {
        id: ref.industryId,
        name: INDUSTRY_LABELS[ref.industryId].name,
        companies: [],
      };
      industry.companies.push({
        id: company.id,
        name: company.name,
        primary: primaryIndustry(company) === ref.industryId,
        ties: [...(ties.get(company.id)?.values() ?? [])],
      });
      industries.set(ref.industryId, industry);
    }
  }

  return {
    // Taxonomy order (types/company.ts), so the list reads the same on every visit.
    industries: Object.keys(INDUSTRY_LABELS)
      .map((id) => industries.get(id as IndustryId))
      .filter((i): i is MapIndustry => i !== undefined),
    flows: [...flows.values()].sort((a, b) => b.pairs.length - a.pairs.length),
  };
}
