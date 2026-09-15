import Link from "next/link";
import { companyRepository, revisionRepository } from "@/lib/repositories";
import { formatDateJa } from "@/lib/utils/format";

export const metadata = { title: "企業" };

export default async function AdminCompanies() {
  const [companies, revisions] = await Promise.all([companyRepository.list(), revisionRepository.list()]);
  const revisionCount = (id: string) => revisions.filter((r) => r.targetType === "company" && r.targetId === id).length;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">企業</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        各企業の数値と主張の根拠は <code className="text-xs">docs/research/&lt;企業ID&gt;.md</code> に記録されています。
      </p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground text-left text-xs text-muted-foreground">
              <th scope="col" className="py-2 pr-4 font-semibold">コード</th>
              <th scope="col" className="py-2 pr-4 font-semibold">企業</th>
              <th scope="col" className="py-2 pr-4 font-semibold">状態</th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">出典</th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">改訂</th>
              <th scope="col" className="py-2 font-semibold">更新日</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="figures py-3 pr-4">{c.code}</td>
                <td className="py-3 pr-4">
                  <Link href={`/admin/companies/${c.id}`} className="font-medium hover:underline">{c.name}</Link>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{c.id}</span>
                </td>
                <td className="py-3 pr-4">
                  {c.status.state === "published" ? (
                    <span className="text-muted-foreground">公開</span>
                  ) : (
                    <span className="font-medium">要確認（{c.status.notes.length}）</span>
                  )}
                </td>
                <td className="figures py-3 pr-4 text-right">{c.sources.length}</td>
                <td className="figures py-3 pr-4 text-right">{revisionCount(c.id)}</td>
                <td className="figures py-3">{formatDateJa(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
