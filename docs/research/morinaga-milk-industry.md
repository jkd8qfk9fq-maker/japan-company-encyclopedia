# 森永乳業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 森永乳業株式会社 |
| 証券コード | 2264 |
| docID（データを取り出した文書） | `S100YIHY` |
| 原本 docID | `S100YIHY` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIHY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 森永乳業株式会社 / 2264 / docID S100YIHY（id は英語表記「Morinaga Milk Industry Co., Ltd.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
morinaga-milk-industry: 10 件の数値を有報XBRLと照合
有報: 森永乳業株式会社 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YIHY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第102期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
morinaga-milk-industry: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 利益の段は、本文に書ける当期純利益を使った（営業利益・経常利益は書かない規則）。
- businessModel: 売上高の増加の理由は証拠パックから確認できていないため書いていない。
- businessStructure: 報告セグメントは食品事業のみ。「その他」は有報が「報告セグメントに含まれない」と書く区分なので最後に置いた。
- businessStructure: 食品事業の製品別の売上高は有報に独立して印字されていないため、children は作らず金額も書かない。
- businessStructure: shortNameEn は表紙の英訳名から「Co., Ltd.」を除いたもの。
- businessStructure: listings の market は表紙の「東京証券取引所プライム市場」の印字による。
- history: 沿革の表は年月と概要が正しく並んでいたため、行どおりに使った。表の全行ではなく主な出来事だけを選んだ。
- industry: 売上の大半を占める報告セグメントは食品事業のため、food のみとした。
- relatedCompanies: related-candidates.json が証拠パックに無く、掲載済み企業から同一性を確認できる相手がいないため、関連企業は結ばなかった。
- relatedCompanies: 森永製菓：保有株式の表に「森永」ブランドの共有関係維持が保有目的として載るが、候補ファイルが無く同一性を確認できないため結ばなかった。
- relatedCompanies: 子会社・関連会社は有報の【関係会社の状況】に載るが、いずれも未上場（有報・届出書の提出なし）のため結ばなかった。
- terms: 用語の追加提案：市乳（牛乳・乳飲料など飲用の乳製品）、特定保健用食品（トクホ）、プラントベースフード、委託製造。既存の用語に無ければ検討してください。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
