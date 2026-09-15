import type { Term } from "@/types/term";
import { annualSecuritiesReport } from "./annual-securities-report";
import { backEndProcess } from "./back-end-process";
import { consolidatedSubsidiary } from "./consolidated-subsidiary";
import { discontinuedOperations } from "./discontinued-operations";
import { earningsRelease } from "./earnings-release";
import { foundry } from "./foundry";
import { frontEndProcess } from "./front-end-process";
import { ifrs } from "./ifrs";
import { imageSensor } from "./image-sensor";
import { segment } from "./segment";
import { semiconductor } from "./semiconductor";
import { semiconductorManufacturingEquipment } from "./semiconductor-manufacturing-equipment";
import { sogoShosha } from "./sogo-shosha";
import { subsidiary } from "./subsidiary";
import { wafer } from "./wafer";

/**
 * Grouped by what the reader is reading: words for any company page and its
 * sources first, then the semiconductor words. The glossary page does not use
 * this order — the term repository sorts by reading (or by the term itself
 * when there is no reading) — so the grouping is only for whoever edits it.
 */
export const terms: Term[] = [
  annualSecuritiesReport,
  earningsRelease,
  subsidiary,
  consolidatedSubsidiary,
  segment,
  ifrs,
  discontinuedOperations,
  sogoShosha,
  semiconductor,
  semiconductorManufacturingEquipment,
  wafer,
  frontEndProcess,
  backEndProcess,
  foundry,
  imageSensor,
];
