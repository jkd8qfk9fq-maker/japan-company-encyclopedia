# 本田技研工業 — research log

Researched: 2026-09-15 (documents downloaded, read, entry written and verified the same day)

Page numbers for `yuho-2026` and `yuho-2025` are the EDINET page numbers printed in each page footer
(`n/221`, `n/208`). They equal the PDF page index. For `yuho-2022` (a company-typeset booklet, not the
EDINET rendering), page numbers are **PDF page indices**. The printed marker on that page reads 「― 2 ―」.

**Extraction note (read before re-verifying).** Both EDINET-rendered 有報 PDFs (S100YDD9, S100VYOD) use
the `UniJIS-UTF16-H` CMap. The installed `pdftotext` (xpdf 4.06) has no Adobe-Japan1 CMaps. A plain
`pdftotext -enc UTF-8` run gives no error, but the Japanese comes out garbled: UTF-16 code units are
decoded as single bytes, and some bytes are dropped. ASCII digits come through intact, so the numbers
look right while every label is unreadable. The fix was the xpdf Japanese language pack
(`https://dl.xpdfreader.com/xpdf-japanese.tar.gz`), unpacked in the scratchpad and passed with
`pdftotext -cfg <xpdfrc> -enc UTF-8`. After that, both extracts ran with zero errors. The 決算短信 PDFs
did not need it. Text was extracted in `-raw` and `-table` modes. `-layout` was not used.

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書 第102期（自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月18日. Confirmed as the latest filed: Honda's IR page「有価証券報告書」(https://global.honda/jp/investors/library/report.html) lists 2026年3月期(第102期) first, and its only later filing is the 半期報告書 for the same year | https://data.swcms.net/file/honda-ir/dam/jcr:8d6844e8-cedd-4471-aa18-8803e1320434/S100YDD9.pdf | 1, 2, 4, 5, 6, 11, 12, 13, 39, 40, 41, 48, 49, 50, 52, 53, 54, 57, 58, 59, 60, 61, 62, 67, 138, 139, 140 |
| `tanshin-2026` | 2026年3月期 決算短信〔IFRS〕(連結), dated 2026年5月14日 on its first page (the file name carries 20260513) | https://data.swcms.net/file/honda-ir/dam/jcr:eec4b62c-e0ac-4ac7-904f-2d57261c6f75/140120260513531560.pdf | PDF p.1 |
| `yuho-2025` | 有価証券報告書 第101期, 提出日 2025年6月18日 | https://data.swcms.net/file/honda-ir/dam/jcr:7db333d2-51a0-4ce5-82b8-d692492d15ba/S100VYOD.pdf | 1, 2 |
| `yuho-2022` | 有価証券報告書 第98期, 提出日 2022年6月22日 | https://global.honda/jp/investors/library/report/main/02/teaserItems3/0/linkList/0/link/FY202203_yuho_j.pdf | PDF p.5 |
| `official-history-digest` | 公式企業サイト「ヒストリー チャレンジの軌跡｜企業情報」(no page date shown) | https://global.honda/jp/guide/history-digest/ | decade leads for the 1950s, 1960s and 2020s |
| `official-history-1950s` | 「1950年代 チャレンジの軌跡｜ヒストリー｜企業情報」 | https://global.honda/jp/guide/history-digest/1950/ | lead, featured products, timeline rows 1948, 1953, 1959 |
| `official-history-1960s` | 「1960年代 チャレンジの軌跡｜ヒストリー｜企業情報」 | https://global.honda/jp/guide/history-digest/1960/ | lead, timeline row 1963 |
| `official-history-2010s` | 「2010年代 チャレンジの軌跡｜ヒストリー｜企業情報」 | https://global.honda/jp/guide/history-digest/2010/ | featured item「HondaJet（2015年）」 |
| `official-power-products` | 「パワープロダクツ｜Honda公式サイト」(パワープロダクツ製品サイト, © Honda Motor Co., Ltd.) | https://www.honda.co.jp/power/ | 製品カテゴリー list |

