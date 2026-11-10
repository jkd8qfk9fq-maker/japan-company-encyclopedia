import type { Metadata } from "next";
import Link from "next/link";
import { ADS_ENABLED } from "@/components/ads/ad-slot";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${SITE_NAME}が、利用者のどの情報をどのように扱うか。`,
  alternates: { canonical: "/privacy" },
};

/**
 * What the site actually collects, and nothing it does not (JCE-036): browser-local state (src/lib/storage), reader
 * reports (src/app/report), and — once the operator sets a token — cookieless page counts (layout.tsx). Any new
 * collection (an ad network above all) must be added here before it goes live.
 */
const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "operator",
    title: "運営者",
    body: <p>{SITE_NAME}（以下「本サイト」）は、YUGENQ が運営しています。</p>,
  },
  {
    id: "browser",
    title: "お使いの端末に保存する情報",
    body: (
      <p>
        お気に入りの企業、最近見た企業、表示の設定（ダークモードなど）は、お使いのブラウザの中（localStorage）にだけ保存します。本サイトのサーバーには送られず、運営者が見ることはありません。ブラウザの設定や本サイトの「設定」から、いつでも消せます。
      </p>
    ),
  },
  {
    id: "reports",
    title: "誤りの報告で受け取る情報",
    body: (
      <p>
        「情報の誤りを報告」から送られた内容（対象の企業、報告の種類、本文）は、掲載内容を確かめて直すためだけに使います。報告フォームでは、お名前やメールアドレスはお聞きしていません。短時間の大量送信を防ぐため、送信元のIPアドレスから、もとに戻せない形に変換した識別子を記録します。本文に個人を特定できる情報を書かないでください。
      </p>
    ),
  },
  {
    id: "analytics",
    title: "アクセスの計測",
    body: (
      <p>
        サービスの改善のため、Cloudflare Web Analytics でページの閲覧数などを計測することがあります。この計測は Cookie を使わず、ブラウザに識別子を保存しません。計測の結果は、どのページがどれだけ読まれたかを知るための統計としてだけ使い、個人を特定するためには使いません。
      </p>
    ),
  },
  {
    id: "hosting",
    title: "配信の記録",
    body: (
      <p>
        本サイトは外部の配信サービス（Cloudflare など）を通じて表示しています。配信サービスは、安全の確保と障害対応のために、アクセス元のIPアドレスなどを一定期間記録することがあります。
      </p>
    ),
  },
  {
    id: "ads",
    title: "広告",
    body: (
      ADS_ENABLED ? (
        <>
          <p>
            本サイトは、Google LLC の広告配信サービス「Google AdSense」による広告を掲載しています。Google などの第三者配信事業者は、Cookie を使って、お使いのブラウザでの本サイトや他のサイトへの過去のアクセス情報にもとづいて広告を配信します。
          </p>
          <p>
            パーソナライズ広告は
            <a href="https://adssettings.google.com/" className="link-ink" target="_blank" rel="noopener">
              Google の広告設定
            </a>
            で、第三者配信事業者の Cookie は
            <a href="https://www.aboutads.info/" className="link-ink" target="_blank" rel="noopener">
              www.aboutads.info
            </a>
            で無効にできます。Google による情報の扱いは
            <a href="https://policies.google.com/technologies/ads?hl=ja" className="link-ink" target="_blank" rel="noopener">
              「広告」のページ
            </a>
            をご覧ください。広告の方針は
            <Link href="/about#advertising" className="link-ink">「広告とPR表記について」</Link>
            をご覧ください。
          </p>
        </>
      ) : (
        <p>
          現在、本サイトに広告は掲載しておらず、広告のための Cookie や追跡は行っていません。今後、広告を掲載する場合は、使う広告サービスと、そのサービスが扱う情報をこのページに記載してから始めます。広告の方針は
          <Link href="/about#advertising" className="link-ink">「広告とPR表記について」</Link>
          をご覧ください。
        </p>
      )
    ),
  },
  {
    id: "third-parties",
    title: "第三者への提供",
    body: <p>法令に基づく場合を除き、受け取った情報を第三者に提供しません。</p>,
  },
  {
    id: "changes",
    title: "改定",
    body: <p>扱う情報が変わる場合は、このページを改定し、改定日を記載します。</p>,
  },
  {
    id: "contact",
    title: "お問い合わせ",
    body: (
      <p>
        このポリシーについてのお問い合わせは、
        <a href="https://yugenqjp.netlify.app/contact.html" className="link-ink">
          YUGENQ のお問い合わせフォーム
        </a>
        からお送りください。
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>
        Privacy
      </p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[2.75rem]">プライバシーポリシー</h1>
      <p className="mt-6 text-sm text-muted-foreground">制定日：2026年11月8日</p>
      <ol className="mt-12 border-t border-foreground">
        {SECTIONS.map((section, i) => (
          <li key={section.id} id={section.id} className="grid gap-3 border-b border-border py-8 md:grid-cols-[4rem_1fr]">
            <span className="wordmark figures text-2xl text-muted-foreground" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-serif text-lg font-semibold">{section.title}</h2>
              <div className="prose-ja mt-3">{section.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
