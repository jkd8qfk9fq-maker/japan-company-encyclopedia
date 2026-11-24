/** Server-rendered pages: no script, phone first, every value escaped. */

export const esc = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const STYLE = `
:root{--bg:#0f1626;--card:#16203a;--fg:#e8ecf5;--muted:#9aa6bd;--line:#2a3654;--accent:#7ea0ff;--ok:#5fcf94;--bad:#ff8a80;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.7 system-ui,-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif}
header{border-bottom:1px solid var(--line);padding:12px 16px;display:flex;gap:12px;align-items:center;justify-content:space-between}
header a{color:var(--fg);text-decoration:none;font-weight:700}main{max-width:760px;margin:0 auto;padding:16px 16px 48px}
h1{font-size:1.3rem;margin:.4em 0}h2{font-size:1.05rem;margin:1.4em 0 .4em}a{color:var(--accent)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:10px 0}
.muted{color:var(--muted);font-size:.88rem}.ok{color:var(--ok)}.bad{color:var(--bad)}
input,textarea,button{font:inherit;color:inherit}input[type=text],input[type=email],input[type=search],textarea{width:100%;background:#0b1120;border:1px solid var(--line);border-radius:8px;padding:10px}
textarea{min-height:55vh;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace}
button{background:var(--accent);color:#0b1120;border:0;border-radius:999px;padding:10px 18px;font-weight:700;cursor:pointer;min-height:44px}
button.ghost{background:none;color:var(--fg);border:1px solid var(--line)}
label{display:block;margin:12px 0 4px;font-weight:600}ul.plain{list-style:none;padding:0;margin:0}ul.plain li{padding:8px 0;border-bottom:1px solid var(--line)}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}code{font-size:.85em}
`;

export function page(title: string, body: string, opts: { signedIn?: boolean; status?: number } = {}): Response {
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${esc(title)}｜百科事典 管理</title><style>${STYLE}</style></head><body>
<header><a href="/">百科事典 管理</a>${opts.signedIn ? `<form method="post" action="/logout"><button class="ghost" type="submit">ログアウト</button></form>` : ""}</header>
<main>${body}</main></body></html>`;
  return new Response(html, {
    status: opts.status ?? 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
      "x-frame-options": "DENY",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}

export const redirect = (location: string, headers: Record<string, string> = {}) =>
  new Response(null, { status: 303, headers: { location, "cache-control": "no-store", ...headers } });

export const errorList = (errors: string[]) =>
  errors.length ? `<div class="card bad"><ul>${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>` : "";