Consulted but not cited in the entry:
- 2027年3月期 第1四半期決算短信〔IFRS〕(連結), 2026年8月5日 — https://data.swcms.net/file/honda-ir/dam/jcr:bd619e88-b049-4e52-aca6-670ab3081b20/140120260804508592.pdf — PDF p.3 and p.12. Read only to confirm that no segment reorganisation took effect after year-end (see Segment ordering).
- History-digest pages for the 1970s, 1980s and 2020s (`…/1970/`, `…/1980/`, `…/2020/`). Read when choosing events; nothing from them is in the entry.

Timeline years on the history-digest pages are images; the year sits in the image's `alt` attribute
(e.g. `<img src="./images/year_3.png" alt="1953">`), so a plain text dump loses it. Each timeline row
used here was matched to the last `alt="YYYY"` before it in the HTML, with a script. Results:
本田技研工業株式会社を設立 → 1948; 汎用エンジンH型を発売 → 1953; 米国ロサンゼルスに初の海外現地法人アメリカン・ホンダ・モーター（AH）設立 → 1959;
スーパーカブC100 米国輸出開始 → 1959; 耕うん機F150発売 → 1959; 軽トラックT360を発売（ホンダ初の四輪製品）→ 1963.
The 1948 and 1953 rows were also checked by eye in the raw HTML.

## Financials

Source table: `yuho-2026` p.2「１【主要な経営指標等の推移】(1) 連結経営指標等」, 回次 第98期–第102期.
Row labels as printed: **売上収益** and **親会社の所有者に帰属する当期利益(△損失)**. The second label wraps
across two lines as「親会社の所有者に帰属する／当期利益(△損失)」. The parentheses are the ASCII characters
U+0028/U+0029 in the extract. Unit (百万円). Stored value = printed × 1,000,000.

| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (第98期) | 14,552,696 百万円 → 14,552,696,000,000 円 | 707,067 百万円 → 707,067,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 and in the original filing yuho-2022 PDF p.5 (column「2021年度 (自 2021年４月１日 至 2022年３月31日)」) | n/a |
| 2023年3月期 (第99期) | 16,907,725 百万円 → 16,907,725,000,000 円 | 651,416 百万円 → 651,416,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 | n/a |
| 2024年3月期 (第100期) | 20,428,802 百万円 → 20,428,802,000,000 円 | 1,107,174 百万円 → 1,107,174,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 | n/a |
| 2025年3月期 (第101期) | 21,688,767 百万円 → 21,688,767,000,000 円 | 835,837 百万円 → 835,837,000,000 円 | IFRS | yuho-2026 p.2; identical in yuho-2025 p.2 | Matches tanshin-2026 prior-year row: 21,688,767 / 835,837 |
| 2026年3月期 (第102期) | 21,796,610 百万円 → 21,796,610,000,000 円 | △423,941 百万円 → −423,941,000,000 円 | IFRS | yuho-2026 p.2 | **Matches** tanshin-2026 PDF p.1: 売上収益 21,796,610 百万円, 親会社の所有者に帰属する当期利益 △423,941 百万円. No difference |

**Restatements: none found.** All four overlapping years in yuho-2025 equal yuho-2026. The 2022年3月期 figures in the
original 2022 filing equal both later filings. yuho-2025 printed the net-income label without「(△損失)」
(「親会社の所有者に帰属する当期利益」), and the 2026 filing added it for the loss year. Only the label changed, not the values.

**Scope.** The 2026 filing makes no restatement and no discontinued-operations split in this table. The
2027年3月期 1Q 短信 PDF p.3 states「連結範囲の重要な変更：無」. `revenueBasis`/`netIncomeBasis` are omitted.

