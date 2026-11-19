"use client";

// A Client Component: the companies come from the address (?ids=…) and the reader's picks, both only in the browser,
// and the plan that allows a third company is known only here (JCE-043/061).

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PremiumGate } from "@/components/company/premium-gate";
import { ReportPrintButton } from "@/components/company/report-print-button";
import { ComparePlacement } from "./compare-placement";
import { barShares, COMPARE_LIMITS, compareHref, parseIds, type CompareIndex, type CompareRow } from "@/lib/compare";
import { usePlan } from "@/lib/plan";
import { formatYen } from "@/lib/utils/format";

type Metric = {
  key: "revenue" | "netIncome" | "netMargin" | "growth5y" | "employees" | "overseas";
  label: string;
  /** Shown under the label: the filing's own line, or the formula of a computed figure. */
  note: (rows: CompareRow[]) => string;
  format: (v: number) => string;
};

// With five companies the filings' own wordings of one line ran to a dozen lines of row header; past two, the row
// says so in plain words (each wording is still on its company page).
const distinct = (values: (string | null)[]) => {
  const labels = [...new Set(values.filter((v): v is string => v !== null))];
  return labels.length > 2 ? "各社が印字した行（名前は会社ごとに異なります）" : labels.join("／");
};

const METRICS: Metric[] = [
  { key: "revenue", label: "売上高", note: (rows) => distinct(rows.map((r) => r.revenueLabel)) || "印字どおり", format: formatYen },
  { key: "netIncome", label: "純利益", note: (rows) => distinct(rows.map((r) => r.netIncomeLabel)) || "印字どおり", format: formatYen },
  { key: "netMargin", label: "純利益率", note: () => "計算値：純利益 ÷ 売上高（同じ期）", format: (v) => `${v}%` },
  { key: "growth5y", label: "5期の売上高の伸び", note: () => "計算値：最新期の売上高 ÷ 5期前の売上高", format: (v) => `${v.toFixed(2)}倍` },
  { key: "employees", label: "従業員数（連結）", note: () => "印字どおり", format: (v) => `${v.toLocaleString("ja-JP")}人` },
  { key: "overseas", label: "海外売上高比率", note: () => "計算値：国内以外の地域の売上 ÷ 地域別の売上の合計", format: (v) => `${v}%` },
];

