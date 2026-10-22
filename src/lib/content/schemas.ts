import { z } from "zod";
import { INDUSTRY_IDS, RELATIONSHIP_KINDS, type Company } from "@/types/company";
import type { Feature } from "@/types/feature";
import type { Industry } from "@/types/industry";
import type { Revision } from "@/types/revision";
import type { Source } from "@/types/source";
import type { Term } from "@/types/term";

/**
 * Runtime schemas for repository content.
 *
 * Content is JSON (so the local admin editor can rewrite it safely), and JSON
 * is not checked by the TypeScript compiler. Every file is parsed through
 * these schemas when it is loaded — a malformed file fails the build instead
 * of rendering — and every editor save is parsed before it is written.
 *
 * Objects are strict: an unknown key is an error, so a typo in a hand edit
 * ("sourceId" for "sourceIds") cannot pass silently. The type assertions at
 * the bottom stop these schemas and the hand-written types in src/types/ from
 * drifting apart.
 */

const kebab = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case の id である必要があります");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 形式である必要があります");
const text = z.string().trim().min(1, "空にできません");

export const sourceSchema = z.strictObject({
  id: kebab,
  title: text,
  publisher: text,
  url: z.string().regex(/^https:\/\//, "https:// で始まる URL である必要があります"),
  publishedAt: isoDate.optional(),
  accessedAt: isoDate,
  docId: z.string().regex(/^S[0-9A-Z]{7}$/, "EDINET の書類 ID（S100XXXX）である必要があります").optional(),
  asOf: isoDate.optional(),
});

const sourced = { sourceIds: z.array(kebab), locator: text.optional() };

const perspectiveSchema = z.strictObject({
  disclosed: z.strictObject({ text, asOf: isoDate, ...sourced }).optional(),
  analysis: z.strictObject({ text, basis: text, asOf: isoDate, ...sourced }).optional(),
});

const contentStatusSchema = z.discriminatedUnion("state", [
  z.strictObject({ state: z.literal("published") }),
  z.strictObject({ state: z.literal("needs-attention"), notes: z.array(text).min(1) }),
  // Figures and sources only, with the writing not yet done. See ContentStatus.
  z.strictObject({ state: z.literal("figures-only") }),
]);

type BusinessShape = {
  id: string;
  name: string;
  shortName?: string;
  description: string;
  products?: string[];
  customers?: string[];
  children?: BusinessShape[];
  sourceIds: string[];
  locator?: string;
};

export const businessSchema: z.ZodType<BusinessShape> = z.lazy(() =>
  z.strictObject({
    id: kebab,
    name: text,
    shortName: text.optional(),
    description: text,
    products: z.array(text).optional(),
    customers: z.array(text).optional(),
    children: z.array(businessSchema).optional(),
    ...sourced,
  }),
);

export const companySchema = z.strictObject({
  id: kebab,
  code: z.string().regex(/^[0-9][0-9A-Z]{3}$/, "証券コードは4桁です"),
  name: text,
  officialName: text,
  nameEn: text.optional(),
  shortNameEn: text.optional(),
  // Nullable and possibly empty only for a figures-only entry; checkCompany is
  // what ties these three to that status, because the shape alone cannot say
  // whether an empty entry is deliberate or unfinished.
  description: text.nullable(),
  listings: z
    .array(z.strictObject({ exchange: z.enum(["tse", "nse", "fse", "sse"]), market: text.optional() }))
    .min(1),
  industries: z.array(z.strictObject({ industryId: z.enum(INDUSTRY_IDS), primary: z.boolean().optional() })),
  businesses: z.array(businessSchema),
  businessModel: z
    .strictObject({
      description: text,
      products: z.array(text),
      customers: z.array(text),
      revenueSources: z.array(text),
      flow: z.array(
        z.strictObject({
          kind: z.enum(["company", "offering", "customer", "revenue", "profit"]),
          title: text,
          description: text,
        }),
      ),
      ...sourced,
    })
    .optional(),
  perspectives: z
    .strictObject({
      strategy: perspectiveSchema.optional(),
      competitiveAdvantage: perspectiveSchema.optional(),
      industryPosition: perspectiveSchema.optional(),
    })
    .optional(),
  financials: z.array(
    z.strictObject({
      fiscalYear: text,
      periodEnd: isoDate,
      revenue: z.number().int().nullable(),
      revenueLabel: text,
      profit: z.number().int().nullable(),
      profitLabel: text.nullable(),
      netIncome: z.number().int().nullable(),
      netIncomeLabel: text,
      totalAssets: z.number().int().nullable(),
      totalAssetsLabel: text.nullable(),
      netAssets: z.number().int().nullable(),
      netAssetsLabel: text.nullable(),
      employees: z.number().int().nonnegative().nullable(),
      currency: z.literal("JPY"),
      accountingStandard: z.enum(["ifrs", "jgaap", "usgaap"]),
      revenueBasis: text.optional(),
      netIncomeBasis: text.optional(),
      note: text.optional(),
      ...sourced,
    }),
  ),
  history: z.array(
    z.strictObject({
      year: z.number().int().min(1600).max(2100),
      title: text,
      description: text,
      significance: text,
      ...sourced,
    }),
  ),
  relatedCompanies: z.array(
    z.strictObject({
      companyId: kebab,
      relationship: z.enum(RELATIONSHIP_KINDS),
      description: text,
      ...sourced,
    }),
  ),
  sources: z.array(sourceSchema).min(1),
  status: contentStatusSchema,
  updatedAt: isoDate,
});

export const industrySchema = z.strictObject({
  id: z.enum(INDUSTRY_IDS),
  name: text,
  nameEn: text,
  description: text,
  structure: z.enum(["chain", "segments"]),
  categories: z.array(
    z.strictObject({
      id: kebab,
      name: text,
      role: z.enum(["stage", "input"]).optional(),
      description: text,
      companyIds: z.array(kebab),
      ...sourced,
    }),
  ),
  sources: z.array(sourceSchema).min(1),
  status: contentStatusSchema,
  updatedAt: isoDate,
  ...sourced,
});

export const termSchema = z.strictObject({
  id: kebab,
  term: text,
  reading: text.optional(),
  description: text,
  relatedTermIds: z.array(kebab).optional(),
  sources: z.array(sourceSchema).min(1),
  updatedAt: isoDate,
});

const featureBlockSchema = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("paragraph"), text, sourceIds: z.array(kebab).optional() }),
  z.strictObject({ type: z.literal("heading"), text }),
  z.strictObject({ type: z.literal("quote"), text, attribution: text, sourceIds: z.array(kebab) }),
  z.strictObject({ type: z.literal("company-callout"), companyId: kebab, text }),
]);

