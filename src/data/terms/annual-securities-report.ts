import type { Term } from "@/types/term";

/**
 * 有価証券報告書. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * JPX glossary definition, reading included.
 */
export const annualSecuritiesReport: Term = {
  id: "annual-securities-report",
  term: "有価証券報告書",
  reading: "ゆうかしょうけんほうこくしょ",
  description:
    "上場会社などが、金融商品取引法にもとづき、事業年度が終わってから3か月以内に提出する書類。会社の概況、事業の状況、経理の状況などが書かれていて、金融庁のEDINETで読めます。",
  relatedTermIds: ["earnings-release"],
  sources: [
    {
      id: "jpx-glossary-annual-securities-report",
      title: "用語集「有価証券報告書」",
      publisher: "株式会社日本取引所グループ",
      url: "https://www.jpx.co.jp/glossary/ya/446.html",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
