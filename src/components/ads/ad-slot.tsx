/**
 * Advertising placement — deliberately inert (spec §82–83).
 *
 * There are no advertisements in the MVP and no ad network, tracking or
 * targeting code anywhere. This component exists only so that the day a
 * placement is decided, pages already mark WHERE one may go and nothing has
 * to be redesigned. Until ADS_ENABLED is true it renders nothing — not an
 * empty box, not reserved space, not a script.
 *
 * Placements are a closed set: an ad cannot appear somewhere nobody decided.
 * A company's one-sentence description and business structure are not
 * placements, and must never become one — they are the product.
 */

export const AD_PLACEMENTS = ["feature-inline", "company-bottom", "industry-inline", "home-feature"] as const;

export type AdPlacement = (typeof AD_PLACEMENTS)[number];

/** Flip only with an operator decision; see docs/decisions.md. */
export const ADS_ENABLED = false;

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (!ADS_ENABLED) return null;
  // When enabled: label every slot as advertising, keep it visually separate
  // from content, and never let it sit between a claim and its sources.
  return (
    <aside aria-label="広告" data-ad-placement={placement} className="my-12 border-y border-border py-6 text-center text-xs text-muted-foreground">
      広告
    </aside>
  );
}
