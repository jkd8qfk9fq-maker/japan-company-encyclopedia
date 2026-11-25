import Link from "next/link";

/**
 * The premium report's entrance (JCE-125), directly under the hero of every company page. Until now the only
 * doors were a text link in the hero's one-line contents and a card at the tail of the 財務 section, so a reader
 * who never scrolled that far never learned the report existed. The band sits at the end of the first view —
 * same place on a phone and on a desktop — and says what the report holds before asking for the tap: the
 * 「この会社の今」 answers and the nine-group analysis (the paid layer, JCE-120), the five printed years and the
 * industry position, in the printable one-sheet form (JCE-114).
 *
 * The band itself discloses nothing: it shows to every reader of every released company, and the paywall stays
 * where it already lives, inside the report (JCE-101). One entrance only — the 財務 tail card it replaces is
 * gone, so the page does not ask twice.
 */
export function ReportCta({ companyId }: { companyId: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      <Link
        href={`/companies/${companyId}/report`}
        className="flex items-center justify-between gap-4 rounded-xl bg-navy px-5 py-4 text-white transition-opacity hover:opacity-90 md:px-6 md:py-5"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-serif text-base font-semibold md:text-lg">企業レポート</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6875rem] font-medium">プレミアム</span>
          </span>
          <span className="mt-1 block text-xs leading-5 text-white/75 md:text-[0.8125rem] md:leading-6">
            「この会社の今」の答えと9グループの分析、5期の数字・売上の内訳・業界の中での位置を、印刷できる1枚に（PDF保存もできます）
          </span>
        </span>
        <span aria-hidden className="shrink-0 text-lg">
          →
        </span>
      </Link>
    </div>
  );
}
