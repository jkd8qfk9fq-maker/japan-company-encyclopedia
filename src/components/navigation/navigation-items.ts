import type { Message } from "@/lib/i18n";
import { Bookmark, BookOpen, Building2, Columns3, Compass, GraduationCap, Home, Inbox, Layers, Library, RotateCcw, Search, Sparkles, type LucideIcon } from "lucide-react";

export type NavigationItem = {
  href: string;
  /** Every language's name for it (JCE-123), rendered with <T>. */
  label: Message;
  icon: LucideIcon;
};

/**
 * Desktop exposes the subjects (companies, industries, features) plus search.
 * Mobile swaps Features for Settings: the bottom bar is the only persistent
 * way to reach settings on a phone, and Features is reachable from Home.
 * 発見 (JCE-046) is on both: it is where a reader with nothing to look up starts.
 */
export const desktopNavigation: NavigationItem[] = [
  { href: "/discover", label: { ja: "発見", en: "Discover" }, icon: Compass },
  { href: "/companies", label: { ja: "企業を探す", en: "Companies" }, icon: Building2 },
  { href: "/industries", label: { ja: "業界から探す", en: "Industries" }, icon: Layers },
  { href: "/features", label: { ja: "特集", en: "Features" }, icon: BookOpen },
  { href: "/terms", label: { ja: "用語集", en: "Glossary" }, icon: BookOpen },
];

/**
 * Phone bar (2026-11-23 redesign): five places a thumb returns to — home, finding a company, industries, the
 * comparison table, and what the reader kept. 発見・設定・用語集 and the rest move into the header menu
 * (MENU_ITEMS), where every destination is listed with its name.
 */
export const mobileNavigation: NavigationItem[] = [
  { href: "/", label: { ja: "ホーム", en: "Home" }, icon: Home },
  { href: "/search", label: { ja: "企業を探す", en: "Search" }, icon: Search },
  { href: "/industries", label: { ja: "業界", en: "Industries" }, icon: Layers },
  { href: "/compare", label: { ja: "比較", en: "Compare" }, icon: Columns3 },
  { href: "/discover/collection", label: { ja: "保存", en: "Saved" }, icon: Bookmark },
];

/** Everything else, in the header menu on every width (2026-11-23). */
export const MENU_ITEMS: { href: string; label: Message; note: Message }[] = [
  { href: "/companies", label: { ja: "企業一覧", en: "All companies" }, note: { ja: "掲載企業をすべて", en: "Every listed company" } },
  { href: "/discover", label: { ja: "発見", en: "Discover" }, note: { ja: "今日の3社・スワイプで出会う", en: "Today's three, by swipe" } },
  { href: "/learn", label: { ja: "分析訓練", en: "Training" }, note: { ja: "レッスン・今日の1問・決算定期便・復習（専用アプリ）", en: "Lessons, daily question, digest (app)" } },
  { href: "/analysis", label: { ja: "分析", en: "Analysis" }, note: { ja: "5観点で読む企業分析", en: "Companies in five perspectives" } },
  { href: "/network", label: { ja: "企業ネットワーク", en: "Network" }, note: { ja: "つながりを立体でたどる", en: "Follow the ties in 3D" } },
  { href: "/rankings", label: { ja: "ランキング", en: "Rankings" }, note: { ja: "業界ごとの規模の順", en: "By size within each industry" } },
  { href: "/screening", label: { ja: "財務で探す", en: "Screener" }, note: { ja: "条件で絞り込む", en: "Filter by financials" } },
  { href: "/prefectures", label: { ja: "都道府県", en: "Prefectures" }, note: { ja: "本社所在地から", en: "By head office" } },
  { href: "/features", label: { ja: "特集", en: "Features" }, note: { ja: "読みもの", en: "Articles" } },
  { href: "/terms", label: { ja: "用語集", en: "Glossary" }, note: { ja: "決算書のことば", en: "Terms in the filings" } },
  { href: "/notifications", label: { ja: "お知らせ", en: "Updates" }, note: { ja: "フォロー中の会社の更新", en: "From companies you follow" } },
  { href: "/settings", label: { ja: "設定", en: "Settings" }, note: { ja: "表示・通知・同期", en: "Display, notices, sync" } },
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
  { href: "/learn", label: { ja: "コース", en: "Course" }, icon: GraduationCap },
  { href: "/quiz", label: { ja: "今日の1問", en: "Daily question" }, icon: Sparkles },
  { href: "/digest", label: { ja: "定期便", en: "Digest" }, icon: Inbox },
  { href: "/learn/review", label: { ja: "復習", en: "Review" }, icon: RotateCcw },
  { href: "/", label: { ja: "百科事典", en: "Encyclopedia" }, icon: Library },
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
