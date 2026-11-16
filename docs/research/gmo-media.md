# GMOメディア — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＧＭＯメディア株式会社 |
| 証券コード | 6180 |
| docID（データを取り出した文書） | `S100XRSC` |
| 原本 docID | `S100XR40` |
| 提出日（原本） | 2026-03-16 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | S100XRSC／有効文書 S100XRSC（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XRSC.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＧＭＯメディア株式会社 / 6180 / docID S100XR40（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
gmo-media: 10 件の数値を有報XBRLと照合
有報: ＧＭＯメディア株式会社 訂正有価証券報告書－第26期(2025/01/01－2025/12/31) (docID S100XRSC)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第26期(2025/01/01－2025/12/31)、docID S100XRSC）を有効文書としてこのパックを作った。原本は docID S100XR40。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはAuditorsResponseKAMConsolidatedTextBlock・IndependentAuditorsReportConsolidatedTextBlock・KeyAuditMattersConsolidatedTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
gmo-media: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「GMOメディア株式会社」が EDINET の提出者名「ＧＭＯメディア株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と親会社株主に帰属する当期純利益のみとした。MD&Aの利益の金額や増減率の理由、投資に関する指標や目標の数値は書いていない。
- businessModel: 訂正有価証券報告書（S100XRSC）は record-only の分類であり、財務の数値も本文も原本（S100XR40）と同一で、差異は監査報告書等の節のみであるため、needsReview にはせず、出典は訂正有報とした。前期有報との修正再表示チェックも全系列で差異なしであり、主要な経営指標等の注記（収益認識基準の第23期適用と、法人税等に関する会計基準の第26期期首適用・第25期遡及適用）は financialNotes に記録した。
- businessModel: セグメント別の外部顧客への売上高を百万円未満切り捨てで合計すると7,114百万円となり、連結売上高7,115百万円と1百万円異なる。切り捨てによる差であり、印字の数値をそのまま記載した。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」と印字されており、期後の構造変化はない。重要な契約等はApple Inc.との開発者契約のみで、構造に影響するものではない。
- businessModel: suppliers はこのツリーの旧スキーマに従い、businessModel には書いていない。主要な販売先であるGoogle Asia Pacific Pte. Ltd.は related-candidates.json に含まれていないため、関連企業には結んでいない。
- businessStructure: 事業の並び順は報告セグメントの外部顧客への売上高の大きい順（メディア事業、ソリューション事業）とした。メディア事業の内訳（ポイント関連・学び関連・美容医療関連）とソリューション事業のサービスは【事業の内容】の区分により children とし、金額が独立して開示されていない旨を各 children に明記した。
- businessStructure: メディア事業の外部顧客への売上高6,435,238千円とソリューション事業679,787千円を百万円未満切り捨てで合計すると7,114百万円となり、連結売上高7,115百万円と1百万円異なる。切り捨てによる差であり、印字の数値をそのまま記載した。
- businessStructure: 主要な設備は本社（東京都渋谷区）に集約され、メディア事業・ソリューション事業の区分で印字されているため、事業との対応はセグメント欄どおりとした。帳簿価額は書いていない。
- history: 落とした行: 2000年12月の株式会社電通ほかの資本参加（資本参加先の列挙であり、金額は書いていない）、2017年３月のファン育成・リピート促進事業「ポイントCRM」（現「GMOリピータス」）の開始と2017年10月のチャット型小説サービス「プリ小説」の開始は、サービスの開始行として businessStructure 側の記載に委ね、沿革の項目にはしなかった。年月は項目に含めていない。
- history: 資本金の金額は沿革に書いていない。
- industry: 主たる業界は、売上高の中心を占めるメディア事業（ポイント・ゲーム・学び・美容医療の各メディア運営）から media とした。閉じた分類に直接合うため暫定は付けていない。ソリューション事業はメディア事業のノウハウの外部展開であり、売上規模も小さいため、独立の業界は付けていない。
- relatedCompanies: gmo-payment-gateway（GMOペイメントゲートウェイ株式会社）: 役員の兼歴にのみ現れ、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: gmo-globalsign-holdings（GMOグローバルサイン・ホールディングス株式会社）: 役員の兼歴にのみ現れ、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: gmo-product-platform（GMOプロダクトプラットフォーム株式会社）: 役員の兼歴にのみ現れ、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: gmo-tech-holdings（GMO TECHホールディングス株式会社）: 役員の兼歴にのみ現れ、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: gmo-financial-holdings（GMOフィナンシャルホールディングス株式会社）: 役員の兼歴にのみ現れ、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: softbank（ソフトバンク株式会社）: 沿革の2000年12月の資本参加に現れるのはソフトバンク・メディア・アンド・マーケティング株式会社（現SBメディアホールディングス株式会社）であり、ソフトバンク株式会社とは別の法人であるため、結ばなかった。
- relatedCompanies: path（パス株式会社）: ambiguous であり、「キレイパス」等の自社サービス名の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: base-4481（ベース株式会社）: 「営業利益ベース」等の一般的な表現の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: ray（株式会社レイ）: ambiguous であり、「プレイ」等の一般語の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: space（株式会社スペース）: 「コミュニケーションスペース」等の一般的な表現の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: career（株式会社キャリア）: 「キャリア形成支援」等の一般語の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: en（エン株式会社）: ambiguous であり、「検索エンジン」等の一般語の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: port（ポート株式会社）: 「サポート」等の一般語の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: arata（株式会社あらた）: 「あらためて」等の一般語の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: care-service（株式会社ケアサービス）: 「ボディケアサービス」等の一般的な表現の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: freee（フリー株式会社）: 「フリー・エージェント」等の一般的な表現の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: seki（セキ株式会社）: ambiguous であり、一般語の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: lec（レック株式会社）: 「フレックスタイム」等の一般的な表現の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: land（株式会社ランド）: 「信頼ブランド」等の一般的な表現の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: rhythm（リズム株式会社）: 一般語の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: taya（株式会社田谷）: ambiguous であり、「世田谷区」等の地名の部分一致で、同社との取引・提携・資本関係の記載はないため、結ばなかった。
- relatedCompanies: nissin（株式会社日新）: ambiguous であり、候補自体もコードリストにないため、結ばなかった。
- relatedCompanies: 候補外のため結ばなかった相手: Google Asia Pacific Pte. Ltd.（主要な顧客ごとの情報に2025年12月期の売上高1,414,386千円が印字され、販売実績の主な相手先でもある）は related-candidates.json に含まれていないため結ばなかった。Apple Inc.（重要な契約等の相手方）は候補に含まれていないため結ばなかった。当社の連結子会社2社（GMOビューティー株式会社、GMO趣味なび株式会社）は自社の子会社のため結ばなかった。特定投資株式は保有していない旨が印字されている。
- terms: 用語の助言: 「ポイ活」はポイントを貯めて現金や電子マネー等に交換する活動、「アフィリエイト広告」はメディア経由の申し込みや購入に応じて報酬が発生する広告、「成果報酬型広告」は成果の発生に応じて報酬が支払われる広告、「ブラウザゲーム」はブラウザ上でプレイするゲーム、「フロー収益」は広告収益のように期間で変動する収益、「ストック収益」は契約の継続で積み上がる収益を指します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
