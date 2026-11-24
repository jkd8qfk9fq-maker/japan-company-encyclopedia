import { Settings } from "lucide-react";
import { NotificationBell } from "@/components/engagement/notification-bell";
import { SearchSuggest } from "@/components/search/search-suggest";
import { featureRepository, termRepository } from "@/lib/repositories";
import { SITE_NAME, SITE_TAGLINE, TRAINING_APP_NAME } from "@/lib/site";
import { HeaderBrand } from "./header-brand";
import { MainNav } from "./main-nav";
import { NavLink } from "./nav-link";
import { SiteMenu } from "./site-menu";
import { desktopNavigation } from "./navigation-items";

/**
 * Name with its 朱 rule, the subjects, a search field, settings. On mobile it carries only the name —
 * navigation lives in the bottom bar, where a thumb can reach it. The search field is a GET form to /search
 * (which reads ?q=) that also suggests as you type once its script has run.
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
        <HeaderBrand siteName={SITE_NAME} tagline={SITE_TAGLINE} appName={TRAINING_APP_NAME} />

        <MainNav items={items.map(({ href, label }) => ({ href, label }))} />

        {/* On phones: the bell and the menu, which lists every page the bottom bar does not (2026-11-23). */}
        <div className="-mr-3 flex items-center md:hidden">
          <NotificationBell />
          <SiteMenu hidden={[...hidden]} />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SearchSuggest id="header-search" variant="header" />
          <NotificationBell />
          <NavLink
            href="/settings"
            className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            <Settings className="size-[1.15rem]" aria-hidden />
            <span className="sr-only">設定</span>
          </NavLink>
          <SiteMenu hidden={[...hidden]} />
        </div>
      </div>
    </header>
  );
}
