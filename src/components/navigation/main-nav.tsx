"use client";

// A Client Component: the desktop header lists the encyclopedia's subjects, or the training app's (JCE-108), by path.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { activeHref, isTrainingPath, trainingNavigation, type NavigationItem } from "./navigation-items";

const linkClass = "inline-flex min-h-11 items-center px-4 text-[0.9375rem] font-medium text-foreground/80 transition-colors hover:text-foreground";
const activeClass = "text-foreground underline decoration-seal decoration-2 underline-offset-[0.7rem]";

export function MainNav({ items }: { items: Pick<NavigationItem, "href" | "label">[] }) {
  const pathname = usePathname();
  if (isTrainingPath(pathname)) {
    const current = activeHref(pathname, trainingNavigation);
    return (
      <nav aria-label="メイン" className="hidden items-center gap-1 lg:flex">
        {trainingNavigation.map((item) => (
          <Link key={item.href} href={item.href} aria-current={current === item.href ? "page" : undefined} className={current === item.href ? `${linkClass} ${activeClass}` : linkClass}>
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }
  return (
    <nav aria-label="メイン" className="hidden items-center gap-1 lg:flex">
      {items.map((item) => (
        <NavLink key={item.href} href={item.href} className={linkClass} activeClassName={activeClass}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
