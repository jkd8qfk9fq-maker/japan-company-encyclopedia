import { parseContent, companySchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import c3DMatrix from "./3-d-matrix.json";
import c4csHd from "./4cs-hd.json";
import aAndAMaterial from "./a-and-a-material.json";
import aAndDHolonHoldings from "./a-and-d-holon-holdings.json";
import aDWorksGroup from "./a-d-works-group.json";
import aOneSeimitsu from "./a-one-seimitsu.json";
import aTie from "./a-tie.json";
import abAndCompany from "./ab-and-company.json";
import abcMart from "./abc-mart.json";
import abeja from "./abeja.json";
import abhotel from "./abhotel.json";
import abist from "./abist.json";
import access from "./access.json";
import accessGroupHoldings from "./access-group-holdings.json";
import accrete from "./accrete.json";
import achilles from "./achilles.json";
import acmos from "./acmos.json";
import acom from "./acom.json";
import adSolNissin from "./ad-sol-nissin.json";
import adeka from "./adeka.json";
import adish from "./adish.json";
import adjuvantHoldings from "./adjuvant-holdings.json";
import adr120s from "./adr120s.json";
import adtecPlasmaTechnology from "./adtec-plasma-technology.json";
import advanGroup from "./advan-group.json";
import advancedMedia from "./advanced-media.json";
import advanex from "./advanex.json";
import advantageRiskManagement from "./advantage-risk-management.json";
import advantest from "./advantest.json";
import adventure from "./adventure.json";
import adways from "./adways.json";
import aeon from "./aeon.json";
import aeonDelight from "./aeon-delight.json";
import aeonFantasy from "./aeon-fantasy.json";
import aeonFinancialService from "./aeon-financial-service.json";
import aeonHokkaido from "./aeon-hokkaido.json";
import aeonKyushu from "./aeon-kyushu.json";
import aeonMall from "./aeon-mall.json";
import aeria from "./aeria.json";
import aeroedge from "./aeroedge.json";
import afcHdAmsLifeScience from "./afc-hd-ams-life-science.json";
import agc from "./agc.json";
import ageha from "./ageha.json";
import agentIgHoldings from "./agent-ig-holdings.json";
import agentInsuranceGroup from "./agent-insurance-group.json";
import agoraHospitalityGroup from "./agora-hospitality-group.json";
import agp from "./agp.json";
import agratioUrbanDesign from "./agratio-urban-design.json";
import ags from "./ags.json";
import ahcGroup from "./ahc-group.json";
import ahjikan from "./ahjikan.json";
import ahresty from "./ahresty.json";
import ai from "./ai.json";
import aiCross from "./ai-cross.json";
import aiFusionCapitalGroup from "./ai-fusion-capital-group.json";
import aiHoldings from "./ai-holdings.json";
import aiInside from "./ai-inside.json";
import aiPartnersFinancial from "./ai-partners-financial.json";
import aiRobotics from "./ai-robotics.json";
import aiStorm from "./ai-storm.json";
import aiaiGroup from "./aiai-group.json";
import aicaKogyo from "./aica-kogyo.json";
import aichi from "./aichi.json";
import aichiElectric from "./aichi-electric.json";
import aichiFinancialGroup from "./aichi-financial-group.json";
import aichiSteel from "./aichi-steel.json";
import aichiTokeiDenki from "./aichi-tokei-denki.json";
import aidaEngineering from "./aida-engineering.json";
import aidemy from "./aidemy.json";
import aidmaHoldings from "./aidma-holdings.json";
import aidmaMarketingCommunication from "./aidma-marketing-communication.json";
import aiful from "./aiful.json";
import aigan from "./aigan.json";
import aimechatec from "./aimechatec.json";
import aiming from "./aiming.json";
import ainHoldings from "./ain-holdings.json";
import ainavoHoldings from "./ainavo-holdings.json";
import aiphone from "./aiphone.json";
import airWater from "./air-water.json";
import aircloset from "./aircloset.json";
import airman from "./airman.json";
import airportFacilities from "./airport-facilities.json";
import airtechJapan from "./airtech-japan.json";
import airtrip from "./airtrip.json";
import aisanIndustry from "./aisan-industry.json";
import aisanTechnology from "./aisan-technology.json";
import aisin from "./aisin.json";
import ait from "./ait.json";
import ajinomoto from "./ajinomoto.json";
import ajis from "./ajis.json";
import akasakaDiesels from "./akasaka-diesels.json";
import akatsuki from "./akatsuki.json";
import akatsuki8737 from "./akatsuki-8737.json";
import akatsukiEazima from "./akatsuki-eazima.json";
import akibaHoldings from "./akiba-holdings.json";
import akikawaFoodsAndFarms from "./akikawa-foods-and-farms.json";
import albalink from "./albalink.json";
import albis from "./albis.json";
import alconix from "./alconix.json";
import alfresaHoldings from "./alfresa-holdings.json";
import alinco from "./alinco.json";
import alinkInternet from "./alink-internet.json";
import allAbout from "./all-about.json";
import alleanzaHoldings from "./alleanza-holdings.json";
import alliedArchitects from "./allied-architects.json";
import alliedTelesisHoldings from "./allied-telesis-holdings.json";
import almado from "./almado.json";
import almedio from "./almedio.json";
import almetaxManufacturing from "./almetax-manufacturing.json";
import alpen from "./alpen.json";
import alpha from "./alpha.json";
import alpha4760 from "./alpha-4760.json";
import alphaSystems from "./alpha-systems.json";
import alphapolis from "./alphapolis.json";
import alphapurchase from "./alphapurchase.json";
import alphaxFoodSystem from "./alphax-food-system.json";
import alpsAlpine from "./alps-alpine.json";
import alsok from "./alsok.json";
import alt from "./alt.json";
import altech from "./altech.json";
import altech9972 from "./altech-9972.json";
import altplusinc from "./altplusinc.json";
import alue from "./alue.json";
import amada from "./amada.json";
import amano from "./amano.json";
import amatei from "./amatei.json";
import amaze from "./amaze.json";
import amazia from "./amazia.json";
import ambitionDxHoldings from "./ambition-dx-holdings.json";
import ameKazeTaiyo from "./ame-kaze-taiyo.json";
import amgHoldings from "./amg-holdings.json";
import amifa from "./amifa.json";
import amitaHoldings from "./amita-holdings.json";
import amiya from "./amiya.json";
import amiyakiTei from "./amiyaki-tei.json";
import amvisHoldings from "./amvis-holdings.json";
import anaHoldings from "./ana-holdings.json";
import anabukiKosan from "./anabuki-kosan.json";
import anapHoldings from "./anap-holdings.json";
import andDoHoldings from "./and-do-holdings.json";
import andFactory from "./and-factory.json";
import andStHd from "./and-st-hd.json";
import anestIwata from "./anest-iwata.json";
import anges from "./anges.json";
import anicomHoldings from "./anicom-holdings.json";
import anrakutei from "./anrakutei.json";
import anritsu from "./anritsu.json";
import anshinGuarantorService from "./anshin-guarantor-service.json";
import anycolor from "./anycolor.json";
import anymindGroup from "./anymind-group.json";
import aobaBbt from "./aoba-bbt.json";
import aohata from "./aohata.json";
import aoiElectronics from "./aoi-electronics.json";
import aokiHoldings from "./aoki-holdings.json";
import aoyamaTrading from "./aoyama-trading.json";
import aoyamaZaisanNetworks from "./aoyama-zaisan-networks.json";
import aozoraBank from "./aozora-bank.json";
import aplix from "./aplix.json";
import appbank from "./appbank.json";
import appierGroup from "./appier-group.json";
import appirits from "./appirits.json";
import appleInternational from "./apple-international.json";
import applied from "./applied.json";
import appliedTechnology from "./applied-technology.json";
import aqualine from "./aqualine.json";
import arAdvancedTechnology from "./ar-advanced-technology.json";
import arakawaChemicalIndustries from "./arakawa-chemical-industries.json";
import arata from "./arata.json";
import arayaIndustrial from "./araya-industrial.json";
import arbeitTimes from "./arbeit-times.json";
import architectsStudioJapan from "./architects-studio-japan.json";
import arclands from "./arclands.json";
import arcs from "./arcs.json";
import areHoldings from "./are-holdings.json";
import areaQuest from "./area-quest.json";
import arealink from "./arealink.json";
import arent from "./arent.json";
import argoGraphics from "./argo-graphics.json";
import ariakeJapan from "./ariake-japan.json";
import arigatouServices from "./arigatou-services.json";
import arisawaMfg from "./arisawa-mfg.json";
import arkcore from "./arkcore.json";
import arrPlanner from "./arr-planner.json";
import artVivant from "./art-vivant.json";
import artgreen from "./artgreen.json";
import artience from "./artience.json";
import artizaNetworks from "./artiza-networks.json";
import artnature from "./artnature.json";
import artner from "./artner.json";
import artraGroup from "./artra-group.json";
import asOne from "./as-one.json";
import asPartners from "./as-partners.json";
import asagami from "./asagami.json";
import asahi from "./asahi.json";
import asahiBroadcastingGroupHoldings from "./asahi-broadcasting-group-holdings.json";
import asahiConcreteWorks from "./asahi-concrete-works.json";
import asahiDiamondIndustrial from "./asahi-diamond-industrial.json";
import asahiEitoHoldings from "./asahi-eito-holdings.json";
import asahiGroupHoldings from "./asahi-group-holdings.json";
import asahiIntecc from "./asahi-intecc.json";
import asahiIntelligenceService from "./asahi-intelligence-service.json";
import asahiKagakuKogyo from "./asahi-kagaku-kogyo.json";
import asahiKasei from "./asahi-kasei.json";
import asahiKogyosha from "./asahi-kogyosha.json";
import asahiNet from "./asahi-net.json";
import asahiPrinting from "./asahi-printing.json";
import asahiRubber from "./asahi-rubber.json";
import asahiSeikiManufacturing from "./asahi-seiki-manufacturing.json";
import asahiYukizai from "./asahi-yukizai.json";
import asahimatsuFoods from "./asahimatsu-foods.json";
import asahipen from "./asahipen.json";
import asakaIndustrial from "./asaka-industrial.json";
import asakaRiken from "./asaka-riken.json";
import asakuma from "./asakuma.json";
import asante from "./asante.json";
import asanuma from "./asanuma.json";
import asax from "./asax.json";
import ascentech from "./ascentech.json";
import ascot from "./ascot.json";
import aseedHoldings from "./aseed-holdings.json";
import asgent from "./asgent.json";
import ashimoriIndustry from "./ashimori-industry.json";
import asiaAirSurvey from "./asia-air-survey.json";
import asiaPileHoldings from "./asia-pile-holdings.json";
import asianStar from "./asian-star.json";
import asiaquest from "./asiaquest.json";
import asics from "./asics.json";
import asiro from "./asiro.json";
import asj from "./asj.json";
import aska from "./aska.json";
import askaPharmaceuticalHoldings from "./aska-pharmaceutical-holdings.json";
import askul from "./askul.json";
import asmarq from "./asmarq.json";
import asmo from "./asmo.json";
import asnova from "./asnova.json";
import asoInternational from "./aso-international.json";
import astellasPharma from "./astellas-pharma.json";
import astenaHoldings from "./astena-holdings.json";
import asteria from "./asteria.json";
import asterisk from "./asterisk.json";
import asti from "./asti.json";
import astmax from "./astmax.json";
import astroscaleHoldings from "./astroscale-holdings.json";
import asua from "./asua.json";
import asukanet from "./asukanet.json";
import ateamHoldings from "./ateam-holdings.json";
import atect from "./atect.json";
import atlasTechnologies from "./atlas-technologies.json";
import atled from "./atled.json";
import atomLivinTech from "./atom-livin-tech.json";
import atomix from "./atomix.json";
import atrae from "./atrae.json";
import atsugi from "./atsugi.json";
import aubex from "./aubex.json";
import aucfan from "./aucfan.json";
import aucnet from "./aucnet.json";
import aunConsulting from "./aun-consulting.json";
import autoServer from "./auto-server.json";
import autobacsSeven from "./autobacs-seven.json";
import autowave from "./autowave.json";
import avalData from "./aval-data.json";
import avantGroup from "./avant-group.json";
import avantia from "./avantia.json";
import avex from "./avex.json";
import avic from "./avic.json";
import avilen from "./avilen.json";
import avix from "./avix.json";
import awaPaperAndTechnological from "./awa-paper-and-technological.json";
import axasHoldings from "./axas-holdings.json";
import axelMark from "./axel-mark.json";
import axell from "./axell.json";
import axelspaceHoldings from "./axelspace-holdings.json";
import axialRetailing from "./axial-retailing.json";
import axis from "./axis.json";
import axisConsulting from "./axis-consulting.json";
import axxzia from "./axxzia.json";
import axyz from "./axyz.json";
import azComMaruwaHoldings from "./az-com-maruwa-holdings.json";
import azbil from "./azbil.json";
import azearth from "./azearth.json";
import azoom from "./azoom.json";
import azplanning from "./azplanning.json";
import azumaHouse from "./azuma-house.json";
import azumaShipping from "./azuma-shipping.json";
import bAndP from "./b-and-p.json";
import bLot from "./b-lot.json";
import bR31IceCream from "./b-r-31-ice-cream.json";
import bStyleHoldings from "./b-style-holdings.json";
import babyCalendar from "./baby-calendar.json";
import balmuda from "./balmuda.json";
import balnibarbi from "./balnibarbi.json";
import bandaiNamcoHoldings from "./bandai-namco-holdings.json";
import bandoChemicalIndustries from "./bando-chemical-industries.json";
import bankOfInnovation from "./bank-of-innovation.json";
import bankOfTheRyukyus from "./bank-of-the-ryukyus.json";
import banners from "./banners.json";
import barcos from "./barcos.json";
import baroqueJapan from "./baroque-japan.json";
import base from "./base.json";
import base4481 from "./base-4481.json";
import baseFood from "./base-food.json";
import basic from "./basic.json";
import basis from "./basis.json";
import batonz from "./batonz.json";
import baudroie from "./baudroie.json";
import baycurrent from "./baycurrent.json";
import bbdInitiative from "./bbd-initiative.json";
import bbreakSystems from "./bbreak-systems.json";
import bcc from "./bcc.json";
import beaglee from "./beaglee.json";
import beautyGarage from "./beauty-garage.json";
import beautyKadanHoldings from "./beauty-kadan-holdings.json";
import beenos from "./beenos.json";
import beex from "./beex.json";
import beingHoldings from "./being-holdings.json";
import belc from "./belc.json";
import bellPark from "./bell-park.json";
import bellsystem24Holdings from "./bellsystem24-holdings.json";
import belluna from "./belluna.json";
import bemap from "./bemap.json";
import benefitJapan from "./benefit-japan.json";
import bengo4Com from "./bengo4-com.json";
import bergEarth from "./berg-earth.json";
import besterra from "./besterra.json";
import bestoneCom from "./bestone-com.json";
import betrend from "./betrend.json";
import bewith from "./bewith.json";
import bicCamera from "./bic-camera.json";
import bikeOAndCompany from "./bike-o-and-company.json";
import bikenTechno from "./biken-techno.json";
import billingSystem from "./billing-system.json";
import biprogy from "./biprogy.json";
import birdman from "./birdman.json";
import bitcoinJapan from "./bitcoin-japan.json";
import bizmates from "./bizmates.json";
import bleach from "./bleach.json";
import blueInnovation from "./blue-innovation.json";
import blueZonesHoldings from "./blue-zones-holdings.json";
import bluememe from "./bluememe.json";
import bml from "./bml.json";
import bookingResort from "./booking-resort.json";
import bookoffGroupHoldings from "./bookoff-group-holdings.json";
import bourbon from "./bourbon.json";
import boutiques from "./boutiques.json";
import bpCastrol from "./bp-castrol.json";
import bplats from "./bplats.json";
import brHoldings from "./br-holdings.json";
import brainpad from "./brainpad.json";
import brainsTechnology from "./brains-technology.json";
import brandingTechnology from "./branding-technology.json";
import brangista from "./brangista.json";
import branu from "./branu.json";
import brass from "./brass.json";
import bridgeConsultingGroup from "./bridge-consulting-group.json";
import bridgeInternational from "./bridge-international.json";
import bridgestone from "./bridgestone.json";
import brightpathBiotherapeutics from "./brightpath-biotherapeutics.json";
import broadEnterprise from "./broad-enterprise.json";
import broadMinded from "./broad-minded.json";
import broadbandSecurity from "./broadband-security.json";
import broadbandTower from "./broadband-tower.json";
import broadleaf from "./broadleaf.json";
import broadmedia from "./broadmedia.json";
import broncoBilly from "./bronco-billy.json";
import brotherIndustries from "./brother-industries.json";
import bruno from "./bruno.json";
import bsnMediaHoldings from "./bsn-media-holdings.json";
import btm from "./btm.json";
import buffalo from "./buffalo.json";
import buffalo6676 from "./buffalo-6676.json";
import bullDogSauce from "./bull-dog-sauce.json";
import bunkaShutter from "./bunka-shutter.json";
import bunkeido from "./bunkeido.json";
import bushiroad from "./bushiroad.json";
import businessBrainShowaota from "./business-brain-showaota.json";
import businessCoach from "./business-coach.json";
import businessEngineering from "./business-engineering.json";
import businessOneHoldings from "./business-one-holdings.json";
import buysellTechnologies from "./buysell-technologies.json";
import cBonCosmetics from "./c-bon-cosmetics.json";
import cEManagementIntegratedLaboratory from "./c-e-management-integrated-laboratory.json";
import cIMedical from "./c-i-medical.json";
import cSLumber from "./c-s-lumber.json";
import cUyemuraAndCo from "./c-uyemura-and-co.json";
import cacHoldings from "./cac-holdings.json";
import cacco from "./cacco.json";
import cados from "./cados.json";
import caicaDigital from "./caica-digital.json";
import calbee from "./calbee.json";
import canDo from "./can-do.json";
import canareElectric from "./canare-electric.json";
import canbas from "./canbas.json";
import candeal from "./candeal.json";
import canon from "./canon.json";
import canonElectronics from "./canon-electronics.json";
import canonMarketingJapan from "./canon-marketing-japan.json";
import canox from "./canox.json";
import capcom from "./capcom.json";
import capita from "./capita.json";
import capitalAssetPlanning from "./capital-asset-planning.json";
import carMateMfg from "./car-mate-mfg.json";
import careService from "./care-service.json";
import careTwentyone from "./care-twentyone.json";
import career from "./career.json";
import careerBank from "./career-bank.json";
import careerDesignCenter from "./career-design-center.json";
import careerlink from "./careerlink.json";
import carenet from "./carenet.json";
import carlit from "./carlit.json";
import carnaBiosciences from "./carna-biosciences.json";
import cartaHoldings from "./carta-holdings.json";
import casa from "./casa.json";
import casioComputer from "./casio-computer.json";
import caster from "./caster.json";
import casy from "./casy.json";
import caulis from "./caulis.json";
import caveInteractive from "./cave-interactive.json";
import cawachi from "./cawachi.json";
import cciGroup from "./cci-group.json";
import ccrebAdvisors from "./ccreb-advisors.json";
import cds from "./cds.json";
import ceHoldings from "./ce-holdings.json";
import cedar from "./cedar.json";
import cel from "./cel.json";
import cellseed from "./cellseed.json";
import cellsource from "./cellsource.json";
import celm from "./celm.json";
import celsys from "./celsys.json";
import centralAutomotiveProducts from "./central-automotive-products.json";
import centralForestGroup from "./central-forest-group.json";
import centralGeneralDevelopment from "./central-general-development.json";
import centralGlass from "./central-glass.json";
import centralJapanRailway from "./central-japan-railway.json";
import centralSecurityPatrols from "./central-security-patrols.json";
import centralSports from "./central-sports.json";
import century21RealEstateOfJapan from "./century-21-real-estate-of-japan.json";
import ceres from "./ceres.json";
import cerespo from "./cerespo.json";
import cgsHoldings from "./cgs-holdings.json";
import charle from "./charle.json";
import charmCare from "./charm-care.json";
import chemiproKaseiKaisha from "./chemipro-kasei-kaisha.json";
import chichibuRailway from "./chichibu-railway.json";
import chieru from "./chieru.json";
import chiikishinbunsha from "./chiikishinbunsha.json";
import chikaranomotoHoldings from "./chikaranomoto-holdings.json";
import chimney from "./chimney.json";
import chino from "./chino.json";
import chiomeBioscience from "./chiome-bioscience.json";
import chiyoda8185 from "./chiyoda-8185.json";
import chiyodaIntegre from "./chiyoda-integre.json";
import choei from "./choei.json";
import chofuSeisakusho from "./chofu-seisakusho.json";
import chordiaTherapeutics from "./chordia-therapeutics.json";
import chori from "./chori.json";
import choushimaru from "./choushimaru.json";
import chubuNipponBroadcasting from "./chubu-nippon-broadcasting.json";
import chubuSteelPlate from "./chubu-steel-plate.json";
import chubuSuisan from "./chubu-suisan.json";
import chubushiryo from "./chubushiryo.json";
import chuco from "./chuco.json";
import chudenko from "./chudenko.json";
import chuetsuPulpAndPaper from "./chuetsu-pulp-and-paper.json";
import chugaiMining from "./chugai-mining.json";
import chugaiPharmaceutical from "./chugai-pharmaceutical.json";
import chugaiRo from "./chugai-ro.json";
import chuginFinancialGroup from "./chugin-financial-group.json";
import chugokuMarinePaints from "./chugoku-marine-paints.json";
import chugokukogyo from "./chugokukogyo.json";
import chukyoiyakuhin from "./chukyoiyakuhin.json";
import chuoGyorui from "./chuo-gyorui.json";
import chuoMalleableIron from "./chuo-malleable-iron.json";
import chuoSeisakusho from "./chuo-seisakusho.json";
import chuoSpring from "./chuo-spring.json";
import chuoWarehouse from "./chuo-warehouse.json";
import chuokeizaiShaHoldings from "./chuokeizai-sha-holdings.json";
import cinc from "./cinc.json";
import circlace from "./circlace.json";
import circulation from "./circulation.json";
import citizenWatch from "./citizen-watch.json";
import ckSanEtsu from "./ck-san-etsu.json";
import ckd from "./ckd.json";
import clHoldings from "./cl-holdings.json";
import classico from "./classico.json";
import cleanup from "./cleanup.json";
import clip from "./clip.json";
import clusterTechnology from "./cluster-technology.json";
import cmc from "./cmc.json";
import cmk from "./cmk.json";
import cns from "./cns.json";
import coachA from "./coach-a.json";
import cocaColaBottlersJapanHoldings from "./coca-cola-bottlers-japan-holdings.json";
import cocolive from "./cocolive.json";
import cocolonet from "./cocolonet.json";
import coconala from "./coconala.json";
import cocorport from "./cocorport.json";
import colanTotte from "./colan-totte.json";
import collabos from "./collabos.json";
import colopl from "./colopl.json";
import columbiaWorks from "./columbia-works.json";
import coly from "./coly.json";
import cominix from "./cominix.json";
import commerceOneHoldings from "./commerce-one-holdings.json";
import commseed from "./commseed.json";
import como from "./como.json";
import computerEngineeringAndConsulting from "./computer-engineering-and-consulting.json";
import computerInstituteOfJapan from "./computer-institute-of-japan.json";
import computerManagement from "./computer-management.json";
import comsysHoldings from "./comsys-holdings.json";
import comture from "./comture.json";
import consec from "./consec.json";
import convano from "./convano.json";
import convum from "./convum.json";
import cookbiz from "./cookbiz.json";
import cookpad from "./cookpad.json";
import copa from "./copa.json";
import coproHoldings from "./copro-holdings.json";
import core from "./core.json";
import coreConceptTechnologies from "./core-concept-technologies.json";
import corona from "./corona.json";
import correcHoldings from "./correc-holdings.json";
import cosel from "./cosel.json";
import cosmoBio from "./cosmo-bio.json";
import cosmoEnergyHoldings from "./cosmo-energy-holdings.json";
import cosmosInitia from "./cosmos-initia.json";
import cosmosPharmaceutical from "./cosmos-pharmaceutical.json";
import cota from "./cota.json";
import cotta from "./cotta.json";
import cover from "./cover.json";
import cox from "./cox.json";
import cravia from "./cravia.json";
import cre from "./cre.json";
import creal from "./creal.json";
import create from "./create.json";
import createMedic from "./create-medic.json";
import createRestaurantsHoldings from "./create-restaurants-holdings.json";
import createSdHoldings from "./create-sd-holdings.json";
import creekAndRiver from "./creek-and-river.json";
import creema from "./creema.json";
import creo from "./creo.json";
import cresco from "./cresco.json";
import crestec from "./crestec.json";
import crgHoldings from "./crg-holdings.json";
import criMiddleware from "./cri-middleware.json";
import crooz from "./crooz.json";
import crops from "./crops.json";
import crossCat from "./cross-cat.json";
import crossEHoldings from "./cross-e-holdings.json";
import crossPlus from "./cross-plus.json";
import crossfor from "./crossfor.json";
import crowdworks from "./crowdworks.json";
import csC from "./cs-c.json";
import cssHoldings from "./css-holdings.json";
import ctiEngineering from "./cti-engineering.json";
import cts from "./cts.json";
import cube from "./cube.json";
import cubeSystem from "./cube-system.json";
import cuc from "./cuc.json";
import cuorips from "./cuorips.json";
import curvesHoldings from "./curves-holdings.json";
import cyberSecurityCloud from "./cyber-security-cloud.json";
import cyberagent from "./cyberagent.json";
import cyberbuzz from "./cyberbuzz.json";
import cyberlinks from "./cyberlinks.json";
import cybersolutions from "./cybersolutions.json";
import cyberstepHoldings from "./cyberstep-holdings.json";
import cybertrustJapan from "./cybertrust-japan.json";
import cybozu from "./cybozu.json";
import cyfuseBiomedical from "./cyfuse-biomedical.json";
import cynd from "./cynd.json";
import cypressHoldings from "./cypress-holdings.json";
import dAndM from "./d-and-m.json";
import dISystem from "./d-i-system.json";
import dWesternTherapeuticsInstitute from "./d-western-therapeutics-institute.json";
import daiDan from "./dai-dan.json";
import daiIchiCutterKogyo from "./dai-ichi-cutter-kogyo.json";
import daiIchiLifeHoldings from "./dai-ichi-life-holdings.json";
import daiNipponPrinting from "./dai-nippon-printing.json";
import daiNipponToryo from "./dai-nippon-toryo.json";
import daicel from "./daicel.json";
import daidoKogyo from "./daido-kogyo.json";
import daidoMetal from "./daido-metal.json";
import daidoSignal from "./daido-signal.json";
import daidoSteel from "./daido-steel.json";
import daidoh from "./daidoh.json";
import daieiKankyo from "./daiei-kankyo.json";
import daieisangyo from "./daieisangyo.json";
import daihatsuInfinearthMfg from "./daihatsu-infinearth-mfg.json";
import daihen from "./daihen.json";
import daiho from "./daiho.json";
import daiichi from "./daiichi.json";
import daiichiJitsugyo from "./daiichi-jitsugyo.json";
import daiichiKensetsu from "./daiichi-kensetsu.json";
import daiichiKigensoKagakuKogyo from "./daiichi-kigenso-kagaku-kogyo.json";
import daiichiKoutsuSangyo from "./daiichi-koutsu-sangyo.json";
import daiichiSankyo from "./daiichi-sankyo.json";
import daiichikosho from "./daiichikosho.json";
import daiken from "./daiken.json";
import daikenMedical from "./daiken-medical.json";
import daikiAluminiumIndustry from "./daiki-aluminium-industry.json";
import daikiAxis from "./daiki-axis.json";
import daikinIndustries from "./daikin-industries.json";
import daikoTsusan from "./daiko-tsusan.json";
import daikoXtech from "./daiko-xtech.json";
import daikokuDenki from "./daikoku-denki.json";
import daikokutenbussan from "./daikokutenbussan.json";
import daikokuyaHoldings from "./daikokuya-holdings.json";
import daikyonishikawa from "./daikyonishikawa.json";
import daimaruEnawin from "./daimaru-enawin.json";
import dainichi from "./dainichi.json";
import dainichiseikaColorAndChemicalsMfg from "./dainichiseika-color-and-chemicals-mfg.json";
import daioPaper from "./daio-paper.json";
import dairei from "./dairei.json";
import daisan from "./daisan.json";
import daiseki from "./daiseki.json";
import daisekiEcoSolution from "./daiseki-eco-solution.json";
import daishiHokuetsuFinancialGroup from "./daishi-hokuetsu-financial-group.json";
import daishinChemical from "./daishin-chemical.json";
import daishinku from "./daishinku.json";
import daisho from "./daisho.json";
import daisueConstruction from "./daisue-construction.json";
import daisui from "./daisui.json";
import daisyo from "./daisyo.json";
import daitoChemix from "./daito-chemix.json";
import daitoKoun from "./daito-koun.json";
import daitoPharmaceutical from "./daito-pharmaceutical.json";
import daitoTrustConstruction from "./daito-trust-construction.json";
import daitobo from "./daitobo.json";
import daitron from "./daitron.json";
import daiun from "./daiun.json";
import daiwa from "./daiwa.json";
import daiwaComputer from "./daiwa-computer.json";
import daiwaCycle from "./daiwa-cycle.json";
import daiwaHouseIndustry from "./daiwa-house-industry.json";
import daiwaIndustries from "./daiwa-industries.json";
import daiwaMotorTransportation from "./daiwa-motor-transportation.json";
import daiwaSecuritiesGroup from "./daiwa-securities-group.json";
import daiwaTsushin from "./daiwa-tsushin.json";
import daiwaboHoldings from "./daiwabo-holdings.json";
import dantoHoldings from "./danto-holdings.json";
import dataApplications from "./data-applications.json";
import dataHorizon from "./data-horizon.json";
import datasection from "./datasection.json";
import dawn from "./dawn.json";
import daytona from "./daytona.json";
import dcmHoldings from "./dcm-holdings.json";
import dearLife from "./dear-life.json";
import decollteHoldings from "./decollte-holdings.json";
import defConsulting from "./def-consulting.json";
import delicaFoodsHoldings from "./delica-foods-holdings.json";
import deliveryConsulting from "./delivery-consulting.json";
import delsole from "./delsole.json";
import deltaFlyPharma from "./delta-fly-pharma.json";
import demaeCan from "./demae-can.json";
import dena from "./dena.json";
import denka from "./denka.json";
import denkyoGroupHoldings from "./denkyo-group-holdings.json";
import densan from "./densan.json";
import densanSystemHoldings from "./densan-system-holdings.json";
import denso from "./denso.json";
import dentsuGroup from "./dentsu-group.json";
import dentsuSoken from "./dentsu-soken.json";
import denyo from "./denyo.json";
import designoneJapan from "./designone-japan.json";
import dexerials from "./dexerials.json";
import diNikkoEngineering from "./di-nikko-engineering.json";
import diamondElectricHoldings from "./diamond-electric-holdings.json";
import dic from "./dic.json";
import digitalArts from "./digital-arts.json";
import digitalGrid from "./digital-grid.json";
import digitalHeartsHoldings from "./digital-hearts-holdings.json";
import digitalHoldings from "./digital-holdings.json";
import digitalInformationTechnologies from "./digital-information-technologies.json";
import digitalMediaProfessionals from "./digital-media-professionals.json";
import digitalPlus from "./digital-plus.json";
import digitalift from "./digitalift.json";
import dijetIndustrial from "./dijet-industrial.json";
import dip from "./dip.json";
import directMarketingMix from "./direct-marketing-mix.json";
import disco from "./disco.json";
import disruptors from "./disruptors.json";
import dive from "./dive.json";
import dkk from "./dkk.json";
import dkkToa from "./dkk-toa.json";
import dks from "./dks.json";
import dle from "./dle.json";
import dmSolutions from "./dm-solutions.json";
import dmgMori from "./dmg-mori.json";
import dms from "./dms.json";
import dmw from "./dmw.json";
import dnHoldings from "./dn-holdings.json";
import doshisha from "./doshisha.json";
import doubleStandard from "./double-standard.json";
import doutorNichiresHoldings from "./doutor-nichires-holdings.json";
import dowaHoldings from "./dowa-holdings.json";
import draft from "./draft.json";
import dreamIncubator from "./dream-incubator.json";
import dreamVision from "./dream-vision.json";
import dreamarts from "./dreamarts.json";
import dreambed from "./dreambed.json";
import drecom from "./drecom.json";
import dts from "./dts.json";
import dualtap from "./dualtap.json";
import duskin from "./duskin.json";
import dvx from "./dvx.json";
import dydoGroupHoldings from "./dydo-group-holdings.json";
import dynamicMapPlatform from "./dynamic-map-platform.json";
import dynapac from "./dynapac.json";
import dynic from "./dynic.json";
import eGrand from "./e-grand.json";
import eGuardian from "./e-guardian.json";
import eLogit from "./e-logit.json";
import eSeikatsu from "./e-seikatsu.json";
import eSupportlink from "./e-supportlink.json";
import eagleIndustry from "./eagle-industry.json";
import earlyAge from "./early-age.json";
import earth from "./earth.json";
import earthInfinity from "./earth-infinity.json";
import eastJapanRailway from "./east-japan-railway.json";
import eatAndHoldings from "./eat-and-holdings.json";
import ebara from "./ebara.json";
import ebaraFoodsIndustry from "./ebara-foods-industry.json";
import ebaraJitsugyo from "./ebara-jitsugyo.json";
import ebase from "./ebase.json";
import ebrains from "./ebrains.json";
import echoTrading from "./echo-trading.json";
import ecoS from "./eco-s.json";
import ecologyAndCombustion from "./ecology-and-combustion.json";
import ecomic from "./ecomic.json";
import ecomott from "./ecomott.json";
import econavista from "./econavista.json";
import econos from "./econos.json";
import edia from "./edia.json";
import edion from "./edion.json";
import edp from "./edp.json";
import edulab from "./edulab.json";
import efOn from "./ef-on.json";
import eguarantee from "./eguarantee.json";
import eidai from "./eidai.json";
import eidaiKako from "./eidai-kako.json";
import eikenChemical from "./eiken-chemical.json";
import eikenIndustries from "./eiken-industries.json";
import eisai from "./eisai.json";
import eiwa from "./eiwa.json";
import eizo from "./eizo.json";
import ejHoldings from "./ej-holdings.json";
import ekitanAndCo from "./ekitan-and-co.json";
import elan from "./elan.json";
import elecom from "./elecom.json";
import electricPowerDevelopment from "./electric-power-development.json";
import elements from "./elements.json";
import elevatorCommunications from "./elevator-communications.json";
import elitzHoldings from "./elitz-holdings.json";
import eltes from "./eltes.json";
import emSystems from "./em-systems.json";
import emergencyAssistanceJapan from "./emergency-assistance-japan.json";
import emimen from "./emimen.json";
import emnetJapan from "./emnet-japan.json";
import en from "./en.json";
import enbioHoldings from "./enbio-holdings.json";
import encho from "./encho.json";
import encourageTechnologies from "./encourage-technologies.json";
import endoLighting from "./endo-lighting.json";
import endoManufacturing from "./endo-manufacturing.json";
import enechange from "./enechange.json";
import eneosHoldings from "./eneos-holdings.json";
import enigmo from "./enigmo.json";
import enish from "./enish.json";
import enjin from "./enjin.json";
import enomoto from "./enomoto.json";
import enplas from "./enplas.json";
import enshu from "./enshu.json";
import enshuTruck from "./enshu-truck.json";
import ensuikoSugarRefining from "./ensuiko-sugar-refining.json";
import entrust from "./entrust.json";
import enviproHoldings from "./envipro-holdings.json";
import environmentFriendlyHoldings from "./environment-friendly-holdings.json";
import environmentalControlCenter from "./environmental-control-center.json";
import eole from "./eole.json";
import epco from "./epco.json";
import erex from "./erex.json";
import eriHoldings from "./eri-holdings.json";
import esConJapan from "./es-con-japan.json";
import esNetworks from "./es-networks.json";
import escrowAgentJapan from "./escrow-agent-japan.json";
import eslead from "./eslead.json";
import esol from "./esol.json";
import espec from "./espec.json";
import espoir from "./espoir.json";
import estelleHoldings from "./estelle-holdings.json";
import estic from "./estic.json";
import eternalHospitalityGroup from "./eternal-hospitality-group.json";
import etsGroup from "./ets-group.json";
import eucalia from "./eucalia.json";
import euglena from "./euglena.json";
import eurasiaTravel from "./eurasia-travel.json";
import ewell from "./ewell.json";
import exawizards from "./exawizards.json";
import exciteHoldings from "./excite-holdings.json";
import exedy from "./exedy.json";
import exeoGroup from "./exeo-group.json";
import exmotion from "./exmotion.json";
import extreme from "./extreme.json";
import eyez from "./eyez.json";
import ezakiGlico from "./ezaki-glico.json";
import fAndM from "./f-and-m.json";
import fCC from "./f-c-c.json";
import fCode from "./f-code.json";
import fTech from "./f-tech.json";
import faber from "./faber.json";
import fabricaHoldings from "./fabrica-holdings.json";
import faithnetwork from "./faithnetwork.json";
import falcoHoldings from "./falco-holdings.json";
import faltec from "./faltec.json";
import fanCommunications from "./fan-communications.json";
import fantasista from "./fantasista.json";
import fanuc from "./fanuc.json";
import fastAccounting from "./fast-accounting.json";
import fastFitnessJapan from "./fast-fitness-japan.json";
import fastRetailing from "./fast-retailing.json";
import fbCareService from "./fb-care-service.json";
import fce from "./fce.json";
import fdk from "./fdk.json";
import feedOne from "./feed-one.json";
import feedforceGroup from "./feedforce-group.json";
import felissimo from "./felissimo.json";
import fenwalControlsOfJapan from "./fenwal-controls-of-japan.json";
import ferrotec from "./ferrotec.json";
import festariaHoldings from "./festaria-holdings.json";
import ffriSecurity from "./ffri-security.json";
import fibergate from "./fibergate.json";
import ficha from "./ficha.json";
import fideaHoldings from "./fidea-holdings.json";
import financialPartnersGroup from "./financial-partners-group.json";
import finatextHoldings from "./finatext-holdings.json";
import findex from "./findex.json";
import fineSinter from "./fine-sinter.json";
import fines from "./fines.json";
import fintechGlobal from "./fintech-global.json";
import firstBaking from "./first-baking.json";
import firstBrothers from "./first-brothers.json";
import firstCorporation from "./first-corporation.json";
import firstJuken from "./first-juken.json";
import fisco from "./fisco.json";
import fitEasy from "./fit-easy.json";
import fitcrew from "./fitcrew.json";
import fixer from "./fixer.json";
import fixstars from "./fixstars.json";
import fjNextHoldings from "./fj-next-holdings.json";
import flect from "./flect.json";
import flier from "./flier.json";
import flightSolutions from "./flight-solutions.json";
import flyingGarden from "./flying-garden.json";
import focusSystems from "./focus-systems.json";
import fonfun from "./fonfun.json";
import foodAndLifeCompanies from "./food-and-life-companies.json";
import foodison from "./foodison.json";
import forStartups from "./for-startups.json";
import forcia from "./forcia.json";
import forlife from "./forlife.json";
import forside from "./forside.json";
import forumEngineering from "./forum-engineering.json";
import forval from "./forval.json";
import forvalRealstraight from "./forval-realstraight.json";
import forvalTelecom from "./forval-telecom.json";
import fosterElectric from "./foster-electric.json";
import founderSConsultantsHoldings from "./founder-s-consultants-holdings.json";
import fp from "./fp.json";
import fpPartner from "./fp-partner.json";
import franceBedHoldings from "./france-bed-holdings.json";
import freakoutHoldings from "./freakout-holdings.json";
import freebit from "./freebit.json";
import freee from "./freee.json";
import freesiaMacross from "./freesia-macross.json";
import freund from "./freund.json";
import friendly from "./friendly.json";
import fronteo from "./fronteo.json";
import frontier from "./frontier.json";
import frontierInternational from "./frontier-international.json";
import frontierManagement from "./frontier-management.json";
import frutaFruta from "./fruta-fruta.json";
import ftgroup from "./ftgroup.json";
import fudoTetra from "./fudo-tetra.json";
import fuji from "./fuji.json";
import fuji7605 from "./fuji-7605.json";
import fuji8278 from "./fuji-8278.json";
import fuji8860 from "./fuji-8860.json";
import fujiElectric from "./fuji-electric.json";
import fujiElectricIndustry from "./fuji-electric-industry.json";
import fujiJapan from "./fuji-japan.json";
import fujiKosan from "./fuji-kosan.json";
import fujiKyuko from "./fuji-kyuko.json";
import fujiLatex from "./fuji-latex.json";
import fujiMediaHoldings from "./fuji-media-holdings.json";
import fujiNihon from "./fuji-nihon.json";
import fujiOil from "./fuji-oil.json";
import fujiOil5017 from "./fuji-oil-5017.json";
import fujiOozx from "./fuji-oozx.json";
import fujiPS from "./fuji-p-s.json";
import fujiPharma from "./fuji-pharma.json";
import fujiSealInternational from "./fuji-seal-international.json";
import fujiSeiki from "./fuji-seiki.json";
import fujiSeiko from "./fuji-seiko.json";
import fujiSoft from "./fuji-soft.json";
import fujiUnitedHoldings from "./fuji-united-holdings.json";
import fujiboHoldings from "./fujibo-holdings.json";
import fujicco from "./fujicco.json";
import fujicopian from "./fujicopian.json";
import fujidie from "./fujidie.json";
import fujifilmHoldings from "./fujifilm-holdings.json";
import fujiiSangyo from "./fujii-sangyo.json";
import fujikura from "./fujikura.json";
import fujikuraComposites from "./fujikura-composites.json";
import fujikuraKasei from "./fujikura-kasei.json";
import fujimak from "./fujimak.json";
import fujimi from "./fujimi.json";
import fujioFoodGroup from "./fujio-food-group.json";
import fujipream from "./fujipream.json";
import fujisanMagazineService from "./fujisan-magazine-service.json";
import fujisash from "./fujisash.json";
import fujishoji from "./fujishoji.json";
import fujitaEngineering from "./fujita-engineering.json";
import fujitaKanko from "./fujita-kanko.json";
import fujitec from "./fujitec.json";
import fujitsu from "./fujitsu.json";
import fujitsuGeneral from "./fujitsu-general.json";
import fujix from "./fujix.json";
import fujiya from "./fujiya.json";
import fukoku from "./fukoku.json";
import fukuda from "./fukuda.json";
import fukudaDenshi from "./fukuda-denshi.json";
import fukuiComputerHoldings from "./fukui-computer-holdings.json";
import fukuokaFinancialGroup from "./fukuoka-financial-group.json";
import fukushimaPrinting from "./fukushima-printing.json";
import fukutomeMeatPackers from "./fukutome-meat-packers.json";
import fukuviChemicalIndustry from "./fukuvi-chemical-industry.json";
import fukuyamaTransporting from "./fukuyama-transporting.json";
import fullcastHoldings from "./fullcast-holdings.json";
import fuller from "./fuller.json";
import fulltech from "./fulltech.json";
import fuluhashiEpo from "./fuluhashi-epo.json";
import fumakilla from "./fumakilla.json";
import funaiSokenHoldings from "./funai-soken-holdings.json";
import fundCreationGroup from "./fund-creation-group.json";
import fundely from "./fundely.json";
import fundinno from "./fundinno.json";
import funpep from "./funpep.json";
import fureasu from "./fureasu.json";
import furubayashiShiko from "./furubayashi-shiko.json";
import furukawa from "./furukawa.json";
import furukawaElectric from "./furukawa-electric.json";
import furunoElectric from "./furuno-electric.json";
import furuyaMetal from "./furuya-metal.json";
import furyu from "./furyu.json";
import fushikiKairikuUnso from "./fushiki-kairiku-unso.json";
import fusic from "./fusic.json";
import fusion from "./fusion.json";
import fusoChemical from "./fuso-chemical.json";
import fusoDentsu from "./fuso-dentsu.json";
import fusoPharmaceuticalIndustries from "./fuso-pharmaceutical-industries.json";
import futaba from "./futaba.json";
import futabaIndustrial from "./futaba-industrial.json";
import future from "./future.json";
import futureInnovationGroup from "./future-innovation-group.json";
import futureLinkNetwork from "./future-link-network.json";
import fuvaBrain from "./fuva-brain.json";
import fuyoGeneralLease from "./fuyo-general-lease.json";
import g7Holdings from "./g-7-holdings.json";
import gFactory from "./g-factory.json";
import gNext from "./g-next.json";
import gTekt from "./g-tekt.json";
import gThreeHoldings from "./g-three-holdings.json";
import gaTechnologies from "./ga-technologies.json";
import gaiax from "./gaiax.json";
import gakkenHoldings from "./gakken-holdings.json";
import gakkyusha from "./gakkyusha.json";
import gakujo from "./gakujo.json";
import gala from "./gala.json";
import galilei from "./galilei.json";
import gamecardHoldings from "./gamecard-holdings.json";
import gamewith from "./gamewith.json";
import garden from "./garden.json";
import gdepAdvance from "./gdep-advance.json";
import gecoss from "./gecoss.json";
import geechs from "./geechs.json";
import genda from "./genda.json";
import gendaiAgency from "./gendai-agency.json";
import generalOyster from "./general-oyster.json";
import generalPacker from "./general-packer.json";
import generationPass from "./generation-pass.json";
import genetec from "./genetec.json";
import genkiGlobalDiningConcepts from "./genki-global-dining-concepts.json";
import genkyDrugstores from "./genky-drugstores.json";
import genova from "./genova.json";
import geoHoldings from "./geo-holdings.json";
import geocode from "./geocode.json";
import geoliveGroup from "./geolive-group.json";
import geolocationTechnology from "./geolocation-technology.json";
import geomatec from "./geomatec.json";
import geostr from "./geostr.json";
import giftHoldings from "./gift-holdings.json";
import giftee from "./giftee.json";
import gifuLandscapeArchitect from "./gifu-landscape-architect.json";
import gigWorks from "./gig-works.json";
import giken from "./giken.json";
import gikenHoldings from "./giken-holdings.json";
import gimic from "./gimic.json";
import ginzaRenoir from "./ginza-renoir.json";
import gixo from "./gixo.json";
import gladCube from "./glad-cube.json";
import globalCommunicationPlanning from "./global-communication-planning.json";
import globalDining from "./global-dining.json";
import globalInformation from "./global-information.json";
import globalKids from "./global-kids.json";
import globalLinkManagement from "./global-link-management.json";
import globalSecurityExperts from "./global-security-experts.json";
import globalStyle from "./global-style.json";
import globalway from "./globalway.json";
import globeIng from "./globe-ing.json";
import globee from "./globee.json";
import globeride from "./globeride.json";
import gloe from "./gloe.json";
import glomeHoldings from "./glome-holdings.json";
import glory from "./glory.json";
import gltechnoHoldings from "./gltechno-holdings.json";
import gmb from "./gmb.json";
import gmoCommerce from "./gmo-commerce.json";
import gmoFinancialGate from "./gmo-financial-gate.json";
import gmoFinancialHoldings from "./gmo-financial-holdings.json";
import gmoGlobalsignHoldings from "./gmo-globalsign-holdings.json";
import gmoInternet from "./gmo-internet.json";
import gmoInternetGroup from "./gmo-internet-group.json";
import gmoMedia from "./gmo-media.json";
import gmoPaymentGateway from "./gmo-payment-gateway.json";
import gmoPepabo from "./gmo-pepabo.json";
import gmoProductPlatform from "./gmo-product-platform.json";
import gmoTech from "./gmo-tech.json";
import gmoTechHoldings from "./gmo-tech-holdings.json";
import gniGroup from "./gni-group.json";
import go from "./go.json";
import godoSteel from "./godo-steel.json";
import gokurakuyuHoldings from "./gokurakuyu-holdings.json";
import goldcrest from "./goldcrest.json";
import goldwin from "./goldwin.json";
import golfDigestOnline from "./golf-digest-online.json";
import golfDo from "./golf-do.json";
import goodComAsset from "./good-com-asset.json";
import goodLife from "./good-life.json";
import gooddaysHoldings from "./gooddays-holdings.json";
import goodpatch from "./goodpatch.json";
import gourmetKineya from "./gourmet-kineya.json";
import grandes from "./grandes.json";
import grandyHouse from "./grandy-house.json";
import graphiteDesign from "./graphite-design.json";
import grcs from "./grcs.json";
import greeHoldings from "./gree-holdings.json";
import greenCrossHoldings from "./green-cross-holdings.json";
import greenEarthInstitute from "./green-earth-institute.json";
import greenMonster from "./green-monster.json";
import greenbee from "./greenbee.json";
import greenenergyAndCompany from "./greenenergy-and-company.json";
import greenlandResort from "./greenland-resort.json";
import greens from "./greens.json";
import grems from "./grems.json";
import grid from "./grid.json";
import growthXpartners from "./growth-xpartners.json";
import gsYuasa from "./gs-yuasa.json";
import gsi from "./gsi.json";
import gsiCreos from "./gsi-creos.json";
import gumi from "./gumi.json";
import gunEiChemicalIndustry from "./gun-ei-chemical-industry.json";
import gunghoOnlineEntertainment from "./gungho-online-entertainment.json";
import gunosy from "./gunosy.json";
import gunze from "./gunze.json";
import gurunavi from "./gurunavi.json";
import gvaTech from "./gva-tech.json";
import gyet from "./gyet.json";
import hIS from "./h-i-s.json";
import hOne from "./h-one.json";
import hUGroupHoldings from "./h-u-group-holdings.json";
import h2oRetailing from "./h2o-retailing.json";
import habaLaboratories from "./haba-laboratories.json";
import hachiBan from "./hachi-ban.json";
import hachijuniNaganoBank from "./hachijuni-nagano-bank.json";
import hagiharaIndustries from "./hagihara-industries.json";
import hagiwaraElectricHoldings from "./hagiwara-electric-holdings.json";
import hagoromoFoods from "./hagoromo-foods.json";
import hakudo from "./hakudo.json";
import hakuhodoDyHoldings from "./hakuhodo-dy-holdings.json";
import hakuten from "./hakuten.json";
import hakuto from "./hakuto.json";
import hakuyosha from "./hakuyosha.json";
import halmekHoldings from "./halmek-holdings.json";
import halows from "./halows.json";
import hamaiIndustries from "./hamai-industries.json";
import hamakyorex from "./hamakyorex.json";
import hamamatsuPhotonics from "./hamamatsu-photonics.json";
import hamayuu from "./hamayuu.json";
import hamee from "./hamee.json";
import hammock from "./hammock.json";
import hanatourJapan from "./hanatour-japan.json";
import handsman from "./handsman.json";
import hankyuHanshinHoldings from "./hankyu-hanshin-holdings.json";
import hanwa from "./hanwa.json";
import hanwaHomeS from "./hanwa-home-s.json";
import happinessAndD from "./happiness-and-d.json";
import happinet from "./happinet.json";
import haradaIndustry from "./harada-industry.json";
import hardOff from "./hard-off.json";
import harimaBStem from "./harima-b-stem.json";
import harimaChemicalsGroup from "./harima-chemicals-group.json";
import harimaKyowa from "./harima-kyowa.json";
import harmonicDriveSystems from "./harmonic-drive-systems.json";
import haruyamaHoldings from "./haruyama-holdings.json";
import hasegawa from "./hasegawa.json";
import haseko from "./haseko.json";
import hashimotoSogyoHoldings from "./hashimoto-sogyo-holdings.json";
import hatchWork from "./hatch-work.json";
import hatena from "./hatena.json";
import hatsuhoShouji from "./hatsuho-shouji.json";
import havix from "./havix.json";
import hayashikaneSangyo from "./hayashikane-sangyo.json";
import hazamaAndo from "./hazama-ando.json";
import headwaters from "./headwaters.json";
import healios from "./healios.json";
import heartseed from "./heartseed.json";
import heianCeremonyService from "./heian-ceremony-service.json";
import heiwa from "./heiwa.json";
import heiwaPaper from "./heiwa-paper.json";
import heiwaRealEstate from "./heiwa-real-estate.json";
import heiwado from "./heiwado.json";
import heliosTechnoHolding from "./helios-techno-holding.json";
import hennge from "./hennge.json";
import hephaist from "./hephaist.json";
import heroz from "./heroz.json";
import hiLex from "./hi-lex.json";
import hibino from "./hibino.json";
import hibiyaEngineering from "./hibiya-engineering.json";
import hidayHidaka from "./hiday-hidaka.json";
import higashiHoldings from "./higashi-holdings.json";
import higashimaru from "./higashimaru.json";
import hikariBusinessForm from "./hikari-business-form.json";
import hikariFoodService from "./hikari-food-service.json";
import hikariHeightsVarus from "./hikari-heights-varus.json";
import hikariTsushin from "./hikari-tsushin.json";
import himacs from "./himacs.json";
import himaraya from "./himaraya.json";
import hinoMotors7205 from "./hino-motors-7205.json";
import hiokiEE from "./hioki-e-e.json";
import hip from "./hip.json";
import hiraga from "./hiraga.json";
import hirakawaHewtech from "./hirakawa-hewtech.json";
import hiraki from "./hiraki.json";
import hiramatsu from "./hiramatsu.json";
import hiranoTecseed from "./hirano-tecseed.json";
import hirata from "./hirata.json";
import hirayamaHoldings from "./hirayama-holdings.json";
import hiroginHoldings from "./hirogin-holdings.json";
import hiroseElectric from "./hirose-electric.json";
import hiroseTusyo from "./hirose-tusyo.json";
import hiroshimaElectricRailway from "./hiroshima-electric-railway.json";
import hiroshimaGas from "./hiroshima-gas.json";
import hirotaGroupHoldings from "./hirota-group-holdings.json";
import hisakaWorks from "./hisaka-works.json";
import hisamitsuPharmaceutical from "./hisamitsu-pharmaceutical.json";
import hit from "./hit.json";
import hitachi from "./hitachi.json";
import hitachiConstructionMachinery from "./hitachi-construction-machinery.json";
import hitoCommunicationsHoldings from "./hito-communications-holdings.json";
import hitoToHitoHoldings from "./hito-to-hito-holdings.json";
import hitomile from "./hitomile.json";
import hks from "./hks.json";
import hmcomm from "./hmcomm.json";
import hob from "./hob.json";
import hobonichi from "./hobonichi.json";
import hochiki from "./hochiki.json";
import hodenSeimitsuKakoKenkyusho from "./hoden-seimitsu-kako-kenkyusho.json";
import hodogayaChemical from "./hodogaya-chemical.json";
import hogyMedical from "./hogy-medical.json";
import hokkaidenko from "./hokkaidenko.json";
import hokkaidoChuoBus from "./hokkaido-chuo-bus.json";
import hokkaidoCocaColaBottling from "./hokkaido-coca-cola-bottling.json";
import hokkaidoGas from "./hokkaido-gas.json";
import hokkanHoldings from "./hokkan-holdings.json";
import hokkoChemicalIndustry from "./hokko-chemical-industry.json";
import hokuetsu from "./hokuetsu.json";
import hokuetsuMetal from "./hokuetsu-metal.json";
import hokuhokuFinancialGroup from "./hokuhoku-financial-group.json";
import hokurikuElectricIndustry from "./hokuriku-electric-industry.json";
import hokurikuElectricPower from "./hokuriku-electric-power.json";
import hokurikuElectricalConstruction from "./hokuriku-electrical-construction.json";
import hokurikuGas from "./hokuriku-gas.json";
import hokuryo from "./hokuryo.json";
import hokushin from "./hokushin.json";
import hokuto from "./hokuto.json";
import hokuyakuTakeyamaHoldings from "./hokuyaku-takeyama-holdings.json";
import hokuyuLucky from "./hokuyu-lucky.json";
import homePosition from "./home-position.json";
import honda from "./honda.json";
import honeysHoldings from "./honeys-holdings.json";
import honyakuCenter from "./honyaku-center.json";
import hoosiersHoldings from "./hoosiers-holdings.json";
import hope from "./hope.json";
import horai from "./horai.json";
import horiba from "./horiba.json";
import horiifoodservice from "./horiifoodservice.json";
import hoshiIryoSanki from "./hoshi-iryo-sanki.json";
import hoshizaki from "./hoshizaki.json";
import hosiden from "./hosiden.json";
import hosokawaMicron from "./hosokawa-micron.json";
import hosoyaPyroEngineering from "./hosoya-pyro-engineering.json";
import hotelNewgrand from "./hotel-newgrand.json";
import hotlandHoldings from "./hotland-holdings.json";
import hotman from "./hotman.json";
import hottoLink from "./hotto-link.json";
import houseFoodsGroup from "./house-foods-group.json";
import houseOfRose from "./house-of-rose.json";
import housefreedom from "./housefreedom.json";
import housei from "./housei.json";
import howaMachinery from "./howa-machinery.json";
import howtelevision from "./howtelevision.json";
import hpcSystems from "./hpc-systems.json";
import hsHoldings from "./hs-holdings.json";
import hub from "./hub.json";
import hulic from "./hulic.json";
import humanCreationHoldings from "./human-creation-holdings.json";
import humanHoldings from "./human-holdings.json";
import humanMade from "./human-made.json";
import humanMetabolomeTechnologies from "./human-metabolome-technologies.json";
import humanTechnologies from "./human-technologies.json";
import hurxley from "./hurxley.json";
import hutzper from "./hutzper.json";
import hybridTechnologies from "./hybrid-technologies.json";
import hyokiKaiunKaisha from "./hyoki-kaiun-kaisha.json";
import hyper from "./hyper.json";
import hyugaPrimaryCare from "./hyuga-primary-care.json";
import iAGroup from "./i-a-group.json";
import iCubedSystems from "./i-cubed-systems.json";
import iFreekMobile from "./i-freek-mobile.json";
import iGridSolutions from "./i-grid-solutions.json";
import iLl from "./i-ll.json";
import iMobile from "./i-mobile.json";
import iNe from "./i-ne.json";
import iNet from "./i-net.json";
import iPlug from "./i-plug.json";
import iXKnowledge from "./i-x-knowledge.json";
import iaceTravel from "./iace-travel.json";
import ibiden from "./ibiden.json";
import ibis from "./ibis.json";
import ibj from "./ibj.json";
import ibokin from "./ibokin.json";
import ic from "./ic.json";
import iceco from "./iceco.json";
import ichibanya from "./ichibanya.json";
import ichigo from "./ichigo.json";
import ichikawa from "./ichikawa.json";
import ichiken from "./ichiken.json";
import ichikohIndustries from "./ichikoh-industries.json";
import ichikura from "./ichikura.json";
import ichimasaKamaboko from "./ichimasa-kamaboko.json";
import ichinenHoldings from "./ichinen-holdings.json";
import ichishinHoldings from "./ichishin-holdings.json";
import ichiyoshiSecurities from "./ichiyoshi-securities.json";
import icom from "./icom.json";
import idHoldings from "./id-holdings.json";
import ideaConsultants from "./idea-consultants.json";
import idec from "./idec.json";
import idemitsuKosan from "./idemitsu-kosan.json";
import idom from "./idom.json";
import ifisJapan from "./ifis-japan.json";
import ifujiSangyo from "./ifuji-sangyo.json";
import igPort from "./ig-port.json";
import ihi from "./ihi.json";
import iid from "./iid.json";
import iidaGroupHoldings from "./iida-group-holdings.json";
import iinoKaiunKaisha from "./iino-kaiun-kaisha.json";
import ikHoldings from "./ik-holdings.json";
import ikegamiTsushinki from "./ikegami-tsushinki.json";
import ikkHoldings from "./ikk-holdings.json";
import ikkaHoldings from "./ikka-holdings.json";
import ikuyo from "./ikuyo.json";
import imageInformation from "./image-information.json";
import imageMagic from "./image-magic.json";
import imageone from "./imageone.json";
import imagicaGroup from "./imagica-group.json";
import imagineer from "./imagineer.json";
import imasenElectricIndustrial from "./imasen-electric-industrial.json";
import immunoBiologicalLaboratories from "./immuno-biological-laboratories.json";
import imperialHotel from "./imperial-hotel.json";
import impressHoldings from "./impress-holdings.json";
import imuraAndCo from "./imura-and-co.json";
import imurayaGroup from "./imuraya-group.json";
import imv from "./imv.json";
import inabaDenkiSangyo from "./inaba-denki-sangyo.json";
import inabaSeisakusho from "./inaba-seisakusho.json";
import inabataAndCo from "./inabata-and-co.json";
import inboundPlatform from "./inbound-platform.json";
import inboundTech from "./inbound-tech.json";
import inclusiveHoldings from "./inclusive-holdings.json";
import ines from "./ines.json";
import inest from "./inest.json";
import infcurion from "./infcurion.json";
import infomart from "./infomart.json";
import infonet from "./infonet.json";
import inforich from "./inforich.json";
import informationPlanning from "./information-planning.json";
import informationStrategyAndTechnology from "./information-strategy-and-technology.json";
import informetis from "./informetis.json";
import infroneerHoldings from "./infroneer-holdings.json";
import ings from "./ings.json";
import innotech from "./innotech.json";
import innovation from "./innovation.json";
import innovationHoldings from "./innovation-holdings.json";
import inpex from "./inpex.json";
import insight from "./insight.json";
import insource from "./insource.json";
import inspec from "./inspec.json";
import instituteForQShuPioneersOfSpace from "./institute-for-q-shu-pioneers-of-space.json";
import institutionForAGlobalSociety from "./institution-for-a-global-society.json";
import intageHoldings from "./intage-holdings.json";
import integral from "./integral.json";
import integratedDesignAndEngineeringHoldings from "./integrated-design-and-engineering-holdings.json";
import integroup from "./integroup.json";
import intellex from "./intellex.json";
import intellexHoldings from "./intellex-holdings.json";
import intelligentWave from "./intelligent-wave.json";
import interAction from "./inter-action.json";
import interfactory from "./interfactory.json";
import interlifeHoldings from "./interlife-holdings.json";
import intermestic from "./intermestic.json";
import internationalConglomerateOfDistributionForAutomobileHoldings from "./international-conglomerate-of-distribution-for-automobile-holdings.json";
import internetInfinity from "./internet-infinity.json";
import internetInitiativeJapan from "./internet-initiative-japan.json";
import internetworkingAndBroadbandConsulting from "./internetworking-and-broadband-consulting.json";
import interspace from "./interspace.json";
import intertrade from "./intertrade.json";
import interworksConfidence from "./interworks-confidence.json";
import intimateMerger from "./intimate-merger.json";
import intloop from "./intloop.json";
import intrance from "./intrance.json";
import inuiGlobalLogistics from "./inui-global-logistics.json";
import inunekoSeikatsu from "./inuneko-seikatsu.json";
import ips from "./ips.json";
import ipsHoldings from "./ips-holdings.json";
import irJapanHoldings from "./ir-japan-holdings.json";
import iridge from "./iridge.json";
import irisoElectronics from "./iriso-electronics.json";
import irrc from "./irrc.json";
import isamuPaint from "./isamu-paint.json";
import isb from "./isb.json";
import iseChemicals from "./ise-chemicals.json";
import isekiAndCo from "./iseki-and-co.json";
import isetanMitsukoshiHoldings from "./isetan-mitsukoshi-holdings.json";
import isewanTerminalService from "./isewan-terminal-service.json";
import ishiharaChemical from "./ishihara-chemical.json";
import ishiharaSangyoKaisha from "./ishihara-sangyo-kaisha.json";
import ishiiFood from "./ishii-food.json";
import ishiiHyoki from "./ishii-hyoki.json";
import ishikawaSeisakusho from "./ishikawa-seisakusho.json";
import ishin from "./ishin.json";
import ishizukaGlass from "./ishizuka-glass.json";
import ispace from "./ispace.json";
import istyle from "./istyle.json";
import isuzuMotors from "./isuzu-motors.json";
import itamiarts from "./itamiarts.json";
import itfor from "./itfor.json";
import itmedia from "./itmedia.json";
import itoEn from "./ito-en.json";
import itoYogyo from "./ito-yogyo.json";
import itochu from "./itochu.json";
import itochuEnex from "./itochu-enex.json";
import itochuShokuhin from "./itochu-shokuhin.json";
import itohamYonekyuHoldings from "./itoham-yonekyu-holdings.json";
import itoki from "./itoki.json";
import itokuro from "./itokuro.json";
import itsumo from "./itsumo.json";
import iwabuchi from "./iwabuchi.json";
import iwaicosmoHoldings from "./iwaicosmo-holdings.json";
import iwaki from "./iwaki.json";
import iwatani from "./iwatani.json";
import iwatsukaConfectionery from "./iwatsuka-confectionery.json";
import iyoginHoldings from "./iyogin-holdings.json";
import izawaTowel from "./izawa-towel.json";
import izuShabotenResort from "./izu-shaboten-resort.json";
import izumi from "./izumi.json";
import izutsuya from "./izutsuya.json";
import jET from "./j-e-t.json";
import jEscomHoldings from "./j-escom-holdings.json";
import jFrontRetailing from "./j-front-retailing.json";
import jFrontier from "./j-frontier.json";
import jHoldings from "./j-holdings.json";
import jLease from "./j-lease.json";
import jMax from "./j-max.json";
import jOilMills from "./j-oil-mills.json";
import jSB from "./j-s-b.json";
import jStream from "./j-stream.json";
import jTrust from "./j-trust.json";
import jacRecruitment from "./jac-recruitment.json";
import jaccs from "./jaccs.json";
import jadeGroup from "./jade-group.json";
import jafcoGroup from "./jafco-group.json";
import jaic from "./jaic.json";
import jalcoHoldings from "./jalco-holdings.json";
import jamco from "./jamco.json";
import janis from "./janis.json";
import janome from "./janome.json";
import japanAirlines from "./japan-airlines.json";
import japanAirportTerminal from "./japan-airport-terminal.json";
import japanAnimalReferralMedicalCenter from "./japan-animal-referral-medical-center.json";
import japanAsiaInvestment from "./japan-asia-investment.json";
import japanAviationElectronicsIndustry from "./japan-aviation-electronics-industry.json";
import japanBusinessSystems from "./japan-business-systems.json";
import japanCashMachine from "./japan-cash-machine.json";
import japanCommunications from "./japan-communications.json";
import japanCraftHoldings from "./japan-craft-holdings.json";
import japanCreativePlatformGroup from "./japan-creative-platform-group.json";
import japanDataScienceConsortium from "./japan-data-science-consortium.json";
import japanEcosystem from "./japan-ecosystem.json";
import japanElectronicMaterials from "./japan-electronic-materials.json";
import japanElevatorServiceHoldings from "./japan-elevator-service-holdings.json";
import japanEngine from "./japan-engine.json";
import japanExchangeGroup from "./japan-exchange-group.json";
import japanEyewearHoldings from "./japan-eyewear-holdings.json";
import japanFoundationEngineering from "./japan-foundation-engineering.json";
import japanHospiceHoldings from "./japan-hospice-holdings.json";
import japanInsulation from "./japan-insulation.json";
import japanInvestmentAdviser from "./japan-investment-adviser.json";
import japanLifeline from "./japan-lifeline.json";
import japanLogisticSystems from "./japan-logistic-systems.json";
import japanMAndASolution from "./japan-m-and-a-solution.json";
import japanMaterial from "./japan-material.json";
import japanMedicalDynamicMarketing from "./japan-medical-dynamic-marketing.json";
import japanOilTransportation from "./japan-oil-transportation.json";
import japanPcService from "./japan-pc-service.json";
import japanPetroleumExploration from "./japan-petroleum-exploration.json";
import japanPostBank from "./japan-post-bank.json";
import japanPostHoldings from "./japan-post-holdings.json";
import japanPowerFastening from "./japan-power-fastening.json";
import japanProcessDevelopment from "./japan-process-development.json";
import japanPropertyManagementCenter from "./japan-property-management-center.json";
import japanProptech from "./japan-proptech.json";
import japanPureChemical from "./japan-pure-chemical.json";
import japanRelianceService from "./japan-reliance-service.json";
import japanResistorMfg from "./japan-resistor-mfg.json";
import japanSecuritiesFinance from "./japan-securities-finance.json";
import japanSystemTechniques from "./japan-system-techniques.json";
import japanSystembank from "./japan-systembank.json";
import japanTissueEngineering from "./japan-tissue-engineering.json";
import japanTobacco from "./japan-tobacco.json";
import japanTranscity from "./japan-transcity.json";
import japanWarrantySupport from "./japan-warranty-support.json";
import japaniace from "./japaniace.json";
import jason from "./jason.json";
import jbEleven from "./jb-eleven.json";
import jbccHoldings from "./jbcc-holdings.json";
import jcrPharmaceuticals from "./jcr-pharmaceuticals.json";
import jcu from "./jcu.json";
import jdc from "./jdc.json";
import jedat from "./jedat.json";
import jellyBeansGroup from "./jelly-beans-group.json";
import jenoba from "./jenoba.json";
import jeol from "./jeol.json";
import jescoHoldings from "./jesco-holdings.json";
import jfeHoldings from "./jfe-holdings.json";
import jfeSystems from "./jfe-systems.json";
import jflaHoldings from "./jfla-holdings.json";
import jgcHoldings from "./jgc-holdings.json";
import jibannetHoldings from "./jibannet-holdings.json";
import jichodo from "./jichodo.json";
import jigJp from "./jig-jp.json";
import jigSaw from "./jig-saw.json";
import jimotoHoldings from "./jimoto-holdings.json";
import jimoty from "./jimoty.json";
import jinjib from "./jinjib.json";
import jinsHoldings from "./jins-holdings.json";
import jinushi from "./jinushi.json";
import jkHoldings from "./jk-holdings.json";
import jmHoldings from "./jm-holdings.json";
import jmacsJapan from "./jmacs-japan.json";
import jmc from "./jmc.json";
import jmdc from "./jmdc.json";
import jms from "./jms.json";
import johnanAcademicPreparatoryInstitute from "./johnan-academic-preparatory-institute.json";
import jorudan from "./jorudan.json";
import joshin from "./joshin.json";
import joyfulHonda from "./joyful-honda.json";
import joyfull from "./joyfull.json";
import jpHoldings from "./jp-holdings.json";
import jrc from "./jrc.json";
import jsh from "./jsh.json";
import jsp from "./jsp.json";
import jss from "./jss.json";
import jtec from "./jtec.json";
import jtec3446 from "./jtec-3446.json";
import jtekt from "./jtekt.json";
import jtp from "./jtp.json";
import juki from "./juki.json";
import juntendo from "./juntendo.json";
import jurokuFinancialGroup from "./juroku-financial-group.json";
import justplannig from "./justplannig.json";
import justsystems from "./justsystems.json";
import jvckenwood from "./jvckenwood.json";
import jxAdvancedMetals from "./jx-advanced-metals.json";
import kAndAmpOEnergyGroup from "./k-and-amp-o-energy-group.json";
import kPharma from "./k-pharma.json";
import kRS from "./k-r-s.json";
import kSHoldings from "./k-s-holdings.json";
import kUno from "./k-uno.json";
import kabukiZa from "./kabuki-za.json";
import kadokawa from "./kadokawa.json";
import kadoyaSesameMills from "./kadoya-sesame-mills.json";
import kagaElectronics from "./kaga-electronics.json";
import kagome from "./kagome.json";
import kaihan from "./kaihan.json";
import kainosLaboratories from "./kainos-laboratories.json";
import kairikiya from "./kairikiya.json";
import kaitoriOkoku from "./kaitori-okoku.json";
import kaizenPlatform from "./kaizen-platform.json";
import kajiTechnology from "./kaji-technology.json";
import kajima from "./kajima.json";
import kakakuCom from "./kakaku-com.json";
import kakenPharmaceutical from "./kaken-pharmaceutical.json";
import kakiyasuHonten from "./kakiyasu-honten.json";
import kamakuraShinsho from "./kamakura-shinsho.json";
import kamedaSeika from "./kameda-seika.json";
import kamei from "./kamei.json";
import kamigumi from "./kamigumi.json";
import kanNanmaru from "./kan-nanmaru.json";
import kanaden from "./kanaden.json";
import kanadevia from "./kanadevia.json";
import kanagawaChuoKotsu from "./kanagawa-chuo-kotsu.json";
import kanameKogyo from "./kaname-kogyo.json";
import kanamicNetwork from "./kanamic-network.json";
import kanamoto from "./kanamoto.json";
import kandaHoldings from "./kanda-holdings.json";
import kandaTsushinki from "./kanda-tsushinki.json";
import kandenko from "./kandenko.json";
import kanefusa from "./kanefusa.json";
import kaneka from "./kaneka.json";
import kanekoSeeds from "./kaneko-seeds.json";
import kanematsu from "./kanematsu.json";
import kanematsuEngineering from "./kanematsu-engineering.json";
import kanemi from "./kanemi.json";
import kanemitsu from "./kanemitsu.json";
import kaneso from "./kaneso.json";
import kanmonkai from "./kanmonkai.json";
import kanro from "./kanro.json";
import kansaiPaint from "./kansai-paint.json";
import kanseki from "./kanseki.json";
import kantoDenkaKogyo from "./kanto-denka-kogyo.json";
import kantsuHdco from "./kantsu-hdco.json";
import kao from "./kao.json";
import kappaCreate from "./kappa-create.json";
import karadanote from "./karadanote.json";
import karula from "./karula.json";
import kasaiKogyo from "./kasai-kogyo.json";
import kasumigasekiCapital from "./kasumigaseki-capital.json";
import katakuraAndCoOpAgri from "./katakura-and-co-op-agri.json";
import katakuraIndustries from "./katakura-industries.json";
import katitas from "./katitas.json";
import katoSangyo from "./kato-sangyo.json";
import katoWorks from "./kato-works.json";
import katsuragawaElectric from "./katsuragawa-electric.json";
import kawadaTechnologies from "./kawada-technologies.json";
import kawaden from "./kawaden.json";
import kawagishiBridgeWorks from "./kawagishi-bridge-works.json";
import kawaguchiChemicalIndustry from "./kawaguchi-chemical-industry.json";
import kawaiMusicalInstrumentsManufacturing from "./kawai-musical-instruments-manufacturing.json";
import kawakamiPaintMfg from "./kawakami-paint-mfg.json";
import kawanishiWarehouse from "./kawanishi-warehouse.json";
import kawasakiAndCo from "./kawasaki-and-co.json";
import kawasakiGeologicalEngineering from "./kawasaki-geological-engineering.json";
import kawasakiHeavyIndustries from "./kawasaki-heavy-industries.json";
import kawasakiKisenKaisha from "./kawasaki-kisen-kaisha.json";
import kawasakiSetsubiKogyo from "./kawasaki-setsubi-kogyo.json";
import kawaseComputerSupplies from "./kawase-computer-supplies.json";
import kawataMfg from "./kawata-mfg.json";
import kayac from "./kayac.json";
import kddi from "./kddi.json";
import keeperTechnicalLaboratory from "./keeper-technical-laboratory.json";
import keifukuElectricRailroad from "./keifuku-electric-railroad.json";
import keihanHoldings from "./keihan-holdings.json";
import keihanshinBuilding from "./keihanshin-building.json";
import keikyu from "./keikyu.json";
import keio from "./keio.json";
import keiseiElectricRailway from "./keisei-electric-railway.json";
import keiwa from "./keiwa.json";
import keiyoGas from "./keiyo-gas.json";
import kel from "./kel.json";
import kenkoMayonnaise from "./kenko-mayonnaise.json";
import kensoh from "./kensoh.json";
import kewpie from "./kewpie.json";
import keyCoffee from "./key-coffee.json";
import keyence from "./keyence.json";
import keyholder from "./keyholder.json";
import keywareSolutions from "./keyware-solutions.json";
import kfc from "./kfc.json";
import kgIntelligence from "./kg-intelligence.json";
import khNeochem from "./kh-neochem.json";
import kiStarRealEstate from "./ki-star-real-estate.json";
import kibunFoods from "./kibun-foods.json";
import kichiriHoldingsAndCo from "./kichiri-holdings-and-co.json";
import kidsStar from "./kids-star.json";
import kidswellBio from "./kidswell-bio.json";
import kikkoman from "./kikkoman.json";
import kikuchiSeisakusho from "./kikuchi-seisakusho.json";
import kikukawaEnterprise from "./kikukawa-enterprise.json";
import kikusuiChemicalIndustries from "./kikusui-chemical-industries.json";
import kikusuiHoldings from "./kikusui-holdings.json";
import kimoto from "./kimoto.json";
import kimura from "./kimura.json";
import kimuraChemicalPlants from "./kimura-chemical-plants.json";
import kimuraKohki from "./kimura-kohki.json";
import kimuraUnity from "./kimura-unity.json";
import kimuratan from "./kimuratan.json";
import kinEi from "./kin-ei.json";
import kinden from "./kinden.json";
import king from "./king.json";
import kingJim from "./king-jim.json";
import kinjiro from "./kinjiro.json";
import kintetsuDepartmentStore from "./kintetsu-department-store.json";
import kintetsuGroupHoldings from "./kintetsu-group-holdings.json";
import kioxiaHoldings from "./kioxia-holdings.json";
import kirinHoldings from "./kirin-holdings.json";
import kisoji from "./kisoji.json";
import kisseiPharmaceutical from "./kissei-pharmaceutical.json";
import kitabo from "./kitabo.json";
import kitac from "./kitac.json";
import kitagawa from "./kitagawa.json";
import kitagawaSeiki from "./kitagawa-seiki.json";
import kitahamaCapitalPartners from "./kitahama-capital-partners.json";
import kitakei from "./kitakei.json";
import kitalive from "./kitalive.json";
import kitanoConstruction from "./kitano-construction.json";
import kitanotatsujin from "./kitanotatsujin.json";
import kitazato from "./kitazato.json";
import kitazawaSangyo from "./kitazawa-sangyo.json";
import kitokuShinryo from "./kitoku-shinryo.json";
import kitz from "./kitz.json";
import kiyoLearning from "./kiyo-learning.json";
import klab from "./klab.json";
import klass from "./klass.json";
import kncLaboratories from "./knc-laboratories.json";
import koa from "./koa.json";
import koaShojiHoldings from "./koa-shoji-holdings.json";
import koatsuGasKogyo from "./koatsu-gas-kogyo.json";
import koatsuKogyo from "./koatsu-kogyo.json";
import kobayashiPharmaceutical from "./kobayashi-pharmaceutical.json";
import kobayashiYoko from "./kobayashi-yoko.json";
import kobeBussan from "./kobe-bussan.json";
import kobeElectricRailway from "./kobe-electric-railway.json";
import kobeSteel from "./kobe-steel.json";
import kodamaChemicalIndustry from "./kodama-chemical-industry.json";
import koeiChemical from "./koei-chemical.json";
import koeiTecmoHoldings from "./koei-tecmo-holdings.json";
import kogi from "./kogi.json";
import kohjinBio from "./kohjin-bio.json";
import kohnanShoji from "./kohnan-shoji.json";
import kohokuKogyo from "./kohoku-kogyo.json";
import kohsai from "./kohsai.json";
import kohsoku from "./kohsoku.json";
import koikeSansoKogyo from "./koike-sanso-kogyo.json";
import koikeYa from "./koike-ya.json";
import koitoManufacturing from "./koito-manufacturing.json";
import kojima from "./kojima.json";
import koken from "./koken.json";
import kokenBoringMachine from "./koken-boring-machine.json";
import kokopelli from "./kokopelli.json";
import kokusai from "./kokusai.json";
import kokusaiElectric from "./kokusai-electric.json";
import kokuyo from "./kokuyo.json";
import komaihaltec from "./komaihaltec.json";
import komatsu from "./komatsu.json";
import komatsuMatere from "./komatsu-matere.json";
import komatsuWallIndustry from "./komatsu-wall-industry.json";
import komedaHoldings from "./komeda-holdings.json";
import komehyoHoldings from "./komehyo-holdings.json";
import komeri from "./komeri.json";
import komori from "./komori.json";
import konaka from "./konaka.json";
import konamiGroup from "./konami-group.json";
import kondotec from "./kondotec.json";
import konicaMinolta from "./konica-minolta.json";
import konishi from "./konishi.json";
import konoikeTransport from "./konoike-transport.json";
import konoshimaChemical from "./konoshima-chemical.json";
import koryojyuhan from "./koryojyuhan.json";
import kosaidoHoldings from "./kosaido-holdings.json";
import koseRE from "./kose-r-e.json";
import koshidakaHoldings from "./koshidaka-holdings.json";
import kotobukiSpirits from "./kotobuki-spirits.json";
import kotobukiya from "./kotobukiya.json";
import koukandekirukun from "./koukandekirukun.json";
import kourakuen from "./kourakuen.json";
import kowa from "./kowa.json";
import koyosha from "./koyosha.json";
import koyouRentia from "./koyou-rentia.json";
import kozoKeikakuEngineeringHoldings from "./kozo-keikaku-engineering-holdings.json";
import kppGroupHoldings from "./kpp-group-holdings.json";
import kraftia from "./kraftia.json";
import kringlePharma from "./kringle-pharma.json";
import krosakiHarima from "./krosaki-harima.json";
import ksk from "./ksk.json";
import ktk from "./ktk.json";
import kuHoldings from "./ku-holdings.json";
import kubell from "./kubell.json";
import kubota from "./kubota.json";
import kubotaPharmaceuticalHoldings from "./kubota-pharmaceutical-holdings.json";
import kubotek from "./kubotek.json";
import kudan from "./kudan.json";
import kudo from "./kudo.json";
import kufuCompanyHoldings from "./kufu-company-holdings.json";
import kumagaiGumi from "./kumagai-gumi.json";
import kumiaiChemicalIndustry from "./kumiai-chemical-industry.json";
import kunimineIndustries from "./kunimine-industries.json";
import kuraSushi from "./kura-sushi.json";
import kuraboIndustries from "./kurabo-industries.json";
import kuradashi from "./kuradashi.json";
import kuramoto from "./kuramoto.json";
import kuraray from "./kuraray.json";
import kurashicom from "./kurashicom.json";
import kurashiru from "./kurashiru.json";
import kuraudiaHoldings from "./kuraudia-holdings.json";
import kureha from "./kureha.json";
import kuribayashiSteamship from "./kuribayashi-steamship.json";
import kurimoto from "./kurimoto.json";
import kuritaWaterIndustries from "./kurita-water-industries.json";
import kuriyamaHoldings from "./kuriyama-holdings.json";
import kurodaGroup from "./kuroda-group.json";
import kurodaPrecisionIndustries from "./kuroda-precision-industries.json";
import kuroganeKosakusho from "./kurogane-kosakusho.json";
import kushikatsuTanakaHoldings from "./kushikatsu-tanaka-holdings.json";
import kushim from "./kushim.json";
import kusuriNoAokiHoldings from "./kusuri-no-aoki-holdings.json";
import kusurinomadoguchi from "./kusurinomadoguchi.json";
import kuwazawaHoldings from "./kuwazawa-holdings.json";
import kuze from "./kuze.json";
import kvk from "./kvk.json";
import kycomHoldings from "./kycom-holdings.json";
import kyocera from "./kyocera.json";
import kyodoPaperHoldings from "./kyodo-paper-holdings.json";
import kyodoPrinting from "./kyodo-printing.json";
import kyodoPublicRelations from "./kyodo-public-relations.json";
import kyoeiSangyo from "./kyoei-sangyo.json";
import kyoeiSecurityService from "./kyoei-security-service.json";
import kyoeiSteel from "./kyoei-steel.json";
import kyoeiTanker from "./kyoei-tanker.json";
import kyogokuUnyuShoji from "./kyogoku-unyu-shoji.json";
import kyokuto from "./kyokuto.json";
import kyokutoBoekiKaisha from "./kyokuto-boeki-kaisha.json";
import kyokutoKaihatsuKogyo from "./kyokuto-kaihatsu-kogyo.json";
import kyokutoSecurities from "./kyokuto-securities.json";
import kyokuyo from "./kyokuyo.json";
import kyorinPharmaceutical from "./kyorin-pharmaceutical.json";
import kyoritsu from "./kyoritsu.json";
import kyoritsuAirTech from "./kyoritsu-air-tech.json";
import kyoritsuComputerAndCommunication from "./kyoritsu-computer-and-communication.json";
import kyoritsuElectric from "./kyoritsu-electric.json";
import kyoritsuMaintenance from "./kyoritsu-maintenance.json";
import kyosanElectricManufacturing from "./kyosan-electric-manufacturing.json";
import kyosha from "./kyosha.json";
import kyoshin from "./kyoshin.json";
import kyotoFinancialGroup from "./kyoto-financial-group.json";
import kyotoKimonoYuzenHoldings from "./kyoto-kimono-yuzen-holdings.json";
import kyotoTool from "./kyoto-tool.json";
import kyowa from "./kyowa.json";
import kyowaElectronicInstruments from "./kyowa-electronic-instruments.json";
import kyowaEngineeringConsultants from "./kyowa-engineering-consultants.json";
import kyowaKirin from "./kyowa-kirin.json";
import kyowaLeatherCloth from "./kyowa-leather-cloth.json";
import kyowakogyosyo from "./kyowakogyosyo.json";
import kyowanissei from "./kyowanissei.json";
import kyushuFinancialGroup from "./kyushu-financial-group.json";
import kyushuLeasingService from "./kyushu-leasing-service.json";
import kyushuRailway from "./kyushu-railway.json";
import lIsB from "./l-is-b.json";
import laHoldings from "./la-holdings.json";
import laboroAi from "./laboro-ai.json";
import lactoJapan from "./lacto-japan.json";
import lakeel from "./lakeel.json";
import lancers from "./lancers.json";
import land from "./land.json";
import landBusiness from "./land-business.json";
import landix from "./landix.json";
import landnet from "./landnet.json";
import laoxHoldings from "./laox-holdings.json";
import lapine from "./lapine.json";
import lasertec from "./lasertec.json";
import lastOneMile from "./last-one-mile.json";
import laxusTechnologies from "./laxus-technologies.json";
import leaderElectronics from "./leader-electronics.json";
import lec from "./lec.json";
import lecipHoldings from "./lecip-holdings.json";
import ledax from "./ledax.json";
import leoclan from "./leoclan.json";
import leopalace21 from "./leopalace21.json";
import libConsulting from "./lib-consulting.json";
import libWork from "./lib-work.json";
import liberaware from "./liberaware.json";
import liberta from "./liberta.json";
import life from "./life.json";
import lifeFoods from "./life-foods.json";
import lifeIntelligentEnterpriseHoldings from "./life-intelligent-enterprise-holdings.json";
import lifedrink from "./lifedrink.json";
import lifull from "./lifull.json";
import lightworks from "./lightworks.json";
import ligua from "./ligua.json";
import lihitLab from "./lihit-lab.json";
import like from "./like.json";
import lilycolor from "./lilycolor.json";
import linical from "./linical.json";
import linkAndMotivation from "./link-and-motivation.json";
import linkUGroup from "./link-u-group.json";
import linkbal from "./linkbal.json";
import linkers from "./linkers.json";
import lintec from "./lintec.json";
import lion from "./lion.json";
import lionOfficeProducts from "./lion-office-products.json";
import litalico from "./litalico.json";
import livero from "./livero.json";
import livesense from "./livesense.json";
import livingPlatform from "./living-platform.json";
import livingTechnologies from "./living-technologies.json";
import lixil from "./lixil.json";
import loadstarCapital from "./loadstar-capital.json";
import lobtex from "./lobtex.json";
import loginetJapan from "./loginet-japan.json";
import logizard from "./logizard.json";
import logly from "./logly.json";
import logosHoldings from "./logos-holdings.json";
import loive from "./loive.json";
import lonseal from "./lonseal.json";
import lookHoldings from "./look-holdings.json";
import lts from "./lts.json";
import luckland from "./luckland.json";
import ly from "./ly.json";
import mAndACapitalPartners from "./m-and-a-capital-partners.json";
import mAndAResearchInstituteHoldings from "./m-and-a-research-institute-holdings.json";
import mHGroup from "./m-h-group.json";
import mMart from "./m-mart.json";
import mUpHoldings from "./m-up-holdings.json";
import m3 from "./m3.json";
import mabuchiMotor from "./mabuchi-motor.json";
import macbeePlanet from "./macbee-planet.json";
import macnicaHoldings from "./macnica-holdings.json";
import macromill from "./macromill.json";
import maezawaIndustries from "./maezawa-industries.json";
import maezawaKaseiIndustries from "./maezawa-kasei-industries.json";
import maezawaKyusoIndustries from "./maezawa-kyuso-industries.json";
import magmag from "./magmag.json";
import mainichiComnet from "./mainichi-comnet.json";
import makinoMillingMachine from "./makino-milling-machine.json";
import makita from "./makita.json";
import makiya from "./makiya.json";
import makotoConstruction from "./makoto-construction.json";
import makuake from "./makuake.json";
import mamezoDigitalHoldings from "./mamezo-digital-holdings.json";
import mamiyaOp from "./mamiya-op.json";
import mammyMartHolding from "./mammy-mart-holding.json";
import manabiAid from "./manabi-aid.json";
import manacChemicalPartners from "./manac-chemical-partners.json";
import managementSolutions from "./management-solutions.json";
import mandarake from "./mandarake.json";
import mandom from "./mandom.json";
import mani from "./mani.json";
import mansei from "./mansei.json";
import marche from "./marche.json";
import marketenterprise from "./marketenterprise.json";
import marklines from "./marklines.json";
import marsGroupHoldings from "./mars-group-holdings.json";
import marubeni from "./marubeni.json";
import marubun from "./marubun.json";
import maruchiyoYamaokaya from "./maruchiyo-yamaokaya.json";
import marudaiFood from "./marudai-food.json";
import marufujiSheetPiling from "./marufuji-sheet-piling.json";
import maruhachiHoldings from "./maruhachi-holdings.json";
import maruhachiSecurities from "./maruhachi-securities.json";
import maruhachiWarehouse from "./maruhachi-warehouse.json";
import maruichi from "./maruichi.json";
import maruichiSteelTube from "./maruichi-steel-tube.json";
import marukenLease from "./maruken-lease.json";
import marumae from "./marumae.json";
import maruoCalcium from "./maruo-calcium.json";
import marusanAi from "./marusan-ai.json";
import marusanSecurities from "./marusan-securities.json";
import marutai from "./marutai.json";
import marutoSangyo from "./maruto-sangyo.json";
import maruwa from "./maruwa.json";
import maruwn from "./maruwn.json";
import maruyamaMfg from "./maruyama-mfg.json";
import maruyoshiCenter from "./maruyoshi-center.json";
import maruzen from "./maruzen.json";
import maruzenChiHoldings from "./maruzen-chi-holdings.json";
import marvelous from "./marvelous.json";
import masaru from "./masaru.json";
import matchingServiceJapan from "./matching-service-japan.json";
import materialGroup from "./material-group.json";
import matsudaSangyo from "./matsuda-sangyo.json";
import matsuiConstruction from "./matsui-construction.json";
import matsuiSecurities from "./matsui-securities.json";
import matsukiyococokaraAndCo from "./matsukiyococokara-and-co.json";
import matsumoto from "./matsumoto.json";
import matsumotoYushiSeiyaku from "./matsumoto-yushi-seiyaku.json";
import matsuoElectric from "./matsuo-electric.json";
import matsuoka from "./matsuoka.json";
import matsuya from "./matsuya.json";
import matsuyaFoodsHoldings from "./matsuya-foods-holdings.json";
import matsuyaRAndD from "./matsuya-r-and-d.json";
import max from "./max.json";
import maxell from "./maxell.json";
import maxvaluTokai from "./maxvalu-tokai.json";
import mazda from "./mazda.json";
import mbk from "./mbk.json";
import mbs from "./mbs.json";
import mcdonaldSHoldingsCompanyJapan from "./mcdonald-s-holdings-company-japan.json";
import mcj from "./mcj.json";
import mebukiFinancialGroup from "./mebuki-financial-group.json";
import mec from "./mec.json";
import mediaDo from "./media-do.json";
import mediaFive from "./media-five.json";
import mediaKobo from "./media-kobo.json";
import mediaLinks from "./media-links.json";
import mediaResearchInstitute from "./media-research-institute.json";
import mediaseek from "./mediaseek.json";
import medicalDataVision from "./medical-data-vision.json";
import medicalIkkouGroup from "./medical-ikkou-group.json";
import medicalNet from "./medical-net.json";
import medicalSystemNetwork from "./medical-system-network.json";
import medikit from "./medikit.json";
import medinet from "./medinet.json";
import medipalHoldings from "./medipal-holdings.json";
import mediusHoldings from "./medius-holdings.json";
import medix from "./medix.json";
import medley from "./medley.json";
import medpeer from "./medpeer.json";
import medrx from "./medrx.json";
import meeq from "./meeq.json";
import megachips from "./megachips.json";
import megmilkSnowBrand from "./megmilk-snow-brand.json";
import meidensha from "./meidensha.json";
import meihoEnterprise from "./meiho-enterprise.json";
import meihoFacilityWorks from "./meiho-facility-works.json";
import meihoHoldings from "./meiho-holdings.json";
import meijiElectricIndustries from "./meiji-electric-industries.json";
import meijiHoldings from "./meiji-holdings.json";
import meijiMachine from "./meiji-machine.json";
import meijiShippingGroup from "./meiji-shipping-group.json";
import meikoConstruction from "./meiko-construction.json";
import meikoNetworkJapan from "./meiko-network-japan.json";
import meikoTrans from "./meiko-trans.json";
import meinanMAndA from "./meinan-m-and-a.json";
import meiseiIndustrial from "./meisei-industrial.json";
import meitecGroupHoldings from "./meitec-group-holdings.json";
import meito from "./meito.json";
import meiwa from "./meiwa.json";
import meiwaEstate from "./meiwa-estate.json";
import meiwaIndustry from "./meiwa-industry.json";
import members from "./members.json";
import menicon from "./menicon.json";
import mentalHealthTechnologies from "./mental-health-technologies.json";
import mercari from "./mercari.json";
import mercuriaHoldings from "./mercuria-holdings.json";
import mercury from "./mercury.json";
import merf from "./merf.json";
import metalart from "./metalart.json";
import metareal from "./metareal.json";
import metawater from "./metawater.json";
import mfs from "./mfs.json";
import miahelsaHoldings from "./miahelsa-holdings.json";
import mic from "./mic.json";
import micreed from "./micreed.json";
import microad from "./microad.json";
import micronMachinery from "./micron-machinery.json";
import micronicsJapan from "./micronics-japan.json";
import microwaveChemical from "./microwave-chemical.json";
import midacHoldings from "./midac-holdings.json";
import mie from "./mie.json";
import mieKotsuGroupHoldings from "./mie-kotsu-group-holdings.json";
import migaloHoldings from "./migalo-holdings.json";
import mikikogyo from "./mikikogyo.json";
import mikuni from "./mikuni.json";
import milbon from "./milbon.json";
import mimakiEngineering from "./mimaki-engineering.json";
import minatoHoldings from "./minato-holdings.json";
import minebeaMitsumi from "./minebea-mitsumi.json";
import minkabuTheInfonoid from "./minkabu-the-infonoid.json";
import minoCeramic from "./mino-ceramic.json";
import minoya from "./minoya.json";
import mipox from "./mipox.json";
import miraiIndustry from "./mirai-industry.json";
import miraiWorks from "./mirai-works.json";
import miraial from "./miraial.json";
import mirairo from "./mirairo.json";
import miraitOne from "./mirait-one.json";
import mirarthHoldings from "./mirarth-holdings.json";
import miratap from "./miratap.json";
import miroku from "./miroku.json";
import mirokuJyohoService from "./miroku-jyoho-service.json";
import mirrativ from "./mirrativ.json";
import misawaAndCo from "./misawa-and-co.json";
import misonozaTheatrical from "./misonoza-theatrical.json";
import misumi from "./misumi.json";
import misumiGroup from "./misumi-group.json";
import mitHoldings from "./mit-holdings.json";
import mitachi from "./mitachi.json";
import mitani from "./mitani.json";
import mitaniSangyo from "./mitani-sangyo.json";
import mitaniSekisan from "./mitani-sekisan.json";
import mitoSecurities from "./mito-securities.json";
import mitsubishiChemicalGroup from "./mitsubishi-chemical-group.json";
import mitsubishiCorporation from "./mitsubishi-corporation.json";
import mitsubishiElectric from "./mitsubishi-electric.json";
import mitsubishiEstate from "./mitsubishi-estate.json";
import mitsubishiGasChemical from "./mitsubishi-gas-chemical.json";
import mitsubishiHcCapital from "./mitsubishi-hc-capital.json";
import mitsubishiHeavyIndustries from "./mitsubishi-heavy-industries.json";
import mitsubishiKakokiKaisha from "./mitsubishi-kakoki-kaisha.json";
import mitsubishiLogisnext from "./mitsubishi-logisnext.json";
import mitsubishiLogistics from "./mitsubishi-logistics.json";
import mitsubishiMaterials from "./mitsubishi-materials.json";
import mitsubishiMotors from "./mitsubishi-motors.json";
import mitsubishiPaperMills from "./mitsubishi-paper-mills.json";
import mitsubishiPencil from "./mitsubishi-pencil.json";
import mitsubishiResearchInstitute from "./mitsubishi-research-institute.json";
import mitsubishiShokuhin from "./mitsubishi-shokuhin.json";
import mitsubishiSteelMfg from "./mitsubishi-steel-mfg.json";
import mitsubishiUfjFinancialGroup from "./mitsubishi-ufj-financial-group.json";
import mitsuboshi from "./mitsuboshi.json";
import mitsuboshiBelting from "./mitsuboshi-belting.json";
import mitsuchi from "./mitsuchi.json";
import mitsuiAndCo from "./mitsui-and-co.json";
import mitsuiChemicals from "./mitsui-chemicals.json";
import mitsuiDmSugar from "./mitsui-dm-sugar.json";
import mitsuiEAndS from "./mitsui-e-and-s.json";
import mitsuiFudosan from "./mitsui-fudosan.json";
import mitsuiHighTec from "./mitsui-high-tec.json";
import mitsuiKinzoku from "./mitsui-kinzoku.json";
import mitsuiMatsushimaHoldings from "./mitsui-matsushima-holdings.json";
import mitsuiOSKLines from "./mitsui-o-s-k-lines.json";
import mitsuiSokoHoldings from "./mitsui-soko-holdings.json";
import mitsumuraPrinting from "./mitsumura-printing.json";
import mitsuurokoGroupHoldings from "./mitsuuroko-group-holdings.json";
import miura from "./miura.json";
import mixi from "./mixi.json";
import miyairiValveMfg from "./miyairi-valve-mfg.json";
import miyajiEngineeringGroup from "./miyaji-engineering-group.json";
import miyakoshiHoldings from "./miyakoshi-holdings.json";
import miyoshiOilAndFat from "./miyoshi-oil-and-fat.json";
import mizuhoFinancialGroup from "./mizuho-financial-group.json";
import mizuhoLeasing from "./mizuho-leasing.json";
import mizuhoMedy from "./mizuho-medy.json";
import mizuno from "./mizuno.json";
import mkSeiko from "./mk-seiko.json";
import mksystem from "./mksystem.json";
import mobcastHoldings from "./mobcast-holdings.json";
import mobileFactory from "./mobile-factory.json";
import mobilus from "./mobilus.json";
import mochidaPharmaceutical from "./mochida-pharmaceutical.json";
import modalisTherapeutics from "./modalis-therapeutics.json";
import modec from "./modec.json";
import moi from "./moi.json";
import molitecSteel from "./molitec-steel.json";
import monexGroup from "./monex-group.json";
import moneyForward from "./money-forward.json";
import monoaiTechnology from "./monoai-technology.json";
import monotaro from "./monotaro.json";
import moonbat from "./moonbat.json";
import moresco from "./moresco.json";
import moriGumi from "./mori-gumi.json";
import morinagaAndCo from "./morinaga-and-co.json";
import morinagaMilkIndustry from "./morinaga-milk-industry.json";
import morioDenki from "./morio-denki.json";
import moriroku from "./moriroku.json";
import morishitaJintan from "./morishita-jintan.json";
import moritaHoldings from "./morita-holdings.json";
import morito from "./morito.json";
import moriya from "./moriya.json";
import moriyaTransportationEngineeringAndManufacturing from "./moriya-transportation-engineering-and-manufacturing.json";
import morozoff from "./morozoff.json";
import morpho from "./morpho.json";
import mortgageServiceJapan from "./mortgage-service-japan.json";
import moryIndustries from "./mory-industries.json";
import mosFoodServices from "./mos-food-services.json";
import movinStrategicCareer from "./movin-strategic-career.json";
import mrMaxHoldings from "./mr-max-holdings.json";
import mrkHoldings from "./mrk-holdings.json";
import mrso from "./mrso.json";
import mrt from "./mrt.json";
import msAndAdInsuranceGroupHoldings from "./ms-and-ad-insurance-group-holdings.json";
import msAndConsulting from "./ms-and-consulting.json";
import mtGenex from "./mt-genex.json";
import mtg from "./mtg.json";
import mti from "./mti.json";
import mugenEstate from "./mugen-estate.json";
import mullion from "./mullion.json";
import murakami from "./murakami.json";
import muraki from "./muraki.json";
import murataManufacturing from "./murata-manufacturing.json";
import muro from "./muro.json";
import muromachiChemicals from "./muromachi-chemicals.json";
import musashi from "./musashi.json";
import musashiSeimitsuIndustry from "./musashi-seimitsu-industry.json";
import musashinoKogyo from "./musashino-kogyo.json";
import muscatGroup from "./muscat-group.json";
import mutoSeiko from "./muto-seiko.json";
import mutohHoldings from "./mutoh-holdings.json";
import mynet from "./mynet.json";
import nabtesco from "./nabtesco.json";
import nac from "./nac.json";
import nachiFujikoshi from "./nachi-fujikoshi.json";
import nadex from "./nadex.json";
import nafco from "./nafco.json";
import nagahori from "./nagahori.json";
import nagaileben from "./nagaileben.json";
import naganoKeiki from "./nagano-keiki.json";
import nagaokaInternational from "./nagaoka-international.json";
import nagaseAndCo from "./nagase-and-co.json";
import nagaseBrothers from "./nagase-brothers.json";
import nagawa from "./nagawa.json";
import nagoyaElectricWorks from "./nagoya-electric-works.json";
import nagoyaRailroad from "./nagoya-railroad.json";
import naigai from "./naigai.json";
import naigaiTec from "./naigai-tec.json";
import naigaiTransLine from "./naigai-trans-line.json";
import naikaiZosen from "./naikai-zosen.json";
import naitoAndCo from "./naito-and-co.json";
import nakabayashi from "./nakabayashi.json";
import nakabohtecCorrosionProtecting from "./nakabohtec-corrosion-protecting.json";
import nakakitaSeisakusho from "./nakakita-seisakusho.json";
import nakamichiLeasing from "./nakamichi-leasing.json";
import nakamotoPacks from "./nakamoto-packs.json";
import nakamuraChoukou from "./nakamura-choukou.json";
import nakamuraya from "./nakamuraya.json";
import nakanihonKogyo from "./nakanihon-kogyo.json";
import nakanipponCasting from "./nakanippon-casting.json";
import nakanishi from "./nakanishi.json";
import nakanishiMfg from "./nakanishi-mfg.json";
import nakano from "./nakano.json";
import nakanoRefrigerators from "./nakano-refrigerators.json";
import nakayamaSteelWorks from "./nakayama-steel-works.json";
import nakayamafuku from "./nakayamafuku.json";
import nalnetCommunications from "./nalnet-communications.json";
import namuraShipbuilding from "./namura-shipbuilding.json";
import nankai from "./nankai.json";
import nankaiChemicalIndustry from "./nankai-chemical-industry.json";
import nankaiPlywood from "./nankai-plywood.json";
import nankaiTatsumuraConstruction from "./nankai-tatsumura-construction.json";
import nanoHoldings from "./nano-holdings.json";
import nansin from "./nansin.json";
import nanyo from "./nanyo.json";
import narasakiSangyo from "./narasaki-sangyo.json";
import nareruGroup from "./nareru-group.json";
import narumiyaInternational from "./narumiya-international.json";
import nasuDenkiTekko from "./nasu-denki-tekko.json";
import natoco from "./natoco.json";
import natori from "./natori.json";
import nattySwankyHoldings from "./natty-swanky-holdings.json";
import ncd from "./ncd.json";
import ncsAndA from "./ncs-and-a.json";
import ncxxGroup from "./ncxx-group.json";
import ne from "./ne.json";
import nec from "./nec.json";
import necCapitalSolutions from "./nec-capital-solutions.json";
import needsWell from "./needs-well.json";
import neoMarketing from "./neo-marketing.json";
import neojapan from "./neojapan.json";
import nepon from "./nepon.json";
import netProtectionsHoldings from "./net-protections-holdings.json";
import netstars from "./netstars.json";
import neturen from "./neturen.json";
import netyearGroup from "./netyear-group.json";
import neuralGroup from "./neural-group.json";
import newArtHoldings from "./new-art-holdings.json";
import newConstructorSNetwork from "./new-constructor-s-network.json";
import newCosmosElectric from "./new-cosmos-electric.json";
import newJapanChemical from "./new-japan-chemical.json";
import newtech from "./newtech.json";
import nexon from "./nexon.json";
import nextGenerationTechnologyGroup from "./next-generation-technology-group.json";
import nextage from "./nextage.json";
import nextgen from "./nextgen.json";
import nextone from "./nextone.json";
import nextware from "./nextware.json";
import nexyzGroup from "./nexyz-group.json";
import nfHoldings from "./nf-holdings.json";
import nfkHoldings from "./nfk-holdings.json";
import ngk from "./ngk.json";
import nhFoods from "./nh-foods.json";
import nhkSpring from "./nhk-spring.json";
import nicAutotec from "./nic-autotec.json";
import niccaChemical from "./nicca-chemical.json";
import nice from "./nice.json";
import nichiaSteelWorks from "./nichia-steel-works.json";
import nichias from "./nichias.json";
import nichiban from "./nichiban.json";
import nichicon from "./nichicon.json";
import nichidai from "./nichidai.json";
import nichiden from "./nichiden.json";
import nichiha from "./nichiha.json";
import nichimo from "./nichimo.json";
import nichirei from "./nichirei.json";
import nichirekiGroup from "./nichireki-group.json";
import nichirin from "./nichirin.json";
import nichiryoBaking from "./nichiryo-baking.json";
import nichiryoku from "./nichiryoku.json";
import nichiwaSangyo from "./nichiwa-sangyo.json";
import nidec from "./nidec.json";
import nifco from "./nifco.json";
import niftyLifestyle from "./nifty-lifestyle.json";
import nihonChouzai from "./nihon-chouzai.json";
import nihonDecoluxe from "./nihon-decoluxe.json";
import nihonDengi from "./nihon-dengi.json";
import nihonDenkei from "./nihon-denkei.json";
import nihonEnterprise from "./nihon-enterprise.json";
import nihonFalcom from "./nihon-falcom.json";
import nihonFlush from "./nihon-flush.json";
import nihonHouseHoldings from "./nihon-house-holdings.json";
import nihonIsk from "./nihon-isk.json";
import nihonKagakuSangyo from "./nihon-kagaku-sangyo.json";
import nihonKnowledge from "./nihon-knowledge.json";
import nihonKogyo from "./nihon-kogyo.json";
import nihonKohden from "./nihon-kohden.json";
import nihonMAndACenterHoldings from "./nihon-m-and-a-center-holdings.json";
import nihonNohyaku from "./nihon-nohyaku.json";
import nihonOfficeAutomationReseach from "./nihon-office-automation-reseach.json";
import nihonParkerizing from "./nihon-parkerizing.json";
import nihonPlast from "./nihon-plast.json";
import nihonSeikan from "./nihon-seikan.json";
import nihonSeiko from "./nihon-seiko.json";
import nihonSeimitsu from "./nihon-seimitsu.json";
import nihonShokuhinKako from "./nihon-shokuhin-kako.json";
import nihonSuidoConsultants from "./nihon-suido-consultants.json";
import nihonTokushuToryo from "./nihon-tokushu-toryo.json";
import nihonTrim from "./nihon-trim.json";
import nihonYamamuraGlass from "./nihon-yamamura-glass.json";
import nihonwasouHoldings from "./nihonwasou-holdings.json";
import niigataKotsu from "./niigata-kotsu.json";
import niitaka from "./niitaka.json";
import nikkato from "./nikkato.json";
import nikkenKogaku from "./nikken-kogaku.json";
import nikki from "./nikki.json";
import nikkiso from "./nikkiso.json";
import nikko from "./nikko.json";
import nikko6306 from "./nikko-6306.json";
import nikkonHoldings from "./nikkon-holdings.json";
import nikon from "./nikon.json";
import nintendo from "./nintendo.json";
import nippi from "./nippi.json";
import nippn from "./nippn.json";
import nippo from "./nippo.json";
import nipponAirConditioningServices from "./nippon-air-conditioning-services.json";
import nipponAntenna from "./nippon-antenna.json";
import nipponAqua from "./nippon-aqua.json";
import nipponAvionics from "./nippon-avionics.json";
import nipponBeetSugarManufacturing from "./nippon-beet-sugar-manufacturing.json";
import nipponBsBroadcasting from "./nippon-bs-broadcasting.json";
import nipponCarbideIndustries from "./nippon-carbide-industries.json";
import nipponCarbon from "./nippon-carbon.json";
import nipponCareSupply from "./nippon-care-supply.json";
import nipponCeramic from "./nippon-ceramic.json";
import nipponChemicalIndustrial from "./nippon-chemical-industrial.json";
import nipponChemiphar from "./nippon-chemiphar.json";
import nipponChutetsukan from "./nippon-chutetsukan.json";
import nipponChuzo from "./nippon-chuzo.json";
import nipponCokeAndEngineering from "./nippon-coke-and-engineering.json";
import nipponConcept from "./nippon-concept.json";
import nipponConcreteIndustries from "./nippon-concrete-industries.json";
import nipponCrucible from "./nippon-crucible.json";
import nipponDenko from "./nippon-denko.json";
import nipponDensetsuKogyo from "./nippon-densetsu-kogyo.json";
import nipponDryChemical from "./nippon-dry-chemical.json";
import nipponElectricGlass from "./nippon-electric-glass.json";
import nipponExpressHoldings from "./nippon-express-holdings.json";
import nipponFelt from "./nippon-felt.json";
import nipponFilcon from "./nippon-filcon.json";
import nipponFineChemical from "./nippon-fine-chemical.json";
import nipponGas from "./nippon-gas.json";
import nipponGear from "./nippon-gear.json";
import nipponGrande from "./nippon-grande.json";
import nipponHume from "./nippon-hume.json";
import nipponIchiSoftware from "./nippon-ichi-software.json";
import nipponInformationDevelopment from "./nippon-information-development.json";
import nipponInsure from "./nippon-insure.json";
import nipponKanzaiHoldings from "./nippon-kanzai-holdings.json";
import nipponKayaku from "./nippon-kayaku.json";
import nipponKinzoku from "./nippon-kinzoku.json";
import nipponKodoshi from "./nippon-kodoshi.json";
import nipponKoshuhaSteel from "./nippon-koshuha-steel.json";
import nipponLightMetalHoldings from "./nippon-light-metal-holdings.json";
import nipponPaintHoldings from "./nippon-paint-holdings.json";
import nipponPalletPool from "./nippon-pallet-pool.json";
import nipponPaperIndustries from "./nippon-paper-industries.json";
import nipponParkingDevelopment from "./nippon-parking-development.json";
import nipponPigmentHoldings from "./nippon-pigment-holdings.json";
import nipponPrimex from "./nippon-primex.json";
import nipponRad from "./nippon-rad.json";
import nipponRietec from "./nippon-rietec.json";
import nipponSansoHoldings from "./nippon-sanso-holdings.json";
import nipponSeiki from "./nippon-seiki.json";
import nipponSeiro from "./nippon-seiro.json";
import nipponSeisen from "./nippon-seisen.json";
import nipponSharyo from "./nippon-sharyo.json";
import nipponShikizai from "./nippon-shikizai.json";
import nipponShindo from "./nippon-shindo.json";
import nipponShinyaku from "./nippon-shinyaku.json";
import nipponShokubai from "./nippon-shokubai.json";
import nipponSkiResortDevelopment from "./nippon-ski-resort-development.json";
import nipponSoda from "./nippon-soda.json";
import nipponSteel from "./nippon-steel.json";
import nipponTechnoLab from "./nippon-techno-lab.json";
import nipponTelevisionHoldings from "./nippon-television-holdings.json";
import nipponThompson from "./nippon-thompson.json";
import nipponTungsten from "./nippon-tungsten.json";
import nipponYakinKogyo from "./nippon-yakin-kogyo.json";
import nipponYusenKabushikiKaisha from "./nippon-yusen-kabushiki-kaisha.json";
import nipro from "./nipro.json";
import nireco from "./nireco.json";
import nishiNipponFinancialHoldings from "./nishi-nippon-financial-holdings.json";
import nishiNipponRailroad from "./nishi-nippon-railroad.json";
import nishikawaKeisoku from "./nishikawa-keisoku.json";
import nishikawaRubber from "./nishikawa-rubber.json";
import nishimatsuConstruction from "./nishimatsu-construction.json";
import nishimatsuyaChain from "./nishimatsuya-chain.json";
import nishimoto from "./nishimoto.json";
import nishioHoldings from "./nishio-holdings.json";
import nissan from "./nissan.json";
import nissanChemicalCorporatiom from "./nissan-chemical-corporatiom.json";
import nissanShatai from "./nissan-shatai.json";
import nissanTokyoSalesHoldings from "./nissan-tokyo-sales-holdings.json";
import nisseiAsbMachine from "./nissei-asb-machine.json";
import nisseiPlasticIndustrial from "./nissei-plastic-industrial.json";
import nissen from "./nissen.json";
import nissha from "./nissha.json";
import nisshinGroupHoldings from "./nisshin-group-holdings.json";
import nisshinSeifunGroup from "./nisshin-seifun-group.json";
import nisshinboHoldings from "./nisshinbo-holdings.json";
import nissin from "./nissin.json";
import nissinFoodsHoldings from "./nissin-foods-holdings.json";
import nissinShoji from "./nissin-shoji.json";
import nissoGroup from "./nisso-group.json";
import nissoHoldings from "./nisso-holdings.json";
import nissou from "./nissou.json";
import nissui from "./nissui.json";
import nitchitsu from "./nitchitsu.json";
import nitcho from "./nitcho.json";
import niterra from "./niterra.json";
import nitoriHoldings from "./nitori-holdings.json";
import nitta from "./nitta.json";
import nittaGelatin from "./nitta-gelatin.json";
import nittan from "./nittan.json";
import nittetsuMining from "./nittetsu-mining.json";
import nittoBoseki from "./nitto-boseki.json";
import nittoDenko from "./nitto-denko.json";
import nittoFujiFlourMilling from "./nitto-fuji-flour-milling.json";
import nittoKogyo from "./nitto-kogyo.json";
import nittoKohki from "./nitto-kohki.json";
import nittoSeimo from "./nitto-seimo.json";
import nittobest from "./nittobest.json";
import nittocConstruction from "./nittoc-construction.json";
import nittoh from "./nittoh.json";
import nittoku from "./nittoku.json";
import nittoseiko from "./nittoseiko.json";
import nix from "./nix.json";
import njHoldings from "./nj-holdings.json";
import njs from "./njs.json";
import nkkSwitches from "./nkk-switches.json";
import nmsHoldings from "./nms-holdings.json";
import no1 from "./no-1.json";
import noda from "./noda.json";
import noevirHoldings from "./noevir-holdings.json";
import nof from "./nof.json";
import nohmiBosai from "./nohmi-bosai.json";
import noileImmuneBiotech from "./noile-immune-biotech.json";
import nojima from "./nojima.json";
import nok from "./nok.json";
import nomura from "./nomura.json";
import nomura9716 from "./nomura-9716.json";
import nomuraHoldings from "./nomura-holdings.json";
import nomuraMicroScience from "./nomura-micro-science.json";
import nomuraRealEstateHoldings from "./nomura-real-estate-holdings.json";
import nomuraResearchInstitute from "./nomura-research-institute.json";
import nomuraSystem from "./nomura-system.json";
import noritake from "./noritake.json";
import noritsuKoki from "./noritsu-koki.json";
import noritz from "./noritz.json";
import northPacificBank from "./north-pacific-bank.json";
import northsand from "./northsand.json";
import note from "./note.json";
import nousouken from "./nousouken.json";
import novaSystem from "./nova-system.json";
import novac from "./novac.json";
import novarese from "./novarese.json";
import nozakiInsatsuShigyo from "./nozaki-insatsu-shigyo.json";
import nozawa from "./nozawa.json";
import npc from "./npc.json";
import nprRiken from "./npr-riken.json";
import nsGroup from "./ns-group.json";
import nsSolutions from "./ns-solutions.json";
import nsTool from "./ns-tool.json";
import nsUnitedKaiunKaisha from "./ns-united-kaiun-kaisha.json";
import nsd from "./nsd.json";
import nsk from "./nsk.json";
import nsw from "./nsw.json";
import ntn from "./ntn.json";
import ntt from "./ntt.json";
import nttDataGroup from "./ntt-data-group.json";
import nttDataIntramart from "./ntt-data-intramart.json";
import nulab from "./nulab.json";
import nxeraPharma from "./nxera-pharma.json";
import nyle from "./nyle.json";
import oBSystem from "./o-b-system.json";
import oWell from "./o-well.json";
import oWill from "./o-will.json";
import oatAgrio from "./oat-agrio.json";
import obaraGroup from "./obara-group.json";
import obayashi from "./obayashi.json";
import obic from "./obic.json";
import obicBusinessConsultants from "./obic-business-consultants.json";
import oceanSystem from "./ocean-system.json";
import ochiHoldings from "./ochi-holdings.json";
import odakyuElectricRailway from "./odakyu-electric-railway.json";
import odawaraAutoMachineMfg from "./odawara-auto-machine-mfg.json";
import odawaraEngineering from "./odawara-engineering.json";
import odkSolutions from "./odk-solutions.json";
import oenonHoldings from "./oenon-holdings.json";
import oguraClutch from "./ogura-clutch.json";
import ohara from "./ohara.json";
import ohashiTechnica from "./ohashi-technica.json";
import ohba from "./ohba.json";
import ohishiSangyo from "./ohishi-sangyo.json";
import ohkiHealthcareHoldings from "./ohki-healthcare-holdings.json";
import ohmori from "./ohmori.json";
import ohmoriya from "./ohmoriya.json";
import ohmotoGumi from "./ohmoto-gumi.json";
import ohmuraShigyo from "./ohmura-shigyo.json";
import ohshoFoodService from "./ohsho-food-service.json";
import oiElectric from "./oi-electric.json";
import oieSangyo from "./oie-sangyo.json";
import oiles from "./oiles.json";
import oisixRaDaichi from "./oisix-ra-daichi.json";
import oizumi from "./oizumi.json";
import ojiHoldings from "./oji-holdings.json";
import okabe from "./okabe.json";
import okadaAiyon from "./okada-aiyon.json";
import okamotoGlass from "./okamoto-glass.json";
import okamotoIndustries from "./okamoto-industries.json";
import okamotoMachineToolWorks from "./okamoto-machine-tool-works.json";
import okamura from "./okamura.json";
import okamuraFoods from "./okamura-foods.json";
import okanoValveMfg from "./okano-valve-mfg.json";
import okasanSecuritiesGroup from "./okasan-securities-group.json";
import okayaAndCo from "./okaya-and-co.json";
import okayaElectricIndustries from "./okaya-electric-industries.json";
import okayamaPaperIndustries from "./okayama-paper-industries.json";
import okayamakenFreightTransportation from "./okayamaken-freight-transportation.json";
import okiElectricIndustry from "./oki-electric-industry.json";
import okinawaCellularTelephone from "./okinawa-cellular-telephone.json";
import okinawaFinancialGroup from "./okinawa-financial-group.json";
import okuma from "./okuma.json";
import okumura from "./okumura.json";
import okumuraEngineering from "./okumura-engineering.json";
import okuraIndustrial from "./okura-industrial.json";
import okuwa from "./okuwa.json";
import okwave from "./okwave.json";
import olbaHealthcareHoldings from "./olba-healthcare-holdings.json";
import olympicGroup from "./olympic-group.json";
import olympus from "./olympus.json";
import om2Network from "./om2-network.json";
import omikenshi from "./omikenshi.json";
import omron from "./omron.json";
import onamba from "./onamba.json";
import oncolysBiopharma from "./oncolys-biopharma.json";
import oncotherapyScience from "./oncotherapy-science.json";
import ondeck from "./ondeck.json";
import oneCareer from "./one-career.json";
import onex from "./onex.json";
import onoPharmaceutical from "./ono-pharmaceutical.json";
import onoSokki from "./ono-sokki.json";
import onoken from "./onoken.json";
import onwardHoldings from "./onward-holdings.json";
import oomitsu from "./oomitsu.json";
import ootoyaHoldings from "./ootoya-holdings.json";
import openDoor from "./open-door.json";
import openGroup from "./open-group.json";
import openHouseGroup from "./open-house-group.json";
import openUpGroup from "./open-up-group.json";
import openwork from "./openwork.json";
import opro from "./opro.json";
import optexGroup from "./optex-group.json";
import optim from "./optim.json";
import optimusGroup from "./optimus-group.json";
import optoelectronics from "./optoelectronics.json";
import optorun from "./optorun.json";
import oracleCorporationJapan from "./oracle-corporation-japan.json";
import orchestraHoldings from "./orchestra-holdings.json";
import organo from "./organo.json";
import oricon from "./oricon.json";
import orient from "./orient.json";
import orientalChainMfg from "./oriental-chain-mfg.json";
import orientalConsultantsHoldings from "./oriental-consultants-holdings.json";
import orientalLand from "./oriental-land.json";
import orientalShiraishi from "./oriental-shiraishi.json";
import origin from "./origin.json";
import originalEngineeringConsultants from "./original-engineering-consultants.json";
import orionBreweries from "./orion-breweries.json";
import orix from "./orix.json";
import oro from "./oro.json";
import orvis from "./orvis.json";
import osakaGas from "./osaka-gas.json";
import osakaOrganicChemicalIndustry from "./osaka-organic-chemical-industry.json";
import osakaSoda from "./osaka-soda.json";
import osakaSteel from "./osaka-steel.json";
import osakaTitaniumTechnologies from "./osaka-titanium-technologies.json";
import osakaYukaIndustry from "./osaka-yuka-industry.json";
import osakiElectric from "./osaki-electric.json";
import osg from "./osg.json";
import osg6757 from "./osg-6757.json";
import otaFloricultureAuction from "./ota-floriculture-auction.json";
import otake from "./otake.json";
import otaniKogyo from "./otani-kogyo.json";
import otec from "./otec.json";
import otsuka from "./otsuka.json";
import otsukaHoldings from "./otsuka-holdings.json";
import ougHoldings from "./oug-holdings.json";
import outlookconsulting from "./outlookconsulting.json";
import oval from "./oval.json";
import overlapHoldings from "./overlap-holdings.json";
import oxide from "./oxide.json";
import oyo from "./oyo.json";
import ozu from "./ozu.json";
import pBanCom from "./p-ban-com.json";
import pa from "./pa.json";
import pacificIndustrial from "./pacific-industrial.json";
import pacificMetals from "./pacific-metals.json";
import pacificNet from "./pacific-net.json";
import pacificSystems from "./pacific-systems.json";
import palGroupHoldings from "./pal-group-holdings.json";
import palemoHoldings from "./palemo-holdings.json";
import palma from "./palma.json";
import paltac from "./paltac.json";
import panPacificInternationalHoldings from "./pan-pacific-international-holdings.json";
import panasonicHoldings from "./panasonic-holdings.json";
import papanets from "./papanets.json";
import papyless from "./papyless.json";
import paraca from "./paraca.json";
import paramountBedHoldings from "./paramount-bed-holdings.json";
import parisMikiHoldings from "./paris-miki-holdings.json";
import park24 from "./park24.json";
import parker from "./parker.json";
import pasonaGroup from "./pasona-group.json";
import path from "./path.json";
import paycloudHoldings from "./paycloud-holdings.json";
import pbsystems from "./pbsystems.json";
import pca from "./pca.json";
import peers from "./peers.json";
import pegasus from "./pegasus.json";
import pentaOceanConstruction from "./penta-ocean-construction.json";
import people from "./people.json";
import peopleDreamsAndTechnologiesGroup from "./people-dreams-and-technologies-group.json";
import pepperFoodService from "./pepper-food-service.json";
import peptidream from "./peptidream.json";
import perseusProteomics from "./perseus-proteomics.json";
import persolHoldings from "./persol-holdings.json";
import petgo from "./petgo.json";
import pharmaFoodsInternational from "./pharma-foods-international.json";
import pharmariseHoldings from "./pharmarise-holdings.json";
import phcHoldings from "./phc-holdings.json";
import phil from "./phil.json";
import phoenixbio from "./phoenixbio.json";
import photosynth from "./photosynth.json";
import phyzHoldings from "./phyz-holdings.json";
import pia from "./pia.json";
import piala from "./piala.json";
import picklesHoldings from "./pickles-holdings.json";
import pietro from "./pietro.json";
import pigeon from "./pigeon.json";
import pillar from "./pillar.json";
import pilot from "./pilot.json";
import piolax from "./piolax.json";
import pixelcompanyz from "./pixelcompanyz.json";
import pixta from "./pixta.json";
import pkshaTechnology from "./pksha-technology.json";
import placo from "./placo.json";
import plaid from "./plaid.json";
import planet from "./planet.json";
import plant from "./plant.json";
import platHome from "./plat-home.json";
import platz from "./platz.json";
import plazaHoldings from "./plaza-holdings.json";
import plusAlphaConsulting from "./plus-alpha-consulting.json";
import pluszero from "./pluszero.json";
import polaOrbisHoldings from "./pola-orbis-holdings.json";
import polarisHoldings from "./polaris-holdings.json";
import poleToWinHoldings from "./pole-to-win-holdings.json";
import poper from "./poper.json";
import poppins from "./poppins.json";
import port from "./port.json";
import porters from "./porters.json";
import postprime from "./postprime.json";
import povalKogyo from "./poval-kogyo.json";
import powdertech from "./powdertech.json";
import powerSolutions from "./power-solutions.json";
import powerx from "./powerx.json";
import prTimes from "./pr-times.json";
import prapJapan from "./prap-japan.json";
import precisionSystemScience from "./precision-system-science.json";
import premierAntiAging from "./premier-anti-aging.json";
import premiumGroup from "./premium-group.json";
import premiumWaterHoldings from "./premium-water-holdings.json";
import pressKogyo from "./press-kogyo.json";
import prestigeInternational from "./prestige-international.json";
import primaMeatPackers from "./prima-meat-packers.json";
import primeStrategy from "./prime-strategy.json";
import primoGlobalHoldings from "./primo-global-holdings.json";
import printnet from "./printnet.json";
import prismBiolab from "./prism-biolab.json";
import proShip from "./pro-ship.json";
import procreaHoldings from "./procrea-holdings.json";
import prodelight from "./prodelight.json";
import progressTechnologiesGroup from "./progress-technologies-group.json";
import progrit from "./progrit.json";
import projectholdings from "./projectholdings.json";
import pronexus from "./pronexus.json";
import proni from "./proni.json";
import properst from "./properst.json";
import propertyDataBank from "./property-data-bank.json";
import propertyTechnologies from "./property-technologies.json";
import proredPartners from "./prored-partners.json";
import psConstruction from "./ps-construction.json";
import puequ from "./puequ.json";
import pulstecIndustrial from "./pulstec-industrial.json";
import punchIndustry from "./punch-industry.json";
import qbNetHoldings from "./qb-net-holdings.json";
import qdLaser from "./qd-laser.json";
import qlsHoldings from "./qls-holdings.json";
import qolHoldings from "./qol-holdings.json";
import qpsHoldings from "./qps-holdings.json";
import qualtec from "./qualtec.json";
import quantumSolutions from "./quantum-solutions.json";
import quest from "./quest.json";
import quick from "./quick.json";
import rAndDComputer from "./r-and-d-computer.json";
import rCCore from "./r-c-core.json";
import raccoonHoldings from "./raccoon-holdings.json";
import raitoKogyo from "./raito-kogyo.json";
import raiznext from "./raiznext.json";
import raksul from "./raksul.json";
import rakumachi from "./rakumachi.json";
import rakumo from "./rakumo.json";
import rakus from "./rakus.json";
import rakutenBank from "./rakuten-bank.json";
import rakutenGroup from "./rakuten-group.json";
import raqualiaPharma from "./raqualia-pharma.json";
import rarejob from "./rarejob.json";
import rasa from "./rasa.json";
import rasaIndustries from "./rasa-industries.json";
import ray from "./ray.json";
import rebase from "./rebase.json";
import recomm from "./recomm.json";
import recoveryInternational from "./recovery-international.json";
import recruitHoldings from "./recruit-holdings.json";
import refinverseGroup from "./refinverse-group.json";
import regal from "./regal.json";
import reiwaAccountingHoldings from "./reiwa-accounting-holdings.json";
import reloGroup from "./relo-group.json";
import remixpoint from "./remixpoint.json";
import renascience from "./renascience.json";
import renesasElectronics from "./renesas-electronics.json";
import renetjapangroup from "./renetjapangroup.json";
import rengo from "./rengo.json";
import renova from "./renova.json";
import rent from "./rent.json";
import rentracks from "./rentracks.json";
import repriority from "./repriority.json";
import reprocell from "./reprocell.json";
import reskill from "./reskill.json";
import resolHoldings from "./resol-holdings.json";
import resonaHoldings from "./resona-holdings.json";
import resonacHoldings from "./resonac-holdings.json";
import resorttrust from "./resorttrust.json";
import restar from "./restar.json";
import retailPartners from "./retail-partners.json";
import retty from "./retty.json";
import revolution from "./revolution.json";
import reyuuJapan from "./reyuu-japan.json";
import rezil from "./rezil.json";
import rheonAutomaticMachinery from "./rheon-automatic-machinery.json";
import rhythm from "./rhythm.json";
import ribomic from "./ribomic.json";
import ricksoft from "./ricksoft.json";
import ricoh from "./ricoh.json";
import ricohLeasing from "./ricoh-leasing.json";
import rideOnExpressHoldings from "./ride-on-express-holdings.json";
import ridgeI from "./ridge-i.json";
import rigakuHoldings from "./rigaku-holdings.json";
import rikei from "./rikei.json";
import rikenKeiki from "./riken-keiki.json";
import rikenTechnos from "./riken-technos.json";
import rikenVitamin from "./riken-vitamin.json";
import ringerHut from "./ringer-hut.json";
import rinko from "./rinko.json";
import rinnai from "./rinnai.json";
import rion from "./rion.json";
import riseConsultingGroup from "./rise-consulting-group.json";
import riskmonsterCom from "./riskmonster-com.json";
import risoKagaku from "./riso-kagaku.json";
import risoKyoikuGroup from "./riso-kyoiku-group.json";
import riverEletec from "./river-eletec.json";
import rix from "./rix.json";
import rizapGroup from "./rizap-group.json";
import rkbMainichiHoldings from "./rkb-mainichi-holdings.json";
import robotHome from "./robot-home.json";
import robotPayment from "./robot-payment.json";
import rockField from "./rock-field.json";
import rococo from "./rococo.json";
import rohm from "./rohm.json";
import rohtoPharmaceutical from "./rohto-pharmaceutical.json";
import rokkoButter from "./rokko-butter.json";
import roland from "./roland.json";
import rorze from "./rorze.json";
import roundOne from "./round-one.json";
import roxx from "./roxx.json";
import royalHoldings from "./royal-holdings.json";
import rsTechnologies from "./rs-technologies.json";
import runsystem from "./runsystem.json";
import rvh from "./rvh.json";
import ryobi from "./ryobi.json";
import ryoden from "./ryoden.json";
import ryohinKeikaku from "./ryohin-keikaku.json";
import ryomoSystems from "./ryomo-systems.json";
import ryoyoRyosanHoldings from "./ryoyo-ryosan-holdings.json";
import ryoyuSystems from "./ryoyu-systems.json";
import sAndBFoods from "./s-and-b-foods.json";
import sAndJ from "./s-and-j.json";
import sCryptoEnergy from "./s-crypto-energy.json";
import sE from "./s-e.json";
import sFoods from "./s-foods.json";
import sIshimitsuAndCo from "./s-ishimitsu-and-co.json";
import sPool from "./s-pool.json";
import sT from "./s-t.json";
import saafHoldings from "./saaf-holdings.json";
import sacSBarHoldings from "./sac-s-bar-holdings.json";
import safie from "./safie.json";
import saftec from "./saftec.json";
import sagamiHoldings from "./sagami-holdings.json";
import sagamiRubberIndustries from "./sagami-rubber-industries.json";
import saibo from "./saibo.json";
import saibuGasHoldings from "./saibu-gas-holdings.json";
import saintCareHolding from "./saint-care-holding.json";
import saintMarcHoldings from "./saint-marc-holdings.json";
import saisonTechnology from "./saison-technology.json";
import saita from "./saita.json";
import saizeriya from "./saizeriya.json";
import sakaeElectronics from "./sakae-electronics.json";
import sakaiChemicalIndustry from "./sakai-chemical-industry.json";
import sakaiHeavyIndustries from "./sakai-heavy-industries.json";
import sakaiHoldings from "./sakai-holdings.json";
import sakaiMovingService from "./sakai-moving-service.json";
import sakataInx from "./sakata-inx.json";
import sakataSeed from "./sakata-seed.json";
import sakuraInternet from "./sakura-internet.json";
import sakuraKcs from "./sakura-kcs.json";
import sakuraRubber from "./sakura-rubber.json";
import sakurai from "./sakurai.json";
import sakurajimaFutoKaisha from "./sakurajima-futo-kaisha.json";
import sakurasakuPlus from "./sakurasaku-plus.json";
import sala from "./sala.json";
import samco from "./samco.json";
import sanA from "./san-a.json";
import sanAiObbli from "./san-ai-obbli.json";
import sanHoldings from "./san-holdings.json";
import sanJuSanFinancialGroup from "./san-ju-san-financial-group.json";
import sanden from "./sanden.json";
import sanei from "./sanei.json";
import sangetsu from "./sangetsu.json";
import sanixHoldings from "./sanix-holdings.json";
import sankeiChemical from "./sankei-chemical.json";
import sankenElectric from "./sanken-electric.json";
import sankiEngineering from "./sanki-engineering.json";
import sankiService from "./sanki-service.json";
import sanko from "./sanko.json";
import sankoGosei from "./sanko-gosei.json";
import sankoMarketingFoods from "./sanko-marketing-foods.json";
import sankoMetalIndustrial from "./sanko-metal-industrial.json";
import sankoSangyo from "./sanko-sangyo.json";
import sankoTechno from "./sanko-techno.json";
import sankyo from "./sankyo.json";
import sankyoFrontier from "./sankyo-frontier.json";
import sankyoKasei from "./sankyo-kasei.json";
import sankyoSeiko from "./sankyo-seiko.json";
import sankyoTateyama from "./sankyo-tateyama.json";
import sankyu from "./sankyu.json";
import sanno from "./sanno.json";
import sanohIndustrial from "./sanoh-industrial.json";
import sanoyasHoldings from "./sanoyas-holdings.json";
import sanrin from "./sanrin.json";
import sanrio from "./sanrio.json";
import sanritsu from "./sanritsu.json";
import sansan from "./sansan.json";
import sansei from "./sansei.json";
import sanseiLandic from "./sansei-landic.json";
import sanseiTechnologies from "./sansei-technologies.json";
import sanshaElectricManufacturing from "./sansha-electric-manufacturing.json";
import sanshinElectronics from "./sanshin-electronics.json";
import sansoElectric from "./sanso-electric.json";
import santecHoldings from "./santec-holdings.json";
import santenPharmaceutical from "./santen-pharmaceutical.json";
import santo from "./santo.json";
import sanwaHoldings from "./sanwa-holdings.json";
import sanwayukaIndustry from "./sanwayuka-industry.json";
import sanyei from "./sanyei.json";
import sanyoChemicalIndustries from "./sanyo-chemical-industries.json";
import sanyoDenki from "./sanyo-denki.json";
import sanyoElectricRailway from "./sanyo-electric-railway.json";
import sanyoEngineeringAndConstruction from "./sanyo-engineering-and-construction.json";
import sanyoHomes from "./sanyo-homes.json";
import sanyoIndustries from "./sanyo-industries.json";
import sanyoShokai from "./sanyo-shokai.json";
import sanyoTrading from "./sanyo-trading.json";
import sanyodoHoldings from "./sanyodo-holdings.json";
import sanyu from "./sanyu.json";
import sanyuConstruction from "./sanyu-construction.json";
import sapeet from "./sapeet.json";
import sapporoClinicalLaboratory from "./sapporo-clinical-laboratory.json";
import sapporoHoldings from "./sapporo-holdings.json";
import sasatokuPrinting from "./sasatoku-printing.json";
import sataConstruction from "./sata-construction.json";
import sato from "./sato.json";
import satoFoods from "./sato-foods.json";
import satoFoodsIndustries from "./sato-foods-industries.json";
import satoShoJi from "./sato-sho-ji.json";
import satohAndCo from "./satoh-and-co.json";
import satoriElectric from "./satori-electric.json";
import satudoraHoldings from "./satudora-holdings.json";
import sawafujiElectric from "./sawafuji-electric.json";
import sawaiGroupHoldings from "./sawai-group-holdings.json";
import saxa from "./saxa.json";
import saylorAdvertising from "./saylor-advertising.json";
import sbiAruhi from "./sbi-aruhi.json";
import sbiGlobalAssetManagement from "./sbi-global-asset-management.json";
import sbiHoldings from "./sbi-holdings.json";
import sbiInsuranceGroup from "./sbi-insurance-group.json";
import sbiLeasingServices from "./sbi-leasing-services.json";
import sbiRheosHifumi from "./sbi-rheos-hifumi.json";
import sbiShinseiBank from "./sbi-shinsei-bank.json";
import sbiSumishinNetBank from "./sbi-sumishin-net-bank.json";
import sbsHoldings from "./sbs-holdings.json";
import scala from "./scala.json";
import scat from "./scat.json";
import schoo from "./schoo.json";
import scienceArts from "./science-arts.json";
import scinex from "./scinex.json";
import screenHoldings from "./screen-holdings.json";
import scroll from "./scroll.json";
import scsk from "./scsk.json";
import sdEntertainment from "./sd-entertainment.json";
import sdsHoldings from "./sds-holdings.json";
import secCarbon from "./sec-carbon.json";
import secom from "./secom.json";
import secuavail from "./secuavail.json";
import secure from "./secure.json";
import seed from "./seed.json";
import segaSammyHoldings from "./sega-sammy-holdings.json";
import segueGroup from "./segue-group.json";
import seibuElectricAndMachinery from "./seibu-electric-and-machinery.json";
import seibuGiken from "./seibu-giken.json";
import seibuHoldings from "./seibu-holdings.json";
import seigakusha from "./seigakusha.json";
import seihyo from "./seihyo.json";
import seika from "./seika.json";
import seikagaku from "./seikagaku.json";
import seikitokyuKogyo from "./seikitokyu-kogyo.json";
import seiko from "./seiko.json";
import seikoElectric from "./seiko-electric.json";
import seikoEpson from "./seiko-epson.json";
import seikoGroup from "./seiko-group.json";
import seikohGiken from "./seikoh-giken.json";
import seinoHoldings from "./seino-holdings.json";
import seiren from "./seiren.json";
import seiryoElectric from "./seiryo-electric.json";
import seiwaChuoHoldings from "./seiwa-chuo-holdings.json";
import seiwaElectricMfg from "./seiwa-electric-mfg.json";
import seiwaHoldings from "./seiwa-holdings.json";
import seiyuKogyo from "./seiyu-kogyo.json";
import seki from "./seki.json";
import sekichu from "./sekichu.json";
import sekido from "./sekido.json";
import sekisuiChemical from "./sekisui-chemical.json";
import sekisuiHouse from "./sekisui-house.json";
import sekisuiJushi from "./sekisui-jushi.json";
import sekisuiKasei from "./sekisui-kasei.json";
import semba from "./semba.json";
import sembaTohkaIndustries from "./semba-tohka-industries.json";
import semitec from "./semitec.json";
import senkoGroupHoldings from "./senko-group-holdings.json";
import senkonLogistics from "./senkon-logistics.json";
import senshuElectric from "./senshu-electric.json";
import senshuIkedaHoldings from "./senshu-ikeda-holdings.json";
import senshukai from "./senshukai.json";
import septeniHoldings from "./septeni-holdings.json";
import seraku from "./seraku.json";
import serendipHoldings from "./serendip-holdings.json";
import seria from "./seria.json";
import serverworks from "./serverworks.json";
import sevenAndIHoldings from "./seven-and-i-holdings.json";
import sevenBank from "./seven-bank.json";
import sevenIndustries from "./seven-industries.json";
import seyfert from "./seyfert.json";
import sfpHoldings from "./sfp-holdings.json";
import sgHoldings from "./sg-holdings.json";
import shanon from "./shanon.json";
import sharingInnovations from "./sharing-innovations.json";
import sharingtechnology from "./sharingtechnology.json";
import sharp from "./sharp.json";
import shibauraElectronics from "./shibaura-electronics.json";
import shibauraMachine from "./shibaura-machine.json";
import shibauraMechatronics from "./shibaura-mechatronics.json";
import shibusawaLogistics from "./shibusawa-logistics.json";
import shibuya from "./shibuya.json";
import shift from "./shift.json";
import shigematsuWorks from "./shigematsu-works.json";
import shikibo from "./shikibo.json";
import shikigaku from "./shikigaku.json";
import shikinoHighTech from "./shikino-high-tech.json";
import shikokuKaseiHoldings from "./shikoku-kasei-holdings.json";
import shimaSeikiMfg from "./shima-seiki-mfg.json";
import shimadaya from "./shimadaya.json";
import shimadzu from "./shimadzu.json";
import shimamura from "./shimamura.json";
import shimano from "./shimano.json";
import shimizu from "./shimizu.json";
import shimojima from "./shimojima.json";
import shinEtsuChemical from "./shin-etsu-chemical.json";
import shinEtsuPolymer from "./shin-etsu-polymer.json";
import shinMaintHoldings from "./shin-maint-holdings.json";
import shinNipponAirTechnologies from "./shin-nippon-air-technologies.json";
import shinNipponBiomedicalLaboratories from "./shin-nippon-biomedical-laboratories.json";
import shinagawaRefra from "./shinagawa-refra.json";
import shindenHightex from "./shinden-hightex.json";
import shindengenElectricManufacturing from "./shindengen-electric-manufacturing.json";
import shingakukaiHoldings from "./shingakukai-holdings.json";
import shinhokokuMaterial from "./shinhokoku-material.json";
import shinkiBus from "./shinki-bus.json";
import shinko from "./shinko.json";
import shinkoShoji from "./shinko-shoji.json";
import shinkoWire from "./shinko-wire.json";
import shinmaywaIndustries from "./shinmaywa-industries.json";
import shinnihon from "./shinnihon.json";
import shinnihonseiyaku from "./shinnihonseiyaku.json";
import shinobuFoodsProducts from "./shinobu-foods-products.json";
import shinozakiya from "./shinozakiya.json";
import shinpo from "./shinpo.json";
import shinsho from "./shinsho.json";
import shinto from "./shinto.json";
import shintoHoldings from "./shinto-holdings.json";
import shintoPaint from "./shinto-paint.json";
import shinwa from "./shinwa.json";
import shinwa7607 from "./shinwa-7607.json";
import shinwaHoldings from "./shinwa-holdings.json";
import shinwaWiseHoldings from "./shinwa-wise-holdings.json";
import shinyeiKaisha from "./shinyei-kaisha.json";
import shionogiAndCo from "./shionogi-and-co.json";
import shipHealthcareHoldings from "./ship-healthcare-holdings.json";
import shiraiElectronicsIndustrial from "./shirai-electronics-industrial.json";
import shirohato from "./shirohato.json";
import shiseido from "./shiseido.json";
import shizukiElectric from "./shizuki-electric.json";
import shizuokaFinancialGroup from "./shizuoka-financial-group.json";
import shizuokaGas from "./shizuoka-gas.json";
import shoBondHoldings from "./sho-bond-holdings.json";
import shobido from "./shobido.json";
import shobunshaHoldings from "./shobunsha-holdings.json";
import shochiku from "./shochiku.json";
import shoei from "./shoei.json";
import shoei9385 from "./shoei-9385.json";
import shoeiFoods from "./shoei-foods.json";
import shoeiYakuhin from "./shoei-yakuhin.json";
import shofu from "./shofu.json";
import shokubun from "./shokubun.json";
import showaChemicalIndustry from "./showa-chemical-industry.json";
import showaHoldings from "./showa-holdings.json";
import showaManufacturing from "./showa-manufacturing.json";
import showaPaxxs from "./showa-paxxs.json";
import showaSangyo from "./showa-sangyo.json";
import showaShinku from "./showa-shinku.json";
import showaSystemEngineering from "./showa-system-engineering.json";
import showcase from "./showcase.json";
import shueiYobiko from "./shuei-yobiko.json";
import sigGroup from "./sig-group.json";
import sigmakoki from "./sigmakoki.json";
import sigmaxyzHoldings from "./sigmaxyz-holdings.json";
import signpost from "./signpost.json";
import siix from "./siix.json";
import siliconStudio from "./silicon-studio.json";
import silverEggTechnology from "./silver-egg-technology.json";
import silverLife from "./silver-life.json";
import simplexHoldings from "./simplex-holdings.json";
import sinanenHoldings from "./sinanen-holdings.json";
import sincere from "./sincere.json";
import sinfoniaTechnology from "./sinfonia-technology.json";
import sinkoIndustries from "./sinko-industries.json";
import sinops from "./sinops.json";
import sintokogio from "./sintokogio.json";
import sios from "./sios.json";
import siriusvision from "./siriusvision.json";
import skElectronics from "./sk-electronics.json";
import skJapan from "./sk-japan.json";
import skKaken from "./sk-kaken.json";
import skyPerfectJsat from "./sky-perfect-jsat.json";
import skylarkHoldings from "./skylark-holdings.json";
import skymarkAirlines from "./skymark-airlines.json";
import slogan from "./slogan.json";
import smEntertainmentJapan from "./sm-entertainment-japan.json";
import smaregi from "./smaregi.json";
import smartdrive from "./smartdrive.json";
import smartvalue from "./smartvalue.json";
import smc from "./smc.json";
import smileHoldings from "./smile-holdings.json";
import smk from "./smk.json";
import smn from "./smn.json";
import sms from "./sms.json";
import sobal from "./sobal.json";
import socialwire from "./socialwire.json";
import socionext from "./socionext.json";
import sockets from "./sockets.json";
import sodaNikka from "./soda-nikka.json";
import sodick from "./sodick.json";
import soft99corporation from "./soft99corporation.json";
import softbank from "./softbank.json";
import softbankGroup from "./softbank-group.json";
import softcreateHoldings from "./softcreate-holdings.json";
import softfrontHoldings from "./softfront-holdings.json";
import softmax from "./softmax.json";
import softtex from "./softtex.json";
import softwareService from "./software-service.json";
import soikenHoldings from "./soiken-holdings.json";
import sojitz from "./sojitz.json";
import sokenChemicalAndEngineering from "./soken-chemical-and-engineering.json";
import sokensha from "./sokensha.json";
import solasiaPharma from "./solasia-pharma.json";
import solasto from "./solasto.json";
import solekia from "./solekia.json";
import solitonSystems from "./soliton-systems.json";
import solizeHoldings from "./solize-holdings.json";
import solvvy from "./solvvy.json";
import solxyz from "./solxyz.json";
import somar from "./somar.json";
import sompoHoldings from "./sompo-holdings.json";
import sonec from "./sonec.json";
import sonocom from "./sonocom.json";
import sonyFinancialGroup from "./sony-financial-group.json";
import sonyGroup from "./sony-group.json";
import sophiaHoldings from "./sophia-holdings.json";
import soracom from "./soracom.json";
import sotetsuHoldings from "./sotetsu-holdings.json";
import sotoh from "./sotoh.json";
import sougouShouken from "./sougou-shouken.json";
import soukenAce from "./souken-ace.json";
import sourcenext from "./sourcenext.json";
import space from "./space.json";
import spaceMarket from "./space-market.json";
import spaceShowerSkiyakiHoldings from "./space-shower-skiyaki-holdings.json";
import sparxGroup from "./sparx-group.json";
import speee from "./speee.json";
import spiderplusAndCo from "./spiderplus-and-co.json";
import spk from "./spk.json";
import sportsfield from "./sportsfield.json";
import sprix from "./sprix.json";
import squareEnixHoldings from "./square-enix-holdings.json";
import sraHoldings from "./sra-holdings.json";
import sreHoldings from "./sre-holdings.json";
import srsHoldings from "./srs-holdings.json";
import stCousair from "./st-cousair.json";
import stanleyElectric from "./stanley-electric.json";
import starMicaHoldings from "./star-mica-holdings.json";
import starMicronics from "./star-micronics.json";
import starSeeds from "./star-seeds.json";
import startiaHoldings from "./startia-holdings.json";
import startline from "./startline.json";
import starts from "./starts.json";
import startsPublishing from "./starts-publishing.json";
import starzen from "./starzen.json";
import stellaChemifa from "./stella-chemifa.json";
import stellaPharma from "./stella-pharma.json";
import stemcellInstitute from "./stemcell-institute.json";
import stemrim from "./stemrim.json";
import step from "./step.json";
import stg from "./stg.json";
import stiFoodsHoldings from "./sti-foods-holdings.json";
import stmn from "./stmn.json";
import storageOh from "./storage-oh.json";
import stream from "./stream.json";
import striders from "./striders.json";
import strike from "./strike.json";
import strust from "./strust.json";
import studioAlice from "./studio-alice.json";
import studioAtao from "./studio-atao.json";
import subaru from "./subaru.json";
import subaru9778 from "./subaru-9778.json";
import subaruEnterprise from "./subaru-enterprise.json";
import succeed from "./succeed.json";
import sugaiChemicalIndustry from "./sugai-chemical-industry.json";
import sugiHoldings from "./sugi-holdings.json";
import sugimotoAndCo from "./sugimoto-and-co.json";
import sugimuraWarehouse from "./sugimura-warehouse.json";
import sugitaAce from "./sugita-ace.json";
import suidoKikoKaisha from "./suido-kiko-kaisha.json";
import sukegawaElectric from "./sukegawa-electric.json";
import sumasapo from "./sumasapo.json";
import sumco from "./sumco.json";
import sumida from "./sumida.json";
import sumikenMitsuiRoad from "./sumiken-mitsui-road.json";
import suminoe from "./suminoe.json";
import sumisekiHoldings from "./sumiseki-holdings.json";
import sumitomoBakelite from "./sumitomo-bakelite.json";
import sumitomoChemical from "./sumitomo-chemical.json";
import sumitomoCorporation from "./sumitomo-corporation.json";
import sumitomoDensetsu from "./sumitomo-densetsu.json";
import sumitomoElectricIndustries from "./sumitomo-electric-industries.json";
import sumitomoForestry from "./sumitomo-forestry.json";
import sumitomoMetalMining from "./sumitomo-metal-mining.json";
import sumitomoMitsuiConstruction from "./sumitomo-mitsui-construction.json";
import sumitomoMitsuiFinancialGroup from "./sumitomo-mitsui-financial-group.json";
import sumitomoMitsuiTrustGroup from "./sumitomo-mitsui-trust-group.json";
import sumitomoOsakaCement from "./sumitomo-osaka-cement.json";
import sumitomoPharma from "./sumitomo-pharma.json";
import sumitomoRealtyAndDevelopment from "./sumitomo-realty-and-development.json";
import sumitomoRiko from "./sumitomo-riko.json";
import sumitomoRubberIndustries from "./sumitomo-rubber-industries.json";
import sumitomoSeikaChemicals from "./sumitomo-seika-chemicals.json";
import sun from "./sun.json";
import sunAKaken from "./sun-a-kaken.json";
import sunFrontierFudousan from "./sun-frontier-fudousan.json";
import sunLifeHolding from "./sun-life-holding.json";
import sunMesse from "./sun-messe.json";
import sunWaTechnos from "./sun-wa-technos.json";
import sunautas from "./sunautas.json";
import suncall from "./suncall.json";
import suncorporation from "./suncorporation.json";
import sunday from "./sunday.json";
import sundrug from "./sundrug.json";
import sunnextaGroup from "./sunnexta-group.json";
import sunnySideUpGroup from "./sunny-side-up-group.json";
import suntoryBeverageAndFood from "./suntory-beverage-and-food.json";
import sunwels from "./sunwels.json";
import superTool from "./super-tool.json";
import superValue from "./super-value.json";
import superbag from "./superbag.json";
import suralaNet from "./surala-net.json";
import surugaBank from "./suruga-bank.json";
import sus from "./sus.json";
import susmed from "./susmed.json";
import suzuden from "./suzuden.json";
import suzuken from "./suzuken.json";
import suzuki from "./suzuki.json";
import suzuki6785 from "./suzuki-6785.json";
import suzumoMachinery from "./suzumo-machinery.json";
import suzuyoShinwart from "./suzuyo-shinwart.json";
import swcc from "./swcc.json";
import sylaHoldings from "./syla-holdings.json";
import symbioPharmaceuticals from "./symbio-pharmaceuticals.json";
import synchroFood from "./synchro-food.json";
import synclayer from "./synclayer.json";
import synspective from "./synspective.json";
import sysHoldings from "./sys-holdings.json";
import sysmex from "./sysmex.json";
import systemD from "./system-d.json";
import systemIntegrator from "./system-integrator.json";
import systemLocation from "./system-location.json";
import systemResearch from "./system-research.json";
import systemSupportHoldings from "./system-support-holdings.json";
import systemexe from "./systemexe.json";
import systemsDesign from "./systems-design.json";
import systemsEngineeringConsultants from "./systems-engineering-consultants.json";
import systemsoft from "./systemsoft.json";
import systena from "./systena.json";
import syuppin from "./syuppin.json";
import tAndSGroup from "./t-and-s-group.json";
import tHasegawa from "./t-hasegawa.json";
import tKawabeAndCo from "./t-kawabe-and-co.json";
import tOHoldings from "./t-o-holdings.json";
import tRad from "./t-rad.json";
import tabikobo from "./tabikobo.json";
import tabio from "./tabio.json";
import tac from "./tac.json";
import tachiS from "./tachi-s.json";
import tachibanaEletech from "./tachibana-eletech.json";
import tachikawa from "./tachikawa.json";
import tacmina from "./tacmina.json";
import tadano from "./tadano.json";
import taiheiDengyoKaisha from "./taihei-dengyo-kaisha.json";
import taiheiMachineryWorks from "./taihei-machinery-works.json";
import taiheiyoCement from "./taiheiyo-cement.json";
import taiheiyoKouhatsu from "./taiheiyo-kouhatsu.json";
import taihoKogyo from "./taiho-kogyo.json";
import taihoTransportation from "./taiho-transportation.json";
import taikisha from "./taikisha.json";
import taikoPharmaceutical from "./taiko-pharmaceutical.json";
import taisei from "./taisei.json";
import taiseiLamickGroupHeadQuarterAndInnovation from "./taisei-lamick-group-head-quarter-and-innovation.json";
import taiseiOncho from "./taisei-oncho.json";
import taiyoBussanKaisha from "./taiyo-bussan-kaisha.json";
import taiyoHoldings from "./taiyo-holdings.json";
import taiyoKagaku from "./taiyo-kagaku.json";
import taiyoKisokogyo from "./taiyo-kisokogyo.json";
import taiyoTechnolex from "./taiyo-technolex.json";
import taiyoYuden from "./taiyo-yuden.json";
import takachiho from "./takachiho.json";
import takachihoKoheki from "./takachiho-koheki.json";
import takada from "./takada.json";
import takadakikoSteelConstruction from "./takadakiko-steel-construction.json";
import takagiSeiko from "./takagi-seiko.json";
import takahashiCurtainWall from "./takahashi-curtain-wall.json";
import takakita from "./takakita.json";
import takamatsuConstructionGroup from "./takamatsu-construction-group.json";
import takamatsuMachinery from "./takamatsu-machinery.json";
import takamisawa from "./takamisawa.json";
import takamisawaCybernetics from "./takamisawa-cybernetics.json";
import takamiya from "./takamiya.json";
import takano from "./takano.json";
import takaokaToko from "./takaoka-toko.json";
import takaraAndCompany from "./takara-and-company.json";
import takaraBio from "./takara-bio.json";
import takaraHoldings from "./takara-holdings.json";
import takaraStandard from "./takara-standard.json";
import takasagoInternational from "./takasago-international.json";
import takasagoTekkoKK from "./takasago-tekko-k-k.json";
import takasagoThermalEngineering from "./takasago-thermal-engineering.json";
import takase from "./takase.json";
import takashimaAndCo from "./takashima-and-co.json";
import takashimaya from "./takashimaya.json";
import takasho from "./takasho.json";
import takatori from "./takatori.json";
import takayoshiHoldings from "./takayoshi-holdings.json";
import takeAndGiveNeeds from "./take-and-give-needs.json";
import takebishi from "./takebishi.json";
import takedaIpHoldings from "./takeda-ip-holdings.json";
import takedaMachinery from "./takeda-machinery.json";
import takedaPharmaceutical from "./takeda-pharmaceutical.json";
import takemotoYohki from "./takemoto-yohki.json";
import takeuchiMfg from "./takeuchi-mfg.json";
import takiChemical from "./taki-chemical.json";
import takihyo from "./takihyo.json";
import takizawaHam from "./takizawa-ham.json";
import takuma from "./takuma.json";
import talentx from "./talentx.json";
import tamaHome from "./tama-home.json";
import tamagawaHoldings from "./tamagawa-holdings.json";
import tamaiSteamship from "./tamai-steamship.json";
import tameny from "./tameny.json";
import tamron from "./tamron.json";
import tamura from "./tamura.json";
import tanabeConsultingGroup from "./tanabe-consulting-group.json";
import tanabeEngineering from "./tanabe-engineering.json";
import tanaka from "./tanaka.json";
import tanakaChemical from "./tanaka-chemical.json";
import tanakaSeimitsuKogyo from "./tanaka-seimitsu-kogyo.json";
import tanaken from "./tanaken.json";
import tanseisha from "./tanseisha.json";
import taokaChemical from "./taoka-chemical.json";
import tasukiHoldings from "./tasuki-holdings.json";
import taunsLaboratories from "./tauns-laboratories.json";
import tayTwo from "./tay-two.json";
import taya from "./taya.json";
import tayca from "./tayca.json";
import tazmo from "./tazmo.json";
import tbGroup from "./tb-group.json";
import tbk from "./tbk.json";
import tbsHoldings from "./tbs-holdings.json";
import tdcSoft from "./tdc-soft.json";
import tdk from "./tdk.json";
import tdse from "./tdse.json";
import teaLife from "./tea-life.json";
import teac from "./teac.json";
import teamspirit from "./teamspirit.json";
import tear from "./tear.json";
import techfirmHoldings from "./techfirm-holdings.json";
import techmatrix from "./techmatrix.json";
import technoAlpha from "./techno-alpha.json";
import technoHorizon from "./techno-horizon.json";
import technoMathematical from "./techno-mathematical.json";
import technoMedica from "./techno-medica.json";
import technoRyowa from "./techno-ryowa.json";
import technoSmart from "./techno-smart.json";
import technoflex from "./technoflex.json";
import technologies from "./technologies.json";
import technoproHoldings from "./technopro-holdings.json";
import tecmiraHoldings from "./tecmira-holdings.json";
import tecnisco from "./tecnisco.json";
import teijin from "./teijin.json";
import teikoku from "./teikoku.json";
import teikokuSenI from "./teikoku-sen-i.json";
import teikokuTsushinKogyo from "./teikoku-tsushin-kogyo.json";
import tein from "./tein.json";
import tekken from "./tekken.json";
import tekscendPhotomask from "./tekscend-photomask.json";
import temairazu from "./temairazu.json";
import temona from "./temona.json";
import tenAllied from "./ten-allied.json";
import tenda from "./tenda.json";
import tenma from "./tenma.json";
import tenmayaStore from "./tenmaya-store.json";
import tenoHoldings from "./teno-holdings.json";
import tenox from "./tenox.json";
import tenposHoldings from "./tenpos-holdings.json";
import tenryuSawMfg from "./tenryu-saw-mfg.json";
import tenshoElectricIndustries from "./tensho-electric-industries.json";
import tential from "./tential.json";
import teraProbe from "./tera-probe.json";
import teraTechnology from "./tera-technology.json";
import terasakiElectric from "./terasaki-electric.json";
import terilogyHoldings from "./terilogy-holdings.json";
import terminalcareSupportInstitute from "./terminalcare-support-institute.json";
import terraDrone from "./terra-drone.json";
import terrasky from "./terrasky.json";
import terumo from "./terumo.json";
import tesec from "./tesec.json";
import tessHoldings from "./tess-holdings.json";
import tetsujinHoldings from "./tetsujin-holdings.json";
import the77Bank from "./the-77-bank.json";
import theAkitaBank from "./the-akita-bank.json";
import theAwaBank from "./the-awa-bank.json";
import theBankOfIwate from "./the-bank-of-iwate.json";
import theBankOfNagoya from "./the-bank-of-nagoya.json";
import theBankOfSaga from "./the-bank-of-saga.json";
import theBankOfToyama from "./the-bank-of-toyama.json";
import theChibaBank from "./the-chiba-bank.json";
import theChibaKogyoBank from "./the-chiba-kogyo-bank.json";
import theChikuhoBank from "./the-chikuho-bank.json";
import theDaitoBank from "./the-daito-bank.json";
import theEhimeBank from "./the-ehime-bank.json";
import theFirstBankOfToyama from "./the-first-bank-of-toyama.json";
import theFukuiBank from "./the-fukui-bank.json";
import theFukushimaBank from "./the-fukushima-bank.json";
import theFurukawaBattery from "./the-furukawa-battery.json";
import theGlobal from "./the-global.json";
import theGunmaBank from "./the-gunma-bank.json";
import theHanshinDieselWorks from "./the-hanshin-diesel-works.json";
import theHyakugoBank from "./the-hyakugo-bank.json";
import theHyakujushiBank from "./the-hyakujushi-bank.json";
import theImamuraSecurities from "./the-imamura-securities.json";
import theJapanSteelWorks from "./the-japan-steel-works.json";
import theJapanWoolTextile from "./the-japan-wool-textile.json";
import theKaneshitaConstruction from "./the-kaneshita-construction.json";
import theKeihin from "./the-keihin.json";
import theKeiyoBank from "./the-keiyo-bank.json";
import theKinkiSharyo from "./the-kinki-sharyo.json";
import theKitaNipponBank from "./the-kita-nippon-bank.json";
import theKiyoBank from "./the-kiyo-bank.json";
import theKodensha from "./the-kodensha.json";
import theKyotoHotel from "./the-kyoto-hotel.json";
import theLead from "./the-lead.json";
import theMiyazakiBank from "./the-miyazaki-bank.json";
import theMonogatari from "./the-monogatari.json";
import theMusashinoBank from "./the-musashino-bank.json";
import theNantoBank from "./the-nanto-bank.json";
import theNihonSeima from "./the-nihon-seima.json";
import theNipponRoad from "./the-nippon-road.json";
import theNipponSignal from "./the-nippon-signal.json";
import theNisshinOillioGroup from "./the-nisshin-oillio-group.json";
import theOgakiKyoritsuBank from "./the-ogaki-kyoritsu-bank.json";
import theOitaBank from "./the-oita-bank.json";
import thePack from "./the-pack.json";
import theRoyalHotel from "./the-royal-hotel.json";
import theSailorPen from "./the-sailor-pen.json";
import theSanInGodoBank from "./the-san-in-godo-bank.json";
import theShigaBank from "./the-shiga-bank.json";
import theShikokuBank from "./the-shikoku-bank.json";
import theShimizuBank from "./the-shimizu-bank.json";
import theSumitomoWarehouse from "./the-sumitomo-warehouse.json";
import theTaikoBank from "./the-taiko-bank.json";
import theTakigamiSteelConstruction from "./the-takigami-steel-construction.json";
import theTochigiBank from "./the-tochigi-bank.json";
import theTohoBank from "./the-toho-bank.json";
import theTohokuBank from "./the-tohoku-bank.json";
import theTorigoe from "./the-torigoe.json";
import theTottoriBank from "./the-tottori-bank.json";
import theTowaBank from "./the-towa-bank.json";
import theWhyHowDo from "./the-why-how-do.json";
import theYamagataBank from "./the-yamagata-bank.json";
import theYamanashiChuoBank from "./the-yamanashi-chuo-bank.json";
import theYokohamaRubber from "./the-yokohama-rubber.json";
import theYonkyu from "./the-yonkyu.json";
import theZenitaka from "./the-zenitaka.json";
import thecoo from "./thecoo.json";
import thermaeYuHoldings from "./thermae-yu-holdings.json";
import thinca from "./thinca.json";
import thineElectronics from "./thine-electronics.json";
import thk from "./thk.json";
import tiemco from "./tiemco.json";
import tigersPolymer from "./tigers-polymer.json";
import timee from "./timee.json";
import tis from "./tis.json";
import titanKogyo from "./titan-kogyo.json";
import tkc from "./tkc.json";
import tkp from "./tkp.json";
import tmh from "./tmh.json";
import tms from "./tms.json";
import toBooks from "./to-books.json";
import toa from "./toa.json";
import toa6809 from "./toa-6809.json";
import toaRoad from "./toa-road.json";
import toabo from "./toabo.json";
import toagosei from "./toagosei.json";
import toami from "./toami.json";
import toba from "./toba.json";
import tobilaSystems from "./tobila-systems.json";
import tobishimaHoldings from "./tobishima-holdings.json";
import tobuRailway from "./tobu-railway.json";
import toc from "./toc.json";
import tocalo from "./tocalo.json";
import toda from "./toda.json";
import todaKogyo from "./toda-kogyo.json";
import toei from "./toei.json";
import toeiAnimation from "./toei-animation.json";
import toell from "./toell.json";
import toenec from "./toenec.json";
import togamiElectricMfg from "./togami-electric-mfg.json";
import tohbuNetwork from "./tohbu-network.json";
import toho from "./toho.json";
import tohoAcetylene from "./toho-acetylene.json";
import tohoChemicalIndustry from "./toho-chemical-industry.json";
import tohoGas from "./toho-gas.json";
import tohoHoldings from "./toho-holdings.json";
import tohoLamac from "./toho-lamac.json";
import tohoSystemScience from "./toho-system-science.json";
import tohoTitanium from "./toho-titanium.json";
import tohokuChemical from "./tohoku-chemical.json";
import tohokuElectricPower from "./tohoku-electric-power.json";
import tohokuSteel from "./tohoku-steel.json";
import tohokushinshaFilm from "./tohokushinsha-film.json";
import toin from "./toin.json";
import tokai from "./tokai.json";
import tokaiCarbon from "./tokai-carbon.json";
import tokaiElectronics from "./tokai-electronics.json";
import tokaiHoldings from "./tokai-holdings.json";
import tokaiKisen from "./tokai-kisen.json";
import tokaiLease from "./tokai-lease.json";
import tokaiRika from "./tokai-rika.json";
import tokaiSenko from "./tokai-senko.json";
import tokaiSoft from "./tokai-soft.json";
import tokaiTokyoFinancialHoldings from "./tokai-tokyo-financial-holdings.json";
import token from "./token.json";
import tokioMarineHoldings from "./tokio-marine-holdings.json";
import tokuden from "./tokuden.json";
import tokura from "./tokura.json";
import tokushuTokaiPaper from "./tokushu-tokai-paper.json";
import tokuyama from "./tokuyama.json";
import tokyoAutomaticMachineryWorks from "./tokyo-automatic-machinery-works.json";
import tokyoBase from "./tokyo-base.json";
import tokyoCentury from "./tokyo-century.json";
import tokyoCommunicationsGroup from "./tokyo-communications-group.json";
import tokyoCosmosElectric from "./tokyo-cosmos-electric.json";
import tokyoElectron from "./tokyo-electron.json";
import tokyoElectronDevice from "./tokyo-electron-device.json";
import tokyoEnergyAndSystems from "./tokyo-energy-and-systems.json";
import tokyoGas from "./tokyo-gas.json";
import tokyoIchibanFoods from "./tokyo-ichiban-foods.json";
import tokyoIndividualizedEducationalInstitute from "./tokyo-individualized-educational-institute.json";
import tokyoKaikan from "./tokyo-kaikan.json";
import tokyoKeiki from "./tokyo-keiki.json";
import tokyoKikaiSeisakusho from "./tokyo-kikai-seisakusho.json";
import tokyoKiraboshiFinancialGroup from "./tokyo-kiraboshi-financial-group.json";
import tokyoKisen from "./tokyo-kisen.json";
import tokyoKoki from "./tokyo-koki.json";
import tokyoMetro from "./tokyo-metro.json";
import tokyoOhkaKogyo from "./tokyo-ohka-kogyo.json";
import tokyoPrintingInkMfg from "./tokyo-printing-ink-mfg.json";
import tokyoRadiatorMfg from "./tokyo-radiator-mfg.json";
import tokyoRopeMfg from "./tokyo-rope-mfg.json";
import tokyoSangyo from "./tokyo-sangyo.json";
import tokyoSeimitsu from "./tokyo-seimitsu.json";
import tokyoSoir from "./tokyo-soir.json";
import tokyoTatemono from "./tokyo-tatemono.json";
import tokyoTekko from "./tokyo-tekko.json";
import tokyoTheatres from "./tokyo-theatres.json";
import tokyotokeiba from "./tokyotokeiba.json";
import tokyu from "./tokyu.json";
import tokyuConstruction from "./tokyu-construction.json";
import tokyuFudosanHoldings from "./tokyu-fudosan-holdings.json";
import toli from "./toli.json";
import tomatoBank from "./tomato-bank.json";
import tomenDevices from "./tomen-devices.json";
import tomita from "./tomita.json";
import tomitaElectric from "./tomita-electric.json";
import tomoe from "./tomoe.json";
import tomoeEngineering from "./tomoe-engineering.json";
import tomoegawa from "./tomoegawa.json";
import tomoku from "./tomoku.json";
import tomonyHoldings from "./tomony-holdings.json";
import tomy from "./tomy.json";
import tone from "./tone.json";
import topCulture from "./top-culture.json";
import topcon from "./topcon.json";
import toppanHoldings from "./toppan-holdings.json";
import topre from "./topre.json";
import topyIndustries from "./topy-industries.json";
import toray from "./toray.json";
import torexSemiconductor from "./torex-semiconductor.json";
import torico from "./torico.json";
import toridollHoldings from "./toridoll-holdings.json";
import toridori from "./toridori.json";
import toriiPharmaceutical from "./torii-pharmaceutical.json";
import torishimaPumpMfg from "./torishima-pump-mfg.json";
import torq from "./torq.json";
import tose from "./tose.json";
import tosei from "./tosei.json";
import toshibaTec from "./toshiba-tec.json";
import toshinHoldings from "./toshin-holdings.json";
import tosho from "./tosho.json";
import tosnet from "./tosnet.json";
import toso from "./toso.json";
import tosoh from "./tosoh.json";
import totech from "./totech.json";
import totenko from "./totenko.json";
import totetsuKogyo from "./totetsu-kogyo.json";
import toto from "./toto.json";
import toubujyuhan from "./toubujyuhan.json";
import toukeiComputer from "./toukei-computer.json";
import toumei from "./toumei.json";
import tow from "./tow.json";
import towa from "./towa.json";
import towaFoodService from "./towa-food-service.json";
import towaHiSystem from "./towa-hi-system.json";
import towaPharmaceutical from "./towa-pharmaceutical.json";
import townnewsSha from "./townnews-sha.json";
import toyo from "./toyo.json";
import toyoAsanoFoundation from "./toyo-asano-foundation.json";
import toyoConstruction from "./toyo-construction.json";
import toyoDenkiSeizo from "./toyo-denki-seizo.json";
import toyoDrilube from "./toyo-drilube.json";
import toyoElectric from "./toyo-electric.json";
import toyoGosei from "./toyo-gosei.json";
import toyoInnovex from "./toyo-innovex.json";
import toyoKanetsu from "./toyo-kanetsu.json";
import toyoLogistics from "./toyo-logistics.json";
import toyoSecurities from "./toyo-securities.json";
import toyoSeikanGroupHoldings from "./toyo-seikan-group-holdings.json";
import toyoShutter from "./toyo-shutter.json";
import toyoSuisanKaisha from "./toyo-suisan-kaisha.json";
import toyoTanso from "./toyo-tanso.json";
import toyoTec from "./toyo-tec.json";
import toyoTire from "./toyo-tire.json";
import toyoWharfAndWarehouse from "./toyo-wharf-and-warehouse.json";
import toyobo from "./toyobo.json";
import toyodaGosei from "./toyoda-gosei.json";
import toyokumo from "./toyokumo.json";
import toyota from "./toyota.json";
import toyotaBoshoku from "./toyota-boshoku.json";
import toyotaIndustries6201 from "./toyota-industries-6201.json";
import toyotaTsusho from "./toyota-tsusho.json";
import tpr from "./tpr.json";
import traasOnProduct from "./traas-on-product.json";
import tradeWorks from "./trade-works.json";
import tradersHoldings from "./traders-holdings.json";
import trailheadGlobalHoldings from "./trailhead-global-holdings.json";
import transGenicGroup from "./trans-genic-group.json";
import transaction from "./transaction.json";
import transactionMediaNetworks from "./transaction-media-networks.json";
import transcosmos from "./transcosmos.json";
import treHoldings from "./tre-holdings.json";
import treasureFactory from "./treasure-factory.json";
import trendMicro from "./trend-micro.json";
import trenders from "./trenders.json";
import triChemicalLaboratories from "./tri-chemical-laboratories.json";
import trialHoldings from "./trial-holdings.json";
import triis from "./triis.json";
import trinityIndustrial from "./trinity-industrial.json";
import tripla from "./tripla.json";
import tripleize from "./tripleize.json";
import truckOne from "./truck-one.json";
import trueData from "./true-data.json";
import truscoNakayama from "./trusco-nakayama.json";
import trust from "./trust.json";
import trustHoldings from "./trust-holdings.json";
import tsTech from "./ts-tech.json";
import tsiHoldings from "./tsi-holdings.json";
import tsubakiNakashima from "./tsubaki-nakashima.json";
import tsubakimotoChain from "./tsubakimoto-chain.json";
import tsubakimotoKogyo from "./tsubakimoto-kogyo.json";
import tsubotaLaboratory from "./tsubota-laboratory.json";
import tsuburayaFieldsHoldings from "./tsuburaya-fields-holdings.json";
import tsuchiyaHoldings from "./tsuchiya-holdings.json";
import tsudakoma from "./tsudakoma.json";
import tsugami from "./tsugami.json";
import tsukadaGlobalHoldings from "./tsukada-global-holdings.json";
import tsukamoto from "./tsukamoto.json";
import tsukijiUoichiba from "./tsukiji-uoichiba.json";
import tsukishimaHoldings from "./tsukishima-holdings.json";
import tsukubaBank from "./tsukuba-bank.json";
import tsumuraAndCo from "./tsumura-and-co.json";
import tsunaguGroupHoldings from "./tsunagu-group-holdings.json";
import tsuruhaHoldings from "./tsuruha-holdings.json";
import tsurumiManufacturing from "./tsurumi-manufacturing.json";
import tsuruya from "./tsuruya.json";
import tsutsumiJewelry from "./tsutsumi-jewelry.json";
import tsuzukiDenki from "./tsuzuki-denki.json";
import tvAsahiHoldings from "./tv-asahi-holdings.json";
import tvTokyoHoldings from "./tv-tokyo-holdings.json";
import tve from "./tve.json";
import twentyFourSevenHoldings from "./twenty-four-seven-holdings.json";
import twinbird from "./twinbird.json";
import twostoneAndSons from "./twostone-and-sons.json";
import tyk from "./tyk.json";
import uNextHoldings from "./u-next-holdings.json";
import uacj from "./uacj.json";
import ube from "./ube.json";
import ubicomHoldings from "./ubicom-holdings.json";
import ubiquitousAi from "./ubiquitous-ai.json";
import ubiteq from "./ubiteq.json";
import uchidaYoko from "./uchida-yoko.json";
import uchiyamaHoldings from "./uchiyama-holdings.json";
import ueki from "./ueki.json";
import uematsuShokai from "./uematsu-shokai.json";
import uex from "./uex.json";
import ukai from "./ukai.json";
import ulsGroup from "./uls-group.json";
import uluru from "./uluru.json";
import ulvac from "./ulvac.json";
import umenoyadoBrewery from "./umenoyado-brewery.json";
import umios from "./umios.json";
import unbanked from "./unbanked.json";
import unerry from "./unerry.json";
import unicafe from "./unicafe.json";
import unicharm from "./unicharm.json";
import uniformNext from "./uniform-next.json";
import unionTool from "./union-tool.json";
import unipres from "./unipres.json";
import unirita from "./unirita.json";
import unisolHoldings from "./unisol-holdings.json";
import uniteAndGrow from "./unite-and-grow.json";
import united from "./united.json";
import unitedAndCollective from "./united-and-collective.json";
import unitedArrows from "./united-arrows.json";
import unitedSuperMarketsHoldings from "./united-super-markets-holdings.json";
import univaOakHoldings from "./univa-oak-holdings.json";
import univance from "./univance.json";
import universalEngeisha from "./universal-engeisha.json";
import universalEntertainment from "./universal-entertainment.json";
import unozawaGumiIronWorks from "./unozawa-gumi-iron-works.json";
import uoki from "./uoki.json";
import uoriki from "./uoriki.json";
import upGarageGroup from "./up-garage-group.json";
import upcon from "./upcon.json";
import upr from "./upr.json";
import urbanet from "./urbanet.json";
import ureruNetAdvertisingGroup from "./ureru-net-advertising-group.json";
import uridoki from "./uridoki.json";
import userLocal from "./user-local.json";
import ushio from "./ushio.json";
import usonar from "./usonar.json";
import uss from "./uss.json";
import utGroup from "./ut-group.json";
import uuum from "./uuum.json";
import vCube from "./v-cube.json";
import vTechnology from "./v-technology.json";
import valorHoldings from "./valor-holdings.json";
import valqua from "./valqua.json";
import valtesHoldings from "./valtes-holdings.json";
import valueCreation from "./value-creation.json";
import valueGolf from "./value-golf.json";
import valueHr from "./value-hr.json";
import valuecommerce from "./valuecommerce.json";
import valuenceHoldings from "./valuence-holdings.json";
import valuenexJapan from "./valuenex-japan.json";
import varioSecure from "./vario-secure.json";
import vector from "./vector.json";
import vectorHoldings from "./vector-holdings.json";
import vega from "./vega.json";
import veltra from "./veltra.json";
import veritasInSilico from "./veritas-in-silico.json";
import verite from "./verite.json";
import vertex from "./vertex.json";
import viaHoldings from "./via-holdings.json";
import virtualexHoldings from "./virtualex-holdings.json";
import vis from "./vis.json";
import vision from "./vision.json";
import visional from "./visional.json";
import visualProcessingJapan from "./visual-processing-japan.json";
import visumo from "./visumo.json";
import vitalKskHoldings from "./vital-ksk-holdings.json";
import vlcSecurity from "./vlc-security.json";
import voltageIncorporation from "./voltage-incorporation.json";
import vrainSolution from "./vrain-solution.json";
import vtHoldings from "./vt-holdings.json";
import wScope from "./w-scope.json";
import wTokyo from "./w-tokyo.json";
import wa from "./wa.json";
import wacoalHoldings from "./wacoal-holdings.json";
import wacom from "./wacom.json";
import wacul from "./wacul.json";
import wadakohsan from "./wadakohsan.json";
import wagokoro from "./wagokoro.json";
import waidaMfg from "./waida-mfg.json";
import wakachikuConstruction from "./wakachiku-construction.json";
import wakamotoPharmaceutical from "./wakamoto-pharmaceutical.json";
import wakouShokuhin from "./wakou-shokuhin.json";
import wantedly from "./wantedly.json";
import waqoo from "./waqoo.json";
import warabeyaNichiyoHoldings from "./warabeya-nichiyo-holdings.json";
import wasedaAcademy from "./waseda-academy.json";
import wasedaGakushukenkyukai from "./waseda-gakushukenkyukai.json";
import washHouse from "./wash-house.json";
import washingtonHotel from "./washington-hotel.json";
import watahanAndCo from "./watahan-and-co.json";
import watanabeSato from "./watanabe-sato.json";
import watts from "./watts.json";
import wdbCoco from "./wdb-coco.json";
import wdbHoldings from "./wdb-holdings.json";
import wdi from "./wdi.json";
import wealthManagement from "./wealth-management.json";
import weathernews from "./weathernews.json";
import wedgeHoldings from "./wedge-holdings.json";
import welby from "./welby.json";
import welciaHoldings from "./welcia-holdings.json";
import wellneoSugar from "./wellneo-sugar.json";
import wellnessCommunications from "./wellness-communications.json";
import wellnet from "./wellnet.json";
import wescoHoldings from "./wesco-holdings.json";
import westHoldings from "./west-holdings.json";
import will from "./will.json";
import willGroup from "./will-group.json";
import willSmart from "./will-smart.json";
import willplusHoldings from "./willplus-holdings.json";
import wills from "./wills.json";
import willtec from "./willtec.json";
import winPartners from "./win-partners.json";
import wingarc1st from "./wingarc1st.json";
import wintest from "./wintest.json";
import wiseHoldings from "./wise-holdings.json";
import witz from "./witz.json";
import wolvesHand from "./wolves-hand.json";
import wonderplanet from "./wonderplanet.json";
import worldHoldings from "./world-holdings.json";
import wowow from "./wowow.json";
import writeup from "./writeup.json";
import xnet from "./xnet.json";
import yACHoldings from "./y-a-c-holdings.json";
import ySTable from "./y-s-table.json";
import yaMan from "./ya-man.json";
import yahagiConstruction from "./yahagi-construction.json";
import yakinikuSakaiHoldings from "./yakiniku-sakai-holdings.json";
import yakultHonsha from "./yakult-honsha.json";
import yamabiko from "./yamabiko.json";
import yamachuu from "./yamachuu.json";
import yamada from "./yamada.json";
import yamadaConsultingGroup from "./yamada-consulting-group.json";
import yamadaServicerSyntheticOffice from "./yamada-servicer-synthetic-office.json";
import yamaeGroupHoldings from "./yamae-group-holdings.json";
import yamahaMotor from "./yamaha-motor.json";
import yamaichiElectronics from "./yamaichi-electronics.json";
import yamaichiRealEstate from "./yamaichi-real-estate.json";
import yamaki from "./yamaki.json";
import yamami from "./yamami.json";
import yamashinFilter from "./yamashin-filter.json";
import yamato from "./yamato.json";
import yamatoHoldings from "./yamato-holdings.json";
import yamatoKogyo from "./yamato-kogyo.json";
import yamauHoldings from "./yamau-holdings.json";
import yamaura from "./yamaura.json";
import yamax from "./yamax.json";
import yamazakiBaking from "./yamazaki-baking.json";
import yappli from "./yappli.json";
import yashimaDenki from "./yashima-denki.json";
import yaskawaElectric from "./yaskawa-electric.json";
import yasuharaChemical from "./yasuhara-chemical.json";
import yasunaga from "./yasunaga.json";
import yeDigital from "./ye-digital.json";
import ykt from "./ykt.json";
import ymirlink from "./ymirlink.json";
import yodoko from "./yodoko.json";
import yokogawaBridgeHoldings from "./yokogawa-bridge-holdings.json";
import yokogawaElectric from "./yokogawa-electric.json";
import yokohamaFinancialGroup from "./yokohama-financial-group.json";
import yokorei from "./yokorei.json";
import yokotaManufacturing from "./yokota-manufacturing.json";
import yokowo from "./yokowo.json";
import yondenko from "./yondenko.json";
import yoshicon from "./yoshicon.json";
import yoshimuraFoodHoldings from "./yoshimura-food-holdings.json";
import yoshitake from "./yoshitake.json";
import yossixHoldings from "./yossix-holdings.json";
import yotaiRefractories from "./yotai-refractories.json";
import youji from "./youji.json";
import yrglm from "./yrglm.json";
import yukeS from "./yuke-s.json";
import yukenKogyo from "./yuken-kogyo.json";
import yukiGoseiKogyo from "./yuki-gosei-kogyo.json";
import yukiguniFactory from "./yukiguni-factory.json";
import yumemitsuketai from "./yumemitsuketai.json";
import yurtec from "./yurtec.json";
import yushin from "./yushin.json";
import yushiro from "./yushiro.json";
import yutakaFoods from "./yutaka-foods.json";
import yutakaGiken from "./yutaka-giken.json";
import yutori from "./yutori.json";
import zappallas from "./zappallas.json";
import zenhoren from "./zenhoren.json";
import zenkokuHosho from "./zenkoku-hosho.json";
import zenmutech from "./zenmutech.json";
import zeon from "./zeon.json";
import zeriaPharmaceutical from "./zeria-pharmaceutical.json";
import zeta from "./zeta.json";
import zigZag from "./zig-zag.json";
import zigexn from "./zigexn.json";
import zoa from "./zoa.json";
import zoom from "./zoom.json";
import zozo from "./zozo.json";
import zuiko from "./zuiko.json";
import zuken from "./zuken.json";
import zuu from "./zuu.json";

/**
 * The registry of published companies. A data file that is not listed here is
 * not published — the route, the list, search and the sitemap all read from
 * this array through the company repository.
 *
 * Content is JSON so the local admin editor can rewrite it without touching
 * code; every file is parsed through the schema here, so a malformed file
 * stops the build instead of reaching a reader.
 *
 * Add a company here only after its research log exists and the data integrity
 * suite passes (CLAUDE.md, "Adding or correcting a company").
 */
export const companies: Company[] = Object.entries({
  toyota,
  "sony-group": sonyGroup,
  nintendo,
  "mitsubishi-corporation": mitsubishiCorporation,
  "tokyo-electron": tokyoElectron,
  honda,
  nissan,
  advantest,
  "shin-etsu-chemical": shinEtsuChemical,
  hitachi,
  "mitsubishi-electric": mitsubishiElectric,
  "mitsui-and-co": mitsuiAndCo,
  itochu,
  "mitsubishi-ufj-financial-group": mitsubishiUfjFinancialGroup,
  "sumitomo-mitsui-financial-group": sumitomoMitsuiFinancialGroup,
  "mizuho-financial-group": mizuhoFinancialGroup,
  ntt,
  kddi,
  fujitsu,
  nec,
  "takeda-pharmaceutical": takedaPharmaceutical,
  "daiichi-sankyo": daiichiSankyo,
  "seven-and-i-holdings": sevenAndIHoldings,
  "fast-retailing": fastRetailing,
  suzuki,
  subaru,
  mazda,
  "isuzu-motors": isuzuMotors,
  denso,
  "murata-manufacturing": murataManufacturing,
  disco,
  "renesas-electronics": renesasElectronics,
  rohm,
  socionext,
  canon,
  nikon,
  keyence,
  fanuc,
  "daikin-industries": daikinIndustries,
  komatsu,
  "nippon-steel": nipponSteel,
  "asahi-kasei": asahiKasei,
  "mitsubishi-chemical-group": mitsubishiChemicalGroup,
  taisei,
  kajima,
  shimizu,
  "mitsui-fudosan": mitsuiFudosan,
  "sumitomo-realty-and-development": sumitomoRealtyAndDevelopment,
  aeon,
  "nitori-holdings": nitoriHoldings,
  "ryohin-keikaku": ryohinKeikaku,
  zozo,
  ajinomoto,
  kikkoman,
  "nissin-foods-holdings": nissinFoodsHoldings,
  "asahi-group-holdings": asahiGroupHoldings,
  "astellas-pharma": astellasPharma,
  "chugai-pharmaceutical": chugaiPharmaceutical,
  "tokio-marine-holdings": tokioMarineHoldings,
  "dai-ichi-life-holdings": daiIchiLifeHoldings,
  "nomura-holdings": nomuraHoldings,
  "sumitomo-corporation": sumitomoCorporation,
  marubeni,
  softbank,
  "panasonic-holdings": panasonicHoldings,
  "fujifilm-holdings": fujifilmHoldings,
  "rakuten-group": rakutenGroup,
  kubota,
  smc,
  "sumitomo-chemical": sumitomoChemical,
  agc,
  "east-japan-railway": eastJapanRailway,
  "central-japan-railway": centralJapanRailway,
  "ana-holdings": anaHoldings,
  "yamato-holdings": yamatoHoldings,
  inpex,
  "eneos-holdings": eneosHoldings,
  "mitsubishi-motors": mitsubishiMotors,
  tdk: tdk,
  kyocera: kyocera,
  "taiyo-yuden": taiyoYuden,
  nissui: nissui,
  "akikawa-foods-and-farms": akikawaFoodsAndFarms,
  "as-partners": asPartners,
  axyz: axyz,
  "berg-earth": bergEarth,
  besterra: besterra,
  "br-holdings": brHoldings,
  candeal: candeal,
  caulis: caulis,
  "chugai-mining": chugaiMining,
  cocolive: cocolive,
  "columbia-works": columbiaWorks,
  "comsys-holdings": comsysHoldings,
  cyberagent: cyberagent,
  "dai-ichi-cutter-kogyo": daiIchiCutterKogyo,
  "daiseki-eco-solution": daisekiEcoSolution,
  "daiwa-house-industry": daiwaHouseIndustry,
  "dentsu-group": dentsuGroup,
  dive: dive,
  "dowa-holdings": dowaHoldings,
  fantasista: fantasista,
  "first-corporation": firstCorporation,
  "fuji-electric": fujiElectric,
  "fuji-japan": fujiJapan,
  fujikura: fujikura,
  "fujita-engineering": fujitaEngineering,
  "gifu-landscape-architect": gifuLandscapeArchitect,
  "giken-holdings": gikenHoldings,
  "greenenergy-and-company": greenenergyAndCompany,
  "green-monster": greenMonster,
  hammock: hammock,
  aisin: aisin,
  "screen-holdings": screenHoldings,
  lasertec: lasertec,
  "yamaha-motor": yamahaMotor,
  "akatsuki-eazima": akatsukiEazima,
  alsok: alsok,
  "amita-holdings": amitaHoldings,
  "arbeit-times": arbeitTimes,
  artner: artner,
  "asahi-kogyosha": asahiKogyosha,
  asanuma: asanuma,
  asj: asj,
  "astroscale-holdings": astroscaleHoldings,
  bourbon: bourbon,
  brass: brass,
  cados: cados,
  "caica-digital": caicaDigital,
  calbee: calbee,
  "care-service": careService,
  "care-twentyone": careTwentyone,
  "career-design-center": careerDesignCenter,
  carenet: carenet,
  cds: cds,
  chiikishinbunsha: chiikishinbunsha,
  chubushiryo: chubushiryo,
  chuco: chuco,
  chudenko: chudenko,
  "chugai-ro": chugaiRo,
  cmc: cmc,
  como: como,
  cookpad: cookpad,
  core: core,
  crooz: crooz,
  "cross-cat": crossCat,
  "cross-e-holdings": crossEHoldings,
  "css-holdings": cssHoldings,
  "cube-system": cubeSystem,
  "d-and-m": dAndM,
  "dai-dan": daiDan,
  daiho: daiho,
  "daiichi-kensetsu": daiichiKensetsu,
  "daisue-construction": daisueConstruction,
  "daito-trust-construction": daitoTrustConstruction,
  dawn: dawn,
  dena: dena,
  "digital-arts": digitalArts,
  "digital-holdings": digitalHoldings,
  dip: dip,
  "ej-holdings": ejHoldings,
  "ensuiko-sugar-refining": ensuikoSugarRefining,
  eole: eole,
  epco: epco,
  "exeo-group": exeoGroup,
  "ezaki-glico": ezakiGlico,
  faber: faber,
  "feed-one": feedOne,
  "first-baking": firstBaking,
  "fit-easy": fitEasy,
  fonfun: fonfun,
  forside: forside,
  fronteo: fronteo,
  "fudo-tetra": fudoTetra,
  "fuji-nihon": fujiNihon,
  "fuji-p-s": fujiPS,
  fujiya: fujiya,
  fukuda: fukuda,
  "fukutome-meat-packers": fukutomeMeatPackers,
  gakujo: gakujo,
  "gendai-agency": gendaiAgency,
  "gig-works": gigWorks,
  "gni-group": gniGroup,
  "gokurakuyu-holdings": gokurakuyuHoldings,
  hakuten: hakuten,
  haseko: haseko,
  "hatch-work": hatchWork,
  "hayashikane-sangyo": hayashikaneSangyo,
  "hazama-ando": hazamaAndo,
  heartseed: heartseed,
  "heian-ceremony-service": heianCeremonyService,
  "hibiya-engineering": hibiyaEngineering,
  higashimaru: higashimaru,
  "hikari-food-service": hikariFoodService,
  "hikari-heights-varus": hikariHeightsVarus,
  hip: hip,
  hob: hob,
  hokkaidenko: hokkaidenko,
  "hokuriku-electrical-construction": hokurikuElectricalConstruction,
  hokuryo: hokuryo,
  hokuto: hokuto,
  "human-holdings": humanHoldings,
  ichigo: ichigo,
  ichiken: ichiken,
  ihi: ihi,
  "ikk-holdings": ikkHoldings,
  "imuraya-group": imurayaGroup,
  "information-strategy-and-technology": informationStrategyAndTechnology,
  insight: insight,
  integroup: integroup,
  "interlife-holdings": interlifeHoldings,
  interspace: interspace,
  ishin: ishin,
  itamiarts: itamiarts,
  itmedia: itmedia,
  "itoham-yonekyu-holdings": itohamYonekyuHoldings,
  "iwatsuka-confectionery": iwatsukaConfectionery,
  "jac-recruitment": jacRecruitment,
  "japan-foundation-engineering": japanFoundationEngineering,
  "japan-petroleum-exploration": japanPetroleumExploration,
  jdc: jdc,
  "jesco-holdings": jescoHoldings,
  "jfe-holdings": jfeHoldings,
  "jgc-holdings": jgcHoldings,
  jinjib: jinjib,
  jsh: jsh,
  "k-and-amp-o-energy-group": kAndAmpOEnergyGroup,
  "kakaku-com": kakakuCom,
  "kakiyasu-honten": kakiyasuHonten,
  "kameda-seika": kamedaSeika,
  "kanda-tsushinki": kandaTsushinki,
  kandenko: kandenko,
  "kaneko-seeds": kanekoSeeds,
  kanro: kanro,
  "kawasaki-heavy-industries": kawasakiHeavyIndustries,
  "kg-intelligence": kgIntelligence,
  kinden: kinden,
  "kitahama-capital-partners": kitahamaCapitalPartners,
  "kitano-construction": kitanoConstruction,
  "koatsu-kogyo": koatsuKogyo,
  "kobe-steel": kobeSteel,
  "kohjin-bio": kohjinBio,
  "koike-ya": koikeYa,
  "koshidaka-holdings": koshidakaHoldings,
  "kotobuki-spirits": kotobukiSpirits,
  "kozo-keikaku-engineering-holdings": kozoKeikakuEngineeringHoldings,
  kraftia: kraftia,
  kudo: kudo,
  "kumagai-gumi": kumagaiGumi,
  kuraray: kuraray,
  kushim: kushim,
  kyokuto: kyokuto,
  kyokuyo: kyokuyo,
  kyowanissei: kyowanissei,
  "l-is-b": lIsB,
  "lib-work": libWork,
  liberaware: liberaware,
  lifull: lifull,
  linical: linical,
  "link-and-motivation": linkAndMotivation,
  "logos-holdings": logosHoldings,
  m3: m3,
  "a-d-works-group": aDWorksGroup,
  "abc-mart": abcMart,
  adways: adways,
  "aeon-kyushu": aeonKyushu,
  "afc-hd-ams-life-science": afcHdAmsLifeScience,
  ahjikan: ahjikan,
  "ai-fusion-capital-group": aiFusionCapitalGroup,
  "ai-holdings": aiHoldings,
  "ai-robotics": aiRobotics,
  alconix: alconix,
  "alfresa-holdings": alfresaHoldings,
  "all-about": allAbout,
  alpen: alpen,
  alt: alt,
  "amiyaki-tei": amiyakiTei,
  "and-st-hd": andStHd,
  "aoba-bbt": aobaBbt,
  aohata: aohata,
  "apple-international": appleInternational,
  applied: applied,
  arata: arata,
  "ariake-japan": ariakeJapan,
  "arr-planner": arrPlanner,
  "asahimatsu-foods": asahimatsuFoods,
  askul: askul,
  asmo: asmo,
  asua: asua,
  "aun-consulting": aunConsulting,
  autowave: autowave,
  "b-style-holdings": bStyleHoldings,
  banners: banners,
  "base-food": baseFood,
  "beauty-kadan-holdings": beautyKadanHoldings,
  "bic-camera": bicCamera,
  "bronco-billy": broncoBilly,
  bruno: bruno,
  "bull-dog-sauce": bullDogSauce,
  "can-do": canDo,
  cawachi: cawachi,
  "ccreb-advisors": ccrebAdvisors,
  cedar: cedar,
  choei: choei,
  "chordia-therapeutics": chordiaTherapeutics,
  choushimaru: choushimaru,
  "coca-cola-bottlers-japan-holdings": cocaColaBottlersJapanHoldings,
  creal: creal,
  create: create,
  daieisangyo: daieisangyo,
  daikokutenbussan: daikokutenbussan,
  dairei: dairei,
  daisho: daisho,
  "daiwabo-holdings": daiwaboHoldings,
  "dcm-holdings": dcmHoldings,
  delsole: delsole,
  "demae-can": demaeCan,
  "doutor-nichires-holdings": doutorNichiresHoldings,
  "dydo-group-holdings": dydoGroupHoldings,
  "e-supportlink": eSupportlink,
  "eat-and-holdings": eatAndHoldings,
  "ebara-foods-industry": ebaraFoodsIndustry,
  econos: econos,
  edion: edion,
  "ets-group": etsGroup,
  eucalia: eucalia,
  euglena: euglena,
  "fan-communications": fanCommunications,
  "festaria-holdings": festariaHoldings,
  forcia: forcia,
  "fruta-fruta": frutaFruta,
  ftgroup: ftgroup,
  "fuji-oil": fujiOil,
  "fujibo-holdings": fujiboHoldings,
  fujicco: fujicco,
  "fujio-food-group": fujioFoodGroup,
  "fujisan-magazine-service": fujisanMagazineService,
  fundely: fundely,
  garden: garden,
  "geo-holdings": geoHoldings,
  "globe-ing": globeIng,
  "gltechno-holdings": gltechnoHoldings,
  "golf-do": golfDo,
  "good-life": goodLife,
  "green-cross-holdings": greenCrossHoldings,
  "growth-xpartners": growthXpartners,
  gunze: gunze,
  gurunavi: gurunavi,
  "gva-tech": gvaTech,
  "hagoromo-foods": hagoromoFoods,
  "hakuhodo-dy-holdings": hakuhodoDyHoldings,
  halows: halows,
  hamee: hamee,
  "hanwa-home-s": hanwaHomeS,
  "hard-off": hardOff,
  hibino: hibino,
  hiraki: hiraki,
  hiramatsu: hiramatsu,
  hmcomm: hmcomm,
  "hokkaido-coca-cola-bottling": hokkaidoCocaColaBottling,
  "hokuyaku-takeyama-holdings": hokuyakuTakeyamaHoldings,
  "hokuyu-lucky": hokuyuLucky,
  "home-position": homePosition,
  "honeys-holdings": honeysHoldings,
  "honyaku-center": honyakuCenter,
  "house-foods-group": houseFoodsGroup,
  hub: hub,
  hulic: hulic,
  hyper: hyper,
  "ichimasa-kamaboko": ichimasaKamaboko,
  "ifuji-sangyo": ifujiSangyo,
  "ik-holdings": ikHoldings,
  infomart: infomart,
  informetis: informetis,
  ings: ings,
  intermestic: intermestic,
  "isetan-mitsukoshi-holdings": isetanMitsukoshiHoldings,
  "ishii-food": ishiiFood,
  "ito-en": itoEn,
  "itochu-shokuhin": itochuShokuhin,
  "j-front-retailing": jFrontRetailing,
  "j-frontier": jFrontier,
  "j-holdings": jHoldings,
  "j-oil-mills": jOilMills,
  "japan-tobacco": japanTobacco,
  jason: jason,
  "jb-eleven": jbEleven,
  "jelly-beans-group": jellyBeansGroup,
  "jfla-holdings": jflaHoldings,
  "jins-holdings": jinsHoldings,
  "jp-holdings": jpHoldings,
  jtec: jtec,
  jtp: jtp,
  "k-uno": kUno,
  "kadoya-sesame-mills": kadoyaSesameMills,
  kagome: kagome,
  kaihan: kaihan,
  kanemi: kanemi,
  karula: karula,
  "katakura-industries": katakuraIndustries,
  "kawasaki-and-co": kawasakiAndCo,
  "create-sd-holdings": createSdHoldings,
  "geolive-group": geoliveGroup,
  grems: grems,
  "kawasaki-setsubi-kogyo": kawasakiSetsubiKogyo,
  "kenko-mayonnaise": kenkoMayonnaise,
  kewpie: kewpie,
  "key-coffee": keyCoffee,
  "kibun-foods": kibunFoods,
  "kichiri-holdings-and-co": kichiriHoldingsAndCo,
  "kioxia-holdings": kioxiaHoldings,
  "kirin-holdings": kirinHoldings,
  kitanotatsujin: kitanotatsujin,
  "kitoku-shinryo": kitokuShinryo,
  "kobe-bussan": kobeBussan,
  "komehyo-holdings": komehyoHoldings,
  ktk: ktk,
  "kura-sushi": kuraSushi,
  "kurabo-industries": kuraboIndustries,
  kurashiru: kurashiru,
  "kuroda-group": kurodaGroup,
  kuze: kuze,
  "kyodo-public-relations": kyodoPublicRelations,
  "la-holdings": laHoldings,
  "lacto-japan": lactoJapan,
  landix: landix,
  landnet: landnet,
  "laxus-technologies": laxusTechnologies,
  "life-foods": lifeFoods,
  lifedrink: lifedrink,
  like: like,
  "macnica-holdings": macnicaHoldings,
  "mamezo-digital-holdings": mamezoDigitalHoldings,
  "manabi-aid": manabiAid,
  mandarake: mandarake,
  marketenterprise: marketenterprise,
  "marudai-food": marudaiFood,
  "marusan-ai": marusanAi,
  marutai: marutai,
  "maruzen-chi-holdings": maruzenChiHoldings,
  masaru: masaru,
  "material-group": materialGroup,
  "matsui-construction": matsuiConstruction,
  "matsukiyococokara-and-co": matsukiyococokaraAndCo,
  mbk: mbk,
  mbs: mbs,
  "mcdonald-s-holdings-company-japan": mcdonaldSHoldingsCompanyJapan,
  medinet: medinet,
  "medius-holdings": mediusHoldings,
  "megmilk-snow-brand": megmilkSnowBrand,
  "meiho-facility-works": meihoFacilityWorks,
  "meiji-holdings": meijiHoldings,
  "meiko-construction": meikoConstruction,
  "meisei-industrial": meiseiIndustrial,
  meito: meito,
  members: members,
  mfs: mfs,
  mic: mic,
  mikikogyo: mikikogyo,
  "mirait-one": miraitOne,
  "mitsubishi-heavy-industries": mitsubishiHeavyIndustries,
  "mitsui-chemicals": mitsuiChemicals,
  "mitsui-dm-sugar": mitsuiDmSugar,
  "mitsui-kinzoku": mitsuiKinzoku,
  "mitsui-matsushima-holdings": mitsuiMatsushimaHoldings,
  mixi: mixi,
  monotaro: monotaro,
  "mori-gumi": moriGumi,
  "morinaga-and-co": morinagaAndCo,
  "morinaga-milk-industry": morinagaMilkIndustry,
  moriya: moriya,
  morozoff: morozoff,
  "ms-and-ad-insurance-group-holdings": msAndAdInsuranceGroupHoldings,
  "muscat-group": muscatGroup,
  nabtesco: nabtesco,
  nafco: nafco,
  "nakabohtec-corrosion-protecting": nakabohtecCorrosionProtecting,
  nakamuraya: nakamuraya,
  nakano: nakano,
  "nankai-tatsumura-construction": nankaiTatsumuraConstruction,
  natori: natori,
  "nh-foods": nhFoods,
  nichirei: nichirei,
  "nichiryo-baking": nichiryoBaking,
  "nichiwa-sangyo": nichiwaSangyo,
  "nihon-dengi": nihonDengi,
  "nihon-m-and-a-center-holdings": nihonMAndACenterHoldings,
  "nihon-shokuhin-kako": nihonShokuhinKako,
  "nihon-suido-consultants": nihonSuidoConsultants,
  "nihonwasou-holdings": nihonwasouHoldings,
  nippn: nippn,
  "nippon-aqua": nipponAqua,
  "nippon-beet-sugar-manufacturing": nipponBeetSugarManufacturing,
  "nippon-care-supply": nipponCareSupply,
  "nippon-densetsu-kogyo": nipponDensetsuKogyo,
  "nippon-dry-chemical": nipponDryChemical,
  "nippon-grande": nipponGrande,
  "nippon-information-development": nipponInformationDevelopment,
  "nippon-parking-development": nipponParkingDevelopment,
  "nippon-primex": nipponPrimex,
  "nippon-rietec": nipponRietec,
  "nishimatsu-construction": nishimatsuConstruction,
  "nisshin-seifun-group": nisshinSeifunGroup,
  "nisshinbo-holdings": nisshinboHoldings,
  nissou: nissou,
  nitcho: nitcho,
  "nittetsu-mining": nittetsuMining,
  "nitto-boseki": nittoBoseki,
  "nitto-denko": nittoDenko,
  "nitto-fuji-flour-milling": nittoFujiFlourMilling,
  nittobest: nittobest,
  "nittoc-construction": nittocConstruction,
  nittoh: nittoh,
  njs: njs,
  "nms-holdings": nmsHoldings,
  "nomura-real-estate-holdings": nomuraRealEstateHoldings,
  "nomura-research-institute": nomuraResearchInstitute,
  "ns-solutions": nsSolutions,
  "o-will": oWill,
  obayashi: obayashi,
  "ocean-system": oceanSystem,
  "oenon-holdings": oenonHoldings,
  ohmori: ohmori,
  ohmoriya: ohmoriya,
  "ohmoto-gumi": ohmotoGumi,
  "okamura-foods": okamuraFoods,
  okumura: okumura,
  "olba-healthcare-holdings": olbaHealthcareHoldings,
  omikenshi: omikenshi,
  oomitsu: oomitsu,
  "ootoya-holdings": ootoyaHoldings,
  "open-up-group": openUpGroup,
  opro: opro,
  "oriental-consultants-holdings": orientalConsultantsHoldings,
  "oriental-shiraishi": orientalShiraishi,
  otec: otec,
  "pacific-net": pacificNet,
  azearth: azearth,
  "ochi-holdings": ochiHoldings,
  "pal-group-holdings": palGroupHoldings,
  "palemo-holdings": palemoHoldings,
  "pasona-group": pasonaGroup,
  "penta-ocean-construction": pentaOceanConstruction,
  "pepper-food-service": pepperFoodService,
  "persol-holdings": persolHoldings,
  "pharma-foods-international": pharmaFoodsInternational,
  "pharmarise-holdings": pharmariseHoldings,
  "pickles-holdings": picklesHoldings,
  pietro: pietro,
  pixelcompanyz: pixelcompanyz,
  planet: planet,
  "polaris-holdings": polarisHoldings,
  postprime: postprime,
  "prap-japan": prapJapan,
  "premium-water-holdings": premiumWaterHoldings,
  "prima-meat-packers": primaMeatPackers,
  "prism-biolab": prismBiolab,
  "ps-construction": psConstruction,
  "qol-holdings": qolHoldings,
  "quantum-solutions": quantumSolutions,
  "raccoon-holdings": raccoonHoldings,
  "raito-kogyo": raitoKogyo,
  rasa: rasa,
  "reiwa-accounting-holdings": reiwaAccountingHoldings,
  repriority: repriority,
  reskill: reskill,
  "resona-holdings": resonaHoldings,
  restar: restar,
  rezil: rezil,
  "rigaku-holdings": rigakuHoldings,
  "rizap-group": rizapGroup,
  "robot-home": robotHome,
  "rock-field": rockField,
  "rokko-butter": rokkoButter,
  roxx: roxx,
  "ryoyo-ryosan-holdings": ryoyoRyosanHoldings,
  "s-and-b-foods": sAndBFoods,
  "s-foods": sFoods,
  "s-ishimitsu-and-co": sIshimitsuAndCo,
  "s-pool": sPool,
  "saaf-holdings": saafHoldings,
  saibo: saibo,
  "saint-care-holding": saintCareHolding,
  saita: saita,
  "sakata-seed": sakataSeed,
  sala: sala,
  "san-a": sanA,
  "sanki-engineering": sankiEngineering,
  "sanko-marketing-foods": sankoMarketingFoods,
  "sanko-metal-industrial": sankoMetalIndustrial,
  santo: santo,
  "sanyo-engineering-and-construction": sanyoEngineeringAndConstruction,
  "sanyo-homes": sanyoHomes,
  "sanyodo-holdings": sanyodoHoldings,
  "sanyu-construction": sanyuConstruction,
  sapeet: sapeet,
  "sapporo-holdings": sapporoHoldings,
  "sata-construction": sataConstruction,
  "sato-foods": satoFoods,
  "sato-foods-industries": satoFoodsIndustries,
  "saylor-advertising": saylorAdvertising,
  "sbi-rheos-hifumi": sbiRheosHifumi,
  "sbs-holdings": sbsHoldings,
  schoo: schoo,
  scinex: scinex,
  "sds-holdings": sdsHoldings,
  secuavail: secuavail,
  seigakusha: seigakusha,
  seihyo: seihyo,
  "seikitokyu-kogyo": seikitokyuKogyo,
  "sekisui-house": sekisuiHouse,
  "semba-tohka-industries": sembaTohkaIndustries,
  seria: seria,
  shikibo: shikibo,
  shimadaya: shimadaya,
  "shin-etsu-polymer": shinEtsuPolymer,
  "shin-nippon-air-technologies": shinNipponAirTechnologies,
  "shin-nippon-biomedical-laboratories": shinNipponBiomedicalLaboratories,
  "shinden-hightex": shindenHightex,
  shinnihon: shinnihon,
  "shinobu-foods-products": shinobuFoodsProducts,
  shinozakiya: shinozakiya,
  "shinto-holdings": shintoHoldings,
  "shinwa-wise-holdings": shinwaWiseHoldings,
  "shinyei-kaisha": shinyeiKaisha,
  "sho-bond-holdings": shoBondHoldings,
  "showa-sangyo": showaSangyo,
  sms: sms,
  sobal: sobal,
  "softfront-holdings": softfrontHoldings,
  "soiken-holdings": soikenHoldings,
  sojitz: sojitz,
  "soliton-systems": solitonSystems,
  "sompo-holdings": sompoHoldings,
  sonec: sonec,
  soracom: soracom,
  "souken-ace": soukenAce,
  "sre-holdings": sreHoldings,
  "st-cousair": stCousair,
  "star-mica-holdings": starMicaHoldings,
  "star-seeds": starSeeds,
  "sti-foods-holdings": stiFoodsHoldings,
  "storage-oh": storageOh,
  stream: stream,
  "studio-alice": studioAlice,
  "sumiken-mitsui-road": sumikenMitsuiRoad,
  "sumiseki-holdings": sumisekiHoldings,
  "sumitomo-densetsu": sumitomoDensetsu,
  "sumitomo-forestry": sumitomoForestry,
  "sumitomo-metal-mining": sumitomoMetalMining,
  "sumitomo-mitsui-construction": sumitomoMitsuiConstruction,
  "sunny-side-up-group": sunnySideUpGroup,
  "suntory-beverage-and-food": suntoryBeverageAndFood,
  "super-value": superValue,
  synclayer: synclayer,
  synspective: synspective,
  "system-location": systemLocation,
  systena: systena,
  tabio: tabio,
  "taihei-dengyo-kaisha": taiheiDengyoKaisha,
  taikisha: taikisha,
  "taisei-oncho": taiseiOncho,
  "taiyo-kagaku": taiyoKagaku,
  "taiyo-kisokogyo": taiyoKisokogyo,
  "takachiho-koheki": takachihoKoheki,
  takada: takada,
  "takahashi-curtain-wall": takahashiCurtainWall,
  "takamatsu-construction-group": takamatsuConstructionGroup,
  takamiya: takamiya,
  "takara-holdings": takaraHoldings,
  "takasago-thermal-engineering": takasagoThermalEngineering,
  "4cs-hd": c4csHd,
  "a-tie": aTie,
  accrete: accrete,
  "ad-sol-nissin": adSolNissin,
  adeka: adeka,
  adr120s: adr120s,
  "advanced-media": advancedMedia,
  "aeon-fantasy": aeonFantasy,
  aeria: aeria,
  "agent-ig-holdings": agentIgHoldings,
  "agratio-urban-design": agratioUrbanDesign,
  ags: ags,
  ai: ai,
  "ai-cross": aiCross,
  "ai-inside": aiInside,
  "ai-storm": aiStorm,
  "aica-kogyo": aicaKogyo,
  aiming: aiming,
  "air-water": airWater,
  akatsuki: akatsuki,
  "alleanza-holdings": alleanzaHoldings,
  alpha: alpha,
  "alphax-food-system": alphaxFoodSystem,
  altplusinc: altplusinc,
  "ambition-dx-holdings": ambitionDxHoldings,
  "anap-holdings": anapHoldings,
  "and-do-holdings": andDoHoldings,
  "appier-group": appierGroup,
  appirits: appirits,
  "applied-technology": appliedTechnology,
  "arigatou-services": arigatouServices,
  arkcore: arkcore,
  artgreen: artgreen,
  asahi: asahi,
  "asahi-net": asahiNet,
  "asahi-printing": asahiPrinting,
  "asahi-yukizai": asahiYukizai,
  ascentech: ascentech,
  ascot: ascot,
  asgent: asgent,
  "ashimori-industry": ashimoriIndustry,
  asiaquest: asiaquest,
  asmarq: asmarq,
  asteria: asteria,
  "ateam-holdings": ateamHoldings,
  atect: atect,
  atled: atled,
  "atom-livin-tech": atomLivinTech,
  atsugi: atsugi,
  aubex: aubex,
  aucfan: aucfan,
  aucnet: aucnet,
  "avant-group": avantGroup,
  "awa-paper-and-technological": awaPaperAndTechnological,
  "axas-holdings": axasHoldings,
  "axel-mark": axelMark,
  "axelspace-holdings": axelspaceHoldings,
  axis: axis,
  azoom: azoom,
  "azuma-house": azumaHouse,
  "b-lot": bLot,
  balnibarbi: balnibarbi,
  "bank-of-innovation": bankOfInnovation,
  "baroque-japan": baroqueJapan,
  base: base,
  "base-4481": base4481,
  basis: basis,
  baudroie: baudroie,
  "bbreak-systems": bbreakSystems,
  beaglee: beaglee,
  "beauty-garage": beautyGarage,
  beenos: beenos,
  beex: beex,
  bemap: bemap,
  "benefit-japan": benefitJapan,
  betrend: betrend,
  "billing-system": billingSystem,
  "blue-zones-holdings": blueZonesHoldings,
  bluememe: bluememe,
  "booking-resort": bookingResort,
  bplats: bplats,
  brainpad: brainpad,
  "brains-technology": brainsTechnology,
  "broad-enterprise": broadEnterprise,
  "broadband-security": broadbandSecurity,
  "broadband-tower": broadbandTower,
  broadleaf: broadleaf,
  broadmedia: broadmedia,
  buffalo: buffalo,
  "c-i-medical": cIMedical,
  cacco: cacco,
  "capital-asset-planning": capitalAssetPlanning,
  carlit: carlit,
  "carta-holdings": cartaHoldings,
  "cave-interactive": caveInteractive,
  "ce-holdings": ceHoldings,
  celsys: celsys,
  "central-general-development": centralGeneralDevelopment,
  "central-glass": centralGlass,
  ceres: ceres,
  chieru: chieru,
  "chikaranomoto-holdings": chikaranomotoHoldings,
  chimney: chimney,
  "chuetsu-pulp-and-paper": chuetsuPulpAndPaper,
  "cl-holdings": clHoldings,
  classico: classico,
  "cluster-technology": clusterTechnology,
  cns: cns,
  coconala: coconala,
  collabos: collabos,
  colopl: colopl,
  coly: coly,
  cominix: cominix,
  "commerce-one-holdings": commerceOneHoldings,
  commseed: commseed,
  "computer-management": computerManagement,
  comture: comture,
  "cosmo-bio": cosmoBio,
  "cosmos-pharmaceutical": cosmosPharmaceutical,
  cotta: cotta,
  cre: cre,
  "create-restaurants-holdings": createRestaurantsHoldings,
  creema: creema,
  "cri-middleware": criMiddleware,
  "cross-plus": crossPlus,
  crowdworks: crowdworks,
  cts: cts,
  "cyber-security-cloud": cyberSecurityCloud,
  cyberlinks: cyberlinks,
  cybersolutions: cybersolutions,
  "cyberstep-holdings": cyberstepHoldings,
  "cybertrust-japan": cybertrustJapan,
  cynd: cynd,
  "cypress-holdings": cypressHoldings,
  "d-i-system": dISystem,
  daicel: daicel,
  daidoh: daidoh,
  "daiichi-kigenso-kagaku-kogyo": daiichiKigensoKagakuKogyo,
  "daiki-axis": daikiAxis,
  daikyonishikawa: daikyonishikawa,
  "dainichiseika-color-and-chemicals-mfg": dainichiseikaColorAndChemicalsMfg,
  "daio-paper": daioPaper,
  "daito-chemix": daitoChemix,
  daitobo: daitobo,
  "daiwa-computer": daiwaComputer,
  "data-applications": dataApplications,
  "data-horizon": dataHorizon,
  datasection: datasection,
  "dear-life": dearLife,
  "delica-foods-holdings": delicaFoodsHoldings,
  denka: denka,
  densan: densan,
  "densan-system-holdings": densanSystemHoldings,
  "digital-grid": digitalGrid,
  "digital-hearts-holdings": digitalHeartsHoldings,
  "digital-information-technologies": digitalInformationTechnologies,
  "digital-media-professionals": digitalMediaProfessionals,
  "digital-plus": digitalPlus,
  dks: dks,
  dle: dle,
  "double-standard": doubleStandard,
  "dream-incubator": dreamIncubator,
  "dream-vision": dreamVision,
  drecom: drecom,
  dualtap: dualtap,
  "dynamic-map-platform": dynamicMapPlatform,
  dynapac: dynapac,
  dynic: dynic,
  "e-grand": eGrand,
  "e-seikatsu": eSeikatsu,
  "early-age": earlyAge,
  ebase: ebase,
  ecomic: ecomic,
  ecomott: ecomott,
  edia: edia,
  edulab: edulab,
  "ekitan-and-co": ekitanAndCo,
  "elevator-communications": elevatorCommunications,
  eltes: eltes,
  "encourage-technologies": encourageTechnologies,
  enechange: enechange,
  enigmo: enigmo,
  enish: enish,
  "environment-friendly-holdings": environmentFriendlyHoldings,
  esol: esol,
  espoir: espoir,
  "eternal-hospitality-group": eternalHospitalityGroup,
  exawizards: exawizards,
  exmotion: exmotion,
  "fabrica-holdings": fabricaHoldings,
  faithnetwork: faithnetwork,
  felissimo: felissimo,
  "ffri-security": ffriSecurity,
  ficha: ficha,
  "finatext-holdings": finatextHoldings,
  findex: findex,
  "first-brothers": firstBrothers,
  fisco: fisco,
  fixstars: fixstars,
  flect: flect,
  "flying-garden": flyingGarden,
  "food-and-life-companies": foodAndLifeCompanies,
  forlife: forlife,
  freebit: freebit,
  freee: freee,
  frontier: frontier,
  "fuji-united-holdings": fujiUnitedHoldings,
  fujipream: fujipream,
  fujix: fujix,
  fuller: fuller,
  "fund-creation-group": fundCreationGroup,
  "furubayashi-shiko": furubayashiShiko,
  fusion: fusion,
  "fuso-chemical": fusoChemical,
  "future-innovation-group": futureInnovationGroup,
  "fuva-brain": fuvaBrain,
  "g-factory": gFactory,
  "g-next": gNext,
  "g-three-holdings": gThreeHoldings,
  "ga-technologies": gaTechnologies,
  gaiax: gaiax,
  "general-oyster": generalOyster,
  "generation-pass": generationPass,
  genetec: genetec,
  "geolocation-technology": geolocationTechnology,
  giftee: giftee,
  "global-communication-planning": globalCommunicationPlanning,
  "global-information": globalInformation,
  "global-link-management": globalLinkManagement,
  "global-security-experts": globalSecurityExperts,
  globalway: globalway,
  "gmo-commerce": gmoCommerce,
  "gmo-financial-gate": gmoFinancialGate,
  "gmo-globalsign-holdings": gmoGlobalsignHoldings,
  "gmo-payment-gateway": gmoPaymentGateway,
  "gmo-pepabo": gmoPepabo,
  "gmo-product-platform": gmoProductPlatform,
  "gmo-tech-holdings": gmoTechHoldings,
  "golf-digest-online": golfDigestOnline,
  "good-com-asset": goodComAsset,
  "gooddays-holdings": gooddaysHoldings,
  grandes: grandes,
  "gree-holdings": greeHoldings,
  greenbee: greenbee,
  gumi: gumi,
  "gun-ei-chemical-industry": gunEiChemicalIndustry,
  "gungho-online-entertainment": gunghoOnlineEntertainment,
  "happiness-and-d": happinessAndD,
  "harima-chemicals-group": harimaChemicalsGroup,
  hatena: hatena,
  havix: havix,
  hennge: hennge,
  heroz: heroz,
  "hikari-business-form": hikariBusinessForm,
  himacs: himacs,
  "hirota-group-holdings": hirotaGroupHoldings,
  hit: hit,
  "hito-communications-holdings": hitoCommunicationsHoldings,
  hobonichi: hobonichi,
  "hodogaya-chemical": hodogayaChemical,
  "hogy-medical": hogyMedical,
  hokuetsu: hokuetsu,
  "hoosiers-holdings": hoosiersHoldings,
  "hosoya-pyro-engineering": hosoyaPyroEngineering,
  "hotland-holdings": hotlandHoldings,
  hotman: hotman,
  "hotto-link": hottoLink,
  "hybrid-technologies": hybridTechnologies,
  "i-cubed-systems": iCubedSystems,
  "i-freek-mobile": iFreekMobile,
  "i-ll": iLl,
  "i-plug": iPlug,
  "iace-travel": iaceTravel,
  ibiden: ibiden,
  ichikawa: ichikawa,
  "ig-port": igPort,
  "iida-group-holdings": iidaGroupHoldings,
  "image-information": imageInformation,
  "imura-and-co": imuraAndCo,
  "inaba-seisakusho": inabaSeisakusho,
  infcurion: infcurion,
  infonet: infonet,
  "information-planning": informationPlanning,
  innovation: innovation,
  "innovation-holdings": innovationHoldings,
  "institution-for-a-global-society": institutionForAGlobalSociety,
  "intage-holdings": intageHoldings,
  interfactory: interfactory,
  "international-conglomerate-of-distribution-for-automobile-holdings": internationalConglomerateOfDistributionForAutomobileHoldings,
  "internet-initiative-japan": internetInitiativeJapan,
  "internetworking-and-broadband-consulting": internetworkingAndBroadbandConsulting,
  intertrade: intertrade,
  intrance: intrance,
  ips: ips,
  "ips-holdings": ipsHoldings,
  iridge: iridge,
  "ise-chemicals": iseChemicals,
  "ishihara-chemical": ishiharaChemical,
  "ishihara-sangyo-kaisha": ishiharaSangyoKaisha,
  istyle: istyle,
  "izawa-towel": izawaTowel,
  "j-escom-holdings": jEscomHoldings,
  "j-max": jMax,
  "j-s-b": jSB,
  "j-stream": jStream,
  "jade-group": jadeGroup,
  "japan-data-science-consortium": japanDataScienceConsortium,
  "japan-property-management-center": japanPropertyManagementCenter,
  "japan-proptech": japanProptech,
  "japan-system-techniques": japanSystemTechniques,
  jedat: jedat,
  jichodo: jichodo,
  "jig-saw": jigSaw,
  jinushi: jinushi,
  "jm-holdings": jmHoldings,
  jmdc: jmdc,
  jorudan: jorudan,
  "joyful-honda": joyfulHonda,
  "jtec-3446": jtec3446,
  justplannig: justplannig,
  "kaitori-okoku": kaitoriOkoku,
  "kaizen-platform": kaizenPlatform,
  "kanamic-network": kanamicNetwork,
  kaneka: kaneka,
  kanmonkai: kanmonkai,
  "kanto-denka-kogyo": kantoDenkaKogyo,
  kao: kao,
  karadanote: karadanote,
  "kasumigaseki-capital": kasumigasekiCapital,
  "katakura-and-co-op-agri": katakuraAndCoOpAgri,
  "kawada-technologies": kawadaTechnologies,
  "kawaguchi-chemical-industry": kawaguchiChemicalIndustry,
  kayac: kayac,
  keiwa: keiwa,
  "keyware-solutions": keywareSolutions,
  kfc: kfc,
  "kh-neochem": khNeochem,
  "ki-star-real-estate": kiStarRealEstate,
  "kikuchi-seisakusho": kikuchiSeisakusho,
  kinjiro: kinjiro,
  kitabo: kitabo,
  kitazato: kitazato,
  klab: klab,
  "koatsu-gas-kogyo": koatsuGasKogyo,
  "kodama-chemical-industry": kodamaChemicalIndustry,
  "koei-chemical": koeiChemical,
  "koei-tecmo-holdings": koeiTecmoHoldings,
  "komatsu-matere": komatsuMatere,
  "komeda-holdings": komedaHoldings,
  "konoshima-chemical": konoshimaChemical,
  koryojyuhan: koryojyuhan,
  "kose-r-e": koseRE,
  kubell: kubell,
  kudan: kudan,
  "kufu-company-holdings": kufuCompanyHoldings,
  "kuraudia-holdings": kuraudiaHoldings,
  kureha: kureha,
  "kuriyama-holdings": kuriyamaHoldings,
  "kushikatsu-tanaka-holdings": kushikatsuTanakaHoldings,
  "kusuri-no-aoki-holdings": kusuriNoAokiHoldings,
  "kyoritsu-computer-and-communication": kyoritsuComputerAndCommunication,
  "kyowa-kirin": kyowaKirin,
  "kyowa-leather-cloth": kyowaLeatherCloth,
  lakeel: lakeel,
  lancers: lancers,
  lightworks: lightworks,
  "link-u-group": linkUGroup,
  "lion-office-products": lionOfficeProducts,
  "living-technologies": livingTechnologies,
  "loadstar-capital": loadstarCapital,
  logizard: logizard,
  loive: loive,
  lonseal: lonseal,
  "m-mart": mMart,
  "m-up-holdings": mUpHoldings,
  macromill: macromill,
  magmag: magmag,
  makuake: makuake,
  "manac-chemical-partners": manacChemicalPartners,
  marklines: marklines,
  "maruchiyo-yamaokaya": maruchiyoYamaokaya,
  "maruhachi-holdings": maruhachiHoldings,
  "maruo-calcium": maruoCalcium,
  "matsumoto-yushi-seiyaku": matsumotoYushiSeiyaku,
  matsuoka: matsuoka,
  "media-do": mediaDo,
  "media-five": mediaFive,
  "media-kobo": mediaKobo,
  "medical-data-vision": medicalDataVision,
  "medical-ikkou-group": medicalIkkouGroup,
  "medical-net": medicalNet,
  "medical-system-network": medicalSystemNetwork,
  medley: medley,
  meeq: meeq,
  "meiji-electric-industries": meijiElectricIndustries,
  mercari: mercari,
  merf: merf,
  mie: mie,
  "mie-kotsu-group-holdings": mieKotsuGroupHoldings,
  "minkabu-the-infonoid": minkabuTheInfonoid,
  minoya: minoya,
  miraial: miraial,
  mirairo: mirairo,
  miratap: miratap,
  "misawa-and-co": misawaAndCo,
  "mit-holdings": mitHoldings,
  mitachi: mitachi,
  "mitsubishi-gas-chemical": mitsubishiGasChemical,
  "mitsubishi-paper-mills": mitsubishiPaperMills,
  "mitsubishi-research-institute": mitsubishiResearchInstitute,
  mitsuchi: mitsuchi,
  "miyaji-engineering-group": miyajiEngineeringGroup,
  "miyoshi-oil-and-fat": miyoshiOilAndFat,
  mksystem: mksystem,
  "mobcast-holdings": mobcastHoldings,
  "mobile-factory": mobileFactory,
  mobilus: mobilus,
  "money-forward": moneyForward,
  moriroku: moriroku,
  morpho: morpho,
  "movin-strategic-career": movinStrategicCareer,
  "mugen-estate": mugenEstate,
  mullion: mullion,
  mynet: mynet,
  "naigai-tec": naigaiTec,
  "nankai-chemical-industry": nankaiChemicalIndustry,
  ne: ne,
  "needs-well": needsWell,
  "neo-marketing": neoMarketing,
  neojapan: neojapan,
  "netyear-group": netyearGroup,
  "neural-group": neuralGroup,
  "new-japan-chemical": newJapanChemical,
  nexon: nexon,
  "next-generation-technology-group": nextGenerationTechnologyGroup,
  nextage: nextage,
  nextgen: nextgen,
  "nexyz-group": nexyzGroup,
  "nicca-chemical": niccaChemical,
  nichiban: nichiban,
  "nihon-chouzai": nihonChouzai,
  "nihon-falcom": nihonFalcom,
  "nihon-kagaku-sangyo": nihonKagakuSangyo,
  "nihon-parkerizing": nihonParkerizing,
  niitaka: niitaka,
  "nippon-carbide-industries": nipponCarbideIndustries,
  "nippon-chemical-industrial": nipponChemicalIndustrial,
  "nippon-coke-and-engineering": nipponCokeAndEngineering,
  "nippon-felt": nipponFelt,
  "nippon-fine-chemical": nipponFineChemical,
  "nippon-ichi-software": nipponIchiSoftware,
  "nippon-kayaku": nipponKayaku,
  "nippon-kodoshi": nipponKodoshi,
  "nippon-paper-industries": nipponPaperIndustries,
  "nippon-pigment-holdings": nipponPigmentHoldings,
  "nippon-sanso-holdings": nipponSansoHoldings,
  "nippon-shokubai": nipponShokubai,
  "nippon-soda": nipponSoda,
  "nippon-techno-lab": nipponTechnoLab,
  "nissan-chemical-corporatiom": nissanChemicalCorporatiom,
  "nisso-group": nissoGroup,
  "nitto-seimo": nittoSeimo,
  nix: nix,
  "no-1": no1,
  nof: nof,
  "nomura-system": nomuraSystem,
  northsand: northsand,
  nousouken: nousouken,
  "ntt-data-intramart": nttDataIntramart,
  "odk-solutions": odkSolutions,
  "ohishi-sangyo": ohishiSangyo,
  "ohki-healthcare-holdings": ohkiHealthcareHoldings,
  "ohmura-shigyo": ohmuraShigyo,
  "oisix-ra-daichi": oisixRaDaichi,
  "oji-holdings": ojiHoldings,
  "okayama-paper-industries": okayamaPaperIndustries,
  "okura-industrial": okuraIndustrial,
  okwave: okwave,
  "one-career": oneCareer,
  "open-door": openDoor,
  "open-house-group": openHouseGroup,
  optim: optim,
  "orion-breweries": orionBreweries,
  oro: oro,
  "osaka-organic-chemical-industry": osakaOrganicChemicalIndustry,
  "osaka-soda": osakaSoda,
  "osaka-yuka-industry": osakaYukaIndustry,
  "overlap-holdings": overlapHoldings,
  "p-ban-com": pBanCom,
  "pacific-systems": pacificSystems,
  palma: palma,
  papyless: papyless,
  path: path,
  "paycloud-holdings": paycloudHoldings,
  pbsystems: pbsystems,
  omron: omron,
  "yaskawa-electric": yaskawaElectric,
  "yokogawa-electric": yokogawaElectric,
  shimadzu: shimadzu,
  "a-and-a-material": aAndAMaterial,
  abeja: abeja,
  access: access,
  achilles: achilles,
  "adjuvant-holdings": adjuvantHoldings,
  advanex: advanex,
  "agent-insurance-group": agentInsuranceGroup,
  ahresty: ahresty,
  "aichi-steel": aichiSteel,
  aidemy: aidemy,
  "aisan-technology": aisanTechnology,
  ajis: ajis,
  "akasaka-diesels": akasakaDiesels,
  albalink: albalink,
  alinco: alinco,
  almado: almado,
  "almetax-manufacturing": almetaxManufacturing,
  "alpha-4760": alpha4760,
  "alpha-systems": alphaSystems,
  altech: altech,
  amatei: amatei,
  "ame-kaze-taiyo": ameKazeTaiyo,
  anges: anges,
  anycolor: anycolor,
  "anymind-group": anymindGroup,
  "ar-advanced-technology": arAdvancedTechnology,
  "arakawa-chemical-industries": arakawaChemicalIndustries,
  "are-holdings": areHoldings,
  arent: arent,
  "arisawa-mfg": arisawaMfg,
  artience: artience,
  "artra-group": artraGroup,
  "asahi-concrete-works": asahiConcreteWorks,
  "asahi-eito-holdings": asahiEitoHoldings,
  "asahi-rubber": asahiRubber,
  asahipen: asahipen,
  "asaka-industrial": asakaIndustrial,
  "asaka-riken": asakaRiken,
  "asia-pile-holdings": asiaPileHoldings,
  "aska-pharmaceutical-holdings": askaPharmaceuticalHoldings,
  atomix: atomix,
  "auto-server": autoServer,
  avilen: avilen,
  axxzia: axxzia,
  "bando-chemical-industries": bandoChemicalIndustries,
  basic: basic,
  batonz: batonz,
  "bbd-initiative": bbdInitiative,
  "bengo4-com": bengo4Com,
  "blue-innovation": blueInnovation,
  bml: bml,
  "bp-castrol": bpCastrol,
  branu: branu,
  bridgestone: bridgestone,
  "brightpath-biotherapeutics": brightpathBiotherapeutics,
  btm: btm,
  "bunka-shutter": bunkaShutter,
  "business-engineering": businessEngineering,
  "business-one-holdings": businessOneHoldings,
  "c-bon-cosmetics": cBonCosmetics,
  "c-uyemura-and-co": cUyemuraAndCo,
  "cac-holdings": cacHoldings,
  "canare-electric": canareElectric,
  canbas: canbas,
  "career-bank": careerBank,
  "carna-biosciences": carnaBiosciences,
  cel: cel,
  cellsource: cellsource,
  "central-sports": centralSports,
  "chemipro-kasei-kaisha": chemiproKaseiKaisha,
  "chiome-bioscience": chiomeBioscience,
  "chofu-seisakusho": chofuSeisakusho,
  "chubu-steel-plate": chubuSteelPlate,
  "chugin-financial-group": chuginFinancialGroup,
  "chugoku-marine-paints": chugokuMarinePaints,
  chugokukogyo: chugokukogyo,
  chukyoiyakuhin: chukyoiyakuhin,
  "chuo-malleable-iron": chuoMalleableIron,
  "chuo-spring": chuoSpring,
  circlace: circlace,
  "ck-san-etsu": ckSanEtsu,
  clip: clip,
  "computer-institute-of-japan": computerInstituteOfJapan,
  corona: corona,
  "cosmo-energy-holdings": cosmoEnergyHoldings,
  cota: cota,
  cover: cover,
  "create-medic": createMedic,
  "creek-and-river": creekAndRiver,
  cresco: cresco,
  cuorips: cuorips,
  cybozu: cybozu,
  "cyfuse-biomedical": cyfuseBiomedical,
  "d-western-therapeutics-institute": dWesternTherapeuticsInstitute,
  "dai-nippon-toryo": daiNipponToryo,
  "daido-steel": daidoSteel,
  "daihatsu-infinearth-mfg": daihatsuInfinearthMfg,
  daiken: daiken,
  "daiki-aluminium-industry": daikiAluminiumIndustry,
  dainichi: dainichi,
  daisan: daisan,
  "daishin-chemical": daishinChemical,
  "daito-pharmaceutical": daitoPharmaceutical,
  "daiwa-cycle": daiwaCycle,
  "danto-holdings": dantoHoldings,
  "def-consulting": defConsulting,
  "delta-fly-pharma": deltaFlyPharma,
  "dentsu-soken": dentsuSoken,
  dexerials: dexerials,
  dic: dic,
  draft: draft,
  dreamarts: dreamarts,
  duskin: duskin,
  earth: earth,
  econavista: econavista,
  "eiken-chemical": eikenChemical,
  eisai: eisai,
  elements: elements,
  "elitz-holdings": elitzHoldings,
  "em-systems": emSystems,
  en: en,
  "envipro-holdings": enviproHoldings,
  "environmental-control-center": environmentalControlCenter,
  "es-networks": esNetworks,
  ewell: ewell,
  "excite-holdings": exciteHoldings,
  eyez: eyez,
  "f-and-m": fAndM,
  "falco-holdings": falcoHoldings,
  "fast-accounting": fastAccounting,
  "fine-sinter": fineSinter,
  fines: fines,
  fitcrew: fitcrew,
  fixer: fixer,
  "flight-solutions": flightSolutions,
  "focus-systems": focusSystems,
  "fuji-kosan": fujiKosan,
  "fuji-latex": fujiLatex,
  "fuji-media-holdings": fujiMediaHoldings,
  "fuji-oil-5017": fujiOil5017,
  "fuji-pharma": fujiPharma,
  "fujikura-composites": fujikuraComposites,
  "fujikura-kasei": fujikuraKasei,
  fujimak: fujimak,
  fujimi: fujimi,
  fujisash: fujisash,
  fukoku: fukoku,
  "fullcast-holdings": fullcastHoldings,
  fumakilla: fumakilla,
  fundinno: fundinno,
  funpep: funpep,
  furukawa: furukawa,
  "furukawa-electric": furukawaElectric,
  fusic: fusic,
  "fuso-pharmaceutical-industries": fusoPharmaceuticalIndustries,
  future: future,
  "g-tekt": gTekt,
  gala: gala,
  "gdep-advance": gdepAdvance,
  geostr: geostr,
  gimic: gimic,
  globee: globee,
  "gmo-internet": gmoInternet,
  "gmo-tech": gmoTech,
  go: go,
  "godo-steel": godoSteel,
  grid: grid,
  gsi: gsi,
  "h-one": hOne,
  "h-u-group-holdings": hUGroupHoldings,
  "haba-laboratories": habaLaboratories,
  healios: healios,
  "hirakawa-hewtech": hirakawaHewtech,
  "hisamitsu-pharmaceutical": hisamitsuPharmaceutical,
  "hito-to-hito-holdings": hitoToHitoHoldings,
  "hokkan-holdings": hokkanHoldings,
  "hokko-chemical-industry": hokkoChemicalIndustry,
  "hokuetsu-metal": hokuetsuMetal,
  housei: housei,
  "human-made": humanMade,
  "human-technologies": humanTechnologies,
  hutzper: hutzper,
  "i-ne": iNe,
  ibokin: ibokin,
  ic: ic,
  "ichishin-holdings": ichishinHoldings,
  "id-holdings": idHoldings,
  "idemitsu-kosan": idemitsuKosan,
  imagineer: imagineer,
  "immuno-biological-laboratories": immunoBiologicalLaboratories,
  "infroneer-holdings": infroneerHoldings,
  "institute-for-q-shu-pioneers-of-space": instituteForQShuPioneersOfSpace,
  integral: integral,
  "intellex-holdings": intellexHoldings,
  "intelligent-wave": intelligentWave,
  "inuneko-seikatsu": inunekoSeikatsu,
  "isamu-paint": isamuPaint,
  "ishizuka-glass": ishizukaGlass,
  itfor: itfor,
  "ito-yogyo": itoYogyo,
  iwabuchi: iwabuchi,
  "iyogin-holdings": iyoginHoldings,
  janis: janis,
  "japan-business-systems": japanBusinessSystems,
  "japan-engine": japanEngine,
  "japan-eyewear-holdings": japanEyewearHoldings,
  "japan-insulation": japanInsulation,
  "japan-pc-service": japanPcService,
  "japan-power-fastening": japanPowerFastening,
  "japan-pure-chemical": japanPureChemical,
  "japan-reliance-service": japanRelianceService,
  "japan-systembank": japanSystembank,
  "jcr-pharmaceuticals": jcrPharmaceuticals,
  jcu: jcu,
  jenoba: jenoba,
  "jfe-systems": jfeSystems,
  "jig-jp": jigJp,
  "jmacs-japan": jmacsJapan,
  jmc: jmc,
  "johnan-academic-preparatory-institute": johnanAcademicPreparatoryInstitute,
  justsystems: justsystems,
  "jx-advanced-metals": jxAdvancedMetals,
  "k-pharma": kPharma,
  "kainos-laboratories": kainosLaboratories,
  kairikiya: kairikiya,
  "kaken-pharmaceutical": kakenPharmaceutical,
  kanefusa: kanefusa,
  kaneso: kaneso,
  "kansai-paint": kansaiPaint,
  "kawagishi-bridge-works": kawagishiBridgeWorks,
  "kawakami-paint-mfg": kawakamiPaintMfg,
  "kawasaki-geological-engineering": kawasakiGeologicalEngineering,
  keyholder: keyholder,
  "kidswell-bio": kidswellBio,
  "kissei-pharmaceutical": kisseiPharmaceutical,
  kitac: kitac,
  kitalive: kitalive,
  "kobayashi-pharmaceutical": kobayashiPharmaceutical,
  kogi: kogi,
  komaihaltec: komaihaltec,
  "konica-minolta": konicaMinolta,
  konishi: konishi,
  "kringle-pharma": kringlePharma,
  "krosaki-harima": krosakiHarima,
  "kubota-pharmaceutical-holdings": kubotaPharmaceuticalHoldings,
  "kumiai-chemical-industry": kumiaiChemicalIndustry,
  "kunimine-industries": kunimineIndustries,
  kuramoto: kuramoto,
  kurimoto: kurimoto,
  kusurinomadoguchi: kusurinomadoguchi,
  "kyoei-steel": kyoeiSteel,
  "kyorin-pharmaceutical": kyorinPharmaceutical,
  "kyoritsu-air-tech": kyoritsuAirTech,
  kyoshin: kyoshin,
  "kyoto-financial-group": kyotoFinancialGroup,
  "kyoto-tool": kyotoTool,
  kyowakogyosyo: kyowakogyosyo,
  "laboro-ai": laboroAi,
  "lib-consulting": libConsulting,
  liberta: liberta,
  "life-intelligent-enterprise-holdings": lifeIntelligentEnterpriseHoldings,
  linkers: linkers,
  lion: lion,
  lixil: lixil,
  lobtex: lobtex,
  ly: ly,
  mandom: mandom,
  "maruichi-steel-tube": maruichiSteelTube,
  maruwa: maruwa,
  maruzen: maruzen,
  mec: mec,
  mediaseek: mediaseek,
  medrx: medrx,
  "meiko-network-japan": meikoNetworkJapan,
  mercury: mercury,
  metalart: metalart,
  "migalo-holdings": migaloHoldings,
  milbon: milbon,
  "mino-ceramic": minoCeramic,
  mipox: mipox,
  mirrativ: mirrativ,
  "mitani-sekisan": mitaniSekisan,
  "mitsubishi-materials": mitsubishiMaterials,
  "mitsubishi-steel-mfg": mitsubishiSteelMfg,
  mitsuboshi: mitsuboshi,
  "mitsuboshi-belting": mitsuboshiBelting,
  miura: miura,
  "mizuho-medy": mizuhoMedy,
  "mk-seiko": mkSeiko,
  "mochida-pharmaceutical": mochidaPharmaceutical,
  "modalis-therapeutics": modalisTherapeutics,
  moi: moi,
  "molitec-steel": molitecSteel,
  "monoai-technology": monoaiTechnology,
  moresco: moresco,
  "morishita-jintan": morishitaJintan,
  "mory-industries": moryIndustries,
  mrso: mrso,
  "muromachi-chemicals": muromachiChemicals,
  "nakanishi-mfg": nakanishiMfg,
  "nakayama-steel-works": nakayamaSteelWorks,
  "nalnet-communications": nalnetCommunications,
  "nano-holdings": nanoHoldings,
  "nasu-denki-tekko": nasuDenkiTekko,
  natoco: natoco,
  ncd: ncd,
  netstars: netstars,
  neturen: neturen,
  nextware: nextware,
  ngk: ngk,
  "nhk-spring": nhkSpring,
  "nic-autotec": nicAutotec,
  "nichia-steel-works": nichiaSteelWorks,
  nichias: nichias,
  "nichireki-group": nichirekiGroup,
  nichirin: nichirin,
  "nihon-enterprise": nihonEnterprise,
  "nihon-knowledge": nihonKnowledge,
  "nihon-kogyo": nihonKogyo,
  "nihon-nohyaku": nihonNohyaku,
  "nihon-office-automation-reseach": nihonOfficeAutomationReseach,
  "nihon-seikan": nihonSeikan,
  "nihon-seiko": nihonSeiko,
  "nihon-tokushu-toryo": nihonTokushuToryo,
  "nihon-yamamura-glass": nihonYamamuraGlass,
  nikkato: nikkato,
  nikko: nikko,
  "nippon-air-conditioning-services": nipponAirConditioningServices,
  "nippon-carbon": nipponCarbon,
  "nippon-chemiphar": nipponChemiphar,
  "nippon-chutetsukan": nipponChutetsukan,
  "nippon-chuzo": nipponChuzo,
  "nippon-concrete-industries": nipponConcreteIndustries,
  "nippon-crucible": nipponCrucible,
  "nippon-denko": nipponDenko,
  "nippon-electric-glass": nipponElectricGlass,
  "nippon-filcon": nipponFilcon,
  "nippon-hume": nipponHume,
  "nippon-insure": nipponInsure,
  "nippon-kinzoku": nipponKinzoku,
  "nippon-koshuha-steel": nipponKoshuhaSteel,
  "nippon-light-metal-holdings": nipponLightMetalHoldings,
  "nippon-paint-holdings": nipponPaintHoldings,
  "nippon-pallet-pool": nipponPalletPool,
  "nippon-rad": nipponRad,
  "nippon-seiro": nipponSeiro,
  "nippon-seisen": nipponSeisen,
  "nippon-shikizai": nipponShikizai,
  "nippon-shindo": nipponShindo,
  "nippon-shinyaku": nipponShinyaku,
  "nippon-yakin-kogyo": nipponYakinKogyo,
  "nishikawa-rubber": nishikawaRubber,
  niterra: niterra,
  nitta: nitta,
  "nitta-gelatin": nittaGelatin,
  nittoseiko: nittoseiko,
  "noevir-holdings": noevirHoldings,
  "noile-immune-biotech": noileImmuneBiotech,
  noritake: noritake,
  noritz: noritz,
  note: note,
  "nova-system": novaSystem,
  novac: novac,
  nozawa: nozawa,
  "ns-group": nsGroup,
  nulab: nulab,
  "nxera-pharma": nxeraPharma,
  nyle: nyle,
  "o-b-system": oBSystem,
  "oat-agrio": oatAgrio,
  obic: obic,
  "obic-business-consultants": obicBusinessConsultants,
  ohara: ohara,
  okabe: okabe,
  "okamoto-industries": okamotoIndustries,
  onamba: onamba,
  "oncolys-biopharma": oncolysBiopharma,
  "oncotherapy-science": oncotherapyScience,
  onex: onex,
  "ono-pharmaceutical": onoPharmaceutical,
  openwork: openwork,
  "oracle-corporation-japan": oracleCorporationJapan,
  oricon: oricon,
  "oriental-land": orientalLand,
  "osaka-steel": osakaSteel,
  "osaka-titanium-technologies": osakaTitaniumTechnologies,
  "otani-kogyo": otaniKogyo,
  otsuka: otsuka,
  "otsuka-holdings": otsukaHoldings,
  outlookconsulting: outlookconsulting,
  pa: pa,
  "pacific-metals": pacificMetals,
  paraca: paraca,
  park24: park24,
  peptidream: peptidream,
  "perseus-proteomics": perseusProteomics,
  phil: phil,
  photosynth: photosynth,
  pia: pia,
  piolax: piolax,
  pixta: pixta,
  plaid: plaid,
  "plus-alpha-consulting": plusAlphaConsulting,
  pluszero: pluszero,
  "pola-orbis-holdings": polaOrbisHoldings,
  "pole-to-win-holdings": poleToWinHoldings,
  poper: poper,
  porters: porters,
  "poval-kogyo": povalKogyo,
  powdertech: powdertech,
  "power-solutions": powerSolutions,
  powerx: powerx,
  "pr-times": prTimes,
  "premier-anti-aging": premierAntiAging,
  "prestige-international": prestigeInternational,
  "prime-strategy": primeStrategy,
  "primo-global-holdings": primoGlobalHoldings,
  "pro-ship": proShip,
  prodelight: prodelight,
  "progress-technologies-group": progressTechnologiesGroup,
  proni: proni,
  properst: properst,
  "property-data-bank": propertyDataBank,
  "property-technologies": propertyTechnologies,
  "qps-holdings": qpsHoldings,
  quick: quick,
  "r-and-d-computer": rAndDComputer,
  raksul: raksul,
  rakumo: rakumo,
  rakus: rakus,
  "rakuten-bank": rakutenBank,
  "raqualia-pharma": raqualiaPharma,
  "rasa-industries": rasaIndustries,
  ray: ray,
  rebase: rebase,
  recomm: recomm,
  remixpoint: remixpoint,
  renascience: renascience,
  renetjapangroup: renetjapangroup,
  rengo: rengo,
  rent: rent,
  reprocell: reprocell,
  "resol-holdings": resolHoldings,
  "resonac-holdings": resonacHoldings,
  resorttrust: resorttrust,
  ribomic: ribomic,
  ricksoft: ricksoft,
  "ridge-i": ridgeI,
  "riken-technos": rikenTechnos,
  "riken-vitamin": rikenVitamin,
  rinnai: rinnai,
  "riskmonster-com": riskmonsterCom,
  "riso-kyoiku-group": risoKyoikuGroup,
  "robot-payment": robotPayment,
  rococo: rococo,
  "rohto-pharmaceutical": rohtoPharmaceutical,
  "round-one": roundOne,
  "rs-technologies": rsTechnologies,
  runsystem: runsystem,
  ryobi: ryobi,
  "ryoyu-systems": ryoyuSystems,
  "s-and-j": sAndJ,
  "s-crypto-energy": sCryptoEnergy,
  "s-e": sE,
  "s-t": sT,
  safie: safie,
  "sagami-rubber-industries": sagamiRubberIndustries,
  "saint-marc-holdings": saintMarcHoldings,
  "sakai-chemical-industry": sakaiChemicalIndustry,
  "sakata-inx": sakataInx,
  "sakura-internet": sakuraInternet,
  "sakura-kcs": sakuraKcs,
  "sakura-rubber": sakuraRubber,
  "sanix-holdings": sanixHoldings,
  "sankei-chemical": sankeiChemical,
  "sanko-techno": sankoTechno,
  "sankyo-tateyama": sankyoTateyama,
  sanno: sanno,
  sansan: sansan,
  "sansei-landic": sanseiLandic,
  "santen-pharmaceutical": santenPharmaceutical,
  "sanwa-holdings": sanwaHoldings,
  "sanwayuka-industry": sanwayukaIndustry,
  "sanyo-chemical-industries": sanyoChemicalIndustries,
  "sanyo-industries": sanyoIndustries,
  "sanyo-trading": sanyoTrading,
  sanyu: sanyu,
  "sasatoku-printing": sasatokuPrinting,
  "satudora-holdings": satudoraHoldings,
  "sawai-group-holdings": sawaiGroupHoldings,
  "sbi-global-asset-management": sbiGlobalAssetManagement,
  "sbi-leasing-services": sbiLeasingServices,
  scala: scala,
  scat: scat,
  "science-arts": scienceArts,
  "sd-entertainment": sdEntertainment,
  "sec-carbon": secCarbon,
  secure: secure,
  "segue-group": segueGroup,
  seikagaku: seikagaku,
  seiren: seiren,
  "seiryo-electric": seiryoElectric,
  "seiwa-holdings": seiwaHoldings,
  "sekisui-chemical": sekisuiChemical,
  "sekisui-jushi": sekisuiJushi,
  "sekisui-kasei": sekisuiKasei,
  "septeni-holdings": septeniHoldings,
  serverworks: serverworks,
  "sfp-holdings": sfpHoldings,
  shanon: shanon,
  "sharing-innovations": sharingInnovations,
  sharingtechnology: sharingtechnology,
  shift: shift,
  "shikoku-kasei-holdings": shikokuKaseiHoldings,
  "shinagawa-refra": shinagawaRefra,
  "shinhokoku-material": shinhokokuMaterial,
  "shinko-wire": shinkoWire,
  shinnihonseiyaku: shinnihonseiyaku,
  shinpo: shinpo,
  shinto: shinto,
  "shinto-paint": shintoPaint,
  shinwa: shinwa,
  "shionogi-and-co": shionogiAndCo,
  "ship-healthcare-holdings": shipHealthcareHoldings,
  shirohato: shirohato,
  shiseido: shiseido,
  "shizuoka-financial-group": shizuokaFinancialGroup,
  "shoei-yakuhin": shoeiYakuhin,
  "showa-chemical-industry": showaChemicalIndustry,
  "showa-holdings": showaHoldings,
  "showa-manufacturing": showaManufacturing,
  "showa-paxxs": showaPaxxs,
  "showa-system-engineering": showaSystemEngineering,
  showcase: showcase,
  "shuei-yobiko": shueiYobiko,
  "sig-group": sigGroup,
  signpost: signpost,
  "silicon-studio": siliconStudio,
  "silver-egg-technology": silverEggTechnology,
  "simplex-holdings": simplexHoldings,
  sinops: sinops,
  sios: sios,
  "sk-kaken": skKaken,
  "skylark-holdings": skylarkHoldings,
  "sm-entertainment-japan": smEntertainmentJapan,
  smaregi: smaregi,
  smartdrive: smartdrive,
  socialwire: socialwire,
  abhotel: abhotel,
  abist: abist,
  "access-group-holdings": accessGroupHoldings,
  acmos: acmos,
  adish: adish,
  "adtec-plasma-technology": adtecPlasmaTechnology,
  adventure: adventure,
  "ahc-group": ahcGroup,
  "aiai-group": aiaiGroup,
  aichi: aichi,
  "aichi-electric": aichiElectric,
  "aida-engineering": aidaEngineering,
  aimechatec: aimechatec,
  aiphone: aiphone,
  airman: airman,
  "airtech-japan": airtechJapan,
  airtrip: airtrip,
  "akiba-holdings": akibaHoldings,
  "allied-architects": alliedArchitects,
  "allied-telesis-holdings": alliedTelesisHoldings,
  alphapurchase: alphapurchase,
  "alps-alpine": alpsAlpine,
  alue: alue,
  amada: amada,
  amano: amano,
  amaze: amaze,
  "amvis-holdings": amvisHoldings,
  "and-factory": andFactory,
  "anest-iwata": anestIwata,
  anritsu: anritsu,
  "anshin-guarantor-service": anshinGuarantorService,
  "aoi-electronics": aoiElectronics,
  "architects-studio-japan": architectsStudioJapan,
  "artiza-networks": artizaNetworks,
  "asahi-diamond-industrial": asahiDiamondIndustrial,
  "asahi-seiki-manufacturing": asahiSeikiManufacturing,
  asante: asante,
  aska: aska,
  asterisk: asterisk,
  asti: asti,
  astmax: astmax,
  atrae: atrae,
  "aval-data": avalData,
  axell: axell,
  azbil: azbil,
  balmuda: balmuda,
  baycurrent: baycurrent,
  "bestone-com": bestoneCom,
  birdman: birdman,
  "branding-technology": brandingTechnology,
  "bridge-international": bridgeInternational,
  "brother-industries": brotherIndustries,
  "buffalo-6676": buffalo6676,
  career: career,
  careerlink: careerlink,
  casa: casa,
  "casio-computer": casioComputer,
  "cgs-holdings": cgsHoldings,
  "charm-care": charmCare,
  chino: chino,
  "chiyoda-integre": chiyodaIntegre,
  "chuo-seisakusho": chuoSeisakusho,
  ckd: ckd,
  cmk: cmk,
  cocolonet: cocolonet,
  convano: convano,
  convum: convum,
  cookbiz: cookbiz,
  "copro-holdings": coproHoldings,
  "correc-holdings": correcHoldings,
  cosel: cosel,
  cravia: cravia,
  "crg-holdings": crgHoldings,
  cube: cube,
  "curves-holdings": curvesHoldings,
  cyberbuzz: cyberbuzz,
  "daido-kogyo": daidoKogyo,
  "daido-metal": daidoMetal,
  "daido-signal": daidoSignal,
  daihen: daihen,
  "daikoku-denki": daikokuDenki,
  "daikokuya-holdings": daikokuyaHoldings,
  daishinku: daishinku,
  "daiwa-industries": daiwaIndustries,
  "daiwa-tsushin": daiwaTsushin,
  daytona: daytona,
  denyo: denyo,
  "designone-japan": designoneJapan,
  "di-nikko-engineering": diNikkoEngineering,
  "diamond-electric-holdings": diamondElectricHoldings,
  "dijet-industrial": dijetIndustrial,
  disruptors: disruptors,
  dkk: dkk,
  "dkk-toa": dkkToa,
  "dm-solutions": dmSolutions,
  "dmg-mori": dmgMori,
  dmw: dmw,
  "e-guardian": eGuardian,
  "eagle-industry": eagleIndustry,
  ebara: ebara,
  "ebara-jitsugyo": ebaraJitsugyo,
  ebrains: ebrains,
  "ecology-and-combustion": ecologyAndCombustion,
  "eiken-industries": eikenIndustries,
  eizo: eizo,
  elan: elan,
  elecom: elecom,
  "emergency-assistance-japan": emergencyAssistanceJapan,
  "emnet-japan": emnetJapan,
  "enbio-holdings": enbioHoldings,
  "endo-lighting": endoLighting,
  enomoto: enomoto,
  enplas: enplas,
  enshu: enshu,
  "eri-holdings": eriHoldings,
  "escrow-agent-japan": escrowAgentJapan,
  espec: espec,
  exedy: exedy,
  extreme: extreme,
  "f-tech": fTech,
  faltec: faltec,
  "fast-fitness-japan": fastFitnessJapan,
  fdk: fdk,
  "feedforce-group": feedforceGroup,
  "fenwal-controls-of-japan": fenwalControlsOfJapan,
  ferrotec: ferrotec,
  "financial-partners-group": financialPartnersGroup,
  foodison: foodison,
  "for-startups": forStartups,
  "forum-engineering": forumEngineering,
  "foster-electric": fosterElectric,
  "founder-s-consultants-holdings": founderSConsultantsHoldings,
  "freakout-holdings": freakoutHoldings,
  "freesia-macross": freesiaMacross,
  freund: freund,
  "frontier-international": frontierInternational,
  "frontier-management": frontierManagement,
  fuji: fuji,
  "fuji-electric-industry": fujiElectricIndustry,
  "fuji-seiki": fujiSeiki,
  "fuji-seiko": fujiSeiko,
  fujishoji: fujishoji,
  fujitec: fujitec,
  "fujitsu-general": fujitsuGeneral,
  "fukuda-denshi": fukudaDenshi,
  fulltech: fulltech,
  fureasu: fureasu,
  "furuno-electric": furunoElectric,
  furyu: furyu,
  futaba: futaba,
  "futaba-industrial": futabaIndustrial,
  galilei: galilei,
  "gamecard-holdings": gamecardHoldings,
  gamewith: gamewith,
  geechs: geechs,
  "general-packer": generalPacker,
  geomatec: geomatec,
  giken: giken,
  "global-style": globalStyle,
  gmb: gmb,
  "gmo-financial-holdings": gmoFinancialHoldings,
  greens: greens,
  "gs-yuasa": gsYuasa,
  gunosy: gunosy,
  "halmek-holdings": halmekHoldings,
  "hamai-industries": hamaiIndustries,
  "hamamatsu-photonics": hamamatsuPhotonics,
  "hanatour-japan": hanatourJapan,
  "harada-industry": haradaIndustry,
  "harmonic-drive-systems": harmonicDriveSystems,
  heiwa: heiwa,
  "helios-techno-holding": heliosTechnoHolding,
  hephaist: hephaist,
  "hi-lex": hiLex,
  "hino-motors-7205": hinoMotors7205,
  "hioki-e-e": hiokiEE,
  "hirano-tecseed": hiranoTecseed,
  hirata: hirata,
  "hirose-electric": hiroseElectric,
  "hirose-tusyo": hiroseTusyo,
  "hisaka-works": hisakaWorks,
  hks: hks,
  hochiki: hochiki,
  "hoden-seimitsu-kako-kenkyusho": hodenSeimitsuKakoKenkyusho,
  "hokuriku-electric-industry": hokurikuElectricIndustry,
  hope: hope,
  horiba: horiba,
  hoshizaki: hoshizaki,
  hosiden: hosiden,
  "hosokawa-micron": hosokawaMicron,
  "howa-machinery": howaMachinery,
  howtelevision: howtelevision,
  "human-metabolome-technologies": humanMetabolomeTechnologies,
  "i-grid-solutions": iGridSolutions,
  "i-mobile": iMobile,
  ibj: ibj,
  "ichikoh-industries": ichikohIndustries,
  icom: icom,
  idec: idec,
  iid: iid,
  "ikegami-tsushinki": ikegamiTsushinki,
  "ikka-holdings": ikkaHoldings,
  ikuyo: ikuyo,
  "imagica-group": imagicaGroup,
  "imasen-electric-industrial": imasenElectricIndustrial,
  "inbound-tech": inboundTech,
  "inclusive-holdings": inclusiveHoldings,
  inest: inest,
  insource: insource,
  inspec: inspec,
  "internet-infinity": internetInfinity,
  "intimate-merger": intimateMerger,
  "ir-japan-holdings": irJapanHoldings,
  "iriso-electronics": irisoElectronics,
  "iseki-and-co": isekiAndCo,
  "ishii-hyoki": ishiiHyoki,
  "ishikawa-seisakusho": ishikawaSeisakusho,
  itokuro: itokuro,
  iwaki: iwaki,
  "izu-shaboten-resort": izuShabotenResort,
  "j-e-t": jET,
  "j-lease": jLease,
  jaic: jaic,
  "jalco-holdings": jalcoHoldings,
  janome: janome,
  "japan-animal-referral-medical-center": japanAnimalReferralMedicalCenter,
  "japan-aviation-electronics-industry": japanAviationElectronicsIndustry,
  "japan-cash-machine": japanCashMachine,
  "japan-craft-holdings": japanCraftHoldings,
  "japan-electronic-materials": japanElectronicMaterials,
  "japan-elevator-service-holdings": japanElevatorServiceHoldings,
  "japan-hospice-holdings": japanHospiceHoldings,
  "japan-investment-adviser": japanInvestmentAdviser,
  "japan-material": japanMaterial,
  "japan-post-bank": japanPostBank,
  "japan-resistor-mfg": japanResistorMfg,
  jeol: jeol,
  "jibannet-holdings": jibannetHoldings,
  "jimoto-holdings": jimotoHoldings,
  jimoty: jimoty,
  jrc: jrc,
  jss: jss,
  jtekt: jtekt,
  juki: juki,
  jvckenwood: jvckenwood,
  "kaji-technology": kajiTechnology,
  kanadevia: kanadevia,
  "kaname-kogyo": kanameKogyo,
  "kanematsu-engineering": kanematsuEngineering,
  kanemitsu: kanemitsu,
  "kasai-kogyo": kasaiKogyo,
  "kato-works": katoWorks,
  "katsuragawa-electric": katsuragawaElectric,
  kawaden: kawaden,
  "kawata-mfg": kawataMfg,
  "keeper-technical-laboratory": keeperTechnicalLaboratory,
  kel: kel,
  "kikukawa-enterprise": kikukawaEnterprise,
  "kikusui-holdings": kikusuiHoldings,
  "kimura-chemical-plants": kimuraChemicalPlants,
  "kimura-kohki": kimuraKohki,
  kitagawa: kitagawa,
  "kitagawa-seiki": kitagawaSeiki,
  kitz: kitz,
  klass: klass,
  "knc-laboratories": kncLaboratories,
  koa: koa,
  "kohoku-kogyo": kohokuKogyo,
  "koike-sanso-kogyo": koikeSansoKogyo,
  "koito-manufacturing": koitoManufacturing,
  "koken-boring-machine": kokenBoringMachine,
  "kokusai-electric": kokusaiElectric,
  komori: komori,
  "koyou-rentia": koyouRentia,
  "kurita-water-industries": kuritaWaterIndustries,
  kvk: kvk,
  "kyoei-sangyo": kyoeiSangyo,
  "kyoei-security-service": kyoeiSecurityService,
  "kyokuto-kaihatsu-kogyo": kyokutoKaihatsuKogyo,
  "kyoritsu-electric": kyoritsuElectric,
  "kyosan-electric-manufacturing": kyosanElectricManufacturing,
  kyosha: kyosha,
  kyowa: kyowa,
  "kyowa-electronic-instruments": kyowaElectronicInstruments,
  "kyushu-financial-group": kyushuFinancialGroup,
  "leader-electronics": leaderElectronics,
  "lecip-holdings": lecipHoldings,
  ligua: ligua,
  linkbal: linkbal,
  livesense: livesense,
  "living-platform": livingPlatform,
  logly: logly,
  lts: lts,
  "mabuchi-motor": mabuchiMotor,
  "maezawa-industries": maezawaIndustries,
  "maezawa-kyuso-industries": maezawaKyusoIndustries,
  "makino-milling-machine": makinoMillingMachine,
  makita: makita,
  "management-solutions": managementSolutions,
  "mars-group-holdings": marsGroupHoldings,
  marumae: marumae,
  "maruyama-mfg": maruyamaMfg,
  "matching-service-japan": matchingServiceJapan,
  "matsuo-electric": matsuoElectric,
  max: max,
  maxell: maxell,
  mcj: mcj,
  "mebuki-financial-group": mebukiFinancialGroup,
  "media-links": mediaLinks,
  medpeer: medpeer,
  megachips: megachips,
  meidensha: meidensha,
  "meiji-machine": meijiMachine,
  "meinan-m-and-a": meinanMAndA,
  "miahelsa-holdings": miahelsaHoldings,
  "micronics-japan": micronicsJapan,
  "midac-holdings": midacHoldings,
  mikuni: mikuni,
  "mimaki-engineering": mimakiEngineering,
  "minato-holdings": minatoHoldings,
  "minebea-mitsumi": minebeaMitsumi,
  "mitsubishi-kakoki-kaisha": mitsubishiKakokiKaisha,
  "mitsubishi-logisnext": mitsubishiLogisnext,
  "mitsui-e-and-s": mitsuiEAndS,
  "mitsui-high-tec": mitsuiHighTec,
  "miyairi-valve-mfg": miyairiValveMfg,
  "miyakoshi-holdings": miyakoshiHoldings,
  modec: modec,
  "morio-denki": morioDenki,
  "morita-holdings": moritaHoldings,
  "moriya-transportation-engineering-and-manufacturing": moriyaTransportationEngineeringAndManufacturing,
  "mortgage-service-japan": mortgageServiceJapan,
  mrt: mrt,
  "ms-and-consulting": msAndConsulting,
  muro: muro,
  "musashi-seimitsu-industry": musashiSeimitsuIndustry,
  "nachi-fujikoshi": nachiFujikoshi,
  "nagaoka-international": nagaokaInternational,
  "nagoya-electric-works": nagoyaElectricWorks,
  "naikai-zosen": naikaiZosen,
  "nakanippon-casting": nakanipponCasting,
  "nakano-refrigerators": nakanoRefrigerators,
  "namura-shipbuilding": namuraShipbuilding,
  "ncxx-group": ncxxGroup,
  "new-constructor-s-network": newConstructorSNetwork,
  "new-cosmos-electric": newCosmosElectric,
  newtech: newtech,
  nextone: nextone,
  "nf-holdings": nfHoldings,
  "nfk-holdings": nfkHoldings,
  nichicon: nichicon,
  nichidai: nichidai,
  nidec: nidec,
  "nihon-kohden": nihonKohden,
  "nihon-trim": nihonTrim,
  nikki: nikki,
  nikkiso: nikkiso,
  "nikko-6306": nikko6306,
  "nippon-antenna": nipponAntenna,
  "nippon-avionics": nipponAvionics,
  "nippon-ceramic": nipponCeramic,
  "nippon-gear": nipponGear,
  "nippon-sharyo": nipponSharyo,
  "nippon-ski-resort-development": nipponSkiResortDevelopment,
  "nippon-thompson": nipponThompson,
  "nippon-tungsten": nipponTungsten,
  nireco: nireco,
  "nishi-nippon-financial-holdings": nishiNipponFinancialHoldings,
  "nissan-shatai": nissanShatai,
  "nissei-asb-machine": nisseiAsbMachine,
  "nissei-plastic-industrial": nisseiPlasticIndustrial,
  nissen: nissen,
  nitchitsu: nitchitsu,
  nittan: nittan,
  "nitto-kogyo": nittoKogyo,
  "nkk-switches": nkkSwitches,
  "nohmi-bosai": nohmiBosai,
  nok: nok,
  nomura: nomura,
  "nomura-micro-science": nomuraMicroScience,
  npc: npc,
  "npr-riken": nprRiken,
  nsk: nsk,
  ntn: ntn,
  "obara-group": obaraGroup,
  "ogura-clutch": oguraClutch,
  "oi-electric": oiElectric,
  oiles: oiles,
  oizumi: oizumi,
  "okada-aiyon": okadaAiyon,
  "okamoto-machine-tool-works": okamotoMachineToolWorks,
  "okano-valve-mfg": okanoValveMfg,
  "okaya-electric-industries": okayaElectricIndustries,
  "oki-electric-industry": okiElectricIndustry,
  okuma: okuma,
  "okumura-engineering": okumuraEngineering,
  "ono-sokki": onoSokki,
  "open-group": openGroup,
  "optex-group": optexGroup,
  optoelectronics: optoelectronics,
  optorun: optorun,
  "orchestra-holdings": orchestraHoldings,
  organo: organo,
  "oriental-chain-mfg": orientalChainMfg,
  origin: origin,
  "osaki-electric": osakiElectric,
  osg: osg,
  "osg-6757": osg6757,
  oxide: oxide,
  "pacific-industrial": pacificIndustrial,
  peers: peers,
  pegasus: pegasus,
  petgo: petgo,
  "phc-holdings": phcHoldings,
  phoenixbio: phoenixbio,
  piala: piala,
  pillar: pillar,
  "plat-home": platHome,
  port: port,
  "premium-group": premiumGroup,
  "press-kogyo": pressKogyo,
  "prored-partners": proredPartners,
  "pulstec-industrial": pulstecIndustrial,
  "qb-net-holdings": qbNetHoldings,
  "qd-laser": qdLaser,
  "qls-holdings": qlsHoldings,
  raiznext: raiznext,
  rakumachi: rakumachi,
  rarejob: rarejob,
  "recruit-holdings": recruitHoldings,
  rentracks: rentracks,
  "rheon-automatic-machinery": rheonAutomaticMachinery,
  "ride-on-express-holdings": rideOnExpressHoldings,
  rion: rion,
  "riso-kagaku": risoKagaku,
  "river-eletec": riverEletec,
  rorze: rorze,
  rvh: rvh,
  "sakai-heavy-industries": sakaiHeavyIndustries,
  sakurai: sakurai,
  "sakurasaku-plus": sakurasakuPlus,
  samco: samco,
  sanden: sanden,
  sanei: sanei,
  "sanken-electric": sankenElectric,
  "sanki-service": sankiService,
  sanko: sanko,
  sankyo: sankyo,
  "sanoh-industrial": sanohIndustrial,
  "sanoyas-holdings": sanoyasHoldings,
  sansei: sansei,
  "sansei-technologies": sanseiTechnologies,
  "sansha-electric-manufacturing": sanshaElectricManufacturing,
  "sanso-electric": sansoElectric,
  "santec-holdings": santecHoldings,
  "sanyo-denki": sanyoDenki,
  sato: sato,
  "sawafuji-electric": sawafujiElectric,
  saxa: saxa,
  "sbi-aruhi": sbiAruhi,
  "sbi-sumishin-net-bank": sbiSumishinNetBank,
  "sega-sammy-holdings": segaSammyHoldings,
  "seibu-electric-and-machinery": seibuElectricAndMachinery,
  "seibu-giken": seibuGiken,
  seiko: seiko,
  "seiko-electric": seikoElectric,
  "seiko-epson": seikoEpson,
  "seikoh-giken": seikohGiken,
  "seiwa-electric-mfg": seiwaElectricMfg,
  semba: semba,
  semitec: semitec,
  seraku: seraku,
  sharp: sharp,
  "shibaura-electronics": shibauraElectronics,
  "shibaura-machine": shibauraMachine,
  "shibaura-mechatronics": shibauraMechatronics,
  shibuya: shibuya,
  shikigaku: shikigaku,
  "shikino-high-tech": shikinoHighTech,
  "shima-seiki-mfg": shimaSeikiMfg,
  "shin-maint-holdings": shinMaintHoldings,
  "alink-internet": alinkInternet,
  amazia: amazia,
  amiya: amiya,
  aplix: aplix,
  asukanet: asukanet,
  azplanning: azplanning,
  "b-r-31-ice-cream": bR31IceCream,
  "bike-o-and-company": bikeOAndCompany,
  cinc: cinc,
  "core-concept-technologies": coreConceptTechnologies,
  dvx: dvx,
  entrust: entrust,
  flier: flier,
  glory: glory,
  headwaters: headwaters,
  horiifoodservice: horiifoodservice,
  "hpc-systems": hpcSystems,
  "hyuga-primary-care": hyugaPrimaryCare,
  imageone: imageone,
  "inbound-platform": inboundPlatform,
  "kids-star": kidsStar,
  kokopelli: kokopelli,
  kuradashi: kuradashi,
  kurashicom: kurashicom,
  "m-and-a-capital-partners": mAndACapitalPartners,
  "macbee-planet": macbeePlanet,
  medix: medix,
  "mirai-works": miraiWorks,
  "nakakita-seisakusho": nakakitaSeisakusho,
  "nifty-lifestyle": niftyLifestyle,
  "original-engineering-consultants": originalEngineeringConsultants,
  "pksha-technology": pkshaTechnology,
  placo: placo,
  quest: quest,
  "shindengen-electric-manufacturing": shindengenElectricManufacturing,
  shinko: shinko,
  "shinmaywa-industries": shinmaywaIndustries,
  "shinwa-holdings": shinwaHoldings,
  "shirai-electronics-industrial": shiraiElectronicsIndustrial,
  "shizuki-electric": shizukiElectric,
  "showa-shinku": showaShinku,
  "sigmaxyz-holdings": sigmaxyzHoldings,
  "sinfonia-technology": sinfoniaTechnology,
  "sinko-industries": sinkoIndustries,
  sintokogio: sintokogio,
  siriusvision: siriusvision,
  "sk-electronics": skElectronics,
  "smile-holdings": smileHoldings,
  smk: smk,
  sockets: sockets,
  sodick: sodick,
  soft99corporation: soft99corporation,
  "softcreate-holdings": softcreateHoldings,
  softmax: softmax,
  softtex: softtex,
  "software-service": softwareService,
  "soken-chemical-and-engineering": sokenChemicalAndEngineering,
  "solasia-pharma": solasiaPharma,
  solasto: solasto,
  "solize-holdings": solizeHoldings,
  solxyz: solxyz,
  "sophia-holdings": sophiaHoldings,
  sotoh: sotoh,
  sourcenext: sourcenext,
  "space-market": spaceMarket,
  "space-shower-skiyaki-holdings": spaceShowerSkiyakiHoldings,
  speee: speee,
  "spiderplus-and-co": spiderplusAndCo,
  sportsfield: sportsfield,
  sprix: sprix,
  "sra-holdings": sraHoldings,
  "stanley-electric": stanleyElectric,
  "startia-holdings": startiaHoldings,
  startline: startline,
  "stella-chemifa": stellaChemifa,
  "stella-pharma": stellaPharma,
  "stemcell-institute": stemcellInstitute,
  stemrim: stemrim,
  stg: stg,
  stmn: stmn,
  strike: strike,
  strust: strust,
  "studio-atao": studioAtao,
  "sugai-chemical-industry": sugaiChemicalIndustry,
  "suido-kiko-kaisha": suidoKikoKaisha,
  sumco: sumco,
  sumida: sumida,
  suminoe: suminoe,
  "sumitomo-bakelite": sumitomoBakelite,
  "sumitomo-electric-industries": sumitomoElectricIndustries,
  "sumitomo-osaka-cement": sumitomoOsakaCement,
  "sumitomo-pharma": sumitomoPharma,
  "sumitomo-riko": sumitomoRiko,
  "sumitomo-rubber-industries": sumitomoRubberIndustries,
  "sumitomo-seika-chemicals": sumitomoSeikaChemicals,
  sun: sun,
  "sun-a-kaken": sunAKaken,
  "sun-life-holding": sunLifeHolding,
  suncall: suncall,
  suncorporation: suncorporation,
  "super-tool": superTool,
  superbag: superbag,
  "surala-net": suralaNet,
  sus: sus,
  susmed: susmed,
  "suzuki-6785": suzuki6785,
  "suzumo-machinery": suzumoMachinery,
  "hitachi-construction-machinery": hitachiConstructionMachinery,
  "nihon-house-holdings": nihonHouseHoldings,
  swcc: swcc,
  "symbio-pharmaceuticals": symbioPharmaceuticals,
  "synchro-food": synchroFood,
  "sys-holdings": sysHoldings,
  sysmex: sysmex,
  "system-d": systemD,
  "system-integrator": systemIntegrator,
  "system-research": systemResearch,
  "system-support-holdings": systemSupportHoldings,
  systemexe: systemexe,
  "systems-design": systemsDesign,
  "systems-engineering-consultants": systemsEngineeringConsultants,
  syuppin: syuppin,
  "t-and-s-group": tAndSGroup,
  "t-hasegawa": tHasegawa,
  "t-rad": tRad,
  tabikobo: tabikobo,
  tac: tac,
  "tachi-s": tachiS,
  tacmina: tacmina,
  tadano: tadano,
  "taihei-machinery-works": taiheiMachineryWorks,
  "taiheiyo-cement": taiheiyoCement,
  "taiho-kogyo": taihoKogyo,
  "taiko-pharmaceutical": taikoPharmaceutical,
  "taisei-lamick-group-head-quarter-and-innovation": taiseiLamickGroupHeadQuarterAndInnovation,
  "taiyo-holdings": taiyoHoldings,
  "taiyo-technolex": taiyoTechnolex,
  "takadakiko-steel-construction": takadakikoSteelConstruction,
  "takagi-seiko": takagiSeiko,
  takakita: takakita,
  takamisawa: takamisawa,
  "takamisawa-cybernetics": takamisawaCybernetics,
  "takaoka-toko": takaokaToko,
  "takara-bio": takaraBio,
  "takasago-international": takasagoInternational,
  "takasago-tekko-k-k": takasagoTekkoKK,
  takatori: takatori,
  "take-and-give-needs": takeAndGiveNeeds,
  "takemoto-yohki": takemotoYohki,
  "takeuchi-mfg": takeuchiMfg,
  "taki-chemical": takiChemical,
  "takizawa-ham": takizawaHam,
  takuma: takuma,
  talentx: talentx,
  "tama-home": tamaHome,
  "tamagawa-holdings": tamagawaHoldings,
  tamura: tamura,
  "tanabe-engineering": tanabeEngineering,
  "tanaka-chemical": tanakaChemical,
  "tanaka-seimitsu-kogyo": tanakaSeimitsuKogyo,
  tanaken: tanaken,
  "taoka-chemical": taokaChemical,
  "tasuki-holdings": tasukiHoldings,
  "tauns-laboratories": taunsLaboratories,
  taya: taya,
  tayca: tayca,
  tazmo: tazmo,
  "tb-group": tbGroup,
  tbk: tbk,
  "tdc-soft": tdcSoft,
  tdse: tdse,
  "tea-life": teaLife,
  teac: teac,
  teamspirit: teamspirit,
  tear: tear,
  "techfirm-holdings": techfirmHoldings,
  techmatrix: techmatrix,
  "techno-alpha": technoAlpha,
  "techno-horizon": technoHorizon,
  "techno-mathematical": technoMathematical,
  "techno-medica": technoMedica,
  "techno-ryowa": technoRyowa,
  "techno-smart": technoSmart,
  technoflex: technoflex,
  technologies: technologies,
  "technopro-holdings": technoproHoldings,
  "tecmira-holdings": tecmiraHoldings,
  tecnisco: tecnisco,
  teijin: teijin,
  teikoku: teikoku,
  "teikoku-sen-i": teikokuSenI,
  "teikoku-tsushin-kogyo": teikokuTsushinKogyo,
  tein: tein,
  tekken: tekken,
  "tekscend-photomask": tekscendPhotomask,
  temairazu: temairazu,
  temona: temona,
  tenda: tenda,
  "teno-holdings": tenoHoldings,
  tenox: tenox,
  "tenpos-holdings": tenposHoldings,
  "tenryu-saw-mfg": tenryuSawMfg,
  "tensho-electric-industries": tenshoElectricIndustries,
  tential: tential,
  "tera-probe": teraProbe,
  "tera-technology": teraTechnology,
  "terasaki-electric": terasakiElectric,
  "terilogy-holdings": terilogyHoldings,
  "terra-drone": terraDrone,
  terrasky: terrasky,
  terumo: terumo,
  tesec: tesec,
  "tess-holdings": tessHoldings,
  "tetsujin-holdings": tetsujinHoldings,
  "the-first-bank-of-toyama": theFirstBankOfToyama,
  "the-furukawa-battery": theFurukawaBattery,
  "the-global": theGlobal,
  "the-hanshin-diesel-works": theHanshinDieselWorks,
  "the-imamura-securities": theImamuraSecurities,
  "the-japan-steel-works": theJapanSteelWorks,
  "the-japan-wool-textile": theJapanWoolTextile,
  "the-kaneshita-construction": theKaneshitaConstruction,
  "the-kinki-sharyo": theKinkiSharyo,
  "the-kodensha": theKodensha,
  "the-lead": theLead,
  "the-monogatari": theMonogatari,
  "the-nihon-seima": theNihonSeima,
  "the-nippon-road": theNipponRoad,
  "the-nippon-signal": theNipponSignal,
  "the-nisshin-oillio-group": theNisshinOillioGroup,
  "the-pack": thePack,
  "the-takigami-steel-construction": theTakigamiSteelConstruction,
  "the-torigoe": theTorigoe,
  "the-why-how-do": theWhyHowDo,
  "the-yokohama-rubber": theYokohamaRubber,
  "the-zenitaka": theZenitaka,
  thecoo: thecoo,
  "thermae-yu-holdings": thermaeYuHoldings,
  thinca: thinca,
  "thine-electronics": thineElectronics,
  thk: thk,
  "tigers-polymer": tigersPolymer,
  timee: timee,
  tis: tis,
  "titan-kogyo": titanKogyo,
  tkp: tkp,
  tmh: tmh,
  tms: tms,
  "to-books": toBooks,
  toa: toa,
  "toa-6809": toa6809,
  "toa-road": toaRoad,
  toabo: toabo,
  toagosei: toagosei,
  toami: toami,
  "tobila-systems": tobilaSystems,
  "tobishima-holdings": tobishimaHoldings,
  tocalo: tocalo,
  toda: toda,
  "toda-kogyo": todaKogyo,
  "toei-animation": toeiAnimation,
  toell: toell,
  toenec: toenec,
  "togami-electric-mfg": togamiElectricMfg,
  "toho-acetylene": tohoAcetylene,
  "toho-chemical-industry": tohoChemicalIndustry,
  "toho-system-science": tohoSystemScience,
  "toho-titanium": tohoTitanium,
  "tohoku-steel": tohokuSteel,
  "tohokushinsha-film": tohokushinshaFilm,
  "tokai-carbon": tokaiCarbon,
  "tokai-holdings": tokaiHoldings,
  "tokai-rika": tokaiRika,
  "tokai-senko": tokaiSenko,
  "tokai-soft": tokaiSoft,
  token: token,
  tokuden: tokuden,
  tokura: tokura,
  "tokushu-tokai-paper": tokushuTokaiPaper,
  tokuyama: tokuyama,
  "tokyo-automatic-machinery-works": tokyoAutomaticMachineryWorks,
  "tokyo-base": tokyoBase,
  "tokyo-cosmos-electric": tokyoCosmosElectric,
  "tokyo-electron-device": tokyoElectronDevice,
  "tokyo-energy-and-systems": tokyoEnergyAndSystems,
  "tokyo-ichiban-foods": tokyoIchibanFoods,
  "tokyo-individualized-educational-institute": tokyoIndividualizedEducationalInstitute,
  "tokyo-kikai-seisakusho": tokyoKikaiSeisakusho,
  "tokyo-kiraboshi-financial-group": tokyoKiraboshiFinancialGroup,
  "tokyo-ohka-kogyo": tokyoOhkaKogyo,
  "tokyo-printing-ink-mfg": tokyoPrintingInkMfg,
  "tokyo-radiator-mfg": tokyoRadiatorMfg,
  "tokyo-rope-mfg": tokyoRopeMfg,
  "tokyo-tatemono": tokyoTatemono,
  "tokyo-tekko": tokyoTekko,
  "tokyu-construction": tokyuConstruction,
  "tokyu-fudosan-holdings": tokyuFudosanHoldings,
  "tomen-devices": tomenDevices,
  "tomita-electric": tomitaElectric,
  tomoe: tomoe,
  "tomoe-engineering": tomoeEngineering,
  tomoegawa: tomoegawa,
  tomoku: tomoku,
  tone: tone,
  topre: topre,
  "topy-industries": topyIndustries,
  toray: toray,
  "torex-semiconductor": torexSemiconductor,
  torico: torico,
  "toridoll-holdings": toridollHoldings,
  "torii-pharmaceutical": toriiPharmaceutical,
  "torishima-pump-mfg": torishimaPumpMfg,
  tose: tose,
  "toshiba-tec": toshibaTec,
  tosnet: tosnet,
  toso: toso,
  tosoh: tosoh,
  "totetsu-kogyo": totetsuKogyo,
  toto: toto,
  toubujyuhan: toubujyuhan,
  "toukei-computer": toukeiComputer,
  toumei: toumei,
  tow: tow,
  towa: towa,
  "towa-food-service": towaFoodService,
  "towa-hi-system": towaHiSystem,
  "towa-pharmaceutical": towaPharmaceutical,
  "townnews-sha": townnewsSha,
  "toyo-asano-foundation": toyoAsanoFoundation,
  "toyo-construction": toyoConstruction,
  "toyo-denki-seizo": toyoDenkiSeizo,
  "toyo-drilube": toyoDrilube,
  "toyo-electric": toyoElectric,
  "toyo-gosei": toyoGosei,
  "toyo-innovex": toyoInnovex,
  "toyo-kanetsu": toyoKanetsu,
  "toyo-seikan-group-holdings": toyoSeikanGroupHoldings,
  "toyo-shutter": toyoShutter,
  "toyo-suisan-kaisha": toyoSuisanKaisha,
  "toyo-tanso": toyoTanso,
  "toyo-tire": toyoTire,
  toyobo: toyobo,
  toyokumo: toyokumo,
  "toyota-boshoku": toyotaBoshoku,
  "toyota-industries-6201": toyotaIndustries6201,
  tpr: tpr,
  "traas-on-product": traasOnProduct,
  "trade-works": tradeWorks,
  "trailhead-global-holdings": trailheadGlobalHoldings,
  "trans-genic-group": transGenicGroup,
  "transaction-media-networks": transactionMediaNetworks,
  "treasure-factory": treasureFactory,
  "trend-micro": trendMicro,
  trenders: trenders,
  "tri-chemical-laboratories": triChemicalLaboratories,
  "trial-holdings": trialHoldings,
  triis: triis,
  "trinity-industrial": trinityIndustrial,
  tripla: tripla,
  tripleize: tripleize,
  "truck-one": truckOne,
  "true-data": trueData,
  trust: trust,
  "trust-holdings": trustHoldings,
  "tsi-holdings": tsiHoldings,
  "tsubaki-nakashima": tsubakiNakashima,
  "tsubakimoto-chain": tsubakimotoChain,
  "tsubota-laboratory": tsubotaLaboratory,
  "tsuburaya-fields-holdings": tsuburayaFieldsHoldings,
  "tsuchiya-holdings": tsuchiyaHoldings,
  tsudakoma: tsudakoma,
  tsugami: tsugami,
  "tsukada-global-holdings": tsukadaGlobalHoldings,
  "tsukishima-holdings": tsukishimaHoldings,
  "tsumura-and-co": tsumuraAndCo,
  "tsunagu-group-holdings": tsunaguGroupHoldings,
  "tsuruha-holdings": tsuruhaHoldings,
  "tsurumi-manufacturing": tsurumiManufacturing,
  tsuruya: tsuruya,
  tve: tve,
  "twenty-four-seven-holdings": twentyFourSevenHoldings,
  twinbird: twinbird,
  tyk: tyk,
  uacj: uacj,
  ube: ube,
  "ubicom-holdings": ubicomHoldings,
  "ubiquitous-ai": ubiquitousAi,
  ubiteq: ubiteq,
  "uchiyama-holdings": uchiyamaHoldings,
  ueki: ueki,
  "uls-group": ulsGroup,
  uluru: uluru,
  ulvac: ulvac,
  "umenoyado-brewery": umenoyadoBrewery,
  umios: umios,
  unerry: unerry,
  unicafe: unicafe,
  "uniform-next": uniformNext,
  "union-tool": unionTool,
  unipres: unipres,
  unirita: unirita,
  "unisol-holdings": unisolHoldings,
  "unite-and-grow": uniteAndGrow,
  united: united,
  "united-and-collective": unitedAndCollective,
  "united-super-markets-holdings": unitedSuperMarketsHoldings,
  "univa-oak-holdings": univaOakHoldings,
  univance: univance,
  "universal-engeisha": universalEngeisha,
  "universal-entertainment": universalEntertainment,
  "unozawa-gumi-iron-works": unozawaGumiIronWorks,
  uoki: uoki,
  "up-garage-group": upGarageGroup,
  upcon: upcon,
  upr: upr,
  urbanet: urbanet,
  uridoki: uridoki,
  "user-local": userLocal,
  ushio: ushio,
  usonar: usonar,
  uss: uss,
  "ut-group": utGroup,
  uuum: uuum,
  "v-cube": vCube,
  "valtes-holdings": valtesHoldings,
  "value-golf": valueGolf,
  "value-hr": valueHr,
  valuecommerce: valuecommerce,
  "valuenex-japan": valuenexJapan,
  "vario-secure": varioSecure,
  vector: vector,
  "vector-holdings": vectorHoldings,
  vega: vega,
  veltra: veltra,
  "veritas-in-silico": veritasInSilico,
  vertex: vertex,
  "virtualex-holdings": virtualexHoldings,
  vis: vis,
  visional: visional,
  "visual-processing-japan": visualProcessingJapan,
  visumo: visumo,
  "vital-ksk-holdings": vitalKskHoldings,
  "vlc-security": vlcSecurity,
  "voltage-incorporation": voltageIncorporation,
  "vrain-solution": vrainSolution,
  "w-scope": wScope,
  "wacoal-holdings": wacoalHoldings,
  wacom: wacom,
  wacul: wacul,
  "wakachiku-construction": wakachikuConstruction,
  "wakamoto-pharmaceutical": wakamotoPharmaceutical,
  "wakou-shokuhin": wakouShokuhin,
  wantedly: wantedly,
  waqoo: waqoo,
  "warabeya-nichiyo-holdings": warabeyaNichiyoHoldings,
  "waseda-academy": wasedaAcademy,
  "waseda-gakushukenkyukai": wasedaGakushukenkyukai,
  "wash-house": washHouse,
  "washington-hotel": washingtonHotel,
  "watahan-and-co": watahanAndCo,
  "watanabe-sato": watanabeSato,
  watts: watts,
  "wdb-coco": wdbCoco,
  "wdb-holdings": wdbHoldings,
  wdi: wdi,
  "wealth-management": wealthManagement,
  weathernews: weathernews,
  "wedge-holdings": wedgeHoldings,
  welby: welby,
  "welcia-holdings": welciaHoldings,
  "wellneo-sugar": wellneoSugar,
  "wellness-communications": wellnessCommunications,
  wellnet: wellnet,
  "wesco-holdings": wescoHoldings,
  "west-holdings": westHoldings,
  will: will,
  "will-group": willGroup,
  "will-smart": willSmart,
  "willplus-holdings": willplusHoldings,
  wills: wills,
  willtec: willtec,
  "win-partners": winPartners,
  wingarc1st: wingarc1st,
  wintest: wintest,
  "wise-holdings": wiseHoldings,
  witz: witz,
  "wolves-hand": wolvesHand,
  wonderplanet: wonderplanet,
  "world-holdings": worldHoldings,
  wowow: wowow,
  writeup: writeup,
  xnet: xnet,
  "y-a-c-holdings": yACHoldings,
  "y-s-table": ySTable,
  "ya-man": yaMan,
  "yahagi-construction": yahagiConstruction,
  "yakiniku-sakai-holdings": yakinikuSakaiHoldings,
  "yakult-honsha": yakultHonsha,
  yamabiko: yamabiko,
  yamachuu: yamachuu,
  yamada: yamada,
  "yamada-consulting-group": yamadaConsultingGroup,
  "yamada-servicer-synthetic-office": yamadaServicerSyntheticOffice,
  "yamae-group-holdings": yamaeGroupHoldings,
  "yamaichi-electronics": yamaichiElectronics,
  "yamaichi-real-estate": yamaichiRealEstate,
  yamaki: yamaki,
  yamami: yamami,
  "yamashin-filter": yamashinFilter,
  yamato: yamato,
  "yamato-kogyo": yamatoKogyo,
  "yamau-holdings": yamauHoldings,
  yamaura: yamaura,
  yamax: yamax,
  "yamazaki-baking": yamazakiBaking,
  yappli: yappli,
  "yashima-denki": yashimaDenki,
  "yasuhara-chemical": yasuharaChemical,
  yasunaga: yasunaga,
  "ye-digital": yeDigital,
  ykt: ykt,
  ymirlink: ymirlink,
  yodoko: yodoko,
  "yokogawa-bridge-holdings": yokogawaBridgeHoldings,
  "yokohama-financial-group": yokohamaFinancialGroup,
  yokorei: yokorei,
  "yokota-manufacturing": yokotaManufacturing,
  yokowo: yokowo,
  yondenko: yondenko,
  yoshicon: yoshicon,
  "yoshimura-food-holdings": yoshimuraFoodHoldings,
  yoshitake: yoshitake,
  "yossix-holdings": yossixHoldings,
  "yotai-refractories": yotaiRefractories,
  youji: youji,
  yrglm: yrglm,
  "yuke-s": yukeS,
  "yuken-kogyo": yukenKogyo,
  "yuki-gosei-kogyo": yukiGoseiKogyo,
  "yukiguni-factory": yukiguniFactory,
  yumemitsuketai: yumemitsuketai,
  yurtec: yurtec,
  yushin: yushin,
  yushiro: yushiro,
  "yutaka-foods": yutakaFoods,
  "yutaka-giken": yutakaGiken,
  yutori: yutori,
  zappallas: zappallas,
  zenhoren: zenhoren,
  "zenkoku-hosho": zenkokuHosho,
  zenmutech: zenmutech,
  zeon: zeon,
  "zeria-pharmaceutical": zeriaPharmaceutical,
  zeta: zeta,
  "zig-zag": zigZag,
  zigexn: zigexn,
  zoa: zoa,
  zoom: zoom,
  zuiko: zuiko,
  zuken: zuken,
  zuu: zuu,
  "3-d-matrix": c3DMatrix,
  "a-and-d-holon-holdings": aAndDHolonHoldings,
  "a-one-seimitsu": aOneSeimitsu,
  "ab-and-company": abAndCompany,
  acom: acom,
  "advan-group": advanGroup,
  "advantage-risk-management": advantageRiskManagement,
  "aeon-delight": aeonDelight,
  "aeon-financial-service": aeonFinancialService,
  "aeon-hokkaido": aeonHokkaido,
  "aeon-mall": aeonMall,
  aeroedge: aeroedge,
  ageha: ageha,
  "agora-hospitality-group": agoraHospitalityGroup,
  agp: agp,
  "ai-partners-financial": aiPartnersFinancial,
  "aichi-financial-group": aichiFinancialGroup,
  "aichi-tokei-denki": aichiTokeiDenki,
  "aidma-holdings": aidmaHoldings,
  "aidma-marketing-communication": aidmaMarketingCommunication,
  aiful: aiful,
  aigan: aigan,
  "ain-holdings": ainHoldings,
  "ainavo-holdings": ainavoHoldings,
  aircloset: aircloset,
  "airport-facilities": airportFacilities,
  "aisan-industry": aisanIndustry,
  ait: ait,
  "akatsuki-8737": akatsuki8737,
  albis: albis,
  almedio: almedio,
  alphapolis: alphapolis,
  "altech-9972": altech9972,
  "amg-holdings": amgHoldings,
  amifa: amifa,
  "anabuki-kosan": anabukiKosan,
  "anicom-holdings": anicomHoldings,
  anrakutei: anrakutei,
  "aoki-holdings": aokiHoldings,
  "aoyama-trading": aoyamaTrading,
  "aoyama-zaisan-networks": aoyamaZaisanNetworks,
  "aozora-bank": aozoraBank,
  appbank: appbank,
  aqualine: aqualine,
  "araya-industrial": arayaIndustrial,
  arclands: arclands,
  arcs: arcs,
  "area-quest": areaQuest,
  arealink: arealink,
  "argo-graphics": argoGraphics,
  "art-vivant": artVivant,
  artnature: artnature,
  "as-one": asOne,
  asagami: asagami,
  "asahi-broadcasting-group-holdings": asahiBroadcastingGroupHoldings,
  "asahi-intecc": asahiIntecc,
  "asahi-intelligence-service": asahiIntelligenceService,
  "asahi-kagaku-kogyo": asahiKagakuKogyo,
  asakuma: asakuma,
  asax: asax,
  "aseed-holdings": aseedHoldings,
  "asia-air-survey": asiaAirSurvey,
  "asian-star": asianStar,
  asics: asics,
  asiro: asiro,
  asnova: asnova,
  "aso-international": asoInternational,
  "astena-holdings": astenaHoldings,
  "atlas-technologies": atlasTechnologies,
  "autobacs-seven": autobacsSeven,
  avantia: avantia,
  avex: avex,
  avic: avic,
  avix: avix,
  "axial-retailing": axialRetailing,
  "axis-consulting": axisConsulting,
  "az-com-maruwa-holdings": azComMaruwaHoldings,
  "azuma-shipping": azumaShipping,
  "b-and-p": bAndP,
  "baby-calendar": babyCalendar,
  "bandai-namco-holdings": bandaiNamcoHoldings,
  "bank-of-the-ryukyus": bankOfTheRyukyus,
  barcos: barcos,
  bcc: bcc,
  "being-holdings": beingHoldings,
  belc: belc,
  "bell-park": bellPark,
  "bellsystem24-holdings": bellsystem24Holdings,
  belluna: belluna,
  bewith: bewith,
  "biken-techno": bikenTechno,
  biprogy: biprogy,
  "bitcoin-japan": bitcoinJapan,
  bizmates: bizmates,
  bleach: bleach,
  "bookoff-group-holdings": bookoffGroupHoldings,
  boutiques: boutiques,
  brangista: brangista,
  "bridge-consulting-group": bridgeConsultingGroup,
  "broad-minded": broadMinded,
  "bsn-media-holdings": bsnMediaHoldings,
  bunkeido: bunkeido,
  bushiroad: bushiroad,
  "business-brain-showaota": businessBrainShowaota,
  "business-coach": businessCoach,
  "buysell-technologies": buysellTechnologies,
  "c-e-management-integrated-laboratory": cEManagementIntegratedLaboratory,
  "c-s-lumber": cSLumber,
  "canon-electronics": canonElectronics,
  "canon-marketing-japan": canonMarketingJapan,
  canox: canox,
  capcom: capcom,
  capita: capita,
  "car-mate-mfg": carMateMfg,
  caster: caster,
  casy: casy,
  "cci-group": cciGroup,
  cellseed: cellseed,
  celm: celm,
  "central-automotive-products": centralAutomotiveProducts,
  "central-forest-group": centralForestGroup,
  "central-security-patrols": centralSecurityPatrols,
  "century-21-real-estate-of-japan": century21RealEstateOfJapan,
  cerespo: cerespo,
  charle: charle,
  "chichibu-railway": chichibuRailway,
  "chiyoda-8185": chiyoda8185,
  chori: chori,
  "chubu-nippon-broadcasting": chubuNipponBroadcasting,
  "chubu-suisan": chubuSuisan,
  "chuo-gyorui": chuoGyorui,
  "chuo-warehouse": chuoWarehouse,
  "chuokeizai-sha-holdings": chuokeizaiShaHoldings,
  circulation: circulation,
  "citizen-watch": citizenWatch,
  cleanup: cleanup,
  "coach-a": coachA,
  cocorport: cocorport,
  "colan-totte": colanTotte,
  "computer-engineering-and-consulting": computerEngineeringAndConsulting,
  consec: consec,
  copa: copa,
  "cosmos-initia": cosmosInitia,
  cox: cox,
  creo: creo,
  crestec: crestec,
  crops: crops,
  crossfor: crossfor,
  "cs-c": csC,
  "cti-engineering": ctiEngineering,
  cuc: cuc,
  "dai-nippon-printing": daiNipponPrinting,
  "daiei-kankyo": daieiKankyo,
  daiichi: daiichi,
  "daiichi-jitsugyo": daiichiJitsugyo,
  "daiichi-koutsu-sangyo": daiichiKoutsuSangyo,
  daiichikosho: daiichikosho,
  "daiken-medical": daikenMedical,
  "daiko-tsusan": daikoTsusan,
  "daiko-xtech": daikoXtech,
  "daimaru-enawin": daimaruEnawin,
  daiseki: daiseki,
  "daishi-hokuetsu-financial-group": daishiHokuetsuFinancialGroup,
  daisui: daisui,
  daisyo: daisyo,
  "daito-koun": daitoKoun,
  daitron: daitron,
  daiun: daiun,
  daiwa: daiwa,
  "daiwa-motor-transportation": daiwaMotorTransportation,
  "daiwa-securities-group": daiwaSecuritiesGroup,
  "decollte-holdings": decollteHoldings,
  "delivery-consulting": deliveryConsulting,
  "denkyo-group-holdings": denkyoGroupHoldings,
  digitalift: digitalift,
  "direct-marketing-mix": directMarketingMix,
  dms: dms,
  "dn-holdings": dnHoldings,
  doshisha: doshisha,
  dreambed: dreambed,
  dts: dts,
  "e-logit": eLogit,
  "earth-infinity": earthInfinity,
  "echo-trading": echoTrading,
  "eco-s": ecoS,
  edp: edp,
  "ef-on": efOn,
  eguarantee: eguarantee,
  eidai: eidai,
  "eidai-kako": eidaiKako,
  eiwa: eiwa,
  "electric-power-development": electricPowerDevelopment,
  emimen: emimen,
  encho: encho,
  "endo-manufacturing": endoManufacturing,
  enjin: enjin,
  "enshu-truck": enshuTruck,
  erex: erex,
  "es-con-japan": esConJapan,
  eslead: eslead,
  "estelle-holdings": estelleHoldings,
  estic: estic,
  "eurasia-travel": eurasiaTravel,
  "f-c-c": fCC,
  "f-code": fCode,
  "fb-care-service": fbCareService,
  fce: fce,
  fibergate: fibergate,
  "fidea-holdings": fideaHoldings,
  "fintech-global": fintechGlobal,
  "first-juken": firstJuken,
  "fj-next-holdings": fjNextHoldings,
  forval: forval,
  "forval-realstraight": forvalRealstraight,
  "forval-telecom": forvalTelecom,
  fp: fp,
  "fp-partner": fpPartner,
  "france-bed-holdings": franceBedHoldings,
  friendly: friendly,
  "fuji-7605": fuji7605,
  "fuji-8278": fuji8278,
  "fuji-8860": fuji8860,
  "fuji-kyuko": fujiKyuko,
  "fuji-oozx": fujiOozx,
  "fuji-seal-international": fujiSealInternational,
  "fuji-soft": fujiSoft,
  fujicopian: fujicopian,
  fujidie: fujidie,
  "fujii-sangyo": fujiiSangyo,
  "fujita-kanko": fujitaKanko,
  "fukui-computer-holdings": fukuiComputerHoldings,
  "fukuoka-financial-group": fukuokaFinancialGroup,
  "fukushima-printing": fukushimaPrinting,
  "fukuvi-chemical-industry": fukuviChemicalIndustry,
  "fukuyama-transporting": fukuyamaTransporting,
  "fuluhashi-epo": fuluhashiEpo,
  "funai-soken-holdings": funaiSokenHoldings,
  "furuya-metal": furuyaMetal,
  "fushiki-kairiku-unso": fushikiKairikuUnso,
  "fuso-dentsu": fusoDentsu,
  "future-link-network": futureLinkNetwork,
  "fuyo-general-lease": fuyoGeneralLease,
  "g-7-holdings": g7Holdings,
  "gakken-holdings": gakkenHoldings,
  gakkyusha: gakkyusha,
  gecoss: gecoss,
  genda: genda,
  "genki-global-dining-concepts": genkiGlobalDiningConcepts,
  "genky-drugstores": genkyDrugstores,
  genova: genova,
  geocode: geocode,
  "gift-holdings": giftHoldings,
  "ginza-renoir": ginzaRenoir,
  gixo: gixo,
  "glad-cube": gladCube,
  "global-dining": globalDining,
  "global-kids": globalKids,
  globeride: globeride,
  gloe: gloe,
  "glome-holdings": glomeHoldings,
  "gmo-internet-group": gmoInternetGroup,
  "gmo-media": gmoMedia,
  goldcrest: goldcrest,
  goldwin: goldwin,
  goodpatch: goodpatch,
  "gourmet-kineya": gourmetKineya,
  "grandy-house": grandyHouse,
  "graphite-design": graphiteDesign,
  grcs: grcs,
  "green-earth-institute": greenEarthInstitute,
  "greenland-resort": greenlandResort,
  "gsi-creos": gsiCreos,
  gyet: gyet,
  "h-i-s": hIS,
  "h2o-retailing": h2oRetailing,
  "hachi-ban": hachiBan,
  "hachijuni-nagano-bank": hachijuniNaganoBank,
  "hagihara-industries": hagiharaIndustries,
  "hagiwara-electric-holdings": hagiwaraElectricHoldings,
  hakudo: hakudo,
  hakuto: hakuto,
  hakuyosha: hakuyosha,
  hamakyorex: hamakyorex,
  hamayuu: hamayuu,
  handsman: handsman,
  "hankyu-hanshin-holdings": hankyuHanshinHoldings,
  hanwa: hanwa,
  happinet: happinet,
  "harima-b-stem": harimaBStem,
  "harima-kyowa": harimaKyowa,
  "haruyama-holdings": haruyamaHoldings,
  hasegawa: hasegawa,
  "hashimoto-sogyo-holdings": hashimotoSogyoHoldings,
  "hatsuho-shouji": hatsuhoShouji,
  "heiwa-paper": heiwaPaper,
  "heiwa-real-estate": heiwaRealEstate,
  heiwado: heiwado,
  "hiday-hidaka": hidayHidaka,
  "higashi-holdings": higashiHoldings,
  "hikari-tsushin": hikariTsushin,
  himaraya: himaraya,
  hiraga: hiraga,
  "hirayama-holdings": hirayamaHoldings,
  "hirogin-holdings": hiroginHoldings,
  "hiroshima-electric-railway": hiroshimaElectricRailway,
  "hiroshima-gas": hiroshimaGas,
  hitomile: hitomile,
  "hokkaido-chuo-bus": hokkaidoChuoBus,
  "hokkaido-gas": hokkaidoGas,
  "hokuhoku-financial-group": hokuhokuFinancialGroup,
  "hokuriku-electric-power": hokurikuElectricPower,
  "hokuriku-gas": hokurikuGas,
  hokushin: hokushin,
  horai: horai,
  "hoshi-iryo-sanki": hoshiIryoSanki,
  "hotel-newgrand": hotelNewgrand,
  "house-of-rose": houseOfRose,
  housefreedom: housefreedom,
  "hs-holdings": hsHoldings,
  "human-creation-holdings": humanCreationHoldings,
  hurxley: hurxley,
  "hyoki-kaiun-kaisha": hyokiKaiunKaisha,
  "i-a-group": iAGroup,
  "i-net": iNet,
  "i-x-knowledge": iXKnowledge,
  ibis: ibis,
  iceco: iceco,
  ichibanya: ichibanya,
  ichikura: ichikura,
  "ichinen-holdings": ichinenHoldings,
  "ichiyoshi-securities": ichiyoshiSecurities,
  "idea-consultants": ideaConsultants,
  idom: idom,
  "ifis-japan": ifisJapan,
  "iino-kaiun-kaisha": iinoKaiunKaisha,
  "image-magic": imageMagic,
  "imperial-hotel": imperialHotel,
  "impress-holdings": impressHoldings,
  imv: imv,
  "inaba-denki-sangyo": inabaDenkiSangyo,
  "inabata-and-co": inabataAndCo,
  ines: ines,
  inforich: inforich,
  innotech: innotech,
  "integrated-design-and-engineering-holdings": integratedDesignAndEngineeringHoldings,
  intellex: intellex,
  "inter-action": interAction,
  "interworks-confidence": interworksConfidence,
  intloop: intloop,
  "inui-global-logistics": inuiGlobalLogistics,
  irrc: irrc,
  isb: isb,
  "isewan-terminal-service": isewanTerminalService,
  ispace: ispace,
  "itochu-enex": itochuEnex,
  itoki: itoki,
  itsumo: itsumo,
  "iwaicosmo-holdings": iwaicosmoHoldings,
  iwatani: iwatani,
  izumi: izumi,
  izutsuya: izutsuya,
  "j-trust": jTrust,
  jaccs: jaccs,
  "jafco-group": jafcoGroup,
  jamco: jamco,
  "japan-airlines": japanAirlines,
  "japan-airport-terminal": japanAirportTerminal,
  "japan-asia-investment": japanAsiaInvestment,
  "japan-communications": japanCommunications,
  "japan-creative-platform-group": japanCreativePlatformGroup,
  "japan-ecosystem": japanEcosystem,
  "japan-exchange-group": japanExchangeGroup,
  "japan-lifeline": japanLifeline,
  "japan-logistic-systems": japanLogisticSystems,
  "japan-m-and-a-solution": japanMAndASolution,
  "japan-medical-dynamic-marketing": japanMedicalDynamicMarketing,
  "japan-oil-transportation": japanOilTransportation,
  "japan-post-holdings": japanPostHoldings,
  "japan-process-development": japanProcessDevelopment,
  "japan-securities-finance": japanSecuritiesFinance,
  "japan-tissue-engineering": japanTissueEngineering,
  "japan-transcity": japanTranscity,
  "japan-warranty-support": japanWarrantySupport,
  japaniace: japaniace,
  "jbcc-holdings": jbccHoldings,
  "jk-holdings": jkHoldings,
  jms: jms,
  joshin: joshin,
  joyfull: joyfull,
  jsp: jsp,
  juntendo: juntendo,
  "juroku-financial-group": jurokuFinancialGroup,
  "k-r-s": kRS,
  "k-s-holdings": kSHoldings,
  "kabuki-za": kabukiZa,
  kadokawa: kadokawa,
  "kaga-electronics": kagaElectronics,
  "kamakura-shinsho": kamakuraShinsho,
  kamei: kamei,
  kamigumi: kamigumi,
  "kan-nanmaru": kanNanmaru,
  kanaden: kanaden,
  "kanagawa-chuo-kotsu": kanagawaChuoKotsu,
  kanamoto: kanamoto,
  "kanda-holdings": kandaHoldings,
  kanematsu: kanematsu,
  kanseki: kanseki,
  "kantsu-hdco": kantsuHdco,
  "kappa-create": kappaCreate,
  katitas: katitas,
  "kato-sangyo": katoSangyo,
  "kawai-musical-instruments-manufacturing": kawaiMusicalInstrumentsManufacturing,
  "kawanishi-warehouse": kawanishiWarehouse,
  "kawasaki-kisen-kaisha": kawasakiKisenKaisha,
  "kawase-computer-supplies": kawaseComputerSupplies,
  "keifuku-electric-railroad": keifukuElectricRailroad,
  "keihan-holdings": keihanHoldings,
  "keihanshin-building": keihanshinBuilding,
  keikyu: keikyu,
  keio: keio,
  "keisei-electric-railway": keiseiElectricRailway,
  "keiyo-gas": keiyoGas,
  kensoh: kensoh,
  "kikusui-chemical-industries": kikusuiChemicalIndustries,
  kimoto: kimoto,
  kimura: kimura,
  "kimura-unity": kimuraUnity,
  kimuratan: kimuratan,
  "kin-ei": kinEi,
  king: king,
  "king-jim": kingJim,
  "kintetsu-department-store": kintetsuDepartmentStore,
  "kintetsu-group-holdings": kintetsuGroupHoldings,
  kisoji: kisoji,
  kitakei: kitakei,
  "kitazawa-sangyo": kitazawaSangyo,
  "kiyo-learning": kiyoLearning,
  "koa-shoji-holdings": koaShojiHoldings,
  "kobayashi-yoko": kobayashiYoko,
  "kobe-electric-railway": kobeElectricRailway,
  "kohnan-shoji": kohnanShoji,
  kohsai: kohsai,
  kohsoku: kohsoku,
  kojima: kojima,
  koken: koken,
  kokusai: kokusai,
  kokuyo: kokuyo,
  "komatsu-wall-industry": komatsuWallIndustry,
  komeri: komeri,
  konaka: konaka,
  "konami-group": konamiGroup,
  kondotec: kondotec,
  "konoike-transport": konoikeTransport,
  "kosaido-holdings": kosaidoHoldings,
  kotobukiya: kotobukiya,
  koukandekirukun: koukandekirukun,
  kourakuen: kourakuen,
  kowa: kowa,
  koyosha: koyosha,
  "kpp-group-holdings": kppGroupHoldings,
  ksk: ksk,
  "ku-holdings": kuHoldings,
  kubotek: kubotek,
  "kuribayashi-steamship": kuribayashiSteamship,
  "kuroda-precision-industries": kurodaPrecisionIndustries,
  "kurogane-kosakusho": kuroganeKosakusho,
  "kuwazawa-holdings": kuwazawaHoldings,
  "kycom-holdings": kycomHoldings,
  "kyodo-paper-holdings": kyodoPaperHoldings,
  "kyodo-printing": kyodoPrinting,
  "kyoei-tanker": kyoeiTanker,
  "kyogoku-unyu-shoji": kyogokuUnyuShoji,
  "kyokuto-boeki-kaisha": kyokutoBoekiKaisha,
  "kyokuto-securities": kyokutoSecurities,
  kyoritsu: kyoritsu,
  "kyoritsu-maintenance": kyoritsuMaintenance,
  "kyoto-kimono-yuzen-holdings": kyotoKimonoYuzenHoldings,
  "kyowa-engineering-consultants": kyowaEngineeringConsultants,
  "kyushu-leasing-service": kyushuLeasingService,
  "kyushu-railway": kyushuRailway,
  land: land,
  "land-business": landBusiness,
  "laox-holdings": laoxHoldings,
  lapine: lapine,
  "last-one-mile": lastOneMile,
  lec: lec,
  ledax: ledax,
  leoclan: leoclan,
  leopalace21: leopalace21,
  life: life,
  "lihit-lab": lihitLab,
  lilycolor: lilycolor,
  lintec: lintec,
  litalico: litalico,
  livero: livero,
  "loginet-japan": loginetJapan,
  "look-holdings": lookHoldings,
  luckland: luckland,
  "m-and-a-research-institute-holdings": mAndAResearchInstituteHoldings,
  "m-h-group": mHGroup,
  "maezawa-kasei-industries": maezawaKaseiIndustries,
  "mainichi-comnet": mainichiComnet,
  makiya: makiya,
  "makoto-construction": makotoConstruction,
  "mamiya-op": mamiyaOp,
  "mammy-mart-holding": mammyMartHolding,
  mani: mani,
  mansei: mansei,
  marche: marche,
  marubun: marubun,
  "marufuji-sheet-piling": marufujiSheetPiling,
  "maruhachi-securities": maruhachiSecurities,
  "maruhachi-warehouse": maruhachiWarehouse,
  maruichi: maruichi,
  "maruken-lease": marukenLease,
  "marusan-securities": marusanSecurities,
  "maruto-sangyo": marutoSangyo,
  maruwn: maruwn,
  "maruyoshi-center": maruyoshiCenter,
  marvelous: marvelous,
  "matsuda-sangyo": matsudaSangyo,
  "matsui-securities": matsuiSecurities,
  matsumoto: matsumoto,
  matsuya: matsuya,
  "matsuya-foods-holdings": matsuyaFoodsHoldings,
  "matsuya-r-and-d": matsuyaRAndD,
  "maxvalu-tokai": maxvaluTokai,
  "media-research-institute": mediaResearchInstitute,
  medikit: medikit,
  "medipal-holdings": medipalHoldings,
  "meiho-enterprise": meihoEnterprise,
  "meiho-holdings": meihoHoldings,
  "meiji-shipping-group": meijiShippingGroup,
  "meiko-trans": meikoTrans,
  "meitec-group-holdings": meitecGroupHoldings,
  meiwa: meiwa,
  "meiwa-estate": meiwaEstate,
  "meiwa-industry": meiwaIndustry,
  menicon: menicon,
  "mental-health-technologies": mentalHealthTechnologies,
  "mercuria-holdings": mercuriaHoldings,
  metareal: metareal,
  metawater: metawater,
  micreed: micreed,
  microad: microad,
  "micron-machinery": micronMachinery,
  "microwave-chemical": microwaveChemical,
  "mirai-industry": miraiIndustry,
  "mirarth-holdings": mirarthHoldings,
  miroku: miroku,
  "miroku-jyoho-service": mirokuJyohoService,
  "misonoza-theatrical": misonozaTheatrical,
  misumi: misumi,
  "misumi-group": misumiGroup,
  mitani: mitani,
  "mitani-sangyo": mitaniSangyo,
  "mito-securities": mitoSecurities,
  "mitsubishi-estate": mitsubishiEstate,
  "mitsubishi-hc-capital": mitsubishiHcCapital,
  "mitsubishi-logistics": mitsubishiLogistics,
  "mitsubishi-pencil": mitsubishiPencil,
  "mitsubishi-shokuhin": mitsubishiShokuhin,
  "mitsui-o-s-k-lines": mitsuiOSKLines,
  "mitsui-soko-holdings": mitsuiSokoHoldings,
  "mitsumura-printing": mitsumuraPrinting,
  "mitsuuroko-group-holdings": mitsuurokoGroupHoldings,
  "mizuho-leasing": mizuhoLeasing,
  mizuno: mizuno,
  "monex-group": monexGroup,
  moonbat: moonbat,
  morito: morito,
  "mos-food-services": mosFoodServices,
  "mr-max-holdings": mrMaxHoldings,
  "mrk-holdings": mrkHoldings,
  "mt-genex": mtGenex,
  mtg: mtg,
  mti: mti,
  murakami: murakami,
  muraki: muraki,
  musashi: musashi,
  "musashino-kogyo": musashinoKogyo,
  "muto-seiko": mutoSeiko,
  "mutoh-holdings": mutohHoldings,
  nac: nac,
  nadex: nadex,
  nagahori: nagahori,
  nagaileben: nagaileben,
  "nagano-keiki": naganoKeiki,
  "nagase-and-co": nagaseAndCo,
  "nagase-brothers": nagaseBrothers,
  nagawa: nagawa,
  "nagoya-railroad": nagoyaRailroad,
  naigai: naigai,
  "naigai-trans-line": naigaiTransLine,
  "naito-and-co": naitoAndCo,
  nakabayashi: nakabayashi,
  "nakamichi-leasing": nakamichiLeasing,
  "nakamoto-packs": nakamotoPacks,
  "nakamura-choukou": nakamuraChoukou,
  "nakanihon-kogyo": nakanihonKogyo,
  nakanishi: nakanishi,
  nakayamafuku: nakayamafuku,
  nankai: nankai,
  "nankai-plywood": nankaiPlywood,
  nansin: nansin,
  nanyo: nanyo,
  "narasaki-sangyo": narasakiSangyo,
  "nareru-group": nareruGroup,
  "narumiya-international": narumiyaInternational,
  "natty-swanky-holdings": nattySwankyHoldings,
  "ncs-and-a": ncsAndA,
  "nec-capital-solutions": necCapitalSolutions,
  nepon: nepon,
  "net-protections-holdings": netProtectionsHoldings,
  "new-art-holdings": newArtHoldings,
  nice: nice,
  nichiden: nichiden,
  nichiha: nichiha,
  nichimo: nichimo,
  nichiryoku: nichiryoku,
  nifco: nifco,
  "nihon-decoluxe": nihonDecoluxe,
  "nihon-denkei": nihonDenkei,
  "nihon-flush": nihonFlush,
  "nihon-isk": nihonIsk,
  "nihon-plast": nihonPlast,
  "nihon-seimitsu": nihonSeimitsu,
  "niigata-kotsu": niigataKotsu,
  "nikken-kogaku": nikkenKogaku,
  "nikkon-holdings": nikkonHoldings,
  nippi: nippi,
  nippo: nippo,
  "nippon-bs-broadcasting": nipponBsBroadcasting,
  "nippon-concept": nipponConcept,
  "nippon-express-holdings": nipponExpressHoldings,
  "nippon-gas": nipponGas,
  "nippon-kanzai-holdings": nipponKanzaiHoldings,
  "nippon-seiki": nipponSeiki,
  "nippon-television-holdings": nipponTelevisionHoldings,
  "nippon-yusen-kabushiki-kaisha": nipponYusenKabushikiKaisha,
  nipro: nipro,
  "nishi-nippon-railroad": nishiNipponRailroad,
  "nishikawa-keisoku": nishikawaKeisoku,
  "nishimatsuya-chain": nishimatsuyaChain,
  nishimoto: nishimoto,
  "nishio-holdings": nishioHoldings,
  "nissan-tokyo-sales-holdings": nissanTokyoSalesHoldings,
  nissha: nissha,
  "nisshin-group-holdings": nisshinGroupHoldings,
  nissin: nissin,
  "nissin-shoji": nissinShoji,
  "nisso-holdings": nissoHoldings,
  "nitto-kohki": nittoKohki,
  nittoku: nittoku,
  "nj-holdings": njHoldings,
  noda: noda,
  nojima: nojima,
  "nomura-9716": nomura9716,
  "noritsu-koki": noritsuKoki,
  "north-pacific-bank": northPacificBank,
  novarese: novarese,
  "nozaki-insatsu-shigyo": nozakiInsatsuShigyo,
  "ns-tool": nsTool,
  "ns-united-kaiun-kaisha": nsUnitedKaiunKaisha,
  nsd: nsd,
  nsw: nsw,
  "ntt-data-group": nttDataGroup,
  "o-well": oWell,
  "odakyu-electric-railway": odakyuElectricRailway,
  "odawara-auto-machine-mfg": odawaraAutoMachineMfg,
  "odawara-engineering": odawaraEngineering,
  "ohashi-technica": ohashiTechnica,
  ohba: ohba,
  "ohsho-food-service": ohshoFoodService,
  "oie-sangyo": oieSangyo,
  "okamoto-glass": okamotoGlass,
  okamura: okamura,
  "okasan-securities-group": okasanSecuritiesGroup,
  "okaya-and-co": okayaAndCo,
  "okayamaken-freight-transportation": okayamakenFreightTransportation,
  "okinawa-cellular-telephone": okinawaCellularTelephone,
  "okinawa-financial-group": okinawaFinancialGroup,
  okuwa: okuwa,
  "olympic-group": olympicGroup,
  olympus: olympus,
  "om2-network": om2Network,
  ondeck: ondeck,
  onoken: onoken,
  "onward-holdings": onwardHoldings,
  "optimus-group": optimusGroup,
  orient: orient,
  orix: orix,
  orvis: orvis,
  "osaka-gas": osakaGas,
  "ota-floriculture-auction": otaFloricultureAuction,
  otake: otake,
  "oug-holdings": ougHoldings,
  oval: oval,
  oyo: oyo,
  ozu: ozu,
  paltac: paltac,
  "pan-pacific-international-holdings": panPacificInternationalHoldings,
  papanets: papanets,
  "paramount-bed-holdings": paramountBedHoldings,
  "paris-miki-holdings": parisMikiHoldings,
  parker: parker,
  pca: pca,
  people: people,
  "people-dreams-and-technologies-group": peopleDreamsAndTechnologiesGroup,
  "phyz-holdings": phyzHoldings,
  pigeon: pigeon,
  pilot: pilot,
  plant: plant,
  platz: platz,
  "plaza-holdings": plazaHoldings,
  poppins: poppins,
  "precision-system-science": precisionSystemScience,
  printnet: printnet,
  "procrea-holdings": procreaHoldings,
  progrit: progrit,
  projectholdings: projectholdings,
  pronexus: pronexus,
  puequ: puequ,
  "punch-industry": punchIndustry,
  qualtec: qualtec,
  "r-c-core": rCCore,
  "recovery-international": recoveryInternational,
  "refinverse-group": refinverseGroup,
  regal: regal,
  "relo-group": reloGroup,
  renova: renova,
  "retail-partners": retailPartners,
  retty: retty,
  revolution: revolution,
  "reyuu-japan": reyuuJapan,
  rhythm: rhythm,
  ricoh: ricoh,
  "ricoh-leasing": ricohLeasing,
  rikei: rikei,
  "riken-keiki": rikenKeiki,
  "ringer-hut": ringerHut,
  rinko: rinko,
  "rise-consulting-group": riseConsultingGroup,
  rix: rix,
  "rkb-mainichi-holdings": rkbMainichiHoldings,
  roland: roland,
  "royal-holdings": royalHoldings,
  ryoden: ryoden,
  "ryomo-systems": ryomoSystems,
  "sac-s-bar-holdings": sacSBarHoldings,
  saftec: saftec,
  "sagami-holdings": sagamiHoldings,
  "saibu-gas-holdings": saibuGasHoldings,
  "saison-technology": saisonTechnology,
  saizeriya: saizeriya,
  "sakae-electronics": sakaeElectronics,
  "sakai-holdings": sakaiHoldings,
  "sakai-moving-service": sakaiMovingService,
  "sakurajima-futo-kaisha": sakurajimaFutoKaisha,
  "san-ai-obbli": sanAiObbli,
  "san-holdings": sanHoldings,
  "san-ju-san-financial-group": sanJuSanFinancialGroup,
  sangetsu: sangetsu,
  "sanko-gosei": sankoGosei,
  "sanko-sangyo": sankoSangyo,
  "sankyo-frontier": sankyoFrontier,
  "sankyo-kasei": sankyoKasei,
  "sankyo-seiko": sankyoSeiko,
  sankyu: sankyu,
  sanrin: sanrin,
  sanrio: sanrio,
  sanritsu: sanritsu,
  "sanshin-electronics": sanshinElectronics,
  sanyei: sanyei,
  "sanyo-electric-railway": sanyoElectricRailway,
  "sanyo-shokai": sanyoShokai,
  "sapporo-clinical-laboratory": sapporoClinicalLaboratory,
  "sato-sho-ji": satoShoJi,
  "satoh-and-co": satohAndCo,
  "satori-electric": satoriElectric,
  "sbi-holdings": sbiHoldings,
  "sbi-insurance-group": sbiInsuranceGroup,
  "sbi-shinsei-bank": sbiShinseiBank,
  scroll: scroll,
  scsk: scsk,
  secom: secom,
  seed: seed,
  "seibu-holdings": seibuHoldings,
  seika: seika,
  "seiko-group": seikoGroup,
  "seino-holdings": seinoHoldings,
  "seiwa-chuo-holdings": seiwaChuoHoldings,
  "seiyu-kogyo": seiyuKogyo,
  seki: seki,
  sekichu: sekichu,
  sekido: sekido,
  "senko-group-holdings": senkoGroupHoldings,
  "senkon-logistics": senkonLogistics,
  "senshu-electric": senshuElectric,
  "senshu-ikeda-holdings": senshuIkedaHoldings,
  senshukai: senshukai,
  "serendip-holdings": serendipHoldings,
  "seven-bank": sevenBank,
  "seven-industries": sevenIndustries,
  seyfert: seyfert,
  "sg-holdings": sgHoldings,
  "shibusawa-logistics": shibusawaLogistics,
  "shigematsu-works": shigematsuWorks,
  shimamura: shimamura,
  shimano: shimano,
  shimojima: shimojima,
  "shingakukai-holdings": shingakukaiHoldings,
  "shinki-bus": shinkiBus,
  "shinko-shoji": shinkoShoji,
  shinsho: shinsho,
  "shinwa-7607": shinwa7607,
  "shizuoka-gas": shizuokaGas,
  shobido: shobido,
  "shobunsha-holdings": shobunshaHoldings,
  shochiku: shochiku,
  shoei: shoei,
  "shoei-9385": shoei9385,
  "shoei-foods": shoeiFoods,
  shofu: shofu,
  shokubun: shokubun,
  sigmakoki: sigmakoki,
  siix: siix,
  "silver-life": silverLife,
  "sinanen-holdings": sinanenHoldings,
  sincere: sincere,
  "sk-japan": skJapan,
  "sky-perfect-jsat": skyPerfectJsat,
  "skymark-airlines": skymarkAirlines,
  slogan: slogan,
  smartvalue: smartvalue,
  smn: smn,
  "soda-nikka": sodaNikka,
  "softbank-group": softbankGroup,
  sokensha: sokensha,
  solekia: solekia,
  solvvy: solvvy,
  somar: somar,
  sonocom: sonocom,
  "sony-financial-group": sonyFinancialGroup,
  "sotetsu-holdings": sotetsuHoldings,
  "sougou-shouken": sougouShouken,
  space: space,
  "sparx-group": sparxGroup,
  spk: spk,
  "square-enix-holdings": squareEnixHoldings,
  "srs-holdings": srsHoldings,
  "star-micronics": starMicronics,
  starts: starts,
  "starts-publishing": startsPublishing,
  starzen: starzen,
  step: step,
  striders: striders,
  "subaru-9778": subaru9778,
  "subaru-enterprise": subaruEnterprise,
  succeed: succeed,
  "sugi-holdings": sugiHoldings,
  "sugimoto-and-co": sugimotoAndCo,
  "sugimura-warehouse": sugimuraWarehouse,
  "sugita-ace": sugitaAce,
  "sukegawa-electric": sukegawaElectric,
  sumasapo: sumasapo,
  "sumitomo-mitsui-trust-group": sumitomoMitsuiTrustGroup,
  "sun-frontier-fudousan": sunFrontierFudousan,
  "sun-messe": sunMesse,
  "sun-wa-technos": sunWaTechnos,
  sunautas: sunautas,
  sunday: sunday,
  sundrug: sundrug,
  "sunnexta-group": sunnextaGroup,
  sunwels: sunwels,
  "suruga-bank": surugaBank,
  suzuden: suzuden,
  suzuken: suzuken,
  "suzuyo-shinwart": suzuyoShinwart,
  "syla-holdings": sylaHoldings,
  systemsoft: systemsoft,
  "t-kawabe-and-co": tKawabeAndCo,
  "t-o-holdings": tOHoldings,
  "tachibana-eletech": tachibanaEletech,
  tachikawa: tachikawa,
  "taiheiyo-kouhatsu": taiheiyoKouhatsu,
  "taiho-transportation": taihoTransportation,
  "taiyo-bussan-kaisha": taiyoBussanKaisha,
  takachiho: takachiho,
  "takamatsu-machinery": takamatsuMachinery,
  takano: takano,
  "takara-and-company": takaraAndCompany,
  "takara-standard": takaraStandard,
  takase: takase,
  "takashima-and-co": takashimaAndCo,
  takashimaya: takashimaya,
  takasho: takasho,
  "takayoshi-holdings": takayoshiHoldings,
  takebishi: takebishi,
  "takeda-ip-holdings": takedaIpHoldings,
  "takeda-machinery": takedaMachinery,
  takihyo: takihyo,
  "tamai-steamship": tamaiSteamship,
  tameny: tameny,
  tamron: tamron,
  "tanabe-consulting-group": tanabeConsultingGroup,
  tanaka: tanaka,
  tanseisha: tanseisha,
  "tay-two": tayTwo,
  "tbs-holdings": tbsHoldings,
  "ten-allied": tenAllied,
  tenma: tenma,
  "tenmaya-store": tenmayaStore,
  "terminalcare-support-institute": terminalcareSupportInstitute,
  "the-77-bank": the77Bank,
  "the-akita-bank": theAkitaBank,
  "the-awa-bank": theAwaBank,
  "the-bank-of-iwate": theBankOfIwate,
  "the-bank-of-nagoya": theBankOfNagoya,
  "the-bank-of-saga": theBankOfSaga,
  "the-bank-of-toyama": theBankOfToyama,
  "the-chiba-bank": theChibaBank,
  "the-chiba-kogyo-bank": theChibaKogyoBank,
  "the-chikuho-bank": theChikuhoBank,
  "the-daito-bank": theDaitoBank,
  "the-ehime-bank": theEhimeBank,
  "the-fukui-bank": theFukuiBank,
  "the-fukushima-bank": theFukushimaBank,
  "the-gunma-bank": theGunmaBank,
  "the-hyakugo-bank": theHyakugoBank,
  "the-hyakujushi-bank": theHyakujushiBank,
  "the-keihin": theKeihin,
  "the-keiyo-bank": theKeiyoBank,
  "the-kita-nippon-bank": theKitaNipponBank,
  "the-kiyo-bank": theKiyoBank,
  "the-kyoto-hotel": theKyotoHotel,
  "the-miyazaki-bank": theMiyazakiBank,
  "the-musashino-bank": theMusashinoBank,
  "the-nanto-bank": theNantoBank,
  "the-ogaki-kyoritsu-bank": theOgakiKyoritsuBank,
  "the-oita-bank": theOitaBank,
  "the-royal-hotel": theRoyalHotel,
  "the-sailor-pen": theSailorPen,
  "the-san-in-godo-bank": theSanInGodoBank,
  "the-shiga-bank": theShigaBank,
  "the-shikoku-bank": theShikokuBank,
  "the-shimizu-bank": theShimizuBank,
  "the-sumitomo-warehouse": theSumitomoWarehouse,
  "the-taiko-bank": theTaikoBank,
  "the-tochigi-bank": theTochigiBank,
  "the-toho-bank": theTohoBank,
  "the-tohoku-bank": theTohokuBank,
  "the-tottori-bank": theTottoriBank,
  "the-towa-bank": theTowaBank,
  "the-yamagata-bank": theYamagataBank,
  "the-yamanashi-chuo-bank": theYamanashiChuoBank,
  "the-yonkyu": theYonkyu,
  tiemco: tiemco,
  tkc: tkc,
  toba: toba,
  "tobu-railway": tobuRailway,
  toc: toc,
  toei: toei,
  "tohbu-network": tohbuNetwork,
  toho: toho,
  "toho-gas": tohoGas,
  "toho-holdings": tohoHoldings,
  "toho-lamac": tohoLamac,
  "tohoku-chemical": tohokuChemical,
  "tohoku-electric-power": tohokuElectricPower,
  toin: toin,
  tokai: tokai,
  "tokai-electronics": tokaiElectronics,
  "tokai-kisen": tokaiKisen,
  "tokai-lease": tokaiLease,
  "tokai-tokyo-financial-holdings": tokaiTokyoFinancialHoldings,
  "tokyo-century": tokyoCentury,
  "tokyo-communications-group": tokyoCommunicationsGroup,
  "tokyo-gas": tokyoGas,
  "tokyo-kaikan": tokyoKaikan,
  "tokyo-keiki": tokyoKeiki,
  "tokyo-kisen": tokyoKisen,
  "tokyo-koki": tokyoKoki,
  "tokyo-metro": tokyoMetro,
  "tokyo-sangyo": tokyoSangyo,
  "tokyo-seimitsu": tokyoSeimitsu,
  "tokyo-soir": tokyoSoir,
  "tokyo-theatres": tokyoTheatres,
  tokyotokeiba: tokyotokeiba,
  tokyu: tokyu,
  toli: toli,
  "tomato-bank": tomatoBank,
  tomita: tomita,
  "tomony-holdings": tomonyHoldings,
  tomy: tomy,
  "top-culture": topCulture,
  topcon: topcon,
  "toppan-holdings": toppanHoldings,
  toridori: toridori,
  torq: torq,
  tosei: tosei,
  "toshin-holdings": toshinHoldings,
  tosho: tosho,
  totech: totech,
  totenko: totenko,
  toyo: toyo,
  "toyo-logistics": toyoLogistics,
  "toyo-securities": toyoSecurities,
  "toyo-tec": toyoTec,
  "toyo-wharf-and-warehouse": toyoWharfAndWarehouse,
  "toyoda-gosei": toyodaGosei,
  "toyota-tsusho": toyotaTsusho,
  "traders-holdings": tradersHoldings,
  transaction: transaction,
  transcosmos: transcosmos,
  "tre-holdings": treHoldings,
  "trusco-nakayama": truscoNakayama,
  "ts-tech": tsTech,
  "tsubakimoto-kogyo": tsubakimotoKogyo,
  tsukamoto: tsukamoto,
  "tsukiji-uoichiba": tsukijiUoichiba,
  "tsukuba-bank": tsukubaBank,
  "tsutsumi-jewelry": tsutsumiJewelry,
  "tsuzuki-denki": tsuzukiDenki,
  "tv-asahi-holdings": tvAsahiHoldings,
  "tv-tokyo-holdings": tvTokyoHoldings,
  "twostone-and-sons": twostoneAndSons,
  "u-next-holdings": uNextHoldings,
  "uchida-yoko": uchidaYoko,
  "uematsu-shokai": uematsuShokai,
  uex: uex,
  ukai: ukai,
  unbanked: unbanked,
  unicharm: unicharm,
  "united-arrows": unitedArrows,
  uoriki: uoriki,
  "ureru-net-advertising-group": ureruNetAdvertisingGroup,
  "v-technology": vTechnology,
  "valor-holdings": valorHoldings,
  valqua: valqua,
  "value-creation": valueCreation,
  "valuence-holdings": valuenceHoldings,
  verite: verite,
  "via-holdings": viaHoldings,
  vision: vision,
  "vt-holdings": vtHoldings,
  "w-tokyo": wTokyo,
  wa: wa,
  wadakohsan: wadakohsan,
  wagokoro: wagokoro,
  "waida-mfg": waidaMfg,
}).map(([file, data]) => parseContent(companySchema, data, `src/data/companies/${file}.json`));
