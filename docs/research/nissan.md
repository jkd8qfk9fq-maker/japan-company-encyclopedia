# 日産自動車 — research log

Researched: 2026-09-15 (documents downloaded, read, entry written and verified the same day)

**Page numbers.** All five 有価証券報告書 are Nissan's own "EDINET data with 目次 and 頁" print (cover note PDF p.2).
Pages cited as `p.N` are the printed page markers「― N ―」. In every one of them **PDF page index = printed page + 3**
(cover, note and 目次 come first; checked for `yuho-2026` and `yuho-2025` on the cover page and table page, and for
2022–2024 on the table page). For the 決算短信, `PDF p.1` is the summary page; later pages carry a printed footer
「- N -」 with PDF index = N + 2.

**Extraction note (read before re-verifying).** Text was extracted with the xpdf Japanese language pack
(`pdftotext -cfg <scratchpad xpdfrc> -enc UTF-8`), in `-raw` and `-table` modes; `-layout` was not used. Every
extraction ran with zero errors, and the Japanese labels were checked as legible before any label was read (e.g.
the cover page reads「【会社名】 日産自動車株式会社」「【英訳名】 NISSAN MOTOR CO., LTD.」). The official history pages
were fetched as HTML and reduced to text; on these pages the year and month are plain text lines (「1966年」「8月」)
before each timeline row, so each row was matched to the last year/month line before it with a script (`tl.sh` in
the scratchpad). No page image was rendered.

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 有価証券報告書 第127期（自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月22日. Confirmed as the latest filed: the IR page「2025年度」(https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/2025/) links it as 有価証券報告書 in the 年度 column; the「2026年度」page has only 1Q materials, with the 有価証券報告書/半期報告書 links commented out | https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/ASSETS/FR/2025/PDF/fr2025.pdf | cover p.1; 2, 4, 5, 6, 7, 11, 12, 13, 14, 33, 34, 35, 38, 41, 42, 43, 45, 86, 90, 96, 99, 106, 107, 112, 134, 135, 138, 139, 142, 147 |
| `tanshin-2026` | 2026年３月期 決算短信〔日本基準〕(連結), dated 2026年５月13日 on PDF p.1 | https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/ASSETS/DATA/2025/20254th_financialresult_792_j.pdf | PDF p.1 |
| `tanshin-2027-1q` | 2027年３月期 第１四半期決算短信〔日本基準〕(連結), dated 2026年８月３日 | https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/ASSETS/DATA/2026/20261st_financialresult_172_j.pdf | PDF p.1; PDF p.2 (連結範囲); printed p.10 (セグメント情報) |
| `yuho-2025` | 有価証券報告書 第126期, 提出日 2025年6月23日 | https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/ASSETS/FR/2024/PDF/fr2024.pdf | 1, 2, 15, 37, 55 |
| `yuho-2024` | 有価証券報告書 第125期, 提出日 2024年6月28日 | https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/ASSETS/FR/2023/PDF/fr2023.pdf | 1, 2 |
| `yuho-2023` | 有価証券報告書 第124期, 提出日 2023年6月30日 | https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/ASSETS/FR/2022/PDF/fr2022.pdf | 1, 2 |
| `yuho-2022` | 有価証券報告書 第123期, 提出日 2022年6月30日 | https://www.nissan-global.com/JP/IR/FINANCIAL_RESULTS/ASSETS/FR/2021/PDF/fr2021.pdf | 1, 2 |
| `official-heritage-1930s` | 「1930年代 \| 会社情報 \| 日産自動車企業情報サイト」(会社と製品の歴史; no page date shown) | https://www.nissan-global.com/JP/COMPANY/PROFILE/HERITAGE/1930/ | lead; rows 1933年12月, 1934年6月 |
| `official-heritage-1950s` | 「1950年代 \| 会社情報 \| 日産自動車企業情報サイト」 | https://www.nissan-global.com/JP/COMPANY/PROFILE/HERITAGE/1950/ | lead; row 1958年6月 |
| `official-heritage-1990s` | 「1990年代 \| 会社情報 \| 日産自動車企業情報サイト」 | https://www.nissan-global.com/JP/COMPANY/PROFILE/HERITAGE/1990/ | lead; row 1999年3月 |
| `official-heritage-2000s` | 「2000年代 \| 会社情報 \| 日産自動車企業情報サイト」 | https://www.nissan-global.com/JP/COMPANY/PROFILE/HERITAGE/2000/ | row 2003年6月 |
| `official-heritage-2010s` | 「2010年代 \| 会社情報 \| 日産自動車企業情報サイト」 | https://www.nissan-global.com/JP/COMPANY/PROFILE/HERITAGE/2010/ | lead; rows 2010年10月, 2010年12月, 2016年5月, 2016年10月 |
| `official-heritage-2020s` | 「2020年代 \| 会社情報 \| 日産自動車企業情報サイト」 | https://www.nissan-global.com/JP/COMPANY/PROFILE/HERITAGE/2020/ | row 2025年5月 |
| `official-brands` | 「ブランド \| 会社情報 \| 日産自動車企業情報サイト」 | https://www.nissan-global.com/JP/COMPANY/BRANDS/ | Nissan / INFINITI blocks |

