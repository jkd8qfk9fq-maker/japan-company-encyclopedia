import { runDecompModule } from "@/lib/analysis-decomposition";
import { companyMetrics } from "@/lib/company-metrics";
import { quarterlyView } from "@/lib/quarterly";
import { formatYen } from "@/lib/utils/format";
import type { Company, FinancialRecord, FinancialStatements, StatementLine, StatementRole } from "@/types/company";

/**
 * Lesson questions (JCE-082, rebuilt in JCE-090): generated per company from the entry's own printed
 * figures, for the micro-lesson layer. The rebuild follows the stumbling-point design (docs/decisions.md,
 * JCE-090): a figure is never the thing asked. What is asked is the reading — which row of the table a
 * stage is, how two stages moved against each other, what a company's own label says about the yardstick
 * it files under, which amounts feed a computed ratio — so the question survives the next fiscal year.
 * The figures ride along inside an excerpt table, printed as filed, and the answer is a row, a stage, a
 * label or a relation, never a memorised value.
 *
 * What was dropped, and why: the four-choice "what is the latest revenue" question (figure), the issued
 * share count (shares), the per-employee value (employees), the overseas share value (overseas-ratio) and
 * the quarter's share of the previous full year (quarterly-progress) all asked for a value that the next
 * period replaces. Their readings live on in other forms — the relation and region questions below,
 * and authored procedure questions in src/lib/structure-questions.ts.
 *
 * Direction questions (the predict-then-check form at the heart of the hybrid design, JCE-082) are kept,
 * but never without a clue: a direction asked with nothing to read first is a coin toss and teaches no
 * reading. The clue is itself data — the company's business mix, or the same figure's move a year
 * earlier — computed from printed figures and labelled 計算値. A company no clue can be built for gets
 * no direction question.
 *
 * Every question keeps the records' `sourceIds` and the source's own title, so the answer can always be
 * traced back to the document. Anything derived from two printed figures is a computed value: the
 * explanation carries the label 計算値 and the formula, as everywhere else on the site.
 *
 * JCE-145 adds the analysis kinds the 分析級 units practise: the margin's move over two periods
 * (margin-shift), which stage's change is the largest against the last line's move (stage-driver, over
 * the full statements), which business drove the segment table's change (segment-driver, on the A3
 * decomposition's own values), and the relation among operating cash flow, capital expenditure and
 * depreciation (cf-investment, over the cash-flow rows the meaning layer reads). The course's goal is
 * reading and analysing, not recall: the row-finding kind (find-row), whose answer was a row's place,
 * is retired with this change — its tables' readings live on in the kinds above, which ask what the
 * figures say. One limit of the registered data is recorded in docs/decisions.md (JCE-145): segment
 * profit is held for one year only, so segment-driver reads the segment *revenue* change — the two-year
 * comparison the entries do hold, and the one A3 already computes.
 */

export type LessonQuestionKind =
  | "growth-revenue"
  | "growth-profit"
  | "growth-employees"
  | "quarterly-direction"
  | "segment-top"
  | "relation-stages"
  | "relation-net-assets"
  | "label-reading"
  | "region-find"
  | "detail-sga"
  | "detail-special"
  | "detail-working-capital"
  | "detail-borrowings"
  | "detail-goodwill"
  | "detail-depreciation"
  | "margin-shift"
  | "stage-driver"
  | "segment-driver"
  | "cf-investment";

/** A small excerpt of a company's own table, printed figures as filed, shown with the question. */
export type QuestionTable = {
  caption?: string;
  columns: string[];
  rows: string[][];
};

