"use client";

import { useLocalStore } from "@/hooks/use-local-store";
import {
  METRIC_LABELS,
  predictableMetrics,
  verifyPrediction,
  type CompanyPredictionData,
  type Prediction,
  type PredictionMetric,
  type Verification,
} from "@/lib/predictions";
import { predictionsStore, recordPrediction } from "@/lib/storage/stores";
import { formatYen } from "@/lib/utils/format";

/**
 * The prediction panel (JCE-083): STEP 1 and STEP 3 of the training cycle, on the company's own page and
 * report. The reader records — once, unchangeably — whether the next annual filing's revenue and net income
 * will print above or below the latest year on the site; when that filing is read into the entry, the same
 * panel shows the two printed figures the reading is checked against. A training record, kept in this
 * browser only; it is not a forecast service and says nothing about buying or selling.
 */

const recordedLabel = (iso: string) =>
  new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));

const pct = (change: number) => `${change > 0 ? "+" : ""}${(Math.round(change * 1000) / 10).toLocaleString("ja-JP")}%`;

const directionLabel = (d: Prediction["direction"]) => (d === "up" ? "増える" : "減る");

export function VerificationBlock({ prediction, data, companyName }: { prediction: Prediction; data: CompanyPredictionData; companyName: string }) {
  const v: Verification = verifyPrediction(prediction, data);
  const label = METRIC_LABELS[prediction.metric];
  if (v.status === "pending") {
    return (
      <div className="rounded-md border border-border bg-card p-4 md:p-5">
        <p className="text-sm leading-6">
          {companyName}の{label}：あなたの予測は「{directionLabel(prediction.direction)}」（{prediction.baselineFiscalYear}が基準、{recordedLabel(prediction.recordedAt)}に記録）。
          次の有価証券報告書がこのサイトに載ったら、ここで照合します。
        </p>
      </div>
    );
  }
  if (v.status === "unverifiable") {
    return (
      <div className="rounded-md border border-border bg-card p-4 md:p-5">
        <p className="text-sm leading-6">
          {companyName}の{label}：あなたの予測は「{directionLabel(prediction.direction)}」（{prediction.baselineFiscalYear}が基準、{recordedLabel(prediction.recordedAt)}に記録）。
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">照合について：{v.reason}。</p>
      </div>
    );
  }
  const outcomeText =
    v.outcome === "matched" ? "予測と実績が一致しました。" : v.outcome === "flat" ? "実績は前期と同額で、増減はありませんでした。" : "実績は予測と逆の向きでした。";
  const titles = v.sourceIds.map((id) => data.sources[id]).filter(Boolean);
  return (
    <div className="rounded-md border border-border bg-card p-4 md:p-5">
      <p className="text-sm leading-6">
        {companyName}の{label}：あなたの予測は「{directionLabel(prediction.direction)}」（{recordedLabel(prediction.recordedAt)}に記録）。
      </p>
      <p className="figures mt-1 text-sm leading-6">
        実績：{v.actual.fiscalYear} {formatYen(v.actual.value)}（基準の{v.baseline.fiscalYear} {formatYen(v.baseline.value)}、計算値：前期比 {pct(v.change)}）。{outcomeText}
      </p>
      {titles.length > 0 && <p className="mt-1 text-xs leading-5 text-muted-foreground">出典：{titles.join("／")}</p>}
      {data.explanation && data.explanation.fiscalYear === v.actual.fiscalYear && (
        <div className="mt-3 border-t border-border/70 pt-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">STEP 4 フィードバック：この期の数字の内訳（この会社の今）</p>
          <ul className="mt-1.5 space-y-1.5">
            {data.explanation.sentences.map((s) => (
              <li key={s.text} className="text-sm leading-6">
                {s.text}
                <span className="block text-xs text-muted-foreground">根拠：{s.basis}（{data.explanation!.fiscalYear}）</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PredictionPanel({ companyId, data }: { companyId: string; data: CompanyPredictionData }) {
  const all = useLocalStore(predictionsStore);
  const latest = data.records.at(-1);
  if (!latest) return null;
  const mine = all.filter((p) => p.companyId === companyId);
  const current = mine.filter((p) => p.baselinePeriodEnd === latest.periodEnd);
  const past = mine.filter((p) => p.baselinePeriodEnd !== latest.periodEnd);
  const metrics = predictableMetrics(data);

  const baselineValue = (metric: PredictionMetric) => (metric === "revenue" ? latest.revenue : latest.netIncome);

  return (
    <section id="prediction" aria-label="次の決算の予測と照合" className="scroll-mt-24 rounded-md border border-border bg-card p-5 md:p-6 print:hidden">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">分析訓練 ・ STEP 1 予測 ／ STEP 3 照合</p>
      <h3 className="mt-2 font-serif text-lg font-semibold">次の決算を、自分で読む</h3>
      <p className="prose-ja mt-2 text-sm leading-6 text-muted-foreground">
        次の有価証券報告書で、{data.name}の売上と純利益が最新期（{latest.fiscalYear}）より増えるか減るか——数字が出る前に、自分の読みを記録します。
        記録した予測はあとから変更できません。開示がこのサイトに載ったら、実績の印字値と照合してここに表示します。
        これは企業を見る力を鍛えるための訓練で、売買の判断のためのものではありません。記録はこのブラウザにだけ残ります。
      </p>

      <div className="mt-4 grid gap-3">
        {metrics.map((metric) => {
          const recorded = current.find((p) => p.metric === metric);
          const value = baselineValue(metric);
          return (
            <div key={metric} className="rounded-md border border-border/70 p-4">
              <p className="figures text-sm leading-6">
                {METRIC_LABELS[metric]}：基準は{latest.fiscalYear}の {value !== null ? formatYen(value) : "—"}（印字値）。次の期は？
              </p>
              {recorded ? (
                <p className="mt-2 text-sm leading-6">
                  あなたの予測：<span className="font-medium">{directionLabel(recorded.direction)}</span>
                  <span className="text-muted-foreground">（{recordedLabel(recorded.recordedAt)}に記録・変更できません）</span>
                </p>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["up", "down"] as const).map((direction) => (
                    <button
                      key={direction}
                      type="button"
                      onClick={() =>
                        recordPrediction({ companyId, metric, direction, baselinePeriodEnd: latest.periodEnd, baselineFiscalYear: latest.fiscalYear })
                      }
                      className="flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-foreground"
                    >
                      {directionLabel(direction)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {metrics.length === 0 && (
          <p className="text-sm leading-6 text-muted-foreground">最新期の数字が、予測の基準にできる形で掲載されていないため、いまは予測を受け付けていません。</p>
        )}
      </div>

      {past.length > 0 && (
        <div className="mt-5 grid gap-3">
          <h4 className="text-sm font-semibold">これまでの予測と照合</h4>
          {past.map((p) => (
            <VerificationBlock key={`${p.metric}-${p.baselinePeriodEnd}`} prediction={p} data={data} companyName={data.name} />
          ))}
        </div>
      )}
    </section>
  );
}
