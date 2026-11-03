# ハピネット — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ハピネット |
| 証券コード | 7552 |
| docID（データを取り出した文書） | `S100YCH4` |
| 原本 docID | `S100YCH4` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCH4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ハピネット / 7552 / docID S100YCH4（id は英語表記「HAPPINET CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
happinet: 10 件の数値を有報XBRLと照合
有報: 株式会社ハピネット 有価証券報告書－第58期(2025/04/01－2026/03/31) (docID S100YCH4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
happinet: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の状況…）

## エージェントの判断記録（fragment warnings）

- businessModel: perspectives は有報の経営方針の節を読んでいないため省略。
- businessModel: 財務の注記に当たる変則決算・会計基準変更はなく financialNotes は空。
- businessStructure: 事業の並びはセグメント注記の外部顧客への売上高の順（玩具、ビデオゲーム、アミューズメント、映像音楽）。MD&A の順とは異なる。
- businessStructure: セグメント利益・損失は本文に書かない。
- history: 沿革表は読めたため行順の対応づけは不要。数多い子会社の取得・合併のうち主要な節目だけを選んだ。
- industry: 玩具・ゲーム・映像音楽の卸売が売上の大半。最も近い値として entertainment を選んだ（卸売業を直接表す値は無い）。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確認できないため、結んだ相手は無い。
- relatedCompanies: 株式会社バンダイナムコホールディングス: その他の関係会社（被所有26.5%）だが候補ファイルが無く、掲載済みか確認できないため結ばず。
- relatedCompanies: 株式会社バンダイ・株式会社BANDAI SPIRITS: 主要仕入先と印字されるが、上場会社ではない子会社で候補にも無いため結ばず。
- terms: 用語の助言: 「卸売（問屋）」「カプセル玩具」「トレーディングカード」を用語に立てると、事業の説明が読みやすくなる。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ハピネットの主たる業界 → 提案: 玩具・ホビー（または玩具・エンタメ商品の卸売）。玩具・ゲームなどの卸売りが中心で、既存の値では玩具流通を言い表せない。
