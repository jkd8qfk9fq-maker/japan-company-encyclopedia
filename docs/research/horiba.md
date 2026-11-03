# 堀場製作所 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社堀場製作所 |
| 証券コード | 6856 |
| docID（データを取り出した文書） | `S100XSIJ` |
| 原本 docID | `S100XSIJ` |
| 提出日（原本） | 2026-03-23 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSIJ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社堀場製作所 / 6856 / docID S100XSIJ（id は英語表記「HORIBA, Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
horiba: 10 件の数値を有報XBRLと照合
有報: 株式会社堀場製作所 有価証券報告書－第88期(2025/01/01－2025/12/31) (docID S100XSIJ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
horiba: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…,090百万円で、前期比10.4％の増益でした。…）

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・ROE・営業利益目標・セグメント利益は本文に書かない方針のため省いた。
- businessModel: 地域別売上高は顧客の所在地基準で、アジアは中国を除く。
- businessStructure: 報告セグメントは2025年12月期の期首に「自動車」「環境・プロセス」「医用」「半導体」「科学」から3つに変更。前期数値は組替後。
- businessStructure: 業種に当たる値が無いため電機を暫定の主業界とした（industry 成果物の taxonomyGaps 参照）。
- businessStructure: セグメント利益は本文に書いていない。
- history: 沿革の約90行から主な12件を選んだ。子会社の設立・統合のみの行は省いた。
- history: 1949年の日本藺製品株式会社との合併（1970年）は、実質上の存続会社の経緯のため年表に入れず、1953年の設立に含めた。
- industry: 最大の報告セグメント「先端材料・半導体」（156,500百万円）は半導体製造装置向けの部材・計測機器が中心。自動車向けの試験装置も報告セグメント単位で開示されているが、環境計測も同じ区分に含まれるため自動車は付けなかった。
- relatedCompanies: related-candidates.json が証拠パックに無く、候補が無い。結べる掲載済み企業は無しとした。
- relatedCompanies: 連結子会社（堀場エステック、堀場アドバンスドテクノ、堀場テクノサービスなど）はすべて非上場で、掲載済み企業ではない。
- relatedCompanies: 親会社等は無い（有報「提出会社の親会社等の情報」）。
- relatedCompanies: 大株主の事業会社は無く、信託銀行のみのため結ばない。
- terms: 用語の助言: 「マスフローコントローラー」（ガスの流量を測り調整する機器）、「グレーティング（回折格子）」、「ラマン分光分析」、「蛍光X線分析」は、一般の読者に説明が要る語。用語集に無ければ追加を検討してほしい。リンクは使っていない。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 堀場製作所の主たる業界 → 提案: measurement-instruments（計測・分析機器）。測定・分析機器の製造販売が主業で、自動車・半導体・医療・環境にまたがるため、既存の値では言い表せない。
