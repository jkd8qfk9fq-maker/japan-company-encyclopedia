import type { Metadata } from "next";
import Link from "next/link";
import { DiscoverFeed } from "@/components/discover/discover-feed";

export const metadata: Metadata = {
  title: "DISCOVER｜今日、出会う日本の会社",
  description: "スワイプするたびに、知らなかった日本の上場企業に出会うフィード。有価証券報告書が書く強みや、取引先・競合へのつながりをたどれます。",
  alternates: { canonical: "/discover" },
};

/**
 * The discovery feed (JCE-046). Below the introduction, the feed fills the screen between the header and, on
 * phones, the bottom navigation, so one card is one screen. The introduction is rendered on the server above
 * that frame (JCE-074): the page explains itself in its own HTML, and the frame below keeps its exact height,
 * so the feed's one-card-one-screen layout is untouched — the reader scrolls past the introduction once.
 */
export default function DiscoverPage() {
  return (
    <div>
      <section className="mx-auto max-w-md px-5 pt-8 pb-5">
        <p className="eyebrow" aria-hidden>Discover</p>
        <h1 className="mt-2 font-serif text-[1.75rem] leading-snug font-semibold">今日、出会う日本の会社</h1>
        <p className="prose-ja mt-3 text-sm leading-7 text-muted-foreground">
          DISCOVERは、知らなかった日本の上場企業にスワイプで1社ずつ出会うフィードです。カードは各社の有価証券報告書に基づく百科事典の記載から作られていて、報告書が書く強みや、取引先・競合といった会社同士のつながりをたどれます。会社名や業界から探すときは
          <Link href="/companies" className="underline underline-offset-2 hover:text-foreground">企業一覧</Link>
          へ、数字から業界を読むときは
          <Link href="/features" className="underline underline-offset-2 hover:text-foreground">特集</Link>
          へどうぞ。
        </p>
      </section>
      <div className="h-[calc(100svh-var(--header-height)-3.5rem-env(safe-area-inset-bottom))] bg-neutral-950 md:h-[calc(100svh-var(--header-height))]">
        <div className="mx-auto h-full max-w-md">
          <DiscoverFeed />
        </div>
      </div>
    </div>
  );
}
