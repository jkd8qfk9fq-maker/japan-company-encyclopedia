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
    <div className="mx-auto max-w-4xl px-5 pt-5 pb-16 md:px-8 md:pt-5">
      <p className="eyebrow" aria-hidden>Network</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">企業ネットワーク</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">誰から仕入れ、誰に売り、誰と競っているか。1社を真ん中に置いてたどれます。</p>
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
