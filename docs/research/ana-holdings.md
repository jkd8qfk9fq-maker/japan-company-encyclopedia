# ＡＮＡホールディングス — research log

Researched: 2026-09-27

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書－第76期（2025年4月1日－2026年3月31日）／docID `S100YKL4`／提出 2026-06-25 | https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKL4.pdf | 表紙・DEI、1 経営方針、2 沿革、3 事業の内容、4 関係会社の状況、従業員の状況、主要な経営指標等の推移、4 経営者による分析（MD&A）、1 設備投資等の概要、セグメント情報、収益認識関係、企業結合等関係、税効果会計関係、事業等のリスク |

Only the evidence pack was used. No company web page, 決算短信 or secondary source was fetched — nothing in the entry needed one.

- `officialName`／`nameEn`：`cover-page.txt`「会社名、表紙」＝ＡＮＡホールディングス株式会社、「英訳名、表紙」＝ANA HOLDINGS INC.
- `listings`：「上場金融商品取引所名又は登録認可金融商品取引業協会名」＝東京証券取引所プライム市場のみ。`tse` / 「プライム」。
- **Foreign listing (not in `listings`, the enum is tse/nse/fse/sse)**: 沿革 に「1991年10月 ロンドン証券取引所に上場（2017年1月に上場廃止）」。現在は上場していないため `listings` には入れず、history の1961年の項に記載した。
- `accountingStandard`：`cover-page.txt`「会計基準、DEI」＝Japan GAAP。指標表は5年すべて同じ J-GAAP の行立て（売上高／経常利益又は経常損失（△）／親会社株主に帰属する当期純利益…）なので5年すべて `jgaap`。

## Financials

出典はすべて `yuho-2026` の「(1) 連結経営指標等」（`indicators.txt`）。数値は summary.json のタグ値をそのままコピー（円）。

| fiscalYear | revenue（印字・百万円） | netIncome（印字・百万円） | Standard | Document · page |
|---|---:|---:|---|---|
| 2022年3月期（第72期） | 1,020,324 | △143,628 | jgaap | yuho-2026 主要な経営指標等の推移 |
| 2023年3月期（第73期） | 1,707,484 | 89,477 | jgaap | 同 |
| 2024年3月期（第74期） | 2,055,928 | 157,097 | jgaap | 同 |
| 2025年3月期（第75期） | 2,261,856 | 153,027 | jgaap | 同 |
| 2026年3月期（第76期） | 2,539,233 | 169,075 | jgaap | 同 |

Labels, as printed in 主要な経営指標等の推移:

- revenueLabel `売上高`
- profitLabel `経常利益又は経常損失（△）`
- netIncomeLabel `親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）`
- totalAssetsLabel `総資産額` / netAssetsLabel `純資産額`

**Bug found in `draft-entry.json` and fixed.** The draft carried `profitLabel: "経常利益"` on all five years. `indicators.txt` prints 「経常利益又は経常損失（△）」 (the 2022年3月期 column is △184,935), and `brief.md` also gives the printed label as 「経常利益又は経常損失（△）」. The truncated form was replaced on all five rows. Everything else in the draft — the six series, all five years, the two other labels, `code`, `officialName`, `nameEn` — matched `indicators.txt` and was copied as-is.

`netIncome` candidate: a single tagged element, `jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults`. 包括利益 (△93,764 / 63,236 / 183,820 / 119,662 / 245,289) is printed on the next row and was **not** used.

修正再表示チェック: `verify-financials.mjs` reported 「前期有報との比較: 24 行一致（修正再表示なし）」 — the comparison ran (24 rows), so this is a genuine match, not an empty comparison. `brief.md` separately reports 「前期有報と重複年度は全て一致（修正再表示なし・8行）」.

`indicators.txt` 注6 records a measurement change that does **not** touch any of the six figures: 「第74期より連結キャッシュ・フロー計算書における資金の範囲を変更しており、第73期の投資活動によるキャッシュ・フローと現金及び現金同等物の期末残高については…遡及修正後の数値を記載しています」. Cash-flow rows are not stored in the entry, so nothing was set for it.

### `revenueBasis` / `netIncomeBasis`: NOT set — decision and reason

No perimeter change across the five years. The only scope event is the 2025年8月1日 株式交換 by which 日本貨物航空株式会社 (NCA) became a wholly owned subsidiary — 企業結合等関係 states the acquisition date 2025年8月1日 (みなし取得日 2025年7月1日) and that NCA's results are included 「2025年７月１日から2026年３月31日まで」. That is prospective consolidation, not retroactive presentation: earlier years were **not** restated, and the filing discloses the counterfactual only as an unaudited note (売上高への影響の概算額 40,177百万円). There is no 非継続事業 and no deconsolidation. Revenue therefore measures the same perimeter in every year as the filing presents it, so both basis fields are omitted and the chart is not broken.

