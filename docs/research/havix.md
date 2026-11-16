# ハビックス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ハビックス株式会社 |
| 証券コード | 3895 |
| docID（データを取り出した文書） | `S100YE3K` |
| 原本 docID | `S100YE3K` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE3K.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ハビックス株式会社 / 3895 / docID S100YE3K（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
havix: 10 件の数値を有報XBRLと照合
有報: ハビックス株式会社 有価証券報告書－第76期(2025/04/01－2026/03/31) (docID S100YE3K)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":10897603000,"latestFiling":10368150000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":12084138000,"latestFiling":11531505000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":13204697000,"latestFiling":12598634000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":13403100000,"latestFiling":13312931000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":9401000,"latestFiling":-19336000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":-25562000,"latestFiling":-100642000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":882378000,"latestFiling":829815000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":792085000,"latestFiling":809120000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":11800453000,"latestFiling":11686351000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":12604321000,"latestFiling":12412396000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":13095579000,"latestFiling":12891377000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":12309130000,"latestFiling":12191501000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":6139573000,"latestFiling":6142817000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":6114973000,"latestFiling":6089487000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":6731631000,"latestFiling":6700791000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":7264884000,"latestFiling":7230475000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":231,"latestFiling":217},{"key":"NumberOfEmployees|2023-03-31","previousFiling":207,"latestFiling":193},{"key":"NumberOfEmployees|2024-03-31","previousFiling":204,"latestFiling":190},{"key":"NumberOfEmployees|2025-03-31","previousFiling":208,"latestFiling":207}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
havix: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との指標の差異（売上高・利益・総資産・純資産・従業員数の全系列）は、連結決算から非連結決算への移行によるものであり、今期有報の５年表は提出会社単体の印字どおりに登録している。理由は financialNotes（2026年３月期）に記録した。
- businessModel: 財務諸表の組替えの記載は、非連結移行に伴う表示の取扱いであり、指標そのものへの影響はないため warnings のみの扱いとした。
- businessModel: 経営上の目標の指標（セグメント売上高・セグメント利益等の段階利益の概念）は投資・利益指標であるため、本文と perspectives には書いていない。セグメント利益、段階利益の金額と増減理由、キャッシュ・フローの金額、設備の帳簿価額、受注高・受注残高は書いていない。
- businessModel: 第76期の配当は2026年６月24日開催予定の株主総会の決議事項である旨が指標の注記に印字されている（資本政策の手続きのため warnings のみ）。
- businessModel: 重要な後発事象は「該当事項はありません」。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略した。【事業の内容】に個別の仕入先名は印字されていない（主原料はフレッシュパルプ）。
- businessStructure: 設備と事業の対応は【主要な設備の状況】のセグメント欄どおり: 伊自良工場（パルプ不織布）・本巣工場（化合繊不織布）は不織布関連事業、穂積工場・海津工場（衛生用紙）は紙関連事業。本社・東京事務所・伊自良事務所・岐阜工場・倉庫の各行はセグメント欄が「―」のため、どの事業にも結びつけていない。帳簿価額は書いていない。穂積工場は2025年７月より生産を停止している旨が印字されている。
- businessStructure: 子会社は１社（HAVIX TRADING(Thailand) Co.,Ltd.）を有するが、解散を決議し事業活動を停止しており、重要性が乏しいため【関係会社の状況】の記載は省略されている。自社の子会社であるため関連企業には結んでいない。
- businessStructure: 岐阜工場（岐阜県本巣市）ではペットケア商品製造設備の新設が計画されている（完成予定2027年３月）が、当事業年度末現在では事業の用に供されておらず、報告セグメントに含まれていないため、事業としては登録していない。
- history: 沿革の表は年月と事象が対応して印字されており、行順で対応づけた。資本金の金額は沿革に印字されておらず、書いていない。
- history: 省いた項目: 1955年 白ちり紙への転換、1973年 トイレットペーパー製造中止と紙オシボリ原紙の開始、1978年 穂積工場新設、1981年 茜部工場新設、1984年 東京営業所設置、1987年 伊自良工場増設・本社移転・茜部工場閉鎖、1992年 穂積工場の生産体制確立、1994年 ジェイソフト設立・東京営業所統合、1995年 岐阜工場閉鎖・ボックスティッシュ加工中止、2000年 本社移転、2004年・2005年 ISO認証取得、2007年 海津工場新設、2008年 ジェイソフト完全子会社化、2010年・2013年 市場再編に伴う上場先の変更表示、2012年 本巣工場新設、2015年 森林認証取得・本巣工場増設、2019年 海津工場増設、2020年 不織布マスクの加工開始。
- history: Wikipedia の記事「ハビックス」があったが、冒頭は有報の事実の言い換えのみで、有報にない補足はなかったため使っていない。
- industry: 主たる業界は chemicals を暫定とした。不織布関連事業と紙関連事業の２セグメントで売上高の全てを占めるが、閉じた集合に紙・パルプ／不織布の区分が無いため、素材製造に最も近い chemicals を選んだ（taxonomyGaps に記録）。
- industry: ＤＥＩの別記事業は cte である。
- relatedCompanies: marubeni（丸紅株式会社）は、【大株主の状況】に載る事業会社（商社）であり、４区分の関係会社には当たらないため major-shareholder として結んだ。説明に計上額は書いていない。
- relatedCompanies: densan-system-holdings（株式会社電算システムホールディングス）は、特定投資株式の保有目的が個別に印字され（情報システム関連の業務取引先・業務委託）、定型句ではないため business-partner として結んだ。株式数・計上額は説明に書いていない。
- relatedCompanies: unicharm（ユニ・チャーム株式会社）は結ばなかった。印字される相手先は同社子会社のユニ・チャームプロダクツ株式会社であり、別の法人である（主要な販売先であり、2027年４月開始予定の製造委託の相手先も同子会社）。
- relatedCompanies: kao（花王株式会社）は結ばなかった。売掛金の相手先別内訳に載るのみで、印字される事業会社は同社子会社の花王プロフェッショナル・サービス株式会社であり、別の法人である。
- relatedCompanies: mitsui-and-co（三井物産株式会社）は結ばなかった。買掛金の相手先別内訳に印字されるのは三井物産ケミカル株式会社であり、別の法人である。
- relatedCompanies: fp（株式会社エフピコ）は結ばなかった。売掛金の相手先別内訳に印字されるのはエフピコ商事株式会社であり、別の法人である。
- relatedCompanies: juroku-financial-group（株式会社十六フィナンシャルグループ）は結ばなかった。特定投資株式の保有目的は金融・資金取引のための関係維持であり、金融機関との資金調達関係は結ばない。
- relatedCompanies: the-ogaki-kyoritsu-bank（株式会社大垣共立銀行）は結ばなかった。大株主の状況と特定投資株式に載るが、銀行であり金融・資金取引のための保有である。
- relatedCompanies: daiwa-securities-group（株式会社大和証券グループ本社）は結ばなかった。特定投資株式の保有目的は、同社子会社が主幹事証券会社であることによる金融サービスの関係維持である。
- relatedCompanies: vision / ray / career / freee / base-4481 / land / en / king / corona / zero は結ばなかった。「長期経営ビジョン」「エアレイド」「キャリア採用」「CO2フリー電力」「データベース」「ブランド」「エンゲージメント」「クッキングペーパー」「コロナ禍」「残存価額をゼロ」等の一般的な文言・部分文字列の一致のみである。
- relatedCompanies: 候補にないため結んでいない相手（warnings 記録）: ユニ・チャームプロダクツ株式会社（主な販売先。総販売実績に対する割合が印字されている）、ヤマニ洋紙工業株式会社（大株主の状況に載る事業会社、2.16％）、株式会社十六銀行・岐阜信用金庫（金融機関）。自社の子会社 HAVIX TRADING(Thailand) Co.,Ltd. は結んでいない。
- terms: 助言のみ。用語候補: エアレイド製法、サーマルボンド製法、パルプ不織布、化合繊不織布、包合紙、Kireine（キレイネ）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ハビックス株式会社の主たる業界（不織布と衛生用紙の製造・販売） → 提案: 紙・不織布（紙・パルプおよび不織布を製造する会社の区分）。不織布関連事業（2026年３月期の外部顧客への売上高6,773百万円）と紙関連事業（同5,336百万円）の２セグメントで売上高の全てを占めるが、閉じた集合（INDUSTRY_IDS）に紙・パルプ／不織布の区分が無いため、素材製造に最も近い chemicals を暫定にした。
