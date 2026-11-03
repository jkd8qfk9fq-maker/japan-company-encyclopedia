# 京王電鉄 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 京王電鉄株式会社 |
| 証券コード | 9008 |
| docID（データを取り出した文書） | `S100YF0G` |
| 原本 docID | `S100YF0G` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF0G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 京王電鉄株式会社 / 9008 / docID S100YF0G（id は英語表記「Keio Corporation」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
keio: 10 件の数値を有報XBRLと照合
有報: 京王電鉄株式会社 有価証券報告書－第105期(2025/04/01－2026/03/31) (docID S100YF0G)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
keio: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 戦略・強み（perspectives）は中期経営計画『HIRAKU 2030』の要約を書く余地がありますが、今回は省きました。
- businessModel: 営業収益・当期純利益の金額は、セグメント注記および主要な経営指標等の百万円の印字どおりに書いています。
- businessStructure: 事業は【セグメント情報】の外部顧客への営業収益の大きい順（生活サービス業136,363、交通業132,281、不動産業114,759、ホテル業59,690、建設設備業53,844百万円）に並べました。
- businessStructure: 報告セグメントは2025年度の期首に「運輸業・流通業・不動産業・レジャー・サービス業・その他業」から現在の5区分に変更されています。前期の数値は変更後の区分に組み替えられていますが、本文には当期の数値だけを書きました。
- businessStructure: セグメント利益（営業利益ベース）は本文に書かない方針のため省きました。
- businessStructure: 鉄道の路線名・営業キロは facilities.txt を読んでおらず、沿革に印字された京王線・井の頭線だけを書きました。
- history: 沿革は提出会社の沿革と関係会社の沿革から主要な出来事を選びました。ほかの関係会社の設立・株式取得は省いています。
- history: 1978年の京王新線開通は1980年の出来事の説明の中に含めました。
- industry: 最大の報告セグメントは生活サービス業ですが、小売・飲食・旅行などの集合で、会社の本業は鉄道・バスの交通業のため運輸を主たる業界にしました。不動産業は報告セグメントとして外部収益が開示されているため2つ目に付けました。
- relatedCompanies: related-candidates.json が証拠パックにないため、掲載済みの上場企業の候補はありません。
- relatedCompanies: 【関係会社の状況】の連結子会社は、有価証券届出書または有価証券報告書を提出している会社はないと注記されており、上場企業ではないため結びません。
- terms: 助言工程なのでエントリーには書き込みません（「requiredTermIds」は無視）
- terms: 助言工程なのでエントリーには書き込みません（「proposedTerms」は無視）
- terms: terms は助言だけの工程で、エントリーには書き込まれません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