Consulted but not cited in the entry:
- 「＜2026年度 第１四半期決算 参考資料＞」(`…/2026/20261st_summary_338_j.pdf`). Downloaded first because its file name says "summary"; it is a reference sheet, not the 決算短信, so it was discarded.
- Official pages「会社と製品の歴史」top (`/JP/COMPANY/PROFILE/HERITAGE/`), 1960年代 (`…/1960/`), 1980年代 (`…/1980/`), and「経営再建計画「Re:Nissan」」(`/JP/COMPANY/PLAN/RENISSAN/`). Read when choosing events; nothing from them is in the entry.

## Financials

Source table: `yuho-2026` p.2「１【主要な経営指標等の推移】(1) 連結経営指標等」, 回次 第123期–第127期, 決算年月 2022年３月–2026年３月.
Row labels as printed: **売上高** and **親会社株主に帰属する当期純利益又は親会社株主に帰属する当期純損失（△）**. The second label
wraps over three lines as「親会社株主に帰属する当期純／利益又は親会社株主に帰属す／る当期純損失（△）」; the stored label joins them
with no characters added. The parentheses are the full-width （ ） in the extract. Unit (百万円). Stored value = printed × 1,000,000.

| fiscalYear | revenue (as printed, unit) | netIncome (as printed, unit) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (第123期) | 8,424,585 百万円 → 8,424,585,000,000 円 | 215,533 百万円 → 215,533,000,000 円 | J-GAAP | yuho-2026 p.2; identical in yuho-2025, yuho-2024, yuho-2023 p.2 and the original filing yuho-2022 p.2 | n/a |
| 2023年3月期 (第124期) | 10,596,695 百万円 → 10,596,695,000,000 円 | 221,900 百万円 → 221,900,000,000 円 | J-GAAP | yuho-2026 p.2; identical in yuho-2025, yuho-2024 and the original filing yuho-2023 p.2 | n/a |
| 2024年3月期 (第125期) | 12,685,716 百万円 → 12,685,716,000,000 円 | 426,649 百万円 → 426,649,000,000 円 | J-GAAP | yuho-2026 p.2; identical in yuho-2025 and the original filing yuho-2024 p.2 | n/a |
| 2025年3月期 (第126期) | 12,633,214 百万円 → 12,633,214,000,000 円 | △670,898 百万円 → −670,898,000,000 円 | J-GAAP | yuho-2026 p.2; identical in the original filing yuho-2025 p.2 | Matches tanshin-2026 PDF p.1 prior-year row: 12,633,214 / △670,898 |
| 2026年3月期 (第127期) | 12,007,888 百万円 → 12,007,888,000,000 円 | △533,095 百万円 → −533,095,000,000 円 | J-GAAP | yuho-2026 p.2 | **Matches** tanshin-2026 PDF p.1: 売上高 12,007,888 百万円, 親会社株主に帰属する当期純利益 △533,095 百万円. No difference |

