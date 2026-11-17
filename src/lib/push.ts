/**
 * The browser side of notifications for followed companies (JCE-059). BROWSER ONLY — called from Client Components.
 *
 * What leaves the browser, and only after the reader switches notifications on: the address its browser gave for push
 * messages (with the two keys that encrypt them), and the ids of the companies chosen. Nothing else.
 */

export type PushAvailability =
  | { state: "ready"; publicKey: string; maxCompanies: number | null }
  /** iPhone and iPad: Safari delivers web notifications only to a site added to the home screen. */
  | { state: "ios-needs-install" }
  | { state: "unsupported" }
  | { state: "blocked" }
  /** The site has not switched the feature on (no keys set yet). */
  | { state: "off" };

function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isInstalled(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

let keyAnswer: Promise<{ available: boolean; publicKey?: string; maxCompanies?: number | null }> | null = null;

export async function pushAvailability(): Promise<PushAvailability> {
  if (typeof window === "undefined") return { state: "unsupported" };
  if (isIos() && !isInstalled()) return { state: "ios-needs-install" };
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return { state: "unsupported" };
  if (Notification.permission === "denied") return { state: "blocked" };
  keyAnswer ??= fetch("/api/push/key", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : { available: false }))
    .catch(() => ({ available: false }));
  const answer = await keyAnswer;
  if (!answer.available || !answer.publicKey) return { state: "off" };
  return { state: "ready", publicKey: answer.publicKey, maxCompanies: answer.maxCompanies ?? null };
}

function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const t = base64url.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(t + "=".repeat((4 - (t.length % 4)) % 4)), (c) => c.charCodeAt(0));
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  return (await navigator.serviceWorker.getRegistration("/")) ?? null;
}

async function post(path: string, body: unknown): Promise<boolean> {
  try {
    const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    return r.ok;
  } catch {
    return false;
  }
}

/** Asks permission (must run from a click), subscribes this browser and sends the companies. */
export async function enablePush(companies: string[]): Promise<"on" | "denied" | "failed" | "limit"> {
  const availability = await pushAvailability();
  if (availability.state !== "ready") return "failed";
  if (availability.maxCompanies !== null && companies.length > availability.maxCompanies) return "limit";
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return "denied";
  const reg = await registration();
  if (!reg) return "failed";
  try {
    const subscription =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(availability.publicKey) }));
    return (await post("/api/push/subscribe", { subscription: subscription.toJSON(), companies })) ? "on" : "failed";
  } catch {
    return "failed";
  }
}

/** Re-sends the list when it changes (or empties it, which removes the subscription). Quietly does nothing when off. */
export async function syncPush(companies: string[]): Promise<void> {
  const reg = await registration();
  const subscription = await reg?.pushManager.getSubscription();
  if (!subscription || Notification.permission !== "granted") return;
  if (companies.length === 0) {
    await post("/api/push/unsubscribe", { endpoint: subscription.endpoint });
    await subscription.unsubscribe().catch(() => {});
    return;
  }
  await post("/api/push/subscribe", { subscription: subscription.toJSON(), companies });
}

/** Stops every notification in this browser and removes the subscription from the site. */
export async function disablePush(): Promise<void> {
  const reg = await registration();
  const subscription = await reg?.pushManager.getSubscription();
  if (!subscription) return;
  await post("/api/push/unsubscribe", { endpoint: subscription.endpoint });
  await subscription.unsubscribe().catch(() => {});
}
