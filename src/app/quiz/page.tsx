import type { Metadata } from "next";
import { TRAINING_APP_METADATA } from "@/lib/site";
import Link from "next/link";
import { DailyQuiz } from "@/components/engagement/daily-quiz";

export const metadata: Metadata = {
  ...TRAINING_APP_METADATA,
  title: "今日の1問",
  description: "日本の上場企業について、毎日1問。答えは各社の有価証券報告書の数値と百科事典の解説から。",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-5 pb-16 md:px-8 md:pt-5">
      <p className="eyebrow" aria-hidden>Daily quiz</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">今日の1問</h1>
      <p className="prose-ja mt-3 text-muted-foreground">日本の会社について、毎日1問。日付が変わると（日本時間の0時）新しい問題になります。</p>
      <div className="mt-8">
        <DailyQuiz />
      </div>
      <p className="mt-8 text-sm">
        <Link href="/learn" className="underline underline-offset-4">有報の読み方入門（全12ステップ）</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/discover/collection" className="underline underline-offset-4">連続日数と実績を見る</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/discover" className="underline underline-offset-4">DISCOVER で会社に出会う</Link>
      </p>
    </div>
  );
}
