# Research protocol — one company entry

How a company entry is researched and written. The output is three files:

- `src/data/companies/<company-id>.json` — valid against `companySchema` (`src/lib/content/schemas.ts`)
- `src/data/revisions/<YYYY-MM-DD>-company-<company-id>-initial.json` — the first revision record (see "Other fields")
- `docs/research/<company-id>.md` — the research log

The project lead registers the company in `src/data/companies/index.ts` after checking the entry.

**The governing rule is CLAUDE.md invariant 1: no fabrication.** Everything below serves it.
If this protocol and a deadline disagree, the protocol wins and the entry ships with `null`s and
`needs-attention` notes.

Read this document and `src/lib/content/schemas.ts`. Open an existing entry
(`src/data/companies/advantest.json`) only if the shape of a field is unclear — do not read several.

---

## 1. Sources, in order of authority

| Rank | Source | Use it for |
|---|---|---|
| 1 | **有価証券報告書**, via the evidence pack (below) | Financials, segments, 事業の内容, 沿革, 商号, 上場取引所, 関係会社 |
| 2 | **決算短信** (same fiscal year) | An extra cross-check when something looks odd |
| 3 | **統合報告書 / アニュアルレポート** | Business descriptions, products, customers, business model |
| 4 | **Company official pages** (会社概要, 沿革, 事業紹介, IR) | Product and history detail the 有報 does not carry |
| 5 | Exchange / regulator pages (JPX, EDINET) | Listing facts, filing metadata |
| — | **Never**: Wikipedia, IR aggregators, stock sites, blogs, your own memory | Nothing |

Memory is not a source. A fact you "know" but cannot find in a document is not written down.

### The evidence pack — start here, not with a PDF

The lead builds a pack for each company from the filing's **XBRL** (the tagged data EDINET serves
for the same 有価証券報告書), so figures are read mechanically instead of out of a PDF:

```
node scripts/research/evidence-pack.mjs <company-id> <4-digit code> [--from YYYY-MM-DD --to YYYY-MM-DD]
```

It writes, under the research cache (path given in your task):

| File | What it holds |
|---|---|
| `summary.json` | The filing (name, docID, submission date, 決算期), the five-year figures **in yen** with the filing's own labels, a restatement check against the previous year's filing, and `coverPage` |
| `cover-page.txt` | 表紙 and DEI: 商号, **英訳名**, 証券コード, **会計基準**, 事業年度, 上場金融商品取引所名. `nameEn` comes from here — not from a company web page, and never from memory |
| `indicators.txt` | 主要な経営指標等の推移 as printed — confirm the tagged values against it |
| `business.txt` | 事業の内容 |
| `segments.txt`, `segment-overview.txt` | セグメント情報 (including the segment revenue table) |
| `history.txt` | 沿革 |
| `affiliates.txt`, `facilities.txt` | 関係会社の状況, 主要な設備の状況 |
| `sections.json` | Every other TextBlock in the filing, by name |

**Do not re-derive what the pack already contains.** No PDF download, no `pdftotext`, no
hand-written comparison script. Fetch a company page only for something the pack does not carry
(a product explanation, a history detail), and cite it as its own source.

If a fact you need is missing from the pack, say so in the log and fetch the document you need.

---

## 2. Fields

All content strings are **Japanese**, written for a university student or first-time job seeker.
Plain words. Concrete nouns. No investment language.

### Identity

| Field | Rule |
|---|---|
| `id` | kebab-case slug, given to you. Also the file name |
| `code` | 証券コード from the 有報 cover page or the company's IR page |
| `name` | Common display name, e.g. `トヨタ自動車`, `ソニーグループ` |
| `officialName` | 商号 exactly as on the 有報 cover page — `cover-page.txt`, 「会社名、表紙」 |
| `nameEn` | English 商号 — `cover-page.txt`, 「英訳名、表紙」. It is always there; do not fetch a company page for it, and if the cover page names a former name (「旧会社名…」) the entry uses the current one and the change belongs in `history` |
| `shortNameEn` | The Latin wordmark for the hero, uppercase, e.g. `TOYOTA`. Use the company's own English name, shortened only by dropping legal suffixes (`Corporation`, `Co., Ltd.`) |
| `listings` | Every exchange from the 有報 cover page (上場金融商品取引所名), with that exchange's market name |

