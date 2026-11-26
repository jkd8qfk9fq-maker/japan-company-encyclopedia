import type { Business } from "@/types/company";

// Split from business-structure.tsx so a Client Component (value-chain-flow.tsx) can draw the marker without
// importing the diagram, which reads translations on the server (JCE-124).

const SEGMENT_TONES = 6;

/**
 * The level of the structure the page draws as "the businesses". One top-level business with sub-businesses (a
 * company reporting a single segment, like Tokyo Electron) would otherwise draw one lonely branch and hide the level
 * that actually says what the company makes, so its children are drawn instead, under it (`via`). This only chooses
 * which existing level is drawn; nothing is added. Shared by the diagram, the cards and the hero, so every marker
 * on the page points at the same business.
 */
export function structureBranches(businesses: Business[]): { via: Business | null; branches: Business[] } {
  const only = businesses.length === 1 ? businesses[0] : null;
  const via = only && only.children && only.children.length > 0 ? only : null;
  return { via, branches: via ? via.children! : businesses };
}

/** A business's colour, or none past the sixth: the number then carries the identity alone. */
export function segmentTone(index: number): string | undefined {
  return index < SEGMENT_TONES ? `var(--segment-${index + 1})` : undefined;
}

/**
 * A business's marker: its number on its colour. The same mark labels the business in this diagram and in the list
 * under it (business-list.tsx), so the two read as one object. The number carries the identity — colour only helps
 * the eye — and past the sixth business there is no colour left, so the mark is the number alone.
 */
export function SegmentMark({ index }: { index: number }) {
  return (
    <span aria-hidden className="figures inline-flex shrink-0 items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
      {segmentTone(index) && (
        // Text never sits on the colour: a swatch beside the number keeps contrast the same in light and dark.
        <span className="size-2.5 rounded-[2px]" style={{ background: segmentTone(index) }} />
      )}
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}
