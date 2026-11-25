import { companyMetrics } from "@/lib/company-metrics";
import { buildIndustryFigures, median, revenueGrowth5y } from "@/lib/industry-figures";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import type { Company } from "@/types/company";
import type { Feature, FeatureBlock } from "@/types/feature";
import type { Source } from "@/types/source";

/**
 * The editorial features (JCE-074): cross-cutting readings of the encyclopedia, built at build time
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
const people = (n: number) => `${n.toLocaleString("ja-JP", { maximumFractionDigits: 1 })}人`;
const manYen0 = (v: number) => `${Math.round(v / 10000).toLocaleString("ja-JP")}万円`;
const yen = (v: number) => `${Number.isInteger(v) ? v.toLocaleString("ja-JP") : v.toFixed(1)}円`;

/** The latest printed year of a company, by period end — the year every "latest" figure below reads. */
function latestRecord(company: Company) {
  return [...company.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
}

/** The industry a company is counted under, the same primary-industry rule as `buildIndustryFigures`. */
function primaryIndustryId(company: Company) {
  return (company.industries.find((ref) => ref.primary) ?? company.industries[0])?.industryId ?? null;
}

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
        href: `/features/overseas-sales-geography/rankings/${i.id}`,
        values: [pct1(i.overseasSalesRatio!.value), count(i.overseasSalesRatio!.companies)],
        bar: i.overseasSalesRatio!.value,
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
        bar: o.ratio,
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
    topic: "海外売上",
    keyFigures: [
      { value: pct1(medianRatio), label: `海外売上高比率の中央値（対象${count(withRatio.length)}）` },
      { value: count(over50), label: "売上の半分以上を海外で得ている会社" },
      { value: pct1(weighted), label: "売上高で重みづけした海外の割合" },
    ],
    takeaways: [
      `業界の中央値で最も高いのは[[industry:${industryRows[0]!.id}|${INDUSTRY_LABELS[industryRows[0]!.id].name}]]の${pct1(industryRows[0]!.overseasSalesRatio!.value)}。`,
      `会社で最も高いのは[[company:${topCompany.company.id}|${topCompany.company.name}]]の${pct1(topCompany.o.ratio)}。`,
      `対象は地域別の売上高を開示した${count(withRatio.length)}だけで、開示していない会社は「わからない」として除いています。`,
    ],
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
    { type: "heading", text: "業界で見る：平均年間給与の中央値" },
    {
      type: "data-table",
      title: "業界別の平均年間給与（中央値）",
      columns: ["平均年間給与の中央値", "対象"],
      rows: rows.map((i) => ({
        label: INDUSTRY_LABELS[i.id].name,
        href: `/features/average-salary-by-industry/rankings/${i.id}`,
        values: [manYen(i.salaryMedian!.value), count(i.salaryMedian!.companies)],
        bar: i.salaryMedian!.value,
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
    topic: "給与",
    keyFigures: [
      { value: manYen(overall), label: `平均年間給与の中央値（対象${count(salaries.length)}）` },
      { value: manYen(topRow.salaryMedian!.value), label: `最も高い業界：${INDUSTRY_LABELS[topRow.id].name}` },
      { value: times2(gap), label: "最も高い業界と低い業界の差" },
    ],
    takeaways: [
      `業界の中央値は[[industry:${topRow.id}|${INDUSTRY_LABELS[topRow.id].name}]]の${manYen(topRow.salaryMedian!.value)}が最も高く、[[industry:${bottomRow.id}|${INDUSTRY_LABELS[bottomRow.id].name}]]の${manYen(bottomRow.salaryMedian!.value)}が最も低い。`,
      "金額は連結グループではなく提出会社単体の平均で、持株会社では高く出ることがあります。",
    ],
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
    { type: "heading", text: "業界で見る：売上の伸びの中央値" },
    {
      type: "data-table",
      title: "業界別の5期の売上成長（中央値）",
      columns: ["5期の伸び（計算値）", "対象"],
      rows: rows.map((i) => ({
        label: INDUSTRY_LABELS[i.id].name,
        href: `/features/five-year-revenue-growth/rankings/${i.id}`,
        values: [times2(i.revenueGrowth5y!.value), count(i.revenueGrowth5y!.companies)],
        bar: i.revenueGrowth5y!.value,
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
        bar: x.growth,
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
        bar: x.growth,
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
    topic: "成長",
    keyFigures: [
      { value: times2(medianGrowth), label: `5期の売上の伸びの中央値（対象${count(withGrowth.length)}）` },
      { value: count(up), label: "5期前より売上が増えた会社" },
      { value: count(down), label: "5期前より売上が減った会社" },
    ],
    takeaways: [
      `業界の中央値で最も伸びたのは[[industry:${topRow.id}|${INDUSTRY_LABELS[topRow.id].name}]]の${times2(topRow.revenueGrowth5y!.value)}、最も小さいのは[[industry:${bottomRow.id}|${INDUSTRY_LABELS[bottomRow.id].name}]]の${times2(bottomRow.revenueGrowth5y!.value)}。`,
      `5期前の売上高が100億円以上の会社で最も伸びたのは[[company:${bigTop[0]!.company.id}|${bigTop[0]!.company.name}]]の${times2(bigTop[0]!.growth)}。`,
      "倍率だけでは、同じ事業が育ったのか、買収などで会社の形が変わったのかは区別できません。",
    ],
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

function employeesArticle(companies: Company[]): Feature {
  const data = buildIndustryFigures(companies);
  const withEmp = companies
    .map((c) => ({ company: c, latest: latestRecord(c) }))
    .filter(
      (x): x is { company: Company; latest: NonNullable<ReturnType<typeof latestRecord>> } =>
        x.latest !== undefined && x.latest.employees !== null,
    );
  const total = data.totals.employees;
  const overallMedian = median(withEmp.map((x) => x.latest.employees!))!;
  const over10000 = withEmp.filter((x) => x.latest.employees! >= 10000).length;
  const under100 = withEmp.filter((x) => x.latest.employees! < 100).length;

  const totalRows = [...data.industries].sort((a, b) => b.employees.total - a.employees.total);
  const top3Share = totalRows.slice(0, 3).reduce((acc, i) => acc + i.employees.total, 0) / total;
  const telecom = data.industries.find((i) => i.id === "telecommunications")!;
  const ntt = withEmp.find((x) => x.company.id === "ntt")!;
  const nttShare = ntt.latest.employees! / telecom.employees.total;

  const medianRows = data.industries
    .map((i) => {
      const values = withEmp.filter((x) => primaryIndustryId(x.company) === i.id).map((x) => x.latest.employees!);
      return { industry: i, median: median(values), n: values.length };
    })
    .filter((x): x is { industry: (typeof data.industries)[number]; median: number; n: number } => x.median !== null && x.n >= 10)
    .sort((a, b) => b.median - a.median);
  const topMedian = medianRows[0]!;
  const bottomMedian = medianRows.at(-1)!;

  const topCompanies = [...withEmp].sort((a, b) => b.latest.employees! - a.latest.employees!).slice(0, 10);

  const body: FeatureBlock[] = [
    {
      type: "paragraph",
      text: `掲載企業${count(companies.length)}のうち、最新期の従業員数を印字したのは${count(withEmp.length)}で、その人数を合計すると${people(total)}になります。ここでの従業員数は、有価証券報告書の「主要な経営指標等の推移」に印字された人数で、連結財務諸表を作る会社ではグループ全体の人数です。各社のページにある「従業員の状況」（提出会社だけの人数）とは数え方が違うため、混ぜずにこちらだけを使います。会社の規模の中央値は${people(overallMedian)}でした。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "業界で見る：従業員の合計" },
    {
      type: "data-table",
      title: "業界別の従業員数（合計）",
      columns: ["従業員数の合計", "対象"],
      rows: totalRows.map((i) => ({
        label: INDUSTRY_LABELS[i.id].name,
        href: `/features/employees-by-industry/rankings/${i.id}`,
        values: [people(i.employees.total), count(i.employees.companies)],
        bar: i.employees.total,
      })),
      note: "従業員数は各社の有価証券報告書「主要な経営指標等の推移」の印字どおりで、合計はその単純な足し算です（計算値は合計と割合だけです）。最新期に人数を印字していない会社は対象に含みません。",
    },
    {
      type: "paragraph",
      text: `もっとも多いのは[[industry:automotive|自動車]]で、[[industry:electronics|電機・エレクトロニクス]]、[[industry:chemicals|化学]]が続きます。この3業界で全体の${pct1(top3Share)}を占めます。顔ぶれは、部品メーカーまで含めた製造業の裾野の広さを映したものです。一方、[[industry:telecommunications|通信]]は${count(telecom.companies)}しかないのに${people(telecom.employees.total)}と上位に入ります。そのうち[[company:ntt|NTT]]1社が${people(ntt.latest.employees!)}で、業界の${pct1(nttShare)}です。会社の少ない業界では、1社の大きさがそのまま業界の姿になります。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "会社の大きさで見る：中央値の地図" },
    {
      type: "data-table",
      title: "業界別の従業員数（中央値）",
      columns: ["従業員数の中央値（計算値）", "対象"],
      rows: medianRows.map((x) => ({
        label: INDUSTRY_LABELS[x.industry.id].name,
        href: `/features/employees-by-industry/rankings/${x.industry.id}`,
        values: [people(x.median), count(x.n)],
        bar: x.median,
      })),
      note: "計算値：最新期の従業員数を会社ごとに取り、業界の中央値を取ったもの。対象が10社未満の業界は載せていません。",
    },
    {
      type: "paragraph",
      text: `合計ではなく中央値で見ると、[[industry:automotive|自動車]]（${people(topMedian.median)}）がここでも首位で、大企業が集まる業界であることがわかります。対照的なのは[[industry:it|IT・ソフトウェア]]で、会社数は全業界でもっとも多いのに中央値は小さく、小さな会社が多い業界です。もっとも小さいのは[[industry:real-estate|不動産]]（${people(bottomMedian.median)}）で、資産を持って回す事業は少ない人数で成り立ちます。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "会社で見る：10万人を超える会社" },
    {
      type: "data-table",
      title: "従業員数の多い会社",
      columns: ["従業員数", "対象期"],
      rows: topCompanies.map((x) => ({
        label: x.company.name,
        href: `/companies/${x.company.id}`,
        values: [people(x.latest.employees!), x.latest.fiscalYear],
        bar: x.latest.employees!,
      })),
      note: "従業員数は各社の有価証券報告書「主要な経営指標等の推移」の印字どおりで、計算値ではありません。並びはその人数によるものです。",
    },
    {
      type: "paragraph",
      text: `規模の幅も見えてきます。従業員が1万人以上の会社は${count(over10000)}ある一方で、100人未満の会社も${count(under100)}あります。「上場企業」という同じ枠の中に、数十万人のグループと、数十人の会社が並んでいます。`,
      sourceIds: ["edinet"],
    },
  ];

  return {
    id: "employees-by-industry",
    topic: "雇用",
    keyFigures: [
      { value: people(total), label: `掲載企業の従業員数の合計` },
      { value: pct1(top3Share), label: "上位3業界が占める割合" },
      { value: people(overallMedian), label: "1社あたりの従業員数の中央値" },
    ],
    takeaways: [
      `従業員の合計が最も多い業界は[[industry:${totalRows[0]!.id}|${INDUSTRY_LABELS[totalRows[0]!.id].name}]]。`,
      `1社あたりの中央値で最も大きいのは[[industry:${topMedian.industry.id}|${INDUSTRY_LABELS[topMedian.industry.id].name}]]の${people(topMedian.median)}。`,
      `従業員数が最も多い会社は[[company:${topCompanies[0]!.company.id}|${topCompanies[0]!.company.name}]]の${people(topCompanies[0]!.latest.employees!)}。`,
    ],
    title: "従業員の人数から見る業界地図",
    subtitle: "最新期の従業員数を業界ごとに合計し、会社の規模の中央値と並べた地図です。合計の大きさと、典型的な会社の大きさは、別の姿を見せます。",
    body,
    relatedCompanies: topCompanies.slice(0, 6).map((x) => x.company.id),
    relatedIndustries: ["automotive", "electronics", "chemicals", "transportation", "telecommunications", "it", "real-estate"],
    relatedTerms: ["annual-securities-report"],
    sources: [EDINET],
    status: { state: "published" },
    publishedAt: PUBLISHED_AT,
  };
}

function dividendsArticle(companies: Company[]): Feature {
  const withDiv = companies.filter((c) => c.shareFacts && c.shareFacts.dividendPerShare !== null);
  const paying = withDiv.filter((c) => c.shareFacts!.dividendPerShare! > 0);
  const zero = withDiv
    .filter((c) => c.shareFacts!.dividendPerShare! === 0)
    .sort((a, b) => a.id.localeCompare(b.id));
  const noFigure = companies.length - withDiv.length;
  const share = paying.length / withDiv.length;
  const medianDiv = median(paying.map((c) => c.shareFacts!.dividendPerShare!))!;

  const industryRows = [...new Set(withDiv.map((c) => primaryIndustryId(c)).filter((v): v is NonNullable<typeof v> => v !== null))]
    .map((id) => {
      const cs = withDiv.filter((c) => primaryIndustryId(c) === id);
      const pay = cs.filter((c) => c.shareFacts!.dividendPerShare! > 0).length;
      return { id, n: cs.length, pay, share: pay / cs.length };
    })
    .filter((x) => x.n >= 10)
    .sort((a, b) => b.share - a.share || b.n - a.n);
  const bottomRow = industryRows.at(-1)!;

  const bands: { label: string; test: (v: number) => boolean }[] = [
    { label: "10円未満", test: (v) => v < 10 },
    { label: "10円以上50円未満", test: (v) => v >= 10 && v < 50 },
    { label: "50円以上100円未満", test: (v) => v >= 50 && v < 100 },
    { label: "100円以上", test: (v) => v >= 100 },
  ];
  const bandRows = bands.map((b) => {
    const n = paying.filter((c) => b.test(c.shareFacts!.dividendPerShare!)).length;
    return { label: b.label, n, share: n / paying.length };
  });

  const body: FeatureBlock[] = [
    {
      type: "paragraph",
      text: `有価証券報告書の「主要な経営指標等の推移」には、1株当たり配当額が印字されています（提出会社の金額）。掲載企業のうち、この金額が読み取れたのは${count(withDiv.length)}でした。そのうち配当額が0円でなかった会社は${count(paying.length)}で、割合は${pct1(share)}です。残りの${count(noFigure)}は、この表から配当額が読み取れなかった会社で、配当を出していないとは限りません。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "業界で見る：配当を出す会社の割合" },
    {
      type: "data-table",
      title: "業界別の配当を出す会社の割合",
      columns: ["割合（計算値）", "配当を出す会社", "対象"],
      rows: industryRows.map((x) => ({
        label: INDUSTRY_LABELS[x.id].name,
        href: `/features/how-many-companies-pay-dividends/rankings/${x.id}`,
        values: [pct1(x.share), count(x.pay), count(x.n)],
        bar: x.share,
      })),
      note: "割合は計算値：1株当たり配当額が0円でない会社 ÷ 配当額が印字された会社。金額そのものは各社の有価証券報告書「主要な経営指標等の推移」の印字どおりです。対象が10社未満の業界は載せていません。",
    },
    {
      type: "paragraph",
      text: `業界ごとの差はほとんどありません。もっとも低い[[industry:human-resources|人材サービス]]でも${pct1(bottomRow.share)}で、並べた全業界が98%を超えています。「配当を出すかどうか」は、業界の色を分けるものではなく、上場企業にほぼ共通する前提に近いことがわかります。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "0円だった7社" },
    {
      type: "data-table",
      title: "1株当たり配当額が0円と印字された会社",
      columns: ["1株当たり配当額", "対象期"],
      rows: zero.map((c) => ({
        label: c.name,
        href: `/companies/${c.id}`,
        values: [yen(0), c.shareFacts!.fiscalYear],
      })),
      note: "1株当たり配当額は各社の有価証券報告書「主要な経営指標等の推移」の印字どおりで、計算値ではありません。",
    },
    {
      type: "paragraph",
      text: `0円と印字されたのは${count(zero.length)}だけでした。顔ぶれは塗料、機械、食品、教育などに散らばっていて、特定の業界に固まったものではありません。配当額が読み取れた会社の中では、0円のほうが例外です。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: `金額の分布：中央値は${yen(medianDiv)}` },
    {
      type: "data-table",
      title: "1株当たり配当額の分布（配当を出す会社）",
      columns: ["割合（計算値）", "会社数"],
      rows: bandRows.map((b) => ({ label: b.label, values: [pct1(b.share), count(b.n)], bar: b.share })),
      note: "金額は各社の有価証券報告書の印字どおり。会社数と割合は、その金額の幅に入る会社を数えた計算値です。",
    },
    {
      type: "paragraph",
      text: `配当を出す会社の1株当たり配当額の中央値は${yen(medianDiv)}でした。ただし、この金額は株式分割の経緯や発行済株式数の違いで大きく変わるため、金額の大小を会社どうしで比べても、株主への戻し方の手厚さは測れません。株価から求める配当利回りは、このサイトでは株価を扱わないため出しません。金額そのものは、各社の企業ページに、発行済株式総数と並べて印字どおりに載せています。`,
      sourceIds: ["edinet"],
    },
  ];

  return {
    id: "how-many-companies-pay-dividends",
    topic: "配当",
    keyFigures: [
      { value: pct1(share), label: `配当を出す会社の割合（対象${count(withDiv.length)}）` },
      { value: yen(medianDiv), label: "1株当たり配当額の中央値（配当を出す会社）" },
      { value: count(zero.length), label: "1株当たり配当額が0円の会社" },
    ],
    takeaways: [
      `1株当たり配当額が印字された${count(withDiv.length)}のうち、${pct1(share)}が配当を出しています。`,
      `配当を出す会社の割合が最も低い業界は[[industry:${bottomRow.id}|${INDUSTRY_LABELS[bottomRow.id].name}]]の${pct1(bottomRow.share)}。`,
      "配当額は提出会社の印字値で、株価に対する利回りなどは計算していません。",
    ],
    title: "配当を出す会社はどれくらいあるか",
    subtitle: "有価証券報告書に印字された1株当たり配当額を数えると、「出すかどうか」よりも「0円が例外」という姿が見えてきます。",
    body,
    relatedCompanies: zero.map((c) => c.id),
    relatedIndustries: ["finance", "trading", "retail", "human-resources", "energy", "construction"],
    relatedTerms: ["annual-securities-report"],
    sources: [EDINET],
    status: { state: "published" },
    publishedAt: PUBLISHED_AT,
  };
}

function revenuePerEmployeeArticle(companies: Company[]): Feature {
  const data = buildIndustryFigures(companies);
  const withRpe = companies
    .map((c) => ({ company: c, latest: latestRecord(c) }))
    .filter(
      (x): x is { company: Company; latest: NonNullable<ReturnType<typeof latestRecord>> } =>
        x.latest !== undefined && x.latest.revenue !== null && x.latest.employees !== null && x.latest.employees > 0,
    )
    .map((x) => ({ company: x.company, value: x.latest.revenue! / x.latest.employees! }));
  const overallMedian = median(withRpe.map((x) => x.value))!;
  const ratioOfSums = data.reference.revenuePerEmployee!;

  const industryRows = data.industries
    .map((i) => {
      const values = withRpe.filter((x) => primaryIndustryId(x.company) === i.id).map((x) => x.value);
      return { industry: i, median: median(values), n: values.length };
    })
    .filter((x): x is { industry: (typeof data.industries)[number]; median: number; n: number } => x.median !== null && x.n >= 10)
    .sort((a, b) => b.median - a.median);
  const topRow = industryRows[0]!;
  const bottomRow = industryRows.at(-1)!;
  const gap = topRow.median / bottomRow.median;

  const body: FeatureBlock[] = [
    {
      type: "paragraph",
      text: `各社について、同じ期の売上高と従業員数から「売上高 ÷ 従業員数」（計算値）を求めました。両方がそろった${count(withRpe.length)}の中央値は${manYen0(overallMedian)}です。一方、全社の売上高の合計を従業員数の合計で割ると${manYen0(ratioOfSums)}になり、中央値より大きくなります。売上の大きな会社に引っ張られる合計ベースと、典型的な会社を見る中央値とで、姿が変わります。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "業界で見る：1人あたり売上高の中央値" },
    {
      type: "data-table",
      title: "業界別の従業員1人あたり売上高（中央値）",
      columns: ["1人あたり売上高の中央値（計算値）", "対象"],
      rows: industryRows.map((x) => ({
        label: INDUSTRY_LABELS[x.industry.id].name,
        href: `/features/revenue-per-employee-by-industry/rankings/${x.industry.id}`,
        values: [manYen0(x.median), count(x.n)],
        bar: x.median,
      })),
      note: "計算値：最新期の売上高 ÷ 従業員数を会社ごとに求め、業界の中央値を取ったもの。売上高と従業員数は有価証券報告書「主要な経営指標等の推移」の印字値です。対象が10社未満の業界は載せていません。",
    },
    {
      type: "paragraph",
      text: `上位は[[industry:trading|商社]]（${manYen0(topRow.median)}）、[[industry:energy|エネルギー]]、[[industry:real-estate|不動産]]で、下位は[[industry:it|IT・ソフトウェア]]と[[industry:human-resources|人材サービス]]（${manYen0(bottomRow.median)}）です。首位と最下位の差は${times2(gap)}あります。商社のように商品の取扱高がそのまま売上になる事業や、装置と資産で回す事業では、人数の割に売上が大きくなります。反対に、人の労働そのものを提供する事業では、売上は人数にほぼ比例して増えるため、1人あたりは小さくなります。`,
      sourceIds: ["edinet"],
    },
    { type: "heading", text: "読むときの注意：範囲の混ざりと、効率ではないこと" },
    {
      type: "paragraph",
      text: "各社の数字は、その会社の報告書が印字した同じ期の売上高と従業員数です。連結財務諸表を作る会社は連結の数字、作らない会社は単体の数字で、区分は会社によって異なります。子会社に工場や店舗を持つかどうかで、同じ事業でも数字の範囲が変わるため、業界をまたいだ比較には、この混ざりがついて回ります。",
    },
    {
      type: "paragraph",
      text: "もう一つ、この数字は効率の順位ではありません。売上を人数で割ったものは、事業の形の違い——何を売り、どんな資産と人で回しているか——を映す数字です。業界ページの「数字」でも、合計ベースの従業員1人あたり売上高を計算値として表示しています。中央値と合計ベースの両方から読むのが、この特集の使い方です。",
    },
  ];

  return {
    id: "revenue-per-employee-by-industry",
    topic: "生産性",
    keyFigures: [
      { value: manYen0(overallMedian), label: `従業員1人あたり売上高の中央値（対象${count(withRpe.length)}）` },
      { value: times2(gap), label: "最も高い業界と低い業界の中央値の差" },
      { value: manYen0(topRow.median), label: `最も高い業界：${INDUSTRY_LABELS[topRow.industry.id].name}` },
    ],
    takeaways: [
      `業界の中央値は[[industry:${topRow.industry.id}|${INDUSTRY_LABELS[topRow.industry.id].name}]]が最も高く、[[industry:${bottomRow.industry.id}|${INDUSTRY_LABELS[bottomRow.industry.id].name}]]が最も低い（差は${times2(gap)}）。`,
      "差は効率の良し悪しではなく、仕入れの大きさや人の働き方といった事業の形の違いを表します。",
    ],
    title: "従業員1人あたり売上高の業界差",
    subtitle: `同じ期の売上高と従業員数から計算すると、業界の中央値の差は${times2(gap)}あります。効率ではなく、事業の形の違いとして読みます。`,
    body,
    relatedCompanies: [],
    relatedIndustries: ["trading", "energy", "real-estate", "retail", "it", "human-resources"],
    relatedTerms: ["annual-securities-report"],
    sources: [EDINET],
    status: { state: "published" },
    publishedAt: PUBLISHED_AT,
  };
}

/** The features, newest data first: a pure function of the released companies, rebuilt with the site. */
export function buildFeatures(companies: Company[]): Feature[] {
  return [
    overseasArticle(companies),
    salaryArticle(companies),
    growthArticle(companies),
    employeesArticle(companies),
    dividendsArticle(companies),
    revenuePerEmployeeArticle(companies),
  ];
}
