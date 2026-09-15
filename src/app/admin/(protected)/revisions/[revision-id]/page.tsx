import Link from "next/link";
import { notFound } from "next/navigation";
import { describeTarget, TARGET_TYPE_LABEL } from "@/lib/content/target-names";
import { revisionRepository } from "@/lib/repositories";

export const metadata = { title: "改訂の内容" };

function Snapshot({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{label}</p>
      {value === undefined ? (
        <p className="mt-2 text-sm text-muted-foreground">なし</p>
      ) : (
        <pre className="mt-2 max-h-[32rem] overflow-auto rounded-md border border-border bg-paper p-4 text-xs leading-5 whitespace-pre-wrap break-all">
          {JSON.stringify(value, null, 2)}
        </pre>
      )}
    </div>
  );
}

/** Answers: what changed, why, and when. The source that justified it is in `reason` and in the entry's sources. */
export default async function AdminRevision({ params }: PageProps<"/admin/revisions/[revision-id]">) {
  const revision = await revisionRepository.get((await params)["revision-id"]);
  if (!revision) notFound();
  const target = await describeTarget(revision.targetType, revision.targetId);

  return (
    <article>
      <Link href="/admin/revisions" className="text-sm text-muted-foreground hover:text-foreground">← 改訂履歴</Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold">{revision.summary}</h1>
      <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[8rem_1fr]">
        <dt className="text-muted-foreground">対象</dt>
        <dd>
          {TARGET_TYPE_LABEL[revision.targetType]}・
          {target.href ? <Link href={target.href} className="link-ink">{target.name}</Link> : target.name}
        </dd>
        <dt className="text-muted-foreground">日時</dt>
        <dd className="figures">{revision.changedAt}</dd>
        <dt className="text-muted-foreground">理由・根拠</dt>
        <dd className="whitespace-pre-wrap">{revision.reason ?? "記録なし"}</dd>
        <dt className="text-muted-foreground">改訂ID</dt>
        <dd className="font-mono text-xs">{revision.id}</dd>
      </dl>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Snapshot label="変更前" value={revision.before} />
        <Snapshot label="変更後" value={revision.after} />
      </div>
    </article>
  );
}