**Restatements: none found.** Each year's figures were compared across every filing that prints them (five 有報): all identical.
The net-income label is also identical in all five filings (the parser requires the exact three-line label shape and matched it in each).

**Accounting standard.** J-GAAP for all five years, no change of standard:
- yuho-2026 p.86「当社の連結財務諸表は、「連結財務諸表の用語、様式及び作成方法に関する規則」…に基づいて作成している。」 and p.33「わが国において一般に公正妥当と認められている会計基準に基づき作成している。」
- tanshin-2026 and tanshin-2027-1q titles carry「〔日本基準〕」.
- The same「連結財務諸表規則…に基づいて作成している」 sentence appears in yuho-2022 (PDF p.72), yuho-2023 (PDF p.81), yuho-2024 (PDF p.89) and yuho-2025 (PDF p.91). None of the five filings mentions 指定国際会計基準.
- yuho-2025 p.2 (注)1: 収益認識に関する会計基準 applied from the start of 第123期 (2022年3月期). All five stored years are after that change, so it does not split this series. (It separates 2021年3月期, which is not in the entry.)

**Scope.** No discontinued-operations split or retroactive restatement in the p.2 table. Perimeter changes during 2026年3月期 are ordinary
disposals (yuho-2026 p.96: ルノー日産オートモーティブインディア社他４社 excluded after share transfers; 沿革 p.6: 2025年7月 India, 2025年8月 Indonesia).
Nissan does not re-present prior years for them. `revenueBasis`/`netIncomeBasis` are omitted.

**Script verification (2026-09-15).** `check.mjs` in the scratchpad:
1. Parsed the 決算年月, 売上高 and net-income rows from the「(1) 連結経営指標等」page of all five 有報, in both `-raw` and `-table` extracts. The two modes gave identical year and number arrays for all five filings. In `-raw` the value line must directly follow the three-line label, so the 包括利益 row (next row, own label) cannot be picked up.
2. Parsed tanshin-2026 PDF p.1 rows「2026年３月期」「2025年３月期」 in both modes. Column order per the header: 売上高 / ％ / 営業利益 / ％ / 経常利益 / ％ / 親会社株主に帰属する当期純利益 / ％. Raw and table agree.
3. Checked printed × 1,000,000 === stored value, and that the stored value is a safe integer, against every document that prints it: **34 comparisons, all OK**. Every `sourceIds` entry resolves to `sources`.

(A first run reported 2 mismatches against the 短信. The cause was a script bug: its number regex split decimals such as「△4.9」 into two numbers, so the column index pointed at 経常利益. After the regex was fixed, all 34 comparisons matched. No stored value was changed.)

Not used: 当期純損失 including non-controlling interests, yuho-2026 p.90 連結損益計算書: △660,085 (2025年3月期) / △526,666 (2026年3月期) 百万円.

**Loss-year notes.**
- 2025年3月期 → yuho-2025 p.37「ｄ．特別損益 連結特別損益は6,238億円の損失となり…これは主に、減損損失及びリストラクチャリング費用の計上によるものである。」 The 2026 P&L (yuho-2026 p.90) shows why that decides the sign: 経常利益 210,168 (yuho-2026 p.2) → 特別損失合計 646,571 → 税金等調整前当期純損失 △413,618 百万円. "設備などの資産の価値を引き下げる" glosses yuho-2026 p.106「帳簿価額を回収可能価額まで減額し、減損損失を特別損失に…計上」, whose 2025年3月期 assets are「機械装置及び運搬具等」.
- 2026年3月期 → yuho-2026 p.34「ｂ．営業利益 連結営業利益は580億円」「ｄ．特別損益 連結特別損益は4,415億円の損失」. p.90 特別損失: 減損損失 366,247 (the largest item) / 特別退職加算金 85,048 / その他 100,140 / 固定資産廃棄損 21,610 / 固定資産売却損 3,793; 合計 576,838 百万円. 経常利益 1,081 → 税金等調整前当期純損失 △440,380. The「など」 covers 営業外損益 (p.34: 569億円の損失, mainly 持分法による投資損失) and 法人税等 86,286.
- "2年続けて" is **derived** from the p.2 table (two consecutive negative years).
- The impairment amounts are recorded here only.

