"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import type { MicroUnit } from "@/lib/micro-lessons";
import { unitStyle } from "@/lib/learning-ui";
import { METRIC_LABELS, verifyPrediction, type PredictionData } from "@/lib/predictions";
import { REVIEW_INTERVALS_DAYS } from "@/lib/review-queue";
import { jstToday, microProgressStore, predictionsStore } from "@/lib/storage/stores";
import { loadLessons, loadPredictions } from "./load";
import { F } from "@/components/i18n/figure";

/**
 * The training record (JCE-083): STEP 5, the accumulation. Two things are shown, both as plain facts —
 * how the reader's practice has widened and changed, and the per-company trail of what they read, answered,
 * predicted and checked. There is deliberately no ability score and no grade: a count of finished checks
 * and the spread of readings are records, and turning them into a rating would invent a measure nobody
 * defined (docs/decisions.md, JCE-083). The record is a guide to choosing the next company, never something
 * that can be lost. Everything lives in this browser only.
 */

const KIND_LABELS: Record<string, string> = {
  figure: "売上高の金額を読む",
  "growth-revenue": "売上の増減を読む",
  "growth-profit": "純利益の増減を読む",
  revenue: "会社の規模を比べる",
  overseas: "海外売上の割合を読む",
  segment: "事業別の売上を読む",
  quarterly: "四半期の動きを読む",
  describe: "事業の説明から会社を見分ける",
  "segment-top": "最大の事業を読む",
  "overseas-ratio": "海外売上比率を読む",
  employees: "従業員1人あたり売上を読む",
  "growth-employees": "従業員数の増減を読む",
  shares: "発行済株式総数を読む",
  "quarterly-direction": "四半期の増減を予想する",
  "quarterly-progress": "進捗の目安を読む",
  // The JCE-090 readings: structure first, values never. The labels above for the retired kinds stay —
  // an answer recorded under the old course keeps the name of the reading it practised.
  order: "項目の並び順を読む",
  "stage-diff": "段階の差の内訳を読む",
  classify: "項目の区分を読む",
  procedure: "読み方の手順を選ぶ",
  concept: "表の仕組みを読む",
  "find-row": "実物の表から項目を探す",
  "relation-stages": "段階利益の関係を読む",
  "relation-net-assets": "純資産と利益の関係を読む",
  "label-reading": "項目の名前から物差しを読む",
  "region-find": "地域別の表を読む",
  // The JCE-092 detail readings: the real breakdowns of the real statements.
  "detail-sga": "販管費の内訳を読む",
  "detail-special": "特別損益の内訳を読む",
  "detail-working-capital": "まだ現金になっていない資産を読む",
  "detail-borrowings": "借入の行を全部探す",
  "detail-goodwill": "無形固定資産の内訳を読む",
  "detail-depreciation": "帳簿価額の組み立てを読む",
};

const jstDayOf = (iso: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date(iso));
const monthOf = (day: string) => day.slice(0, 7);
const lastMonthOf = (month: string) => {
  const y = Number(month.slice(0, 4));
  const m = Number(month.slice(5, 7));
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
};

type CompanyEvent = { day: string; text: string };

