import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { T } from "@/components/i18n/t";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { ANALYTICS_TOKEN, BASE_PATH, OG_IMAGES, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { localeCss } from "@/lib/i18n";
import { THEME_SCRIPT } from "@/lib/storage/theme-script";
import "./globals.css";
import { AnalyticsConsent } from "@/components/analytics/analytics-consent";
import { ThemeSync } from "@/components/settings/theme-setting";
import { MailSync } from "@/components/engagement/mail-notify";
import { PushSync } from "@/components/engagement/push-controls";

/*
 * Three faces, three jobs:
 *   Noto Sans JP  — reading and interface
 *   Noto Serif JP — Japanese headlines; the encyclopedia/editorial register
 *   Bodoni Moda   — Latin wordmarks (TOYOTA, JAPANESE COMPANIES); the magazine register
 * Japanese glyphs are served in unicode-range slices, so a page downloads only
 * the characters it uses. Preload is limited to Latin for the same reason.
 */
const sans = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

const serif = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const display = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: BASE_PATH ? new URL(`${BASE_PATH}/`, SITE_URL) : SITE_URL,
  title: {
    default: SITE_NAME,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  icons: {
    icon: [{ url: `${BASE_PATH}/icons/icon.svg`, type: "image/svg+xml" }],
    apple: `${BASE_PATH}/icons/apple-touch-icon.png`,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ja_JP",
    // One share image for every page (JCE-054): without it a shared link showed no picture at all.
    images: OG_IMAGES,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  // Google AdSense's site-ownership check (JCE-039). A claim of the site only: it loads no script and shows no ad.
  other: { "google-adsense-account": "ca-pub-6016615044830350" },
};

export const viewport: Viewport = {
  // The house theme is dark (2026-11-23): the browser chrome takes its navy whatever the OS setting.
  themeColor: "#0f1626",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${display.variable} antialiased`}
    >
      <head>
        {/* Sets the theme class before first paint, so a dark-mode reader never sees a white flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Shows the reader's language and hides the others (JCE-123); the script above sets data-lang. */}
        <style dangerouslySetInnerHTML={{ __html: localeCss() }} />
      </head>
      <body className="flex min-h-dvh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {/* Re-applies the stored theme after hydration, in case the class the script above set is dropped. */}
        <ThemeSync />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          <T m={{ ja: "本文へ移動", en: "Skip to content" }} />
        </a>
        <SiteHeader />
        <OfflineIndicator />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BottomNavigation />
        <ServiceWorkerRegistration />
        <PushSync />
        <MailSync />
        <AnalyticsConsent />
        {ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: ANALYTICS_TOKEN })}
          />
        )}
      </body>
    </html>
  );
}
