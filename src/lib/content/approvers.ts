import { z } from "zod";
import raw from "@/data/approvers.json";
import type { Approval, Approver, Revision } from "@/types/revision";

/**
 * Who may approve a change to published content (src/data/approvers.json). Today one: the operator, YUGENQ (JCE-024).
 * Individual approvers are added to the same list with `kind: "person"`; every Revision records the one who approved.
 * The pipeline scripts read the same file (scripts/pipeline/approvers.mjs). An `agent` on the list is how an AI that
 * executed an approval is recorded; it is never the default and never a formal approver.
 */
const approverSchema = z.strictObject({ id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().min(1), kind: z.enum(["operator", "person", "agent"]) });
const fileSchema = z
  .strictObject({ default: z.string(), approvers: z.array(approverSchema).min(1) })
  .refine((f) => f.approvers.some((a) => a.id === f.default && a.kind !== "agent"), "default が approvers に無いか、agent になっています");

const parsed = fileSchema.parse(raw);

export const APPROVERS: Approver[] = parsed.approvers;

export function defaultApprover(): Approver {
  return parsed.approvers.find((a) => a.id === parsed.default)!;
}

/** How an approval reads in the admin screens: a person's (formal), an AI's on someone's authority (proxy), or none. */
export function approvalLabel(approval: Approval | undefined): { kind: "formal" | "proxy" | "none"; text: string } {
  if (!approval) return { kind: "none", text: "承認の記録なし" };
  if (approval.approver.kind === "agent") return { kind: "proxy", text: `AI の代理承認（${approval.approver.name}、${approval.onBehalfOf?.name ?? "?"} の権限で）` };
  return { kind: "formal", text: `正式な承認（${approval.approver.name}）` };
}

/** Was this approved by a person who read it (formal), or executed by an AI on someone's authority (proxy)? */
export const isFormalApproval = (approval: Approval) => approval.approver.kind !== "agent";

/**
 * The approval a revision stands with, after any later revision that corrects its record (`corrects`): the latest
 * correction's `after.approval` wins. The earlier file is never edited, so this is how the history is read.
 */
export function effectiveApproval(revision: Revision, all: Revision[]): Approval | undefined {
  const corrections = all.filter((r) => r.corrects === revision.id).sort((a, b) => a.changedAt.localeCompare(b.changedAt));
  const last = corrections.at(-1)?.after as { approval?: Approval } | undefined;
  return last?.approval ?? revision.approval;
}
