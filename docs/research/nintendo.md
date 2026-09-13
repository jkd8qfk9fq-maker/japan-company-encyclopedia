# 任天堂 — research log

Researched: 2026-09-13 (documents downloaded and read) · re-verified 2026-09-14 (figures re-checked
digit by digit; 有報 PDF and both official pages re-fetched and found byte-identical to the 09-13 copies)

Page numbers below are the **printed page numbers** (「― N ―」). In both 有価証券報告書 PDFs the PDF page
index equals the printed page number (checked on p.2, 4, 5, 9, 15–19, 22, 35, 48, 58, 59, 75–78 of 第86期
and p.2, 79 of 第85期).

## Documents

| id | Document | URL | Pages used |
|---|---|---|---|
| `yuho-2026` | 任天堂株式会社 第86期 有価証券報告書（自 2025年4月1日 至 2026年3月31日）, 提出日 2026年6月25日 | https://www.nintendo.co.jp/ir/pdf/2026/security_q2603.pdf | 1 (表紙), 2 (主要な経営指標等の推移), 4 (沿革), 5 (事業の内容), 8 (関係会社), 9 (経営方針), 10 (サステナビリティ), 15–18 (経営者による分析, 販売実績), 19 (研究開発活動), 22 (発行済株式), 35 (社外取締役), 48 (作成方法), 58–59 (収益の計上基準), 75–76 (収益認識関係), 77–78 (セグメント情報・関連情報) |
| `tanshin-2026` | 2026年3月期 決算短信〔日本基準〕(連結), 2026年5月8日 | https://www.nintendo.co.jp/ir/pdf/2026/260508.pdf | 1 (unnumbered summary page = PDF page 1: code, 連結経営成績, 期中平均株式数); printed P.12 = PDF page 14 (セグメント情報) |
| `yuho-2025` | 任天堂株式会社 第85期 有価証券報告書（自 2024年4月1日 至 2025年3月31日）, 提出日 2025年6月26日 | https://www.nintendo.co.jp/ir/pdf/2025/security_q2503.pdf | 2 (主要な経営指標等の推移 — cross-check of FY2022–FY2025), 52 (作成方法), 79 (収益を分解した情報 — 旧区分の定義) |
| `official-history` | 会社情報：会社の沿革 (任天堂株式会社) | https://www.nintendo.co.jp/corporate/history/index.html | 1889, 1947, 1980, 1983, 1990, 2006, 2016, 2017, 2023, 2025 entries |
| `official-outline` | 会社情報：会社概要 (任天堂株式会社) | https://www.nintendo.co.jp/corporate/outline/index.html | 商号, 創業, 設立 |

How the latest 有報 was identified: the IR library page (`/ir/library/securities/`) is JavaScript-rendered;
its data file `https://www.nintendo.co.jp/corporate/common/data/news_jp.xml` lists 第86期 有価証券報告書
(2026.6.25) as the most recent 有価証券報告書, followed only by 2027年3月期 第1四半期 決算短信 (2026.8.6).
No 訂正有価証券報告書 is listed (checked 2026-09-13 and again 2026-09-14). EDINET was not queried (no API key,
per protocol).

Extraction: `pdftotext -layout` shifted the row labels of the p.2 table against its values (the label
「親会社株主に帰属する当期純利益」 printed beside the 包括利益 row). The figures were therefore read from
`-raw`, `-table` and `-simple` extractions, which all agree on row alignment. Values below are from those.

## Financials

Source table: 有報 第86期 p.2「第１ 企業の概況 １ 主要な経営指標等の推移 (1) 連結経営指標等」. Unit as printed:
**百万円**. Stored as whole yen (× 1,000,000). Labels verbatim: `売上高`, `親会社株主に帰属する当期純利益`.

| fiscalYear | revenue (as printed, 百万円) | netIncome (as printed, 百万円) | Standard | Document · page | 短信 cross-check |
|---|---|---|---|---|---|
| 2022年3月期 (第82期) | 1,695,344 | 477,691 | J-GAAP | yuho-2026 p.2; same in yuho-2025 p.2 | n/a (earlier year) |
| 2023年3月期 (第83期) | 1,601,677 | 432,768 | J-GAAP | yuho-2026 p.2; same in yuho-2025 p.2 | n/a |
| 2024年3月期 (第84期) | 1,671,865 | 490,602 | J-GAAP | yuho-2026 p.2; same in yuho-2025 p.2 | n/a |
| 2025年3月期 (第85期) | 1,164,922 | 278,806 | J-GAAP | yuho-2026 p.2; same in yuho-2025 p.2 | tanshin-2026 p.1 comparative row: 1,164,922 / 278,806 — match |
| 2026年3月期 (第86期) | 2,313,051 | 424,056 | J-GAAP | yuho-2026 p.2 | tanshin-2026 p.1: 売上高 2,313,051 / 親会社株主に帰属する当期純利益 424,056 — match |

