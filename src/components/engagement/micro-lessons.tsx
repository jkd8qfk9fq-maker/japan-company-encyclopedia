"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { weekEnd, weekStart } from "@/lib/jst-dates";
import type { MicroLesson, MicroQuestion, MicroUnit } from "@/lib/micro-lessons";
import { dueReviewIds } from "@/lib/review-queue";
import { jstToday, microProgressStore, recordMicroAnswer, recordMicroLessonDone } from "@/lib/storage/stores";
import { loadLessons } from "./load";

/**
 * The micro-lesson layer (JCE-082): units of short lessons — a few paragraphs, then questions against real
 * companies' printed figures — with a gentle count of this week's lessons and a review queue that brings
 * questions back at widening intervals. Progress lives in this browser only. There is no league, no hearts
 * and no daily obligation: a quiet week costs nothing, and the queue simply waits.
 */
export function MicroLessons() {
  const [units, setUnits] = useState<MicroUnit[] | null>(null);
  const [failed, setFailed] = useState(false);
  const progress = useLocalStore(microProgressStore);
  const [today] = useState(() => jstToday());

  useEffect(() => {
    loadLessons().then(setUnits, () => setFailed(true));
  }, []);

  if (failed) return <p className="text-sm text-muted-foreground">レッスンを読み込めませんでした。</p>;
  if (!units) return <p className="text-sm text-muted-foreground">レッスンを用意しています…</p>;

  const byId = new Map<string, MicroQuestion>();
  for (const unit of units) for (const lesson of unit.lessons) for (const q of lesson.questions) byId.set(q.id, q);
  const due = dueReviewIds(progress.review, today)
    .map((id) => byId.get(id))
    .filter((q): q is MicroQuestion => Boolean(q));
  const start = weekStart(today);
  const end = weekEnd(today);
  const thisWeek = Object.values(progress.lessons).filter((day) => day >= start && day <= end).length;
  const totalLessons = Object.keys(progress.lessons).length;
  const totalAnswers = Object.keys(progress.answers).length;

  return (
    <div className="grid gap-10">
      <div id="training-record" className="scroll-mt-24 rounded-md border border-border bg-card p-5 md:p-6">
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">今週のレッスン</p>
        <p className="figures mt-2 text-sm">
          {thisWeek > 0 ? `今週は ${thisWeek} レッスン進みました。` : "今週はまだレッスンをしていません。"}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          1レッスンは3〜4分です。週にいくつ進んだかだけを数えます。進まない週があっても、何も失われません。
        </p>
        {totalLessons > 0 && (
          <p className="figures mt-2 text-sm leading-6 text-muted-foreground">
            あなたの訓練の記録：これまで {totalLessons} レッスン、{totalAnswers} 問に答えました。この記録は、次にどの会社を読むか選ぶときの手がかりになります。
          </p>
        )}
        {due.length > 0 && (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            復習キューに {due.length} 問たまっています。下の「復習キュー」からどうぞ。
          </p>
        )}
      </div>

      {due.length > 0 && (
        <section id="review-queue" aria-label="復習キュー" className="grid gap-6 scroll-mt-24">
          <div>
            <p className="eyebrow" aria-hidden>Review</p>
            <h3 className="mt-2 font-serif text-[1.375rem] font-semibold">復習キュー</h3>
            <p className="prose-ja mt-1 text-sm text-muted-foreground">
              以前に答えた問題を、間隔をあけてもう一度。正解すると次の復習は少し先に、間違えると明日また出ます。
            </p>
          </div>
          <div className="grid gap-8">
            {due.map((q) => (
              <QuestionCard key={q.id} question={q} review />
            ))}
          </div>
        </section>
      )}

      {units.map((unit, ui) => (
        <section key={unit.id} id={`micro-${unit.id}`} aria-label={unit.title} className="scroll-mt-24 border-t border-border pt-10">
          <p className="eyebrow" aria-hidden>Unit {ui + 1}</p>
          <h3 className="mt-2 font-serif text-[1.375rem] font-semibold">{unit.title}</h3>
          <p className="prose-ja mt-1 text-sm text-muted-foreground">{unit.intro}</p>
          {unit.lessons.length > 0 ? (
            <div className="mt-6 grid gap-10">
              {unit.lessons.map((lesson, li) => (
                <LessonBlock key={lesson.id} lesson={lesson} index={li} />
              ))}
            </div>
          ) : (
            <ul className="mt-6 grid gap-2">
              {unit.plannedLessons.map((title) => (
                <li key={title} className="flex min-h-11 items-center justify-between rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted-foreground">
                  <span>{title}</span>
                  <span className="text-xs">準備中</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

function LessonBlock({ lesson, index }: { lesson: MicroLesson; index: number }) {
  const progress = useLocalStore(microProgressStore);
  const done = lesson.questions.length > 0 && lesson.questions.every((q) => progress.answers[q.id]);
  return (
    <div id={`lesson-${lesson.id}`} className="scroll-mt-24">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">
        レッスン {index + 1} ・ 約{lesson.minutes}分{done ? " ・ 完了" : ""}
      </p>
      <h4 className="mt-2 text-lg font-medium">{lesson.title}</h4>
      <div className="prose-ja mt-2 grid gap-2 text-muted-foreground">
        {lesson.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4 grid gap-8">
        {lesson.questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onAnswered={() => {
              const answers = microProgressStore.get().answers;
              if (lesson.questions.every((x) => answers[x.id])) recordMicroLessonDone(lesson.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ question: q, onAnswered, review = false }: { question: MicroQuestion; onAnswered?: () => void; review?: boolean }) {
  const progress = useLocalStore(microProgressStore);
  const answered = progress.answers[q.id];
  // In the review queue a question is answered again, from a blank card; the card keeps its own latest
  // choice for display, because the store keeps the first answer as the lesson's record.
  const [reviewChoice, setReviewChoice] = useState<string | null>(null);
  const shown = review ? (reviewChoice !== null ? { choice: reviewChoice, correct: reviewChoice === q.answer } : undefined) : answered;

  return (
    <div className="rounded-md border border-border bg-card p-5 md:p-6">
      <p className="text-lg font-medium">{q.prompt}</p>
      {q.period && <p className="figures mt-1 text-xs text-muted-foreground">対象期間：{q.period}</p>}
      {q.clue && <p className="mt-2 rounded-sm bg-muted/60 px-3 py-2 text-sm leading-6">「{q.clue}」</p>}
      <ul className={`mt-3 grid gap-2 ${q.options.length === 2 ? "sm:grid-cols-2" : ""}`}>
        {q.options.map((o) => {
          const chosen = shown?.choice === o.id;
          const right = o.id === q.answer;
          const state = !shown ? "idle" : right ? "right" : chosen ? "wrong" : "rest";
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={Boolean(shown)}
                onClick={() => {
                  recordMicroAnswer(q.id, { choice: o.id, correct: right });
                  if (review) setReviewChoice(o.id);
                  onAnswered?.();
                }}
                className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-md border px-4 py-2 text-left text-sm transition-colors ${
                  state === "idle"
                    ? "border-border hover:border-foreground"
                    : state === "right"
                      ? "border-foreground bg-foreground text-background"
                      : state === "wrong"
                        ? "border-seal text-seal"
                        : "border-border text-muted-foreground"
                }`}
              >
                <span>{o.label}</span>
                {state === "right" && <Check className="size-4 shrink-0" aria-label="正解" />}
                {state === "wrong" && <X className="size-4 shrink-0" aria-label="あなたの答え" />}
              </button>
            </li>
          );
        })}
      </ul>
      {shown && (
        <div className="mt-4 grid gap-2 text-sm leading-6">
          <p className="font-medium">{shown.correct ? "正解です。" : "残念、こちらが正解でした。"}</p>
          <p className="text-muted-foreground">{q.explain}</p>
          {q.sourceTitle && <p className="text-xs text-muted-foreground">出典：{q.sourceTitle}</p>}
          <p>
            <Link href={`/companies/${q.companyId}`} className="underline underline-offset-2 hover:text-foreground">
              {q.companyName ? `${q.companyName}のページで確かめる` : "企業ページで確かめる"}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
