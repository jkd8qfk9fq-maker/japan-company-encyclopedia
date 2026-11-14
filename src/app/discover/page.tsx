import type { Metadata } from "next";
import { DiscoverFeed } from "@/components/discover/discover-feed";

export const metadata: Metadata = {
  title: "DISCOVER｜今日、出会う日本の会社",
  description: "スワイプするたびに、知らなかった日本の上場企業に出会うフィード。有価証券報告書が書く強みや、取引先・競合へのつながりをたどれます。",
  alternates: { canonical: "/discover" },
};

/**
 * The discovery feed (JCE-046). The page is only the frame: it fills the screen between the header and, on phones,
 * the bottom navigation, so one card is one screen.
 */
export default function DiscoverPage() {
  return (
    <div className="h-[calc(100svh-var(--header-height)-3.5rem-env(safe-area-inset-bottom))] bg-neutral-950 md:h-[calc(100svh-var(--header-height))]">
      <div className="mx-auto h-full max-w-md">
        <DiscoverFeed />
      </div>
    </div>
  );
}
