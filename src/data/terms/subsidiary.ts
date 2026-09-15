import type { Term } from "@/types/term";

/**
 * 子会社. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * ASBJ Statement No.22 §6–7. The majority-of-voting-rights case is the example because it is
 * the first one the standard lists.
 */
export const subsidiary: Term = {
  id: "subsidiary",
  term: "子会社",
  description:
    "ほかの会社に、経営の方針を決める機関（株主総会など）を支配されている会社のこと。支配している側を親会社といいます。たとえば、議決権の過半数を持たれている会社が当たります。",
  relatedTermIds: ["consolidated-subsidiary"],
  sources: [
    {
      id: "asbj-consolidation-standard",
      title: "企業会計基準第22号「連結財務諸表に関する会計基準」",
      publisher: "企業会計基準委員会（ASBJ）",
      url: "https://www.asb-j.jp/jp/wp-content/uploads/sites/4/ikan_20240701_34.pdf",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
