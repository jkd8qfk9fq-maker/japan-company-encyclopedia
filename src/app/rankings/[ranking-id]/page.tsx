import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildRanking, MIN_COMPANIES, rankingReading, RANKING_IDS, type RankingId } from "@/lib/rankings";
import { rankingFigures } from "@/lib/rankings-data";

type Props = { params: Promise<{ "ranking-id": string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return RANKING_IDS.map((id) => ({ "ranking-id": id }));
}

const isRankingId = (id: string): id is RankingId => (RANKING_IDS as readonly string[]).includes(id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params)["ranking-id"];
  if (!isRankingId(id)) return {};
  const ranking = buildRanking(id, await rankingFigures());
  return {
    title: `${ranking.title}ランキング`,
    description: `${ranking.measure}で業界を並べました。${ranking.formula}。算出方法・対象企業数・決算期つき。`,
    alternates: { canonical: `/rankings/${id}` },
  };
}

export default async function RankingPage({ params }: Props) {
  const id = (await params)["ranking-id"];
  if (!isRankingId(id)) notFound();
  const data = await rankingFigures();
  const ranking = buildRanking(id, data);
  const reading = rankingReading(ranking);
  const companies = ranking.rows.reduce((acc, r) => acc + r.companies, 0);
  const years = new Map<string, number>();
  for (const i of data.industries) for (const y of i.fiscalYears) years.set(y.fiscalYear, (years.get(y.fiscalYear) ?? 0) + y.companies);
  const topYears = [...years.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  const max = Math.max(...ranking.rows.map((r) => Math.abs(r.value)), 0);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8">
      <p className="text-sm"><Link href="/rankings" className="underline underline-offset-2">業界ランキング</Link></p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">{ranking.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{ranking.measure}の大きい順。業界の良し悪しを示すものではありません。</p>

      {reading && (
        <section aria-labelledby="reading" className="mt-8">
          <h2 id="reading" className="font-serif text-lg font-semibold">この並びから読み取れること</h2>
          <p className="prose-ja mt-2 text-sm leading-7 text-muted-foreground">
            首位は{reading.top.name}で、{ranking.format(reading.top.value)}です。順位をつけた{ranking.rows.length}業界の中央値は
            {ranking.format(reading.medianValue)}で、首位との差は{ranking.formatDifference(reading.top.value - reading.medianValue)}あります。対象は
            {ranking.rows.length}業界・計{companies.toLocaleString("ja-JP")}社で、数字はいずれも有価証券報告書の印字値から求めた計算値です。
          </p>
        </section>
      )}

      <ol className="mt-8 divide-y divide-border border-y border-border">
        {ranking.rows.map((row) => (
          <li key={row.id} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm">
            <span className="figures text-muted-foreground">{row.rank}位</span>
            <span>
              <Link href={`/industries/${row.id}`} className="font-medium underline-offset-2 hover:underline">{row.name}</Link>
              <span className="mt-1 block h-1.5 rounded-full bg-muted" aria-hidden>
                <span className="block h-1.5 rounded-full bg-navy" style={{ width: `${max > 0 ? Math.max(2, (Math.abs(row.value) / max) * 100) : 0}%` }} />
              </span>
            </span>
            <span className="text-right">
              <span className="figures font-medium">{ranking.format(row.value)}</span>
              <span className="block text-xs text-muted-foreground">{row.companies}社</span>
            </span>
          </li>
        ))}
      </ol>

      {ranking.excluded.length > 0 && (
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          順位をつけていない業界（数字の裏付けとなる会社が{MIN_COMPANIES}社未満）：
          {ranking.excluded.map((e) => `${e.name}（${e.companies}社）`).join("、")}
        </p>
      )}

      <section aria-labelledby="method" className="mt-10 rounded-md border border-border bg-paper p-5 text-sm leading-7">
        <h2 id="method" className="font-serif text-lg font-semibold">算出方法</h2>
        <dl className="mt-2 grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <dt className="text-muted-foreground">計算式</dt>
          <dd>{ranking.formula}</dd>
          <dt className="text-muted-foreground">対象企業</dt>
          <dd>
            掲載企業{data.totals.companies.toLocaleString("ja-JP")}社のうち、順位をつけた{ranking.rows.length}業界で計{companies.toLocaleString("ja-JP")}社。会社は主な業界1つに数えます。
          </dd>
          <dt className="text-muted-foreground">欠損の扱い</dt>
          <dd>{ranking.basis}</dd>
          <dt className="text-muted-foreground">決算期</dt>
          <dd>
            各社の最新期（有価証券報告書）。多い順に{topYears.map(([y, n]) => `${y} ${n.toLocaleString("ja-JP")}社`).join("、")}。決算期が同じ日とは限りません。
          </dd>
          <dt className="text-muted-foreground">更新</dt>
          <dd>掲載データの更新にあわせて、サイトの公開時に自動で集計し直します。</dd>
        </dl>
      </section>
    </div>
  );
}
