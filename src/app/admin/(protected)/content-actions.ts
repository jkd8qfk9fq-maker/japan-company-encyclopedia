"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { ContentStore, localEditingStatus, type EditableKind, type PreviewResult, type SaveResult } from "@/lib/content/content-store";

/**
 * The editor's only way to touch repository content. Each action re-checks
 * the admin session (actions are reachable by direct POST) and refuses to run
 * anywhere but local development — production /admin can never write to the
 * repository (Git-Based Correction System spec §11).
 */

const KINDS: readonly EditableKind[] = ["company", "term"];

function store() {
  return new ContentStore(process.cwd());
}

async function guard(kind: unknown): Promise<string | null> {
  await requireAdmin();
  const status = localEditingStatus();
  if (!status.enabled) return status.reason;
  if (!KINDS.includes(kind as EditableKind)) return "編集できない種類です。";
  return null;
}

export async function previewContentEdit(kind: EditableKind, id: string, baseVersion: string, draft: unknown): Promise<PreviewResult> {
  const refused = await guard(kind);
  if (refused) return { ok: false, errors: [refused] };
  return store().preview(kind, id, draft, baseVersion);
}

export async function saveContentEdit(input: {
  kind: EditableKind;
  id: string;
  baseVersion: string;
  draft: unknown;
  summary: string;
  reason: string;
  confirmSourceRemoval: boolean;
}): Promise<SaveResult> {
  const refused = await guard(input.kind);
  if (refused) return { ok: false, errors: [refused] };
  const result = await store().save({
    kind: input.kind,
    id: String(input.id),
    baseVersion: String(input.baseVersion),
    draft: input.draft,
    summary: String(input.summary ?? ""),
    reason: String(input.reason ?? ""),
    confirmSourceRemoval: input.confirmSourceRemoval === true,
  });
  if (result.ok) {
    revalidatePath("/admin", "layout");
    // Public pages pick the change up on the next dev render; in production they change only by deploying.
    revalidatePath("/", "layout");
  }
  return result;
}
