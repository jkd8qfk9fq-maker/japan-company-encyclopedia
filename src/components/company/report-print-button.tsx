"use client";

/**
 * The report's one action: print it, or save it as a PDF, with the browser's own print path
 * (JCE-073). JCE-101: the button says so in words — the printout is the PDF this site offers.
 * What the PDF holds follows the same boundary as the screen: the full analysis (5観点の分布・
 * 推移・経済指標) is in it only when this browser's entitlement opens the analysis layer;
 * without one the PDF is the free part of the report, and the gate note itself never prints.
 */
export function ReportPrintButton() {
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
      className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
    >
      印刷・PDFで保存
    </button>
  );
}
