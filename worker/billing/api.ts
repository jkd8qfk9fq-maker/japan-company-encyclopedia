import type { RateLimit } from "../push/api";
import { type BillingStore, type Entitlement } from "./store";

/**
 * Billing on this site (JCE-100). Until now the plan check was borrowed: this site sent every purchase code to
 * the 企業タイプ診断 site's Worker, which asked Stripe live. The encyclopedia now keeps its own record —
 * Stripe webhooks land here and write entitlements into D1 (migrations/0004_billing.sql), and this site's own
 * /api/plan answers from that record with the same shape and the same rule as the borrowed check (status
 * active / trialing, paid until the period's end, re-check in at most three days). Checkout stays the 診断
 * site's for now, and the client still falls back to the borrowed check for codes this record does not hold
 * yet (src/lib/plan.ts), so nothing a reader already has changes while the record fills in.
 *
 * JCE-133: the record now also holds which product a subscription belongs to, and /api/plan says which plan
 * a paid code is. Until now any live subscription opened every paid layer, so a ¥390 code opened the ¥1,100
 * analysis layer too; the two plans are billed separately and are now judged separately. Billing itself is
 * unchanged — only the entitlement judgement moved.
 */

/**
 * The two products on the one YUGENQ Stripe account, as measured at Stripe on 2026-11-26: the ¥390/month
 * 企業タイプ診断 premium plan and the ¥1,100/month 学習β plan. A code counts as "analysis" only when the
 * record confirms its subscription is the β product; the ¥390 product, a product this record does not
 * know, and a row written before products were recorded (productId null) all count as "premium" — the
 * analysis layer opens for confirmed β subscriptions only.
 */
export const ANALYSIS_PRODUCT_ID = "prod_VfdOFlTGPrGzNo";
export const PREMIUM_PRODUCT_ID = "prod_Vbi8yQUiLyTvDW";

export type PlanKind = "analysis" | "premium";

/** Which plan a recorded entitlement is (JCE-133): the product decides, never the price or the status. */
export function planKindOf(ent: Entitlement): PlanKind {
  return ent.productId === ANALYSIS_PRODUCT_ID ? "analysis" : "premium";
}

export type BillingEnv = {
  BILLING_LIMIT?: RateLimit;
  /** The webhook signing secret (whsec_…), a Worker secret. Without it the webhook answers "not-configured". */
  STRIPE_WEBHOOK_SECRET?: string;
};

/** The same statuses the borrowed check counts as paid (the 診断 Worker's planOf). */
const PAID = new Set(["active", "trialing"]);
/** The same re-check interval as the borrowed check: at most three days, never past the paid period. */
export const RECHECK_MS = 3 * 24 * 60 * 60 * 1000;
/** Stripe stops trusting a signature five minutes out; the same tolerance Stripe's own libraries use. */
const SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000;
const SUBSCRIPTION_ID = /^sub_[A-Za-z0-9]{8,64}$/;
const MAX_BODY_BYTES = 256 * 1024;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

/** The answer /api/plan gives for a recorded entitlement — the borrowed check's planOf, on this site's record. */
export function planOfEntitlement(ent: Entitlement, now = Date.now()) {
  if (!PAID.has(ent.status) || ent.paidUntil <= now) return { active: false as const };
  return {
    active: true as const,
    code: ent.code,
    paidUntil: ent.paidUntil,
    checkAfter: Math.min(ent.paidUntil, now + RECHECK_MS),
    // JCE-133: which plan this code is, so the client can open the analysis layer for β codes only. The
    // fields above are unchanged from the borrowed check's shape; this one is an addition.
    plan: planKindOf(ent),
  };
}

const hex = (bytes: Uint8Array) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))));
}

/** Constant-time equality for the signature hex strings, so a forged one learns nothing from timing. */
function sameHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Stripe's signature check: the header carries a timestamp and one or more v1 signatures of
 * `${timestamp}.${body}` under the endpoint's secret. Any matching v1 within the tolerance is enough
 * (Stripe sends two while a secret rotates).
 */
export async function verifyStripeSignature(secret: string, body: string, header: string, now = Date.now()): Promise<boolean> {
  let timestamp = "";
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }
  if (!/^\d{1,16}$/.test(timestamp) || signatures.length === 0) return false;
  if (Math.abs(now - Number(timestamp) * 1000) > SIGNATURE_TOLERANCE_MS) return false;
  const expected = await hmacHex(secret, `${timestamp}.${body}`);
  return signatures.some((s) => sameHex(s, expected));
}

/** A price as Stripe prints it on a subscription item or an invoice line: its product may be an id or the object. */
type StripePrice = { id?: string; product?: string | { id?: string } };

type StripeSubscription = {
  id?: string;
  status?: string;
  customer?: string | { id?: string };
  current_period_end?: number;
  ended_at?: number | null;
  items?: { data?: { current_period_end?: number; price?: StripePrice }[] };
};

type StripeInvoice = {
  subscription?: string | { id?: string } | null;
  customer?: string | { id?: string } | null;
  customer_email?: string | null;
  lines?: { data?: { period?: { end?: number }; price?: StripePrice }[] };
};

const idOf = (value: string | { id?: string } | null | undefined): string | null =>
  typeof value === "string" ? value : value && typeof value.id === "string" ? value.id : null;

