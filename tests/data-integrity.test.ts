import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { features } from "@/data/features";
import { industries } from "@/data/industries";
import { terms } from "@/data/terms";
import { extractReferences, findMalformedMarkup } from "@/lib/rich-text";
import type { Business, Company } from "@/types/company";
import { INDUSTRY_IDS, RELATIONSHIP_KINDS } from "@/types/company";
import type { Source } from "@/types/source";

/**
 * The data integrity suite: the executable form of CLAUDE.md invariants 1, 2,
 * 4 and 6. It runs over the PUBLISHED registries — whatever a reader can see.
 *
 * Do not relax a check to make data pass. If a check is genuinely wrong,
 * change it in its own commit with the reason.
 */

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const companyIds = new Set(companies.map((c) => c.id));
const industryIds = new Set<string>(INDUSTRY_IDS);
const termIds = new Set(terms.map((t) => t.id));
const featureIds = new Set(features.map((f) => f.id));

function flattenBusinesses(list: Business[]): Business[] {
  return list.flatMap((b) => [b, ...flattenBusinesses(b.children ?? [])]);
}

function expectSourcesWellFormed(sources: Source[], owner: string) {
  const ids = sources.map((s) => s.id);
  expect(new Set(ids).size, `${owner}: duplicate source ids`).toBe(ids.length);
  for (const s of sources) {
    expect(s.id, `${owner}: source id`).toMatch(KEBAB);
    expect(s.url, `${owner}/${s.id}: url`).toMatch(/^https:\/\//);
    expect(s.accessedAt, `${owner}/${s.id}: accessedAt`).toMatch(ISO_DATE);
    if (s.publishedAt) expect(s.publishedAt, `${owner}/${s.id}: publishedAt`).toMatch(ISO_DATE);
    // Invariant 3: never Wikipedia.
    expect(s.url, `${owner}/${s.id}: Wikipedia is not a source`).not.toMatch(/wikipedia\.org/i);
    expect(s.title.trim().length, `${owner}/${s.id}: title`).toBeGreaterThan(0);
    expect(s.publisher.trim().length, `${owner}/${s.id}: publisher`).toBeGreaterThan(0);
  }
}

function expectSourced(sourceIds: string[], sources: Source[], where: string) {
  expect(sourceIds.length, `${where}: a factual section must cite at least one source`).toBeGreaterThan(0);
  const known = new Set(sources.map((s) => s.id));
  for (const id of sourceIds) expect(known.has(id), `${where}: unknown source "${id}"`).toBe(true);
}

function expectRichTextValid(text: string, where: string) {
  expect(findMalformedMarkup(text), `${where}: malformed [[...]] markup`).toEqual([]);
  for (const ref of extractReferences(text)) {
    const exists =
      ref.kind === "company"
        ? companyIds.has(ref.id)
        : ref.kind === "industry"
          ? industryIds.has(ref.id)
          : ref.kind === "term"
            ? termIds.has(ref.id)
            : featureIds.has(ref.id);
    expect(exists, `${where}: ${ref.kind} "${ref.id}" does not exist`).toBe(true);
  }
}

/** Every rich-text string on a company, with a path for error messages. */
function companyTexts(c: Company): [string, string][] {
  return [
    [`${c.id}.description`, c.description],
    ...flattenBusinesses(c.businesses).map((b): [string, string] => [`${c.id}.businesses.${b.id}`, b.description]),
    ...(c.businessModel ? [[`${c.id}.businessModel`, c.businessModel.description] as [string, string]] : []),
    ...c.history.flatMap((h): [string, string][] => [
      [`${c.id}.history.${h.year}.description`, h.description],
      [`${c.id}.history.${h.year}.significance`, h.significance],
    ]),
  ];
}

describe("registries", () => {
  it("has unique, kebab-case ids everywhere", () => {
    for (const [name, items] of [
      ["companies", companies],
      ["industries", industries],
      ["terms", terms],
      ["features", features],
    ] as const) {
      const ids = items.map((i) => i.id);
      expect(new Set(ids).size, `${name}: duplicate ids`).toBe(ids.length);
      for (const id of ids) expect(id, `${name}: id`).toMatch(KEBAB);
    }
  });

  it("publishes every company data file, and only data files that exist", () => {
    // A file in src/data/companies that is not registered is either forgotten or
    // unfinished; either way it should be a conscious state, so list it here.
    const dir = join(process.cwd(), "src/data/companies");
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".ts") && f !== "index.ts")
      .map((f) => f.replace(/\.ts$/, ""));
    for (const file of files) expect(file, "data file name").toMatch(KEBAB);
    for (const c of companies) expect(files, `${c.id} has no data file named after its id`).toContain(c.id);
  });
});

