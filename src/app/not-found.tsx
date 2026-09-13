import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-5 py-24">
      <p className="eyebrow">Not Found</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold">ページが見つかりませんでした。</h1>
      <p className="prose-ja mt-6 text-muted-foreground">
        お探しの企業やページは、まだ掲載されていないか、アドレスが変わった可能性があります。
      </p>
      <div className="mt-8 flex flex-wrap gap-6">
        <Link href="/companies" className="link-ink inline-flex min-h-11 items-center">企業一覧へ</Link>
        <Link href="/search" className="link-ink inline-flex min-h-11 items-center">検索する</Link>
      </div>
    </section>
  );
}
