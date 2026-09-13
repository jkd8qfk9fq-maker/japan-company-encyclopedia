import Link from "next/link";
import { Search, Settings } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { NavLink } from "./nav-link";
import { desktopNavigation } from "./navigation-items";

/**
 * Visually restrained on purpose: the header should disappear behind the
 * content. On mobile it carries only the name — navigation lives in the
 * bottom bar, where a thumb can reach it.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="font-serif text-[1.05rem] font-semibold tracking-[0.06em] outline-offset-4"
        >
          {SITE_NAME}
        </Link>

        <nav aria-label="メイン" className="hidden items-center gap-1 md:flex">
          {desktopNavigation.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-foreground font-medium"
            >
              {item.label}
            </NavLink>
          ))}
          <span aria-hidden className="mx-2 h-4 w-px bg-border" />
          <NavLink
            href="/search"
            className="flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            <Search className="size-[1.15rem]" aria-hidden />
            <span className="sr-only">検索</span>
          </NavLink>
          <NavLink
            href="/settings"
            className="flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            <Settings className="size-[1.15rem]" aria-hidden />
            <span className="sr-only">設定</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
