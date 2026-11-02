import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JapanMap } from "@/components/region/japan-map";
import { HeadquartersSource } from "@/components/region/headquarters-source";
import { PREFECTURES, prefectureById } from "@/lib/prefectures";
import { companiesByPrefecture, type PlacedCompany } from "@/lib/regions";

export const dynamicParams = false;

export function generateStaticParams() {
  return PREFECTURES.map((p) => ({ "prefecture-id": p.id }));
}

export async function generateMetadata({ params }: PageProps<"/prefectures/[prefecture-id]">): Promise<Metadata> {
  const prefecture = prefectureById((await params)["prefecture-id"]);
  if (!prefecture) return {};
  const title = `${prefecture.name}に本社がある企業`;
  const description = `${prefecture.name}に本社を置く日本の上場企業の一覧。市区町村ごとに、何をしている会社かを調べられます。`;
  return { title, description, alternates: { canonical: `/prefectures/${prefecture.id}` }, openGraph: { title, description } };
}

const collator = new Intl.Collator("ja-JP");

/**
 * One prefecture: its companies grouped by the municipality of their head office, the largest group first, with a
 * line saying which industries are most common there. Counts only — no figures, nothing that ranks companies.
 */
export default async function PrefecturePage({ params }: PageProps<"/prefectures/[prefecture-id]">) {
  const prefecture = prefectureById((await params)["prefecture-id"]);
  if (!prefecture) notFound();
  const { byPrefecture, counts } = await companiesByPrefecture();
  const companies = byPrefecture.get(prefecture.id) ?? [];

  const groups = new Map<string, PlacedCompany[]>();
  for (const company of companies) groups.set(company.municipality, [...(groups.get(company.municipality) ?? []), company]);
  const municipalities = [...groups.entries()]
    .map(([name, list]) => [name, list.sort((a, b) => a.code.localeCompare(b.code))] as const)
    .sort((a, b) => b[1].length - a[1].length || collator.compare(a[0], b[0]));

  const industryCounts = new Map<string, number>();
  for (const c of companies) if (c.industry) industryCounts.set(c.industry, (industryCounts.get(c.industry) ?? 0) + 1);
  const topIndustries = [...industryCounts].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const index = PREFECTURES.findIndex((p) => p.id === prefecture.id);
  const [previous, next] = [PREFECTURES[index - 1], PREFECTURES[index + 1]];

  return (
    <article className="mx-auto max-w-6xl px-5 pt-10 pb-16 md:px-8 md:pt-14">
      <p className="text-xs tracking-[0.18em] text-muted-foreground">
        <Link href="/prefectures" className="hover:text-foreground hover:underline">
          本社所在地
        </Link>{" "}
        ／ {prefecture.region} ／ {prefecture.name}
      </p>

      <h1 className="mt-6 font-serif text-[1.875rem] font-semibold md:text-[2.5rem]">
        {prefecture.name}
        <span className="ml-2 text-base font-normal text-muted-foreground md:text-lg">に本社がある企業</span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
        <div className="min-w-0">

          <dl className="grid max-w-xl grid-cols-2 gap-x-8 gap-y-4 border-y border-border py-5">
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">掲載企業</dt>
              <dd className="mt-1 font-serif text-[2rem] leading-none font-semibold">
                <span className="figures">{companies.length.toLocaleString("ja-JP")}</span>
                <span className="ml-1 text-sm">社</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">本社のある市区町村</dt>
              <dd className="mt-1 font-serif text-[2rem] leading-none font-semibold">
                <span className="figures">{municipalities.length}</span>
              </dd>
            </div>
            {topIndustries.length > 0 && (
              <div className="col-span-2">
                <dt className="text-xs font-semibold text-muted-foreground">多い業界</dt>
                <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {topIndustries.map(([name, n]) => (
                    <span key={name}>
                      {name}
                      <span className="figures ml-1 text-xs text-muted-foreground">{n}社</span>
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>

          {municipalities.length > 0 ? (
            <div className="mt-10 space-y-10">
              {municipalities.map(([name, list]) => (
                <section key={name} aria-labelledby={`m-${name}`}>
                  <h2 id={`m-${name}`} className="flex items-baseline gap-3 border-b border-foreground pb-1.5">
                    <span className="font-serif text-lg font-semibold">{name}</span>
                    <span className="figures text-xs text-muted-foreground">{list.length}社</span>
                  </h2>
                  <ul className="mt-1 grid gap-x-8 sm:grid-cols-2">
                    {list.map((company) => (
                      <li key={company.id} className="border-b border-border">
                        <Link href={`/companies/${company.id}`} className="group flex min-h-12 items-baseline gap-3 py-2.5">
                          <span className="figures w-10 shrink-0 text-xs text-muted-foreground">{company.code}</span>
                          <span className="min-w-0">
                            <span className="block font-serif text-[0.9375rem] font-semibold group-hover:underline group-hover:underline-offset-4">
                              {company.name}
                            </span>
                            {company.industry && <span className="block text-xs text-muted-foreground">{company.industry}</span>}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-muted-foreground">この都道府県に本社がある企業は、まだ掲載していません。</p>
          )}
        </div>

        <aside className="order-first lg:order-none">
          <div className="lg:sticky lg:top-28">
            {/* Where the prefecture is, at a glance; on a phone small enough to leave the list in view. */}
            <JapanMap counts={counts} current={prefecture.id} className="mx-auto max-w-[13rem] lg:max-w-[18rem]" />
            <nav aria-label="隣の都道府県" className="mt-4 flex justify-between gap-3 text-sm">
              {previous ? (
                <Link href={`/prefectures/${previous.id}`} className="inline-flex min-h-11 items-center hover:underline">
                  ← {previous.name}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/prefectures/${next.id}`} className="inline-flex min-h-11 items-center hover:underline">
                  {next.name} →
                </Link>
              )}
            </nav>
          </div>
        </aside>
      </div>

      <div className="mt-14 max-w-3xl">
        <HeadquartersSource />
      </div>
    </article>
  );
}
