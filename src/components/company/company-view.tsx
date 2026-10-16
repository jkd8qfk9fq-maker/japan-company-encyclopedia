import { AdSlot } from "@/components/ads/ad-slot";
import type { Company } from "@/types/company";
import { formatDateJa } from "@/lib/utils/format";
import { BusinessList } from "./business-list";
import { BusinessModel } from "./business-model";
import { CompanyHero } from "./company-hero";
import { CompanyIndustries } from "./company-industries";
import { CompanySection } from "./company-section";
import { FinancialSection } from "./financial-section";
import { HistoryTimeline } from "./history-timeline";
import { RelatedCompanies } from "./related-companies";
import { SectionNavigation, type SectionLink } from "./section-navigation";

/**
 * The body of a company page — hero to footer — and nothing around it. One component, two callers: the public page
 * and the operator-only draft preview (/admin/drafts/<id>), so a draft is previewed with exactly the code that
 * will show it to readers. What the page wraps around it (structured data, "recently viewed" tracking, the
 * draft banner) stays with the caller.
 */
export function CompanyView({ company }: { company: Company }) {
  const sections: SectionLink[] = [
    { id: "overview", label: "概要" },
    ...(company.businesses.length > 0 ? [{ id: "business", label: "事業" }] : []),
    ...(company.businessModel ? [{ id: "business-model", label: "ビジネスモデル" }] : []),
    { id: "financials", label: "財務" },
    ...(company.history.length > 0 ? [{ id: "history", label: "歴史" }] : []),
    ...(company.industries.length > 0 ? [{ id: "industry", label: "業界" }] : []),
    ...(company.relatedCompanies.length > 0 ? [{ id: "related-companies", label: "関連企業" }] : []),
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

      <CompanySection id="financials" eyebrow="Financials" title="売上と利益">
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

      {company.relatedCompanies.length > 0 && (
        <CompanySection id="related-companies" eyebrow="Related Companies" title="つながりのある企業">
          <RelatedCompanies relations={company.relatedCompanies} sources={company.sources} />
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
