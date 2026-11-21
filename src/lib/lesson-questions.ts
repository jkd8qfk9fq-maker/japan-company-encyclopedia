import { companyMetrics } from "@/lib/company-metrics";
import { quarterlyView } from "@/lib/quarterly";
import { formatYen } from "@/lib/utils/format";
import type { Company } from "@/types/company";

/**
 * Lesson questions (JCE-082): generated per company from the entry's own printed figures, for the micro-lesson
 * layer. Where the quiz pool (JCE-052) asks the reader to compare two companies, these ask about one company:
 * what its latest printed revenue is (four choices), and — the predict-then-check form at the heart of the
 * hybrid design — whether that figure grew against the year before, asked before the figures are shown so the
 * reader commits to a reading first and then checks it against the filing.
 *
 * Every question keeps the records' `sourceIds` and the source's own title, so the answer can always be traced
 * back to the document. A direction derived from two printed figures is a computed value: the explanation
 * carries the label 計算値 and the formula, as everywhere else on the site. Distractor figures in the
 * four-choice question are arithmetic neighbours of the printed figure (the previous year's figure, a tenfold
 * or a tenth), never figures of another company presented as this one's.
 *
 * JCE-084 adds the kinds units two and three practise: the largest business of the segment note, the overseas
 * share and the per-employee figure (computed values from the same printed figures the report layer uses), the
 * issued share count as printed, and the quarterly kinds — the direction of a cumulative quarter against the
 * same period a year earlier (predict first, as with the annual directions) and the quarter's size against the
 * previous full year, a yardstick for progress that is never dressed up as the company's own forecast. Themes
 * the entries do not hold — capital expenditure and depreciation, major shareholders, company forecasts — get
 * no question: a lesson can teach the method in prose, but a question needs a figure that exists.
 */

export type LessonQuestionKind =
  | "figure"
  | "growth-revenue"
  | "growth-profit"
  | "segment-top"
  | "overseas-ratio"
  | "employees"
  | "growth-employees"
  | "shares"
  | "quarterly-direction"
  | "quarterly-progress";

export type LessonQuestion = {
  id: string;
  kind: LessonQuestionKind;
  companyId: string;
  companyName: string;
  industry: string | null;
  prompt: string;
  options: { id: string; label: string }[];
  answer: string;
  /** The printed figures the answer rests on, and the formula when a direction is computed from them. */
  explain: string;
  /** The period the figures belong to — a fiscal year, or the pair of years a direction compares. Always shown. */
  period: string;
  /** The filing records the figures rest on. */
  sourceIds: string[];
  /** The newest source's own title, shown under the explanation as the citation. */
  sourceTitle: string;
};

/** A stable pseudo-random order, the same hash the quiz pool uses, so the selection is fixed for a given build. */
const hash = (s: string) => {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

const primaryIndustry = (c: Company): string | null => (c.industries.find((i) => i.primary) ?? c.industries[0])?.industryId ?? null;

const byPeriodEnd = (c: Company) => [...c.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));

const pct = (change: number) => `${change > 0 ? "+" : ""}${(Math.round(change * 1000) / 10).toLocaleString("ja-JP")}%`;

/** How many questions of each kind the lesson layer takes at most; the lessons bind only a few of them. */
const CAP = 72;

