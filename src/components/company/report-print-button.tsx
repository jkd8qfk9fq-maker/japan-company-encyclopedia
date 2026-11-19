"use client";

// A Client Component: printing is a browser action. The page marks itself so the print style shows only the report.
import { Printer } from "lucide-react";

export function ReportPrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        document.body.dataset.print = "report";
        const clear = () => {
          delete document.body.dataset.print;
          window.removeEventListener("afterprint", clear);
        };
        window.addEventListener("afterprint", clear);
        window.print();
      }}
      className="no-print inline-flex min-h-11 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background"
    >
      <Printer className="size-4" aria-hidden />
      印刷する・PDFに保存
    </button>
  );
}
