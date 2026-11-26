"use client";

import { Bell, BellRing } from "lucide-react";
import { useLocalStore } from "@/hooks/use-local-store";
import { favoritesStore, toggleFavorite } from "@/lib/storage/stores";
import { cn } from "@/lib/utils";
import { T } from "@/components/i18n/t";

/**
 * 「フォロー」 (JCE-052; was 「保存」): a company to come back to, and whose new filings appear in お知らせ. Still a
 * reading list, not a rating or a portfolio — the same store as before, so nothing a reader saved is lost.
 */
export function FavoriteButton({ companyId, companyName }: { companyId: string; companyName: string }) {
  const favorites = useLocalStore(favoritesStore);
  const saved = favorites.includes(companyId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={() => toggleFavorite(companyId)}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
        saved ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:border-foreground",
      )}
    >
      {saved ? <BellRing className="size-4" aria-hidden /> : <Bell className="size-4" aria-hidden />}
      {saved ? <T m={{ ja: "フォロー中", en: "Following" }} /> : <T m={{ ja: "フォロー", en: "Follow" }} />}
      <span className="sr-only"><span data-l="ja">：{companyName}（新しい決算をお知らせに表示）</span><span data-l="en">: {companyName} (new earnings shown in notifications)</span></span>
    </button>
  );
}
