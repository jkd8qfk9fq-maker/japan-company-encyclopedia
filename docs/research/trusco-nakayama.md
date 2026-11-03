# トラスコ中山 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | トラスコ中山株式会社 |
| 証券コード | 9830 |
| docID（データを取り出した文書） | `S100XRJW` |
| 原本 docID | `S100XRJW` |
| 提出日（原本） | 2026-03-18 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRJW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | トラスコ中山株式会社 / 9830 / docID S100XRJW（id は英語表記「TRUSCO NAKAYAMA CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
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
trusco-nakayama: 10 件の数値を有報XBRLと照合
有報: トラスコ中山株式会社 有価証券報告書－第63期(2025/01/01－2025/12/31) (docID S100XRJW)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
trusco-nakayama: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 最上位 description は90文字以内に収めた。
- businessModel: 競争優位・業界内の位置づけは有報に会社自身の説明が乏しいため省いた。
- businessStructure: 事業は4つの報告セグメント（販売ルート別）を外部顧客への売上高の大きい順に並べた。
- businessStructure: 商品分類別の売上は全ルート共通の分類なので、ルートの products は主要な分類名だけを載せた。
- history: 沿革は表が崩れず年月と事象が対応していたので、そのまま使った。組織変更などの細かい行は省いた。
- history: 「DX銘柄2020」は沿革の令和２年８月の行に、デジタル戦略本部の名称変更と並んで印字されている。
- industry: 全セグメントが工具・作業用品の卸売なので、最も近い trading を暫定で選んだ。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業の候補が無いため、関連企業は結ばなかった。
- relatedCompanies: TRUSCO NAKAYAMA CORPORATION(THAILAND)LIMITED・PT.TRUSCO NAKAYAMA INDONESIA: 連結子会社だが掲載済み企業ではないので結ばない。
- relatedCompanies: 東洋スチール株式会社・ユニオンスチール株式会社: 関連会社（製品の製造・納入）だが、候補に無く上場の根拠も無いので結ばない。
- terms: 用語の追加候補: MRO（工場や現場で使う消耗品・補修用品の総称）、プロショップ（建築現場などで働く人向けの専門店）。既存の用語に無ければ検討。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] トラスコ中山の事業全体 → 提案: 専門卸売（工具・工場用副資材の卸売）。総合商社ではなく、工具・作業用品の専門卸売会社で、既存の業界値では言い表せないため。
