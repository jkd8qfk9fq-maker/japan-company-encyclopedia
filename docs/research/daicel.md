# ダイセル — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ダイセル |
| 証券コード | 4202 |
| docID（データを取り出した文書） | `S100YBO0` |
| 原本 docID | `S100YBO0` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBO0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ダイセル / 4202 / docID S100YBO0（id は英語表記「Daicel Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daicel: 10 件の数値を有報XBRLと照合
有報: 株式会社ダイセル 有価証券報告書－第160期(2025/04/01－2026/03/31) (docID S100YBO0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第158期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daicel: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: customers は有報に顧客名の印字がないため空にした。
- businessModel: 目標の営業利益・純利益などの数値は本文に書かない規則のため、売上高の目標だけを書いた。
- businessStructure: 事業の並びは2026年3月期の外部顧客への売上高の大きい順。「その他」は報告セグメントに含まれない区分のため最後。
- businessStructure: 顧客名は有報に印字がないため customers は書かない。
- history: 沿革の表は崩れておらず、年月と事象は対応している。海外の現地法人設立など細かな行は主要な出来事に絞って省いた。
- industry: 主業界はエンジニアリングプラスチック・マテリアルなど売上の大半を占める化学品の報告セグメントで chemicals。
- industry: セイフティ事業（エアバッグ用インフレータ）は報告セグメントとして売上が開示されているため automotive を2つ目に付けた。スマート事業の半導体レジスト材料は製品の一つにとどまり、セグメント単位の半導体事業ではないため semiconductors は付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる上場の候補がないため、結ぶ相手はなし。
- relatedCompanies: ポリプラスチックス㈱・協同酢酸㈱などの連結子会社、ポリプラ・エボニック㈱などの持分法適用関連会社は、有報に上場の印字がなく（有価証券報告書を提出している会社はない旨の注記）、上場企業の候補にないため結ばない。
- relatedCompanies: 沿革に出る富士フイルムホールディングス㈱・KH ネオケム㈱などは過去の出来事で、現在の取引・資本関係の印字がないため結ばない。
- terms: 用語集への追加候補（助言）: インフレータ（エアバッグを膨らませるガス発生装置）、アセテート・トウ（酢酸セルロースの繊維の束）、エンジニアリングプラスチック、光学異性体分離カラム、ポリアセタール樹脂。既存の用語集の id は未確認のため、本文にリンクは張っていない。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