## Segment ordering

`yuho-2026` p.138「４ 報告セグメントごとの売上高、利益又は損失…」当連結会計年度, 単位：百万円. Ordered by 売上高 計. Ordering by 外部顧客への売上高 gives the same order.
Both modes agree (`-table` PDF p.141:「計 10,920,106 1,318,002 12,238,108 △230,220 12,007,888」).

| Segment | Segment revenue (as printed) | Document · page |
|---|---|---|
| 自動車事業 | 計 10,920,106 (外部顧客 10,760,298) | yuho-2026 p.138 |
| 販売金融事業 | 計 1,318,002 (外部顧客 1,247,590) | yuho-2026 p.138; same figures in tanshin-2026 printed p.17 |

Segment 利益又は損失 (営業利益ベース, p.134), 2026年3月期: 自動車事業 △292,890 / 販売金融事業 297,942 百万円 (p.138). Used only for the
business-model profit step, as "販売金融 profit, 自動車 loss". Prior year (p.135): 計 11,645,478 / 1,262,081; セグメント利益 △267,979 / 285,647.

Structure definition: p.134「当社グループの事業は、製品及びサービスの特性に基づいて、自動車事業と販売金融事業に区分される。自動車事業は、自動車及び部品の
製造と販売を行っている。販売金融事業は、自動車事業の販売活動を支援するために、販売金融サービス及びリース事業を行っている。」

**Post-year-end reorganisation: none.**
- yuho-2026 p.134「３ 報告セグメントの変更等に関する事項」 covers only two estimate changes (software useful life, product warranty provision), not a change of segments.
- yuho-2026 p.147「(重要な後発事象) 該当事項なし。」
- tanshin-2027-1q printed p.10 uses the same two segments (自動車事業 / 販売金融事業), with「(注) １．各事業区分の主要製品等 (1) 自動車…乗用車、商用車、海外生産用部品等 (2) 販売金融…クレジット、リース等」. PDF p.2「連結範囲の重要な変更 ： 無」.

## Claims

### Identity

- `code` 7201 → tanshin-2026 PDF p.1「コード番号 7201」; tanshin-2027-1q PDF p.1 the same.
- `officialName` 日産自動車株式会社 → yuho-2026 p.1【会社名】.
- `nameEn` NISSAN MOTOR CO., LTD. → yuho-2026 p.1【英訳名】.
- `listings` tse プライム → yuho-2026 p.45「② 【発行済株式】」上場金融商品取引所名「東京証券取引所 プライム市場」 (the only exchange listed). tanshin-2026「上場取引所 東」 agrees. 沿革 p.6: 2022年4月 moved from 市場第一部 to プライム市場.
- `shortNameEn` NISSAN → see Gaps 2.
- `description` →
  - 自動車をつくって…販売: p.7「自動車及び部品の製造と販売を主な事業内容」.
  - 「日産」「インフィニティ」ブランド: official-brands (Nissan block; INFINITI block「日産自動車のプレミアムブランドであるINFINITI」); yuho-2026 p.41「インフィニティ「QX65」」.
  - 世界で: p.142 地域ごとの情報 (日本・北米・欧州・アジア・その他).
  - ローンやリース: p.112「当社製品を購入する顧客に提供する自動車ローンやリース」.
  - 57 characters.
