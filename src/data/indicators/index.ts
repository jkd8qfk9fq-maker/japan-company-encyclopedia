import { indicatorSchema, parseContent } from "@/lib/content/schemas";
import type { Indicator } from "@/types/indicator";
import japanRealGdp from "./japan-real-gdp.json";
import japanCpi from "./japan-cpi.json";
import japanCgpi from "./japan-cgpi.json";
import japanIndustrialProduction from "./japan-industrial-production.json";
import japanUnemploymentRate from "./japan-unemployment-rate.json";
import japanJobOffersRatio from "./japan-job-offers-ratio.json";
import japanRealWages from "./japan-real-wages.json";
import japanExports from "./japan-exports.json";
import japanCurrentAccount from "./japan-current-account.json";
import bojTankanDi from "./boj-tankan-di.json";
import usRealGdp from "./us-real-gdp.json";
import usCpi from "./us-cpi.json";
import usNonfarmPayroll from "./us-nonfarm-payroll.json";
import usFederalFundsRate from "./us-federal-funds-rate.json";
import usdJpy from "./usd-jpy.json";

/**
 * The indicator snapshots (JCE-078 §4), regenerated monthly by the scripts
 * under scripts/indicators/ and parsed through the schema on load, like every
 * other content kind: a malformed snapshot fails the build instead of
 * rendering. fetch-indicators.py covers the series FRED republishes;
 * fetch-indicators-primary.py covers the Japanese series read from the
 * publisher's own distribution (JCE-107).
 */
export const indicators: Indicator[] = [
  japanRealGdp,
  japanCpi,
  japanCgpi,
  japanIndustrialProduction,
  japanUnemploymentRate,
  japanJobOffersRatio,
  japanRealWages,
  japanExports,
  japanCurrentAccount,
  bojTankanDi,
  usRealGdp,
  usCpi,
  usNonfarmPayroll,
  usFederalFundsRate,
  usdJpy,
].map((data) => parseContent(indicatorSchema, data, "src/data/indicators/*.json"));
