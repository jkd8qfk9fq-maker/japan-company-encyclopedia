import type { Term } from "@/types/term";

/**
 * 総合商社. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * 日本貿易会 (JFTC) is the trading companies' association. It calls 総合商社 「大手の商社」 (handbook p.32);
 * the trade + investment description is its current account of 商社.
 */
export const sogoShosha: Term = {
  id: "sogo-shosha",
  term: "総合商社",
  description:
    "大手の商社を指す呼び名。多種多様な商品やサービスの売買（トレード）と、事業への投資（事業投資）を「車の両輪」として収益を上げています。",
  sources: [
    {
      id: "jftc-handbook-2017",
      title: "商社ハンドブック2017",
      publisher: "一般社団法人 日本貿易会",
      url: "https://www.jftc.or.jp/research/handbook/pdf/201704.pdf",
      accessedAt: "2026-09-14",
    },
    {
      id: "jftc-shosha-strengths",
      title: "商社の強み",
      publisher: "一般社団法人 日本貿易会",
      url: "https://www.jftc.or.jp/shosha/about.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "jftc-shosha-business-model",
      title: "商社のビジネスモデルと社会的役割",
      publisher: "一般社団法人 日本貿易会",
      url: "https://www.jftc.or.jp/shosha/businessmodel.html",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
