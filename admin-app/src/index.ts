import { buildSave, EDIT_DIRECTORY, EDIT_ID, previewEdit, saveInputErrors, type EditableKind } from "../../src/lib/content/content-edit";
import type { ContentContext } from "../../src/lib/content/integrity";
import { LINK_TTL_MS, readCookie, SESSION_COOKIE, SESSION_TTL_MS, sessionCookie, sign, verify } from "./auth";
import { accessEmail } from "./access";
import { allowedEmails, missingSettings, usesAccess, type AdminEnv } from "./env";
import { GitHub } from "./github";
import { errorList, esc, page, redirect } from "./html";

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

    const user = usesAccess(env)
      ? await accessEmail(env, request.headers.get("cf-access-jwt-assertion"))
      : await verify(env, "session", readCookie(request, SESSION_COOKIE));
    if (usesAccess(env) && (!user || !allowedEmails(env).has(user))) {
      return page("ログインできません", `<h1>ログインできません</h1><p>このアドレスには管理画面の権限がありません。</p>`, { status: 403 });
    }
    if (!user || !allowedEmails(env).has(user)) return redirect("/login");
    const github = new GitHub(env);

    if (path === "/" && request.method === "GET") {
      let proposals = "";
      try {
        const list = await github.openProposals();
        proposals = list.length
          ? `<ul class="plain">${list.map((p) => `<li><a href="${esc(p.url)}">#${p.number} ${esc(p.title)}</a> <span class="muted">${esc(p.created.slice(0, 10))}</span></li>`).join("")}</ul>`
          : `<p class="muted">マージ待ちの変更はありません。</p>`;
      } catch (error) {
        proposals = errorList([`GitHub に接続できません：${String(error).slice(0, 160)}`]);
      }
      return page(
        "ホーム",
        `<h1>管理</h1>
<div class="card"><h2 style="margin-top:0">企業を直す</h2><form method="get" action="/companies" class="row"><input type="search" name="q" placeholder="社名・証券コード・id" required style="flex:1"><button type="submit">探す</button></form></div>
<div class="card"><h2 style="margin-top:0">用語集</h2><p><a href="/terms">用語の一覧・編集</a> ・ <a href="/new/term">用語を追加</a></p></div>
<h2>マージ待ちの変更（この管理画面から作ったもの）</h2>${proposals}
<p class="muted">編集は、出典のある事実だけ。保存すると変更記録（Revision）つきのプルリクエストになり、テストが通ってから GitHub でマージすると公開されます。</p>`,
        { signedIn: true },
      );
    }

    if (path === "/companies") {
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      const rows = q ? (await companyIndex(env)).filter((r) => r.id.includes(q) || r.title.toLowerCase().includes(q) || (r.meta ?? "").toLowerCase().includes(q)).slice(0, 40) : [];
      return page(
        "企業を探す",
        `<h1>企業を探す</h1><form method="get" class="row"><input type="search" name="q" value="${esc(q)}" style="flex:1"><button type="submit">探す</button></form>
<ul class="plain">${rows.map((r) => `<li><a href="/edit/company/${esc(r.id)}">${esc(r.title)}</a> <span class="muted">${esc(r.meta)} ・ ${esc(r.id)}</span></li>`).join("") || (q ? `<li class="muted">見つかりません（掲載済みの企業だけを探せます）。</li>` : "")}</ul>`,
        { signedIn: true },
      );
    }

    if (path === "/terms") {
      const ids = [...(await github.ids("terms"))].sort();
      return page("用語集", `<h1>用語集</h1><p><a href="/new/term">用語を追加</a></p><ul class="plain">${ids.map((id) => `<li><a href="/edit/term/${esc(id)}">${esc(id)}</a></li>`).join("")}</ul>`, { signedIn: true });
    }

    if (path === "/new/term" && request.method === "GET") {
      const id = (url.searchParams.get("id") ?? "").trim();
      if (!EDIT_ID.test(id)) {
        return page("用語を追加", `<h1>用語を追加</h1><form method="get" class="row"><label for="id" style="width:100%">新しい用語の id（英小文字・数字・ハイフン）</label><input type="text" id="id" name="id" pattern="[a-z0-9]+(-[a-z0-9]+)*" required style="flex:1"><button type="submit">次へ</button></form>`, { signedIn: true });
      }
      if (await github.file(`src/data/terms/${id}.json`)) return redirect(`/edit/term/${id}`);
      // Start from an existing term's shape, with this id: the schema tells what each field must hold.
      const sample = await github.file("src/data/terms/affiliate.json");
      const template = sample ? { ...(JSON.parse(sample.text) as Record<string, unknown>), id } : { id };
      return page("用語を追加", `<h1>用語を追加：${esc(id)}</h1><p class="muted">既存の用語「affiliate」の形を下書きにしています。内容をすべて書き換えてください。</p>${editorForm("term", id, JSON.stringify(template, null, 2), "", { isNew: true })}`, { signedIn: true });
    }

    const edit = path.match(/^\/edit\/(company|term)\/([a-z0-9-]+)$/);
    if (edit) {
      const kind = KINDS[edit[1]!]!;
      const id = edit[2]!;
      if (!EDIT_ID.test(id)) return page("エラー", "<p>id が正しくありません。</p>", { status: 400, signedIn: true });
      const filePath = `src/data/${EDIT_DIRECTORY[kind]}/${id}.json`;
      const current = await github.file(filePath);

      if (request.method === "GET") {
        if (!current) return page("見つかりません", `<p>${esc(filePath)} がありません。</p>`, { status: 404, signedIn: true });
        return page(`${id} を直す`, `<h1>${esc(id)} を直す</h1><p class="muted"><a href="${esc(env.SITE_ORIGIN)}/${kind === "company" ? "companies" : "terms"}/${esc(id)}">公開ページ</a> ・ main の版 ${esc(current.sha.slice(0, 7))}</p>${editorForm(kind, id, current.text, current.sha)}`, { signedIn: true });
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
        page(`${id} を直す`, `<h1>${esc(id)} を直す</h1>${errorList(errors)}${note}${editorForm(kind, id, text, base, { summary, reason, confirm, isNew })}`, { signedIn: true, status: errors.length ? 422 : 200 });

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
      return page("作成しました", `<h1>プルリクエストを作りました</h1><div class="card ok"><a href="${esc(pr.url)}">#${pr.number}</a> を GitHub で確認し、テストが通ったらマージしてください。マージすると公開されます。</div><p><a href="/">管理のホームへ</a></p>`, { signedIn: true });
    }

    return page("見つかりません", "<p>このページはありません。</p>", { status: 404, signedIn: true });
  },
};
