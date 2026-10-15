import Link from "next/link";
import { notFound } from "next/navigation";
import { localEditingStatus } from "@/lib/content/content-store";
import { companyRepository, revisionRepository } from "@/lib/repositories";
import { getReportRepository } from "@/lib/reports";
import {
  MAX_ADMIN_NOTE_LENGTH,
  REPORT_CATEGORY_LABEL,
  REPORT_STATUS_LABEL,
  REPORT_STATUSES,
} from "@/lib/reports/report-types";
import { updateReportNote, updateReportStatus } from "../../actions";

export const metadata = { title: "報告の詳細" };

/**
 * One report, with what is needed to check it: the target's sources (open the
 * originals), its revision history, a place to write correction notes, and —
 * locally — the way into the editor. The report and any revision stay
 * separate records; the note is where the link between them is written down.
 */
export default async function AdminReport({ params }: PageProps<"/admin/reports/[report-id]">) {
  const repository = getReportRepository();
  if (!repository) notFound();
  const report = await repository.get((await params)["report-id"]);
  if (!report) notFound();

  const company = report.companyId ? await companyRepository.getAny(report.companyId) : null;
  const revisions = company ? await revisionRepository.listForTarget("company", company.id) : [];
  const editable = localEditingStatus().enabled;

  return (
    <article className="space-y-10">
      <div>
        <Link href="/admin/reports" className="text-sm text-muted-foreground hover:text-foreground">← 報告</Link>
        <p className="mt-4 text-xs text-muted-foreground">
          {report.createdAt.slice(0, 16).replace("T", " ")} UTC · {REPORT_CATEGORY_LABEL[report.category]}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold">{company ? `${company.name}への報告` : "報告"}</h1>
        {/* Text, never HTML: a report is untrusted input from anyone. */}
        <p className="mt-4 rounded-md border border-border p-4 text-sm leading-7 whitespace-pre-wrap">{report.message}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={updateReportStatus} className="rounded-md border border-border p-4">
          <input type="hidden" name="id" value={report.id} />
          <label className="block text-sm font-semibold">
            状態
            <select name="status" defaultValue={report.status} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-2 text-sm font-normal">
              {REPORT_STATUSES.map((s) => (
                <option key={s} value={s}>{REPORT_STATUS_LABEL[s]}</option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            解決済みにするのは、訂正をコミット・プッシュしてデプロイで公開した後です。誤りでなかった場合は「対応不要」にし、理由をメモに残します。
          </p>
          <button type="submit" className="mt-3 h-11 rounded-md border border-border px-4 text-sm hover:border-foreground">状態を更新</button>
        </form>

        <form action={updateReportNote} className="rounded-md border border-border p-4">
          <input type="hidden" name="id" value={report.id} />
          <label className="block text-sm font-semibold">
            訂正メモ
            <textarea
              name="note"
              defaultValue={report.adminNote ?? ""}
              maxLength={MAX_ADMIN_NOTE_LENGTH}
              rows={5}
              placeholder="確認した出典とページ、判断、行った訂正（改訂IDやコミット）など"
              className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm leading-6 font-normal"
            />
          </label>
          <button type="submit" className="mt-2 h-11 rounded-md border border-border px-4 text-sm hover:border-foreground">メモを保存</button>
        </form>
      </div>

      {company && (
        <>
          <section aria-labelledby="report-sources">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="report-sources" className="text-lg font-semibold">出典で確認する</h2>
              <span className="flex gap-4 text-sm">
                <Link href={`/companies/${company.id}`} className="link-ink">公開ページ</Link>
                {editable ? (
                  <Link href={`/admin/companies/${company.id}/edit`} className="link-ink font-semibold">訂正する（ローカル）</Link>
                ) : (
                  <span className="text-muted-foreground">訂正はローカル環境で行います</span>
                )}
              </span>
            </div>
            <ol className="mt-3 divide-y divide-border border-y border-border">
              {company.sources.map((s) => (
                <li key={s.id} className="py-3 text-sm">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-ink">{s.title}</a>
                  <span className="block text-xs text-muted-foreground">{s.publisher} · 確認 {s.accessedAt}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">数値や記述ごとの根拠ページは docs/research/{company.id}.md にあります。</p>
          </section>

          <section aria-labelledby="report-revisions">
            <h2 id="report-revisions" className="text-lg font-semibold">この企業の改訂履歴</h2>
            <ol className="mt-3 divide-y divide-border border-y border-border">
              {revisions.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/revisions/${r.id}`} className="grid gap-1 py-3 text-sm hover:bg-muted/50 md:grid-cols-[10rem_1fr]">
                    <span className="figures text-muted-foreground">{r.changedAt.slice(0, 16).replace("T", " ")}</span>
                    <span>{r.summary}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </article>
  );
}
