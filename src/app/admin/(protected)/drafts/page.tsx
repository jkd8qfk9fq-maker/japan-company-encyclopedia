import Link from "next/link";
import { contentContext, DRAFT_STATE_LABEL, listDrafts, type DraftState } from "@/lib/drafts";
import { releaseReadiness } from "@/lib/release";
import { formatDateJa } from "@/lib/utils/format";

export const metadata = { title: "下書き" };

const PAGE_SIZE = 50;

/**
 * The operator-only draft console: every entry that has no public page yet, what stands between it and the public
 * site, and a preview rendered by the same code readers will see. Behind requireAdmin (the protected layout) and
 * noindex like the rest of /admin; nothing here is prerendered or linked from the public site.
 */
export default async function AdminDrafts({ searchParams }: PageProps<"/admin/drafts">) {
  const sp = await searchParams;
  const state: DraftState = sp.state === "figures-only" ? "figures-only" : "needs-attention";
  const q = (typeof sp.q === "string" ? sp.q : "").trim().toLowerCase();
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : "1") || 1);

  const [{ drafts, released }, context] = await Promise.all([listDrafts(), contentContext()]);
  const inState = (s: DraftState) => drafts.filter((c) => c.status.state === s);
  const needsAttention = inState("needs-attention");
  const readyNow = needsAttention.filter((c) => releaseReadiness(c, context).ready).length;

  const matching = inState(state).filter((c) => !q || [c.id, c.code, c.name, c.officialName].some((v) => v.toLowerCase().includes(q)));
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const shown = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const href = (over: { state?: DraftState; page?: number }) => {
    const params = new URLSearchParams({ state: over.state ?? state });
    if (q) params.set("q", q);
    if ((over.page ?? 1) > 1) params.set("page", String(over.page));
    return `/admin/drafts?${params}`;
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">下書き</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
        公開ページのない企業です。ここは運営だけが見られます（ログインが必要で、検索エンジンにも出ません）。プレビューは、公開ページと同じ部品で描画しています。
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div><dt className="text-xs text-muted-foreground">公開済み</dt><dd className="figures text-2xl font-semibold">{released}</dd></div>
        <div><dt className="text-xs text-muted-foreground">要確認</dt><dd className="figures text-2xl font-semibold">{needsAttention.length}</dd></div>
        <div><dt className="text-xs text-muted-foreground">うち公開できる状態</dt><dd className="figures text-2xl font-semibold">{readyNow}</dd></div>
        <div><dt className="text-xs text-muted-foreground">数値のみ（解説なし）</dt><dd className="figures text-2xl font-semibold">{inState("figures-only").length}</dd></div>
      </dl>

      <details className="mt-6 rounded-md border border-border p-4 text-sm leading-7">
        <summary className="cursor-pointer font-semibold">公開の手順（1社ずつ、できたものから）</summary>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>下の一覧からプレビューを開き、読者に見える内容を確認します。「公開準備」に不足がないこと、出典が一次資料であることを確かめます。</li>
          <li>ローカルで <code className="text-xs">npm run dev</code> を起動し、<code className="text-xs">/admin/companies/&lt;企業ID&gt;/edit</code> で状態を「公開」にします（保存すると改訂記録が残ります）。</li>
          <li><code className="text-xs">npm run content:check</code> を通して、コミットして push します。サイトは push のたびに作り直され、公開済みの企業だけが読者に出ます。</li>
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">本番はコンテンツを書き込みません（JCE-016）。公開の判断と実行は、リポジトリへのコミットです。</p>
      </details>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="状態" className="flex gap-1 text-sm">
          {(["needs-attention", "figures-only"] as const).map((s) => (
            <Link key={s} href={href({ state: s })} aria-current={s === state ? "page" : undefined} className={`min-h-11 px-3 leading-[2.75rem] ${s === state ? "border-b-2 border-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
              {DRAFT_STATE_LABEL[s]}（{inState(s).length}）
            </Link>
          ))}
        </nav>
        <form action="/admin/drafts" className="flex gap-2">
          <input type="hidden" name="state" value={state} />
          <input name="q" defaultValue={q} placeholder="企業名・コード・ID" aria-label="企業を探す" className="min-h-11 rounded-md border border-border bg-background px-3 text-sm" />
          <button type="submit" className="min-h-11 rounded-md border border-border px-4 text-sm hover:border-foreground">探す</button>
        </form>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
              <th scope="col" className="py-2 pr-4 font-semibold">コード</th>
              <th scope="col" className="py-2 pr-4 font-semibold">企業</th>
              <th scope="col" className="py-2 pr-4 font-semibold">公開準備</th>
              <th scope="col" className="py-2 font-semibold">更新日</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((c) => {
              const readiness = releaseReadiness(c, context);
              const first = readiness.notes[0] ?? readiness.problems[0];
              return (
                <tr key={c.id} className="border-b border-border align-top">
                  <td className="figures py-3 pr-4">{c.code}</td>
                  <td className="py-3 pr-4">
                    <Link href={`/admin/drafts/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                    <span className="ml-2 font-mono text-xs text-muted-foreground">{c.id}</span>
                  </td>
                  <td className="py-3 pr-4">
                    {readiness.ready ? (
                      <span className="font-semibold">公開できる状態</span>
                    ) : (
                      <>
                        <span className="text-muted-foreground">未了 {readiness.problems.length + readiness.notes.length} 件</span>
                        {first && <span className="mt-1 line-clamp-2 block max-w-xl text-xs text-muted-foreground">{first}</span>}
                      </>
                    )}
                  </td>
                  <td className="figures py-3">{formatDateJa(c.updatedAt)}</td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-muted-foreground">該当する企業はありません。</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="ページ" className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href({ page: page - 1 })} className="link-ink">← 前へ</Link> : <span />}
          <span className="figures text-muted-foreground">{page} / {pages}（{matching.length}社）</span>
          {page < pages ? <Link href={href({ page: page + 1 })} className="link-ink">次へ →</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
