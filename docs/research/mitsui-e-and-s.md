# 三井E&S — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社三井Ｅ＆Ｓ |
| 証券コード | 7003 |
| docID（データを取り出した文書） | `S100YKIO` |
| 原本 docID | `S100YKIO` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKIO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社三井Ｅ＆Ｓ / 7003 / docID S100YKIO（id は英語表記「MITSUI E&amp;S Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsui-e-and-s: 10 件の数値を有報XBRLと照合
有報: 株式会社三井Ｅ＆Ｓ 有価証券報告書－第123期(2025/04/01－2026/03/31) (docID S100YKIO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsui-e-and-s: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社三井E&S」が EDINET の提出者名「株式会社三井Ｅ＆Ｓ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高・当期純利益は brief.md の5年表の値（百万円）。決算期は表紙DEIの2026年3月期。
- businessModel: 顧客の地域は売上高の顧客所在地別表（日本236,374／アジア66,739、百万円）から順位だけを書き、金額は書いていない。
- businessModel: brief.md の注意（財務諸表の組替え）に対し、前期有報との重複年度は全て一致で修正再表示なし。報告セグメントの変更は前期分も新区分で開示されているため、全社の売上高・純利益の範囲には影響しないと判断した。
- businessModel: perspectives は有報から要約できる戦略の記述を読まなかったため省いた。
- businessStructure: 決算期は表紙のDEIで2026年3月期（第123期）。
- businessStructure: 並び順は2026年3月期セグメント注記の外部顧客への売上高: 舶用推進システム149,737／周辺サービス94,333／物流システム65,185／成長事業推進43,757／その他182（百万円）。その他は報告セグメントに含まれない区分なので末尾。本文には金額を書いていない。
- businessStructure: 報告セグメントは当期から4つに変更（前期まで海洋開発セグメントを構成した三井海洋開発を持分法の範囲から除外したため）。前期分は新区分で組み替えて開示されている。
- businessStructure: 三井E&S造船は2025年6月に持分法の範囲から除外されており、事業構造には含めていない。
- businessStructure: listings は表紙の市場区分（東京証券取引所プライム市場）による。
- history: 沿革は有報の【沿革】の年表から主要な10件を選んだ。子会社の設立・合併など細かい項目は省いた。
- history: 各 significance は有報の事実から読める範囲の要約。
- industry: 売上の最大の報告セグメントは舶用推進システム（舶用エンジン）で、物流システム（クレーン）、成長事業推進（産業機械）も機械製品のため machinery を主とした。半導体など他の業界に当たる報告セグメントはない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、関連企業は結んでいない。
- relatedCompanies: 加地テック: 有報提出会社の連結子会社（議決権51.3%）だが、掲載済みかどうかを確認できず見送り。
- relatedCompanies: 三井三池製作所・上海中船三井造船柴油机有限公司・市原バイオマス発電: 持分法適用関連会社だが、上場の確認ができず見送り。
- relatedCompanies: 常石造船（三井E&S造船の株式の譲渡先）: 一回限りの取引で、関係は沿革の出来事に書いた。
- relatedCompanies: 三井海洋開発: 過去に株式を売却した相手で、現在は持分法の範囲外のため結ばない。
- terms: 用語集への追加候補: 二元燃料エンジン（重油とガスなど2種類の燃料で動くエンジン）、コンテナターミナルマネジメントシステム。リンク記法は既存の term id を確認できなかったため本文では使っていない。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
