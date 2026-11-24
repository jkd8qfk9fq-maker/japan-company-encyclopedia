import { buildSave, EDIT_DIRECTORY, EDIT_ID, previewEdit, saveInputErrors, type EditableKind } from "../../src/lib/content/content-edit";
import type { ContentContext } from "../../src/lib/content/integrity";
import { LINK_TTL_MS, readCookie, SESSION_COOKIE, SESSION_TTL_MS, sessionCookie, sign, verify } from "./auth";
import { accessIdentity } from "./access";
import { CHECK_LABEL, dashboardData, parseRevisionNames, renderDashboard } from "./dashboard";
import { allowedEmails, missingSettings, ROLE_LABEL, roleOf, usesAccess, type AdminEnv } from "./env";
import { GitHub, mergeBlockers } from "./github";
import { errorList, esc, navFor, page, redirect, type PageOptions } from "./html";

/**
 * 百科事典の管理アプリ (JCE-109), at admin.kigyo-hyakka.com. A company or a term is edited as its JSON; the draft passes
 * the same schema and integrity rules as the local editor (src/lib/content/content-edit.ts), and a save becomes a pull
 * request carrying the content and its Revision. Nothing here writes to the site: the repository's tests run on the
 * pull request and the operator merges it.
 */

const KINDS: Record<string, EditableKind> = { company: "company", term: "term" };
const EMAIL = /^[^\s@"<>,;]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;

type SearchRow = { kind: string; id: string; title: string; meta?: string };
let searchCache: { at: number; rows: SearchRow[] } | null = null;

async function companyIndex(env: AdminEnv): Promise<SearchRow[]> {
  if (searchCache && Date.now() - searchCache.at < 10 * 60 * 1000) return searchCache.rows;
  const response = await fetch(`${env.SITE_ORIGIN}/search-index.json`);
  const rows = ((await response.json()) as SearchRow[]).filter((r) => r.kind === "company");
  searchCache = { at: Date.now(), rows };
  return rows;
}

async function context(github: GitHub, newTermId: string | null): Promise<ContentContext> {
  const [companyIds, termIds] = await Promise.all([github.ids("companies"), github.ids("terms")]);
  // A term being added counts as existing, so it can refer to itself the way a saved one can.
  if (newTermId) termIds.add(newTermId);
  // Features are built from the companies at build time (JCE-074), not stored as files, as the local editor sees too.
  return { companyIds, termIds, featureIds: new Set() };
}

async function mailLink(env: AdminEnv, to: string, link: string): Promise<void> {
  if (!env.RESEND_API_KEY && env.LOGIN_LINK_LOG === "1") {
    console.log(`sign-in link for ${to}: ${link}`);
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: "日本企業百科事典 管理 <admin@kigyo-hyakka.com>",
      to: [to],
      subject: "管理画面へのログイン",
      text: `次のリンクから管理画面にログインできます（15分間有効）。\n\n${link}\n\n心当たりがない場合は、このメールを破棄してください。`,
    }),
  });
  // The reason is logged (status and Resend's message, never the key) so a failed sign-in can be diagnosed.
  if (!response.ok) throw new Error(`resend ${response.status}: ${(await response.text()).slice(0, 300)}`);
}

function editorForm(kind: EditableKind, id: string, text: string, sha: string, extra: { summary?: string; reason?: string; confirm?: boolean; isNew?: boolean } = {}) {
  return `<form method="post" action="/edit/${kind}/${esc(id)}">
<input type="hidden" name="base" value="${esc(sha)}">${extra.isNew ? `<input type="hidden" name="new" value="1">` : ""}
<label for="draft">内容（JSON）</label><textarea id="draft" name="draft" spellcheck="false">${esc(text)}</textarea>
<label for="summary">変更の要約（120文字まで）</label><input type="text" id="summary" name="summary" maxlength="120" value="${esc(extra.summary)}">
<label for="reason">理由と根拠（出典や報告）</label><textarea id="reason" name="reason" style="min-height:6em">${esc(extra.reason)}</textarea>
<label class="row"><input type="checkbox" name="confirm" value="1"${extra.confirm ? " checked" : ""}> 出典を削除する場合、削除してよいことを確認した</label>
<div class="row" style="margin-top:12px"><button type="submit" name="action" value="preview" class="ghost">確認する</button><button type="submit" name="action" value="save">プルリクエストを作る</button></div>
<p class="muted">「確認する」で、スキーマ・整合性の検査と変更点を表示します。プルリクエストは、テストが通ったあと GitHub でマージすると公開されます。</p>
</form>`;
}

