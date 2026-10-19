import { ExternalLink } from "lucide-react";
import { formatDateJa } from "@/lib/utils/format";
import type { Business, Company } from "@/types/company";

function businessSourceIds(businesses: Business[]): string[] {
  return businesses.flatMap((b) => [...b.sourceIds, ...businessSourceIds(b.children ?? [])]);
}

/**
 * Every source on the page in one place, each with the sections that rest on it. The per-section "出典を見る"
 * stays where it is; this answers the other question — "what is this page built from?" — without opening seven
 * of them. Section names are derived from the entry's own `sourceIds`, so the list cannot claim a use the data
 * does not record.
 */
export function SourceIndex({ company, hasInbound }: { company: Company; hasInbound: boolean }) {
  if (company.sources.length === 0) return null;

  const uses: [string, string[]][] = [
    ["事業", businessSourceIds(company.businesses)],
    ["ビジネスモデル", company.businessModel?.sourceIds ?? []],
    ["財務", company.financials.flatMap((r) => r.sourceIds)],
    ["歴史", company.history.flatMap((e) => e.sourceIds)],
    ["つながり", company.relatedCompanies.flatMap((r) => r.sourceIds)],
  ];
  const usedIn = (id: string) => uses.filter(([, ids]) => ids.includes(id)).map(([section]) => section);

  return (
    <div>
      <ol className="space-y-5">
        {company.sources.map((source, i) => {
          const sections = usedIn(source.id);
          return (
            <li key={source.id} className="grid grid-cols-[2rem_1fr] gap-x-2">
              <span className="figures pt-0.5 text-sm text-muted-foreground">[{i + 1}]</span>
              <div>
                <p className="leading-7 font-medium">{source.title}</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  {source.publisher}
                  {source.publishedAt && <> · {formatDateJa(source.publishedAt)}</>}
                  {" · "}最終確認 {formatDateJa(source.accessedAt)}
                </p>
                {sections.length > 0 && (
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">使われている項目：{sections.join("・")}</p>
                )}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-ink mt-1 inline-flex min-h-8 items-center gap-1 text-xs break-all"
                >
                  原文を開く
                  <ExternalLink className="size-3" aria-hidden />
                  <span className="sr-only">（新しいタブで開きます）</span>
                </a>
              </div>
            </li>
          );
        })}
      </ol>
      {hasInbound && (
        <p className="mt-8 text-xs leading-5 text-muted-foreground">
          「ほかの企業の項目に書かれた関係」の出典は、その企業の項目の出典です（関係の一覧の各項目から開けます）。
        </p>
      )}
    </div>
  );
}
