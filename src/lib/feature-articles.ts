import { companyMetrics } from "@/lib/company-metrics";
import { buildIndustryFigures, median, revenueGrowth5y } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company } from "@/types/company";
import type { Feature, FeatureBlock } from "@/types/feature";
import type { Source } from "@/types/source";

/**
 * The editorial features (JCE-074): three cross-cutting readings of the encyclopedia, built at build time
 * from the released companies only. Every figure in the prose and in the tables is computed here from the
 * entries' printed figures — the same inputs `buildIndustryFigures` and `companyMetrics` use — and
 * interpolated into the sentences, so a number in the text cannot drift from the data. Aggregates are
 * labelled 計算値 in each table's note, with their formula and scope, as the rankings do (JCE-038/JCE-062).
 * Prose cites no figure but revenue and net income (invariant 4); the ratios and medians shown are the
 * computed layer, never a valuation measure.
 */

const EDINET: Source = {
  id: "edinet",
  title: "EDINET（有価証券報告書等の開示書類に関する電子開示システム）",
  publisher: "金融庁",
  url: "https://disclosure2.edinet-fsa.go.jp/",
  accessedAt: "2026-11-20",
};

const PUBLISHED_AT = "2026-11-20";

const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;
const times2 = (v: number) => `${v.toFixed(2)}倍`;
const manYen = (v: number) =>
  `${(v / 10000).toLocaleString("ja-JP", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}万円`;
const count = (n: number) => `${n.toLocaleString("ja-JP")}社`;

/** Overseas ratio of one company, from its 地域ごとの情報 as printed (the JCE-038 ratio, via companyMetrics). */
function overseasOf(company: Company): { ratio: number; fiscalYear: string } | null {
  const ratio = companyMetrics(company)?.overseasSalesRatio;
  return ratio ? { ratio: ratio.percent / 100, fiscalYear: ratio.fiscalYear } : null;
}

