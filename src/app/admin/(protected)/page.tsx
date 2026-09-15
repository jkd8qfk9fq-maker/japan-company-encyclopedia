import Link from "next/link";
import { companyRepository } from "@/lib/repositories";
import { getReportRepository } from "@/lib/reports";
import { formatDateJa } from "@/lib/utils/format";

export default async function AdminDashboard() {
  const companies = await companyRepository.list();
  const reports = getReportRepository();
  const activeReports = reports ? await reports.count({ statuses: ["open", "investigating"] }) : null;
  const attention = companies.filter((c) => c.status.state === "needs-attention");
  const recent = [...companies].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 8);

  const stats = [
    { label: "掲載企業", value: <>{companies.length}</>, href: "/admin/companies" },
    { label: "要確認", value: <>{attention.length}</>, href: "/admin/companies" },
    { label: "対応中の報告", value: <>{activeReports ?? "—"}</>, href: "/admin/reports" },
  ];

  return (
    <div className="space-y-14">
      <h1 className="font-serif text-3xl font-semibold">ダッシュボード</h1>

      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-md border border-border p-5 hover:border-foreground">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="figures mt-1 text-3xl font-semibold">{s.value}</dd>
          </Link>
        ))}
      </dl>

      <section aria-labelledby="needs-attention">
        <h2 id="needs-attention" className="text-lg font-semibold">要確認</h2>
        {attention.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">要確認の項目はありません。</p>
        ) : (
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {attention.map((c) => (
              <li key={c.id} className="py-4">
                <Link href={`/companies/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                {c.status.state === "needs-attention" && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                    {c.status.notes.map((note) => <li key={note}>{note}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="recently-updated">
        <h2 id="recently-updated" className="text-lg font-semibold">最近の更新</h2>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {recent.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <Link href={`/companies/${c.id}`} className="hover:underline">{c.name}</Link>
              <span className="figures text-muted-foreground">{formatDateJa(c.updatedAt)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
