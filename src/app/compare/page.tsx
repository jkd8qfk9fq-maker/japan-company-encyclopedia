import type { Metadata } from "next";
import { CompareTool } from "@/components/compare/compare-tool";

export const metadata: Metadata = {
  title: "企業を見比べる",
  description: "2〜5社の売上高・純利益・純利益率・5期の売上高の伸び・従業員数・海外売上高比率を、有価証券報告書の数値で横に並べて見比べられます。プレミアムプランでは各社の業界の中での位置も並べて印刷・PDFにできます。",
  alternates: { canonical: "/compare" },
};

/** 見比べ (JCE-061): the page is static; the companies come from ?ids=… and are drawn in the browser from /compare.json. */
export default function ComparePage() {
  return (
    <div id="compare" className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground">COMPARE</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">企業を見比べる</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        有価証券報告書の数値で、2社（プレミアムプランでは5社まで）を横に並べます。アドレスをそのまま送れば、同じ見比べを共有できます。選んだ企業はどこにも送られません。
      </p>
      <div className="mt-8">
        <CompareTool />
      </div>
    </div>
  );
}
