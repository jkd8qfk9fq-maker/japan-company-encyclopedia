"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useId, useState } from "react";
import { submitReport, type SubmitReportState } from "@/app/report/actions";
import { MAX_REPORT_LENGTH, REPORT_CATEGORIES, REPORT_CATEGORY_LABEL } from "@/lib/reports/report-types";

/**
 * Readers cannot edit content; they can say what is wrong. The report goes to
 * the server and appears in the editor's admin (JCE-008), so the confirmation
 * can truthfully say it reached the editor.
 */
export function ReportForm({ companies }: { companies: { id: string; name: string }[] }) {
  const params = useSearchParams();
  const requested = params.get("company");
  const initialCompany = companies.some((c) => c.id === requested) ? requested! : "";
  // Remounting the body with a new key resets the action state and every field.
  const [round, setRound] = useState(0);
  return (
    <ReportFormBody
      key={round}
      companies={companies}
      initialCompany={initialCompany}
      onAnother={() => setRound((r) => r + 1)}
    />
  );
}

function ReportFormBody({
  companies,
  initialCompany,
  onAnother,
}: {
  companies: { id: string; name: string }[];
  initialCompany: string;
  onAnother: () => void;
}) {
  const [state, action, pending] = useActionState<SubmitReportState, FormData>(submitReport, { status: "idle" });
  const [companyId, setCompanyId] = useState(initialCompany);
  const [message, setMessage] = useState("");
  // Controlled, so a server-side error (which resets uncontrolled fields) does not make the reader choose again.
  const [category, setCategory] = useState("");
  const ids = { company: useId(), message: useId(), error: useId() };

  if (state.status === "sent") {
    return (
      <div role="status" className="border-t border-foreground pt-8">
        <p className="font-serif text-2xl font-semibold">ご報告ありがとうございます。</p>
        <p className="prose-ja mt-4 text-muted-foreground">
          報告は編集者に届きました。内容を資料で確認し、誤りであれば訂正して、訂正の記録を残します。
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          {companyId && (
            <Link href={`/companies/${companyId}`} className="link-ink inline-flex min-h-11 items-center">
              企業ページに戻る
            </Link>
          )}
          <button
            type="button"
            className="link-ink inline-flex min-h-11 items-center"
            onClick={onAnother}
          >
            続けて報告する
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      aria-describedby={state.status === "error" ? ids.error : undefined}
      className="space-y-8"
    >
      {/* Honeypot: hidden from people and assistive technology, visible to naive bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div>
        <label htmlFor={ids.company} className="font-medium">対象の企業</label>
        <select
          id={ids.company}
          name="companyId"
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
                required
                checked={category === value}
                onChange={() => setCategory(value)}
                className="size-4 accent-foreground"
              />
              {REPORT_CATEGORY_LABEL[value]}
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
          name="message"
          required
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

      {state.status === "error" && (
        <p id={ids.error} role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <p className="text-sm leading-7 text-muted-foreground">
        報告は編集者だけが読みます。お名前や連絡先は不要です。
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center rounded-full bg-foreground px-8 text-background disabled:opacity-60"
      >
        {pending ? "送信しています…" : "報告を送る"}
      </button>
    </form>
  );
}
