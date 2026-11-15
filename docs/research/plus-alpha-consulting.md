# プラスアルファ・コンサルティング — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社プラスアルファ・コンサルティング |
| 証券コード | 4071 |
| docID（データを取り出した文書） | `S100XD0A` |
| 原本 docID | `S100XD0A` |
| 提出日（原本） | 2025-12-25 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XD0A.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社プラスアルファ・コンサルティング / 4071 / docID S100XD0A（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
plus-alpha-consulting: 6 件の数値を有報XBRLと照合
有報: 株式会社プラスアルファ・コンサルティング 有価証券報告書－第19期(2024/10/01－2025/09/30) (docID S100XD0A)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-09-30","previousFiling":3093779000,"latestFiling":3092230000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-09-30","previousFiling":4540957000,"latestFiling":4529770000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":15267549000,"latestFiling":15410871000},{"key":"NetAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":12101385000,"latestFiling":12099836000}]
利益・総資産・純資産・従業員数: 12 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
plus-alpha-consulting: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて転記しました（切り上げなし）。セグメント外部売上高の切り捨て合計（13,244百万円＋3,839百万円＝17,083百万円）は、切り捨てのため印字の売上高17,084百万円と１百万円差があります。
- businessModel: 2024年９月期の各数値が前期有報の印字と異なるのは、第19期に行った企業結合に係る暫定的な会計処理の確定の内容を第18期の数値に反映させたためであり、主要な経営指標等の注記、MD&A及びセグメント情報に理由が印字されています。そのためfinancialNotesに注記を付けました。証拠パックの財務諸表の組替えに関する注意については、確認できる再表示はこの暫定的な会計処理の確定によるものであり、表示方法の変更による組替えの注記は本文に確認できませんでした。
- businessModel: 2025年９月期には、連結子会社である株式会社グローアップ及びAttack株式会社ののれん等に係る減損損失1,154百万円が計上されています。本文の金額は売上高と純利益のみとするため、ここに記録します。
- businessModel: 重要な後発事象として、2025年11月12日開催の取締役会決議に基づき、2025年11月28日に自己株式の消却を実施したことが印字されています。期後の資本政策に関する事項であるため本文には入れず、ここに記録します。
- businessModel: 経営上の目標の達成状況を判断するための客観的な指標等として、売上高、営業利益、営業利益率を重視することが印字されていますが、数値目標の印字はないため本文と戦略の文章には入れていません。
- businessModel: 連結財務諸表は第17期（2023年９月期）から作成されており、主要な経営指標等の連結数値は３年分のみが印字されています。
- businessModel: MD&Aのセグメント別売上高はセグメント間の内部売上高又は振替高を含む数値（マーケティングソリューション3,841百万円、HRソリューション13,246百万円）であるため使わず、セグメント情報の外部顧客への売上高を用いました。
- businessModel: suppliers はこのツリーのスキーマに無いため businessModel には付けていません。仕入先の個別名称の印字はありません。
- businessStructure: 連結子会社は株式会社グローアップ（議決権の所有割合100.0％）、Attack株式会社（同100.0％）、ディー・フォー・ディー・アール株式会社（同80.0％）、オーエムネットワーク株式会社（同100.0％）の４社で、いずれもHRソリューションに属し、非上場です。特定子会社に該当する会社はありません。
- businessStructure: セグメント別の従業員数は、マーケティングソリューション78人、HRソリューション343人、全社（共通）48人です。
- history: 沿革に印字された本社移転や支社の開設・移転は、体制の主要な変遷ではないため行に含めていません。合同会社シンタックスの子会社化（2014年）と吸収合併（2019年）も行には含めていません。
- industry: 主たる業界は it としました。東証の業種は情報・通信業であり、事業の中心はテキストマイニング技術を基盤とするSaaS型ソリューションの提供です。HRソリューションは人事領域向けですが、提供形態はソフトウェアサービスであるため it のみとしました。
- relatedCompanies: 関連会社候補はすべて語句の一致によるもので、相手先について取引・提携・資本関係を述べる印字はありません（rent＝「タレントパレット」の文字列の一部、en＝「エンジン」、alpha及びalpha-4760＝社名の「プラスアルファ」、base-4481＝「技術をベースに」、port＝「サポート」、kohsoku＝「高速に進める仕組み」、land＝「ブランド」、lec＝「フレックスタイム制」、vision＝「ビジョン」、core＝「技術をコアとして」、king＝「ランキング化」、step＝「ステップメール」、career＝「キャリア」、the-lead＝「リードしており」、ishin＝気候変動シナリオの記述中の語句、seki＝ISMS認証の記述中の語句、nissin＝新株予約権の行使期間の印字中の語句）。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社（信託口）は大株主の状況に印字されていますが、信託口であり事業上の関係の印字がないためリンクしていません。
- relatedCompanies: 当社が保有する純投資目的以外の投資株式は非上場株式10銘柄のみであり、上場会社の特定投資株式の印字はありません。
- relatedCompanies: セグメント情報等の主要な顧客ごとの情報は、外部顧客への売上高の10％以上を占める相手先がないため記載が省略されています。
- relatedCompanies: 連結子会社４社はすべて非上場で関連会社候補に含まれていないためリンクしていません。
- terms: 助言のみ。用語の追加提案はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
