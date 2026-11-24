import type { AdminEnv } from "./env";
import type { GitHub, PullSummary } from "./github";
import { esc } from "./html";

/**
 * The dashboard's figures (JCE-109 console, 2026-11-24). Every number is read from the repository on main or from
 * GitHub at the moment of the request — nothing is estimated, and a figure that could not be read says so instead of
 * showing a stand-in. Results are kept for a minute per Worker instance, so reloading does not spend the API allowance.
 */

export const REVISION_NAME = /^(\d{4}-\d{2}-\d{2})-(company|term|industry)-(.+)$/;

export type RevisionRef = { name: string; day: string; kind: string; rest: string };

export const parseRevisionNames = (names: Iterable<string>): RevisionRef[] =>
  [...names]
    .map((name) => {
      const m = REVISION_NAME.exec(name);
      return m ? { name, day: m[1]!, kind: m[2]!, rest: m[3]! } : null;
    })
    .filter((r): r is RevisionRef => r !== null)
    .sort((a, b) => (a.day === b.day ? b.name.localeCompare(a.name) : b.day.localeCompare(a.day)));

/** Counts by month (YYYY-MM) and kind, for the last `months` months ending at `today`'s month — months with none included. */
export function monthlyCounts(revisions: RevisionRef[], today: string, months = 12): { month: string; company: number; term: number; industry: number }[] {
  const [y, m] = today.split("-").map(Number) as [number, number];
  const out: { month: string; company: number; term: number; industry: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(y, m - 1 - i, 1));
    out.push({ month: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`, company: 0, term: 0, industry: 0 });
  }
  const index = new Map(out.map((row, i) => [row.month, i]));
  for (const r of revisions) {
    const i = index.get(r.day.slice(0, 7));
    if (i !== undefined && (r.kind === "company" || r.kind === "term" || r.kind === "industry")) out[i]![r.kind] += 1;
  }
  return out;
}

const tokyoToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

type Settled<T> = { ok: true; value: T } | { ok: false; error: string };
const settle = async <T>(p: Promise<T>): Promise<Settled<T>> => {
  try {
    return { ok: true, value: await p };
  } catch (error) {
    return { ok: false, error: String(error).slice(0, 160) };
  }
};

export type DashboardData = {
  at: number;
  today: string;
  companyFiles: Settled<number>;
  published: Settled<number>;
  terms: Settled<number>;
  revisions: Settled<RevisionRef[]>;
  pulls: Settled<PullSummary[]>;
  recent: Settled<{ ref: RevisionRef; summary: string; target: string; approver: string }[]>;
  github: Awaited<ReturnType<GitHub["status"]>>;
};

let cache: DashboardData | null = null;

export async function dashboardData(env: AdminEnv, github: GitHub, publishedCount: () => Promise<number>): Promise<DashboardData> {
  if (cache && Date.now() - cache.at < 60_000) return cache;
  const today = tokyoToday();
  const [companyFiles, published, terms, revisions, pulls, githubStatus] = await Promise.all([
    settle(github.ids("companies").then((s) => s.size)),
    settle(publishedCount()),
    settle(github.ids("terms").then((s) => s.size)),
    settle(github.ids("revisions").then(parseRevisionNames)),
    settle(github.openPulls()),
    github.status(),
  ]);
  const recent = revisions.ok
    ? await settle(
        Promise.all(
          revisions.value.slice(0, 8).map(async (ref) => {
            const r = await github.json<{ summary?: string; targetId?: string; approval?: { approver?: { name?: string } } }>(`src/data/revisions/${ref.name}.json`);
            return { ref, summary: r?.summary ?? "（読めませんでした）", target: r?.targetId ?? "", approver: r?.approval?.approver?.name ?? "記録なし" };
          }),
        ),
      )
    : ({ ok: false, error: "変更記録を読めませんでした" } as const);
  cache = { at: Date.now(), today, companyFiles, published, terms, revisions, pulls, recent, github: githubStatus };
  void env;
  return cache;
}

const fmt = (n: number) => n.toLocaleString("ja-JP");
const value = (s: Settled<number>) => (s.ok ? fmt(s.value) : `<span class="bad" title="${esc(s.error)}">取得できません</span>`);

const ICON = {
  company: "M3 21V7l6-4 6 4v14M15 21V11h6v10",
  term: "M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z",
  rev: "M12 8v4l3 2M3 12a9 9 0 1 0 3-6.7M3 4v4h4",
  pr: "M6 3v12M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9v3a6 6 0 0 1-6 6",
};
const kpiIcon = (d: string) => `<span class="ic"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg></span>`;

const COLORS = { company: "#6d5efc", term: "#3fbf7f", industry: "#e9a23b" } as const;
const KIND_LABEL: Record<string, string> = { company: "企業", term: "用語", industry: "業界" };

/** Stacked bars of revisions per month, drawn on one scale with its ticks; text takes the theme's colours. */
export function monthlyChart(rows: ReturnType<typeof monthlyCounts>): string {
  const W = 640, H = 220, L = 44, B = 28, T = 10;
  const max = Math.max(1, ...rows.map((r) => r.company + r.term + r.industry));
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const y = (v: number) => T + (H - T - B) * (1 - v / top);
  const bw = (W - L - 8) / rows.length;
  const ticks = [];
  for (let v = 0; v <= top; v += step) ticks.push(`<line x1="${L}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}" stroke="#22304d"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" fill="#93a0b8" font-size="10">${fmt(v)}</text>`);
  const bars = rows
    .map((r, i) => {
      const x = L + i * bw + bw * 0.2;
      let base = 0;
      const parts = (["company", "term", "industry"] as const)
        .map((k) => {
          const v = r[k];
          if (!v) return "";
          const rect = `<rect x="${x.toFixed(1)}" y="${y(base + v).toFixed(1)}" width="${(bw * 0.6).toFixed(1)}" height="${(y(base) - y(base + v)).toFixed(1)}" fill="${COLORS[k]}"><title>${r.month} ${KIND_LABEL[k]} ${fmt(v)}件</title></rect>`;
          base += v;
          return rect;
        })
        .join("");
      return `${parts}<text x="${(x + bw * 0.3).toFixed(1)}" y="${H - 10}" text-anchor="middle" fill="#93a0b8" font-size="10">${Number(r.month.slice(5))}月</text>`;
    })
    .join("");
  return `<div class="tw"><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="月別の変更件数" style="min-width:420px;display:block">${ticks.join("")}${bars}</svg></div>
<p class="legend">${(["company", "term", "industry"] as const).map((k) => `<span><i style="background:${COLORS[k]}"></i>${KIND_LABEL[k]}</span>`).join("")}</p>`;
}

function niceStep(max: number): number {
  const raw = max / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? pow * 10;
}

export const CHECK_LABEL: Record<PullSummary["checks"], string> = {
  passed: '<span class="pill ok">テスト成功</span>',
  failed: '<span class="pill bad">テスト失敗</span>',
  running: '<span class="pill warn">テスト実行中</span>',
  none: '<span class="pill">テストなし</span>',
  unknown: '<span class="pill">状態不明</span>',
};

export function renderDashboard(d: DashboardData, identity: { email: string; expires: number | null }, env: AdminEnv): string {
  const revs = d.revisions.ok ? d.revisions.value : [];
  const since = new Date(Date.parse(`${d.today}T00:00:00+09:00`) - 30 * 86400_000).toISOString().slice(0, 10);
  const last30 = revs.filter((r) => r.day > since).length;
  const pulls = d.pulls.ok ? d.pulls.value : [];
  const adminPulls = pulls.filter((p) => p.fromAdmin).length;

  const kpis = `<div class="grid g4">
<div class="panel kpi">${kpiIcon(ICON.company)}<div><div class="lb">登録企業数</div><div class="v">${value(d.companyFiles)}</div><div class="s">うち掲載中 ${value(d.published)}社</div></div></div>
<div class="panel kpi">${kpiIcon(ICON.term)}<div><div class="lb">登録用語数</div><div class="v">${value(d.terms)}</div><div class="s">用語集のファイル数</div></div></div>
<div class="panel kpi">${kpiIcon(ICON.rev)}<div><div class="lb">更新・変更件数（直近30日）</div><div class="v">${d.revisions.ok ? fmt(last30) : value(d.revisions as Settled<number>)}</div><div class="s">変更記録の合計 ${d.revisions.ok ? fmt(revs.length) : "—"}件</div></div></div>
<div class="panel kpi">${kpiIcon(ICON.pr)}<div><div class="lb">未承認のプルリクエスト</div><div class="v">${d.pulls.ok ? fmt(pulls.length) : value(d.pulls as Settled<number>)}</div><div class="s">うち管理画面から ${d.pulls.ok ? fmt(adminPulls) : "—"}件</div></div></div>
</div>`;

  const chart = d.revisions.ok ? monthlyChart(monthlyCounts(revs, d.today)) : `<p class="bad">変更記録を読めませんでした。</p>`;

  const recent = d.recent.ok
    ? `<div class="tw"><table><thead><tr><th>日付</th><th>種類</th><th>対象</th><th>内容</th><th>承認</th></tr></thead><tbody>${d.recent.value
        .map((r) => `<tr><td>${esc(r.ref.day)}</td><td>${esc(KIND_LABEL[r.ref.kind] ?? r.ref.kind)}</td><td><code>${esc(r.target)}</code></td><td><a href="/revisions/${esc(r.ref.name)}">${esc(r.summary)}</a></td><td>${esc(r.approver)}</td></tr>`)
        .join("")}</tbody></table></div>`
    : `<p class="bad">取得できません：${esc(d.recent.error)}</p>`;

  const waiting = d.pulls.ok
    ? pulls.length
      ? `<div class="tw"><table><thead><tr><th>番号</th><th>題名</th><th>状態</th><th>作成日</th></tr></thead><tbody>${pulls
          .slice(0, 8)
          .map((p) => `<tr><td>#${p.number}</td><td><a href="${esc(p.url)}">${esc(p.title)}</a>${p.fromAdmin ? ' <span class="pill">管理画面</span>' : ""}</td><td>${CHECK_LABEL[p.checks]}</td><td>${esc(p.created.slice(0, 10))}</td></tr>`)
          .join("")}</tbody></table></div><p class="muted"><a href="/approvals">承認管理ですべて見る</a></p>`
      : `<p class="muted">承認待ちの変更はありません。</p>`
    : `<p class="bad">取得できません：${esc(d.pulls.error)}</p>`;

  const gh = d.github.ok
    ? `<p><span class="pill ok">接続中</span> ${esc(env.GITHUB_REPO)}（${esc(d.github.defaultBranch)}）</p><p class="muted">書き込み権限：${d.github.push ? '<span class="ok">あり</span>' : '<span class="bad">なし</span>'} ・ API の残り ${fmt(d.github.remaining)} / ${fmt(d.github.limit)}（毎時）</p>`
    : `<p><span class="pill bad">接続できません</span></p><p class="muted">${esc(d.github.error)}</p>`;
  const access = identity.expires
    ? `<p><span class="pill ok">認証済み</span> ${esc(identity.email)}</p><p class="muted">Cloudflare Access ・ ワンタイムコード ・ このログインの期限 ${esc(new Date(identity.expires).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }))}</p>`
    : `<p><span class="pill warn">Access 未使用</span> ${esc(identity.email)}（メールのリンクでログイン）</p>`;

  return `<h1>ダッシュボード</h1>${kpis}
<div class="grid g2" style="margin-top:14px">
<section class="panel"><h2>月別の変更件数（直近12か月）</h2>${chart}</section>
<section class="panel"><h2>承認待ちの変更</h2>${waiting}</section>
</div>
<div class="grid g2" style="margin-top:14px">
<section class="panel"><h2>最近の操作履歴</h2>${recent}<p class="muted"><a href="/revisions">変更履歴ですべて見る</a></p></section>
<section class="panel"><h2>接続と認証</h2><h2 class="muted" style="margin:6px 0 4px">GitHub</h2>${gh}<h2 class="muted" style="margin:12px 0 4px">Cloudflare Access</h2>${access}</section>
</div>
<p class="muted" style="margin-top:14px">数字は main ブランチと GitHub から ${esc(new Date(d.at).toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" }))} に読んだ実データです（1分ごとに更新）。読めなかったものは「取得できません」と出します。</p>`;
}
