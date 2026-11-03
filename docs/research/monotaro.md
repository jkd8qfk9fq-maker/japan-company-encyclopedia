# MonotaRO — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＭｏｎｏｔａＲＯ |
| 証券コード | 3064 |
| docID（データを取り出した文書） | `S100XSYP` |
| 原本 docID | `S100XSYP` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSYP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＭｏｎｏｔａＲＯ / 3064 / docID S100XSYP（id は英語表記「MonotaRO Co.,Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | business-structure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | related-companies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
monotaro: 10 件の数値を有報XBRLと照合
有報: 株式会社ＭｏｎｏｔａＲＯ 有価証券報告書－第26期(2025/01/01－2025/12/31) (docID S100XSYP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
monotaro: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社MonotaRO」が EDINET の提出者名「株式会社ＭｏｎｏｔａＲＯ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益など売上高と当期純利益以外の数値は本文に書いていません。
- businessModel: 強みや業界での位置づけは有報に会社自身の説明が見当たらないため perspectives から省きました。
- businessStructure: 単一セグメント（工場用間接資材販売業）で、【関連情報】の製品区分・地域別の金額は90％超のため記載が省略されており、children は作っていません。
- businessStructure: name は表紙の社名「株式会社ＭｏｎｏｔａＲＯ」から「株式会社」を除き半角にしたもの、shortNameEn は英訳名 MonotaRO Co.,Ltd. から法人格を除いたものです。
- businessStructure: listings の market は表紙が「東京証券取引所プライム市場」と印字しているため記載しました。
- history: 沿革は主要な出来事を選んで載せました。倉庫の賃借・解約、本社の細かな移転などは省いています。
- industry: 単一セグメントの通信販売（eコマース）で、事業の内容が「小売業」とする子会社を含むため、最も近い retail を選びました。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済みの上場企業として結べる相手を確認できませんでした。
- relatedCompanies: W.W.Grainger, Inc.（親会社、米国上場）: 掲載済み企業の候補に無く、company id を確認できないため結んでいません。
- relatedCompanies: 住友商事: 有報の本文を検索した範囲では現在の資本・取引関係の記述を確認できず、沿革の設立時の共同出資のみのため結んでいません。
- terms: 用語の助言: 「間接資材」（製品の原材料ではなく、工場運営で使う消耗品・補修用品）、「プライベートブランド」、「SEO（検索エンジン最適化）」、「ディストリビューションセンター」は読者に説明があると分かりやすい語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] MonotaRO の工場用間接資材のEC販売 → 提案: 産業資材流通（BtoB EC）。事業者向けの間接資材販売で、一般の小売や商社とは性格が異なるため
