import type { Metadata } from "next";
import { NotificationsList } from "@/components/engagement/notifications-list";
import { MailNotifyPanel } from "@/components/engagement/mail-notify";
import { PushAllToggle } from "@/components/engagement/push-controls";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "フォローした会社の新しい決算（有価証券報告書・半期報告書・決算短信）。フォローはこのブラウザの中だけに残ります。",
  alternates: { canonical: "/notifications" },
  robots: { index: false },
};

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-16 md:px-8 md:pt-5">
      <p className="eyebrow" aria-hidden>Notifications</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">お知らせ</h1>
      <p className="prose-ja mt-3 text-muted-foreground">フォローした会社が新しい決算を出すと、ここに並びます。</p>
      <div className="mt-10">
        {/* JCE-069: how news reaches the reader. Neither is required — this page lists it either way, to read later. */}
        <section aria-labelledby="receive-heading" className="mb-10">
          <h2 id="receive-heading" className="font-medium">受け取り方</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            どれも選ばなくても、新しい決算はこのページに並び、あとからいつでも確認できます。外にいるときにも知りたい場合は、メールかブラウザの通知を選んでください。
          </p>
          <div className="mt-4 grid gap-3">
            <MailNotifyPanel />
            <PushAllToggle />
          </div>
        </section>
        <NotificationsList />
      </div>
    </div>
  );
}
