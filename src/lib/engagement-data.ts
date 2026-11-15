import { buildIndustryFigures } from "@/lib/industry-figures";
import { companyMetrics } from "@/lib/company-metrics";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { firstSentence, toPlainText } from "@/lib/rich-text";
import type { Company, IndustryId, RelationshipKind } from "@/types/company";
import type { Revision } from "@/types/revision";

/**
 * The data behind the engagement features (JCE-052), built at build time as static files so the pages stay static
 * and nothing about a reader is sent anywhere: the connection graph (/connections.json), the filing events
 * (/updates.json) and the quiz pool (/quiz.json). Every fact is the entries' own; the quiz is generated from printed
 * figures and the entries' own descriptions, never written.
 */

const primary = (c: Company): IndustryId | null => (c.industries.find((i) => i.primary) ?? c.industries[0])?.industryId ?? null;
const latest = (c: Company) => [...c.financials].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).at(-1);
const plain = (text: string | null, limit = 90) => {
  if (!text) return "";
  const s = toPlainText(firstSentence(text));
  return s.length > limit ? `${s.slice(0, limit - 1)}…` : s;
};

// ---------------------------------------------------------------------------------------------------------------
// Connections

export type ConnectionsData = {
  nodes: { id: string; name: string; industry: IndustryId | null; industryName: string | null; description: string }[];
  /** [from, to, kind]: the relation as stored on `from`. The explorer reads it from both ends. */
  edges: [string, string, RelationshipKind][];
  /** Seller industry → buyer industry, as the industry map counts them. */
  industryFlows: { from: IndustryId; to: IndustryId; fromName: string; toName: string; ties: number }[];
};

