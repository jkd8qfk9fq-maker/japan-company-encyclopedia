import type { UpdateKind, UpdatesData } from "./engagement-data";

/**
 * The weekly digest as an e-mail draft (JCE-086): the same week's filings the /digest page shows (JCE-052
 * updates, JCE-071 verified-figures summaries), rendered as a training prompt, not a news bulletin.
 *
 * This module has no runtime imports on purpose: the operator script `scripts/digest/send-weekly-digest.mjs`
 * imports it directly with plain Node (type stripping), so it cannot depend on the `@/` alias or on any
 * module with side effects. The week arithmetic mirrors `src/lib/jst-dates.ts` and the reading labels mirror
 * `src/lib/digest.ts`'s `readingFor`; the parity is asserted in `tests/digest-email.test.ts`, so a drift in
 * either canonical source fails the test instead of silently changing the mail.
 *
 * Line-drawing, same as the page: only the figures a filing itself prints (revenue and net income, with the
 * period they belong to). No computed values, no stock price, no PER/PBR/ROE, no scores or ratings, no
 * recommendation. A correction event carries no figures, so it is listed without any. Nothing is sent from
 * here — the script only writes a draft file.
 */

export type DigestEmail = {
  subject: string;
  text: string;
  html: string;
};

const DEFAULT_SITE_URL = "https://kigyo-hyakka.com";

/** How many filings the list shows before it points at /digest for the rest. */
export const DIGEST_EMAIL_MAX_LISTED = 12;
/** How many 決算短信 the highlight shows: the filings a reader can train on first (predict, then verify). */
export const DIGEST_EMAIL_MAX_HIGHLIGHT = 3;

const KIND: Record<UpdateKind, string> = { yuho: "有価証券報告書", hanki: "半期報告書", tanshin: "決算短信", correction: "訂正" };

/** Mirrors src/lib/digest.ts's readingFor: the reading each kind of filing calls for. */
const readingFor = (kind: UpdateKind, companyId: string): { label: string; href: string } => {
  switch (kind) {
    case "tanshin":
      return { label: "読み方：先に予想して、答え合わせ（マイクロレッスン）", href: "/learn#micro-five-profits" };
    case "correction":
      return { label: "読み方：訂正は企業ページの数字で確かめる", href: `/companies/${companyId}#financials` };
    default:
      return { label: "読み方：利益は5つある（マイクロレッスン）", href: "/learn#micro-five-profits" };
  }
};

/** Mirrors src/lib/jst-dates.ts: day strings are labels, counted on the UTC calendar of the string itself. */
const toIndex = (day: string) => Math.round(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86_400_000);
const fromIndex = (index: number) => new Date(index * 86_400_000).toISOString().slice(0, 10);
const addDays = (day: string, n: number): string => fromIndex(toIndex(day) + n);
const weekStart = (day: string): string => {
  const dow = new Date(toIndex(day) * 86_400_000).getUTCDay(); // 0 = Sunday
  return addDays(day, -((dow + 6) % 7));
};
const weekEnd = (day: string): string => addDays(weekStart(day), 6);

const dateLabel = (iso: string) => `${Number(iso.slice(5, 7))}月${Number(iso.slice(8, 10))}日`;