export const featureSchema = z.strictObject({
  id: kebab,
  title: text,
  subtitle: text.optional(),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  body: z.array(featureBlockSchema),
  relatedCompanies: z.array(kebab),
  relatedIndustries: z.array(z.enum(INDUSTRY_IDS)),
  relatedTerms: z.array(kebab),
  sources: z.array(sourceSchema),
  status: contentStatusSchema,
  publishedAt: isoDate,
});

const approverSchema = z.strictObject({ id: kebab, name: text, kind: z.enum(["operator", "person", "agent"]) });

/** A formal approval is a person's; an agent's is a proxy and must say on whose authority, and on what basis. */
export const approvalSchema = z
  .strictObject({
    approver: approverSchema,
    approvedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/, "ISO 8601 の日時である必要があります"),
    reviewHash: z.string().regex(/^[0-9a-f]{8,64}$/).optional(),
    fields: z.array(text).optional(),
    onBehalfOf: approverSchema.optional(),
    basis: text.optional(),
  })
  .refine((a) => (a.approver.kind === "agent" ? a.onBehalfOf !== undefined && a.onBehalfOf.kind !== "agent" && a.basis !== undefined : a.onBehalfOf === undefined), {
    message: "AI の代理承認には onBehalfOf（人）と basis が要る。人の承認には onBehalfOf を付けない",
  });

export const revisionSchema = z.strictObject({
  id: kebab,
  targetType: z.enum(["company", "industry", "term", "feature"]),
  targetId: kebab,
  changedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}(T[\d:.]+Z)?$/, "ISO 8601 の日時である必要があります"),
  reason: text.optional(),
  summary: text,
  before: z.unknown().optional(),
  after: z.unknown().optional(),
  approval: approvalSchema.optional(),
  corrects: kebab.optional(),
});

/** Parse or throw an error that names the file and the exact field. */
export function parseContent<T>(schema: z.ZodType<T>, value: unknown, label: string): T {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  const issues = result.error.issues.map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
  throw new Error(`Invalid content in ${label}:\n${issues}`);
}

// ---------------------------------------------------------------------------
// Schema ⇄ type agreement. If a field is added to a type but not a schema (or
// the reverse), one of these lines stops compiling.

// Flatten intersections (`Sourced & {...}`) so structurally identical types compare equal.
type Deep<T> = T extends (infer U)[] ? Deep<U>[] : T extends object ? { [K in keyof T]: Deep<T[K]> } : T;
type Equals<A, B> =
  (<T>() => T extends Deep<A> ? 1 : 2) extends <T>() => T extends Deep<B> ? 1 : 2 ? true : false;
type Assert<T extends true> = T;

export type SchemaAgreement = [
  Assert<Equals<z.infer<typeof sourceSchema>, Source>>,
  Assert<Equals<z.infer<typeof companySchema>, Company>>,
  Assert<Equals<z.infer<typeof industrySchema>, Industry>>,
  Assert<Equals<z.infer<typeof termSchema>, Term>>,
  Assert<Equals<z.infer<typeof featureSchema>, Feature>>,
  Assert<Equals<z.infer<typeof revisionSchema>, Revision>>,
];
