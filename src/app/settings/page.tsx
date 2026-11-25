import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ApplicationSettings } from "@/components/settings/application-settings";
import { SyncPanel } from "@/components/settings/sync-panel";
import { ThemeSetting } from "@/components/settings/theme-setting";
import { LanguageSetting } from "@/components/i18n/language-picker";
import { T } from "@/components/i18n/t";
import type { Message } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "設定",
  robots: { index: false },
};

function Section({ eyebrow, title, children }: { eyebrow: string; title: Message; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`settings-${eyebrow.toLowerCase()}`} className="border-t border-foreground pt-6 pb-12">
      <p className="eyebrow" aria-hidden>{eyebrow}</p>
      <h2 id={`settings-${eyebrow.toLowerCase()}`} className="mt-2 font-serif text-2xl font-semibold"><T m={title} /></h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-5 pb-8 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Settings</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]"><T m={{ ja: "設定", en: "Settings" }} /></h1>

      <div className="mt-12">
        <Section eyebrow="Appearance" title={{ ja: "表示", en: "Display" }}>
          <div className="grid gap-8">
            <LanguageSetting />
            <ThemeSetting />
          </div>
        </Section>

        <Section eyebrow="Application" title={{ ja: "アプリ", en: "App" }}>
          <ApplicationSettings />
        </Section>

        <Section eyebrow="Sync" title={{ ja: "別の端末で引き継ぐ", en: "Move to another device" }}>
          <SyncPanel />
        </Section>

        <Section eyebrow="Support" title={{ ja: "サポート", en: "Support" }}>
          <ul className="divide-y divide-border border-y border-border">
            {[
              { href: "/contact", label: { ja: "お問い合わせ・誤りの報告", en: "Contact and error reports" }, note: { ja: "掲載内容の誤りや古い情報をお知らせください", en: "Tell us about errors or outdated information (in Japanese)" } },
              { href: "/about", label: { ja: "このサービスについて", en: "About this site" }, note: { ja: "情報の出典と作り方", en: "Sources and how entries are made" } },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-16 items-center justify-between gap-4 py-4">
                  <span>
                    <span className="block font-medium"><T m={item.label} /></span>
                    <span className="block text-sm text-muted-foreground"><T m={item.note} /></span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
