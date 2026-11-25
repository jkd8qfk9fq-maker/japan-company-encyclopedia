/**
 * 研究開発費 for one filing year (JCE-110, Q3 「何に力を入れているか」), from the filing's XBRL, or the reason there is
 * none. The candidates are the printed totals a filer states R&D with, in the order checked against real filings on
 * 2026-11-25 (ADEKA, SUBARU, キーエンス): the 研究開発活動 section's own total, the IFRS note's 当期に費用認識した研究開発費,
 * and 研究開発費 inside 販売費及び一般管理費. Only the consolidated context with no member is read (a segment's or the
 * 提出会社's figure is not the group's), the first candidate present is taken and its printed label kept, and a figure
 * that is not positive or not below the year's revenue is refused rather than shown.
 */

const CANDIDATES = [
  { element: "jpcrp_cor:ResearchAndDevelopmentExpensesResearchAndDevelopmentActivities", label: "研究開発費", locator: "【研究開発活動】" },
  { element: "jpigp_cor:ResearchAndDevelopmentExpenditureRecognizedAsExpenseDuringPeriodIFRS", label: "当期に費用認識した研究開発費", locator: "【注記事項】" },
  { element: "jppfs_cor:ResearchAndDevelopmentExpensesSGA", label: "研究開発費（販売費及び一般管理費）", locator: "【連結損益計算書】" },
];

/**
 * @param {Record<string, string>[]} rows the type=5 CSV rows
 * @param {number | null} revenue the year's printed revenue, as the entry records it
 * @returns {{ label: string, amount: number, locator: string } | { problem: string }}
 */
export function researchDevelopmentFact(rows, revenue) {
  for (const c of CANDIDATES) {
    const values = new Set(
      rows
        .filter((r) => r["要素ID"] === c.element && r["コンテキストID"] === "CurrentYearDuration" && r["単位"] === "円")
        .map((r) => String(r["値"] ?? "").trim())
        .filter((v) => v !== "" && !/^[－\-—]$/.test(v)),
    );
    if (values.size === 0) continue;
    if (values.size > 1) return { problem: `${c.label}が2つの値で印字されている` };
    const amount = Number([...values][0]);
    if (!Number.isSafeInteger(amount) || amount <= 0) return { problem: `${c.label}が正の整数でない` };
    if (revenue === null || amount >= revenue) return { problem: `${c.label}が売上高以上、または売上高がない` };
    return { label: c.label, amount, locator: c.locator };
  }
  return { problem: "研究開発費の印字がない" };
}
