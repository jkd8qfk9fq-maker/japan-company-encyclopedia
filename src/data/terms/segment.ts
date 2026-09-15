import type { Term } from "@/types/term";

/**
 * セグメント. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * ASBJ Statement No.17 §6 (事業セグメント) and §19 (profit disclosed per 報告セグメント). The chief
 * operating decision maker is written as 経営者 for a beginner.
 */
export const segment: Term = {
  id: "segment",
  term: "セグメント",
  description:
    "会社の事業を、経営者が業績を評価したり経営資源の配分を決めたりするときの単位で区切ったもの。決算書では、区切った事業（報告セグメント）ごとに利益などが示されます。",
  relatedTermIds: ["consolidated-subsidiary"],
  sources: [
    {
      id: "asbj-segment-standard",
      title: "企業会計基準第17号「セグメント情報等の開示に関する会計基準」",
      publisher: "企業会計基準委員会（ASBJ）",
      url: "https://www.asb-j.jp/jp/accounting_standards_system/details.html?topics_id=38",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