export default {
  async fetch(request: Request, env: AdminEnv): Promise<Response> {
    // An unexpected failure (GitHub down, a token without a permission) shows a page in the app's own words and is
    // logged, instead of Cloudflare's bare "Worker threw exception" (1101).
    try {
      return await handle(request, env);
    } catch (error) {
      console.error(`unhandled: ${request.method} ${new URL(request.url).pathname}: ${String(error)}`);
      return page("エラー", `<h1>処理できませんでした</h1>${errorList([String(error).slice(0, 240)])}<p><a href="/">ダッシュボードへ戻る</a></p>`, { status: 500 });
    }
  },
};

async function handle(request: Request, env: AdminEnv): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // A form post must come from this app itself (the session cookie is SameSite=Lax; this is the second lock).
    if (request.method === "POST") {
      const origin = request.headers.get("origin");
      if (origin && origin !== url.origin) return page("拒否", "<p>この操作は受け付けられません。</p>", { status: 403 });
    }

    const missing = missingSettings(env);

    // Behind Cloudflare Access the address comes from its signed token; the mailed-link pages are not used.
    if (usesAccess(env) && (path === "/login" || path === "/auth")) return redirect("/");

    if (path === "/login" && request.method === "GET") {
      const sent = url.searchParams.get("sent") === "1";
      return page(
        "ログイン",
        `<h1>ログイン</h1>${missing.length ? `<div class="card bad">まだ設定されていません：<ul>${missing.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>Cloudflare のダッシュボードで、Worker「kigyo-admin」の設定 → 変数とシークレットに追加してください。</div>` : ""}
${sent ? `<div class="card ok">登録されているアドレスであれば、ログイン用のリンクを送りました。15分以内に開いてください。</div>` : ""}
<form method="post" action="/login"><label for="email">メールアドレス</label><input type="email" id="email" name="email" autocomplete="email" required>
<p><button type="submit">ログイン用のリンクを送る</button></p></form>`,
      );
    }

    if (path === "/login" && request.method === "POST") {
      if (missing.length) return redirect("/login");
      const email = String((await request.formData()).get("email") ?? "").trim().toLowerCase();
      const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
      const limited = env.LOGIN_LIMIT ? !(await env.LOGIN_LIMIT.limit({ key: ip })).success : false;
      // The same answer whether or not the address is allowed: the page does not say who the operators are.
      if (!limited && EMAIL.test(email) && allowedEmails(env).has(email)) {
        const token = await sign(env, "link", email, Date.now() + LINK_TTL_MS);
        try {
          await mailLink(env, email, `${url.origin}/auth?t=${encodeURIComponent(token)}`);
        } catch (error) {
          console.error(`sign-in mail failed: ${String(error)}`);
          return page("ログイン", `<h1>ログイン</h1>${errorList(["ログイン用のメールを送れませんでした。時間をおいてもう一度試してください。続く場合は運営の設定（メール送信）を確認します。"])}<p><a href="/login">戻る</a></p>`, { status: 502 });
        }
      }
      return redirect("/login?sent=1");
    }

    if (path === "/auth") {
      const email = await verify(env, "link", url.searchParams.get("t"));
      if (!email || !allowedEmails(env).has(email)) return page("ログイン", `<p>リンクの期限が切れているか、正しくありません。<a href="/login">もう一度送る</a></p>`, { status: 400 });
      const session = await sign(env, "session", email, Date.now() + SESSION_TTL_MS);
      return redirect("/", { "set-cookie": sessionCookie(session, SESSION_TTL_MS / 1000) });
    }

    if (path === "/logout" && request.method === "POST") {
      return usesAccess(env) ? redirect("/cdn-cgi/access/logout") : redirect("/login", { "set-cookie": sessionCookie("", 0) });
    }

    const identity = usesAccess(env)
      ? await accessIdentity(env, request.headers.get("cf-access-jwt-assertion"))
      : await verify(env, "session", readCookie(request, SESSION_COOKIE)).then((email) => (email ? { email, expires: null as number | null } : null));
    const user = identity?.email ?? null;
    if (usesAccess(env) && (!user || !allowedEmails(env).has(user))) {
      return page("ログインできません", `<h1>ログインできません</h1><p>このアドレスには管理画面の権限がありません。</p>`, { status: 403 });
    }
    if (!user || !allowedEmails(env).has(user)) return redirect("/login");
    const github = new GitHub(env);
    const role = roleOf(env, user)!;
    // Every signed-in page: the console frame, with the navigation marked for where the reader is.
    const view = (title: string, body: string, extra: Omit<PageOptions, "user"> & { signedIn?: boolean } = {}) =>
      page(title, body, { nav: navFor(path), ...extra, user: `${user}（${ROLE_LABEL[role]}）` });

    // 閲覧 may read everything and change nothing: every write is a POST or the new-term form.
    if (role === "viewer" && (request.method === "POST" || path.startsWith("/new/"))) {
      return view("権限がありません", `<h1>権限がありません</h1><p>このアカウントは閲覧のみです。編集は「編集」または「承認」の権限が必要です。</p>`, { status: 403 });
    }

    const approval = path.match(/^\/approvals\/(\d+)(\/merge)?$/);
    if (approval) {
      const number = Number(approval[1]);
      const pr = await github.pull(number);
      const blockers = mergeBlockers(pr);

      if (approval[2] && request.method === "POST") {
        const form = await request.formData();
        const refused = (why: string[]) =>
          view(`#${number}`, `<h1>マージしませんでした</h1>${errorList(why)}<p><a href="/approvals/${number}">プルリクエストに戻る</a></p>`, { status: 409, crumbs: [["承認管理", "/approvals"], [`#${number}`]] });
        if (role !== "approver") return refused(["マージには「承認」の権限が必要です。"]);
        if (form.get("confirm") !== "1") return refused(["確認のチェックを入れてください。"]);
        if (String(form.get("sha") ?? "") !== pr.sha) return refused(["確認した後にプルリクエストが更新されました。開き直して、最新の内容で確認してください。"]);
        if (blockers.length) return refused(blockers);
        const who = user.replace(/^(.{2}).*@/, "$1…@");
        let result: { sha: string };
        try {
          result = await github.merge(number, pr.sha, `${pr.title} (#${number})`, `管理画面で承認してマージ（${who}、テスト成功を確認、${new Date().toISOString()}）`);
        } catch (error) {
          console.error(`merge failed: ${String(error)}`);
          const denied = /: 403 /.test(String(error));
          return refused([
            denied
              ? "GitHub がマージを拒否しました。GitHub のトークン（GITHUB_TOKEN）に、このリポジトリの Contents と Pull requests の「Read and write」の権限が必要です（システム設定を参照）。"
              : `GitHub でマージできませんでした：${String(error).slice(0, 160)}`,
          ]);
        }
        return view(`#${number}`, `<h1>マージしました</h1><div class="card ok">#${number}「${esc(pr.title)}」を main にマージしました（${esc(result.sha.slice(0, 7))}）。公開の配信が自動で始まります。</div><p><a href="/approvals">承認管理へ</a></p>`, { crumbs: [["承認管理", "/approvals"], [`#${number}`]] });
      }

      const statusOf = (r: { status: string; conclusion: string | null }) =>
        r.status !== "completed" ? '<span class="pill warn">実行中</span>' : r.conclusion === "success" ? '<span class="pill ok">成功</span>' : `<span class="pill bad">${esc(r.conclusion ?? "不明")}</span>`;
      const mergePanel =
        role !== "approver"
          ? `<p class="muted">マージは「承認」の権限を持つ人が行います。</p>`
          : blockers.length
            ? `<div class="card"><p>いまはマージできません：</p>${errorList(blockers)}</div>`
            : `<form method="post" action="/approvals/${number}/merge" class="card"><input type="hidden" name="sha" value="${esc(pr.sha)}">
<label class="row"><input type="checkbox" name="confirm" value="1"> 変更内容とテストの結果を確認した。マージすると公開サイトに反映される</label>
<p><button type="submit">承認してマージする</button></p></form>`;
      return view(
        `#${number} ${pr.title}`,
        `<h1>#${number} ${esc(pr.title)}</h1>
<div class="grid g2">
<section class="panel"><h2>概要</h2><table>
<tr><th style="width:30%">状態</th><td>${pr.merged ? '<span class="pill ok">マージ済み</span>' : pr.state === "open" ? '<span class="pill">オープン</span>' : '<span class="pill">クローズ</span>'} ${CHECK_LABEL[pr.checks]}</td></tr>
<tr><th>作成</th><td>${pr.branch.startsWith("admin/") ? "管理画面" : esc(pr.author)} ・ ${esc(pr.created.slice(0, 10))}</td></tr>
<tr><th>ブランチ</th><td><code>${esc(pr.branch)}</code> ・ ${esc(pr.sha.slice(0, 7))}</td></tr>
<tr><th>GitHub</th><td><a href="${esc(pr.url)}">GitHub で開く</a></td></tr></table>
<h2 style="margin-top:14px">テスト</h2>${pr.runs.length ? `<table>${pr.runs.map((r) => `<tr><td>${esc(r.name)}</td><td>${statusOf(r)}</td></tr>`).join("")}</table>` : `<p class="muted">テストの記録がありません。</p>`}
<h2 style="margin-top:14px">承認</h2>${mergePanel}</section>
<section class="panel"><h2>変わるファイル（${pr.files.length}）</h2><div class="tw"><table><thead><tr><th>ファイル</th><th class="num">追加</th><th class="num">削除</th></tr></thead><tbody>${pr.files
          .map((f) => {
            const rev = f.name.match(/^src\/data\/revisions\/(.+)\.json$/);
            return `<tr><td>${rev ? `<a href="/revisions/${esc(rev[1])}"><code>${esc(f.name)}</code></a>` : `<code>${esc(f.name)}</code>`}</td><td class="num ok">+${f.additions}</td><td class="num bad">−${f.deletions}</td></tr>`;
          })
          .join("")}</tbody></table></div>
<h2 style="margin-top:14px">説明</h2><pre style="white-space:pre-wrap;word-break:break-word;font:inherit;margin:0">${esc(pr.body || "（説明なし）")}</pre></section>
</div>`,
        { crumbs: [["承認管理", "/approvals"], [`#${number}`]] },
      );
    }

    if (path === "/" && request.method === "GET") {
      const data = await dashboardData(env, github, async () => (await companyIndex(env)).length);
      return view("ダッシュボード", renderDashboard(data, { email: user, expires: identity?.expires ?? null }, env));
    }

    if (path === "/settings") {
      const status = await github.status();
      const row = (label: string, value: string) => `<tr><th style="width:38%">${esc(label)}</th><td>${value}</td></tr>`;
      const set = (v: unknown) => (v ? '<span class="ok">設定済み</span>' : '<span class="bad">未設定</span>');
      return view(
        "システム設定",
        `<h1>システム設定</h1><div class="grid g2">
<section class="panel"><h2>認証</h2><table>${row("ログイン方式", usesAccess(env) ? "Cloudflare Access（ワンタイムコード）" : "メールのリンク")}${row("Access チーム", esc(env.ACCESS_TEAM_DOMAIN ?? "—"))}${row("ログイン中", esc(user))}${row("あなたの権限", ROLE_LABEL[role])}${row("承認（APPROVER_EMAILS）", `${set(env.APPROVER_EMAILS)}`)}${row("編集（ADMIN_EMAILS）", `${set(env.ADMIN_EMAILS)}`)}${row("閲覧（VIEWER_EMAILS）", `${set(env.VIEWER_EMAILS)}`)}${row("ログインできる人数", `${allowedEmails(env).size}人`)}</table>
<p class="muted">権限は3段階：閲覧（見るだけ）・編集（プルリクエストを作る）・承認（テストが通ったものをマージする）。ログインできるのは Cloudflare Zero Trust の Access ポリシーと、Worker のシークレットの両方にあるアドレスだけです。値はこの画面に出しません。</p></section>
<section class="panel"><h2>GitHub</h2><table>${row("リポジトリ", esc(env.GITHUB_REPO))}${row("トークン（GITHUB_TOKEN）", set(env.GITHUB_TOKEN))}${status.ok ? row("接続", '<span class="ok">接続中</span>') + row("書き込み権限", status.push ? '<span class="ok">あり</span>' : '<span class="bad">なし</span>') + row("API の残り", `${status.remaining.toLocaleString("ja-JP")} / ${status.limit.toLocaleString("ja-JP")}（毎時）`) : row("接続", `<span class="bad">接続できません</span> ${esc(status.error)}`)}</table>
<p class="muted">変更は main 向けのプルリクエストになり、テストが通ってからマージすると公開されます。この画面から本番のデータを直接は書き換えません。</p></section>
<section class="panel"><h2>公開サイト</h2><table>${row("百科事典", `<a href="${esc(env.SITE_ORIGIN)}">${esc(env.SITE_ORIGIN)}</a>`)}${row("メール送信（予備のログイン用）", set(env.RESEND_API_KEY))}</table></section>
</div>`,
        { crumbs: [["システム設定"]] },
      );
    }

    if (path === "/approvals") {
      let body: string;
      try {
        const pulls = await github.openPulls(50);
        body = pulls.length
          ? `<div class="panel tw"><table><thead><tr><th>番号</th><th>題名</th><th>作成</th><th>テスト</th><th>作成日</th></tr></thead><tbody>${pulls
              .map((p) => `<tr><td>#${p.number}</td><td><a href="/approvals/${p.number}">${esc(p.title)}</a>${p.draft ? ' <span class="pill">下書き</span>' : ""}</td><td>${p.fromAdmin ? "管理画面" : esc(p.author)}</td><td>${CHECK_LABEL[p.checks]}</td><td>${esc(p.created.slice(0, 10))}</td></tr>`)
              .join("")}</tbody></table></div>`
          : `<div class="panel"><p class="muted">承認待ちの変更はありません。</p></div>`;
      } catch (error) {
        body = errorList([`GitHub から読めませんでした：${String(error).slice(0, 160)}`]);
      }
      return view("承認管理", `<h1>承認管理</h1><p class="muted">開いているプルリクエストと、そのテスト（型・lint・全テスト）の結果です。テストが通ったものを「承認」の権限でマージすると公開されます。</p>${body}`, { crumbs: [["承認管理"]] });
    }

    if (path === "/revisions") {
      const kind = url.searchParams.get("kind") ?? "";
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      const pageNo = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
      const all = parseRevisionNames(await github.ids("revisions")).filter((r) => (!kind || r.kind === kind) && (!q || r.name.includes(q)));
      const per = 50;
      const rows = all.slice((pageNo - 1) * per, pageNo * per);
      const qs = (n: number) => `/revisions?${new URLSearchParams({ ...(kind ? { kind } : {}), ...(q ? { q } : {}), page: String(n) })}`;
      const kinds = [["", "すべて"], ["company", "企業"], ["term", "用語"], ["industry", "業界"]];
      return view(
        "変更履歴",
        `<h1>変更履歴</h1><form method="get" class="row panel" style="margin-bottom:14px"><select name="kind" style="width:auto">${kinds.map(([v, l]) => `<option value="${v}"${v === kind ? " selected" : ""}>${l}</option>`).join("")}</select><input type="search" name="q" value="${esc(q)}" placeholder="対象の id・日付で絞る" style="flex:1;min-width:160px"><button type="submit">絞り込む</button></form>
<p class="muted">${all.length.toLocaleString("ja-JP")}件（新しい順）</p>
<div class="panel tw"><table><thead><tr><th>日付</th><th>種類</th><th>記録</th></tr></thead><tbody>${rows
          .map((r) => `<tr><td>${esc(r.day)}</td><td>${esc({ company: "企業", term: "用語", industry: "業界" }[r.kind] ?? r.kind)}</td><td><a href="/revisions/${esc(r.name)}"><code>${esc(r.rest)}</code></a></td></tr>`)
          .join("")}</tbody></table></div>
<p class="row" style="margin-top:10px">${pageNo > 1 ? `<a href="${esc(qs(pageNo - 1))}">← 前へ</a>` : ""}<span class="muted">${pageNo} / ${Math.max(1, Math.ceil(all.length / per))}</span>${pageNo * per < all.length ? `<a href="${esc(qs(pageNo + 1))}">次へ →</a>` : ""}</p>`,
        { crumbs: [["変更履歴"]] },
      );
    }

    const revision = path.match(/^\/revisions\/([0-9a-z-]+)$/);
    if (revision) {
      const name = revision[1]!;
      const r = await github.json<Record<string, unknown>>(`src/data/revisions/${name}.json`);
      if (!r) return view("見つかりません", `<p>変更記録 ${esc(name)} はありません。</p>`, { status: 404 });
      const approval = r.approval as { approver?: { name?: string; kind?: string }; approvedAt?: string } | undefined;
      const field = (label: string, v: unknown) => `<tr><th style="width:24%">${esc(label)}</th><td>${esc(v ?? "—")}</td></tr>`;
      return view(
        `変更記録 ${name}`,
        `<h1 style="word-break:break-all">${esc(name)}</h1>
<section class="panel"><table>${field("対象", `${r.targetType ?? ""} / ${r.targetId ?? ""}`)}${field("日時", r.changedAt)}${field("要約", r.summary)}${field("理由と根拠", r.reason)}${field("承認", approval ? `${approval.approver?.name ?? ""}（${approval.approver?.kind ?? ""}）${approval.approvedAt ?? ""}` : "記録なし")}</table></section>
<section class="panel" style="margin-top:14px"><h2>変更前後（記録そのまま）</h2><pre style="white-space:pre-wrap;word-break:break-all;font-size:12px;max-height:60vh;overflow:auto">${esc(JSON.stringify({ before: r.before, after: r.after }, null, 2))}</pre></section>`,
        { crumbs: [["変更履歴", "/revisions"], [name]] },
      );
    }

    if (path === "/companies") {
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      const rows = q ? (await companyIndex(env)).filter((r) => r.id.includes(q) || r.title.toLowerCase().includes(q) || (r.meta ?? "").toLowerCase().includes(q)).slice(0, 40) : [];
      return view(
        "企業を探す",
        `<h1>企業を探す</h1><form method="get" class="row"><input type="search" name="q" value="${esc(q)}" style="flex:1"><button type="submit">探す</button></form>
<ul class="plain">${rows.map((r) => `<li><a href="/edit/company/${esc(r.id)}">${esc(r.title)}</a> <span class="muted">${esc(r.meta)} ・ ${esc(r.id)}</span></li>`).join("") || (q ? `<li class="muted">見つかりません（掲載済みの企業だけを探せます）。</li>` : "")}</ul>`,
        { signedIn: true },
      );
    }

    if (path === "/terms") {
      const ids = [...(await github.ids("terms"))].sort();
      return view("用語集", `<h1>用語集</h1><p><a href="/new/term">用語を追加</a></p><ul class="plain">${ids.map((id) => `<li><a href="/edit/term/${esc(id)}">${esc(id)}</a></li>`).join("")}</ul>`, {});
    }

    if (path === "/new/term" && request.method === "GET") {
      const id = (url.searchParams.get("id") ?? "").trim();
      if (!EDIT_ID.test(id)) {
        return view("用語を追加", `<h1>用語を追加</h1><form method="get" class="row"><label for="id" style="width:100%">新しい用語の id（英小文字・数字・ハイフン）</label><input type="text" id="id" name="id" pattern="[a-z0-9]+(-[a-z0-9]+)*" required style="flex:1"><button type="submit">次へ</button></form>`, {});
      }
      if (await github.file(`src/data/terms/${id}.json`)) return redirect(`/edit/term/${id}`);
      // Start from an existing term's shape, with this id: the schema tells what each field must hold.
      const sample = await github.file("src/data/terms/affiliate.json");
      const template = sample ? { ...(JSON.parse(sample.text) as Record<string, unknown>), id } : { id };
      return view("用語を追加", `<h1>用語を追加：${esc(id)}</h1><p class="muted">既存の用語「affiliate」の形を下書きにしています。内容をすべて書き換えてください。</p>${editorForm("term", id, JSON.stringify(template, null, 2), "", { isNew: true })}`, {});
    }

    const edit = path.match(/^\/edit\/(company|term)\/([a-z0-9-]+)$/);
    if (edit) {
      const kind = KINDS[edit[1]!]!;
      const id = edit[2]!;
      if (!EDIT_ID.test(id)) return view("エラー", "<p>id が正しくありません。</p>", { status: 400 });
      const filePath = `src/data/${EDIT_DIRECTORY[kind]}/${id}.json`;
      const current = await github.file(filePath);

      if (request.method === "GET") {
        if (!current) return view("見つかりません", `<p>${esc(filePath)} がありません。</p>`, { status: 404 });
        return view(`${id} を直す`, `<h1>${esc(id)} を直す</h1><p class="muted"><a href="${esc(env.SITE_ORIGIN)}/${kind === "company" ? "companies" : "terms"}/${esc(id)}">公開ページ</a> ・ main の版 ${esc(current.sha.slice(0, 7))}</p>${editorForm(kind, id, current.text, current.sha)}`, {});
      }

      const form = await request.formData();
      const isNew = form.get("new") === "1";
      const base = String(form.get("base") ?? "");
      const text = String(form.get("draft") ?? "");
      const summary = String(form.get("summary") ?? "").trim();
      const reason = String(form.get("reason") ?? "").trim();
      const confirm = form.get("confirm") === "1";
      const action = form.get("action") === "save" ? "save" : "preview";
      const again = (errors: string[], note = "") =>
        view(`${id} を直す`, `<h1>${esc(id)} を直す</h1>${errorList(errors)}${note}${editorForm(kind, id, text, base, { summary, reason, confirm, isNew })}`, { status: errors.length ? 422 : 200 });

      if (isNew ? current !== null : !current || current.sha !== base) {
        return again([isNew ? "同じ id のファイルがすでにあります。" : "編集を始めた後に、このファイルが main で変更されました。ページを開き直して、最新の内容から編集してください。"]);
      }
      let draft: unknown;
      try {
        draft = JSON.parse(text);
      } catch (error) {
        return again([`JSON として読めません：${String(error).slice(0, 160)}`]);
      }
      const before = current ? (JSON.parse(current.text) as Record<string, unknown>) : {};
      const preview = previewEdit(kind, id, before, draft, await context(github, isNew ? id : null));
      if (!preview.ok) return again(preview.errors);
      const changes = `<div class="card"><h2 style="margin-top:0">変更点（${preview.changes.length}）</h2><ul>${preview.changes.map((c) => `<li><code>${esc(c.field)}</code></li>`).join("")}</ul>${preview.removedSources.length ? `<p class="bad">削除される出典：${preview.removedSources.map((s) => esc(s.title)).join("、")}</p>` : ""}</div>`;
      if (action === "preview") return again([], `<div class="card ok">検査を通りました。</div>${changes}`);

      const errors = saveInputErrors(preview, summary, reason, confirm);
      if (errors.length) return again(errors, changes);
      const saved = buildSave({ kind, id, current: before, draft, changes: preview.changes, summary, reason, now: new Date() });
      const pr = await github.propose({
        branch: `admin/${saved.revisionId}`,
        message: `${kind === "company" ? "企業" : "用語"}「${id}」：${summary}\n\n${reason}\n\n管理画面から作成（${user.replace(/@.*/, "@…")}）。Revision ${saved.revisionId}`,
        title: `${kind === "company" ? "企業" : "用語"}「${id}」：${summary}`,
        body: `## 変更の要約\n${summary}\n\n## 理由と根拠\n${reason}\n\n## 変わる項目\n${preview.changes.map((c) => `- \`${c.field}\``).join("\n")}\n\n変更記録: \`src/data/revisions/${saved.revisionId}.json\`\n\n管理画面（admin.kigyo-hyakka.com）から作成。テストが通ったらマージしてください。`,
        files: saved.files,
      });
      return view("作成しました", `<h1>プルリクエストを作りました</h1><div class="card ok"><a href="${esc(pr.url)}">#${pr.number}</a> を GitHub で確認し、テストが通ったらマージしてください。マージすると公開されます。</div><p><a href="/">管理のホームへ</a></p>`, {});
    }

    return view("見つかりません", "<p>このページはありません。</p>", { status: 404 });
}
