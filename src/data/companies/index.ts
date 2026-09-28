import { parseContent, companySchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import advantest from "./advantest.json";
import aeon from "./aeon.json";
import agc from "./agc.json";
import aisin from "./aisin.json";
import ajinomoto from "./ajinomoto.json";
import akatsukiEazima from "./akatsuki-eazima.json";
import akikawaFoodsAndFarms from "./akikawa-foods-and-farms.json";
import alsok from "./alsok.json";
import amitaHoldings from "./amita-holdings.json";
import anaHoldings from "./ana-holdings.json";
import arbeitTimes from "./arbeit-times.json";
import artner from "./artner.json";
import asPartners from "./as-partners.json";
import asahiGroupHoldings from "./asahi-group-holdings.json";
import asahiKasei from "./asahi-kasei.json";
import asahiKogyosha from "./asahi-kogyosha.json";
import asanuma from "./asanuma.json";
import asj from "./asj.json";
import astellasPharma from "./astellas-pharma.json";
import astroscaleHoldings from "./astroscale-holdings.json";
import axyz from "./axyz.json";
import bergEarth from "./berg-earth.json";
import besterra from "./besterra.json";
import bourbon from "./bourbon.json";
import brHoldings from "./br-holdings.json";
import brass from "./brass.json";
import cados from "./cados.json";
import caicaDigital from "./caica-digital.json";
import calbee from "./calbee.json";
import candeal from "./candeal.json";
import canon from "./canon.json";
import careService from "./care-service.json";
import careTwentyone from "./care-twentyone.json";
import careerDesignCenter from "./career-design-center.json";
import carenet from "./carenet.json";
import caulis from "./caulis.json";
import cds from "./cds.json";
import centralJapanRailway from "./central-japan-railway.json";
import chiikishinbunsha from "./chiikishinbunsha.json";
import chubushiryo from "./chubushiryo.json";
import chuco from "./chuco.json";
import chudenko from "./chudenko.json";
import chugaiMining from "./chugai-mining.json";
import chugaiPharmaceutical from "./chugai-pharmaceutical.json";
import chugaiRo from "./chugai-ro.json";
import cmc from "./cmc.json";
import cocolive from "./cocolive.json";
import columbiaWorks from "./columbia-works.json";
import como from "./como.json";
import comsysHoldings from "./comsys-holdings.json";
import cookpad from "./cookpad.json";
import core from "./core.json";
import crooz from "./crooz.json";
import crossCat from "./cross-cat.json";
import crossEHoldings from "./cross-e-holdings.json";
import cssHoldings from "./css-holdings.json";
import cubeSystem from "./cube-system.json";
import cyberagent from "./cyberagent.json";
import dAndM from "./d-and-m.json";
import daiDan from "./dai-dan.json";
import daiIchiCutterKogyo from "./dai-ichi-cutter-kogyo.json";
import daiIchiLifeHoldings from "./dai-ichi-life-holdings.json";
import daiho from "./daiho.json";
import daiichiKensetsu from "./daiichi-kensetsu.json";
import daiichiSankyo from "./daiichi-sankyo.json";
import daikinIndustries from "./daikin-industries.json";
import daisekiEcoSolution from "./daiseki-eco-solution.json";
import daisueConstruction from "./daisue-construction.json";
import daitoTrustConstruction from "./daito-trust-construction.json";
import daiwaHouseIndustry from "./daiwa-house-industry.json";
import dawn from "./dawn.json";
import dena from "./dena.json";
import denso from "./denso.json";
import dentsuGroup from "./dentsu-group.json";
import digitalArts from "./digital-arts.json";
import digitalHoldings from "./digital-holdings.json";
import dip from "./dip.json";
import disco from "./disco.json";
import dive from "./dive.json";
import dowaHoldings from "./dowa-holdings.json";
import eastJapanRailway from "./east-japan-railway.json";
import ejHoldings from "./ej-holdings.json";
import eneosHoldings from "./eneos-holdings.json";
import ensuikoSugarRefining from "./ensuiko-sugar-refining.json";
import eole from "./eole.json";
import epco from "./epco.json";
import exeoGroup from "./exeo-group.json";
import ezakiGlico from "./ezaki-glico.json";
import faber from "./faber.json";
import fantasista from "./fantasista.json";
import fanuc from "./fanuc.json";
import fastRetailing from "./fast-retailing.json";
import feedOne from "./feed-one.json";
import firstBaking from "./first-baking.json";
import firstCorporation from "./first-corporation.json";
import fitEasy from "./fit-easy.json";
import fonfun from "./fonfun.json";
import forside from "./forside.json";
import fronteo from "./fronteo.json";
import fudoTetra from "./fudo-tetra.json";
import fujiElectric from "./fuji-electric.json";
import fujiJapan from "./fuji-japan.json";
import fujiNihon from "./fuji-nihon.json";
import fujiPS from "./fuji-p-s.json";
import fujifilmHoldings from "./fujifilm-holdings.json";
import fujikura from "./fujikura.json";
import fujitaEngineering from "./fujita-engineering.json";
import fujitsu from "./fujitsu.json";
import fujiya from "./fujiya.json";
import fukuda from "./fukuda.json";
import fukutomeMeatPackers from "./fukutome-meat-packers.json";
import gakujo from "./gakujo.json";
import gendaiAgency from "./gendai-agency.json";
import gifuLandscapeArchitect from "./gifu-landscape-architect.json";
import gigWorks from "./gig-works.json";
import gikenHoldings from "./giken-holdings.json";
import gniGroup from "./gni-group.json";
import gokurakuyuHoldings from "./gokurakuyu-holdings.json";
import greenMonster from "./green-monster.json";
import greenenergyAndCompany from "./greenenergy-and-company.json";
import hakuten from "./hakuten.json";
import hammock from "./hammock.json";
import haseko from "./haseko.json";
import hatchWork from "./hatch-work.json";
import hayashikaneSangyo from "./hayashikane-sangyo.json";
import hazamaAndo from "./hazama-ando.json";
import heartseed from "./heartseed.json";
import heianCeremonyService from "./heian-ceremony-service.json";
import hibiyaEngineering from "./hibiya-engineering.json";
import higashimaru from "./higashimaru.json";
import hikariFoodService from "./hikari-food-service.json";
import hikariHeightsVarus from "./hikari-heights-varus.json";
import hip from "./hip.json";
import hitachi from "./hitachi.json";
import hob from "./hob.json";
import hokkaidenko from "./hokkaidenko.json";
import hokurikuElectricalConstruction from "./hokuriku-electrical-construction.json";
import hokuryo from "./hokuryo.json";
import hokuto from "./hokuto.json";
import honda from "./honda.json";
import humanHoldings from "./human-holdings.json";
import ichigo from "./ichigo.json";
import ichiken from "./ichiken.json";
import ihi from "./ihi.json";
import ikkHoldings from "./ikk-holdings.json";
import imurayaGroup from "./imuraya-group.json";
import informationStrategyAndTechnology from "./information-strategy-and-technology.json";
import inpex from "./inpex.json";
import insight from "./insight.json";
import integroup from "./integroup.json";
import interlifeHoldings from "./interlife-holdings.json";
import interspace from "./interspace.json";
import ishin from "./ishin.json";
import isuzuMotors from "./isuzu-motors.json";
import itamiarts from "./itamiarts.json";
import itmedia from "./itmedia.json";
import itochu from "./itochu.json";
import itohamYonekyuHoldings from "./itoham-yonekyu-holdings.json";
import iwatsukaConfectionery from "./iwatsuka-confectionery.json";
import jacRecruitment from "./jac-recruitment.json";
import japanFoundationEngineering from "./japan-foundation-engineering.json";
import japanPetroleumExploration from "./japan-petroleum-exploration.json";
import jdc from "./jdc.json";
import jescoHoldings from "./jesco-holdings.json";
import jfeHoldings from "./jfe-holdings.json";
import jgcHoldings from "./jgc-holdings.json";
import jinjib from "./jinjib.json";
import jsh from "./jsh.json";
import kAndAmpOEnergyGroup from "./k-and-amp-o-energy-group.json";
import kajima from "./kajima.json";
import kakakuCom from "./kakaku-com.json";
import kakiyasuHonten from "./kakiyasu-honten.json";
import kamedaSeika from "./kameda-seika.json";
import kandaTsushinki from "./kanda-tsushinki.json";
import kandenko from "./kandenko.json";
import kanekoSeeds from "./kaneko-seeds.json";
import kanro from "./kanro.json";
import kawasakiHeavyIndustries from "./kawasaki-heavy-industries.json";
import kddi from "./kddi.json";
import keyence from "./keyence.json";
import kgIntelligence from "./kg-intelligence.json";
import kikkoman from "./kikkoman.json";
import kinden from "./kinden.json";
import kitahamaCapitalPartners from "./kitahama-capital-partners.json";
import kitanoConstruction from "./kitano-construction.json";
import koatsuKogyo from "./koatsu-kogyo.json";
import kobeSteel from "./kobe-steel.json";
import kohjinBio from "./kohjin-bio.json";
import koikeYa from "./koike-ya.json";
import komatsu from "./komatsu.json";
import koshidakaHoldings from "./koshidaka-holdings.json";
import kotobukiSpirits from "./kotobuki-spirits.json";
import kozoKeikakuEngineeringHoldings from "./kozo-keikaku-engineering-holdings.json";
import kraftia from "./kraftia.json";
import kubota from "./kubota.json";
import kudo from "./kudo.json";
import kumagaiGumi from "./kumagai-gumi.json";
import kuraray from "./kuraray.json";
import kushim from "./kushim.json";
import kyocera from "./kyocera.json";
import kyokuto from "./kyokuto.json";
import kyokuyo from "./kyokuyo.json";
import kyowanissei from "./kyowanissei.json";
import lIsB from "./l-is-b.json";
import lasertec from "./lasertec.json";
import libWork from "./lib-work.json";
import liberaware from "./liberaware.json";
import lifull from "./lifull.json";
import linical from "./linical.json";
import linkAndMotivation from "./link-and-motivation.json";
import logosHoldings from "./logos-holdings.json";
import m3 from "./m3.json";
import marubeni from "./marubeni.json";
import mazda from "./mazda.json";
import mitsubishiChemicalGroup from "./mitsubishi-chemical-group.json";
import mitsubishiCorporation from "./mitsubishi-corporation.json";
import mitsubishiElectric from "./mitsubishi-electric.json";
import mitsubishiMotors from "./mitsubishi-motors.json";
import mitsubishiUfjFinancialGroup from "./mitsubishi-ufj-financial-group.json";
import mitsuiAndCo from "./mitsui-and-co.json";
import mitsuiFudosan from "./mitsui-fudosan.json";
import mizuhoFinancialGroup from "./mizuho-financial-group.json";
import murataManufacturing from "./murata-manufacturing.json";
import nec from "./nec.json";
import nikon from "./nikon.json";
import nintendo from "./nintendo.json";
import nipponSteel from "./nippon-steel.json";
import nissan from "./nissan.json";
import nissinFoodsHoldings from "./nissin-foods-holdings.json";
import nissui from "./nissui.json";
import nitoriHoldings from "./nitori-holdings.json";
import nomuraHoldings from "./nomura-holdings.json";
import ntt from "./ntt.json";
import panasonicHoldings from "./panasonic-holdings.json";
import rakutenGroup from "./rakuten-group.json";
import renesasElectronics from "./renesas-electronics.json";
import rohm from "./rohm.json";
import ryohinKeikaku from "./ryohin-keikaku.json";
import screenHoldings from "./screen-holdings.json";
import sevenAndIHoldings from "./seven-and-i-holdings.json";
import shimizu from "./shimizu.json";
import shinEtsuChemical from "./shin-etsu-chemical.json";
import smc from "./smc.json";
import socionext from "./socionext.json";
import softbank from "./softbank.json";
import sonyGroup from "./sony-group.json";
import subaru from "./subaru.json";
import sumitomoChemical from "./sumitomo-chemical.json";
import sumitomoCorporation from "./sumitomo-corporation.json";
import sumitomoMitsuiFinancialGroup from "./sumitomo-mitsui-financial-group.json";
import sumitomoRealtyAndDevelopment from "./sumitomo-realty-and-development.json";
import suzuki from "./suzuki.json";
import taisei from "./taisei.json";
import taiyoYuden from "./taiyo-yuden.json";
import takedaPharmaceutical from "./takeda-pharmaceutical.json";
import tdk from "./tdk.json";
import tokioMarineHoldings from "./tokio-marine-holdings.json";
import tokyoElectron from "./tokyo-electron.json";
import toyota from "./toyota.json";
import yamahaMotor from "./yamaha-motor.json";
import yamatoHoldings from "./yamato-holdings.json";
import zozo from "./zozo.json";

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
}).map(([file, data]) => parseContent(companySchema, data, `src/data/companies/${file}.json`));