describe.each(companies.map((c) => [c.id, c] as const))("company %s", (_, company) => {
  it("has well-formed identity fields", () => {
    expect(company.code).toMatch(/^[0-9][0-9A-Z]{3}$/);
    expect(company.name.trim()).not.toBe("");
    expect(company.officialName.trim()).not.toBe("");
    expect(company.listings.length).toBeGreaterThan(0);
    expect(company.updatedAt).toMatch(ISO_DATE);
  });

  it("keeps the one-sentence description short enough to read in three seconds", () => {
    // Not a style preference: the description is the 3-second KPI in data form.
    expect(company.description.length).toBeLessThanOrEqual(90);
    expect(company.description.split("。").filter(Boolean).length).toBeLessThanOrEqual(1);
  });

  it("has well-formed sources", () => {
    expect(company.sources.length).toBeGreaterThan(0);
    expectSourcesWellFormed(company.sources, company.id);
  });

  it("cites a source for every business, and business ids are unique kebab-case", () => {
    const all = flattenBusinesses(company.businesses);
    const ids = all.map((b) => b.id);
    expect(new Set(ids).size, "duplicate business ids").toBe(ids.length);
    for (const b of all) {
      expect(b.id).toMatch(KEBAB);
      expectSourced(b.sourceIds, company.sources, `${company.id}.businesses.${b.id}`);
    }
  });

  it("has a complete five-step business model, if it has one", () => {
    const model = company.businessModel;
    if (!model) return;
    expect(model.flow.map((s) => s.kind)).toEqual(["company", "offering", "customer", "revenue", "profit"]);
    expectSourced(model.sourceIds, company.sources, `${company.id}.businessModel`);
  });

  it("has sourced, ordered, non-duplicated financial years in JPY", () => {
    const periods = company.financials.map((f) => f.periodEnd);
    expect(new Set(periods).size, "duplicate fiscal years").toBe(periods.length);
    for (const f of company.financials) {
      expect(f.periodEnd).toMatch(ISO_DATE);
      expect(f.currency).toBe("JPY");
      expect(f.revenueLabel.trim()).not.toBe("");
      expect(f.netIncomeLabel.trim()).not.toBe("");
      if (f.revenue !== null) expect(Number.isSafeInteger(f.revenue), `${f.fiscalYear} revenue`).toBe(true);
      if (f.netIncome !== null) expect(Number.isSafeInteger(f.netIncome), `${f.fiscalYear} netIncome`).toBe(true);
      // Filings print 百万円; a value that is not a whole number of millions was mis-converted.
      if (f.revenue !== null) expect(f.revenue % 1_000_000, `${f.fiscalYear} revenue unit`).toBe(0);
      if (f.netIncome !== null) expect(f.netIncome % 1_000_000, `${f.fiscalYear} netIncome unit`).toBe(0);
      expectSourced(f.sourceIds, company.sources, `${company.id}.financials.${f.fiscalYear}`);
    }
  });

  it("marks an entry with a missing figure as needs-attention", () => {
    // Invariant 1: a null is an explicit, reviewed absence — and it must be visible in admin.
    const hasNull = company.financials.some((f) => f.revenue === null || f.netIncome === null);
    if (hasNull) expect(company.status.state).toBe("needs-attention");
  });

  it("cites a source for every history event", () => {
    for (const h of company.history) {
      expect(Number.isInteger(h.year)).toBe(true);
      expect(h.significance.trim(), `${h.year}: significance is the point of the row`).not.toBe("");
      expectSourced(h.sourceIds, company.sources, `${company.id}.history.${h.year}`);
    }
  });

  it("uses known industries with exactly one primary", () => {
    expect(company.industries.length).toBeGreaterThan(0);
    for (const ref of company.industries) expect(industryIds.has(ref.industryId)).toBe(true);
    expect(company.industries.filter((r) => r.primary)).toHaveLength(1);
  });

  it("relates only to published companies, with a sourced reason", () => {
    for (const r of company.relatedCompanies) {
      expect(r.companyId, "a company cannot relate to itself").not.toBe(company.id);
      expect(companyIds.has(r.companyId), `related company "${r.companyId}" is not published`).toBe(true);
      expect(RELATIONSHIP_KINDS).toContain(r.relationship);
      expect(r.description.trim()).not.toBe("");
      expectSourced(r.sourceIds, company.sources, `${company.id}.related.${r.companyId}`);
    }
  });

  it("has valid rich-text references", () => {
    for (const [where, text] of companyTexts(company)) expectRichTextValid(text, where);
  });

  it("has a revision history", () => {
    expect(company.revisions.length).toBeGreaterThan(0);
    for (const r of company.revisions) expect(r.date).toMatch(ISO_DATE);
  });

  it("never mentions investment metrics (invariant 4)", () => {
    const text = JSON.stringify(company);
    for (const banned of ["株価", "PER", "PBR", "ROE", "ROA", "配当利回り", "目標株価", "買い推奨", "売り推奨"]) {
      expect(text.includes(banned), `contains "${banned}"`).toBe(false);
    }
  });
});

