import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { DIAGNOSIS_URL } from "@/lib/support";
import { L } from "@/components/i18n/label";

export const metadata: Metadata = {
  title: "利用規約",
  description: `${SITE_NAME}の利用規約。サービスの目的、掲載内容の扱い、禁止事項、免責、プレミアムプランの条件の所在。`,
  alternates: { canonical: "/terms-of-use" },
};

/**
 * The terms of use (JCE-054). Short on purpose: what the site is, what a reader may and may not do with it, and what
 * the operator does not promise. /terms is the glossary (用語集), which is why this lives at /terms-of-use.
 */
const SECTIONS: { title: string; body: React.ReactNode }[] = [
  { title: "この規約について", body: <p>{SITE_NAME}（以下「本サイト」）は、YUGENQ（以下「運営者」）が提供しています。本サイトを利用された場合、この規約に同意いただいたものとします。</p> },
  { title: "本サイトの目的", body: <p>本サイトは、国内の証券取引所に上場している会社が「何をしている会社か」を、公開資料をもとに分かりやすく伝える百科事典です。投資・就職その他の判断についての助言や推奨を行うものではありません。</p> },
  {
    title: "掲載内容について",
    body: (
      <p>
        掲載内容は、金融庁 EDINET で公開されている有価証券報告書などをもとに、運営者が編集・加工して作成しています。正確であるよう努めていますが、誤りや古い情報が含まれることがあり、内容の正確性・完全性・最新性を保証するものではありません。重要な判断の前には、各社が公開している原資料をご確認ください。誤りは <Link href="/contact" className="link-ink">お問い合わせ</Link> からお知らせいただけます。
      </p>
    ),
  },
  { title: "禁止すること", body: <p>法令に反する利用、本サイトや第三者の権利を侵害する利用、サーバーに過度の負荷をかける自動取得、掲載内容をまとめて複製して再配布すること、本サイトの運営を妨げる行為は、禁止します。</p> },
  { title: "引用とリンク", body: <p>本サイトへのリンクは自由です。掲載内容を引用するときは、出典として本サイトの名称とページのアドレスを示してください。有価証券報告書そのものの数字は各社と EDINET の公開情報です。</p> },
  {
    title: "プレミアムプラン",
    body: (
      <p>
        有料のプレミアムプランの料金、支払い、解約などの条件は、<a href={`${DIAGNOSIS_URL}tokushoho/`} className="link-ink">特定商取引法に基づく表記</a> と <a href={`${DIAGNOSIS_URL}plan/`} className="link-ink">プランのページ</a> に定めます。学習サービス「分析訓練環境」有料βの条件は、<Link href="/tokushoho" className="link-ink">特定商取引法に基づく表記（有料β）</Link> に定めます。
      </p>
    ),
  },
  { title: "免責", body: <p>運営者は、本サイトの利用または利用できなかったことによって生じた損害について、運営者に故意または重大な過失がある場合を除き、責任を負いません。本サイトは、予告なく内容の変更や提供の中断を行うことがあります。</p> },
  { title: "個人情報", body: <p>情報の扱いは <Link href="/privacy" className="link-ink">プライバシーポリシー</Link> に定めます。</p> },
  { title: "規約の変更", body: <p>この規約は、必要に応じて改定することがあります。改定したときは、このページに改定日を記載します。</p> },
  { title: "準拠法", body: <p>この規約は、日本法に準拠します。</p> },
];

export default function TermsOfUsePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-8 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Terms of Use</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">利用規約</h1>
      <p className="mt-6 text-sm text-muted-foreground">制定日：2026年11月16日</p>
      <ol className="mt-12 border-t border-foreground">
        {SECTIONS.map((section, i) => (
          <li key={section.title} className="grid gap-3 border-b border-border py-8 md:grid-cols-[4rem_1fr]">
            <span className="figures font-display text-xl text-muted-foreground" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-serif text-lg font-semibold"><L s={section.title} /></h2>
              <div className="prose-ja mt-2 text-sm leading-7 text-muted-foreground">{section.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
