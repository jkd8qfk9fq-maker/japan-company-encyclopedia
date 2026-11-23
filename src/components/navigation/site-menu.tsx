import Link from "next/link";
import { Menu } from "lucide-react";
import { MENU_ITEMS } from "./navigation-items";

/**
 * The header menu (2026-11-23 redesign): every destination the bottom bar does not carry, by name, in one panel.
 * A <details> disclosure — it opens without JavaScript and closes on the next navigation, since each page
 * renders a fresh header.
 */
export function SiteMenu({ hidden }: { hidden: Set<string> }) {
  const items = MENU_ITEMS.filter((item) => !hidden.has(item.href));
  return (
    <details className="group relative">
      <summary className="flex size-11 cursor-pointer list-none items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        <Menu className="size-5" aria-hidden />
        <span className="sr-only">メニュー</span>
      </summary>
      <nav
        aria-label="すべてのページ"
        className="absolute top-12 right-0 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
      >
        <ul className="grid grid-cols-2 gap-px bg-border">
          {items.map((item) => (
            <li key={item.href} className="bg-popover">
              <Link href={item.href} className="block min-h-14 px-3 py-2 transition-colors hover:bg-muted">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="block text-[0.6875rem] leading-4 text-muted-foreground">{item.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
