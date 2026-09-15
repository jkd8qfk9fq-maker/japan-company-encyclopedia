import { isDeepStrictEqual } from "node:util";
import type { Source } from "@/types/source";

/**
 * What a correction changes, in the shape a Revision stores.
 *
 * Granularity is the top-level field ("businesses", "financials"), not the
 * individual character. That is enough to answer "what changed" alongside
 * the git diff, which has the line-level detail, and keeps each revision file
 * readable. `updatedAt` is bookkeeping and never counts as a change.
 */

export type FieldChange = { field: string; before: unknown; after: unknown };

const IGNORED = new Set(["updatedAt"]);

export function changedFields(before: Record<string, unknown>, after: Record<string, unknown>): FieldChange[] {
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((k) => !IGNORED.has(k));
  return keys
    .filter((k) => !isDeepStrictEqual(before[k], after[k]))
    .map((k) => ({ field: k, before: before[k], after: after[k] }));
}

/** The `before` / `after` pair for a Revision: only the fields that changed. */
export function revisionSnapshots(changes: FieldChange[]): { before: Record<string, unknown>; after: Record<string, unknown> } {
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  for (const c of changes) {
    if (c.before !== undefined) before[c.field] = c.before;
    if (c.after !== undefined) after[c.field] = c.after;
  }
  return { before, after };
}

/**
 * Sources present before and gone after. Removing attribution is the one
 * change the editor never lets through silently (Git-Based Correction System
 * spec §10): it needs an explicit confirmation and a written reason.
 */
export function removedSources(before: { sources: Source[] }, after: { sources: Source[] }): Source[] {
  const kept = new Set(after.sources.map((s) => s.id));
  return before.sources.filter((s) => !kept.has(s.id));
}
