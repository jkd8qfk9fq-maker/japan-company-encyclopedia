import type { Term } from "@/types/term";

/**
 * 後工程. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * METI's description of 後工程, with SEAJ's 組み立て / 試験・検査 split.
 */
export const backEndProcess: Term = {
  id: "back-end-process",
  term: "後工程",
  description:
    "半導体の製造工程のうち、回路ができたウェーハを切ってチップに分け、配線をつないで樹脂などで包み、最後に検査する工程。",
  relatedTermIds: ["front-end-process", "wafer"],
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
