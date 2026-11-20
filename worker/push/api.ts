import { subscriptionId, type PushStore } from "./store";
import { b64url, isPushEndpoint, sendPush, type Vapid } from "./webpush";

/**
 * Notifications for followed companies (JCE-059). The browser keeps which companies it follows (as before); only a
 * reader who switches notifications on sends that list here, with the address its browser gave for push messages.
 * Nothing else is stored: no IP address, no user agent, nothing that says who the reader is.
 */

export type RateLimit = { limit(options: { key: string }): Promise<{ success: boolean }> };

export type PushEnv = {
  PUSH_DB?: unknown;
  /** VAPID key pair, set as Worker secrets (never in the repository). Without both, notifications stay off. */
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  /** How many companies one browser may be notified about. Unset = no limit (the initial setting). */
  PUSH_MAX_COMPANIES?: string;
  /** Pushes sent per scheduled run at most (Workers caps the requests one run may make). Default 40. */
  PUSH_SENDS_PER_RUN?: string;
  PUSH_LIMIT?: RateLimit;
};

/** A hard ceiling regardless of the setting: well above any reader's follow list, and it bounds one request's work. */
export const HARD_MAX_COMPANIES = 2000;
const MAX_BODY_BYTES = 64 * 1024;
const COMPANY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** The VAPID subject: the site's contact page, so no person's e-mail address is sent to a push service. */
export const VAPID_SUBJECT = "https://kigyo-hyakka.com/contact";

export function vapidOf(env: PushEnv): Vapid | null {
  return env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY
    ? { publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY, subject: VAPID_SUBJECT }
    : null;
}

export function maxCompanies(env: PushEnv): number {
  const n = Number(env.PUSH_MAX_COMPANIES);
  return env.PUSH_MAX_COMPANIES && Number.isInteger(n) && n > 0 ? Math.min(n, HARD_MAX_COMPANIES) : HARD_MAX_COMPANIES;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

function validKey(text: unknown, length: number, first?: number): text is string {
  if (typeof text !== "string" || text.length > 200) return false;
  try {
    const bytes = b64url.decode(text);
    return bytes.length === length && (first === undefined || bytes[0] === first);
  } catch {
    return false;
  }
}

export async function handlePush(request: Request, env: PushEnv, store: PushStore | null, now = new Date()): Promise<Response> {
  const url = new URL(request.url);
  const vapid = vapidOf(env);
  if (request.method === "GET" && url.pathname === "/api/push/key") {
    // The page asks before offering notifications, so nobody switches on a feature that cannot send.
    if (!vapid || !store) return json({ available: false });
    return json({ available: true, publicKey: vapid.publicKey, maxCompanies: env.PUSH_MAX_COMPANIES ? maxCompanies(env) : null });
  }
  if (request.method !== "POST") return json({ error: "method" }, 405);
  if (!vapid || !store) return json({ error: "not-configured" }, 503);
  // Only this site's own pages subscribe: a cross-site form or script is refused.
  const origin = request.headers.get("origin");
  if (origin !== url.origin) return json({ error: "origin" }, 403);
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "content-type" }, 415);
  if (Number(request.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return json({ error: "too-large" }, 413);
  if (env.PUSH_LIMIT) {
    const { success } = await env.PUSH_LIMIT.limit({ key: request.headers.get("cf-connecting-ip") ?? "unknown" });
    if (!success) return json({ error: "rate" }, 429);
  }
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return json({ error: "body" }, 400);
  }

  if (url.pathname === "/api/push/unsubscribe") {
    if (!isPushEndpoint(body.endpoint)) return json({ error: "endpoint" }, 400);
    await store.remove(await subscriptionId(body.endpoint));
    return json({ ok: true });
  }

  if (url.pathname === "/api/push/subscribe") {
    const sub = body.subscription as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } } | undefined;
    if (!sub || !isPushEndpoint(sub.endpoint)) return json({ error: "endpoint" }, 400);
    if (!validKey(sub.keys?.p256dh, 65, 4) || !validKey(sub.keys?.auth, 16)) return json({ error: "keys" }, 400);
    const raw = Array.isArray(body.companies) ? body.companies : null;
    if (!raw || raw.some((c) => typeof c !== "string" || !COMPANY_ID.test(c) || c.length > 80)) return json({ error: "companies" }, 400);
    const companies = [...new Set(raw as string[])];
    const max = maxCompanies(env);
    if (companies.length > max) return json({ error: "limit", max }, 409);
    const id = await subscriptionId(sub.endpoint);
    if (companies.length === 0) await store.remove(id);
    else await store.upsert(id, { endpoint: sub.endpoint, p256dh: sub.keys!.p256dh as string, auth: sub.keys!.auth as string }, companies, now.toISOString());
    return json({ ok: true, companies: companies.length });
  }
  return json({ error: "not-found" }, 404);
}