function overseasArticle(companies: Company[]): Feature {
  const data = buildIndustryFigures(companies);
  const withRatio = companies
    .map((c) => ({ company: c, o: overseasOf(c) }))
    .filter((x): x is { company: Company; o: { ratio: number; fiscalYear: string } } => x.o !== null)
    .sort((a, b) => b.o.ratio - a.o.ratio);
  const ratios = withRatio.map((x) => x.o.ratio);
  const medianRatio = median(ratios)!;
  const over50 = ratios.filter((r) => r >= 0.5).length;

  let domestic = 0;
  let overseas = 0;
  for (const c of companies) {
    const items = c.regionalRevenue?.items;
    if (!items || items.filter((i) => i.domestic).length !== 1) continue;
    domestic += items.filter((i) => i.domestic).reduce((acc, i) => acc + i.amount, 0);
    overseas += items.filter((i) => !i.domestic).reduce((acc, i) => acc + i.amount, 0);
  }
  const weighted = overseas / (domestic + overseas);

  const industryRows = data.industries
    .filter((i) => i.overseasSalesRatio && i.overseasSalesRatio.companies >= 3)
    .sort((a, b) => b.overseasSalesRatio!.value - a.overseasSalesRatio!.value);
  const top = withRatio.slice(0, 10);
  const topCompany = top[0]!;
  const lowest = withRatio.at(-1)!;
  const topCallout: FeatureBlock[] = topCompany.company.description
    ? [{ type: "company-callout", companyId: topCompany.company.id, text: topCompany.company.description }]
    : [];

  const body: FeatureBlock[] = [
    {
      type: "paragraph",
      text: `日本の上場企業は、売上のどれだけを海外で得ているのでしょうか。有価証券報告書の「地域ごとの情報」に地域別の売上高を印字した会社は、掲載企業${count(companies.length)}のうち${count(withRatio.length)}でした。この特集は、その${count(withRatio.length)}だけを対象に、海外売上高比率（日本以外の売上高 ÷ 地域別売上高の合計、計算値）を集計したものです。地域別の情報を出していない会社は「海外売上がない」のではなく「わからない」ため、対象から除いています。`,
      sourceIds: ["edinet"],
    },
    {
      type: "paragraph",
      text: `対象${count(withRatio.length)}の中央値は${pct1(medianRatio)}で、比率が50%以上、つまり売上の半分以上を海外で得ている会社が${count(over50)}ありました。売上高の金額で重みづけした集計では海外が${pct1(weighted)}になります。地域別情報をあえて開示する会社は、もともと海外で事業をしている会社に偏ります。それを割り引いても、「海外で稼ぐ会社」の姿は、輸出のイメージよりも広い業種に及んでいます。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "業界で見る：電子部品と医薬品が先行する" },
    {
      type: "data-table",
      title: "業界別の海外売上高比率（中央値）",
      columns: ["海外売上高比率（計算値）", "対象"],
      rows: industryRows.map((i) => ({
        label: INDUSTRY_LABELS[i.id].name,
        href: `/industries/${i.id}`,
        values: [pct1(i.overseasSalesRatio!.value), count(i.overseasSalesRatio!.companies)],
      })),
      note: "計算値：日本以外の売上高 ÷ 地域別売上高の合計を会社ごとに求め、業界の中央値を取ったもの。対象は地域別の売上高を印字した会社のみで、対象が3社未満の業界は載せていません。有価証券報告書に基づく集計で、業界ランキング（海外売上高比率）と同じ算出方法です。",
    },
    {
      type: "paragraph",
      text: `もっとも高いのは[[industry:semiconductors|半導体]]と[[industry:electronics|電機・エレクトロニクス]]で、中央値でも売上の8割を超えています。装置や部品は、顧客である世界の製造業に合わせて売るため、国内市場だけでは成り立たない業界です。[[industry:pharmaceuticals|医薬品]]が続くのは、新薬の販売が欧米を中心に広がる会社の比率が高いためです。一方で[[industry:food|食品]]の中央値が5割を超えているのは、地域別情報を出す食品会社自体が、調味料や飲料で海外展開している会社に限られるからで、食品業界全体の姿ではありません。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "会社で見る：9割を超える会社も" },
    {
      type: "data-table",
      title: "海外売上高比率の高い会社",
      columns: ["海外売上高比率（計算値）", "対象期"],
      rows: top.map(({ company, o }) => ({
        label: company.name,
        href: `/companies/${company.id}`,
        values: [pct1(o.ratio), o.fiscalYear],
      })),
      note: "計算値：日本以外の売上高 ÷ 地域別売上高の合計（各社の有価証券報告書「地域ごとの情報」の印字値から算出）。対象期は地域別情報の対象となった事業年度です。",
    },
    {
      type: "paragraph",
      text: `首位の[[company:${topCompany.company.id}|${topCompany.company.name}]]は${pct1(topCompany.o.ratio)}で、売上のほとんどが海外です。上位には半導体製造装置や電子部品、工作機械、タイヤのように、産業財を世界に売る会社が並びます。反対に、対象${count(withRatio.length)}の中で比率がもっとも低かったのは[[company:${lowest.company.id}|${lowest.company.name}]]の${pct1(lowest.o.ratio)}でした。国内の事業が中心でも、地域別の内訳を開示している会社があることがわかります。`,
      sourceIds: ["edinet"],
    },
    ...topCallout,
    {
      type: "paragraph",
      text: "海外売上高比率は、各社の企業ページと業界ページでも、地域別情報を印字した会社について計算値として表示しています。比率そのものよりも、「その会社の顧客はどこにいるのか」を読む手がかりとして使うのが、この数字の役割です。",
    },
  ];

  return {
    id: "overseas-sales-geography",
    title: "海外売上高比率から見る日本の上場企業",
    subtitle: "売上のどれだけを海外で得ているか。地域別の売上高を開示した会社だけを集計すると、輸出産業のイメージとは少し違う地図が見えてきます。",
    body,
    relatedCompanies: [...top.slice(0, 6).map((x) => x.company.id), lowest.company.id],
    relatedIndustries: ["semiconductors", "electronics", "pharmaceuticals", "automotive", "machinery", "chemicals", "food"],
    relatedTerms: ["segment", "annual-securities-report"],
    sources: [EDINET],
    status: { state: "published" },
    publishedAt: PUBLISHED_AT,
  };
}

