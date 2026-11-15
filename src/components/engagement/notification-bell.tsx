"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { favoritesStore, notificationsSeenStore } from "@/lib/storage/stores";
import { loadUpdates } from "./load";

/**
 * お知らせ (JCE-052): a dot with the number of new filings from followed companies since the reader last looked. The
 * file is fetched only when the reader follows someone; which companies they follow never leaves the browser.
 */
export function NotificationBell({ className = "" }: { className?: string }) {
  const following = useLocalStore(favoritesStore);
  const seen = useLocalStore(notificationsSeenStore);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (following.length === 0) return;
    let live = true;
    const ids = new Set(following);
    loadUpdates().then(
      (u) => {
        if (live) setCount(u.events.filter(([id, , day]) => ids.has(id) && day > seen).length);
      },
      () => {},
    );
    return () => {
      live = false;
    };
  }, [following, seen]);

  const shown = following.length > 0 ? count : 0;
  return (
    <Link
      href="/notifications"
      className={`relative flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <Bell className="size-[1.15rem]" aria-hidden />
      {shown > 0 && (
        <span className="figures absolute top-1.5 right-1 min-w-4 rounded-full bg-seal px-1 text-center text-[0.625rem] leading-4 font-semibold text-white">
          {shown > 9 ? "9+" : shown}
        </span>
      )}
      <span className="sr-only">お知らせ{shown > 0 ? `（新しい決算 ${shown}件）` : ""}</span>
    </Link>
  );
}
