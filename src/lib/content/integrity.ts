import { extractReferences, findMalformedMarkup } from "@/lib/rich-text";
import type { Business, Company } from "@/types/company";
import { INDUSTRY_IDS } from "@/types/company";
import type { Industry } from "@/types/industry";
import type { Source } from "@/types/source";
import type { Term } from "@/types/term";

/**
 * Content rules beyond the shape the schemas check — the executable form of
 * CLAUDE.md invariants 1, 2 and 4. Shared by the local editor (a save that
 * breaks a rule is refused) and by the test suite (nothing that breaks a rule
 * can be committed without a failing test).
 *
 * Each function returns messages, empty when the content is sound. Messages
 * are Japanese because the editor shows them to the operator.
 */

export type ContentContext = {
  companyIds: ReadonlySet<string>;
  termIds: ReadonlySet<string>;
  featureIds: ReadonlySet<string>;
};

const INDUSTRY_ID_SET = new Set<string>(INDUSTRY_IDS);

/** The rows printed beside revenue and net income in 有報 tables, and investment language (invariant 4). */
export const BANNED_INVESTMENT_TERMS = [
  "株価", "PER", "PBR", "ROE", "ROA", "EPS", "配当利回り", "目標株価", "買い推奨", "売り推奨",
  "自己資本利益率", "時価総額", "配当性向", "1株当たり", "１株当たり",
] as const;

export function flattenBusinesses(list: Business[]): Business[] {
  return list.flatMap((b) => [b, ...flattenBusinesses(b.children ?? [])]);
}

function sourceErrors(sources: Source[], owner: string): string[] {
  const errors: string[] = [];
  const ids = sources.map((s) => s.id);
  if (new Set(ids).size !== ids.length) errors.push(`${owner}: 出典の id が重複しています`);
  for (const s of sources) {
    if (/wikipedia\.org/i.test(s.url)) errors.push(`${owner}: 出典「${s.title}」— Wikipedia は出典にできません`);
  }
  return errors;
}

function citationErrors(sourceIds: string[], sources: Source[], where: string): string[] {
  if (sourceIds.length === 0) return [`${where}: 出典が1つもありません（事実を述べる項目には出典が必要です）`];
  const known = new Set(sources.map((s) => s.id));
  return sourceIds.filter((id) => !known.has(id)).map((id) => `${where}: 出典「${id}」が出典一覧にありません`);
}

function richTextErrors(text: string, where: string, context: ContentContext): string[] {
  const errors = findMalformedMarkup(text).map(
    () => `${where}: [[…]] の書き方が正しくありません（正しくは [[term:segment|セグメント]] のように kind:id とラベルを | で区切ります）`,
  );
  for (const ref of extractReferences(text)) {
    const exists =
      ref.kind === "company"
        ? context.companyIds.has(ref.id)
        : ref.kind === "industry"
          ? INDUSTRY_ID_SET.has(ref.id)
          : ref.kind === "term"
            ? context.termIds.has(ref.id)
            : context.featureIds.has(ref.id);
    if (!exists) errors.push(`${where}: リンク先 ${ref.kind}「${ref.id}」が存在しません`);
  }
  return errors;
}

