import Link from "next/link";
import { notFound } from "next/navigation";
import { localEditingStatus } from "@/lib/content/content-store";
import { companyRepository, revisionRepository } from "@/lib/repositories";
import { getReportRepository } from "@/lib/reports";
import { REPORT_CATEGORY_LABEL, REPORT_STATUS_LABEL } from "@/lib/reports/report-types";
import { formatDateJa } from "@/lib/utils/format";

export const metadata = { title: "企業の詳細" };

/**
 * Read-only in every environment: the company's sources (to verify a report
 * against), its reports, and its revision history. Editing is a link to the
 * local editor — shown only where editing is possible.
 */
export default async function AdminCompany({ params }: PageProps<"/admin/companies/[company-id]">) {
  const id = (await params)["company-id"];
  const company = await companyRepository.get(id);
  if (!company) notFound();
  const reports = getReportRepository();
  const [revisions, companyReports] = await Promise.all([
    revisionRepository.listForTarget("company", id),
    reports ? reports.list().then((all) => all.filter((r) => r.companyId === id)) : Promise.resolve(null),
  ]);
  const editable = localEditingStatus().enabled;

  return (
    <div className="space-y-12">
      <div>
        <Link href="/admin/companies" className="text-sm text-muted-foreground hover:text-foreground">← 企業</Link>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-serif text-3xl font-semibold">{company.name}</h1>
          <div className="flex gap-4 text-sm">
            <Link href={`/companies/${id}`} className="link-ink">公開ページ</Link>
            {editable ? (
              <Link href={`/admin/companies/${id}/edit`} className="link-ink font-semibold">編集する（ローカル）</Link>
            ) : (
              <span className="text-muted-foreground">編集はローカル環境で行います</span>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          最終更新 {formatDateJa(company.updatedAt)} ・ 状態 {company.status.state === "published" ? "公開" : "要確認"}
        </p>
        {company.status.state === "needs-attention" && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{company.status.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        )}
      </div>

      <section aria-labelledby="company-reports">
        <h2 id="company-reports" className="text-lg font-semibold">この企業への報告</h2>
        {companyReports === null ? (
          <p className="mt-2 text-sm text-muted-foreground">報告の保存先が設定されていません。</p>
        ) : companyReports.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">報告はありません。</p>
        ) : (
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {companyReports.map((r) => (
              <li key={r.id} className="py-3 text-sm">
                <Link href={`/admin/reports/${r.id}`} className="hover:underline">
                  <span className="text-xs text-muted-foreground">{r.createdAt.slice(0, 10)} · {REPORT_CATEGORY_LABEL[r.category]} · {REPORT_STATUS_LABEL[r.status]}</span>
                  <span className="mt-1 line-clamp-2 block">{r.message}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="company-sources">
        <h2 id="company-sources" className="text-lg font-semibold">出典（{company.sources.length}件）</h2>
        <ol className="mt-3 divide-y divide-border border-y border-border">
          {company.sources.map((s) => (
            <li key={s.id} className="grid gap-1 py-3 text-sm md:grid-cols-[1fr_auto] md:gap-4">
              <span>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-ink">{s.title}</a>
                <span className="block text-xs text-muted-foreground">{s.publisher}{s.publishedAt && ` · ${s.publishedAt}`} · 確認 {s.accessedAt} · <span className="font-mono">{s.id}</span></span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted-foreground">各数値・記述の根拠となるページは docs/research/{id}.md に記録されています。</p>
      </section>

      <section aria-labelledby="company-revisions">
        <h2 id="company-revisions" className="text-lg font-semibold">改訂履歴</h2>
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
    </div>
  );
}
