"use client";

// A Client Component: the menu must close itself when the reader moves to another page. The header stays mounted
// across client navigations, so a plain <details> stayed open on the new page (operator report, 2026-11-23).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useRef } from "react";
import { MENU_ITEMS } from "./navigation-items";
import { T } from "@/components/i18n/t";

/**
 * The header menu (JCE-099): every destination the bottom bar does not carry, by name, in one panel. Still a
 * <details> disclosure, so it opens before any script has run; once hydrated it closes on navigation, on a tap
 * outside it, and on Escape.
 */
export function SiteMenu({ hidden }: { hidden: string[] }) {
  const items = MENU_ITEMS.filter((item) => !hidden.includes(item.href));
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (event: Event) => {
      const menu = ref.current;
      if (!menu?.open) return;
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !menu.contains(event.target as Node)) menu.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <details ref={ref} className="group relative">
      <summary className="flex size-11 cursor-pointer list-none items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        <Menu className="size-5" aria-hidden />
        <span className="sr-only"><T m={{ ja: "メニュー", en: "Menu" }} /></span>
      </summary>
      <nav
        aria-label="すべてのページ"
        className="absolute top-12 right-0 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
      >
        <ul className="grid grid-cols-2 gap-px bg-border">
          {items.map((item) => (
            <li key={item.href} className="bg-popover">
              <Link
                href={item.href}
                onClick={() => {
                  // Same-page links do not change the pathname; close on the tap itself as well.
                  if (ref.current) ref.current.open = false;
                }}
                className="block min-h-14 px-3 py-2 transition-colors hover:bg-muted"
              >
                <span className="block text-sm font-semibold"><T m={item.label} /></span>
                <span className="block text-[0.6875rem] leading-4 text-muted-foreground"><T m={item.note} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
