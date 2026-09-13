import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RichText } from "@/components/rich-text/rich-text";
import { companyRepository, industryRepository } from "@/lib/repositories";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company } from "@/types/company";

/**
 * "業界" — where the company sits. For an industry whose structure has been
 * researched, the reader sees the stage the company occupies; for one that has
 * not, only the label and its other companies. Either way the section links
 * into the industry, closing the Company → Industry → Company loop.
 */
export async function CompanyIndustries({ company }: { company: Company }) {
  const entries = await Promise.all(
    company.industries.map(async (ref) => {
      const industry = await industryRepository.get(ref.industryId);
      const peers = (await companyRepository.listByIndustry(ref.industryId)).filter((c) => c.id !== company.id);
      const placements = industry?.categories.filter((c) => c.companyIds.includes(company.id)) ?? [];
      return { ref, industry, peers, placements };
    }),
  );

  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {entries.map(({ ref, industry, peers, placements }) => (
        <li key={ref.industryId} className="flex flex-col rounded-md border border-border p-6 md:p-8">
          <p className="eyebrow" aria-hidden>
            {INDUSTRY_LABELS[ref.industryId].nameEn}
          </p>
          <h3 className="mt-2 font-serif text-2xl font-semibold">
            {INDUSTRY_LABELS[ref.industryId].name}
            {ref.primary && <span className="ml-3 align-middle text-xs font-normal text-muted-foreground">主な業界</span>}
          </h3>

          {placements.length > 0 && industry && (
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">業界の中での位置</p>
              <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {industry.categories.map((category, i) => {
                  const here = placements.some((p) => p.id === category.id);
                  return (
                    <li key={category.id} className="flex items-center gap-2">
                      {i > 0 && industry.structure === "chain" && (
                        <ArrowRight aria-hidden className="size-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          here
                            ? "rounded-full bg-foreground px-3 py-1 text-background"
                            : "rounded-full border border-border px-3 py-1 text-muted-foreground"
                        }
                      >
                        {category.name}
                        {here && <span className="sr-only">（{company.name}はここ）</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {industry && (
            <p className="mt-5 line-clamp-3 text-[0.9375rem] leading-7 text-muted-foreground">
              <RichText text={industry.description} />
            </p>
          )}

          {peers.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">同じ業界の企業</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {peers.slice(0, 6).map((peer) => (
                  <li key={peer.id}>
                    <Link href={`/companies/${peer.id}`} className="link-ink">
                      {peer.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/industries/${ref.industryId}`}
            className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-6 text-sm font-medium"
          >
            {INDUSTRY_LABELS[ref.industryId].name}業界を見る
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
