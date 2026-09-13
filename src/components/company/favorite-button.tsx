"use client";

import { Bookmark } from "lucide-react";
import { useLocalStore } from "@/hooks/use-local-store";
import { favoritesStore, toggleFavorite } from "@/lib/storage/stores";
import { cn } from "@/lib/utils";

/**
 * "保存" — a company to come back to. Deliberately a bookmark, not a star or a
 * heart: this is a reading list, not a rating or a portfolio.
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
        saved
          ? "border-foreground bg-foreground text-background"
          : "border-border text-foreground hover:border-foreground",
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-current")} aria-hidden />
      {saved ? "保存済み" : "保存"}
      <span className="sr-only">：{companyName}</span>
    </button>
  );
}
