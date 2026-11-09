import type { Business, Company } from "@/types/company";

/**
 * The company's value chain as nodes and links — procurement → the company's businesses → customers — built from
 * the entry's sourced data only (JCE-038): suppliers from `businessModel.suppliers`, businesses from the top-level
 * `businesses`, customers from each business's `customers` (or the business model's when no business names any).
 *
 * Only a business carries a size, and only when `segmentRevenue` prints its amount. Links carry none: a filing
 * prints neither what a company spends with each kind of supplier nor how a segment's revenue splits between its
 * customers, so a width on a link would be invented (invariant 1). Money runs the same links backwards; its labels
 * say what kind of money it is — which is what buying and selling are — not how much.
 */

export type ValueChainSupplier = { id: string; name: string; description: string; businessIds: string[] | null };
export type ValueChainSegment = {
  id: string;
  businessId: string;
  name: string;
  description: string;
  products: string[];
  customerIds: string[];
  /** Yen, as printed in the segment note; null when the entry has no segment revenue for this business. */
  amount: number | null;
  /** Percent of the segments' total, computed here from the printed amounts. */
  share: number | null;
  sourceIds: string[];
};
export type ValueChainCustomer = { id: string; name: string; segmentIds: string[] };
export type ValueChainLink = { source: string; target: string; flow: "goods" | "money"; label: string };

export type ValueChain = {
  suppliers: ValueChainSupplier[];
  segments: ValueChainSegment[];
  customers: ValueChainCustomer[];
  links: ValueChainLink[];
  /** Fiscal year and printed label of the amounts, when there are any. */
  revenue: { fiscalYear: string; label: string; sourceIds: string[] } | null;
};

/** The id a supplier with no named business points at: the company as a whole. */
export const COMPANY_NODE = "company";

function customersOf(business: Business): string[] {
  if (business.customers && business.customers.length > 0) return business.customers;
  return (business.children ?? []).flatMap((child) => child.customers ?? []);
}

const round1 = (value: number) => Math.round(value * 10) / 10;

export function buildValueChain(company: Company): ValueChain | null {
  if (company.businesses.length === 0) return null;
  const model = company.businessModel;

  const amounts = new Map((company.segmentRevenue?.items ?? []).map((i) => [i.businessId, i.amount]));
  const total = [...amounts.values()].reduce((sum, a) => sum + a, 0);

  const customerIds = new Map<string, string>();
  const customerId = (name: string) => {
    if (!customerIds.has(name)) customerIds.set(name, `customer-${customerIds.size + 1}`);
    return customerIds.get(name)!;
  };

  const anyBusinessCustomers = company.businesses.some((b) => customersOf(b).length > 0);
  const segments: ValueChainSegment[] = company.businesses.map((business) => {
    // A business with no customers of its own is tied to the company-wide customers only when no business names
    // any: otherwise the company-wide list would be drawn as this business's buyers, which the entry does not say.
    const names = anyBusinessCustomers ? customersOf(business) : (model?.customers ?? []);
    const amount = amounts.get(business.id) ?? null;
    return {
      id: `segment-${business.id}`,
      businessId: business.id,
      name: business.shortName ?? business.name,
      description: business.description,
      products: business.products ?? [],
      customerIds: names.map(customerId),
      amount,
      share: amount !== null && total > 0 ? round1((amount / total) * 100) : null,
      sourceIds: business.sourceIds,
    };
  });

  const customers: ValueChainCustomer[] = [...customerIds].map(([name, id]) => ({
    id,
    name,
    segmentIds: segments.filter((s) => s.customerIds.includes(id)).map((s) => s.id),
  }));

  const segmentIds = new Set(segments.map((s) => s.businessId));
  const suppliers: ValueChainSupplier[] = (model?.suppliers ?? []).map((s, i) => {
    const named = (s.businessIds ?? []).filter((id) => segmentIds.has(id));
    return { id: `supplier-${i + 1}`, name: s.name, description: s.description, businessIds: named.length > 0 ? named : null };
  });

  const links: ValueChainLink[] = [];
  for (const supplier of suppliers) {
    const targets = supplier.businessIds?.map((id) => `segment-${id}`) ?? [COMPANY_NODE];
    for (const target of targets) {
      links.push({ source: supplier.id, target, flow: "goods", label: "調達" });
      links.push({ source: target, target: supplier.id, flow: "money", label: "代金の支払い" });
    }
  }
  for (const segment of segments) {
    for (const id of segment.customerIds) {
      links.push({ source: segment.id, target: id, flow: "goods", label: "製品・サービス" });
      links.push({ source: id, target: segment.id, flow: "money", label: "代金（売上）" });
    }
  }

  const sr = company.segmentRevenue;
  return {
    suppliers,
    segments,
    customers,
    links,
    revenue: sr && segments.some((s) => s.amount !== null) ? { fiscalYear: sr.fiscalYear, label: sr.label, sourceIds: sr.sourceIds } : null,
  };
}
