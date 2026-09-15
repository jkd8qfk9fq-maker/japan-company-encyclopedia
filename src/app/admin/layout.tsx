import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "管理", template: "%s｜管理" },
  robots: { index: false, follow: false },
};

/**
 * Shared shell for /admin and /admin/login. Authentication is NOT here — it
 * is in (protected)/layout.tsx, so the login page itself stays reachable.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="mx-auto max-w-6xl px-5 pt-8 pb-8 md:px-8">{children}</div>;
}
