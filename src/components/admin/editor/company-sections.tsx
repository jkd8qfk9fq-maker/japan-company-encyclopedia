"use client";

import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import {
  INDUSTRY_IDS,
  RELATIONSHIP_KINDS,
  type BusinessModel,
  type BusinessModelStepKind,
  type Company,
  type FinancialRecord,
  type HistoryEvent,
  type IndustryId,
  type RelatedCompany,
} from "@/types/company";
import type { Source } from "@/types/source";
import { Label, LinesField, list, MillionYenField, RowControls, SourceIdsField, TextAreaField, TextField } from "./editor-fields";

type SectionProps = { draft: Company; update: (patch: Partial<Company>) => void };

export function BasicInfoSection({ draft, update }: SectionProps) {
  const status = draft.status;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <TextField label="企業名（表示名）" value={draft.name} onChange={(v) => update({ name: v ?? "" })} />
        <TextField label="商号" value={draft.officialName} onChange={(v) => update({ officialName: v ?? "" })} hint="有報の表紙どおり" />
        <TextField label="英語名" value={draft.nameEn} onChange={(v) => update({ nameEn: v })} optional />
        <TextField label="欧文ロゴ" value={draft.shortNameEn} onChange={(v) => update({ shortNameEn: v })} optional hint="他社と混同しない表記" />
        <TextField label="証券コード" value={draft.code} onChange={(v) => update({ code: v ?? "" })} mono />
      </div>
      <TextAreaField
        label="一文の説明（3秒で何の会社かわかる文）"
        value={draft.description}
        onChange={(v) => update({ description: v ?? "" })}
        limit={90}
        rows={2}
        hint="評価語（大手・世界的な等）は使わない"
      />
      <fieldset className="rounded-md border border-border p-3">
        <legend className="px-1 text-xs font-semibold text-muted-foreground">上場取引所</legend>
        {draft.listings.map((listing, i) => (
          <div key={i} className="mt-2 flex flex-wrap items-end gap-3">
            <label className="block">
              <Label>取引所</Label>
              <select
                value={listing.exchange}
                onChange={(e) => update({ listings: list.set(draft.listings, i, { ...listing, exchange: e.target.value as typeof listing.exchange }) })}
                className="mt-1 h-10 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="tse">東京</option>
                <option value="nse">名古屋</option>
                <option value="fse">福岡</option>
                <option value="sse">札幌</option>
              </select>
            </label>
            <div className="w-40">
              <TextField label="市場" value={listing.market ?? ""} onChange={(v) => update({ listings: list.set(draft.listings, i, { ...listing, market: v ?? "" }) })} />
            </div>
            <RowControls label="取引所" onRemove={() => update({ listings: list.remove(draft.listings, i) })} />
          </div>
        ))}
        <button type="button" onClick={() => update({ listings: [...draft.listings, { exchange: "tse", market: "" }] })} className="mt-3 text-xs text-ink underline">
          ＋ 取引所を追加
        </button>
      </fieldset>
      <fieldset className="rounded-md border border-border p-3">
        <legend className="px-1 text-xs font-semibold text-muted-foreground">状態</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={status.state === "published"} onChange={() => update({ status: { state: "published" } })} className="accent-foreground" />
            公開（未確認の項目なし）
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={status.state === "needs-attention"}
              onChange={() => update({ status: { state: "needs-attention", notes: status.state === "needs-attention" ? status.notes : [""] } })}
              className="accent-foreground"
            />
            要確認
          </label>
        </div>
        {status.state === "needs-attention" && (
          <div className="mt-3">
            <LinesField label="確認できていないこと" value={status.notes} onChange={(v) => update({ status: { state: "needs-attention", notes: v ?? [] } })} />
          </div>
        )}
      </fieldset>
    </div>
  );
}

const STEP_LABEL: Record<BusinessModelStepKind, string> = { company: "会社", offering: "製品・サービス", customer: "顧客", revenue: "売上", profit: "利益" };
const STEP_ORDER: BusinessModelStepKind[] = ["company", "offering", "customer", "revenue", "profit"];

