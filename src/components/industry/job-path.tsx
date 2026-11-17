import Link from "next/link";
import { TrackedLink } from "@/components/analytics/tracked-link";
import type { Company } from "@/types/company";

const SHINDAN_URL = "https://shindan.kigyo-hyakka.com/";

/**
 * 就活で業界を調べる順番 (P2-2, 2026-11-17): read how the industry works, line up its largest companies, then check
 * the fit on the 企業タイプ診断. The three are the largest by latest printed revenue — a size, not a recommendation.
 */
export function JobPath({ industryName, companies }: { industryName: string; companies: Company[] }) {
  const latestRevenue = (c: Company) => [...c.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1)?.revenue ?? null;
  const largest = companies
    .map((c) => ({ c, revenue: latestRevenue(c) }))
    .filter((x): x is { c: Company; revenue: number } => x.revenue !== null)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3)
    .map((x) => x.c);

  return (
    <section aria-labelledby="job-path" className="mt-10 rounded-md border border-border bg-paper p-5 md:p-6">
      <h3 id="job-path" className="font-serif text-lg font-semibold">就活で{industryName}業界を調べるなら</h3>
      <ol className="mt-4 space-y-4 text-sm leading-7">
        <li>
          <span className="figures mr-2 font-semibold">1</span>
          <a href="#about" className="underline underline-offset-2">業界の仕組み</a>を読み、どこでお金が生まれる業界かをつかむ。
        </li>
        {largest.length >= 2 && (
          <li>
            <span className="figures mr-2 font-semibold">2</span>
            売上高の大きい{largest.map((c) => c.name).join("・")}を
            <Link href={`/compare?ids=${largest.map((c) => c.id).join(",")}`} className="underline underline-offset-2">
              見比べる
            </Link>
            （有価証券報告書の数値。規模の順で、良し悪しの順ではありません）。
          </li>
        )}
        <li>
          <span className="figures mr-2 font-semibold">{largest.length >= 2 ? 3 : 2}</span>
          <TrackedLink href={SHINDAN_URL} event="encyclopedia_to_diagnosis" className="underline underline-offset-2">
            企業タイプ診断
          </TrackedLink>
          で、自分と近いタイプの産業・企業を確かめる（無料・回答はどこにも送られません）。
          <span className="block text-xs text-muted-foreground">診断の結果では、プレミアムプランで企業ごとのエントリーシートの書き方の助言も読めます。</span>
        </li>
      </ol>
    </section>
  );
}
