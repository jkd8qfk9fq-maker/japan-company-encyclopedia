import { INDUSTRY_LABELS } from "../../src/lib/industry-labels";
import { INDUSTRY_IDS } from "../../src/types/company";
import { esc } from "./html";

/**
 * Editing a company by section (JCE-109 console, stage 4). A section form only builds a draft: the draft then goes
 * through the very same review as the JSON editor — schema, integrity, the list of changed fields, a summary and a
 * reason — and becomes a pull request the same way. So a form can never accept what the JSON editor would refuse.
 * 事業構造 and 財務 are shown, not edited here: the figures are transcribed from the filings by the pipeline, and
 * their structure (segments, flows, five periods) is edited in JSON when it must be.
 */

type Json = Record<string, unknown>;
type Source = { id: string; title?: string; publisher?: string; url?: string; publishedAt?: string; accessedAt?: string };
type HistoryEvent = { year?: number; title?: string; description?: string; significance?: string; sourceIds?: string[] } & Json;

export const COMPANY_TABS = [
  ["overview", "概要"],
  ["basic", "基本情報"],
  ["business", "事業構造"],
  ["financials", "財務情報"],
  ["history", "沿革"],
  ["industries", "業界情報"],
  ["sources", "出典・資料"],
  ["json", "JSON（上級）"],
] as const;
export type CompanyTab = (typeof COMPANY_TABS)[number][0];

export const isCompanyTab = (v: string | null): v is CompanyTab => COMPANY_TABS.some(([k]) => k === v);

export function tabBar(id: string, active: CompanyTab): string {
  return `<nav class="row" aria-label="編集の項目" style="gap:4px;border-bottom:1px solid var(--line);margin:0 0 14px;overflow-x:auto;flex-wrap:nowrap">${COMPANY_TABS.map(
    ([k, label]) => `<a href="/edit/company/${esc(id)}?tab=${k}" style="padding:8px 12px;white-space:nowrap;${k === active ? "border-bottom:2px solid var(--accent);color:var(--fg)" : "color:var(--muted)"}"${k === active ? ' aria-current="page"' : ""}>${label}</a>`,
  ).join("")}</nav>`;
}

const sourcesOf = (c: Json) => (Array.isArray(c.sources) ? (c.sources as Source[]) : []);
const field = (name: string, label: string, value: unknown, opts: { textarea?: boolean; hint?: string; type?: string } = {}) =>
  `<label for="${name}">${esc(label)}</label>${
    opts.textarea
      ? `<textarea id="${name}" name="${name}" style="min-height:6em">${esc(value ?? "")}</textarea>`
      : `<input type="${opts.type ?? "text"}" id="${name}" name="${name}" value="${esc(value ?? "")}">`
  }${opts.hint ? `<p class="muted" style="margin:2px 0 0">${esc(opts.hint)}</p>` : ""}`;

const sourceChecks = (name: string, sources: Source[], chosen: string[] = []) =>
  `<fieldset style="border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin:8px 0"><legend class="muted">出典（1つ以上）</legend>${
    sources.map((s) => `<label class="row" style="margin:2px 0;font-weight:400"><input type="checkbox" name="${name}" value="${esc(s.id)}"${chosen.includes(s.id) ? " checked" : ""}> ${esc(s.title ?? s.id)} <code>${esc(s.id)}</code></label>`).join("") ||
    '<p class="muted">出典がありません。先に「出典・資料」で追加してください。</p>'
  }</fieldset>`;

const formShell = (id: string, sha: string, tab: CompanyTab, inner: string) =>
  `<form method="post" action="/edit/company/${esc(id)}/section"><input type="hidden" name="base" value="${esc(sha)}"><input type="hidden" name="tab" value="${tab}">${inner}
<p style="margin-top:14px"><button type="submit">変更を確認する</button></p><p class="muted">次の画面で、検査の結果と変わる項目を見てから、要約と理由・根拠を書いてプルリクエストを作ります。</p></form>`;

export function renderOverview(c: Json, sha: string, siteOrigin: string): string {
  const count = (v: unknown) => (Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : 0);
  const status = (c.status as { state?: string } | undefined)?.state ?? "—";
  const rows: [string, string][] = [
    ["社名", esc(c.name)],
    ["証券コード", esc(c.code)],
    ["状態", esc(status)],
    ["説明", esc(c.description ?? "（未記入）")],
    ["事業", `${count(c.businesses)}件`],
    ["財務（年度）", `${count(c.financials)}期`],
    ["沿革", `${count(c.history)}件`],
    ["業界", esc((Array.isArray(c.industries) ? (c.industries as { industryId: string; primary?: boolean }[]) : []).map((i) => `${INDUSTRY_LABELS[i.industryId as keyof typeof INDUSTRY_LABELS]?.name ?? i.industryId}${i.primary ? "（主）" : ""}`).join("、"))],
    ["出典", `${sourcesOf(c).length}件`],
    ["最終更新", esc(c.updatedAt ?? "—")],
    ["main の版", esc(sha.slice(0, 7))],
  ];
  return `<div class="panel"><table>${rows.map(([k, v]) => `<tr><th style="width:28%">${k}</th><td>${v}</td></tr>`).join("")}</table>
<p class="muted"><a href="${esc(siteOrigin)}/companies/${esc(c.id)}">公開ページを開く</a></p></div>`;
}

