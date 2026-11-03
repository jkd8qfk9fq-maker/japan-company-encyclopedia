# ＮＧＫ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＮＧＫ株式会社 |
| 証券コード | 5333 |
| docID（データを取り出した文書） | `S100YF7M` |
| 原本 docID | `S100YF7M` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF7M.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＮＧＫ株式会社 / 5333 / docID S100YF7M（id は英語表記「NGK Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ngk: 10 件の数値を有報XBRLと照合
有報: ＮＧＫ株式会社 有価証券報告書－第160期(2025/04/01－2026/03/31) (docID S100YF7M)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ngk: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「NGK株式会社（旧会社名　日本碍子株式会社）（注）　2025年6月26日開催の第159期定時株主総会の決議により、2026年4月1日から会社名を上記のとおり変更いたしました。」が EDINET の提出者名「ＮＧＫ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 顧客の種類は有報に社名がないため、製品の用途から一般的な区分を書いた。
- businessModel: brief に財務諸表の組替えの記載があるが、前期有報との重複年度は一致しているため financialNotes は空にした。
- businessStructure: 事業は外部顧客への売上高（2026年3月期：エンバイロメント399,469、デジタルソサエティ205,402、エネルギー＆インダストリー65,253百万円）の大きい順に並べた。
- businessStructure: customers は有報に顧客名の記載がないため、製品の用途から一般的な区分だけを書いた。
- businessStructure: ＮＧＫエレクトロデバイス㈱は表紙の社名表記に合わせた。
- history: 沿革の2019年の行は事象文が欠けているため使わなかった。
- industry: 最大の報告セグメントはエンバイロメント事業（自動車排ガス浄化用部品が中心）なので automotive を主にした。
- industry: デジタルソサエティ事業で半導体製造装置用製品を開示しているため semiconductors を、電子工業用製品とがいし・電力機器を踏まえ electronics を付けた。
- relatedCompanies: related-candidates.json が証拠パックに無く、同一性を確かめられる上場の相手が無いため、結んだ相手はなし。
- relatedCompanies: ノリタケ（日本陶器）: 1919年の分離独立という過去の出来事のみで、現在の取引・資本関係の記載が無い。
- relatedCompanies: メタウォーター・富士電機: 2008年の事業統合は過去の出来事で、2024年に持分法適用から外れており、現在の関係の記載が無い。
- relatedCompanies: 日本製鉄: 2015年の子会社株式の取得は過去1回限りの取引。
- terms: 用語の候補（助言）: がいし（碍子）、ハニカム構造のセラミックス（排ガス浄化用部品）、ＮＡＳ®電池（ナトリウム/硫黄電池）、ベリリウム銅。有報には説明が無いので、辞典側で別途確かめる必要がある。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ＮＧＫのエンバイロメント事業・エネルギー＆インダストリー事業 → 提案: セラミックス・素材。セラミックスを核にした部品・素材の会社を言い表す区分が無い。
