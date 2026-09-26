import { parseContent, companySchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import advantest from "./advantest.json";
import aeon from "./aeon.json";
import ajinomoto from "./ajinomoto.json";
import asahiGroupHoldings from "./asahi-group-holdings.json";
import asahiKasei from "./asahi-kasei.json";
import astellasPharma from "./astellas-pharma.json";
import canon from "./canon.json";
import chugaiPharmaceutical from "./chugai-pharmaceutical.json";
import daiIchiLifeHoldings from "./dai-ichi-life-holdings.json";
import daiichiSankyo from "./daiichi-sankyo.json";
import daikinIndustries from "./daikin-industries.json";
import denso from "./denso.json";
import disco from "./disco.json";
import fanuc from "./fanuc.json";
import fastRetailing from "./fast-retailing.json";
import fujifilmHoldings from "./fujifilm-holdings.json";
import fujitsu from "./fujitsu.json";
import hitachi from "./hitachi.json";
import honda from "./honda.json";
import isuzuMotors from "./isuzu-motors.json";
import itochu from "./itochu.json";
import kajima from "./kajima.json";
import kddi from "./kddi.json";
import keyence from "./keyence.json";
import kikkoman from "./kikkoman.json";
import komatsu from "./komatsu.json";
import kubota from "./kubota.json";
import marubeni from "./marubeni.json";
import mazda from "./mazda.json";
import mitsubishiChemicalGroup from "./mitsubishi-chemical-group.json";
import mitsubishiCorporation from "./mitsubishi-corporation.json";
import mitsubishiElectric from "./mitsubishi-electric.json";
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
import nitoriHoldings from "./nitori-holdings.json";
import nomuraHoldings from "./nomura-holdings.json";
import ntt from "./ntt.json";
import panasonicHoldings from "./panasonic-holdings.json";
import rakutenGroup from "./rakuten-group.json";
import renesasElectronics from "./renesas-electronics.json";
import rohm from "./rohm.json";
import ryohinKeikaku from "./ryohin-keikaku.json";
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
import takedaPharmaceutical from "./takeda-pharmaceutical.json";
import tokioMarineHoldings from "./tokio-marine-holdings.json";
import tokyoElectron from "./tokyo-electron.json";
import toyota from "./toyota.json";
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
}).map(([file, data]) => parseContent(companySchema, data, `src/data/companies/${file}.json`));
