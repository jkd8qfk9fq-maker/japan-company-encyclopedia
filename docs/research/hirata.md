# 平田機工 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 平田機工株式会社 |
| 証券コード | 6258 |
| docID（データを取り出した文書） | `S100YH6Y` |
| 原本 docID | `S100YH6Y` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH6Y.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 平田機工株式会社 / 6258 / docID S100YH6Y（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hirata: 10 件の数値を有報XBRLと照合
有報: 平田機工株式会社 有価証券報告書－第75期(2025/04/01－2026/03/31) (docID S100YH6Y)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hirata: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益だけとし、経常利益・セグメント利益・受注高の金額や増減率は書かなかった（セグメントの売上高の増減率はMD&Aの印字どおり使った）。
- businessModel: 中期経営計画の数値目標（2028年3月期の営業利益の金額、ROE、CAGR）は目標値および投資関連の指標のため、戦略の本文には書かず、5つの戦略の柱の内容だけを要約した。
- businessModel: 証拠パックの注意に財務諸表の組替えの記載がある旨あるが、前期有報との修正再表示チェックは売上高・純利益・経常利益・総資産・純資産・従業員数の全行で一致し、5年間の経営指標への影響は確認されなかったため、表示上の取扱いとしてwarningsに記録し、financialNotesは空にした。
- businessModel: General Motors LLCは主要な顧客としてindustryPositionに役割を記録したが、related-candidates.jsonに無く、米国General Motors Companyの子会社で上場会社そのものではないため、関連企業には結ばなかった。
- businessModel: 地域別の売上高は千円でのみ印字されているため、industryPositionには金額を書かず構成の傾向だけを述べた。
- businessStructure: 報告セグメント3区分の金額は、MD&Aに印字された億円表記（434億78百万円・361億６百万円・125億72百万円）をそのまま使った。これらはセグメント注記の外部顧客への売上高（千円）と一致する。
- businessStructure: 「その他」の区分の金額はセグメント注記に千円でのみ印字されているため、事業の説明には金額を書かなかった。
- businessStructure: 連結子会社のHIRATA Engineering Europe GmbHとHIRATA Engineering (THAILAND) Co.,Ltd.は清算手続き中だが、2026年3月31日現在も連結子会社であるため、登録は期末現在の構成に基づく。
- businessStructure: HIRATA Engineering (THAILAND) Co.,Ltd.は議決権の所有割合が49.0％だが、実質的に支配しているため子会社とされている（関係会社の状況の注記どおり）。
- businessStructure: 国内では、連結子会社のタイヘイテクノス株式会社に電子部品等の主な仕入と製造業務を委託し、ヒラタフィールドエンジニアリング株式会社に納品した製品の保守サービスを委託している（事業の内容の印字どおり）。
- history: 沿革は表の全41行を転記した。うち2008年1月・4月の2件と2025年4月・2026年5月の2件は、年月セルが連続して印字され事象文と分かれていたため、年月の数と事象の数が一致することを確認し、行順に対応づけた。
- history: 1951年の設立行に印字された資本金の金額は、金額のため説明文に転記しなかった。
- history: 沿革の前文にある形式上の存続会社（1920年設立の旧平田機工商事株式会社）と1974年の合併の経緯については、表の起点が実質上の存続会社の1951年の設立であるため、表の行として転記したのは1951年以降とした。
- history: 2026年5月の七城第二工場の設置は決算日後の出来事だが、沿革に印字された事実として転記した。構造の変更ではないためneedsReviewには入れていない。
- industry: 主たる業界は機械とした：自動省力機器（生産システム）の製造販売が事業の柱である。半導体関連はウェーハ搬送装置などの半導体製造装置を報告セグメントとして開示し、外部顧客への売上高の約4割を占めるため、副次にsemiconductorsを付けた。自動車関連は自動車メーカー向けの生産システムであり、同社自身が自動車や自動車部品を製造するものではないため、automotiveは付けなかった。
- relatedCompanies: ふくおかフィナンシャルグループ：特定投資株式として保有するが、保有目的は傘下の福岡銀行・熊本銀行との金融取引および資金調達の円滑化であり、金融機関との資金調達関係のため結ばなかった。
- relatedCompanies: 九州フィナンシャルグループ：特定投資株式として保有するが、保有目的はメインバンクの肥後銀行や鹿児島銀行からの借入れに関するもので、資金調達関係のため結ばなかった。
- relatedCompanies: SMC株式会社：2026年3月31日現在の大株主（発行済株式（自己株式を除く）総数に対する割合4.85％）だが、related-candidates.jsonに無いため、候補からのみ選ぶ規則により結ばなかった。
- relatedCompanies: 株式会社肥後銀行：大株主（同4.43％）だが銀行そのものであり九州フィナンシャルグループの子会社であって、候補にも無いため結ばなかった。
- relatedCompanies: General Motors LLC：主要な顧客だが、候補に無く、上場会社そのものでもないため結ばなかった。役割はbusinessModelのindustryPositionに記録した。
- relatedCompanies: 日本マスタートラスト信託銀行（信託口）、株式会社日本カストディ銀行（信託口）、みずほ信託銀行（信託口）：信託口・保管名義であり事業会社ではないため結ばなかった。
- relatedCompanies: en、seki、zero、base-4481、career、freee、king、port、ray、slogan、core、okabe、will：一般語や自社の会社名・製品名の一部（ロードポート等）の部分一致のみで、有報がその会社について取引・提携・資本関係を述べていないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語の助言のみ。本文の根拠はいずれも有報の記載に基づく。

## 要確認（status に反映）

- businessStructure: 普通株式について、2025年4月1日付で1株につき3株の割合の株式分割を実施しています。株式数に関する経営指標は、第71期（2022年3月期）の期首に当該分割が行われたと仮定して算定されています。本登録は2026年3月31日現在の構成と数値に基づきます。
- businessStructure: 連結子会社の株式会社トリニティ（議決権の所有割合65.9％）について、2026年5月26日付で、その全株式を第三者に譲渡する株式譲渡契約を締結しています。譲渡の実行は2026年9月の予定であり、本登録は2026年3月31日現在の構成に基づき、同社を連結子会社として記載しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
