import { parseContent, companySchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import advantest from "./advantest.json";
import aeon from "./aeon.json";
import asahiKasei from "./asahi-kasei.json";
import canon from "./canon.json";
import daiichiSankyo from "./daiichi-sankyo.json";
import daikinIndustries from "./daikin-industries.json";
import denso from "./denso.json";
import disco from "./disco.json";
import fanuc from "./fanuc.json";
import fastRetailing from "./fast-retailing.json";
import fujitsu from "./fujitsu.json";
import hitachi from "./hitachi.json";
import honda from "./honda.json";
import isuzuMotors from "./isuzu-motors.json";
import itochu from "./itochu.json";
import kajima from "./kajima.json";
import kddi from "./kddi.json";
import keyence from "./keyence.json";
import komatsu from "./komatsu.json";
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
import ntt from "./ntt.json";
import renesasElectronics from "./renesas-electronics.json";
import rohm from "./rohm.json";
import sevenAndIHoldings from "./seven-and-i-holdings.json";
import shimizu from "./shimizu.json";
import shinEtsuChemical from "./shin-etsu-chemical.json";
import socionext from "./socionext.json";
import sonyGroup from "./sony-group.json";
import subaru from "./subaru.json";
import sumitomoMitsuiFinancialGroup from "./sumitomo-mitsui-financial-group.json";
import sumitomoRealtyAndDevelopment from "./sumitomo-realty-and-development.json";
import suzuki from "./suzuki.json";
import taisei from "./taisei.json";
import takedaPharmaceutical from "./takeda-pharmaceutical.json";
import tokyoElectron from "./tokyo-electron.json";
import toyota from "./toyota.json";

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
}).map(([file, data]) => parseContent(companySchema, data, `src/data/companies/${file}.json`));
