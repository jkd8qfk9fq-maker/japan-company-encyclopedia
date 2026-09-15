import { parseContent, termSchema } from "@/lib/content/schemas";
import type { Term } from "@/types/term";
import annualSecuritiesReport from "./annual-securities-report.json";
import backEndProcess from "./back-end-process.json";
import consolidatedSubsidiary from "./consolidated-subsidiary.json";
import discontinuedOperations from "./discontinued-operations.json";
import earningsRelease from "./earnings-release.json";
import foundry from "./foundry.json";
import frontEndProcess from "./front-end-process.json";
import ifrs from "./ifrs.json";
import imageSensor from "./image-sensor.json";
import segment from "./segment.json";
import semiconductor from "./semiconductor.json";
import semiconductorManufacturingEquipment from "./semiconductor-manufacturing-equipment.json";
import sogoShosha from "./sogo-shosha.json";
import subsidiary from "./subsidiary.json";
import wafer from "./wafer.json";

/**
 * Grouped by what the reader is reading: words for any company page and its
 * sources first, then the semiconductor words. The glossary page does not use
 * this order — the term repository sorts by reading (or by the term itself
 * when there is no reading) — so the grouping is only for whoever edits it.
 */
export const terms: Term[] = Object.entries({
  "annual-securities-report": annualSecuritiesReport,
  "earnings-release": earningsRelease,
  "subsidiary": subsidiary,
  "consolidated-subsidiary": consolidatedSubsidiary,
  "segment": segment,
  "ifrs": ifrs,
  "discontinued-operations": discontinuedOperations,
  "sogo-shosha": sogoShosha,
  "semiconductor": semiconductor,
  "semiconductor-manufacturing-equipment": semiconductorManufacturingEquipment,
  "wafer": wafer,
  "front-end-process": frontEndProcess,
  "back-end-process": backEndProcess,
  "foundry": foundry,
  "image-sensor": imageSensor,
}).map(([file, data]) => parseContent(termSchema, data, `src/data/terms/${file}.json`));