- `industries` automotive (primary) → 自動車事業 is the larger segment (p.138). finance → 販売金融事業 is a reportable segment (p.134).

### Businesses

- **Structure is flat.** Two top-level nodes, one per reportable segment (p.134, p.138). No `children` (see Gaps 4).
- **自動車事業**
  - description → p.134「自動車及び部品の製造と販売」; tanshin-2027-1q p.10「乗用車、商用車、海外生産用部品等」; official-brands「プレミアムブランドであるINFINITI」.
  - products →
    - 日産リーフ（電気自動車）: p.41「EVでは、「日産リーフ」を発売した。３代目となる新型「日産リーフ」」.
    - 日産サクラ（軽の電気自動車）: p.41「軽自動車「日産サクラ」は2022年の発売以来、４年連続で国内における暦年電気自動車販売台数No.１」 (the ranking itself is not used).
    - ルークス: p.41「国内にて「日産リーフ」、「ルークス」を発売した」.
    - セントラ（北米）, インフィニティ QX65（北米）: p.41「海外では北米において「セントラ」、インフィニティ「QX65」」.
    - キャシュカイ（欧州）: p.41「欧州において第３世代「e-POWER」を搭載した「キャシュカイ」のマイナーチェンジモデルを発売」.
    - ローグ（北米）: p.41「北米に「ローグ」の投入を予定」 (e-POWER version); p.42 US-NCAP list includes「ローグ」, so it is sold in the US already.
    - 海外での生産に使う部品（海外生産用部品）: tanshin-2027-1q p.10. The gloss is a literal reading of the compound; no document defines it further.
- **販売金融事業**
  - description → p.134「自動車事業の販売活動を支援するために、販売金融サービス及びリース事業」; p.112「販売金融債権は当社製品を購入する顧客に提供する自動車ローンやリース、販売会社に提供する在庫金融や運転資金貸付などで構成」; p.139 (注)1「販売金融事業は株式会社日産フィナンシャルサービス(日本)、米国日産販売金融会社(米国)、日産ファイナンシャルサービス・メキシコ(メキシコ)、東風日産汽車金融有限公司(中国)他11社及びカナダ日産自動車会社の販売金融事業(カナダ)で構成」.
  - products, customers → p.112 (same sentence); tanshin-2027-1q p.10「クレジット、リース等」.

### Business model

- description → p.7「自動車及び部品の製造と販売を主な事業内容とし、さらに上記事業における販売活動を支援するために販売金融事業を行っている」; p.112.
- products → tanshin-2027-1q p.10 主要製品等; p.112.
- customers → p.112 (顧客, 販売会社).
- revenueSources → p.99 (収益認識)「販売金融事業における販売金融商品に係る利息収益は、利息相当額を契約期間にわたり認識…ファイナンス・リース取引に係る収益…オペレーティング・リース取引に係る収益」; 製品の販売 in the same note.
- flow company → p.96「(1) 連結子会社 226社」「２ 持分法の適用に関する事項 (1) 持分法適用会社 36社」 (当連結会計年度).
- flow offering → official-brands; p.134; tanshin-2027-1q p.10; p.112.
- flow customer →
  - 連結売上台数: p.33「ｄ．販売実績(連結売上)」合計 当連結会計年度 2,434,516台.
  - 北米が最も大きい: p.142「２ 地域ごとの情報 (1) 売上高」当連結会計年度 (顧客の所在地): 日本 1,741,604 / 北米 6,501,812 (内、米国 4,900,959) / 欧州 1,506,498 / アジア 556,324 / その他 1,701,650 / 合計 12,007,888 百万円.
- flow revenue → p.99; ranking from p.138 計.
- flow profit → p.138 segment figures (above); p.35「ｂ．販売金融事業…営業利益は2,979億円」「ａ．自動車事業…営業損失は2,929億円となり、米国関税及び為替変動影響の多くをコスト削減活動により相殺したものの」.

### History

