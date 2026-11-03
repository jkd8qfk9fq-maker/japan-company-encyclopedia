# 共英製鋼 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 共英製鋼株式会社 |
| 証券コード | 5440 |
| docID（データを取り出した文書） | `S100YGQP` |
| 原本 docID | `S100YGQP` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGQP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 共英製鋼株式会社 / 5440 / docID S100YGQP（id は英語表記「KYOEI STEEL LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 0 件） |
| history | completed | 0 | history-agent の成果物あり（警告 0 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kyoei-steel: 10 件の数値を有報XBRLと照合
有報: 共英製鋼株式会社 有価証券報告書－第82期(2025/04/01－2026/03/31) (docID S100YGQP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kyoei-steel: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessStructure: 事業の並びは【セグメント情報】の外部顧客への売上高の順（海外178,988・国内125,527・環境リサイクル5,945百万円）。「その他」は報告セグメントに含まれないため最後。
- industry: 鉄鋼の業界区分が無いため、最も近い machinery を暫定にした。
- relatedCompanies: related-candidates.json が証拠パックに無く、nippon-steel は掲載済み企業（src/data/companies/nippon-steel.json）として確認した。
- relatedCompanies: 阪和興業：2025年3月期の主要顧客（売上32,920百万円）で、2026年3月期は10％未満で記載なし。現在の関係の根拠が足りないため結ばない。
- relatedCompanies: 合同製鐵：中山鋼業の株主間協定の相手と政策保有株式。掲載済みか未確認で、取引関係の記述が薄いため結ばない。
- relatedCompanies: メタルワン・三井物産・丸紅伊藤忠スチール：ベトナム子会社の株主間協定の相手。候補に無く結ばない。
- terms: 用語の候補：電気炉、鉄スクラップ、異形棒鋼（鉄筋）、ビレット、ミニミル、メスキュード（医療廃棄物の無害化溶融処理）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 共英製鋼の主たる事業（鉄鋼製品の製造販売） → 提案: steel 鉄鋼（または 鉄鋼・金属）。売上の大半は国内外の鉄鋼事業だが、閉じた分類に鉄鋼・金属が無い。