Checks performed:

- **Digit-by-digit**: the ten stored values ÷ 1,000,000 were compared programmatically against the p.2 text
  rows of yuho-2026 — all ten equal. FY2022–FY2025 are also identical in yuho-2025 p.2, so no restatement
  of these figures between the two filings.
- **Scale**: 424,056百万円 ÷ 期中平均株式数 1,163,347,433株 (tanshin-2026 p.1) = 364.51円, equal to the printed
  1株当たり当期純利益 364.51 (yuho-2026 p.2). FY2025: 278,806百万円 ÷ 1,164,245,156株 = 239.47円, equal to the
  printed 239.47. Confirms the 百万円 unit and the × 1,000,000 conversion.
- **Accounting standard**: J-GAAP for all five years. 有報 第86期 p.48:「連結財務諸表の用語、様式及び作成方法に
  関する規則」（1976年大蔵省令第28号）に基づいて作成; p.15:「わが国において一般に公正妥当と認められる企業会計の
  基準に準拠」; 短信 title「〔日本基準〕」; 第85期 p.52 the same 作成方法. No IFRS adoption in the period
  (p.48 only mentions gathering information in case IFRS is chosen in future).
- p.2 注3: 「法人税、住民税及び事業税等に関する会計基準」 was applied retroactively to 第84期; the filing states
  it had no effect on the indicators. No split across standards.
- Net income is 親会社株主に帰属する当期純利益, not 包括利益 (530,498 / 486,661 / 573,849 / 313,792 / 477,372,
  the next row down, deliberately not used).

## Segment ordering

**Nintendo has a single reportable segment.** 有報 第86期 p.77【セグメント情報】:「…経営資源の配分の決定や業績
評価は、種類別や地域別ではなく当社グループ全体で行っています。従って、事業セグメントは単一です。このため、
記載を省略しています。」 (also p.5 事業の内容:「単一セグメントのため、セグメント情報に関連付けた記載を行って
いません」). The 決算短信 printed P.12 (PDF page 14) says the same:「単一セグメントのため、記載を省略しています」.

Therefore **the top-level `businesses` are NOT reportable segments.** They are the two categories of the
company's own 【関連情報】「１ 製品及びサービスごとの情報」 (p.78), which the company also uses for 販売実績
(p.17) and for 収益を分解した情報 (p.75, with footnoted definitions). Names are the company's category names
verbatim. Ordered by 2026年3月期 外部顧客への売上高:

| Category (not a segment) | Revenue as printed (百万円, 2026年3月期) | Document · page |
|---|---|---|
| ゲーム専用機 | 2,239,541 | yuho-2026 p.78 (製品及びサービスごとの情報); also p.17 販売実績 (＋106.7％) and p.75 合計列 |
| IP関連収入等 | 73,510 | yuho-2026 p.78; also p.17 (△9.7％) and p.75 |
| 合計 | 2,313,051 | 2,239,541 + 73,510 = 2,313,051 — equals consolidated 売上高 |

Definitions (p.75): ※1 ゲーム専用機 =「ハードウェア（アクセサリ、amiibo含む）及びソフトウェア（パッケージ併売ダウン
ロードソフト、ダウンロード専用ソフト、追加コンテンツ、Nintendo Switch Online含む）の売上高」. ※2 IP関連収入等 =
「映像コンテンツ収入、スマートデバイス向け課金収入、ロイヤリティ収入、オフィシャルストアにおけるグッズ販売等の
売上高」. p.59:「IP関連収入等には、IP関連収入に加えてモバイルアプリの販売による収入を含みます。」

Reclassification note: from 第86期 the categories changed (p.75:「従来の「モバイル・IP関連収入等」「その他」の区分を
「IP関連収入等」に変更」; p.78:「従来の「Nintendo Switchプラットフォーム」「その他」の区分を上記に変更」). FY2025 is
restated under the new categories (ゲーム専用機 1,083,534 / IP関連収入等 81,388, p.77). Ordering uses FY2026 only.

