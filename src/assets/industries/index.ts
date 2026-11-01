import type { StaticImageData } from "next/image";
import type { IndustryId } from "@/types/company";
import hubFactory from "./hub-factory.jpg";
import mapPort from "./map-port.jpg";
import automotive from "./automotive.jpg";
import semiconductors from "./semiconductors.jpg";
import electronics from "./electronics.jpg";
import it from "./it.jpg";
import finance from "./finance.jpg";
import trading from "./trading.jpg";
import food from "./food.jpg";
import retail from "./retail.jpg";
import realEstate from "./real-estate.jpg";
import construction from "./construction.jpg";
import chemicals from "./chemicals.jpg";
import pharmaceuticals from "./pharmaceuticals.jpg";
import transportation from "./transportation.jpg";
import energy from "./energy.jpg";
import telecommunications from "./telecommunications.jpg";
import media from "./media.jpg";
import entertainment from "./entertainment.jpg";
import machinery from "./machinery.jpg";
import humanResources from "./human-resources.jpg";
import funeralMemorial from "./funeral-memorial.jpg";

/**
 * Images for the industry pages: one photograph per industry (the 仕組み tab, and as a thumbnail wherever the
 * industry is listed), one per category of a researched industry's structure (stages/index.ts), and the banners of
 * the industries hub. Every file is a photograph from Unsplash or Pexels, used under their licences, which need no
 * credit; the operator chose to show none (2026-11-01). Where each file came from is in SOURCES.md beside it.
 *
 * They show the kind of work an industry does, never a particular company: none is of a company's own site or
 * product, and none carries a recognisable brand.
 */
export const INDUSTRY_IMAGES: Record<IndustryId, StaticImageData> = {
  "automotive": automotive,
  "semiconductors": semiconductors,
  "electronics": electronics,
  "it": it,
  "finance": finance,
  "trading": trading,
  "food": food,
  "retail": retail,
  "real-estate": realEstate,
  "construction": construction,
  "chemicals": chemicals,
  "pharmaceuticals": pharmaceuticals,
  "transportation": transportation,
  "energy": energy,
  "telecommunications": telecommunications,
  "media": media,
  "entertainment": entertainment,
  "machinery": machinery,
  "human-resources": humanResources,
  "funeral-memorial": funeralMemorial,
};

export { STAGE_IMAGES } from "./stages";

/** The industries hub: its header, and the 産業マップ tab. */
export const HUB_IMAGES = { header: hubFactory, map: mapPort };
