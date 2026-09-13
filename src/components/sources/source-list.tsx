import { ExternalLink } from "lucide-react";
import { formatDateJa } from "@/lib/utils/format";
import type { Source } from "@/types/source";

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
}: {
  sources: Source[];
  /** Show only these. Omit to show every source. */
  sourceIds?: string[];
  className?: string;
}) {
  const shown = sourceIds
    ? sourceIds
        .map((id) => sources.find((s) => s.id === id))
        .filter((s): s is Source => s !== undefined)
    : sources;
  if (shown.length === 0) return null;

  const lastAccessed = shown.map((s) => s.accessedAt).sort().at(-1);

  return (
    <details className={`group text-sm ${className ?? ""}`}>
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-muted-foreground transition-colors select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block transition-transform group-open:rotate-90">
          ›
        </span>
        出典を見る
        <span className="figures text-xs">（{shown.length}件）</span>
      </summary>
      <div className="mt-2 border-l border-border pl-4">
        <ol className="space-y-4">
          {shown.map((source) => (
            <li key={source.id}>
              <p className="leading-6 font-medium">{source.title}</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {source.publisher}
                {source.publishedAt && <> · {formatDateJa(source.publishedAt)}</>}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-ink mt-1 inline-flex min-h-8 items-center gap-1 text-xs break-all"
              >
                原文を開く
                <ExternalLink className="size-3" aria-hidden />
                <span className="sr-only">（新しいタブで開きます）</span>
              </a>
            </li>
          ))}
        </ol>
        {lastAccessed && (
          <p className="figures mt-4 text-xs text-muted-foreground">
            最終確認 {formatDateJa(lastAccessed)}
          </p>
        )}
      </div>
    </details>
  );
}