## Claims

### Identity

- `code` 7974 → tanshin-2026 p.1「コード番号 7974」 (the 有報 cover does not print the code).
- `officialName` 任天堂株式会社 → yuho-2026 p.1【会社名】.
- `nameEn` Nintendo Co., Ltd. → yuho-2026 p.1【英訳名】; official-outline「英語名 Nintendo Co., Ltd.」.
- `shortNameEn` NINTENDO → English 商号 with the legal suffix「Co., Ltd.」dropped, uppercased (protocol rule).
- `listings` 東証 プライム → yuho-2026 p.22 ②発行済株式「東京証券取引所 プライム市場」 (the only exchange in that
  column); tanshin-2026 p.1「上場取引所 東」.
- `industries` entertainment (primary) → classification choice; `src/types/company.ts` names Nintendo as the reason
  `entertainment` exists.

### description (「ゲーム機「Nintendo Switch 2」とゲームソフトをつくって世界で売り、マリオの映画やアプリも手がける会社。」, 59字)

- ゲーム機「Nintendo Switch 2」 → official-history 2025「家庭用テレビゲーム機「Nintendo Switch 2」を発売」; yuho-2026 p.19「新たなビデオゲーム機である『Nintendo Switch 2』」.
- ゲームソフトをつくって → yuho-2026 p.5「当社及び関係会社が開発し、当社において製造し」.
- 世界で売り → yuho-2026 p.5「主に関係会社が国内外で販売」; p.16「海外売上高比率76.9％」.
- マリオの映画 → yuho-2026 p.35 当社は『ザ・スーパーマリオブラザーズ・ムービー』（2023年4月公開）…の制作に携わっています; official-history 2023. (「マリオの映画」 paraphrases the film title.)
- アプリも手がける → yuho-2026 p.19「『ファイアーエムブレム ヒーローズ』や『ピクミン ブルーム』、『マリオカート ツアー』などのゲームアプリのサービスを継続して運営」.

### businesses

