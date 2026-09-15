import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { logout } from "./actions";

// Never prerender: every request must be authenticated at request time.
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/reports", label: "報告" },
  { href: "/admin/companies", label: "企業" },
  { href: "/admin/revisions", label: "改訂履歴" },
];

/**
 * Every admin page renders through this layout, and it refuses anyone without
 * a valid session (redirect to /admin/login). Reading the session cookie makes
 * these pages dynamic: nothing here is prerendered into a public file.
 *
 * The layout is not the only guard — each admin Server Action checks the
 * session again, because actions are reachable by direct POST.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="管理" className="flex gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center px-3 text-sm whitespace-nowrap text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <button type="submit" className="inline-flex min-h-11 items-center px-3 text-sm text-muted-foreground hover:text-foreground">
            ログアウト
          </button>
        </form>
      </div>
      <div className="mt-2 border-t border-border pt-8">{children}</div>
    </>
  );
}
