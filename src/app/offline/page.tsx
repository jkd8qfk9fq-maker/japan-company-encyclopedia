import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "オフライン",
  robots: { index: false },
};

/** Served by the service worker when a page was never opened while online. */
export default function OfflinePage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-5 py-24">
      <p className="eyebrow">Offline</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold">このページはまだ保存されていません。</h1>
      <p className="prose-ja mt-6 text-muted-foreground">
        インターネットに接続されていないため、表示できません。一度開いたページは、オフラインでも読むことができます。
      </p>
      <Link href="/" className="link-ink mt-8 inline-flex min-h-11 items-center">
        ホームに戻る
      </Link>
    </section>
  );
}
