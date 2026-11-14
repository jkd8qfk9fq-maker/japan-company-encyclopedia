"use client";

import type { DiscoverCard } from "@/lib/discover";

// Not imported from lib/site: that module resolves SITE_URL, which only the server has.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

let feed: Promise<DiscoverCard[]> | null = null;

/** The feed file, fetched once per page load and shared by the feed and the collection. */
export function loadDiscoverFeed(): Promise<DiscoverCard[]> {
  feed ??= fetch(`${BASE_PATH}/discover-feed.json`)
    .then((r) => (r.ok ? (r.json() as Promise<DiscoverCard[]>) : Promise.reject(new Error(String(r.status)))))
    .catch((error) => {
      feed = null; // let a later visit retry instead of keeping the failure
      throw error;
    });
  return feed;
}

/** Today's date in Japan, so the day's order changes at midnight JST for every reader alike. */
export function todayInJapan(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
}

/**
 * The day's order: a shuffle seeded by the date, so everyone sees the same 今日の3社 and a reader who comes back
 * tomorrow meets different companies. Deterministic so it is the same on every reload of the day.
 */
export function dailyOrder<T>(items: readonly T[], day: string): T[] {
  let seed = 0;
  for (const ch of day) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
  const random = () => {
    // mulberry32
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