**Script verification (2026-09-15).** A Node script, `check.mjs` in the scratchpad, did three things:
(1) parsed the 売上収益 row and the 親会社の所有者に帰属する当期利益 row from p.2 (yuho-2026, yuho-2025) and PDF p.5 (yuho-2022) in both `-raw` and `-table` extracts, and confirmed the two modes give identical number arrays for all three filings. The regex requires the next line to start with 当期利益, so the 当期包括利益 row could not be picked up.
(2) parsed tanshin-2026 PDF p.1 rows「2026年3月期」and「2025年3月期」.
(3) checked printed × 1,000,000 === stored value for all 10 stored values against every document that prints them: 14 comparisons, all OK.
The `-table` extract of the 短信 confirms the column order: 売上収益 / 営業利益 / 税引前利益 / 当期利益 / 親会社の所有者に帰属する当期利益 / 当期包括利益合計額.

Accounting standard: yuho-2026 p.2 (注)1「当社は、国際会計基準(以下「IFRS」という。)に準拠して連結財務諸表を作成しています。」
yuho-2022 PDF p.5 carries the same note for its five columns (2017年度–2021年度). All five years here are IFRS,
and no year appears under two standards.

Not used: 当期利益 (including non-controlling interests) for 2026年3月期 is △353,023 百万円, and for 2025年3月期 it is 903,034 百万円
(tanshin-2026 PDF p.1). The protocol requires the parent-attributable figure.

2026年3月期 `note` →
- yuho-2026 p.12「一部のEVモデルの上市および開発中止…を決定してきました。さらに、2026年３月12日に、四輪電動化戦略の見直しを行い…これにより、四輪事業では…損失および費用を認識」「これらのEV関連損失」.
- p.39「税引前損失は、EV関連損失の影響などにより…親会社の所有者に帰属する当期損失は、4,239億円」.
- p.11「EV(電気自動車)」.
The loss amount 1兆5,778億円 (p.12) is recorded here only.

## Segment ordering

`yuho-2026` p.139「４ セグメント情報 (1) 事業の種類別セグメント情報」当連結会計年度, 単位：百万円.
Ordered by 売上収益 計. Ordering by 外部顧客 gives the same order.

| Segment | Segment revenue (as printed) | Document · page |
|---|---|---|
| 四輪事業 | 計 14,166,910 (外部顧客 13,863,362) | yuho-2026 p.139 |
| 二輪事業 | 計 4,018,837 (外部顧客 4,018,837) | yuho-2026 p.139 |
| 金融サービス事業 | 計 3,532,743 (外部顧客 3,529,484) | yuho-2026 p.139 |
| パワープロダクツ事業及びその他の事業 | 計 420,376 (外部顧客 384,927) | yuho-2026 p.139 |

Segment 営業利益(△損失), 2026年3月期 (used for the business-model profit step and the 1949 history line, as a
ranking only): 二輪 731,926 / 四輪 △1,411,140 / 金融サービス 275,532 / パワープロダクツ及びその他 △10,664 百万円 —
yuho-2026 p.139. So 二輪 is largest, 金融サービス is second, and 四輪 and パワープロダクツ及びその他 are losses.
Prior year for reference (p.138): 計 3,626,603 / 14,467,856 / 3,512,223 / 414,610; 営業利益 663,443 / 243,853 / 315,634 / △9,444.

Structure definition: p.138「経営組織の形態と製品およびサービスの特性に基づいて４つに区分されています。二輪事業・四輪事業・金融サービス
事業の報告セグメントに加え、それ以外の事業セグメントをパワープロダクツ事業及びその他の事業として結合表示しています。」

**Post-year-end reorganisation: none.**
- yuho-2026 p.57 does describe an organisational change effective 2026年4月1日: R&D functions of 四輪開発本部 and SDV事業開発統括部 moved to ㈱本田技術研究所, and the electric and ICE functions in 二輪・パワープロダクツ were integrated. This is an internal organisation change. The 有報 does not announce any change of reportable segments.
- The 2027年3月期 1Q 短信 PDF p.12 uses the same four-segment definition and the same columns (二輪事業 / 四輪事業 / 金融サービス事業 / パワープロダクツ事業及びその他の事業).

## Claims

### Identity

