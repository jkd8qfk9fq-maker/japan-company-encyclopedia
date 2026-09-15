"use server";

import { submitterKey } from "@/lib/admin/crypto";
import { clientAddress } from "@/lib/admin/session";
import { getReportRepository } from "@/lib/reports";
import { validateReportInput } from "@/lib/reports/report-types";

export type SubmitReportState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string };

/** Reports per sender per hour. A reader correcting several claims stays well under it. */
const REPORTS_PER_HOUR = 10;

/**
 * Receives a reader's report. Reachable by direct POST like every Server
 * Action, so it trusts nothing from the form: every field goes through
 * validateReportInput, and the sender is rate-limited by an irreversible key.
 *
 * It says "sent" only after the report is actually stored where the editor
 * reads it (JCE-008). Unavailable storage is an error the reader sees.
 */
export async function submitReport(_previous: SubmitReportState, form: FormData): Promise<SubmitReportState> {
  // A field real readers never see. A bot that fills it is told "sent" and
  // nothing is stored: telling it otherwise only teaches it to skip the field.
  if (String(form.get("website") ?? "") !== "") return { status: "sent" };

  const companyId = form.get("companyId");
  const checked = validateReportInput({
    companyId,
    category: form.get("category"),
    message: form.get("message"),
    // Rebuilt from the validated id, never taken from a posted path.
    pagePath: typeof companyId === "string" && companyId ? `/companies/${companyId}` : undefined,
  });
  if (!checked.ok) {
    const message = {
      category: "報告の種類を選んでください。",
      message: "誤りの内容を入力してください。",
      "too-long": "内容が長すぎます。2,000文字以内にしてください。",
    }[checked.error];
    return { status: "error", message };
  }

  const repository = getReportRepository();
  const secret =
    process.env.ADMIN_SESSION_SECRET ??
    (process.env.NODE_ENV !== "production" ? "development-only-secret-never-used-in-production" : undefined);
  if (!repository || !secret) {
    return { status: "error", message: "現在、報告を受け付けることができません。時間をおいてもう一度お試しください。" };
  }

  try {
    const sender = submitterKey(secret, await clientAddress());
    if ((await repository.countSince(sender, new Date(Date.now() - 60 * 60 * 1000))) >= REPORTS_PER_HOUR) {
      return { status: "error", message: "短い時間に多くの報告が送られました。しばらくしてからもう一度お試しください。" };
    }
    await repository.add(checked.value, sender);
    return { status: "sent" };
  } catch (error) {
    // Logged for the operator; the reader gets a plain message, never internals.
    console.error("[report] could not store report", error);
    return { status: "error", message: "送信できませんでした。時間をおいてもう一度お試しください。" };
  }
}
