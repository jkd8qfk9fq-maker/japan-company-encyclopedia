import type { Metadata } from "next";
import { IndustryFlowMap } from "@/components/industry/industry-flow-map";
import { buildIndustryMap } from "@/lib/industry-map";
import { companyRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "産業マップ",
  description: "日本の産業が取引でどうつながっているかを、掲載企業の有価証券報告書に書かれた関係から描いた地図。",
  alternates: { canonical: "/industries/map" },
};

/**
 * From one company to the whole economy: which industries sell to which, drawn from the ties the companies' own
 * entries state. The aggregation runs here, at build time; the client component only switches what is highlighted.
 */
export default async function IndustryMapPage() {
  const data = buildIndustryMap(await companyRepository.list());
  const pairs = data.flows.reduce((sum, flow) => sum + flow.pairs.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-16 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>
        Industry Map
      </p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[3rem]">産業マップ</h1>
      <p className="prose-ja mt-4 max-w-3xl text-muted-foreground">
        どの業界が、どの業界に売っているか。掲載企業の有価証券報告書に「仕入先」「顧客」として書かれた関係だけを集め、売る側の業界から買う側の業界へ線を引いています。
        線の太さは企業の組の数です。産業を選ぶと、その産業の企業と取引のつながりが開きます。
      </p>

      <section aria-labelledby="flow-heading" className="mt-14">
        <h2 id="flow-heading" className="seal-mark font-serif text-[1.375rem] font-semibold">
          業界から業界へ
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          <span className="figures">{data.industries.length}</span>業界・取引の組
          <span className="figures"> {pairs} </span>
          件。企業は主な業界で数えています。取引の向きが書かれていない関係（取引関係・同業など）は線にしていません。出典は各企業のページにあります。
        </p>
        <div className="mt-8">
          <IndustryFlowMap data={data} />
        </div>
      </section>
    </div>
  );
}
