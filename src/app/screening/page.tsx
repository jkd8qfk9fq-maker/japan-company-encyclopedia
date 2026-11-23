import type { Metadata } from "next";
import { ScreeningTool } from "@/components/screening/screening-tool";

export const metadata: Metadata = {
  title: "財務で探す",
  description: "業界・本社の都道府県・売上高の規模・5期の伸び・純利益率・海外売上高比率・従業員数で、掲載企業を絞り込めます。",
  alternates: { canonical: "/screening" },
};

/** Financial screening (JCE-060): the page is static; the conditions run in the browser on /screening.json. */
export default function ScreeningPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground">SCREENING</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">財務で探す</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">有価証券報告書の数値と計算値で、掲載企業を絞り込めます。条件はこの端末の中だけで使われます。</p>
      <div className="mt-8">
        <ScreeningTool />
      </div>
    </div>
  );
}
