# 横浜フィナンシャルグループ — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社横浜フィナンシャルグループ |
| 証券コード | 7186 |
| docID（データを取り出した文書） | `S100YDG1` |
| 原本 docID | `S100YA32` |
| 提出日（原本） | 2026-06-11 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YDG1／有効文書 S100YDG1（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDG1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社横浜フィナンシャルグループ / 7186 / docID S100YA32（id は英語表記「Yokohama Financial Group, Inc.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 6 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 5 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yokohama-financial-group: 10 件の数値を有報XBRLと照合
有報: 株式会社横浜フィナンシャルグループ 訂正有価証券報告書－第10期(2025/04/01－2026/03/31) (docID S100YDG1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第10期(2025/04/01－2026/03/31)、docID S100YDG1）を有効文書としてこのパックを作った。原本は docID S100YA32。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（CompanyHistoryTextBlock・OverviewOfAffiliatedEntitiesTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 訂正有価証券報告書－第6期(2021/04/01－2022/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第7期(2022/04/01－2023/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第8期(2023/04/01－2024/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 訂正有価証券報告書－第9期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
yokohama-financial-group: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから「2026年3月期」。訂正有報を有効文書とした。
- businessModel: 銀行業の単一セグメントで、収益の内訳・顧客層・資金運用の内訳は証拠パックの範囲では確認できず書かなかった。md-and-a.txt は長いため、数値は5年表の売上（連結経常収益）と純利益だけを使った。
- businessModel: 「地域にとってなくてはならない金融グループ」は【事業の内容】の記載どおり。経営管理・預金取引・金銭貸借は【関係会社の状況】の「当社との関係内容」欄から。
- businessModel: 営業利益・経常利益・総資産などの印字は、規則により本文に書いていない。
- businessModel: brief.md の中にしかない数値は使っていない。
- businessStructure: 決算期は表紙のDEIから取った（2025年4月1日〜2026年3月31日、第10期）ので「2026年3月期」。訂正有報（S100YDG1、原本S100YA32）を有効文書とした。主要財務は原本と同一で、本文は有効文書から書いた。
- businessStructure: 当社グループは銀行業の単一セグメント。【関連情報】もサービスごとの情報を省略しており、children に使える区分も金額もない。そのため銀行業と、金額が印字されていない銀行以外の事業の2ノードにし、後者を最後に置いた。
- businessStructure: 銀行以外の事業の対象会社は【関係会社の状況】の「主要な事業の内容」欄どおり。バンクカードサービス・東日本銀ジェーシービーカードは有報が「事務代行業務」「クレジットカード業務」と印字しており、description では『カード関連業務』とまとめた。はまぎんビジネスチャレンジド（事務代行業務）は省いた。
- businessStructure: 横浜銀行の経常利益・当期純利益・純資産・総資産などの印字は書いていない（経常収益のみ引用）。
- businessStructure: listings の market「プライム」は表紙の「東京証券取引所プライム市場」から。shortNameEn は有報に略称の印字がなく書かなかった。
- businessStructure: brief.md の中にしかない数値は使っていない。
- history: 訂正有報（text-change）の沿革は有効文書の history.txt から書いた。原本の記述は参照していない。
- history: 沿革の表は年月が各事象の直前に印字された通常の形で、崩れはなかった。
- history: MILIZEの議決権比率は、沿革（取得時）の44.41％と、関係会社の状況（2026年3月31日現在）の46％が別々に印字されている。その間の変化の説明はないため、時点を付けて両方を書いた。
- history: 横浜銀行・東日本銀行・両行の創業年は有報に印字がなく書かなかった。リンク記法は、掲載済み企業との同一性を確認していないため使っていない。
- history: brief.md の中にしかない数値は使っていない。
- industry: 銀行業の単一セグメントのため、金融のみ。
- relatedCompanies: 証拠パックに related-candidates.json が無く、同一性を確認できる掲載済み企業の候補がないため、結んだ相手はない。
- relatedCompanies: 関係会社の状況に載る子会社・関連会社（横浜銀行、東日本銀行、神奈川銀行、浜銀TT証券、MILIZE、PT Bank Resona Perdaniaなど）は、いずれも掲載済み・上場の確認ができず結ばなかった。
- terms: 用語の候補（助言）: 経常収益（銀行が売上高の代わりに使う項目）、持分法適用関連会社、特定子会社、銀行持株会社。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