export function BusinessModelSection({ draft, update }: SectionProps) {
  const model = draft.businessModel;
  if (!model) {
    return (
      <button
        type="button"
        className="text-sm text-ink underline"
        onClick={() =>
          update({
            businessModel: {
              description: "",
              products: [],
              customers: [],
              revenueSources: [],
              flow: STEP_ORDER.map((kind) => ({ kind, title: "", description: "" })),
              sourceIds: [],
            },
          })
        }
      >
        ＋ ビジネスモデルを追加
      </button>
    );
  }
  const set = (patch: Partial<BusinessModel>) => update({ businessModel: { ...model, ...patch } });
  return (
    <div className="space-y-4">
      <TextAreaField label="説明" value={model.description} onChange={(v) => set({ description: v ?? "" })} rows={4} />
      <div className="grid gap-3 md:grid-cols-3">
        <LinesField label="製品・サービス" value={model.products} onChange={(v) => set({ products: v ?? [] })} />
        <LinesField label="顧客" value={model.customers} onChange={(v) => set({ customers: v ?? [] })} />
        <LinesField label="売上の源泉" value={model.revenueSources} onChange={(v) => set({ revenueSources: v ?? [] })} />
      </div>
      <div className="space-y-3">
        {model.flow.map((step, i) => (
          <div key={step.kind} className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[7rem_1fr_2fr]">
            <p className="text-sm font-semibold">{i + 1}. {STEP_LABEL[step.kind]}</p>
            <TextField label="見出し" value={step.title} onChange={(v) => set({ flow: list.set(model.flow, i, { ...step, title: v ?? "" }) })} />
            <TextAreaField label="説明" value={step.description} rows={2} onChange={(v) => set({ flow: list.set(model.flow, i, { ...step, description: v ?? "" }) })} />
          </div>
        ))}
      </div>
      <SourceIdsField sources={draft.sources} value={model.sourceIds} onChange={(v) => set({ sourceIds: v })} />
      <button type="button" className="text-xs text-destructive underline" onClick={() => update({ businessModel: undefined })}>
        ビジネスモデルを削除
      </button>
    </div>
  );
}

function FinancialRow({ record, sources, onChange }: { record: FinancialRecord; sources: Source[]; onChange: (r: FinancialRecord) => void }) {
  const set = (patch: Partial<FinancialRecord>) => onChange({ ...record, ...patch });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <TextField label="年度" value={record.fiscalYear} onChange={(v) => set({ fiscalYear: v ?? "" })} hint="例 2026年3月期" />
        <TextField label="期末日" value={record.periodEnd} onChange={(v) => set({ periodEnd: v ?? "" })} hint="YYYY-MM-DD" mono />
        <label className="block">
          <Label>会計基準</Label>
          <select value={record.accountingStandard} onChange={(e) => set({ accountingStandard: e.target.value as FinancialRecord["accountingStandard"] })} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm">
            <option value="jgaap">日本基準</option>
            <option value="ifrs">IFRS</option>
            <option value="usgaap">米国基準</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <MillionYenField label="売上" value={record.revenue} onChange={(v) => set({ revenue: v })} />
        <TextField label="売上の表記（有報どおり）" value={record.revenueLabel} onChange={(v) => set({ revenueLabel: v ?? "" })} />
        <MillionYenField label="純利益" value={record.netIncome} onChange={(v) => set({ netIncome: v })} />
        <TextField label="純利益の表記（有報どおり）" value={record.netIncomeLabel} onChange={(v) => set({ netIncomeLabel: v ?? "" })} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <TextField label="売上の集計範囲" value={record.revenueBasis} onChange={(v) => set({ revenueBasis: v })} optional hint="範囲が年度で変わるときだけ" />
        <TextField label="純利益の集計範囲" value={record.netIncomeBasis} onChange={(v) => set({ netIncomeBasis: v })} optional />
        <TextField label="注記" value={record.note} onChange={(v) => set({ note: v })} optional />
      </div>
      <SourceIdsField sources={sources} value={record.sourceIds} onChange={(v) => set({ sourceIds: v })} />
    </div>
  );
}

