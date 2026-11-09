# ロイヤルホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ロイヤルホールディングス株式会社 |
| 証券コード | 8179 |
| docID（データを取り出した文書） | `S100XX3T` |
| 原本 docID | `S100XSL6` |
| 提出日（原本） | 2026-03-24 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XX3T／有効文書 S100XX3T（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XX3T.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ロイヤルホールディングス株式会社 / 8179 / docID S100XSL6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
royal-holdings: 10 件の数値を有報XBRLと照合
有報: ロイヤルホールディングス株式会社 訂正有価証券報告書－第77期(2025/01/01－2025/12/31) (docID S100XX3T)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第77期(2025/01/01－2025/12/31)、docID S100XX3T）を有効文書としてこのパックを作った。原本は docID S100XSL6。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはInformationAboutOfficersTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
royal-holdings: 本文の金額 17 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100XX3T）です。訂正は役員に関する節のみで、主要財務は原本（S100XSL6）と同一のため、needsReviewには入れていません。
- businessModel: 2026年1月1日付の株式分割（普通株式1株につき2株）は提出後の資本政策のため、needsReviewには入れていません。
- businessModel: 中期経営計画の定量目標の数値は、本文の規則により strategy には書きませんでした。
- businessStructure: 事業は報告セグメントである外食事業、コントラクト事業、ホテル事業、食品事業の4つと、報告セグメントに含まれない「その他」を、外部顧客への売上高の大きい順に並べました。
- businessStructure: 子どもの売上高は、セグメント情報の収益の分解情報の印字どおりです。
- businessStructure: 2026年1月1日付の株式分割（普通株式1株につき2株）は提出後の資本政策のため、needsReviewには入れていません。
- history: 沿革は有報の【沿革】の印字から15件を選びました。
- history: 2026年1月1日付の株式分割（普通株式1株につき2株）は提出後の資本政策のため、needsReviewには入れていません。
- industry: 主たる業界は、売上高が最も大きな報告セグメントである外食事業から食品としました。
- relatedCompanies: ダスキン: 2025年12月31日現在1.41％の大株主ですが、取引・提携の記載がないため結びませんでした。
- relatedCompanies: 三越伊勢丹ホールディングス: 特定投資株式として保有していますが、保有目的が定型句のみで取引関係の記載がないため結びませんでした。なお、有報が当社株式の保有者として記載するのは子会社の株式会社三越伊勢丹です。
- relatedCompanies: ふくおかフィナンシャルグループ・三菱ＵＦＪフィナンシャル・グループ・みずほフィナンシャルグループ・西日本フィナンシャルホールディングス: 特定投資株式として保有していますが、保有目的が定型句のみで金融取引以外の関係の記載がないため結びませんでした。
- relatedCompanies: ハブ: 特定投資株式として保有していますが、保有目的が定型句のみで取引関係の記載がないため結びませんでした。
- relatedCompanies: 日本航空: 沿革に1951年の日本航空国内線営業開始の記載がありますが、現在の取引・提携の記載がないため結びませんでした。
- relatedCompanies: あらた: 「あらたな取り組み」の断片一致のみで、会社としての記載がないため結びませんでした。
- relatedCompanies: ランド・高速・田谷・エン・ビジョン・キング・ポート・テイン・パス・コロナ・リードなど: 断片一致のみで、会社としての取引・提携の記載がないため結びませんでした。
- relatedCompanies: 双日ロイヤルカフェ・双日ロイヤルインフライトケイタリング・ジャルロイヤルケータリング・ケイ・アンド・アール・ホテルデベロップメント・SUSHI-TEN USA Inc.: 持分法適用関連会社ですが非上場のため結びませんでした。
- relatedCompanies: 連結子会社9社: すべて非上場のため結びませんでした。
- terms: 助言: 「セントラルキッチンシステム」は用語集の登録候補になります。集中調理方式で、複数の店舗へ料理を供給する仕組みのことです。
- terms: 助言: 「コントラクト事業」は用語集の登録候補になります。法人からの委託により、空港や高速道路などの施設内で飲食店を運営する事業のことです。
- terms: 助言: 「業務食」は用語集の登録候補になります。グループ外の企業向けに製造する食品のことです。
- terms: 助言: 「フローズンミール」は用語集の登録候補になります。冷凍した食事のことで、家庭用の「ロイヤルデリ」として販売しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ホテル事業 → 提案: hotels。「リッチモンドホテル」等を全国に展開するホテル事業は報告セグメントですが、閉じた分類にホテルを表す値がありません。主たる業界は外食事業から食品としました。
