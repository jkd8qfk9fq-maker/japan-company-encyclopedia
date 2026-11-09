# RIZAPグループ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＲＩＺＡＰグループ株式会社 |
| 証券コード | 2928 |
| docID（データを取り出した文書） | `S100YF9Y` |
| 原本 docID | `S100YF9Y` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YF9Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＲＩＺＡＰグループ株式会社 / 2928 / docID S100YF9Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
rizap-group: 10 件の数値を有報XBRLと照合
有報: ＲＩＺＡＰグループ株式会社 有価証券報告書－第23期(2025/04/01－2026/03/31) (docID S100YF9Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
rizap-group: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「RIZAPグループ株式会社」が EDINET の提出者名「ＲＩＺＡＰグループ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: Bitcoin Japan株式会社は2025年3月期に非継続事業に分類され、2025年8月に株式の一部を譲渡して持分法適用関連会社へ移行し、2025年11月に持分法適用関連会社から除外されました。第19期以降の売上収益及び税引前当期利益は、非継続事業を除いた継続事業の金額である旨をfinancialNotesに記載しました。
- businessModel: 2026年5月14日の取締役会で自己株式の取得を決議しました。提出後の資本政策のため、本文には反映していません。
- businessStructure: 事業は、セグメント注記の外部顧客への売上収益が大きい順に並べました。
- businessStructure: 2026年5月14日の取締役会で自己株式の取得を決議しました。提出後の資本政策のため、事業の内容には反映していません。
- history: 沿革は15件に絞りました。省いた主な行：2005年1月と2006年6月の本社移転、2011年12月のアスティの子会社化、2012年4月のエンジェリーベの子会社化、2012年6月の本社移転、2015年4月のIFRS任意適用、2017年4月のトレセンテの子会社化、2017年8月の五輪パッキングの子会社化、2018年3月のサンケイリビング新聞社の子会社化、2018年4月のメルディア RIZAP 湘南スポーツパートナーズの設立、2018年6月の公募増資、2021年3月から2022年6月のREXTグループの再編、2023年1月の本社移転、2023年8月のchocoZAP会員数80万人突破、2025年8月と11月のBitcoin Japanに関する出来事、2026年3月の湘南ベルマーレ株式の譲渡。
- industry: 主たる業界は、2026年3月期の外部顧客への売上収益が最も大きいライフスタイル事業と、東証の業種分類が小売業であることから小売としました。
- relatedCompanies: RIZAP株式会社は連結子会社ですが上場していないため結びませんでした。
- relatedCompanies: REXT Holdings株式会社は連結子会社ですが上場していないため結びませんでした。
- relatedCompanies: Bitcoin Japan株式会社は、2025年8月に株式の一部を譲渡して持分法適用関連会社へ移行し、2025年11月に持分法適用関連会社から除外され、その他の金融資産へ振り替えたため、2026年3月31日現在は関係会社に当たらず結びませんでした。
- relatedCompanies: CBM株式会社は2026年3月31日現在29.73％を保有する筆頭株主ですが、上場していないため結びませんでした。
- relatedCompanies: セキ、ランド、キング、ステップ、ベース、フリー、コア、日新、ポート、鈴木、テクノロジーズ、アミューズ、フジ、レイ、ビジョンは断片一致のみで、有報がその相手について取引や提携を述べていないため結びませんでした。
- terms: 新たに提案する用語はありません。「chocoZAP」や「RIZAP」は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] ヘルスケア・美容事業 → 提案: fitness。コンビニジム「chocoZAP」やパーソナルトレーニングジム「RIZAP」の運営など、フィットネス・美容事業を表す閉じた分類の値がありません。
