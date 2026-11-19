"use client";

/** The report's one action: print it (or save it as PDF) with the browser's own print path (JCE-073). */
export function ReportPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
    >
      印刷する
    </button>
  );
}