- `code` 7267 → tanshin-2026 PDF p.1「コード番号 7267」; the 1Q 短信 gives the same.
- `officialName` 本田技研工業株式会社 → yuho-2026 p.1【会社名】.
- `nameEn` HONDA MOTOR CO., LTD. → yuho-2026 p.1【英訳名】.
- `listings` tse プライム → yuho-2026 p.67「② 【発行済株式】」上場金融商品取引所名欄「東京証券取引所プライム市場 ニューヨーク証券取引所」, (注)「ADR(米国預託証券)をニューヨーク証券取引所に上場しています。」 tanshin-2026「上場取引所 東」 agrees on the domestic listing. The p.1 cover gives only【縦覧に供する場所】株式会社東京証券取引所.
- `shortNameEn` HONDA → see Gaps and judgement calls.
- `description` →
  - バイクと自動車を中心に: the two largest segments by revenue (p.139); 二輪車 and 四輪車 are their main products (p.138).
  - 発電機や芝刈機: official-power-products 製品カテゴリー「発電機」「芝刈機」; yuho-2026 p.53 芝刈機 and p.61 乗用芝刈機 under パワープロダクツ事業.
  - 世界で販売: p.40–41 unit sales by region, 日本・北米・欧州・アジア・その他.
  - ローンやリース: p.52「顧客に対する金融サービス(小売金融、オペレーティング・リースおよびファイナンス・リース)」.
- `industries` automotive (primary) → 四輪 and 二輪 are the two largest segments (p.139). finance → 金融サービス事業 is a reportable segment (p.138).

### Businesses

- **Structure is flat.** Four top-level nodes, one per column of p.138–139. No `children` (see Gaps).
- **四輪事業**
  - description → p.138「四輪車、関連部品｜研究開発・生産・販売・その他」; p.50 categories「パッセンジャーカー(セダン・コンパクト等)」「ライトトラック(SUV・ミニバン等)」「軽自動車」.
  - products → p.50「四輪事業における主要な製品」 (a subset; see Gaps).
- **二輪事業**
  - description → p.138「二輪車、ATV、Side-by-Side、関連部品｜研究開発・生産・販売・その他」.
  - 「地域別の連結売上台数は、インドを含むアジアが最も多く」 → p.40 table, 連結売上台数 2026年3月期 (千台): 日本 205 / 北米 538 / 欧州 407 / アジア 11,310 / その他 2,213. p.49 discusses India under the アジア heading (「最大市場のインド」「インドにおける「Activa」シリーズ」).
  - products →
    - 「スーパーカブ50」 p.48
    - 「PCX」 p.49
    - 「Activa」シリーズ (India) p.49
    - 「CB1000F」 p.58
    - 「ICON e:」 p.59「電動二輪パーソナルコミューター「ICON e:」」
- **金融サービス事業**
  - description → p.52「製品販売のサポートを主な目的として、日本・米国・カナダ・英国・ドイツ・ブラジル・タイにある金融子会社を通じて、顧客に対する金融サービス(小売金融、オペレーティング・リースおよびファイナンス・リース)および販売店に対する金融サービス(卸売金融)を提供」.
  - products and customers → the same sentence. The glosses「お客様へのローン」「販売店への融資」 restate 顧客に対する小売金融 and 販売店に対する卸売金融.
- **パワープロダクツ事業及びその他の事業**
  - description and products:
    - 発電機・耕うん機・除雪機・芝刈機 → official-power-products 製品カテゴリー.
    - 船外機・除雪機・芝刈機 → yuho-2026 p.61 under「パワープロダクツ事業では」(「BF300」船外機, ハイブリッド除雪機「HSS960i」「HSS1370i」, 電動乗用芝刈機「ProZision」).
    - OEM向けエンジン → p.53「OEM向けエンジン(注) 相手先ブランドで販売される商品に搭載されるエンジン」.
    - 航空機 → p.41 and p.53「パワープロダクツ事業及びその他の事業に含まれる航空機および航空機エンジン」; p.61「HondaJet」.
    - 「小型ビジネスジェット機」 → official-history-digest 2020s item「小型ビジネスジェット機の常識を覆し…HondaJet」. p.61 calls it「ベリーライトジェットカテゴリー内のツインエンジンジェット機」.

