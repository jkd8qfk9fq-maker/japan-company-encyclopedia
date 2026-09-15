"use client";

import { useState } from "react";
import type { SaveResult } from "@/lib/content/content-store";
import type { Term } from "@/types/term";
import { SourcesSection } from "./company-sections";
import { TextAreaField, TextField } from "./editor-fields";
import { ReviewPanel, SavedPanel } from "./review-panel";

export function TermEditor({ initial, version, terms }: { initial: Term; version: string; terms: { id: string; term: string }[] }) {
  const [draft, setDraft] = useState<Term>(initial);
  const [saved, setSaved] = useState<Extract<SaveResult, { ok: true }> | null>(null);
  const update = (patch: Partial<Term>) => setDraft((d) => ({ ...d, ...patch }));
  const related = new Set(draft.relatedTermIds ?? []);

  if (saved) return <SavedPanel result={saved} onContinue={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        <TextField label="用語" value={draft.term} onChange={(v) => update({ term: v ?? "" })} />
        <TextField label="読み（ひらがな）" value={draft.reading} onChange={(v) => update({ reading: v })} optional hint="出典が示している場合のみ" />
      </div>
      <TextAreaField label="説明（その場で表示される短い定義）" value={draft.description} onChange={(v) => update({ description: v ?? "" })} limit={160} rows={3} />
      <fieldset className="rounded-md border border-border p-3">
        <legend className="px-1 text-xs font-semibold text-muted-foreground">関連用語（任意）</legend>
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {terms.filter((t) => t.id !== draft.id).map((t) => (
            <label key={t.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={related.has(t.id)}
                onChange={(e) => {
                  const next = e.target.checked ? [...related, t.id] : [...related].filter((id) => id !== t.id);
                  update({ relatedTermIds: next.length > 0 ? next : undefined });
                }}
                className="accent-foreground"
              />
              {t.term}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <h2 className="mb-3 text-sm font-semibold">出典</h2>
        <SourcesSection sources={draft.sources} onChange={(sources) => update({ sources })} />
      </div>
      <ReviewPanel kind="term" id={initial.id} version={version} draft={draft} onSaved={setSaved} />
    </div>
  );
}
