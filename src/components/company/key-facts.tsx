import { formatDateJa, formatYen } from "@/lib/utils/format";
import type { FinancialRecord } from "@/types/company";
import type { Source } from "@/types/source";

/**
 * The company's size at a glance, under the 3-second layer: the latest year's revenue, net income and headcount,
 * each with the filing's own label. Only what the latest record carries is shown — a null is left out rather than
 * drawn as a dash, because a row of dashes reads as a broken page, not as "the filing does not print this".
 * Size, not performance: no growth rate, no margin, nothing to rank companies by (CLAUDE.md invariant 4).
 *
 * JCE-094: under the figures sits the provenance badge — the filing these figures rest on, by its own title,
 * with the date it was last checked — linked to that source's entry in the page's 出典一覧. One badge, here at
 * the first figures a reader meets, instead of a folded "出典を見る" under every block down the page.
 */
export function KeyFacts({ records, sources }: { records: FinancialRecord[]; sources: Source[] }) {
  const latest = [...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
  if (!latest) return null;

  const facts = [
    latest.revenue !== null && {
      label: latest.revenueBasis ? `${latest.revenueLabel}（${latest.revenueBasis}）` : latest.revenueLabel,
      value: formatYen(latest.revenue),
    },
    latest.netIncome !== null && { label: latest.netIncomeLabel, value: formatYen(latest.netIncome) },
    latest.employees !== null && { label: "従業員数（連結）", value: `${latest.employees.toLocaleString("ja-JP")}人` },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));
  if (facts.length === 0) return null;

  const badgeSources = latest.sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is Source => s !== undefined);
  const lastAccessed = badgeSources.map((s) => s.accessedAt).sort().at(-1);

  return (
    <div>
      {/* Side by side at every width — on a phone too, where stacking three figures cost a screen of scrolling. */}
      <dl className="grid grid-cols-3 border-y border-border border-t-foreground">
        {facts.map((fact, i) => (
          <div key={fact.label} className={i > 0 ? "border-l border-border py-3 pl-3 sm:py-5 sm:pl-6" : "py-3 pr-3 sm:py-5 sm:pr-6"}>
            <dt className="line-clamp-2 text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{fact.label}</dt>
            <dd className="figures mt-1 font-serif text-[1rem] leading-tight font-semibold sm:mt-1.5 sm:text-[1.625rem] md:text-[1.875rem]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <p className="figures">{latest.fiscalYear}・連結</p>
        {badgeSources.length > 0 && (
          <p className="flex flex-wrap items-center gap-1.5">
            <span>出典</span>
            {badgeSources.map((source) => (
              <a
                key={source.id}
                href={`#source-${source.id}`}
                className="rounded-full border border-border px-2 py-0.5 leading-5 transition-colors hover:border-foreground hover:text-foreground"
              >
                <span className="figures">[{sources.indexOf(source) + 1}]</span> {source.title}
              </a>
            ))}
            {lastAccessed && <span className="figures">最終確認 {formatDateJa(lastAccessed)}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
