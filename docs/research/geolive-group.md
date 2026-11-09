# ジオリーブグループ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ジオリーブグループ株式会社 |
| 証券コード | 3157 |
| docID（データを取り出した文書） | `S100YI2B` |
| 原本 docID | `S100YI2B` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI2B.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ジオリーブグループ株式会社 / 3157 / docID S100YI2B（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
geolive-group: 10 件の数値を有報XBRLと照合
有報: ジオリーブグループ株式会社 有価証券報告書－第17期(2025/04/01－2026/03/31) (docID S100YI2B)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":1601000000,"latestFiling":1505000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":2779000000,"latestFiling":2676000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":89473000000,"latestFiling":89377000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":23302000000,"latestFiling":23206000000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
geolive-group: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年3月期の親会社株主に帰属する当期純利益などは、前期有報と今期有報で差異がありますが、企業結合に係る暫定的な会計処理の確定による遡及修正のため、financialNotes に記載し、needsReview には入れていません。
- businessModel: 中期経営計画の数値目標は、有報に売上高などの目標値の印字がないため本文には書いていません。
- businessStructure: セグメント情報の開示は省略されており、事業は【関連情報】の製品及びサービスごとの情報に基づいて区分しました。
- businessStructure: 「建材販売店・住宅会社等」129,236百万円は合板・建材・住宅設備機器の合計にあたるため、children には製品区分の5行を使いました。
- businessStructure: 製品別の内訳の合計は171,783百万円で、住宅資材販売事業の外部顧客への売上高171,785百万円と2百万円の差がありますが、有報の丸めによるもので、印字の金額をそのまま記載しています。
- businessStructure: その他事業の内訳の金額は印字されていないため、children には金額を付けていません。
- history: 当社は2009年10月1日に株式会社ジューテックにより単独株式移転の方法で設立されたため、沿革は株式会社ジューテックの沿革に引き続いて記載しています。
- history: 2017年の市場第二部への市場変更と市場第一部銘柄への指定は同年の出来事のため1行にまとめました。
- industry: 住宅資材の卸売が主たる事業のため、商社を主たる業界としました。
- industry: その他事業の物流・建築・工事請負・不動産は金額の内訳が開示されていないため、業界を付けていません。
- relatedCompanies: ノダは related-candidates.json で ambiguous とされていますが、有報に「㈱ノダ」と仕入先の印字があり、株式会社ノダと同一と判断して結びました。
- relatedCompanies: TOTOとLIXILは特定投資株式の表に仕入先として印字されていますが、related-candidates.json にないため結んでいません。
- relatedCompanies: イーグランドは特定投資株式の表に得意先として印字されていますが、2026年5月に子会社が保有する全株式を売却しており、コードリストにもないため結んでいません。
- relatedCompanies: 連結子会社24社はすべて非上場のため、子会社として結んでいません。
- relatedCompanies: 大株主の状況に載る事業会社（ベニア商会、DAIKEN、ユーエム興産、伊藤忠建材、SMB建材）は、非上場または related-candidates.json にないため結んでいません。
- relatedCompanies: en・port・career・path・base-4481・ishin・lec・rent は語の断片一致のみのため結んでいません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
