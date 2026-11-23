import type { Metadata } from "next";
import { MailLinkHandler } from "@/components/engagement/mail-notify";

export const metadata: Metadata = { title: "メールのお知らせ", robots: { index: false } };

/** The page the notification mails link to (JCE-069). Static; the key is read in the browser from the fragment. */
export default function MailNotifyLinkPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-5 pb-16 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Mail</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">メールのお知らせ</h1>
      <div className="mt-8">
        <MailLinkHandler />
      </div>
    </div>
  );
}
