import Link from "next/link";
import { AnalyticsSettingsButton } from "@/components/analytics/analytics-consent";
import { featureRepository, termRepository } from "@/lib/repositories";
import { SITE_NAME, SITE_NAME_EN } from "@/lib/site";
import { T } from "@/components/i18n/t";

export async function SiteFooter() {
  const [features, terms] = await Promise.all([featureRepository.list(), termRepository.list()]);

  return (
    <footer className="mt-16 border-t border-border bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-serif text-lg font-semibold tracking-[0.06em]"><T m={{ ja: SITE_NAME, en: SITE_NAME_EN }} /></p>
          <p className="eyebrow mt-1"><T m={{ ja: SITE_NAME_EN, en: SITE_NAME }} /></p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            <T
              m={{
                ja: "掲載情報は有価証券報告書などの公開資料に基づいています。投資の勧誘や助言を目的としたものではありません。",
                en: "Entries are based on public documents such as annual securities reports. Nothing here is an offer or advice to invest.",
              }}
            />
          </p>
          {/* 公共データ利用規約（PDL 1.0）の出典・加工の表示。全文は /about の「データの出典と加工について」（docs/source-terms.md）。 */}
          <p className="mt-3 max-w-sm text-xs leading-6 text-muted-foreground">
            <T m={{ ja: "データの出典：金融庁 EDINET（YUGENQ が編集・加工して作成）。詳しくは", en: "Data source: EDINET, Financial Services Agency of Japan (edited and processed by YUGENQ). See " }} />
            <Link href="/about#data" className="underline underline-offset-2 hover:text-foreground">
              <T m={{ ja: "「このサービスについて」", en: "About this site" }} />
            </Link>
            <T m={{ ja: "。", en: "." }} />
          </p>
        </div>
        <nav aria-label="探す">
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 text-sm">
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/companies"><T m={{ ja: "企業", en: "Companies" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/industries"><T m={{ ja: "業界", en: "Industries" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/prefectures"><T m={{ ja: "本社所在地", en: "Head offices" }} /></Link></li>
            {features.length > 0 && (
              <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/features"><T m={{ ja: "特集", en: "Features" }} /></Link></li>
            )}
            {terms.length > 0 && (
              <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/terms"><T m={{ ja: "用語集", en: "Glossary" }} /></Link></li>
            )}
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/search"><T m={{ ja: "検索", en: "Search" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/screening"><T m={{ ja: "財務で探す", en: "Screener" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/compare"><T m={{ ja: "企業を見比べる", en: "Compare companies" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/rankings"><T m={{ ja: "業界ランキング", en: "Industry rankings" }} /></Link></li>
          </ul>
        </nav>
        <nav aria-label="サポート">
          <p className="eyebrow">Support</p>
          <ul className="mt-4 text-sm">
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/about"><T m={{ ja: "このサービスについて", en: "About this site" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/help"><T m={{ ja: "使い方・よくある質問", en: "Help and FAQ" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/contact"><T m={{ ja: "お問い合わせ・誤りの報告", en: "Contact and error reports" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/terms-of-use"><T m={{ ja: "利用規約", en: "Terms of use" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/tokushoho"><T m={{ ja: "特定商取引法に基づく表記", en: "Legal notice (tokushoho)" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/privacy"><T m={{ ja: "プライバシーポリシー", en: "Privacy policy" }} /></Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:underline" href="/settings"><T m={{ ja: "設定", en: "Settings" }} /></Link></li>
            <AnalyticsSettingsButton />
          </ul>
        </nav>
      </div>
    </footer>
  );
}