export function TrainingHistory() {
  const progress = useLocalStore(microProgressStore);
  const predictions = useLocalStore(predictionsStore);
  const [units, setUnits] = useState<MicroUnit[] | null>(null);
  const [predData, setPredData] = useState<PredictionData | null>(null);
  const [today] = useState(() => jstToday());

  useEffect(() => {
    loadLessons().then(setUnits, () => setUnits([]));
    loadPredictions().then(setPredData, () => setPredData(null));
  }, []);

  const totalAnswers = Object.keys(progress.answers).length;
  const hasRecord = totalAnswers > 0 || predictions.length > 0 || Object.keys(progress.lessons).length > 0;

  // Question id → the company and the reading it practises, from the bound course. A structure question
  // (JCE-090) is about no company: it counts toward the spread of readings, never toward a company's trail.
  const questionOf = new Map<string, { companyId: string | null; companyName?: string; kind: string }>();
  for (const unit of units ?? [])
    for (const lesson of unit.lessons)
      for (const q of lesson.questions) questionOf.set(q.id, { companyId: q.companyId, companyName: q.companyName, kind: q.kind });

  const nameOf = (companyId: string, fallback?: string) => fallback ?? predData?.[companyId]?.name ?? companyId;

  // --- The change in what the reader can do, as accumulated facts. ---
  const kindCounts = new Map<string, number>();
  for (const id of Object.keys(progress.answers)) {
    const q = questionOf.get(id);
    if (q) kindCounts.set(q.kind, (kindCounts.get(q.kind) ?? 0) + 1);
  }
  const stageCounts = REVIEW_INTERVALS_DAYS.map((_, stage) => Object.values(progress.review).filter((s) => s.stage === stage).length);

  let checkedCount = 0;
  let pendingCount = 0;
  const outcomes = { matched: 0, missed: 0, flat: 0 };
  if (predData) {
    for (const p of predictions) {
      const company = predData[p.companyId];
      if (!company) continue;
      const v = verifyPrediction(p, company);
      if (v.status === "verified") {
        checkedCount += 1;
        outcomes[v.outcome] += 1;
      } else if (v.status === "pending") {
        pendingCount += 1;
      }
    }
  }

  const thisMonth = monthOf(today);
  const lastMonth = lastMonthOf(thisMonth);
  const countByMonth = (days: string[]) => ({
    this: days.filter((d) => monthOf(d) === thisMonth).length,
    last: days.filter((d) => monthOf(d) === lastMonth).length,
  });
  const answerMonths = countByMonth(Object.values(progress.answers).map((a) => a.day));
  const lessonMonths = countByMonth(Object.values(progress.lessons));
  const predictionMonths = countByMonth(predictions.map((p) => jstDayOf(p.recordedAt)));

  // --- The per-company trail. ---
  const byCompany = new Map<string, { name: string; events: CompanyEvent[] }>();
  const push = (companyId: string, name: string, event: CompanyEvent) => {
    const entry = byCompany.get(companyId) ?? { name, events: [] };
    entry.events.push(event);
    byCompany.set(companyId, entry);
  };
  for (const [id, a] of Object.entries(progress.answers)) {
    const q = questionOf.get(id);
    if (!q || !q.companyId) continue;
    push(q.companyId, nameOf(q.companyId, q.companyName), {
      day: a.day,
      text: `レッスンの問題（${KIND_LABELS[q.kind] ?? q.kind}）：${a.correct ? "正解" : "正解ではなかった"}`,
    });
  }
  for (const p of predictions) {
    const company = predData?.[p.companyId];
    const name = nameOf(p.companyId);
    let text = `予測を記録：${METRIC_LABELS[p.metric]}は${p.direction === "up" ? "増える" : "減る"}（基準は${p.baselineFiscalYear}）`;
    if (company) {
      const v = verifyPrediction(p, company);
      if (v.status === "verified") {
        text += ` → 照合済み：実績は${v.actual.fiscalYear}で、予測と${v.outcome === "matched" ? "一致" : v.outcome === "flat" ? "増減なし" : "逆の向き"}`;
      } else if (v.status === "unverifiable") {
        text += " → 照合対象外（基準または実績の数字が単純比較できないため）";
      } else {
        text += " → 開示待ち";
      }
    }
    push(p.companyId, name, { day: jstDayOf(p.recordedAt), text });
  }
  const companies = [...byCompany.entries()]
    .map(([companyId, v]) => ({ companyId, name: v.name, events: v.events.sort((a, b) => b.day.localeCompare(a.day)) }))
    .sort((a, b) => (b.events[0]?.day ?? "").localeCompare(a.events[0]?.day ?? ""));

  return (
    <section id="training-history" aria-label="訓練の記録" className="scroll-mt-24">
      <p className="eyebrow" aria-hidden>Record</p>
      <h3 className="mt-2 font-serif text-[1.375rem] font-semibold">訓練の記録</h3>
      <p className="prose-ja mt-1 text-sm text-muted-foreground">
        答えた問題、終えたレッスン、記録した予測とその照合が、会社ごとに積み上がります。能力を点数にすることはしません——何を読めるようになり、どの会社で試したかという事実の積み重ねが、次の会社を選ぶ手がかりになります。
      </p>

      {!hasRecord ? (
        <p className="mt-4 text-sm text-muted-foreground">まだ記録がありません。上のレッスンに答えると、ここに積み上がります。</p>
      ) : (
        <>
          {/* The headline facts first (JCE-088): how far the path has come, and the predictions carried
              through to verification — the count that grows on filing days, not only on study days. */}
          {units && (
            <>
              <dl className="figures mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "レッスン完了", value: `${Object.keys(progress.lessons).length}／${units.reduce((s, u) => s + u.lessons.length, 0)}` },
                  { label: "答えた問題", value: `${totalAnswers} 問` },
                  { label: "検証を終えた予測", value: `${checkedCount} 件` },
                  { label: "検証待ちの予測", value: `${pendingCount} 件` },
                ].map((s) => (
                  <div key={s.label} className="rounded-md border border-border bg-card p-4 text-center">
                    <dt className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{s.label}</dt>
                    <dd className="mt-1 text-lg font-bold"><F s={s.value} /></dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 grid gap-3">
                {units
                  .filter((u) => u.lessons.length > 0)
                  .map((u, ui) => {
                    const done = u.lessons.filter((l) => progress.lessons[l.id]).length;
                    return (
                      <div key={u.id}>
                        <p className="figures flex items-baseline justify-between text-sm">
                          <span className="font-medium">単元「{u.title}」</span>
                          <span className="text-muted-foreground">{done}／{u.lessons.length}</span>
                        </p>
                        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full transition-all" style={{ width: `${u.lessons.length ? (done / u.lessons.length) * 100 : 0}%`, backgroundColor: unitStyle(ui).main }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          <div className="mt-6 grid gap-3">
            {checkedCount > 0 && (
              <div className="rounded-md border border-border bg-card p-4 md:p-5">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">予測の照合</p>
                <p className="figures mt-2 text-sm leading-6">
                  照合を終えた予測は {checkedCount} 件です（予測と一致 {outcomes.matched} 件／逆の向き {outcomes.missed} 件／増減なし {outcomes.flat} 件）。
                  一致の数は競うものではなく、読みの癖を知るための記録です。
                </p>
              </div>
            )}

            {kindCounts.size > 0 && (
              <div className="rounded-md border border-border bg-card p-4 md:p-5">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">読み方の広がり</p>
                <ul className="figures mt-2 grid gap-1 text-sm leading-6">
                  {[...kindCounts.entries()].map(([kind, n]) => (
                    <li key={kind}>{KIND_LABELS[kind] ?? kind}：{n} 問</li>
                  ))}
                </ul>
                {units && (
                  <ul className="figures mt-2 grid gap-1 text-sm leading-6 text-muted-foreground">
                    {units
                      .filter((u) => u.lessons.length > 0)
                      .map((u) => (
                        <li key={u.id}>
                          単元「{u.title}」：レッスン {u.lessons.filter((l) => progress.lessons[l.id]).length}／{u.lessons.length} 完了
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}

            {Object.keys(progress.review).length > 0 && (
              <div className="rounded-md border border-border bg-card p-4 md:p-5">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">復習の定着</p>
                <p className="figures mt-2 text-sm leading-6">
                  復習中の問題は {Object.keys(progress.review).length} 問です（次の復習までの間隔：
                  {REVIEW_INTERVALS_DAYS.map((d, i) => `${d}日 ${stageCounts[i]} 問`).join("・")}）。
                  間隔が広がった問題は、間をあけても思い出せた問題です。
                </p>
              </div>
            )}

            <div className="rounded-md border border-border bg-card p-4 md:p-5">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">先月と今月</p>
              <p className="figures mt-2 text-sm leading-6">
                答えた問題：先月 {answerMonths.last} 問・今月 {answerMonths.this} 問。終えたレッスン：先月 {lessonMonths.last}・今月 {lessonMonths.this}。
                記録した予測：先月 {predictionMonths.last} 件・今月 {predictionMonths.this} 件。
              </p>
            </div>
          </div>

          {companies.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-semibold">会社ごとの記録</h4>
              <div className="mt-3 grid gap-3">
                {companies.map((c) => (
                  <div key={c.companyId} className="rounded-md border border-border bg-card p-4 md:p-5">
                    <p className="font-medium">
                      <Link href={`/companies/${c.companyId}`} className="hover:underline underline-offset-4">
                        {c.name}
                      </Link>
                    </p>
                    <ul className="mt-2 grid gap-1.5">
                      {c.events.slice(0, 12).map((e, i) => (
                        <li key={i} className="figures text-sm leading-6 text-muted-foreground">
                          <span className="mr-2">{e.day}</span>
                          {e.text}
                        </li>
                      ))}
                    </ul>
                    {c.events.length > 12 && <p className="mt-1 text-xs text-muted-foreground">ほか {c.events.length - 12} 件の記録があります。</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
