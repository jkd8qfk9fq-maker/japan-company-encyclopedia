import type { Term } from "@/types/term";

/**
 * 非継続事業. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * IFRS 5's definition as ASBJ summarises it (§34–35). 「手放すために分けて扱っている」 covers both 売却目的保有
 * (ASBJ) and the 所有者分配目的で保有する処分グループ Sony's 有報 describes, so Sony's spin-off does not
 * contradict the definition.
 */
export const discontinuedOperations: Term = {
  id: "discontinued-operations",
  term: "非継続事業",
  description:
    "すでに手放した事業や、手放すために分けて扱っている事業のうち、主要な事業分野や地域の事業にあたるものなど。国際会計基準（IFRS）では、その損益を、続けている事業（継続事業）の損益とは分けて示します。",
  relatedTermIds: ["ifrs"],
  sources: [
    {
      id: "asbj-presentation-discussion-paper",
      title: "財務諸表の表示に関する論点の整理",
      publisher: "企業会計基準委員会（ASBJ）",
      url: "https://www.asb-j.jp/jp/wp-content/uploads/sites/4/hyouji-ronten.pdf",
      publishedAt: "2009-07-10",
      accessedAt: "2026-09-14",
    },
    {
      id: "sony-yuho-2026",
      title: "有価証券報告書（2025年度：2025年4月1日〜2026年3月31日）",
      publisher: "ソニーグループ株式会社",
      url: "https://www.sony.com/ja/SonyInfo/IR/library/r7_q4.pdf",
      publishedAt: "2026-06-18",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
