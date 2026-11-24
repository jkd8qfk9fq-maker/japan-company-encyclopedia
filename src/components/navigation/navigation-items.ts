import { Bookmark, BookOpen, Building2, Columns3, Compass, GraduationCap, Home, Inbox, Layers, Library, RotateCcw, Search, Sparkles, type LucideIcon } from "lucide-react";

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
  { href: "/learn", label: "分析訓練", note: "レッスン・今日の1問・決算定期便・復習（専用アプリ）" },
  { href: "/analysis", label: "分析", note: "5観点で読む企業分析" },
  { href: "/network", label: "企業ネットワーク", note: "つながりを立体でたどる" },
  { href: "/rankings", label: "ランキング", note: "業界ごとの規模の順" },
  { href: "/screening", label: "財務で探す", note: "条件で絞り込む" },
  { href: "/prefectures", label: "都道府県", note: "本社所在地から" },
  { href: "/features", label: "特集", note: "読みもの" },
  { href: "/terms", label: "用語集", note: "決算書のことば" },
  { href: "/notifications", label: "お知らせ", note: "フォロー中の会社の更新" },
  { href: "/settings", label: "設定", note: "表示・通知・同期" },
];

/**
 * 分析訓練 (JCE-108): the second pillar beside the encyclopedia, run as its own app on the same origin. These
 * routes take the training app's chrome — its own name in the header and its own bottom bar — so a reader who
 * came to train is not shown the encyclopedia's tabs. Same origin on purpose: the training record lives in this
 * browser's storage, and the questions are built from the same entries.
 */
export const TRAINING_ROOTS = ["/learn", "/quiz", "/digest"];

export function isTrainingPath(pathname: string): boolean {
  return TRAINING_ROOTS.some((root) => isActivePath(pathname, root));
}

/** The training app's bottom bar: the course, the daily question, the week's filings, the review queue, and the way back. */
export const trainingNavigation: NavigationItem[] = [
  { href: "/learn", label: "コース", icon: GraduationCap },
  { href: "/quiz", label: "今日の1問", icon: Sparkles },
  { href: "/digest", label: "定期便", icon: Inbox },
  { href: "/learn/review", label: "復習", icon: RotateCcw },
  { href: "/", label: "百科事典", icon: Library },
];

/** The one item a bar marks as current: the longest href the path is under, so /learn/review is 復習, not コース. */
export function activeHref(pathname: string, items: NavigationItem[]): string | null {
  const matches = items.filter((item) => isActivePath(pathname, item.href) && !(item.href === "/" && pathname !== "/"));
  return matches.sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
