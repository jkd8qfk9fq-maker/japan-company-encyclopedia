"use client";

import { Award, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import type { LearnStep } from "@/lib/learn-course";
import { learnStore, recordLearnAnswer } from "@/lib/storage/stores";
import { loadLearn } from "./load";

/**
 * 有報の読み方入門 (JCE-072): twelve steps through a filing, in the order it is read, grouped into five themes.
 * Each step is one question from the pool, answered once; the explanation follows, and the step ends inside the
 * company page section the question came from. Progress lives in this browser only. Finishing the course points
 * at following a company (JCE-059), where the filing alerts begin.
 */
export function LearnCourse() {
  const [steps, setSteps] = useState<LearnStep[] | null>(null);
  const [failed, setFailed] = useState(false);
  const answers = useLocalStore(learnStore);

  useEffect(() => {
    loadLearn().then(setSteps, () => setFailed(true));
  }, []);

  if (failed) return <p className="text-sm text-muted-foreground">コースを読み込めませんでした。</p>;
  if (!steps) return <p className="text-sm text-muted-foreground">コースを用意しています…</p>;
  if (steps.length === 0) return <p className="text-sm text-muted-foreground">コースの問題がまだ用意できていません。</p>;

  const done = steps.filter((s) => answers[s.question.id]).length;
  const complete = done === steps.length;
  const last = steps[steps.length - 1]!;
  const groups: { theme: string; intro: string; steps: LearnStep[] }[] = [];
  for (const s of steps) {
    const g = groups.at(-1);
    if (g && g.theme === s.theme) g.steps.push(s);
    else groups.push({ theme: s.theme, intro: s.intro, steps: [s] });
  }

  return (
    <div className="grid gap-10">
      <div className="rounded-md border border-border bg-card p-5 md:p-6">
        <p className="figures text-sm">
          {complete ? "全ステップ完了" : `${done} / ${steps.length} ステップ`}
          <span className="ml-3 inline-block h-1.5 w-40 max-w-full align-middle overflow-hidden rounded-full bg-muted" aria-hidden>
            <span className="block h-full rounded-full bg-foreground" style={{ width: `${(done / steps.length) * 100}%` }} />
          </span>
        </p>
        {complete ? (
          <div className="mt-4 grid gap-3">
            <p className="flex items-center gap-2 font-medium">
              <Award className="size-5 text-seal" aria-hidden />
              有報の読み方入門、修了です
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              次は、気になった会社をフォローしてみてください。新しい決算が出るたびに、その中身（売上高と純利益）がお知らせに届きます。
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href={`/companies/${last.question.answer}`} className="underline underline-offset-2 hover:text-foreground">
                最後のステップの会社をフォローする
              </Link>
              <Link href="/notifications" className="underline underline-offset-2 hover:text-foreground">
                お知らせを見る
              </Link>
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            どのステップからでも答えられます。答えると根拠と、会社のページで確かめる場所が出ます。{done > 0 && `修了まであと ${steps.length - done} ステップです。`}
          </p>
        )}
      </div>

      {groups.map((group, gi) => (
        <section key={group.theme} aria-label={group.theme} className={gi === 0 ? "" : "border-t border-border pt-10"}>
          <p className="eyebrow" aria-hidden>Theme {gi + 1}</p>
          <h2 className="mt-2 font-serif text-[1.375rem] font-semibold">{group.theme}</h2>
          <p className="prose-ja mt-1 text-sm text-muted-foreground">{group.intro}</p>
          <div className="mt-6 grid gap-8">
            {group.steps.map((step) => {
              const q = step.question;
              const answered = answers[q.id];
              const next = steps.find((s) => s.n > step.n && !answers[s.question.id]);
              return (
                <div key={q.id} id={`step-${step.n}`} className="scroll-mt-24">
                <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">ステップ {step.n}{answered ? " ・ 完了" : ""}</p>
                <div className="mt-2 rounded-md border border-border bg-card p-5 md:p-6">
                  <p className="text-lg font-medium">{q.prompt}</p>
                  {q.clue && <p className="mt-2 rounded-sm bg-muted/60 px-3 py-2 text-sm leading-6">「{q.clue}」</p>}
                  <ul className={`mt-3 grid gap-2 ${q.options.length === 2 ? "sm:grid-cols-2" : ""}`}>
                    {q.options.map((o) => {
                      const chosen = answered?.choice === o.id;
                      const right = o.id === q.answer;
                      const state = !answered ? "idle" : right ? "right" : chosen ? "wrong" : "rest";
                      return (
                        <li key={o.id}>
                          <button
                            type="button"
                            disabled={Boolean(answered)}
                            onClick={() => recordLearnAnswer(q.id, { choice: o.id, correct: right })}
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
                  {answered && (
                    <div className="mt-4 grid gap-2 text-sm leading-6">
                      <p className="font-medium">{answered.correct ? "正解です。" : "残念、こちらが正解でした。"}</p>
                      <p className="text-muted-foreground">{q.explain}</p>
                      <p className="flex flex-wrap gap-x-4 gap-y-1">
                        {q.options.map((o) => (
                          <Link
                            key={o.id}
                            href={o.id === q.answer ? `/companies/${o.id}#${step.section}` : `/companies/${o.id}`}
                            className="underline underline-offset-2 hover:text-foreground"
                          >
                            {o.label}を見る
                          </Link>
                        ))}
                        {next && (
                          <a href={`#step-${next.n}`} className="underline underline-offset-2 hover:text-foreground">
                            次のステップ（{next.n}）へ進む
                          </a>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