export function renderBasicForm(c: Json, sha: string): string {
  return formShell(
    String(c.id),
    sha,
    "basic",
    `<div class="panel">${field("name", "社名（表示名）", c.name)}${field("officialName", "商号（登記どおり）", c.officialName)}${field("nameEn", "英語名", c.nameEn, { hint: "空にすると項目ごと消えます" })}${field("shortNameEn", "英字の略称", c.shortNameEn, { hint: "空にすると項目ごと消えます" })}${field("description", "何をしている会社か（1文）", c.description, { textarea: true, hint: "有価証券報告書に書かれている事業から。空にすると未記入（null）になります" })}
<p class="muted">証券コード・EDINETコード・法人番号は、公式の一覧から機械的に付けるためここでは直しません。</p></div>`,
  );
}

export function renderReadOnly(c: Json, key: "businesses" | "financials", id: string): string {
  const value = key === "businesses" ? { businesses: c.businesses, businessModel: c.businessModel } : { financials: c.financials, interimFinancials: c.interimFinancials, quarterlyEarnings: c.quarterlyEarnings, segmentRevenue: c.segmentRevenue, regionalRevenue: c.regionalRevenue };
  const note =
    key === "financials"
      ? "財務の数字は有価証券報告書から機械的に転記し、検証してから載せています（手で書かない）。直す必要があるときは、出典を確かめたうえで JSON（上級）で直します。"
      : "事業構造（事業・製品・お金の流れ）は入れ子が深いため、JSON（上級）で直します。各事業に出典（sourceIds）が必要です。";
  return `<div class="panel"><p class="muted">${note} <a href="/edit/company/${esc(id)}?tab=json">JSON で直す</a></p><pre style="white-space:pre-wrap;word-break:break-all;font-size:12px;max-height:65vh;overflow:auto">${esc(JSON.stringify(value, null, 2))}</pre></div>`;
}

export function renderHistoryForm(c: Json, sha: string): string {
  const sources = sourcesOf(c);
  const events = (Array.isArray(c.history) ? c.history : []) as HistoryEvent[];
  const row = (e: HistoryEvent, i: number | "new") =>
    `<div class="panel" style="margin-bottom:10px"><div class="row" style="justify-content:space-between"><h2 style="margin:0">${i === "new" ? "出来事を追加" : `${esc(e.year)}年 ${esc(e.title)}`}</h2>${i === "new" ? "" : `<label class="row" style="margin:0;font-weight:400"><input type="checkbox" name="h${i}_delete" value="1"> 削除する</label>`}</div>
${field(`h${i}_year`, "年", e.year, { type: "number" })}${field(`h${i}_title`, "出来事", e.title)}${field(`h${i}_description`, "説明", e.description, { textarea: true })}${field(`h${i}_significance`, "意味（なぜ大事か）", e.significance, { textarea: true, hint: "空にすると項目ごと消えます" })}${sourceChecks(`h${i}_src`, sources, e.sourceIds)}</div>`;
  return formShell(String(c.id), sha, "history", `${events.map((e, i) => row(e, i)).join("")}${row({}, "new")}<p class="muted">新しい出来事は、年・出来事・説明・出典がそろったときだけ追加されます。</p>`);
}

export function renderIndustriesForm(c: Json, sha: string): string {
  const current = (Array.isArray(c.industries) ? c.industries : []) as { industryId: string; primary?: boolean }[];
  const options = (selected: string) =>
    `<option value="">（なし）</option>${INDUSTRY_IDS.map((id) => `<option value="${id}"${id === selected ? " selected" : ""}>${esc(INDUSTRY_LABELS[id]?.name ?? id)}</option>`).join("")}`;
  const rows = [0, 1, 2]
    .map((i) => {
      const r = current[i];
      return `<div class="row" style="margin:6px 0;flex-wrap:nowrap"><select name="ind${i}" aria-label="業界${i + 1}">${options(r?.industryId ?? "")}</select><label class="row" style="margin:0;font-weight:400;white-space:nowrap"><input type="radio" name="primary" value="${i}"${r?.primary ? " checked" : ""}> 主たる業界</label></div>`;
    })
    .join("");
  return formShell(String(c.id), sha, "industries", `<div class="panel"><p class="muted">業界は分類の名前（主張ではない）で、最大3つ。主たる業界を1つ選びます。</p>${rows}</div>`);
}

