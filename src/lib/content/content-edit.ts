import type { Company } from "@/types/company";
import type { Revision } from "@/types/revision";
import type { Source } from "@/types/source";
import type { Term } from "@/types/term";
import { defaultApprover } from "./approvers";
import { changedFields, removedSources, revisionSnapshots, type FieldChange } from "./diff";
import { checkCompany, checkTerm, type ContentContext } from "./integrity";
import { companySchema, parseContent, termSchema } from "./schemas";

/**
 * The rules of an edit to published content, with no file system and no git: what makes a draft acceptable, and the
 * content and Revision a save writes. Two editors share them (JCE-109) — the local admin editor, which writes the
 * working tree (content-store.ts), and the hosted admin app, which turns the same two files into a pull request
 * (admin-app/). Keeping one copy is what keeps the two from ever accepting different things.
 */

export type EditableKind = "company" | "term";

export const EDIT_DIRECTORY: Record<EditableKind, string> = { company: "companies", term: "terms" };

export const EDIT_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PreviewResult =
  | { ok: true; changes: FieldChange[]; removedSources: Source[] }
  | { ok: false; errors: string[]; conflict?: boolean };

/** "YYYY-MM-DD" in Japan: the date an editor in Japan would write down. */
export function tokyoDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/**
 * Re-order a draft's keys to follow the original file, so the git diff shows
 * what changed and not how the editor happened to rebuild the object.
 */
export function orderLike(original: unknown, draft: unknown): unknown {
  if (Array.isArray(draft)) {
    return draft.map((item, i) => orderLike(Array.isArray(original) ? original[i] : undefined, item));
  }
  if (draft && typeof draft === "object") {
    const source = original && typeof original === "object" && !Array.isArray(original) ? (original as Record<string, unknown>) : {};
    const d = draft as Record<string, unknown>;
    const keys = [...Object.keys(source).filter((k) => k in d), ...Object.keys(d).filter((k) => !(k in source))];
    return Object.fromEntries(keys.filter((k) => d[k] !== undefined).map((k) => [k, orderLike(source[k], d[k])]));
  }
  return draft;
}

function schemaErrors(result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }): string[] {
  return result.success ? [] : (result.error?.issues ?? []).map((i) => `${i.path.map(String).join(".") || "(全体)"}: ${i.message}`);
}

/** Schema, id, integrity and "did anything change" — the checks a draft passes before it can be saved. */
export function previewEdit(kind: EditableKind, id: string, current: Record<string, unknown>, draft: unknown, context: ContentContext): PreviewResult {
  const schema = kind === "company" ? companySchema : termSchema;
  const parsed = schema.safeParse(draft);
  if (!parsed.success) return { ok: false, errors: schemaErrors(parsed) };
  const value = parsed.data as Company | Term;
  if (value.id !== id) return { ok: false, errors: ["id は変更できません（URLとファイル名が変わってしまうため）。"] };

  const integrity = kind === "company" ? checkCompany(value as Company, context) : checkTerm(value as Term, context);
  if (integrity.length > 0) return { ok: false, errors: integrity };

  const changes = changedFields(current, value as unknown as Record<string, unknown>);
  if (changes.length === 0) return { ok: false, errors: ["変更がありません。"] };

  return { ok: true, changes, removedSources: removedSources(current as { sources: Source[] }, value) };
}

/** What a save needs beyond a valid draft: a summary, a reason, and an explicit yes for any source removed. */
export function saveInputErrors(preview: { removedSources: Source[] }, summary: string, reason: string, confirmSourceRemoval: boolean): string[] {
  const errors: string[] = [];
  if (!summary) errors.push("変更の要約を書いてください。");
  if (summary.length > 120) errors.push("変更の要約は120文字以内にしてください。");
  if (!reason) errors.push("理由と根拠（出典や報告）を書いてください。");
  if (preview.removedSources.length > 0 && !confirmSourceRemoval) {
    errors.push(`出典「${preview.removedSources.map((s) => s.title).join("」「")}」を削除します。削除してよいことを確認し、理由を書いてください。`);
  }
  return errors;
}

const randomHex = (bytes: number) => [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, "0")).join("");

/** The two files a save writes — the content, keys ordered like the original, and its Revision — as repository paths and text. */
export function buildSave(input: {
  kind: EditableKind;
  id: string;
  current: Record<string, unknown>;
  draft: unknown;
  changes: FieldChange[];
  summary: string;
  reason: string;
  now: Date;
}): { revisionId: string; revision: Revision; files: { path: string; text: string }[] } {
  const parsed = input.kind === "company" ? parseContent(companySchema, input.draft, input.id) : parseContent(termSchema, input.draft, input.id);
  const ordered = orderLike(input.current, { ...parsed, updatedAt: tokyoDate(input.now) });
  const revisionId = `${tokyoDate(input.now)}-${input.kind}-${input.id}-${randomHex(3)}`;
  const revision: Revision = {
    id: revisionId,
    targetType: input.kind,
    targetId: input.id,
    changedAt: input.now.toISOString(),
    reason: input.reason,
    summary: input.summary,
    ...revisionSnapshots(input.changes),
    // The editor is used by the operator; saving is the approval. Individual approvers will be chosen here later.
    approval: { approver: defaultApprover(), approvedAt: input.now.toISOString(), fields: input.changes.map((c) => c.field) },
  };
  return {
    revisionId,
    revision,
    files: [
      { path: `src/data/revisions/${revisionId}.json`, text: `${JSON.stringify(revision, null, 2)}\n` },
      { path: `src/data/${EDIT_DIRECTORY[input.kind]}/${input.id}.json`, text: `${JSON.stringify(ordered, null, 2)}\n` },
    ],
  };
}
