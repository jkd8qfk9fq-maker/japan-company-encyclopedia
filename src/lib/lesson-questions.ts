import { companyMetrics } from "@/lib/company-metrics";
import { quarterlyView } from "@/lib/quarterly";
import { formatYen } from "@/lib/utils/format";
import type { Company, FinancialRecord } from "@/types/company";

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
 * period replaces. Their readings live on in other forms — the row-finding and region questions below,
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
 */

export type LessonQuestionKind =
  | "growth-revenue"
  | "growth-profit"
  | "growth-employees"
  | "quarterly-direction"
  | "segment-top"
  | "find-row"
  | "relation-stages"
  | "relation-net-assets"
  | "label-reading"
  | "region-find";

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
  const findRow: LessonQuestion[] = [];
  const relationStages: LessonQuestion[] = [];
  const relationNetAssets: LessonQuestion[] = [];
  const labelReading: LessonQuestion[] = [];
  const regionFind: LessonQuestion[] = [];

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

    // 項目探し: an excerpt of the company's own summary table — the five-year table of the filing's
    // opening, as this site prints it — and the question asks for a row's place, never its value. Two
    // tables are possible from what the records hold: the profit rows (revenue, the middle line the
    // filing prints, net income) and the balance rows (total assets, liabilities as a computed row,
    // net assets).
    {
      const variants: LessonQuestion[] = [];
      if (latestRec.revenue !== null && latestRec.netIncome !== null) {
        const rows: { id: string; label: string; cur: number; prev: number | null }[] = [
          { id: "revenue", label: latestRec.revenueLabel, cur: latestRec.revenue, prev: prevRec?.revenue ?? null },
          ...(latestRec.profit !== null && latestRec.profitLabel
            ? [{ id: "profit", label: latestRec.profitLabel, cur: latestRec.profit, prev: prevRec?.profit ?? null }]
            : []),
          { id: "net", label: latestRec.netIncomeLabel, cur: latestRec.netIncome, prev: prevRec?.netIncome ?? null },
        ];
        const table: QuestionTable = {
          caption: `${c.name}の「主要な経営指標等の推移」から抜粋。金額は有価証券報告書の印字値です。`,
          columns: prevRec ? ["項目", prevRec.fiscalYear, latestRec.fiscalYear] : ["項目", latestRec.fiscalYear],
          rows: rows.map((r) => (prevRec ? [r.label, r.prev !== null ? formatYen(r.prev) : "―", formatYen(r.cur)] : [r.label, formatYen(r.cur)])),
        };
        const srcIds = prevRec ? [...new Set([...prevRec.sourceIds, ...latestRec.sourceIds])] : latestRec.sourceIds;
        variants.push({
          ...base,
          id: `find-row-bottom-${c.id}`,
          kind: "find-row",
          prompt: `${c.name}の表の抜粋です。売上から費用を引いていった最後に残る利益——最下段の行はどれでしょう？`,
          table,
          options: rows.map((r) => ({ id: r.id, label: r.label })),
          answer: "net",
          explain: `最下段は「${latestRec.netIncomeLabel}」です。表は上から、売上 → 中間の利益 → 最後の利益の順に並びます。問うているのは行の位置で、金額そのものは期が変われば変わります。`,
          sourceIds: srcIds,
          period: latestRec.fiscalYear,
        });
        if (latestRec.profit !== null && latestRec.profitLabel) {
          variants.push({
            ...base,
            id: `find-row-middle-${c.id}`,
            kind: "find-row",
            prompt: `${c.name}の表の抜粋です。売上と純利益の間に印字されている、中間の利益の行はどれでしょう？`,
            table,
            options: rows.map((r) => ({ id: r.id, label: r.label })),
            answer: "profit",
            explain: `中間の行は「${latestRec.profitLabel}」です。この行は、会社が使う物差し（会計基準）によって名前が変わります——日本基準では経常利益、IFRS・米国基準では税引前の利益です。`,
            sourceIds: srcIds,
            period: latestRec.fiscalYear,
          });
        }
      }
      if (latestRec.totalAssets !== null && latestRec.netAssets !== null && latestRec.netAssets > 0 && latestRec.totalAssets > latestRec.netAssets) {
        const liabilities = latestRec.totalAssets - latestRec.netAssets;
        const table: QuestionTable = {
          caption: `${c.name}の貸借対照表の要約（${latestRec.fiscalYear}）。総資産と純資産は印字値、負債の行はその差から出した計算値です。`,
          columns: ["項目", latestRec.fiscalYear],
          rows: [
            [latestRec.totalAssetsLabel ?? "総資産", formatYen(latestRec.totalAssets)],
            ["負債（計算値）", formatYen(liabilities)],
            [latestRec.netAssetsLabel ?? "純資産", formatYen(latestRec.netAssets)],
          ],
        };
        const bsOptions = [
          { id: "assets", label: latestRec.totalAssetsLabel ?? "総資産" },
          { id: "liabilities", label: "負債（計算値）" },
          { id: "net-assets", label: latestRec.netAssetsLabel ?? "純資産" },
        ];
        variants.push({
          ...base,
          id: `find-row-net-assets-${c.id}`,
          kind: "find-row",
          prompt: `${c.name}の貸借対照表の要約です。調達した資金のうち、返す必要のない部分——純資産の行はどれでしょう？`,
          table,
          options: bsOptions,
          answer: "net-assets",
          explain: `純資産は「${latestRec.netAssetsLabel ?? "純資産"}」の行です。右側（調達）のうち、借りたお金ではない部分が純資産で、総資産から純資産を引いた残りが負債です（計算値：${formatYen(latestRec.totalAssets)} − ${formatYen(latestRec.netAssets)} = ${formatYen(liabilities)}）。`,
          period: latestRec.fiscalYear,
        });
        variants.push({
          ...base,
          id: `find-row-liabilities-${c.id}`,
          kind: "find-row",
          prompt: `${c.name}の貸借対照表の要約です。借りたお金など、返す義務のある調達をまとめた行はどれでしょう？`,
          table,
          options: bsOptions,
          answer: "liabilities",
          explain: `返す義務のある調達は「負債」の行です。貸借対照表の右側は、返す義務のある負債と、返す必要のない純資産に分かれます。負債の金額は、総資産から純資産を引いた計算値です（${formatYen(liabilities)}）。`,
          period: latestRec.fiscalYear,
        });
      }
      if (variants.length > 0) findRow.push(variants[hash(`${c.id}-findrow`) % variants.length]!);
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
    ...findRow.slice(0, CAP),
    ...relationStages.slice(0, CAP),
    ...relationNetAssets.slice(0, CAP),
    ...labelReading.slice(0, CAP),
    ...regionFind.slice(0, CAP),
  ];
}
