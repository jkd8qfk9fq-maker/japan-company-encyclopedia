"use client";

import { Check, Clock, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { courseFraction, LEARN, lessonDone, nextLessonId, POINTS, pointsBreakdown, unitFraction, unitStyle, type UnitStyle } from "@/lib/learning-ui";
import type { QuestionTable } from "@/lib/lesson-questions";
import type { MicroLesson, MicroQuestion, MicroUnit } from "@/lib/micro-lessons";
import { verifyPrediction, type PredictionData } from "@/lib/predictions";
import { dueReviewIds } from "@/lib/review-queue";
import { jstToday, microProgressStore, predictionsStore, recordMicroAnswer, recordMicroLessonDone } from "@/lib/storage/stores";
import { loadLessons, loadPredictions } from "./load";
import { LearnButton, ProgressRing } from "./learn-ui";
import { F } from "@/components/i18n/figure";
import { T } from "@/components/i18n/t";

/**
 * The lesson player (JCE-088): one step on one screen — read, predict, immediate feedback — instead of the
 * old page where a whole lesson and its questions were read by scrolling. Since JCE-091 the read steps
 * are the lesson's learn block: the stumbling point, the concept and its diagram, and a guided reading
 * of the real excerpt, and only then the questions. The top bar fills by step; the
 * answer check is a fixed button at the foot; the verdict arrives as a sheet over the foot with the reason
 * and the filing's figures again, because the explanation is the lesson. Progress is the same store the
 * path reads (JCE-082), so leaving halfway costs nothing: the answered questions stay answered, and the
 * node on the path shows the lesson in progress.
 */

/**
 * A read step of the learn block (JCE-091): the stumbling point first, then the concept, its diagram of
 * the statement's form, and the guided reading of the real thing — its excerpt table and citation ride
 * along when the lesson has one. The questions come only after all of it.
 */
type ReadStep = {
  kind: "read";
  part: "stumble" | "concept" | "diagram" | "walkthrough";
  text?: string;
  table?: QuestionTable;
  cite?: { period: string; sourceTitle: string };
};
type Step = ReadStep | { kind: "question"; q: MicroQuestion };

const READ_HEADINGS: Record<ReadStep["part"], string> = {
  stumble: "つまずく場所",
  concept: "読む",
  diagram: "表の形",
  walkthrough: "実物で、一緒に読む",
};

/** The predict-first kinds (JCE-082): the step is headed 予測して、確かめる only for these; the structure
 *  questions of JCE-090 practise a reading, and the ordering questions an arrangement. */
const PREDICT_KINDS = new Set(["growth-revenue", "growth-profit", "growth-employees", "quarterly-direction"]);

const lessonSteps = (lesson: MicroLesson): Step[] => [
  ...(lesson.stumble ? [{ kind: "read", part: "stumble", text: lesson.stumble } as Step] : []),
  ...lesson.body.map((text): Step => ({ kind: "read", part: "concept", text })),
  ...(lesson.diagram ? [{ kind: "read", part: "diagram", table: lesson.diagram } as Step] : []),
  ...(lesson.guide ?? []).map(
    (text, i): Step => ({
      kind: "read",
      part: "walkthrough",
      text,
      ...(i === 0 && lesson.guideTable ? { table: lesson.guideTable, cite: lesson.guideCite } : {}),
    }),
  ),
  ...lesson.questions.map((q): Step => ({ kind: "question", q })),
];

/** An excerpt of a table — a company's own, printed as filed, or an authored diagram of the form.
 *  `figures` right-aligns the amount columns, as the question steps have always shown them. */
function ExcerptTable({ table, figures = false }: { table: QuestionTable; figures?: boolean }) {
  return (
    <figure className="overflow-x-auto rounded-2xl border-2" style={{ borderColor: LEARN.line }}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: LEARN.track }}>
            {table.columns.map((c) => (
              <th key={c} className="px-3 py-2 text-left font-bold" style={{ color: LEARN.navy }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-t" style={{ borderColor: LEARN.line }}>
              {row.map((cell, ci) => (
                <td key={ci} className={`px-3 py-2 ${ci === 0 ? "font-medium" : figures ? "figures text-right" : ""}`} style={{ color: LEARN.ink }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.caption && <figcaption className="px-3 py-2 text-xs leading-5" style={{ color: LEARN.muted }}>{table.caption}</figcaption>}
    </figure>
  );
}

function PlayerRun({
  steps,
  accent,
  backHref,
  prefilled,
  onSessionAnswer,
  renderComplete,
}: {
  steps: Step[];
  accent: UnitStyle;
  backHref: string;
  /** Lesson mode: a question already answered in the store opens with its verdict shown. Review mode: not. */
  prefilled: boolean;
  onSessionAnswer: () => void;
  renderComplete: (session: { answered: number }) => React.ReactNode;
}) {
  const progress = useLocalStore(microProgressStore);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [orderSel, setOrderSel] = useState<string[]>([]);
  const [checkedHere, setCheckedHere] = useState<Record<string, boolean>>({});
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  const step = steps[idx];
  const q = step?.kind === "question" ? step.q : null;
  const stored = q ? progress.answers[q.id] : undefined;
  const checked = q ? (checkedHere[q.id] ?? (prefilled ? Boolean(stored) : false)) : false;
  // An order question (JCE-090) is answered by arranging every option: the choice, in the store and in
  // the verdict alike, is the arranged ids joined by "," — the same string shape a single choice uses.
  const isOrder = q?.format === "order";
  const orderShown: string[] = q && isOrder ? (checkedHere[q.id] ? orderSel : prefilled && checked ? (stored?.choice ? stored.choice.split(",") : []) : orderSel) : [];
  const shownChoice = q ? (isOrder ? (orderShown.length ? orderShown.join(",") : null) : checkedHere[q.id] ? selected : prefilled && checked ? (stored?.choice ?? null) : selected) : null;
  const correct = q ? shownChoice !== null && shownChoice === q.answer : false;

  if (finished) return <>{renderComplete({ answered: sessionAnswered })}</>;
  if (!step) return null;

  const check = () => {
    if (!q) return;
    const choice = isOrder ? (orderSel.length === q.options.length ? orderSel.join(",") : null) : selected;
    if (choice === null) return;
    recordMicroAnswer(q.id, { choice, correct: choice === q.answer });
    setCheckedHere((m) => ({ ...m, [q.id]: true }));
    setSessionAnswered((n) => n + 1);
    onSessionAnswer();
  };

  const next = () => {
    setSelected(null);
    setOrderSel([]);
    if (idx + 1 >= steps.length) setFinished(true);
    else setIdx(idx + 1);
  };

  return (
    <div className="flex min-h-[70svh] flex-col">
      <div className="flex items-center gap-3">
        <Link href={backHref} aria-label="学習ホームに戻る" className="grid size-10 shrink-0 place-items-center rounded-full" style={{ backgroundColor: LEARN.track, color: LEARN.muted }}>
          <X className="size-5" />
        </Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: LEARN.track }} role="progressbar" aria-valuenow={idx} aria-valuemax={steps.length} aria-label="レッスンの進み具合">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(idx / steps.length) * 100}%`, backgroundColor: LEARN.cta }} />
        </div>
        <span className="figures text-sm font-bold" style={{ color: LEARN.muted }}>
          {idx + 1} / {steps.length}
        </span>
      </div>

      <div className="flex-1 py-8">
        {step.kind === "read" && (
          <div>
            <p className="text-xs font-bold tracking-[0.14em]" style={{ color: accent.main }}>{READ_HEADINGS[step.part]}</p>
            {step.text && <p className="mt-3 text-lg leading-9" style={{ color: LEARN.ink }}>{step.text}</p>}
            {step.table && (
              <div className="mt-4">
                <ExcerptTable table={step.table} figures={Boolean(step.cite)} />
                {step.cite && (
                  <p className="figures mt-2 text-xs leading-5" style={{ color: LEARN.muted }}>
                    {step.cite.period && <>対象期間：<F s={step.cite.period} />　</>}
                    {step.cite.sourceTitle && <>出典：{step.cite.sourceTitle}</>}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {q && (
          <div>
            <p className="text-xs font-bold tracking-[0.14em]" style={{ color: accent.main }}>{isOrder ? "並べ替えて、確かめる" : PREDICT_KINDS.has(q.kind) ? "予測して、確かめる" : "読み方を確かめる"}</p>
            <p className="mt-3 text-xl font-bold leading-8" style={{ color: LEARN.ink }}>{q.promptEn ? <T m={{ ja: q.prompt, en: q.promptEn }} /> : q.prompt}</p>
            {q.period && <p className="figures mt-2 text-sm" style={{ color: LEARN.muted }}>対象期間：<F s={q.period} /></p>}
            {q.clue && (
              <p className="mt-3 rounded-2xl px-4 py-3 text-sm leading-6" style={{ backgroundColor: accent.soft, color: LEARN.ink }}>「{q.clue}」</p>
            )}
            {q.table && (
              <div className="mt-4">
                <ExcerptTable table={q.table} figures />
              </div>
            )}
            {isOrder ? (
              <div className="mt-5 grid gap-4">
                <div>
                  <p className="text-sm font-bold" style={{ color: LEARN.muted }}>あなたの並び（{orderShown.length}／{q.options.length}）</p>
                  <ol className="mt-2 grid gap-2">
                    {orderShown.map((id, i) => {
                      const o = q.options.find((x) => x.id === id);
                      if (!o) return null;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            disabled={checked}
                            onClick={() => setOrderSel((s) => s.filter((x) => x !== id))}
                            className="flex min-h-12 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base font-medium"
                            style={{ borderColor: checked ? (correct ? LEARN.cta : LEARN.wrong) : accent.main, backgroundColor: accent.soft, color: LEARN.ink }}
                          >
                            <span className="figures grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: accent.main }}>{i + 1}</span>
                            <span>{o.labelEn ? <T m={{ ja: o.label, en: o.labelEn }} /> : o.label}</span>
                          </button>
                        </li>
                      );
                    })}
                    {orderShown.length === 0 && <li className="text-sm" style={{ color: LEARN.muted }}>下の項目を、表に出てくる順にタップしてください。</li>}
                  </ol>
                </div>
                <ul className="grid gap-2">
                  {q.options.filter((o) => !orderShown.includes(o.id)).map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        disabled={checked}
                        onClick={() => setOrderSel((s) => [...s, o.id])}
                        className="flex min-h-12 w-full items-center rounded-2xl border-2 px-4 py-3 text-left text-base font-medium"
                        style={{ borderColor: LEARN.line, backgroundColor: "#ffffff", color: LEARN.ink }}
                      >
                        {o.labelEn ? <T m={{ ja: o.label, en: o.labelEn }} /> : o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
            <ul className="mt-5 grid gap-3">
              {q.options.map((o) => {
                const isChosen = shownChoice === o.id;
                const isRight = o.id === q.answer;
                const border = !checked ? (isChosen ? accent.main : LEARN.line) : isRight ? LEARN.cta : isChosen ? LEARN.wrong : LEARN.line;
                const bg = !checked ? (isChosen ? accent.soft : "#ffffff") : isRight ? LEARN.ctaSoft : isChosen ? LEARN.wrongSoft : "#ffffff";
                return (
                  <li key={o.id}>
                    <button
                      type="button"
                      disabled={checked}
                      onClick={() => setSelected(o.id)}
                      className="flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left text-base font-medium"
                      style={{ borderColor: border, backgroundColor: bg, color: LEARN.ink }}
                    >
                      <span>{o.labelEn ? <T m={{ ja: o.label, en: o.labelEn }} /> : o.label}</span>
                      {checked && isRight && <Check className="size-5 shrink-0" style={{ color: LEARN.cta }} aria-label="正解" />}
                      {checked && isChosen && !isRight && <X className="size-5 shrink-0" style={{ color: LEARN.wrong }} aria-label="あなたの答え" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            )}
          </div>
        )}
      </div>

      {q && checked ? (
        <div className="sticky bottom-0 -mx-1 px-1 pb-1">
          <div className="rounded-3xl p-5" style={{ backgroundColor: correct ? LEARN.ctaSoft : LEARN.wrongSoft }}>
            <p className="flex items-center gap-2 text-lg font-bold" style={{ color: correct ? LEARN.ctaDark : LEARN.wrong }}>
              {correct ? <Check className="size-6" /> : <X className="size-6" />}
              {correct ? "正解です" : "正解はこちらでした"}
            </p>
            <p className="mt-2 text-sm leading-6" style={{ color: LEARN.ink }}>{q.explain}</p>
            <p className="figures mt-2 text-xs leading-5" style={{ color: LEARN.muted }}>
              {q.period && <>対象期間：<F s={q.period} />　</>}
              {q.sourceTitle && <>出典：{q.sourceTitle}</>}
            </p>
            {q.companyId && (
              <p className="mt-1 text-sm">
                <Link href={`/companies/${q.companyId}`} className="font-bold underline underline-offset-2" style={{ color: LEARN.navy }}>
                  {q.companyName ? `${q.companyName}のページで確かめる` : "企業ページで確かめる"}
                </Link>
              </p>
            )}
            <div className="mt-4">
              <LearnButton onClick={next} color={correct ? LEARN.cta : LEARN.wrong} dark={correct ? LEARN.ctaDark : "#b92f35"}>
                {idx + 1 >= steps.length ? "結果を見る" : "つぎへ"}
              </LearnButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-0 pb-1">
          {q ? (
            isOrder ? (
              <LearnButton onClick={check} disabled={orderSel.length !== q.options.length}>
                {orderSel.length !== q.options.length ? "すべて並べてください" : "こたえあわせ"}
              </LearnButton>
            ) : (
              <LearnButton onClick={check} disabled={selected === null}>
                {selected === null ? "選択肢を選んでください" : "こたえあわせ"}
              </LearnButton>
            )
          ) : (
            <LearnButton onClick={next}>{idx + 1 >= steps.length ? "結果を見る" : "つぎへ"}</LearnButton>
          )}
        </div>
      )}
    </div>
  );
}

function CompleteShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-full" style={{ backgroundColor: LEARN.ctaSoft }}>
        <Check className="size-10" style={{ color: LEARN.cta }} />
      </div>
      <h2 className="mt-4 text-2xl font-bold" style={{ color: LEARN.navy }}>{title}</h2>
      <div className="mt-6 grid gap-4 text-left">{children}</div>
    </div>
  );
}

function PointsCard({ rows, total }: { rows: { label: string; points: number }[]; total: number }) {
  return (
    <div className="rounded-3xl border-2 p-5" style={{ borderColor: LEARN.line }}>
      <p className="text-sm font-bold" style={{ color: LEARN.muted }}>ポイントの内訳</p>
      <ul className="figures mt-2 grid gap-1.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline justify-between text-sm" style={{ color: LEARN.ink }}>
            <span>{r.label}</span>
            <span className="font-bold">+{r.points}</span>
          </li>
        ))}
      </ul>
      <p className="figures mt-3 flex items-baseline justify-between border-t pt-3 text-base font-bold" style={{ borderColor: LEARN.line, color: LEARN.navy }}>
        <span>分析ポイント（通算）</span>
        <span>{total}</span>
      </p>
      <p className="mt-2 text-xs leading-5" style={{ color: LEARN.muted }}>
        ポイントは正解の数ではなく、答えて解説を読む・レッスンを終える・復習を重ねる・予測を検証まで終える、という行動につきます。
      </p>
    </div>
  );
}

const nextActionClass = "grid min-h-12 w-full place-items-center rounded-2xl px-5 text-base font-bold text-white active:translate-y-[3px]";

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const [units, setUnits] = useState<MicroUnit[] | null>(null);
  const [predData, setPredData] = useState<PredictionData | null>(null);
  const [failed, setFailed] = useState(false);
  const progress = useLocalStore(microProgressStore);
  const predictions = useLocalStore(predictionsStore);

  useEffect(() => {
    loadLessons().then(setUnits, () => setFailed(true));
    loadPredictions().then(setPredData, () => setPredData(null));
  }, []);

  if (failed) return <p className="text-sm" style={{ color: LEARN.muted }}>レッスンを読み込めませんでした。</p>;
  if (!units) return <p className="text-sm" style={{ color: LEARN.muted }}>レッスンを用意しています…</p>;

  const foundUnit = units
    .map((unit, unitIndex) => ({ unit, unitIndex, lesson: unit.lessons.find((l) => l.id === lessonId) }))
    .find((x) => x.lesson);
  if (!foundUnit || !foundUnit.lesson) return <p className="text-sm" style={{ color: LEARN.muted }}>そのレッスンは見つかりませんでした。</p>;
  const { lesson, unit, unitIndex } = { lesson: foundUnit.lesson, unit: foundUnit.unit, unitIndex: foundUnit.unitIndex };
  const accent = unitStyle(unitIndex);
  const wasDone = lessonDone(lesson, progress);

  const verifiedCount = predData ? predictions.filter((p) => predData[p.companyId] && verifyPrediction(p, predData[p.companyId]).status === "verified").length : 0;

  return (
    <PlayerRun
      steps={lessonSteps(lesson)}
      accent={accent}
      backHref="/learn"
      prefilled
      onSessionAnswer={() => {
        const answers = microProgressStore.get().answers;
        if (lesson.questions.every((x) => answers[x.id])) recordMicroLessonDone(lesson.id);
      }}
      renderComplete={() => {
        const now = microProgressStore.get();
        const answeredHere = lesson.questions.filter((x) => now.answers[x.id]);
        const correctHere = answeredHere.filter((x) => now.answers[x.id]?.correct).length;
        const points = pointsBreakdown(now, verifiedCount);
        const course = courseFraction(units, now);
        const unitProg = unitFraction(unit, now);
        const nextId = nextLessonId(units, now);
        const praise =
          answeredHere.length > 0 && correctHere === answeredHere.length
            ? "全問、正しく読めました。"
            : correctHere > 0
              ? `${answeredHere.length}問中 ${correctHere}問が正解でした。`
              : "答え合わせまで終えました。外れた問題は復習キューに入り、間隔をあけて戻ってきます。";
        return (
          <CompleteShell title="レッスン完了">
            <p className="text-center text-sm leading-6" style={{ color: LEARN.ink }}>{praise}</p>
            <PointsCard
              total={points.total}
              rows={[
                { label: `問題に答えた（${answeredHere.length}問 × ${POINTS.answer}）`, points: answeredHere.length * POINTS.answer },
                ...(wasDone || lessonDone(lesson, now) ? [{ label: `レッスン完了（+${POINTS.lessonDone}）`, points: POINTS.lessonDone }] : []),
              ]}
            />
            <div className="flex items-center gap-4 rounded-3xl border-2 p-5" style={{ borderColor: LEARN.line }}>
              <ProgressRing fraction={course.total ? course.done / course.total : 0} size={64}>
                <span className="figures text-sm font-bold" style={{ color: LEARN.navy }}>{course.done}/{course.total}</span>
              </ProgressRing>
              <p className="figures text-sm leading-6" style={{ color: LEARN.ink }}>
                単元「{unit.title}」は {unitProg.done}／{unitProg.total} レッスン完了。全体では {course.done}／{course.total} です。
              </p>
            </div>
            {nextId && nextId !== lesson.id ? (
              <Link href={`/learn/lesson/${nextId}`} className={nextActionClass} style={{ backgroundColor: LEARN.cta, boxShadow: `0 4px 0 ${LEARN.ctaDark}` }}>
                次のレッスンへ
              </Link>
            ) : (
              <Link href="/learn" className={nextActionClass} style={{ backgroundColor: LEARN.cta, boxShadow: `0 4px 0 ${LEARN.ctaDark}` }}>
                学習ホームへ戻る
              </Link>
            )}
            <p className="text-center text-sm">
              <Link href="/learn" className="underline underline-offset-2" style={{ color: LEARN.muted }}>学習ホームで記録を見る</Link>
            </p>
          </CompleteShell>
        );
      }}
    />
  );
}

export function ReviewPlayer() {
  const [units, setUnits] = useState<MicroUnit[] | null>(null);
  const [predData, setPredData] = useState<PredictionData | null>(null);
  const [failed, setFailed] = useState(false);
  const predictions = useLocalStore(predictionsStore);
  const [today] = useState(() => jstToday());
  const [dueSnapshot, setDueSnapshot] = useState<MicroQuestion[] | null>(null);

  useEffect(() => {
    loadLessons().then(
      (loaded) => {
        setUnits(loaded);
        // The due list is frozen at entry: answering a question reschedules it, and the run should not
        // shrink under the reader while they work through it.
        const byId = new Map<string, MicroQuestion>();
        for (const unit of loaded) for (const lesson of unit.lessons) for (const q of lesson.questions) byId.set(q.id, q);
        setDueSnapshot(
          dueReviewIds(microProgressStore.get().review, today)
            .map((id) => byId.get(id))
            .filter((q): q is MicroQuestion => Boolean(q)),
        );
      },
      () => setFailed(true),
    );
    loadPredictions().then(setPredData, () => setPredData(null));
  }, [today]);

  if (failed) return <p className="text-sm" style={{ color: LEARN.muted }}>復習を読み込めませんでした。</p>;
  if (!units || !dueSnapshot) return <p className="text-sm" style={{ color: LEARN.muted }}>復習を用意しています…</p>;

  const verifiedCount = predData ? predictions.filter((p) => predData[p.companyId] && verifyPrediction(p, predData[p.companyId]).status === "verified").length : 0;

  if (dueSnapshot.length === 0) {
    return (
      <CompleteShell title="いまの復習はありません">
        <p className="text-center text-sm leading-6" style={{ color: LEARN.ink }}>
          復習キューは空です。レッスンで答えた問題が、間隔をあけて戻ってきます。
        </p>
        <Link href="/learn" className={nextActionClass} style={{ backgroundColor: LEARN.cta, boxShadow: `0 4px 0 ${LEARN.ctaDark}` }}>
          学習ホームへ戻る
        </Link>
      </CompleteShell>
    );
  }

  const steps: Step[] = dueSnapshot.map((q) => ({ kind: "question", q }));
  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm font-bold" style={{ color: LEARN.muted }}>
        <Clock className="size-4" /> 復習キュー（{dueSnapshot.length}問）
      </p>
      <PlayerRun
        steps={steps}
        accent={{ main: LEARN.cta, dark: LEARN.ctaDark, soft: LEARN.ctaSoft }}
        backHref="/learn"
        prefilled={false}
        onSessionAnswer={() => {}}
        renderComplete={({ answered }) => (
          <CompleteShell title="復習が終わりました">
            <PointsCard total={pointsBreakdown(microProgressStore.get(), verifiedCount).total} rows={[{ label: `復習で答えた（${answered}問 × ${POINTS.answer}）`, points: answered * POINTS.answer }]} />
            <Link href="/learn" className={nextActionClass} style={{ backgroundColor: LEARN.cta, boxShadow: `0 4px 0 ${LEARN.ctaDark}` }}>
              学習ホームへ戻る
            </Link>
          </CompleteShell>
        )}
      />
    </div>
  );
}
