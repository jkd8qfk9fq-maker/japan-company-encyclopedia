# サンエー化研 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社サンエー化研 |
| 証券コード | 4234 |
| docID（データを取り出した文書） | `S100YK61` |
| 原本 docID | `S100YK61` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK61.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社サンエー化研 / 4234 / docID S100YK61（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 8 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sun-a-kaken: 10 件の数値を有報XBRLと照合
有報: 株式会社サンエー化研 有価証券報告書－第117期(2025/04/01－2026/03/31) (docID S100YK61)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":237038000,"latestFiling":239694000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":88982000,"latestFiling":90392000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":37810318000,"latestFiling":37856617000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":21018312000,"latestFiling":21020968000}]
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
sun-a-kaken: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はセグメント注記の千円の印字を百万円に切り捨てて記載した。セグメント別売上高の切り捨て合計（30,357百万円）は、連結売上高の印字（30,358百万円）と1百万円異なるが、合計は印字どおりとした。なお、セグメント注記の千円の内訳の合計は連結売上高の印字と2千円異なるが、印字の合計を採用した。
- businessModel: 前期有報との修正再表示チェックでは、2025年3月期の親会社株主に帰属する当期純利益・総資産額・純資産額に差異があった。理由は経営指標等の注記4と企業結合等関係の注記に印字されている（レゾナックとの企業結合の暫定的な会計処理の確定）ため、financialNotes に記録した。収益（売上高）と従業員数に差異はなかった。
- businessModel: 経営方針では、経営上の目標を判断する指標として売上高や営業利益率を主要な収益性指標とし、ROE、ROIC等の指標も参考にするとされている。これらは利益率・投資指標のため、本文と戦略の記述には使わず、ここに記録する。
- businessModel: 受注実績（受注高・受注残高）がMD&Aに開示されているが、受注高の金額は本文に書かない規則のため使わなかった。
- businessModel: 法人主要株主の新生紙パルプ商事株式会社（発行済株式の18.81％を保有）に対しては、【事業の内容】に製品の販売及び原材料の仕入を行う旨が印字されているが、同社は related-candidates に含まれないため関連企業としては結ばず、事実をここに記録する。
- businessModel: 連結子会社の燦櫻（上海）商貿有限公司は、決算期後の2026年4月15日付で減資している（関係会社の状況の注記）。グループの体制に変更はないため needsReview には挙げず、ここに記録する。
- businessModel: セグメント利益の金額は本文に書かない規則のため、本文には反映していない。
- businessModel: businessModel に suppliers は書かなかった（この作業ツリーのスキーマに suppliers キーがないため）。仕入の事実は、新生紙パルプ商事からの原材料の仕入として警告に記録した。
- businessStructure: グループは当社と連結子会社3社（東邦樹脂工業株式会社、シノムラ化学工業株式会社、燦櫻（上海）商貿有限公司）、持分法適用関連会社1社（株式会社ネスコ）で構成される。株式会社ネスコは重要性が増したため当連結会計年度から持分法適用の範囲に含まれており、期末現在の体制に反映されているため needsReview には挙げていない。
- businessStructure: 「その他」の区分（報告セグメントに振り分けるのが困難な商品の仕入売り等、2026年3月期の売上高473百万円）は報告セグメントではないため、事業としては記載していない。
- businessStructure: 連結子会社の燦櫻（上海）商貿有限公司は2026年4月15日付で減資している。資本金の金額は本文に書かない規則のため、金額は記載していない。
- businessStructure: 子会社の資本金の金額は本文に書かない規則のため、各社の説明には含めていない。
- history: 1942年の設立行や子会社の設立行に印字されている資本金の金額は、本文に金額を書かない規則のため省いた。
- history: 本社移転や工場・営業所の設置・閉鎖などの軽微な行は、事業の転機となる行を優先して省いた（清水工場・袋井工場・掛川工場等の設置、札幌工場・九州出張所の閉鎖、研究所の設置・移転など）。
- history: 2025年のレゾナックとの企業結合は沿革には載っていないため、MD&Aと企業結合等関係の注記に基づいて記載した。
- industry: 主たる業界は、有報が「化成品の製造・販売並びにこれらの付随業務の単一事業」と記載していることから chemicals とした。
- industry: 包装材料そのものを指す閉じた分類の値はないが、化成品メーカーとしての実態は chemicals で表せるため、暫定値や taxonomyGaps は置かなかった。食品・医薬品は顧客の業界であり、当社自身の業界ではないため付けなかった。
- relatedCompanies: showa-paxxs（昭和パックス）: 【大株主の状況】に発行済株式の13.96％を保有する事業会社として載るため major-shareholder として結んだ。当社の同社株式の保有目的は他銘柄と同一の定型文（「営業上の関係強化のため」）だが、大株主としての資本関係は大株主の状況の印字そのものが根拠である。
- relatedCompanies: 新生紙パルプ商事株式会社: 発行済株式の18.81％を保有する法人主要株主で、【事業の内容】に製品の販売及び原材料の仕入を行う旨が印字されているが、related-candidates に含まれないため結ばず、事実を businessModel の警告に記録した。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、みずほフィナンシャルグループ、めぶきフィナンシャルグループ、三井住友フィナンシャルグループ: 特定投資株式の保有目的が「主要借入先に対する政策目的投資」であり、主要借入先との資金調達の関係のため結ばなかった。
- relatedCompanies: オカモト、双日、日東電工、サトウ食品、遠州トラック、ニチバン、リコー、中本パックス、積水化学工業、ニップン、クミアイ化学工業、不二ラテックス、王子ホールディングス、Ｕｍｉｏｓ、エスビー食品: 特定投資株式の保有目的が全銘柄同一の定型文（「営業上の関係強化のため」）で、銘柄ごとに取引の役割や分野が個別に示されていないため結ばなかった。なおＵｍｉｏｓの株式数の増加は同社自身の株式分割によるもので、当社の株式分割ではない。
- relatedCompanies: ホギメディカル: 当事業年度に株式公開買付に応募して全株式を売却済みのため結ばなかった。また同社はコードリストにない。
- relatedCompanies: san-a（株式会社サンエー）: 一致した文字列は当社自身の社名「サンエー化研」の一部であり、株式会社サンエーそのものへの言及ではないため結ばなかった。
- relatedCompanies: tomoegawa（巴川コーポレーション）: 日本マスタートラスト信託銀行の保有内訳として退職給付信託口の名義で現れるのみで、退職給付信託口は関連企業としないため結ばなかった。
- relatedCompanies: core、en、ray、base-4481、freee、the-lead、como、zero、trust: いずれも一般語の一致（コア・テクノロジー、エンゲージメント、FPD用フィルムの記述、損益ベース、溶剤フリー、当社の元子会社ペンリード、コモディティ化、可能性をゼロにする、信託銀行の名称）であり、相手企業への言及ではないため結ばなかった。trust はコードリストにもない。
- relatedCompanies: 社員持株会と信託銀行（信託口）は関連企業としない。東邦樹脂工業、シノムラ化学工業、燦櫻（上海）商貿有限公司、株式会社ネスコは自社グループの会社であり、businessStructure に記載した。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は、有報に名称と内容が記載されている同社固有の製品名だけを挙げた。一般的な業界用語の定義は有報に記載がないため扱わなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