/** Recorded on the first run and never pruned: from then on, every new event is announced. */
export const BOOTSTRAP_KEY = "__bootstrap__";

/** The shape of /updates.json (src/lib/engagement-data.ts): [companyId, kind, date, label, summary?]. */
export type Updates = { names: Record<string, string>; events: [string, string, string, string, string?][] };

/** The notification text: a fact, never advice (invariant 4). The summaries are the filings' own printed figures (JCE-071). */
export function messageFor(companyId: string, kinds: string[], names: Record<string, string>, summaries: string[] = []) {
  const name = names[companyId] ?? companyId;
  const isResults = kinds.some((k) => k === "yuho" || k === "hanki" || k === "tanshin");
  const facts = [...new Set(summaries.filter(Boolean))];
  return {
    title: "日本企業百科事典",
    body: (isResults ? `${name}の新しい決算データが公開されました` : `${name}の掲載内容が更新されました`) + (facts.length > 0 ? `\n${facts.join("\n")}` : ""),
    url: `/companies/${companyId}/`,
    tag: `company-${companyId}`,
  };
}

/**
 * The scheduled run: announces each event of /updates.json once — what is LIVE on the site, so a notification never
 * points at a page that has not changed yet. The first run only records what is already there. Pushes per run are
 * capped; a company whose followers could not all be reached in this run is announced in the next.
 */
export async function runNotifications(env: PushEnv, store: PushStore | null, loadUpdates: () => Promise<Updates>, send: typeof fetch = fetch, now = new Date()) {
  const vapid = vapidOf(env);
  if (!vapid || !store) return { skipped: true as const };
  const iso = now.toISOString();
  const day = 24 * 3600 * 1000;
  await store.prune(new Date(now.getTime() - 180 * day).toISOString(), new Date(now.getTime() - 150 * day).toISOString());

  const updates = await loadUpdates();
  // An event is its company, kind, date and title: the summary (JCE-071) rides along but is not part of the
  // identity, so a file that gains summaries does not make everything already announced look new again.
  const keyOf = (e: Updates["events"][number]) => e.slice(0, 4).join("|");
  if (await store.isEmptySeen()) {
    // A marker, so a first run that finds nothing listed still counts as the first run.
    await store.markSeen([BOOTSTRAP_KEY, ...updates.events.map(keyOf)], iso);
    return { bootstrap: true as const, recorded: updates.events.length };
  }
  const seen = await store.seen(updates.events.map(keyOf));
  const fresh = updates.events.filter((e) => !seen.has(keyOf(e)));
  const byCompany = new Map<string, Updates["events"]>();
  for (const e of fresh) byCompany.set(e[0], [...(byCompany.get(e[0]) ?? []), e]);

  const budget = Number(env.PUSH_SENDS_PER_RUN) > 0 ? Number(env.PUSH_SENDS_PER_RUN) : 40;
  let sent = 0;
  let gone = 0;
  let failed = 0;
  const done: string[] = [];
  const followers = await store.followers([...byCompany.keys()]);
  for (const [companyId, events] of byCompany) {
    const recipients = followers.filter((f) => f.companyId === companyId);
    if (sent + gone + failed + recipients.length > budget && sent + gone + failed > 0) break; // next run continues here
    const message = messageFor(companyId, events.map((e) => e[1]), updates.names, events.map((e) => e[4]).filter((s): s is string => Boolean(s)));
    for (const r of recipients) {
      const result = await sendPush(r.subscription, message, vapid, send);
      if (result === "gone") {
        gone++;
        await store.remove(r.id);
      } else if (result === "sent") sent++;
      else failed++;
    }
    done.push(...events.map(keyOf));
  }
  await store.markSeen(done, iso);
  return { sent, gone, failed, announced: done.length, pending: fresh.length - done.length };
}
