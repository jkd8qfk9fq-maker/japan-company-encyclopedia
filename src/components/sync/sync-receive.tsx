"use client";

// A Client Component: the token is in the address's fragment, which only the browser can read (JCE-065).
import Link from "next/link";
import { useEffect, useState } from "react";
import { syncDiff, type SyncData } from "@/lib/sync-data";
import { applySyncData, claimSync, collectSyncData } from "@/lib/sync";
import { T } from "@/components/i18n/t";

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

  if (state.kind === "loading") return <p className="text-sm text-muted-foreground"><T m={{ ja: "確認しています…", en: "Checking…" }} /></p>;
  if (state.kind === "none") return <p className="text-sm"><span data-l="ja" lang="ja">引き継ぎのリンクは、メールに届いたものを開いてください。送るのは<Link href="/settings" className="underline underline-offset-2"><T m={{ ja: "設定", en: "Settings" }} /></Link>からです。</span><span data-l="en" lang="en">Open the transfer link from the email you received. You send it from <Link href="/settings" className="underline underline-offset-2"><T m={{ ja: "設定", en: "Settings" }} /></Link>.</span></p>;
  if (state.kind === "gone") return <p className="text-sm"><span data-l="ja" lang="ja">このリンクは、使用済み・取り消し済み・期限切れのいずれかです。元の端末の<Link href="/settings" className="underline underline-offset-2"><T m={{ ja: "設定", en: "Settings" }} /></Link>から、もう一度送ってください。</span><span data-l="en" lang="en">This link has already been used, has been canceled, or has expired. Send it again from <Link href="/settings" className="underline underline-offset-2"><T m={{ ja: "設定", en: "Settings" }} /></Link> on the original device.</span></p>;
  if (state.kind === "error") return <p className="text-sm"><T m={{ ja: "確認できませんでした。通信状態を確かめて、メールのリンクをもう一度開いてください。", en: "Couldn't verify. Check your connection and open the link in the email again." }} /></p>;
  if (state.kind === "done") return <p role="status" className="text-sm"><span data-l="ja" lang="ja">引き継ぎました。<Link href="/notifications" className="underline underline-offset-2"><T m={{ ja: "お知らせ", en: "Notices" }} /></Link>や企業ページで、フォローが反映されています。</span><span data-l="en" lang="en">Transferred. Your follows are now reflected in <Link href="/notifications" className="underline underline-offset-2"><T m={{ ja: "お知らせ", en: "Notices" }} /></Link> and on company pages.</span></p>;
  if (state.kind === "declined") return <p className="text-sm"><T m={{ ja: "取り込みませんでした。この端末の内容は変わっていません。必要なら、元の端末からもう一度送ってください。", en: "Not imported. Nothing on this device has changed. If needed, send it again from the original device." }} /></p>;

  const diff = syncDiff(collectSyncData(), state.data);
  return (
    <div className="space-y-4 text-sm leading-7">
      <p><T m={{ ja: "届いた内容を、この端末に加えます。この端末にすでにある内容は消えません。", en: "The received data will be added to this device. Existing data on this device won't be deleted." }} /></p>
      <ul className="list-disc pl-5">
        <li><span data-l="ja" lang="ja">フォロー中の企業：{state.data.favorites.length}社（この端末に新しく加わるのは{diff.favorites}社）</span><span data-l="en" lang="en">Companies you follow: {state.data.favorites.length} ({diff.favorites} new on this device)</span></li>
        <li><span data-l="ja" lang="ja">フォロー中の業界：{state.data.followedIndustries.length}業界（新しく{diff.followedIndustries}業界）</span><span data-l="en" lang="en">Industries you follow: {state.data.followedIndustries.length} ({diff.followedIndustries} new)</span></li>
        <li><span data-l="ja" lang="ja">保存した検索条件：{state.data.savedScreenings.length}件（新しく{diff.savedScreenings}件）</span><span data-l="en" lang="en">Saved searches: {state.data.savedScreenings.length} ({diff.savedScreenings} new)</span></li>
        <li><span data-l="ja" lang="ja">最近見た企業：{state.data.recentlyViewed.length}社</span><span data-l="en" lang="en">Recently viewed companies: {state.data.recentlyViewed.length}</span></li>
      </ul>
      {diff.hereHasData && <p className="text-muted-foreground"><T m={{ ja: "この端末にもフォローなどがあるので、両方を合わせます（上書きはしません）。", en: "This device also has follows and other data, so both will be merged (nothing will be overwritten)." }} /></p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { applySyncData(state.data); setState({ kind: "done" }); }} className="min-h-11 rounded-full bg-navy px-5 font-medium text-white">
          <T m={{ ja: "この端末に取り込む", en: "Import to this device" }} />
        </button>
        <button type="button" onClick={() => setState({ kind: "declined" })} className="min-h-11 rounded-full border border-border px-5">
          <T m={{ ja: "取り込まない", en: "Don't import" }} />
        </button>
      </div>
    </div>
  );
}