- **1933 自動車製造株式会社として設立**
  - description → yuho-2026 p.4「1933年12月 「日本産業㈱」と「戸畑鋳物㈱」の共同出資により、「自動車製造㈱」として資本金10百万円をもって、横浜市神奈川区宝町に設立」「1934年６月 社名を「日産自動車㈱」と改称」; official-heritage-1930s lead「創業者の鮎川 義介は、ダット自動車製造によるダットサンの優秀性を見抜き、その製造権を譲り受けて大規模化すべく、日産自動車の前身にあたる「自動車製造株式会社」を1933年に設立」, rows 1933年12月「自動車製造（株）、資本金1,000万円で横浜市に設立、取締役社長に鮎川 義介就任」, 1934年6月「社名を日産自動車（株）と改称」.
  - significance → p.4「1934年５月 横浜工場完成」; p.43「２【主要な設備の状況】(1) 提出会社」 row 横浜工場, 神奈川県横浜市神奈川区及び鶴見区, 設備の内容「自動車部品製造設備」.
- **1958 乗用車のアメリカへの輸出を開始**
  - description → p.4「1958年５月 乗用車の対米輸出開始」「1960年９月 「米国日産自動車会社」設立」; official-heritage-1950s row 1958年6月「乗用車の対米輸出開始」.
  - significance → p.142 (北米 largest by customer location, figures above).
- **1981 米国日産販売金融会社を設立**
  - description → p.4「1981年11月 「米国日産販売金融会社」設立(現、連結子会社)」.
  - significance → p.139 (注)1 (listed as a constituent of 販売金融事業); p.112 (what the 販売金融 business provides).
- **1999 フランスのルノーと提携**
  - description →
    - p.5「1999年３月 フランス「ルノー」と資本参加を含む自動車事業全般にわたる提携契約締結」.
    - official-heritage-1990s lead「日産も、90年代後半の経営危機から、1999年3月にフランスのルノー社と戦略的な資本提携に踏み切ります」; row 1999年3月「ルノーと資本参加を含むグローバルな提携契約に調印」.
    - p.38「1999年３月27日にルノーとの間で締結された「アライアンス及び資本参加契約」…及びその改訂に代わる新たなアライアンス契約として、2023年７月26日にルノーとの間で「新アライアンス契約」…を締結した」.
  - significance →
    - p.11 持分法適用関連会社 row ルノー: 所有割合 15.26, 関係内容「車両・部品の相互供給・共同開発」.
    - (注)6「ルノー及びルノーが受益者となる信託は、2026年３月31日時点において提出会社の発行済株式総数（自己株式を除く）のそれぞれ17.1%及び18.7%所有」. This is the basis for「お互いの株式を持ち合い」.
    - p.38「相手方の株式につき保有割合が10%を下回らないよう株式保有を維持する」.
- **2003 中国で東風汽車有限公司が事業を開始**
  - description → p.5「2003年７月 東風汽車有限公司事業開始(現、持分法適用関連会社)」; p.41「東風汽車集団股份有限公司との合弁会社である東風汽車有限公司」; official-heritage-2000s row 2003年6月「東風汽車有限公司（DFL）設立」.
  - significance → p.11 row 東風汽車有限公司 (持分法適用関連会社, 50.00); p.33 販売実績(小売り) (注)2「中国には合弁会社である東風汽車有限公司の販売台数が含まれる」; p.13「日本、米国、中国をリード市場と位置づけ」.
- **2010 電気自動車「日産リーフ」を発売**
  - description → official-heritage-2010s rows 2010年10月「追浜工場で100%電気自動車「日産リーフ」の生産を開始」, 2010年12月「「日産リーフ」を発売開始」.
  - significance → p.41「今後も引き続きEVと「e-POWER」の競争力を向上させる技術開発と車種の拡大に取り組む」, 3代目 新型「日産リーフ」 and 日産サクラ (quoted above). "2025年度" is Nissan's own term for the fiscal year in which p.41 reports the launch (p.13 uses「2025年度」 for 当連結会計年度).