### `description` — the 3-second sentence

- **One sentence. Aim for 40–70 characters.** It must answer "what does this company do?" for
  someone who has never heard of it.
- Name what the company makes or sells, in the words a beginner uses.
- **No evaluative or superlative words** unless a source states them and they are essential:
  not `日本を代表する`, `世界的な`, `大手`, `リーディングカンパニー`.
- **Plain form, not polite form**: it ends `…する会社。` / `…メーカー。` / `…総合商社。`, never `…です。`.
  This is an encyclopedia entry, not a company introducing itself to the reader.

### `businesses` — the business structure (the most important field)

- **Top level = the reportable segments as the company itself defines them** in the latest 有報
  セグメント情報. Use the company's segment name in `name`; `shortName` may shorten it for a diagram
  node (e.g. `ゲーム&ネットワークサービス` → `ゲーム`).
- **Order** top-level businesses by segment revenue in the latest 有報, largest first. Record the
  figures you ordered by in the research log.
- **Reorganised after the fiscal year end?** If the 有報 announces a new segment structure effective after the
  year it reports, and the next quarterly report already uses it, use the new structure — the entry describes
  the company as it is. Order by the old segments' revenue mapped onto the new ones, mark any sum as derived,
  and state the basis in the log (Mitsubishi Corporation, 2026).
- **Single reportable segment?** Do not invent segments. Use the breakdown the company itself prints —
  sales categories (Nintendo) or the segment's own revenue split (Tokyo Electron) — and say in the log that it
  is not a segment breakdown. The diagram draws a single top-level business with children through a
  「単一セグメント」 node automatically.
- **`children` only where the company itself describes sub-businesses** (事業の内容, 統合報告書,
  official business pages). Do not invent a hierarchy to make a diagram look fuller. A company
  with flat segments has no children, and that is a correct structure.
- `description`: 1–2 sentences on what the business does.
- `products`, `customers`: only what the company names. Omit the key if not stated.
- If a segment is named "その他" / "Other", include it only if the company describes what it is.
- Every business carries `sourceIds`.

### `businessModel`

Answers three questions: what does the company provide, who pays for it, how does money come in.

- `flow` has exactly five steps, one of each `kind`, in this order:
  `company` → `offering` → `customer` → `revenue` → `profit`.
- `revenueSources`: how revenue arises, as the company describes it (e.g. `車両の販売`,
  `自動車ローン・リースの金融収益`). Not margins, not guesses at which part is most profitable
  unless the segment table shows it — if you say a segment is the largest profit contributor,
  record the segment profit figures in the log.

### `financials`

- **Source: the evidence pack's `summary.json`.** Its `figures.revenue` / `figures.netIncome` are the
  filing's own tagged values for the last five fiscal years, **already in yen** — copy them; never convert,
  round or retype a figure by hand.
- Confirm each value against `indicators.txt` (the same table as printed). If the two disagree, stop and
  record it: that is a finding, not a formatting problem.
- `revenueLabel` / `netIncomeLabel`: the filing's own wording, from the pack (`売上高`, `営業収益`,
  `売上収益`, `収益`, `経常収益`…). Banks and other financial groups report 経常収益 as the top line; use it,
  and explain in the business model what it consists of, only as far as the 有報 does.
- `netIncome` is profit attributable to owners of the parent. **Never** the 包括利益 row, and never a figure
  including non-controlling interests. If the pack offers more than one candidate element, pick the one
  `indicators.txt` prints and say why in the log.
