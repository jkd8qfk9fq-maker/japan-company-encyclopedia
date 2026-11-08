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
import holdingCompany from "./holding-company.json";
import affiliate from "./affiliate.json";
import otherAffiliatedCompany from "./other-affiliated-company.json";
import equityMethod from "./equity-method.json";
import ordinaryProfit from "./ordinary-profit.json";
import netIncomeAttributableToOwnersOfParent from "./net-income-attributable-to-owners-of-parent.json";
import absorptionMerger from "./absorption-merger.json";
import shareExchange from "./share-exchange.json";
import tenderOffer from "./tender-offer.json";
import goodwill from "./goodwill.json";
import machineTool from "./machine-tool.json";
import cutting from "./cutting.json";
import grinding from "./grinding.json";
import industrialRobot from "./industrial-robot.json";
import carbonFiber from "./carbon-fiber.json";
import lease from "./lease.json";
import trust from "./trust.json";
import assetManagement from "./asset-management.json";
import propertyManagement from "./property-management.json";
import reit from "./reit.json";
import genericDrug from "./generic-drug.json";
import cro from "./cro.json";
import workerDispatch from "./worker-dispatch.json";
import jobPlacement from "./job-placement.json";
import retailElectricity from "./retail-electricity.json";
import powerTransmissionDistribution from "./power-transmission-distribution.json";
import constructionSupervision from "./construction-supervision.json";
import renewableEnergy from "./renewable-energy.json";
import customsClearance from "./customs-clearance.json";

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
  "holding-company": holdingCompany,
  "affiliate": affiliate,
  "other-affiliated-company": otherAffiliatedCompany,
  "equity-method": equityMethod,
  "ordinary-profit": ordinaryProfit,
  "net-income-attributable-to-owners-of-parent": netIncomeAttributableToOwnersOfParent,
  "absorption-merger": absorptionMerger,
  "share-exchange": shareExchange,
  "tender-offer": tenderOffer,
  "goodwill": goodwill,
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
  "machine-tool": machineTool,
  "cutting": cutting,
  "grinding": grinding,
  "industrial-robot": industrialRobot,
  "carbon-fiber": carbonFiber,
  "lease": lease,
  "trust": trust,
  "asset-management": assetManagement,
  "property-management": propertyManagement,
  "reit": reit,
  "generic-drug": genericDrug,
  "cro": cro,
  "worker-dispatch": workerDispatch,
  "job-placement": jobPlacement,
  "retail-electricity": retailElectricity,
  "power-transmission-distribution": powerTransmissionDistribution,
  "construction-supervision": constructionSupervision,
  "renewable-energy": renewableEnergy,
  "customs-clearance": customsClearance,
}).map(([file, data]) => parseContent(termSchema, data, `src/data/terms/${file}.json`));
