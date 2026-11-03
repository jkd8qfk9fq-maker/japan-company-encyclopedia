# 小田急電鉄 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 小田急電鉄株式会社 |
| 証券コード | 9007 |
| docID（データを取り出した文書） | `S100YIM7` |
| 原本 docID | `S100YIM7` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIM7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 小田急電鉄株式会社 / 9007 / docID S100YIM7（id は英語表記「Odakyu Electric Railway Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 5 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
odakyu-electric-railway: 10 件の数値を有報XBRLと照合
有報: 小田急電鉄株式会社 有価証券報告書－第105期(2025/04/01－2026/03/31) (docID S100YIM7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書－第104期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第103期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第102期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
odakyu-electric-railway: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 営業利益・経常利益・セグメント利益・ROE・設備投資額などは本文に書いていない。
- businessModel: 財務の戦略・強みの disclosed 部分は、経営方針の節を読んでいないため省略。
- businessStructure: 事業の並びは【セグメント情報】の外部顧客への営業収益の大きい順（交通業178,787、生活サービス業155,100、不動産業84,844百万円）。
- businessStructure: セグメント利益は本文に書かない。
- history: 【沿革】の2010年以降の表は年月セルと事象が分かれて崩れている。2018年の「複々線運転開始」は、2018.3 の事象として他の行と順序が揃うものだけを採用し、2010～2013年と2020年以降（プライム移行の2022年を除く）の崩れた行は日付の裏付けが取れないため落とした。
- history: 2022年のプライム市場移行は、崩れた表の中でも事象が一意に特定でき、年が2022であることから採用。
- industry: 主たる業界は最大の報告セグメント（交通業）で運輸。不動産業は報告セグメントとして開示があるため2つ目に付けた。生活サービス業（百貨店・ホテル等）は合う値が複数にまたがるため付けていない。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業との同一性を確かめられないため、関連企業は結ばない。
- relatedCompanies: 神奈川中央交通㈱（持分法適用関連会社・議決権45.5％）: 有報提出会社だが、候補ファイルに無く同一性の根拠が足りない。
- relatedCompanies: 東海自動車㈱（連結子会社・59.6％）: 有報提出会社だが、候補ファイルに無く同一性の根拠が足りない。
- relatedCompanies: 東京地下鉄㈱・東急不動産㈱（新宿駅西口地区開発計画の事業主体）: 候補ファイルに無く、同一性の根拠が足りない。
- relatedCompanies: ㈱ヨーク・ホールディングス（小田急商事との業務提携基本契約）: 候補ファイルに無く、上場企業としての同一性の根拠が足りない。
- terms: 用語の候補（助言のみ）: 複々線化、相互直通運転、グループ通算制度、持分法適用関連会社

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