- `accountingStandard` per year: as the filing states. The latest year is settled by
  `cover-page.txt` 「会計基準、DEI」 (`IFRS` / `Japan GAAP` / `US GAAP`); earlier years can differ, and a
  filer reporting under IFRS may still print Japanese wording (三菱電機 prints 売上高, not 売上収益) — the
  label comes from `indicators.txt`, the standard from the filing's own statement.
- **Restatements**: the pack compares the overlapping years against the previous filing. Report what it found
  in the log. A difference is a restatement — record it and use the latest filing's figure.
- `fiscalYear` label: `2026年3月期` form, using the company's own year-end month (`2026年2月期`,
  `2025年8月期`). `periodEnd`: the last day of that fiscal year, as in the pack.
- A value you cannot confirm is `null`, and the entry becomes `needs-attention`.
- **Scope changes** (`revenueBasis`, `netIncomeBasis`): if what revenue covers changes across the five years
  (a spin-off restated as discontinued operations, an acquisition presented retroactively), set `revenueBasis`
  on every year and `netIncomeBasis` on every year. The page then breaks the chart and states which years'
  columns measure different perimeters. Omit both when the scope is consistent.
- **`note`**: one sourced sentence a reader needs to read a year correctly — a loss caused by an accounting
  reclassification, a restated value. Not commentary.
- **Also banned in the entry**: 自己資本利益率, 時価総額, 配当性向, 1株当たり… — the rows printed next to revenue and
  net income in the same table. The integrity suite rejects them.

### `history`

- **5–8 turning points, not a chronology.** Source: 有報「沿革」and the official history page.
- `significance` (the 意味 column) connects the event to what the company is today. It must be a
  claim the sources support — e.g. "現在の金融事業の起点" when the source shows the financial
  business descends from that event. **No speculation about motives** unless the company states them.
- Years are the year the source gives. If the source gives only a range, leave the event out.

### Other fields

| Field | Rule |
|---|---|
| `industries` | From `INDUSTRY_IDS` in `src/types/company.ts`. Exactly one `primary: true` |
| `relatedCompanies` | `[]`. Cross-company relationships are researched in a separate pass |
| `sources` | Every document used. kebab-case `id`s, e.g. `yuho-2026`, `tanshin-2026`, `official-history`. `accessedAt` = the date you read it. `publishedAt` = the document's date |
| `status` | `{ state: "published" }`, or `{ state: "needs-attention", notes: [...] }` naming each gap |
| revision | Not a field. Write `src/data/revisions/<today>-company-<company-id>-initial.json`: `{ "id": "<same as file name>", "targetType": "company", "targetId": "<company-id>", "changedAt": "<today YYYY-MM-DD>", "reason": "初版。一次ソースを調査してAIが作成し、リサーチログに根拠を記録した", "summary": "<sources used>に基づきAIが作成" }` |
| `updatedAt` | Today, `YYYY-MM-DD` |

---

## 3. The research log — `docs/research/<company-id>.md`

A reviewer must be able to re-verify every figure without redoing the search.

```markdown
# <name> — research log

Researched: YYYY-MM-DD

## Documents
| id | Document | URL | Pages used |

## Financials
| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |

## Segment ordering
| Segment | Segment revenue (as printed) | Document · page |

## Claims
One line per business / history event / business-model claim: what was claimed → where it is stated.

## Gaps and judgement calls
Everything left null or left out, and every place you had to choose.
```

---

## 4. Before finishing

1. `node scripts/research/verify-financials.mjs <company-id>` must exit 0 — every stored figure equals the
   filing's tagged value, and the labels match. Do not hand-write a comparison script.
2. `npm run content:validate-file -- src/data/companies/<company-id>.json` must pass: schema, every
   integrity rule the editor enforces, id = file name, and the initial revision file present.
3. Write only your three files. Do not edit types, other companies, the index, tests or components.
