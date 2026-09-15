"use client";

import { useState, useTransition } from "react";
import { previewContentEdit, saveContentEdit } from "@/app/admin/(protected)/content-actions";
import type { EditableKind, PreviewResult, SaveResult } from "@/lib/content/content-store";

const FIELD_LABEL: Record<string, string> = {
  code: "証券コード",
  name: "企業名",
  officialName: "商号",
  nameEn: "英語名",
  shortNameEn: "欧文ロゴ",
  description: "説明",
  listings: "上場取引所",
  industries: "業界",
  businesses: "事業構造",
  businessModel: "ビジネスモデル",
  financials: "財務",
  history: "歴史",
  relatedCompanies: "関連企業",
  sources: "出典",
  status: "状態",
  term: "用語",
  reading: "読み",
  relatedTermIds: "関連用語",
};

/**
 * Review, then save. The editor never writes on the first click: the operator
 * sees exactly which fields change (before and after), writes what changed and
 * why, confirms any removed source, and only then saves. After saving, the
 * next steps are git — shown, never run.
 */
export function ReviewPanel({
  kind,
  id,
  version,
  draft,
  onSaved,
}: {
  kind: EditableKind;
  id: string;
  version: string;
  draft: unknown;
  onSaved: (result: Extract<SaveResult, { ok: true }>) => void;
}) {
  // A review belongs to one exact draft object. Any edit creates a new draft,
  // which hides the old review — so the operator never saves something other
  // than what they reviewed (the server re-validates on save regardless).
  const [reviewed, setReviewed] = useState<{ draft: unknown; result: PreviewResult } | null>(null);
  const preview = reviewed && reviewed.draft === draft ? reviewed.result : null;
  const [summary, setSummary] = useState("");
  const [reason, setReason] = useState("");
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const [saveErrors, setSaveErrors] = useState<{ draft: unknown; errors: string[] } | null>(null);
  const [pending, startTransition] = useTransition();

  const review = () =>
    startTransition(async () => {
      setSaveErrors(null);
      setReviewed({ draft, result: await previewContentEdit(kind, id, version, draft) });
    });

  const save = () =>
    startTransition(async () => {
      const result = await saveContentEdit({ kind, id, baseVersion: version, draft, summary, reason, confirmSourceRemoval: confirmRemoval });
      if (result.ok) onSaved(result);
      else setSaveErrors({ draft, errors: result.errors });
    });

  return (
    <section aria-labelledby="review-heading" className="rounded-md border border-foreground p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="review-heading" className="font-semibold">変更を確認して保存</h2>
        <button
          type="button"
          onClick={review}
          disabled={pending}
          className="inline-flex min-h-11 items-center rounded-full border border-foreground px-5 text-sm disabled:opacity-50"
        >
          {pending && !preview ? "確認しています…" : "変更内容を確認"}
        </button>
      </div>

      {preview && !preview.ok && (
        <div role="alert" className="mt-4 rounded-md bg-destructive/10 p-4 text-sm">
          <p className="font-semibold text-destructive">{preview.conflict ? "保存できません（ファイルが変更されています）" : "このままでは保存できません"}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {preview.errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      {preview?.ok && (
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-sm">変更される項目：{preview.changes.map((c) => FIELD_LABEL[c.field] ?? c.field).join("、")}</p>
            <div className="mt-2 space-y-2">
              {preview.changes.map((change) => (
                <details key={change.field} className="rounded-md border border-border">
                  <summary className="cursor-pointer px-3 py-2 text-sm">{FIELD_LABEL[change.field] ?? change.field} の変更前・変更後</summary>
                  <div className="grid gap-3 p-3 lg:grid-cols-2">
                    {(["before", "after"] as const).map((side) => (
                      <div key={side} className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground">{side === "before" ? "変更前" : "変更後"}</p>
                        <pre className="mt-1 max-h-72 overflow-auto rounded bg-paper p-2 text-xs whitespace-pre-wrap break-all">
                          {JSON.stringify(change[side], null, 2) ?? "なし"}
                        </pre>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {preview.removedSources.length > 0 && (
            <label className="flex items-start gap-3 rounded-md border border-destructive p-3 text-sm">
              <input type="checkbox" checked={confirmRemoval} onChange={(e) => setConfirmRemoval(e.target.checked)} className="mt-1 size-4 accent-foreground" />
              <span>
                出典「{preview.removedSources.map((s) => s.title).join("」「")}」を削除します。
                この出典に基づく記述が残っていないことを確認し、削除の理由を下に書きました。
              </span>
            </label>
          )}

          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">変更の要約（1行・必須）</span>
            <input value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={120} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="例：2026年3月期の純利益を有報の数値に訂正" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">理由と根拠（必須）— 確認した出典・ページ、きっかけになった報告など</span>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="例：読者の報告（2026-09-15）を受け、有価証券報告書 p.2 の連結経営指標等で確認" />
          </label>

          {saveErrors && saveErrors.draft === draft && (
            <ul role="alert" className="list-disc space-y-1 rounded-md bg-destructive/10 p-4 pl-8 text-sm">
              {saveErrors.errors.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}

          <button
            type="button"
            onClick={save}
            disabled={pending || !summary.trim() || !reason.trim()}
            className="inline-flex min-h-11 items-center rounded-full bg-foreground px-6 text-sm text-background disabled:opacity-40"
          >
            {pending ? "保存しています…" : "データファイルに保存（改訂記録を作成）"}
          </button>
        </div>
      )}
    </section>
  );
}

export function SavedPanel({ result, onContinue }: { result: Extract<SaveResult, { ok: true }>; onContinue: () => void }) {
  const commands = [
    "npm run content:check",
    "npm run content:diff",
    `git add ${result.files.join(" ")}`,
    `git commit -m "content: ${result.revisionId}"`,
    "git push",
  ];
  return (
    <section role="status" className="rounded-md border border-foreground p-5">
      <h2 className="font-semibold">データファイルに保存し、改訂記録を作成しました</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        まだ公開されていません。変更は手元のファイルにあるだけです。差分を確認してから、コミットとプッシュを行ってください。デプロイで公開されます。
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {result.files.map((f) => <li key={f} className="font-mono text-xs">{f}</li>)}
      </ul>
      <pre className="mt-4 overflow-x-auto rounded-md bg-paper p-3 text-xs leading-6">{commands.join("\n")}</pre>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <a href={`/admin/revisions/${result.revisionId}`} className="link-ink">改訂記録を見る</a>
        <button type="button" onClick={onContinue} className="link-ink">続けて編集する（最新の内容を読み込み）</button>
      </div>
    </section>
  );
}
