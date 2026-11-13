import type { FinancialDeepDive as DeepDive, Trend } from "@/lib/financial-deep-dive";
import { formatYen } from "@/lib/utils/format";

/**
 * 財務の深掘り (JCE-044), drawn on the server: one small chart per reading, the company in ink and the industry
 * median in grey, the latest value printed at the line's end and its ▲▼ against the industry's latest median
 * beneath the title. A year without a figure breaks the line rather than being bridged.
 */

const fmt = (unit: Trend["unit"], v: number) => (unit === "percent" ? `${(v * 100).toFixed(1)}%` : unit === "yen" ? formatYen(Math.round(v)) : v.toFixed(0));

function TrendChart({ trend }: { trend: Trend }) {
  const W = 300;
  const H = 120;
  const pad = { l: 8, r: 64, t: 12, b: 20 };
  const all = [...trend.company, ...trend.industry].map((p) => p.value).filter((v): v is number => v !== null);
  if (all.length === 0) return null;
  const base = trend.unit === "index" ? 100 : 0;
  const lo = Math.min(base, ...all);
  const hi = Math.max(base, ...all);
  const span = hi - lo || 1;
  const n = trend.company.length;
  const x = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / span) * (H - pad.t - pad.b);
  // One path per unbroken run, so a missing year is a gap.
  const path = (points: Trend["company"]) =>
    points
      .map((p, i) => (p.value === null ? null : `${i === 0 || points[i - 1]!.value === null ? "M" : "L"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");
  const last = [...trend.company].reverse().find((p) => p.value !== null);
  const lastIndex = last ? trend.company.lastIndexOf(last) : -1;
  const label = `${trend.title}。${trend.company.map((p) => `${p.label} ${p.value === null ? "確認できず" : fmt(trend.unit, p.value)}`).join("、")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
      {(trend.unit === "index" || lo < 0) && (
        <line x1={pad.l} x2={W - pad.r} y1={y(base)} y2={y(base)} stroke="currentColor" strokeOpacity={0.18} strokeWidth={1} />
      )}
      <path d={path(trend.industry)} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <path d={path(trend.company)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {trend.company.map((p, i) => p.value !== null && <circle key={i} cx={x(i)} cy={y(p.value)} r={3} fill="currentColor" stroke="var(--background)" strokeWidth={2} />)}
      {last && last.value !== null && (
        <text x={x(lastIndex) + 8} y={y(last.value)} dominantBaseline="central" fontSize={11} fontWeight={600} fill="currentColor" className="figures">
          {fmt(trend.unit, last.value)}
        </text>
      )}
      <text x={pad.l} y={H - 4} fontSize={9} fill="currentColor" opacity={0.6} className="figures">
        {trend.company[0]!.label.replace(/年.*$/, "")}
      </text>
      <text x={W - pad.r} y={H - 4} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.6} className="figures">
        {trend.company.at(-1)!.label.replace(/年.*$/, "")}
      </text>
    </svg>
  );
}

function Delta({ trend }: { trend: Trend }) {
  const own = [...trend.company].reverse().find((p) => p.value !== null)?.value ?? null;
  const ind = [...trend.industry].reverse().find((p) => p.value !== null)?.value ?? null;
  if (own === null || ind === null) return <p className="figures mt-1 text-xs text-muted-foreground">業界の値なし</p>;
  const diff = own - ind;
  const up = Math.abs(diff) < 1e-9 ? null : diff > 0;
  const shown = trend.unit === "percent" ? `${(Math.abs(diff) * 100).toFixed(1)}pt` : fmt(trend.unit, Math.abs(diff));
  return (
    <p className="figures mt-1 text-xs" style={up === null ? undefined : { color: up ? "oklch(0.45 0.12 150)" : "oklch(0.5 0.17 25)" }}>
      {up === null ? "業界の中央値と同じ" : `${up ? "▲" : "▼"} ${shown}（vs. 業界の中央値 ${fmt(trend.unit, ind)}）`}
    </p>
  );
}

const GROUPS: { title: string; lead: string; keys: string[] }[] = [
  { title: "利益率の推移", lead: "売上のうち、どれだけが利益として残っているか。5期でどちらへ動いているか。", keys: ["net-margin", "profit-margin"] },
  { title: "財務の健全性", lead: "持っているもののうち、借りたものではなく自分のものがどれだけか。", keys: ["equity-ratio"] },
  { title: "従業員1人あたり", lead: "働く人ひとりが生む売上と利益。人手で稼ぐ会社か、設備や仕組みで稼ぐ会社か。", keys: ["revenue-per-employee", "net-income-per-employee"] },
  { title: "規模の推移", lead: "5期前を100として、資産・自己資本・人員がどう動いたか。", keys: ["total-assets-index", "net-assets-index", "employees-index"] },
];

export function FinancialDeepDiveBlock({ deepDive }: { deepDive: DeepDive }) {
  const byKey = new Map(deepDive.trends.map((t) => [t.key, t]));
  return (
    <div className="mb-12">
      <h3 className="text-xs font-semibold tracking-[0.12em] text-muted-foreground">財務の深掘り（プレミアム）</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        5期の数値から、会社の構造がどう動いているかを読む。濃い線がこの会社、薄い線が{deepDive.industryName}業界の掲載企業の中央値（同じ期の位置どうし）。▲▼は最新期の中央値との差で、良し悪しの判定ではありません。
      </p>
      {GROUPS.map((group) => {
        const trends = group.keys.map((k) => byKey.get(k)).filter((t): t is Trend => t !== undefined);
        if (trends.length === 0) return null;
        return (
          <div key={group.title} className="mt-8">
            <h4 className="font-serif text-lg font-semibold">{group.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{group.lead}</p>
            <ul className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {trends.map((trend) => (
                <li key={trend.key} className="min-w-0">
                  <p className="text-sm font-medium">{trend.title}</p>
                  <Delta trend={trend} />
                  <div className="mt-2 max-w-xs">
                    <TrendChart trend={trend} />
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    計算値：{trend.formula}。業界 {trend.industryCompanies}社。
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <p className="mt-6 text-xs leading-5 text-muted-foreground">
        すべて有価証券報告書に印字された同じ年度の数値どうしの割り算です。数値の無い年度は線が途切れ、補っていません。株価にもとづく指標（ROE・PER など）は扱いません。
      </p>
    </div>
  );
}
