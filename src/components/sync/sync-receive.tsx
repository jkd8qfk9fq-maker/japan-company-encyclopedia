"use client";

// A Client Component: the token is in the address's fragment, which only the browser can read (JCE-065).
import Link from "next/link";
import { useEffect, useState } from "react";
import { syncDiff, type SyncData } from "@/lib/sync-data";
import { applySyncData, claimSync, collectSyncData } from "@/lib/sync";

type State = { kind: "loading" } | { kind: "none" } | { kind: "gone" } | { kind: "error" } | { kind: "ready"; data: SyncData } | { kind: "done" } | { kind: "declined" };

export function SyncReceive() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("t");
    // The token leaves the address at once, so it is not kept in history or shown to anyone looking at the screen.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    if (!token) {
      queueMicrotask(() => setState({ kind: "none" }));
      return;
    }
    claimSync(token).then(
      (result) => setState(result === "gone" ? { kind: "gone" } : result === "error" ? { kind: "error" } : { kind: "ready", data: result }),
      () => setState({ kind: "error" }),
    );
  }, []);

  if (state.kind === "loading") return <p className="text-sm text-muted-foreground">確認しています…</p>;
  if (state.kind === "none") return <p className="text-sm">引き継ぎのリンクは、メールに届いたものを開いてください。送るのは<Link href="/settings" className="underline underline-offset-2">設定</Link>からです。</p>;
  if (state.kind === "gone") return <p className="text-sm">このリンクは、使用済み・取り消し済み・期限切れのいずれかです。元の端末の<Link href="/settings" className="underline underline-offset-2">設定</Link>から、もう一度送ってください。</p>;
  if (state.kind === "error") return <p className="text-sm">確認できませんでした。通信状態を確かめて、メールのリンクをもう一度開いてください。</p>;
  if (state.kind === "done") return <p role="status" className="text-sm">引き継ぎました。<Link href="/notifications" className="underline underline-offset-2">お知らせ</Link>や企業ページで、フォローが反映されています。</p>;
  if (state.kind === "declined") return <p className="text-sm">取り込みませんでした。この端末の内容は変わっていません。必要なら、元の端末からもう一度送ってください。</p>;

  const diff = syncDiff(collectSyncData(), state.data);
  return (
    <div className="space-y-4 text-sm leading-7">
      <p>届いた内容を、この端末に加えます。この端末にすでにある内容は消えません。</p>
      <ul className="list-disc pl-5">
        <li>フォロー中の企業：{state.data.favorites.length}社（この端末に新しく加わるのは{diff.favorites}社）</li>
        <li>フォロー中の業界：{state.data.followedIndustries.length}業界（新しく{diff.followedIndustries}業界）</li>
        <li>保存した検索条件：{state.data.savedScreenings.length}件（新しく{diff.savedScreenings}件）</li>
        <li>最近見た企業：{state.data.recentlyViewed.length}社</li>
      </ul>
      {diff.hereHasData && <p className="text-muted-foreground">この端末にもフォローなどがあるので、両方を合わせます（上書きはしません）。</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { applySyncData(state.data); setState({ kind: "done" }); }} className="min-h-11 rounded-full bg-navy px-5 font-medium text-white">
          この端末に取り込む
        </button>
        <button type="button" onClick={() => setState({ kind: "declined" })} className="min-h-11 rounded-full border border-border px-5">
          取り込まない
        </button>
      </div>
    </div>
  );
}
