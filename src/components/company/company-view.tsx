import { AdSlot } from "@/components/ads/ad-slot";
import type { Company } from "@/types/company";
import { companyRepository, headquartersRepository } from "@/lib/repositories";
import { formatDateJa } from "@/lib/utils/format";
import { companyMetrics } from "@/lib/company-metrics";
import { industryComparison } from "@/lib/industry-comparison";
import { buildValueChain } from "@/lib/value-chain";
import { SourceList } from "@/components/sources/source-list";
import { BusinessList } from "./business-list";
import { BusinessModel } from "./business-model";
import { BusinessStructure } from "./business-structure";
import { CompanyHero } from "./company-hero";
import { CompanyIndustries } from "./company-industries";
import { CompanyMetrics } from "./company-metrics";
import { CompanySection } from "./company-section";
import { ConnectionMap, placeConnections } from "./connection-map";
import { ConnectionNetwork } from "./connection-network";
import { FinancialSection } from "./financial-section";
import { IndustryComparisonBlock } from "./industry-comparison";
import { PremiumGate } from "./premium-gate";
import { HistoryTimeline } from "./history-timeline";
import { PerspectivesSection } from "./perspectives-section";
import { RelatedCompanies, type ResolvedRelation } from "./related-companies";
import { SectionTabs, type SectionLink } from "@/components/navigation/section-tabs";
import { SourceIndex } from "./source-index";
import { ValueChainFlow } from "./value-chain-flow";

/**
 * The body of a company page — hero to footer — and nothing around it. One component, two callers: the public page
 * and the operator-only draft preview (/admin/drafts/<id>), so a draft is previewed with exactly the code that
 * will show it to readers. What the page wraps around it (structured data, "recently viewed" tracking, the
 * draft banner) stays with the caller.
 *
 * The order is the order understanding deepens: what it is (hero) → what it is made of → how it earns → who it is
 * tied to → how big it has been → how it got here → its industry → what all of this rests on. Every section after
 * the hero appears only when the entry has its data, so a thin entry is a short page, not a page of empty frames.
 */
