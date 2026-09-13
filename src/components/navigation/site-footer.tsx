import Link from "next/link";
import { SITE_NAME, SITE_NAME_EN } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-serif text-lg font-semibold tracking-[0.06em]">{SITE_NAME}</p>
          <p className="eyebrow mt-1">{SITE_NAME_EN}</p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            掲載情報は有価証券報告書などの公開資料に基づいています。投資の勧誘や助言を目的としたものではありません。
          </p>
        </div>
        <nav aria-label="探す">
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:underline" href="/companies">企業</Link></li>
            <li><Link className="hover:underline" href="/industries">業界</Link></li>
            <li><Link className="hover:underline" href="/features">特集</Link></li>
            <li><Link className="hover:underline" href="/search">検索</Link></li>
          </ul>
        </nav>
        <nav aria-label="サポート">
          <p className="eyebrow">Support</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:underline" href="/about">このサービスについて</Link></li>
            <li><Link className="hover:underline" href="/report">情報の誤りを報告</Link></li>
            <li><Link className="hover:underline" href="/settings">設定</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