Instead the NCA consolidation is carried in the 2026年3月期 `note`, so a reader can see that part of that year's increase is a newly consolidated company, with the filing's own concrete figures (including that the pro-forma note is unaudited).

### Pandemic years — what the filing does and does not say

2022年3月期 (第72期) is the only loss year in the table (経常損失 △184,935百万円, 純損失 △143,628百万円). This FY2026 filing does **not** carry an MD&A discussion of that year. It does state a cause in two places, and only those words were used:

- 税効果会計関係／重要な会計上の見積り: 「当社グループは、2020年度及び2021年度に、新型コロナウイルス感染症拡大に伴い航空旅客需要が減少した影響等により、税務上の繰越欠損金を計上しました」（2021年度 = 2022年3月期）
- 事業等のリスク「④感染症パンデミック」: 「当社グループは、新型コロナウイルス感染症によって甚大な影響を受けましたが…」

The `note` on 2022年3月期 quotes exactly these two sentences. Nothing about capacity cuts, route suspensions or government support was written, because this filing does not state it. 2021年3月期 is outside the five-year window, so no entry was needed for it.

## Segment ordering

Ordered by 2026年3月期 外部顧客への売上高 (セグメント情報, 当連結会計年度), largest first, with その他 forced last.

| Segment | 外部顧客への売上高 (百万円) | セグメント間含む計 | セグメント利益 | Document · page |
|---|---:|---:|---:|---|
| 航空事業 | 2,276,718 | 2,313,219 | 221,920 | yuho-2026 セグメント情報 |
| 商社事業 | 132,933 | 154,249 | 7,557 | 同 |
| 航空関連事業 | 60,219 | 361,619 | 1,456 | 同 |
| 旅行事業 | 50,154 | 65,332 | △146 | 同 |
| **その他**（報告セグメントに含まれない） | 19,209 | 49,728 | 2,276 | 同（注1） |

その他 is smallest on external revenue anyway, so the 報告セグメントに含まれない rule did not change the order here; it is recorded because the note 「「その他」の区分は、報告セグメントに含まれない事業セグメントであり、施設管理、ビジネスサポート他の事業を含んでいます」 is what places it last regardless.

Note the ordering choice that matters for a reader: 航空関連事業 is third on **external** revenue (60,219百万円) but second on total revenue (361,619百万円), because 301,400百万円 of it is internal — it mostly serves the group's own airlines. The protocol orders by segment revenue and the entry uses 外部顧客への売上高 consistently; the internal figure is stated in that business's description so the difference is visible rather than hidden.

## Claims

Every business, history and business-model claim comes from `yuho-2026`. The load-bearing ones:

- Top-level segment definitions and what each does → セグメント情報「１．報告セグメントの概要」and 3 事業の内容.
- 航空事業 children (国際線旅客／国内線旅客／貨物・郵便／NCA／Peach／AirJapan) → the filing's own management breakdown in MD&A「③生産及び販売の実績 1)セグメント別売上高」(ＡＮＡブランド収入／NCA収入／Peach収入／AirJapan収入) and the per-brand subsections ＜国際線旅客（ＡＮＡブランド）＞＜国内線旅客（ＡＮＡブランド）＞＜貨物（ＡＮＡブランド）＞＜NCA＞＜Peach・AirJapan＞. These are the company's own divisions, not invented ones.
- 航空関連事業 children (空港ハンドリング／航空機整備) → 報告セグメントの概要「空港ハンドリング、整備など航空輸送に付随するサービス」and 事業の内容's description of 空港での各種サービス提供・整備作業の役務提供. No sub-figures exist (「構成する各種事業が多岐にわたり、かつ重要性の観点から開示しておりません」), and none were implied.
- 商社事業・旅行事業・その他 have **no** children: the filing names companies and activities but does not structure them into sub-businesses, so a hierarchy was not invented.
- 輸送実績 (旅客数・旅客キロ・座席キロ・利用率・貨物重量利用率・運航回数・飛行距離・飛行時間) → MD&A「2)セグメント別取扱実績 (a)航空事業」(ア)(イ)(ウ)(エ).
- 従業員数 by segment → 従業員の状況①連結会社の状況. 航空関連事業 21,736人 > 航空事業 20,608人 is as printed.
- 設備投資 262,300百万円 and its breakdown, the 8 aircraft delivered → 1 設備投資等の概要.
- 契約負債・残存履行義務・マイル → 収益認識関係 3.(1)(2).
- NCA 株式交換 (決議 2023年7月10日、取得 2025年8月1日、みなし取得日 2025年7月1日、割当 3,926,000株、取得原価 11,081百万円、負ののれん 7,165百万円、引受資産負債) → 企業結合等関係.
- Peach 債務超過額 37,709百万円、全日本空輸㈱ の主要な損益情報 → 関係会社の状況（注5）（注6）.
- 中期経営戦略 (2.7兆円の成長投資、約330機体制、2030年度 営業利益3,100億円) → 1 経営方針、経営環境及び対処すべき課題等. These are the company's stated plans and are attributed to the company in the text.
- 訪日外国人旅行者数 4,200万人超（2025年）／政府目標6,000万人（2030年） → 同、③経営環境の認識. Attributed to the company's own statement.
- History events → 2 沿革 (see the date-format note below), plus 企業結合等関係 for the 2025 NCA event.

