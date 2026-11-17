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
          この企業についての注記（{notes.length}件）
          <span className="ml-2 font-normal text-muted-foreground">決算期のあとの出来事や、表の基準など</span>
        </summary>
        <p className="mt-2 text-muted-foreground">
          このページは有価証券報告書の決算期時点の内容です。読むときに知っておきたい点を、同じ報告書の記載にもとづいて書いています。
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
