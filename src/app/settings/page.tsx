import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ApplicationSettings } from "@/components/settings/application-settings";
import { ThemeSetting } from "@/components/settings/theme-setting";

export const metadata: Metadata = {
  title: "設定",
  robots: { index: false },
};

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`settings-${eyebrow.toLowerCase()}`} className="border-t border-foreground pt-6 pb-12">
      <p className="eyebrow" aria-hidden>{eyebrow}</p>
      <h2 id={`settings-${eyebrow.toLowerCase()}`} className="mt-2 font-serif text-2xl font-semibold">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>Settings</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[3rem]">設定</h1>

      <div className="mt-12">
        <Section eyebrow="Appearance" title="表示">
          <ThemeSetting />
        </Section>

        <Section eyebrow="Application" title="アプリ">
          <ApplicationSettings />
        </Section>

        <Section eyebrow="Support" title="サポート">
          <ul className="divide-y divide-border border-y border-border">
            {[
              { href: "/report", label: "情報の誤りを報告", note: "掲載内容の誤りや古い情報をお知らせください" },
              { href: "/about", label: "このサービスについて", note: "情報の出典と作り方" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-16 items-center justify-between gap-4 py-4">
                  <span>
                    <span className="block font-medium">{item.label}</span>
                    <span className="block text-sm text-muted-foreground">{item.note}</span>
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
