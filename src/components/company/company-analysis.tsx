import Link from "next/link";
import { formatAnalysisValue } from "@/lib/analysis-format";
import { companyAnalysis, type AnalysisRow, type CompanyAnalysis } from "@/lib/company-analysis";
import { formatIndicatorValue, indicatorsForIndustry, observationPeriodLabel } from "@/lib/indicators";
import { MEANING_QUESTIONS, meaningQuestions, meaningSummary, type MeaningSentence } from "@/lib/meaning-layer";
import { formatYen } from "@/lib/utils/format";
import type { Company } from "@/types/company";
import { AnalysisGate, MeaningGate } from "./analysis-gate";
import { T } from "@/components/i18n/t";
import { F } from "@/components/i18n/figure";
import { L } from "@/components/i18n/label";

/**
 * The five-perspective analysis on the report page (JCE-078, Phase 1–2). The free part — each
 * perspective's own values with the industry median, and the questions of 「この会社の今」 — is
 * rendered for every reader; the meaning layer's answers, the full distributions, the printed
 * trends, the segment composition and the linked economic indicators sit behind the analysis
 * layer's own gate (see analysis-gate.tsx). Nothing here is a score or a verdict: positions are
 * shown per perspective, never combined (spec §7).
 */

const formatValue = formatAnalysisValue;

function RowTitle({ row }: { row: AnalysisRow }) {
  return (
    <>
      <span className="whitespace-nowrap"><L s={row.title} /></span>
      <span className="ml-2 rounded-sm border border-border px-1 py-0.5 text-[0.65rem] whitespace-nowrap text-muted-foreground">
        {row.kind === "computed" ? <T m={{ ja: "計算値", en: "Computed" }} /> : row.kind === "estimated" ? "推計値" : "印字値"}
      </span>
      <span className="block text-xs text-muted-foreground">
        <L s={row.formula} />（<F s={row.fiscalYear} />）
      </span>
      {row.note && <span className="block text-xs text-muted-foreground"><L s={row.note} /></span>}
    </>
  );
}

function FreeTable({ rows }: { rows: AnalysisRow[] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-foreground/40 text-left">
            <th scope="col" className="sticky left-0 bg-background py-2 pr-3 font-medium whitespace-nowrap"><T m={{ ja: "指標", en: "Metric" }} /></th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "自社", en: "Company" }} /></th>
            <th scope="col" className="py-2 text-right font-medium whitespace-nowrap"><T m={{ ja: "業界の中央値", en: "Industry median" }} /></th>
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
            <th scope="col" className="sticky left-0 bg-background py-2 pr-3 font-medium whitespace-nowrap"><T m={{ ja: "指標", en: "Metric" }} /></th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "自社", en: "Company" }} /></th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "業界の中央値", en: "Industry median" }} /></th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "四分位（第1〜第3）", en: "Quartiles (1st–3rd)" }} /></th>
            <th scope="col" className="py-2 pr-3 text-right font-medium whitespace-nowrap"><T m={{ ja: "順位", en: "Rank" }} /></th>
            <th scope="col" className="py-2 text-right font-medium whitespace-nowrap"><T m={{ ja: "パーセンタイル", en: "Percentile" }} /></th>
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

/**
 * The free entrance to 「この会社の今」 (JCE-120): the heading and the questions this company's summary
 * answers — no sentence, no figure. The answers themselves are the analysis layer's core and render
 * inside MeaningGate for an entitled reader.
 */
