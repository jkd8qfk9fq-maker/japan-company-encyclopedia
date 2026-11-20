import { BOOTSTRAP_KEY, messageFor, type RateLimit, type Updates } from "../push/api";
import { randomKey, sha256 } from "../sync/api";
import { MAIL_KINDS, type MailKind, type MailStore } from "./store";

/**
 * Notifications by e-mail for followed companies (JCE-069). Web notifications need a permission many browsers never
 * grant (blocked prompts, iPhone without the home-screen app, managed PCs); a reader may instead give an address.
 * It is used only after the reader opens the confirmation mail, and each mail carries a link that stops it at once.
 * The same facts as a push notification, nothing else: 「〇〇の新しい決算データが公開されました」 and the page.
 */
export type MailEnv = {
  MAIL_LIMIT?: RateLimit;
  /** Resend API key, shared with JCE-065's link mails. Without it (and outside development) the feature is off. */
  RESEND_API_KEY?: string;
  MAIL_NOTIFY_FROM?: string;
  /** Development only (.dev.vars): log the mails instead of sending them. */
  SYNC_MAIL_LOG?: string;
  /** Mails sent per scheduled run at most (Workers caps the requests one run may make). Default 40. */
  MAIL_SENDS_PER_RUN?: string;
};

const MAX_BODY_BYTES = 64 * 1024;
const EMAIL = /^[^\s@"<>,;]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;
const KEY = /^[A-Za-z0-9_-]{43}$/;
const COMPANY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_COMPANIES = 2000;
/** An address that was never confirmed is forgotten after this. */
export const CONFIRM_WINDOW_MS = 24 * 3600 * 1000;
const SITE = "https://kigyo-hyakka.com";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

export const mailOn = (env: MailEnv) => Boolean(env.RESEND_API_KEY) || env.SYNC_MAIL_LOG === "1";

function companiesOf(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_COMPANIES) return null;
  if (value.some((c) => typeof c !== "string" || c.length > 80 || !COMPANY_ID.test(c))) return null;
  return [...new Set(value as string[])];
}

function kindsOf(value: unknown): MailKind[] | null {
  if (!Array.isArray(value)) return null;
  const kinds = MAIL_KINDS.filter((k) => value.includes(k));
  return kinds.length > 0 && kinds.length === new Set(value).size ? kinds : null;
}

export type Mailer = (env: MailEnv, mail: { to: string; subject: string; text: string; stopUrl?: string }) => Promise<boolean>;

