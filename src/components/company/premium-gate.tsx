"use client";

import { useState } from "react";
import { applyPlan, checkPlan, isValidCode, PLAN_PAGE, usePlan } from "@/lib/plan";

/**
 * Wraps a part of the page that belongs to the YUGENQ premium plan (JCE-043). The static HTML always holds the
 * free view: a short description of what the part shows and where the plan is sold, with a field for a purchase
 * code. Once this browser holds a paid plan, the children are shown. The gate is a view switch, not a wall:
 * everything behind it is computed from public filings, and the plan pays for the convenience of seeing it
 * here (the same rule the 診断 site applies to its own paid parts).
 */
export function PremiumGate({ title, teaser, children }: { title: string; teaser: string; children: React.ReactNode }) {
  const plan = usePlan();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "inactive" | "error">("idle");

  if (plan) return <>{children}</>;

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

  return (
    <div className="rounded-md border border-border bg-paper p-5 md:p-6">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">PREMIUM</p>
      <h3 className="mt-1 font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{teaser}</p>
      <p className="mt-3 text-sm leading-6">
        プレミアムプラン（月額390円・税込）は、企業タイプ診断・最初の一社と共通です。
        <a href={PLAN_PAGE} className="ml-1 underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener">
          プランの内容と申し込み
        </a>
        ・すでに申し込んだ方は
        <a href={`${PLAN_PAGE}#recover`} className="ml-1 underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener">
          メールで復元
        </a>
        （開いたあと、このページを再読み込みしてください）
      </p>
      <form onSubmit={submit} className="mt-4 flex max-w-md flex-wrap items-center gap-2">
        <label htmlFor="plan-code" className="sr-only">
          購入コード
        </label>
        <input
          id="plan-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="購入コード（sub_…）"
          autoComplete="off"
          spellCheck={false}
          className="figures min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!isValidCode(code) || status === "sending"}
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
        >
          {status === "sending" ? "確認中…" : "コードで開く"}
        </button>
      </form>
      {status === "inactive" && <p className="mt-2 text-xs text-muted-foreground">このコードのプランは、いま有効ではありません。</p>}
      {status === "error" && <p className="mt-2 text-xs text-muted-foreground">確認できませんでした。しばらくしてからもう一度お試しください。</p>}
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        購入コードは、プランの確認のためだけに企業タイプ診断のサーバーへ送られ、このブラウザに保存されます。氏名や閲覧の記録は送られません。
      </p>
    </div>
  );
}
