# 大黒天物産 — research log

Registered: 2026-11-04（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大黒天物産株式会社 |
| 証券コード | 2791 |
| docID（データを取り出した文書） | `S100YYHK` |
| 原本 docID | `S100YYHK` |
| 提出日（原本） | 2026-08-25 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YYHK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大黒天物産株式会社 / 2791 / docID S100YYHK（id は英語表記「DAIKOKUTENBUSSAN CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daikokutenbussan: 10 件の数値を有報XBRLと照合
有報: 大黒天物産株式会社 有価証券報告書－第40期(2025/06/01－2026/05/31) (docID S100YYHK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daikokutenbussan: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益は MD&A の印字（3,192億8百万円・36億3百万円）をそのまま使いました。売上高の増加の理由は会社の説明（25店舗の出店と1店舗の改装）だけです。
- businessModel: 純利益の減少の理由は有報に営業利益等の説明があるため、この本文では理由を書いていません。
- businessModel: brief の注意にある財務諸表の組替えは、売上高・純利益の範囲を変えるものとは読めず、financialNotes は書いていません（前期有報との修正再表示もなし）。
- businessModel: perspectives は strategy の disclosed だけにしました。競争優位・業界内の位置は有報に会社の説明が見当たらないため省きました。
- businessStructure: 報告セグメントは「小売事業」のみで、セグメント別の売上高は有報が省略しています。小売事業を先、「その他の事業」を後にしました（後者は報告セグメントではなく、金額も事業の内容の節に無いため）。
- businessStructure: 販売実績の表に一般食品・生鮮品・雑貨等の金額がありますが、【関連情報】の製品区分ではなくセグメントの代わりの表なので、children にせず金額も書いていません。
- businessStructure: 「ディオ」「ラ・ムー」「ザ・大黒天」は沿革・MD&Aに印字された店舗名・フォーマット名です。バリュー100の100円均一は沿革の記載から書きました。
- businessStructure: wikipedia.json は証拠パックに無く、使っていません。
- history: 沿革は年月と事象が連続して印字されており、崩れた表ではありません。
- history: 省いた行：店舗の移転・物流センターの移転（2001・2004・2010・2011・2015・2016年の移転）、2005年の四国・山陰1号店、2010年の九州1号店、2012年の北陸1号店、2013年の東海1号店、設立の子会社（ディープライス・恵比寿天・瀬戸内メイプルファーム）、マツサカ設立・事業譲受と2023年の吸収合併、2021年の東京支店、2023年の本社移転。重要度の判断で、誤りがあるわけではありません。
- history: 2013年の significance にある2020年5月2,000億円・2026年5月3,000億円は同じ沿革の行です。
- industry: 報告セグメントは「小売事業」のみ（食品を中心としたスーパーマーケット）なので retail だけにしました。
- relatedCompanies: related-candidates.json が証拠パックに無く、結べる同一性の根拠がある上場企業の候補がありません。1社も結んでいません。
- relatedCompanies: 株式会社ワッツ：2006年に合弁会社バリュー100を設立した相手だが、沿革の過去1回の出来事で、現在の取引・資本関係は有報に書かれていないため結ばない。
- relatedCompanies: 七福神株式会社：大株主（42.42％、2026年5月31日現在）だが、事業の内容や取引の記載がなく、掲載済みの上場企業としての同一性の根拠もないため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）・野村信託銀行（投信口）：信託口で、結ばない。
- relatedCompanies: 連結子会社（西源・小田商店・マミーズ・恵比寿天・瀬戸内メイプルファーム等）は未上場で候補にない。
- terms: 助言のみ。ESLP（エブリデイ・セーム・ロープライス：毎日同じ低価格で売る方式）は有報が「ＥＳＬＰ（エブリデイ・セーム・ロープライス）による地域最安値価格を目指す」と書く語で、用語として提案できます。本文では地の文で説明しており、リンクは使っていません。
- terms: 「ディストリビューションセンター（ＤＣ）」「チルドＴＣ」「生鮮ＰＣ」は物流の略語で、沿革に出てきます。用語として提案できますが、有報に定義がないため説明文の根拠が足りず、提案までにとどめます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
