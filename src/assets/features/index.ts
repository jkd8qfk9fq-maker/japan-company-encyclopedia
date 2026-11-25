import type { StaticImageData } from "next/image";
import construction from "../industries/construction.jpg";
import finance from "../industries/finance.jpg";
import hubFactory from "../industries/hub-factory.jpg";
import humanResources from "../industries/human-resources.jpg";
import mapPort from "../industries/map-port.jpg";
import realEstate from "../industries/real-estate.jpg";

/**
 * Photographs for the features (JCE-113). They are the industry pages' own Unsplash / Pexels photographs
 * (src/assets/industries, provenance in its SOURCES.md), reused rather than fetched anew: each shows the kind of
 * scene a feature is about — a port for overseas sales, an office for pay — and never a company, product or brand.
 * A feature without an entry here is shown on its colour block, as before; the picture carries no claim.
 */
export const FEATURE_IMAGES: Record<string, StaticImageData> = {
  "overseas-sales-geography": mapPort,
  "average-salary-by-industry": humanResources,
  "five-year-revenue-growth": realEstate,
  "employees-by-industry": construction,
  "how-many-companies-pay-dividends": finance,
  "revenue-per-employee-by-industry": hubFactory,
};

/** The features list's header band (not the port photograph with a terminal operator's sign in it). */
export const FEATURES_HERO_IMAGE = hubFactory;
