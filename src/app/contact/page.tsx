import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactCompanyNote } from "@/components/settings/contact-company-note";
import { companyRepository } from "@/lib/repositories";
import { SITE_NAME } from "@/lib/site";
import { CONTACT_FORM_URL } from "@/lib/support";

export const metadata: Metadata = {
  title: "お問い合わせ・誤りの報告",
  description: `${SITE_NAME}へのお問い合わせ、掲載内容の誤りの報告、ご意見の送り先。`,
  alternates: { canonical: "/contact" },
};

const TOPICS: { title: string; body: string }[] = [
  { title: "掲載内容の誤り", body: "数字・社名・事業の説明・つながりなどの誤りや、古くなった情報。どの企業のどの部分か、正しい内容が分かる資料（有価証券報告書のページなど）があれば、あわせてお知らせください。" },
  { title: "使い方・不具合", body: "ページが表示されない、ボタンが動かない、プレミアムプランが反映されない、など。お使いの端末とブラウザ、起きた画面のアドレスを書いていただけると、早く確かめられます。" },
  { title: "ご意見・ご要望", body: "載せてほしい企業や業界、分かりにくかった説明、あったら便利な機能。" },
  { title: "掲載・取材・広告について", body: "企業のご担当者さまからの掲載内容についてのご連絡、取材、広告のご相談。" },
];

/**
 * The one place a reader can reach the operator (JCE-054). Before this, 「情報の誤りを報告」 pointed at /report, which
 * exists only in the server build — a 404 on the production site, from the footer and from every company page.
 */
export default async function ContactPage() {
  const companies = (await companyRepository.list()).map((c) => ({ id: c.id, name: c.name }));
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Contact</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[2.75rem]">お問い合わせ・誤りの報告</h1>
      <p className="prose-ja mt-4 text-muted-foreground">
        掲載内容は公開資料にもとづいていますが、誤りや古い情報が含まれることがあります。お気づきの点やご意見は、運営者 YUGENQ のフォームからお送りください。
      </p>

      <div className="mt-8">
        <ContactCompanyNote companies={companies} />
      </div>

      <p className="mt-8">
        <a href={CONTACT_FORM_URL} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background">
          お問い合わせフォームを開く
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </p>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Google フォームが別のタブで開きます。フォームに入力した内容は、YUGENQ が確認と返信のためだけに使います（<Link href="/privacy" className="link-ink">プライバシーポリシー</Link>）。
      </p>

      <h2 className="mt-14 font-serif text-xl font-semibold">こんなときにお使いください</h2>
      <ul className="mt-4 border-t border-foreground">
        {TOPICS.map((t) => (
          <li key={t.title} className="border-b border-border py-5">
            <p className="font-medium">{t.title}</p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">{t.body}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 font-serif text-xl font-semibold">送る前に</h2>
      <ul className="prose-ja mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>よくある質問と使い方は <Link href="/help" className="link-ink">使い方・よくある質問</Link> にまとめています。</li>
        <li>誤りの報告は、確かめたうえで修正し、修正の記録を残します。すべての報告に個別の返信をお約束するものではありません。</li>
        <li>個別の企業への投資や就職についてのご相談には、お答えできません。</li>
      </ul>
    </div>
  );
}
