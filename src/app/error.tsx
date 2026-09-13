"use client";

/**
 * A designed error state. The raw error is never shown to a reader: it can
 * contain internals, and it cannot help them. The digest lets a report point
 * an operator at the server log entry.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-5 py-24">
      <p className="eyebrow">Error</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold">情報を表示できませんでした。</h1>
      <p className="prose-ja mt-6 text-muted-foreground">もう一度お試しください。</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex min-h-11 w-fit items-center rounded-full bg-foreground px-6 text-sm text-background"
      >
        再読み込み
      </button>
      {error.digest && <p className="figures mt-6 text-xs text-muted-foreground">エラーID: {error.digest}</p>}
    </section>
  );
}
