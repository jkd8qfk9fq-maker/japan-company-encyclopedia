"use client";

import Link from "next/link";
import { ANALYSIS_FEATURES_OPEN } from "@/lib/plan";

/**
 * The gate of the analysis layer (JCE-078). Unlike PremiumGate it answers to its own flag only:
 * the layer is new, its sale form is a Phase 3 decision (spec §6, §10), and neither the JCE-075
 * opening nor a plan bought for the encyclopedia's existing features opens it. While the flag is
 * closed the static page holds the free part of the analysis (own values and industry medians,
 * rendered outside this gate) plus this note of what the full view adds — there is nothing to buy
 * yet, so there is no checkout here.
 */
export function AnalysisGate({ children }: { children: React.ReactNode }) {
  if (ANALYSIS_FEATURES_OPEN) return <>{children}</>;

  return (
    <div className="rounded-md border border-border bg-paper p-5 print:hidden md:p-6">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">ANALYSIS</p>
      <h3 className="mt-1 font-serif text-lg font-semibold">分析の詳細（分布・推移・経済指標）</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        各観点の要点（自社の値と業界の中央値）は上の表で無料で公開しています。分布の全体像（四分位・順位・パーセンタイル）、複数期の推移、業界に対応づけた経済指標との接続は、分析レイヤーとして提供を準備しています。販売の形が決まり次第、この場所で案内します。
      </p>
      <p className="mt-3 text-sm">
        <Link href="/analysis" className="underline underline-offset-4">
          分析の考え方と5観点について
        </Link>
      </p>
    </div>
  );
}
