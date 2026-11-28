import { ExternalLink } from "lucide-react";
import { formatDateJa } from "@/lib/utils/format";
import type { Source } from "@/types/source";
import { T } from "@/components/i18n/t";
import { DocTitle, F } from "@/components/i18n/figure";

/**
 * "出典を見る" — trust without visual weight.
 *
 * A native <details> element: keyboard- and screen-reader-accessible, works
 * with JavaScript disabled and offline, and costs no client bundle. The
 * summary stays small and gray so sources never compete with the content they
 * support, but they are one click from every factual section.
 */
export function SourceList({
  sources,
  sourceIds,
  className,
  variant = "details",
}: {
  sources: Source[];
  /** Show only these. Omit to show every source. */
  sourceIds?: string[];
  className?: string;
  /**
   * "details" (default): the full source cards, folded into a <details> here.
   * "refs" (JCE-094): a one-line reference — the source's number in the page's own 出典一覧
   * (SourceIndex, same `sources` order), linked to its entry there. For pages that carry the
   * full list once at the bottom, so the line "出典を見る" does not repeat under every section.
   * Only for sources that are in that page's index: a tie written in another company's entry
   * rests on that company's sources, which are not in this page's index, and keeps "details".
   * "index": the numbered full list itself — each entry carries the `source-<id>` anchor the
   * "refs" lines point at, in this same order. For pages (features) whose sources have no
   * per-section usage map, unlike the company SourceIndex.
   */
  variant?: "details" | "refs" | "index";
}) {
  const shown = sourceIds
    ? sourceIds
        .map((id) => sources.find((s) => s.id === id))
        .filter((s): s is Source => s !== undefined)
    : sources;
  if (shown.length === 0) return null;

  if (variant === "refs") {
    return (
      <p className={`text-xs leading-6 text-muted-foreground ${className ?? ""}`}>
        <span data-l="ja">出典{" "}
        {shown.map((source) => (
          <a
            key={source.id}
            href={`#source-${source.id}`}
            className="figures mx-0.5 underline-offset-4 hover:text-foreground hover:underline"
          >
            [{sources.indexOf(source) + 1}]
          </a>
        ))}
        <a href="#sources" className="ml-1 underline-offset-4 hover:text-foreground hover:underline">
          <T m={{ ja: "出典一覧", en: "Sources" }} />
        </a></span><span data-l="en">Sources {" "}{shown.map((source) => (
          <a
            key={source.id}
            href={`#source-${source.id}`}
            className="figures mx-0.5 underline-offset-4 hover:text-foreground hover:underline"
          >
            [{sources.indexOf(source) + 1}]
          </a>
        ))}<a href="#sources" className="ml-1 underline-offset-4 hover:text-foreground hover:underline">
          <T m={{ ja: "出典一覧", en: "Sources" }} />
        </a></span>
      </p>
    );
  }

  if (variant === "index") {
    return (
      <ol className={`space-y-5 ${className ?? ""}`}>
        {shown.map((source, i) => (
          <li key={source.id} id={`source-${source.id}`} className="grid scroll-mt-40 grid-cols-[2rem_1fr] gap-x-2">
            <span className="figures pt-0.5 text-sm text-muted-foreground">[{i + 1}]</span>
            <div>
              <p className="leading-7 font-medium"><DocTitle title={source.title} /></p>
              <p className="text-xs leading-5 text-muted-foreground">
                <DocTitle title={source.publisher} />
                {source.publishedAt && <> · <F s={formatDateJa(source.publishedAt)} /></>}
                {" · "}<span data-l="ja">最終確認 <F s={formatDateJa(source.accessedAt)} /></span><span data-l="en">Last checked <F s={formatDateJa(source.accessedAt)} /></span>
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-ink mt-1 inline-flex min-h-8 items-center gap-1 text-xs break-all"
              >
                <span data-l="ja">原文を開く
                <ExternalLink className="size-3" aria-hidden />
                <span className="sr-only"><T m={{ ja: "（新しいタブで開きます）", en: "(opens in a new tab)" }} /></span></span><span data-l="en">Open original<ExternalLink className="size-3" aria-hidden /><span className="sr-only"><T m={{ ja: "（新しいタブで開きます）", en: "(opens in a new tab)" }} /></span></span>
              </a>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const lastAccessed = shown.map((s) => s.accessedAt).sort().at(-1);

  return (
    <details className={`group text-sm ${className ?? ""}`}>
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-muted-foreground transition-colors select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span data-l="ja"><span aria-hidden className="inline-block transition-transform group-open:rotate-90">
          ›
        </span>
        出典を見る
        <span className="figures text-xs"><span data-l="ja">（{shown.length}件）</span><span data-l="en">({shown.length})</span></span></span><span data-l="en"><span aria-hidden className="inline-block transition-transform group-open:rotate-90">
          ›
        </span>View sources<span className="figures text-xs"><span data-l="ja">（{shown.length}件）</span><span data-l="en">({shown.length})</span></span></span>
      </summary>
      <div className="mt-2 border-l border-border pl-4">
        <ol className="space-y-4">
          {shown.map((source) => (
            <li key={source.id}>
              <p className="leading-6 font-medium"><DocTitle title={source.title} /></p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                <DocTitle title={source.publisher} />
                {source.publishedAt && <> · <F s={formatDateJa(source.publishedAt)} /></>}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-ink mt-1 inline-flex min-h-8 items-center gap-1 text-xs break-all"
              >
                <span data-l="ja">原文を開く
                <ExternalLink className="size-3" aria-hidden />
                <span className="sr-only"><T m={{ ja: "（新しいタブで開きます）", en: "(opens in a new tab)" }} /></span></span><span data-l="en">Open original<ExternalLink className="size-3" aria-hidden /><span className="sr-only"><T m={{ ja: "（新しいタブで開きます）", en: "(opens in a new tab)" }} /></span></span>
              </a>
            </li>
          ))}
        </ol>
        {lastAccessed && (
          <p className="figures mt-4 text-xs text-muted-foreground">
            <span data-l="ja">最終確認 <F s={formatDateJa(lastAccessed)} /></span><span data-l="en">Last checked <F s={formatDateJa(lastAccessed)} /></span>
          </p>
        )}
      </div>
    </details>
  );
}
