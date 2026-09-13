"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { addReport, MAX_REPORT_LENGTH, REPORT_CATEGORIES, type ContentReport, type ReportCategory } from "@/lib/storage/stores";

const CATEGORY_LABEL: Record<ReportCategory, string> = {
  "company-information": "企業の基本情報",
  "business-information": "事業の説明",
  "financial-information": "売上・利益の数値",
  history: "歴史",
  "industry-classification": "業界の分類",
  other: "その他",
};

/**
 * Readers cannot edit content; they can say what is wrong.
 *
 * HONEST LIMITATION: there is no server yet, so a report is saved on this
 * device only and nobody receives it. The form says that before submission
 * and again in the confirmation. Pretending a report was "sent" would be the
 * product lying about the very mechanism meant to catch its errors.
 */
export function ReportForm({ companies }: { companies: { id: string; name: string }[] }) {
  const params = useSearchParams();
  const initialCompany = companies.some((c) => c.id === params.get("company")) ? params.get("company")! : "";
  const [companyId, setCompanyId] = useState(initialCompany);
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState<ContentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ids = { company: useId(), category: useId(), message: useId(), error: useId() };

  if (submitted) {
    return (
      <div role="status" className="border-t border-foreground pt-8">
        <p className="font-serif text-2xl font-semibold">ご報告ありがとうございます。</p>
        <p className="prose-ja mt-4 text-muted-foreground">
          内容はこの端末に保存されました。現在は試験運用中のため、報告はまだ編集者に自動では届きません。
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          {submitted.companyId && (
            <Link href={`/companies/${submitted.companyId}`} className="link-ink inline-flex min-h-11 items-center">
              企業ページに戻る
            </Link>
          )}
          <button
            type="button"
            className="link-ink inline-flex min-h-11 items-center"
            onClick={() => {
              setSubmitted(null);
              setMessage("");
              setCategory("");
            }}
          >
            続けて報告する
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      aria-describedby={error ? ids.error : undefined}
      onSubmit={(event) => {
        event.preventDefault();
        if (!category) return setError("報告の種類を選んでください。");
        if (message.trim().length === 0) return setError("誤りの内容を入力してください。");
        const report = addReport({
          companyId: companyId || undefined,
          category,
          message,
          pagePath: companyId ? `/companies/${companyId}` : undefined,
        });
        if (!report) return setError("この端末に保存できませんでした。ブラウザの設定で保存が無効になっている可能性があります。");
        setError(null);
        setSubmitted(report);
      }}
      className="space-y-8"
    >
      <div>
        <label htmlFor={ids.company} className="font-medium">対象の企業</label>
        <select
          id={ids.company}
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-base"
        >
          <option value="">企業に関係しない / わからない</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="font-medium">
          報告の種類 <span className="text-sm font-normal text-muted-foreground">（必須）</span>
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {REPORT_CATEGORIES.map((value) => (
            <label
              key={value}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border px-4 text-sm has-[:checked]:border-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink"
            >
              <input
                type="radio"
                name="category"
                value={value}
                checked={category === value}
                onChange={() => setCategory(value)}
                className="size-4 accent-foreground"
              />
              {CATEGORY_LABEL[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={ids.message} className="font-medium">
          誤りの内容 <span className="text-sm font-normal text-muted-foreground">（必須）</span>
        </label>
        <p className="mt-1 text-sm text-muted-foreground">どこが、どう違うか。根拠となる資料があれば、その名前やURLも添えてください。</p>
        <textarea
          id={ids.message}
          value={message}
          maxLength={MAX_REPORT_LENGTH}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="mt-3 w-full rounded-md border border-input bg-background p-3 text-base leading-7"
        />
        <p className="figures mt-1 text-right text-xs text-muted-foreground">
          {message.length} / {MAX_REPORT_LENGTH}
        </p>
      </div>

      {error && (
        <p id={ids.error} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="rounded-md bg-paper p-4 text-sm leading-7 text-muted-foreground">
        試験運用中のため、報告はこの端末に保存され、編集者にはまだ自動で届きません。
      </div>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center rounded-full bg-foreground px-8 text-background"
      >
        報告を保存する
      </button>
    </form>
  );
}
