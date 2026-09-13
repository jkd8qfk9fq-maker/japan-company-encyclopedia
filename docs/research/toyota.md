# トヨタ自動車 — research log

Researched: 2026-09-13 (documents downloaded and read) · re-verified and finalized 2026-09-14

Page numbers are the **printed** page numbers (the `― n ―` footer). For `yuho-2026` the printed
page is PDF page index − 3 (PDF p.4 = 表紙 p.1). Text was extracted with `pdftotext -enc UTF-8` in
`-raw` and `-table` modes. `-layout` mode misaligned labels and numbers on p.2, p.5–6 and
p.145–146, so it was not relied on for any value.

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書 2026年3月期（自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月10日. Confirmed latest: the IR library page "有価証券報告書・半期報告書" (page date 2026年06月10日) lists 2026年3月期 as the current 有報 | https://global.toyota/pages/global_toyota/ir/library/securities-report/archives/archives_2026_03.pdf | 1, 2, 5, 6, 7, 8, 9, 12, 15, 16, 41, 42, 44, 45, 46, 49, 50, 51, 74, 138, 145, 146 |
| `tanshin-2026` | 2026年3月期 決算短信〔IFRS〕（連結）, 2026年5月8日 (listed on Toyota's site as 決算要旨) | https://global.toyota/pages/global_toyota/ir/financial-results/2026_4q_summary_jp.pdf | PDF p.2 (the 短信 first page; PDF p.1 is the 決算要旨 cover) |
| `yuho-2025` | 有価証券報告書 2025年3月期, 提出日 2025年6月18日 | https://global.toyota/pages/global_toyota/ir/library/securities-report/archives/archives_2025_03.pdf | 2 |
| `yuho-2022` | 有価証券報告書 2022年3月期, 提出日 2022年6月23日 | https://global.toyota/pages/global_toyota/ir/library/securities-report/archives/archives_2022_03.pdf | 2, 3 |
| `official-history-founding` | 公式企業サイト「創業期｜歴史｜トヨタの歩み」(page date 2026年01月30日) | https://global.toyota/jp/company/trajectory-of-toyota/history/01/ | 創業前期, 1937年～, 1950年代 |
| `official-history-growth` | 公式企業サイト「継承と進化｜歴史｜トヨタの歩み」(page date 2026年01月30日) | https://global.toyota/jp/company/trajectory-of-toyota/history/02/ | 1960年代, 1980年代, 2000年代, 2010年代～ |

## Financials

Source table: `yuho-2026` p.2「１【主要な経営指標等の推移】（１）連結経営指標等」, 回次 第118期–第122期.
Row labels as printed: **営業収益** and **親会社の所有者に帰属する当期利益** (printed across two lines,
「親会社の所有者に／帰属する当期利益」). Unit (百万円). Stored value = printed × 1,000,000.

| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (第118期, 決算期 2022年３月) | 31,379,507 百万円 → 31,379,507,000,000 円 | 2,850,110 百万円 → 2,850,110,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 and in the original filing yuho-2022 p.2 | n/a |
| 2023年3月期 (第119期) | 37,154,298 百万円 → 37,154,298,000,000 円 | 2,451,318 百万円 → 2,451,318,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 | n/a |
| 2024年3月期 (第120期) | 45,095,325 百万円 → 45,095,325,000,000 円 | 4,944,933 百万円 → 4,944,933,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 | n/a |
| 2025年3月期 (第121期) | 48,036,704 百万円 → 48,036,704,000,000 円 | 4,765,086 百万円 → 4,765,086,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 | Matches tanshin-2026 prior-year row: 48,036,704 / 4,765,086 |
| 2026年3月期 (第122期) | 50,684,952 百万円 → 50,684,952,000,000 円 | 3,848,098 百万円 → 3,848,098,000,000 円 | IFRS | yuho-2026 p.2 | **Matches** tanshin-2026: 営業収益 50,684,952 百万円, 親会社の所有者に帰属する当期利益 3,848,098 百万円. No difference |

Verification performed on 2026-09-14: the p.2 rows were parsed from the `-raw` extract and compared
programmatically with the values in `src/data/companies/toyota.ts` (printed × 1,000,000 === stored,
all 10 values equal). The `-table` extract of the 短信 was used to confirm column alignment
(営業収益 / 営業利益 / 税引前利益 / 当期利益 / 親会社の所有者に帰属する当期利益 / 当期包括利益合計額).

Accounting standard: yuho-2026 p.2 注1「当社の連結財務諸表は、国際財務報告基準（以下、IFRSという。）に基づいて作成しています。」
yuho-2022 p.2 shows 「国際財務報告基準 移行日 2019年４月１日」 with IFRS columns for 2020年３月–2022年３月,
and p.3 shows 米国会計基準 only for 第114–116期 (2018年3月期–2020年3月期). So all five years used here are
IFRS; no year appears under two standards.

Not used: 当期利益 (incl. non-controlling interests) 3,985,761 百万円 for 2026年3月期 (tanshin-2026) —
the protocol requires the parent-attributable figure.

## Segment ordering

`yuho-2026` p.146「５．セグメント情報（２）報告セグメントに関する情報」当連結会計年度, 単位：百万円.
Order by 営業収益 計 (and the same order results from 外部顧客への営業収益).

| Segment | Segment revenue (as printed) | Document · page |
|---|---|---|
| 自動車 | 計 45,417,703 (外部顧客への営業収益 45,201,924) | yuho-2026 p.146 (also p.50) |
| 金融 | 計 4,857,115 (外部顧客への営業収益 4,819,003) | yuho-2026 p.146 (also p.50) |
| その他 | 計 1,651,412 (外部顧客への営業収益 664,026) | yuho-2026 p.146 (also p.50) |

Segment 営業利益 (for the business-model profit step, "自動車事業が最も大きく、金融、その他が続く"):
自動車 2,777,049 / 金融 851,722 / その他 132,079 百万円 — yuho-2026 p.146 and p.50.
Prior year for reference (p.145): 計 43,199,865 / 4,481,180 / 1,447,114; 営業利益 3,940,278 / 683,519 / 181,194.

## Claims

### Identity

- `code` 7203 → tanshin-2026 PDF p.2「コード番号 7203」.
- `officialName` トヨタ自動車株式会社 → yuho-2026 p.1【会社名】.
- `nameEn` TOYOTA MOTOR CORPORATION → yuho-2026 p.1【英訳名】.
- `listings` tse プライム, nse プレミア → yuho-2026 p.74「②【発行済株式】」上場金融商品取引所名欄「東京、名古屋、ニューヨーク、ロンドン各証券取引所（東京はプライム市場、名古屋はプレミア市場）」. (The p.1 cover has no 上場取引所 field — only【縦覧に供する場所】東京証券取引所・名古屋証券取引所. tanshin-2026 p.2「上場取引所 東・名」agrees on the domestic pair.)
- `shortNameEn` TOYOTA → see Gaps and judgement calls.
- `description` → brands「トヨタ」「レクサス」「ダイハツ」: yuho-2026 p.15「「トヨタ」「レクサス」「ダイハツ」「GR」に加え、新たに「センチュリー」ブランドを提案」; 設計・製造・販売: p.7; 世界で販売: p.41「世界各地のお客様にいいクルマをお届けする」; ローン・リース: p.7「金融ならびに車両のリース事業」, p.44「顧客および販売店に対する融資プログラムおよびリース・プログラム」.
- `industries` automotive (primary) → p.7「自動車事業を中心に」; finance → 金融 is a reportable segment, p.146.

### Businesses

- Structure is flat → p.49「トヨタは国内・海外または部品等のような自動車事業の一分野を個別のセグメントとして管理していません。」 and the three segments of p.7 / p.146.
- 自動車 description → p.7「セダン、ミニバン、コンパクト、SUV、トラック等の自動車とその関連部品・用品の設計、製造および販売」「国内では、トヨタモビリティ東京㈱等の全国の販売店を通じて顧客に販売」「海外においては、米国トヨタ自動車販売㈱等の販売会社を通じて販売」.
- 自動車 products → p.7「主な製品の種類」(subset; see judgement calls).
- 自動車 customers → p.7 (販売店経由の顧客; 「一部大口顧客に対しては当社が直接販売」; 海外販売会社経由).
- 金融 description → p.7「主として当社および当社の関係会社が製造する自動車および他の製品の販売を補完するための金融ならびに車両のリース事業」「国内では、トヨタファイナンス㈱等が、海外では、トヨタ モーター クレジット㈱等が」; p.44「顧客および販売店に対する融資プログラムおよびリース・プログラム」.
- 金融 product 自動車ローン（小売融資）→ p.44「小売融資およびリース」; p.138「小売債権ポートフォリオは、主にディーラーから取得した車両販売の割賦債権…」.
- 金融 product 車両のリース → p.7, p.44.
- 金融 product 販売店向けの融資（卸売融資）→ p.44「卸売融資」; p.138「適性を満たしたディーラーに対して、在庫購入のための融資を行っています」.
- 金融 product クレジットカード → p.44「2001年４月に日本でクレジットカード事業を立上げました」.
- 金融 customers お客様・販売店 → p.44「顧客および販売店に対する融資プログラム」.
- その他 description → p.7「その他の事業では、情報通信事業等を行っています。」; p.51, p.145 same wording.

### Business model

- description / products / customers → p.7 (事業の内容), p.44 (金融サービス).
- revenueSources 車両の販売・部品の販売 → p.50 自動車 外部顧客への営業収益の商品別内訳「車両 38,847,899」「生産用部品 1,509,449」「部品 3,608,666」「その他 1,235,909」; 金融収益 → p.46「営業収益は…商品・製品売上収益ならびに金融事業に係る金融収益で構成」; その他の事業 → p.7.
- flow company「子会社602社、関連会社・共同支配企業159社（2026年3月31日現在）」→ p.7「子会社602社、関連会社および共同支配企業159社（2026年３月31日現在）」.
- flow customer「連結販売台数は959万5千台」→ p.41「自動車の連結販売台数は、959万５千台」.
- flow revenue「自動車事業が営業収益（セグメント間の取引を差し引く前）の87％」→ p.42「トヨタの営業収益合計（セグメント間の営業収益控除前）の87％を占めています」.
- flow profit「事業別の営業利益は自動車事業が最も大きく、金融事業、その他の事業が続きます」→ p.146 segment 営業利益 (figures in Segment ordering above).

### History

- 1937 description (1933 自動車部・研究開始 → 1937 分離独立) → yuho-2026 p.5「1933年９月 ㈱豊田自動織機製作所（現在の㈱豊田自動織機）内で自動車の研究を開始」「1937年８月 …より分離独立（会社創立）（社名 トヨタ自動車工業㈱…）」; official-history-founding「1933 (株)豊田自動織機製作所［現 (株)豊田自動織機］に自動車部を設置」「1937 トヨタ自動車工業(株)設立」.
- 1937 significance (会社創立; 1982年に社名変更して現在の会社) → p.5「（会社創立）」 and「1982年７月 トヨタ自動車販売㈱と合併し、社名をトヨタ自動車㈱に変更」.
- 1957 description → p.5「1957年10月 米国トヨタ自動車販売㈱設立」; official-history-founding「アメリカにToyota Motor Sales, U.S.A., Inc.（TMS）設立」「国産乗用車「クラウン」を対米輸出第1号として輸出」.
- 1957 significance → p.7「米国トヨタ自動車販売㈱等の販売会社を通じて販売」; p.42「主要な市場は、日本（21.7％）、北米（30.6％）、欧州（12.3％）およびアジア（18.3％）」.
- 1982 description → p.5「1950年４月 トヨタ自動車販売㈱を設立し、販売業務を移管」「1982年７月 トヨタ自動車販売㈱と合併し、社名をトヨタ自動車㈱に変更」; official-history-growth「トヨタ自動車工業(株)とトヨタ自動車販売(株)が合併、新社名「トヨタ自動車株式会社」となる」「工販合併－トヨタ自動車の発足」.
- 1982 significance (つくる会社と売る会社が一つに) → same two 沿革 lines (1950 販売業務を移管 / 1982 合併).
- 1986 description → p.5「1986年１月 トヨタ モーター マニュファクチャリング Ｕ.Ｓ.Ａ.㈱（現在のトヨタ モーター マニュファクチャリング ケンタッキー㈱）およびトヨタ モーター マニュファクチャリング カナダ㈱を設立」; official-history-growth「1986 Toyota Motor Manufacturing, U.S.A., Inc.（TMM）［現 TMMK］設立」.
- 1986 significance → p.7「海外においては、トヨタ モーター マニュファクチャリング ケンタッキー㈱等が製造」; p.45「北米では前連結会計年度および当連結会計年度の車両販売台数のそれぞれ76.0％および74.6％が現地で生産されています」.
- 1989 description → official-history-growth「1989 高級車ブランド、レクサスを設定 アメリカでレクサス店設立」「米国で高級車販売網「レクサス」の営業を開始」「2005 国内でレクサス店の営業開始」.
- 1989 significance → yuho-2026 p.15 brand list (「トヨタ」「レクサス」「ダイハツ」「GR」…「当社グループの各ブランド」).
- 1998 description → p.5「1967年11月 ダイハツ工業㈱と業務提携」「1998年９月 ダイハツ工業㈱を株式取得により子会社化」; official-history-growth「1967 ダイハツ工業(株)と業務提携」.
- 1998 significance → p.7「自動車は、当社、日野自動車㈱およびダイハツ工業㈱が主に製造」; p.9 関係会社の状況 ダイハツ工業㈱「自動車 100.00」.
- 2018 description → official-history-growth「2018 米国CESにてモビリティカンパニーへの変革を宣言 → 2020年、米国CESでWoven Cityを発表」.
- 2018 significance → p.16「モビリティカンパニーへの変革」「Toyota Woven City…2025年９月にオフィシャルローンチを迎えました」; p.41「Toyota Mobility Conceptのもと、モビリティカンパニーへの変革に向けた様々な技術開発や基盤づくりに取り組んできました」.
- 2025 description → p.6「2023年５月 …三菱ふそうトラック・バス㈱と日野自動車㈱の統合に関する基本合意書を締結（2025年６月に最終契約を締結）」「2025年６月 ダイムラートラック社、三菱ふそうトラック・バス㈱および日野自動車㈱との間で、三菱ふそうトラック・バス㈱と日野自動車㈱を統合する最終契約を締結」.
- 2025 significance → p.6「（当該契約に基づき、2026年４月１日において、日野自動車㈱は当社の連結子会社から除外）」; p.8 注記「2026年４月１日の三菱ふそうトラック・バス㈱との経営統合に伴い、当社の連結子会社から除外」; p.9 日野自動車㈱ （連結子会社）「自動車 66.16」.

## Gaps and judgement calls

No value is `null`. No unverified claim remains. Status: `published`.

1. **Foreign listings (type scope, decided by coordinator).** p.74 lists New York and London in addition to Tokyo and Nagoya. `Listing.exchange` covers Japanese exchanges only (`tse | nse | fse | sse`), so `listings` holds Tokyo プライム and Nagoya プレミア. The 有報 gives no market names for New York or London. Recorded here, not in `status`.
2. **`shortNameEn` = "TOYOTA" (accepted by coordinator).** Dropping only the legal suffix from「TOYOTA MOTOR CORPORATION」would give "TOYOTA MOTOR". "TOYOTA" was used because the protocol's own example for this field is `TOYOTA`, and the company calls its brand "TOYOTAブランド" (yuho-2026 p.15).
3. **No `children`.** Considered and rejected: (a) the 自動車 product breakdown 車両 / 生産用部品 / 部品 / その他 (p.50) — a revenue breakdown, not described as businesses, and the 有報 does not define 生産用部品 vs 部品, so any description would be invented; (b) brands トヨタ / レクサス / ダイハツ / GR / センチュリー (p.15) — brands, not businesses; (c) バリューチェーン事業 (p.15) — described as spanning service, finance, used cars and insurance, i.e. across segments, not under one; (d) p.49 says Toyota does not manage any part of the automotive business as a separate segment.
4. **自動車 `products` is a subset** of the p.7 list「ＬＳ、ＲＸ、クラウン、カローラ、ＲＡＶ４、ヤリス、ハイラックス、カムリ、タコマ、アーバンクルーザー、ハイランダー、ランドクルーザー、ライズ、シエンタ、ルーミー、ヴォクシー、アルファード、ノア、プロフィア、タント ほか」, shortened for length. Full-width Latin letters and digits were normalized to half-width (ＲＡＶ４ → RAV4, ＬＳ → LS, ＲＸ → RX). **プロフィア was deliberately left out.** The 有報 does not say which group company makes each model, and 日野自動車 (listed on p.7 as a main vehicle manufacturer) left consolidation on 2026-04-01. So I could not confirm that every listed model is still a group product today. The models kept are passenger models. Nothing in the documents suggests they are affected, but the documents do not name each model's maker either.
5. **その他 included** because the company says what it is (「情報通信事業等」, p.7/p.51/p.145). The description goes no further than that one phrase, because no document says more.
6. **`industries` includes `finance` as a secondary industry**, on the strength of 金融 being a reportable segment. Remove it if industry pages should list only a company's primary industry.
7. **Voting-rights percentages have no printed 基準日 on p.9.** The 1998 and 2025 significance lines therefore attribute them to 「2026年3月期の有価証券報告書」 rather than to a specific date.
8. **Scope change ahead.** All five fiscal years include 日野自動車 as a consolidated subsidiary. From 2027年3月期, Hino is excluded (p.6, p.8). When a 2027年3月期 year is added, the series will cross a consolidation-scope change. The type cannot express that today, so the next update should note it.
9. **Financial figures kept off the page.** Segment 営業利益 figures are in this log only. On the page, the profit step states the ranking without amounts, because of CLAUDE.md invariant 4 (revenue and net income are the only financial amounts shown). The 87% revenue share and the 959万5千台 sales volume are shown, since neither is a profit or valuation figure.
10. **History selection (8 events).** Supportable events left out for the 5–8 limit: 1935/1936 first truck and passenger car, 1949 listing, 1982 トヨタ モーター クレジット設立, 1984 NUMMI (production ended 2010 per official-history-growth, so no link to today), 1997 プリウス, 2000 トヨタファイナンシャルサービス設立, 2001 日野自動車 子会社化. No event was chosen as "the origin of the finance business", because no source names one. The official page's 1980s heading「初の本格的海外生産」 is not tied to a specific event, so it was not attributed to 1986.
11. **Extraction limits.** No PDF page rendering was available (pdftoppm not installed), so no page image was checked visually. Every value was confirmed in two independent pdftotext modes (`-raw` and `-table`), and the 有報 figures agree across three filings. The 短信 extraction logged CMap errors for an MSMincho font. The header row and both numeric rows came through intact in both modes and agree with the 有報.
12. **Not consulted:** 統合報告書. The 有報 sections above were sufficient. I did not check whether a 2026 edition has been published.
13. **Dates.** `accessedAt` is 2026-09-13, the day every document was downloaded and read. Re-verification on 2026-09-14 used the same downloaded copies, so `accessedAt` was not advanced. `updatedAt` and the revision date are 2026-09-14, the day the entry was finalized.
