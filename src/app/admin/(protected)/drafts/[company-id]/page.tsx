import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CompanyView } from "@/components/company/company-view";
import { contentContext, DRAFT_STATE_LABEL } from "@/lib/drafts";
import { isReleased, releaseReadiness } from "@/lib/release";
import { companyRepository } from "@/lib/repositories";

export const metadata = { title: "下書きプレビュー" };

/**
 * An unreleased company, rendered by the code that will show it to readers once it is released. Operators only:
 * this is under /admin, so requireAdmin guards it, the session cookie only exists on /admin, and it is noindex.
 * The page is shown as the public would see it TODAY — a link to a company that is not released yet is plain
 * text here too, exactly as it would be for a reader.
 */
export default async function DraftPreview({ params }: PageProps<"/admin/drafts/[company-id]">) {
  const id = (await params)["company-id"];
  const company = await companyRepository.getAny(id);
  if (!company) notFound();
  if (isReleased(company)) redirect(`/companies/${id}`);

  const readiness = releaseReadiness(company, await contentContext());
  const state = company.status.state === "figures-only" ? "figures-only" : "needs-attention";

  return (
    // Break out of the admin shell's column, so the preview has the page's real width and section backgrounds.
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <aside aria-label="下書きの状態" className="border-y border-foreground bg-muted/40">
        <div className="mx-auto max-w-6xl space-y-3 px-5 py-5 text-sm leading-7 md:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-semibold">下書きプレビュー（運営のみ・非公開）</p>
            <p className="flex gap-4">
              <Link href="/admin/drafts" className="link-ink">← 下書き一覧</Link>
              <Link href={`/admin/companies/${id}`} className="link-ink">出典・改訂履歴</Link>
            </p>
          </div>
          <p className="text-muted-foreground">
            状態: {DRAFT_STATE_LABEL[state]} ／ この企業は公開されていません。以下は、公開されたときに読者に見える内容です（共有・報告のボタンは公開後に使えます）。
          </p>
          {readiness.ready ? (
            <p className="font-semibold">公開できる状態です。ローカルのエディタで状態を「公開」にして、コミットしてください。</p>
          ) : (
            <div>
              <p className="font-semibold">公開までに残っていること（{readiness.problems.length + readiness.notes.length} 件）</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {readiness.notes.map((n) => <li key={n}>確認メモ: {n}</li>)}
                {readiness.problems.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          )}
        </div>
      </aside>
      <article>
        <CompanyView company={company} />
      </article>
    </div>
  );
}
