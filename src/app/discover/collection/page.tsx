import type { Metadata } from "next";
import { DiscoverCollection } from "@/components/discover/discover-collection";

export const metadata: Metadata = {
  title: "マイ企業図鑑",
  description: "DISCOVER で出会った会社の記録。業界ごとに、いくつの会社に出会ったかがわかります。記録はこのブラウザの中だけに残ります。",
  alternates: { canonical: "/discover/collection" },
  robots: { index: false },
};

export default function DiscoverCollectionPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-16 md:px-8 md:pt-16">
      <p className="eyebrow" aria-hidden>Collection</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">マイ企業図鑑</h1>
      <p className="prose-ja mt-3 text-muted-foreground">
        DISCOVER で出会った会社が、業界ごとに集まります。記録はこのブラウザの中だけに残り、どこにも送られません。
      </p>
      <div className="mt-10">
        <DiscoverCollection />
      </div>
    </div>
  );
}
