"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReportPrintButton } from "./report-print-button";
import { T } from "@/components/i18n/t";

/**
 * The print page's screen-only toolbar (JCE-135): the way back to the report, the print action
 * itself (with the same no-dialog guidance as the report's button), and the short version of how
 * a phone saves the sheet as a PDF. It never prints — on paper the report is the whole document.
 */
export function ReportPrintToolbar({ companyId }: { companyId: string }) {
  return (
    <div className="border-b border-border bg-paper print:hidden">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 md:px-8">
        <Link
          href={`/companies/${companyId}/report`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <T m={{ ja: "通常のレポートへ戻る", en: "Back to the report" }} />
        </Link>
        <ReportPrintButton className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background" />
        <p className="w-full text-xs leading-5 text-muted-foreground">
          <T
            m={{
              ja: "印刷用ページです。数字の表は、すべて開いた状態で表示しています。iPhone（Safari）では共有→「プリント」→プレビューをピンチで広げるとPDFで保存できます。Android（Chrome）ではメニュー→共有→「印刷」→「PDFとして保存」です。",
              en: "This is the print page: every number table is shown already expanded. On iPhone (Safari), Share → Print → pinch the preview open to save a PDF. On Android (Chrome), Menu → Share → Print → “Save as PDF”.",
            }}
          />
        </p>
      </div>
    </div>
  );
}
