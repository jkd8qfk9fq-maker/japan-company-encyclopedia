# Research protocol — one company entry

How a company entry is researched and written. The output is two files:

- `src/data/companies/<company-id>.ts` — typed as `Company` (`src/types/company.ts`)
- `docs/research/<company-id>.md` — the research log

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

- Company IR libraries host 有価証券報告書 and 決算短信 as PDFs. Download to your scratchpad
  directory (**never into the repository**) with `curl -L -o`, then extract with
  `pdftotext -layout <file>.pdf <file>.txt` and read the text. The Read tool can also read PDF pages.
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
- **Units**: tables are usually in 百万円. Convert to whole yen (× 1,000,000) and write the number
  with numeric separators (`48_036_704_000_000`). Record the original value and unit in the log.
- If the table splits across an accounting-standard change, set `accountingStandard` per year.
  If a year appears under two standards, use the standard the company reports for the later years
  and note it.
- **Cross-check the latest year against the 決算短信.** If they differ, use the 有報 figure and
  record the difference.
- `fiscalYear` label: `2026年3月期` form. `periodEnd`: `2026-03-31`.
- A value you cannot read with certainty is `null`, and the entry becomes `needs-attention`.

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
| `revisions` | `[{ date: "<today>", kind: "ai-generated", summary: "<sources used>に基づきAIが作成" }]` |
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

1. `npx tsc --noEmit -p .` — fix every error in **your** file. Errors in other files are not yours
   to fix; other work is happening concurrently.
2. Every `sourceIds` entry resolves to an id in `sources`.
3. Re-read each financial figure against the extracted text one more time, digit by digit.
4. Write only your two files. Do not edit types, other companies, or the index.
