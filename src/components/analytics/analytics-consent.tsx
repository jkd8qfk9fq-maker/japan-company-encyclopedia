"use client";

// A Client Component: the choice lives in a cookie and Google's tag runs in the browser (JCE-056).

import Link from "next/link";
import { T } from "@/components/i18n/t";
import { useEffect, useSyncExternalStore } from "react";
import {
  clearGaCookies,
  consentSnapshot,
  gaConfigured,
  resetConsent,
  saveConsent,
  startAnalytics,
  subscribeConsent,
} from "@/lib/analytics/runtime";

const serverSnapshot = () => "unknown" as const;

/**
 * Asks once whether Google Analytics may be used. Nothing renders, and nothing is asked, until a measurement ID is
 * set. Both answers are the same size, and every page works either way.
 *
 * The banner is a one-line strip (JCE-089): the full explanation — what is sent, the one-year cookie shared with the
 * related sites, how to withdraw — lives in the privacy policy's Google Analytics section, linked from the strip, so
 * a first visit is not covered by the explanation itself. The wording that decides the choice (consent-only, and
 * every feature works without it) and both buttons stay in the strip. On a phone the sentence takes the full width and
 * the buttons sit under it: beside the buttons it wrapped to six lines and covered half the first screen.
 */
export function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribeConsent, consentSnapshot, serverSnapshot);

  useEffect(() => {
    if (!gaConfigured()) return;
    if (consentSnapshot() === "granted") startAnalytics();
    else clearGaCookies(); // a tag on a page just left may have written them back after the choice was withdrawn
  }, []);

  if (!gaConfigured() || consent !== "none") return null;
  return (
    <div
      role="region"
      aria-label="閲覧統計（Google アナリティクス）について"
      className="fixed inset-x-0 print:hidden bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-50 border-t border-border bg-background px-4 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:bottom-0"
    >
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2">
        <p className="min-w-0 basis-full text-xs leading-relaxed sm:basis-0 sm:flex-1 sm:text-sm">
          <span className="font-semibold"><T m={{ ja: "閲覧統計：", en: "Analytics: " }} /></span>
          <T m={{ ja: "同意した場合だけ Google アナリティクスで閲覧統計を取ります。同意しなくても、すべての機能を使えます。", en: "Google Analytics is used only if you agree. Every feature works either way." }} />
          <Link href="/privacy#google-analytics" className="link-ink ml-1 whitespace-nowrap">
            <T m={{ ja: "詳しく見る", en: "Details (JP)" }} />
          </Link>
        </p>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => saveConsent("granted")}
            className="min-h-10 rounded-md bg-navy px-4 text-sm font-medium whitespace-nowrap text-white hover:opacity-90"
          >
            <T m={{ ja: "同意する", en: "Agree" }} />
          </button>
          <button
            type="button"
            onClick={() => saveConsent("denied")}
            className="min-h-10 rounded-md border border-border px-4 text-sm font-medium whitespace-nowrap hover:bg-muted"
          >
            <T m={{ ja: "同意しない", en: "Decline" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** 「閲覧統計の設定」 in the footer list (its own <li>): shown once a choice exists, to withdraw or change it. */
export function AnalyticsSettingsButton() {
  const consent = useSyncExternalStore(subscribeConsent, consentSnapshot, serverSnapshot);
  if (!gaConfigured() || consent === "unknown" || consent === "none") return null;
  return (
    <li>
      <button type="button" onClick={resetConsent} className="inline-flex min-h-11 items-center hover:underline">
        <T m={{ ja: "閲覧統計の設定", en: "Analytics settings" }} />
      </button>
    </li>
  );
}
