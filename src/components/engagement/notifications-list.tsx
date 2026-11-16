"use client";

import { BellRing, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import type { UpdateKind, UpdatesData } from "@/lib/engagement-data";
import { favoritesStore, notificationsSeenStore, recordActivity } from "@/lib/storage/stores";
import { loadUpdates } from "./load";

const KIND: Record<UpdateKind, string> = { yuho: "有価証券報告書", hanki: "半期報告書", tanshin: "決算短信", correction: "訂正" };
const ANCHOR: Record<UpdateKind, string> = { yuho: "#financials", hanki: "#financials", tanshin: "#financials", correction: "" };
const dayLabel = (d: string) => `${Number(d.slice(5, 7))}月${Number(d.slice(8, 10))}日`;

/**
 * The reader's お知らせ (JCE-052): filings of the companies they follow, newest first, the new ones since their last
 * visit marked. Opening the page marks them seen. Everything is compared in the browser.
 */
export function NotificationsList() {
  const following = useLocalStore(favoritesStore);
  const seen = useLocalStore(notificationsSeenStore);
  const [data, setData] = useState<UpdatesData | null>(null);
  const [failed, setFailed] = useState(false);
  // What was "new" when the page opened stays marked while the reader looks, even after it is recorded as seen.
  const [seenAtOpen] = useState(() => notificationsSeenStore.get());

  useEffect(() => {
    loadUpdates().then(setData, () => setFailed(true));
  }, []);

  useEffect(() => {
    if (!data) return;
    const newest = data.events.find(([id]) => following.includes(id))?.[2];
    if (newest && newest > seen) notificationsSeenStore.set(newest);
    if (following.length > 0) recordActivity();
  }, [data, following, seen]);

  if (failed) return <p className="text-sm text-muted-foreground">お知らせを読み込めませんでした。通信状態を確かめて、もう一度開いてください。</p>;
  if (following.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card p-6">
        <BellRing className="size-6 text-seal" aria-hidden />
        <p className="mt-3 font-medium">まだフォローしている会社がありません</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          企業ページの「フォロー」を押すと、その会社が有価証券報告書・半期報告書・決算短信を出したときにここに並びます。
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/discover" className="rounded-full bg-foreground px-4 py-2 font-medium text-background">DISCOVER で会社に出会う</Link>
          <Link href="/companies" className="rounded-full border border-border px-4 py-2 hover:border-foreground">企業一覧から探す</Link>
        </div>
      </div>
    );
  }
  if (!data) return <p className="text-sm text-muted-foreground">読み込んでいます…</p>;

  const mine = data.events.filter(([id]) => following.includes(id));
  const quiet = following.filter((id) => !mine.some(([e]) => e === id));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8">
      {mine.length === 0 ? (
        <p className="text-sm text-muted-foreground">フォロー中の会社の、この{data.days}日間の新しい決算はまだありません。</p>
      ) : (
        <ol className="m-0 list-none divide-y divide-border border-y border-border p-0">
          {mine.map(([id, kind, day, title]) => {
            const fresh = day > seenAtOpen;
            return (
              <li key={`${id}-${kind}-${title}`}>
                <Link href={`/companies/${id}${ANCHOR[kind]}`} className="grid grid-cols-[3.5rem_1fr] gap-3 py-3.5 hover:bg-muted/40">
                  <span className="figures text-xs text-muted-foreground">{dayLabel(day)}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{data.names[id] ?? id}</span>
                      {fresh && <span className="rounded-full bg-seal px-2 text-[0.625rem] leading-5 font-semibold text-white">新着</span>}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FileText className="size-3.5 shrink-0" aria-hidden />
                      {title}
                      {!title.includes(KIND[kind]) && <span className="text-xs">（{KIND[kind]}）</span>}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
      <p className="text-xs leading-5 text-muted-foreground">
        この{data.days}日間（{data.asOf}まで）に提出・発表されたもの。有価証券報告書と半期報告書は EDINET、決算短信の第1・第3四半期は EDINET DB
        が構造化した数値の掲載日です。お知らせはこのページを開いたときに確かめます（通知は送りません）。
        {quiet.length > 0 && ` フォロー中のほか${quiet.length}社は、この期間に新しい決算がありません。`}
      </p>
    </div>
  );
}