- ゲーム専用機 · description「携帯ゲームやホームコンソールゲームのハードウェア（ゲーム機）とソフトウェアの事業」 → yuho-2026 p.5「「ゲーム専用機」とは、携帯ゲームやホームコンソールゲームのハードウェア及びソフトウェア」.
- ゲーム専用機 · 「グループで開発し、任天堂が製造して、主にグループの販売会社が国内外で販売する」 → p.5「当社及び関係会社が開発し、当社において製造し、主に関係会社が国内外で販売」; p.77「全世界向けの主たる開発と製造は当社が行い、販売は主に子会社が行っています」.
- ゲーム専用機 · products Nintendo Switch 2, Nintendo Switch → p.15 (both platforms' results).
- ゲーム専用機 · products ゲームソフト（パッケージ版・ダウンロード版）, 追加コンテンツ, Nintendo Switch Online, アクセサリ, amiibo → p.75 ※1; パッケージ版/ダウンロード版 wording p.15.
- IP関連収入等 · description「任天堂のIP（知的財産）に関連する売上などをまとめた区分。映像コンテンツ収入、スマートデバイス向けアプリの課金収入、ロイヤリティ収入、オフィシャルストアでのグッズ販売などが含まれる」 → p.75 ※2; p.59 (ロ); p.5「映像コンテンツやモバイルアプリなどのIPを活用した事業」.
- IP関連収入等 · product 映像コンテンツ → p.75 ※2.
- IP関連収入等 · product スマートデバイス向けアプリ（『ファイアーエムブレム ヒーローズ』『ピクミン ブルーム』『マリオカート ツアー』など） → titles p.19; category membership p.59 (モバイルアプリの販売による収入を含む) and p.75 ※2 (スマートデバイス向け課金収入).
- IP関連収入等 · product オフィシャルストアで販売するグッズ → p.75 ※2.

### businessModel

- description · 開発・製造・販売の流れ → p.5, p.77 (as above); 「世界中のお客様」 → p.9「世界中のお客様へ、かつて経験したことのない楽しさ…」.
- description · 「映像コンテンツやスマートデバイス向けアプリ、キャラクターグッズなど、ゲーム専用機の外の分野にも取り組んでいる」 → p.9「映像コンテンツやモバイルアプリ、ロケーション、キャラクターグッズといったゲーム専用機ビジネスの枠外の分野においても…」.
- products Nintendo Switch 2 / Nintendo Switch / ゲームソフト / Nintendo Switch Online / amiibo → p.15, p.19, p.75.
- products スマートデバイス向けアプリ → p.19; 映像コンテンツ → p.5, p.75; キャラクターグッズ・トランプ → p.5「主な製品は…「ゲーム専用機」とキャラクターグッズ・トランプ等です」.
- customers 世界中のお客様（あらゆる年代のお客様やご家族） → p.9「世界中のお客様」「ご家族が安心して楽しむことができ」; p.10「あらゆる年代のお客様に安心して遊んでいただけるよう」.
- customers ソフトメーカー → p.76 契約負債 includes「ソフトメーカー様などへ製品の提供を行う取引における前受金」; p.58 download software of ソフトメーカー様: 「当社グループが受け取る販売手数料の金額を収益として認識」.
- customers 任天堂のIPを使用する顧客 → p.59「IP関連収入については、基本的に顧客による当社IPの使用に応じて収益を認識」.
- revenueSources ハードウェア（ゲーム機本体・アクセサリ・amiibo）の販売 → p.75 ※1; p.58 (ハードウェア…アクセサリなどの製品の販売に係る収益). 「ゲーム機本体」 glosses ハードウェア, whose units p.15 reports as 販売台数.
- revenueSources ゲームソフト（パッケージ版・ダウンロード版・追加コンテンツ）の販売 → p.58 (ダウンロードソフトや追加コンテンツ), p.75 ※1.
- revenueSources Nintendo Switch Online などの有料会員サービス → p.58「Nintendo Switch Onlineのような有料会員サービス」.
- revenueSources ソフトメーカーのダウンロードソフトの販売で受け取る販売手数料 → p.58.
- revenueSources 映像コンテンツ収入 / スマートデバイス向けアプリの課金収入 / オフィシャルストアでのグッズ販売 → p.75 ※2.
- revenueSources IPの使用に応じたロイヤリティ収入 → p.75 ※2 (ロイヤリティ収入), p.59 (IPの使用に応じて収益を認識).
- flow company「任天堂とグループ会社がゲーム機とゲームソフトを開発し、任天堂が製造する」 → p.5.
- flow offering → p.15, p.19, p.58 (products and NSO); p.9 (映像コンテンツ・モバイルアプリ・キャラクターグッズ).
- flow customer「主にグループの販売会社を通じて国内外で販売する。2026年3月期は売上高の76.9％が海外」 → p.5, p.77; p.16「海外売上高比率76.9％」.
- flow revenue「売上高2兆3,130億円」 → p.16 prints「2兆3,130億円」; 「ゲーム専用機」2兆2,395億円 → derived from p.78 2,239,541百万円 (truncated to 億円); 「IP関連収入等」735億円 → p.15 prints「735億円」 (p.78: 73,510百万円).
- flow profit「ゲーム機とソフトでは利益率が大きく異なるため、その売れ方で利益が変わる」 → p.18「ゲーム専用機と対応するソフトウェアが…それぞれの利益率が大きく異なるため、これらの売上割合の変動は売上総利益及び売上総利益率に影響を与えます」.
- flow profit「ヒット商品の有無やその規模でも業績が大きく変わる」 → p.18「ヒット商品の有無や、その規模によって経営成績等が大きく変わります」.

### history

- **1889 花札の製造を始める** · description → official-history 1889「山内房治郎が、京都市下京区にて花札の製造を開始」; 創業 明治22年9月 → official-outline「創業 明治22年9月」 (official-history labels 1889 as 明治22年).
- 1889 · significance「1947年に設立した現在の会社も「かるた・トランプ類の製造・販売会社」として発足」 → yuho-2026 p.4「1947年11月 かるた・トランプ類の製造・販売会社として…株式会社丸福として発足」; official-history 1947「株式会社丸福（現・任天堂株式会社）を設立」. 「トランプは今も主な製品のひとつ」 → p.5.
- **1980 アメリカに現地法人を設立** · description → yuho-2026 p.4「1980年4月 アメリカ、ニューヨーク州に現地法人Nintendo of America Inc.を設立」「1982年2月 アメリカ、ワシントン州に新たに現地法人Nintendo of America Inc.（現 連結子会社）を設立し、既存のニューヨーク州法人を吸収合併」; official-history 1980/1982.
- 1980 · significance「今もグループの主な販売会社のひとつ」 → p.5 [販売] list of 主な関係会社 includes Nintendo of America Inc.; p.8 it is one of three subsidiaries above 10％ of consolidated sales (売上高 876,000百万円). 「米大陸の売上高が9,352億円で…最大の地域」 → p.78 地域ごとの情報: 日本 534,924 / 米大陸 935,251 / 欧州 551,468 / その他 291,405 (百万円); 9,352億円 is 935,251百万円 truncated to 億円.
- **1983 ファミリーコンピュータを発売** · description → official-history 1983「家庭用テレビゲーム機「ファミリーコンピュータ」を発売」「東京証券取引所市場第一部に株式を上場」「京都府宇治市に宇治工場を設置」; yuho-2026 p.4 1983年7月 (東証一部), 1983年11月 (宇治工場).
- 1983 · significance「この後もスーパーファミコン（1990年）、Wii（2006年）、Nintendo Switch（2017年）などの家庭用テレビゲーム機が続く」 → official-history 1990/2006/2017 entries, each described as 家庭用テレビゲーム機. 「「ゲーム専用機」は2026年3月期の売上高の9割以上」 → p.78: 2,239,541 ÷ 2,313,051 = 96.82％.
- **2016 スマートデバイス向けアプリを配信** · description → official-history 2016「スマートデバイス向けアプリ『Miitomo』配信」.
- 2016 · significance「モバイルアプリは…「ゲーム専用機ビジネスの枠外の分野」として挙げるもののひとつ」 → p.9; 「今も『ファイアーエムブレム ヒーローズ』などのゲームアプリを運営」 → p.19; 「スマートデバイス向けの課金収入は「IP関連収入等」に含まれる」 → p.75 ※2.
- **2017 Nintendo Switchを発売** · description → official-history 2017「持ち運べる家庭用テレビゲーム機「Nintendo Switch」を発売」.
- 2017 · significance「2026年3月に発売から10年目を迎え」 → p.15「3月に発売から10年目を迎えたNintendo Switch」; 「2026年3月期もNintendo Switchのソフトは1億3,691万本売れた」 → p.15「Nintendo Switchソフトの販売本数は1億3,691万本」 (company's own count; p.15 notes it includes Nintendo Switch 2 Edition download versions); 「後継機のNintendo Switch 2でもNintendo Switchのソフトを遊べる」 → p.15「Nintendo Switch 2 では専用のソフトウェアに加えてNintendo Switchソフトも遊んでいただける」, 後継機種 p.9/p.19.
- **2023 マリオの映画が公開** · description → official-history 2023「任天堂が制作に携わる初のアニメ映画『ザ・スーパーマリオブラザーズ・ムービー』公開」.
- 2023 · significance「映像ビジネスを「一層重要な位置づけ」と述べ」 → p.35「映像ビジネスは一層重要な位置づけとなり」; 「2026年4月公開の『ザ・スーパーマリオギャラクシー・ムービー』の制作にも携わっている」 → p.35.
- **2025 Nintendo Switch 2を発売** · description → official-history 2025; 6月 and 後継機種 → p.9「Nintendo Switch 2 を2025年6月に発売しました。…Nintendo Switchの後継機種として」.
- 2025 · significance「Nintendo Switchの普及基盤を引き継ぐ後継機種と位置づけている」 → p.9「Nintendo Switchの後継機種として、その普及基盤を引き継ぎ、さらに多くのお客様に楽しんでいただけるよう、継続的にビジネスの活性化を推し進めます」; 「発売した2026年3月期に1,986万台を販売」 → p.15「6月に発売したNintendo Switch 2 が…通期の販売台数は1,986万台」.

## Gaps and judgement calls

1. **Single segment, so the top level is not segments.** Nintendo has one reportable segment (p.77). The two
   `businesses` are the company's 製品及びサービスごとの情報 categories (p.78), with the company's names and
   definitions. This deviates from protocol §2 ("top level = reportable segments"). There is no way to follow
   that rule for a single-segment company without either one node or invented segments. **Any UI must not label
   these nodes セグメント.** The data file's header comment says the same.
2. **No `children`.** p.75 defines what each category contains, but the company gives no sub-business figures
   or descriptions as separate businesses. Hardware / software / NSO are therefore listed as `products`, not as
   child nodes.
3. **トランプ is not placed in a category.** 事業の内容 (p.5) names トランプ as a main product. The 第85期 filing
   (p.79 ※4) put「トランプ等」 in the old「その他」 category, and 第86期 (p.75) merged「その他」 into「IP関連収入等」.
   However, the 第86期 ※2 definition does not mention トランプ. Rather than chain two filings into an unstated
   placement, トランプ appears only in `businessModel.products`.
4. **Mario film removed from IP関連収入等 products (re-verification).** The first draft listed
   『ザ・スーパーマリオブラザーズ・ムービー』 as an example of 映像コンテンツ. p.35 states that no money or IP licence
   passed between Nintendo and Illumination for the film, and no document says how that film's revenue is
   booked. Removed. For the same reason, a sentence in the 2023 history significance saying 映像コンテンツ収入 is
   in IP関連収入等 was removed: true in general, but it implied the film's revenue is booked there.
5. **Description reworded (re-verification).** The first draft said「マリオなどのキャラクター」. No source reviewed
   calls Mario a character (p.12 speaks only of「任天堂のキャラクター」 in general). Changed to「マリオの映画」,
   which paraphrases the film title.
6. **Switch "10年目" corrected (re-verification).** The first draft said「発売から10年目の2026年3月期」. p.15 says
   the tenth year began in March 2026, the last month of that fiscal year. Reworded to「2026年3月に発売から10年目を迎え」.
7. **1889 significance softened (re-verification).** 「カードをつくる会社として始まった」 became「花札の製造から始まった」.
   The 1889 source says 山内房治郎 began making 花札; it does not describe a company. The link from 1889 to today's
   company rests on Nintendo's own 会社概要 (創業 明治22年9月 / 設立 昭和22年11月). No further legal continuity is claimed.
8. **証券コード from the 決算短信**, not the 有報 cover (the cover does not print it). Allowed by protocol (company IR document).
9. **Customers.** No per-business `customers`: the filing does not name customers per category. At model level,
   the company names 「お客様」 generally. It does not name retailers or distributors, so none are claimed, even
   though goods are delivered 「顧客の指定する場所へ」 (p.58). ソフトメーカー is included because p.76 names
   ソフトメーカー様 as a contract counterparty paying advances.
10. **Derived rounded amounts in prose.** 2兆3,130億円 (p.16) and 735億円 (p.15) are printed by the company.
    2兆2,395億円 (from 2,239,541百万円), 9,352億円 (from 935,251百万円) and「9割以上」 (96.82％) are derived by me:
    truncation to 億円 and division. 76.9％ is printed (p.16). The 地域ごとの情報 regions sum to 2,313,048 against a
    printed total of 2,313,051 (百万円未満 rounding). Only the 米大陸 figure and the ranking are used.
11. **History selection (7 events).** Left out: 1985『スーパーマリオブラザーズ』, because the sources do not
    establish it as the origin of anything present today, and a "Mario begins here" significance would be memory,
    not source. Also left out: 1977「テレビゲーム15」「テレビゲーム6」, because Famicom was chosen as the home-console
    turning point. Its significance claims only the continuing line of consoles listed in the official 沿革, not
    "first". Also left out: 1962 listing, 1963 name change, 2021 スーパー・ニンテンドー・ワールド, 2024
    ニンテンドーミュージアム. These are sourced, but no source-supported 意味 ties them to the current business
    structure more strongly than the seven chosen.
12. **No Japanese 統合報告書.** Nintendo publishes only an English アニュアルレポート (2026-07-06,
    `/ir/pdf/2026/annual2603e.pdf`). It was not used; everything needed was in the 有報.
13. **EDINET not checked** for amendments (no API key, per protocol). The company's IR index lists no
    訂正有価証券報告書 as of 2026-09-14.
14. **Dates.** Documents were downloaded on 2026-09-13. On 2026-09-14 the 有報 PDF and both official pages were
    re-fetched (byte-identical), and all figures and claims were re-read. `accessedAt`, the revision date and
    `updatedAt` are 2026-09-14. The official pages state no publication date, so `publishedAt` is omitted for them.
15. **Status `published`.** After re-verification, every remaining field traces to a quoted passage above. Nothing
    is null, and no claim rests on memory. The deviations (items 1–3) are structural choices, disclosed here, not
    unverified facts.
16. Not registered in `src/data/companies/index.ts` (outside this task's two files). No data-integrity test
    exists in `tests/` yet. The protocol checks were run by hand: flow order company→offering→customer→revenue→profit;
    7 history events; exactly one primary industry; every `sourceIds` entry resolves; every source is referenced.
    `npx tsc --noEmit -p .` exits 0.