export async function handleMail(request: Request, env: MailEnv, store: MailStore | null, now = new Date(), send: Mailer = sendMail): Promise<Response> {
  const url = new URL(request.url);
  const iso = now.toISOString();
  if (request.method === "GET" && url.pathname === "/api/mail/status") return json({ available: Boolean(store && mailOn(env)) });
  if (request.method !== "POST") return json({ error: "method" }, 405);
  if (!store || !mailOn(env)) return json({ error: "not-configured" }, 503);

  // The stop link's one-click form (RFC 8058): the mail client posts it, so it carries no Origin from this site.
  // It can only remove the subscription the key belongs to, which is what every mail promises.
  if (url.pathname === "/api/mail/unsubscribe") {
    const key = url.searchParams.get("k") ?? "";
    if (KEY.test(key)) await store.removeByStopKey(key);
    return json({ ok: true });
  }

  if (request.headers.get("origin") !== url.origin) return json({ error: "origin" }, 403);
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "content-type" }, 415);
  if (Number(request.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return json({ error: "too-large" }, 413);
  if (env.MAIL_LIMIT) {
    const { success } = await env.MAIL_LIMIT.limit({ key: request.headers.get("cf-connecting-ip") ?? "unknown" });
    if (!success) return json({ error: "rate" }, 429);
  }
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return json({ error: "body" }, 400);
  }

  if (url.pathname === "/api/mail/start") {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const companies = companiesOf(body.companies);
    const kinds = kindsOf(body.kinds);
    if (!EMAIL.test(email) || !companies || !kinds) return json({ error: "input" }, 400);
    // Mailing is the costly and abusable step: each address may be sent a confirmation only a few times a minute.
    if (env.MAIL_LIMIT) {
      const { success } = await env.MAIL_LIMIT.limit({ key: `to:${(await sha256(email.toLowerCase())).slice(0, 32)}` });
      if (!success) return json({ error: "rate" }, 429);
    }
    // Registering again from this browser (a new address, or a lost confirmation mail) replaces its earlier sign-up.
    if (typeof body.replace === "string" && KEY.test(body.replace)) await store.remove(await sha256(body.replace));
    const manageKey = randomKey();
    const token = randomKey();
    const id = await sha256(manageKey);
    await store.create({ id, stopKey: randomKey(), confirmId: await sha256(token), email, kinds, companies, now: iso });
    const sent = await send(env, {
      to: email,
      subject: "メール通知の確認（日本企業百科事典）",
      text: [
        "日本企業百科事典で、フォロー中の会社のお知らせをメールで受け取る手続きがありました。",
        "次のリンクを開くと、配信が始まります（24時間以内・1回だけ有効）。",
        "",
        `${url.origin}/notifications/mail/#t=${token}`,
        "",
        "心当たりがない場合は、このメールを削除してください。リンクを開かなければ、メールアドレスは24時間後に削除され、何も届きません。",
      ].join("\n"),
    });
    if (!sent) {
      await store.remove(id);
      return json({ error: "mail" }, 502);
    }
    return json({ ok: true, manageKey });
  }

  if (url.pathname === "/api/mail/confirm") {
    if (typeof body.token !== "string" || !KEY.test(body.token)) return json({ error: "input" }, 400);
    return (await store.confirm(await sha256(body.token), iso)) ? json({ ok: true }) : json({ error: "gone" }, 410);
  }

  if (url.pathname === "/api/mail/stop-link") {
    if (typeof body.stopKey !== "string" || !KEY.test(body.stopKey)) return json({ error: "input" }, 400);
    await store.removeByStopKey(body.stopKey);
    return json({ ok: true });
  }

  // The registering browser: its key reads the state, replaces the company list as follows change, or stops.
  if (typeof body.manageKey !== "string" || !KEY.test(body.manageKey)) return json({ error: "input" }, 400);
  const id = await sha256(body.manageKey);
  if (url.pathname === "/api/mail/state") return json({ state: (await store.state(id)) ?? "none" });
  if (url.pathname === "/api/mail/update") {
    const companies = Array.isArray(body.companies) && body.companies.length === 0 ? [] : companiesOf(body.companies);
    if (!companies) return json({ error: "input" }, 400);
    if (companies.length === 0) {
      await store.remove(id);
      return json({ state: "none" });
    }
    return (await store.update(id, companies, iso)) ? json({ ok: true }) : json({ state: "none" }, 410);
  }
  if (url.pathname === "/api/mail/stop") {
    await store.remove(id);
    return json({ ok: true });
  }
  return json({ error: "not-found" }, 404);
}

const RESULTS = new Set(["yuho", "hanki", "tanshin"]);
const kindOfEvent = (kind: string): MailKind => (RESULTS.has(kind) ? "results" : "corrections");

/**
 * The scheduled run, after the push run on the same /updates.json — what is LIVE on the site. One mail per address per
 * run lists every followed company with something new, so a busy filing day is one mail, not one per company. The first
 * run only records what is already listed. Mails per run are capped; whoever was not reached gets theirs next run.
 */
