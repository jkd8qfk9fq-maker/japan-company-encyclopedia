import { cn } from "@/lib/utils";

/**
 * The square mark beside a company's name (2026-11-23 redesign). Not a logo: the site never shows a company's own
 * brand (CLAUDE.md, company pages carry no photographs or brand images), so the mark is the first character of the
 * name set in the house serif, which gives every entry the same anchor without borrowing anyone's design.
 */
export function CompanyMark({ name, className }: { name: string; className?: string }) {
  const glyph = Array.from(name.replace(/^[（(]株[）)]|^株式会社/, "").trim())[0] ?? "・";
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-border bg-gradient-to-br from-secondary to-card font-serif font-semibold text-foreground shadow-inner",
        className ?? "size-12 text-xl",
      )}
    >
      {glyph}
    </span>
  );
}
