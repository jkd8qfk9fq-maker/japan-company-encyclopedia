import Link from "next/link";
import { TrackedLink } from "@/components/analytics/tracked-link";
import type { Company, IndustryId } from "@/types/company";
import { T } from "@/components/i18n/t";

const SHINDAN_URL = "https://shindan.kigyo-hyakka.com/";

/**
 * 就活で業界を調べる順番 (P2-2, 2026-11-17): read how the industry works, line up its largest companies, then check
 * the fit on the 企業タイプ診断. The three are the largest by latest printed revenue — a size, not a recommendation.
 *
 * The examples are drawn from the industry's PRIMARY members: `companies` is every related company (listByIndustry),
 * so an any-relation pick can surface a giant from another industry (日本製鉄 on the IT page, audit m6) and present
 * it as this industry's exemplar. Primary members with revenue are the pool; the full related list is only the
 * fallback when fewer than two primary members carry revenue.
 */
export function JobPath({ industryName, industryId, companies }: { industryName: string; industryId: IndustryId; companies: Company[] }) {
  const latestRevenue = (c: Company) => [...c.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1)?.revenue ?? null;
  const byRevenue = (pool: Company[]) =>
    pool
      .map((c) => ({ c, revenue: latestRevenue(c) }))
      .filter((x): x is { c: Company; revenue: number } => x.revenue !== null)
      .sort((a, b) => b.revenue - a.revenue);
  const primary = byRevenue(companies.filter((c) => c.industries.some((r) => r.industryId === industryId && r.primary)));
  const largest = (primary.length >= 2 ? primary : byRevenue(companies)).slice(0, 3).map((x) => x.c);

  return (
    <section aria-labelledby="job-path" className="mt-10 rounded-md border border-border bg-paper p-5 md:p-6">
      <h3 id="job-path" className="font-serif text-lg font-semibold"><span data-l="ja">就活で{industryName}業界を調べるなら</span><span data-l="en">Researching the {industryName} industry for job hunting</span></h3>
      <ol className="mt-4 space-y-4 text-sm leading-7">
        <li>
          <span data-l="ja"><span className="figures mr-2 font-semibold">1</span>
          <a href="#about" className="underline underline-offset-2"><T m={{ ja: "業界の仕組み", en: "How the industry works" }} /></a>を読み、どこでお金が生まれる業界かをつかむ。
        </span><span data-l="en"><span className="figures mr-2 font-semibold">1</span>Read <a href="#about" className="underline underline-offset-2"><T m={{ ja: "業界の仕組み", en: "How the industry works" }} /></a> to understand where money is made in this industry.</span></li>
        {largest.length >= 2 && (
          <li>
            <span data-l="ja"><span className="figures mr-2 font-semibold">2</span>
            売上高の大きい{largest.map((c) => c.name).join("・")}を
            <Link href={`/compare?ids=${largest.map((c) => c.id).join(",")}`} className="underline underline-offset-2">
              <T m={{ ja: "見比べる", en: "Compare" }} />
            </Link>
            （有価証券報告書の数値。規模の順で、良し悪しの順ではありません）。
          </span><span data-l="en"><span className="figures mr-2 font-semibold">2</span><Link href={`/compare?ids=${largest.map((c) => c.id).join(",")}`} className="underline underline-offset-2">
              <T m={{ ja: "見比べる", en: "Compare" }} />
            </Link> the {largest.map((c) => c.name).join("・")} with the largest revenue (figures from annual securities reports; ordered by size, not by good or bad).</span></li>
        )}
        <li>
          <span data-l="ja"><span className="figures mr-2 font-semibold">{largest.length >= 2 ? 3 : 2}</span>
          <TrackedLink href={SHINDAN_URL} event="encyclopedia_to_diagnosis" className="underline underline-offset-2">
            <T m={{ ja: "企業タイプ診断", en: "Company type quiz" }} />
          </TrackedLink>
          で、自分と近いタイプの産業・企業を確かめる（無料・回答はどこにも送られません）。
          <span className="block text-xs text-muted-foreground"><T m={{ ja: "診断の結果では、プレミアムプランで企業ごとのエントリーシートの書き方の助言も読めます。", en: "Based on your quiz results, the Premium plan also lets you read advice on how to write entry sheets for each company." }} /></span></span><span data-l="en"><span className="figures mr-2 font-semibold">{largest.length >= 2 ? 3 : 2}</span><TrackedLink href={SHINDAN_URL} event="encyclopedia_to_diagnosis" className="underline underline-offset-2">
            <T m={{ ja: "企業タイプ診断", en: "Company type quiz" }} />
          </TrackedLink> to find industries and companies close to your type (free; answers are not sent anywhere). <span className="block text-xs text-muted-foreground"><T m={{ ja: "診断の結果では、プレミアムプランで企業ごとのエントリーシートの書き方の助言も読めます。", en: "Based on your quiz results, the Premium plan also lets you read advice on how to write entry sheets for each company." }} /></span></span>
        </li>
      </ol>
    </section>
  );
}
