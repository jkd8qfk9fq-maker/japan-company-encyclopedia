"use client";

// A Client Component: the choice lives in a cookie and Google's tag runs in the browser (JCE-056).

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
      className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-50 border-t border-border bg-background px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:bottom-0"
    >
      <div className="mx-auto max-w-2xl text-sm leading-relaxed">
        <p className="font-semibold">閲覧統計（Google アナリティクス）について</p>
        <p className="mt-1 text-muted-foreground">
          サイトの改善のため、同意いただいた場合にだけ、Google アナリティクスで閲覧の統計を取ります。Google には、Cookie によるブラウザごとのランダムなID、見たページ（アドレスのパス）、参照元、端末やブラウザの種類などが送られます。検索した言葉は送りません。同意の選択は Cookie に1年間保存し、企業タイプ診断などの関連サイトと共有します。同意しなくても、すべての機能を使えます。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveConsent("granted")}
            className="min-h-11 min-w-32 rounded-md bg-navy px-5 text-sm font-medium text-white hover:opacity-90"
          >
            同意する
          </button>
          <button
            type="button"
            onClick={() => saveConsent("denied")}
            className="min-h-11 min-w-32 rounded-md border border-border px-5 text-sm font-medium hover:bg-muted"
          >
            同意しない
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
        閲覧統計の設定
      </button>
    </li>
  );
}
