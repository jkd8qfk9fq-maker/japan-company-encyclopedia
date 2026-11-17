import { describe, expect, it } from "vitest";
import { handlePush, messageFor, runNotifications, type Updates } from "../worker/push/api";
import { memoryStore, subscriptionId } from "../worker/push/store";
import { b64url, type Bytes } from "../worker/push/webpush";

/** JCE-059: subscribing, unsubscribing, and the scheduled announcement of what /updates.json newly lists. */

const ORIGIN = "https://kigyo-hyakka.com";
const u8 = (b: ArrayBuffer | Uint8Array): Bytes => new Uint8Array(b);

async function vapidKeys() {
  const pair = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
  return { VAPID_PUBLIC_KEY: b64url.encode(u8(await crypto.subtle.exportKey("raw", pair.publicKey))), VAPID_PRIVATE_KEY: (await crypto.subtle.exportKey("jwk", pair.privateKey)).d! };
}

/** A browser: its push keys, and the means to read what the push service delivers to it (RFC 8291, receiver side). */
async function browser(endpoint = "https://fcm.googleapis.com/fcm/send/abc123") {
  const pair = (await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"])) as CryptoKeyPair;
  const publicRaw = u8(await crypto.subtle.exportKey("raw", pair.publicKey));
  const auth = u8(crypto.getRandomValues(new Uint8Array(16)));
  const hkdf = async (salt: Bytes, ikm: Bytes, info: Bytes, n: number) =>
    u8(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]), n * 8));
  const text = (s: string) => u8(new TextEncoder().encode(s));
  return {
    subscription: { endpoint, keys: { p256dh: b64url.encode(publicRaw), auth: b64url.encode(auth) } },
    async read(body: Bytes) {
      const salt = body.slice(0, 16);
      const idlen = body[20]!;
      const senderRaw = body.slice(21, 21 + idlen);
      const sender = await crypto.subtle.importKey("raw", senderRaw, { name: "ECDH", namedCurve: "P-256" }, false, []);
      const secret = u8(await crypto.subtle.deriveBits({ name: "ECDH", public: sender }, pair.privateKey, 256));
      const info = new Uint8Array([...text("WebPush: info\0"), ...publicRaw, ...senderRaw]);
      const ikm = await hkdf(auth, secret, u8(info), 32);
      const cek = await hkdf(salt, ikm, text("Content-Encoding: aes128gcm\0"), 16);
      const nonce = await hkdf(salt, ikm, text("Content-Encoding: nonce\0"), 12);
      const plain = u8(await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]), body.slice(21 + idlen)));
      return JSON.parse(new TextDecoder().decode(plain.slice(0, plain.lastIndexOf(2))));
    },
  };
}

const post = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`${ORIGIN}${path}`, { method: "POST", headers: { "content-type": "application/json", origin: ORIGIN, ...headers }, body: JSON.stringify(body) });

describe("/api/push", () => {
  it("reports itself off until the VAPID keys and the database are there", async () => {
    expect(await (await handlePush(new Request(`${ORIGIN}/api/push/key`), {}, memoryStore())).json()).toEqual({ available: false });
    const keys = await vapidKeys();
    expect(await (await handlePush(new Request(`${ORIGIN}/api/push/key`), keys, null)).json()).toEqual({ available: false });
    expect(await (await handlePush(new Request(`${ORIGIN}/api/push/key`), keys, memoryStore())).json()).toEqual({ available: true, publicKey: keys.VAPID_PUBLIC_KEY, maxCompanies: null });
    expect((await handlePush(post("/api/push/subscribe", {}), {}, memoryStore())).status).toBe(503);
  });

  it("stores a subscription with the companies it follows — and nothing about who the reader is", async () => {
    const store = memoryStore();
    const b = await browser();
    const res = await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: ["toyota", "sony", "toyota"] }, { "cf-connecting-ip": "203.0.113.9", "user-agent": "Mozilla/5.0 Test" }), await vapidKeys(), store);
    expect(await res.json()).toEqual({ ok: true, companies: 2 });
    const row = store.subs.get(await subscriptionId(b.subscription.endpoint))!;
    expect([...row.companies].sort()).toEqual(["sony", "toyota"]);
    expect(JSON.stringify([...store.subs.values()])).not.toMatch(/203\.0\.113\.9|Mozilla/);
  });

  it("replaces the list on every send, and an empty list or unsubscribe removes the subscription", async () => {
    const store = memoryStore();
    const env = await vapidKeys();
    const b = await browser();
    await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: ["toyota"] }), env, store);
    await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: ["sony"] }), env, store);
    expect([...store.subs.values()][0]!.companies).toEqual(new Set(["sony"]));
    await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: [] }), env, store);
    expect(store.subs.size).toBe(0);
    await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: ["toyota"] }), env, store);
    expect((await handlePush(post("/api/push/unsubscribe", { endpoint: b.subscription.endpoint }), env, store)).status).toBe(200);
    expect(store.subs.size).toBe(0);
  });

  it("refuses other sites, other push addresses, bad keys, bad ids and a list over the limit", async () => {
    const store = memoryStore();
    const env = await vapidKeys();
    const b = await browser();
    const sub = b.subscription;
    expect((await handlePush(post("/api/push/subscribe", { subscription: sub, companies: ["toyota"] }, { origin: "https://evil.example" }), env, store)).status).toBe(403);
    expect((await handlePush(post("/api/push/subscribe", { subscription: { ...sub, endpoint: "https://evil.example/x" }, companies: ["toyota"] }), env, store)).status).toBe(400);
    expect((await handlePush(post("/api/push/subscribe", { subscription: { ...sub, keys: { p256dh: "AAAA", auth: sub.keys.auth } }, companies: ["toyota"] }), env, store)).status).toBe(400);
    expect((await handlePush(post("/api/push/subscribe", { subscription: sub, companies: ["../etc"] }), env, store)).status).toBe(400);
    const limited = await handlePush(post("/api/push/subscribe", { subscription: sub, companies: ["a", "b", "c"] }), { ...env, PUSH_MAX_COMPANIES: "2" }, store);
    expect(limited.status).toBe(409);
    expect(await limited.json()).toEqual({ error: "limit", max: 2 });
    expect(store.subs.size).toBe(0);
  });
});

