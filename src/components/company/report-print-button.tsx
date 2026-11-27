"use client";

import { useEffect, useReducer, useRef } from "react";
import Link from "next/link";
import { Download, X } from "lucide-react";
import { nextPrintPanelState, PRINT_FALLBACK_DELAY_MS, type PrintPanelState } from "@/lib/print-flow";

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
 *
 * JCE-135: window.print() alone is not a path — in in-app browsers (WKWebView) and home-screen
 * (standalone) web apps it can silently do nothing, and the reader is left staring at an unchanged
 * screen. A click now arms a short watch (src/lib/print-flow.ts): if `beforeprint` does not arrive
 * in time, the button concludes the dialog never opened and shows guidance instead — the print
 * page (every fold already open, nothing left to trigger) and the steps for saving a PDF from a
 * full browser. When the dialog does open, nothing extra ever appears.
 */
export function ReportPrintButton({ className, printPageHref }: { className?: string; printPageHref?: string }) {
  const [panel, dispatch] = useReducer(nextPrintPanelState, "idle" as PrintPanelState);
  const timer = useRef<number | null>(null);

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

  // The no-dialog watch: a real print announces itself with beforeprint, which cancels the timer
  // and settles the flow; only a wait that expires in silence becomes guidance.
  useEffect(() => {
    const settle = () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
      dispatch("beforeprint");
    };
    window.addEventListener("beforeprint", settle);
    return () => {
      window.removeEventListener("beforeprint", settle);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          dispatch("attempt");
          if (timer.current !== null) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => {
            timer.current = null;
            dispatch("timeout");
          }, PRINT_FALLBACK_DELAY_MS);
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
      {panel === "guidance" && (
        <div className="fixed inset-x-3 bottom-3 z-50 print:hidden" role="alertdialog" aria-label="印刷が開かなかったときの案内">
          <div className="relative mx-auto max-w-xl rounded-xl border border-border bg-card p-4 pr-10 text-left text-sm leading-6 text-card-foreground shadow-xl">
            <button
              type="button"
              onClick={() => dispatch("close")}
              aria-label="閉じる"
              className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </button>
            <p className="font-semibold">
              <span data-l="ja">印刷画面が開きませんでした</span>
              <span data-l="en">The print dialog did not open</span>
            </p>
            <p className="mt-1 text-muted-foreground">
              <span data-l="ja">アプリ内ブラウザなどでは、印刷が開かないことがあります。あきらめずに、次の方法でPDFに保存できます。</span>
              <span data-l="en">In-app browsers and similar views sometimes cannot open printing. You can still save a PDF in the following ways.</span>
            </p>
            {printPageHref && (
              <p className="mt-3">
                <Link
                  href={printPageHref}
                  className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
                >
                  <span data-l="ja">印刷用ページを開く（表はすべて開いた状態です）</span>
                  <span data-l="en">Open the print page (all tables already expanded)</span>
                </Link>
              </p>
            )}
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>
                <span data-l="ja">iPhone: Safariでこのページを開き直し、共有ボタン→「プリント」→プレビューをピンチで広げると、PDFとして保存できます。</span>
                <span data-l="en">iPhone: reopen this page in Safari, then Share → Print → pinch the preview open to save it as a PDF.</span>
              </li>
              <li>
                <span data-l="ja">Android: Chromeで開き直し、メニュー→共有→「印刷」→送信先で「PDFとして保存」を選びます。</span>
                <span data-l="en">Android: reopen in Chrome, then Menu → Share → Print → “Save as PDF” as the destination.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
