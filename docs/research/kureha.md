# クレハ — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社クレハ |
| 証券コード | 4023 |
| docID（データを取り出した文書） | `S100YFHO` |
| 原本 docID | `S100YFHO` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFHO.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社クレハ / 4023 / docID S100YFHO（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 4 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kureha: 10 件の数値を有報XBRLと照合
有報: 株式会社クレハ 有価証券報告書－第113期(2025/04/01－2026/03/31) (docID S100YFHO)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kureha: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年5月12日開催の取締役会で、保有する自己株式9,700,000株の消却（消却予定日2026年6月30日）を決議しました。日常的な資本政策の事項のため、needsReviewには入れずwarningsに記録します。
- businessModel: 連結売上高の10%以上を占める販売先がないため、主要な顧客に関する情報の記載は省略されています。
- businessModel: 2026年3月期は親会社の所有者に帰属する当期損失となりました。営業利益などの金額は本文の規則により書きません。
- businessStructure: 事業はセグメント注記の外部顧客への売上高の大きい順に並べました。その他関連事業も報告セグメントのため、売上高の順に並べています。
- businessStructure: 各セグメントの外部顧客への売上高の合計は161,686百万円で、印字の合計161,688百万円と2百万円ずれますが、有報の丸めによるものとして、印字の合計をそのまま引用しています。
- businessStructure: 熱収縮多層フィルム事業の撤退に伴い、クレハロンB.V.およびクレハロン・オーストラリアPty Ltd.は清算手続を行っています。
- businessStructure: 2026年4月1日付で、クレハ建設株式会社がクレハ工事株式会社を吸収合併し、クレハ電機株式会社がクレハ設備株式会社を吸収合併して商号をクレハテック株式会社に変更し、クレハサービス株式会社が株式会社クレハ分析センターを吸収合併しました。子会社同士の内部統合のため、needsReviewには入れずwarningsに記録します。
- history: 1934年の出来事は、前身である昭和人絹株式会社の設立です。
- industry: 主たる業界は、外部顧客への売上高が最も大きい報告セグメントである機能製品事業をはじめ、機能製品・化学製品・樹脂製品の3事業が化学品の製造・販売であることから chemicals としました。
- industry: 建設関連事業が独立した報告セグメントとして開示されているため、2つ目に construction を付けました。
- industry: フッ化ビニリデン樹脂はリチウムイオン二次電池用バインダー向けに販売していますが、半導体向けの用途の印字がないため semiconductors は付けませんでした。
- industry: 化学製品事業に含まれる慢性腎不全用剤や農業・園芸用殺菌剤は、独立した報告セグメントとして開示されていないため pharmaceuticals は付けませんでした。
- relatedCompanies: 田辺ファーマ株式会社とは慢性腎不全用剤「クレメジン」の日本国内における販売契約を結んでいますが、非上場のため結びませんでした。
- relatedCompanies: BASF Agro B.V.とは農業・園芸用殺菌剤「メトコナゾール」の販売契約を結んでいますが、海外法人で掲載されていないため結びませんでした。
- relatedCompanies: 大日精化工業、日油、東ソー、日本曹達、日産化学、日本酸素ホールディングス、北興化学工業、保土谷化学工業、有機合成薬品工業、ソーダニッカ、日本ピグメントホールディングス、日本製紙、あらた、林兼産業は、政策保有株式の表に載るのみで、保有目的欄が定型句のため結びませんでした。
- relatedCompanies: みずほフィナンシャルグループ、東京海上ホールディングス、SOMPOホールディングス、三井住友フィナンシャルグループ、三井住友トラストグループ、めぶきフィナンシャルグループ、東邦銀行、常陽銀行は、資金調達・保険取引が目的の政策保有のため結びませんでした。
- relatedCompanies: 明治安田生命保険相互会社、日本マスタートラスト信託銀行、東京海上日動火災保険、みずほ銀行など大株主の状況に載るのは、金融機関・信託銀行・保険会社と従業員持株会のため、事業会社として結べる相手はありませんでした。
- relatedCompanies: 連結子会社26社と持分法適用会社1社はすべて非上場または海外法人のため結びませんでした。持分法適用会社は関係会社の状況の表で社名が印字されていないため、特定できませんでした。
- relatedCompanies: エン、キャリア、ステップ、イオン、ビジョン、リコー、ポート、ゼロ、ベース、フリー、イノベーション、ランド、レック、コア、セキ、ケル、レイ、イシンは、社名の断片一致のみで会社としての言及がないため結びませんでした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
