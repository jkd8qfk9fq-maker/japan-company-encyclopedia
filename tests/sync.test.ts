import { describe, expect, it } from "vitest";
import { mergeSyncData, parseSyncData, syncDiff, type SyncData } from "@/lib/sync-data";
import { handleSync, sha256, SYNC_TTL_MS } from "../worker/sync/api";
import { memorySyncStore } from "../worker/sync/store";

/** Moving a reader's lists to another device by an e-mailed one-time link (JCE-065). */

const ORIGIN = "https://kigyo-hyakka.com";
const NOW = 1_800_000_000_000;
const data: SyncData = { favorites: ["toyota", "sony-group"], recentlyViewed: ["toyota"], followedIndustries: ["automotive"], savedScreenings: [] };
const env = { RESEND_API_KEY: "re_test" };

const post = (path: string, body: unknown, origin = ORIGIN) =>
  new Request(`${ORIGIN}${path}`, { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });

function mailbox() {
  const sent: { to: string; link: string }[] = [];
  const mail = async (_env: unknown, to: string, link: string) => {
    sent.push({ to, link });
    return true;
  };
  return { sent, mail };
}

async function start(store: ReturnType<typeof memorySyncStore>, mail: ReturnType<typeof mailbox>["mail"], body: Record<string, unknown> = {}) {
  const r = await handleSync(post("/api/sync/start", { email: "reader@example.com", data, ...body }), env, store, NOW, mail);
  return { status: r.status, body: (await r.json()) as { cancelKey: string; expiresAt: number } };
}
const tokenOf = (link: string) => new URL(link).hash.replace("#t=", "");

describe("POST /api/sync/start", () => {
  it("mails a link whose token is in the fragment, and keeps only hashes and the lists — never the address", async () => {
    const store = memorySyncStore();
    const box = mailbox();
    const { status, body } = await start(store, box.mail);
    expect(status).toBe(200);
    expect(body.expiresAt).toBe(NOW + SYNC_TTL_MS);
    expect(box.sent).toHaveLength(1);
    expect(box.sent[0]!.link).toMatch(/^https:\/\/kigyo-hyakka\.com\/sync\/#t=[A-Za-z0-9_-]{43}$/);
    const [[id, row]] = [...store.rows];
    expect(id).toBe(await sha256(tokenOf(box.sent[0]!.link)));
    expect(row!.cancelId).toBe(await sha256(body.cancelKey));
    expect(JSON.stringify([...store.rows])).not.toContain("reader@example.com");
    expect(JSON.stringify([...store.rows])).not.toContain(tokenOf(box.sent[0]!.link));
  });

  it("refuses a bad address, lists this site never writes, another site's page, and a missing mail service", async () => {
    const store = memorySyncStore();
    const { mail } = mailbox();
    expect((await handleSync(post("/api/sync/start", { email: "not-an-address", data }), env, store, NOW, mail)).status).toBe(400);
    expect((await handleSync(post("/api/sync/start", { email: "a@example.com", data: { ...data, favorites: ["<script>"] } }), env, store, NOW, mail)).status).toBe(400);
    expect((await handleSync(post("/api/sync/start", { email: "a@example.com", data }, "https://evil.example"), env, store, NOW, mail)).status).toBe(403);
    expect((await handleSync(post("/api/sync/start", { email: "a@example.com", data }), {}, store, NOW, mail)).status).toBe(503);
    expect(store.rows.size).toBe(0);
  });

  it("is rate-limited per address", async () => {
    const limited = { ...env, SYNC_LIMIT: { limit: async () => ({ success: false }) } };
    expect((await handleSync(post("/api/sync/start", { email: "a@example.com", data }), limited, memorySyncStore(), NOW, mailbox().mail)).status).toBe(429);
  });

  it("keeps nothing when the mail could not be sent", async () => {
    const store = memorySyncStore();
    const r = await handleSync(post("/api/sync/start", { email: "a@example.com", data }), env, store, NOW, async () => false);
    expect(r.status).toBe(502);
    expect(store.rows.size).toBe(0);
  });
});

describe("POST /api/sync/claim", () => {
  it("gives the lists once; the second opening finds nothing", async () => {
    const store = memorySyncStore();
    const box = mailbox();
    await start(store, box.mail);
    const token = tokenOf(box.sent[0]!.link);
    const first = await handleSync(post("/api/sync/claim", { token }), env, store, NOW + 1000);
    expect(await first.json()).toEqual({ ok: true, data });
    expect((await handleSync(post("/api/sync/claim", { token }), env, store, NOW + 2000)).status).toBe(410);
  });

  it("refuses a link after its 30 minutes, and removes it", async () => {
    const store = memorySyncStore();
    const box = mailbox();
    await start(store, box.mail);
    const r = await handleSync(post("/api/sync/claim", { token: tokenOf(box.sent[0]!.link) }), env, store, NOW + SYNC_TTL_MS + 1);
    expect(r.status).toBe(410);
    expect(store.rows.size).toBe(0);
  });

  it("answers an unknown or malformed token without saying which", async () => {
    const store = memorySyncStore();
    expect((await handleSync(post("/api/sync/claim", { token: "x".repeat(43) }), env, store, NOW)).status).toBe(410);
    expect((await handleSync(post("/api/sync/claim", { token: "short" }), env, store, NOW)).status).toBe(400);
  });
});

describe("withdrawing and replacing", () => {
  it("a new link from the same browser makes the earlier one useless", async () => {
    const store = memorySyncStore();
    const box = mailbox();
    const first = await start(store, box.mail);
    await start(store, box.mail, { replace: first.body.cancelKey });
    expect(store.rows.size).toBe(1);
    expect((await handleSync(post("/api/sync/claim", { token: tokenOf(box.sent[0]!.link) }), env, store, NOW)).status).toBe(410);
    expect((await handleSync(post("/api/sync/claim", { token: tokenOf(box.sent[1]!.link) }), env, store, NOW)).status).toBe(200);
  });

  it("the sending browser can withdraw its link", async () => {
    const store = memorySyncStore();
    const box = mailbox();
    const { body } = await start(store, box.mail);
    await handleSync(post("/api/sync/cancel", { cancelKey: body.cancelKey }), env, store, NOW);
    expect(store.rows.size).toBe(0);
  });

  it("expired links are pruned on the schedule", async () => {
    const store = memorySyncStore();
    await start(store, mailbox().mail);
    await store.prune(NOW + SYNC_TTL_MS + 1);
    expect(store.rows.size).toBe(0);
  });
});

describe("the lists", () => {
  it("accept what this site writes and nothing else", () => {
    expect(parseSyncData(data)).toEqual(data);
    expect(parseSyncData({ ...data, recentlyViewed: Array.from({ length: 13 }, (_, i) => `c${i}`) })).toBeNull();
    expect(parseSyncData({ ...data, savedScreenings: [{ name: "x", conditions: { nope: 1 } }] })).toBeNull();
    expect(parseSyncData(null)).toBeNull();
  });

  it("merge without dropping anything on this device, and say what would be added before writing", () => {
    const here: SyncData = { favorites: ["sony-group", "honda"], recentlyViewed: ["honda"], followedIndustries: [], savedScreenings: [] };
    expect(mergeSyncData(here, data)).toEqual({
      favorites: ["sony-group", "honda", "toyota"],
      recentlyViewed: ["toyota", "honda"],
      followedIndustries: ["automotive"],
      savedScreenings: [],
    });
    expect(syncDiff(here, data)).toEqual({ favorites: 1, followedIndustries: 1, savedScreenings: 0, hereHasData: true });
  });
});
