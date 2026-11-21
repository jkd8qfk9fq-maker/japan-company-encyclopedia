import { indicatorSchema, parseContent } from "@/lib/content/schemas";
import type { Indicator } from "@/types/indicator";
import japanRealGdp from "./japan-real-gdp.json";
import japanUnemploymentRate from "./japan-unemployment-rate.json";
import usCpi from "./us-cpi.json";
import usFederalFundsRate from "./us-federal-funds-rate.json";
import usNonfarmPayroll from "./us-nonfarm-payroll.json";
import usRealGdp from "./us-real-gdp.json";
import usdJpy from "./usd-jpy.json";

/**
 * The indicator snapshots (JCE-078 §4), regenerated monthly by
 * scripts/indicators/fetch-indicators.py from FRED and parsed through the schema on load, like
 * every other content kind: a malformed snapshot fails the build instead of rendering.
 */
export const indicators: Indicator[] = [
  japanRealGdp,
  japanUnemploymentRate,
  usRealGdp,
  usCpi,
  usNonfarmPayroll,
  usFederalFundsRate,
  usdJpy,
].map((data) => parseContent(indicatorSchema, data, "src/data/indicators/*.json"));
