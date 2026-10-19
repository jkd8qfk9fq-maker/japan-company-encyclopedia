"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js in production only. In development a caching service
 * worker fights hot reload and makes every "why is my change not showing"
 * question unanswerable.
 *
 * Registration failure is swallowed: the app is a normal website first, and
 * a browser without service workers must lose only offline support.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    // The Pages preview is served from a sub-path the worker's fixed paths do not know: no offline mode there.
    if (process.env.NEXT_PUBLIC_BASE_PATH) return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {});
  }, []);
  return null;
}
