import Link from "next/link";
import { approvalLabel, effectiveApproval } from "@/lib/content/approvers";
import { describeTarget, TARGET_TYPE_LABEL } from "@/lib/content/target-names";
import { revisionRepository } from "@/lib/repositories";

export const metadata = { title: "改訂履歴" };

/**
 * Every change to published content, newest first. Each row opens the
 * revision: what changed (before / after), why, and when. The commit and the
 * deployment that carried it are in git history.
 */
export default async function AdminRevisions() {
  const revisions = await revisionRepository.list();
  const rows = await Promise.all(revisions.map(async (r) => ({ revision: r, target: await describeTarget(r.targetType, r.targetId), approval: approvalLabel(effectiveApproval(r, revisions)) })));

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">改訂履歴</h1>
      <p className="mt-2 text-sm text-muted-foreground">{revisions.length}件</p>
      <ol className="mt-6 divide-y divide-border border-y border-border">
        {rows.map(({ revision, target, approval }) => (
          <li key={revision.id}>
            <Link
              href={`/admin/revisions/${revision.id}`}
              className="grid gap-1 py-4 text-sm hover:bg-muted/50 md:grid-cols-[10rem_4rem_12rem_1fr] md:gap-4"
            >
              <span className="figures text-muted-foreground">{revision.changedAt.slice(0, 16).replace("T", " ")}</span>
              <span className="text-muted-foreground">{TARGET_TYPE_LABEL[revision.targetType]}</span>
              <span className="font-medium">{target.name}</span>
              <span className="leading-6">
                {revision.summary}
                {approval.kind === "none" ? null : <span className="ml-2 text-xs text-muted-foreground">［{approval.kind === "proxy" ? "AI代理承認" : "正式承認"}］</span>}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
