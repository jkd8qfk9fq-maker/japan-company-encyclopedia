import type { Metadata } from "next";
import Link from "next/link";
import { JapanMap, JapanMapLegend } from "@/components/region/japan-map";
import { HeadquartersSource } from "@/components/region/headquarters-source";
import { PREFECTURES, REGIONS } from "@/lib/prefectures";
import { companiesByPrefecture } from "@/lib/regions";

export const metadata: Metadata = {
  title: "本社所在地から探す",
  description: "日本の上場企業を、本社のある都道府県から探す。地図の都道府県を選ぶと、そこに本社がある企業の一覧が開きます。",
  alternates: { canonical: "/prefectures" },
};

/**
 * Japan by head office: the map, and the same 47 prefectures as a list grouped by region, so every prefecture is a
 * plain link for readers who do not use the map (and for Tokyo, which is small on it).
 */
export default async function PrefecturesPage() {
  const { counts, placedCount, unplaced } = await companiesByPrefecture();
  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 pb-16 md:px-8 md:pt-14">
      <p className="eyebrow" aria-hidden>
        Head Offices
      </p>
      <h1 className="mt-2 font-serif text-[1.875rem] font-semibold md:text-[2.5rem]">本社所在地から探す</h1>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-muted-foreground">
        掲載している<span className="figures">{placedCount.toLocaleString("ja-JP")}</span>
        社を、本社のある都道府県で分けました。色が濃いほど本社が多い都道府県です。都道府県を選ぶと、そこに本社がある企業が開きます。
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
        <figure className="m-0">
          <JapanMap counts={counts} />
          <figcaption className="mt-3">
            <JapanMapLegend />
          </figcaption>
        </figure>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {REGIONS.map((region) => (
            <section key={region} aria-labelledby={`region-${region}`}>
              <h2 id={`region-${region}`} className="border-b border-foreground pb-1.5 text-xs font-semibold tracking-[0.12em]">
                {region}
              </h2>
              <ul className="mt-1">
                {PREFECTURES.filter((p) => p.region === region).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/prefectures/${p.id}`}
                      className="flex min-h-9 items-baseline justify-between gap-3 border-b border-border py-1.5 text-sm hover:underline hover:underline-offset-4"
                    >
                      <span>{p.name}</span>
                      <span className="figures text-xs text-muted-foreground">{(counts[p.id] ?? 0).toLocaleString("ja-JP")}社</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
        <HeadquartersSource unplaced={unplaced} />
      </div>
    </div>
  );
}
