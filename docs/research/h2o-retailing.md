# エイチ・ツー・オー リテイリング — research log

Registered: 2026-11-02（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | エイチ・ツー・オー　リテイリング株式会社 |
| 証券コード | 8242 |
| docID（データを取り出した文書） | `S100YDD0` |
| 原本 docID | `S100YDD0` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-01 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YDD0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | エイチ・ツー・オー　リテイリング株式会社 / 8242 / docID S100YDD0（id は英語表記「H2O RETAILING CORPORATION」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
h2o-retailing: 10 件の数値を有報XBRLと照合
有報: エイチ・ツー・オー　リテイリング株式会社 有価証券報告書－第107期(2025/04/01－2026/03/31) (docID S100YDD0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
h2o-retailing: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「エイチ・ツー・オー リテイリング株式会社」が EDINET の提出者名「エイチ・ツー・オー　リテイリング株式会社」と違います
- 確認: [other-profit-wording] businessModel.flow[2].description: 売上高と当期純利益以外の利益に触れていないか確認する（…お客さまのほか訪日客も訪れます。連結損益計算書の売上高の10％以上を占める特…）

## エージェントの判断記録（fragment warnings）

- businessModel: 利益の段は営業利益・経常利益・特別損益の金額を書かず、当期純利益だけにしました。
- businessModel: 「総額売上高」（1,162,431百万円）は連結損益計算書の売上高ではないため本文に書かず、financialNotes で存在だけ触れました。
- businessModel: 「国内のお客さまのほか訪日客」は、MD&Aの国内売上・インバウンド売上の記載によります。
- businessStructure: 並び順は2026年3月期の外部顧客への売上高の順です（食品415,883／百貨店185,346／その他46,494／商業施設28,458百万円）。MD&Aの「総額売上高」の順や【事業の内容】の順とは異なります。4区分とも報告セグメントです。
- businessStructure: 各区分のセグメント利益（営業利益ベース）は本文に書いていません。
- businessStructure: 食品事業の合併・商号変更は2026年4月1日付で、有報提出（2026年6月23日）より前に完了しています。【事業の内容】はセグメント説明を合併前の2社名で書いているため、その旨を説明に添えました。
- businessStructure: 従業員数は【従業員の状況】の連結会社の状況（2026年3月31日現在）で、( )内は平均臨時雇用者数（外数）です。
- history: 【沿革】は年月と事象が連結して印字されていますが、各行の年月と事象は対応が読み取れたため、そのまま使いました。
- history: 店舗の開業・閉店、子会社の設立など多数の行は、会社の姿を決める出来事に絞るため省きました。
- history: 「のちの食品事業につながります」「中国の蘇州に続き」は、【事業の内容】のセグメント説明と子会社の記載（蘇州泉屋百貨有限公司、寧波阪急商業有限公司）からの整理です。
- industry: 食品事業（415,883百万円）と百貨店事業（185,346百万円）で外部顧客への売上高の大半を占め、どちらも小売のため retail を主たる業界にしました。
- industry: 商業施設事業は報告セグメントとして外部顧客への売上高28,458百万円が開示され、商業不動産賃貸管理を含むため real-estate を2つ目に付けました。
- relatedCompanies: related-candidates.json は証拠パックに無かったため、同一性は src/data/companies/hankyu-hanshin-holdings.json の掲載で確認しました。
- relatedCompanies: 阪急電鉄・阪神電気鉄道は阪急阪神ホールディングスの子会社で、不動産賃貸借の相手として書かれていますが、掲載済み企業として確認していないため個別には結んでいません。
- relatedCompanies: 海外・非上場の関連会社（全聯阪急麵包、CFIZ など）と、当社の連結子会社（上場企業ではない）は結んでいません。
- terms: 助言: 「消化仕入」（売れた分だけ仕入れとして計上する百貨店の取引形態）は、売上高と「総額売上高」の違いを読むのに必要な語です。用語集に無ければ追加を提案します。
- terms: 助言: 「持株会社」「インバウンド」も、この会社の説明を読むのに役立つ語です。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
