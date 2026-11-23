import { NavLink } from "./nav-link";
import { mobileNavigation } from "./navigation-items";

/** Icons always carry a text label: an icon alone is ambiguous for most of these. */
export function BottomNavigation() {
  return (
    <nav
      aria-label="メイン"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {mobileNavigation.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <NavLink
              href={href}
              className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] text-muted-foreground transition-colors"
              activeClassName="text-seal font-semibold after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:rounded-full after:bg-seal"
            >
              <Icon className="size-5" aria-hidden strokeWidth={1.75} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