### Business model

- description →
  - p.54「主に二輪車、四輪車およびパワープロダクツの製造販売を行うとともに、製品の販売をサポートするために、顧客および販売店に対する金融サービスを提供しています」.
  - p.138 事業形態「研究開発・生産・販売」.
- products → p.138 主要製品およびサービス; p.41/53 航空機; official-power-products categories.
- customers →
  - お客様・販売店: p.52, p.54.
  - OEM向けエンジン の相手先: p.53 (注).
- revenueSources → p.140「(2) 製品およびサービスに関する情報」 rows: 二輪車、ATV、Side-by-Side、関連部品 4,018,837 / 四輪車、関連部品 15,327,187 / 金融 2,065,659 / パワープロダクツ、関連部品 281,311 / その他 103,616 (百万円). The 金融 line's「ローン、リースなど」 → p.52「オペレーティング・リース売上」「リース車両売却売上」. The「その他」 row was not listed: the 有報 does not say what it contains.
- flow company → p.5「当社および国内外346社の関係会社(連結子会社282社、持分法適用会社64社)により構成され、事業別には、二輪事業、四輪事業、金融サービス事業およびパワープロダクツ事業及びその他の事業からなっています」. p.5 prints no 基準日, so the line is attributed to「2026年3月期の有価証券報告書」.
- flow offering → p.138, p.52, p.61 (HondaJet).
- flow customer →
  - 連結売上台数: 二輪 1,467万３千台 (p.48), 四輪 271万１千台 (p.50), パワープロダクツ 358万９千台 (p.53).
  - 「所在地別では米国が最も大きい」 → p.140「(3) 地域に関する情報」当連結会計年度 売上収益: 日本 2,882,484 / 米国 11,160,904 / その他 7,753,222 百万円. 米国 exceeds even the aggregated その他.
- flow revenue → p.140 (product/service rows include 金融); ranking by p.139 計.
- flow profit → p.139 segment 営業利益(△損失) (figures above); p.40「四輪事業の…営業損失は…EV関連損失の影響や関税影響などにより」; p.41 パワープロダクツ及びその他 営業損失.

### History

- **1948 本田技研工業株式会社を設立**
  - description → yuho-2026 p.4「1946年10月 本田宗一郎が静岡県浜松市に本田技術研究所を開設、内燃機関および各種工作機械の製造ならびに研究に従事」「1948年９月 本田技術研究所を継承して本田技研工業株式会社を設立」; official-history-1950s timeline 1948「本田技研工業株式会社を設立 創業者：本田宗一郎」.
  - significance → official-history-1950s lead「従業員34人、資本金100万円。浜松の小さな町工場からのスタートであった。」; yuho-2026 p.5「国内外346社の関係会社」.
- **1949 二輪車の生産を開始**
  - description → p.4「1949年８月 二輪車生産開始」; official-history-1950s featured item「ドリームD型（1949年）」 and timeline「初の本格的オートバイ ドリームD型生産・販売」.
  - significance → p.138 (four segments; 二輪車 is the first listed 主要製品 of 二輪事業); p.139 (二輪事業 has the largest segment 営業利益).
- **1952 パワープロダクツの生産を開始**
  - description → p.4「1952年 ９月 パワープロダクツ生産開始」; official-history-1950s timeline 1953「汎用エンジンH型を発売」; official-history-digest「耕うん機 F150（1959年）」「Honda初の耕うん機」 (timeline row 1959「耕うん機F150発売」).
  - significance → p.53, p.61 (OEM向けエンジン, 船外機 under パワープロダクツ事業); official-power-products categories 発電機・耕うん機・汎用エンジン, which is what ties 汎用エンジン and 耕うん機 to パワープロダクツ.
