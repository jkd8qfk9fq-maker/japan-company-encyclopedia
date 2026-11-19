"use client";

// A Client Component: printing is a browser action.
import { Printer } from "lucide-react";

/**
 * Prints the report alone. The report is copied into a container directly under <body> and the print style hides
 * body's other children — a plain child selector, because the earlier rule (hide everything that neither is nor holds
 * the report, via :has()) printed a blank page when Chrome laid the print out with custom margins (QA, 2026-11-19).
 */
/** `target` is the id of what to print: a company's report, or the 見比べ table (JCE-073). */
export function ReportPrintButton({ target = "company-report" }: { target?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const report = document.getElementById(target);
        if (!report) return;
        const root = document.documentElement;
        // Paper is white: in dark mode the report's light text would vanish on it, so the theme is lifted while printing.
        const wasDark = root.classList.contains("dark");
        root.classList.remove("dark");
        const sheet = document.createElement("div");
        sheet.id = "report-print-root";
        const copy = report.cloneNode(true) as HTMLElement;
        copy.removeAttribute("id");
        sheet.appendChild(copy);
        document.body.appendChild(sheet);
        document.body.dataset.print = "report";
        const restore = () => {
          delete document.body.dataset.print;
          sheet.remove();
          if (wasDark) root.classList.add("dark");
          window.removeEventListener("afterprint", restore);
        };
        window.addEventListener("afterprint", restore);
        window.print();
      }}
      className="no-print inline-flex min-h-11 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background"
    >
      <Printer className="size-4" aria-hidden />
      印刷する・PDFに保存
    </button>
  );
}
