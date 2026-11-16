# ニイタカ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ニイタカ |
| 証券コード | 4465 |
| docID（データを取り出した文書） | `S100Z0B0` |
| 原本 docID | `S100YYMP` |
| 提出日（原本） | 2026-08-26 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | S100Z0B0／有効文書 S100Z0B0（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z0B0.pdf / `wikipedia` https://ja.wikipedia.org/wiki/%E3%83%8B%E3%82%A4%E3%82%BF%E3%82%AB

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ニイタカ / 4465 / docID S100YYMP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 14 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 2 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
niitaka: 10 件の数値を有報XBRLと照合
有報: 株式会社ニイタカ 訂正有価証券報告書－第64期(2025/06/01－2026/05/31) (docID S100Z0B0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第64期(2025/06/01－2026/05/31)、docID S100Z0B0）を有効文書としてこのパックを作った。原本は docID S100YYMP。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはOtherReferenceInformationTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
niitaka: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 出典「wikipedia」: EDINET 以外のホスト（ja.wikipedia.org）。許可リストにある。一次資料かどうかは人が確認すること

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は主要な経営指標等の千円印字を百万円に切り捨てて表記した（24,619,486千円→24,619百万円、1,900,463千円→1,900百万円、セグメント外部売上高も同様）。増減率は有報の印字どおり（売上高前期比3.8％増）。
- businessModel: 訂正有価証券報告書（S100Z0B0、2026年９月４日提出）が有効文書。分類はrecord-onlyで、財務数値・本文は原本（S100YYMP）と同一であり、差異はOtherReferenceInformationTextBlockのみのため、needsReviewには入れず出典は訂正有報に向けた。
- businessModel: 中期経営計画・長期目標の数値目標（長期目標：連結売上高400億円以上・連結営業利益40億円以上・ROE10％以上、ＮＸ２０２８最終年度目標：売上高275億円以上・営業利益18億円以上・ROE８％以上・DOE３％以上）は投資・利益指標のため本文・戦略には書かず、ここに記録する。
- businessModel: 期後の自己株式取得の決議（2026年７月13日取締役会）は資本政策のため、重要な後発事象としてneedsReviewには入れず、ここに記録する。
- businessModel: 財務戦略の記述にある非中核事業子会社１社の株式譲渡は当期中に完了した事項であり、相手先は印字されていないため本文には書いていない。
- businessModel: suppliersはこのツリーの旧スキーマに無いため省略した（原材料購入先の事実はrelatedCompaniesのテイカ行に記載）。
- businessStructure: セグメントの外部顧客への売上高の合計（23,267＋1,351）は連結売上高24,619百万円と一致する。
- businessStructure: 製品区分ごとの売上高は開示されていないため、子事業には金額を書いていない。
- businessStructure: 2026年４月１日付で連結子会社３社の吸収合併（株式会社バイオバンクを存続会社、株式会社オーエム・エックス及び株式会社カメリアを消滅会社）を実施しており、関係会社の状況は2026年５月31日現在の体制である。
- history: 沿革は崩れた表ではなく年月と事項が対応して印字されているため、そのまま採用した。資本金の金額は沿革に書いていない。
- history: Wikipediaからは社名の由来（本社所在地の地名「新高」）だけを補足し、数値は使っていない。
- industry: ケミカル事業（業務用洗剤・洗浄剤・固形燃料等、外部売上高23,267百万円＝全体の約95％）が主たる事業であり、chemicalsが直接合う。
- industry: ヘルスケア事業は健康食品（植物醗酵エキスサプリメント等）の製造・販売で報告セグメントとして売上高が開示されているため、foodを２つ目に付けた。
- relatedCompanies: soft99corporation（株式会社ソフト99コーポレーション）：技術的な共同関係を目的に保有していたが、当事業年度に全株式を売却し期末保有はゼロのため結ばない。
- relatedCompanies: kel（ケル株式会社）：本文の一致は関係会社の表の断片等による語の一致で、同社についての取引・提携の記述がないため結ばない（ambiguous）。
- relatedCompanies: vision（株式会社ビジョン）：「長期ビジョン」の語の一致であり、同社への言及ではないため結ばない。
- relatedCompanies: en（エン株式会社）：製品名等の断片による語の一致で、同社への言及ではないため結ばない（ambiguous）。
- relatedCompanies: port（ポート株式会社）：「事業ポートフォリオ」の語の一致であり、同社への言及ではないため結ばない。
- relatedCompanies: quick（株式会社クイック）：製品名「ケミファインクイックすすぎ」の語の一致であり、同社への言及ではないため結ばない。
- relatedCompanies: ray（株式会社レイ）：語の断片一致で、同社への言及ではないため結ばない（ambiguous）。
- relatedCompanies: base-4481（ベース株式会社）：「営業利益ベース」の語の一致であり、同社への言及ではないため結ばない。
- relatedCompanies: seki（セキ株式会社）：語の断片一致で、同社への言及ではないため結ばない（ambiguous）。
- relatedCompanies: bleach（株式会社ブリーチ）：製品名「ニイタカブリーチ」の語の一致であり、同社への言及ではないため結ばない。
- relatedCompanies: career（株式会社キャリア）：「キャリアパス」の語の一致であり、同社への言及ではないため結ばない。
- relatedCompanies: hyper（株式会社ハイパー）：製品名「ハイパーリムーバー」の語の一致であり、同社への言及ではないため結ばない。
- relatedCompanies: land（株式会社ランド）：語の断片一致で、同社への言及ではないため結ばない。
- relatedCompanies: path（パス株式会社）：「キャリアパス」の語の一致であり、同社への言及ではないため結ばない（ambiguous）。
- terms: 用語の助言のみの工程。「固形燃料」は飲食店の卓上コンロ等で使う業務用燃料で、当社の主力製品の一つ（商品名「カエン」シリーズ）。「植物醗酵エキス」はヘルスケア事業のサプリメント「ＯＭ-Ｘ」の素材。「四者共栄」は当社の経営理念。「ＮＸ２０２８」は2026年５月期から2028年５月期までの中期経営計画の名称。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
