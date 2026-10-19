import { AdSlot } from "@/components/ads/ad-slot";
import type { Company } from "@/types/company";
import { companyRepository } from "@/lib/repositories";
import { formatDateJa } from "@/lib/utils/format";
import { BusinessList } from "./business-list";
import { BusinessModel } from "./business-model";
import { CompanyHero } from "./company-hero";
import { CompanyIndustries } from "./company-industries";
import { CompanySection } from "./company-section";
import { ConnectionMap, placeConnections } from "./connection-map";
import { FinancialSection } from "./financial-section";
import { HistoryTimeline } from "./history-timeline";
import { RelatedCompanies, type ResolvedRelation } from "./related-companies";
import { SectionNavigation, type SectionLink } from "./section-navigation";
import { SourceIndex } from "./source-index";

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

  const sections: SectionLink[] = [
    { id: "overview", label: "概要" },
    ...(company.businesses.length > 0 ? [{ id: "business", label: "事業" }] : []),
    ...(company.businessModel ? [{ id: "business-model", label: "ビジネスモデル" }] : []),
    ...(hasConnections ? [{ id: "connections", label: "つながり" }] : []),
    { id: "financials", label: "財務" },
    ...(company.history.length > 0 ? [{ id: "history", label: "歴史" }] : []),
    ...(company.industries.length > 0 ? [{ id: "industry", label: "業界" }] : []),
    ...(company.sources.length > 0 ? [{ id: "sources", label: "出典" }] : []),
  ];

  return (
    <>
      <CompanyHero company={company} />
      <SectionNavigation sections={sections} />

      {company.businesses.length > 0 && (
        <CompanySection id="business" eyebrow="Business" title="何をしている会社？">
          <BusinessList businesses={company.businesses} sources={company.sources} />
        </CompanySection>
      )}

      {company.businessModel && (
        <CompanySection id="business-model" eyebrow="Business Model" title="どうやって儲けている？" tone="paper">
          <BusinessModel model={company.businessModel} sources={company.sources} />
        </CompanySection>
      )}

      {hasConnections && (
        <CompanySection
          id="connections"
          eyebrow="Connections"
          title="どんな企業とつながっている？"
          lead="仕入れる相手、売る相手、資本でつながる相手。有価証券報告書に書かれた関係から描いています。"
        >
          <ConnectionMap company={company} lanes={lanes} />
          <div id="related-companies-list" className="mt-16 scroll-mt-40">
            <h3 className="font-serif text-xl font-semibold">関係の一覧</h3>
            <div className="mt-8">
              <RelatedCompanies relations={relations} inbound={inbound} sources={company.sources} />
            </div>
          </div>
        </CompanySection>
      )}

      <CompanySection id="financials" eyebrow="Financials" title="売上と利益" tone="paper">
        <FinancialSection companyName={company.name} records={company.financials} sources={company.sources} />
      </CompanySection>

      {company.history.length > 0 && (
        <CompanySection
          id="history"
          eyebrow="History"
          title="いまの形になるまで"
          lead="すべての出来事ではなく、現在の事業につながる転換点だけを選んでいます。"
        >
          <HistoryTimeline events={company.history} sources={company.sources} />
        </CompanySection>
      )}

      {company.industries.length > 0 && (
        <CompanySection id="industry" eyebrow="Industry" title="業界のどこにいる？" tone="paper">
          <CompanyIndustries company={company} />
        </CompanySection>
      )}

      {company.sources.length > 0 && (
        <CompanySection id="sources" eyebrow="Sources" title="このページの出典">
          <SourceIndex company={company} hasInbound={inbound.length > 0} />
        </CompanySection>
      )}

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
