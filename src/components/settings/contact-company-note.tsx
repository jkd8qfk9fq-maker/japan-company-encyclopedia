"use client";

import { Check, Copy } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

const subscribeNothing = () => () => {};

/**
 * On /contact?company=…: names the page the reader came from and gives the line to paste into the form, so a report
 * says which entry it is about. Read from the URL in the browser — the page itself stays static.
 */
export function ContactCompanyNote({ companies }: { companies: { id: string; name: string }[] }) {
  const id = useSyncExternalStore(subscribeNothing, () => new URLSearchParams(window.location.search).get("company"), () => null);
  const [copied, setCopied] = useState(false);
  const company = companies.find((c) => c.id === id);
  if (!company) return null;
  const line = `対象の企業：${company.name}（https://kigyo-hyakka.com/companies/${company.id}/）`;
  return (
    <div className="rounded-md border border-foreground/20 bg-card p-4 text-sm">
      <p className="font-medium">{company.name} のページについての報告ですね。</p>
      <p className="mt-1 text-muted-foreground">フォームの本文の最初に、次の1行を貼り付けてください。どのページのことかが正確に伝わります。</p>
      <p className="mt-3 rounded bg-muted px-3 py-2 font-mono text-xs break-all">{line}</p>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(line).then(() => setCopied(true))}
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm hover:border-foreground"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? "コピーしました" : "この1行をコピー"}
      </button>
    </div>
  );
}
