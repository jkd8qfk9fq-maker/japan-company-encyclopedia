import { parseContent, companySchema } from "@/lib/content/schemas";
import type { Company } from "@/types/company";
import advantest from "./advantest.json";
import honda from "./honda.json";
import mitsubishiCorporation from "./mitsubishi-corporation.json";
import nintendo from "./nintendo.json";
import nissan from "./nissan.json";
import sonyGroup from "./sony-group.json";
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
}).map(([file, data]) => parseContent(companySchema, data, `src/data/companies/${file}.json`));
