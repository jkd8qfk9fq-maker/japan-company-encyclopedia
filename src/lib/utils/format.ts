/**
 * Japanese number and date formatting.
 *
 * Japanese groups large numbers by 万 (10^4), 億 (10^8) and 兆 (10^12), not by
 * thousands. 48,036,704,000,000 yen is "48兆367億円"; writing "48,036億円" or
 * "48.0 trillion" would be correct arithmetic in the wrong language.
 *
 * Display values are rounded to the displayed unit. The exact figures, in the
 * 百万円 unit the filings use, are always available next to a chart in its
 * data table — rounding is a presentation choice, never a data change.
 */

const MINUS = "−"; // a real minus sign, not a hyphen

const CHO = 1_0000_0000_0000; // 兆
const OKU = 1_0000_0000; // 億
const MAN = 1_0000; // 万

const grouped = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 });

/** "48兆367億円", "3,670億円", "5,200万円". */
export function formatYen(value: number): string {
  const sign = value < 0 ? MINUS : "";
  const abs = Math.abs(value);

  if (abs >= CHO) {
    // Round to 億 first, then split, so 9,999.6億 carries into the next 兆.
    const totalOku = Math.round(abs / OKU);
    const cho = Math.floor(totalOku / MAN);
    const oku = totalOku % MAN;
    return `${sign}${grouped.format(cho)}兆${oku > 0 ? `${grouped.format(oku)}億` : ""}円`;
  }
  if (abs >= OKU) {
    const oku = Math.round(abs / OKU);
    // 9,999.6億 rounds to 10,000億, which is 1兆.
    if (oku >= MAN) return `${sign}${grouped.format(oku / MAN)}兆円`;
    return `${sign}${grouped.format(oku)}億円`;
  }
  if (abs >= MAN) {
    const man = Math.round(abs / MAN);
    if (man >= MAN) return `${sign}1億円`;
    return `${sign}${grouped.format(man)}万円`;
  }
  return `${sign}${grouped.format(abs)}円`;
}

/** Axis labels: one unit, at most one decimal. "12兆円", "2.5兆円", "8,000億円". */
export function formatYenAxis(value: number): string {
  if (value === 0) return "0";
  const sign = value < 0 ? MINUS : "";
  const abs = Math.abs(value);
  if (abs >= CHO) {
    const cho = abs / CHO;
    const text = Number.isInteger(cho) ? grouped.format(cho) : cho.toFixed(1);
    return `${sign}${text}兆円`;
  }
  if (abs >= OKU) return `${sign}${grouped.format(Math.round(abs / OKU))}億円`;
  return `${sign}${grouped.format(Math.round(abs / MAN))}万円`;
}

/** Whole yen to the 百万円 unit filings are printed in, for data tables. */
export function formatMillionYen(value: number): string {
  const millions = Math.round(value / 1_000_000);
  return `${millions < 0 ? MINUS : ""}${grouped.format(Math.abs(millions))}`;
}

/**
 * "2026-09-13" → "2026年9月13日". Parsed as text, not through Date, so the
 * result cannot shift a day depending on the server's or reader's time zone.
 */
export function formatDateJa(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) return isoDate;
  const [, y, m, d] = match;
  return `${Number(y)}年${Number(m)}月${Number(d)}日`;
}
