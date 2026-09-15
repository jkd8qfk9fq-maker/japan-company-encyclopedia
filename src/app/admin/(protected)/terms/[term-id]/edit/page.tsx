import Link from "next/link";
import { notFound } from "next/navigation";
import { TermEditor } from "@/components/admin/editor/term-editor";
import { EditingUnavailable } from "@/components/admin/editing-unavailable";
import { ContentStore, localEditingStatus } from "@/lib/content/content-store";
import { termSchema } from "@/lib/content/schemas";
import { termRepository } from "@/lib/repositories";

export const metadata = { title: "用語を編集" };

export default async function EditTermPage({ params }: PageProps<"/admin/terms/[term-id]/edit">) {
  const id = (await params)["term-id"];
  const status = localEditingStatus();
  const loaded = await new ContentStore(process.cwd()).read("term", id);
  if (!loaded) notFound();
  const parsed = termSchema.safeParse(loaded.data);
  const terms = (await termRepository.list()).map((t) => ({ id: t.id, term: t.term }));

  return (
    <div>
      <Link href="/admin/terms" className="text-sm text-muted-foreground hover:text-foreground">← 用語</Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold">{parsed.success ? parsed.data.term : id} を編集</h1>
      <p className="mt-1 font-mono text-xs text-muted-foreground">src/data/terms/{id}.json</p>
      <div className="mt-8">
        {!status.enabled ? (
          <EditingUnavailable reason={status.reason} />
        ) : !parsed.success ? (
          <p role="alert" className="text-sm text-destructive">データファイルが不正な形式のため、エディタで開けません。</p>
        ) : (
          <TermEditor initial={parsed.data} version={loaded.version} terms={terms} />
        )}
      </div>
    </div>
  );
}