export function buildLessonQuestions(companies: Company[]): LessonQuestion[] {
  const figures: LessonQuestion[] = [];
  const growthRevenue: LessonQuestion[] = [];
  const growthProfit: LessonQuestion[] = [];
  const segmentTop: LessonQuestion[] = [];
  const overseasRatio: LessonQuestion[] = [];
  const employees: LessonQuestion[] = [];
  const growthEmployees: LessonQuestion[] = [];
  const shares: LessonQuestion[] = [];
  const quarterlyDirection: LessonQuestion[] = [];
  const quarterlyProgress: LessonQuestion[] = [];

  const ordered = [...companies].sort((a, b) => hash(`lesson-${a.id}`) - hash(`lesson-${b.id}`));
  for (const c of ordered) {
    const records = byPeriodEnd(c);
    const latestRec = records.at(-1);
    if (!latestRec) continue;
    const source = c.sources.find((s) => latestRec.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === latestRec.sourceIds[0]);
    if (!source) continue;
    const base = { companyId: c.id, companyName: c.name, industry: primaryIndustry(c), sourceIds: latestRec.sourceIds, sourceTitle: source.title };

    // 最新期の売上高はどれか — the printed figure against its arithmetic neighbours.
    if (latestRec.revenue !== null && latestRec.revenue > 0) {
      const prev = records.at(-2);
      const candidates: { id: string; value: number }[] = [{ id: "actual", value: latestRec.revenue }];
      if (prev && prev.revenue !== null && prev.revenue > 0) {
        const ratio = prev.revenue / latestRec.revenue;
        if (ratio < 0.8 || ratio > 1.25) candidates.push({ id: "prev", value: prev.revenue });
      }
      candidates.push({ id: "tenfold", value: latestRec.revenue * 10 });
      if (latestRec.revenue >= 1e8) candidates.push({ id: "tenth", value: Math.round(latestRec.revenue / 10) });
      const labels = candidates.map((o) => formatYen(o.value));
      if (new Set(labels).size === candidates.length && candidates.length >= 3) {
        const options = [...candidates]
          .sort((a, b) => hash(`${c.id}-${a.id}`) - hash(`${c.id}-${b.id}`))
          .map((o) => ({ id: o.id, label: formatYen(o.value) }));
        figures.push({
          ...base,
          id: `figure-${c.id}`,
          kind: "figure",
          prompt: `${c.name}の最新期（${latestRec.fiscalYear}）の${latestRec.revenueLabel}はどれでしょう？`,
          options,
          answer: "actual",
          explain: `${c.name}の${latestRec.fiscalYear}の${latestRec.revenueLabel}は ${formatYen(latestRec.revenue)} です。有価証券報告書に載っている会社自身の数値です。`,
          period: latestRec.fiscalYear,
        });
      }
    }

    // 先読み型: the direction of the latest figure against the year before, from the two printed figures.
    const pair = records.slice(-2);
    if (pair.length === 2) {
      const [prev, cur] = pair as [(typeof pair)[0], (typeof pair)[0]];
      const direction = (
        kind: "growth-revenue" | "growth-profit",
        label: string,
        get: (r: (typeof pair)[0]) => number | null,
        threshold: number,
      ) => {
        const a = get(prev);
        const b = get(cur);
        if (a === null || b === null || a <= 0 || b <= 0) return;
        const change = b / a - 1;
        if (Math.abs(change) < threshold) return; // a near-flat year would make the direction a coin toss
        const up = change > 0;
        (kind === "growth-revenue" ? growthRevenue : growthProfit).push({
          ...base,
          id: `${kind}-${c.id}`,
          kind,
          prompt: `予想してから確かめましょう。${c.name}の${label}は、最新期（${cur.fiscalYear}）に前期より増えたでしょうか、減ったでしょうか？`,
          options: [
            { id: "up", label: "増えた" },
            { id: "down", label: "減った" },
          ],
          answer: up ? "up" : "down",
          explain: `${c.name}の${label}は、前期（${prev.fiscalYear}）${formatYen(a)} → 最新期（${cur.fiscalYear}）${formatYen(b)} で、${up ? "増えました" : "減りました"}。計算値：最新期 ÷ 前期 − 1 = ${pct(change)}。もとの2つの数値は有価証券報告書の印字値です。`,
          sourceIds: [...new Set([...prev.sourceIds, ...cur.sourceIds])],
          period: `${prev.fiscalYear} → ${cur.fiscalYear}`,
        });
      };
      direction("growth-revenue", latestRec.revenueLabel, (r) => r.revenue, 0.03);
      direction("growth-profit", "純利益", (r) => r.netIncome, 0.05);

      // 従業員数（連結）の方向 — the predict-first form applied to the headcount of the same two records.
      const a = prev.employees;
      const b = cur.employees;
      if (a !== null && b !== null && a > 0 && b > 0) {
        const change = b / a - 1;
        if (Math.abs(change) >= 0.02) {
          const up = change > 0;
          growthEmployees.push({
            ...base,
            id: `growth-employees-${c.id}`,
            kind: "growth-employees",
            prompt: `予想してから確かめましょう。${c.name}の従業員数（連結）は、最新期（${cur.fiscalYear}）に前期より増えたでしょうか、減ったでしょうか？`,
            options: [
              { id: "up", label: "増えた" },
              { id: "down", label: "減った" },
            ],
            answer: up ? "up" : "down",
            explain: `${c.name}の従業員数（連結）は、前期（${prev.fiscalYear}）${a.toLocaleString("ja-JP")}人 → 最新期（${cur.fiscalYear}）${b.toLocaleString("ja-JP")}人 で、${up ? "増えました" : "減りました"}。計算値：最新期 ÷ 前期 − 1 = ${pct(change)}。もとの2つの数値は有価証券報告書の印字値です。`,
            sourceIds: [...new Set([...prev.sourceIds, ...cur.sourceIds])],
            period: `${prev.fiscalYear} → ${cur.fiscalYear}`,
          });
        }
      }
    }

    // 従業員1人あたり売上高 — a computed value from the latest record's two printed figures (JCE-081's metric).
    if (latestRec.revenue !== null && latestRec.revenue > 0 && latestRec.employees !== null && latestRec.employees > 0) {
      const perEmployee = (revenue: number, headcount: number) => Math.round(revenue / headcount / 10000) * 10000;
      const actual = perEmployee(latestRec.revenue, latestRec.employees);
      const candidates: { id: string; value: number }[] = [{ id: "actual", value: actual }];
      const prevRec = records.at(-2);
      if (prevRec && prevRec.revenue !== null && prevRec.revenue > 0 && prevRec.employees !== null && prevRec.employees > 0) {
        const prevValue = perEmployee(prevRec.revenue, prevRec.employees);
        const ratio = prevValue / actual;
        if (ratio < 0.8 || ratio > 1.25) candidates.push({ id: "prev", value: prevValue });
      }
      candidates.push({ id: "double", value: actual * 2 }, { id: "half", value: Math.round(actual / 2 / 10000) * 10000 });
      const labels = candidates.map((o) => formatYen(o.value));
      if (new Set(labels).size === candidates.length && candidates.length >= 3) {
        const options = [...candidates]
          .sort((x, y) => hash(`${c.id}-emp-${x.id}`) - hash(`${c.id}-emp-${y.id}`))
          .map((o) => ({ id: o.id, label: formatYen(o.value) }));
        employees.push({
          ...base,
          id: `employees-${c.id}`,
          kind: "employees",
          prompt: `${c.name}の最新期（${latestRec.fiscalYear}）の従業員1人あたり${latestRec.revenueLabel}は、およそどれでしょう？`,
          options,
          answer: "actual",
          explain: `計算値：${latestRec.revenueLabel} ${formatYen(latestRec.revenue)} ÷ 従業員数（連結）${latestRec.employees.toLocaleString("ja-JP")}人 = ${formatYen(actual)}。2つの数値は有価証券報告書の印字値です。`,
          period: latestRec.fiscalYear,
        });
      }
    }

    // 事業別の売上 — the largest business of the segment note, against the company's own other businesses.
    const seg = c.segmentRevenue;
    if (seg && seg.items.length >= 2) {
      const named = seg.items
        .map((i) => ({ amount: i.amount, name: c.businesses.find((b) => b.id === i.businessId)?.shortName ?? c.businesses.find((b) => b.id === i.businessId)?.name, businessId: i.businessId }))
        .filter((i): i is { amount: number; name: string; businessId: string } => Boolean(i.name) && i.amount > 0)
        .sort((x, y) => y.amount - x.amount);
      const [top, second] = named;
      const segSource = c.sources.find((s) => seg.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === seg.sourceIds[0]);
      if (top && second && segSource && top.amount >= second.amount * 1.25) {
        const total = named.reduce((sum, i) => sum + i.amount, 0);
        const share = Math.round((top.amount / total) * 1000) / 10;
        const options = named
          .slice(0, 4)
          .sort((x, y) => hash(`${c.id}-seg-${x.businessId}`) - hash(`${c.id}-seg-${y.businessId}`))
          .map((i) => ({ id: i.businessId, label: i.name }));
        segmentTop.push({
          companyId: c.id,
          companyName: c.name,
          industry: primaryIndustry(c),
          sourceIds: seg.sourceIds,
          sourceTitle: segSource.title,
          id: `segment-top-${c.id}`,
          kind: "segment-top",
          prompt: `${c.name}の${seg.fiscalYear}の売上高の内訳（事業別）のうち、いちばん金額が大きい事業はどれでしょう？`,
          options,
          answer: top.businessId,
          explain: `${top.name}が ${formatYen(top.amount)} で最大です。計算値：${top.name}の金額 ÷ 事業別の${seg.label}の合計（${formatYen(total)}）= ${share}%。金額は有価証券報告書の事業別情報の印字値です。`,
          period: seg.fiscalYear,
        });
      }
    }

    // 海外売上高比率 — the computed ratio of JCE-038, against its arithmetic neighbours in points.
    const overseas = companyMetrics(c)?.overseasSalesRatio ?? null;
    if (overseas) {
      const p = overseas.percent;
      const rounded = Math.round(p);
      const unique = [...new Set([rounded, rounded + 20, rounded - 20, 100 - rounded])].filter((v) => v === rounded || (v >= 1 && v <= 99 && Math.abs(v - rounded) >= 8));
      if (unique.length >= 3) {
        const options = unique
          .sort((x, y) => hash(`${c.id}-ovs-${x}`) - hash(`${c.id}-ovs-${y}`))
          .map((v) => ({ id: `p${v}`, label: `約${v}％` }));
        const ratioSource = c.sources.find((s) => overseas.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === overseas.sourceIds[0]);
        if (ratioSource) {
          overseasRatio.push({
            companyId: c.id,
            companyName: c.name,
            industry: primaryIndustry(c),
            sourceIds: overseas.sourceIds,
            sourceTitle: ratioSource.title,
            id: `overseas-ratio-${c.id}`,
            kind: "overseas-ratio",
            prompt: `${c.name}の${overseas.fiscalYear}の売上高のうち、海外の割合はおよそどれくらいでしょう？`,
            options,
            answer: `p${rounded}`,
            explain: `計算値：${overseas.formula} = ${p}%。もとの金額は有価証券報告書の地域別情報の印字値です。`,
            period: overseas.fiscalYear,
          });
        }
      }
    }

    // 発行済株式総数 — the printed count of the filing company (JCE-066), against its arithmetic neighbours.
    const sf = c.shareFacts;
    if (sf && sf.issuedShares !== null && sf.issuedShares > 0) {
      const fmtShares = (v: number) => `${v.toLocaleString("ja-JP")}株`;
      const candidates: { id: string; value: number }[] = [
        { id: "actual", value: sf.issuedShares },
        { id: "tenfold", value: sf.issuedShares * 10 },
        { id: "tenth", value: Math.round(sf.issuedShares / 10) },
        { id: "double", value: sf.issuedShares * 2 },
      ];
      const labels = candidates.map((o) => fmtShares(o.value));
      const shareSource = c.sources.find((s) => sf.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === sf.sourceIds[0]);
      if (shareSource && new Set(labels).size === candidates.length) {
        const options = [...candidates]
          .sort((x, y) => hash(`${c.id}-shr-${x.id}`) - hash(`${c.id}-shr-${y.id}`))
          .map((o) => ({ id: o.id, label: fmtShares(o.value) }));
        shares.push({
          companyId: c.id,
          companyName: c.name,
          industry: primaryIndustry(c),
          sourceIds: sf.sourceIds,
          sourceTitle: shareSource.title,
          id: `shares-${c.id}`,
          kind: "shares",
          prompt: `${c.name}の発行済株式総数（${sf.fiscalYear}、提出会社）は、およそどれでしょう？`,
          options,
          answer: "actual",
          explain: `${c.name}の発行済株式総数は ${fmtShares(sf.issuedShares)} です。有価証券報告書の「主要な経営指標等の推移」に載っている、提出会社自身の数値です。`,
          period: sf.fiscalYear,
        });
      }
    }

    // 四半期の動き (JCE-049) — the direction of the newest cumulative quarter against the same period a year
    // earlier, asked predict-first; and its size against the previous full year, as a progress yardstick.
    const view = quarterlyView(c);
    if (view) {
      const point = view.points.filter((p) => p.key !== "fy" && p.revenue !== null && p.priorRevenue !== null && p.revenueChange !== null).at(-1);
      if (point && point.revenueChange !== null && Math.abs(point.revenueChange) >= 0.03) {
        const up = point.revenueChange > 0;
        const sourceTitle = c.sources.find((s) => point.sourceIds.includes(s.id))?.title;
        if (sourceTitle) {
          const docNote =
            point.source === "edinet-db"
              ? "四半期の売上は、決算短信の数値（EDINET DB 経由）です。"
              : point.source === "hanki"
                ? "中間期の売上は、半期報告書の数値です。"
                : "四半期の売上は、開示資料の数値です。";
          quarterlyDirection.push({
            companyId: c.id,
            companyName: c.name,
            industry: primaryIndustry(c),
            sourceIds: point.sourceIds,
            sourceTitle,
            id: `quarterly-direction-${c.id}`,
            kind: "quarterly-direction",
            prompt: `予想してから確かめましょう。${c.name}の今期（${view.fiscalYear}）${point.label}（累計）の売上は、前年の同じ時期より増えたでしょうか、減ったでしょうか？`,
            options: [
              { id: "up", label: "増えた" },
              { id: "down", label: "減った" },
            ],
            answer: up ? "up" : "down",
            explain: `${c.name}の${view.fiscalYear} ${point.label}（累計）の売上は ${formatYen(point.revenue!)} で、前年の同じ時期の ${formatYen(point.priorRevenue!)} から${up ? "増えました" : "減りました"}。計算値：今期 ÷ 前年の同じ時期 − 1 = ${pct(point.revenueChange)}。${docNote}`,
            period: `${view.fiscalYear} ${point.label}（前年同期比）`,
          });
        }
      }
      const fyPoint = view.points.find((p) => p.key === "fy");
      if (point && fyPoint && fyPoint.priorRevenue !== null && fyPoint.priorRevenue > 0 && point.revenue !== null) {
        const ratio = point.revenue / fyPoint.priorRevenue;
        if (ratio >= 0.05 && ratio <= 1.5) {
          const baseWari = Math.round(ratio * 10);
          const values = [...new Set([baseWari, baseWari + 2, baseWari - 2, baseWari + 4])].filter((v) => v >= 1);
          if (values.length >= 3) {
            const sourceTitle = c.sources.find((s) => point.sourceIds.includes(s.id))?.title;
            if (sourceTitle) {
              const options = values
                .sort((x, y) => hash(`${c.id}-prg-${x}`) - hash(`${c.id}-prg-${y}`))
                .map((v) => ({ id: `w${v}`, label: `約${v}割` }));
              quarterlyProgress.push({
                companyId: c.id,
                companyName: c.name,
                industry: primaryIndustry(c),
                sourceIds: [...new Set([...point.sourceIds, ...fyPoint.sourceIds])],
                sourceTitle,
                id: `quarterly-progress-${c.id}`,
                kind: "quarterly-progress",
                prompt: `${c.name}の今期（${view.fiscalYear}）${point.label}（累計）の売上は、前年（${view.priorFiscalYear}）の通期売上のおよそ何割でしょう？`,
                options,
                answer: `w${baseWari}`,
                explain: `計算値：${point.label}（累計）の売上 ${formatYen(point.revenue)} ÷ 前年（${view.priorFiscalYear}）の通期売上 ${formatYen(fyPoint.priorRevenue)} = ${Math.round(ratio * 1000) / 10}%。四半期の数字は途中経過で、通期の実績ではありません。`,
                period: `${view.fiscalYear} ${point.label}時点`,
              });
            }
          }
        }
      }
    }
  }

  return [
    ...figures.slice(0, CAP),
    ...growthRevenue.slice(0, CAP),
    ...growthProfit.slice(0, CAP),
    ...segmentTop.slice(0, CAP),
    ...overseasRatio.slice(0, CAP),
    ...employees.slice(0, CAP),
    ...growthEmployees.slice(0, CAP),
    ...shares.slice(0, CAP),
    ...quarterlyDirection.slice(0, CAP),
    ...quarterlyProgress.slice(0, CAP),
  ];
}
