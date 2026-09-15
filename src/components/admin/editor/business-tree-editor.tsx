"use client";

import type { Business } from "@/types/company";
import type { Source } from "@/types/source";
import { LinesField, list, RowControls, SourceIdsField, TextAreaField, TextField } from "./editor-fields";

function newBusiness(): Business {
  return { id: `new-business-${Date.now().toString(36)}`, name: "", description: "", sourceIds: [] };
}

function BusinessNode({
  business,
  depth,
  sources,
  onChange,
  controls,
}: {
  business: Business;
  depth: number;
  sources: Source[];
  onChange: (next: Business) => void;
  controls: React.ReactNode;
}) {
  const set = <K extends keyof Business>(key: K, value: Business[K]) => onChange({ ...business, [key]: value });
  const children = business.children ?? [];

  return (
    <div className={`rounded-md border border-border p-4 ${depth > 0 ? "bg-paper" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold">
          {depth === 0 ? "事業" : "下位の事業"}：{business.name || "（名称未入力）"}
        </p>
        {controls}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <TextField label="名称" value={business.name} onChange={(v) => set("name", v ?? "")} />
        <TextField label="図での短い名称" value={business.shortName} onChange={(v) => set("shortName", v)} optional />
        <TextField label="id" value={business.id} onChange={(v) => set("id", v ?? "")} hint="英小文字とハイフン" mono />
      </div>
      <div className="mt-3 space-y-3">
        <TextAreaField label="説明" value={business.description} onChange={(v) => set("description", v ?? "")} rows={3} />
        <div className="grid gap-3 md:grid-cols-2">
          <LinesField label="主な製品・サービス" value={business.products} onChange={(v) => set("products", v)} optional />
          <LinesField label="主な顧客" value={business.customers} onChange={(v) => set("customers", v)} optional />
        </div>
        <SourceIdsField sources={sources} value={business.sourceIds} onChange={(v) => set("sourceIds", v)} />
      </div>

      {children.length > 0 && (
        <div className="mt-4 space-y-3 border-l-2 border-border pl-4">
          {children.map((child, i) => (
            <BusinessNode
              key={i}
              business={child}
              depth={depth + 1}
              sources={sources}
              onChange={(next) => set("children", list.set(children, i, next))}
              controls={
                <RowControls
                  label={child.name || "事業"}
                  onUp={i > 0 ? () => set("children", list.move(children, i, -1)) : undefined}
                  onDown={i < children.length - 1 ? () => set("children", list.move(children, i, 1)) : undefined}
                  onRemove={() => {
                    const next = list.remove(children, i);
                    set("children", next.length > 0 ? next : undefined);
                  }}
                />
              }
            />
          ))}
        </div>
      )}
      <button type="button" onClick={() => set("children", [...children, newBusiness()])} className="mt-3 text-xs text-ink underline">
        ＋ 下位の事業を追加（会社自身が説明している場合のみ）
      </button>
    </div>
  );
}

/**
 * The business structure — recursive, because the structure is
 * company-specific. Order matters: the diagram draws top-level businesses in
 * this order (largest segment revenue first, per the research protocol).
 */
export function BusinessTreeEditor({
  businesses,
  sources,
  onChange,
}: {
  businesses: Business[];
  sources: Source[];
  onChange: (next: Business[]) => void;
}) {
  return (
    <div className="space-y-4">
      {businesses.map((business, i) => (
        <BusinessNode
          key={i}
          business={business}
          depth={0}
          sources={sources}
          onChange={(next) => onChange(list.set(businesses, i, next))}
          controls={
            <RowControls
              label={business.name || "事業"}
              onUp={i > 0 ? () => onChange(list.move(businesses, i, -1)) : undefined}
              onDown={i < businesses.length - 1 ? () => onChange(list.move(businesses, i, 1)) : undefined}
              onRemove={() => onChange(list.remove(businesses, i))}
            />
          }
        />
      ))}
      <button type="button" onClick={() => onChange([...businesses, newBusiness()])} className="text-sm text-ink underline">
        ＋ 事業を追加
      </button>
    </div>
  );
}
