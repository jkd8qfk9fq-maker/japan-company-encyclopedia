# エクセディ — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エクセディ |
| 証券コード | 7278 |
| docID（データを取り出した文書） | `S100YBAF` |
| 原本 docID | `S100YBAF` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBAF.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エクセディ / 7278 / docID S100YBAF（id は英語表記「EXEDY Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
exedy: 10 件の数値を有報XBRLと照合
有報: 株式会社エクセディ 有価証券報告書－第76期(2025/04/01－2026/03/31) (docID S100YBAF)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第75期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
exedy: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes は、変則決算・会計基準の変更などの特記事項が無いため書かない。
- businessModel: アイシン・日産の売上の金額は書かない（顧客別の金額は本文の財務数値の対象外）。
- businessStructure: 事業の並びは外部顧客への売上収益の大きい順（AT 188,325 > MT 75,461 > TS 12,784）。「その他」は報告セグメントに含まれない区分なので最後。
- businessStructure: 拠点・設備との対応づけは行っていない。
- history: 沿革の表は年月と事象の対応が読み取れたため、行順の対応づけは不要だった。
- industry: 報告セグメントの3区分はいずれも自動車用などの変速・駆動伝動部品で、売上の大半を占める。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、結んだ相手は無い。
- relatedCompanies: 株式会社アイシン: 業務提携（2001年7月）と販売取引は印字されているが、候補ファイルが無く上場・掲載の同一性を確認できない。2024年6月10日に関連当事者から外れたとも印字されている。
- relatedCompanies: 日産自動車株式会社: 顧客グループとしての記載のみで、取引の向き以上の根拠が無く、候補ファイルも無い。
- relatedCompanies: 株式会社アスター: 業務提携（2022年1月）の記載のみで、候補ファイルが無く同一性を確認できない。
- terms: 用語の助言: トルクコンバータ、クラッチ、2マスフライホイール、パワーシフトトランスミッション、湿式摩擦材は読者に説明があると役立つ。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
