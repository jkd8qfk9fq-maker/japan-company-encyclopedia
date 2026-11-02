# NTN — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＴＮ株式会社 |
| 証券コード | 6472 |
| docID（データを取り出した文書） | `S100Y8YZ` |
| 原本 docID | `S100Y8YZ` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y8YZ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＴＮ株式会社 / 6472 / docID S100Y8YZ（id は英語表記「NTN CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ntn: 10 件の数値を有報XBRLと照合
有報: ＮＴＮ株式会社 有価証券報告書－第127期(2025/04/01－2026/03/31) (docID S100Y8YZ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ntn: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NTN株式会社」が EDINET の提出者名「ＮＴＮ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益は有報にあるが、規則どおり本文には書かず、当期純利益だけを書いた。
- businessModel: financialNotes は、変則決算・会計基準の変更など書くべき事実が無いため省いた（前期の純損失は profit 段で触れた）。
- businessModel: 構造的に分かれる事業は地域別セグメントで、製品区分（軸受他・CVJアクスル）は全地域共通のため、revenue 段で金額を示した。
- businessStructure: 報告セグメントは地域別（日本・米州・欧州・アジア他）。外部顧客への売上高の大きい順（米州→日本→欧州→アジア他）に並べた。
- businessStructure: 製品区分（軸受他 348,890百万円 / CVJアクスル 477,453百万円）は【関連情報】にあり、全セグメントが両方を扱うため地域ごとの事業には結びつけず、businessModel 側で触れる。
- businessStructure: relatedCompanies の候補ファイル（related-candidates.json）と wikipedia.json は証拠パックに無く、使っていない。
- history: 沿革表は年月と事象が正しく対応して読めたため、そのまま使った。件数が多いので主要な12件に絞り、省いた行（国内製作所の新設・合併、各国の現地法人の設立など）は落とした。
- industry: 報告セグメントは地域別で業界を決められない。有報が、等速ジョイントの大半と軸受の約半分が自動車業界向けと述べるため、自動車を主たる業界にした。産業機械向けの軸受も事業として開示しているので機械を2つ目に付けた。
- industry: 半導体向けは市場環境の文脈でも事業としても開示が見当たらず、付けていない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業として同一性を確かめられる相手がいないため、関連企業は結ばなかった。
- relatedCompanies: 関係会社の状況に載る子会社・関連会社（東培工業股份有限公司、台惟工業股份有限公司、Seohan-NTN Driveshaft USA CORP. など）は、候補に無い・上場の確認ができないため結ばなかった。
- relatedCompanies: 大株主の状況の事業会社の有無は確認できていない（信託銀行などが中心の可能性が高く、結べる根拠が無い）。
- terms: 用語集への追加候補（助言のみ）: 軸受（ベアリング）、等速ジョイント（CVJ）、アクスル軸受、OEM、アフターマーケット。既存の term id は確認していないため、登録の要否は人が判断する。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
