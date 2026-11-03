# エスフーズ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エスフーズ株式会社 |
| 証券コード | 2292 |
| docID（データを取り出した文書） | `S100Y5H5` |
| 原本 docID | `S100Y5H5` |
| 提出日（原本） | 2026-05-21 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y5H5.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エスフーズ株式会社 / 2292 / docID S100Y5H5（id は英語表記「S Foods Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
s-foods: 10 件の数値を有報XBRLと照合
有報: エスフーズ株式会社 有価証券報告書－第60期(2025/03/01－2026/02/28) (docID S100Y5H5)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
s-foods: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 売上増の理由は MD&A を読んでいないため書いていない。
- businessModel: perspectives（戦略・強み）は省略。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客への売上高（2026年2月期）の大きい順。『その他』は報告セグメントに含まれないため最後。
- businessStructure: 『全社の売上高の大半』は製造・卸売の436,641百万円が連結売上高472,312百万円の大部分であることに基づく（比率は計算していない）。
- history: 沿革表の全行のうち、工場の新設・移転・認証取得などの設備関連の行は省いた。
- industry: 売上の大半を占める食肉等の製造・卸売事業（報告セグメント）で food と判断。
- relatedCompanies: 丸紅株式会社（その他の関係会社）：related-candidates.json が証拠パックに無く、掲載済み・上場の同一性を確認できないため結ばなかった。
- relatedCompanies: 株式会社オーエムツーネットワーク（子会社・東証スタンダード上場）：同上の理由で結ばなかった。
- terms: 用語の助言: 「サプライ・チェーン」「川上・川中・川下」「肥育」は読者に説明が要る可能性がある。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
