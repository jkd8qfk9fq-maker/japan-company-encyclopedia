# 北陸電気工事 — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 北陸電気工事株式会社 |
| 証券コード | 1930 |
| docID（データを取り出した文書） | `S100YI00` |
| 原本 docID | `S100YI00` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI00.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 北陸電気工事株式会社 / 1930 / docID S100YI00（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hokuriku-electrical-construction: 10 件の数値を有報XBRLと照合
有報: 北陸電気工事株式会社 有価証券報告書－第112期(2025/04/01－2026/03/31) (docID S100YI00)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
hokuriku-electrical-construction: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: businessModel.suppliersは省いた。有報は当社グループの調達先の類型を述べていないためである。
- businessModel: 2026年3月期は決算期の変更や修正再表示がなく、5年間の経営指標は前期有報の印字と全て一致しているため、financialNotesは空とした。経営指標の注記にある株式分割はneedsReviewに記録し、株式給付信託（BBT・J-ESOP）の導入に関する注記は制度の記録として本warningsに留めた。
- businessModel: 中期経営計画「アクションプラン2027」の財務目標や、配当政策におけるDOEの目標などの数値目標は転記していない。
- businessModel: 北陸電力が2025年8月22日付けで親会社からその他の関係会社となった変更は、2026年3月期中の出来事で期末現在の構造に反映されているため、needsReviewではなく沿革・関連企業・本warningsに記録した。
- businessModel: MD&Aの金額は億単位の印字のため、本文では億表記のまま転記した（連結売上高610億28百万円、完成工事高588億69百万円など）。
- businessStructure: 報告セグメントは設備工事業のみであり、その他の事業は重要性が乏しいためセグメント注記の記載が省略されている。事業別の金額はMD&Aの印字（設備工事業の完成工事高588億69百万円、その他の事業の売上高21億59百万円）を使い、両者の合計は連結売上高610億28百万円と一致する。MD&Aが億単位で印字するため、金額は億表記のまま転記した。
- businessStructure: グループ構成は事業の内容の印字どおり、当社、その他の関係会社1社、子会社6社及び関連会社1社である。関係会社の状況に個別記載がある連結子会社はホッコー商事、スカルト、蒲原設備工業、日建の4社で、残るBlue・Sky、PT AWINA RIKUDENKO SOLAR ENGINEERING INDONESIA、大山ファーストの位置付けは本文の記載からは特定できないため、childrenでは各社の事業内容のみを記し、子会社・関連会社の別は断定していない。
- businessStructure: 子会社ごとの売上高は独立して開示されていないため、childrenには金額を書いていない。
- history: 沿革は有報の印字から主要な節目を選んだ。支店・営業所の設置や本店移転等の細目は一部省いた。設立時の資本金の金額は財務数値のため転記していない。
- history: 北陸電力の親会社からその他の関係会社への変更は2026年3月期中の出来事であり、期末現在の構造に反映されているため、needsReviewではなく沿革とwarningsに記録した。
- industry: 主たる業界は、設備工事業を主な事業の内容とするためconstructionとした。
- industry: その他の事業（不動産賃貸、クライミング施設の運営、リース事業、PFI事業）は重要性が乏しいため、副業界は付けなかった。
- relatedCompanies: 北陸電力送配電株式会社: セグメント情報の主要な顧客ごとの情報に載る最大の顧客であるが、非上場で候補一覧になく、百科事典のエントリもないため結ばなかった。顧客としての事実はbusinessModelとperspectivesに記録した。
- relatedCompanies: 特定投資株式の各銘柄（ほくほくフィナンシャルグループ、富山第一銀行、福井銀行、みずほフィナンシャルグループ、CCIグループ、セーレン、スズキ、日本ゼオン、ニチコン、朝日印刷、ゴールドウイン、第一生命ホールディングス、小松マテーレ、東洋紡、富山銀行、CKサンエツ、サンケン電気、インフロニア・ホールディングスほか）: 保有目的が全銘柄で同一の定型文（営業取引関係の維持強化のため）のみで、銘柄ごとの具体的な取引・提携の記載がないため結ばなかった。
- relatedCompanies: hikari-tsushin（光通信株式会社）: 大株主として載る光通信KK投資事業有限責任組合（3.65％）は光通信株式会社とは別の法人であり、光通信株式会社自体（1.05％）との取引・提携の印字がないため結ばなかった。
- relatedCompanies: kitano-construction（北野建設）、obayashi（大林組）、taisei（大成建設）: MD&Aの完成工事・繰越工事の例示に元請として名前が出るのみで、資本関係や提携の印字がないため結ばなかった。fuji-8278（株式会社フジ）は「フジタ」の社名一致であり無関係である。
- relatedCompanies: 日本マスタートラスト信託銀行・日本カストディ銀行の信託口と北陸電気工事従業員持株会は、関連企業として結ぶ対象ではない。
- relatedCompanies: seki、en、land、grid、trust、zero、cover、port、lecはいずれも社名の一致のみで、関係性の根拠がないため結ばなかった。
- terms: 助言: 用語「完成工事高」は、請負った工事が完成し引き渡された分について計上される売上高で、設備工事会社の業績を示す中心的な金額である。当社グループでは設備工事業の規模を示す金額として使われている。
- terms: 助言: 用語「工事委託契約」は、配電線工事を北陸電力送配電から継続的に受託する契約の形態で、当社グループの配電線工事の受注方法の一つである。
- terms: 助言: 用語「内線・空調管工事」は、建物の内部の電気配線や空調・配管の工事を指す、当社グループの工事区分の一つである。

## 要確認（status に反映）

- businessModel: 2022年１月１日付で普通株式１株につき1.2株の割合で株式分割を実施しております。株式数に関する指標は、第108期の期首に当該分割が行われたと仮定して算定されております。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
