import type { Metadata } from "next";
import Link from "next/link";
import { LearnCourse } from "@/components/engagement/learn-course";

export const metadata: Metadata = {
  title: "有報の読み方入門",
  description: "有価証券報告書の読み方を、実際の上場企業の数値で12ステップ。事業の姿から5期の数字、事業別の売上、海外の売上、四半期の動きまで。",
  alternates: { canonical: "/learn" },
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-8 pb-16 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Reading filings</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">有報の読み方入門</h1>
      <p className="prose-ja mt-3 text-muted-foreground">
        有価証券報告書は、会社の姿を会社自身の数字で読むための文書です。このコースは実際の上場企業の数値を使った12ステップで、事業の姿 → 5期の数字 → 事業別の売上 → 海外の売上 → 四半期の動き、の順に読み方をたどります。進み具合はこのブラウザにだけ残ります。
      </p>
      <div className="mt-6">
        <LearnCourse />
      </div>
      <p className="mt-8 text-sm">
        <Link href="/quiz" className="underline underline-offset-4">今日の1問</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/discover/collection" className="underline underline-offset-4">連続日数と実績を見る</Link>
      </p>
    </div>
  );
}
