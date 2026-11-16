# 大田花き — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社大田花き |
| 証券コード | 7555 |
| docID（データを取り出した文書） | `S100YLK4` |
| 原本 docID | `S100YLK4` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLK4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社大田花き / 7555 / docID S100YLK4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ota-floriculture-auction: 10 件の数値を有報XBRLと照合
有報: 株式会社大田花き 有価証券報告書－第38期(2025/04/01－2026/03/31) (docID S100YLK4)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":3926914000,"latestFiling":3926000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":4285086000,"latestFiling":4285000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":4144605000,"latestFiling":4144000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":3857541000,"latestFiling":3857000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":173440000,"latestFiling":173000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":306130000,"latestFiling":306000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":182221000,"latestFiling":182000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":221684000,"latestFiling":221000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":248301000,"latestFiling":248000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":419747000,"latestFiling":419000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":283847000,"latestFiling":283000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":330586000,"latestFiling":330000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":8806090000,"latestFiling":8806000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":8810466000,"latestFiling":8810000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":9237339000,"latestFiling":9237000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":8386188000,"latestFiling":8386000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":4689406000,"latestFiling":4689000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":4934485000,"latestFiling":4934000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":5040391000,"latestFiling":5040000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":5201023000,"latestFiling":5201000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ota-floriculture-auction: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との数値の差異は、主要な経営指標等の表示単位が千円単位から百万円単位へ変更されたことによるもので、修正再表示ではありません（経営指標等の注記2）。financialNotes にその旨を記載しました。
- businessModel: 売上高の減少理由は、主要商材である菊の相場の下落や輸入品をめぐる需給バランスの変化などがMD&Aに記載されていますが、本文には増減率のみを記載しました。
- businessModel: 販売実績の区分ごとの金額（受託品2,545百万円・買付品661百万円・その他454百万円）の合計は、印字の合計3,661百万円と1百万円異なります（有報の丸め）。
- businessModel: 経営方針に掲げる数値目標は投資指標に当たるため、本文・戦略には記載していません。
- businessStructure: 単一セグメントのため、事業の children はMD&Aの販売実績（取扱品目別）の区分を用いました。受託品2,545百万円・買付品661百万円・その他454百万円の合計は3,660百万円で、印字の合計3,661百万円と1百万円異なります（有報の丸め）。印字の数値をそのまま記載しました。
- businessStructure: 拠点・設備（本社、大田ウィングスのOTA花ステーション）は単一セグメントに属するため、特定の事業への結び付けはしていません。
- businessStructure: 仕入先は有報に個別の社名が印字されていないため、suppliers は記載していません（このツリーの旧スキーマでも省略が原則です）。生産者からの集荷であることは businessModel に記載しました。
- history: 沿革表の末尾は年月セルと事象文が分かれて印字される崩れた表で、年月セル6件（2010年4月、2013年7月、2014年4月、2016年12月、2022年4月、2026年4月）と事象6件の数が一致するため、行順に対応づけて記載しました。
- history: 落とした行: 1990年12月のセリ機械増設、1992年11月の流通システム大賞・物流大賞の各奨励賞、1993年2月の花保ち試験室の設置（強みの分析には反映）、1994年11月の鉢物の取引日の変更、1995年9月のセリ機械・買参人用端末機の増設、2005年6月の委員会等設置会社への移行。これらはいずれも設備・運営・ガバナンスの細目であり、事業構造の転機ではないため落としました。
- history: 資本金の金額は沿革に記載していません。
- industry: 主たる業界は trading（商社）を暫定としました。事業は花きの卸売が全額であり、閉じた分類に花き・園芸品の卸売に当たる区分がありません。
- industry: 単一セグメントのため、副業界は付けていません。
- relatedCompanies: port（ポート株式会社）: 有報の「サポート」「レポート」等の一般語に一致した機械抽出であり、当社との取引・提携・資本関係の記述はありません。結びませんでした。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成」の一般語に一致した機械抽出であり、関係の記述はありません。結びませんでした。
- relatedCompanies: vision（株式会社ビジョン）: 「管理ビジョン」の一般語に一致した機械抽出であり、関係の記述はありません。結びませんでした。
- relatedCompanies: path（パス株式会社）: 「パーパス」の一般語に一致した機械抽出（ambiguous）であり、関係の記述はありません。結びませんでした。
- relatedCompanies: the-lead（株式会社リード）: 「業界をリードする」の一般語に一致した機械抽出であり、関係の記述はありません。結びませんでした。
- relatedCompanies: base-4481（ベース株式会社）: 「ベースアップ」の一般語に一致した機械抽出であり、関係の記述はありません。結びませんでした。
- relatedCompanies: corona（株式会社コロナ）: 「コロナ禍」の一般語に一致した機械抽出であり、関係の記述はありません。結びませんでした。
- relatedCompanies: en（エン株式会社）: 「エンゲージメント」の一般語に一致した機械抽出（ambiguous）であり、関係の記述はありません。結びませんでした。
- relatedCompanies: 株式会社大森園芸ホールディングスは【関係会社の状況】の「その他の関係会社」（当社議決権の32.0％を保有）ですが、非上場で候補一覧にないため結んでいません。なお、有報には同社とは資本関係のみで取引は行っていない旨が印字されています。
- relatedCompanies: 大株主の東京青果株式会社（9.80％、2026年3月31日現在）・株式会社大森園芸（7.86％）・株式会社都立コーポレーション（3.06％）・株式会社南関東花き園芸卸売市場（2.06％）はいずれも候補一覧にないため結んでいません。
- relatedCompanies: 当社の連結子会社・持分法適用関連会社・非連結子会社（株式会社九州大田花き、株式会社大田ウィングス、株式会社ディーオーシー、花き施設整備有限会社、株式会社とうほくフラワーサポート、株式会社大田花き花の生活研究所）は自社グループ会社のため結んでいません。
- terms: 助言: 用語「セリ下げ方式」は、買い手が下がっていく価格に対して買いを入れる競り下げの方式で、有報には大田花きが日本で初めて導入した方式として沿革に印字されています。
- terms: 助言: 用語「買参人」は、卸売市場で卸売業者から買い受ける資格を持つ参加者（生花店などの小売業者）を指す言葉として、有報の各所に印字されています。
- terms: 助言: 用語「受託品」は、生産者から販売を受託した商品を指し、「買付品」（買い付けて在庫として販売する商品）と対で、MD&Aの販売実績の区分に印字されています。
- terms: 助言: 用語「MPS-GPA」は、花き市場工程管理認証プログラムの略称で、有報には大田花きが日本の花き卸売市場として初めて取得した旨が沿革に印字されています。

## 要確認（status に反映）

- businessModel: 重要な後発事象として、2026年３月27日開催の取締役会において株式会社東日本板橋花きの全株式を取得して子会社化することを決議し、同日付で株式譲渡契約を締結し、2026年４月１日付で全株式を取得した旨が記載されています。株式の取得は当連結会計年度末（2026年３月31日）後の事象であるため、本登録は2026年３月期の構造で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 大田花きの主たる業界（花き卸売事業） → 提案: 花き卸売。主事業は東京都中央卸売市場大田市場における花きの卸売であり、2026年3月期の売上高3,661百万円の全額が花き卸売事業によるものです。閉じた分類に花き・園芸品の卸売を表す区分がなく、卸売に最も近い trading を暫定としました。
