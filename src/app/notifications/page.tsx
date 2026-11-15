import type { Metadata } from "next";
import { NotificationsList } from "@/components/engagement/notifications-list";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "フォローした会社の新しい決算（有価証券報告書・半期報告書・決算短信）。フォローはこのブラウザの中だけに残ります。",
  alternates: { canonical: "/notifications" },
  robots: { index: false },
};

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-16 md:px-8 md:pt-16">
      <p className="eyebrow" aria-hidden>Notifications</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">お知らせ</h1>
      <p className="prose-ja mt-3 text-muted-foreground">フォローした会社が新しい決算を出すと、ここに並びます。</p>
      <div className="mt-10">
        <NotificationsList />
      </div>
    </div>
  );
}
