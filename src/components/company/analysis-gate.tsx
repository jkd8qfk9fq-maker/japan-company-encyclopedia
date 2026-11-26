"use client";

import { useState } from "react";
import Link from "next/link";
import { ANALYSIS_FEATURES_OPEN, analysisEntitled, applyPlan, checkPlan, isValidCode, usePlan } from "@/lib/plan";
import { T } from "@/components/i18n/t";

/**
 * The gate of the analysis layer (JCE-078), opened by JCE-101 (SaaS Step 2). The free part of
 * the analysis (own values and industry medians) is rendered outside this gate for every reader.
 * What sits inside — the distributions, the multi-period trends, the linked economic indicators,
 * and with them the full printable report — opens only for a reader whose purchase code the
 * billing record says is paid: this site's own entitlements first, the 診断 site's borrowed
 * check as the migration fallback (JCE-100's union check in `checkPlan`). Like PremiumGate this
 * is a view switch on a static page, not a wall: the entitlement is what the code check returns,
 * and a code that is not paid never renders the children in this browser.
 *
 * ANALYSIS_FEATURES_OPEN is the layer's on/off switch: while it is off the layer is "in
 * preparation" again and no code opens it (JCE-078's Phase 1 state).
 */
/** The purchase-code entry both analysis gates share: a paid answer stores the plan, and every gate on the page opens. */
function useCodeEntry() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "inactive" | "error">("idle");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidCode(code)) return;
    setStatus("sending");
    try {
      const result = await checkPlan(code.trim());
      applyPlan(result);
      setStatus(result.active ? "idle" : "inactive");
    } catch {
      setStatus("error");
    }
  };
  return { code, setCode, status, submit };
}

function CodeEntryForm({ id, entry }: { id: string; entry: ReturnType<typeof useCodeEntry> }) {
  return (
    <>
      <form onSubmit={entry.submit} className="mt-4 flex max-w-md flex-wrap items-center gap-2">
        <label htmlFor={id} className="sr-only">
          <T m={{ ja: "購入コード", en: "Purchase code" }} />
        </label>
        <input
          id={id}
          value={entry.code}
          onChange={(e) => entry.setCode(e.target.value)}
          placeholder="購入コード（sub_…）"
          autoComplete="off"
          spellCheck={false}
          className="figures min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!isValidCode(entry.code) || entry.status === "sending"}
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
        >
          {entry.status === "sending" ? <T m={{ ja: "確認中…", en: "Checking…" }} /> : <T m={{ ja: "コードで開く", en: "Open with code" }} />}
        </button>
      </form>
      {entry.status === "inactive" && <p className="mt-2 text-xs text-muted-foreground"><T m={{ ja: "このコードは、いま有効ではありません。", en: "This code is not currently valid." }} /></p>}
      {entry.status === "error" && <p className="mt-2 text-xs text-muted-foreground"><T m={{ ja: "確認できませんでした。しばらくしてからもう一度お試しください。", en: "Could not verify. Please try again later." }} /></p>}
    </>
  );
}

export function AnalysisGate({ children }: { children: React.ReactNode }) {
  const plan = usePlan();
  const entry = useCodeEntry();

  if (!ANALYSIS_FEATURES_OPEN) {
    return (
      <div className="rounded-md border border-border bg-paper p-5 print:hidden md:p-6">
        <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">ANALYSIS</p>
        <h3 className="mt-1 font-serif text-lg font-semibold"><T m={{ ja: "分析の詳細（分布・推移・経済指標）", en: "Analysis details (distribution, trends, economic indicators)" }} /></h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          <T m={{ ja: "各観点の要点（自社の値と業界の中央値）は上の表で無料で公開しています。「この会社の今」の答え、分布の全体像（四分位・順位・パーセンタイル）、複数期の推移、業界に対応づけた経済指標との接続は、分析レイヤーとして提供を準備しています。販売の形が決まり次第、この場所で案内します。", en: "The key points for each perspective (the company's value and the industry median) are free in the table above. The answer to \"This Company Now,\" the full distribution (quartiles, rank, percentile), multi-year trends, and links to economic indicators mapped to the industry are being prepared as an analysis layer. We will announce details here once the sales format is decided." }} />
        </p>
        <p className="mt-3 text-sm">
          <Link href="/analysis" className="underline underline-offset-4">
            <T m={{ ja: "分析の考え方と5観点について", en: "About the analysis approach and the 5 perspectives" }} />
          </Link>
        </p>
      </div>
    );
  }

  if (analysisEntitled(plan)) return <>{children}</>;

  return (
    <div className="rounded-md border border-border bg-paper p-5 print:hidden md:p-6">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">ANALYSIS</p>
      <h3 className="mt-1 font-serif text-lg font-semibold"><T m={{ ja: "分析の詳細（分布・推移・経済指標）", en: "Analysis details (distribution, trends, economic indicators)" }} /></h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        <T m={{ ja: "各観点の要点（自社の値と業界の中央値）は上の表で無料で公開しています。分布の全体像（四分位・順位・パーセンタイル）、複数期の推移、業界に対応づけた経済指標との接続と、分析を含むレポート全体の印刷・PDF保存は、有効な購入コードをお持ちの方の範囲です。冒頭の「この会社の今」の答えも、同じコードで開きます。コードを入力すると、このブラウザで全分析が開きます。", en: "The key points for each perspective (the company's value and the industry median) are free in the table above. The full distribution (quartiles, rank, percentile), multi-year trends, links to economic indicators mapped to the industry, and printing or saving the entire report, including the analysis, as a PDF are available to those with a valid purchase code. The answer to \"This Company Now\" at the top opens with the same code. Enter the code to open the full analysis in this browser." }} />
      </p>
      <CodeEntryForm id="analysis-plan-code" entry={entry} />
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "購入コードは、権利の確認のためだけに送信され、このブラウザに保存されます。氏名や閲覧の記録は送られません。", en: "The purchase code is sent only to verify entitlement and is saved in this browser. Your name and browsing history are not sent." }} />
      </p>
      <p className="mt-3 text-sm">
        <Link href="/analysis" className="underline underline-offset-4">
          <T m={{ ja: "分析の考え方と5観点について", en: "About the analysis approach and the 5 perspectives" }} />
        </Link>
      </p>
    </div>
  );
}

/**
 * The gate of 「この会社の今」 (JCE-120): the meaning layer's answers are the analysis layer's core, so the
 * full sentences render only for an entitled reader — the same entitlement as AnalysisGate, and a code
 * entered in either gate opens both. A reader without the entitlement gets the entrance (`fallback`:
 * the heading and the questions this company answers, no sentence and no figure), with the code entry
 * directly under it. While the layer itself is off, the entrance stands alone and the layer's own
 * preparation note below carries the state.
 */
export function MeaningGate({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const plan = usePlan();
  const entry = useCodeEntry();

  if (analysisEntitled(plan)) return <>{children}</>;
  if (!ANALYSIS_FEATURES_OPEN) return <>{fallback}</>;

  return (
    <div className="print:hidden">
      {fallback}
      <CodeEntryForm id="meaning-plan-code" entry={entry} />
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <T m={{ ja: "購入コードは、権利の確認のためだけに送信され、このブラウザに保存されます。氏名や閲覧の記録は送られません。", en: "The purchase code is sent only to verify entitlement and is saved in this browser. Your name and browsing history are not sent." }} />
      </p>
    </div>
  );
}