export function MeaningEntrance({ sentences }: { sentences: MeaningSentence[] }) {
  const questions = meaningQuestions(sentences);
  return (
    <div className="mt-6 rounded-md border border-border p-4 sm:p-5">
      <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "この会社の今", en: "This Company Now" }} /></h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "下の分析の数字を、3つの問いに答える文章に組み立てた要約です。文中の数字は下の表と同じ値で、良い・悪いの判断は含みません。答えは分析レイヤーの範囲で、有効な購入コードで開きます。", en: "A summary that turns the figures in the analysis below into text answering three questions. The figures in the text match the table below, and it contains no judgment of good or bad. The answers are part of the analysis layer and open with a valid purchase code." }} />
      </p>
      <ul className="mt-4 space-y-2">
        {questions.map((q) => (
          <li key={q} className="text-xs font-semibold tracking-wide text-muted-foreground">
            {MEANING_QUESTIONS[q]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MeaningBlock({ sentences }: { sentences: MeaningSentence[] }) {
  const questions = meaningQuestions(sentences);
  return (
    <div className="mt-6 rounded-md border border-border p-4 sm:p-5">
      <h3 className="font-serif text-lg font-semibold"><T m={{ ja: "この会社の今", en: "This Company Now" }} /></h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "下の分析の数字を読む順に並べた要約です。文中の数字は下の表と同じ値で、良い・悪いの判断は含みません。", en: "A summary that lays out the figures in the analysis below in reading order. The figures in the text match the table below, and it contains no judgment of good or bad." }} />
      </p>
      <div className="mt-4 space-y-4">
        {questions.map((q) => (
          <div key={q}>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">{MEANING_QUESTIONS[q]}</p>
            <ul className="mt-1.5 space-y-2.5">
              {sentences
                .filter((s) => s.question === q)
                .map((s) => (
                  <li key={s.id} className="text-[0.95rem] leading-7">
                    {s.parts.map((p, i) =>
                      typeof p === "string" || "label" in p ? (
                        <span key={i}>{typeof p === "string" ? p : p.label}</span>
                      ) : (
                        <span key={i} className="figures font-semibold whitespace-nowrap">
                          <L s={p.text} />
                        </span>
                      ),
                    )}
                    <span className="block text-xs text-muted-foreground">
                      <span data-l="ja">根拠：「<L s={s.groupTitle} />」（<F s={s.fiscalYear} />・{s.kind === "printed" ? <T m={{ ja: "印字値", en: "Printed value" }} /> : <T m={{ ja: "計算値", en: "Computed" }} />}）
                    </span><span data-l="en">Basis: &quot;<L s={s.groupTitle} />&quot; (<F s={s.fiscalYear} />, {s.kind === "printed" ? <T m={{ ja: "印字値", en: "Printed value" }} /> : <T m={{ ja: "計算値", en: "Computed" }} />})</span></span>
                    {s.caution && <span className="block text-xs text-muted-foreground">※{s.caution}</span>}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * `folded` (the premium report's layout, JCE-114): the summary 「この会社の今」 is shown by the report itself at its
 * top, so it is left out here, and each perspective opens from its title — the page reads as a list of the five
 * questions, and the report's print path opens every fold so the PDF still carries every table.
 */
export function CompanyAnalysisSection({
  company,
  companies,
  folded = false,
  openFolds = false,
  analysis: given,
}: {
  company: Company;
  companies: Company[];
  folded?: boolean;
  /** The print page (JCE-135): the folds are rendered open from the start, so nothing on the
   * sheet depends on a print event expanding them. Only meaningful together with `folded`. */
  openFolds?: boolean;
  /** The report computes the analysis once for its own summary and passes it here. */
  analysis?: CompanyAnalysis;
}) {
  const analysis = given ?? companyAnalysis(company, companies);
  if (analysis.perspectives.length === 0) return null;

  const businessNames = new Map<string, string>();
  const collect = (bs: Company["businesses"]) => bs.forEach((b) => {
    businessNames.set(b.id, b.shortName ?? b.name);
    if (b.children) collect(b.children);
  });
  collect(company.businesses);

  const segmentTotal = company.segmentRevenue?.items.reduce((acc, i) => acc + i.amount, 0) ?? 0;
  const meaning = meaningSummary(analysis.perspectives.flatMap((p) => p.groups));
  const linkedIndicators = analysis.industryId ? indicatorsForIndustry(analysis.industryId) : [];

  return (
    <section className={folded ? "" : "mt-12"}>
      {!folded && <h2 className="font-serif text-xl font-semibold"><T m={{ ja: "分析（5観点）", en: "Analysis (5 perspectives)" }} /></h2>}
      {!folded && meaning.length > 0 && (
        <MeaningGate fallback={<MeaningEntrance sentences={meaning} />}>
          <MeaningBlock sentences={meaning} />
        </MeaningGate>
      )}
      {!folded && (
        <>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        <span data-l="ja">この会社の数字を、規模と地位・成長・収益性・財務の安定・外部環境との接続の5観点で読みます。印字値は有価証券報告書のとおり、計算値には計算式を併記します。業界の分布は主たる産業が同じ掲載企業
        {analysis.industryName && `（${analysis.industryName}）`}
        {analysis.industryMembers > 0
          ? `${analysis.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${analysis.comparableMembers}社から作り、分布を示せる会社が5社に満たない指標では中央値も出しません`
          : <T m={{ ja: "から作ります", en: "is built from" }} />}
        。観点ごとに位置を示すもので、5観点を合成したスコアや格付けは作りません。
      </span><span data-l="en">This company&apos;s figures are read from five perspectives: scale and position, growth, profitability, financial stability, and links to the external environment. Printed values are as in the annual securities report; computed values show their formulas. The industry distribution covers {analysis.industryName && `（${analysis.industryName}）`} listed companies with the same main industry {analysis.industryMembers > 0
          ? `${analysis.industryMembers}社のうち、最新期がこの会社と1年以内に終わる${analysis.comparableMembers}社から作り、分布を示せる会社が5社に満たない指標では中央値も出しません`
          : <T m={{ ja: "から作ります", en: "is built from" }} />}. Each perspective shows a position; no composite score or rating of the five is created.</span></p>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
        <T m={{ ja: "無料で見られるのは各観点の要点（自社の値と業界の中央値）と、「この会社の今」の問いまでです。その答え（数字を文章に組み立てた要約）、分布の全体像・推移・経済指標との接続は分析レイヤーの範囲で、有効な購入コードで開きます。開いた状態で印刷・PDF保存すると、分析を含むレポート全体が1つの文書になります。", en: "For free, you can see the key points for each perspective (the company's value and the industry median) and the \"This company now\" questions. The answers (summaries that turn the numbers into sentences), the full distribution, trends, and links to economic indicators are part of the analysis layer, which opens with a valid purchase code. If you print or save as PDF while it is open, the entire report, including the analysis, becomes a single document." }} />
      </p>
        </>
      )}

      <div className={folded ? "mt-5 space-y-3" : "mt-8 space-y-10"}>
        {analysis.perspectives.map((p) => {
          const body = (
            <>
              {p.rows.length > 0 && <FreeTable rows={p.rows} />}
              {p.groups.map((g) => (
                <div key={g.id}>
                  <h4 className="mt-6 font-serif text-base font-semibold"><L s={g.title} /></h4>
                  <FreeTable rows={g.rows} />
                </div>
              ))}
            </>
          );
          return folded ? (
            <details key={p.id} open={openFolds || undefined} className="group rounded-xl border border-border bg-card px-4 py-3 sm:px-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block font-serif text-base font-semibold"><L s={p.title} /></span>
                  <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">{p.intro}</span>
                </span>
                <span className="mt-1 shrink-0 text-xs font-medium text-muted-foreground print:hidden">
                  <span className="group-open:hidden"><T m={{ ja: "表を開く ＋", en: "Open table +" }} /></span>
                  <span className="hidden group-open:inline"><T m={{ ja: "閉じる －", en: "Close −" }} /></span>
                </span>
              </summary>
              <div className="pb-2">{body}</div>
            </details>
          ) : (
            <div key={p.id}>
              <h3 className="font-serif text-lg font-semibold"><L s={p.title} /></h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{p.intro}</p>
              {body}
            </div>
          );
        })}
      </div>

      {(() => {
        const gated = (
        <AnalysisGate>
          <div className="space-y-10">
            {analysis.perspectives.map((p) => (
              <div key={p.id}>
                <h3 className="font-serif text-lg font-semibold"><span data-l="ja"><L s={p.title} /> — 分布の全体像</span><span data-l="en"><L s={p.title} /> — Full distribution</span></h3>
                {p.rows.length > 0 && <DetailTable rows={p.rows} />}
                {p.groups.map((g) => (
                  <div key={g.id}>
                    <h4 className="mt-6 font-serif text-base font-semibold"><L s={g.title} /></h4>
                    <DetailTable rows={g.rows} />
                    {g.note && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground"><L s={g.note} /></p>}
                  </div>
                ))}
                {p.series && (
                  <div className="mt-5">
                    <h4 className="font-serif text-base font-semibold"><L s={p.series.title} /></h4>
                    <div className="mt-2 overflow-x-auto">
                      <table className="border-collapse text-sm">
                        <tbody>
                          <tr className="border-b border-border/70">
                            <th scope="row" className="py-1.5 pr-3 text-left font-normal whitespace-nowrap"><T m={{ ja: "期", en: "Fiscal year" }} /></th>
                            {p.series.points.map((pt) => (
                              <td key={pt.periodEnd} className="figures py-1.5 pr-3 text-right whitespace-nowrap"><F s={pt.fiscalYear} /></td>
                            ))}
                          </tr>
                          <tr className="border-b border-border/70">
                            <th scope="row" className="py-1.5 pr-3 text-left font-normal whitespace-nowrap"><T m={{ ja: "金額", en: "Amount" }} /></th>
                            {p.series.points.map((pt) => (
                              <td key={pt.periodEnd} className="figures py-1.5 pr-3 text-right whitespace-nowrap"><F s={formatYen(pt.value)} /></td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {p.id === "environment" && company.segmentRevenue && segmentTotal > 0 && (
                  <div className="mt-5">
                    <h4 className="font-serif text-base font-semibold"><span data-l="ja">事業別の構成（<F s={company.segmentRevenue.fiscalYear} />）</span><span data-l="en">Breakdown by business (<F s={company.segmentRevenue.fiscalYear} />)</span></h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span data-l="ja"><L s={company.segmentRevenue.label} />の内訳は有価証券報告書の印字値、割合は計算値です。
                    </span><span data-l="en">The <L s={company.segmentRevenue.label} /> breakdown shows values as printed in the annual securities report; percentages are computed.</span></p>
                    <table className="mt-2 w-full max-w-xl border-collapse text-sm">
                      <tbody>
                        {[...company.segmentRevenue.items]
                          .sort((a, b) => b.amount - a.amount)
                          .map((i) => (
                            <tr key={i.businessId} className="border-b border-border/70">
                              <td className="py-1.5 pr-3">{businessNames.get(i.businessId) ?? i.businessId}</td>
                              <td className="figures py-1.5 pr-3 text-right whitespace-nowrap"><F s={formatYen(i.amount)} /></td>
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
                    <h4 className="font-serif text-base font-semibold"><T m={{ ja: "関連する経済指標", en: "Related economic indicators" }} /></h4>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                      <T m={{ ja: "この業界に対応づけた公的統計です。環境の提示であり、この会社の業績との因果を示すものではありません。", en: "Official statistics matched to this industry. They show the environment and do not indicate a causal link to this company's results." }} />
                    </p>
                    <ul className="mt-2 space-y-3">
                      {linkedIndicators.map(({ indicator, note }) => {
                        const latest = indicator.observations.at(-1);
                        return (
                          <li key={indicator.id} className="text-sm leading-6">
                            <Link href={`/indicators/${indicator.id}`} className="font-medium underline underline-offset-4">
                              <L s={indicator.name} />
                            </Link>
                            {latest && (
                              <span className="figures ml-2 whitespace-nowrap">
                                {observationPeriodLabel(indicator, latest.date)}: {formatIndicatorValue(indicator, latest.value)}
                                <L s={indicator.unit} />
                              </span>
                            )}
                            <span className="block text-muted-foreground"><L s={note} /></span>
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
        );
        return folded ? (
          <details open={openFolds || undefined} className="group mt-3 rounded-xl border border-border bg-card px-4 py-3 sm:px-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block font-serif text-base font-semibold"><T m={{ ja: "分布の全体像・推移・経済指標", en: "Full distribution, trends, and economic indicators" }} /></span>
                <span className="mt-0.5 block text-sm leading-6 text-muted-foreground"><T m={{ ja: "5観点それぞれの四分位・順位・パーセンタイルと、5期の推移、業界に対応づけた公的統計。", en: "Quartiles, rank, and percentile for each of the 5 perspectives, the 5-fiscal-year trend, and official statistics matched to the industry." }} /></span>
              </span>
              <span className="mt-1 shrink-0 text-xs font-medium text-muted-foreground print:hidden">
                <span className="group-open:hidden"><T m={{ ja: "開く ＋", en: "Open +" }} /></span>
                <span className="hidden group-open:inline"><T m={{ ja: "閉じる －", en: "Close −" }} /></span>
              </span>
            </summary>
            <div className="pt-4 pb-2">{gated}</div>
          </details>
        ) : (
          <div className="mt-10">{gated}</div>
        );
      })()}
    </section>
  );
}
