"use client";

// Client Components: the sign-up key lives in this browser's storage, and the mailed links carry their keys in the
// address's fragment, which only the browser can read (JCE-069).

import { Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { confirmMail, mailAvailable, refreshMailState, startMail, stopMail, stopMailByLink, syncMail } from "@/lib/mail-notify";
import { favoritesStore, mailNotifyStore, type MailNotify } from "@/lib/storage/stores";

const KIND_LABEL: Record<MailNotify["kinds"][number], string> = {
  results: "新しい決算の公開（有価証券報告書・半期報告書・決算短信）",
  corrections: "掲載内容の更新（訂正）",
};

/** On お知らせ: register an address and choose what to receive — no browser permission needed. */
export function MailNotifyPanel() {
  const favorites = useLocalStore(favoritesStore);
  const signup = useLocalStore(mailNotifyStore);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [kinds, setKinds] = useState<MailNotify["kinds"]>(["results", "corrections"]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "input" | "rate" | "error">("idle");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    mailAvailable().then(setAvailable);
    void refreshMailState();
  }, []);

  if (available === false) return null;
  const showForm = !signup || editing;

  return (
    <div id="mail" className="scroll-mt-24 rounded-md border border-border bg-card p-4 text-sm leading-6">
      <p className="flex items-center gap-2 font-medium">
        <Mail className="size-4" aria-hidden />
        メールで受け取る
      </p>
      <p className="mt-1 text-muted-foreground">ブラウザの通知を許可しなくても届きます。iPhone や、通知が止められているパソコンでも使えます。</p>

      {signup && !editing && (
        <div className="mt-3 space-y-2">
          <p role="status">
            {signup.confirmed ? (
              <>配信中：{signup.hint}（フォロー中の{favorites.length}社）</>
            ) : (
              <>確認待ち：{signup.hint} に確認のメールを送りました。メールのリンクを開くと配信が始まります（24時間以内）。</>
            )}
          </p>
          <p className="text-muted-foreground">受け取る内容：{signup.kinds.map((k) => KIND_LABEL[k]).join("、")}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setEditing(true)} className="min-h-11 rounded-full border border-border px-4 hover:border-foreground">
              {signup.confirmed ? "アドレス・内容を変える" : "メールが届かないとき（送り直す）"}
            </button>
            <button type="button" onClick={() => void stopMail().then(() => setStatus("idle"))} className="min-h-11 rounded-full border border-border px-4 hover:border-foreground">
              メールの配信を止める
            </button>
          </div>
        </div>
      )}

      {showForm && favorites.length === 0 && <p className="mt-3 text-muted-foreground">会社をフォローすると、メールで受け取る設定ができます。</p>}
      {showForm && favorites.length > 0 && (
        <form
          className="mt-3 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (kinds.length === 0) return setStatus("input");
            setStatus("sending");
            const result = await startMail(email.trim(), kinds).catch(() => "error" as const);
            setStatus(result);
            if (result === "sent") setEditing(false);
          }}
        >
          <fieldset>
            <legend className="text-muted-foreground">受け取る内容（フォロー中の{favorites.length}社）</legend>
            {(Object.keys(KIND_LABEL) as MailNotify["kinds"]).map((k) => (
              <label key={k} className="mt-1 flex min-h-9 items-center gap-2">
                <input
                  type="checkbox"
                  checked={kinds.includes(k)}
                  onChange={(e) => setKinds((now) => (e.target.checked ? [...now, k] : now.filter((x) => x !== k)))}
                  className="size-4"
                />
                {KIND_LABEL[k]}
              </label>
            ))}
          </fieldset>
          <div className="flex max-w-md flex-wrap gap-2">
            <label htmlFor="mail-notify-email" className="sr-only">メールアドレス</label>
            <input
              id="mail-notify-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-background px-3"
            />
            <button type="submit" disabled={status === "sending" || available !== true} className="min-h-11 rounded-full bg-foreground px-4 font-medium text-background disabled:opacity-50">
              {status === "sending" ? "送信中…" : "確認メールを送る"}
            </button>
          </div>
          {editing && (
            <button type="button" onClick={() => setEditing(false)} className="text-muted-foreground underline underline-offset-2">
              変更しない
            </button>
          )}
        </form>
      )}
      {status === "sent" && <p className="mt-2" role="status">確認のメールを送りました。メールのリンクを開くと配信が始まります。</p>}
      {status === "input" && <p className="mt-2" role="alert">メールアドレスと、受け取る内容（1つ以上）を確かめてください。</p>}
      {status === "rate" && <p className="mt-2" role="alert">続けて送られています。1分ほど待ってから、もう一度お試しください。</p>}
      {status === "error" && <p className="mt-2" role="alert">送れませんでした。しばらくしてから、もう一度お試しください。</p>}
      <p className="mt-3 text-xs text-muted-foreground">
        メールアドレスは、確認のリンクを開いたあと、お知らせのメールを送るためだけに使います。送るのは「〇〇の新しい決算データが公開されました」という事実だけです。
        どのメールにも配信を止めるリンクがあり、止めるとその場でアドレスを削除します。詳しくは<Link href="/privacy#mail" className="underline underline-offset-2">プライバシーポリシー</Link>へ。
      </p>
    </div>
  );
}

/** In the layout: keeps the sign-up's company list equal to this browser's follows, as PushSync does for push. */
export function MailSync() {
  const favorites = useLocalStore(favoritesStore);
  const signup = useLocalStore(mailNotifyStore);
  const last = useRef<string | null>(null);
  const key = signup?.manageKey ?? null;
  useEffect(() => {
    if (!key) return;
    const list = favorites.join(",");
    if (list === last.current) return;
    last.current = list;
    void syncMail(favorites);
  }, [favorites, key]);
  return null;
}

/** The page the mails link to: #t= confirms a sign-up, #s= stops one. */
export function MailLinkHandler() {
  const [state, setState] = useState<"loading" | "none" | "on" | "gone" | "stopped" | "error">("loading");
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("t");
    const stop = params.get("s");
    // The key leaves the address at once, so it is not kept in history or shown to anyone looking at the screen.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    if (token) confirmMail(token).then(setState);
    else if (stop) stopMailByLink(stop).then((ok) => setState(ok ? "stopped" : "error"));
    else queueMicrotask(() => setState("none"));
  }, []);
  if (state === "loading") return <p className="text-sm text-muted-foreground">確認しています…</p>;
  if (state === "on") return <p role="status" className="text-sm leading-7">メールの配信を始めました。フォロー中の会社に新しい決算や更新があると、メールでお知らせします。<Link href="/notifications" className="underline underline-offset-2">お知らせ</Link>でも、いつでも確認できます。</p>;
  if (state === "stopped") return <p role="status" className="text-sm leading-7">メールの配信を止め、メールアドレスを削除しました。お知らせは、サイトの<Link href="/notifications" className="underline underline-offset-2">お知らせ</Link>でこれまでどおり見られます。</p>;
  if (state === "gone") return <p className="text-sm leading-7">このリンクは、使用済みか期限切れ（24時間）です。<Link href="/notifications#mail" className="underline underline-offset-2">お知らせ</Link>から、もう一度確認のメールを送ってください。</p>;
  if (state === "error") return <p className="text-sm leading-7">確認できませんでした。通信状態を確かめて、メールのリンクをもう一度開いてください。</p>;
  return <p className="text-sm leading-7">このページは、お知らせのメールに書かれたリンクから開きます。設定は<Link href="/notifications#mail" className="underline underline-offset-2">お知らせ</Link>からできます。</p>;
}
