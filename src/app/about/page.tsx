import type { Metadata } from "next";
import { ADS_ENABLED } from "@/components/ads/ad-slot";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "このサービスについて",
  description: `${SITE_NAME}が何を目指し、どのように情報をつくっているか。`,
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    title: "何をしている会社かを、最初に。",
    body: "企業ページは、会社名・一文の説明・事業構造の順に並んでいます。数秒で「何の会社か」がわかることを、いちばん大切にしています。",
  },
  {
    title: "出典のない事実は載せません。",
    body: "事業の説明、売上・利益の数値、歴史は、有価証券報告書や決算短信、各社の公式資料に基づいています。各項目の「出典を見る」から、元の資料を確認できます。確認できなかった情報は、推測で埋めずに空欄のままにしています。",
  },
  {
    title: "AIが作成し、公開後も直します。",
    body: "掲載内容はAIが公開資料を読み取って作成しています。誤りが見つかった場合は資料を確認して訂正し、訂正の記録を残します。",
  },
  {
    title: "投資の判断材料ではありません。",
    body: "株価や投資指標は扱いません。売上と利益は、会社の規模と事業を理解するための手がかりとして掲載しています。投資の勧誘や助言を目的としたものではありません。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>About</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[2.75rem]">このサービスについて</h1>
      <p className="mt-8 text-[1.25rem] leading-[1.9] md:text-[1.5rem]">
        {SITE_NAME}は、日本の上場企業を、会社名ではなく「何をしている会社なのか」から理解するための百科事典です。
      </p>

      <ol className="mt-16 border-t border-foreground">
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className="grid gap-3 border-b border-border py-10 md:grid-cols-[4rem_1fr]">
            <span className="wordmark figures text-3xl text-muted-foreground" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-serif text-xl font-semibold">{p.title}</h2>
              <p className="prose-ja mt-3">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 公共データ利用規約（PDL 1.0）が求める表示：提供元と URL、規約の名称と原文の URL、編集・加工したことと
          その主体、国が作成したものそのものではないこと。文言は docs/source-terms.md の案A（JCE-036）。 */}
      <section id="data" aria-labelledby="data-heading" className="mt-16 scroll-mt-28">
        <h2 id="data-heading" className="font-serif text-xl font-semibold">データの出典と加工について</h2>
        <div className="prose-ja mt-4 space-y-4">
          <p>
            このサイトの企業データは、金融庁の EDINET（
            <a href="https://disclosure2.edinet-fsa.go.jp/" className="link-ink">EDINET閲覧（提出）サイト</a>
            ）で公開されている有価証券報告書などをもとに、運営者名 YUGENQ が編集・加工して作成したものです。国（金融庁）が作成したものそのものではなく、国が内容を保証するものでもありません。各項目の「出典を見る」から、もとの書類を確認できます。
          </p>
          <p>
            旧社名やブランド名など、有価証券報告書に書かれていない背景の一部は、日本語版ウィキペディアを補助的に参照し、自分の言葉で書いています。参照した項目には、出典としてその記事を示しています。
          </p>
          <p className="text-sm text-muted-foreground">
            出典：<a href="https://disclosure2.edinet-fsa.go.jp/" className="link-ink">EDINET閲覧（提出）サイト</a>、
            <a href="https://www.digital.go.jp/resources/open_data/public_data_license_v1.0" className="link-ink">
              公共データ利用規約（第1.0版）
            </a>
            <br />
            運営者名：YUGENQ
          </p>
        </div>
      </section>

      {/* 広告・PR の扱い（JCE-036）。広告はまだ載せていないが、載せる前に方針を公開しておく。 */}
      <section id="advertising" aria-labelledby="advertising-heading" className="mt-16 scroll-mt-28">
        <h2 id="advertising-heading" className="font-serif text-xl font-semibold">広告とPR表記について</h2>
        <div className="prose-ja mt-4 space-y-4">
          <p>
            {ADS_ENABLED
              ? "このサイトは Google AdSense による広告を掲載しています（扱う情報はプライバシーポリシーをご覧ください）。広告は次の方針に従います。"
              : "現在、このサイトに広告は掲載していません。今後掲載する場合は、次の方針に従います。"}
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>広告・アフィリエイトリンク・広告主の依頼による記事には、すべて「広告」または「PR」と明示します。</li>
            <li>企業の一文の説明、事業構造、ビジネスモデル、財務、沿革の中や、記述とその出典の間には広告を置きません。</li>
            <li>広告主の依頼や報酬によって、企業の解説の内容や掲載の順番を変えることはありません。</li>
            <li>証券口座の開設や金融商品の購入を勧める広告・アフィリエイトは掲載しません。</li>
          </ul>
        </div>
      </section>

      <p className="mt-16 text-muted-foreground">
        誤りを見つけた場合は、<Link href="/report" className="link-ink">情報の誤りを報告</Link>からお知らせください。
        個人情報の扱いは<Link href="/privacy" className="link-ink">プライバシーポリシー</Link>をご覧ください。
      </p>
    </div>
  );
}
