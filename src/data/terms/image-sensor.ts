import type { Term } from "@/types/term";

/**
 * イメージセンサー. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * Sony's own semiconductor site: Sony Group is the published company that makes them.
 */
export const imageSensor: Term = {
  id: "image-sensor",
  term: "イメージセンサー",
  description:
    "レンズから入った光を電気信号に変える「電子の眼」。フィルムカメラのフィルムや、人間の眼の網膜にあたる働きをします。スマートフォンやデジタルカメラのほか、自動車やセキュリティカメラなどでも使われています。",
  relatedTermIds: ["semiconductor"],
  sources: [
    {
      id: "sony-semicon-image-sensor",
      title: "イメージセンサー共通（技術）",
      publisher: "ソニーセミコンダクタソリューションズ株式会社",
      url: "https://www.sony-semicon.com/ja/technology/is/index.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "sony-semicon-group",
      title: "グループ（ソニーセミコンダクタソリューションズグループ）",
      publisher: "ソニーセミコンダクタソリューションズ株式会社",
      url: "https://www.sony-semicon.com/ja/company/group/index.html",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
