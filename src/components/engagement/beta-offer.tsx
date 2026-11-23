import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** The paid beta's Stripe Payment Link (created 2026-11-22; entitlement is granted by hand, JCE-087). */
export const BETA_PAYMENT_URL = "https://buy.stripe.com/aFa14ndejgJt5Cq38NgnK00";

/**
 * The paid beta offer on /learn (JCE-087). The expert review of the financial-regulation questions is done
 * (operator report, 2026-11-22), so the enrolment path opens: a Stripe Payment Link, with the terms stated
 * on /tokushoho. The copy is kept exact about the boundary that matters — the learning itself stays free,
 * the beta adds the digest by mail and early word of new features, and nothing here is investment advice.
 * No gate is wired to this payment itself: enrolment is confirmed by hand. (JCE-101 later opened the
 * analysis layer on the JCE-100 entitlement record; a beta subscription recorded there is a code like
 * any other, but this offer's terms — price, measurement window, gates — are unchanged by that.)
 */
export function BetaOffer() {
  return (
    <section aria-label="有料βのご案内" className="mt-10 rounded-md border border-foreground/25 bg-card p-5 md:p-6">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">有料β（先行）</p>
      <h2 className="mt-2 font-serif text-[1.375rem] font-semibold">分析訓練環境 有料βのご案内</h2>
      <p className="prose-ja mt-2 text-sm leading-7 text-muted-foreground">
        学習サービス「分析訓練環境」の有料βを開始しました。βでは、決算定期便をメールでもお届けし、新しい機能やレッスンを先行してご案内します。お申し込みを確認でき次第、メール配信先に登録します。
      </p>
      <p className="prose-ja mt-2 text-sm leading-7 text-muted-foreground">
        このページのマイクロレッスン、企業ページでの予測と照合、決算定期便のページなど、学習の機能は引き続き無料で使えます。有料βは、その訓練を続けるための定期便と先行案内の申し込みです。
      </p>
      <p className="mt-4">
        <span className="font-serif text-[1.5rem] font-semibold">月額1,100円</span>
        <span className="ml-2 text-sm text-muted-foreground">（税込）／いつでも解約できます</span>
      </p>
      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={BETA_PAYMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          申し込む（Stripeの決済ページへ）
          <ArrowRight className="size-4" aria-hidden />
        </a>
        <Link href="/tokushoho" className="text-sm underline underline-offset-4">
          特定商取引法に基づく表記
        </Link>
      </p>
      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        ※βは開発中のサービスです。機能の追加・変更があります。
        <br />
        ※本サービスは投資助言ではありません。個別銘柄の売買判断はご自身の責任でお願いします。
      </p>
    </section>
  );
}
