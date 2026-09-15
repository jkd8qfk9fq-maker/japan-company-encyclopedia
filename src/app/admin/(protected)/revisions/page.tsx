import Link from "next/link";
import { companyRepository, featureRepository, industryRepository } from "@/lib/repositories";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { formatDateJa } from "@/lib/utils/format";
import type { RevisionKind } from "@/types/revision";

export const metadata = { title: "改訂履歴" };

const KIND_LABEL: Record<RevisionKind, string> = {
  "ai-generated": "AI作成",
  correction: "訂正",
  update: "更新",
};

export default async function AdminRevisions() {
  const [companies, industries, features] = await Promise.all([
    companyRepository.list(),
    industryRepository.list(),
    featureRepository.list(),
  ]);

  const rows = [
    ...companies.flatMap((c) => c.revisions.map((r) => ({ ...r, name: c.name, href: `/companies/${c.id}` }))),
    ...industries.flatMap((i) =>
      i.revisions.map((r) => ({ ...r, name: `${INDUSTRY_LABELS[i.id].name}業界`, href: `/industries/${i.id}` })),
    ),
    ...features.flatMap((f) => f.revisions.map((r) => ({ ...r, name: f.title, href: `/features/${f.id}` }))),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">改訂履歴</h1>
      <ol className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((row, i) => (
          <li key={`${row.href}-${row.date}-${i}`} className="grid gap-1 py-4 text-sm md:grid-cols-[8rem_6rem_12rem_1fr] md:gap-4">
            <span className="figures text-muted-foreground">{formatDateJa(row.date)}</span>
            <span>{KIND_LABEL[row.kind]}</span>
            <Link href={row.href} className="font-medium hover:underline">{row.name}</Link>
            <span className="leading-6 text-muted-foreground">{row.summary}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