describe("scheduled announcements", () => {
  const updates = (events: Updates["events"]): Updates => ({ names: { toyota: "トヨタ自動車", sony: "ソニーグループ" }, events });
  const pushService = (status = 201) => {
    const calls: { url: string; headers: Headers; body: Bytes }[] = [];
    const send = (async (url: string, init: RequestInit) => {
      calls.push({ url, headers: new Headers(init.headers), body: u8(init.body as Uint8Array) });
      return new Response(null, { status });
    }) as typeof fetch;
    return { calls, send };
  };

  it("records what is already listed on its first run, and announces nothing", async () => {
    const store = memoryStore();
    const env = await vapidKeys();
    const b = await browser();
    await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: ["toyota"] }), env, store);
    const { calls, send } = pushService();
    expect(await runNotifications(env, store, async () => updates([["toyota", "yuho", "2026-06-20", "有報"]]), send)).toEqual({ bootstrap: true, recorded: 1 });
    expect(calls).toHaveLength(0);
  });

  it("announces a new filing once, encrypted for the follower, with a fact and no advice", async () => {
    const store = memoryStore();
    const env = await vapidKeys();
    const b = await browser();
    await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: ["toyota"] }), env, store);
    const { calls, send } = pushService();
    await runNotifications(env, store, async () => updates([["toyota", "yuho", "2026-06-20", "有報"]]), send);
    const later = updates([["toyota", "yuho", "2026-06-20", "有報"], ["toyota", "tanshin", "2026-08-04", "Q1"], ["sony", "hanki", "2026-11-13", "半期"]]);
    expect(await runNotifications(env, store, async () => later, send)).toMatchObject({ sent: 1, announced: 2 });
    expect(calls).toHaveLength(1); // sony has no follower; toyota's follower gets one message
    expect(calls[0]!.url).toBe(b.subscription.endpoint);
    expect(calls[0]!.headers.get("content-encoding")).toBe("aes128gcm");
    expect(calls[0]!.headers.get("authorization")).toMatch(/^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=/);
    expect(await b.read(calls[0]!.body)).toEqual({ title: "日本企業百科事典", body: "トヨタ自動車の新しい決算データが公開されました", url: "/companies/toyota/", tag: "company-toyota" });
    await runNotifications(env, store, async () => later, send);
    expect(calls).toHaveLength(1); // nothing new: nothing sent
  });

  it("forgets a subscription the push service says is gone (404/410)", async () => {
    const store = memoryStore();
    const env = await vapidKeys();
    const b = await browser();
    await handlePush(post("/api/push/subscribe", { subscription: b.subscription, companies: ["toyota"] }), env, store);
    await runNotifications(env, store, async () => updates([]), pushService().send);
    const gone = pushService(410);
    expect(await runNotifications(env, store, async () => updates([["toyota", "yuho", "2026-06-20", "有報"]]), gone.send)).toMatchObject({ gone: 1 });
    expect(store.subs.size).toBe(0);
  });

  it("stays within the run's budget and finishes in the next run", async () => {
    const store = memoryStore();
    const env = { ...(await vapidKeys()), PUSH_SENDS_PER_RUN: "1" };
    const a = await browser("https://fcm.googleapis.com/fcm/send/a");
    const c = await browser("https://fcm.googleapis.com/fcm/send/c");
    await handlePush(post("/api/push/subscribe", { subscription: a.subscription, companies: ["toyota"] }), env, store);
    await handlePush(post("/api/push/subscribe", { subscription: c.subscription, companies: ["sony"] }), env, store);
    const { calls, send } = pushService();
    await runNotifications(env, store, async () => updates([]), send);
    const both = updates([["toyota", "yuho", "2026-06-20", "有報"], ["sony", "yuho", "2026-06-20", "有報"]]);
    expect(await runNotifications(env, store, async () => both, send)).toMatchObject({ sent: 1, pending: 1 });
    expect(await runNotifications(env, store, async () => both, send)).toMatchObject({ sent: 1, pending: 0 });
    expect(calls.map((x) => x.url).sort()).toEqual([a.subscription.endpoint, c.subscription.endpoint].sort());
  });

  it("words a correction as an update, not as results", () => {
    expect(messageFor("toyota", ["correction"], { toyota: "トヨタ自動車" }).body).toBe("トヨタ自動車の掲載内容が更新されました");
    expect(messageFor("x", ["hanki"], {}).body).toBe("xの新しい決算データが公開されました");
  });
});

describe("the first-run marker", () => {
  it("survives housekeeping, so a quiet first run never repeats", async () => {
    const store = memoryStore();
    const env = await vapidKeys();
    const send = (async () => new Response(null, { status: 201 })) as unknown as typeof fetch;
    const jan = new Date("2026-01-01T00:00:00Z");
    await runNotifications(env, store, async () => ({ names: {}, events: [] }), send, jan);
    const later = new Date("2026-12-01T00:00:00Z"); // after the 150-day window
    expect(await runNotifications(env, store, async () => ({ names: {}, events: [] }), send, later)).toMatchObject({ announced: 0 });
    expect(store.seenKeys.has("__bootstrap__")).toBe(true);
  });
});
