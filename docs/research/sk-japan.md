# エスケイジャパン — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社エスケイジャパン |
| 証券コード | 7608 |
| docID（データを取り出した文書） | `S100YA1Z` |
| 原本 docID | `S100Y6QH` |
| 提出日（原本） | 2026-05-27 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | S100YA1Z／有効文書 S100YA1Z（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YA1Z.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社エスケイジャパン / 7608 / docID S100Y6QH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sk-japan: 10 件の数値を有報XBRLと照合
有報: 株式会社エスケイジャパン 訂正有価証券報告書－第37期(2025/03/01－2026/02/28) (docID S100YA1Z)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第37期(2025/03/01－2026/02/28)、docID S100YA1Z）を有効文書としてこのパックを作った。原本は docID S100Y6QH。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetricsMetricsAndTargetsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・InformationAboutEmployeesTextBlock・MetricsAndTargetsTextBlock・AllEmployeesCalculatedBasedOnProvisionsOfArticle714Item1OfOrdinanceForEnforcementOfActOnChildcareLeaveCaregiverLeaveAndOtherMeasuresForTheWelfareOfWorkersCaringForChildrenOrOtherFamilyMembersRatioOfMaleEmployeesTakingChildcareLeaveMetricsOfReportingCompany・PerformanceDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetrics（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 前期の窓に 訂正有価証券報告書－第36期(2024/03/01－2025/02/28) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
sk-japan: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 訂正有価証券報告書（docID S100YA1Z、2026年6月10日提出）を有効文書とした。原本（docID S100Y6QH）との比較では主要財務と本文に差異はなく、分類はrecord-onlyであり、訂正はエントリーが引用しない節と開示数値のみであるため、訂正を理由とするneedsReviewにはしていない。出典は訂正有報の値で記載した。
- businessModel: 連結経営指標等の注記１（潜在株式が存在しないため調整後指標を記載していない旨）は表示事項のためfinancialNotesには記録せず、注記２（収益認識に関する会計基準等の適用）のみを2023年2月期のfinancialNotesに記録した。注記３の株式分割はneedsReviewに記録した。
- businessModel: MD&Aに印字された利益項目の金額は本文に書いていない。本文の金額は売上高と親会社株主に帰属する当期純利益のみとした。セグメント間の内部売上高を含む数値は使わず、セグメント情報の外部顧客への売上高を用いた。
- businessModel: 前期の窓にある訂正有価証券報告書－第36期については、修正再表示チェックで前期有報と重複年度は全て一致し修正再表示はないことが確認されている。
- businessStructure: 事業の並び順はセグメント情報の外部顧客への売上高の大きい順とした（キャラクターエンタテインメント事業12,266百万円、キャラクター・ファンシー事業3,966百万円）。セグメント利益は書いていない。
- businessStructure: suppliersはこのツリーの旧スキーマのため省略した。会社は独自の生産拠点・生産工程を持たず商品を仕入れている旨が経営成績の分析に印字されているが、個別の仕入先名は事業の内容には印字されていない。
- businessStructure: 当社グループは当社と連結子会社2社（SKJ USA,INC.及び愛斯凱杰（北京）文化伝播有限公司、いずれも議決権の所有割合100％）で構成されている。事業の系統図にはその他の関係会社の連結子会社である株式会社ラウンドワンジャパンとRound One Entertainment Inc.も含まれているが、この2社は当社の子会社ではないためグループ構成には含めていない。
- history: 沿革のうち、営業所の開設・移転の細目（福岡・名古屋など）、本社移転の細目、株式会社イメージライフからの営業譲受け、電子玩具事業や小売事業の開始などの個別行は、独立した行にはせず、主要な出来事に集約した。資本金の金額は書いていない。
- history: 平成8年4月の合併は沿革で1行に併記されているため、1つの行として記録した。
- industry: 主たる業界はentertainment（エンターテインメント）を暫定とした。最大の事業であるキャラクターエンタテインメント事業（2026年2月期の外部顧客への売上高12,266百万円、売上高の約76％）はアミューズメント施設向けのキャラクター商品の販売であり、用途に最も近い区分はentertainmentである。会社自身は小売店舗を運営していないためretailは付けなかった。
- industry: 事業ごとに独立した業界は付けなかった。2事業ともキャラクター商品の企画・販売という同一の性格の事業である。
- relatedCompanies: 株式会社ラウンドワンジャパンと株式会社ドン・キホーテは主要な顧客としてセグメント関連情報に印字されるが、関連企業候補に含まれていないため結ばなかった（ラウンドワンジャパンは株式会社ラウンドワンの連結子会社であり、その関係はround-oneの説明に記載した）。Round One Entertainment Inc.も同様に候補にないため結ばず、round-oneの説明に記載した。
- relatedCompanies: aeon-fantasy（株式会社イオンファンタジー）、bandai-namco-holdings（株式会社バンダイナムコホールディングス）、capcom（株式会社カプコン）、geo-holdings（株式会社ゲオホールディングス）、sega-sammy-holdings（セガサミーホールディングス株式会社）：特定投資株式の保有目的が「当社商品の販売先であり取引関係の維持・強化」という全銘柄共通の定型的な文言のみであり、個別の取引事実を述べる記載がないため結ばなかった。
- relatedCompanies: lec（レック株式会社）、shobido（粧美堂株式会社）：特定投資株式の保有目的が「当社商品の仕入先であり取引関係の維持・強化」という定型的な文言のみであり、個別の取引事実を述べる記載がないため結ばなかった。
- relatedCompanies: nix（株式会社ニックス）：保有株式の表の相手は株式会社スクウェア・エニックスホールディングスであり、候補とは別の法人のため結ばなかった。
- relatedCompanies: en（エン株式会社）、tein（株式会社テイン）、amuse（株式会社アミューズ）、base-4481（ベース株式会社）、hit（株式会社ヒット）、land（株式会社ランド）、port（ポート株式会社）、semba（株式会社船場）、suzuki-6785（株式会社鈴木）、slogan（スローガン株式会社）：「エンタテインメント」「アミューズメント」「ベース」「ヒット」「ブランド」「インポート」「船場（地名）」「鈴木（個人名）」「スローガン」等の一般語・部分一致であり、各社についての記載はないため結ばなかった。
- relatedCompanies: 当社の連結子会社2社（SKJ USA,INC.、愛斯凱杰（北京）文化伝播有限公司）は自社の子会社のため結ばなかった。大株主の表に載る個人株主やSBI証券等の金融機関は事業会社ではないため結ばなかった。
- terms: 助言のみ。用語候補: 「プライズ商品」（アミューズメント施設のクレーンゲーム等で獲得できる景品として販売されるキャラクター商品）、「カプセルトイ」（カプセルに入った小型の玩具商品で、取扱事業者を通じて販売される）、「キャラクター・ファンシー」（キャラクターのぬいぐるみやキーホルダー等を雑貨専門店や量販店等へ販売する事業区分の呼称）。

## 要確認（status に反映）

- businessModel: 2026年3月1日付で普通株式1株につき2株の割合で株式分割を行っています（主要な経営指標等の注記及び重要な後発事象に記載）。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] エスケイジャパンの主たる業界（キャラクター商品の企画・販売） → 提案: キャラクター商品・ファンシーグッズの企画卸売。当社グループは、キャラクターのぬいぐるみ・キーホルダー・家庭雑貨等を企画し、アミューズメント施設や雑貨専門店・量販店等へ販売する事業を営んでおり、2026年2月期の外部顧客への売上高はキャラクターエンタテインメント事業12,266百万円、キャラクター・ファンシー事業3,966百万円です。閉じた分類の19種にキャラクター商品の企画・卸売販売を表す区分がなく、商品の用途に最も近いentertainmentを暫定としました。
