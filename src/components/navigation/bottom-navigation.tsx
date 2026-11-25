"use client";

// A Client Component: which bar it shows — the encyclopedia's or the training app's (JCE-108) — depends on the path.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { T } from "@/components/i18n/t";
import { activeHref, isTrainingPath, mobileNavigation, trainingNavigation } from "./navigation-items";

/** Icons always carry a text label: an icon alone is ambiguous for most of these. */
export function BottomNavigation() {
  const pathname = usePathname();
  const items = isTrainingPath(pathname) ? trainingNavigation : mobileNavigation;
  const current = activeHref(pathname, items);
  return (
    <nav
      aria-label="メイン"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={current === href ? "page" : undefined}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] text-muted-foreground transition-colors",
                current === href && "text-seal font-semibold after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:rounded-full after:bg-seal",
              )}
            >
              <Icon className="size-5" aria-hidden strokeWidth={1.75} />
              <span><T m={label} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