export function checkCompany(company: Company, context: ContentContext): string[] {
  const e: string[] = [];
  const src = company.sources;

  /*
    A figures-only entry is identity, listings, figures and sources, with none of
    the writing. The point of checking it here rather than in the schema is that
    the shape alone cannot tell a deliberate floor from an unfinished entry: what
    makes it deliberate is that EVERY written part is absent. A half-written entry
    carrying this status would hide real gaps behind a label that says there are
    none, which is the failure this whole ruleset exists to prevent.
  */
  const figuresOnly = company.status.state === "figures-only";
  if (figuresOnly) {
    const written = [
      ["一文の説明", company.description !== null],
      ["事業", company.businesses.length > 0],
      ["ビジネスモデル", Boolean(company.businessModel)],
      ["歴史", company.history.length > 0],
      ["業界", company.industries.length > 0],
      ["関連企業", company.relatedCompanies.length > 0],
    ].filter(([, present]) => present);
    if (written.length > 0) {
      e.push(`状態「数値のみ」: ${written.map(([label]) => label).join("・")} が書かれています。書いたのなら状態を変えてください`);
    }
    if (company.financials.length === 0) e.push("状態「数値のみ」: 財務データが1年分もありません");
  } else if (company.description === null) {
    e.push("一文の説明がありません（解説を書かないのであれば状態を「数値のみ」にしてください）");
  }

  // The 3-second sentence.
  if (company.description !== null) {
    if (company.description.length > 90) e.push(`一文の説明: ${company.description.length}文字です（90文字以内）`);
    if (company.description.split("。").filter(Boolean).length > 1) e.push("一文の説明: 一文にしてください");
  }

  e.push(...sourceErrors(src, "出典"));

  const businesses = flattenBusinesses(company.businesses);
  const businessIds = businesses.map((b) => b.id);
  if (new Set(businessIds).size !== businessIds.length) e.push("事業: id が重複しています");
  for (const b of businesses) e.push(...citationErrors(b.sourceIds, src, `事業「${b.name}」`));

  if (company.businessModel) {
    const kinds = company.businessModel.flow.map((s) => s.kind).join(",");
    if (kinds !== "company,offering,customer,revenue,profit") {
      e.push("ビジネスモデル: 流れは 会社→製品・サービス→顧客→売上→利益 の5段階を、この順に1つずつ置きます");
    }
    e.push(...citationErrors(company.businessModel.sourceIds, src, "ビジネスモデル"));
  }

  const periods = company.financials.map((f) => f.periodEnd);
  if (new Set(periods).size !== periods.length) e.push("財務: 同じ年度が重複しています");
  for (const f of company.financials) {
    const where = `財務「${f.fiscalYear}」`;
    for (const [label, value] of [["売上", f.revenue], ["純利益", f.netIncome]] as const) {
      // 千円, not 百万円. Large caps print their five-year table in 百万円 and every
      // figure in the first 81 entries is divisible by 1,000,000 — but smaller
      // companies print 千円, and 中外鉱業 (281,692,181,000円) and ベルグアース
      // (7,303,461,000円) are exact to that. Demanding whole 百万円 would force
      // their own figures to be rounded away. The point of the rule is to catch a
      // value entered in the filing’s display unit instead of yen, and 千円
      // granularity still catches that; the exact match against the XBRL in
      // verify-financials is what actually guarantees the number.
      if (value !== null && (!Number.isSafeInteger(value) || Math.abs(value % 1_000) !== 0)) {
        e.push(`${where}: ${label}は千円単位の整数（円換算）である必要があります`);
      }
    }
    e.push(...citationErrors(f.sourceIds, src, where));
  }
  const withBasis = company.financials.filter((f) => f.revenueBasis !== undefined).length;
  const withNetBasis = company.financials.filter((f) => f.netIncomeBasis !== undefined).length;
  if (withBasis !== 0 && withBasis !== company.financials.length) e.push("財務: 売上の集計範囲は全年度に書くか、どの年度にも書かないかのどちらかです");
  if (withNetBasis !== withBasis) e.push("財務: 純利益の集計範囲は、売上の集計範囲と同じ年度に書きます");
  const hasNull = company.financials.some((f) => f.revenue === null || f.netIncome === null);
  if (hasNull && company.status.state !== "needs-attention") {
    e.push("財務: 確認できない数値（空欄）がある場合、状態は「要確認」にして理由を書きます");
  }

  for (const h of company.history) e.push(...citationErrors(h.sourceIds, src, `歴史「${h.year} ${h.title}」`));

  if (!figuresOnly && company.industries.filter((r) => r.primary).length !== 1) {
    e.push("業界: 主な業界をちょうど1つ選んでください");
  }
  if (new Set(company.industries.map((r) => r.industryId)).size !== company.industries.length) e.push("業界: 同じ業界が重複しています");

  for (const r of company.relatedCompanies) {
    const where = `関連企業「${r.companyId}」`;
    if (r.companyId === company.id) e.push(`${where}: 自社を関連企業にはできません`);
    else if (!context.companyIds.has(r.companyId)) e.push(`${where}: 掲載されていない企業です`);
    e.push(...citationErrors(r.sourceIds, src, where));
  }

  const texts: [string, string][] = [
    ...(company.description ? ([["一文の説明", company.description]] as [string, string][]) : []),
    ...businesses.map((b): [string, string] => [`事業「${b.name}」`, b.description]),
    ...(company.businessModel
      ? [
          ["ビジネスモデル", company.businessModel.description] as [string, string],
          ...company.businessModel.flow.map((s): [string, string] => [`ビジネスモデル「${s.title}」`, s.description]),
        ]
      : []),
    ...company.history.flatMap((h): [string, string][] => [
      [`歴史「${h.year}」の説明`, h.description],
      [`歴史「${h.year}」の意味`, h.significance],
    ]),
  ];
  for (const [where, value] of texts) e.push(...richTextErrors(value, where, context));

  // [[…]] is a link only where the page passes the text through RichText, which
  // is exactly the `texts` list above. Anywhere else — relatedCompanies[].description,
  // a financial note, a product name, a step title — the string is rendered as-is
  // and the reader sees a literal [[term:segment|セグメント]].
  //
  // This rule exists because that had already happened: fourteen published entries
  // had links in businessModel.flow[].description while the component rendered it
  // raw, and richTextErrors could not see it because it only looks at the fields
  // that ARE rich text. The flow descriptions are now rendered as rich text (they
  // are prose, and a beginner needs the term links there); relatedCompanies[]
  // deliberately is not, because that description sits inside the card's own
  // <Link> and a RichText link would nest one anchor inside another.
  const markupCount = (value: string) => (value.match(/\[\[/g) ?? []).length;
  const markupInRichText = texts.reduce((n, [, value]) => n + markupCount(value), 0);
  if (markupCount(JSON.stringify(company)) > markupInRichText) {
    e.push(
      "[[…]] のリンクは、リンクとして表示される項目（一文の説明・事業の説明・ビジネスモデルの説明と流れの各段階・歴史の説明と意味）にだけ書けます。ほかの項目では [[…]] がそのまま読者に見えます",
    );
  }

  const serialized = JSON.stringify(company);
  for (const banned of BANNED_INVESTMENT_TERMS) {
    // Latin acronyms need a word boundary. A plain substring test rejected
    // 「ANA SUPER VALUEセール」 because SU-PER- contains PER, and a researcher had
    // to drop a brand name the filing prints. Japanese terms have no word
    // boundary to anchor to and stay substring matches — 「1株当たり」 inside a
    // longer phrase is still 1株当たり.
    const hit = /^[A-Za-z]+$/.test(banned)
      ? new RegExp(`(^|[^A-Za-z])${banned}([^A-Za-z]|$)`).test(serialized)
      : serialized.includes(banned);
    if (hit) e.push(`投資指標にあたる語「${banned}」は掲載しません`);
  }
  return e;
}

export function checkTerm(term: Term, context: ContentContext): string[] {
  const e = sourceErrors(term.sources, "出典");
  if (term.description.length > 160) e.push(`説明: ${term.description.length}文字です（160文字以内）`);
  for (const id of term.relatedTermIds ?? []) {
    if (id === term.id) e.push("関連用語: 自分自身は指定できません");
    else if (!context.termIds.has(id)) e.push(`関連用語「${id}」が存在しません`);
  }
  return e;
}

export function checkIndustry(industry: Industry, context: ContentContext & { companies: Company[] }): string[] {
  const e = sourceErrors(industry.sources, "出典");
  e.push(...citationErrors(industry.sourceIds, industry.sources, "業界の説明"));
  e.push(...richTextErrors(industry.description, "業界の説明", context));
  for (const category of industry.categories) {
    const where = `分類「${category.name}」`;
    e.push(...citationErrors(category.sourceIds, industry.sources, where));
    e.push(...richTextErrors(category.description, where, context));
    if (category.role === "input" && industry.structure !== "chain") e.push(`${where}: 「支える産業」は流れ（chain）の業界にだけ置けます`);
    for (const companyId of category.companyIds) {
      const company = context.companies.find((c) => c.id === companyId);
      if (!company) e.push(`${where}: 企業「${companyId}」は掲載されていません`);
      else if (!company.industries.some((r) => r.industryId === industry.id)) {
        e.push(`${where}: 企業「${company.name}」はこの業界を自社の業界に含めていません`);
      }
    }
  }
  return e;
}