export function CompareTool() {
  const [index, setIndex] = useState<CompareIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [ids, setIds] = useState<string[] | null>(null);
  const [query, setQuery] = useState("");
  const plan = usePlan();
  const limit = plan ? COMPARE_LIMITS.premium : COMPARE_LIMITS.free;

  useEffect(() => {
    // The address is read after hydration: the static page cannot know it, and a shared link must open as sent.
    fetch("/compare.json")
      .then((r) => (r.ok ? (r.json() as Promise<CompareIndex>) : Promise.reject(new Error(String(r.status)))))
      .then(
        (data) => {
          setIds(parseIds(new URLSearchParams(window.location.search).get("ids")));
          setIndex(data);
        },
        () => setFailed(true),
      );
  }, []);

  const byId = useMemo(() => new Map((index?.rows ?? []).map((r) => [r.id, r])), [index]);
  const chosen = useMemo(() => (ids ?? []).map((id) => byId.get(id)).filter((r): r is CompareRow => r !== undefined), [ids, byId]);
  const shown = chosen.slice(0, limit);
  const held = chosen.length - shown.length;

  const update = (next: string[]) => {
    setIds(next);
    setQuery("");
    window.history.replaceState(window.history.state, "", compareHref(next));
  };

  const matches = useMemo(() => {
    const q = query.trim();
    if (!index || q === "") return [];
    return index.rows.filter((r) => !chosen.some((c) => c.id === r.id) && r.name.includes(q)).slice(0, 8);
  }, [index, query, chosen]);

  // Same-industry companies of the first pick, largest revenue first: a starting point, not a recommendation.
  const peers = useMemo(() => {
    const first = chosen[0];
    if (!index || !first?.industry) return [];
    return index.rows
      .filter((r) => r.industry === first.industry && !chosen.some((c) => c.id === r.id) && r.revenue !== null)
      .sort((a, b) => b.revenue! - a.revenue!)
      .slice(0, 4);
  }, [index, chosen]);

  if (failed) return <p className="text-sm text-muted-foreground">データを読み込めませんでした。通信状態を確かめて、もう一度開いてください。</p>;
  if (!index || ids === null) return <p className="text-sm text-muted-foreground">読み込んでいます…</p>;

  const canAdd = chosen.length < COMPARE_LIMITS.premium;

  return (
    <div className="space-y-8">
      <section aria-label="見比べる企業" className="space-y-3">
        <ul className="flex flex-wrap gap-2">
          {chosen.map((r) => (
            <li key={r.id} className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border pl-4 pr-1 text-sm">
              {r.name}
              <button type="button" onClick={() => update(chosen.filter((c) => c.id !== r.id).map((c) => c.id))} className="inline-flex size-9 items-center justify-center rounded-full hover:bg-muted" aria-label={`${r.name}を外す`}>
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
        {canAdd && (
          <div className="max-w-md">
            <label className="block text-sm">
              <span className="font-medium">企業を追加（{chosen.length}/{COMPARE_LIMITS.premium}社）</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="企業名で探す"
                className="mt-1 min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
              />
            </label>
            {matches.length > 0 && (
              <ul className="mt-1 divide-y divide-border rounded-md border border-border">
                {matches.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => update([...chosen.map((c) => c.id), r.id])} className="flex min-h-11 w-full items-center justify-between px-3 text-left text-sm hover:bg-muted">
                      {r.name}
                      <span className="text-xs text-muted-foreground">{r.industry ?? ""}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {peers.length > 0 && (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xs text-muted-foreground">同じ業界（{chosen[0]!.industry}）から：</span>
                {peers.map((r) => (
                  <button key={r.id} type="button" onClick={() => update([...chosen.map((c) => c.id), r.id])} className="min-h-9 rounded-full border border-border px-3 text-xs hover:border-foreground">
                    ＋ {r.name}
                  </button>
                ))}
              </p>
            )}
          </div>
        )}
      </section>

      {shown.length < 2 ? (
        <p className="text-sm leading-7 text-muted-foreground">
          {shown.length === 0 ? "見比べる企業を2社以上選んでください。" : "もう1社選ぶと、横に並べて見比べられます。"}
          企業のページの「見比べる」からも追加できます。
        </p>
      ) : (
        <>
          {plan && (
            <div className="no-print flex flex-wrap items-center gap-3">
              <ReportPrintButton target="compare-report" />
              <p className="text-xs text-muted-foreground">表と業界の中での位置、出典をA4にまとめます。ブラウザの印刷画面で「PDFに保存」を選ぶと PDF になります。</p>
            </div>
          )}
          <article id="compare-report" aria-label="見比べ" className="space-y-8">
            {/* Paper has no page heading around it: the printed copy carries its own. */}
            <header className="hidden border-b-2 border-foreground pb-2 print:block">
              <p className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground">日本企業百科事典 見比べ</p>
              <p className="mt-1 font-serif text-xl font-semibold">{shown.map((r) => r.name).join("・")}</p>
            </header>
            <section aria-label="見比べ" className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-sm">
                <caption className="sr-only">{shown.map((r) => r.name).join("・")}の見比べ</caption>
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="sticky left-0 z-10 w-36 min-w-[7.5rem] bg-background py-3 pr-3 text-xs font-medium text-muted-foreground">項目</th>
                    {shown.map((r) => (
                      <th key={r.id} scope="col" className="min-w-[8rem] py-3 pr-3 align-bottom">
                        <Link href={`/companies/${r.id}`} className="font-medium underline-offset-2 hover:underline">{r.name}</Link>
                        <span className="block text-xs font-normal text-muted-foreground">{r.industry ?? "—"}・{r.fiscalYear ?? "決算期なし"}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((m) => {
                    const values = shown.map((r) => r[m.key]);
                    const shares = barShares(values);
                    return (
                      <tr key={m.key} className="border-b border-border align-top">
                        <th scope="row" className="sticky left-0 z-10 min-w-[7.5rem] bg-background py-3 pr-3 text-left font-medium">
                          {m.label}
                          <span className="mt-0.5 block text-xs font-normal leading-5 text-muted-foreground">{m.note(shown)}</span>
                        </th>
                        {values.map((v, i) => (
                          <td key={shown[i]!.id} className="py-3 pr-3">
                            {v === null ? (
                              <span className="text-muted-foreground">データなし</span>
                            ) : (
                              <>
                                <span className="figures">{m.format(v)}</span>
                                {m.key === "growth5y" && shown[i]!.growthFrom && <span className="block text-xs text-muted-foreground">{shown[i]!.growthFrom}から</span>}
                                <span className="mt-1.5 block h-2 rounded-full bg-muted" aria-hidden>
                                  <span className={v < 0 ? "block h-2 rounded-full bg-seal" : "block h-2 rounded-full bg-navy dark:bg-ink"} style={{ width: `${Math.max(2, shares[i]! * 100)}%` }} />
                                </span>
                              </>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {plan && <ComparePlacement shown={shown} />}

            <section aria-label="出典" className="text-xs leading-6 text-muted-foreground">
              <p className="font-medium text-foreground">出典（決算期）</p>
              <ul className="mt-1">
                {shown.map((r) => (
                  <li key={r.id}>
                    {r.name}：
                    {r.source ? (
                      <a href={r.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                        {r.source.title}
                      </a>
                    ) : (
                      "出典なし"
                    )}
                    {r.fiscalYear ? `（${r.fiscalYear}）` : ""}
                    {r.source && <span className="hidden break-all print:inline"> {r.source.url}</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                数値は各社の最新期の有価証券報告書に印字された値と、そこから計算した値です（{index.asOf} 時点の掲載データ）。決算期・会計基準・連結の範囲が会社ごとに異なることがあります。事実を並べたもので、良し悪しや投資の判断を示すものではありません。株価・時価総額・バリュエーション、信用評価や格付けは含みません。
              </p>
              {plan && (
                <p className="mt-1 hidden print:block">
                  プレミアムプランの方は、出典の記載を残したまま、この見比べを印刷・PDFにして社内外の方に提示できます。出典：日本企業百科事典 {window.location.origin}
                  {compareHref(shown.map((r) => r.id))}
                </p>
              )}
            </section>
          </article>

          {!plan && (
            <PremiumGate
              title="業界の中での位置と、5社までの見比べ"
              teaser={`プレミアムプランでは${COMPARE_LIMITS.premium}社までを一度に並べ、各社が自分の業界の掲載企業の中でどこにいるか（売上高・利益率・自己資本比率・1人あたり売上高・平均年間給与などの中央値・第1〜第3四分位・順位）を同じ表で読み、出典つきで印刷・PDFにできます。${held > 0 ? `いま選んでいる${chosen.slice(limit).map((r) => r.name).join("・")}も並びます。` : ""}`}
              returnAnchor="compare"
            >
              {null}
            </PremiumGate>
          )}
        </>
      )}
    </div>
  );
}
