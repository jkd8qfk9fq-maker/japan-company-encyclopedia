import { favoritesStore, mailNotifyStore, type MailNotify } from "@/lib/storage/stores";

/**
 * The browser's side of e-mail notifications (JCE-069). BROWSER ONLY — called from Client Components.
 *
 * Sent only when the reader registers: the address, the ids of the companies they follow and which kinds of news they
 * chose. This browser keeps a key to change or stop the sign-up, and the address only as a masked hint.
 */

const post = (path: string, body: unknown) =>
  fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

export async function mailAvailable(): Promise<boolean> {
  try {
    const r = await fetch("/api/mail/status", { cache: "no-store" });
    return r.ok && ((await r.json()) as { available?: boolean }).available === true;
  } catch {
    return false;
  }
}

/** 「s***@example.com」: enough to recognise which address, nothing a passer-by can read off the screen. */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local!.slice(0, 1)}***@${domain}`;
}

export async function startMail(email: string, kinds: MailNotify["kinds"]): Promise<"sent" | "input" | "rate" | "error"> {
  const replace = mailNotifyStore.get()?.manageKey;
  const r = await post("/api/mail/start", { email, kinds, companies: favoritesStore.get(), ...(replace ? { replace } : {}) });
  if (r.ok) {
    const { manageKey } = (await r.json()) as { manageKey: string };
    mailNotifyStore.set({ manageKey, hint: maskEmail(email), kinds, confirmed: false });
    return "sent";
  }
  return r.status === 400 ? "input" : r.status === 429 ? "rate" : "error";
}

/** Asks the site whether the confirmation link was opened, or whether a mail's stop link ended the sign-up. */
export async function refreshMailState(): Promise<void> {
  const current = mailNotifyStore.get();
  if (!current) return;
  try {
    const r = await post("/api/mail/state", { manageKey: current.manageKey });
    if (!r.ok) return;
    const { state } = (await r.json()) as { state: "pending" | "on" | "none" };
    if (state === "none") mailNotifyStore.clear();
    else if ((state === "on") !== current.confirmed) mailNotifyStore.set({ ...current, confirmed: state === "on" });
  } catch {
    // Offline: the page shows what it last knew.
  }
}

/** Keeps the site's list equal to this browser's follows; an empty list ends the sign-up. */
export async function syncMail(companies: string[]): Promise<void> {
  const current = mailNotifyStore.get();
  if (!current) return;
  try {
    const r = await post("/api/mail/update", { manageKey: current.manageKey, companies });
    if (r.status === 410 || (r.ok && ((await r.json()) as { state?: string }).state === "none")) mailNotifyStore.clear();
  } catch {
    // Tried again on the next change or visit.
  }
}

export async function stopMail(): Promise<void> {
  const current = mailNotifyStore.get();
  if (current) await post("/api/mail/stop", { manageKey: current.manageKey }).catch(() => null);
  mailNotifyStore.clear();
}

export async function confirmMail(token: string): Promise<"on" | "gone" | "error"> {
  try {
    const r = await post("/api/mail/confirm", { token });
    if (r.ok) {
      const current = mailNotifyStore.get();
      if (current) mailNotifyStore.set({ ...current, confirmed: true });
      return "on";
    }
    return r.status === 410 ? "gone" : "error";
  } catch {
    return "error";
  }
}

export async function stopMailByLink(stopKey: string): Promise<boolean> {
  try {
    return (await post("/api/mail/stop-link", { stopKey })).ok;
  } catch {
    return false;
  }
}
