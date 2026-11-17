"use client";

// A Client Component: it reads this browser's lists and sends them only when the reader asks (JCE-065).
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { syncPendingStore } from "@/lib/storage/stores";
import { cancelSync, startSync, syncAvailable } from "@/lib/sync";

export function SyncPanel() {
  const pending = useLocalStore(syncPendingStore);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "input" | "rate" | "error">("idle");

  useEffect(() => {
    syncAvailable().then((on) => {
      setAvailable(on);
      // The clock is read here, not while rendering: an expired link is forgotten once, after the page has loaded.
      const stale = syncPendingStore.get();
      if (stale && stale.expiresAt <= Date.now()) syncPendingStore.clear();
    });
  }, []);

  if (available === false) return <p className="text-sm text-muted-foreground">いまは、別の端末への引き継ぎを使えません。</p>;
  const active = pending;
  const until = active ? new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date(active.expiresAt)) : null;

  return (
    <div className="space-y-4 text-sm leading-7">
      <p>
        フォロー中の企業・最近見た企業・フォロー中の業界・保存した検索条件を、別の端末やブラウザに引き継げます。メールで届くリンクを、引き継ぎ先で開いてください。リンクは30分・1回だけ有効です。
      </p>
      <form
        className="flex max-w-md flex-wrap gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setStatus("sending");
          setStatus(await startSync(email.trim()).catch(() => "error" as const));
        }}
      >
        <label htmlFor="sync-email" className="sr-only">メールアドレス</label>
        <input
          id="sync-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-background px-3"
        />
        <button type="submit" disabled={status === "sending" || available !== true} className="min-h-11 rounded-full bg-navy px-4 font-medium text-white disabled:opacity-50">
          {status === "sending" ? "送信中…" : "リンクを送る"}
        </button>
      </form>
      {status === "sent" && <p role="status">リンクを送りました。引き継ぎ先の端末で、メールのリンクを開いてください。</p>}
      {status === "input" && <p role="alert">メールアドレスを確かめてください。</p>}
      {status === "rate" && <p role="alert">続けて送られています。1分ほど待ってから、もう一度お試しください。</p>}
      {status === "error" && <p role="alert">送れませんでした。しばらくしてから、もう一度お試しください。</p>}
      {active && (
        <p className="text-muted-foreground">
          送ったリンクは{until}まで有効です。もう一度送ると、前のリンクは使えなくなります。
          <button type="button" onClick={() => cancelSync().then(() => setStatus("idle"))} className="ml-2 underline underline-offset-2">
            送ったリンクを取り消す
          </button>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        送った内容は、リンクが開かれるか、30分が過ぎるか、取り消すと、サーバーから消えます。メールアドレスは、そのメールを送るためだけに使い、保存しません。
        通知の設定は端末ごとなので、引き継ぎ先で改めてオンにしてください。
      </p>
    </div>
  );
}