- **2016 三菱自動車工業に資本参加**
  - description → p.6「2016年５月 三菱自動車工業㈱と資本参加を含む戦略的協力に関する提携契約締結」「2016年10月 三菱自動車工業㈱の第三者割当増資を引き受け、同社へ資本参加（現、持分法適用関連会社）」; official-heritage-2010s rows 2016年5月「日産自動車と三菱自動車、戦略的アライアンスを締結」, 2016年10月「三菱自動車株の34%を取得し、アライアンスを強化」.
  - significance → p.11 row 三菱自動車工業㈱: 持分法適用関連会社, 関係内容「車両・部品の相互供給・共同開発」.
- **2025 経営再建計画「Re:Nissan」を発表**
  - description → p.12「当社は、2025年５月に、日産自動車の経営再建計画として「Re:Nissan」を発表した。本計画は…コスト構造の抜本的改革、市場戦略及び商品戦略の再定義、並びにパートナーシップの強化の三つを柱としている」「車両生産工場数を2027年度までに17から10に削減する」; official-heritage-2020s row 2025年5月「経営再建計画 Re:Nissanを発表」.
  - significance → p.12「2026年度までに自動車事業における営業利益及びフリーキャッシュフローの黒字化（関税影響を除く。）を目指している」「2026年度が計画の最終年となる「Re:Nissan」」; p.13「（米国関税影響を除く。）」.

## Gaps and judgement calls

No value is `null`. No unverified claim remains. Status: `published`.

1. **`name` = 日産自動車**: the 商号 without 株式会社, following the pattern of every existing entry.
2. **`shortNameEn` = "NISSAN"**, not "NISSAN MOTOR".
   - The strict protocol rule (drop only the legal suffix) gives "NISSAN MOTOR". I followed the Toyota/Honda precedent instead (TOYOTA, HONDA).
   - The company's own brand page names the brand "Nissan" (official-brands).
   - Confusion check: the group companies named in the 有報 that carry the name use qualified names, e.g. 日産車体 (a listed subsidiary, yuho-2026 p.7「国内証券市場に上場している連結子会社…日産車体㈱…東京」) and 日産東京販売ホールディングス (p.11). I did **not** survey other listed companies outside the group for names containing 日産 / Nissan; that check is left to the lead. The hero shows 日産自動車 next to the wordmark.
   - If the lead prefers the strict rule, it is a one-field change to "NISSAN MOTOR".
3. **`netIncomeLabel`** is the full three-line row label joined verbatim, including「（△）」, on all five years (identical in all five filings). It is long, but shortening it would put words in the filing's mouth.
4. **No `children`.** Nissan describes no sub-businesses inside either segment:
   - p.7 事業の内容 gives only 自動車及び部品の製造と販売 and 販売金融.
   - The 構成図 on p.7 is an image the extraction cannot read. It was not used.
   - Brands (Nissan / INFINITI / NISMO / AUTECH) and regions (日本・北米・欧州・アジア・その他, the 所在地別 note) are not businesses, so they were not made into nodes.
5. **Product list is a subset.** The 有報 prints no「主要な製品」 list of models. Model names come from the 研究開発活動 section (new launches and safety ratings, p.41–42). Left out:
   - エルグランド: only planned for 2026 (p.41).
   - アリア・アルティマ・パスファインダー・ムラーノ・ヴァーサ・アルマーダ: named only in US safety-rating lists.
   - ルークス: left unglossed, because no document read here says what kind of car it is.
6. **`customers` omitted for 自動車事業.** The 有報 does not describe who buys vehicles per segment (dealers vs end customers). p.11 lists 日産東京販売ホールディングス as「当社製品の販売先」, but that is one affiliate, not a stated sales model.
7. **Loss-year notes.**
   - **2025年3月期**: yuho-2025 names 減損損失 and リストラクチャリング費用 as the cause of the special loss. That the special loss turned the year into a net loss is a reading of the printed P&L (経常利益 positive, pre-tax loss negative), and is marked「など」.
   - **2026年3月期**: "営業利益は黒字" is from p.34. "2年続けて" is derived from the table.
   - Operating-level causes for 2025年3月期 (p.37: 販売台数の減少、販売奨励金の増加及びインフレーション) are not in the note, because the note explains the sign of net income only.
