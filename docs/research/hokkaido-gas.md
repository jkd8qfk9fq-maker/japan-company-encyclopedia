# 北海道瓦斯 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 北海道瓦斯株式会社 |
| 証券コード | 9534 |
| docID（データを取り出した文書） | `S100YGOL` |
| 原本 docID | `S100YGOL` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGOL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 北海道瓦斯株式会社 / 9534 / docID S100YGOL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 13 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hokkaido-gas: 10 件の数値を有報XBRLと照合
有報: 北海道瓦斯株式会社 有価証券報告書－第180期(2025/04/01－2026/03/31) (docID S100YGOL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hokkaido-gas: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで前期有報との重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため、financialNotesは書きません。
- businessModel: 経営計画の数値目標（2030年度の連結売上高2,000億円など）は投資指標の語を含むため、strategyには書きません。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順です。「その他」は報告セグメントに含まれない区分のため最後に置いています。
- businessStructure: 札幌証券取引所への上場は有報の表紙に印字されていますが、市場区分の印字はないため、listingsには取引所のみ記載しています。
- history: 沿革の表で年月セルと事象文が分かれて印字されている箇所（2005年6月・2006年2月など）は、1つの年月欄に複数の事象が対応するため行順での対応づけができず、採用していません。
- industry: 主たる業界は、ガス・電力・熱のエネルギー事業が売上の大半を占める報告セグメントであることからエネルギーとしました。東証の業種分類も電気・ガス業です。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）：大株主だが信託銀行のため結ばない。
- relatedCompanies: 日本生命保険相互会社：大株主だが保険会社のため結ばない。
- relatedCompanies: 北海道銀行・北洋銀行：大株主だが銀行で、資金調達等の金融取引が理由のため結ばない。
- relatedCompanies: 北海道信用農業協同組合連合会：大株主だが非上場の金融機関のため結ばない。
- relatedCompanies: 札幌市：大株主だが自治体のため結ばない。
- relatedCompanies: 北海道瓦斯従業員持株会：大株主だが持株会のため結ばない。
- relatedCompanies: みずほ信託銀行（退職給付信託）・日本カストディ銀行（信託口）：大株主だが信託銀行のため結ばない。
- relatedCompanies: KDDI：特定投資株式の保有目的が「地域経済・社会の活性化」のみで、取引・提携の印字がないため結ばない。
- relatedCompanies: エア・ウォーター・石油資源開発・帝国繊維・飯野海運・JFEホールディングス：特定投資株式の保有目的が全銘柄共通の定型句のみで、具体的な取引の印字がないため結ばない。
- relatedCompanies: 北洋銀行・ほくほくフィナンシャルグループ・みずほフィナンシャルグループ・三井住友トラストグループ・第一生命ホールディングス：特定投資株式の保有目的が定型句のみで、金融機関のため結ばない。
- relatedCompanies: 北海道電力：特定投資株式の銘柄だが、related-candidates.jsonにないため結ばない。
- relatedCompanies: フレアス・レック・エン・キャリア・日新・セキ・ポート・ベース・フリー・ランド：社名の断片一致のみで、取引・提携・資本関係の印字がないため結ばない。
- relatedCompanies: 連結子会社9社・持分法適用関連会社8社：すべて非上場のため結ばない。
- terms: 新たに提案する用語はありません。都市ガス、LNG、エネルギーマネジメントなどの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