export async function runMailNotifications(env: MailEnv, store: MailStore | null, loadUpdates: () => Promise<Updates>, send: Mailer = sendMail, now = new Date()) {
  if (!store || !mailOn(env)) return { skipped: true as const };
  const iso = now.toISOString();
  await store.prune(new Date(now.getTime() - CONFIRM_WINDOW_MS).toISOString(), new Date(now.getTime() - 150 * 24 * 3600 * 1000).toISOString());

  const updates = await loadUpdates();
  // The same identity as the push run: the summary (JCE-071) is not part of it (see worker/push/api.ts).
  const keyOf = (e: Updates["events"][number]) => e.slice(0, 4).join("|");
  if (await store.isEmptySeen()) {
    await store.markSeen([BOOTSTRAP_KEY, ...updates.events.map(keyOf)], iso);
    return { bootstrap: true as const, recorded: updates.events.length };
  }
  const seen = await store.seen(updates.events.map(keyOf));
  const fresh = updates.events.filter((e) => !seen.has(keyOf(e)));
  if (fresh.length === 0) return { sent: 0, failed: 0, announced: 0, pending: 0 };

  const recipients = await store.recipients([...new Set(fresh.map((e) => e[0]))]);
  const delivered = await store.delivered(fresh.map(keyOf));
  // Per address (the same reader may have registered from two browsers): the subscriptions and the events still owed.
  const byEmail = new Map<string, { ids: Set<string>; stopKey: string; events: Map<string, Updates["events"][number]> }>();
  for (const r of recipients) {
    for (const e of fresh) {
      if (e[0] !== r.companyId || !r.kinds.includes(kindOfEvent(e[1])) || delivered.has(`${r.id}|${keyOf(e)}`)) continue;
      const entry = byEmail.get(r.email.toLowerCase()) ?? { ids: new Set(), stopKey: r.stopKey, events: new Map() };
      entry.ids.add(r.id);
      entry.events.set(keyOf(e), e);
      byEmail.set(r.email.toLowerCase(), entry);
    }
  }

  const budget = Number(env.MAIL_SENDS_PER_RUN) > 0 ? Number(env.MAIL_SENDS_PER_RUN) : 40;
  let sent = 0;
  let failed = 0;
  const owed = new Set<string>();
  for (const [email, entry] of [...byEmail].sort(([a], [b]) => a.localeCompare(b))) {
    if (sent + failed >= budget) {
      for (const k of entry.events.keys()) owed.add(k);
      continue;
    }
    const ok = await send(env, digest(email, entry.stopKey, [...entry.events.values()], updates.names));
    if (ok) {
      sent++;
      await store.markDelivered([...entry.ids].flatMap((id) => [...entry.events.keys()].map((k): [string, string] => [id, k])));
    } else {
      failed++;
      for (const k of entry.events.keys()) owed.add(k);
    }
  }
  // An event is done once nobody is still owed it; the rest stay fresh for the next run.
  const done = fresh.map(keyOf).filter((k) => !owed.has(k));
  await store.markSeen(done, iso);
  await store.clearDelivered(done);
  return { sent, failed, announced: done.length, pending: fresh.length - done.length };
}

/** One mail: each company's fact and page, newest first, and how to stop. */
export function digest(to: string, stopKey: string, events: Updates["events"], names: Record<string, string>) {
  const byCompany = new Map<string, { kinds: string[]; summaries: string[] }>();
  for (const [companyId, kind, , , summary] of events) {
    const entry = byCompany.get(companyId) ?? { kinds: [], summaries: [] };
    entry.kinds.push(kind);
    if (summary) entry.summaries.push(summary);
    byCompany.set(companyId, entry);
  }
  const lines = [...byCompany].map(([companyId, { kinds, summaries }]) => {
    const m = messageFor(companyId, kinds, names, summaries);
    return `・${m.body}\n  ${SITE}${m.url}`;
  });
  const first = names[[...byCompany.keys()][0]!] ?? [...byCompany.keys()][0]!;
  const stopUrl = `${SITE}/notifications/mail/#s=${stopKey}`;
  return {
    to,
    subject: byCompany.size === 1 ? lines[0]!.split("\n")[0]!.slice(1) : `${first}ほか${byCompany.size - 1}社に新しいお知らせ`,
    text: [
      "フォロー中の会社に新しいお知らせがあります。",
      "",
      ...lines,
      "",
      "お知らせの一覧: " + `${SITE}/notifications`,
      "",
      "――",
      "日本企業百科事典で「メールで受け取る」を選んだ方にお送りしています。送るのは決算や掲載内容の更新という事実だけで、投資の助言ではありません。",
      `配信を止める: ${stopUrl}`,
    ].join("\n"),
    stopUrl: `${SITE}/api/mail/unsubscribe?k=${stopKey}`,
  };
}

async function sendMail(env: MailEnv, mail: { to: string; subject: string; text: string; stopUrl?: string }): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    if (env.SYNC_MAIL_LOG === "1") console.log(`[mail, development] to ${mail.to}: ${mail.subject}\n${mail.text}`);
    return env.SYNC_MAIL_LOG === "1";
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_NOTIFY_FROM ?? "日本企業百科事典 <notice@kigyo-hyakka.com>",
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      // Mail clients show their own 「配信停止」 button from these, and it works without opening the site.
      ...(mail.stopUrl ? { headers: { "List-Unsubscribe": `<${mail.stopUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } } : {}),
    }),
  });
  if (!response.ok) console.error("mail: refused", response.status);
  return response.ok;
}