export function FinancialsSection({ draft, update }: SectionProps) {
  const rows = draft.financials;
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">金額は有価証券報告書と同じ百万円で入力します（保存時に円に換算）。確認できない数値は空欄にし、状態を「要確認」にします。</p>
      {rows.map((record, i) => (
        <div key={i} className="rounded-md border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">{record.fiscalYear || "（年度未入力）"}</p>
            <RowControls
              label="年度"
              onUp={i > 0 ? () => update({ financials: list.move(rows, i, -1) }) : undefined}
              onDown={i < rows.length - 1 ? () => update({ financials: list.move(rows, i, 1) }) : undefined}
              onRemove={() => update({ financials: list.remove(rows, i) })}
            />
          </div>
          <FinancialRow record={record} sources={draft.sources} onChange={(r) => update({ financials: list.set(rows, i, r) })} />
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-ink underline"
        onClick={() =>
          update({
            financials: [
              ...rows,
              {
                fiscalYear: "",
                periodEnd: "",
                revenue: null,
                revenueLabel: rows.at(-1)?.revenueLabel ?? "",
                netIncome: null,
                netIncomeLabel: rows.at(-1)?.netIncomeLabel ?? "",
                currency: "JPY",
                accountingStandard: rows.at(-1)?.accountingStandard ?? "jgaap",
                sourceIds: [],
              },
            ],
          })
        }
      >
        ＋ 年度を追加
      </button>
    </div>
  );
}

export function HistorySection({ draft, update }: SectionProps) {
  const rows = draft.history;
  const set = (i: number, patch: Partial<HistoryEvent>) => update({ history: list.set(rows, i, { ...rows[i], ...patch }) });
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">すべての出来事ではなく、現在の事業につながる転換点だけを載せます。「意味」には、出典が支える範囲のことだけを書きます。</p>
      {rows.map((event, i) => (
        <div key={i} className="space-y-3 rounded-md border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="grid flex-1 gap-3 md:grid-cols-[7rem_1fr]">
              <label className="block">
                <Label>年</Label>
                <input
                  type="number"
                  value={event.year}
                  onChange={(e) => set(i, { year: Number(e.target.value) })}
                  className="figures mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                />
              </label>
              <TextField label="出来事" value={event.title} onChange={(v) => set(i, { title: v ?? "" })} />
            </div>
            <RowControls
              label="出来事"
              onUp={i > 0 ? () => update({ history: list.move(rows, i, -1) }) : undefined}
              onDown={i < rows.length - 1 ? () => update({ history: list.move(rows, i, 1) }) : undefined}
              onRemove={() => update({ history: list.remove(rows, i) })}
            />
          </div>
          <TextAreaField label="説明" value={event.description} onChange={(v) => set(i, { description: v ?? "" })} rows={2} />
          <TextAreaField label="意味（いまの会社につながる理由）" value={event.significance} onChange={(v) => set(i, { significance: v ?? "" })} rows={2} />
          <SourceIdsField sources={draft.sources} value={event.sourceIds} onChange={(v) => set(i, { sourceIds: v })} />
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-ink underline"
        onClick={() => update({ history: [...rows, { year: new Date().getFullYear(), title: "", description: "", significance: "", sourceIds: [] }] })}
      >
        ＋ 出来事を追加
      </button>
    </div>
  );
}

const RELATIONSHIP_LABEL: Record<RelatedCompany["relationship"], string> = {
  "same-industry": "同じ業界",
  competitor: "競合",
  supplier: "仕入先",
  customer: "顧客",
  technology: "技術のつながり",
  "same-business-model": "似たビジネスモデル",
};

export function IndustryRelationsSection({
  draft,
  update,
  companies,
}: SectionProps & { companies: { id: string; name: string }[] }) {
  const selected = new Map(draft.industries.map((r) => [r.industryId, r]));
  const toggle = (id: IndustryId, on: boolean) =>
    update({ industries: on ? [...draft.industries, { industryId: id }] : draft.industries.filter((r) => r.industryId !== id) });
  const setPrimary = (id: IndustryId) =>
    update({ industries: draft.industries.map((r) => (r.industryId === id ? { industryId: r.industryId, primary: true } : { industryId: r.industryId })) });
  const relations = draft.relatedCompanies;

  return (
    <div className="space-y-6">
      <fieldset className="rounded-md border border-border p-3">
        <legend className="px-1 text-xs font-semibold text-muted-foreground">業界（主な業界を1つ選ぶ）</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_IDS.map((id) => (
            <div key={id} className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={selected.has(id)} onChange={(e) => toggle(id, e.target.checked)} className="accent-foreground" />
                {INDUSTRY_LABELS[id].name}
              </label>
              {selected.has(id) && (
                <label className="flex items-center gap-1 text-xs text-muted-foreground">
                  <input type="radio" name="primary-industry" checked={selected.get(id)?.primary === true} onChange={() => setPrimary(id)} className="accent-foreground" />
                  主
                </label>
              )}
            </div>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <p className="text-sm font-semibold">関連企業</p>
        {relations.map((relation, i) => (
          <div key={i} className="space-y-3 rounded-md border border-border p-4">
            <div className="flex flex-wrap items-end gap-3">
              <label className="block">
                <Label>企業</Label>
                <select
                  value={relation.companyId}
                  onChange={(e) => update({ relatedCompanies: list.set(relations, i, { ...relation, companyId: e.target.value }) })}
                  className="mt-1 h-10 rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option value="">選択</option>
                  {companies.filter((c) => c.id !== draft.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="block">
                <Label>関係</Label>
                <select
                  value={relation.relationship}
                  onChange={(e) => update({ relatedCompanies: list.set(relations, i, { ...relation, relationship: e.target.value as RelatedCompany["relationship"] }) })}
                  className="mt-1 h-10 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {RELATIONSHIP_KINDS.map((k) => <option key={k} value={k}>{RELATIONSHIP_LABEL[k]}</option>)}
                </select>
              </label>
              <RowControls label="関連企業" onRemove={() => update({ relatedCompanies: list.remove(relations, i) })} />
            </div>
            <TextAreaField label="なぜ関係があるのか（1行）" value={relation.description} rows={2} onChange={(v) => update({ relatedCompanies: list.set(relations, i, { ...relation, description: v ?? "" }) })} />
            <SourceIdsField sources={draft.sources} value={relation.sourceIds} onChange={(v) => update({ relatedCompanies: list.set(relations, i, { ...relation, sourceIds: v }) })} />
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-ink underline"
          onClick={() => update({ relatedCompanies: [...relations, { companyId: "", relationship: "competitor", description: "", sourceIds: [] }] })}
        >
          ＋ 関連企業を追加
        </button>
      </div>
    </div>
  );
}

export function SourcesSection({ sources, onChange }: { sources: Source[]; onChange: (next: Source[]) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        一次ソースを優先します（有価証券報告書・決算短信・公式サイト）。Wikipediaは使えません。出典を削除すると、保存時に確認と理由が求められます。
      </p>
      {sources.map((source, i) => (
        <div key={i} className="space-y-3 rounded-md border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="link-ink text-sm break-all">{source.title || "（タイトル未入力）"}</a>
            <RowControls
              label="出典"
              onUp={i > 0 ? () => onChange(list.move(sources, i, -1)) : undefined}
              onDown={i < sources.length - 1 ? () => onChange(list.move(sources, i, 1)) : undefined}
              onRemove={() => onChange(list.remove(sources, i))}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="タイトル" value={source.title} onChange={(v) => onChange(list.set(sources, i, { ...source, title: v ?? "" }))} />
            <TextField label="発行者" value={source.publisher} onChange={(v) => onChange(list.set(sources, i, { ...source, publisher: v ?? "" }))} />
            <TextField label="URL" value={source.url} onChange={(v) => onChange(list.set(sources, i, { ...source, url: v ?? "" }))} mono />
            <TextField label="id" value={source.id} onChange={(v) => onChange(list.set(sources, i, { ...source, id: v ?? "" }))} mono hint="各項目から参照する名前" />
            <TextField label="発行日" value={source.publishedAt} onChange={(v) => onChange(list.set(sources, i, { ...source, publishedAt: v }))} optional hint="YYYY-MM-DD" mono />
            <TextField label="確認日" value={source.accessedAt} onChange={(v) => onChange(list.set(sources, i, { ...source, accessedAt: v ?? "" }))} hint="実際に読んだ日" mono />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-ink underline"
        onClick={() =>
          onChange([
            ...sources,
            { id: `source-${Date.now().toString(36)}`, title: "", publisher: "", url: "https://", accessedAt: new Date().toISOString().slice(0, 10) },
          ])
        }
      >
        ＋ 出典を追加
      </button>
    </div>
  );
}
