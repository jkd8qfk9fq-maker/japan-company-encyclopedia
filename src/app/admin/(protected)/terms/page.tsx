import Link from "next/link";
import { localEditingStatus } from "@/lib/content/content-store";
import { revisionRepository, termRepository } from "@/lib/repositories";

export const metadata = { title: "用語" };

export default async function AdminTerms() {
  const [terms, revisions] = await Promise.all([termRepository.list(), revisionRepository.list()]);
  const editable = localEditingStatus().enabled;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">用語</h1>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {terms.map((term) => (
          <li key={term.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
            <span>
              <span className="font-medium">{term.term}</span>
              <span className="ml-2 font-mono text-xs text-muted-foreground">{term.id}</span>
            </span>
            <span className="flex items-center gap-4 text-xs text-muted-foreground">
              改訂 {revisions.filter((r) => r.targetType === "term" && r.targetId === term.id).length}
              {editable && <Link href={`/admin/terms/${term.id}/edit`} className="link-ink text-sm">編集</Link>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
