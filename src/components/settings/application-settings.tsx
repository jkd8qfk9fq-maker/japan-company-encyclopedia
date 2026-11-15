"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { activityStore, discoveredStore, exploreStepsStore, favoritesStore, quizStore, recentlyViewedStore } from "@/lib/storage/stores";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const subscribeNothing = () => () => {};

/**
 * Install and local-data controls. Everything here acts on this device only,
 * and the copy says so: a reader clearing "history" should not wonder whether
 * something on a server was deleted.
 */
export function ApplicationSettings() {
  const favorites = useLocalStore(favoritesStore);
  const discovered = useLocalStore(discoveredStore);
  const days = useLocalStore(activityStore);
  const quiz = useLocalStore(quizStore);
  const recent = useLocalStore(recentlyViewedStore);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const standalone = useSyncExternalStore(
    subscribeNothing,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false,
  );
  const isIos = useSyncExternalStore(
    subscribeNothing,
    () => /iPad|iPhone|iPod/.test(navigator.userAgent),
    () => false,
  );

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  return (
    <div className="divide-y divide-border">
      <div className="py-5">
        <p className="font-medium">アプリとして使う</p>
        {standalone ? (
          <p className="mt-1 text-sm text-muted-foreground">アプリとしてインストール済みです。</p>
        ) : installEvent ? (
          <>
            <p className="mt-1 text-sm text-muted-foreground">ホーム画面から起動でき、一度開いたページはオフラインでも読めます。</p>
            <button
              type="button"
              onClick={async () => {
                await installEvent.prompt();
                setInstallEvent(null);
              }}
              className="mt-3 inline-flex min-h-11 items-center rounded-full bg-foreground px-5 text-sm text-background"
            >
              インストール
            </button>
          </>
        ) : (
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            {isIos
              ? "Safariの共有ボタンから「ホーム画面に追加」を選ぶと、アプリとして使えます。"
              : "ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選ぶと、アプリとして使えます。"}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <p className="font-medium">閲覧履歴</p>
          <p className="figures mt-1 text-sm text-muted-foreground">この端末に{recent.length}件保存されています。</p>
        </div>
        <button
          type="button"
          disabled={recent.length === 0}
          onClick={() => recentlyViewedStore.clear()}
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm hover:border-foreground disabled:opacity-40"
        >
          履歴を消去
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <p className="font-medium">フォロー中の企業</p>
          <p className="figures mt-1 text-sm text-muted-foreground">この端末に{favorites.length}件保存されています。</p>
        </div>
        <button
          type="button"
          disabled={favorites.length === 0}
          onClick={() => {
            if (window.confirm("フォロー中の企業をすべて消去しますか？")) favoritesStore.clear();
          }}
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm hover:border-foreground disabled:opacity-40"
        >
          すべて消去
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <p className="font-medium">マイ企業図鑑と記録</p>
          <p className="figures mt-1 text-sm text-muted-foreground">出会った企業{discovered.length}社・会社を知った日{days.length}日・今日の1問の答え{Object.keys(quiz).length}件。</p>
        </div>
        <button
          type="button"
          disabled={discovered.length + days.length + Object.keys(quiz).length === 0}
          onClick={() => {
            if (window.confirm("マイ企業図鑑、連続日数、今日の1問の答え、つながりの記録をすべて消去しますか？")) {
              discoveredStore.clear();
              activityStore.clear();
              quizStore.clear();
              exploreStepsStore.clear();
            }
          }}
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm hover:border-foreground disabled:opacity-40"
        >
          すべて消去
        </button>
      </div>
    </div>
  );
}
