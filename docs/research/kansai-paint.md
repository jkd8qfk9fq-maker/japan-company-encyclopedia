# 関西ペイント — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 関西ペイント株式会社 |
| 証券コード | 4613 |
| docID（データを取り出した文書） | `S100YHKQ` |
| 原本 docID | `S100YHKQ` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHKQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 関西ペイント株式会社 / 4613 / docID S100YHKQ（id は英語表記「KANSAI PAINT CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 3 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kansai-paint: 10 件の数値を有報XBRLと照合
有報: 関西ペイント株式会社 有価証券報告書－第162期(2025/04/01－2026/03/31) (docID S100YHKQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kansai-paint: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 決算期は表紙のDEIから2026年3月期（Japan GAAP・連結あり・修正再表示なし）。
- businessModel: 金額は【関連情報】の製品及びサービスごとの外部顧客への売上高（百万円）と主要な経営指標の売上高・純利益だけを書いた。製品区分の合計は589,795で連結売上高と一致。
- businessModel: 経常利益・セグメント利益・営業利益は本文に書いていない。純利益の増減の理由は有報に該当の説明を確認していないため書かない。
- businessModel: customers は取引先名が印字されていないため、販売経路の説明にとどめた。
- businessModel: industryPosition・competitiveAdvantage は、有報の記載から十分に書けないため省いた。
- businessStructure: 並び順は【セグメント情報】の2026年3月期「外部顧客への売上高」（百万円）：欧州162,738＞日本159,888＞インド138,358＞アジア68,064＞アフリカ51,748。「その他」8,996は報告セグメントに含まれない区分なので最後。
- businessStructure: 事業ごとの利益・資産の金額は書いていない。製品別の売上（自動車塗料など）は地域セグメントと別の軸なので、businesses の children にせず businessModel 側に書いた。
- businessStructure: 上場は表紙の「東京証券取引所プライム市場」から。
- businessStructure: セグメント『その他』の主な国は『アメリカ・メキシコ等』（注記）。事業の内容の『その他塗料事業』の持分法適用関連会社数などは書いていない。
- history: 沿革の事項のうち、主要な買収・設立・上場・移転を選んだ。工場新設・個別の子会社株式取得（日本化工塗料、KAT、カンペハピオ、カンペ商事、久保孝ペイントなど）は省いた。
- history: 2026年4月1日の久保孝ペイントの吸収合併は沿革の（注）にあり、有報提出（2026年6月23日）より前の日付なので完了として書いた（2002年の項目の significance 内）。
- industry: 塗料の製造販売が主な事業（【事業の内容】）なので chemicals を主たる業界にした。自動車塗料は製品区分の一つだが、報告セグメントは地域別で、自動車向けの事業が独立した報告セグメントではないため automotive は付けていない。
- relatedCompanies: 証拠パックに related-candidates.json が無く、結べる掲載済みの上場企業の候補が無いため、関連企業は空とした。
- relatedCompanies: Kansai Nerolac Paints Ltd.（連結子会社、議決権74.96％、ボンベイ証券取引所に上場）など海外の子会社・関連会社は、掲載済み企業の候補ではないため結んでいない。
- relatedCompanies: 大株主（日本マスタートラスト信託銀行・日本カストディ銀行の信託口、扇商會の議決権制限株など）は、信託銀行の純投資または事業会社の資本関係として結べる根拠が揃わないため結んでいない。
- terms: 用語の候補（助言のみ）：特約販売店（国内の販売経路）、調色（色を調合すること）、持株会社、特定子会社、報告セグメント（地域別）。既存の用語に無ければ追加を検討。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