function salaryArticle(companies: Company[]): Feature {
  const data = buildIndustryFigures(companies);
  const salaries = companies.map((c) => c.workforce?.averageAnnualSalary ?? null).filter((v): v is number => v !== null);
  const overall = median(salaries)!;
  const rows = data.industries
    .filter((i) => i.salaryMedian && i.salaryMedian.companies >= 10)
    .sort((a, b) => b.salaryMedian!.value - a.salaryMedian!.value);
  const topRow = rows[0]!;
  const bottomRow = rows.at(-1)!;
  const gap = topRow.salaryMedian!.value / bottomRow.salaryMedian!.value;

  const body: FeatureBlock[] = [
    {
      type: "paragraph",
      text: `有価証券報告書の「従業員の状況」には、提出会社（単体）の平均年間給与が印字されています。掲載企業${count(companies.length)}のうち${count(salaries.length)}がこの金額を載せており、全体の中央値は${manYen(overall)}でした。この特集では、対象が10社以上ある業界について、業界ごとの中央値を並べます。金額はすべて報告書の印字どおりで、計算値は中央値と倍率だけです。`,
      sourceIds: ["edinet"],
    },
    {
      type: "data-table",
      title: "業界別の平均年間給与（中央値）",
      columns: ["平均年間給与の中央値", "対象"],
      rows: rows.map((i) => ({
        label: INDUSTRY_LABELS[i.id].name,
        href: `/industries/${i.id}`,
        values: [manYen(i.salaryMedian!.value), count(i.salaryMedian!.companies)],
      })),
      note: "各社の金額は有価証券報告書「従業員の状況」の平均年間給与（提出会社）の印字どおり。中央値とその算出は計算値です。対象が10社未満の業界は載せていません。",
    },
    {
      type: "paragraph",
      text: `上位は[[industry:finance|金融]]（${manYen(topRow.salaryMedian!.value)}）、エネルギー、半導体、医薬品と続きます。下位は人材サービスと[[industry:retail|小売]]（${manYen(bottomRow.salaryMedian!.value)}）で、首位の業界との差は${times2(gap)}でした。専門職の比率が高い業界が上に来て、店舗や現場の従業員を多く抱える業界が下に来る並びです。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "読むときの注意：これは「提出会社」の平均です" },
    {
      type: "paragraph",
      text: "この金額は連結グループ全体ではなく、報告書を提出した会社単体の平均です。持株会社では、単体の従業員が経営層や専門職に限られるため、金額が高く出ることがあります。逆に、店舗や工場の従業員を単体で直接雇用する会社では、現場の構成がそのまま平均に表れます。業界の中央値どうしの比較でも、雇用の形の違いが混ざっている点には注意が必要です。",
    },
    {
      type: "paragraph",
      text: "もう一つ、平均年間給与は年齢や勤続の構成にも左右されます。各社の企業ページでは、平均年間給与と並んで平均勤続年数も印字どおりに載せています。給与の水準だけを取り出すのではなく、どんな人が働く会社なのかと合わせて読むための数字です。",
    },
  ];

  return {
    id: "average-salary-by-industry",
    title: "平均年間給与の業界地図",
    subtitle: "有価証券報告書に印字された提出会社の平均年間給与を、業界ごとに中央値で並べた地図です。雇用の形の違いと合わせて読みます。",
    body,
    relatedCompanies: [],
    relatedIndustries: ["finance", "energy", "semiconductors", "pharmaceuticals", "retail", "human-resources"],
    relatedTerms: ["annual-securities-report"],
    sources: [EDINET],
    status: { state: "published" },
    publishedAt: PUBLISHED_AT,
  };
}

function growthArticle(companies: Company[]): Feature {
  const data = buildIndustryFigures(companies);
  const withGrowth = companies
    .map((c) => ({ company: c, growth: revenueGrowth5y(c) }))
    .filter((x): x is { company: Company; growth: number } => x.growth !== null);
  const growths = withGrowth.map((x) => x.growth);
  const medianGrowth = median(growths)!;
  const up = growths.filter((g) => g > 1).length;
  const down = growths.filter((g) => g < 1).length;

  const rows = data.industries
    .filter((i) => i.revenueGrowth5y && i.revenueGrowth5y.companies >= 10)
    .sort((a, b) => b.revenueGrowth5y!.value - a.revenueGrowth5y!.value);
  const topRow = rows[0]!;
  const bottomRow = rows.at(-1)!;

  const bigBase = withGrowth
    .map((x) => {
      const records = [...x.company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
      return { ...x, first: records[0]!, last: records.at(-1)! };
    })
    .filter((x) => x.first.revenue !== null && x.first.revenue >= 10_000_000_000)
    .sort((a, b) => b.growth - a.growth);
  const bigTop = bigBase.slice(0, 8);
  const bigBottom = bigBase.slice(-5).reverse();

  const body: FeatureBlock[] = [
    {
      type: "paragraph",
      text: `掲載企業のうち、5期分の売上高がそろったのは${count(withGrowth.length)}でした。各社について「最新期の売上高 ÷ 5期前の売上高」（計算値）を求めると、中央値は${times2(medianGrowth)}、伸びた会社が${count(up)}（${pct1(up / withGrowth.length)}）、縮んだ会社が${count(down)}（${pct1(down / withGrowth.length)}）でした。起点となる期には、コロナ禍で売上が落ち込んだ時期を含む会社が多いため、伸びには落ち込みからの戻りも混ざっています。`,
      sourceIds: ["edinet"],
    },
    {
      type: "data-table",
      title: "業界別の5期の売上成長（中央値）",
      columns: ["5期の伸び（計算値）", "対象"],
      rows: rows.map((i) => ({
        label: INDUSTRY_LABELS[i.id].name,
        href: `/industries/${i.id}`,
        values: [times2(i.revenueGrowth5y!.value), count(i.revenueGrowth5y!.companies)],
      })),
      note: "計算値：最新期の売上高 ÷ 5期前の売上高を会社ごとに求め、業界の中央値を取ったもの。売上高は有価証券報告書の印字値。5期分がそろわない会社は除き、対象が10社未満の業界は載せていません。",
    },
    {
      type: "paragraph",
      text: `業界の中央値で見ると、もっとも伸びが大きいのは[[industry:entertainment|エンターテインメント]]（${times2(topRow.revenueGrowth5y!.value)}）で、金融、IT・ソフトウェア、不動産が続きます。もっとも小さい[[industry:media|メディア]]でも${times2(bottomRow.revenueGrowth5y!.value)}と、中央値が1.00倍を下回る業界はありませんでした。つまりこの5期で「縮んだ業界」はなく、縮小は業界単位ではなく、会社ごとに起きています。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "会社で見る：大きく伸びた会社、縮んだ会社" },
    {
      type: "data-table",
      title: "5期で大きく伸びた会社（5期前の売上高が100億円以上の会社）",
      columns: ["5期の伸び（計算値）", "期間"],
      rows: bigTop.map((x) => ({
        label: x.company.name,
        href: `/companies/${x.company.id}`,
        values: [times2(x.growth), `${x.first.fiscalYear}→${x.last.fiscalYear}`],
      })),
      note: "計算値：最新期の売上高 ÷ 5期前の売上高。母数が小さいと倍率が大きく振れるため、5期前の売上高が100億円未満の会社は除いています。売上高は各社の有価証券報告書の印字値です。",
    },
    {
      type: "data-table",
      title: "5期で縮んだ会社（5期前の売上高が100億円以上の会社）",
      columns: ["5期の伸び（計算値）", "期間"],
      rows: bigBottom.map((x) => ({
        label: x.company.name,
        href: `/companies/${x.company.id}`,
        values: [times2(x.growth), `${x.first.fiscalYear}→${x.last.fiscalYear}`],
      })),
      note: "計算値：最新期の売上高 ÷ 5期前の売上高。1.00倍未満が縮小です。対象の限定は上の表と同じです。",
    },
    {
      type: "paragraph",
      text: "伸びの上位には、コロナ禍で落ち込んだ空港や旅行に関わる会社の戻りと、買収や新規事業で売上そのものを組み替えた会社が混ざっています。倍率だけでは、その伸びが「同じ事業が育った」のか「会社の形が変わった」のかはわかりません。各社の企業ページにある5期の売上と事業の説明と合わせて読むと、倍率の意味が見えてきます。",
    },
  ];

  return {
    id: "five-year-revenue-growth",
    title: "5期の売上成長で見る業界の伸びと縮み",
    subtitle: "5期分の売上高がそろった会社について、伸びの中央値を業界ごとに並べ、大きく伸びた会社と縮んだ会社を見ます。",
    body,
    relatedCompanies: [...bigTop.slice(0, 4).map((x) => x.company.id), ...bigBottom.slice(0, 2).map((x) => x.company.id)],
    relatedIndustries: ["entertainment", "finance", "it", "media", "chemicals"],
    relatedTerms: ["annual-securities-report"],
    sources: [EDINET],
    status: { state: "published" },
    publishedAt: PUBLISHED_AT,
  };
}

/** The three features, newest data first: a pure function of the released companies, rebuilt with the site. */
export function buildFeatures(companies: Company[]): Feature[] {
  return [overseasArticle(companies), salaryArticle(companies), growthArticle(companies)];
}
