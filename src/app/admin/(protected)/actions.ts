"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAdmin } from "@/lib/admin/session";
import { getReportRepository } from "@/lib/reports";
import { isReportStatus } from "@/lib/reports/report-types";

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
  revalidatePath("/admin/reports");
  revalidatePath("/admin");
}
