import type { Metadata } from "next";
import Link from "next/link";
import { buildRankings, MIN_COMPANIES } from "@/lib/rankings";
import { rankingFigures } from "@/lib/rankings-data";

export const metadata: Metadata = {
  title: "業界ランキング",
  description: "掲載企業の有価証券報告書の数値から集計した、業界の並び（海外売上高比率・売上高の伸び・従業員数の伸び・純利益率）。算出方法と対象企業数つき。",
  alternates: { canonical: "/rankings" },
};

/** 業界ランキング (JCE-062): rebuilt with the site from the released companies, so it follows every data update. */
export default async function RankingsPage() {
  const data = await rankingFigures();
  const rankings = buildRankings(data);
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground">RANKINGS</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">業界ランキング</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        掲載している{data.totals.companies.toLocaleString("ja-JP")}社の有価証券報告書の数値から、業界ごとに集計して並べました。数値が大きい順の並びで、業界の良し悪しを示すものではありません。数字の裏付けとなる会社が{MIN_COMPANIES}社未満の業界は順位をつけていません。
      </p>
      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {rankings.map((r) => (
          <li key={r.id} className="rounded-md border border-border p-5">
            <h2 className="font-serif text-xl font-semibold">
              <Link href={`/rankings/${r.id}`} className="underline-offset-4 hover:underline">{r.title}</Link>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{r.measure}</p>
            <ol className="mt-3 space-y-1 text-sm">
              {r.rows.slice(0, 3).map((row) => (
                <li key={row.id} className="flex justify-between gap-3">
                  <span><span className="figures mr-2 text-muted-foreground">{row.rank}位</span>{row.name}</span>
                  <span className="figures">{r.format(row.value)}</span>
                </li>
              ))}
            </ol>
            <Link href={`/rankings/${r.id}`} className="mt-3 inline-flex min-h-11 items-center text-sm underline underline-offset-2">全{r.rows.length}業界と算出方法</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
