import type { EntranceKv } from "./env";
import { esc } from "./html";

/**
 * The entrance form's answers, for the hosted console (JCE-117): the free one-company analysis trial the site and
 * the Instagram profile link to (the form itself is JCE-115). The answers hold a contact email — personal data —
 * so they live in exactly one place: the Worker's own KV namespace, never in the repository and never on a public
 * page. The Next console keeps the same rule with its local state file (JCE-115); this is that rule carried to a
 * Worker, which has no local files.
 *
 * Answers arrive by sync, not by the app calling Google: scripts/admin/sync-entrance-kv.mjs takes the same Google
 * Forms connector output the morning check reads and merges it into KV, keeping the operator's status and memo
 * (a sync never erases the handling record). The handling itself — status and memo — is operational data, not
 * published content, so the app writes it straight to KV; the pull-request flow is for what the site publishes.
 */

export const ENTRANCE_STATUSES = ["new", "delivered", "beta-sent", "declined"] as const;

export type EntranceStatus = (typeof ENTRANCE_STATUSES)[number];

export const ENTRANCE_STATUS_LABEL: Record<EntranceStatus, string> = {
  new: "未対応",
  delivered: "体験提供済み",
  "beta-sent": "β案内済み",
  declined: "見送り",
};

export const MAX_ENTRANCE_MEMO_LENGTH = 2000;

export type EntranceEntry = {
  responseId: string;
  /** The form's submission timestamp (ISO, as Google returns it). */
  submittedAt: string;
  email: string;
  /** The company the applicant named — a name or a securities code, exactly as written. */
  company: string;
  /** True when the β案内希望 answer was 「希望する」. */
  betaInterest: boolean;
  status: EntranceStatus;
  memo: string;
  /** When the operator last changed the status or memo; null until then. */
  statusUpdatedAt: string | null;
};

export type EntranceSummary = { total: number; pending: number; delivered: number; betaSent: number; betaInterest: number };

export type EntranceView = {
  /** False when the KV binding is not there yet: "not set up" is not "no applications". */
  available: boolean;
  entries: EntranceEntry[];
  summary: EntranceSummary;
  syncedAt: string | null;
};

export const isEntranceStatus = (v: unknown): v is EntranceStatus =>
  typeof v === "string" && (ENTRANCE_STATUSES as readonly string[]).includes(v);

const isEntry = (v: unknown): v is EntranceEntry => {
  if (!v || typeof v !== "object") return false;
  const e = v as EntranceEntry;
  return (
    typeof e.responseId === "string" &&
    typeof e.submittedAt === "string" &&
    typeof e.email === "string" &&
    typeof e.company === "string" &&
    typeof e.betaInterest === "boolean" &&
    isEntranceStatus(e.status) &&
    typeof e.memo === "string"
  );
};

const KEY_PREFIX = "resp:";
export const entranceKey = (responseId: string) => `${KEY_PREFIX}${responseId}`;

export function summarizeEntrance(entries: EntranceEntry[]): EntranceSummary {
  return {
    total: entries.length,
    pending: entries.filter((e) => e.status === "new").length,
    delivered: entries.filter((e) => e.status === "delivered").length,
    betaSent: entries.filter((e) => e.status === "beta-sent").length,
    betaInterest: entries.filter((e) => e.betaInterest).length,
  };
}

export async function loadEntrance(kv: EntranceKv | undefined): Promise<EntranceView> {
  if (!kv) return { available: false, entries: [], summary: summarizeEntrance([]), syncedAt: null };
  const names: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix: KEY_PREFIX, ...(cursor ? { cursor } : {}) });
    names.push(...page.keys.map((k) => k.name));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  const entries: EntranceEntry[] = [];
  for (const name of names) {
    const text = await kv.get(name);
    if (!text) continue;
    try {
      const parsed: unknown = JSON.parse(text);
      if (isEntry(parsed)) entries.push(parsed);
    } catch {
      // A record that does not parse is skipped, never shown half-read.
    }
  }
  entries.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  let syncedAt: string | null = null;
  try {
    const meta: unknown = JSON.parse((await kv.get("meta")) ?? "null");
    if (meta && typeof meta === "object" && typeof (meta as { syncedAt?: unknown }).syncedAt === "string") {
      syncedAt = (meta as { syncedAt: string }).syncedAt;
    }
  } catch {
    syncedAt = null;
  }
  return { available: true, entries, summary: summarizeEntrance(entries), syncedAt };
}

/**
 * Records the operator's handling of one application in KV. Returns false when there is no such entry — the
 * caller treats that as "nothing to save", never as an error worth showing the applicant's data for.
 */
