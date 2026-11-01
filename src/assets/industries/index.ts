import type { StaticImageData } from "next/image";
import type { IndustryId } from "@/types/company";
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
import stageDesign from "./stage-design.jpg";
import stageFrontEnd from "./stage-front-end.jpg";
import stageBackEnd from "./stage-back-end.jpg";
import stageDevices from "./stage-devices.jpg";
import stageEquipment from "./stage-equipment.jpg";
import stageMaterials from "./stage-materials.jpg";

/**
 * Images for the industry pages' 仕組み tab: one photograph per industry, and one per stage of a researched
 * industry's structure (keyed by the category id in src/data/industries). Every file is a photograph from Unsplash,
 * used under the Unsplash License, which needs no credit; the operator chose to show none (2026-11-01). Where each
 * file came from is in SOURCES.md beside it.
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

export const STAGE_IMAGES: Partial<Record<string, StaticImageData>> = {
  "design": stageDesign,
  "front-end-process": stageFrontEnd,
  "back-end-process": stageBackEnd,
  "electronic-devices": stageDevices,
  "manufacturing-equipment": stageEquipment,
  "materials": stageMaterials,
};
