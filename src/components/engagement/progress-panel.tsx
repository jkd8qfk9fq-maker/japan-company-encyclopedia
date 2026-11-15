"use client";

import { Award, Flame } from "lucide-react";
import { useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { achievements, type Progress } from "@/lib/achievements";
import { computeStreak, recentDays } from "@/lib/streak";
import { activityStore, exploreStepsStore, favoritesStore, jstToday, quizStore } from "@/lib/storage/stores";

const weekday = ["日", "月", "火", "水", "木", "金", "土"];

/**
 * 記録 (JCE-052): the streak, the last two weeks, and the achievements, from what this browser holds. Phrased as what
 * the reader has done — never as what they might lose.
 */
export function ProgressPanel({ met, industriesMet, industriesTotal }: { met: number; industriesMet: number; industriesTotal: number }) {
  const days = useLocalStore(activityStore);
  const quiz = useLocalStore(quizStore);
  const following = useLocalStore(favoritesStore);
  const steps = useLocalStore(exploreStepsStore);
  const [today] = useState(() => jstToday());
  const streak = computeStreak(days, today);
  const two = recentDays(days, today, 14);
  const progress: Progress = {
    met,
    industriesMet,
    industriesTotal,
    quizCorrect: Object.values(quiz).filter((a) => a.correct).length,
    quizDays: Object.keys(quiz).length,
    bestStreak: streak.best,
    following: following.length,
    exploreSteps: steps,
  };
  const list = achievements(progress);
  const earned = list.filter((a) => a.earned);
  const next = list.filter((a) => !a.earned);

  return (
    <section aria-labelledby="progress" className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="progress" className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">記録</h2>
          <p className="mt-1 flex items-baseline gap-2">
            <Flame className="size-5 self-center text-seal" aria-hidden />
            <span className="figures font-serif text-[2rem] leading-none font-semibold">{streak.current}</span>
            <span className="text-sm">日続けて会社を知っています</span>
          </p>
          <p className="figures mt-1 text-xs text-muted-foreground">
            これまでの最長 {streak.best}日
            {streak.current > 0 && !streak.activeToday && "・今日はまだ。明日までに開けば続きます"}
            {streak.restDaysUsed > 0 && "・週に1日のお休みは途切れません"}
          </p>
        </div>
        <ol className="m-0 flex list-none gap-1 p-0" aria-label="この2週間">
          {two.map((d) => (
            <li key={d.day} className="grid justify-items-center gap-0.5">
              <span
                className={`block size-4 rounded-sm ${d.active ? "bg-seal" : "bg-muted"} ${d.day === today ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
                title={d.day}
              />
              <span className="text-[0.5625rem] text-muted-foreground">{weekday[new Date(`${d.day}T00:00:00Z`).getUTCDay()]}</span>
              <span className="sr-only">{d.day}{d.active ? " 利用" : ""}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">実績 {earned.length}</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[...earned.slice().reverse(), ...next].map((a) => (
            <li key={a.id} className={`flex items-center gap-3 rounded-md border px-3 py-2.5 ${a.earned ? "border-foreground/30 bg-card" : "border-dashed border-border"}`}>
              <Award className={`size-5 shrink-0 ${a.earned ? "text-seal" : "text-muted-foreground"}`} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{a.title}</span>
                <span className="block text-xs text-muted-foreground">{a.detail}</span>
                {!a.earned && (
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                    <span className="block h-full rounded-full bg-foreground" style={{ width: `${(a.value / a.goal) * 100}%` }} />
                  </span>
                )}
              </span>
              <span className="figures shrink-0 text-xs text-muted-foreground">{a.earned ? "達成" : `${a.value}/${a.goal}`}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