8. **Financial amounts kept off the page (invariant 4).** These are in this log only:
   - segment profit/loss amounts;
   - regional revenue amounts;
   - impairment and special-loss amounts;
   - the Renault/Mitsubishi ownership percentages from the 2026 有報.

   The entry states rankings only: 自動車事業 largest by revenue; 北米 largest region; 販売金融 profit / 自動車 loss. The one percentage in the entry is「株式の34%を取得」 (2016), a historical shareholding stated by the official history page, not an investment metric of Nissan.
9. **History selection (8 events).** Supportable events left out for the 5–8 limit:
   - 1934 横浜工場完成. Used inside the 1933 significance instead.
   - 1951 東京証券取引所上場.
   - 1966 プリンス自動車工業と合併. The official 1960s page supports it, but no document ties it to a business Nissan runs today.
   - 2002 ルノーの持株比率44.4%.
   - 2011 NMKV (三菱自動車との軽自動車合弁, official 2010s page).
   - 2019 指名委員会等設置会社へ移行, and the former chairman's misconduct described on p.14. These are governance events that do not explain what the company does.
   - 2023 新アライアンス契約. Folded into the 1999 event.
10. **本田技研工業との経営統合協議: not included.**
    - yuho-2025 p.55 lists「本田技研工業株式会社との経営統合に向けた検討に関する基本合意書の締結（及び解約）」 among board agenda items, with no dates, and says the talks were ended.
    - yuho-2025 p.15 says Nissan continues cooperation with Honda and Mitsubishi Motors within a strategic partnership framework.
    - yuho-2026 does not mention Honda at all: a text search of the full extract for 本田 / ホンダ / 経営統合 returned nothing.
    - With no dated statement in the latest 有報, and the protocol's rule against speculation, it is left out.
11. **Month discrepancies between 有報 and official pages** (year identical, so only the year is used):
    - 対米輸出開始: 有報 1958年5月 vs official 1958年6月.
    - 東風汽車有限公司: 有報 2003年7月「事業開始」 vs official 2003年6月「設立」.
    - 1933 capital: 有報「10百万円」 = official「1,000万円」 (same amount). Not used in the entry.
12. **Wording choices that paraphrase a source.**
    - 「市場戦略と商品戦略の見直し」 for「再定義」.
    - 「1990年代後半の経営危機を経て」 for the official「90年代後半の経営危機から」.
    - 「プレミアムブランド」 kept as the source says it.
    - The official 2010s lead calls LEAF「世界初となる量産型EV」 (for global markets). That superlative is omitted.
13. **Fiscal-year vocabulary.** Nissan calls the year ended 2026-03-31「2025年度」. The entry uses「2026年3月期」 except where it quotes Nissan's own plan years (2025年度, 2026年度, 2027年度), which are Nissan's terms as printed.
14. **Not consulted:** 統合報告書 (an「統合報告書」 page exists at `/JP/IR/INTEGRATED_REPORT/`). The 有報 and official pages were sufficient for every claim.
15. **Extraction limits.** No page image was rendered. Every financial value was confirmed in two pdftotext modes, across five 有報 and the 短信. The 構成図 (p.7) and any other images were not read.
16. **Dates.**
    - `accessedAt` and `updatedAt` are 2026-09-15, the day every document was downloaded and read.
    - The official history and brand pages show no publication date, so `publishedAt` is omitted for them.
    - 短信 `publishedAt` values are the dates printed on their first pages (2026-05-13, 2026-08-03).
    - 有報 `publishedAt` values are the 提出日 on each cover.
