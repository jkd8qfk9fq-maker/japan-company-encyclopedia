import { Bookmark, BookOpen, Building2, Columns3, Compass, Home, Layers, Search, type LucideIcon } from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Desktop exposes the subjects (companies, industries, features) plus search.
 * Mobile swaps Features for Settings: the bottom bar is the only persistent
 * way to reach settings on a phone, and Features is reachable from Home.
 * 発見 (JCE-046) is on both: it is where a reader with nothing to look up starts.
 */
export const desktopNavigation: NavigationItem[] = [
  { href: "/discover", label: "発見", icon: Compass },
  { href: "/companies", label: "企業を探す", icon: Building2 },
  { href: "/industries", label: "業界から探す", icon: Layers },
  { href: "/features", label: "特集", icon: BookOpen },
  { href: "/terms", label: "用語集", icon: BookOpen },
];

/**
 * Phone bar (2026-11-23 redesign): five places a thumb returns to — home, finding a company, industries, the
 * comparison table, and what the reader kept. 発見・設定・用語集 and the rest move into the header menu
 * (MENU_ITEMS), where every destination is listed with its name.
 */
export const mobileNavigation: NavigationItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/search", label: "企業を探す", icon: Search },
  { href: "/industries", label: "業界", icon: Layers },
  { href: "/compare", label: "比較", icon: Columns3 },
  { href: "/discover/collection", label: "保存", icon: Bookmark },
];

/** Everything else, in the header menu on every width (2026-11-23). */
export const MENU_ITEMS: { href: string; label: string; note: string }[] = [
  { href: "/companies", label: "企業一覧", note: "掲載企業をすべて" },
  { href: "/discover", label: "発見", note: "今日の3社・スワイプで出会う" },
  { href: "/learn", label: "学習", note: "有報の読み方入門" },
  { href: "/analysis", label: "分析", note: "5観点で読む企業分析" },
  { href: "/digest", label: "決算定期便", note: "今週の開示" },
  { href: "/network", label: "企業ネットワーク", note: "つながりを立体でたどる" },
  { href: "/rankings", label: "ランキング", note: "業界ごとの規模の順" },
  { href: "/screening", label: "財務で探す", note: "条件で絞り込む" },
  { href: "/prefectures", label: "都道府県", note: "本社所在地から" },
  { href: "/features", label: "特集", note: "読みもの" },
  { href: "/terms", label: "用語集", note: "決算書のことば" },
  { href: "/notifications", label: "お知らせ", note: "フォロー中の会社の更新" },
  { href: "/settings", label: "設定", note: "表示・通知・同期" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
