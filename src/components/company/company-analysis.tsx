import Link from "next/link";
import { companyAnalysis, type AnalysisRow } from "@/lib/company-analysis";
import { formatIndicatorValue, indicatorsForIndustry, observationPeriodLabel } from "@/lib/indicators";
import { formatYen } from "@/lib/utils/format";
import type { Company } from "@/types/company";
import { AnalysisGate } from "./analysis-gate";

/**
 * The five-perspective analysis on the report page (JCE-078, Phase 1–2). The free part — each
 * perspective's own values with the industry median — is rendered for every reader; the full
 * distributions, the printed trends, the segment composition and the linked economic indicators
 * sit behind the analysis layer's own gate (see analysis-gate.tsx). Nothing here is a score or a
 * verdict: positions are shown per perspective, never combined (spec §7).
 */

const percent = (v: number) => `${(v * 100).toFixed(1).replace("-", "−")}%`;
const percentChange = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%`;
const times = (v: number) => `${v.toFixed(2)}倍`;

function formatValue(row: AnalysisRow, value: number): string {
  switch (row.unit) {
    case "percent":
      return percent(value);
    case "percent-change":
      return percentChange(value);
    case "times":
      return times(value);
    case "yen-per-person":
    case "yen":
      return formatYen(value);
    case "people":
      return `${value.toLocaleString("ja-JP")}人`;
  }
}

function RowTitle({ row }: { row: AnalysisRow }) {
  return (
    <>
      <span className="whitespace-nowrap">{row.title}</span>
      <span className="ml-2 rounded-sm border border-border px-1 py-0.5 text-[0.65rem] whitespace-nowrap text-muted-foreground">
        {row.kind === "computed" ? "計算値" : "印字値"}
      </span>
      <span className="block text-xs text-muted-foreground">
        {row.formula}（{row.fiscalYear}）
      </span>
      {row.note && <span className="block text-xs text-muted-foreground">{row.note}</span>}
    </>
  );
}

function FreeTable({ rows }: { rows: AnalysisRow[] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-foreground/40 text-left">
            <th scope="col" className="sticky left-0 bg-background py-2 pr-3 font-medium whitespace-nowrap">指標</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">自社</th>
            <th scope="col" className="py-2 text-right font-medium whitespace-nowrap">業界の中央値</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-border/70 align-top">
              <th scope="row" className="sticky left-0 max-w-[13rem] bg-background py-2 pr-3 text-left font-normal">
                <RowTitle row={row} />
              </th>
              <td className="figures py-2 pr-3 text-right font-medium whitespace-nowrap">{formatValue(row, row.value)}</td>
              <td className="figures py-2 text-right whitespace-nowrap">{row.industry ? formatValue(row, row.industry.median) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetailTable({ rows }: { rows: AnalysisRow[] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-foreground/40 text-left">
            <th scope="col" className="sticky left-0 bg-background py-2 pr-3 font-medium whitespace-nowrap">指標</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">自社</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">業界の中央値</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">四分位（第1〜第3）</th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap">順位</th>
            <th scope="col" className="py-2 text-right font-medium whitespace-nowrap">パーセンタイル</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-border/70 align-top">
              <th scope="row" className="sticky left-0 max-w-[13rem] bg-background py-2 pr-3 text-left font-normal">
                <RowTitle row={row} />
              </th>
              <td className="figures py-2 pr-3 text-right font-medium whitespace-nowrap">{formatValue(row, row.value)}</td>
              <td className="figures py-2 pr-3 text-right whitespace-nowrap">{row.industry ? formatValue(row, row.industry.median) : "—"}</td>
              <td className="figures py-2 pr-3 text-right whitespace-nowrap">
                {row.industry ? `${formatValue(row, row.industry.q1)} 〜 ${formatValue(row, row.industry.q3)}` : "—"}
              </td>
              <td className="figures py-2 pr-3 text-right whitespace-nowrap">
                {row.industry ? `${row.industry.rank}位 / ${row.industry.members}社` : "—"}
              </td>
              <td className="figures py-2 text-right whitespace-nowrap">{row.industry ? row.industry.percentile : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompanyAnalysisSection({ company, companies }: { company: Company; companies: Company[] }) {
  const analysis = companyAnalysis(company, companies);
  if (analysis.perspectives.length === 0) return null;

  const businessNames = new Map<string, string>();
  const collect = (bs: Company["businesses"]) => bs.forEach((b) => {
    businessNames.set(b.id, b.shortName ?? b.name);
    if (b.children) collect(b.children);
  });
  collect(company.businesses);

  const segmentTotal = company.segmentRevenue?.items.reduce((acc, i) => acc + i.amount, 0) ?? 0;
  const linkedIndicators = analysis.industryId ? indicatorsForIndustry(analysis.industryId) : [];

  return (
    <section className="mt-12">
      <h2 className="font-serif text-xl font-semibold">分析（5観点）</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        この会社の数字を、規模と地位・成長・収益性・財務の安定・外部環境との接続の5観点で読みます。印字値は有価証券報告書のとおり、計算値には計算式を併記します。業界の分布は主たる産業が同じ掲載企業
        {analysis.industryName && `（${analysis.industryName}）`}
        {analysis.industryMembers > 0
          ? `${analysis.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${analysis.comparableMembers}社から作り、分布を示せる会社が5社に満たない指標では中央値も出しません`
          : "から作ります"}
        。観点ごとに位置を示すもので、5観点を合成したスコアや格付けは作りません。
      </p>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        無料で見られるのは各観点の要点（自社の値と業界の中央値）までです。分布の全体像・推移・経済指標との接続は分析レイヤーの範囲です。
      </p>

      <div className="mt-8 space-y-10">
        {analysis.perspectives.map((p) => (
          <div key={p.id}>
            <h3 className="font-serif text-lg font-semibold">{p.title}</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{p.intro}</p>
            <FreeTable rows={p.rows} />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <AnalysisGate>
          <div className="space-y-10">
            {analysis.perspectives.map((p) => (
              <div key={p.id}>
                <h3 className="font-serif text-lg font-semibold">{p.title} — 分布の全体像</h3>
                <DetailTable rows={p.rows} />
                {p.series && (
                  <div className="mt-5">
                    <h4 className="font-serif text-base font-semibold">{p.series.title}</h4>
                    <div className="mt-2 overflow-x-auto">
                      <table className="border-collapse text-sm">
                        <tbody>
                          <tr className="border-b border-border/70">
                            <th scope="row" className="py-1.5 pr-3 text-left font-normal whitespace-nowrap">期</th>
                            {p.series.points.map((pt) => (
                              <td key={pt.periodEnd} className="figures py-1.5 pr-3 text-right whitespace-nowrap">{pt.fiscalYear}</td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/70">
                            <th scope="row" className="py-1.5 pr-3 text-left font-normal whitespace-nowrap">金額</th>
                            {p.series.points.map((pt) => (
                              <td key={pt.periodEnd} className="figures py-1.5 pr-3 text-right whitespace-nowrap">{formatYen(pt.value)}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {p.id === "environment" && company.segmentRevenue && segmentTotal > 0 && (
                  <div className="mt-5">
                    <h4 className="font-serif text-base font-semibold">事業別の構成（{company.segmentRevenue.fiscalYear}）</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {company.segmentRevenue.label}の内訳は有価証券報告書の印字値、割合は計算値です。
                    </p>
                    <table className="mt-2 w-full max-w-xl border-collapse text-sm">
                      <tbody>
                        {[...company.segmentRevenue.items]
                          .sort((a, b) => b.amount - a.amount)
                          .map((i) => (
                            <tr key={i.businessId} className="border-b border-border/70">
                              <td className="py-1.5 pr-3">{businessNames.get(i.businessId) ?? i.businessId}</td>
                              <td className="figures py-1.5 pr-3 text-right whitespace-nowrap">{formatYen(i.amount)}</td>
                              <td className="figures py-1.5 text-right whitespace-nowrap text-muted-foreground">
                                {((i.amount / segmentTotal) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {p.id === "environment" && linkedIndicators.length > 0 && (
                  <div className="mt-5">
                    <h4 className="font-serif text-base font-semibold">関連する経済指標</h4>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                      この業界に対応づけた公的統計です。環境の提示であり、この会社の業績との因果を示すものではありません。
                    </p>
                    <ul className="mt-2 space-y-3">
                      {linkedIndicators.map(({ indicator, note }) => {
                        const latest = indicator.observations.at(-1);
                        return (
                          <li key={indicator.id} className="text-sm leading-6">
                            <Link href={`/indicators/${indicator.id}`} className="font-medium underline underline-offset-4">
                              {indicator.name}
                            </Link>
                            {latest && (
                              <span className="figures ml-2 whitespace-nowrap">
                                {observationPeriodLabel(indicator, latest.date)}: {formatIndicatorValue(indicator, latest.value)}
                                {indicator.unit}
                              </span>
                            )}
                            <span className="block text-muted-foreground">{note}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnalysisGate>
      </div>
    </section>
  );
}
