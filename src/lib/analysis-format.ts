import type { AnalysisRow } from "@/lib/company-analysis";
import { formatYen } from "@/lib/utils/format";

/**
 * How an analysis row's value is written — one function for the tables and for the meaning layer's
 * sentences (JCE-110), so a number in a sentence is the same string as the number in its table.
 */

const percent = (v: number) => `${(v * 100).toFixed(1).replace("-", "−")}%`;
const percentChange = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(1)}%`;
const times = (v: number) => `${v.toFixed(2)}倍`;
const points = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(2)}pt`;

export function formatAnalysisValue(row: Pick<AnalysisRow, "unit">, value: number): string {
  switch (row.unit) {
    case "percent":
      return percent(value);
    case "percent-change":
      return percentChange(value);
    case "points":
      return points(value);
    case "times":
      return times(value);
    case "yen-per-person":
    case "yen":
      return formatYen(value);
    case "people":
      return `${value.toLocaleString("ja-JP")}人`;
  }
}