- **1959 アメリカに初の海外現地法人を設立**
  - description → p.4「1959年６月 米国にアメリカンホンダモーターカンパニー・インコーポレーテッドを設立」; official-history-1950s timeline 1959「米国ロサンゼルスに初の海外現地法人アメリカン・ホンダ・モーター（AH）設立」「スーパーカブC100 米国輸出開始」; text「1959年に海外初の販売現地法人であるアメリカン・ホンダ・モーターを設立し、自ら販売網の構築に着手した」.
  - significance → p.5–6: アメリカンホンダモーターカンパニー・インコーポレーテッド is listed as a main company (連結子会社) for 北米 under 二輪事業, 四輪事業 and パワープロダクツ事業及びその他の事業; p.140 所在地別売上収益 (米国 largest).
- **1963 四輪車の生産を開始**
  - description → p.4「1963年６月 四輪車生産開始」; official-history-1960s timeline 1963「軽トラックT360を発売（ホンダ初の四輪製品）」; official-history-digest and 1960s lead「1963年ついに初の軽四輪トラックT360を発表。四輪メーカーとしてのスタートをきった。」
  - significance → p.139 (四輪事業 計 is the largest).
- **1980 米国にアメリカンホンダファイナンスを設立**
  - description → p.4「1980年２月 米国にアメリカンホンダファイナンス・コーポレーションを設立」.
  - significance → p.6: listed as a main company (連結子会社) of 金融サービス事業 in 北米; p.52 (purpose of the financial services business).
- **2015 HondaJetの引き渡しを開始**
  - description and year → official-history-2010s「HondaJet（2015年）」「1986年にスタートした航空機の研究は、30年近くを経た2015年、米国連邦航空局から型式証明を取得し、米国でのデリバリーを開始するに至った。」
  - significance → yuho-2026 p.41 / p.53「パワープロダクツ事業及びその他の事業に含まれる航空機および航空機エンジン」.
- **2026 四輪電動化戦略を見直し**
  - description → p.11「米国での化石燃料に対する規制の緩和やEV補助金の見直しなどにより、EV市場の拡大スピードが鈍化」; p.12「2026年３月12日に、四輪電動化戦略の見直しを行い、上記に加えて北米で生産予定であったEVモデルの上市および開発中止などを決定」.
  - significance → p.12「これらのEV関連損失」; p.39 (当期損失); p.13 and p.54「2029年３月期までの３年間においては、投入資源を当初のEV向けからハイブリッド車へシフト」.

## Gaps and judgement calls

No value is `null`. No unverified claim remains. Status: `published`.

1. **`name` = 本田技研工業, not ホンダ.** The protocol's pattern and every existing entry use the 商号 without 株式会社 (トヨタ自動車, ソニーグループ, 任天堂). The familiar name appears through `shortNameEn` HONDA. If the lead prefers ホンダ as the display name, it is a one-field change. The official history pages use「ホンダ」throughout, so that name is sourced too.
2. **`shortNameEn` = "HONDA".** Dropping only the legal suffix from「HONDA MOTOR CO., LTD.」would give "HONDA MOTOR". I used "HONDA", following the Toyota precedent (TOYOTA from TOYOTA MOTOR CORPORATION). The 有報 itself uses "Honda" as the group and brand name (p.40「Hondaグループ販売台数」, p.58「Hondaを代表するプロダクトブランド」, p.60「Honda車」), and no other listed company goes by that wordmark.
3. **`netIncomeLabel` includes「(△損失)」 on all five years.** It is the row label printed in the 2026 filing's table, which the protocol names as the source. The Sony entry does the same with「（損失）」. The parentheses are kept as the ASCII characters the extract contains. The Sony entry uses full-width parentheses from a differently typeset PDF. No page image was checked, so whether the glyphs render full-width in the PDF is unverified. It does not change the wording.
4. **Foreign listing.** yuho-2026 p.67 also lists ニューヨーク証券取引所 (ADR). `Listing.exchange` covers Japanese exchanges only, so `listings` holds Tokyo プライム alone. The Toyota entry handles foreign listings the same way.
5. **パワープロダクツ事業及びその他の事業 is included as a top-level business** although p.138 says it is not itself a reportable segment: it is「それ以外の事業セグメント」 presented combined. It is one of the four columns Honda prints in its segment table, and Honda says what it contains (パワープロダクツ, 関連部品, その他; aircraft and aircraft engines per p.41/53). It is included as the protocol allows for an "other" segment the company describes.
6. **No `children`.** Considered and rejected:
   - (a) パワープロダクツ vs 航空機 inside the combined segment. Honda reports the aircraft business's operating result separately in MD&A (p.41). But p.140 shows a further「その他」 product row that no document itemises, so two children would present an incomplete breakdown as a complete one. Aircraft is named in the segment's description instead.
   - (b) 四輪 categories パッセンジャーカー / ライトトラック / 軽自動車 (p.50). These are sales categories, not businesses.
   - (c) 二輪 products 二輪車 / ATV / Side-by-Side. The 有報 gives no revenue or description for them separately.
