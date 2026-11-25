"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAdmin } from "@/lib/admin/session";
import { isEntranceStatus, MAX_ENTRANCE_MEMO_LENGTH, updateEntranceEntry as saveEntranceEntry } from "@/lib/admin/entrance-form";
import { localEditingStatus } from "@/lib/content/content-store";
import { getReportRepository } from "@/lib/reports";
import { isReportStatus, MAX_ADMIN_NOTE_LENGTH } from "@/lib/reports/report-types";

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/** Every admin action re-checks the session: Server Actions are reachable by direct POST. */
export async function updateReportStatus(form: FormData): Promise<void> {
  await requireAdmin();
  const id = form.get("id");
  const status = form.get("status");
  if (typeof id !== "string" || !isReportStatus(status)) return;
  const repository = getReportRepository();
  if (!repository) return;
  await repository.updateStatus(id, status);
  revalidatePath("/admin", "layout");
}

/**
 * The entrance form's handling record lives in a local state file with contact emails in it, so —
 * like the content editor — saving is a local-development write only (JCE-115). Production /admin
 * can display nothing and write nothing here.
 */
export async function updateEntranceEntry(form: FormData): Promise<void> {
  await requireAdmin();
  if (!localEditingStatus().enabled) return;
  const id = form.get("id");
  if (typeof id !== "string") return;
  const status = form.get("status");
  const memo = form.get("memo");
  if (status !== null && !isEntranceStatus(status)) return;
  if (memo !== null && (typeof memo !== "string" || memo.length > MAX_ENTRANCE_MEMO_LENGTH)) return;
  saveEntranceEntry(process.cwd(), id, {
    ...(status !== null ? { status } : {}),
    ...(memo !== null ? { memo } : {}),
  });
  revalidatePath("/admin", "layout");
}

export async function updateReportNote(form: FormData): Promise<void> {
  await requireAdmin();
  const id = form.get("id");
  const note = form.get("note");
  if (typeof id !== "string" || typeof note !== "string" || note.length > MAX_ADMIN_NOTE_LENGTH) return;
  const repository = getReportRepository();
  if (!repository) return;
  await repository.updateNote(id, note);
  revalidatePath("/admin", "layout");
}
