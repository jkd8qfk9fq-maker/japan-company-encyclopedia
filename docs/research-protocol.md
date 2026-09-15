# Research protocol — one company entry

How a company entry is researched and written. The output is three files:

- `src/data/companies/<company-id>.json` — valid against `companySchema` (`src/lib/content/schemas.ts`; type in `src/types/company.ts`). Use `src/data/companies/toyota.json` as the model of shape and depth
- `src/data/revisions/<YYYY-MM-DD>-company-<company-id>-initial.json` — the first revision record (see "Other fields")
- `docs/research/<company-id>.md` — the research log

The project lead registers the company in `src/data/companies/index.ts` after checking the entry.

**The governing rule is CLAUDE.md invariant 1: no fabrication.** Everything below serves it.
If this protocol and a deadline disagree, the protocol wins and the entry ships with `null`s and
`needs-attention` notes.

---

## 1. Sources, in order of authority

| Rank | Source | Use it for |
|---|---|---|
| 1 | **有価証券報告書** (latest fiscal year) | Financials, segments, 事業の内容, 沿革, 商号, 上場取引所 |
| 2 | **決算短信** (same fiscal year) | Cross-checking the latest year's revenue and net income |
| 3 | **統合報告書 / アニュアルレポート** | Business descriptions, products, customers, business model |
| 4 | **Company official pages** (会社概要, 沿革, 事業紹介, IR) | History detail, business detail |
| 5 | Exchange / regulator pages (JPX, EDINET) | Listing facts, filing metadata |
| — | **Never**: Wikipedia, IR aggregators, stock sites, blogs, your own memory | Nothing |

Memory is not a source. A fact you "know" but cannot find in a document is not written down.

### Getting documents

- **`pdftotext -layout` has misaligned rows** in the 主要な経営指標等の推移 table of three of the first five
  filings (it put 包括利益 where net income belongs). Always read figures with `-raw` and `-table`, confirm they
  agree, and finish with a script that compares stored values to the extracted text.
- Some IR hosts (sony.com) return 403 to `curl` without browser headers. That is not a dead link; retry with a
  browser User-Agent before recording a source as unavailable.
- Company IR libraries host 有価証券報告書 and 決算短信 as PDFs. Download to your scratchpad
  directory (**never into the repository**) with `curl -L -o`, then extract with
  `pdftotext -raw` and `pdftotext -table` and read the text. The Read tool can also read PDF pages.
- **EDINET-rendered PDFs garble Japanese silently.** They use the `UniJIS-UTF16-H` CMap, which the installed
  `pdftotext` lacks: digits come out right while every Japanese label is garbage, with no error. Use the xpdf
  Japanese language pack (`https://dl.xpdfreader.com/xpdf-japanese.tar.gz`, unpacked in your scratchpad) and
  run `pdftotext -cfg <xpdfrc> -enc UTF-8`. Never read a label from an extraction you have not checked is
  legible. (Found researching Honda, 2026-09-15.)
- The EDINET API needs a subscription key this project does not have. Do not try to obtain one.
- If a page is JavaScript-rendered and fetches nothing, look for the PDF link instead.

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
| `officialName` | 商号 exactly as on the 有報 cover page |
| `nameEn` | English 商号 as on the 有報 cover page |
| `shortNameEn` | The Latin wordmark for the hero, uppercase, e.g. `TOYOTA`. Use the company's own English name, shortened only by dropping legal suffixes (`Corporation`, `Co., Ltd.`) |
| `listings` | Every exchange from the 有報 cover page (上場金融商品取引所名), with that exchange's market name |

### `description` — the 3-second sentence

- **One sentence. Aim for 40–70 characters.** It must answer "what does this company do?" for
  someone who has never heard of it.
- Name what the company makes or sells, in the words a beginner uses.
- **No evaluative or superlative words** unless a source states them and they are essential:
  not `日本を代表する`, `世界的な`, `大手`, `リーディングカンパニー`.

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

- **Source: the latest 有報, 第一部 第1「主要な経営指標等の推移」, the 連結 table.** It shows five
  fiscal years in one place — use all five.
- `revenue`: the top-line row as labelled in that table. Record the label verbatim in
  `revenueLabel` (`売上高`, `営業収益`, `売上収益`, `収益`, …).
- `netIncome`: profit attributable to owners of the parent — `親会社株主に帰属する当期純利益`
  (J-GAAP) or `親会社の所有者に帰属する当期利益` (IFRS). Record the label verbatim in
  `netIncomeLabel`. **Never** substitute 当期利益 including non-controlling interests.
- **Units**: tables are usually in 百万円. Convert to whole yen (× 1,000,000) — JSON has no numeric
  separators, so write the digits plainly (`48036704000000`) and check the count of zeros with a script.
  Record the original value and unit in the log.
- If the table splits across an accounting-standard change, set `accountingStandard` per year.
  If a year appears under two standards, use the standard the company reports for the later years
  and note it.
- **Cross-check the latest year against the 決算短信.** If they differ, use the 有報 figure and
  record the difference.
- `fiscalYear` label: `2026年3月期` form, using the company's own year-end month (`2026年2月期`,
  `2025年8月期`). `periodEnd`: the actual last day of that fiscal year. **The latest 有報 is the latest one
  FILED** — for a company whose year ends in August, that may be for a year that ended a year ago.
- **Banks and other financial groups** print 経常収益 as their top line, not 売上高. Use it, verbatim, as
  `revenueLabel`; do not substitute 業務粗利益 or anything computed. Explain in the business model, in plain
  words and only as far as the 有報 does, what 経常収益 consists of (interest, fees, trading…).
- A value you cannot read with certainty is `null`, and the entry becomes `needs-attention`.
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

1. `npm run content:validate-file -- src/data/companies/<company-id>.json` must pass: schema, every
   integrity rule the editor enforces, id = file name, and the initial revision file present.
2. Re-read each financial figure against the extracted text one more time, digit by digit, with a script.
3. Write only your three files. Do not edit types, other companies, the index, tests or components.
