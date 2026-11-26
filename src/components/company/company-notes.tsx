import { T } from "@/components/i18n/t";
import { L } from "@/components/i18n/label";
/**
 * The notes of an entry released with them (JCE-057). Placed under the header, so a reader meets them before the
 * structure, financials and history they qualify. Folded, because some are long; the summary says what kind they are.
 */
export function CompanyNotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <aside aria-label="この企業についての注記" className="mx-auto max-w-6xl px-5 pt-6 md:px-8">
      <details className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-7">
        <summary className="cursor-pointer font-medium">
          <span data-l="ja" lang="ja">この企業についての注記（{notes.length}件）
          <span className="ml-2 font-normal text-muted-foreground"><T m={{ ja: "決算期のあとの出来事や、表の基準など", en: "Events after the fiscal year-end, table criteria and more" }} /></span></span><span data-l="en" lang="en">Notes on this company ({notes.length})<span className="ml-2 font-normal text-muted-foreground"><T m={{ ja: "決算期のあとの出来事や、表の基準など", en: "Events after the fiscal year-end, table criteria and more" }} /></span></span>
        </summary>
        <p className="mt-2 text-muted-foreground">
          <T m={{ ja: "このページは有価証券報告書の決算期時点の内容です。読むときに知っておきたい点を、同じ報告書の記載にもとづいて書いています。", en: "This page reflects the annual securities report as of its fiscal year end. It lists points worth knowing when reading, based on statements in the same report." }} />
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          {notes.map((note) => (
            <li key={note}><L s={note} /></li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