export async function updateEntranceEntry(
  kv: EntranceKv,
  responseId: string,
  patch: { status?: EntranceStatus; memo?: string },
  now = new Date().toISOString(),
): Promise<boolean> {
  const text = await kv.get(entranceKey(responseId));
  if (!text) return false;
  let entry: EntranceEntry;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isEntry(parsed)) return false;
    entry = parsed;
  } catch {
    return false;
  }
  if (patch.status !== undefined) entry.status = patch.status;
  if (patch.memo !== undefined) entry.memo = patch.memo.slice(0, MAX_ENTRANCE_MEMO_LENGTH);
  entry.statusUpdatedAt = now;
  await kv.put(entranceKey(responseId), JSON.stringify(entry));
  return true;
}

/** An ISO timestamp as the operator reads it: Tokyo time, to the minute. Unparseable input is shown as-is. */
export const formatTokyo = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
};

const STATUS_PILL: Record<EntranceStatus, string> = {
  new: '<span class="pill warn">未対応</span>',
  delivered: '<span class="pill ok">体験提供済み</span>',
  "beta-sent": '<span class="pill ok">β案内済み</span>',
  declined: '<span class="pill">見送り</span>',
};

export function renderEntrance(view: EntranceView, canEdit: boolean): string {
  if (!view.available) {
    return `<h1>入口フォーム</h1><div class="card bad">回答の保存先（KV）がまだ設定されていません。</div>
<p class="muted">フォームの回答は連絡先メールを含む個人情報のため、リポジトリには置かず、この管理アプリ専用の Cloudflare KV に置きます。Worker「kigyo-admin」の変数に <code>ENTRANCE_KV</code> の KV バインドが必要です（docs/admin-app.md「入口フォーム」）。バインドが無い間は、回答があってもここには出ません。</p>`;
  }
  const s = view.summary;
  const kpi = (label: string, value: number, sub = "") =>
    `<section class="panel kpi"><div><div class="lb">${esc(label)}</div><div class="v">${value.toLocaleString("ja-JP")}</div>${sub ? `<div class="s">${esc(sub)}</div>` : ""}</div></section>`;
  const entryPanel = (e: EntranceEntry) => {
    const head = `<div class="row" style="justify-content:space-between"><strong>${esc(e.company || "（会社名なし）")}</strong>${STATUS_PILL[e.status]}</div>
<table><tr><th style="width:24%">受信日時</th><td>${esc(formatTokyo(e.submittedAt))}</td></tr>
<tr><th>メール</th><td>${esc(e.email)}</td></tr>
<tr><th>β案内希望</th><td>${e.betaInterest ? "希望する" : "今はしない（無料体験だけ）"}</td></tr>${
      e.statusUpdatedAt ? `<tr><th>対応の更新</th><td>${esc(formatTokyo(e.statusUpdatedAt))}</td></tr>` : ""
    }</table>`;
    if (!canEdit) return `<section class="panel" style="margin-bottom:12px">${head}${e.memo ? `<p style="white-space:pre-wrap;margin:10px 0 0">${esc(e.memo)}</p>` : ""}</section>`;
    return `<section class="panel" style="margin-bottom:12px">${head}
<form method="post" action="/entrance/update"><input type="hidden" name="responseId" value="${esc(e.responseId)}">
<label for="st-${esc(e.responseId)}">対応ステータス</label><select id="st-${esc(e.responseId)}" name="status">${ENTRANCE_STATUSES.map(
      (st) => `<option value="${st}"${st === e.status ? " selected" : ""}>${ENTRANCE_STATUS_LABEL[st]}</option>`,
    ).join("")}</select>
<label for="memo-${esc(e.responseId)}">メモ（${MAX_ENTRANCE_MEMO_LENGTH}文字まで）</label><textarea id="memo-${esc(e.responseId)}" name="memo" maxlength="${MAX_ENTRANCE_MEMO_LENGTH}" style="min-height:4em">${esc(e.memo)}</textarea>
<p><button type="submit">保存する</button></p></form></section>`;
  };
  return `<h1>入口フォーム</h1>
<p class="muted">無料の1社分析体験への申込（サイトと Instagram のプロフィールのフォーム）です。回答は個人情報のため、この管理アプリ専用の KV にだけ置き、リポジトリや公開ページには出しません。${
    view.syncedAt ? `最終同期：${esc(formatTokyo(view.syncedAt))}` : "まだ同期されていません。"
  }</p>
<div class="grid g4" style="margin-bottom:14px">${kpi("回答数", s.total)}${kpi("未対応", s.pending)}${kpi("体験提供済み", s.delivered)}${kpi("β案内済み", s.betaSent, `β希望 ${s.betaInterest}件`)}</div>
${view.entries.length ? view.entries.map(entryPanel).join("") : `<div class="panel"><p class="muted">回答はまだありません。</p></div>`}`;
}
