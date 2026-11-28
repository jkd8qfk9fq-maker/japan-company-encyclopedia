"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { T } from "@/components/i18n/t";
import { useLocalStore } from "@/hooks/use-local-store";
import type { QuizQuestion } from "@/lib/engagement-data";
import { buildCourseSteps } from "@/lib/learn-course";
import { jstToday, quizStore, recordLearnAnswer, recordQuizAnswer } from "@/lib/storage/stores";
import { loadQuiz } from "./load";

/** Days since 2026-01-01 in JST: the same question for every reader on the same day. */
const dayNumber = (day: string) => Math.round((Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) - Date.UTC(2026, 0, 1)) / 86_400_000);

export function questionFor(pool: QuizQuestion[], day: string): QuizQuestion | null {
  if (pool.length === 0) return null;
  return pool[((dayNumber(day) % pool.length) + pool.length) % pool.length];
}

/**
 * 今日の1問 (JCE-052): one question a day, the same for everyone, answered once. The answer is the entries' own
 * figure or description, with the reason shown and both companies linked: the reward is what the reader learns.
 * There is no timer, no score against others, and nothing to lose by skipping a day.
 */
export function DailyQuiz({ compact = false }: { compact?: boolean }) {
  const [pool, setPool] = useState<QuizQuestion[] | null>(null);
  const [failed, setFailed] = useState(false);
  const answers = useLocalStore(quizStore);
  const [day] = useState(() => jstToday());

  useEffect(() => {
    loadQuiz().then(setPool, () => setFailed(true));
  }, []);

  if (failed) return <p className="text-sm text-muted-foreground">今日の1問を読み込めませんでした。</p>;
  if (!pool) return <p className="text-sm text-muted-foreground">今日の1問を用意しています…</p>;
  const q = questionFor(pool, day);
  if (!q) return null;
  // If the pool changed after the reader answered (a new build that day), the answered question is the one shown.
  const answered = answers[day];
  const shown = answered ? pool.find((x) => x.id === answered.id) ?? q : q;
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  // JCE-072: when today's question is one of the course's steps, answering it here does that step too.
  const isCourseStep = buildCourseSteps(pool).some((s) => s.question.id === shown.id);

  return (
    <div className={`rounded-md border border-border bg-card ${compact ? "p-4" : "p-5 md:p-6"}`}>
      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">今日の1問</p>
      <p className={`mt-2 font-medium ${compact ? "" : "text-lg"}`}>{shown.promptEn ? <T m={{ ja: shown.prompt, en: shown.promptEn }} /> : shown.prompt}</p>
      {shown.clue && <p className="mt-2 rounded-sm bg-muted/60 px-3 py-2 text-sm leading-6">「{shown.clue}」</p>}
      <ul className={`mt-3 grid gap-2 ${shown.options.length === 2 ? "sm:grid-cols-2" : ""}`}>
        {shown.options.map((o) => {
          const chosen = answered?.choice === o.id;
          const right = o.id === shown.answer;
          const state = !answered ? "idle" : right ? "right" : chosen ? "wrong" : "rest";
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={Boolean(answered)}
                onClick={() => {
                  recordQuizAnswer(day, { id: shown.id, choice: o.id, correct: right });
                  if (isCourseStep) recordLearnAnswer(shown.id, { choice: o.id, correct: right });
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
                <span>{o.labelEn ? <T m={{ ja: o.label, en: o.labelEn }} /> : o.label}</span>
                {state === "right" && <Check className="size-4 shrink-0" aria-label="正解" />}
                {state === "wrong" && <X className="size-4 shrink-0" aria-label="あなたの答え" />}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div className="mt-4 grid gap-2 text-sm leading-6">
          <p className="font-medium">{answered.correct ? "正解です。" : "残念、こちらが正解でした。"}</p>
          <p className="text-muted-foreground">{shown.explain}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            {(shown.links ?? shown.options.map((o) => ({ href: `/companies/${o.id}`, label: `${o.label}を見る`, labelEn: o.labelEn ? `View ${o.labelEn}` : undefined }))).map((l) => (
              <Link key={l.href} href={l.href} className="underline underline-offset-2 hover:text-foreground">
                {l.labelEn ? <T m={{ ja: l.label, en: l.labelEn }} /> : l.label}
              </Link>
            ))}
          </p>
          <p className="figures text-xs text-muted-foreground">これまでの正解 {correctCount}問。明日はまた別の問題です。</p>
        </div>
      )}
      {!answered && !compact && <p className="mt-3 text-xs text-muted-foreground">答えは1回だけ。数値は各社の有価証券報告書から、問題は百科事典のデータから自動でつくっています。</p>}
    </div>
  );
}