export function renderSourcesForm(c: Json, sha: string): string {
  const sources = sourcesOf(c);
  const row = (s: Source, i: number | "new") =>
    `<div class="panel" style="margin-bottom:10px"><div class="row" style="justify-content:space-between"><h2 style="margin:0">${i === "new" ? "出典を追加" : esc(s.title ?? s.id)} ${i === "new" ? "" : `<code>${esc(s.id)}</code>`}</h2>${i === "new" ? "" : `<label class="row" style="margin:0;font-weight:400"><input type="checkbox" name="s${i}_delete" value="1"> 削除する</label>`}</div>
${i === "new" ? field("snew_id", "id（英小文字・数字・ハイフン）", "", { hint: "例：yuho-2026" }) : ""}${field(`s${i}_title`, "題名", s.title)}${field(`s${i}_publisher`, "発行者", s.publisher)}${field(`s${i}_url`, "URL", s.url, { type: "url" })}<div class="grid g2">${field(`s${i}_publishedAt`, "公表日", s.publishedAt, { type: "date" })}${field(`s${i}_accessedAt`, "確認日", s.accessedAt, { type: "date" })}</div></div>`;
  return formShell(String(c.id), sha, "sources", `${sources.map((s, i) => row(s, i)).join("")}${row({ id: "" }, "new")}<p class="muted">出典を削除すると、その出典を使っている事実は検査で止まります（出典のない事実は載せない）。</p>`);
}

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
const setOrDrop = (target: Json, key: string, value: string) => {
  if (value) target[key] = value;
  else delete target[key];
};

/** The draft a section form describes, built on a copy of the current entry; unknown keys are kept as they are. */
export function applySection(tab: CompanyTab, current: Json, form: FormData): Json {
  const draft = structuredClone(current);
  if (tab === "basic") {
    draft.name = text(form, "name");
    draft.officialName = text(form, "officialName");
    setOrDrop(draft, "nameEn", text(form, "nameEn"));
    setOrDrop(draft, "shortNameEn", text(form, "shortNameEn"));
    draft.description = text(form, "description") || null;
  } else if (tab === "history") {
    const events = (Array.isArray(current.history) ? current.history : []) as HistoryEvent[];
    const next: HistoryEvent[] = [];
    events.forEach((e, i) => {
      if (form.get(`h${i}_delete`) === "1") return;
      const ev: HistoryEvent = structuredClone(e);
      ev.year = Number(text(form, `h${i}_year`));
      ev.title = text(form, `h${i}_title`);
      ev.description = text(form, `h${i}_description`);
      setOrDrop(ev, "significance", text(form, `h${i}_significance`));
      ev.sourceIds = form.getAll(`h${i}_src`).map(String);
      next.push(ev);
    });
    const year = text(form, "hnew_year");
    const title = text(form, "hnew_title");
    const description = text(form, "hnew_description");
    const srcs = form.getAll("hnew_src").map(String);
    if (year && title && description && srcs.length) {
      const ev: HistoryEvent = { year: Number(year), title, description, sourceIds: srcs };
      setOrDrop(ev, "significance", text(form, "hnew_significance"));
      next.push(ev);
    }
    draft.history = next.sort((a, b) => Number(a.year) - Number(b.year));
  } else if (tab === "industries") {
    const primary = text(form, "primary");
    const rows: { industryId: string; primary?: boolean }[] = [];
    for (const i of [0, 1, 2]) {
      const id = text(form, `ind${i}`);
      if (id && !rows.some((r) => r.industryId === id)) rows.push(primary === String(i) ? { industryId: id, primary: true } : { industryId: id });
    }
    draft.industries = rows;
  } else if (tab === "sources") {
    const sources = sourcesOf(current);
    const next: Source[] = [];
    sources.forEach((s, i) => {
      if (form.get(`s${i}_delete`) === "1") return;
      const src: Source = structuredClone(s);
      for (const k of ["title", "publisher", "url", "publishedAt", "accessedAt"] as const) setOrDrop(src as Json, k, text(form, `s${i}_${k}`));
      next.push(src);
    });
    const newId = text(form, "snew_id");
    if (newId) {
      const src: Source = { id: newId };
      for (const k of ["title", "publisher", "url", "publishedAt", "accessedAt"] as const) setOrDrop(src as Json, k, text(form, `snew_${k}`));
      next.push(src);
    }
    draft.sources = next;
  }
  return draft;
}
