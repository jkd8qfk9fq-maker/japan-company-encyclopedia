# 新日本電工 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 新日本電工株式会社 |
| 証券コード | 5563 |
| docID（データを取り出した文書） | `S100XUK7` |
| 原本 docID | `S100XUK7` |
| 提出日（原本） | 2026-03-26 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XUK7.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 新日本電工株式会社 / 5563 / docID S100XUK7（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 15 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nippon-denko: 10 件の数値を有報XBRLと照合
有報: 新日本電工株式会社 有価証券報告書－第126期(2025/01/01－2025/12/31) (docID S100XUK7)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nippon-denko: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 証拠パックの注意（財務諸表の組替え・遡及適用の記載あり）は、連結経営指標等の注記3に印字された会計処理方法の変更（中央電気工業株式会社の焼却灰資源化過程で回収する有価金属の売却収入について、第125期より売上高及び対応する売上原価、商品及び製品を計上する方法に変更し、第124期以降の指標に反映）を指すものと判断し、financialNotesに記録した。前期有報との修正再表示チェックでは全系列（6系列×4行）で差異が無かった。
- businessModel: 重要な後発事象は資本準備金の額の減少（2026年2月26日取締役会決議、2026年3月27日開催予定の第126回定時株主総会に付議予定）のみである。純資産の部の科目間の振替で、連結及び個別の業績に与える影響は無いと印字された資本政策に関する手続のため、needsReviewには入れず、ここに記録する。
- businessModel: 2025年12月期は自己株式の取得による支出があったが、資本政策に関する事項のため本文には書いていない。
- businessModel: 第9次中期経営計画（2024年～2027年）及び2030年の定量目標（連結売上高・連結経常利益・ROE等）は目標値であり、投資関連の指標を含むため、perspectivesの本文には書いていない。
- businessModel: 経営成績の分析に印字された事業別売上高は、セグメント注記の外部顧客への売上高と一致している（内部売上高を含む数値ではない）。
- businessModel: 報告セグメントの外部顧客への売上高の単純合計（75,206百万円）は印字された小計（75,208百万円）と2百万円異なる有報の丸めであり、本文では印字された合計77,277百万円を用いた。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした。報告セグメントは合金鉄・機能材料・焼却灰資源化・アクアソリューション・電力の5つで、「その他」は報告セグメントに含まれない区分のため、金額にかかわらず最後に置いた。
- businessStructure: 報告セグメントの外部顧客への売上高の単純合計は75,206百万円で、印字された小計75,208百万円と2百万円異なる（有報の丸め）。各事業の金額は印字どおりに記載した。
- businessStructure: 製品・サービスごとの金額は開示されていないため、childrenには金額を書いていない。
- history: 沿革のうち、子会社の設立・清算結了・保有株式の売却により関係会社でなくなった旨の行など、現在の事業構成に直接関わらない細目は省略し、その旨をここに記録する。
- history: 創業時・設立時の資本金の金額は書いていない（金額の記載を避けるため）。
- industry: 閉じた分類に鉄鋼・合金鉄の区分が無いため、日本製鉄・愛知製鋼など鉄鋼・金属素材系の掲載済み企業の先例に揃えて、主たる業界は化学（chemicals）を暫定とし、分類の不足はtaxonomyGapsに記録した。
- industry: 電力事業はFIT制度を利用した水力発電による電力の供給を行う報告セグメントで、独立した金額が開示されているため、2つ目の業界としてエネルギー（energy）を付けた。
- relatedCompanies: nippon-steel（日本製鉄）: 【関係会社の状況】の区分（その他の関係会社）どおりに結んだ。製品の販売先であり最大の顧客でもあることと、業務提携関係の印字を説明に含めた。
- relatedCompanies: nittetsu-mining（日鉄鉱業）: 大株主の状況に1.68％で載る事業会社であり、当社も同社株式を保有する相互保有の関係が印字されているため、major-shareholderとして結んだ。
- relatedCompanies: 日鉄物産株式会社は大株主の状況に0.86％で載るが、related-candidates.jsonに無く、結ばなかった。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）・日本カストディ銀行（信託口）は信託口の名義であり、結ばなかった。新日本電工取引先持株会・従業員持株会は持株会であり、結ばなかった。
- relatedCompanies: nippon-electric-glass（日本電気硝子）: 特定投資株式に載るが、保有目的は全銘柄共通の定型句（取引関係の維持・強化を目的として保有）のみで、個別の取引・提携の印字が無いため結ばない。
- relatedCompanies: c-uyemura-and-co（上村工業）: 特定投資株式に載るが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字が無いため結ばない。
- relatedCompanies: daido-steel（大同特殊鋼）: 特定投資株式に載るが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字が無いため結ばない。
- relatedCompanies: daito-koun（大東港運）: 特定投資株式に載るが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字が無いため結ばない。
- relatedCompanies: meiko-trans（名港海運）: 特定投資株式に載るが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字が無いため結ばない。
- relatedCompanies: nippon-yusen-kabushiki-kaisha（日本郵船）: 特定投資株式に載るが、保有目的は全銘柄共通の定型句のみで、個別の取引・提携の印字が無いため結ばない。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ）: 特定投資株式の保有目的は財務活動の円滑化であり、金融機関のため結ばない。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ）: 保有目的は財務活動の円滑化であり、金融機関のため結ばない。
- relatedCompanies: nippon-chemical-industrial（日本化学工業）: 2012年12月のクロム塩事業の譲渡先として沿革に印字されるのみで、現在の取引・提携の印字が無いため結ばない。譲渡の事実は沿革に記録した。
- relatedCompanies: 連結子会社5社（リケン工業・栗山興産・電工興産・日電徳島・中電興産）と持分法適用関連会社2社（Pertama Ferroalloys SDN.BHD.・Kudumane Japan合同会社）は当社グループの会社であり、関連企業には結ばず、事業の内容と関係会社の状況に基づきbusinessStructureに記載した。
- relatedCompanies: en・aeon・base-4481・port・career・arata・freee・como・kel・lec・seki・step・trust・ishin・vision は、いずれも一般語・部分一致（イオン交換塔の「イオン」、実力ベースの「ベース」、ニッケルの「ケル」、信託口の「トラスト」等）であり、実在の取引・提携の印字が無いため結ばない。
- terms: 助言: 用語『フェロアロイ』は、フェロマンガン・シリコマンガン・フェロシリコンなどの合金鉄の総称で、【事業の内容】に印字されています。
- terms: 助言: 用語『水素吸蔵合金』は、機能材料事業の製品の一つで、【事業の内容】に印字されています。
- terms: 助言: 用語『FIT制度』は、電力事業の売電の仕組みとして経営方針と経営成績の分析に印字されています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] 新日本電工の主たる業界 → 提案: 鉄鋼・金属素材（合金鉄、特殊鋼、非鉄金属などの素材メーカー）。有報の事業の中心は、フェロマンガン・シリコマンガン・フェロシリコンなどの合金鉄（フェロアロイ）の製造・販売であり、化学品の会社ではない。閉じた分類（INDUSTRY_IDS）に鉄鋼・素材を表す区分が無いため、掲載済みの日本製鉄（nippon-steel）や愛知製鋼（aichi-steel）が素材のバケットとして chemicals を使っている先例に揃えて暫定にした。