export function buildConnections(companies: Company[]): ConnectionsData {
  const released = new Set(companies.map((c) => c.id));
  const edges: ConnectionsData["edges"] = [];
  const seen = new Set<string>();
  for (const c of companies) {
    for (const r of c.relatedCompanies) {
      if (!released.has(r.companyId) || r.companyId === c.id) continue;
      const key = `${c.id}>${r.companyId}>${r.relationship}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([c.id, r.companyId, r.relationship]);
    }
  }
  const linked = new Set(edges.flatMap(([a, b]) => [a, b]));
  return {
    nodes: companies
      .filter((c) => linked.has(c.id))
      .map((c) => {
        const ind = primary(c);
        return { id: c.id, name: c.name, industry: ind, industryName: ind ? INDUSTRY_LABELS[ind].name : null, description: plain(c.description) };
      }),
    edges,
    industryFlows: buildIndustryFigures(companies).flows.map((f) => ({ ...f, fromName: INDUSTRY_LABELS[f.from].name, toName: INDUSTRY_LABELS[f.to].name })),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Filing events

export type UpdateKind = "yuho" | "hanki" | "tanshin" | "correction";
export type UpdatesData = {
  /** The newest date any event may carry: events are kept for the last `days` days before it. */
  asOf: string;
  days: number;
  names: Record<string, string>;
  /** [companyId, kind, date (YYYY-MM-DD), title] */
  events: [string, UpdateKind, string, string][];
};

const UPDATE_DAYS = 120;
const shiftDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** What each company filed recently, from its own sources and the corrections recorded for it. */
export function buildUpdates(companies: Company[], revisions: Revision[], today: string): UpdatesData {
  const from = shiftDays(today, -UPDATE_DAYS);
  const events: UpdatesData["events"] = [];
  const names: Record<string, string> = {};
  const push = (c: Company, kind: UpdateKind, date: string | undefined, title: string) => {
    if (!date || date < from || date > today) return;
    names[c.id] = c.name;
    events.push([c.id, kind, date, title]);
  };
  const byId = new Map(companies.map((c) => [c.id, c]));
  for (const c of companies) {
    const sourceDate = (ids: string[]) => ids.map((id) => c.sources.find((s) => s.id === id)?.publishedAt).find(Boolean);
    // One event per filing, named after the newest period it reports: a 半期報告書 also prints the same half a year
    // earlier, and that older half is not news.
    const perFiling = <T extends { sourceIds: string[]; periodEnd: string }>(records: T[]) =>
      [...new Map([...records].sort((a, b) => a.periodEnd.localeCompare(b.periodEnd)).map((r) => [r.sourceIds[0], r])).values()];
    for (const f of perFiling(c.financials)) push(c, "yuho", sourceDate(f.sourceIds), `${f.fiscalYear}の有価証券報告書`);
    for (const h of perFiling(c.interimFinancials ?? [])) push(c, "hanki", sourceDate(h.sourceIds), `${h.fiscalYear}の半期報告書`);
    for (const q of c.quarterlyEarnings ?? []) push(c, "tanshin", q.disclosedAt, `${q.fiscalYear} 第${q.quarter}四半期の決算短信`);
  }
  for (const r of revisions) {
    if (r.targetType !== "company" || !/-correct(ed|ion)(-\d+)?$/.test(r.id)) continue;
    const c = byId.get(r.targetId);
    if (c) push(c, "correction", r.changedAt.slice(0, 10), "掲載内容の訂正");
  }
  // One event per company, kind and title: a filing cited by several years is one filing.
  const unique = [...new Map(events.map((e) => [`${e[0]}|${e[1]}|${e[3]}`, e])).values()];
  unique.sort((a, b) => b[2].localeCompare(a[2]) || a[0].localeCompare(b[0]));
  return { asOf: today, days: UPDATE_DAYS, names, events: unique };
}

// ---------------------------------------------------------------------------------------------------------------
// Quiz

export type QuizQuestion = {
  id: string;
  kind: "revenue" | "overseas" | "describe";
  prompt: string;
  /** For "describe": the company's own description with its name hidden. */
  clue?: string;
  options: { id: string; label: string }[];
  answer: string;
  /** What the answer rests on, in the entries' words and printed figures. */
  explain: string;
  industry: string | null;
};

const yen = (v: number) => {
  const oku = Math.round(v / 1e8);
  if (oku >= 10000) return `${Math.floor(oku / 10000).toLocaleString("ja-JP")}兆${oku % 10000 ? `${(oku % 10000).toLocaleString("ja-JP")}億` : ""}円`;
  return `${oku.toLocaleString("ja-JP")}億円`;
};
/** A stable pseudo-random order, so the pool and each day's question do not change between builds of the same data. */
const hash = (s: string) => {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

export function buildQuizPool(companies: Company[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const groups = new Map<IndustryId, Company[]>();
  for (const c of companies) {
    const ind = primary(c);
    if (ind) groups.set(ind, [...(groups.get(ind) ?? []), c]);
  }
  for (const [ind, members] of groups) {
    const industryName = INDUSTRY_LABELS[ind].name;
    // 売上高が大きいのは？ — two companies of one industry whose latest revenues differ by at least 30%, so the answer
    // is the printed figure and not a coin toss between near-equals.
    const withRevenue = members
      .map((c) => ({ c, r: latest(c) }))
      .filter((x) => x.r && x.r.revenue !== null && x.r.revenue > 0)
      .sort((a, b) => hash(a.c.id) - hash(b.c.id));
    for (let i = 0; i + 1 < withRevenue.length && i < 16; i += 2) {
      const [a, b] = [withRevenue[i], withRevenue[i + 1]];
      const big = a.r!.revenue! >= b.r!.revenue! ? a : b;
      const small = big === a ? b : a;
      if (big.r!.revenue! < small.r!.revenue! * 1.3) continue;
      questions.push({
        id: `revenue-${a.c.id}-${b.c.id}`,
        kind: "revenue",
        prompt: `${industryName}の2社。最新期の売上高が大きいのはどっち？`,
        options: [a, b].map((x) => ({ id: x.c.id, label: x.c.name })),
        answer: big.c.id,
        explain: `${big.c.name}：${big.r!.revenueLabel} ${yen(big.r!.revenue!)}（${big.r!.fiscalYear}）／${small.c.name}：${small.r!.revenueLabel} ${yen(small.r!.revenue!)}（${small.r!.fiscalYear}）。どちらも有価証券報告書の数値です。`,
        industry: ind,
      });
    }
    // 海外売上高比率が高いのは？ — computed from each filing's regional revenue (計算値, JCE-038), 15 points apart.
    const withOverseas = members
      .map((c) => ({ c, o: companyMetrics(c)?.overseasSalesRatio ?? null }))
      .filter((x): x is { c: Company; o: NonNullable<typeof x.o> } => x.o !== null)
      .sort((a, b) => hash(`o${a.c.id}`) - hash(`o${b.c.id}`));
    for (let i = 0; i + 1 < withOverseas.length && i < 8; i += 2) {
      const [a, b] = [withOverseas[i], withOverseas[i + 1]];
      if (Math.abs(a.o.percent - b.o.percent) < 15) continue;
      const hi = a.o.percent > b.o.percent ? a : b;
      const lo = hi === a ? b : a;
      questions.push({
        id: `overseas-${a.c.id}-${b.c.id}`,
        kind: "overseas",
        prompt: `売上のうち海外の割合が高いのはどっち？`,
        options: [a, b].map((x) => ({ id: x.c.id, label: x.c.name })),
        answer: hi.c.id,
        explain: `${hi.c.name}：${hi.o.percent}%（${hi.o.fiscalYear}）／${lo.c.name}：${lo.o.percent}%（${lo.o.fiscalYear}）。計算値：${hi.o.formula}。`,
        industry: ind,
      });
    }
    // この説明はどの会社？ — the company's own first sentence with its names hidden, against three of its industry peers.
    const described = members.filter((c) => c.description).sort((a, b) => hash(`d${a.id}`) - hash(`d${b.id}`));
    for (const c of described.slice(0, 6)) {
      const others = members.filter((o) => o.id !== c.id).sort((a, b) => hash(`${c.id}${a.id}`) - hash(`${c.id}${b.id}`)).slice(0, 3);
      if (others.length < 3) continue;
      const hidden = [c.name, c.officialName, c.shortNameEn, c.nameEn]
        .filter((n): n is string => Boolean(n) && n!.length > 1)
        .reduce((text, n) => text.split(n).join("この会社"), plain(c.description, 140));
      // A clue that still names the company, or is too short to be a description, is not a fair question.
      if (hidden.includes(c.name) || hidden.length < 20) continue;
      const options = [c, ...others].sort((a, b) => hash(`${c.id}:${a.id}`) - hash(`${c.id}:${b.id}`)).map((x) => ({ id: x.id, label: x.name }));
      questions.push({
        id: `describe-${c.id}`,
        kind: "describe",
        prompt: `次の説明はどの会社？（${industryName}）`,
        clue: hidden,
        options,
        answer: c.id,
        explain: `${c.name}の説明です。日本企業百科事典の解説から。`,
        industry: ind,
      });
    }
  }
  return questions.sort((a, b) => hash(a.id) - hash(b.id));
}
