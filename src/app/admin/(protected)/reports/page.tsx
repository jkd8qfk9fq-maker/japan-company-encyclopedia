import Link from "next/link";
import { companyRepository } from "@/lib/repositories";
import { getReportRepository } from "@/lib/reports";
import { REPORT_CATEGORY_LABEL, REPORT_STATUS_LABEL, REPORT_STATUSES, type ReportStatus } from "@/lib/reports/report-types";
import { updateReportStatus } from "../actions";

export const metadata = { title: "報告" };

const ACTIVE: ReportStatus[] = ["open", "investigating"];

export default async function AdminReports({ searchParams }: PageProps<"/admin/reports">) {
  const repository = getReportRepository();
  const showAll = (await searchParams).view === "all";

  if (!repository) {
    return (
      <div>
        <h1 className="font-serif text-3xl font-semibold">報告</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          報告の保存先（DATABASE_URL）が設定されていないため、報告を表示できません。読者の報告フォームも送信できない状態です。
        </p>
      </div>
    );
  }

  const [reports, companies] = await Promise.all([
    repository.list({ statuses: showAll ? undefined : ACTIVE }),
    companyRepository.listAll(),
  ]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">報告</h1>
        <nav aria-label="表示する報告" className="flex gap-4 text-sm">
          <Link href="/admin/reports" aria-current={!showAll ? "page" : undefined} className={!showAll ? "font-semibold" : "text-muted-foreground"}>
            対応中
          </Link>
          <Link href="/admin/reports?view=all" aria-current={showAll ? "page" : undefined} className={showAll ? "font-semibold" : "text-muted-foreground"}>
            すべて
          </Link>
        </nav>
      </div>

      {reports.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{showAll ? "報告はまだありません。" : "対応中の報告はありません。"}</p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {reports.map((report) => (
            <li key={report.id} className="grid gap-4 py-5 md:grid-cols-[1fr_12rem]">
              <div>
                <p className="figures text-xs text-muted-foreground">
                  {report.createdAt.slice(0, 16).replace("T", " ")} UTC · {REPORT_CATEGORY_LABEL[report.category]}
                  {report.companyId && (
                    <>
                      {" · "}
                      <Link href={`/companies/${report.companyId}`} className="hover:underline">
                        {companyName.get(report.companyId) ?? report.companyId}
                      </Link>
                    </>
                  )}
                </p>
                {/* Text, never HTML: a report is untrusted input from anyone. */}
                <p className="mt-2 line-clamp-4 text-sm leading-7 whitespace-pre-wrap">{report.message}</p>
                <Link href={`/admin/reports/${report.id}`} className="link-ink mt-1 inline-flex min-h-8 items-center text-xs">
                  詳細・出典の確認・メモ{report.adminNote && "（メモあり）"}
                </Link>
              </div>
              <form action={updateReportStatus} className="flex items-end gap-2">
                <input type="hidden" name="id" value={report.id} />
                <label className="flex-1 text-xs text-muted-foreground">
                  状態
                  <select
                    name="status"
                    defaultValue={report.status}
                    className="mt-1 h-11 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
                  >
                    {REPORT_STATUSES.map((status) => (
                      <option key={status} value={status}>{REPORT_STATUS_LABEL[status]}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="h-11 rounded-md border border-border px-3 text-sm hover:border-foreground">
                  更新
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
