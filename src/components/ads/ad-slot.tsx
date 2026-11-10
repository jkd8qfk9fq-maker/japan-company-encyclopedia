import { AdUnit } from "./ad-unit";

/**
 * Advertising placement (spec §82–83; Google AdSense since JCE-039).
 *
 * Until the operator's AdSense ad unit is set below (after Google approves the site), ADS_ENABLED is false and this
 * renders nothing — not an empty box, not reserved space, not a script. /privacy and /about#advertising read the
 * same flag, so they describe AdSense exactly when ads can appear.
 *
 * Placements are a closed set: an ad cannot appear somewhere nobody decided.
 * A company's one-sentence description and business structure are not
 * placements, and must never become one — they are the product.
 */

export const AD_PLACEMENTS = ["feature-inline", "company-bottom", "industry-inline", "home-feature"] as const;

export type AdPlacement = (typeof AD_PLACEMENTS)[number];

/** The operator's AdSense publisher id (public: it is in every page's meta tag and in /ads.txt). */
export const ADSENSE_CLIENT = "ca-pub-6016615044830350";
/** The display ad unit's id, from AdSense once the site is approved. null = no ads anywhere. */
export const ADSENSE_SLOT: string | null = null;

export const ADS_ENABLED = ADSENSE_SLOT !== null;

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (!ADSENSE_SLOT) return null;
  // Labelled as advertising, visually separate from content, and never between a claim and its sources.
  return (
    <aside aria-label="広告" data-ad-placement={placement} className="my-12 border-y border-border py-4">
      <p className="mb-2 text-xs text-muted-foreground">広告</p>
      <AdUnit client={ADSENSE_CLIENT} slot={ADSENSE_SLOT} />
    </aside>
  );
}
