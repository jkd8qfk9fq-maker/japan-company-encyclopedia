import { parseContent, industrySchema } from "@/lib/content/schemas";
import type { Industry } from "@/types/industry";
import semiconductors from "./semiconductors.json";
import humanResources from "./human-resources.json";
import machinery from "./machinery.json";
import entertainment from "./entertainment.json";
import media from "./media.json";
import telecommunications from "./telecommunications.json";
import energy from "./energy.json";
import transportation from "./transportation.json";
import pharmaceuticals from "./pharmaceuticals.json";
import chemicals from "./chemicals.json";
import construction from "./construction.json";
import realEstate from "./real-estate.json";
import retail from "./retail.json";
import food from "./food.json";
import trading from "./trading.json";
import finance from "./finance.json";
import it from "./it.json";
import electronics from "./electronics.json";
import automotive from "./automotive.json";

/** Industries with a researched explanation. Others appear with their companies only. */
export const industries: Industry[] = Object.entries({ semiconductors, automotive, electronics, it, finance, trading, food, retail, "real-estate": realEstate, construction, chemicals, pharmaceuticals, transportation, energy, telecommunications, media, entertainment, machinery, "human-resources": humanResources }).map(([file, data]) =>
  parseContent(industrySchema, data, `src/data/industries/${file}.json`),
);
