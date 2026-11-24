/**
 * Server-rendered pages (JCE-109, console redesign 2026-11-24): no script — the CSP forbids it — phone first, every
 * value escaped. The frame follows the operator's reference: a left navigation, a top bar with search and the
 * signed-in user, breadcrumbs, then dense panels. On a phone the navigation folds into a <details> menu.
 */

export const esc = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type NavKey = "dashboard" | "companies" | "terms" | "approvals" | "revisions" | "settings";

export const NAV: { key: NavKey; href: string; label: string; icon: string }[] = [
  { key: "dashboard", href: "/", label: "ダッシュボード", icon: "M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z" },
  { key: "companies", href: "/companies", label: "企業管理", icon: "M3 21V7l6-4 6 4v14M15 21V11h6v10M7 9h4M7 13h4M7 17h4" },
  { key: "terms", href: "/terms", label: "用語管理", icon: "M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM8 8h8M8 12h6" },
  { key: "approvals", href: "/approvals", label: "承認管理", icon: "M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" },
  { key: "revisions", href: "/revisions", label: "変更履歴", icon: "M12 8v4l3 2M3 12a9 9 0 1 0 3-6.7M3 4v4h4" },
  { key: "settings", href: "/settings", label: "システム設定", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" },
];

export const navFor = (path: string): NavKey | null => {
  if (path === "/") return "dashboard";
  if (path.startsWith("/companies") || path.startsWith("/edit/company")) return "companies";
  if (path.startsWith("/terms") || path.startsWith("/edit/term") || path.startsWith("/new/term")) return "terms";
  if (path.startsWith("/approvals")) return "approvals";
  if (path.startsWith("/revisions")) return "revisions";
  if (path.startsWith("/settings")) return "settings";
  return null;
};

const icon = (d: string) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

const STYLE = `
:root{--bg:#0b1120;--panel:#111a2e;--panel2:#16213a;--fg:#e8ecf5;--muted:#93a0b8;--line:#22304d;--accent:#6d5efc;--accent2:#7ea0ff;--ok:#3fbf7f;--warn:#e9a23b;--bad:#ef5a5a;color-scheme:dark}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.6 system-ui,-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif}
a{color:var(--accent2);text-decoration:none}a:hover{text-decoration:underline}
.shell{display:grid;grid-template-columns:232px minmax(0,1fr);min-height:100vh}
.side{background:#0a0f1c;border-right:1px solid var(--line);padding:14px 10px;position:sticky;top:0;height:100vh;overflow:auto}
.brand{display:block;padding:4px 10px 16px;font-weight:700;color:var(--fg);line-height:1.3}.brand small{display:block;color:var(--muted);font-weight:400;font-size:.72rem}
.nav a{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;color:var(--muted);font-weight:500}.nav a:hover{background:var(--panel);color:var(--fg);text-decoration:none}
.nav a[aria-current=page]{background:rgba(109,94,252,.16);color:var(--fg)}.nav a[aria-current=page] svg{color:var(--accent2)}
.top{display:flex;align-items:center;gap:12px;padding:10px 20px;border-bottom:1px solid var(--line);background:rgba(11,17,32,.92);position:sticky;top:0;z-index:5}
.top form{flex:1;max-width:420px}.top input{width:100%;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:8px 12px;color:var(--fg);font:inherit}
.who{margin-left:auto;display:flex;align-items:center;gap:10px;color:var(--muted);font-size:.85rem;white-space:nowrap}
.mnav{display:none}main{padding:16px 20px 40px;min-width:0}
.crumbs{color:var(--muted);font-size:.78rem}.crumbs a{color:var(--muted)}
h1{font-size:1.45rem;margin:2px 0 14px;letter-spacing:.01em}h2{font-size:.98rem;margin:0 0 10px}
.grid{display:grid;gap:14px}.g4{grid-template-columns:repeat(4,minmax(0,1fr))}.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:14px 16px;min-width:0}
.kpi{display:flex;gap:12px;align-items:center}.kpi .ic{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--panel2);color:var(--accent2);flex:none}
.kpi .lb{color:var(--muted);font-size:.8rem}.kpi .v{font-size:1.45rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.2}.kpi .s{color:var(--muted);font-size:.75rem}
.muted{color:var(--muted);font-size:.85rem}.ok{color:var(--ok)}.bad{color:var(--bad)}.warn{color:var(--warn)}
.pill{display:inline-block;font-size:.72rem;font-weight:700;padding:1px 8px;border-radius:99px;border:1px solid currentColor;white-space:nowrap}
table{width:100%;border-collapse:collapse;font-size:.85rem}th,td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--muted);font-weight:500;font-size:.75rem}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}.tw{overflow-x:auto}
input,textarea,button,select{font:inherit;color:inherit}input[type=text],input[type=email],input[type=search],textarea,select{width:100%;background:#0a0f1c;border:1px solid var(--line);border-radius:8px;padding:9px}
textarea{min-height:55vh;font:12.5px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
button,.btn{display:inline-flex;align-items:center;justify-content:center;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:9px 16px;font-weight:700;cursor:pointer;min-height:40px}
button.ghost{background:none;color:var(--fg);border:1px solid var(--line)}
label{display:block;margin:12px 0 4px;font-weight:600}ul.plain{list-style:none;padding:0;margin:0}ul.plain li{padding:8px 0;border-bottom:1px solid var(--line)}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}code{font-size:.85em}.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:.75rem;color:var(--muted)}.legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:-1px}
@media (max-width:1100px){.g4{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:820px){.shell{grid-template-columns:minmax(0,1fr)}.side{display:none}.mnav{display:block}.g2{grid-template-columns:minmax(0,1fr)}
 .top{padding:8px 12px;flex-wrap:wrap}.top form{order:3;max-width:none;flex-basis:100%}main{padding:12px 12px 32px}
 .mnav summary{list-style:none;cursor:pointer;padding:6px 10px;border:1px solid var(--line);border-radius:8px}.mnav summary::-webkit-details-marker{display:none}
 .mnav[open] .nav{position:absolute;left:12px;right:12px;top:52px;background:#0a0f1c;border:1px solid var(--line);border-radius:10px;padding:8px;z-index:9}}
@media (max-width:480px){.g4{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.kpi .ic{display:none}.kpi .v{font-size:1.2rem}}
`;

const HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "no-store",
  // same-origin, not no-referrer: under no-referrer the browser posts this app's own forms with `Origin: null`,
  // and the origin check in index.ts then refused the operator's own 「確認する」 (2026-11-24).
  "referrer-policy": "same-origin",
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
};