## 沿革 date format

`history.txt` prints dates **inline immediately before each event** for almost the whole table (e.g. 「1952年12月第２次世界大戦により…設立」「1999年10月「スターアライアンス」に正式加盟」), so the 沿革 is sound on its own for the events used.

**One block is misaligned** and was avoided entirely: the run 「2006年２月…2007年６月2008年７月2009年４月2010年７月 〃 　10月ホテル事業関連子会社14社の全株式とその他関連資産をグループ外に一括譲渡ボーイング767－300BCF…導入海外新聞普及株式会社…を連結子会社化…合併…合併」 emits four year cells (2007年6月／2008年7月／2009年4月／2010年7月) before the four events, so which year goes with which event cannot be read from this file. No history entry, and no claim anywhere in the entry, uses any event from that block — notably the ホテル事業関連子会社14社の一括譲渡, which would otherwise be a natural turning point. Recovering it would need a second source, and no other part of the pack dates it, so it was left out rather than guessed.

All eight history years used (1952, 1957, 1961, 1986, 1999, 2013, 2017, 2025) are from inline-dated rows or from 企業結合等関係.

## Gaps and judgement calls

1. **`draft-entry.json` profitLabel was wrong** — 「経常利益」 instead of the printed 「経常利益又は経常損失（△）」. Fixed on all five rows; reported above. (`verify-financials.mjs` would have caught it, and its own comment says the same truncation reached three drafts before.)
2. **「ANA SUPER VALUEセール」 could not be named.** The filing names the domestic-fare promotion 「ANA SUPER VALUEセール」, but the integrity suite rejects the substring `PER`, which 「SUPER」 contains. Writing it full-width (ＳＵＰＥＲ) would slip past a literal substring check, which is gaming the rule, so the brand name was dropped and the sentence reads 「ＡＮＡブランドの運賃セールを継続的に実施して…」. The rest of the sentence is the filing's wording. **This is a false positive in the integrity rule, not a data problem** — worth a look if other airlines or retailers hit it.
3. **`revenueBasis` / `netIncomeBasis` omitted** — reasoning above. If a reviewer disagrees and considers the NCA consolidation a perimeter change, it would have to be set on all ten rows; I judged it prospective consolidation with no restatement, which the pack's own restatement check supports (24 rows matched).
4. **2022年3月期 loss** — cause taken only from the two places the filing states it (税効果／事業等のリスク). This filing carries no MD&A narrative for that year, so nothing further was written.
5. **AirJapan is described as a business that the company is ending.** The filing says the brand is suspended 「本年３月をもって」 (i.e. 2026年3月) with aircraft and people moved to the ＡＮＡブランド. It is kept as a child of 航空事業 because it earned 13,935百万円 in the year the entry reports, with the suspension stated in the same description. A future cycle should remove it once a filing no longer reports it.
6. **`industries`**: `transportation` (primary) and `trading`. The second is not a guess — 商社事業 is one of the four reportable segments and is the second-largest on external revenue.
7. **Segment sub-figures for 航空関連事業／旅行事業／商社事業／その他 do not exist**: 「構成する各種事業が多岐にわたり、かつ重要性の観点から開示しておりません」. No breakdown was implied for them.
8. **Nothing is null.** All six series are present for all five years, so `status` is `published`.
9. `名` (display name) は「ANAホールディングス」、`shortNameEn` は「ANA」— 英訳名 ANA HOLDINGS INC. から法人格・HOLDINGS を落としたもの。
