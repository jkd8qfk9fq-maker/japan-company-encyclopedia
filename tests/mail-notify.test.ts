import { describe, expect, it } from "vitest";
import { CONFIRM_WINDOW_MS, digest, handleMail, runMailNotifications, type Mailer } from "../worker/mail/api";
import { memoryMailStore } from "../worker/mail/store";
import type { Updates } from "../worker/push/api";

/** Notifications by e-mail for readers whose browser will not show web notifications (JCE-069). */

const ORIGIN = "https://kigyo-hyakka.com";
const NOW = new Date("2026-11-18T06:00:00Z");
const env = { RESEND_API_KEY: "re_test" };

const post = (path: string, body: unknown, origin = ORIGIN) =>
  new Request(`${ORIGIN}${path}`, { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });

function outbox() {
  const sent: { to: string; subject: string; text: string; stopUrl?: string }[] = [];
  const send: Mailer = async (_env, mail) => {
    sent.push(mail);
    return true;
  };
  return { sent, send };
}

const tokenIn = (text: string) => /#t=([A-Za-z0-9_-]{43})/.exec(text)![1]!;

async function signUp(store: ReturnType<typeof memoryMailStore>, email = "reader@example.com", companies = ["toyota", "sony-group"], kinds = ["results", "corrections"]) {
  const box = outbox();
  const r = await handleMail(post("/api/mail/start", { email, companies, kinds }), env, store, NOW, box.send);
  const { manageKey } = (await r.json()) as { manageKey: string };
  return { status: r.status, manageKey, mail: box.sent[0]! };
}

async function confirmed(store: ReturnType<typeof memoryMailStore>, ...args: Parameters<typeof signUp> extends [unknown, ...infer R] ? R : never) {
  const s = await signUp(store, ...args);
  await handleMail(post("/api/mail/confirm", { token: tokenIn(s.mail.text) }), env, store, NOW);
  return s;
}

