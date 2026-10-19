import { SourceList } from "@/components/sources/source-list";
import { formatYen } from "@/lib/utils/format";
import type { FinancialRecord } from "@/types/company";
import type { Source } from "@/types/source";

/**
 * The company's size at a glance, under the 3-second layer: the latest year's revenue, net income and headcount,
 * each with the filing's own label. Only what the latest record carries is shown — a null is left out rather than
 * drawn as a dash, because a row of dashes reads as a broken page, not as "the filing does not print this".
 * Size, not performance: no growth rate, no margin, nothing to rank companies by (CLAUDE.md invariant 4).
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

  return (
    <div>
      <dl className="grid grid-cols-1 border-y border-border border-t-foreground sm:grid-cols-3">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={i > 0 ? "border-t border-border py-4 sm:border-t-0 sm:border-l sm:py-5 sm:pl-6" : "py-4 sm:py-5 sm:pr-6"}
          >
            <dt className="text-xs leading-5 text-muted-foreground">{fact.label}</dt>
            <dd className="figures mt-1.5 font-serif text-[1.625rem] leading-tight font-semibold md:text-[1.875rem]">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-x-4 text-xs text-muted-foreground">
        <p className="figures">{latest.fiscalYear}・連結</p>
        <SourceList sources={sources} sourceIds={latest.sourceIds} />
      </div>
    </div>
  );
}
