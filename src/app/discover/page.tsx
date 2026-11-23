import type { Metadata } from "next";
import Link from "next/link";
import { DiscoverFeed } from "@/components/discover/discover-feed";

export const metadata: Metadata = {
  title: "DISCOVER｜今日、出会う日本の会社",
  description: "スワイプするたびに、知らなかった日本の上場企業に出会うフィード。有価証券報告書が書く強みや、取引先・競合へのつながりをたどれます。",
  alternates: { canonical: "/discover" },
};

/**
 * The discovery feed (JCE-046). One card is one screen, between the header and (on phones) the bottom navigation,
 * and the page itself scrolls and snaps from card to card (2026-11-23; before, the cards scrolled inside a frame
 * of their own under an introduction that scrolled with the page). The short introduction is server-rendered
 * above the first card (JCE-074), so the page still explains itself in its own HTML.
 */
export default function DiscoverPage() {
  return (
    <div>
      {/* The introduction is one compact block above the first card, in the page's own scroll (2026-11-23): the
          feed below no longer has a scroll of its own. */}
      <section className="mx-auto max-w-md px-5 pt-4 pb-3">
        <h1 className="font-serif text-[1.375rem] leading-snug font-semibold">今日、出会う日本の会社</h1>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          上にスワイプで1社ずつ。カードは有価証券報告書に基づく記載から作っています。名前や業界から探すなら
          <Link href="/companies" className="underline underline-offset-2 hover:text-foreground">企業一覧</Link>へ。
        </p>
      </section>
      <div className="bg-neutral-950">
        <div className="mx-auto max-w-md">
          <DiscoverFeed />
        </div>
      </div>
    </div>
  );
}
