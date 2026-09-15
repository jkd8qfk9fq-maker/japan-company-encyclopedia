# アドバンテスト — research log

Researched: 2026-09-15 (documents downloaded, read, entry written and verified the same day)

Page numbers for `yuho-2026` and `yuho-2025` are the **printed** page numbers (the `- n -` footer). In both
files printed page = PDF page index − 3 (PDF p.4 = p.1, the five-year table). The cover (表紙) is PDF p.3 and
has no printed number. For `tanshin-2026`, p.1 = PDF p.1. For `tanshin-2027-q1`, printed page = PDF page − 2
(the table of contents gives (セグメント情報) P.8, which is PDF p.10).

**Extraction.** Every PDF was extracted with `pdftotext -cfg <xpdfrc> -enc UTF-8` using the xpdf Japanese
language pack in the scratchpad (protocol §1, EDINET font trap), in `-raw` and `-table` modes. All four
extracts ran with zero errors, and the Japanese labels were checked to be legible before any label was read
(e.g. yuho-2026 cover:「【会社名】 株式会社アドバンテスト」「【英訳名】 ADVANTEST CORPORATION」). `-layout` was
not used. Official web pages were fetched with `curl` and a browser User-Agent, and reduced to text.

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書兼事業報告書 第84期（自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月26日. A single document meeting both the 有報 (金融商品取引法第24条第1項) and the 会社法 事業報告 requirements (cover note). Confirmed latest: Advantest's IR page「有価証券報告書等」(https://www.advantest.com/ja/investors/ir-library/report/) lists, under the heading「第84期 （FY2025）」, the link「第84期有価証券報告書兼事業報告書」 first, followed only by the 第84期半期報告書 and earlier years. The only 訂正 notice on that page concerns the 第80期 report (2022年7月7日) | https://www.advantest.com/document/ja/investors/ir-library/report/IR_SecuritiesandBusinessReport_84th_jp.pdf | 表紙, 1, 3, 4, 5, 6, 7, 8, 9, 19, 29, 30, 31, 39, 40, 41, 44, 47, 96, 98, 106, 110, 111, 112, 135, 155, 157 |
| `tanshin-2026` | 2026年3月期 決算短信〔IFRS〕(連結), 2026年4月27日 (百万円未満四捨五入) | https://www.advantest.com/document/ja/investors/ir-library/result/J_FR_FY2025_FN.pdf | 1, 2 |
| `yuho-2025` | 有価証券報告書 第83期（自 2024年4月1日 至 2025年3月31日）, 提出日 2025年6月25日 | https://www.advantest.com/document/ja/investors/ir-library/report/IR_SecuritiesReport_83rd_jp.pdf | 1 (five-year table), 4 (事業の内容, old segments), 42 (old segment sales) |
| `tanshin-2027-q1` | 2027年3月期 第1四半期決算短信〔IFRS〕(連結), 2026年7月29日. Read to confirm the segment structure after year end | https://www.advantest.com/document/ja/investors/ir-library/result/J_FR_FY2026_1Q.pdf | 1, 2, 3, 8 |
| `official-history` | 公式サイト「アドバンテストのあゆみ｜企業情報」(no page date) | https://www.advantest.com/ja/about/history/ | decade leads 1950s / 1980s / 2000s / 2020s and timeline rows 1954, 1972, 1982, 1985, 2011, 2018, 2019, 2024 |
| `official-semiconductor-test` | 公式サイト「解説：半導体テスト｜企業情報」(no page date) | https://www.advantest.com/ja/about/business/ | Who we are; 当社が半導体業界で関わる工程; テスト・システムの価値; 当社がテストする半導体 |
| `official-products` | 公式サイト「製品・ソリューション」(no page date) | https://www.advantest.com/ja/products/ | category leads 半導体テストシステム, テストシステム周辺機器 |
| `official-soc` | 「SoCテストシステム｜半導体テストシステム（半導体試験装置）」 | https://www.advantest.com/ja/products/semiconductor-test-system/soc/ | lead paragraph |
| `official-memory` | 「メモリテストシステム｜半導体テストシステム（半導体試験装置）」 | https://www.advantest.com/ja/products/semiconductor-test-system/memory/ | lead paragraph |
| `official-test-handler` | 「テストハンドラ｜テストシステム周辺機器」 | https://www.advantest.com/ja/products/component-test-system/test-handler/ | lead paragraph |
| `official-system-level-test` | 「システムレベル・テストシステム｜テストシステム周辺機器」 | https://www.advantest.com/ja/products/component-test-system/system-level-test-systems/ | lead paragraph |

