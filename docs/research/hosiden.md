# ホシデン — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ホシデン株式会社 |
| 証券コード | 6804 |
| docID（データを取り出した文書） | `S100YI0D` |
| 原本 docID | `S100YI0D` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI0D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ホシデン株式会社 / 6804 / docID S100YI0D（id は英語表記「Hosiden Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hosiden: 10 件の数値を有報XBRLと照合
有報: ホシデン株式会社 有価証券報告書－第76期(2025/04/01－2026/03/31) (docID S100YI0D)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hosiden: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotes が配列でない — 無視しました
- businessModel: 営業利益・経常利益・為替差益は本文に書いていない（方針により）。
- businessModel: 任天堂㈱の売上高と割合は【主要な顧客ごとの情報】および販売実績の印字どおり。
- businessStructure: 並び順はセグメント注記の外部顧客への売上高（機構部品414,284 > 音響部品19,431 > 複合部品その他14,535百万円）。
- businessStructure: 当連結会計年度から従来の「表示部品」を「複合部品その他」に含めて表示。前期は変更後の区分で組み替え済みと有報が明記。
- businessStructure: shortNameEn は英訳名 Hosiden Corporation から法人格を除いたもの。
- businessStructure: wikipedia.json は無いため Wikipedia は使っていない。
- history: 有報の沿革表記「HOSIDEN VIETNAM(BAG GIANG)」は関係会社表の「BAC GIANG PROVINCE」から明らかな誤植と見て、地名の綴りを BAC GIANG に直して書いた。
- history: 沿革は2022年4月までで、それ以降の項目は有報に無い。
- industry: 電子部品の開発・製造販売が主たる事業で、全報告セグメントが電子部品。半導体向けの開示は無く、自動車は市場環境の文脈のみのため付けない。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確認できる掲載済み上場企業の候補が無いため、結んだ相手は無い。
- relatedCompanies: 任天堂㈱: 最大の顧客として有報に印字があるが、候補一覧に無く掲載済みidを確認できないため結ばない。
- relatedCompanies: 連結子会社21社（ホシデン精工㈱ほか）: 非上場で有報提出会社でもないため結ばない。
- terms: 用語集への追加提案: 「セットメーカー」（完成品メーカー）、「機構部品」（コネクタ・スイッチなど）があれば読者の助けになる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