type EmailEvent = {
  companyId: string;
  companyName: string;
  kind: UpdateKind;
  date: string;
  title: string;
  summary?: string;
};

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildDigestEmail(updates: UpdatesData, today: string, siteUrl = DEFAULT_SITE_URL): DigestEmail {
  const start = weekStart(today);
  const end = weekEnd(today);
  const lastStart = addDays(start, -7);
  const lastEnd = addDays(end, -7);
  const events: EmailEvent[] = updates.events.map(([companyId, kind, date, title, summary]) => ({
    companyId,
    companyName: updates.names[companyId] ?? companyId,
    kind,
    date,
    title,
    summary,
  }));
  const inRange = (e: EmailEvent, from: string, to: string) => e.date >= from && e.date <= to;
  const byDateDesc = (a: EmailEvent, b: EmailEvent) => b.date.localeCompare(a.date) || a.companyId.localeCompare(b.companyId);
  const thisWeek = events.filter((e) => inRange(e, start, end)).sort(byDateDesc);
  const lastWeek = events.filter((e) => inRange(e, lastStart, lastEnd)).sort(byDateDesc);

  // The highlight is rule-based, not a ranking: the week's 決算短信, which the predict-first lesson is built
  // to be practised on. No filing is scored, ordered by importance, or recommended.
  const highlight = thisWeek.filter((e) => e.kind === "tanshin").slice(0, DIGEST_EMAIL_MAX_HIGHLIGHT);
  const listed = thisWeek.slice(0, DIGEST_EMAIL_MAX_LISTED);
  const rest = thisWeek.length - listed.length;

  const subject = `決算定期便：今週の開示 ${thisWeek.length}件（${dateLabel(start)}〜${dateLabel(end)}）`;

  const eventText = (e: EmailEvent): string => {
    const reading = readingFor(e.kind, e.companyId);
    const lines = [
      `・${dateLabel(e.date)} ${e.companyName} — ${e.title}（${KIND[e.kind]}）`,
      ...(e.summary ? [`  ${e.summary}`] : []),
      `  ${reading.label}`,
      `  企業ページ：${siteUrl}/companies/${e.companyId}`,
      `  企業レポート（分析5観点）：${siteUrl}/companies/${e.companyId}/report`,
    ];
    return lines.join("\n");
  };

  const eventHtml = (e: EmailEvent): string => {
    const reading = readingFor(e.kind, e.companyId);
    return [
      `<li><strong>${escapeHtml(dateLabel(e.date))} ${escapeHtml(e.companyName)}</strong> — ${escapeHtml(e.title)}（${KIND[e.kind]}）`,
      ...(e.summary ? [`<br>${escapeHtml(e.summary)}`] : []),
      `<br>${escapeHtml(reading.label)}`,
      `<br><a href="${siteUrl}/companies/${e.companyId}">企業ページ</a> ・ <a href="${siteUrl}/companies/${e.companyId}/report">企業レポート（分析5観点）</a></li>`,
    ].join("\n");
  };

  const text = [
    `今週の決算定期便（${dateLabel(start)}〜${dateLabel(end)}）`,
    "",
    `今週は ${thisWeek.length}件 の開示がありました。学んだ読み方で、自分の予測と照合して読んでみましょう。`,
    "この便りはニュースではありません。決算の数字を「自分で読み、予測し、検証する」訓練の実践の場です。",
    "",
    ...(highlight.length > 0
      ? [
          "■ 今週の決算短信 — 先に予測して、答え合わせをしてみましょう",
          ...highlight.map(eventText),
          "",
        ]
      : []),
    `■ 今週の開示（${thisWeek.length}件）`,
    ...(thisWeek.length > 0 ? listed.map(eventText) : ["今週（月曜から日曜まで）の開示は、まだありません。"]),
    ...(rest > 0 ? [`ほか ${rest}件の開示は、決算定期便のページでご覧ください。`] : []),
    "",
    "■ 自分の予測の照合",
    "開示が出た会社について、立てた予測と実績を照合できます。自分の記録は、訓練の記録に残ります。",
    `${siteUrl}/digest`,
    `${siteUrl}/learn#training-history`,
    "",
    "■ 今週の読み方レッスン",
    `${siteUrl}/learn`,
    "",
    "■ 数字について",
    "数字は各社の開示が載せた売上高と純利益そのものです。対象期間は各項目に記しています。出典は企業ページで確認できます。この便りに計算値は含まれません。",
    `先週の開示は ${lastWeek.length}件でした。先週分は決算定期便のページでご覧ください。`,
    "",
    "■ 配信について",
    "このメールは、「決算の読み方」学習サービスの案内に登録された方にお送りしています。配信を止めたい方は、このメールに返信してお知らせください。",
    "",
    "日本企業百科事典",
    siteUrl,
    "",
  ].join("\n");

  const html = [
    `<h1>今週の決算定期便（${escapeHtml(dateLabel(start))}〜${escapeHtml(dateLabel(end))}）</h1>`,
    `<p>今週は <strong>${thisWeek.length}件</strong> の開示がありました。学んだ読み方で、自分の予測と照合して読んでみましょう。<br>この便りはニュースではありません。決算の数字を「自分で読み、予測し、検証する」訓練の実践の場です。</p>`,
    ...(highlight.length > 0
      ? [`<h2>今週の決算短信 — 先に予測して、答え合わせをしてみましょう</h2>`, `<ul>${highlight.map(eventHtml).join("\n")}</ul>`]
      : []),
    `<h2>今週の開示（${thisWeek.length}件）</h2>`,
    ...(thisWeek.length > 0
      ? [`<ul>${listed.map(eventHtml).join("\n")}</ul>`, ...(rest > 0 ? [`<p>ほか ${rest}件の開示は、決算定期便のページでご覧ください。</p>`] : [])]
      : [`<p>今週（月曜から日曜まで）の開示は、まだありません。</p>`]),
    `<h2>自分の予測の照合</h2>`,
    `<p>開示が出た会社について、立てた予測と実績を照合できます。自分の記録は、訓練の記録に残ります。<br><a href="${siteUrl}/digest">${siteUrl}/digest</a><br><a href="${siteUrl}/learn#training-history">${siteUrl}/learn#training-history</a></p>`,
    `<h2>今週の読み方レッスン</h2>`,
    `<p><a href="${siteUrl}/learn">${siteUrl}/learn</a></p>`,
    `<h2>数字について</h2>`,
    `<p>数字は各社の開示が載せた売上高と純利益そのものです。対象期間は各項目に記しています。出典は企業ページで確認できます。この便りに計算値は含まれません。<br>先週の開示は ${lastWeek.length}件でした。先週分は決算定期便のページでご覧ください。</p>`,
    `<h2>配信について</h2>`,
    `<p>このメールは、「決算の読み方」学習サービスの案内に登録された方にお送りしています。配信を止めたい方は、このメールに返信してお知らせください。</p>`,
    `<p>日本企業百科事典<br><a href="${siteUrl}">${siteUrl}</a></p>`,
    "",
  ].join("\n");

  return { subject, text, html };
}
