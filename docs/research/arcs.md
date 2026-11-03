# アークス — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アークス |
| 証券コード | 9948 |
| docID（データを取り出した文書） | `S100Y640` |
| 原本 docID | `S100Y640` |
| 提出日（原本） | 2026-05-25 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y640.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アークス / 9948 / docID S100Y640（id は英語表記「ARCS COMPANY,LIMITED」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
arcs: 10 件の数値を有報XBRLと照合
有報: 株式会社アークス 有価証券報告書－第65期(2025/03/01－2026/02/28) (docID S100Y640)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
arcs: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中長期目標のROE指標は投資用語に当たるため書かず、売上高の目標だけを書いた。
- businessModel: 営業利益・経常利益・売上総利益・販管費の増減はMD&Aにあるが、規則により書かなかった。
- businessModel: brief.mdに財務諸表の組替え・遡及適用の記載ありとの注意があるが、前期有報との5年分の数値は一致しており、financialNotesは書かなかった。
- businessStructure: 単一セグメントのため事業の並びは小売事業を先、売上高が独立開示されていないその他の事業を最後にした。
- businessStructure: 子会社の所在地から、小売事業の地域を北海道・東北・北関東などと表した（オータニは栃木県、伊藤チェーンは宮城県）。
- businessStructure: listings の札幌証券取引所は表紙が市場区分を印字していないため market を省いた。
- history: 沿革表は約70行のうち主要な出来事を12件選んだ。小さな会社の吸収合併・清算・店舗移管は省いた。
- history: 沿革表の年月セルは行ごとに整っており、並べ替えや推測は不要だった。
- industry: 小売関連事業の単一セグメントで、食品スーパーが中心のため retail のみ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み・上場の同一性を確認できないため、結んだ相手はない。
- relatedCompanies: バローホールディングス: 新日本スーパーマーケット同盟の資本業務提携を述べているが、候補ファイルに無く同一性を確認できない。
- relatedCompanies: リテールパートナーズ: 同上。
- relatedCompanies: サンドラッグ: サンドラッグエースの合弁相手だが、候補ファイルに無く同一性を確認できない（持分法適用関連会社はサンドラッグエース自身で非上場）。
- relatedCompanies: カインズ・シジシージャパン: 取引・契約の記載はあるが、候補ファイルに無い。
- relatedCompanies: 子会社・持分法適用関連会社は、いずれも非上場のため結ばない。
- terms: 用語の候補: 純粋持株会社、共同集中仕入機構（CGC）、カテゴリーマネジメント、フランチャイズ契約、電子棚札、ネットスーパー。いずれも有報に説明があり、読者に補足が要る。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
