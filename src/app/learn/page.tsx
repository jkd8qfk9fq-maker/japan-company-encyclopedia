import type { Metadata } from "next";
import { TRAINING_APP_METADATA } from "@/lib/site";
import Link from "next/link";
import { BetaOffer } from "@/components/engagement/beta-offer";
import { LearnCourse } from "@/components/engagement/learn-course";
import { MicroLessons } from "@/components/engagement/micro-lessons";
import { TrainingHistory } from "@/components/engagement/training-history";
import { TrainingInstall } from "@/components/engagement/training-install";
import { LEARN } from "@/lib/learning-ui";
import { L } from "@/components/i18n/label";

export const metadata: Metadata = {
  ...TRAINING_APP_METADATA,
  title: "有報の読み方入門",
  description: "実際の上場企業の決算を使い、自分で読み、予測し、結果を検証することで、企業を見る力を継続的に鍛える分析訓練。3〜4分のマイクロレッスンと復習キュー、そして12ステップのコース。",
  alternates: { canonical: "/learn" },
};

/**
 * The five steps of one training cycle (JCE-082): predict before the figures are seen, meet the disclosure,
 * check the prediction against the printed result, take the feedback the review queue brings back, and let
 * the record accumulate. Each step names the place on the site where it happens. Since JCE-083 the cycle is
 * real, not a rehearsal: a prediction recorded on a company page waits for that company's actual next filing
 * and is checked against its printed figures.
 */
const STEPS: { n: number; title: string; text: string; href: string; link: string }[] = [
  { n: 1, title: "予測", text: "決算の数字を見る前に、売上と利益の方向を自分で予想します。予想を立てるところから訓練は始まります。レッスンで型を学んだら、企業ページで次の決算への予測を記録します（記録した予測は変更できません）。", href: "/learn/lesson/predict-with-clues", link: "先読みのレッスンへ" },
  { n: 2, title: "開示", text: "実際の決算が出たら、開示された実績を確認します。定期便に今週の開示が並びます。", href: "/digest", link: "決算定期便へ" },
  { n: 3, title: "照合", text: "自分の予測と実績を比べます。開示がサイトに載ると、企業ページと定期便に、あなたの予測と実績の印字値が並びます。", href: "/digest", link: "定期便で照合する" },
  { n: 4, title: "フィードバック", text: "見落とした問題は、復習キューが間隔をあけて連れ戻します。間違えたところが、次の訓練の材料です。", href: "/learn/review", link: "復習キューへ" },
  { n: 5, title: "蓄積", text: "答えた問題、終えたレッスン、予測とその照合は、会社ごとの訓練の記録として残ります。読んだ会社の積み重ねが、見る力の土台になります。", href: "#training-history", link: "訓練の記録へ" },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-5 pb-16 md:px-8 md:pt-5">
      <p className="eyebrow" aria-hidden>Reading filings</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">有報の読み方入門</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
        実際の決算で、読む→予測する→答え合わせを繰り返し、企業を見る力を鍛えます。進み具合はこのブラウザにだけ残ります。
      </p>
      <TrainingInstall />

      {/* The path comes first (JCE-088): what to do next, and how far you have come, without scrolling.
          The learning area is white-based with its own bright palette; the rest of the page keeps the
          encyclopedia's theme. */}
      <div className="mt-8 rounded-3xl border-2 bg-white p-5 sm:p-7" style={{ borderColor: LEARN.line, color: LEARN.ink }}>
        <MicroLessons />
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <TrainingHistory />
      </div>

      <BetaOffer />

      <section aria-label="分析訓練の5ステップ" className="mt-16 border-t border-border pt-10">
        <h2 className="font-serif text-[1.375rem] font-semibold">分析訓練の5ステップ</h2>
        <p className="prose-ja mt-1 text-sm text-muted-foreground">1社を読むたびに、この順序で回します。</p>
        <ol className="mt-4 grid gap-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-md border border-border bg-card p-4 md:p-5">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">STEP {s.n}</p>
              <p className="mt-1 font-medium"><L s={s.title} /></p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground"><L s={s.text} /></p>
              <p className="mt-2 text-sm">
                <Link href={s.href} className="underline underline-offset-2 hover:text-foreground">
                  {s.link}
                </Link>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="12ステップのコース" className="mt-16 border-t border-border pt-10">
        <p className="eyebrow" aria-hidden>Course</p>
        <h2 className="mt-2 font-serif text-[1.375rem] font-semibold">12ステップで通して読む</h2>
        <p className="prose-ja mt-1 text-sm text-muted-foreground">
          実際の上場企業の数値を使った12ステップで、事業の姿 → 5期の数字 → 事業別の売上 → 海外の売上 → 四半期の動き、の順に読み方をたどります。
        </p>
        <div className="mt-6">
          <LearnCourse />
        </div>
      </section>
      <p className="mt-8 text-sm">
        <Link href="/digest" className="underline underline-offset-4">決算定期便</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/quiz" className="underline underline-offset-4">今日の1問</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/discover/collection" className="underline underline-offset-4">連続日数と実績を見る</Link>
      </p>
    </div>
  );
}
