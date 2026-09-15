import type { Term } from "@/types/term";

/**
 * 前工程. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * METI's split (設計・前工程・後工程). SEAJ also counts design, mask making and wafer making as 前工程; the
 * wafer process is central in both, so the definition names only that. No reading: no source
 * gives one.
 */
export const frontEndProcess: Term = {
  id: "front-end-process",
  term: "前工程",
  description:
    "半導体の製造工程のうち、ウェーハの上に電子回路をつくる工程。露光・現像やエッチングなどの処理を数十回から数百回くり返して回路と配線をつくり、ウェーハのまま検査します。",
  relatedTermIds: ["back-end-process", "wafer", "semiconductor-manufacturing-equipment"],
  sources: [
    {
      id: "meti-supply-policy",
      title: "半導体に係る安定供給確保を図るための取組方針（令和7年5月16日改定）",
      publisher: "経済産業省",
      url: "https://www.meti.go.jp/policy/economy/economic_security/semicon/torikumihousin_semiconr3.pdf",
      publishedAt: "2025-05-16",
      accessedAt: "2026-09-14",
    },
    {
      id: "seaj-process",
      title: "半導体製造工程とは",
      publisher: "一般社団法人 日本半導体製造装置協会（SEAJ）",
      url: "https://www.seaj.or.jp/semi/proc/",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
