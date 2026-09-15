import type { Term } from "@/types/term";

/**
 * 半導体. Source passages: docs/research/industry-semiconductors-and-terms.md.
 *
 * Defined the way SEAJ and METI both define it: the material first, then the customary use of
 * the word for chips. The reading is the one Tokyo Electron's glossary gives.
 */
export const semiconductor: Term = {
  id: "semiconductor",
  term: "半導体",
  reading: "はんどうたい",
  description:
    "電気をよく通す導体と、ほとんど通さない絶縁体の中間の性質をもつ、シリコンなどの物質のこと。それを材料にしたトランジスタや集積回路も「半導体」と呼ばれ、電子機器の中で情報の記憶や計算を担います。",
  relatedTermIds: ["semiconductor-manufacturing-equipment", "wafer"],
  sources: [
    {
      id: "seaj-about-semiconductor",
      title: "半導体とは",
      publisher: "一般社団法人 日本半導体製造装置協会（SEAJ）",
      url: "https://www.seaj.or.jp/semi/about_semi.html",
      accessedAt: "2026-09-14",
    },
    {
      id: "meti-journal-semiconductor",
      title: "半導体って何？～知っておきたい経済の基礎知識（METI Journal ONLINE）",
      publisher: "経済産業省 広報室",
      url: "https://journal.meti.go.jp/60sec/28889/",
      publishedAt: "2023-08-25",
      accessedAt: "2026-09-14",
    },
    {
      id: "tel-glossary-semiconductor",
      title: "半導体用語集「半導体」（nanotec museum）",
      publisher: "東京エレクトロン株式会社",
      url: "https://www.tel.co.jp/museum/words/words15.html#word05",
      accessedAt: "2026-09-14",
    },
  ],
  updatedAt: "2026-09-14",
};
