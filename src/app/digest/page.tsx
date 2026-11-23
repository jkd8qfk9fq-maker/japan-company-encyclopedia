import type { Metadata } from "next";
import Link from "next/link";
import { DigestVerifications } from "@/components/engagement/digest-verifications";
import { buildDigest, type DigestEvent } from "@/lib/digest";
import { buildUpdates, type UpdateKind } from "@/lib/engagement-data";
import { companyRepository, revisionRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "決算定期便",
  description: "今週と先週に出た決算を、学んだ読み方で自分の予測と照合して読む、分析訓練の実践の場。各社の開示に、対象期間と検証済みの実績、関連するマイクロレッスンと企業レポート（分析5観点）への道筋を付けています。",
  alternates: { canonical: "/digest" },
};

const KIND: Record<UpdateKind, string> = { yuho: "有価証券報告書", hanki: "半期報告書", tanshin: "決算短信", correction: "訂正" };

const dateLabel = (iso: string) => `${Number(iso.slice(5, 7))}月${Number(iso.slice(8, 10))}日`;

/**
 * 決算定期便 (JCE-082): this week's and last week's filings of the released companies, each with the reading
 * it calls for. The figures beside a filing are the ones the filing itself prints (JCE-071) — nothing is
 * computed here, and nothing is recommended. Delivery by mail and push is a later phase; the page is the
 * digest for now, rebuilt with the site's data.
 */
export default async function DigestPage() {
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  const [companies, revisions] = await Promise.all([companyRepository.list(), revisionRepository.list()]);
  const digest = buildDigest(buildUpdates(companies, revisions, today), today);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-16 md:px-8 md:pt-5">
      <p className="eyebrow" aria-hidden>Earnings digest</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">決算定期便</h1>
      <p className="prose-ja mt-3 text-muted-foreground">
        ここは、学んだ読み方を実際の決算で試す、分析訓練の実践の場です。使い方の順序は、まず自分の予測を立てる（STEP 1）、開示された実績を確認する（STEP 2）、予測と実績を照合する（STEP 3）。予測の型はマイクロレッスンで学べます。各社の開示には、対象期間と検証済みの実績、その決算の読み方（マイクロレッスン）と企業レポート（分析5観点）への道筋を付けています。数字は各社の開示が載せた売上高と純利益そのものです。
      </p>
      <p className="mt-3 text-sm">
        <Link href="/learn/lesson/predict-with-clues" className="underline underline-offset-4">STEP 1：先読みのレッスンで予測の型を学ぶ</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/learn/review" className="underline underline-offset-4">STEP 4：復習キュー</Link>
        <span className="mx-2 text-muted-foreground">・</span>
        <Link href="/learn#training-history" className="underline underline-offset-4">STEP 5：訓練の記録</Link>
      </p>

      <DigestVerifications />

      <DigestSection title="今週の決算" events={digest.thisWeek} empty="今週（月曜から日曜まで）の開示は、まだありません。" />
      <DigestSection title="先週の決算" events={digest.lastWeek} empty="先週の開示はありません。" />

      <p className="mt-10 text-sm leading-6 text-muted-foreground">
        読み方をまだ学んでいない方は、
        <Link href="/learn" className="underline underline-offset-4">有報の読み方入門</Link>
        のマイクロレッスンからどうぞ。気になる会社は企業ページでフォローすると、新しい決算がお知らせに届きます。
      </p>
    </div>
  );
}

function DigestSection({ title, events, empty }: { title: string; events: DigestEvent[]; empty: string }) {
  return (
    <section aria-label={title} className="mt-10">
      <h2 className="font-serif text-[1.375rem] font-semibold">
        {title}
        <span className="figures ml-3 text-sm font-normal text-muted-foreground">{events.length} 件</span>
      </h2>
      {events.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {events.map((e) => (
            <li key={`${e.companyId}-${e.kind}-${e.date}-${e.title}`} className="rounded-md border border-border bg-card p-4 md:p-5">
              <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">
                {dateLabel(e.date)} ・ {KIND[e.kind]}
              </p>
              <p className="mt-1.5 font-medium">
                <Link href={`/companies/${e.companyId}`} className="hover:underline underline-offset-4">
                  {e.companyName}
                </Link>
                <span className="ml-2 text-sm font-normal text-muted-foreground">{e.title}</span>
              </p>
              {e.summary && <p className="figures mt-1 text-sm text-muted-foreground">{e.summary}</p>}
              <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <Link href={`/companies/${e.companyId}/report`} className="underline underline-offset-2 hover:text-foreground">
                  企業レポート（分析5観点）
                </Link>
                <Link href={e.reading.href} className="underline underline-offset-2 hover:text-foreground">
                  {e.reading.label}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
