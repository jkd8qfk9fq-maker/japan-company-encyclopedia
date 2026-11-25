"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { T } from "@/components/i18n/t";
import { useLocalStore } from "@/hooks/use-local-store";
import { activityStore, discoveredStore, exploreStepsStore, favoritesStore, quizStore, recentlyViewedStore, settingsStore } from "@/lib/storage/stores";

/** A confirm() dialog cannot hold markup, so it reads the chosen language itself (JCE-123). */
const ask = (ja: string, en: string) => window.confirm(settingsStore.get().language === "en" ? en : ja);

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
        <p className="font-medium"><T m={{ ja: "アプリとして使う", en: "Use as an app" }} /></p>
        {standalone ? (
          <p className="mt-1 text-sm text-muted-foreground"><T m={{ ja: "アプリとしてインストール済みです。", en: "Installed as an app." }} /></p>
        ) : installEvent ? (
          <>
            <p className="mt-1 text-sm text-muted-foreground"><T m={{ ja: "ホーム画面から起動でき、一度開いたページはオフラインでも読めます。", en: "Open it from your home screen; pages you have opened can be read offline." }} /></p>
            <button
              type="button"
              onClick={async () => {
                await installEvent.prompt();
                setInstallEvent(null);
              }}
              className="mt-3 inline-flex min-h-11 items-center rounded-full bg-foreground px-5 text-sm text-background"
            >
              <T m={{ ja: "インストール", en: "Install" }} />
            </button>
          </>
        ) : (
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            {isIos ? (
              <T m={{ ja: "Safariの共有ボタンから「ホーム画面に追加」を選ぶと、アプリとして使えます。", en: "In Safari, tap Share, then Add to Home Screen, to use it as an app." }} />
            ) : (
              <T m={{ ja: "ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選ぶと、アプリとして使えます。", en: "Choose Install app or Add to Home screen in your browser menu to use it as an app." }} />
            )}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <p className="font-medium"><T m={{ ja: "閲覧履歴", en: "Viewing history" }} /></p>
          <p className="figures mt-1 text-sm text-muted-foreground"><T m={{ ja: `この端末に${recent.length}件保存されています。`, en: `${recent.length} saved on this device.` }} /></p>
        </div>
        <button
          type="button"
          disabled={recent.length === 0}
          onClick={() => recentlyViewedStore.clear()}
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm hover:border-foreground disabled:opacity-40"
        >
          <T m={{ ja: "履歴を消去", en: "Clear history" }} />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <p className="font-medium"><T m={{ ja: "フォロー中の企業", en: "Followed companies" }} /></p>
          <p className="figures mt-1 text-sm text-muted-foreground"><T m={{ ja: `この端末に${favorites.length}件保存されています。`, en: `${favorites.length} saved on this device.` }} /></p>
        </div>
        <button
          type="button"
          disabled={favorites.length === 0}
          onClick={() => {
            if (ask("フォロー中の企業をすべて消去しますか？", "Remove every followed company?")) favoritesStore.clear();
          }}
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm hover:border-foreground disabled:opacity-40"
        >
          <T m={{ ja: "すべて消去", en: "Clear all" }} />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div>
          <p className="font-medium"><T m={{ ja: "マイ企業図鑑と記録", en: "My collection and records" }} /></p>
          <p className="figures mt-1 text-sm text-muted-foreground"><T m={{ ja: `出会った企業${discovered.length}社・会社を知った日${days.length}日・今日の1問の答え${Object.keys(quiz).length}件。`, en: `${discovered.length} companies met, ${days.length} active days, ${Object.keys(quiz).length} daily answers.` }} /></p>
        </div>
        <button
          type="button"
          disabled={discovered.length + days.length + Object.keys(quiz).length === 0}
          onClick={() => {
            if (ask("マイ企業図鑑、連続日数、今日の1問の答え、つながりの記録をすべて消去しますか？", "Clear your collection, streak, daily answers and exploration record?")) {
              discoveredStore.clear();
              activityStore.clear();
              quizStore.clear();
              exploreStepsStore.clear();
            }
          }}
          className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm hover:border-foreground disabled:opacity-40"
        >
          <T m={{ ja: "すべて消去", en: "Clear all" }} />
        </button>
      </div>
    </div>
  );
}
