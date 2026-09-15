import type { Term } from "@/types/term";

/**
 * 決算短信. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * JPX glossary definition, reading included.
 */
export const earningsRelease: Term = {
  id: "earnings-release",
  term: "決算短信",
  reading: "けっさんたんしん",
  description:
    "上場会社が決算を発表するときに、決算の内容の要点をまとめた書類。四半期ごとの決算発表のときにも出されます。",
  relatedTermIds: ["annual-securities-report"],
  sources: [
    {
      id: "jpx-glossary-earnings-release",
      title: "用語集「決算短信」",
      publisher: "株式会社日本取引所グループ",
      url: "https://www.jpx.co.jp/glossary/ka/122.html",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
