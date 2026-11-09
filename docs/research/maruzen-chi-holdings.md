# 丸善CHIホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 丸善ＣＨＩホールディングス株式会社 |
| 証券コード | 3159 |
| docID（データを取り出した文書） | `S100Y0TV` |
| 原本 docID | `S100Y0TV` |
| 提出日（原本） | 2026-04-24 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y0TV.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E4%B8%B8%E5%96%84CHI%E3%83%9B%E3%83%BC%E3%83%AB%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%B9

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 丸善ＣＨＩホールディングス株式会社 / 3159 / docID S100Y0TV（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
maruzen-chi-holdings: 10 件の数値を有報XBRLと照合
有報: 丸善ＣＨＩホールディングス株式会社 有価証券報告書－第16期(2025/02/01－2026/01/31) (docID S100Y0TV)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-01-31","previousFiling":165557000000,"latestFiling":165780000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
maruzen-chi-holdings: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること
- 正式名称「丸善CHIホールディングス株式会社」が EDINET の提出者名「丸善ＣＨＩホールディングス株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年1月期の売上高の修正再表示（165,557百万円→165,780百万円）は、表示方法の変更による組替えのため、financialNotesに記載しました。誤りではありません。
- businessModel: 2025年6月に設立したテックリブ株式会社は持分法適用関連会社ですが、非上場のため関連企業には結んでいません。
- businessModel: 重要な後発事象は「該当事項はありません」でした。
- businessModel: 中期経営計画の営業利益・純利益の目標値は文章規則により省き、売上高の目標値だけを記載しました。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順にしました。その他事業は報告セグメントに含まれないため最後に置いています。
- businessStructure: 事業の金額はセグメント情報の外部顧客への売上高を使いました。
- history: 沿革は15件に絞りました。2010年1月の上場承認と丸善株式会社の上場廃止は、2010年2月の設立・上場の行に含めています。
- history: 「CHI」は「知」を意味する、という補足はWikipediaから使いました。
- industry: 書店での販売が売上高の最も大きな事業のため、小売を主たる業界としました。
- industry: 出版事業は報告セグメントとして開示されているため、メディアを2つ目の業界としました。
- relatedCompanies: ブックオフグループホールディングスの株式数は連結の特定投資株式の表の612,000株、富士山マガジンサービスの株式数は提出会社の表の350,000株を使いました（富士山マガジンサービスは連結の表には載っていません）。
- relatedCompanies: port: 「サポート」の語の断片一致のみで、ポート株式会社との取引・提携の印字はありません。
- relatedCompanies: seki: ambiguousで、情報セキュリティの語の断片一致のみです。
- relatedCompanies: base-4481: 「連結ベース」の語の断片一致のみです。
- relatedCompanies: vision: グループビジョンの語の断片一致のみです。
- relatedCompanies: land: 「分社化」の語の断片一致のみです。
- relatedCompanies: freee: 「バリアフリー」の語の断片一致のみです。
- relatedCompanies: innovation: 「イノベーション推進」の語の断片一致のみです。
- relatedCompanies: planet: 有報の丸善プラネット株式会社は連結子会社で、上場の株式会社プラネットとは別会社です。
- relatedCompanies: the-lead: 「業界の活性化をリード」の語の断片一致のみです。
- relatedCompanies: zero: 「残存価額をゼロ」の語の断片一致のみです。
- relatedCompanies: base: 「駿河屋BASE」はフランチャイズ加盟店の店舗名で、BASE株式会社との取引の印字はありません。
- relatedCompanies: daiwa: 「大和市」の語の断片一致のみです。
- relatedCompanies: en: 「パンデミック」の語の断片一致のみです。
- relatedCompanies: ic: 「ICタグ」の語の断片一致のみです。
- relatedCompanies: takashima-and-co: 「高島屋堺店」の語の断片一致のみで、高島株式会社との取引の印字はありません。
- relatedCompanies: takashimaya: 「MARUZEN髙島屋堺店」の閉店の記載のみで、株式会社髙島屋との取引・提携の印字はありません。
- relatedCompanies: taya: 「世田谷区」の語の断片一致のみです。
- relatedCompanies: yamadai: 「松山大街道店」の語の断片一致のみで、コードリストにもありません。
- relatedCompanies: misumi: 特定投資株式の表にありますが、当事業年度に全ての株式を売却済みです。
- relatedCompanies: 講談社・トーハン・小学館: 大株主ですが非上場で、掲載企業リストにありません。
- relatedCompanies: テックリブ株式会社: 持分法適用関連会社ですが非上場で、掲載企業リストにありません。
- relatedCompanies: トゥ・ディファクト: オンライン書店ビーケーワンの譲渡先ですが、掲載企業リストにありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
