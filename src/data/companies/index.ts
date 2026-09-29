import { parseContent, companySchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import aDWorksGroup from "./a-d-works-group.json";
import abcMart from "./abc-mart.json";
import advantest from "./advantest.json";
import adways from "./adways.json";
import aeon from "./aeon.json";
import aeonKyushu from "./aeon-kyushu.json";
import afcHdAmsLifeScience from "./afc-hd-ams-life-science.json";
import agc from "./agc.json";
import ahjikan from "./ahjikan.json";
import aiFusionCapitalGroup from "./ai-fusion-capital-group.json";
import aiHoldings from "./ai-holdings.json";
import aiRobotics from "./ai-robotics.json";
import aisin from "./aisin.json";
import ajinomoto from "./ajinomoto.json";
import akatsukiEazima from "./akatsuki-eazima.json";
import akikawaFoodsAndFarms from "./akikawa-foods-and-farms.json";
import alconix from "./alconix.json";
import alfresaHoldings from "./alfresa-holdings.json";
import allAbout from "./all-about.json";
import alpen from "./alpen.json";
import alsok from "./alsok.json";
import alt from "./alt.json";
import amitaHoldings from "./amita-holdings.json";
import amiyakiTei from "./amiyaki-tei.json";
import anaHoldings from "./ana-holdings.json";
import andStHd from "./and-st-hd.json";
import aobaBbt from "./aoba-bbt.json";
import aohata from "./aohata.json";
import appleInternational from "./apple-international.json";
import applied from "./applied.json";
import arata from "./arata.json";
import arbeitTimes from "./arbeit-times.json";
import ariakeJapan from "./ariake-japan.json";
import arrPlanner from "./arr-planner.json";
import artner from "./artner.json";
import asPartners from "./as-partners.json";
import asahiGroupHoldings from "./asahi-group-holdings.json";
import asahiKasei from "./asahi-kasei.json";
import asahiKogyosha from "./asahi-kogyosha.json";
import asahimatsuFoods from "./asahimatsu-foods.json";
import asanuma from "./asanuma.json";
import asj from "./asj.json";
import askul from "./askul.json";
import asmo from "./asmo.json";
import astellasPharma from "./astellas-pharma.json";
import astroscaleHoldings from "./astroscale-holdings.json";
import asua from "./asua.json";
import aunConsulting from "./aun-consulting.json";
import autowave from "./autowave.json";
import axyz from "./axyz.json";
import azearth from "./azearth.json";
import bStyleHoldings from "./b-style-holdings.json";
import banners from "./banners.json";
import baseFood from "./base-food.json";
import beautyKadanHoldings from "./beauty-kadan-holdings.json";
import bergEarth from "./berg-earth.json";
import besterra from "./besterra.json";
import bicCamera from "./bic-camera.json";
import bourbon from "./bourbon.json";
import brHoldings from "./br-holdings.json";
import brass from "./brass.json";
import broncoBilly from "./bronco-billy.json";
import bruno from "./bruno.json";
import bullDogSauce from "./bull-dog-sauce.json";
import cados from "./cados.json";
import caicaDigital from "./caica-digital.json";
import calbee from "./calbee.json";
import canDo from "./can-do.json";
import candeal from "./candeal.json";
import canon from "./canon.json";
import careService from "./care-service.json";
import careTwentyone from "./care-twentyone.json";
import careerDesignCenter from "./career-design-center.json";
import carenet from "./carenet.json";
import caulis from "./caulis.json";
import cawachi from "./cawachi.json";
import ccrebAdvisors from "./ccreb-advisors.json";
import cds from "./cds.json";
import cedar from "./cedar.json";
import centralJapanRailway from "./central-japan-railway.json";
import chiikishinbunsha from "./chiikishinbunsha.json";
import choei from "./choei.json";
import chordiaTherapeutics from "./chordia-therapeutics.json";
import choushimaru from "./choushimaru.json";
import chubushiryo from "./chubushiryo.json";
import chuco from "./chuco.json";
import chudenko from "./chudenko.json";
import chugaiMining from "./chugai-mining.json";
import chugaiPharmaceutical from "./chugai-pharmaceutical.json";
import chugaiRo from "./chugai-ro.json";
import cmc from "./cmc.json";
import cocaColaBottlersJapanHoldings from "./coca-cola-bottlers-japan-holdings.json";
import cocolive from "./cocolive.json";
import columbiaWorks from "./columbia-works.json";
import como from "./como.json";
import comsysHoldings from "./comsys-holdings.json";
import cookpad from "./cookpad.json";
import core from "./core.json";
import creal from "./creal.json";
import create from "./create.json";
import createSdHoldings from "./create-sd-holdings.json";
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
import daieisangyo from "./daieisangyo.json";
import daiho from "./daiho.json";
import daiichiKensetsu from "./daiichi-kensetsu.json";
import daiichiSankyo from "./daiichi-sankyo.json";
import daikinIndustries from "./daikin-industries.json";
import daikokutenbussan from "./daikokutenbussan.json";
import dairei from "./dairei.json";
import daisekiEcoSolution from "./daiseki-eco-solution.json";
import daisho from "./daisho.json";
import daisueConstruction from "./daisue-construction.json";
import daitoTrustConstruction from "./daito-trust-construction.json";
import daiwaHouseIndustry from "./daiwa-house-industry.json";
import daiwaboHoldings from "./daiwabo-holdings.json";
import dawn from "./dawn.json";
import dcmHoldings from "./dcm-holdings.json";
import delsole from "./delsole.json";
import demaeCan from "./demae-can.json";
import dena from "./dena.json";
import denso from "./denso.json";
import dentsuGroup from "./dentsu-group.json";
import digitalArts from "./digital-arts.json";
import digitalHoldings from "./digital-holdings.json";
import dip from "./dip.json";
import disco from "./disco.json";
import dive from "./dive.json";
import doutorNichiresHoldings from "./doutor-nichires-holdings.json";
import dowaHoldings from "./dowa-holdings.json";
import dydoGroupHoldings from "./dydo-group-holdings.json";
import eSupportlink from "./e-supportlink.json";
import eastJapanRailway from "./east-japan-railway.json";
import eatAndHoldings from "./eat-and-holdings.json";
import ebaraFoodsIndustry from "./ebara-foods-industry.json";
import econos from "./econos.json";
import edion from "./edion.json";
import ejHoldings from "./ej-holdings.json";
import eneosHoldings from "./eneos-holdings.json";
import ensuikoSugarRefining from "./ensuiko-sugar-refining.json";
import eole from "./eole.json";
import epco from "./epco.json";
import etsGroup from "./ets-group.json";
import eucalia from "./eucalia.json";
import euglena from "./euglena.json";
import exeoGroup from "./exeo-group.json";
import ezakiGlico from "./ezaki-glico.json";
import faber from "./faber.json";
import fanCommunications from "./fan-communications.json";
import fantasista from "./fantasista.json";
import fanuc from "./fanuc.json";
import fastRetailing from "./fast-retailing.json";
import feedOne from "./feed-one.json";
import festariaHoldings from "./festaria-holdings.json";
import firstBaking from "./first-baking.json";
import firstCorporation from "./first-corporation.json";
import fitEasy from "./fit-easy.json";
import fonfun from "./fonfun.json";
import forcia from "./forcia.json";
import forside from "./forside.json";
import fronteo from "./fronteo.json";
import frutaFruta from "./fruta-fruta.json";
import ftgroup from "./ftgroup.json";
import fudoTetra from "./fudo-tetra.json";
import fujiElectric from "./fuji-electric.json";
import fujiJapan from "./fuji-japan.json";
import fujiNihon from "./fuji-nihon.json";
import fujiOil from "./fuji-oil.json";
import fujiPS from "./fuji-p-s.json";
import fujiboHoldings from "./fujibo-holdings.json";
import fujicco from "./fujicco.json";
import fujifilmHoldings from "./fujifilm-holdings.json";
import fujikura from "./fujikura.json";
import fujioFoodGroup from "./fujio-food-group.json";
import fujisanMagazineService from "./fujisan-magazine-service.json";
import fujitaEngineering from "./fujita-engineering.json";
import fujitsu from "./fujitsu.json";
import fujiya from "./fujiya.json";
import fukuda from "./fukuda.json";
import fukutomeMeatPackers from "./fukutome-meat-packers.json";
import fundely from "./fundely.json";
import gakujo from "./gakujo.json";
import garden from "./garden.json";
import gendaiAgency from "./gendai-agency.json";
import geoHoldings from "./geo-holdings.json";
import geoliveGroup from "./geolive-group.json";
import gifuLandscapeArchitect from "./gifu-landscape-architect.json";
import gigWorks from "./gig-works.json";
import gikenHoldings from "./giken-holdings.json";
import globeIng from "./globe-ing.json";
import gltechnoHoldings from "./gltechno-holdings.json";
import gniGroup from "./gni-group.json";
import gokurakuyuHoldings from "./gokurakuyu-holdings.json";
import golfDo from "./golf-do.json";
import goodLife from "./good-life.json";
import greenCrossHoldings from "./green-cross-holdings.json";
import greenMonster from "./green-monster.json";
import greenenergyAndCompany from "./greenenergy-and-company.json";
import grems from "./grems.json";
import growthXpartners from "./growth-xpartners.json";
import gunze from "./gunze.json";
import gurunavi from "./gurunavi.json";
import gvaTech from "./gva-tech.json";
import hagoromoFoods from "./hagoromo-foods.json";
import hakuhodoDyHoldings from "./hakuhodo-dy-holdings.json";
import hakuten from "./hakuten.json";
import halows from "./halows.json";
import hamee from "./hamee.json";
import hammock from "./hammock.json";
import hanwaHomeS from "./hanwa-home-s.json";
import hardOff from "./hard-off.json";
import haseko from "./haseko.json";
import hatchWork from "./hatch-work.json";
import hayashikaneSangyo from "./hayashikane-sangyo.json";
import hazamaAndo from "./hazama-ando.json";
import heartseed from "./heartseed.json";
import heianCeremonyService from "./heian-ceremony-service.json";
import hibino from "./hibino.json";
import hibiyaEngineering from "./hibiya-engineering.json";
import higashimaru from "./higashimaru.json";
import hikariFoodService from "./hikari-food-service.json";
import hikariHeightsVarus from "./hikari-heights-varus.json";
import hip from "./hip.json";
import hiraki from "./hiraki.json";
import hiramatsu from "./hiramatsu.json";
import hitachi from "./hitachi.json";
import hmcomm from "./hmcomm.json";
import hob from "./hob.json";
import hokkaidenko from "./hokkaidenko.json";
import hokkaidoCocaColaBottling from "./hokkaido-coca-cola-bottling.json";
import hokurikuElectricalConstruction from "./hokuriku-electrical-construction.json";
import hokuryo from "./hokuryo.json";
import hokuto from "./hokuto.json";
import hokuyakuTakeyamaHoldings from "./hokuyaku-takeyama-holdings.json";
import hokuyuLucky from "./hokuyu-lucky.json";
import homePosition from "./home-position.json";
import honda from "./honda.json";
import honeysHoldings from "./honeys-holdings.json";
import honyakuCenter from "./honyaku-center.json";
import houseFoodsGroup from "./house-foods-group.json";
import hub from "./hub.json";
import hulic from "./hulic.json";
import humanHoldings from "./human-holdings.json";
import hyper from "./hyper.json";
import ichigo from "./ichigo.json";
import ichiken from "./ichiken.json";
import ichimasaKamaboko from "./ichimasa-kamaboko.json";
import ifujiSangyo from "./ifuji-sangyo.json";
import ihi from "./ihi.json";
import ikHoldings from "./ik-holdings.json";
import ikkHoldings from "./ikk-holdings.json";
import imurayaGroup from "./imuraya-group.json";
import infomart from "./infomart.json";
import informationStrategyAndTechnology from "./information-strategy-and-technology.json";
import informetis from "./informetis.json";
import ings from "./ings.json";
import inpex from "./inpex.json";
import insight from "./insight.json";
import integroup from "./integroup.json";
import interlifeHoldings from "./interlife-holdings.json";
import intermestic from "./intermestic.json";
import interspace from "./interspace.json";
import isetanMitsukoshiHoldings from "./isetan-mitsukoshi-holdings.json";
import ishiiFood from "./ishii-food.json";
import ishin from "./ishin.json";
import isuzuMotors from "./isuzu-motors.json";
import itamiarts from "./itamiarts.json";
import itmedia from "./itmedia.json";
import itoEn from "./ito-en.json";
import itochu from "./itochu.json";
import itochuShokuhin from "./itochu-shokuhin.json";
import itohamYonekyuHoldings from "./itoham-yonekyu-holdings.json";
import iwatsukaConfectionery from "./iwatsuka-confectionery.json";
import jFrontRetailing from "./j-front-retailing.json";
import jFrontier from "./j-frontier.json";
import jHoldings from "./j-holdings.json";
import jOilMills from "./j-oil-mills.json";
import jacRecruitment from "./jac-recruitment.json";
import japanFoundationEngineering from "./japan-foundation-engineering.json";
import japanPetroleumExploration from "./japan-petroleum-exploration.json";
import japanTobacco from "./japan-tobacco.json";
import jason from "./jason.json";
import jbEleven from "./jb-eleven.json";
import jdc from "./jdc.json";
import jellyBeansGroup from "./jelly-beans-group.json";
import jescoHoldings from "./jesco-holdings.json";
import jfeHoldings from "./jfe-holdings.json";
import jflaHoldings from "./jfla-holdings.json";
import jgcHoldings from "./jgc-holdings.json";
import jinjib from "./jinjib.json";
import jinsHoldings from "./jins-holdings.json";
import jpHoldings from "./jp-holdings.json";
import jsh from "./jsh.json";
import jtec from "./jtec.json";
import jtp from "./jtp.json";
import kAndAmpOEnergyGroup from "./k-and-amp-o-energy-group.json";
import kUno from "./k-uno.json";
import kadoyaSesameMills from "./kadoya-sesame-mills.json";
import kagome from "./kagome.json";
import kaihan from "./kaihan.json";
import kajima from "./kajima.json";
import kakakuCom from "./kakaku-com.json";
import kakiyasuHonten from "./kakiyasu-honten.json";
import kamedaSeika from "./kameda-seika.json";
import kandaTsushinki from "./kanda-tsushinki.json";
import kandenko from "./kandenko.json";
import kanekoSeeds from "./kaneko-seeds.json";
import kanemi from "./kanemi.json";
import kanro from "./kanro.json";
import karula from "./karula.json";
import katakuraIndustries from "./katakura-industries.json";
import kawasakiAndCo from "./kawasaki-and-co.json";
import kawasakiHeavyIndustries from "./kawasaki-heavy-industries.json";
import kawasakiSetsubiKogyo from "./kawasaki-setsubi-kogyo.json";
import kddi from "./kddi.json";
import kenkoMayonnaise from "./kenko-mayonnaise.json";
import kewpie from "./kewpie.json";
import keyCoffee from "./key-coffee.json";
import keyence from "./keyence.json";
import kgIntelligence from "./kg-intelligence.json";
import kibunFoods from "./kibun-foods.json";
import kichiriHoldingsAndCo from "./kichiri-holdings-and-co.json";
import kikkoman from "./kikkoman.json";
import kinden from "./kinden.json";
import kioxiaHoldings from "./kioxia-holdings.json";
import kirinHoldings from "./kirin-holdings.json";
import kitahamaCapitalPartners from "./kitahama-capital-partners.json";
import kitanoConstruction from "./kitano-construction.json";
import kitanotatsujin from "./kitanotatsujin.json";
import kitokuShinryo from "./kitoku-shinryo.json";
import koatsuKogyo from "./koatsu-kogyo.json";
import kobeBussan from "./kobe-bussan.json";
import kobeSteel from "./kobe-steel.json";
import kohjinBio from "./kohjin-bio.json";
import koikeYa from "./koike-ya.json";
import komatsu from "./komatsu.json";
import komehyoHoldings from "./komehyo-holdings.json";
import koshidakaHoldings from "./koshidaka-holdings.json";
import kotobukiSpirits from "./kotobuki-spirits.json";
import kozoKeikakuEngineeringHoldings from "./kozo-keikaku-engineering-holdings.json";
import kraftia from "./kraftia.json";
import ktk from "./ktk.json";
import kubota from "./kubota.json";
import kudo from "./kudo.json";
import kumagaiGumi from "./kumagai-gumi.json";
import kuraSushi from "./kura-sushi.json";
import kuraboIndustries from "./kurabo-industries.json";
import kuraray from "./kuraray.json";
import kurashiru from "./kurashiru.json";
import kurodaGroup from "./kuroda-group.json";
import kushim from "./kushim.json";
import kuze from "./kuze.json";
import kyocera from "./kyocera.json";
import kyodoPublicRelations from "./kyodo-public-relations.json";
import kyokuto from "./kyokuto.json";
import kyokuyo from "./kyokuyo.json";
import kyowanissei from "./kyowanissei.json";
import lIsB from "./l-is-b.json";
import laHoldings from "./la-holdings.json";
import lactoJapan from "./lacto-japan.json";
import landix from "./landix.json";
import landnet from "./landnet.json";
import lasertec from "./lasertec.json";
import laxusTechnologies from "./laxus-technologies.json";
import libWork from "./lib-work.json";
import liberaware from "./liberaware.json";
import lifeFoods from "./life-foods.json";
import lifedrink from "./lifedrink.json";
import lifull from "./lifull.json";
import like from "./like.json";
import linical from "./linical.json";
import linkAndMotivation from "./link-and-motivation.json";
import logosHoldings from "./logos-holdings.json";
import m3 from "./m3.json";
import macnicaHoldings from "./macnica-holdings.json";
import mamezoDigitalHoldings from "./mamezo-digital-holdings.json";
import manabiAid from "./manabi-aid.json";
import mandarake from "./mandarake.json";
import marketenterprise from "./marketenterprise.json";
import marubeni from "./marubeni.json";
import marudaiFood from "./marudai-food.json";
import marusanAi from "./marusan-ai.json";
import marutai from "./marutai.json";
import maruzenChiHoldings from "./maruzen-chi-holdings.json";
import masaru from "./masaru.json";
import materialGroup from "./material-group.json";
import matsuiConstruction from "./matsui-construction.json";
import matsukiyococokaraAndCo from "./matsukiyococokara-and-co.json";
import mazda from "./mazda.json";
import mbk from "./mbk.json";
import mbs from "./mbs.json";
import mcdonaldSHoldingsCompanyJapan from "./mcdonald-s-holdings-company-japan.json";
import medinet from "./medinet.json";
import mediusHoldings from "./medius-holdings.json";
import megmilkSnowBrand from "./megmilk-snow-brand.json";
import meihoFacilityWorks from "./meiho-facility-works.json";
import meijiHoldings from "./meiji-holdings.json";
import meikoConstruction from "./meiko-construction.json";
import meiseiIndustrial from "./meisei-industrial.json";
import meito from "./meito.json";
import members from "./members.json";
import mfs from "./mfs.json";
import mic from "./mic.json";
import mikikogyo from "./mikikogyo.json";
import miraitOne from "./mirait-one.json";
import mitsubishiChemicalGroup from "./mitsubishi-chemical-group.json";
import mitsubishiCorporation from "./mitsubishi-corporation.json";
import mitsubishiElectric from "./mitsubishi-electric.json";
import mitsubishiHeavyIndustries from "./mitsubishi-heavy-industries.json";
import mitsubishiMotors from "./mitsubishi-motors.json";
import mitsubishiUfjFinancialGroup from "./mitsubishi-ufj-financial-group.json";
import mitsuiAndCo from "./mitsui-and-co.json";
import mitsuiChemicals from "./mitsui-chemicals.json";
import mitsuiDmSugar from "./mitsui-dm-sugar.json";
import mitsuiFudosan from "./mitsui-fudosan.json";
import mitsuiKinzoku from "./mitsui-kinzoku.json";
import mitsuiMatsushimaHoldings from "./mitsui-matsushima-holdings.json";
import mixi from "./mixi.json";
import mizuhoFinancialGroup from "./mizuho-financial-group.json";
import monotaro from "./monotaro.json";
import moriGumi from "./mori-gumi.json";
import morinagaAndCo from "./morinaga-and-co.json";
import morinagaMilkIndustry from "./morinaga-milk-industry.json";
import moriya from "./moriya.json";
import morozoff from "./morozoff.json";
import msAndAdInsuranceGroupHoldings from "./ms-and-ad-insurance-group-holdings.json";
import murataManufacturing from "./murata-manufacturing.json";
import muscatGroup from "./muscat-group.json";
import nabtesco from "./nabtesco.json";
import nafco from "./nafco.json";
import nakabohtecCorrosionProtecting from "./nakabohtec-corrosion-protecting.json";
import nakamuraya from "./nakamuraya.json";
import nakano from "./nakano.json";
import nankaiTatsumuraConstruction from "./nankai-tatsumura-construction.json";
import natori from "./natori.json";
import nec from "./nec.json";
import nhFoods from "./nh-foods.json";
import nichirei from "./nichirei.json";
import nichiryoBaking from "./nichiryo-baking.json";
import nichiwaSangyo from "./nichiwa-sangyo.json";
import nihonDengi from "./nihon-dengi.json";
import nihonMAndACenterHoldings from "./nihon-m-and-a-center-holdings.json";
import nihonShokuhinKako from "./nihon-shokuhin-kako.json";
import nihonSuidoConsultants from "./nihon-suido-consultants.json";
import nihonwasouHoldings from "./nihonwasou-holdings.json";
import nikon from "./nikon.json";
import nintendo from "./nintendo.json";
import nippn from "./nippn.json";
import nipponAqua from "./nippon-aqua.json";
import nipponBeetSugarManufacturing from "./nippon-beet-sugar-manufacturing.json";
import nipponCareSupply from "./nippon-care-supply.json";
import nipponDensetsuKogyo from "./nippon-densetsu-kogyo.json";
import nipponDryChemical from "./nippon-dry-chemical.json";
import nipponGrande from "./nippon-grande.json";
import nipponInformationDevelopment from "./nippon-information-development.json";
import nipponParkingDevelopment from "./nippon-parking-development.json";
import nipponPrimex from "./nippon-primex.json";
import nipponRietec from "./nippon-rietec.json";
import nipponSteel from "./nippon-steel.json";
import nishimatsuConstruction from "./nishimatsu-construction.json";
import nissan from "./nissan.json";
import nisshinSeifunGroup from "./nisshin-seifun-group.json";
import nisshinboHoldings from "./nisshinbo-holdings.json";
import nissinFoodsHoldings from "./nissin-foods-holdings.json";
import nissou from "./nissou.json";
import nissui from "./nissui.json";
import nitcho from "./nitcho.json";
import nitoriHoldings from "./nitori-holdings.json";
import nittetsuMining from "./nittetsu-mining.json";
import nittoBoseki from "./nitto-boseki.json";
import nittoDenko from "./nitto-denko.json";
import nittoFujiFlourMilling from "./nitto-fuji-flour-milling.json";
import nittobest from "./nittobest.json";
import nittocConstruction from "./nittoc-construction.json";
import nittoh from "./nittoh.json";
import njs from "./njs.json";
import nmsHoldings from "./nms-holdings.json";
import nomuraHoldings from "./nomura-holdings.json";
import nomuraRealEstateHoldings from "./nomura-real-estate-holdings.json";
import nomuraResearchInstitute from "./nomura-research-institute.json";
import nsSolutions from "./ns-solutions.json";
import ntt from "./ntt.json";
import oWill from "./o-will.json";
import obayashi from "./obayashi.json";
import oceanSystem from "./ocean-system.json";
import ochiHoldings from "./ochi-holdings.json";
import oenonHoldings from "./oenon-holdings.json";
import ohmori from "./ohmori.json";
import ohmoriya from "./ohmoriya.json";
import ohmotoGumi from "./ohmoto-gumi.json";
import okamuraFoods from "./okamura-foods.json";
import okumura from "./okumura.json";
import olbaHealthcareHoldings from "./olba-healthcare-holdings.json";
import omikenshi from "./omikenshi.json";
import oomitsu from "./oomitsu.json";
import ootoyaHoldings from "./ootoya-holdings.json";
import openUpGroup from "./open-up-group.json";
import opro from "./opro.json";
import orientalConsultantsHoldings from "./oriental-consultants-holdings.json";
import orientalShiraishi from "./oriental-shiraishi.json";
import otec from "./otec.json";
import pacificNet from "./pacific-net.json";
import palGroupHoldings from "./pal-group-holdings.json";
import palemoHoldings from "./palemo-holdings.json";
import panasonicHoldings from "./panasonic-holdings.json";
import pasonaGroup from "./pasona-group.json";
import pentaOceanConstruction from "./penta-ocean-construction.json";
import pepperFoodService from "./pepper-food-service.json";
import persolHoldings from "./persol-holdings.json";
import pharmaFoodsInternational from "./pharma-foods-international.json";
import pharmariseHoldings from "./pharmarise-holdings.json";
import picklesHoldings from "./pickles-holdings.json";
import pietro from "./pietro.json";
import pixelcompanyz from "./pixelcompanyz.json";
import planet from "./planet.json";
import polarisHoldings from "./polaris-holdings.json";
import postprime from "./postprime.json";
import prapJapan from "./prap-japan.json";
import premiumWaterHoldings from "./premium-water-holdings.json";
import primaMeatPackers from "./prima-meat-packers.json";
import prismBiolab from "./prism-biolab.json";
import psConstruction from "./ps-construction.json";
import qolHoldings from "./qol-holdings.json";
import quantumSolutions from "./quantum-solutions.json";
import raccoonHoldings from "./raccoon-holdings.json";
import raitoKogyo from "./raito-kogyo.json";
import rakutenGroup from "./rakuten-group.json";
import rasa from "./rasa.json";
import reiwaAccountingHoldings from "./reiwa-accounting-holdings.json";
import renesasElectronics from "./renesas-electronics.json";
import repriority from "./repriority.json";
import reskill from "./reskill.json";
import resonaHoldings from "./resona-holdings.json";
import restar from "./restar.json";
import rezil from "./rezil.json";
import rigakuHoldings from "./rigaku-holdings.json";
import rizapGroup from "./rizap-group.json";
import robotHome from "./robot-home.json";
import rockField from "./rock-field.json";
import rohm from "./rohm.json";
import rokkoButter from "./rokko-butter.json";
import roxx from "./roxx.json";
import ryohinKeikaku from "./ryohin-keikaku.json";
import ryoyoRyosanHoldings from "./ryoyo-ryosan-holdings.json";
import sAndBFoods from "./s-and-b-foods.json";
import sFoods from "./s-foods.json";
import sIshimitsuAndCo from "./s-ishimitsu-and-co.json";
import sPool from "./s-pool.json";
import saafHoldings from "./saaf-holdings.json";
import saibo from "./saibo.json";
import saintCareHolding from "./saint-care-holding.json";
import saita from "./saita.json";
import sakataSeed from "./sakata-seed.json";
import sala from "./sala.json";
import sanA from "./san-a.json";
import sankiEngineering from "./sanki-engineering.json";
import sankoMarketingFoods from "./sanko-marketing-foods.json";
import sankoMetalIndustrial from "./sanko-metal-industrial.json";
import santo from "./santo.json";
import sanyoEngineeringAndConstruction from "./sanyo-engineering-and-construction.json";
import sanyoHomes from "./sanyo-homes.json";
import sanyodoHoldings from "./sanyodo-holdings.json";
import sanyuConstruction from "./sanyu-construction.json";
import sapeet from "./sapeet.json";
import sapporoHoldings from "./sapporo-holdings.json";
import sataConstruction from "./sata-construction.json";
import satoFoods from "./sato-foods.json";
import satoFoodsIndustries from "./sato-foods-industries.json";
import saylorAdvertising from "./saylor-advertising.json";
import sbiRheosHifumi from "./sbi-rheos-hifumi.json";
import sbsHoldings from "./sbs-holdings.json";
import schoo from "./schoo.json";
import scinex from "./scinex.json";
import screenHoldings from "./screen-holdings.json";
import sdsHoldings from "./sds-holdings.json";
import secuavail from "./secuavail.json";
import seigakusha from "./seigakusha.json";
import seihyo from "./seihyo.json";
import seikitokyuKogyo from "./seikitokyu-kogyo.json";
import sekisuiHouse from "./sekisui-house.json";
import sembaTohkaIndustries from "./semba-tohka-industries.json";
import seria from "./seria.json";
import sevenAndIHoldings from "./seven-and-i-holdings.json";
import shikibo from "./shikibo.json";
import shimadaya from "./shimadaya.json";
import shimizu from "./shimizu.json";
import shinEtsuChemical from "./shin-etsu-chemical.json";
import shinEtsuPolymer from "./shin-etsu-polymer.json";
import shinNipponAirTechnologies from "./shin-nippon-air-technologies.json";
import shinNipponBiomedicalLaboratories from "./shin-nippon-biomedical-laboratories.json";
import shindenHightex from "./shinden-hightex.json";
import shinnihon from "./shinnihon.json";
import shinobuFoodsProducts from "./shinobu-foods-products.json";
import shinozakiya from "./shinozakiya.json";
import shintoHoldings from "./shinto-holdings.json";
import shinwaWiseHoldings from "./shinwa-wise-holdings.json";
import shinyeiKaisha from "./shinyei-kaisha.json";
import shoBondHoldings from "./sho-bond-holdings.json";
import showaSangyo from "./showa-sangyo.json";
import smc from "./smc.json";
import sms from "./sms.json";
import sobal from "./sobal.json";
import socionext from "./socionext.json";
import softbank from "./softbank.json";
import softfrontHoldings from "./softfront-holdings.json";
import soikenHoldings from "./soiken-holdings.json";
import sojitz from "./sojitz.json";
import solitonSystems from "./soliton-systems.json";
import sompoHoldings from "./sompo-holdings.json";
import sonec from "./sonec.json";
import sonyGroup from "./sony-group.json";
import soracom from "./soracom.json";
import soukenAce from "./souken-ace.json";
import sreHoldings from "./sre-holdings.json";
import stCousair from "./st-cousair.json";
import starMicaHoldings from "./star-mica-holdings.json";
import starSeeds from "./star-seeds.json";
import stiFoodsHoldings from "./sti-foods-holdings.json";
import storageOh from "./storage-oh.json";
import stream from "./stream.json";
import studioAlice from "./studio-alice.json";
import subaru from "./subaru.json";
import sumikenMitsuiRoad from "./sumiken-mitsui-road.json";
import sumisekiHoldings from "./sumiseki-holdings.json";
import sumitomoChemical from "./sumitomo-chemical.json";
import sumitomoCorporation from "./sumitomo-corporation.json";
import sumitomoDensetsu from "./sumitomo-densetsu.json";
import sumitomoForestry from "./sumitomo-forestry.json";
import sumitomoMetalMining from "./sumitomo-metal-mining.json";
import sumitomoMitsuiConstruction from "./sumitomo-mitsui-construction.json";
import sumitomoMitsuiFinancialGroup from "./sumitomo-mitsui-financial-group.json";
import sumitomoRealtyAndDevelopment from "./sumitomo-realty-and-development.json";
import sunnySideUpGroup from "./sunny-side-up-group.json";
import suntoryBeverageAndFood from "./suntory-beverage-and-food.json";
import superValue from "./super-value.json";
import suzuki from "./suzuki.json";
import synclayer from "./synclayer.json";
import synspective from "./synspective.json";
import systemLocation from "./system-location.json";
import systena from "./systena.json";
import tabio from "./tabio.json";
import taiheiDengyoKaisha from "./taihei-dengyo-kaisha.json";
import taikisha from "./taikisha.json";
import taisei from "./taisei.json";
import taiseiOncho from "./taisei-oncho.json";
import taiyoKagaku from "./taiyo-kagaku.json";
import taiyoKisokogyo from "./taiyo-kisokogyo.json";
import taiyoYuden from "./taiyo-yuden.json";
import takachihoKoheki from "./takachiho-koheki.json";
import takada from "./takada.json";
import takahashiCurtainWall from "./takahashi-curtain-wall.json";
import takamatsuConstructionGroup from "./takamatsu-construction-group.json";
import takamiya from "./takamiya.json";
import takaraHoldings from "./takara-holdings.json";
import takasagoThermalEngineering from "./takasago-thermal-engineering.json";
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
}).map(([file, data]) => parseContent(companySchema, data, `src/data/companies/${file}.json`));
