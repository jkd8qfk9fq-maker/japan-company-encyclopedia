import type { StaticImageData } from "next/image";
import semiconductorsDesign from "../stage-design.jpg";
import semiconductorsFrontEndProcess from "../stage-front-end.jpg";
import semiconductorsBackEndProcess from "../stage-back-end.jpg";
import semiconductorsElectronicDevices from "../stage-devices.jpg";
import semiconductorsManufacturingEquipment from "../stage-equipment.jpg";
import semiconductorsMaterials from "../stage-materials.jpg";
import automotiveMaterials from "./automotive-materials.jpg";
import automotiveParts from "./automotive-parts.jpg";
import automotiveSalesFinance from "./automotive-sales-finance.jpg";
import automotiveTires from "./automotive-tires.jpg";
import automotiveVehicles from "./automotive-vehicles.jpg";
import chemicalsBasicChemicals from "./chemicals-basic-chemicals.jpg";
import chemicalsConsumerProducts from "./chemicals-consumer-products.jpg";
import chemicalsElectronicMaterials from "./chemicals-electronic-materials.jpg";
import chemicalsFunctionalMaterials from "./chemicals-functional-materials.jpg";
import chemicalsMetalsGases from "./chemicals-metals-gases.jpg";
import chemicalsPaperPackaging from "./chemicals-paper-packaging.jpg";
import constructionContracting from "./construction-contracting.jpg";
import constructionEquipment from "./construction-equipment.jpg";
import constructionHousingDevelopment from "./construction-housing-development.jpg";
import constructionManagement from "./construction-management.jpg";
import constructionMaterials from "./construction-materials.jpg";
import electronicsAppliancesInfrastructure from "./electronics-appliances-infrastructure.jpg";
import electronicsAutomationMeasurement from "./electronics-automation-measurement.jpg";
import electronicsElectronicComponents from "./electronics-electronic-components.jpg";
import electronicsElectronicMaterials from "./electronics-electronic-materials.jpg";
import electronicsOfficeImaging from "./electronics-office-imaging.jpg";
import electronicsTelecomItEquipment from "./electronics-telecom-it-equipment.jpg";
import energyEquipment from "./energy-equipment.jpg";
import energyGeneration from "./energy-generation.jpg";
import energyGrid from "./energy-grid.jpg";
import energyRefining from "./energy-refining.jpg";
import energyResources from "./energy-resources.jpg";
import energySales from "./energy-sales.jpg";
import entertainmentGames from "./entertainment-games.jpg";
import entertainmentGoods from "./entertainment-goods.jpg";
import entertainmentHotelTravel from "./entertainment-hotel-travel.jpg";
import entertainmentIpContent from "./entertainment-ip-content.jpg";
import entertainmentLiveVenues from "./entertainment-live-venues.jpg";
import financeBanking from "./finance-banking.jpg";
import financeBusinessFinance from "./finance-business-finance.jpg";
import financeInsurance from "./finance-insurance.jpg";
import financeLendingLeasing from "./finance-lending-leasing.jpg";
import financePayments from "./finance-payments.jpg";
import financeSecuritiesInvestment from "./finance-securities-investment.jpg";
import foodFoodService from "./food-food-service.jpg";
import foodIngredients from "./food-ingredients.jpg";
import foodManufacturing from "./food-manufacturing.jpg";
import foodProduction from "./food-production.jpg";
import foodWholesale from "./food-wholesale.jpg";
import humanResourcesGlobal from "./human-resources-global.jpg";
import humanResourcesPlacementMedia from "./human-resources-placement-media.jpg";
import humanResourcesStaffingOutsourcing from "./human-resources-staffing-outsourcing.jpg";
import humanResourcesTrainingEducation from "./human-resources-training-education.jpg";
import itAiSoftware from "./it-ai-software.jpg";
import itHardwareSales from "./it-hardware-sales.jpg";
import itInternetServices from "./it-internet-services.jpg";
import itMessagingMarketing from "./it-messaging-marketing.jpg";
import itSystemIntegration from "./it-system-integration.jpg";
import machineryAerospaceHeavy from "./machinery-aerospace-heavy.jpg";
import machineryConstructionSpecialVehicles from "./machinery-construction-special-vehicles.jpg";
import machineryInspectionEquipment from "./machinery-inspection-equipment.jpg";
import machineryPlantsEnergy from "./machinery-plants-energy.jpg";
import machineryPrecisionParts from "./machinery-precision-parts.jpg";
import machineryProductionMachines from "./machinery-production-machines.jpg";
import mediaAdvertisingPromotion from "./media-advertising-promotion.jpg";
import mediaCommerceMatching from "./media-commerce-matching.jpg";
import mediaDigitalContent from "./media-digital-content.jpg";
import mediaPrintingPublishing from "./media-printing-publishing.jpg";
import mediaWebMedia from "./media-web-media.jpg";
import pharmaceuticalsContractMaterials from "./pharmaceuticals-contract-materials.jpg";
import pharmaceuticalsPharmacyCare from "./pharmaceuticals-pharmacy-care.jpg";
import pharmaceuticalsResearchManufacturing from "./pharmaceuticals-research-manufacturing.jpg";
import pharmaceuticalsWholesale from "./pharmaceuticals-wholesale.jpg";
import realEstateBrokerageManagement from "./real-estate-brokerage-management.jpg";
import realEstateBuildingRental from "./real-estate-building-rental.jpg";
import realEstateHousingSales from "./real-estate-housing-sales.jpg";
import realEstateRentalHousing from "./real-estate-rental-housing.jpg";
import realEstateResale from "./real-estate-resale.jpg";
import retailDepartmentStation from "./retail-department-station.jpg";
import retailDrugstores from "./retail-drugstores.jpg";
import retailGeneralStores from "./retail-general-stores.jpg";
import retailOnlineMailOrder from "./retail-online-mail-order.jpg";
import retailSpecialtyStores from "./retail-specialty-stores.jpg";
import telecommunicationsCarriers from "./telecommunications-carriers.jpg";
import telecommunicationsEnterpriseIct from "./telecommunications-enterprise-ict.jpg";
import telecommunicationsEquipment from "./telecommunications-equipment.jpg";
import telecommunicationsResaleMessaging from "./telecommunications-resale-messaging.jpg";
import tradingBuildingMaterialsSupplies from "./trading-building-materials-supplies.jpg";
import tradingFoodDailyWholesale from "./trading-food-daily-wholesale.jpg";
import tradingGeneralTrading from "./trading-general-trading.jpg";
import tradingMachineryElectronics from "./trading-machinery-electronics.jpg";
import tradingMetals from "./trading-metals.jpg";
import tradingTradingInOtherGroups from "./trading-trading-in-other-groups.jpg";
import transportationAir from "./transportation-air.jpg";
import transportationLogisticsForwarding from "./transportation-logistics-forwarding.jpg";
import transportationParcelDelivery from "./transportation-parcel-delivery.jpg";
import transportationRailway from "./transportation-railway.jpg";
import transportationShipping from "./transportation-shipping.jpg";

