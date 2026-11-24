"use client";

// A Client Component: whether the app is installed, and the browser's install prompt, exist only in the browser.

import { Smartphone, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { trainingInstallDismissedStore } from "@/lib/storage/stores";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const subscribeNothing = () => () => {};

/**
 * 分析訓練 as its own app on the home screen (JCE-108). On /learn the page's manifest is the training app's, so the
 * browser's install prompt installs 分析訓練, not the encyclopedia. Shown until the reader installs or closes it;
 * nothing else on the page waits for it.
 */
export function TrainingInstall() {
  const dismissed = useLocalStore(trainingInstallDismissedStore);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const standalone = useSyncExternalStore(subscribeNothing, () => window.matchMedia("(display-mode: standalone)").matches, () => true);
  const isIos = useSyncExternalStore(subscribeNothing, () => /iPad|iPhone|iPod/.test(navigator.userAgent), () => false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (standalone || dismissed) return null;
  return (
    <aside aria-label="分析訓練をアプリとして使う" className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5">
      <Smartphone className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1 text-sm leading-6">
        <p className="font-semibold">ホーム画面に「分析訓練」を置く</p>
        <p className="text-xs leading-5 text-muted-foreground">
          {installEvent
            ? "毎日の訓練を、アイコンから直接開けます。記録はこのブラウザのものがそのまま使えます。"
            : isIos
              ? "Safari の共有ボタンから「ホーム画面に追加」を選ぶと、アイコンから直接開けます。"
              : "ブラウザのメニューの「ホーム画面に追加」または「アプリをインストール」で、アイコンから直接開けます。"}
        </p>
        {installEvent && (
          <button
            type="button"
            onClick={async () => {
              await installEvent.prompt();
              setInstallEvent(null);
            }}
            className="mt-2 inline-flex min-h-10 items-center rounded-full bg-foreground px-4 text-xs font-semibold text-background"
          >
            ホーム画面に追加
          </button>
        )}
      </div>
      <button type="button" onClick={() => trainingInstallDismissedStore.set(true)} className="-m-1.5 grid size-9 shrink-0 place-items-center text-muted-foreground hover:text-foreground">
        <X className="size-4" aria-hidden />
        <span className="sr-only">閉じる</span>
      </button>
    </aside>
  );
}
