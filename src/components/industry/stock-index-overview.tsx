import Link from "next/link";
import { RELATIONSHIP_LABEL } from "@/components/company/related-companies";
import { SourceList } from "@/components/sources/source-list";
import { mapIndex } from "@/lib/stock-index";
import { formatDateJa } from "@/lib/utils/format";
import type { Company } from "@/types/company";
import type { StockIndex } from "@/types/stock-index";

/**
 * An index as a way into the companies: its constituents by industry, linked where the encyclopedia has a page,
 * and the ties between constituents that their entries state. No index level, weights or returns — the list is
 * used as a map of who is in it, not as market data (CLAUDE.md invariant 4).
 */
export function StockIndexOverview({ index, companies }: { index: StockIndex; companies: Company[] }) {
  const map = mapIndex(index, companies);

  return (
    <div>
      <p className="max-w-3xl text-[0.9375rem] leading-7">{index.description}</p>
      <p className="figures mt-2 text-xs text-muted-foreground">
        {index.publisher}の構成銘柄一覧（{formatDateJa(index.asOf)}時点）・{index.constituents.length}社のうち{map.covered}
        社をこの百科事典で解説しています
      </p>
      <SourceList sources={index.sources} sourceIds={index.sourceIds} />

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {map.groups.map((group) => (
          <li key={group.industryId ?? "none"} className="rounded-md border border-border bg-card p-4">
            <p className="flex items-baseline justify-between gap-3">
              {group.industryId ? (
                <Link href={`/industries/${group.industryId}`} className="font-serif text-lg font-semibold hover:underline">
                  {group.name}
                </Link>
              ) : (
                <span className="font-serif text-lg font-semibold text-muted-foreground">{group.name}</span>
              )}
              <span className="figures text-xs text-muted-foreground">{group.members.length}社</span>
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.members.map((member) => (
                <li key={member.code}>
                  {member.company ? (
                    <Link
                      href={`/companies/${member.company.id}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-foreground px-3 text-[0.8125rem] hover:bg-foreground hover:text-background"
                    >
                      {member.company.name}
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-9 items-center rounded-full border border-dashed border-border px-3 text-[0.8125rem] text-muted-foreground">
                      {member.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {map.ties.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">構成企業どうしのつながり</h3>
          <ul className="mt-3 divide-y divide-border border-y border-border text-sm">
            {map.ties.map((tie) => (
              <li key={`${tie.from.id}-${tie.to.id}-${tie.kind}`} className="flex flex-wrap items-center gap-x-2 py-2.5">
                <Link href={`/companies/${tie.from.id}`} className="link-ink">
                  {tie.from.name}
                </Link>
                <span className="text-xs text-muted-foreground">から見て「{RELATIONSHIP_LABEL[tie.kind]}」</span>
                <Link href={`/companies/${tie.to.id}`} className="link-ink">
                  {tie.to.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">関係の出典は、それぞれの企業のページにあります。</p>
        </div>
      )}
      <p className="mt-6 text-xs leading-5 text-muted-foreground">利用条件：{index.usageTerms}</p>
    </div>
  );
}
