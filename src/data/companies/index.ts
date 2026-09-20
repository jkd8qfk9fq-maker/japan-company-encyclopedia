import { parseContent, companySchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import advantest from "./advantest.json";
import daiichiSankyo from "./daiichi-sankyo.json";
import fastRetailing from "./fast-retailing.json";
import fujitsu from "./fujitsu.json";
import hitachi from "./hitachi.json";
import honda from "./honda.json";
import itochu from "./itochu.json";
import kddi from "./kddi.json";
import mitsubishiCorporation from "./mitsubishi-corporation.json";
import mitsubishiElectric from "./mitsubishi-electric.json";
import mitsubishiUfjFinancialGroup from "./mitsubishi-ufj-financial-group.json";
import mitsuiAndCo from "./mitsui-and-co.json";
import mizuhoFinancialGroup from "./mizuho-financial-group.json";
import nec from "./nec.json";
import nintendo from "./nintendo.json";
import nissan from "./nissan.json";
import ntt from "./ntt.json";
import sevenAndIHoldings from "./seven-and-i-holdings.json";
import shinEtsuChemical from "./shin-etsu-chemical.json";
import sonyGroup from "./sony-group.json";
import sumitomoMitsuiFinancialGroup from "./sumitomo-mitsui-financial-group.json";
import suzuki from "./suzuki.json";
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
}).map(([file, data]) => parseContent(companySchema, data, `src/data/companies/${file}.json`));
