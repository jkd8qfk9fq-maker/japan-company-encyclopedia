import type { Term } from "@/types/term";

/**
 * ファウンドリ. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * NEDO's table of semiconductor business models (p.28). Spelled ファウンドリ as METI and Tokyo
 * Electron write it.
 */
export const foundry: Term = {
  id: "foundry",
  term: "ファウンドリ",
  description:
    "半導体の設計や販売は行わず、製造だけを請け負う半導体メーカー。大きな設備投資をして効率のよい工場を持ちます。反対に、工場を持たずに設計に専念し、製造を外部に任せる会社はファブレスと呼ばれます。",
  relatedTermIds: ["front-end-process"],
  sources: [
    {
      id: "nedo-tsc-trend",
      title: "TSCトレンド「グローバルな半導体競争 ～エコシステム確保をかけて～」",
      publisher: "国立研究開発法人 新エネルギー・産業技術総合開発機構（NEDO）技術戦略研究センター",
      url: "https://www.nedo.go.jp/content/100931733.pdf",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
