import type { Term } from "@/types/term";

/**
 * ウェーハ. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * Spelled ウェーハ as Tokyo Electron and Sony write it (METI writes ウエハ). The thickness is the
 * silicon-wafer entry's 「厚さ1ミリ以下」.
 */
export const wafer: Term = {
  id: "wafer",
  term: "ウェーハ",
  description:
    "半導体チップのもとになる、厚さ1ミリ以下の円い板。高い純度のシリコンでつくったシリコン・ウェーハの表面にたくさんの回路をつくり、最後に切り分けて半導体チップにします。",
  relatedTermIds: ["semiconductor", "front-end-process"],
  sources: [
    {
      id: "tel-glossary-wafer",
      title: "半導体用語集「ウェーハ」（nanotec museum）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/museum/words/words10.html#word05",
      accessedAt: "2026-09-14",
    },
    {
      id: "tel-glossary-silicon-wafer",
      title: "半導体用語集「シリコン・ウェーハ」（nanotec museum）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/museum/words/words12.html#word05",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
