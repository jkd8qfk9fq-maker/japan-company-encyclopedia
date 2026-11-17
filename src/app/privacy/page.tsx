import type { Metadata } from "next";
import Link from "next/link";
import { ADS_ENABLED } from "@/components/ads/ad-slot";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/config";
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
        フォローした企業と業界、最近見た企業、DISCOVER で出会った企業（マイ企業図鑑）、会社を知った日（連続日数と実績）、今日の1問の答え、お知らせを見た日、つながりをたどった回数、表示の設定（ダークモードなど）は、お使いのブラウザの中（localStorage）にだけ保存します。本サイトのサーバーには送られず、運営者が見ることはありません。お知らせは、全員に同じ「最近の決算の一覧」を読み込み、フォロー中の企業との照合をブラウザの中で行います。ブラウザの設定や本サイトの「設定」から、いつでも消せます。
      </p>
    ),
  },
  {
    id: "reports",
    title: "お問い合わせ・誤りの報告で受け取る情報",
    body: (
      <p>
        <Link href="/contact" className="link-ink">お問い合わせ・誤りの報告</Link>
        は、Google フォームで受け付けています。フォームに入力された内容（対象の企業、本文、ご記入いただいた場合は連絡先）は、掲載内容を確かめて直すこと、およびご連絡への返信のためだけに使います。フォームでの情報の扱いには、Google のプライバシーポリシーも適用されます。
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
  // Shown only once Google Analytics is switched on (GA_MEASUREMENT_ID), so the page never says more or less than the
  // site does (JCE-036, JCE-056).
  ...(GA_MEASUREMENT_ID
    ? [
        {
          id: "google-analytics",
          title: "Google アナリティクス（同意した場合のみ）",
          body: (
            <>
              <p>
                利用者が「同意する」を選んだ場合にだけ、Google LLC の「Google アナリティクス」を使って、利用状況（利用者数、閲覧したページ、どこから来たか、使っている端末など）の統計を取ります。目的は、本サイトと関連サイトの改善です。「同意しない」を選んでも、本サイトのすべての機能をお使いいただけます。
              </p>
              <p className="mt-3">
                送信先は Google LLC です。送信される情報は、Cookie（_ga など）に保存されるブラウザごとのランダムなID、閲覧したページのアドレス（パスと、流入元を示す utm_ で始まる値のみ）、参照元、ページの題名、端末・ブラウザの種類、画面の大きさ、言語、IPアドレスから推定されるおおよその地域、操作の名前（「プランの申し込みを始めた」のみ）です。検索した言葉や、アドレスの「#」以降は送りません。送る前に本サイトのスクリプトが確かめ、それらが含まれる送信は止めます。広告のための利用（Google シグナル、広告のパーソナライズ）は行いません。
              </p>
              <p className="mt-3">
                同意の選択は、Cookie（yugenq_consent_ga）に1年間保存し、関連サイト（企業タイプ診断、最初の一社）と共有します。ページ下の「閲覧統計の設定」から、いつでも取り消せます（Google アナリティクスの Cookie も消します）。Google が提供する
                <a href="https://tools.google.com/dlpage/gaoptout?hl=ja" className="link-ink" rel="noopener noreferrer">
                  オプトアウト アドオン
                </a>
                でも止められます。Google による情報の扱いは
                <a href="https://policies.google.com/technologies/partner-sites?hl=ja" className="link-ink" rel="noopener noreferrer">
                  Google のサービスを使用するサイトやアプリから収集した情報の Google による使用
                </a>
                をご覧ください。
              </p>
            </>
          ),
        },
      ]
    : []),
  {
    id: "push",
    title: "決算・更新の通知（選んだ場合のみ）",
    body: (
      <>
        <p>
          フォローした会社について「決算・更新の通知を受け取る」を選んだ場合に限り、その会社が新しい決算データを公開したことを、お使いのブラウザに通知します。通知の文面は「〇〇の新しい決算データが公開されました」といった事実だけです。
        </p>
        <p className="mt-3">
          そのために、ブラウザが発行する通知の宛先（ブラウザの提供元のプッシュサービスのアドレス）と、通知の中身を暗号化するための鍵2つ、通知を受け取る会社のIDを、Cloudflare, Inc. のデータベースに保存します。IPアドレス、お名前、メールアドレスなど、どなたかを特定する情報は保存しません。通知はブラウザの提供元（Google、Mozilla、Apple、Microsoft など）のプッシュサービスを通じて届き、中身は暗号化されているため、プッシュサービスは内容を読めません。
        </p>
        <p className="mt-3">
          お知らせのページの「通知をすべて止める」、または会社のフォローを外すと、その場で削除します。ブラウザが宛先を無効にした場合と、180日間ご利用がない場合も削除します。
        </p>
      </>
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
        <Link href="/contact" className="link-ink">
          お問い合わせ
        </Link>
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
      <p className="mt-6 text-sm text-muted-foreground">制定日：2026年11月8日 / 改定日：2026年11月16日（お問い合わせの受け付け方法）</p>
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
