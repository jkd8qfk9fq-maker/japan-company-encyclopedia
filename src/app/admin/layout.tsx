import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: { default: "管理", template: "%s｜管理" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/companies", label: "企業" },
  { href: "/admin/reports", label: "報告" },
  { href: "/admin/revisions", label: "改訂履歴" },
];

/**
 * Operational, not decorative. READ-ONLY by design until the operator decides
 * how a correction reaches readers (docs/decisions.md, JCE-009): an editor that
 * changed only the editor's own copy would show a correction as published when
 * it is not. It has no authentication, so production builds 404 it unless
 * ENABLE_ADMIN=true (see the guard below).
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Fail closed (review F-05): there is no authentication yet, so a production
  // build serves /admin only when explicitly enabled. Before enabling it on any
  // public host, add authentication — required anyway for JCE-009 option (b).
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_ADMIN !== "true") notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 pb-8 md:px-8">
      <div className="rounded-md border border-border bg-paper px-4 py-3 text-sm leading-6 text-muted-foreground">
        管理画面は現在<strong className="font-semibold text-foreground">読み取り専用</strong>です。訂正を読者に反映する方法（Gitベースか、データベースか）が未決定のため、編集機能はまだありません。
      </div>
      <nav aria-label="管理" className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
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
      <div className="pt-8">{children}</div>
    </div>
  );
}