export type PageOptions = {
  status?: number;
  /** The signed-in address; without it the page is the bare sign-in frame. */
  user?: string | null;
  nav?: NavKey | null;
  crumbs?: [string, string?][];
};

function navList(active: NavKey | null | undefined) {
  return `<nav class="nav" aria-label="管理メニュー">${NAV.map((n) => `<a href="${n.href}"${n.key === active ? ' aria-current="page"' : ""}>${icon(n.icon)}${esc(n.label)}</a>`).join("")}</nav>`;
}

export function page(title: string, body: string, opts: PageOptions = {}): Response {
  const head = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${esc(title)}｜百科事典 管理</title><style>${STYLE}</style></head><body>`;
  if (!opts.user) {
    return new Response(`${head}<div style="max-width:520px;margin:0 auto;padding:24px 16px"><p class="brand">日本企業百科事典<small>管理コンソール</small></p>${body}</div></body></html>`, { status: opts.status ?? 200, headers: HEADERS });
  }
  const crumbs = opts.crumbs?.length
    ? `<p class="crumbs"><a href="/">ホーム</a>${opts.crumbs.map(([label, href]) => ` / ${href ? `<a href="${esc(href)}">${esc(label)}</a>` : esc(label)}`).join("")}</p>`
    : "";
  const html = `${head}<div class="shell">
<aside class="side"><a class="brand" href="/">日本企業百科事典<small>管理コンソール</small></a>${navList(opts.nav)}</aside>
<div>
<header class="top"><details class="mnav"><summary>メニュー</summary>${navList(opts.nav)}</details>
<form method="get" action="/companies" role="search"><input type="search" name="q" placeholder="企業を探す（社名・証券コード・id）" aria-label="企業を探す"></form>
<div class="who"><span>${esc(opts.user)}</span><form method="post" action="/logout"><button class="ghost" type="submit" style="min-height:32px;padding:4px 10px">ログアウト</button></form></div></header>
<main>${crumbs}${body}</main></div></div></body></html>`;
  return new Response(html, { status: opts.status ?? 200, headers: HEADERS });
}

export const redirect = (location: string, headers: Record<string, string> = {}) =>
  new Response(null, { status: 303, headers: { location, "cache-control": "no-store", ...headers } });

export const errorList = (errors: string[]) =>
  errors.length ? `<div class="card bad"><ul>${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>` : "";
