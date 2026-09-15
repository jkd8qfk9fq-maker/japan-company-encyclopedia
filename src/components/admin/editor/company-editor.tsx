"use client";

import { useState } from "react";
import type { SaveResult } from "@/lib/content/content-store";
import type { Company } from "@/types/company";
import { BusinessTreeEditor } from "./business-tree-editor";
import {
  BasicInfoSection,
  BusinessModelSection,
  FinancialsSection,
  HistorySection,
  IndustryRelationsSection,
  SourcesSection,
} from "./company-sections";
import { ReviewPanel, SavedPanel } from "./review-panel";

const SECTIONS = [
  { id: "basic", label: "基本情報" },
  { id: "businesses", label: "事業構造" },
  { id: "business-model", label: "ビジネスモデル" },
  { id: "financials", label: "財務" },
  { id: "history", label: "歴史" },
  { id: "industry", label: "業界・関連企業" },
  { id: "sources", label: "出典" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * The local editor for one company. Holds the whole entry as a draft; nothing
 * is written until the review panel's explicit save. Sources are always one
 * tab away, and every section's source picker links to the originals.
 */
export function CompanyEditor({
  initial,
  version,
  companies,
}: {
  initial: Company;
  version: string;
  companies: { id: string; name: string }[];
}) {
  const [draft, setDraft] = useState<Company>(initial);
  const [section, setSection] = useState<SectionId>("basic");
  const [saved, setSaved] = useState<Extract<SaveResult, { ok: true }> | null>(null);
  const update = (patch: Partial<Company>) => setDraft((d) => ({ ...d, ...patch }));

  if (saved) return <SavedPanel result={saved} onContinue={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <nav aria-label="編集する項目" className="flex flex-wrap gap-1 border-b border-border">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-current={section === s.id ? "true" : undefined}
            onClick={() => setSection(s.id)}
            className={`min-h-11 px-3 text-sm ${section === s.id ? "border-b-2 border-foreground font-semibold" : "text-muted-foreground"}`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div>
        {section === "basic" && <BasicInfoSection draft={draft} update={update} />}
        {section === "businesses" && (
          <BusinessTreeEditor businesses={draft.businesses} sources={draft.sources} onChange={(businesses) => update({ businesses })} />
        )}
        {section === "business-model" && <BusinessModelSection draft={draft} update={update} />}
        {section === "financials" && <FinancialsSection draft={draft} update={update} />}
        {section === "history" && <HistorySection draft={draft} update={update} />}
        {section === "industry" && <IndustryRelationsSection draft={draft} update={update} companies={companies} />}
        {section === "sources" && <SourcesSection sources={draft.sources} onChange={(sources) => update({ sources })} />}
      </div>

      <ReviewPanel kind="company" id={initial.id} version={version} draft={draft} onSaved={setSaved} />
    </div>
  );
}
