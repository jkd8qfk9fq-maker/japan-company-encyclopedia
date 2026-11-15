import type { Metadata } from "next";
import { ConnectionExplorer } from "@/components/engagement/connection-explorer";

export const metadata: Metadata = {
  title: "つながりをたどる",
  description: "競合・取引先・顧客・親会社や子会社。日本の上場企業のつながりを、1社ずつたどって知らない会社に出会う。",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-16 md:px-8 md:pt-16">
      <p className="eyebrow" aria-hidden>Explore</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">つながりをたどる</h1>
      <p className="prose-ja mt-3 text-muted-foreground">
        競合、仕入先と顧客、親会社と子会社。会社をタップすると、その会社のつながりに移ります。
      </p>
      <div className="mt-10">
        <ConnectionExplorer />
      </div>
    </div>
  );
}