7. **Product lists are subsets.**
   - 四輪: p.50 lists ACCORD, CITY, CIVIC, FIT, CR-V, FREED, ZR-V, ODYSSEY, PASSPORT, PILOT, VEZEL, N-BOX. Eight were kept, in the 有報's Latin spelling. I did not add katakana names (シビック etc.), because no document read here prints them.
   - 二輪: model names are those the MD&A and R&D sections mention; the 有報 prints no「主要な製品」 list for 二輪.
   - ATV and Side-by-Side are left as printed. No document read here explains them in Japanese, so the entry does not define them.
8. **`customers` omitted for 四輪事業, 二輪事業 and パワープロダクツ.** The 有報 names 顧客 and 販売店 for the group as a whole (p.54) and explicitly for 金融サービス (p.52). It does not describe the sales channel per product segment, e.g. whether vehicles are sold to dealers or directly, so no per-segment customer list was written.
9. **Financial and share figures kept off the page (invariant 4).** Segment 営業利益, the EV-related loss amount (1兆5,778億円), and the regional revenue amounts are in this log only. The entry states rankings (largest revenue: 四輪; largest profit: 二輪; largest region: 米国) and that two segments made losses. Unit sales volumes are shown, as in the Toyota entry. No share or percentage was derived for the page.
10. **History selection (8 events).** Supportable events left out for the 5–8 limit:
    - 1957 東証上場
    - 1958 スーパーカブC100 発売
    - 1960 本田技術研究所の分離
    - 1977 NYSE ADR上場
    - 1978 ホンダオブアメリカマニュファクチュアリング設立 and 1982 US production of the Accord (official-history-1980s timeline)
    - 1999 ホンダクレジット設立
    - 2022 ソニー・ホンダモビリティ合弁契約 (official-history-2020s timeline)

    No event is labelled "the origin of" the financial services business, because no source says so. 1980 is the earliest finance company in the 沿革, but the 沿革 does not call it the first.
11. **1952 vs 1953 for power products.** The 有報 沿革 gives「1952年９月 パワープロダクツ生産開始」. The official timeline's first 汎用 product row is 1953「汎用エンジンH型を発売」. Both are stated: 1952 is the event year (production start), and 1953 is given as a launch within the description.
12. **2026 event included** because Honda's own 有報 states it with a date (p.12) and it explains the loss year in the chart. Only the decisions and plans the 有報 states are written; nothing about motives beyond p.11's stated market reasons.
13. **Nissan business-integration talks (2024–2025) not included.** Neither yuho-2026 nor yuho-2025 mentions 日産 (text search of both extracts returned nothing), and no Honda document read here states it.
14. **Not consulted:** 統合報告書 (Honda Report). The 有報 sections above were sufficient for every claim. I did not check whether a 2026 edition exists.
15. **Extraction limits.** No page image was rendered. Every financial value was confirmed in two independent pdftotext modes and across three filings plus the 短信. The CMap problem described at the top affected labels, not digits. Even so, no label or value was read from the garbled first extraction.
16. **Dates.** `accessedAt` and `updatedAt` are 2026-09-15, the day every document was downloaded and read. The history-digest pages and the power-products page show no publication date, so `publishedAt` is omitted for them. The 短信's `publishedAt` is the date printed on its first page (2026-05-14), not the date in its file name (20260513).
