"use client";

// A Client Component: the reader's conditions are applied in the browser to the build-time index (JCE-060); nothing
// about what they look for is sent anywhere.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import {
  applyConditions,
  EMPTY_CONDITIONS,
  REVENUE_BANDS,
  SAVED_CONDITIONS_LIMITS,
  SORT_LABELS,
  sortRows,
  type Conditions,
  type ScreeningIndex,
  type SortKey,
} from "@/lib/screening";
import { usePlan } from "@/lib/plan";
import { savedScreeningsStore } from "@/lib/storage/stores";
import { formatYen } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const PREFECTURES = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];

const STEPS = {
  growthMin: [{ v: 1, label: "減っていない（1.0倍以上）" }, { v: 1.2, label: "1.2倍以上" }, { v: 1.5, label: "1.5倍以上" }, { v: 2, label: "2倍以上" }],
  marginMin: [{ v: 0, label: "黒字（0%以上）" }, { v: 5, label: "5%以上" }, { v: 10, label: "10%以上" }, { v: 20, label: "20%以上" }],
  overseasMin: [{ v: 10, label: "10%以上" }, { v: 30, label: "30%以上" }, { v: 50, label: "50%以上" }, { v: 70, label: "70%以上" }],
  employeesMin: [{ v: 100, label: "100人以上" }, { v: 1000, label: "1,000人以上" }, { v: 5000, label: "5,000人以上" }, { v: 10000, label: "1万人以上" }],
} as const;

const PAGE = 50;
const select = "min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm";

function summary(c: Conditions, names: Map<string, string>): string {
  const parts = [
    ...c.industries.map((id) => names.get(id) ?? id),
    c.prefecture,
    REVENUE_BANDS.find((b) => b.id === c.revenueBand)?.name,
    c.growthMin !== null ? `伸び${c.growthMin}倍以上` : null,
    c.marginMin !== null ? `純利益率${c.marginMin}%以上` : null,
    c.overseasMin !== null ? `海外${c.overseasMin}%以上` : null,
    c.employeesMin !== null ? `${c.employeesMin.toLocaleString("ja-JP")}人以上` : null,
  ].filter(Boolean);
  return parts.join("・") || "条件なし";
}