describe("registering", () => {
  it("mails a confirmation link and sends nothing else until it is opened", async () => {
    const store = memoryMailStore();
    const { status, manageKey, mail } = await signUp(store);
    expect(status).toBe(200);
    expect(mail.text).toMatch(/https:\/\/kigyo-hyakka\.com\/notifications\/mail\/#t=[A-Za-z0-9_-]{43}/);
    const state = async () => ((await (await handleMail(post("/api/mail/state", { manageKey }), env, store, NOW)).json()) as { state: string }).state;
    expect(await state()).toBe("pending");
    expect(await store.recipients(["toyota"])).toEqual([]);
    expect((await handleMail(post("/api/mail/confirm", { token: tokenIn(mail.text) }), env, store, NOW)).status).toBe(200);
    expect(await state()).toBe("on");
    expect((await store.recipients(["toyota"])).map((r) => r.email)).toEqual(["reader@example.com"]);
    // The link works once.
    expect((await handleMail(post("/api/mail/confirm", { token: tokenIn(mail.text) }), env, store, NOW)).status).toBe(410);
  });

  it("stores the kinds the reader chose, and refuses an empty or unknown choice", async () => {
    const store = memoryMailStore();
    await confirmed(store, "a@example.com", ["toyota"], ["results"]);
    expect((await store.recipients(["toyota"]))[0]!.kinds).toEqual(["results"]);
    const { send } = outbox();
    for (const kinds of [[], ["prices"], ["results", "prices"]])
      expect((await handleMail(post("/api/mail/start", { email: "a@example.com", companies: ["toyota"], kinds }), env, store, NOW, send)).status).toBe(400);
  });

  it("refuses a bad address, no companies, another site's page, and a missing mail service", async () => {
    const store = memoryMailStore();
    const { send } = outbox();
    const body = { email: "a@example.com", companies: ["toyota"], kinds: ["results"] };
    expect((await handleMail(post("/api/mail/start", { ...body, email: "nope" }), env, store, NOW, send)).status).toBe(400);
    expect((await handleMail(post("/api/mail/start", { ...body, companies: [] }), env, store, NOW, send)).status).toBe(400);
    expect((await handleMail(post("/api/mail/start", { ...body, companies: ["<script>"] }), env, store, NOW, send)).status).toBe(400);
    expect((await handleMail(post("/api/mail/start", body, "https://evil.example"), env, store, NOW, send)).status).toBe(403);
    expect((await handleMail(post("/api/mail/start", body), {}, store, NOW, send)).status).toBe(503);
    expect(store.rows.size).toBe(0);
  });

  it("keeps nothing when the confirmation could not be sent", async () => {
    const store = memoryMailStore();
    const r = await handleMail(post("/api/mail/start", { email: "a@example.com", companies: ["toyota"], kinds: ["results"] }), env, store, NOW, async () => false);
    expect(r.status).toBe(502);
    expect(store.rows.size).toBe(0);
  });

  it("is rate-limited", async () => {
    const limited = { ...env, MAIL_LIMIT: { limit: async () => ({ success: false }) } };
    const r = await handleMail(post("/api/mail/start", { email: "a@example.com", companies: ["toyota"], kinds: ["results"] }), limited, memoryMailStore(), NOW, outbox().send);
    expect(r.status).toBe(429);
  });

  it("registering again from the same browser replaces the earlier sign-up", async () => {
    const store = memoryMailStore();
    const first = await signUp(store);
    const { send } = outbox();
    await handleMail(post("/api/mail/start", { email: "new@example.com", companies: ["toyota"], kinds: ["results"], replace: first.manageKey }), env, store, NOW, send);
    expect([...store.rows.values()].map((r) => r.email)).toEqual(["new@example.com"]);
  });

  it("forgets an address that was never confirmed after 24 hours", async () => {
    const store = memoryMailStore();
    await signUp(store);
    await runMailNotifications(env, store, async () => ({ names: {}, events: [] }), outbox().send, new Date(NOW.getTime() + CONFIRM_WINDOW_MS + 1000));
    expect(store.rows.size).toBe(0);
  });
});

describe("changing and stopping", () => {
  it("follows the browser's list, and an empty list ends the sign-up", async () => {
    const store = memoryMailStore();
    const { manageKey } = await confirmed(store);
    await handleMail(post("/api/mail/update", { manageKey, companies: ["honda"] }), env, store, NOW);
    expect((await store.recipients(["toyota", "honda"])).map((r) => r.companyId)).toEqual(["honda"]);
    await handleMail(post("/api/mail/update", { manageKey, companies: [] }), env, store, NOW);
    expect(store.rows.size).toBe(0);
  });

  it("stops from the page, from the mailed link, and by the mail client's one-click form", async () => {
    for (const how of ["page", "link", "one-click"] as const) {
      const store = memoryMailStore();
      const { manageKey } = await confirmed(store);
      const stopKey = [...store.rows.values()][0]!.stopKey;
      if (how === "page") await handleMail(post("/api/mail/stop", { manageKey }), env, store, NOW);
      if (how === "link") await handleMail(post("/api/mail/stop-link", { stopKey }), env, store, NOW);
      if (how === "one-click") {
        const r = new Request(`${ORIGIN}/api/mail/unsubscribe?k=${stopKey}`, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: "List-Unsubscribe=One-Click",
        });
        expect((await handleMail(r, env, store, NOW)).status).toBe(200);
      }
      expect(store.rows.size).toBe(0);
    }
  });
});

