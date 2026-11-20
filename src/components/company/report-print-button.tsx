"use client";

/** The report's one action: print it (or save it as PDF) with the browser's own print path (JCE-073). */
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
      印刷する
    </button>
  );
}
