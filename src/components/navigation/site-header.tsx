import Link from "next/link";
import { Search, Settings } from "lucide-react";
import { featureRepository, termRepository } from "@/lib/repositories";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { NavLink } from "./nav-link";
import { desktopNavigation } from "./navigation-items";

/**
 * Name with its 朱 rule, the subjects, a search field, settings. On mobile it carries only the name —
 * navigation lives in the bottom bar, where a thumb can reach it. The search field is a plain GET
 * form to /search (which reads ?q=), so the header needs no JavaScript.
 */
export async function SiteHeader() {
  // A top-level item that leads to an empty page is a dead end (review P3-4):
  // 特集 and 用語集 appear once there is something to read.
  const [features, terms] = await Promise.all([featureRepository.list(), termRepository.list()]);
  const hidden = new Set([...(features.length > 0 ? [] : ["/features"]), ...(terms.length > 0 ? [] : ["/terms"])]);
  const items = desktopNavigation.filter((item) => !hidden.has(item.href));

  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="seal-mark flex flex-col py-1 leading-tight outline-offset-4">
          <span className="font-serif text-[1.25rem] font-semibold tracking-[0.08em] md:text-[1.5rem]">{SITE_NAME}</span>
          <span className="hidden text-xs text-muted-foreground md:block">{SITE_TAGLINE}</span>
        </Link>

        <nav aria-label="メイン" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center px-4 text-[0.9375rem] font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeClassName="text-foreground underline decoration-seal decoration-2 underline-offset-[0.7rem]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <form action="/search" role="search" className="relative">
            <label htmlFor="header-search" className="sr-only">
              企業名・証券コード・業界で検索
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="企業名・証券コード・業界で検索"
              className="h-11 w-56 border border-input bg-card pr-3 pl-9 text-sm outline-offset-2 placeholder:text-muted-foreground lg:w-72"
            />
          </form>
          <NavLink
            href="/settings"
            className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            <Settings className="size-[1.15rem]" aria-hidden />
            <span className="sr-only">設定</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
