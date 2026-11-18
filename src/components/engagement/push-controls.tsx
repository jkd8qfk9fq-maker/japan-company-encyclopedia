"use client";

// Client Components: notifications are a browser permission and a subscription only the browser can make (JCE-059).

import { BellOff, BellRing } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { disablePush, enablePush, pushAvailability, syncPush, type PushAvailability } from "@/lib/push";
import { favoritesStore, pushCompaniesStore, setPushForCompany } from "@/lib/storage/stores";

function useAvailability(): PushAvailability | null {
  const [availability, setAvailability] = useState<PushAvailability | null>(null);
  useEffect(() => {
    pushAvailability().then(setAvailability, () => setAvailability({ state: "unsupported" }));
  }, []);
  return availability;
}

const NOTE: Partial<Record<PushAvailability["state"], string>> = {
  "ios-needs-install": "iPhone・iPad では、このサイトをホーム画面に追加すると、決算の通知を受け取れます（共有ボタン →「ホーム画面に追加」）。",
  blocked: "このブラウザでは通知が止められています。ブラウザのサイト設定で通知を許可すると、受け取れます。",
};

const FAILED: Record<string, string> = {
  denied: "通知が許可されなかったため、設定していません。メールでも受け取れます。",
  failed: "通知の設定ができませんでした。時間をおいて、もう一度お試しください。",
  limit: "通知を受け取れる会社の数の上限を超えています。",
};

/** Under 「フォロー」 on a company page: this company's new results as a notification. Shown only while followed. */
export function PushCompanyToggle({ companyId, companyName }: { companyId: string; companyName: string }) {
  const favorites = useLocalStore(favoritesStore);
  const pushed = useLocalStore(pushCompaniesStore);
  const availability = useAvailability();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!favorites.includes(companyId) || !availability) return null;
  if (availability.state !== "ready") {
    const note = NOTE[availability.state];
    return (
      <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
        {note && <>{note} </>}
        <MailLink />
      </p>
    );
  }
  const on = pushed.includes(companyId);
  return (
    <div className="mt-2">
      <button
        type="button"
        aria-pressed={on}
        disabled={busy}
        onClick={async () => {
          setMessage(null);
          if (on) return setPushForCompany(companyId, false);
          setBusy(true);
          const result = await enablePush([companyId, ...pushed.filter((id) => favorites.includes(id))]);
          setBusy(false);
          if (result === "on") setPushForCompany(companyId, true);
          else setMessage(FAILED[result] ?? null);
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm hover:border-foreground disabled:opacity-60"
      >
        {on ? <BellRing className="size-4" aria-hidden /> : <BellOff className="size-4" aria-hidden />}
        {on ? "決算の通知: オン" : "決算・更新の通知を受け取る"}
        <span className="sr-only">：{companyName}</span>
      </button>
      {message && (
        <p className="mt-1 text-xs text-muted-foreground" role="status">
          {message} <MailLink />
        </p>
      )}
    </div>
  );
}

/** JCE-069: where a browser cannot or will not show notifications, the same news by e-mail. */
function MailLink() {
  return (
    <Link href="/notifications#mail" className="underline underline-offset-2">
      メールで受け取る
    </Link>
  );
}

/** On お知らせ: notifications for every followed company at once, or none. */
export function PushAllToggle() {
  const favorites = useLocalStore(favoritesStore);
  const pushed = useLocalStore(pushCompaniesStore);
  const availability = useAvailability();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (favorites.length === 0 || !availability) return null;
  if (availability.state !== "ready") {
    const note = NOTE[availability.state];
    return note ? <p className="rounded-md border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">{note}</p> : null;
  }
  const count = pushed.filter((id) => favorites.includes(id)).length;
  return (
    <div className="rounded-md border border-border bg-card p-4 text-sm leading-6">
      <p className="font-medium">決算・更新の通知</p>
      <p className="mt-1 text-muted-foreground">
        フォロー中の会社が新しい決算を出したとき、このブラウザに通知します。送るのは「〇〇の新しい決算データが公開されました」という事実だけです。
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setMessage(null);
            setBusy(true);
            const result = await enablePush(favorites);
            setBusy(false);
            if (result === "on") pushCompaniesStore.set([...favorites]);
            else setMessage(FAILED[result] ?? null);
          }}
          className="min-h-11 rounded-full bg-foreground px-4 font-medium text-background disabled:opacity-60"
        >
          {count === favorites.length ? `通知: オン（${count}社）` : `フォロー中の${favorites.length}社すべてで受け取る`}
        </button>
        {count > 0 && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await disablePush();
              pushCompaniesStore.set([]);
              setBusy(false);
            }}
            className="min-h-11 rounded-full border border-border px-4 hover:border-foreground disabled:opacity-60"
          >
            通知をすべて止める
          </button>
        )}
      </div>
      {message && <p className="mt-2 text-xs text-muted-foreground" role="status">{message}</p>}
    </div>
  );
}

/** In the layout: keeps the site's copy of the list equal to this browser's (and refreshes it once per visit). */
export function PushSync() {
  const favorites = useLocalStore(favoritesStore);
  const pushed = useLocalStore(pushCompaniesStore);
  const last = useRef<string | null>(null);
  useEffect(() => {
    const list = pushed.filter((id) => favorites.includes(id));
    const key = list.join(",");
    if (key === last.current) return;
    last.current = key;
    void syncPush(list);
  }, [favorites, pushed]);
  return null;
}
