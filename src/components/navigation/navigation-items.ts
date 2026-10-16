import { BookOpen, Building2, Home, Layers, Search, Settings, type LucideIcon } from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Desktop exposes the subjects (companies, industries, features) plus search.
 * Mobile swaps Features for Settings: the bottom bar is the only persistent
 * way to reach settings on a phone, and Features is reachable from Home.
 */
export const desktopNavigation: NavigationItem[] = [
  { href: "/companies", label: "企業を探す", icon: Building2 },
  { href: "/industries", label: "業界から探す", icon: Layers },
  { href: "/features", label: "特集", icon: BookOpen },
  { href: "/terms", label: "用語集", icon: BookOpen },
];

export const mobileNavigation: NavigationItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/companies", label: "企業", icon: Building2 },
  { href: "/industries", label: "業界", icon: Layers },
  { href: "/search", label: "検索", icon: Search },
  { href: "/settings", label: "設定", icon: Settings },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
