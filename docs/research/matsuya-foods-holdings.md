# 松屋フーズホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社松屋フーズホールディングス |
| 証券コード | 9887 |
| docID（データを取り出した文書） | `S100YJ71` |
| 原本 docID | `S100YJ71` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ71.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社松屋フーズホールディングス / 9887 / docID S100YJ71（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
matsuya-foods-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社松屋フーズホールディングス 有価証券報告書－第51期(2025/04/01－2026/03/31) (docID S100YJ71)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
matsuya-foods-holdings: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画の数値目標は有報に印字されていないため、strategy.disclosed には入れていません。
- businessModel: 亀製麺は2025年10月に株式（100％）を取得しましたが、連結子会社8社の一覧に載っていないため financialNotes には含めていません。
- businessStructure: 単一セグメントのため、children は MD&A の形態別販売実績の区分と金額を使いました。国内直営店売上は173,388,900千円、外部販売売上は11,085,782千円で、合計は1,844億74百万円です。
- businessStructure: 子会社のメンテナンス・クリーニング・配送事業はグループ内の支援業務で、独立した事業として金額が開示されていないため事業にはしていません。
- businessStructure: 形態別販売実績の金額は千円単位の印字を、有報の本文の表記に合わせて億・百万円単位に読み替えています（百万円未満は切り捨て）。
- history: 設立時の資本金の金額は本文に書けないため記載していません。
- history: 2025年の富士ナチュラルファーミングの株式（49％）取得、2024年のベトナム子会社設立、2026年2月のシンガポール子会社設立、嵐山工場・富士山工場の開設などは、15件に絞るため省きました。
- industry: 飲食事業の単一セグメントで、牛めし・カレー・定食などを提供する飲食店の運営が主たる事業のため、food を主たる業界としました。
- relatedCompanies: matsuya（株式会社松屋）は、有報の「松屋」が自社の牛めし業態のブランド名であるため、別の会社の株式会社松屋とは結びませんでした。
- relatedCompanies: land・port・base-4481・career・zero・path・trust・daiwa・freee・ray・slogan・step は語の断片一致のみのため結びませんでした。trust はコードリストにありません。
- relatedCompanies: 大株主の瓦葺利夫・瓦葺一利・瓦葺香は個人、有限会社ティケイケイ・有限会社トゥイールは非上場、信託銀行は信託口、商工組合中央金庫は金融機関、松屋社員持株会は非事業会社のため結びませんでした。大和証券は0.78％の保有で取引・提携の印字がないため結びませんでした。
- relatedCompanies: 連結子会社8社はすべて非上場のため結びませんでした。
- relatedCompanies: 株式の保有状況では特定投資株式は該当事項がなく、上場株式の保有による関連企業はありません。
- relatedCompanies: フランチャイズ契約は加盟店との契約で、相手方が特定の上場企業ではないため結びませんでした。
- terms: 新たに提案する用語はありません。牛めし業態・とんかつ業態などの業態名は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
