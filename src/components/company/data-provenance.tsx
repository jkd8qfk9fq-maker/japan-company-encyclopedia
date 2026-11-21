import Link from "next/link";
import type { ReportMetric } from "@/lib/report-metrics";
import { formatDateJa } from "@/lib/utils/format";
import type { Company } from "@/types/company";
import type { Revision } from "@/types/revision";

/**
 * The provenance of the report's figures (JCE-083): how a reader can check what this page rests on. The
 * block names only what the entry itself holds — the period the figures cover, the sources behind them with
 * the day this encyclopedia read each one and its EDINET document id, the formulas of the computed layer,
 * and the corrections recorded for this company. A field the data does not hold is not shown and never
 * filled in: there is no per-figure "retrieved at" timestamp in the entries, so none is printed here.
 * Corrections are the revisions whose id marks them as one — the same rule the updates feed uses (JCE-052).
 */

const CORRECTION_ID = /-correct(ed|ion)(-\d+)?$/;

export function DataProvenance({ company, metrics, revisions }: { company: Company; metrics: ReportMetric[]; revisions: Revision[] }) {
  const records = [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  if (records.length === 0) return null;
  const first = records[0]!;
  const latest = records.at(-1)!;

  const figureSourceIds = [...new Set(records.flatMap((r) => r.sourceIds))];
  const figureSources = figureSourceIds.map((id) => company.sources.find((s) => s.id === id)).filter((s) => s !== undefined);
  const corrections = revisions
    .filter((r) => r.targetType === "company" && r.targetId === company.id && CORRECTION_ID.test(r.id))
    .sort((a, b) => b.changedAt.localeCompare(a.changedAt));

  return (
    <section aria-label="このデータの確かめ方" className="mt-12 border-t border-border pt-8 print:hidden">
      <h2 className="font-serif text-lg font-semibold">このデータの確かめ方</h2>
      <p className="prose-ja mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        このレポートの数字は、有価証券報告書に印字された値をそのまま載せたものと、その印字値から計算した値（計算値）だけです。
        数字の出どころは、以下の出典で確かめられます。百科事典全体の編集方針は
        <Link href="/about#data-heading" className="underline underline-offset-2 hover:text-foreground">データの出典と加工について</Link>
        にあります。
      </p>

      <dl className="mt-5 grid gap-6 text-sm leading-6 md:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">対象期間</dt>
          <dd className="figures mt-1.5">
            {first.fiscalYear}から{latest.fiscalYear}まで、{records.length}期分の有価証券報告書の「主要な経営指標等の推移」です（最新期の期末は{formatDateJa(latest.periodEnd)}）。
          </dd>
        </div>

        {metrics.length > 0 && (
          <div>
            <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">計算値の定義</dt>
            <dd className="mt-1.5">
              <ul className="grid gap-1">
                {metrics.map((m) => (
                  <li key={m.key} className="figures">
                    {m.title}：{m.formula}（{m.fiscalYear}）
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>

      {figureSources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">数字の出典と確認日</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6">
            {figureSources.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-2 hover:text-foreground">
                  {s.title}
                </a>
                <span className="text-muted-foreground">
                  （{s.publisher}
                  {s.publishedAt && ` ・ 公表 ${formatDateJa(s.publishedAt)}`}
                  {s.docId && ` ・ EDINET文書ID ${s.docId}`}）
                </span>
                <span className="block text-xs text-muted-foreground">この百科事典が原資料を確認した日：{formatDateJa(s.accessedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {corrections.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">修正履歴</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-6">
            {corrections.map((r) => (
              <li key={r.id} className="figures">
                {formatDateJa(r.changedAt.slice(0, 10))}：{r.summary}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">掲載内容を訂正したときの記録です。訂正は上書きで消さず、事実と内容をここに残します。</p>
        </div>
      )}
    </section>
  );
}
