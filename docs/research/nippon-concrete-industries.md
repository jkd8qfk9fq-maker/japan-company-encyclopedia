# 日本コンクリート工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本コンクリート工業株式会社 |
| 証券コード | 5269 |
| docID（データを取り出した文書） | `S100YI1J` |
| 原本 docID | `S100YI1J` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI1J.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本コンクリート工業株式会社 / 5269 / docID S100YI1J（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-concrete-industries: 10 件の数値を有報XBRLと照合
有報: 日本コンクリート工業株式会社 有価証券報告書－第95期(2025/04/01－2026/03/31) (docID S100YI1J)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nippon-concrete-industries: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は有報の千円印字を百万円単位に切り捨てて転記した（切捨て換算）。セグメントの外部顧客への売上高の合計（26,906＋22,013＋313）は連結売上高49,233百万円と一致する。
- businessModel: 指標注記５の2022年改正基準（税効果）の遡及適用は、financialNotesに{2024年3月期}として記録した（第94期期首から適用、第93期の指標が遡及適用後）。
- businessModel: コンクリート二次製品事業の内訳（ポール関連事業147億59百万円・土木製品事業121億47百万円）はMD&Aに億円・百万円併記でのみ印字されるため、businessStructureの子事業には同印字のまま記載した。
- businessModel: 本ツリー（jce-w3）のスキーマにsuppliersキーが存在しないためsuppliersは記載していない。
- businessModel: 中期経営計画の2026年度目標等の数値目標は利益・投資指標を含むためstrategyには転記せず、定性的な方針のみを記載した。MD&Aの財務方針に印字されるＲＯＡ向上の目標も同様に転記していない。
- businessModel: 政策保有株式の売却益の計上により当期純利益が黒字に回復した旨はMD&Aに印字されるが、損益区分名・金額は本文に記載していない。
- businessModel: 特定投資株式の注記に印字される株式分割は、日本ヒューム株式会社・住友不動産株式会社・株式会社ベルテクスコーポレーション・日本製鉄株式会社という保有先企業のものであり、当社の株式分割ではないためneedsReviewには記録していない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません」であり、needsReviewに記録すべき後発事象はない。
- businessStructure: MD&Aのセグメント概況に印字される内部取引込みの数値ではなく、セグメント注記の外部顧客への売上高を用いた。
- businessStructure: 連結子会社である東北ポール株式会社の単独の損益情報等（売上高8,889百万円等）は範囲が異なるため子事業には記載していない。
- businessStructure: 関係会社の状況に印字される各子会社の資本金額は、本文の記載対象外（禁止金額）のため記載していない。
- history: 沿革に印字される設立時の資本金額及び各子会社の資本金額は、本文の記載対象外（禁止金額）のため記載していない。
- history: 2024年４月の型枠製造事業の譲渡元である株式会社小松（旧株式会社小松製作所）は、上場会社の株式会社小松製作所（コマツ）とは別の法人であるため、関連会社としては結んでいない。
- industry: 主たる業界は、コンクリート二次製品（パイル・ポール・土木製品）の製造販売が売上高の大半を占めるため、無機材料製造の値として chemicals とした（太平洋セメントの登録と同基準）。建設材料そのものの区分は閉じた分類に無いが、材料製造業として chemicals が最も近い値であり、暫定値ではないため taxonomyGaps には記録していない。売上高の大半がコンクリート製品であるため副業界は付していない。
- relatedCompanies: 株式会社テノックスは沿革に業務・資本提携が個別に印字されているため business-partner として結んだ。特定投資株式の保有目的自体は全銘柄同一の定型文である。
- relatedCompanies: 日本電設工業株式会社は、1948年の分離独立の母体であり沿革に印字されるが、現在の取引・提携の印字は特定投資株式の定型文の保有目的のみであり、定型文のみでは結ばない判断（koa先例）により結んでいない。創業の経緯は沿革に記録した。
- relatedCompanies: 日本ヒューム株式会社、住友不動産株式会社、旭コンクリート工業株式会社、株式会社ベルテクスコーポレーション、日本リーテック株式会社、株式会社巴コーポレーション、日本製鉄株式会社、太平洋セメント株式会社、株式会社淺沼組、三谷セキサン株式会社、東洋埠頭株式会社、株式会社奥村組、株式会社三一Ｃ＆Ｓは、特定投資株式の保有目的が全銘柄同一の定型文「取引関係維持、強化のため」のみであり、個別の取引役割の印字がないため結んでいない（koa先例）。
- relatedCompanies: 電気興業株式会社は当期中に保有株式をすべて売却し保有ゼロとなったため結んでいない。
- relatedCompanies: 三井住友トラストグループ株式会社、株式会社三菱ＵＦＪフィナンシャル・グループ、株式会社みずほフィナンシャルグループは、保有目的が定型文のみであり金融取引の関係にとどまるため結んでいない。みなし保有株式（退職給付信託）の銘柄も結んでいない。
- relatedCompanies: 太平洋セメント株式会社は退職給付信託の信託口名義にも現れるが、信託口名義は関連会社として結ばない。
- relatedCompanies: アジアパイルホールディングス株式会社は2012年の一過性の事業譲受の相手方であり、現在の取引・提携の印字がないため結んでいない。
- relatedCompanies: 連結子会社・持分法適用関連会社（ＮＣ工基、東北ポール、東電物流等）は当社グループの会社であるため結んでいない。
- relatedCompanies: 候補リストの freee、career、en、base-4481、hyper、core、cota、nac、port、vision、land、daiwa、grid、heiwa、idemitsu-kosan、the-hyakugo-bank、the-shiga-bank、zero、technologies は語の一致のみの誤検出であり、有報に取引・提携の印字はない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
