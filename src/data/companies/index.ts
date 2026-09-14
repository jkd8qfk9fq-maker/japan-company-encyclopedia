import type { Company } from "@/types/company";
import { mitsubishiCorporation } from "./mitsubishi-corporation";
import { nintendo } from "./nintendo";
import { sonyGroup } from "./sony-group";
import { tokyoElectron } from "./tokyo-electron";
import { toyota } from "./toyota";

/**
 * The registry of published companies. A data file that is not listed here is
 * not published — the route, the list, search and the sitemap all read from
 * this array through the company repository.
 *
 * Add a company here only after its research log exists and the data integrity
 * suite passes (CLAUDE.md, "Adding or correcting a company").
 */
export const companies: Company[] = [toyota, sonyGroup, nintendo, mitsubishiCorporation, tokyoElectron];
