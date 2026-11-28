import { afterEach, describe, expect, it, vi } from "vitest";
import { ANALYSIS_PRODUCT_ID, handleBilling, planKindOf, planOfEntitlement, PREMIUM_PRODUCT_ID, verifyStripeSignature } from "../worker/billing/api";
import { memoryBillingStore } from "../worker/billing/store";
import { analysisEntitled, checkPlan, OWN_PLAN_ENDPOINT, PLAN_ENDPOINT } from "@/lib/plan";
import type { StoredPlan } from "@/lib/storage/stores";

/** JCE-100: this site's own billing record — webhook intake, the entitlement store, its /api/plan, and the client's move to it. */
/** JCE-140: the record also holds the subscription's product, and the two plans are judged separately. */

const ORIGIN = "https://kigyo-hyakka.com";
const SECRET = "whsec_test_secret_for_billing";
const NOW = new Date("2026-11-23T10:00:00.000Z");
const CODE = "sub_1UbAI9Fm3JfKaAkuMuVK6CZs";
const PERIOD_END_S = 1798761600; // 2027-01-01T00:00:00Z — after NOW (2026-11-23), so a plan ending then is paid
const PERIOD_END_MS = PERIOD_END_S * 1000;
const CHECK_AFTER_MS = NOW.getTime() + 3 * 24 * 60 * 60 * 1000; // min(paidUntil, now + 3 days) lands here
// The prices as measured at Stripe on 2026-11-26: the β plan's price and the ¥390 plan's current price.
const BETA_PRICE = "price_1UeI7zFm3JfKaAkuHmwYpG9X";
const PREMIUM_PRICE = "price_1UeusrFm3JfKaAkuWNbxGdMb";

const hex = (bytes: Uint8Array) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

