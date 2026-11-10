"use client";

// A Client Component: AdSense fills the unit in the browser, after the page is shown.

import { useEffect, useRef } from "react";

const SCRIPT_ID = "adsbygoogle-js";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** One AdSense display unit. AdSense's script is added the first time a unit is on screen, never in <head>. */
export function AdUnit({ client, slot }: { client: string; slot: string }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
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
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
