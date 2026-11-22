"use client";

import { BookOpen, Check, ChevronDown, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import {
  courseFraction,
  LEARN,
  learningDays,
  learningDaysThisWeek,
  nodeStates,
  nextLessonId,
  pointsBreakdown,
  unitFraction,
  unitStyle,
  type NodeState,
} from "@/lib/learning-ui";
import type { MicroLesson, MicroUnit } from "@/lib/micro-lessons";
import { METRIC_LABELS, verifyPrediction, type PredictionData } from "@/lib/predictions";
import { dueReviewIds } from "@/lib/review-queue";
import { jstToday, microProgressStore, predictionsStore } from "@/lib/storage/stores";
import { loadLessons, loadPredictions } from "./load";
import { ProgressRing } from "./learn-ui";

/**
 * The learning home (JCE-088): a path, not a scrolling page. Each unit wears its own colour — banner,
 * guidebook (読み方ノート) and nodes — and there is exactly one "next" node, so what to do is never a
 * choice among fifteen lessons. The head of the page carries the whole progress at a glance: a ring of
 * finished lessons, the analysis points, and this week's learning days (a weekly rhythm and running
 * totals instead of a daily streak that resets — JCE-082's gentleness, kept). A review node joins the
 * path when the queue has questions due, and the reader's own predictions close the page with the two
 * states that matter: waiting for the filing, and verified against it.
 */

const OFFSETS = [0, 30, 52, 30, 0];

export function MicroLessons() {
  const [units, setUnits] = useState<MicroUnit[] | null>(null);
  const [predData, setPredData] = useState<PredictionData | null>(null);
  const [failed, setFailed] = useState(false);
  const progress = useLocalStore(microProgressStore);
  const predictions = useLocalStore(predictionsStore);
  const [today] = useState(() => jstToday());
  const [selected, setSelected] = useState<string | null>(null);
  const [guidebook, setGuidebook] = useState<string | null>(null);

  useEffect(() => {
    loadLessons().then(setUnits, () => setFailed(true));
    loadPredictions().then(setPredData, () => setPredData(null));
  }, []);

  if (failed) return <p className="text-sm" style={{ color: LEARN.muted }}>レッスンを読み込めませんでした。</p>;
  if (!units) return <p className="text-sm" style={{ color: LEARN.muted }}>レッスンを用意しています…</p>;

  const states = nodeStates(units, progress);
  const course = courseFraction(units, progress);
  const nextId = nextLessonId(units, progress);
  const dueCount = dueReviewIds(progress.review, today).length;

  const verified = predictions.map((p) => ({ p, v: predData?.[p.companyId] ? verifyPrediction(p, predData[p.companyId]) : null }));
  const verifiedCount = verified.filter((x) => x.v?.status === "verified").length;
  const points = pointsBreakdown(progress, verifiedCount);
  const weekDays = learningDaysThisWeek(progress, today);
  const totalDays = learningDays(progress).length;

  return (
    <div>
      {/* The head: the whole of the progress, before any scrolling. */}
      <div className="flex items-center gap-4">
        <ProgressRing fraction={course.total ? course.done / course.total : 0} size={76} stroke={8}>
          <span className="figures text-base font-bold" style={{ color: LEARN.navy }}>
            {course.done}<span className="text-xs">/{course.total}</span>
          </span>
        </ProgressRing>
        <div className="grid gap-1">
          <p className="figures text-sm" style={{ color: LEARN.ink }}>
            <span className="font-bold" style={{ color: LEARN.navy }}>分析ポイント {points.total}</span>
            <span style={{ color: LEARN.muted }}>（レッスン完了・回答・復習・検証でたまります）</span>
          </p>
          <p className="figures text-sm" style={{ color: LEARN.ink }}>
            今週の学習日数 <span className="font-bold" style={{ color: LEARN.navy }}>{weekDays}日</span>
            <span style={{ color: LEARN.muted }}> ／ 通算 {totalDays}日。進まない週があっても、何も失われません。</span>
          </p>
          {dueCount > 0 && (
            <p className="figures text-sm font-bold" style={{ color: LEARN.ctaDark }}>
              復習キューに {dueCount} 問たまっています。
            </p>
          )}
        </div>
      </div>

      {dueCount > 0 && (
        <div id="review-queue" className="mt-6 scroll-mt-24">
          <Link
            href="/learn/review"
            className="flex items-center gap-4 rounded-3xl border-2 border-dashed p-4"
            style={{ borderColor: LEARN.cta, backgroundColor: LEARN.ctaSoft }}
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: LEARN.cta, boxShadow: `0 4px 0 ${LEARN.ctaDark}` }}>
              <Clock className="size-7" />
            </span>
            <span>
              <span className="block font-bold" style={{ color: LEARN.navy }}>復習キュー（{dueCount}問）</span>
              <span className="block text-sm" style={{ color: LEARN.muted }}>間隔をあけて戻ってきた問題です。正解すると次の復習は少し先になります。</span>
            </span>
          </Link>
        </div>
      )}

      {units.map((unit, ui) => {
        const style = unitStyle(ui);
        const prog = unitFraction(unit, progress);
        const guideOpen = guidebook === unit.id;
        return (
          <section key={unit.id} id={`micro-${unit.id}`} aria-label={unit.title} className="mt-10 scroll-mt-24">
            <div className="rounded-3xl p-5 text-white" style={{ backgroundColor: style.main }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-white/85">単元 {ui + 1} ・ レッスン {prog.done}／{prog.total} 完了</p>
                  <h3 className="mt-1 text-xl font-bold leading-7">{unit.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/90">{unit.intro}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGuidebook(guideOpen ? null : unit.id)}
                  aria-expanded={guideOpen}
                  className="grid shrink-0 place-items-center gap-0.5 rounded-2xl bg-white/20 px-3 py-2 text-xs font-bold text-white"
                >
                  <BookOpen className="size-5" />
                  読み方ノート
                  <ChevronDown className={`size-3.5 transition-transform ${guideOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/20">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${prog.total ? (prog.done / prog.total) * 100 : 0}%` }} />
              </div>
            </div>

            {guideOpen && (
              <div className="mt-3 grid gap-5 rounded-3xl p-5" style={{ backgroundColor: style.soft }}>
                {unit.lessons.map((lesson) => (
                  <div key={lesson.id}>
                    <p className="font-bold" style={{ color: LEARN.navy }}>{lesson.title}</p>
                    {lesson.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)} className="mt-1 text-sm leading-6" style={{ color: LEARN.ink }}>{paragraph}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {unit.lessons.length > 0 ? (
              <ol className="mt-6 grid gap-5">
                {unit.lessons.map((lesson, li) => {
                  const state = states.get(lesson.id) ?? "todo";
                  const isSelected = selected === lesson.id;
                  return (
                    <li key={lesson.id} id={lesson.id === nextId ? "next-node" : undefined} className="scroll-mt-28">
                      <div className="flex flex-col items-center" style={{ transform: `translateX(${OFFSETS[li % OFFSETS.length]}px)` }}>
                        {state === "next" && (
                          <span className="mb-1.5 animate-bounce rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: style.main }}>
                            次はここ
                          </span>
                        )}
                        <NodeButton lesson={lesson} index={li} state={state} color={style.main} dark={style.dark} onSelect={() => setSelected(isSelected ? null : lesson.id)} />
                        <span className="mt-1.5 max-w-44 text-center text-xs font-bold leading-4" style={{ color: state === "todo" ? LEARN.muted : LEARN.navy }}>
                          {lesson.title}
                        </span>
                      </div>
                      {isSelected && <NodeDetail lesson={lesson} state={state} doneDay={progress.lessons[lesson.id]} />}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <ul className="mt-6 grid gap-2">
                {unit.plannedLessons.map((title) => (
                  <li key={title} className="flex min-h-11 items-center justify-between rounded-2xl border-2 border-dashed px-4 py-2 text-sm" style={{ borderColor: LEARN.line, color: LEARN.muted }}>
                    <span>{title}</span>
                    <span className="text-xs">準備中</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {predictions.length > 0 && (
        <section aria-label="予測の検証" className="mt-12">
          <h3 className="text-xl font-bold" style={{ color: LEARN.navy }}>あなたの予測と検証</h3>
          <p className="figures mt-1 text-sm" style={{ color: LEARN.muted }}>
            検証済み {verifiedCount} 件 ／ 検証待ち {verified.filter((x) => x.v?.status === "pending").length} 件。予測は企業ページで記録でき、開示が載ると実績と照合されます。
          </p>
          <ul className="mt-4 grid gap-2.5">
            {verified.map(({ p, v }) => {
              const name = predData?.[p.companyId]?.name ?? p.companyId;
              const status = v?.status ?? "pending";
              const statusLine =
                v?.status === "verified"
                  ? `検証済み：実績は${v.actual.fiscalYear}で、予測と${v.outcome === "matched" ? "一致" : v.outcome === "flat" ? "増減なし" : "逆の向き"}でした`
                  : status === "pending"
                    ? "検証待ち：次の有価証券報告書の開示で照合されます"
                    : "照合対象外：会計基準または集計範囲が変わったため、増減の照合はしていません";
              return (
                <li key={`${p.companyId}-${p.metric}-${p.baselinePeriodEnd}`}>
                  <Link href={`/companies/${p.companyId}`} className="flex items-center gap-3 rounded-2xl border-2 px-4 py-3" style={{ borderColor: LEARN.line }}>
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-full text-white"
                      style={{ backgroundColor: status === "verified" ? LEARN.cta : status === "pending" ? "#f2b01e" : "#9fb0bc" }}
                    >
                      {status === "verified" ? <Check className="size-5" /> : <Clock className="size-5" />}
                    </span>
                    <span className="text-sm leading-6" style={{ color: LEARN.ink }}>
                      <span className="font-bold">{name}</span>：{METRIC_LABELS[p.metric]}は{p.direction === "up" ? "増える" : "減る"}（基準は{p.baselineFiscalYear}）
                      <span className="block text-xs font-bold" style={{ color: status === "verified" ? LEARN.ctaDark : LEARN.muted }}>
                        {statusLine}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {nextId && (
        <a
          href="#next-node"
          className="fixed right-4 bottom-4 z-40 flex items-center gap-1.5 rounded-full px-4 py-3 text-sm font-bold text-white"
          style={{ backgroundColor: LEARN.cta, boxShadow: `0 4px 0 ${LEARN.ctaDark}` }}
        >
          <MapPin className="size-4" />
          現在地へ戻る
        </a>
      )}
    </div>
  );
}

function NodeButton({
  lesson,
  index,
  state,
  color,
  dark,
  onSelect,
}: {
  lesson: MicroLesson;
  index: number;
  state: NodeState;
  color: string;
  dark: string;
  onSelect: () => void;
}) {
  const progress = useLocalStore(microProgressStore);
  const answered = lesson.questions.filter((q) => progress.answers[q.id]).length;
  const label = state === "done" ? "完了" : state === "next" ? "次はここ" : state === "doing" ? "進行中" : "未着手";
  if (state === "done") {
    return (
      <button type="button" onClick={onSelect} aria-label={`${lesson.title}（${label}）`} className="grid size-16 place-items-center rounded-full text-white" style={{ backgroundColor: color, boxShadow: `0 5px 0 ${dark}` }}>
        <Check className="size-8" />
      </button>
    );
  }
  if (state === "next") {
    return (
      <button type="button" onClick={onSelect} aria-label={`${lesson.title}（${label}）`} className="grid size-[4.5rem] animate-pulse place-items-center rounded-full text-2xl font-bold text-white" style={{ backgroundColor: color, boxShadow: `0 5px 0 ${dark}` }}>
        {index + 1}
      </button>
    );
  }
  if (state === "doing") {
    const r = 26;
    const c = 2 * Math.PI * r;
    const frac = lesson.questions.length ? answered / lesson.questions.length : 0;
    return (
      <button type="button" onClick={onSelect} aria-label={`${lesson.title}（${label}）`} className="relative grid size-16 place-items-center rounded-full bg-white text-xl font-bold" style={{ color, boxShadow: `0 5px 0 ${LEARN.track}` }}>
        <svg width="64" height="64" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={r} fill="none" stroke={LEARN.track} strokeWidth="5" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)} />
        </svg>
        {index + 1}
      </button>
    );
  }
  return (
    <button type="button" onClick={onSelect} aria-label={`${lesson.title}（${label}）`} className="grid size-16 place-items-center rounded-full text-xl font-bold" style={{ backgroundColor: LEARN.track, color: LEARN.muted, boxShadow: "0 5px 0 #cfdae2" }}>
      {index + 1}
    </button>
  );
}

function NodeDetail({ lesson, state, doneDay }: { lesson: MicroLesson; state: NodeState; doneDay?: string }) {
  const done = state === "done";
  return (
    <div className="mx-auto mt-3 max-w-md rounded-3xl border-2 p-4 text-center" style={{ borderColor: LEARN.line, backgroundColor: "#ffffff" }}>
      <p className="font-bold" style={{ color: LEARN.navy }}>{lesson.title}</p>
      <p className="figures mt-1 text-sm" style={{ color: LEARN.muted }}>
        約{lesson.minutes}分 ・ 問題{lesson.questions.length}問
        {done && doneDay ? ` ・ ${doneDay} に完了` : state === "doing" ? " ・ 途中まで進んでいます" : ""}
      </p>
      <Link
        href={`/learn/lesson/${lesson.id}`}
        className="mt-3 grid min-h-12 place-items-center rounded-2xl px-5 text-base font-bold text-white active:translate-y-[3px]"
        style={{ backgroundColor: LEARN.cta, boxShadow: `0 4px 0 ${LEARN.ctaDark}` }}
      >
        {done ? "もう一度見る" : state === "doing" ? "つづきからはじめる" : "はじめる"}
      </Link>
    </div>
  );
}
