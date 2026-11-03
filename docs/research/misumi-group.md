# ミスミグループ本社 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　ミスミグループ本社 |
| 証券コード | 9962 |
| docID（データを取り出した文書） | `S100YB3N` |
| 原本 docID | `S100YB3N` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YB3N.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　ミスミグループ本社 / 9962 / docID S100YB3N（id は英語表記「MISUMI Group Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | business-model-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
misumi-group: 10 件の数値を有報XBRLと照合
有報: 株式会社　ミスミグループ本社 有価証券報告書－第64期(2025/04/01－2026/03/31) (docID S100YB3N)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
misumi-group: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社ミスミグループ本社」が EDINET の提出者名「株式会社　ミスミグループ本社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高・当期純利益の年度は2026年3月期（第64期）。
- businessModel: perspectives（戦略・強み）は、有報の経営方針の節を読んでいないため省いた。
- businessModel: 営業利益・経常利益・セグメント利益、受注高、のれんなどの金額は本文の規則により書いていない。
- businessModel: 財務諸表の組替えの記載は財務諸表の注記側にあり、証拠パックの本文ファイルでは見つからなかった。前期有報との重複年度は全て一致のため、財務に basis は付けない。
- businessStructure: 報告セグメントはFA事業・金型部品事業・VONA事業の3つ。並びは2026年3月期の外部顧客への売上高（VONA 192,516／FA 160,498／金型部品 88,368百万円）の大きい順で、有報が並べる順（FA・金型部品・VONA）とは違う。
- businessStructure: 3事業とも、有報の【事業の内容】は主要な子会社名と社数（37社・35社・16社）を示す。社数は事業をまたいで重なる会社を含む。
- businessStructure: セグメント利益、受注高、仕入高などの金額は本文の規則により書いていない。
- businessStructure: 表紙は市場区分として東京証券取引所プライム市場を印字している。
- history: 沿革の表は年月とセルが対応しており、崩れはない。
- history: 2022年9月のDTダイナミクス設立は2023年の項に併記した。
- history: 1988年の項の「売上の半分以上は日本の外」は、2026年3月期の日本177,221百万円が合計441,383百万円の半分未満であることから読める事実。
- industry: 3事業とも工場の自動機・金型・設備に使う機械部品を扱うため、machinery を主たる業界にした。最大のVONA事業は他社品を含む流通事業だが、扱うのは製造・自動化関連設備部品と間接材で、trading（商社）とは言い切れない。
- industry: 半導体は、MD&Aに通信・半導体関連向けの需要が堅調と市場環境の文脈で出るだけで、半導体向けの部材や装置を事業として開示していないため付けない。
- relatedCompanies: related-candidates.json が証拠パックにない。掲載済みの上場企業で、有報の本文に社名が出る相手が機械抽出されていないため、結ぶ相手はない。
- relatedCompanies: 連結子会社・関連会社は【関係会社の状況】の注3が「有価証券届出書又は有価証券報告書を提出している会社はありません」と書く。上場している相手ではないので結ばない。
- relatedCompanies: 大株主に事業会社が載っているかは、結ぶ根拠となる候補ファイルがないため確かめられていない。
- terms: terms は助言のみ。用語の候補: FA（ファクトリーオートメーション：工場の生産を機械で自動化すること）、MRO（工場で使う消耗品や間接材の総称）、標準部品（規格化して在庫から売る部品）、持株会社。
- terms: 本文にはリンク記法を使っていない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ミスミグループ本社の主たる業界 → 提案: 機械部品・産業資材の流通（メーカー兼流通）。メーカー事業と流通事業を併せ持ち、売上最大のVONA事業は他社品も扱う流通事業。machinery では流通の面を言い表せない。