/** The product and price a Stripe price names (JCE-133), either of which may simply not be printed. */
const productOf = (price: StripePrice | undefined): { productId: string | null; priceId: string | null } => ({
  productId: idOf(price?.product),
  priceId: typeof price?.id === "string" ? price.id : null,
});

/** The period end as Stripe prints it, on the subscription itself or on its first item (the borrowed check reads both). */
const periodEndSeconds = (sub: StripeSubscription): number => sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end ?? 0;

async function applySubscription(store: BillingStore, sub: StripeSubscription, deleted: boolean, nowIso: string): Promise<void> {
  if (typeof sub.id !== "string" || !SUBSCRIPTION_ID.test(sub.id) || typeof sub.status !== "string") return;
  const endSeconds = deleted && typeof sub.ended_at === "number" ? sub.ended_at : periodEndSeconds(sub);
  // The product and price ride on the first item (JCE-133). An event that prints neither keeps what the
  // record already holds — the store never lets a null erase a recorded product.
  const { productId, priceId } = productOf(sub.items?.data?.[0]?.price);
  await store.upsert({
    code: sub.id,
    customerId: idOf(sub.customer),
    email: null,
    status: sub.status,
    paidUntil: endSeconds * 1000,
    source: "stripe",
    productId,
    priceId,
    now: nowIso,
  });
}

async function applyInvoicePaid(store: BillingStore, invoice: StripeInvoice, nowIso: string): Promise<void> {
  const code = idOf(invoice.subscription);
  if (!code || !SUBSCRIPTION_ID.test(code)) return;
  const ends = (invoice.lines?.data ?? []).map((l) => l.period?.end).filter((e): e is number => typeof e === "number");
  if (ends.length === 0) return;
  const existing = await store.get(code);
  // An invoice line names the price it charged (JCE-133): when it does, it can fill in the product a
  // subscription event has not recorded yet. The status rule below is unchanged — a paid invoice still
  // proves the period, not the status.
  const priced = (invoice.lines?.data ?? []).find((l) => l.price);
  const { productId, priceId } = productOf(priced?.price);
  await store.upsert({
    code,
    customerId: idOf(invoice.customer),
    email: typeof invoice.customer_email === "string" ? invoice.customer_email : null,
    // A paid invoice proves the period, not the status: keep the recorded one. With no record yet the
    // subscription event is on its way too; "active" until it lands is what the payment itself says.
    status: existing?.status ?? "active",
    paidUntil: Math.max(...ends) * 1000,
    source: "stripe",
    productId,
    priceId,
    now: nowIso,
  });
}

type StripeEvent = { id?: string; type?: string; data?: { object?: unknown } };

async function handleWebhook(request: Request, env: BillingEnv, store: BillingStore | null, now: Date): Promise<Response> {
  if (!store || !env.STRIPE_WEBHOOK_SECRET) return json({ error: "not-configured" }, 503);
  if (Number(request.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return json({ error: "too-large" }, 413);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!(await verifyStripeSignature(env.STRIPE_WEBHOOK_SECRET, body, signature, now.getTime()))) return json({ error: "signature" }, 400);
  let event: StripeEvent;
  try {
    event = JSON.parse(body) as StripeEvent;
  } catch {
    return json({ error: "body" }, 400);
  }
  if (typeof event.id !== "string" || typeof event.type !== "string") return json({ error: "body" }, 400);
  const nowIso = now.toISOString();
  // Stripe redelivers; the second delivery of an event must change nothing.
  if (!(await store.markEvent(event.id, event.type, nowIso))) return json({ received: true, duplicate: true });
  const object = (event.data?.object ?? {}) as Record<string, unknown>;
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    await applySubscription(store, object as StripeSubscription, false, nowIso);
  } else if (event.type === "customer.subscription.deleted") {
    await applySubscription(store, object as StripeSubscription, true, nowIso);
  } else if (event.type === "invoice.paid") {
    await applyInvoicePaid(store, object as StripeInvoice, nowIso);
  }
  return json({ received: true });
}

async function handlePlan(request: Request, env: BillingEnv, store: BillingStore | null, now: Date): Promise<Response> {
  if (!store) return json({ error: "not-configured" }, 503);
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin) return json({ error: "origin" }, 403);
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "content-type" }, 415);
  if (Number(request.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return json({ error: "too-large" }, 413);
  if (env.BILLING_LIMIT) {
    const { success } = await env.BILLING_LIMIT.limit({ key: request.headers.get("cf-connecting-ip") ?? "unknown" });
    if (!success) return json({ error: "rate" }, 429);
  }
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return json({ error: "body" }, 400);
  }
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!SUBSCRIPTION_ID.test(code)) return json({ active: false });
  let ent: Entitlement | null;
  try {
    ent = await store.get(code);
  } catch {
    // A store that cannot be read must not read as "not paid": 503 sends the client to the fallback check.
    return json({ error: "store" }, 503);
  }
  return json(ent ? planOfEntitlement(ent, now.getTime()) : { active: false });
}

export async function handleBilling(request: Request, env: BillingEnv, store: BillingStore | null, now = new Date()): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (request.method !== "POST") return json({ error: "method" }, 405);
  if (pathname === "/api/billing/webhook") return handleWebhook(request, env, store, now);
  if (pathname === "/api/plan") return handlePlan(request, env, store, now);
  return json({ error: "not-found" }, 404);
}