describe("the scheduled mails", () => {
  const updates = (events: Updates["events"]): Updates => ({ names: { toyota: "トヨタ自動車", "sony-group": "ソニーグループ", honda: "本田技研工業" }, events });
  const yuho: Updates["events"][number] = ["toyota", "yuho", "2026-11-18", "有価証券報告書"];
  const tanshin: Updates["events"][number] = ["sony-group", "tanshin", "2026-11-18", "決算短信"];
  const fix: Updates["events"][number] = ["toyota", "correction", "2026-11-18", "訂正"];

  it("records what is already listed on the first run, then mails each address once with every company that has news", async () => {
    const store = memoryMailStore();
    await confirmed(store);
    const box = outbox();
    expect(await runMailNotifications(env, store, async () => updates([]), box.send, NOW)).toMatchObject({ bootstrap: true });
    const result = await runMailNotifications(env, store, async () => updates([yuho, tanshin]), box.send, NOW);
    expect(result).toMatchObject({ sent: 1, announced: 2, pending: 0 });
    expect(box.sent).toHaveLength(1);
    expect(box.sent[0]!.subject).toBe("トヨタ自動車ほか1社に新しいお知らせ");
    expect(box.sent[0]!.text).toContain("ソニーグループの新しい決算データが公開されました");
    expect(box.sent[0]!.text).toContain("https://kigyo-hyakka.com/companies/toyota/");
    expect(box.sent[0]!.stopUrl).toMatch(/\/api\/mail\/unsubscribe\?k=/);
    // Announced once.
    await runMailNotifications(env, store, async () => updates([yuho, tanshin]), box.send, NOW);
    expect(box.sent).toHaveLength(1);
  });

  it("sends only the kinds the reader chose", async () => {
    const store = memoryMailStore();
    await confirmed(store, "r@example.com", ["toyota"], ["corrections"]);
    const box = outbox();
    await runMailNotifications(env, store, async () => updates([]), box.send, NOW);
    await runMailNotifications(env, store, async () => updates([yuho]), box.send, NOW);
    expect(box.sent).toHaveLength(0);
    await runMailNotifications(env, store, async () => updates([yuho, fix]), box.send, NOW);
    expect(box.sent.map((m) => m.subject)).toEqual(["トヨタ自動車の掲載内容が更新されました"]);
  });

  it("never mails an unconfirmed address, and one mail reaches an address registered from two browsers", async () => {
    const store = memoryMailStore();
    await signUp(store, "pending@example.com");
    await confirmed(store, "twice@example.com", ["toyota"]);
    await confirmed(store, "Twice@example.com", ["toyota"]);
    const box = outbox();
    await runMailNotifications(env, store, async () => updates([]), box.send, NOW);
    await runMailNotifications(env, store, async () => updates([yuho]), box.send, NOW);
    expect(box.sent.map((m) => m.to)).toEqual(["twice@example.com"]);
  });

  it("over the per-run budget, the rest go out next run — and nobody gets the same news twice", async () => {
    const store = memoryMailStore();
    for (const n of [1, 2, 3]) await confirmed(store, `r${n}@example.com`, ["toyota"]);
    const box = outbox();
    const capped = { ...env, MAIL_SENDS_PER_RUN: "2" };
    await runMailNotifications(capped, store, async () => updates([]), box.send, NOW);
    expect(await runMailNotifications(capped, store, async () => updates([yuho]), box.send, NOW)).toMatchObject({ sent: 2, pending: 1 });
    expect(await runMailNotifications(capped, store, async () => updates([yuho]), box.send, NOW)).toMatchObject({ sent: 1, pending: 0 });
    expect(box.sent.map((m) => m.to).sort()).toEqual(["r1@example.com", "r2@example.com", "r3@example.com"]);
    expect(store.deliveredPairs.size).toBe(0);
  });

  it("retries an address whose mail failed, without holding back the others", async () => {
    const store = memoryMailStore();
    await confirmed(store, "ok@example.com", ["toyota"]);
    await confirmed(store, "bad@example.com", ["toyota"]);
    const sent: string[] = [];
    const flaky: Mailer = async (_e, m) => (m.to === "bad@example.com" ? false : (sent.push(m.to), true));
    await runMailNotifications(env, store, async () => updates([]), flaky, NOW);
    expect(await runMailNotifications(env, store, async () => updates([yuho]), flaky, NOW)).toMatchObject({ sent: 1, failed: 1, pending: 1 });
    await runMailNotifications(env, store, async () => updates([yuho]), outbox().send, NOW);
    await runMailNotifications(env, store, async () => updates([yuho]), flaky, NOW);
    expect(sent).toEqual(["ok@example.com"]);
  });

  it("says only facts, with the way to stop", () => {
    const mail = digest("r@example.com", "k".repeat(43), [yuho], updates([]).names);
    expect(mail.subject).toBe("トヨタ自動車の新しい決算データが公開されました");
    expect(mail.text).toContain(`https://kigyo-hyakka.com/notifications/mail/#s=${"k".repeat(43)}`);
    expect(mail.text).not.toMatch(/買い|売り|おすすめ|株価/);
  });
});