export function ScreeningTool() {
  const [index, setIndex] = useState<ScreeningIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [c, setC] = useState<Conditions>(EMPTY_CONDITIONS);
  const [sort, setSort] = useState<SortKey>("revenue");
  const [shown, setShown] = useState(PAGE);
  const saved = useLocalStore(savedScreeningsStore);
  const savedLimit = usePlan() ? SAVED_CONDITIONS_LIMITS.premium : SAVED_CONDITIONS_LIMITS.free;

  useEffect(() => {
    fetch("/screening.json")
      .then((r) => (r.ok ? (r.json() as Promise<ScreeningIndex>) : Promise.reject(new Error(String(r.status)))))
      .then(setIndex, () => setFailed(true));
  }, []);

  const names = useMemo(() => new Map((index?.industries ?? []).map((i) => [i.id, i.name])), [index]);
  const result = useMemo(() => (index ? applyConditions(index.rows, c) : null), [index, c]);
  const sorted = useMemo(() => (result ? sortRows(result.matches, sort) : []), [result, sort]);

  const set = <K extends keyof Conditions>(key: K, value: Conditions[K]) => {
    setC((prev) => ({ ...prev, [key]: value }));
    setShown(PAGE);
  };
  const numberSelect = (key: "growthMin" | "marginMin" | "overseasMin" | "employeesMin", label: string) => (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <select className={cn(select, "mt-1")} value={c[key] ?? ""} onChange={(e) => set(key, e.target.value === "" ? null : Number(e.target.value))}>
        <option value="">指定しない</option>
        {STEPS[key].map((s) => (
          <option key={s.v} value={s.v}>{s.label}</option>
        ))}
      </select>
    </label>
  );

  if (failed) return <p className="text-sm text-muted-foreground">データを読み込めませんでした。通信状態を確かめて、もう一度開いてください。</p>;
  if (!index || !result) return <p className="text-sm text-muted-foreground">読み込んでいます…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <section aria-label="条件" className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium">業界（いくつでも）</legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {index.industries.map((i) => {
              const on = c.industries.includes(i.id);
              return (
                <button
                  key={i.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set("industries", on ? c.industries.filter((x) => x !== i.id) : [...c.industries, i.id])}
                  className={cn("min-h-9 rounded-full border px-3 text-xs", on ? "border-navy bg-navy text-white" : "border-border hover:border-foreground")}
                >
                  {i.name}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="block text-sm">
          <span className="font-medium">本社の都道府県</span>
          <select className={cn(select, "mt-1")} value={c.prefecture ?? ""} onChange={(e) => set("prefecture", e.target.value || null)}>
            <option value="">指定しない</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">売上高の規模（最新期）</span>
          <select className={cn(select, "mt-1")} value={c.revenueBand ?? ""} onChange={(e) => set("revenueBand", e.target.value || null)}>
            <option value="">指定しない</option>
            {REVENUE_BANDS.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>
        {numberSelect("growthMin", "5期の売上高の伸び")}
        {numberSelect("marginMin", "純利益率")}
        {numberSelect("overseasMin", "海外売上高比率")}
        {numberSelect("employeesMin", "従業員数（連結）")}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setC(EMPTY_CONDITIONS); setShown(PAGE); }} className="min-h-11 rounded-full border border-border px-4 text-sm hover:border-foreground">
            条件をクリア
          </button>
          <button
            type="button"
            disabled={saved.length >= savedLimit}
            onClick={() => savedScreeningsStore.set([{ name: summary(c, names), conditions: c }, ...saved].slice(0, savedLimit))}
            className="min-h-11 rounded-full bg-navy px-4 text-sm font-medium text-white disabled:opacity-50"
          >
            この条件を保存
          </button>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">保存した条件（この端末だけ・{saved.length}/{savedLimit}{savedLimit === SAVED_CONDITIONS_LIMITS.free ? `・プレミアムプランでは${SAVED_CONDITIONS_LIMITS.premium}件まで` : ""}）</p>
          <ul className="mt-1 space-y-1">
            {saved.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <button type="button" className="flex-1 truncate text-left underline-offset-2 hover:underline" onClick={() => { setC(s.conditions); setShown(PAGE); }}>
                  {s.name}
                </button>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => savedScreeningsStore.set(saved.filter((_, j) => j !== i))} aria-label={`「${s.name}」を削除`}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="結果" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <p className="text-sm">
            <span className="font-serif text-2xl font-semibold figures">{sorted.length.toLocaleString("ja-JP")}</span> 社が当てはまります
            {result.withoutData > 0 && <span className="ml-2 text-xs text-muted-foreground">（条件の数値がない {result.withoutData.toLocaleString("ja-JP")} 社は「データなし」として除外）</span>}
          </p>
          <label className="text-sm">
            <span className="sr-only">並べ替え</span>
            <select className={select} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>{SORT_LABELS[k]}</option>
              ))}
            </select>
          </label>
        </div>
        <ul className="divide-y divide-border">
          {sorted.slice(0, shown).map((r) => (
            <li key={r.id} className="py-3">
              <Link href={`/companies/${r.id}`} className="font-medium underline-offset-2 hover:underline">{r.name}</Link>
              <p className="text-xs text-muted-foreground">
                {names.get(r.industries[0] ?? "") ?? "—"}・{r.prefecture ?? "本社所在地なし"}{r.fiscalYear ? `・${r.fiscalYear}` : ""}
              </p>
              <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs sm:grid-cols-5">
                <div><dt className="inline text-muted-foreground">売上高 </dt><dd className="inline figures">{r.revenue !== null ? formatYen(r.revenue) : "データなし"}</dd></div>
                <div><dt className="inline text-muted-foreground">5期の伸び </dt><dd className="inline figures">{r.growth5y !== null ? `${r.growth5y.toFixed(2)}倍` : "データなし"}</dd></div>
                <div><dt className="inline text-muted-foreground">純利益率 </dt><dd className="inline figures">{r.netMargin !== null ? `${r.netMargin}%` : "データなし"}</dd></div>
                <div><dt className="inline text-muted-foreground">海外 </dt><dd className="inline figures">{r.overseas !== null ? `${r.overseas}%` : "データなし"}</dd></div>
                <div><dt className="inline text-muted-foreground">従業員 </dt><dd className="inline figures">{r.employees !== null ? `${r.employees.toLocaleString("ja-JP")}人` : "データなし"}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
        {shown < sorted.length && (
          <button type="button" onClick={() => setShown(shown + PAGE)} className="mt-4 min-h-11 w-full rounded-full border border-border text-sm hover:border-foreground">
            さらに表示（残り {(sorted.length - shown).toLocaleString("ja-JP")} 社）
          </button>
        )}
        <p className="mt-6 text-xs leading-6 text-muted-foreground">
          数値は各社の有価証券報告書の最新期（{index.asOf} 時点の掲載データ）。計算値: 純利益率＝純利益 ÷ 売上高、海外売上高比率＝国内以外の地域の売上 ÷ 地域別の売上の合計、5期の売上高の伸び＝最新期の売上高 ÷ 5期前の売上高。並びは数値の大きさの順で、良し悪しの判定ではありません。株価や投資の判断材料は扱いません。
        </p>
      </section>
    </div>
  );
}
