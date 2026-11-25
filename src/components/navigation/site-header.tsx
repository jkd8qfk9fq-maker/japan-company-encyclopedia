import { Settings } from "lucide-react";
import { NotificationBell } from "@/components/engagement/notification-bell";
import { LanguageMenu } from "@/components/i18n/language-picker";
import { T } from "@/components/i18n/t";
import { SearchSuggest } from "@/components/search/search-suggest";
import { featureRepository, termRepository } from "@/lib/repositories";
import { LANGUAGE_NOTE } from "@/lib/i18n";
import { SITE_NAME, SITE_NAME_EN, SITE_TAGLINE, SITE_TAGLINE_EN, TRAINING_APP_NAME } from "@/lib/site";
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
    <>
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8 2xl:gap-6">
        <HeaderBrand siteName={SITE_NAME} siteNameEn={SITE_NAME_EN} tagline={SITE_TAGLINE} taglineEn={SITE_TAGLINE_EN} appName={TRAINING_APP_NAME} />

        <MainNav items={items.map(({ href, label }) => ({ href, label }))} />

        {/* On phones: the bell and the menu, which lists every page the bottom bar does not (2026-11-23). */}
        <div className="-mr-3 flex items-center md:hidden">
          <NotificationBell />
          <LanguageMenu />
          <SiteMenu hidden={[...hidden]} />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SearchSuggest id="header-search" variant="header" />
          <NotificationBell />
          <LanguageMenu />
          <NavLink
            href="/settings"
            className="flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            <Settings className="size-[1.15rem]" aria-hidden />
            <span className="sr-only"><T m={{ ja: "設定", en: "Settings" }} /></span>
          </NavLink>
          <SiteMenu hidden={[...hidden]} />
        </div>
      </div>
    </header>
    {/* For a reader of another language: what is and is not translated (JCE-123). Shown only while a language other
        than Japanese is chosen; outside the sticky header so it scrolls away and the header keeps its height. */}
    <p className="hidden border-b border-border/70 bg-paper px-5 py-1.5 text-center text-[0.6875rem] leading-4 text-muted-foreground md:px-8 [html[data-lang]_&]:block">
      <T m={LANGUAGE_NOTE} />
    </p>
    </>
  );
}
