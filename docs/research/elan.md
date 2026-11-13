# エラン — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エラン |
| 証券コード | 6099 |
| docID（データを取り出した文書） | `S100XU87` |
| 原本 docID | `S100XU87` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XU87.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エラン / 6099 / docID S100XU87（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
elan: 10 件の数値を有報XBRLと照合
有報: 株式会社エラン 有価証券報告書－第32期(2025/01/01－2025/12/31) (docID S100XU87)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-12-31","previousFiling":3544987000,"latestFiling":3542588000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-12-31","previousFiling":21605967000,"latestFiling":21702645000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
elan: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との照合で2024年12月期の経常利益と総資産額が前期有報の印字と異なるが、主要な経営指標等の注記3に理由（企業結合に係る暫定的な会計処理の確定による取得原価の当初配分額の見直しの反映）が印字されているため、理由を financialNotes に記録し、登録数値は当期有報の印字を用いた。売上高と親会社株主に帰属する当期純利益は前期有報と一致していた。
- businessModel: 金額は千円印字を百万円に切り捨てて記載した（売上高55,448,687千円→55,448百万円、当期純利益2,767,760千円→2,767百万円）。
- businessModel: suppliers は【事業の内容】が当社グループの支払関係（洗濯代金等）を明示する一般名詞「リネンサプライ業者等」のみとし、businessIds は付けなかった。
- businessModel: MD&Aに印字された営業利益・経常利益の金額や売上総利益率等の比率は、本文の財務数値の規則により記載していない。
- businessModel: 重要な後発事象に該当する事項は証拠パックの本文に見当たらず、株式分割の印字もなかった。
- businessStructure: 報告セグメントは介護医療関連事業のみの単一セグメントであり、【関連情報】の製品及びサービスごとの情報は単一区分が90％超のため省略されている。子は単一セグメントのみとした。
- businessStructure: 連結子会社6社（エランサービス、琉球エラン、エランクルール、エラン・ロジスティクス、GREEN LAUNDRY JOINT STOCK COMPANY、TMC VIET NAM TRADING AND SERVICE JOINT STOCK COMPANY）と持分法適用会社クラシコはグループ会社であり、relatedCompanies には結ばず本構造に含めた。
- businessStructure: 金額は千円印字を百万円に切り捨てて記載した（55,448,687千円→55,448百万円）。
- history: 沿革表は年月セルと事象文が分離して印字された崩れた表を含む。2015年11月から2017年11月までの5つの年月セルと5つの事象、2018年7月から2024年10月までの20の年月セルと20の事象は、数が一致したため行順に対応づけた。
- history: 支店・営業所の開設は主要なものに絞り、その他の支店開設行は省いた。
- history: 資本金の金額は沿革に印字がなく、記載していない。
- industry: 主たる業界は、単一セグメントである介護医療関連事業に基づく。合う値が閉じた分類にないため retail を暫定とし、taxonomyGaps に記録した。
- relatedCompanies: classico（クラシコ株式会社）: 【関係会社の状況】に載る当社グループの持分法適用会社（議決権28.15％）であり、グループ会社であるため結ばず businessStructure に記載した。
- relatedCompanies: hikari-tsushin（株式会社光通信）: 【大株主の状況】に現れるのは光通信本人ではなく光通信ＫＫ投資事業有限責任組合（1.54％）であり、投資事業有限責任組合による純投資のため結ばなかった。
- relatedCompanies: trust（株式会社トラスト）: コードリストにない相手であり、本文の一致も一般語の誤検出のため結ばなかった。
- relatedCompanies: port、en、career、king、land、lec、vision、cover、ishin、zero、step、suzuki-6785: 一般語・部分一致による誤検出であり、有報に当該企業との取引・提携・資本関係の記載はないため結ばなかった。
- relatedCompanies: 連結子会社6社はグループ会社であり、relatedCompanies には結ばず businessStructure に記載した。
- terms: 助言: 用語「CSセット」は、当社グループが病院の入院者や介護施設の入所者に提供する、衣類・タオル類の洗濯サービス付きレンタルと日常生活用品の提供を組み合わせたサービスの名称である。料金は入院・入所日数で計算する日額制である。
- terms: 助言: 用語「リネンサプライ業者等」は、衣類やタオル類、シーツや枕カバー等のリネン製品を供給する事業者及び日常生活用品等販売業者等を指し、CSセットの運営の一部を担う。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] エランの主たる業界（介護医療関連事業） → 提案: 医療・介護関連サービス。閉じた分類に医療・介護分野のサービス業の値がない。主事業は病院・介護施設の入院・入所者向けのCSセット（衣類・タオル類の洗濯サービス付きレンタルと日常生活用品の提供）であり、日常生活用品の販売を含むため retail を暫定とした。