export async function CompanyView({ company }: { company: Company }) {
  // Only released companies: a tie to an unreleased entry has no page to link to, and would be a dead box.
  const outgoingCompanies = new Map(
    (await companyRepository.getMany(company.relatedCompanies.map((r) => r.companyId))).map((c) => [c.id, c]),
  );
  const relations: ResolvedRelation[] = company.relatedCompanies.flatMap((relation) => {
    const related = outgoingCompanies.get(relation.companyId);
    return related ? [{ company: related, relation }] : [];
  });
  const inbound: ResolvedRelation[] = (await companyRepository.listRelatingTo(company.id)).filter(
    ({ company: other }) => other.id !== company.id,
  );
  const lanes = placeConnections(
    relations.map((r) => ({ company: r.company, kind: r.relation.relationship })),
    inbound.map((r) => ({ company: r.company, kind: r.relation.relationship })),
  );
  const hasConnections = relations.length > 0 || inbound.length > 0;
  const chain = buildValueChain(company);
  const metrics = companyMetrics(company);
  // 業界比較 (JCE-043): the company among the released companies of its industry, computed at build time.
  const comparison = industryComparison(company, await companyRepository.list());
  const chainSourceIds = [
    ...new Set([
      ...company.businesses.flatMap((b) => b.sourceIds),
      ...(company.businessModel?.sourceIds ?? []),
      ...(company.segmentRevenue?.sourceIds ?? []),
    ]),
  ];

  // The hero is above the tabs and always shown, so it is not one of them.
  const sections: SectionLink[] = [
    ...(company.businesses.length > 0 ? [{ id: "business", label: "事業" }] : []),
    ...(chain ? [{ id: "value-chain", label: "モノとお金" }] : []),
    ...(company.businessModel ? [{ id: "business-model", label: "ビジネスモデル" }] : []),
    ...(company.perspectives ? [{ id: "perspectives", label: "戦略と強み" }] : []),
    ...(hasConnections ? [{ id: "connections", label: "つながり" }] : []),
    { id: "financials", label: "財務" },
    ...(company.history.length > 0 ? [{ id: "history", label: "歴史" }] : []),
    ...(company.industries.length > 0 ? [{ id: "industry", label: "業界" }] : []),
    ...(company.sources.length > 0 ? [{ id: "sources", label: "出典" }] : []),
  ];

  return (
    <>
      <CompanyHero company={company} headquarters={await headquartersRepository.get(company.id)} />
      <SectionTabs sections={sections} containerId="company-sections" tabbed="mobile" />
      <div id="company-sections">

      {company.businesses.length > 0 && (
        <CompanySection
          id="business"
          eyebrow="Business Structure"
          title="何でできている会社か"
          lead="図は事業の全体像、下のカードはそれぞれの事業です。区分は同社の開示に基づきます。"
          tone="paper"
        >
          <BusinessStructure company={company} />
          <div className="mt-12">
            <BusinessList businesses={company.businesses} sources={company.sources} />
          </div>
        </CompanySection>
      )}

      {chain && (
        <CompanySection
          id="value-chain"
          eyebrow="Value Chain"
          title="モノとお金の流れ"
          lead="調達から事業、顧客までのモノの流れと、その逆に流れるお金を描いています。カードを選ぶと、つながりと詳しい説明が下に出ます。線の太さは取引の大きさを表しません（有価証券報告書に金額がないため）。"
        >
          <ValueChainFlow chain={chain} companyName={company.name} />
          <SourceList sources={company.sources} sourceIds={chainSourceIds} className="mt-4" />
        </CompanySection>
      )}

      {company.businessModel && (
        <CompanySection
          id="business-model"
          eyebrow="Business Model"
          title="つくって、届けて、売上になるまで"
          lead="会社から利益まで、事業の流れを順に並べています。有価証券報告書で確かめられた段階だけを描いています。"
        >
          <BusinessModel model={company.businessModel} sources={company.sources} />
        </CompanySection>
      )}

      {company.perspectives && (
        <CompanySection id="perspectives" eyebrow="Strategy" title="これからどうする？何が強み？">
          <PerspectivesSection perspectives={company.perspectives} sources={company.sources} />
        </CompanySection>
      )}

      {hasConnections && (
        <CompanySection
          id="connections"
          eyebrow="Connections"
          title="産業の中の位置と、つながり"
          lead="線は、有価証券報告書に書かれた関係だけです。線の種類で関係の性質を区別します。"
          tone="paper"
        >
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div>
              <div className="hidden rounded-md border border-border bg-card p-4 md:block">
                <ConnectionNetwork company={company} lanes={lanes} />
              </div>
              <ul aria-label="線の種類" className="mt-3 hidden flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground md:flex">
                <li className="flex items-center gap-2"><span aria-hidden className="h-0 w-8 border-t-[1.5px] border-foreground" />資本関係</li>
                <li className="flex items-center gap-2"><span aria-hidden className="h-0 w-8 border-t-[2.5px] border-ink" />取引（仕入先・顧客）</li>
                <li className="flex items-center gap-2"><span aria-hidden className="h-0 w-8 border-t-[1.5px] border-dashed border-muted-foreground" />向きの書かれていない関係</li>
              </ul>
              <div className="md:hidden">
                <ConnectionMap company={company} lanes={lanes} />
              </div>
            </div>
            <div id="related-companies-list" className="scroll-mt-40">
              <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">関係の一覧</h3>
              <div className="mt-3">
                <RelatedCompanies relations={relations} inbound={inbound} sources={company.sources} />
              </div>
            </div>
          </div>
        </CompanySection>
      )}

      <CompanySection
        id="financials"
        eyebrow="Financials"
        title="売上と利益の推移"
        lead="規模の違う2つの数字を同じ目盛りに載せると利益が見えなくなるため、別々のグラフにしています。"
      >
        {metrics && <CompanyMetrics metrics={metrics} sources={company.sources} />}
        {comparison && (
          <div className="mb-12">
            <PremiumGate
              title="業界比較"
              teaser={`${comparison.industryName}業界の掲載企業${comparison.members}社の中で、この会社の売上高・純利益率・5期の伸び・海外売上高比率・平均年間給与がどこに位置するか（順位と中央値との差）と、5期の売上高の推移を業界と並べて見られます。`}
            >
              <IndustryComparisonBlock comparison={comparison} />
            </PremiumGate>
          </div>
        )}
        <FinancialSection companyName={company.name} records={company.financials} sources={company.sources} />
      </CompanySection>

      {company.history.length > 0 && (
        <CompanySection
          id="history"
          eyebrow="History"
          title="いまの形になるまで"
          lead="すべての出来事ではなく、現在の事業につながる転換点だけを選んでいます。"
          tone="paper"
        >
          <HistoryTimeline events={company.history} sources={company.sources} />
        </CompanySection>
      )}

      {company.industries.length > 0 && (
        <CompanySection id="industry" eyebrow="Industry" title="業界のどこにいる？">
          <CompanyIndustries company={company} />
        </CompanySection>
      )}

      {company.sources.length > 0 && (
        <CompanySection id="sources" eyebrow="Sources" title="出典" className="border-t border-foreground">
          <SourceIndex company={company} hasInbound={inbound.length > 0} />
        </CompanySection>
      )}

      </div>

      <AdSlot placement="company-bottom" />

      <footer className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="border-t border-border pt-8 text-xs leading-6 text-muted-foreground">
          <p className="figures">最終更新 {formatDateJa(company.updatedAt)}</p>
          <p>
            この項目は公開資料に基づいて作成されています。誤りを見つけた場合は、ページ上部の「誤りを報告」からお知らせください。
          </p>
        </div>
      </footer>
    </>
  );
}
