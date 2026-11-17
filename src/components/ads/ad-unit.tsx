"use client";

// A Client Component: AdSense fills the unit in the browser, after the page is shown.

import { useEffect, useRef } from "react";
import { usePlan } from "@/lib/plan";
import { planStore } from "@/lib/storage/stores";

const SCRIPT_ID = "adsbygoogle-js";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** One AdSense display unit. AdSense's script is added the first time a unit is on screen, never in <head>. */
export function AdUnit({ client, slot, placement }: { client: string; slot: string; placement: string }) {
  const pushed = useRef(false);
  // The YUGENQ premium plan shows no ads here (P2-1, JCE-064). The store is read directly in the effect: the hook's
  // first value is the server's (no plan), and the ad script must not load for a reader who has the plan.
  const plan = usePlan();
  useEffect(() => {
    if (pushed.current || planStore.get()) return;
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      document.head.appendChild(script);
    }
    pushed.current = true;
    (window.adsbygoogle = window.adsbygoogle ?? []).push({});
  }, [client]);
  if (plan) return null;
  // Labelled as advertising, visually separate from content, and never between a claim and its sources.
  return (
    <aside aria-label="広告" data-ad-placement={placement} className="my-12 border-y border-border py-4">
      <p className="mb-2 text-xs text-muted-foreground">広告</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