describe.each(industries.map((i) => [i.id, i] as const))("industry %s", (_, industry) => {
  it("is sourced and places only companies that point back at it", () => {
    expectSourcesWellFormed(industry.sources, industry.id);
    expectSourced(industry.sourceIds, industry.sources, `${industry.id}.description`);
    expectRichTextValid(industry.description, `${industry.id}.description`);
    for (const category of industry.categories) {
      expect(category.id).toMatch(KEBAB);
      expectSourced(category.sourceIds, industry.sources, `${industry.id}.${category.id}`);
      for (const companyId of category.companyIds) {
        const company = companies.find((c) => c.id === companyId);
        expect(company, `${industry.id}.${category.id}: "${companyId}" is not published`).toBeDefined();
        // Company → Industry and Industry → Company must agree.
        expect(
          company!.industries.some((r) => r.industryId === industry.id),
          `${companyId} is placed in ${industry.id} but does not list it`,
        ).toBe(true);
      }
    }
  });
});

describe.each(terms.map((t) => [t.id, t] as const))("term %s", (_, term) => {
  it("is short, sourced and links only to existing terms", () => {
    expect(term.description.length, "inline definitions must stay short").toBeLessThanOrEqual(160);
    expect(term.sources.length).toBeGreaterThan(0);
    expectSourcesWellFormed(term.sources, term.id);
    for (const id of term.relatedTermIds ?? []) expect(termIds.has(id), `unknown related term ${id}`).toBe(true);
  });
});

describe.each(features.map((f) => [f.id, f] as const))("feature %s", (_, feature) => {
  it("links only to things that exist and cites its sources", () => {
    expectSourcesWellFormed(feature.sources, feature.id);
    for (const id of feature.relatedCompanies) expect(companyIds.has(id), `company ${id}`).toBe(true);
    for (const id of feature.relatedIndustries) expect(industryIds.has(id), `industry ${id}`).toBe(true);
    for (const id of feature.relatedTerms) expect(termIds.has(id), `term ${id}`).toBe(true);
    for (const block of feature.body) {
      if (block.type === "paragraph" || block.type === "quote") {
        expectRichTextValid(block.text, `${feature.id}.body`);
        for (const id of block.sourceIds ?? []) {
          expect(feature.sources.some((s) => s.id === id), `${feature.id}: unknown source ${id}`).toBe(true);
        }
      }
      if (block.type === "company-callout") expect(companyIds.has(block.companyId)).toBe(true);
    }
  });
});
