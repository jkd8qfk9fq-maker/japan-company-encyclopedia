import { SourceList } from "@/components/sources/source-list";
import { formatDateJa } from "@/lib/utils/format";
import type { Perspective, Perspectives } from "@/types/company";
import type { Source } from "@/types/source";

const ITEMS: { key: keyof Perspectives; title: string }[] = [
  { key: "strategy", title: "成長戦略" },
  { key: "competitiveAdvantage", title: "競争優位性" },
  { key: "industryPosition", title: "業界内の位置づけ" },
];

/**
 * Strategy, competitive advantage and position in the industry. What the company itself says and what this
 * encyclopedia infers are shown apart and labelled, each with its point in time and its sources (JCE-024): a reader
 * must never mistake an inference for the company's own words.
 */
export function PerspectivesSection({ perspectives, sources }: { perspectives: Perspectives; sources: Source[] }) {
  const present = ITEMS.filter((i) => perspectives[i.key]);
  return (
    <div className="space-y-10">
      {present.map(({ key, title }) => (
        <PerspectiveBlock key={key} title={title} perspective={perspectives[key] as Perspective} sources={sources} />
      ))}
    </div>
  );
}

function PerspectiveBlock({ title, perspective, sources }: { title: string; perspective: Perspective; sources: Source[] }) {
  return (
    <section aria-label={title}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {perspective.disclosed && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-muted-foreground">会社の説明（{formatDateJa(perspective.disclosed.asOf)} 時点）</p>
          <p className="mt-1 leading-8">{perspective.disclosed.text}</p>
          <SourceList sources={sources} sourceIds={perspective.disclosed.sourceIds} className="mt-2" />
        </div>
      )}
      {perspective.analysis && (
        <div className="mt-4 border-l-2 border-border pl-4">
          <p className="text-xs font-semibold text-muted-foreground">編集部の分析（推論。{formatDateJa(perspective.analysis.asOf)} 時点の資料による）</p>
          <p className="mt-1 leading-8">{perspective.analysis.text}</p>
          <p className="mt-1 text-sm text-muted-foreground">根拠: {perspective.analysis.basis}</p>
          <SourceList sources={sources} sourceIds={perspective.analysis.sourceIds} className="mt-2" />
        </div>
      )}
    </section>
  );
}