async function sign(secret: string, body: string, atMs: number): Promise<string> {
  const t = Math.floor(atMs / 1000);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const v1 = hex(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${body}`))));
  return `t=${t},v1=${v1}`;
}

const webhookRequest = async (body: string, signature: string) =>
  new Request(`${ORIGIN}/api/billing/webhook`, { method: "POST", headers: { "stripe-signature": signature }, body });

const planRequest = (code: unknown, origin: string | null = ORIGIN) =>
  new Request(`${ORIGIN}/api/plan`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(origin ? { origin } : {}) },
    body: JSON.stringify({ code }),
  });

const subscriptionEvent = (id: string, type: string, sub: Record<string, unknown>) =>
  JSON.stringify({ id, type, data: { object: { id: CODE, customer: "cus_VcP6IAqHA649zF", ...sub } } });

describe("verifyStripeSignature", () => {
  const body = `{"id":"evt_1","type":"customer.subscription.created"}`;
  it("accepts a signature Stripe would send", async () => {
    expect(await verifyStripeSignature(SECRET, body, await sign(SECRET, body, NOW.getTime()), NOW.getTime())).toBe(true);
  });
  it("accepts when any of several v1 signatures matches (secret rotation)", async () => {
    const good = await sign(SECRET, body, NOW.getTime());
    const v1 = good.split("v1=")[1];
    expect(await verifyStripeSignature(SECRET, body, `t=${Math.floor(NOW.getTime() / 1000)},v1=${"0".repeat(64)},v1=${v1}`, NOW.getTime())).toBe(true);
  });
  it("rejects a tampered body, a wrong secret, and a stale timestamp", async () => {
    const header = await sign(SECRET, body, NOW.getTime());
    expect(await verifyStripeSignature(SECRET, `${body} `, header, NOW.getTime())).toBe(false);
    expect(await verifyStripeSignature("whsec_other", body, header, NOW.getTime())).toBe(false);
    expect(await verifyStripeSignature(SECRET, body, header, NOW.getTime() + 10 * 60 * 1000)).toBe(false);
    expect(await verifyStripeSignature(SECRET, body, "not-a-header", NOW.getTime())).toBe(false);
  });
});

describe("the entitlement store", () => {
  it("keeps a field an event does not carry, and reports each event id once", async () => {
    const store = memoryBillingStore();
    await store.upsert({ code: CODE, customerId: "cus_1", email: "a@example.jp", status: "active", paidUntil: 100, source: "stripe", productId: ANALYSIS_PRODUCT_ID, priceId: BETA_PRICE, now: NOW.toISOString() });
    await store.upsert({ code: CODE, customerId: null, email: null, status: "active", paidUntil: 200, source: "stripe", productId: null, priceId: null, now: NOW.toISOString() });
    expect(await store.get(CODE)).toEqual({
      code: CODE,
      customerId: "cus_1",
      email: "a@example.jp",
      status: "active",
      paidUntil: 200,
      source: "stripe",
      productId: ANALYSIS_PRODUCT_ID,
      priceId: BETA_PRICE,
    });
    expect(await store.markEvent("evt_1", "invoice.paid", NOW.toISOString())).toBe(true);
    expect(await store.markEvent("evt_1", "invoice.paid", NOW.toISOString())).toBe(false);
    expect(await store.get("sub_unknown")).toBeNull();
  });
});

describe("planOfEntitlement — the borrowed check's rule, on this record", () => {
  const base = { code: CODE, customerId: null, email: null, source: "stripe", productId: null, priceId: null };
  it("counts active and trialing as paid, until the period ends", () => {
    expect(planOfEntitlement({ ...base, status: "trialing", paidUntil: PERIOD_END_MS }, NOW.getTime())).toEqual({
      active: true,
      code: CODE,
      paidUntil: PERIOD_END_MS,
      checkAfter: Math.min(PERIOD_END_MS, NOW.getTime() + 3 * 24 * 60 * 60 * 1000),
      plan: "premium", // no product recorded: the analysis layer stays closed (JCE-140)
    });
    expect(planOfEntitlement({ ...base, status: "active", paidUntil: NOW.getTime() }, NOW.getTime())).toEqual({ active: false });
    expect(planOfEntitlement({ ...base, status: "past_due", paidUntil: PERIOD_END_MS }, NOW.getTime())).toEqual({ active: false });
    expect(planOfEntitlement({ ...base, status: "canceled", paidUntil: PERIOD_END_MS }, NOW.getTime())).toEqual({ active: false });
  });

  it("names the plan by the recorded product (JCE-140): the β product is analysis, everything else premium", () => {
    const paid = { status: "active", paidUntil: PERIOD_END_MS };
    expect(planOfEntitlement({ ...base, ...paid, productId: ANALYSIS_PRODUCT_ID, priceId: BETA_PRICE }, NOW.getTime())).toMatchObject({ active: true, plan: "analysis" });
    expect(planOfEntitlement({ ...base, ...paid, productId: PREMIUM_PRODUCT_ID, priceId: PREMIUM_PRICE }, NOW.getTime())).toMatchObject({ active: true, plan: "premium" });
    expect(planOfEntitlement({ ...base, ...paid, productId: "prod_unknown" }, NOW.getTime())).toMatchObject({ active: true, plan: "premium" });
    expect(planKindOf({ ...base, ...paid, productId: null })).toBe("premium");
  });
});

describe("handleBilling", () => {
  it("answers not-configured until the webhook secret is set", async () => {
    const store = memoryBillingStore();
    const body = subscriptionEvent("evt_1", "customer.subscription.created", { status: "active", current_period_end: PERIOD_END_S });
    const res = await handleBilling(await webhookRequest(body, await sign(SECRET, body, NOW.getTime())), {}, store, NOW);
    expect(res.status).toBe(503);
  });

  it("records a subscription from a signed webhook, and /api/plan then answers paid", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const body = subscriptionEvent("evt_1", "customer.subscription.created", { status: "trialing", current_period_end: PERIOD_END_S });
    const res = await handleBilling(await webhookRequest(body, await sign(SECRET, body, NOW.getTime())), env, store, NOW);
    expect(res.status).toBe(200);
    const plan = await handleBilling(planRequest(CODE), env, store, NOW);
    // No item on the event, so no product is recorded and the code reads as premium (JCE-140).
    expect(await plan.json()).toEqual({ active: true, code: CODE, paidUntil: PERIOD_END_MS, checkAfter: CHECK_AFTER_MS, plan: "premium" });
  });

  it("records a β subscription's product, and /api/plan then answers plan: analysis (JCE-140)", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const body = subscriptionEvent("evt_1", "customer.subscription.created", {
      status: "active",
      current_period_end: PERIOD_END_S,
      items: { data: [{ price: { id: BETA_PRICE, product: ANALYSIS_PRODUCT_ID }, current_period_end: PERIOD_END_S }] },
    });
    const res = await handleBilling(await webhookRequest(body, await sign(SECRET, body, NOW.getTime())), env, store, NOW);
    expect(res.status).toBe(200);
    const ent = await store.get(CODE);
    expect(ent?.productId).toBe(ANALYSIS_PRODUCT_ID);
    expect(ent?.priceId).toBe(BETA_PRICE);
    const plan = await handleBilling(planRequest(CODE), env, store, NOW);
    expect(await plan.json()).toEqual({ active: true, code: CODE, paidUntil: PERIOD_END_MS, checkAfter: CHECK_AFTER_MS, plan: "analysis" });
    // And on the client, that kind is the one that opens the analysis layer.
    const stored: StoredPlan = { code: CODE, paidUntil: PERIOD_END_MS, checkAfter: CHECK_AFTER_MS, kind: "analysis" };
    expect(analysisEntitled(stored, NOW.getTime())).toBe(true);
  });

  it("records a ¥390 subscription as plan: premium, which never opens the analysis layer (JCE-140)", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const body = subscriptionEvent("evt_1", "customer.subscription.created", {
      status: "active",
      current_period_end: PERIOD_END_S,
      items: { data: [{ price: { id: PREMIUM_PRICE, product: PREMIUM_PRODUCT_ID }, current_period_end: PERIOD_END_S }] },
    });
    await handleBilling(await webhookRequest(body, await sign(SECRET, body, NOW.getTime())), env, store, NOW);
    const plan = await handleBilling(planRequest(CODE), env, store, NOW);
    expect(await plan.json()).toEqual({ active: true, code: CODE, paidUntil: PERIOD_END_MS, checkAfter: CHECK_AFTER_MS, plan: "premium" });
    const stored: StoredPlan = { code: CODE, paidUntil: PERIOD_END_MS, checkAfter: CHECK_AFTER_MS, kind: "premium" };
    expect(analysisEntitled(stored, NOW.getTime())).toBe(false);
  });

  it("lets invoice.paid fill in the product its line names, when the subscription event carried none (JCE-140)", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const created = subscriptionEvent("evt_1", "customer.subscription.created", { status: "active", current_period_end: PERIOD_END_S });
    await handleBilling(await webhookRequest(created, await sign(SECRET, created, NOW.getTime())), env, store, NOW);
    expect((await store.get(CODE))?.productId).toBeNull();
    const invoice = JSON.stringify({
      id: "evt_2",
      type: "invoice.paid",
      data: {
        object: {
          subscription: CODE,
          customer: "cus_VcP6IAqHA649zF",
          lines: { data: [{ period: { end: PERIOD_END_S }, price: { id: BETA_PRICE, product: ANALYSIS_PRODUCT_ID } }] },
        },
      },
    });
    await handleBilling(await webhookRequest(invoice, await sign(SECRET, invoice, NOW.getTime())), env, store, NOW);
    const ent = await store.get(CODE);
    expect(ent?.productId).toBe(ANALYSIS_PRODUCT_ID);
    expect(ent?.priceId).toBe(BETA_PRICE);
    expect(ent?.status).toBe("active"); // the invoice still does not move the recorded status
    const plan = await handleBilling(planRequest(CODE), env, store, NOW);
    expect(await plan.json()).toMatchObject({ active: true, plan: "analysis" });
  });

  it("rejects a webhook whose signature does not match", async () => {
    const store = memoryBillingStore();
    const body = subscriptionEvent("evt_1", "customer.subscription.created", { status: "active", current_period_end: PERIOD_END_S });
    const res = await handleBilling(await webhookRequest(body, await sign("whsec_wrong", body, NOW.getTime())), { STRIPE_WEBHOOK_SECRET: SECRET }, store, NOW);
    expect(res.status).toBe(400);
    expect(await store.get(CODE)).toBeNull();
  });

  it("changes nothing when Stripe redelivers an event", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const created = subscriptionEvent("evt_1", "customer.subscription.created", { status: "active", current_period_end: PERIOD_END_S });
    await handleBilling(await webhookRequest(created, await sign(SECRET, created, NOW.getTime())), env, store, NOW);
    const deleted = subscriptionEvent("evt_1", "customer.subscription.deleted", { status: "canceled", ended_at: PERIOD_END_S - 1000 });
    const again = await handleBilling(await webhookRequest(deleted, await sign(SECRET, deleted, NOW.getTime())), env, store, NOW);
    expect(await again.json()).toEqual({ received: true, duplicate: true });
    expect((await store.get(CODE))?.status).toBe("active"); // the redelivery reused evt_1, so the delete never applied
  });

  it("closes the plan when the subscription is deleted, at its end time", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const created = subscriptionEvent("evt_1", "customer.subscription.created", { status: "active", current_period_end: PERIOD_END_S });
    await handleBilling(await webhookRequest(created, await sign(SECRET, created, NOW.getTime())), env, store, NOW);
    const deleted = subscriptionEvent("evt_2", "customer.subscription.deleted", { status: "canceled", ended_at: PERIOD_END_S - 1000 });
    await handleBilling(await webhookRequest(deleted, await sign(SECRET, deleted, NOW.getTime())), env, store, NOW);
    const plan = await handleBilling(planRequest(CODE), env, store, NOW);
    expect(await plan.json()).toEqual({ active: false });
  });

  it("extends the paid period on invoice.paid and keeps the e-mail it prints", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const created = subscriptionEvent("evt_1", "customer.subscription.created", { status: "active", current_period_end: PERIOD_END_S });
    await handleBilling(await webhookRequest(created, await sign(SECRET, created, NOW.getTime())), env, store, NOW);
    const invoice = JSON.stringify({
      id: "evt_2",
      type: "invoice.paid",
      data: { object: { subscription: CODE, customer: "cus_VcP6IAqHA649zF", customer_email: "reader@example.jp", lines: { data: [{ period: { end: PERIOD_END_S + 2592000 } }] } } },
    });
    await handleBilling(await webhookRequest(invoice, await sign(SECRET, invoice, NOW.getTime())), env, store, NOW);
    const ent = await store.get(CODE);
    expect(ent?.paidUntil).toBe((PERIOD_END_S + 2592000) * 1000);
    expect(ent?.email).toBe("reader@example.jp");
    expect(ent?.status).toBe("active");
  });

  it("answers /api/plan for unknown and malformed codes as not paid, and refuses other origins", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    expect(await (await handleBilling(planRequest("sub_12345678"), env, store, NOW)).json()).toEqual({ active: false });
    expect(await (await handleBilling(planRequest("not-a-code"), env, store, NOW)).json()).toEqual({ active: false });
    expect((await handleBilling(planRequest(CODE, "https://example.com"), env, store, NOW)).status).toBe(403);
    expect((await handleBilling(planRequest(CODE), env, null, NOW)).status).toBe(503);
  });
});

describe("JCE-151 boundary cases — product judgement, event order, and the /api/plan guards", () => {
  it("judges the plan by product alone, never by price: a mismatched price does not move the kind", () => {
    const base = { code: CODE, customerId: null, email: null, source: "stripe", status: "active", paidUntil: PERIOD_END_MS };
    expect(planKindOf({ ...base, productId: ANALYSIS_PRODUCT_ID, priceId: PREMIUM_PRICE })).toBe("analysis");
    expect(planKindOf({ ...base, productId: PREMIUM_PRODUCT_ID, priceId: BETA_PRICE })).toBe("premium");
    expect(planKindOf({ ...base, productId: "prod_unknown", priceId: BETA_PRICE })).toBe("premium");
  });

  it("records the product when Stripe expands it as an object on the price, not only as an id string", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const body = subscriptionEvent("evt_1", "customer.subscription.created", {
      status: "active",
      current_period_end: PERIOD_END_S,
      items: { data: [{ price: { id: BETA_PRICE, product: { id: ANALYSIS_PRODUCT_ID } }, current_period_end: PERIOD_END_S }] },
    });
    await handleBilling(await webhookRequest(body, await sign(SECRET, body, NOW.getTime())), env, store, NOW);
    expect((await store.get(CODE))?.productId).toBe(ANALYSIS_PRODUCT_ID);
    const plan = await handleBilling(planRequest(CODE), env, store, NOW);
    expect(await plan.json()).toMatchObject({ active: true, plan: "analysis" });
  });

  it("keeps the entitlement when invoice.paid lands before the subscription event (out-of-order delivery)", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const invoice = JSON.stringify({
      id: "evt_1",
      type: "invoice.paid",
      data: {
        object: {
          subscription: CODE,
          customer: "cus_VcP6IAqHA649zF",
          customer_email: "reader@example.jp",
          lines: { data: [{ period: { end: PERIOD_END_S }, price: { id: BETA_PRICE, product: ANALYSIS_PRODUCT_ID } }] },
        },
      },
    });
    await handleBilling(await webhookRequest(invoice, await sign(SECRET, invoice, NOW.getTime())), env, store, NOW);
    const early = await store.get(CODE);
    expect(early).toMatchObject({ status: "active", productId: ANALYSIS_PRODUCT_ID, email: "reader@example.jp" });
    const created = subscriptionEvent("evt_2", "customer.subscription.created", { status: "active", current_period_end: PERIOD_END_S });
    await handleBilling(await webhookRequest(created, await sign(SECRET, created, NOW.getTime())), env, store, NOW);
    const later = await store.get(CODE);
    // The later subscription event names no product and no e-mail: neither recorded fact is erased.
    expect(later).toMatchObject({ status: "active", productId: ANALYSIS_PRODUCT_ID, email: "reader@example.jp" });
    const plan = await handleBilling(planRequest(CODE), env, store, NOW);
    expect(await plan.json()).toMatchObject({ active: true, plan: "analysis" });
  });

  it("does not consume an event whose apply fails: it answers 500 and the redelivery succeeds (JCE-151)", async () => {
    const inner = memoryBillingStore();
    let failUpserts = true;
    const store = {
      ...inner,
      rows: inner.rows,
      events: inner.events,
      async upsert(row: Parameters<typeof inner.upsert>[0]) {
        if (failUpserts) throw new Error("D1: no such column (migration unapplied)");
        return inner.upsert(row);
      },
    };
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    const body = subscriptionEvent("evt_1", "customer.subscription.created", {
      status: "active",
      current_period_end: PERIOD_END_S,
      items: { data: [{ price: { id: BETA_PRICE, product: ANALYSIS_PRODUCT_ID }, current_period_end: PERIOD_END_S }] },
    });
    const first = await handleBilling(await webhookRequest(body, await sign(SECRET, body, NOW.getTime())), env, store, NOW);
    expect(first.status).toBe(500);
    expect(await store.hasEvent("evt_1")).toBe(false);
    expect(await store.get(CODE)).toBeNull();
    failUpserts = false;
    const retry = await handleBilling(await webhookRequest(body, await sign(SECRET, body, NOW.getTime())), env, store, NOW);
    expect(retry.status).toBe(200);
    expect(await retry.json()).toEqual({ received: true });
    expect((await store.get(CODE))?.productId).toBe(ANALYSIS_PRODUCT_ID);
    expect(await store.hasEvent("evt_1")).toBe(true);
  });

  it("refuses /api/plan without an Origin header and with a non-JSON content type", async () => {
    const store = memoryBillingStore();
    const env = { STRIPE_WEBHOOK_SECRET: SECRET };
    expect((await handleBilling(planRequest(CODE, null), env, store, NOW)).status).toBe(403);
    const wrongType = new Request(`${ORIGIN}/api/plan`, {
      method: "POST",
      headers: { "content-type": "text/plain", origin: ORIGIN },
      body: JSON.stringify({ code: CODE }),
    });
    expect((await handleBilling(wrongType, env, store, NOW)).status).toBe(415);
  });
});

describe("checkPlan — the client's move to this site's own check (JCE-100)", () => {
  afterEach(() => vi.unstubAllGlobals());

  const stubFetch = (answers: Record<string, { status?: number; body?: unknown } | "throw">) => {
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        calls.push(url);
        const answer = answers[url];
        if (!answer || answer === "throw") throw new Error("network");
        return { ok: (answer.status ?? 200) < 300, status: answer.status ?? 200, json: async () => answer.body };
      }),
    );
    return calls;
  };
  const paid = { active: true, code: CODE, paidUntil: PERIOD_END_MS, checkAfter: PERIOD_END_MS };

  it("takes this site's own answer when it says paid, without asking the 診断 site", async () => {
    const calls = stubFetch({ [OWN_PLAN_ENDPOINT]: { body: paid }, [PLAN_ENDPOINT]: { body: { active: false } } });
    // The stub's answer predates JCE-140 (no plan field): the kind settles as premium, never analysis.
    expect(await checkPlan(CODE)).toEqual({ ...paid, plan: "premium" });
    expect(calls).toEqual([OWN_PLAN_ENDPOINT]);
  });

  it("carries the kind this site's own record answers (JCE-140): a β code stays analysis", async () => {
    const calls = stubFetch({ [OWN_PLAN_ENDPOINT]: { body: { ...paid, plan: "analysis" } }, [PLAN_ENDPOINT]: { body: paid } });
    expect(await checkPlan(CODE)).toEqual({ ...paid, plan: "analysis" });
    expect(calls).toEqual([OWN_PLAN_ENDPOINT]);
  });

  it("still opens a code only the borrowed check knows (a code this record does not hold yet)", async () => {
    stubFetch({ [OWN_PLAN_ENDPOINT]: { body: { active: false } }, [PLAN_ENDPOINT]: { body: paid } });
    // The borrowed check exists for the ¥390 plan, so its word makes the code premium — it opens the
    // premium benefits, never the analysis layer (JCE-140).
    expect(await checkPlan(CODE)).toEqual({ ...paid, plan: "premium" });
  });

  it("falls back when this site's endpoint is not live yet, and reports not-paid when neither says paid", async () => {
    stubFetch({ [OWN_PLAN_ENDPOINT]: { status: 503 }, [PLAN_ENDPOINT]: { body: { active: false } } });
    expect(await checkPlan(CODE)).toEqual({ active: false });
    stubFetch({ [OWN_PLAN_ENDPOINT]: "throw", [PLAN_ENDPOINT]: { body: paid } });
    expect(await checkPlan(CODE)).toEqual({ ...paid, plan: "premium" });
  });
});
