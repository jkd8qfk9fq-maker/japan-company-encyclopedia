import type { ContentContext } from "@/lib/content/integrity";
import { isReleased } from "@/lib/release";
import { companyRepository, featureRepository, termRepository } from "@/lib/repositories";
import type { Company } from "@/types/company";

/**
 * What the operator-only draft console reads. SERVER ONLY, and only ever called from /admin pages, which sit behind
 * requireAdmin: drafts are the entries that have no public page.
 */

/** The ids the integrity rules resolve references against — the same sets the published tier is checked with. */
export async function contentContext(): Promise<ContentContext> {
  const [companies, terms, features] = await Promise.all([companyRepository.listAll(), termRepository.list(), featureRepository.list()]);
  return {
    companyIds: new Set(companies.map((c) => c.id)),
    termIds: new Set(terms.map((t) => t.id)),
    featureIds: new Set(features.map((f) => f.id)),
  };
}

export type DraftState = "needs-attention" | "figures-only";

export const DRAFT_STATE_LABEL: Record<DraftState, string> = {
  "needs-attention": "要確認",
  "figures-only": "数値のみ",
};

/** Every entry without a public page, and the counts the console header shows. */
export async function listDrafts(): Promise<{ drafts: Company[]; released: number }> {
  const all = await companyRepository.listAll();
  return { drafts: all.filter((c) => !isReleased(c)), released: all.filter(isReleased).length };
}
