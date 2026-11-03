# 三愛オブリ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三愛オブリ株式会社 |
| 証券コード | 8097 |
| docID（データを取り出した文書） | `S100YH4U` |
| 原本 docID | `S100YH4U` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH4U.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三愛オブリ株式会社 / 8097 / docID S100YH4U（id は英語表記「SAN-AI OBBLI CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
san-ai-obbli: 10 件の数値を有報XBRLと照合
有報: 三愛オブリ株式会社 有価証券報告書－第95期(2025/04/01－2026/03/31) (docID S100YH4U)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
san-ai-obbli: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の減少理由は、MD&Aの長文行を確認しておらず、書いていない。
- businessModel: 戦略・強み（perspectives）は省いた。
- businessStructure: 事業の並びは外部顧客への売上高の順（石油、ガス、航空、化学品、その他）。MD&Aや事業の内容の順とは違う。
- businessStructure: セグメント利益は書かない方針のため省いた。
- history: 沿革は印字が連続した一行になっているが、年月と事象が対応して読めるため、そのまま使った。
- history: 旧商号（三愛石油）は、沿革の1952年の項目の商号と、2022年の商号変更の記載から読み取った。
- industry: 石油関連事業の外部顧客への売上高が大半を占めるため、エネルギーのみとした。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、結ばなかった。
- relatedCompanies: コスモエネルギーホールディングス㈱: 主要仕入先でキグナス石油㈱の資本業務提携先と印字があるが、候補ファイルが無く同一性を確認できない。
- relatedCompanies: 出光興産㈱: 主要仕入先と印字があるが、候補ファイルが無く同一性を確認できない。
- terms: 用語の候補: 特約店、油槽所、LPガス、キャッシュ・マネジメント・サービス（CMS）、ハイドラント式給油施設。既存の用語集に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
