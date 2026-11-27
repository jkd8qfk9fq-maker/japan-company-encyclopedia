import type { Metadata } from "next";
import { preload } from "react-dom";
import { CompareTool } from "@/components/compare/compare-tool";
import { L } from "@/components/i18n/label";

export const metadata: Metadata = {
  title: "企業を見比べる",
  description: "2〜3社の売上高・純利益・純利益率・5期の売上高の伸び・従業員数・海外売上高比率を、有価証券報告書の数値で横に並べて見比べられます。",
  alternates: { canonical: "/compare" },
};

/** 見比べ (JCE-061): the page is static; the companies come from ?ids=… and are drawn in the browser from /compare.json. */
export default function ComparePage() {
  // Start the light index download with the page itself (JCE-148): the tool used to wait for hydration
  // before its first fetch began, which left the page on 「読み込んでいます…」 for seconds.
  preload("/compare-index.json", { as: "fetch", crossOrigin: "anonymous" });
  return (
    <div id="compare" className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground">COMPARE</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">企業を見比べる</h1>
      <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">有価証券報告書の数値で、会社を横に並べます。選んだ会社はどこにも送られません。</p>
      {/* 2026-11-23: an empty tool told the reader only "pick two"; ready-made comparisons show what it does in one tap.
          Plain links (not client navigation): the tool reads ?ids= when it starts. */}
      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">例：</span>
        {[
          { label: "自動車3社", ids: "toyota,honda,nissan" },
          { label: "総合商社3社", ids: "mitsubishi-corporation,mitsui-and-co,itochu" },
          { label: "ソニーと任天堂", ids: "sony-group,nintendo" },
          { label: "小売3社", ids: "seven-and-i-holdings,aeon,fast-retailing" },
        ].map((preset) => (
          <a key={preset.ids} href={`/compare?ids=${preset.ids}`} className="inline-flex min-h-9 items-center rounded-full border border-border bg-card px-3 hover:border-foreground">
            <L s={preset.label} />
          </a>
        ))}
      </p>
      <div className="mt-8">
        <CompareTool />
      </div>
    </div>
  );
}