export type LessonQuestion = {
  id: string;
  kind: LessonQuestionKind;
  companyId: string;
  companyName: string;
  industry: string | null;
  prompt: string;
  /** A fact to read before answering — the business mix, or the same figure's move a year earlier. */
  clue?: string;
  /** An excerpt of the company's table, when the reading is practised on the real thing. */
  table?: QuestionTable;
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

/**
 * The clue a direction question is read with. The business mix first — the largest business and its
 * share of the segment total, a computed value from the note's printed amounts — then the same figure's
 * move in the year before the pair being asked about. Neither is the answer; both are what a reader
 * would actually look at before committing to a direction.
 */
function businessClue(c: Company): string | undefined {
  const seg = c.segmentRevenue;
  if (seg && seg.items.length >= 2) {
    const named = seg.items
      .map((i) => ({ amount: i.amount, name: c.businesses.find((b) => b.id === i.businessId)?.shortName ?? c.businesses.find((b) => b.id === i.businessId)?.name }))
      .filter((i): i is { amount: number; name: string } => Boolean(i.name) && i.amount > 0)
      .sort((x, y) => y.amount - x.amount);
    const top = named[0];
    if (top) {
      const total = named.reduce((sum, i) => sum + i.amount, 0);
      const share = Math.round((top.amount / total) * 1000) / 10;
      if (share >= 40) return `手がかり：${c.name}の最大の事業は「${top.name}」で、事業別の売上の${share}%を占めています（計算値：事業別情報の印字値から）。`;
    }
  }
  return undefined;
}

function priorMoveClue(records: FinancialRecord[], label: string, get: (r: FinancialRecord) => number | null): string | undefined {
  const [a, b] = records.slice(-3, -1);
  if (!a || !b) return undefined;
  const va = get(a);
  const vb = get(b);
  if (va === null || vb === null || va <= 0 || vb <= 0) return undefined;
  const change = vb / va - 1;
  if (Math.abs(change) < 0.01) return undefined;
  return `手がかり：その前の年（${a.fiscalYear} → ${b.fiscalYear}）の${label}は、前期比で${pct(change)}でした（計算値：2つの印字値から）。`;
}

/** How many questions of each kind the lesson layer takes at most; the lessons bind only a few of them. */
const CAP = 72;

export function buildLessonQuestions(companies: Company[]): LessonQuestion[] {
  const growthRevenue: LessonQuestion[] = [];
  const growthProfit: LessonQuestion[] = [];
  const growthEmployees: LessonQuestion[] = [];
  const quarterlyDirection: LessonQuestion[] = [];
  const segmentTop: LessonQuestion[] = [];
  const relationStages: LessonQuestion[] = [];
  const relationNetAssets: LessonQuestion[] = [];
  const labelReading: LessonQuestion[] = [];
  const regionFind: LessonQuestion[] = [];
  const detailSga: LessonQuestion[] = [];
  const detailSpecial: LessonQuestion[] = [];
  const detailWorkingCapital: LessonQuestion[] = [];
  const detailBorrowings: LessonQuestion[] = [];
  const detailGoodwill: LessonQuestion[] = [];
  const detailDepreciation: LessonQuestion[] = [];
  const marginShift: LessonQuestion[] = [];
  const stageDriver: LessonQuestion[] = [];
  const segmentDriver: LessonQuestion[] = [];
  const cfInvestment: LessonQuestion[] = [];

  const ordered = [...companies].sort((a, b) => hash(`lesson-${a.id}`) - hash(`lesson-${b.id}`));
  for (const c of ordered) {
    const records = byPeriodEnd(c);
    const latestRec = records.at(-1);
    if (!latestRec) continue;
    const source = c.sources.find((s) => latestRec.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === latestRec.sourceIds[0]);
    if (!source) continue;
    const base = { companyId: c.id, companyName: c.name, industry: primaryIndustry(c), sourceIds: latestRec.sourceIds, sourceTitle: source.title };
    const pair = records.slice(-2);
    const [prevRec, curRec] = pair.length === 2 ? (pair as [FinancialRecord, FinancialRecord]) : [undefined, undefined];

    // 先読み型（手がかり付き）: the direction of the latest figure against the year before, read with a
    // clue first. A direction derived from two printed figures is a computed value.
    if (prevRec && curRec) {
      const direction = (
        kind: "growth-revenue" | "growth-profit" | "growth-employees",
        label: string,
        get: (r: FinancialRecord) => number | null,
        threshold: number,
        sink: LessonQuestion[],
      ) => {
        const a = get(prevRec);
        const b = get(curRec);
        if (a === null || b === null || a <= 0 || b <= 0) return;
        const change = b / a - 1;
        if (Math.abs(change) < threshold) return; // a near-flat year would make the direction a coin toss
        const clue = businessClue(c) ?? priorMoveClue(records, label, get);
        if (!clue) return; // no clue, no coin toss (JCE-090)
        const up = change > 0;
        sink.push({
          ...base,
          id: `${kind}-${c.id}`,
          kind,
          prompt: `手がかりを読んでから、予想しましょう。${c.name}の${label}は、最新期（${curRec.fiscalYear}）に前期より増えたでしょうか、減ったでしょうか？`,
          clue,
          options: [
            { id: "up", label: "増えた" },
            { id: "down", label: "減った" },
          ],
          answer: up ? "up" : "down",
          explain:
            kind === "growth-employees"
              ? `${c.name}の${label}は、前期（${prevRec.fiscalYear}）${a.toLocaleString("ja-JP")}人 → 最新期（${curRec.fiscalYear}）${b.toLocaleString("ja-JP")}人 で、${up ? "増えました" : "減りました"}。計算値：最新期 ÷ 前期 − 1 = ${pct(change)}。もとの2つの数値は有価証券報告書の印字値です。`
              : `${c.name}の${label}は、前期（${prevRec.fiscalYear}）${formatYen(a)} → 最新期（${curRec.fiscalYear}）${formatYen(b)} で、${up ? "増えました" : "減りました"}。計算値：最新期 ÷ 前期 − 1 = ${pct(change)}。もとの2つの数値は有価証券報告書の印字値です。`,
          sourceIds: [...new Set([...prevRec.sourceIds, ...curRec.sourceIds])],
          period: `${prevRec.fiscalYear} → ${curRec.fiscalYear}`,
        });
      };
      direction("growth-revenue", latestRec.revenueLabel, (r) => r.revenue, 0.03, growthRevenue);
      direction("growth-profit", "純利益", (r) => r.netIncome, 0.05, growthProfit);
      direction("growth-employees", "従業員数（連結）", (r) => r.employees, 0.02, growthEmployees);
    }

    // 事業別の売上 — the largest business of the segment note, against the company's own other businesses.
    // Kept from the old course (JCE-084): the answer is a business's name, not a value.
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

    // 事業別の増減 (JCE-145): the segment note's own two years — which business drove the table's total
    // change. The changes are the A3 decomposition's own rows (src/lib/analysis-decomposition.ts), so
    // the comparability guards of the analysis layer (same standard, same revenue scope, a full-length
    // period) decide whether the question exists at all. Segment profit is held for one year only in
    // the entries, so the change read here is the segment revenue change (docs/decisions.md, JCE-145).
    // The answer must be unambiguous: one business's change, in the total's direction, at least half
    // the total's size and half again the runner-up's.
    if (seg && seg.previous) {
      const a3 = runDecompModule("a3", c, [c]);
      const segSource = c.sources.find((s) => seg.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === seg.sourceIds[0]);
      if (a3.status === "ok" && segSource) {
        const parts = a3.group.rows
          .filter((r) => r.key.startsWith("a3-") && r.key.endsWith("-change") && r.key !== "a3-revenue-change")
          .map((r) => ({ businessId: r.key.slice(3, -"-change".length), change: r.value }));
        const total = parts.reduce((sum, p) => sum + p.change, 0);
        const byAbs = [...parts].sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
        const driver = byAbs[0];
        const second = byAbs[1];
        if (
          parts.length >= 2 && driver && second && total !== 0 && driver.change !== 0 &&
          Math.sign(driver.change) === Math.sign(total) &&
          Math.abs(driver.change) >= 1.5 * Math.abs(second.change) &&
          Math.abs(driver.change) >= 0.5 * Math.abs(total)
        ) {
          const nameOf = (businessId: string) =>
            c.businesses.find((b) => b.id === businessId)?.shortName ?? c.businesses.find((b) => b.id === businessId)?.name;
          const priorById = new Map(seg.previous.items.map((i) => [i.businessId, i.amount]));
          const rows = parts
            .map((p) => ({ ...p, name: nameOf(p.businessId), cur: seg.items.find((i) => i.businessId === p.businessId)?.amount, prior: priorById.get(p.businessId) }))
            .filter((p): p is { businessId: string; change: number; name: string; cur: number; prior: number } => Boolean(p.name) && p.cur !== undefined && p.prior !== undefined)
            .sort((x, y) => y.cur - x.cur);
          if (rows.length === parts.length && rows.length >= 2) {
            const driverName = nameOf(driver.businessId)!;
            const share = Math.round((driver.change / total) * 1000) / 10;
            segmentDriver.push({
              companyId: c.id,
              companyName: c.name,
              industry: primaryIndustry(c),
              sourceIds: seg.sourceIds,
              sourceTitle: segSource.title,
              id: `segment-driver-${c.id}`,
              kind: "segment-driver",
              prompt: `${c.name}の事業別の${seg.label}（2期分）です。事業全体の増減を、いちばん大きく動かした事業はどれでしょう？`,
              table: {
                caption: `${c.name}の事業別情報。金額は有価証券報告書の印字値です。`,
                columns: ["事業", seg.previous.fiscalYear, seg.fiscalYear],
                rows: [
                  ...rows.map((r) => [r.name, formatYen(r.prior), formatYen(r.cur)]),
                  ["合計", formatYen(rows.reduce((s, r) => s + r.prior, 0)), formatYen(rows.reduce((s, r) => s + r.cur, 0))],
                ],
              },
              options: rows
                .slice(0, 4)
                .sort((x, y) => hash(`${c.id}-segdrv-${x.businessId}`) - hash(`${c.id}-segdrv-${y.businessId}`))
                .map((r) => ({ id: r.businessId, label: r.name })),
              answer: driver.businessId,
              explain: `事業ごとの増減は、${rows.map((r) => `${r.name} ${r.change > 0 ? "+" : ""}${formatYen(r.change)}`).join("、")}でした（計算値：各事業の最新期 − 前期）。合計の増減 ${total > 0 ? "+" : ""}${formatYen(total)} のうち、${driverName}の増減が ${share}% を占めます（計算値：${driverName}の増減 ÷ 合計の増減）。金額は有価証券報告書の事業別情報の印字値です。`,
              period: `${seg.previous.fiscalYear} → ${seg.fiscalYear}`,
            });
          }
        }
      }
    }

    // 関係の読み（段階）: two years of the three printed lines, when the middle line and the last line
    // moved materially differently — the reader names the stage that decided the last line's move. The
    // answer is read off the shown figures, and the explanation shows the arithmetic as a computed value.
    if (prevRec && curRec) {
      const a = { revenue: prevRec.revenue, profit: prevRec.profit, net: prevRec.netIncome };
      const b = { revenue: curRec.revenue, profit: curRec.profit, net: curRec.netIncome };
      if (
        a.revenue !== null && b.revenue !== null && a.profit !== null && b.profit !== null && a.net !== null && b.net !== null &&
        a.revenue > 0 && b.revenue > 0 && a.profit > 0 && b.profit > 0 && a.net > 0 && b.net > 0 &&
        curRec.profitLabel
      ) {
        const rp = b.revenue / a.revenue - 1;
        const pp = b.profit / a.profit - 1;
        const np = b.net / a.net - 1;
        const table: QuestionTable = {
          caption: `${c.name}の2期分。金額は有価証券報告書の印字値です。`,
          columns: ["項目", prevRec.fiscalYear, curRec.fiscalYear],
          rows: [
            [curRec.revenueLabel, formatYen(a.revenue), formatYen(b.revenue)],
            [curRec.profitLabel, formatYen(a.profit), formatYen(b.profit)],
            [curRec.netIncomeLabel, formatYen(a.net), formatYen(b.net)],
          ],
        };
        const stageOptions = [
          { id: "to-middle", label: `売上から${curRec.profitLabel}までの段（原価・販管費・営業外まで）` },
          { id: "after-middle", label: `${curRec.profitLabel}から純利益までの段（特別損益・法人税等）` },
          { id: "revenue-itself", label: "売上そのものの大きさ" },
        ];
        const srcIds = [...new Set([...prevRec.sourceIds, ...curRec.sourceIds])];
        if (Math.abs(np - pp) >= 0.15) {
          relationStages.push({
            ...base,
            id: `relation-stages-${c.id}`,
            kind: "relation-stages",
            prompt: `${c.name}の2期分です。中間の利益（${curRec.profitLabel}）と純利益で、動きの大きさが違いました。純利益の動きを決めたのは、どの段でしょう？`,
            table,
            options: stageOptions,
            answer: "after-middle",
            explain: `${curRec.profitLabel}は前期比 ${pct(pp)}、純利益は ${pct(np)} でした（計算値：各行の最新期 ÷ 前期 − 1）。差が開いたのは${curRec.profitLabel}より下の段——特別損益や法人税等——です。最終利益だけを見ると、この差の理由は読めません。`,
            sourceIds: srcIds,
            period: `${prevRec.fiscalYear} → ${curRec.fiscalYear}`,
          });
        } else if (Math.abs(pp - rp) >= 0.15) {
          relationStages.push({
            ...base,
            id: `relation-stages-${c.id}`,
            kind: "relation-stages",
            prompt: `${c.name}の2期分です。売上と中間の利益（${curRec.profitLabel}）で、動きの大きさが違いました。${curRec.profitLabel}の動きを決めたのは、どの段でしょう？`,
            table,
            options: stageOptions,
            answer: "to-middle",
            explain: `売上は前期比 ${pct(rp)}、${curRec.profitLabel}は ${pct(pp)} でした（計算値：各行の最新期 ÷ 前期 − 1）。差が開いたのは、売上から${curRec.profitLabel}までの段——売上原価・販管費・営業外損益のどこか——です。どの費用かは、損益計算書の本体で確かめます。`,
            sourceIds: srcIds,
            period: `${prevRec.fiscalYear} → ${curRec.fiscalYear}`,
          });
        }
      }

      // 関係の読み（純資産）: two years of net assets against the latest net income — whether what piled
      // up matches the profit, read off the shown figures. The explanation names the other movers as
      // general reading, never as this company's fact.
      if (
        prevRec.netAssets !== null && curRec.netAssets !== null && prevRec.netAssets > 0 && curRec.netAssets > 0 &&
        curRec.netIncome !== null && curRec.netIncome > 0
      ) {
        const delta = curRec.netAssets - prevRec.netAssets;
        const ratio = delta / curRec.netIncome;
        const category = ratio >= 0.75 && ratio <= 1.25 ? "about" : ratio < 0.75 ? "less" : "more";
        relationNetAssets.push({
          ...base,
          id: `relation-net-assets-${c.id}`,
          kind: "relation-net-assets",
          prompt: `${c.name}の2期分です。最新期（${curRec.fiscalYear}）の純利益は ${formatYen(curRec.netIncome)} でした。純資産の増え方は、純利益と比べてどうでしょう？`,
          table: {
            caption: `${c.name}の2期分。金額は有価証券報告書の印字値です。`,
            columns: ["項目", prevRec.fiscalYear, curRec.fiscalYear],
            rows: [
              [curRec.netAssetsLabel ?? "純資産", formatYen(prevRec.netAssets), formatYen(curRec.netAssets)],
              [curRec.netIncomeLabel, prevRec.netIncome !== null ? formatYen(prevRec.netIncome) : "―", formatYen(curRec.netIncome)],
            ],
          },
          options: [
            { id: "about", label: "純利益とほぼ同じだけ増えた" },
            { id: "less", label: "純利益より少なく増えた" },
            { id: "more", label: "純利益より多く増えた" },
          ],
          answer: category,
          explain: `純資産は ${formatYen(prevRec.netAssets)} → ${formatYen(curRec.netAssets)} で、${formatYen(delta)}増えました（計算値：2つの印字値の差）。純利益は ${formatYen(curRec.netIncome)} です。純資産は利益だけで動くのではなく、配当で減り、株式の評価差額などでも動きます——差があるときは、その内訳を純資産の部と変動計算書で確かめるのが読み方です。`,
          sourceIds: [...new Set([...prevRec.sourceIds, ...curRec.sourceIds])],
          period: `${prevRec.fiscalYear} → ${curRec.fiscalYear}`,
        });
      }

      // 利益率の変化 (JCE-145): the middle line's margin on revenue, two periods — the reader compares
      // the two ratios the printed figures make, not the amounts themselves. A move under a point is
      // not asked: at that size the reading would be a coin toss between "moved" and "barely moved".
      if (prevRec.revenue !== null && curRec.revenue !== null && prevRec.revenue > 0 && curRec.revenue > 0 && prevRec.profit !== null && curRec.profit !== null && curRec.profitLabel) {
        const m0 = (prevRec.profit / prevRec.revenue) * 100;
        const m1 = (curRec.profit / curRec.revenue) * 100;
        const d = m1 - m0;
        if (Math.abs(d) >= 1.0) {
          const ptText = (Math.round(Math.abs(d) * 10) / 10).toFixed(1);
          const pctText = (v: number) => `${(Math.round(v * 10) / 10).toFixed(1)}%`;
          marginShift.push({
            ...base,
            id: `margin-shift-${c.id}`,
            kind: "margin-shift",
            prompt: `${c.name}の2期分です。${curRec.profitLabel}の利益率（${curRec.revenueLabel}に対する割合）は、どう動いたでしょう？`,
            table: {
              caption: `${c.name}の2期分。金額は有価証券報告書の印字値です。`,
              columns: ["項目", prevRec.fiscalYear, curRec.fiscalYear],
              rows: [
                [curRec.revenueLabel, formatYen(prevRec.revenue), formatYen(curRec.revenue)],
                [curRec.profitLabel, formatYen(prevRec.profit), formatYen(curRec.profit)],
              ],
            },
            options: [
              { id: "up", label: `利益率は約${ptText}ポイント上がった` },
              { id: "down", label: `利益率は約${ptText}ポイント下がった` },
              { id: "flat", label: "利益率はほとんど変わらなかった" },
            ],
            answer: d > 0 ? "up" : "down",
            explain: `前期の利益率は ${pctText(m0)}、最新期は ${pctText(m1)} で、約${ptText}ポイント${d > 0 ? "上がりました" : "下がりました"}（計算値：各期の${curRec.profitLabel} ÷ ${curRec.revenueLabel}）。金額そのものではなく、売上に対する利益の割合の動きを読むのが利益率の読み方です。もとの金額は有価証券報告書の印字値です。`,
            sourceIds: [...new Set([...prevRec.sourceIds, ...curRec.sourceIds])],
            period: `${prevRec.fiscalYear} → ${curRec.fiscalYear}`,
          });
        }
      }
    }

    // ラベル読み: the company's own wording is the material. Which yardstick prints a 経常利益 line, and
    // whose share the last line names — both read off the label the filing itself uses, checked against
    // the record's accounting standard so a label and a standard that disagree ask nothing.
    {
      const variants: LessonQuestion[] = [];
      if (latestRec.profitLabel) {
        const jgaapLabel = latestRec.profitLabel === "経常利益";
        const pretaxLabel = latestRec.profitLabel.includes("税引前");
        if ((latestRec.accountingStandard === "jgaap" && jgaapLabel) || (latestRec.accountingStandard !== "jgaap" && pretaxLabel)) {
          variants.push({
            ...base,
            id: `label-standard-${c.id}`,
            kind: "label-reading",
            prompt: `${c.name}の有報の5期表で、売上と純利益の間に印字されている利益行は「${latestRec.profitLabel}」です。この名前から分かる、この会社の物差しはどれでしょう？`,
            options: [
              { id: "jgaap", label: "日本基準（経常利益という段階がある）" },
              { id: "ifrs-us", label: "IFRS・米国基準（経常利益はなく、税引前の利益を印字する）" },
              { id: "own", label: "会社が自由に決めた名前" },
            ],
            answer: latestRec.accountingStandard === "jgaap" ? "jgaap" : "ifrs-us",
            explain:
              latestRec.accountingStandard === "jgaap"
                ? `「${latestRec.profitLabel}」は日本基準の段階表示に出てくる行です。IFRS・米国基準の表には経常利益という段階がなく、代わりに税引前の利益が印字されます。行の名前が、物差しの違いを教えてくれます。`
                : `「${latestRec.profitLabel}」は、IFRS・米国基準の表が印字する行です。この物差しには経常利益という段階がなく、特別損益の区分もありません。日本基準の表と同じ読み方をすると、行を取り違えます。`,
            period: latestRec.fiscalYear,
          });
        }
      }
      const nil = latestRec.netIncomeLabel;
      if (nil.includes("親会社株主") || nil.includes("親会社所有者") || nil === "当期純利益") {
        const parent = nil !== "当期純利益";
        variants.push({
          ...base,
          id: `label-owner-${c.id}`,
          kind: "label-reading",
          prompt: `${c.name}の損益計算書の最下段の名前は「${nil}」です。この行が表しているのは、どれでしょう？`,
          options: [
            { id: "parent", label: "親会社の株主の取り分" },
            { id: "group", label: "グループ全体の利益（非支配株主の分も含む）" },
            { id: "standalone", label: "提出会社だけの、単体の利益" },
          ],
          answer: parent ? "parent" : "group",
          explain: parent
            ? `最下段は「${nil}」——連結は子会社の利益を100%取り込むため、まずグループ全体の当期純利益が出て、そこから非支配株主の取り分を引いた、親会社の株主の取り分が最下段に残ります。名前の長さは、その二段構えの表れです。`
            : `最下段は「${nil}」で、グループ全体の利益そのものです。子会社に親会社以外の株主（非支配株主）がいると、その取り分を分けた行が下に足され、最下段の名前が「親会社株主に帰属する当期純利益」に変わります。`,
          period: latestRec.fiscalYear,
        });
      }
      if (variants.length > 0) labelReading.push(variants[hash(`${c.id}-label`) % variants.length]!);
    }

    // 地域別情報の読み: the regional table as printed, and what feeds the overseas ratio's numerator.
    // The ratio itself is a computed value; the reading is which amounts go into it.
    const reg = c.regionalRevenue;
    if (reg && reg.items.length >= 2 && reg.items.some((i) => i.domestic) && reg.items.some((i) => !i.domestic)) {
      const items = [...reg.items].filter((i) => i.amount > 0).sort((x, y) => y.amount - x.amount);
      const regSource = c.sources.find((s) => reg.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === reg.sourceIds[0]);
      const overseas = companyMetrics(c)?.overseasSalesRatio ?? null;
      if (regSource && items.length >= 2 && overseas) {
        regionFind.push({
          companyId: c.id,
          companyName: c.name,
          industry: primaryIndustry(c),
          sourceIds: reg.sourceIds,
          sourceTitle: regSource.title,
          id: `region-find-${c.id}`,
          kind: "region-find",
          prompt: `${c.name}の地域別の${reg.label}（${reg.fiscalYear}）の表です。海外売上比率という計算値を出すとき、「海外の金額」として分子に入るのはどれでしょう？`,
          table: {
            caption: `${c.name}の地域別情報。金額は有価証券報告書の印字値です。`,
            columns: ["地域", reg.fiscalYear],
            rows: items.map((i) => [i.region, formatYen(i.amount)]),
          },
          options: [
            { id: "non-domestic", label: "日本以外の地域の金額を、すべて合計したもの" },
            { id: "largest-foreign", label: "いちばん大きい海外地域の金額だけ" },
            { id: "all", label: "日本を含む、全地域の合計" },
          ],
          answer: "non-domestic",
          explain: `海外の金額は、日本以外の地域の合計です。計算値：${overseas.formula} = ${overseas.percent}%。割合そのものは金額から計算で出るもので、表に印字されているのは金額のほうです。`,
          period: reg.fiscalYear,
        });
      }
    }

    // 明細の読み (JCE-092, Phase B): the full statements the entry now carries, for the companies that
    // have them. The excerpt is the real section of the real table, and what is asked is still the
    // reading — the largest line of a breakdown, the set of rows that are not yet cash, every row a
    // borrowing is split across, how a book value is built — never a value to memorise. A company
    // whose statement lacks the section a question needs gets no question of that kind.
    {
      const stmt = [...(c.financialStatements ?? [])].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
      const stmtSource = stmt ? (c.sources.find((s) => stmt.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === stmt.sourceIds[0])) : undefined;
      if (stmt && stmtSource) {
        const sbase = { companyId: c.id, companyName: c.name, industry: primaryIndustry(c), sourceIds: stmt.sourceIds, sourceTitle: stmtSource.title };
        const pl = stmt.incomeStatement;
        const bs = stmt.balanceSheet;
        const ofRole = (lines: StatementLine[], role: StatementRole) => lines.filter((l) => l.role === role);
        const oneOf = (lines: StatementLine[], role: StatementRole) => lines.find((l) => l.role === role);
        const excerpt = (lines: StatementLine[], what: string): QuestionTable => ({
          caption: `${c.name}の${what}から抜粋。金額は有価証券報告書の印字値です。`,
          columns: ["項目", stmt.fiscalYear],
          rows: lines.map((l) => [l.label, formatYen(l.amount)]),
        });

        // 販管費の内訳: the largest line of the breakdown the note prints, and the gap it explains.
        const sgaItems = ofRole(pl, "sga-item");
        const sgaTotal = oneOf(pl, "selling-general-and-administrative-expenses");
        const grossLine = oneOf(pl, "gross-profit");
        const opLine = oneOf(pl, "operating-income");
        if (sgaItems.length >= 3 && sgaTotal && grossLine && opLine) {
          const byAmount = [...sgaItems].sort((a, b) => b.amount - a.amount);
          const top = byAmount[0]!;
          if (byAmount[1] && top.amount > byAmount[1].amount) {
            const optionItems = sgaItems.filter((l) => byAmount.slice(0, 4).includes(l));
            const opGross = oneOf(pl, "operating-gross-profit");
            detailSga.push({
              ...sbase,
              id: `detail-sga-${c.id}`,
              kind: "detail-sga",
              prompt: `${c.name}の損益計算書の抜粋です。販売費及び一般管理費の内訳の中で、金額がいちばん大きい項目はどれでしょう？`,
              table: excerpt([grossLine, ...(opGross ? [opGross] : []), sgaTotal, ...sgaItems, opLine], "連結損益計算書"),
              options: optionItems.map((l) => ({ id: `item-${sgaItems.indexOf(l)}`, label: l.label })),
              answer: `item-${sgaItems.indexOf(top)}`,
              explain: `いちばん大きいのは「${top.label}」で ${formatYen(top.amount)}、販管費全体 ${formatYen(sgaTotal.amount)} の約${Math.round((top.amount / sgaTotal.amount) * 100)}%です（計算値：内訳の印字値 ÷ 販管費の印字値）。内訳に並ぶのは主な項目だけなので、合計は販管費全体と一致しません。粗利と営業利益の差はこの販管費で、その中身は注記の内訳でしか読めません。`,
              period: stmt.fiscalYear,
            });
          }
        }

        // 特別損益の内訳: the largest one-off line between ordinary income and pre-tax income.
        const specials = [
          ...ofRole(pl, "extraordinary-income-item").map((line) => ({ line, side: "特別利益" })),
          ...ofRole(pl, "extraordinary-loss-item").map((line) => ({ line, side: "特別損失" })),
        ];
        if (specials.length >= 3 && oneOf(pl, "ordinary-income") && oneOf(pl, "income-before-income-taxes")) {
          const byAbs = [...specials].sort((a, b) => Math.abs(b.line.amount) - Math.abs(a.line.amount));
          const top = byAbs[0]!;
          if (byAbs[1] && Math.abs(top.line.amount) > Math.abs(byAbs[1].line.amount)) {
            const optionSet = specials.filter((s) => byAbs.slice(0, 5).includes(s));
            const section = pl.filter((l) =>
              ["ordinary-income", "extraordinary-income-item", "extraordinary-income", "extraordinary-loss-item", "extraordinary-loss", "income-before-income-taxes"].includes(l.role),
            );
            detailSpecial.push({
              ...sbase,
              id: `detail-special-${c.id}`,
              kind: "detail-special",
              prompt: `${c.name}の損益計算書の抜粋です。経常利益の下に並ぶ特別利益・特別損失の中で、金額がいちばん大きい項目はどれでしょう？`,
              table: excerpt(section, "連結損益計算書"),
              options: optionSet.map((s) => ({ id: `sp-${specials.indexOf(s)}`, label: s.line.label })),
              answer: `sp-${specials.indexOf(top)}`,
              explain: `いちばん大きいのは${top.side}の「${top.line.label}」で ${formatYen(top.line.amount)} です。特別損益は、その期だけの出来事による利益と損失で、経常利益と税引前利益の間に置かれます。本業の実力を見る経常利益と分けるために、この段があります。`,
              period: stmt.fiscalYear,
            });
          }
        }

        // まだ現金になっていない資産: receivables and inventories picked out of the current assets.
        const cashLine = oneOf(bs, "cash-and-deposits");
        const recvLines = ofRole(bs, "accounts-receivable");
        const invLines = ofRole(bs, "inventories");
        const totalCaLine = oneOf(bs, "total-current-assets");
        if (cashLine && recvLines.length >= 1 && invLines.length >= 1 && totalCaLine) {
          const join = (ls: StatementLine[]) => ls.map((l) => l.label).join("と");
          const sumOf = (ls: StatementLine[]) => ls.reduce((a, l) => a + l.amount, 0);
          const section = bs.filter((l) => ["cash-and-deposits", "accounts-receivable", "inventories", "other-current-assets", "total-current-assets"].includes(l.role));
          detailWorkingCapital.push({
            ...sbase,
            id: `detail-working-capital-${c.id}`,
            kind: "detail-working-capital",
            prompt: `${c.name}の貸借対照表（流動資産）の抜粋です。売ったのにまだ受け取っていない代金と、買ったのにまだ売れていない在庫——「まだ現金になっていない資産」にあたる行の組はどれでしょう？`,
            table: excerpt(section, "連結貸借対照表"),
            options: [
              { id: "both", label: `${join(recvLines)} と ${join(invLines)}` },
              { id: "cash-mix", label: `${cashLine.label} と ${join(invLines)}` },
              { id: "recv-only", label: join(recvLines) },
              { id: "inv-only", label: join(invLines) },
            ],
            answer: "both",
            explain: `「${join(recvLines)}」（${formatYen(sumOf(recvLines))}）は売った代金の未回収分、「${join(invLines)}」（${formatYen(sumOf(invLines))}）は売る前の在庫で、どちらもまだ現金ではありません。2つの合計は ${formatYen(sumOf(recvLines) + sumOf(invLines))} で、流動資産 ${formatYen(totalCaLine.amount)} の一部です（計算値：各行の印字値の合計）。資産の大きさだけでなく、中身が現金かどうかを見るのが読み方です。`,
            period: stmt.fiscalYear,
          });
        }

        // 借入の全部の行: borrowings and bonds, split across current and non-current by due date.
        const BORROW_ROLES: StatementRole[] = ["short-term-borrowings", "current-portion-of-long-term-borrowings", "current-portion-of-bonds", "bonds", "long-term-borrowings"];
        const borrowLines = bs.filter((l) => BORROW_ROLES.includes(l.role));
        if (borrowLines.length >= 3) {
          const n = borrowLines.length;
          const counts = [...new Set([n - 1, n, n + 1, n + 2])].filter((x) => x >= 2).sort((a, b) => a - b);
          const section = bs.filter((l) =>
            ["accounts-payable", ...BORROW_ROLES, "other-current-liabilities", "total-current-liabilities", "other-non-current-liabilities", "total-non-current-liabilities"].includes(l.role),
          );
          const totalBorrow = borrowLines.reduce((a, l) => a + l.amount, 0);
          detailBorrowings.push({
            ...sbase,
            id: `detail-borrowings-${c.id}`,
            kind: "detail-borrowings",
            prompt: `${c.name}の貸借対照表（負債の部）の抜粋です。借入と社債——返す時期で流動と固定に分かれて印字される行は、全部で何行あるでしょう？`,
            table: excerpt(section, "連結貸借対照表"),
            options: counts.map((x) => ({ id: `count-${x}`, label: `${x}行` })),
            answer: `count-${n}`,
            explain: `借入・社債の行は ${n}行あります：${borrowLines.map((l) => `「${l.label}」`).join("、")}。1年以内に返す分は流動負債に、それより先の分は固定負債に分かれて印字されるため、借入の全体は1行では読めません。合計は ${formatYen(totalBorrow)} です（計算値：各行の印字値の合計）。買掛金は仕入先への未払いで、借入とは別の行です。`,
            period: stmt.fiscalYear,
          });
        }

        // のれんと無形固定資産: the largest of the assets with no physical form.
        const goodwillLine = oneOf(bs, "goodwill");
        const intangibleItems = ofRole(bs, "intangible-asset-item");
        const totalIntLine = oneOf(bs, "total-intangible-assets");
        if (goodwillLine && intangibleItems.length >= 1 && totalIntLine) {
          const rows = [goodwillLine, ...intangibleItems];
          const byAmount = [...rows].sort((a, b) => b.amount - a.amount);
          const top = byAmount[0]!;
          if (byAmount[1] && top.amount > byAmount[1].amount) {
            const section = bs.filter((l) => ["goodwill", "intangible-asset-item", "total-intangible-assets"].includes(l.role));
            detailGoodwill.push({
              ...sbase,
              id: `detail-goodwill-${c.id}`,
              kind: "detail-goodwill",
              prompt: `${c.name}の貸借対照表（無形固定資産）の抜粋です。形のない資産の中で、金額がいちばん大きい行はどれでしょう？`,
              table: excerpt(section, "連結貸借対照表"),
              options: rows.map((l) => ({ id: `int-${rows.indexOf(l)}`, label: l.label })),
              answer: `int-${rows.indexOf(top)}`,
              explain: `いちばん大きいのは「${top.label}」で ${formatYen(top.amount)}、無形固定資産の合計 ${formatYen(totalIntLine.amount)} の大半です（計算値：行の印字値と合計の印字値の比較）。「${goodwillLine.label}」は、会社を買収したときに払った対価が、受け入れた純資産を超えた分——ブランドや顧客との関係など、単独では売れない価値への支払いです。形のない資産は、行の名前から中身を読むしかありません。`,
              period: stmt.fiscalYear,
            });
          }
        }

        // 帳簿価額の組み立て: one equipment category's three printed lines — cost, accumulated
        // depreciation, and the book value they leave. The question is the construction, not a value.
        const triples: { gross: StatementLine; acc: StatementLine; net: StatementLine }[] = [];
        for (const g of ofRole(bs, "ppe-gross")) {
          const acc = ofRole(bs, "accumulated-depreciation").find((l) => l.label === `減価償却累計額、${g.label}`);
          const net = ofRole(bs, "ppe-net").find((l) => l.label === `${g.label}（純額）`);
          if (acc && net && Math.abs(g.amount + acc.amount - net.amount) <= 2_000_000) triples.push({ gross: g, acc, net });
        }
        if (triples.length > 0) {
          const t = [...triples].sort((a, b) => b.net.amount - a.net.amount)[0]!;
          detailDepreciation.push({
            ...sbase,
            id: `detail-depreciation-${c.id}`,
            kind: "detail-depreciation",
            prompt: `${c.name}の貸借対照表の抜粋です。最下段の「${t.net.label}」——いまの帳簿価額は、上の2行からどう読むものでしょう？`,
            table: excerpt([t.gross, t.acc, t.net], "連結貸借対照表"),
            options: [
              { id: "minus", label: "取得価額から減価償却累計額を引いたもの" },
              { id: "plus", label: "取得価額に減価償却累計額を足したもの" },
              { id: "acc-only", label: "減価償却累計額そのもの" },
              { id: "gross-only", label: "取得価額そのもの" },
            ],
            answer: "minus",
            explain: `帳簿価額は、取得価額 ${formatYen(t.gross.amount)} から、使った分を積み上げた減価償却累計額 ${formatYen(Math.abs(t.acc.amount))} を引いた残りです（計算値：${formatYen(t.gross.amount)} − ${formatYen(Math.abs(t.acc.amount))} ≒ ${formatYen(t.net.amount)}。印字の丸めでわずかにずれることがあります）。設備は買ったときの値段ではなく、この残りの価額で資産に残ります。`,
            period: stmt.fiscalYear,
          });
        }

        // 投資とお金の流れ (JCE-145): the cash-flow rows the meaning layer reads (JCE-102/JCE-110) —
        // operating cash flow, the filer's own fixed-asset acquisition outflow, and depreciation. The
        // question is the relation between the three printed figures: whether the year's outlay ran
        // above or below the year's wear, and whether the operating inflow covered the outlay. Both
        // relations must be clear (a quarter apart, a tenth apart) or nothing is asked; the readings
        // state relations only — no word judges the stance, and no intent is attributed.
        const cf = stmt.cashFlowStatement ?? [];
        const cfOpLine = cf.find((l) => l.role === "operating-cash-flow");
        const capexLine = cf.find((l) => l.role === "capital-expenditure");
        const depLine = cf.find((l) => l.role === "depreciation");
        if (cfOpLine && capexLine && depLine && cfOpLine.amount > 0 && capexLine.amount !== 0 && depLine.amount > 0) {
          const capex = Math.abs(capexLine.amount);
          const againstDep = capex / depLine.amount;
          const coverage = cfOpLine.amount / capex;
          const aboveDep = againstDep >= 1.25 ? true : againstDep <= 0.8 ? false : null;
          const covered = coverage >= 1.1 ? true : coverage <= 0.9 ? false : null;
          if (aboveDep !== null && covered !== null) {
            const ratioText = (v: number) => `${(Math.round(v * 100) / 100).toFixed(2)}倍`;
            cfInvestment.push({
              ...sbase,
              id: `cf-investment-${c.id}`,
              kind: "cf-investment",
              prompt: `${c.name}のキャッシュ・フロー計算書の抜粋です。設備投資（${capexLine.label}）と減価償却費、営業キャッシュフローの関係として、正しい読みはどれでしょう？`,
              table: excerpt([cfOpLine, depLine, capexLine], "連結キャッシュ・フロー計算書"),
              options: [
                { id: "up-covered", label: "設備投資は減価償却費を上回り、その支出は営業キャッシュフローの範囲内にある" },
                { id: "up-uncovered", label: "設備投資は減価償却費を上回るが、営業キャッシュフローだけではまかなえていない" },
                { id: "down-covered", label: "設備投資は減価償却費を下回り、営業キャッシュフローの範囲内にある" },
                { id: "down-uncovered", label: "設備投資は減価償却費を下回り、なお営業キャッシュフローだけではまかなえていない" },
              ],
              answer: aboveDep ? (covered ? "up-covered" : "up-uncovered") : covered ? "down-covered" : "down-uncovered",
              explain: `設備投資は ${formatYen(capex)} で、減価償却費 ${formatYen(depLine.amount)} の ${ratioText(againstDep)}です（計算値：設備投資 ÷ 減価償却費）。営業キャッシュフローは ${formatYen(cfOpLine.amount)} で、設備投資の ${ratioText(coverage)}です（計算値：営業キャッシュフロー ÷ 設備投資）。設備投資の金額は、キャッシュ・フロー計算書に支出として印字された「${capexLine.label}」の絶対値です。`,
              period: stmt.fiscalYear,
            });
          }
        }
      }
    }

    // どの段が動かしたか (JCE-145): two years of the full income statement — the reader compares each
    // stage's own change against the last line's move and names the stage that moved most. The stages
    // are nested, so the question asks for the largest change among them, and it is asked only when
    // one stage's change is unambiguous: half again the runner-up's, in the last line's direction,
    // and at least half the last line's own change.
    {
      const stmts = [...(c.financialStatements ?? [])].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
      const [prevStmt, curStmt] = stmts.length >= 2 ? (stmts.slice(-2) as [FinancialStatements, FinancialStatements]) : [undefined, undefined];
      if (prevStmt && curStmt && prevStmt.fiscalYear !== curStmt.fiscalYear) {
        const STAGE_ROLES: StatementRole[] = ["gross-profit", "operating-income", "ordinary-income", "income-before-income-taxes"];
        const lineOf = (s: FinancialStatements, role: StatementRole) => s.incomeStatement.find((l) => l.role === role);
        const netPrev = lineOf(prevStmt, "net-income");
        const netCur = lineOf(curStmt, "net-income");
        const stages = STAGE_ROLES.filter((role) => lineOf(prevStmt, role) && lineOf(curStmt, role)).map((role) => ({
          role,
          label: lineOf(curStmt, role)!.label,
          prev: lineOf(prevStmt, role)!.amount,
          cur: lineOf(curStmt, role)!.amount,
          change: lineOf(curStmt, role)!.amount - lineOf(prevStmt, role)!.amount,
        }));
        if (netPrev && netCur && stages.length >= 3) {
          const netChange = netCur.amount - netPrev.amount;
          const byAbs = [...stages].sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
          const driver = byAbs[0]!;
          const second = byAbs[1]!;
          if (
            netChange !== 0 && driver.change !== 0 &&
            Math.sign(driver.change) === Math.sign(netChange) &&
            Math.abs(driver.change) >= 1.5 * Math.abs(second.change) &&
            Math.abs(driver.change) >= 0.5 * Math.abs(netChange)
          ) {
            const stmtSource = c.sources.find((s) => curStmt.sourceIds.includes(s.id)) ?? c.sources.find((s) => s.id === curStmt.sourceIds[0]);
            if (stmtSource) {
              const revPrev = lineOf(prevStmt, "revenue");
              const revCur = lineOf(curStmt, "revenue");
              stageDriver.push({
                companyId: c.id,
                companyName: c.name,
                industry: primaryIndustry(c),
                sourceIds: [...new Set([...prevStmt.sourceIds, ...curStmt.sourceIds])],
                sourceTitle: stmtSource.title,
                id: `stage-driver-${c.id}`,
                kind: "stage-driver",
                prompt: `${c.name}の損益計算書（2期分）の抜粋です。当期純利益の増減に対して、増減額がいちばん大きい段階はどれでしょう？`,
                table: {
                  caption: `${c.name}の連結損益計算書から抜粋。金額は有価証券報告書の印字値です。`,
                  columns: ["項目", prevStmt.fiscalYear, curStmt.fiscalYear],
                  rows: [
                    ...(revPrev && revCur ? [[revCur.label, formatYen(revPrev.amount), formatYen(revCur.amount)]] : []),
                    ...stages.map((s) => [s.label, formatYen(s.prev), formatYen(s.cur)]),
                    [netCur.label, formatYen(netPrev.amount), formatYen(netCur.amount)],
                  ],
                },
                options: stages.map((s) => ({ id: s.role, label: s.label })),
                answer: driver.role,
                explain: `段階ごとの増減は、${stages.map((s) => `${s.label} ${s.change > 0 ? "+" : ""}${formatYen(s.change)}`).join("、")}でした（計算値：各段階の最新期 − 前期）。当期純利益の増減は ${netChange > 0 ? "+" : ""}${formatYen(netChange)} で、いちばん大きく動いたのは${driver.label}の段です。各段階はその上の段階を含んで積み上がるため、増減の大きさを段ごとに比べるのが、この読み方です。`,
                period: `${prevStmt.fiscalYear} → ${curStmt.fiscalYear}`,
              });
            }
          }
        }
      }
    }

    // 四半期の動き (JCE-049) — the direction of the newest cumulative quarter against the same period a
    // year earlier, asked predict-first and read with a clue, as with the annual directions.
    const view = quarterlyView(c);
    if (view) {
      const point = view.points.filter((p) => p.key !== "fy" && p.revenue !== null && p.priorRevenue !== null && p.revenueChange !== null).at(-1);
      if (point && point.revenueChange !== null && Math.abs(point.revenueChange) >= 0.03) {
        const sourceTitle = c.sources.find((s) => point.sourceIds.includes(s.id))?.title;
        const clue = businessClue(c);
        if (sourceTitle && clue) {
          const up = point.revenueChange > 0;
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
            prompt: `手がかりを読んでから、予想しましょう。${c.name}の今期（${view.fiscalYear}）${point.label}（累計）の売上は、前年の同じ時期より増えたでしょうか、減ったでしょうか？`,
            clue,
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
    }
  }

  return [
    ...growthRevenue.slice(0, CAP),
    ...growthProfit.slice(0, CAP),
    ...growthEmployees.slice(0, CAP),
    ...quarterlyDirection.slice(0, CAP),
    ...segmentTop.slice(0, CAP),
    ...relationStages.slice(0, CAP),
    ...relationNetAssets.slice(0, CAP),
    ...labelReading.slice(0, CAP),
    ...regionFind.slice(0, CAP),
    ...detailSga.slice(0, CAP),
    ...detailSpecial.slice(0, CAP),
    ...detailWorkingCapital.slice(0, CAP),
    ...detailBorrowings.slice(0, CAP),
    ...detailGoodwill.slice(0, CAP),
    ...detailDepreciation.slice(0, CAP),
    ...marginShift.slice(0, CAP),
    ...stageDriver.slice(0, CAP),
    ...segmentDriver.slice(0, CAP),
    ...cfInvestment.slice(0, CAP),
  ];
}