Consulted but not cited in the entry:
- 「2025年度(2026年3月期) 決算説明会」資料, 2026年4月27日 (`JE_BIZ_260427_slide.pdf`, https://www.advantest.com/document/ja/investors/ir-library/result/JE_BIZ_260427_slide.pdf) — slide 6 legend only, to see how the company names the parts of each segment (see Segment ordering).
- 「アドバンテストの強み」(https://www.advantest.com/ja/about/why-advantest/) and「アドバンテストを知る」(https://www.advantest.com/ja/investors/individual-investors/understand/) — read for product explanations; see Gaps 5 and 6.
- 「メモリ向けデバイスインタフェース」(https://www.advantest.com/ja/products/component-test-system/device-interface/) and「測長SEM／欠陥レビューSEM」(https://www.advantest.com/ja/products/cd-sem/) — see Gaps 5 and 7.
- 統合報告書 2025 (`J_all_IAR2025.pdf`) was not downloaded (rate-limit budget); nothing depends on it.

## Financials

Source table: `yuho-2026` p.1「1【主要な経営指標等の推移】(1)連結経営指標等」, 回次 第80期–第84期, 決算年月
2022年3月–2026年3月. Row labels as printed: **売上高** and **親会社の所有者に帰属する当期利益** (wrapped onto two
lines: 親会社の所有者に帰属する / 当期利益). Unit (百万円). Stored value = printed × 1,000,000.

| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (第80期) | 416,901 百万円 → 416,901,000,000 円 | 87,301 百万円 → 87,301,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2023年3月期 (第81期) | 560,191 百万円 → 560,191,000,000 円 | 130,400 百万円 → 130,400,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2024年3月期 (第82期) | 486,507 百万円 → 486,507,000,000 円 | 62,290 百万円 → 62,290,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1 | n/a |
| 2025年3月期 (第83期) | 779,707 百万円 → 779,707,000,000 円 | 161,177 百万円 → 161,177,000,000 円 | IFRS | yuho-2026 p.1; identical in yuho-2025 p.1; yuho-2026 p.98 連結損益計算書 前連結会計年度 親会社の所有者 161,177 | Matches tanshin-2026 p.1 prior-year row: 779,707 / 161,177 |
| 2026年3月期 (第84期) | 1,128,610 百万円 → 1,128,610,000,000 円 | 375,353 百万円 → 375,353,000,000 円 | IFRS | yuho-2026 p.1; p.98 連結損益計算書 売上高 1,128,610, 当期利益の帰属 親会社の所有者 375,353; p.39–40 MD&A text「1,128,610百万円」(p.39)「375,353百万円」(p.40) | **Matches** tanshin-2026 p.1: 売上高 1,128,610 百万円, 親会社の所有者に帰属する当期利益 375,353 百万円. No difference |

**Restatements:** none for either figure. yuho-2025 p.1 (提出日 2025年6月25日) prints the same 売上高 and 親会社の
所有者に帰属する当期利益 for 2022年3月期–2025年3月期 as yuho-2026 p.1. tanshin-2026 p.2 注記事項:「(1)期中における
連結範囲の重要な変更:無」「① IFRSにより要求される会計方針の変更:無」「② ①以外の会計方針の変更:無」「③ 会計上の見積り
の変更:無」. The segment reorganisation (below) restated the **segment** comparatives only, not consolidated
revenue or net income. yuho-2026 p.1 注3 (派遣社員数の控除) concerns only 従業員数.

**Accounting standard:** IFRS for all five years. yuho-2026 p.1 注1「国際会計基準(以下「IFRS」という。)に基づいて
連結財務諸表を作成しています。」; p.96「連結財務諸表規則…第312条の規定により、国際会計基準…に準拠して作成」, and
「指定国際会計基準特定会社」の要件を満たしている; yuho-2025 carries the same wording (PDF p.97). The five-year
table has IFRS row labels (税引前利益, 親会社の所有者に帰属する当期利益, 親会社所有者帰属持分比率) in every column of both
filings, and no standard change is noted. tanshin title「決算短信〔IFRS〕(連結)」.

**`revenueBasis`:** omitted. Consolidated 売上高 throughout; 連結範囲の重要な変更 無; the segment change does not
change what consolidated revenue covers.

**`note`:** none. The only items the 有報 singles out are an impairment of 21,393 百万円 on Essai, Inc. goodwill and
intangibles in 2025年3月期 (p.39, p.111 注2) and a 17,312 百万円 fair-value gain on a call option in 2026年3月期
(p.40, p.111 注3). Neither is presented by the company as changing how the year should be read, so no note was
written.

Not used: 当期利益 (incl. non-controlling interests). It is identical, 161,177 / 375,353 (p.98), with no
non-controlling interest line. The 包括利益 row (107,286 / 146,882 / 84,441 / 149,428 / 432,230) sits directly
below net income in the table; the verification script asserts no stored value equals it.

**Verification performed 2026-09-15** (`verify.mjs` in the scratchpad): parsed the 売上高, 親会社の所有者に帰属する
当期利益 and 当期包括利益 rows from yuho-2026 p.1 and yuho-2025 p.1 in both `-raw` and `-table` extracts, and the
2026年3月期 and 2025年3月期 rows of tanshin-2026 p.1 in both modes. printed × 1,000,000 === stored for all 44 value
comparisons; 18 checks that no stored net income equals the 包括利益 figure; **62 checks, 0 failures**. Digit
counts: revenue 12 digits (13 for 2026年3月期), net income 11–12 digits, consistent with 百万円 × 10^6. (In the 短信
row, 当期利益 and 親会社の所有者に帰属する当期利益 are equal, so that comparison cannot tell those two columns apart;
the 有報 comparison can.)

## Segment ordering

**Segment structure changed in the reported year.** yuho-2026 p.4 and p.110:「当社グループの報告セグメントは、従来、
「半導体・部品テストシステム事業」、「メカトロニクス関連事業」、及び「サービス他」の3つを報告セグメントとしておりました
が、テスタのみならず周辺機器等を含めた包括的なテストソリューションの提供を目指す中で、マネジメントアプローチの視点により
当社グループにおける収益の源泉を再分類し、当連結会計年度より、「テストシステム事業」及び「サービス他」という2つの報告
セグメントへと変更いたしました。なお、比較対象期間のセグメント情報は、変更後の報告セグメントの区分に基づき作成して
おります。」 The entry uses the two segments of the latest 有報. tanshin-2027-q1 p.8 (セグメント情報) repeats the same two
segments and descriptions, and p.2–3 report results for <テストシステム事業部門> (p.2) and <サービス他部門> (p.3), so the structure is
current. yuho-2026 p.157 (33.後発事象) lists only a convertible bond issue; no further reorganisation.

| Segment | Segment revenue 2026年3月期 (as printed, 百万円) | 2025年3月期 restated (百万円) | Document · page |
|---|---|---|---|
| テストシステム事業 | 1,019,390 (合計; 外部顧客への売上高 1,019,380 + セグメント間 10) — 90.3% of 売上高 | 682,819 | yuho-2026 p.111, p.40; share p.41 |
| サービス他 | 109,230 — 9.7% of 売上高 | 96,888 | yuho-2026 p.111, p.40; share p.41 |
| 消去又は全社 | △10 | — | p.111 |
| 連結 | 1,128,610 | 779,707 | p.111 |

Old structure, log only (yuho-2025 p.42, 2025年3月期): 半導体・部品テストシステム事業部門 598,128 / メカトロニクス関連事業部門
73,180 / サービス他部門 108,399. In yuho-2025 p.4 システムレベルテスト was part of サービス他; in yuho-2026 p.4 it is part of
テストシステム事業. The restated 2025年3月期 split (682,819 / 96,888) is the company's own.

**Children of テストシステム事業.** The company itself splits the segment's revenue, yuho-2026 p.135 (22.売上高
(1)収益の分解, 「テストシステム事業における内訳」, 単位:百万円):

| Child | 2026年3月期 (as printed) | 2025年3月期 (as printed) | Document · page |
|---|---|---|---|
| SoC | 767,424 | 440,452 | yuho-2026 p.135 |
| メモリ | 171,504 | 157,676 | yuho-2026 p.135 |
| その他 | 80,462 | 84,691 | yuho-2026 p.135 |
| 合計 | 1,019,390 | 682,819 | yuho-2026 p.135 |

767,424 + 171,504 + 80,462 = 1,019,390 (checked). The p.135 row labels are bare「SoC」「メモリ」「その他」. They are
mapped to the product names SoCテストシステム and メモリテストシステム because (a) p.4 names these product groups in
exactly that order, (b) p.41 discusses the segment as「SoCテストシステムにおいて…」「メモリテストシステムにおいては…」,
and (c) the results presentation (slide 6 legend) splits テストシステム into「SoCテストシステム」「メモリテストシステム」「その他
システム」. The entry gives **no amounts** for children; it orders SoC before メモリ by the p.135 figures.

テストハンドラ, デバイスインタフェース and システムレベルテスト follow in the order p.4 lists them
(「…テストハンドラ、…デバイスインタフェースなどの製品群及び半導体やモジュールのシステムレベルテストのソリューション」).
They are **not** ranked: no document I read says which revenue line they fall in, and「その他」(80,462) is not defined.
The entry does not say they make up「その他」.

**サービス他 has no children.** The company describes its contents (p.4) but prints no split in the 有報; the
presentation's split (サポート・サービス / その他) leaves「その他」undefined. The contents appear as `products`.

## Claims

### Identity

- `code` 6857 → tanshin-2026 p.1「コード番号 6857」; tanshin-2027-q1 p.1 the same; official pages footer「東京証券取引所プライム市場上場（コード：6857）」.
- `officialName` 株式会社アドバンテスト → yuho-2026 表紙【会社名】.
- `nameEn` ADVANTEST CORPORATION → yuho-2026 表紙【英訳名】 (also yuho-2025).
- `shortNameEn` ADVANTEST → 英訳名 minus "CORPORATION". Already uppercase in the company's own English name, and distinct from every other entry.
- `listings` tse プライム → yuho-2026 p.47 株式の総数等「上場金融商品取引所名…東京証券取引所 プライム市場」; tanshin-2026 p.1「上場取引所 東」. No other exchange. (NYSE listing 2001–2016 is historical, p.3.)
- `description` → 試験装置: official-semiconductor-test「当社の主力製品である半導体テスタは、半導体がきちんと動作するか、また求められている性能や耐久性を満たしているかを高精度・高効率にテストします」; history rows use「半導体試験装置」. 周辺製品: official-products「テストシステム周辺機器 テストする半導体とテストシステムを接続するインタフェースや、テストシステムに半導体を搬送する装置など、テストシステムの周辺で使用する製品群です」. つくり・販売: p.4「テストシステム製品群と…メカトロニクス関連製品群の製造・販売を主な事業内容」. 世界の半導体関連企業: p.29「当社グループは、世界中の半導体関連企業を顧客としているため」. 58 characters, one sentence.
- `industries` semiconductors (primary) → p.4 (every segment is about testing semiconductors); p.29「半導体製造装置メーカーである当社グループ」. See Semiconductor industry placement.

### Businesses

- テストシステム事業 name / shortName → p.4, p.110 segment name「テストシステム事業」; the MD&A calls it「テストシステム事業部門」(p.40–41). shortName drops 事業.
- テストシステム事業 description, 設計どおりに動くか → official-products「半導体が設計どおりに動作するか、どれ位品質に優れているかを…試験します」; 「性能や耐久性」→ official-semiconductor-test (above); 半導体を運ぶ装置やテスタとつなぐ部分 → official-products テストシステム周辺機器 (above); 「90.3%」→ p.41「当部門は、当連結会計年度において売上高の90.3%を占めております」.
- テストシステム事業 customers 半導体関連企業 → p.29. NVIDIAグループ / Taiwan Semiconductor Manufacturing Co., Ltd. → p.112 (6)主要な顧客に関する情報「当連結会計年度において、外部顧客への売上高のうち連結損益計算書の売上高の10%以上を占める顧客グループはNVIDIAグループ及びTaiwan Semiconductor Manufacturing Co., Ltd.であり、関連するセグメントは、いずれも主にテストシステム事業であります」 (names as printed there). See Gaps 3.
- SoCテストシステム → official-soc「SoC（System on a chip）は、異なる種類の複数の集積回路を1つのパッケージに集約したものを指します。SoCテストシステムは、システム内のさまざまな機能を持つカード／モジュールをテストの仕様に応じて組み合わせることで、ロジックやアナログ、RF、DC、イメージャーなど、半導体のあらゆる集積回路をテストすることができます。」 RF = 無線通信 → official-semiconductor-test「RFデバイス 無線通信を担う半導体で…」. Product group named at p.4.
- メモリテストシステム → official-memory「半導体を用いデータの記録・保持ができる集積回路を、メモリ集積回路と言います。メモリテストシステムは、少品種・大量生産が一般的なメモリ半導体の量産工程に最適化され、多数個の半導体を同時にテストすることができます。」; 「データを記憶する半導体」「DRAM」「NANDフラッシュ」→ official-semiconductor-test「メモリ半導体 データを記憶する半導体で、データを高速で読み書きできるDRAMや、電源無しでデータを長期間保持できるNANDフラッシュなどがあります。」 Product group named at p.4.
- テストハンドラ → official-test-handler「テストハンドラとは、半導体デバイスの後工程試験を自動化する装置です。デバイスの搬送、半導体試験時の温度印可、テスト結果に基づいたデバイスの選別を行います。」; p.4「半導体デバイスをハンドリングするメカトロニクス応用製品のテストハンドラ」.
- デバイスインタフェース → p.4「被測定物とのインタフェースであるデバイスインタフェース」; official-products「テストする半導体とテストシステムを接続するインタフェース」. See Gaps 5.
- システムレベルテスト → official-system-level-test「半導体がシステムや最終製品に組み込まれた実使用環境での動作をテストします。半導体単体でのテストを補完し、テストの品質や効率の改善を可能にします。」; p.4「半導体やモジュールのシステムレベルテストのソリューション」.
- サービス他 description / products → p.4「サービス他部門の内容は、上記の事業に関連した総合的な顧客ソリューションの提供、ナノテクノロジー関連の製品群、サポート・サービス及び消耗品販売等で構成されております」; p.41「当社グループ製品の設置台数の増加に伴い、サポート・サービスの売上が伸びました。加えて、高性能SoC半導体向けを中心としたテスト用インタフェースボードなどの消耗品販売も増加しました」; tanshin-2027-q1 p.3 the same two sentences for 1Q.

### Business model

- description → p.4 (製造・販売, 保守・サービス), p.29 (顧客), official-products (周辺機器), p.41 (サポート・サービス, 消耗品).
- products → p.4 product groups; p.41 (サポート・サービス, テスト用インタフェースボードなどの消耗品).
- customers → p.29, p.112.
- revenueSources → p.106 (14)収益「半導体産業におけるテストシステム製品、半導体デバイスをハンドリングするメカトロニクス応用製品のテストハンドラ等の製品販売については、顧客が当該資産に対する支配を獲得したときに…収益を認識」「サービス提供契約は、契約で定められた期間にわたり顧客に役務を提供する義務を負っており…当該契約期間に応じて均等按分し収益を認識」; 消耗品の販売 → p.41.
- flow company → p.4「この事業部門の生産活動は、当社及び複数の外部委託企業等が担当しております。販売活動は、主に当社が国内及び一部海外ユーザー(韓国、中国等)を担当し、その他の海外ユーザーについてはAdvantest America, Inc.、Advantest Europe GmbH、Advantest Taiwan Inc. 及び Advantest (Singapore) Pte. Ltd.等が担当しております。」 The entry names two of the four subsidiaries and says「など」.
- flow offering → p.4.
- flow customer → p.29 (顧客); p.41「当連結会計年度の海外売上比率は97.8%(前連結会計年度98.0%)」; p.112 (10%以上の顧客グループ); p.31「顧客上位5社による売上高は、前連結会計年度の売上高全体の約48%及び当連結会計年度の同約50%を占めています」.
- flow revenue「1兆1,286億円」→ **derived format**: yuho-2026 p.9 MTP3 table, column「2025年度実績」, row「売上高」, prints「11,286億円」 for 1,128,610 百万円; written as 1兆1,286億円. 「90.3%」「9.7%」→ p.41.
- flow profit「3,754億円」→ yuho-2026 p.9 MTP3 table, column「2025年度実績」, row「当期利益」, prints「3,754億円」. 375,353 百万円 is 3,753.53億円, so the company rounds (tanshin-2026 p.1「百万円未満四捨五入」 convention); the entry uses the company's printed 3,754億円. 当期利益 = 親会社の所有者に帰属する当期利益 in that year (p.39 table, p.98). The MTP3 table's other rows (ROIC, 1株当たり当期利益) were not used. 研究開発 sentence → p.44「特にテストシステム事業においては、市場競争力を保ち、顧客の様々なニーズに対応した多くの種類の製品を供給するために多額の研究開発投資を継続的に行う必要があります。」 The R&D amounts (714億円 / 781億円, p.44) are deliberately not in the entry (invariant 4).

### History

- 1954 description → yuho-2026 p.3「1954年12月 電子計測器専門メーカーとして、資本金50万円をもってタケダ理研工業株式会社を愛知県豊橋市に設立」; official-history 1950s「創業当初は電圧電流計や周波数カウンタといった単機能の電子計測器を開発・製造」, row 1954「武田郁夫が「タケダ理研工業株式会社」を創業」.
- 1954 significance「出発点」→ official-history heading「出発点は電子計測技術」; yuho-2026 p.3 note: the 1974 merger was a par-value change and「実質上の存続会社は被合併会社であるタケダ理研工業株式会社」, renamed 株式会社アドバンテスト in 1985. 「電子計測技術で…」→ official-semiconductor-test「当社は、1954年の創業以来培ってきた電子計測技術で顧客のさまざまな課題解決に貢献し、 半導体の進化を見えないところで支えています。」
- 1972 description → official-history row 1972「国産初の半導体試験装置「T-320/20」「T-320/30」を発売」; 1950s lead「1960年代末には半導体産業の発展をいち早く予測し、電子計測技術が活かせるテスト・システムの開発に社運をかけて参入」. 「国産初」 is attributed to the company, not asserted.
- 1972 significance「主力製品」→ official-semiconductor-test「当社の主力製品である半導体テスタ」. Stated side by side; no claim that the 1972 products are today's products.
- 1982 description → yuho-2026 p.3「1982年6月 子会社Advantest America, Inc.を米国に設立」; official-history row 1982「米国に現地法人を設立、以降世界各地に拠点を展開」.
- 1982 significance → p.5 関係会社 Advantest America, Inc.「テストシステム等の開発・販売」(and 注3: its sales exceed 10% of consolidated sales); p.41 海外売上比率 97.8%. Two facts side by side, no causal claim.
- 1985 description → yuho-2026 p.3「タケダ理研工業株式会社は1985年10月1日付で現商号の株式会社アドバンテストに社名変更」「1985年9月 東京証券取引所市場第一部に株式上場」; official-history row 1985「社名を「株式会社アドバンテスト」に変更」.
- 1985 significance → official-history 1980s lead「テスト・システム事業は当社の大黒柱となりました」; p.41 90.3%. The same lead's「1985年には世界半導体テスタ市場で初めてシェア1位を獲得」 was not used (superlative, third-party survey).
- 2011 description → yuho-2026 p.3「2011年7月 Verigy Ltd.の普通株式全株を取得し、完全子会社化」; official-history row 2011「半導体試験装置大手Verigy社を買収」 (「大手」 dropped); 2000s lead「とりわけ、2011年のVerigy社の買収は、第2の「社運をかけた一手」でした。」
- 2011 significance → official-history 2000s lead「Verigy社の顧客ベースと、グローバルオペレーションのノウハウが加わったことは、その後当社の成長の大きな礎となりました。」 Attributed to the company.
- 2019 description → official-history row 2019「米国Astronics社のシステムレベルテスト事業を譲受」.
- 2019 significance → yuho-2026 p.4 (システムレベルテスト in テストシステム事業); p.8「当社グループはこれまでもシステムレベルテストやテスト周辺機器への事業展開を進めてきましたが」; official-history 2020s lead「当社はシステムレベルテストやデータ・アナリティクス分野への事業拡大など」. The entry does not claim that today's システムレベルテスト products or Advantest Test Solutions, Inc. descend from the Astronics business: no document I read says so.
- 2024 description → official-history row 2024「Group CEOにDouglas Lefeverが就任 第3期中期経営計画（MTP3）を発表」; row 2018「グランドデザインおよび中長期経営方針を発表」; yuho-2026 p.6「2018年より中長期経営方針「グランドデザイン」として定めています」「そして2024年、…「グランドデザイン」を…改定しました」; p.7「改定した「グランドデザイン」に則り策定した、第3期となる3か年中期経営計画(MTP3)を2024年度より展開」.
- 2024 significance → p.7「第3期中期経営計画(MTP3、2024～2026年度)」「MTP3の最終年度となる2026年度は、中長期的な企業価値向上に向けた各種の取り組みを引き続き推進いたします」; p.9「引き続きMTP3で掲げた施策を推し進める」. MTP3 targets are not quoted (they include ROIC and 1株当たり当期利益).

**Passage check performed 2026-09-15** (`claims.mjs` in the scratchpad): every「…」passage quoted in this log (outermost brackets, split at …, whitespace- and full-width-normalised) was searched for in the extracted text of the documents above plus `semiconductors.json`. 146 found, 0 missing. The script pools all documents, so the page attributions above were confirmed separately with a per-page search (`findp.mjs`).

## Semiconductor industry placement

Categories in `src/data/industries/semiconductors.json`: stages 設計 / 前工程（回路づくり） / 後工程（組み立て・検査） /
電子機器への組み込み; inputs 製造装置 / 部素材・原料.

**Recommendation: `manufacturing-equipment`（製造装置）only**, the same category as Tokyo Electron.

Supporting passages from Advantest's own documents:

1. `yuho-2026` p.29 (事業等のリスク a. 市場変動): 「このことが半導体製造装置メーカーである当社グループの事業環境の不確実性を高めています。」 and p.30「当社グループが取り扱う半導体製造装置及び関連技術についても」. The company calls itself a 半導体製造装置 maker.
2. `official-semiconductor-test` (当社が半導体業界で関わる工程): 「当社のテスト・システムは、ウェーハを作る工程の最後と、パッケージ等を施した後の最終検査の工程で用いられるほか、量産ラインが立ち上がる前段階の設計・評価工程や、最終製品に実装した後の製品・システムレベルテスト工程でも使用されています。」 and (テスト・システムの価値) 「半導体テストシステムは、半導体がパッケージングされた後の「ファイナル・テスト」だけでなく、前工程の「ウェーハ・テスト」や設計・評価段階でも使用されます。」 — equipment used in both 前工程 and 後工程, which is how the category describes 製造装置 (「前工程と後工程で使う装置です。…検査装置など」).
3. `official-test-handler`: 「テストハンドラとは、半導体デバイスの後工程試験を自動化する装置です。」 — also equipment.
4. `yuho-2026` p.4: the business is「テストシステム製品群とテストハンドラやデバイスインタフェース等のメカトロニクス関連製品群の製造・販売」.

Why not a stage: every passage describes Advantest's products being **used in** other companies' 前工程 (ウェーハ・テスト),
後工程 (ファイナル・テスト), 設計・評価 and system-level test. None says Advantest itself designs or manufactures
semiconductors for sale, or builds them into devices. So no passage fits 設計, 前工程, 後工程 or 電子機器への組み込み as a
category Advantest *belongs to*; the 設計・評価 and 最終製品に実装した後 passages describe where its equipment is used,
and the 製造装置 category already covers that. No passage places Advantest in 部素材・原料.

Two adjacent facts, recorded so the lead can judge, not used for placement: Advantest designs semiconductors for
its own testers (official-semiconductor-test「テスト・システム・メーカーは、自社で半導体の設計を行い」; p.44 R&D
「テストシステムに用いる…化合物半導体の開発」). These are components of its own equipment, not products it sells, so
they do not make it a 設計 company in the industry page's sense. The industry log (`industry-semiconductors-and-terms.md`)
already quotes NEDO p.28 listing「アドバンテスト」 among 半導体製造装置産業 makers; I did not re-read that document.

## Gaps and judgement calls

No value is `null`. No unverified claim remains. Status: `published`.

1. **New segment structure.** The entry uses the two segments that yuho-2026 adopts from 2026年3月期 (and the 1Q 短信 keeps). The three old segments (半導体・部品テストシステム / メカトロニクス関連 / サービス他) are recorded above for anyone comparing with older material.
2. **Children of テストシステム事業 mix ranked and unranked items.** SoCテストシステム and メモリテストシステム are ordered by p.135 (767,424 > 171,504). テストハンドラ, デバイスインタフェース, システムレベルテスト follow in p.4 listing order with no ranking, because the company does not say which revenue line holds them and does not define「その他」. Mapping the p.135 labels「SoC」「メモリ」 to the product names is a judgement, supported by p.4, p.41 and the presentation legend.
3. **Named customers.** NVIDIAグループ and Taiwan Semiconductor Manufacturing Co., Ltd. are named in p.112 (主要な顧客, 当連結会計年度) with segment「主にテストシステム事業」; amounts log only: 243,735 / 124,922 百万円. The sales table p.41 names the NVIDIA counterparty differently —「NVIDIA INTERNATIONAL, INC.」228,273 百万円 (20.2%) — and TSMC 124,922 (11.1%); the entry uses the group name from p.112 because that note states the segment link. Prior year (log only): Taiwan Semiconductor Manufacturing Co., Ltd. 96,158 and Samsungグループ 87,734 (p.112); Samsung Electronics Co., Ltd. 82,795 (10.6%) in p.41. Samsung is not in the entry, because it was not a 10% customer in the latest year. No other customer is named.
4. **Customer types.** `customers` uses「半導体関連企業」(p.29). Also found and not used in the entry: official-semiconductor-test「顧客である世界中の半導体メーカー」; yuho-2026 p.19 (サステナビリティ) says estimates depend「主に、半導体設計製造会社(IDM)、ファブレス半導体企業、ファウンドリー及びテストハウスの設備投資」. That passage is about what drives the estimates rather than a customer list, and the four terms would need glossing, so it stays in the log. A reviewer may add it to the customer step.
5. **デバイスインタフェース kept to one sentence.** Two nearby statements were not used, because they could not be tied to this product group without inference: 「アドバンテストの強み」 lists「テストシステムと半導体を高精度に接続するソケットやインタフェースボード」 without calling them デバイスインタフェース, and p.41 counts「テスト用インタフェースボードなどの消耗品」 in **サービス他**. The only デバイスインタフェース product page found is「メモリ向けデバイスインタフェース」 (HiFIX, Burn-in Board, Performance Board), which covers memory only.
6. **Evaluative language not used.** 「リーディング・カンパニー」「世界トップクラス」(official-semiconductor-test), 「支配的な市場ポジション」「業界No.1」(強み page), 「半導体テスタ市場における市場シェア…暦年2025年 65%」(p.8), 「世界シェア第1位」(history 1985), 「日経平均を構成する225銘柄」(history 2000) and customer-satisfaction rankings were left out.
7. **ナノテクノロジー関連の製品 not explained.** p.4 places「ナノテクノロジー関連の製品群」 in サービス他, but no document I read says what they are. The products site has a「測長SEM／欠陥レビューSEM」 category (フォトマスクやウェーハ上の配線パターンの測定) and p.44 lists「電子ビーム計測装置の開発」 under テストシステム事業部門's R&D; neither is linked by the company to「ナノテクノロジー関連」, so the entry names the category only, as printed.
8. **サービス他「総合的な顧客ソリューションの提供」** (p.4) not written into the entry: too abstract for a beginner, and no document says concretely what it covers.
9. **History selection (7 events).** Left out, all supportable: 1957 TR-124B, 1963 デジタル・マルチメーター (日本初), 1976 富士通の資本参加, 1983 東証二部上場, 1993 T6691, 1995 T5581 (「大ヒット製品」), 2001 NYSE上場 (2016 廃止), 2003 日本エンジニアリング社経営統合 and T2000, 2008 Credence, 2010 子会社2社吸収合併, 2013 W2BI, 2018 グランドデザイン (covered in 2024), 2020 Essai / PDF Solutions / V93000 EXA Scale, 2021 MTP2 and R&D Altanova, 2022 CREA and プライム市場, 2023 Shin Puu, 2024 Salland (p.155). None of these had a source tying it to today's structure more directly than the seven chosen. 2024 is weaker as a turning point than the others; it is kept because it is the current long-term policy revision and plan, which p.6–9 describe at length.
10. **`industries`: semiconductors only.** `electronics` considered on p.44「半導体製造、エレクトロニクス、情報通信を支える計測技術」 and not added: Advantest sells test equipment, not electronic products, matching the Tokyo Electron decision.
11. **Derived figures.** 1兆1,286億円 and 3,754億円 are the company's own 億円 figures (p.9) rewritten with 兆; stated as derived above. 90.3% / 9.7% / 97.8% / 約50% are printed percentages. No other derived numbers.
12. **Rich-text terms.** `[[term:semiconductor|半導体]]` in テストシステム事業 and `[[term:back-end-process|後工程]]` in テストハンドラ, both existing terms; validated by `content:validate-file`. 「テストハンドラ」 uses 後工程 in the sense of the test handler page (「後工程試験」).
13. **Extraction limits.** No page image was rendered. Figures were confirmed in `-raw` and `-table` across three documents. The presentation slides were read from `-raw` text only.
14. **EDINET not checked.** No API key. "No 訂正報告書 for 第84期" rests on the IR library page listing.
15. **Dates.** Every document was downloaded and read on 2026-09-15; `accessedAt`, `updatedAt` and the revision date are 2026-09-15. Web pages carry no publication date, so they have no `publishedAt`.
