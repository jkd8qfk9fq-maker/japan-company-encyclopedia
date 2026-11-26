"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";

/**
 * The report's one action: print it, or save it as a PDF, with the browser's own print path
 * (JCE-073). JCE-101: the button says so in words — the printout is the PDF this site offers.
 * What the PDF holds follows the same boundary as the screen: the full analysis (5観点の分布・
 * 推移・経済指標) is in it only when this browser's entitlement opens the analysis layer;
 * without one the PDF is the free part of the report, and the gate note itself never prints.
 *
 * JCE-114: on screen the report folds its full tables into 「数字の表」 disclosures so the page reads as charts
 * and a summary; on paper every fold is opened, so the PDF always carries every number. This runs for any print —
 * the button or the browser's own menu — and puts each fold back as the reader left it.
 */
export function ReportPrintButton({ className }: { className?: string }) {
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = [...document.querySelectorAll<HTMLDetailsElement>(".company-report details:not([open])")];
      opened.forEach((d) => (d.open = true));
    };
    const after = () => {
      opened.forEach((d) => (d.open = false));
      opened = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        // Paper is white: in dark mode the report's light text would vanish on it, so the theme is lifted
        // while printing and restored afterwards (print QA across company types, 2026-11-19).
        const root = document.documentElement;
        const wasDark = root.classList.contains("dark");
        root.classList.remove("dark");
        const restore = () => {
          if (wasDark) root.classList.add("dark");
          window.removeEventListener("afterprint", restore);
        };
        window.addEventListener("afterprint", restore);
        window.print();
      }}
      className={className ?? "inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"}
    >
      <span data-l="ja"><Download className="size-4" aria-hidden />
      印刷・PDFで保存
    </span><span data-l="en"><Download className="size-4" aria-hidden />Print / save as PDF</span></button>
  );
}