/**
 * One photograph per category of a researched industry's structure, keyed `<industry id>/<category id>` because
 * category ids repeat across industries ("materials" of cars is not "materials" of chips). Same rules as the rest of
 * src/assets/industries: Unsplash or Pexels, no credit shown, the kind of work and never a particular company or brand.
 * A category without an entry is drawn without a photograph.
 */
export const STAGE_IMAGES: Partial<Record<string, StaticImageData>> = {
  "semiconductors/design": semiconductorsDesign,
  "semiconductors/front-end-process": semiconductorsFrontEndProcess,
  "semiconductors/back-end-process": semiconductorsBackEndProcess,
  "semiconductors/electronic-devices": semiconductorsElectronicDevices,
  "semiconductors/manufacturing-equipment": semiconductorsManufacturingEquipment,
  "semiconductors/materials": semiconductorsMaterials,
  "automotive/materials": automotiveMaterials,
  "automotive/parts": automotiveParts,
  "automotive/sales-finance": automotiveSalesFinance,
  "automotive/tires": automotiveTires,
  "automotive/vehicles": automotiveVehicles,
  "chemicals/basic-chemicals": chemicalsBasicChemicals,
  "chemicals/consumer-products": chemicalsConsumerProducts,
  "chemicals/electronic-materials": chemicalsElectronicMaterials,
  "chemicals/functional-materials": chemicalsFunctionalMaterials,
  "chemicals/metals-gases": chemicalsMetalsGases,
  "chemicals/paper-packaging": chemicalsPaperPackaging,
  "construction/contracting": constructionContracting,
  "construction/equipment": constructionEquipment,
  "construction/housing-development": constructionHousingDevelopment,
  "construction/management": constructionManagement,
  "construction/materials": constructionMaterials,
  "electronics/appliances-infrastructure": electronicsAppliancesInfrastructure,
  "electronics/automation-measurement": electronicsAutomationMeasurement,
  "electronics/electronic-components": electronicsElectronicComponents,
  "electronics/electronic-materials": electronicsElectronicMaterials,
  "electronics/office-imaging": electronicsOfficeImaging,
  "electronics/telecom-it-equipment": electronicsTelecomItEquipment,
  "energy/equipment": energyEquipment,
  "energy/generation": energyGeneration,
  "energy/grid": energyGrid,
  "energy/refining": energyRefining,
  "energy/resources": energyResources,
  "energy/sales": energySales,
  "entertainment/games": entertainmentGames,
  "entertainment/goods": entertainmentGoods,
  "entertainment/hotel-travel": entertainmentHotelTravel,
  "entertainment/ip-content": entertainmentIpContent,
  "entertainment/live-venues": entertainmentLiveVenues,
  "finance/banking": financeBanking,
  "finance/business-finance": financeBusinessFinance,
  "finance/insurance": financeInsurance,
  "finance/lending-leasing": financeLendingLeasing,
  "finance/payments": financePayments,
  "finance/securities-investment": financeSecuritiesInvestment,
  "food/food-service": foodFoodService,
  "food/ingredients": foodIngredients,
  "food/manufacturing": foodManufacturing,
  "food/production": foodProduction,
  "food/wholesale": foodWholesale,
  "human-resources/global": humanResourcesGlobal,
  "human-resources/placement-media": humanResourcesPlacementMedia,
  "human-resources/staffing-outsourcing": humanResourcesStaffingOutsourcing,
  "human-resources/training-education": humanResourcesTrainingEducation,
  "it/ai-software": itAiSoftware,
  "it/hardware-sales": itHardwareSales,
  "it/internet-services": itInternetServices,
  "it/messaging-marketing": itMessagingMarketing,
  "it/system-integration": itSystemIntegration,
  "machinery/aerospace-heavy": machineryAerospaceHeavy,
  "machinery/construction-special-vehicles": machineryConstructionSpecialVehicles,
  "machinery/inspection-equipment": machineryInspectionEquipment,
  "machinery/plants-energy": machineryPlantsEnergy,
  "machinery/precision-parts": machineryPrecisionParts,
  "machinery/production-machines": machineryProductionMachines,
  "media/advertising-promotion": mediaAdvertisingPromotion,
  "media/commerce-matching": mediaCommerceMatching,
  "media/digital-content": mediaDigitalContent,
  "media/printing-publishing": mediaPrintingPublishing,
  "media/web-media": mediaWebMedia,
  "pharmaceuticals/contract-materials": pharmaceuticalsContractMaterials,
  "pharmaceuticals/pharmacy-care": pharmaceuticalsPharmacyCare,
  "pharmaceuticals/research-manufacturing": pharmaceuticalsResearchManufacturing,
  "pharmaceuticals/wholesale": pharmaceuticalsWholesale,
  "real-estate/brokerage-management": realEstateBrokerageManagement,
  "real-estate/building-rental": realEstateBuildingRental,
  "real-estate/housing-sales": realEstateHousingSales,
  "real-estate/rental-housing": realEstateRentalHousing,
  "real-estate/resale": realEstateResale,
  "retail/department-station": retailDepartmentStation,
  "retail/drugstores": retailDrugstores,
  "retail/general-stores": retailGeneralStores,
  "retail/online-mail-order": retailOnlineMailOrder,
  "retail/specialty-stores": retailSpecialtyStores,
  "telecommunications/carriers": telecommunicationsCarriers,
  "telecommunications/enterprise-ict": telecommunicationsEnterpriseIct,
  "telecommunications/equipment": telecommunicationsEquipment,
  "telecommunications/resale-messaging": telecommunicationsResaleMessaging,
  "trading/building-materials-supplies": tradingBuildingMaterialsSupplies,
  "trading/food-daily-wholesale": tradingFoodDailyWholesale,
  "trading/general-trading": tradingGeneralTrading,
  "trading/machinery-electronics": tradingMachineryElectronics,
  "trading/metals": tradingMetals,
  "trading/trading-in-other-groups": tradingTradingInOtherGroups,
  "transportation/air": transportationAir,
  "transportation/logistics-forwarding": transportationLogisticsForwarding,
  "transportation/parcel-delivery": transportationParcelDelivery,
  "transportation/railway": transportationRailway,
  "transportation/shipping": transportationShipping,
};
