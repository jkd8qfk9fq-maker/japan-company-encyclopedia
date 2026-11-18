import type { Metadata } from "next";
import { MailLinkHandler } from "@/components/engagement/mail-notify";

export const metadata: Metadata = { title: "メールのお知らせ", robots: { index: false } };

/** The page the notification mails link to (JCE-069). Static; the key is read in the browser from the fragment. */
export default function MailNotifyLinkPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-12 pb-16 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Mail</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold">メールのお知らせ</h1>
      <div className="mt-8">
        <MailLinkHandler />
      </div>
    </div>
  );
}
