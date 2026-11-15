import type { Metadata } from "next";
import Link from "next/link";
import { DailyQuiz } from "@/components/engagement/daily-quiz";

export const metadata: Metadata = {
  title: "今日の1問",
  description: "日本の上場企業について、毎日1問。答えは各社の有価証券報告書の数値と百科事典の解説から。",
  alternates: { canonical: "/quiz" },
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-12 pb-16 md:px-8 md:pt-16">
      <p className="eyebrow" aria-hidden>Daily quiz</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">今日の1問</h1>
      <p className="prose-ja mt-3 text-muted-foreground">日本の会社について、毎日1問。日付が変わると（日本時間の0時）新しい問題になります。</p>
      <div className="mt-8">
        <DailyQuiz />
      </div>
      <p className="mt-8 text-sm">
        <Link href="/discover/collection" className="underline underline-offset-4">連続日数と実績を見る</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/discover" className="underline underline-offset-4">DISCOVER で会社に出会う</Link>
      </p>
    </div>
  );
}
