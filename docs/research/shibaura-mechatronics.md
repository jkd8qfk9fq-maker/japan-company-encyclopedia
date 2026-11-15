# 芝浦メカトロニクス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 芝浦メカトロニクス株式会社 |
| 証券コード | 6590 |
| docID（データを取り出した文書） | `S100Z435` |
| 原本 docID | `S100YAST` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z435／有効文書 S100Z435（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z435.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 芝浦メカトロニクス株式会社 / 6590 / docID S100YAST（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 12 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
shibaura-mechatronics: 10 件の数値を有報XBRLと照合
有報: 芝浦メカトロニクス株式会社 訂正有価証券報告書－第117期(2025/04/01－2026/03/31) (docID S100Z435)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第117期(2025/04/01－2026/03/31)、docID S100Z435）を有効文書としてこのパックを作った。原本は docID S100YAST。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetricsMetricsAndTargetsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・PolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentStrategyTextBlock・PerformanceDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetrics（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
shibaura-mechatronics: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書－第117期（docID S100Z435、2026年9月28日提出）であり、出典は訂正有報に揃えた。原本（docID S100YAST）との照合では財務数値・本文とも差異がなく、差異はサステナビリティ・人的資本に関する指標等のテキストブロック（エントリーが引用しない節）のみであったため、検証結果はwarningsのみの記録とし、needsReviewには入れなかった。
- businessModel: 財務諸表の組替えは、連結損益計算書における補助金収入の独立掲記と、連結キャッシュ・フロー計算書における未収入金の増減額の独立掲記による表示方法の変更のみで、5年間の経営指標への影響はない。前期有報との修正再表示チェックは全行一致したため、financialNotesではなくwarningsに記録した。
- businessModel: financialNotesは空とした。前期有報との修正再表示チェックは全行一致し、財務諸表の組替えは表示方法の変更のみで、訂正有報の差異もエントリーが引用しない節のみのためである。
- businessModel: セグメント別の外部顧客への売上高の合計（88,037百万円）と連結売上高（88,039百万円）には2百万円の差があり、地域別の売上高の合計も88,037百万円である。いずれも有報の印字どおりに記載した。
- businessModel: MD&Aの生産実績はセグメント間の内部振替前の金額のため使わず、セグメント注記の外部顧客への売上高を用いた。MD&Aの販売実績は相殺消去後の数値で、セグメント注記の外部顧客への売上高と一致する。
- businessModel: Taiwan Semiconductor Manufacturing Company,Ltd.は、2026年3月期の売上高が34,482百万円（総販売実績に対する割合39.2％）の主要な顧客だが、related-candidates.jsonに掲載がなく、エントリーも存在しないため関連企業にはリンクせず、役割をindustryPositionと本warningsに記録した。
- businessModel: 信越エンジニアリング株式会社は、2026年3月31日現在で発行済株式（自己株式を除く。）の5.92％を保有する大株主だが、非上場の会社でエントリーが存在しないため関連企業にはリンクせず、役割を本warningsに記録した。親会社の信越化学工業株式会社とは別人格のため、信越化学工業をリンクすることもしていない。
- businessModel: キオクシア株式会社は、横浜事業所の建物及び構築物に貸与中の建物が含まれるとの記載があるが、賃貸料などの取引金額の印字がなく、related-candidates.jsonにも掲載がないため関連企業にはリンクせず、事実を本warningsに記録した。
- businessModel: related-candidates.jsonの17件はすべて一般語の一致（ビジョン、キャリア、ステップ、エン、イノベーション、ランド、レック、コア、ポート、フリー、セキ、スローガン、リード、トラスト、ベース、No.1、レイ）で、取引・提携・資本関係の根拠がないため、いずれも関連企業としなかった。
- businessModel: 大株主の状況にある信託銀行（信託口）や外国証券会社のカストディ口座は信託・保管の名義であり、取引・提携・資本関係の根拠がないため関連企業としなかった。野村證券株式会社らの大量保有報告書の記載は、当社として実質所有株式数を確認できないとして大株主の状況に含まれていないため、関連企業としなかった。
- businessModel: 中期経営計画（2026-2028年度）や2026年3月期の業績予想に対する達成状況の数値目標は、本文には書いていない。戦略の説明は定性的な内容にとどめた。
- businessModel: 株式分割はneedsReviewに記録した。2023年10月1日付の1株につき3株の割合の分割と、2026年3月1日付の1株につき5株の割合の分割があり、株式数の指標は第113期の期首に当該株式分割が行われたと仮定して算定されている。
- businessStructure: グループは当社と子会社9社で構成され、子会社9社はすべて連結子会社です（関係会社の状況に記載の9社）。
- businessStructure: セグメント別の外部顧客への売上高の合計は88,037百万円で、連結売上高88,039百万円と2百万円の差があります。いずれも有報の印字どおりに記載した。
- businessStructure: 事業の内容における事業区分は、セグメント情報における事業区分と同一です。
- history: 沿革の1939年10月の設立時の資金500万円は、設立時の資本金額のため本文には書いていない。
- history: 1991年10月と1998年10月と1999年4月の複数の出来事は、出来事ごとに行を分けた。1997年7月の本社事務所の移転と本店の移転は、同月の出来事として一つの行にまとめた。
- history: 芝浦電産株式会社は1998年10月に分離設立されたが、現在は資本関係がないため、グループ構成には含めていない。
- history: 韓国芝浦メカトロニクス株式会社の資本金の額（2006年3月に30億ウォンに増強、2009年3月に100億ウォンに増資、2009年5月に13億ウォンに減資）は、本文の財務数値は売上高と当期純利益だけという規則のため、本文には書かず本warningsに記録した。
- industry: 半導体製造装置が中核事業のためsemiconductorsをprimaryとした。ＦＰＤ製造装置、自動券売機、不動産賃貸は同一グループ内の事業であり、secondaryは付けていない。
- industry: 先行する半導体製造装置メーカー（SCREENホールディングス、東京エレクトロン、ディスコ、アドバンテスト、レーザーテック）もsemiconductorsをprimaryとしている。
- relatedCompanies: 関連企業は0件とした。特定投資株式は該当事項なしで、保有株式を根拠とするリンクはない。
- relatedCompanies: related-candidates.jsonの17件はすべて一般語の一致（ビジョン、キャリア、ステップ、エン、イノベーション、ランド、レック、コア、ポート、フリー、セキ、スローガン、リード、トラスト、ベース、No.1、レイ）で、取引・提携・資本関係の根拠がないため、いずれも関連企業としなかった。
- relatedCompanies: Taiwan Semiconductor Manufacturing Company,Ltd.は、2026年3月期の売上高が34,482百万円（総販売実績に対する割合39.2％）の主要な顧客だが、related-candidates.jsonに掲載がなく、エントリーも存在しないため関連企業にはリンクせず、役割をindustryPositionとbusinessModelのwarningsに記録した。
- relatedCompanies: 信越エンジニアリング株式会社は、2026年3月31日現在で発行済株式（自己株式を除く。）の5.92％を保有する大株主だが、非上場の会社でエントリーが存在しないため関連企業にはリンクせず、役割をbusinessModelのwarningsに記録した。親会社の信越化学工業株式会社とは別人格のため、信越化学工業をリンクすることもしていない。
- relatedCompanies: キオクシア株式会社は、横浜事業所の建物及び構築物に貸与中の建物が含まれるとの記載があるが、賃貸料などの取引金額の印字がなく、related-candidates.jsonにも掲載がないため関連企業にはリンクせず、事実をbusinessModelのwarningsに記録した。
- relatedCompanies: 大株主の状況にある信託銀行（信託口）や外国証券会社のカストディ口座は信託・保管の名義であり、取引・提携・資本関係の根拠がないため関連企業としなかった。野村證券株式会社らの大量保有報告書の記載は、当社として実質所有株式数を確認できないとして大株主の状況に含まれていないため、関連企業としなかった。
- relatedCompanies: 子会社9社はすべて連結子会社でグループ内の会社であり、関連企業リンクの対象ではない。
- terms: 助言: 用語「ファインメカトロニクス」は、半導体製造装置（洗浄装置、エッチング装置など）やＦＰＤ製造装置を生産する同社の報告セグメントの名称。
- terms: 助言: 用語「ＳＰＥ」は半導体製造装置（Semiconductor Production Equipment）の略で、中期経営計画の柱「ＳＰＥプレイヤーとしての持続的成長」に用いられている。
- terms: 助言: 用語「ＧＮＴ」はグローバルニッチトップの略で、世界市場で高い占有率を持つ同社の製品群を指す。2027年3月期はＧＮＴ製品に加えた2機種の拡販に注力するとしている。

## 要確認（status に反映）

- businessModel: 2023年10月1日付で普通株式1株につき3株の割合、2026年3月1日付で普通株式1株につき5株の割合でそれぞれ株式分割を行っています。主要な経営指標等の株式数に関する指標は、当該株式分割が第113期（2022年3月期）の期首に行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
