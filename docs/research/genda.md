# GENDA — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＧＥＮＤＡ |
| 証券コード | 9166 |
| docID（データを取り出した文書） | `S100Y1F9` |
| 原本 docID | `S100Y1F9` |
| 提出日（原本） | 2026-04-28 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y1F9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＧＥＮＤＡ / 9166 / docID S100Y1F9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
genda: 10 件の数値を有報XBRLと照合
有報: 株式会社ＧＥＮＤＡ 有価証券報告書－第8期(2025/02/01－2026/01/31) (docID S100Y1F9)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-01-31","previousFiling":111786000000,"latestFiling":111777000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-01-31","previousFiling":3304000000,"latestFiling":3252000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-01-31","previousFiling":7305000000,"latestFiling":7254000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-01-31","previousFiling":114368000000,"latestFiling":114964000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-01-31","previousFiling":35690000000,"latestFiling":35638000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
genda: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社GENDA」が EDINET の提出者名「株式会社ＧＥＮＤＡ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の表示方法の変更（個別財務諸表の主要な費目からの役員報酬の省略）の記載がありますが、連結の売上高及び当期純利益の遡及修正ではありません。
- businessModel: 提出後の資本政策（第3回無担保社債70億円の発行、シンジケートローンによる借入）は warnings のみとし、needsReview には入れていません。
- businessModel: Player One取得に伴う新株予約権の行使条件として2030年1月期の連結EBITDAの記載がありますが、中期経営計画の目標ではないため strategy には書きませんでした。
- businessStructure: セグメントの並び順は、2026年1月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- history: 2025年11月に株式会社カジ・コーポレーションの全株式も取得していますが、同年度内に全株式を売却したため、沿革の15件には含めず warnings とします。
- history: 2025年11月にGENDA Playnation（旧Indigo Newco）の全株式も取得していますが、沿革の15件には含めず warnings とします。
- history: 2026年3月1日付でKiddleton, Inc.がGENDA Americas, Inc.へ、株式会社シン・コーポレーションが株式会社GENDA GiGO Technoへ社名変更していますが、提出後の事項のため沿革には含めず warnings とします。
- industry: 主たる業界は、売上高の最も大きいエンタメ・プラットフォーム事業（アミューズメント施設の運営）からエンターテインメントとしました。
- industry: 映画の配給やコンテンツ事業を行うエンタメ・コンテンツ事業があるため、メディアを2つ目に付けました。
- industry: 東証の業種分類はサービス業です。
- relatedCompanies: フリュー株式会社：特定投資株式として425,000株を保有し、保有目的は「同社との良好な取引関係の維持、強化」ですが、具体的な取引の印字がないため結びません。
- relatedCompanies: 株式会社コシダカホールディングス：特定投資株式として101,600株を保有し、保有目的は「同社との良好な取引関係の維持、強化」ですが、具体的な取引の印字がないため結びません。
- relatedCompanies: サイバーステップ株式会社：当事業年度に保有する全株式を売却したため結びません。
- relatedCompanies: 株式会社ラウンドワン：Kiddleton, Inc.との合弁会社を2023年9月に解散しており、現行の関係の印字がないため結びません。
- relatedCompanies: 株式会社ハローズ：2025年2月に吸収合併により消滅し、株式会社GENDA GiGO Entertainmentに承継されたため結びません。
- relatedCompanies: イオンファンタジー、エイベックス：役員の前職の記載のみで、現行の取引・提携の印字がないため結びません。
- relatedCompanies: 山梨中央銀行：借入先の記載のみで、事業上の提携の印字がないため結びません。
- relatedCompanies: 株式会社セガ：2020年に株式会社セガ エンタテインメントの株式を取得した相手ですが、非上場のため結びません。
- relatedCompanies: 株式会社ミダスキャピタル：主要株主のファンドの出資母体ですが、非上場のため結びません。
- relatedCompanies: 大株主の吉村英毅・ミダスB投資事業有限責任組合、片岡尚、ミダスキャピタルGファンド有限責任事業組合ほか：ファンド・個人・信託銀行のため、事業会社の大株主として結べる相手がありません。
- relatedCompanies: 親会社はありません。
- relatedCompanies: 連結子会社45社：すべて非上場または海外法人のため結びません。
- terms: 新たに提案する用語はありません。アミューズメント施設、プライズ、ミニロケーションなどの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
