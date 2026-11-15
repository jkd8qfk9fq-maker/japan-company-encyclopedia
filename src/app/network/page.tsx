import type { Metadata } from "next";
import Link from "next/link";
import { NetworkStage } from "@/components/network/network-stage";

export const metadata: Metadata = {
  title: "企業ネットワーク",
  description: "仕入先・顧客・親会社と子会社・競合。日本の上場企業のつながりを、回して、近づいて、たどれる立体の地図で見る。",
  alternates: { canonical: "/network" },
};

export default function NetworkPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-12 pb-16 md:px-8 md:pt-16">
      <p className="eyebrow" aria-hidden>Network</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">企業ネットワーク</h1>
      <p className="prose-ja mt-3 text-muted-foreground">
誰から仕入れ、誰に売り、誰と競っているか。1社を真ん中に置いて、回して眺め、気になる会社へ移れます。
      </p>
      <div className="mt-8">
        <NetworkStage />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        文で読みたいときは <Link href="/explore" className="underline underline-offset-2 hover:text-foreground">つながりをたどる</Link>、1社ずつ出会いたいときは{" "}
        <Link href="/discover" className="underline underline-offset-2 hover:text-foreground">発見</Link> へ。
      </p>
    </div>
  );
}
