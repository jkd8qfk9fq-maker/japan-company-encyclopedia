import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import { L } from "@/components/i18n/label";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: `${SITE_NAME}の学習サービス「分析訓練環境」有料βについての、特定商取引法に基づく表記。販売事業者、価格、支払い、解約と返金の条件。`,
  alternates: { canonical: "/tokushoho" },
};

/**
 * The 特定商取引法 disclosure for the encyclopedia's own paid offer — the learning service's paid beta
 * (JCE-087). The operator details match the diagnosis site's existing disclosure
 * (shindan.kigyo-hyakka.com/tokushoho/): the same operator, YUGENQ, with address and phone disclosed
 * without delay on request. The 390-yen diagnosis premium plan keeps its own disclosure on the diagnosis
 * site; this page covers only the beta, and says so, so the two are never confused.
 */
const ROWS: { label: string; body: React.ReactNode }[] = [
  { label: "販売事業者", body: <p>YUGENQ</p> },
  { label: "運営統括責任者", body: <p>LEO SUGIMOTO</p> },
  { label: "所在地", body: <p>請求があった場合は、遅滞なく開示します。</p> },
  { label: "電話番号", body: <p>請求があった場合は、遅滞なく開示します。</p> },
  { label: "メールアドレス", body: <p>yugenqjp@gmail.com</p> },
  {
    label: "販売価格",
    body: (
      <p>
        月額1,100円（税込）
        <br />
        <span className="text-muted-foreground">学習サービス「分析訓練環境」有料βの料金です。企業タイプ診断のプレミアムプラン（月額390円）の表記は、診断サイトにあります。</span>
      </p>
    ),
  },
  { label: "商品代金以外の必要料金", body: <p>インターネットの接続料金・通信料金は、お客様のご負担です。</p> },
  { label: "支払方法", body: <p>クレジットカード（決済は Stripe を通じて行います）</p> },
  { label: "支払時期", body: <p>お申し込み時に初回分を請求し、以後は1か月ごとに自動で更新・請求します。</p> },
  { label: "提供時期", body: <p>決済の完了後、ただちにご利用いただけます。決算定期便のメール配信は、運営が申し込みを確認し、配信先への登録が完了し次第、開始します。</p> },
  { label: "解約", body: <p>いつでも解約できます。解約後は、次回更新日以降の課金を行いません（日割り返金は行いません）。解約の連絡は、上記のメールアドレスまでお願いします。</p> },
  {
    label: "返金",
    body: (
      <p>
        デジタルサービスの性質上、提供開始後の返金は行いません。ただし、当方の責めに帰すべき事由でサービスを提供できなかった場合は、この限りではありません。
      </p>
    ),
  },
];

export default function TokushohoPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-8 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Legal</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">特定商取引法に基づく表記</h1>
      <p className="prose-ja mt-6 text-sm leading-7 text-muted-foreground">
        学習サービス「分析訓練環境」有料βについての表記です。
      </p>
      <dl className="mt-10 border-t border-foreground">
        {ROWS.map((row) => (
          <div key={row.label} className="grid gap-1.5 border-b border-border py-6 md:grid-cols-[12rem_1fr] md:gap-6">
            <dt className="font-serif text-[0.9375rem] font-semibold"><L s={row.label} /></dt>
            <dd className="prose-ja text-sm leading-7 text-muted-foreground">{row.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
