# ビジネスブレイン太田昭和 — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ビジネスブレイン太田昭和 |
| 証券コード | 9658 |
| docID（データを取り出した文書） | `S100YG97` |
| 原本 docID | `S100YG97` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG97.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ビジネスブレイン太田昭和 / 9658 / docID S100YG97（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
business-brain-showaota: 10 件の数値を有報XBRLと照合
有報: 株式会社ビジネスブレイン太田昭和 有価証券報告書－第59期(2025/04/01－2026/03/31) (docID S100YG97)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":2469336000,"latestFiling":2468494000},{"key":"ProfitLossBeforeTaxIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":3351561000,"latestFiling":3350285000},{"key":"TotalAssetsIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":45323141000,"latestFiling":45322298000},{"key":"EquityAttributableToOwnersOfParentIFRSSummaryOfBusinessResults|2025-03-31","previousFiling":29138505000,"latestFiling":29137663000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 非継続事業・財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
business-brain-showaota: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円単位で印字された数値を百万円単位に切り捨てて記載しました。MD&Aでは売上収益42,100百万円、親会社の所有者に帰属する当期利益2,987百万円と丸めた値が印字されていますが、切り捨て conventionに従い42,099百万円、2,986百万円、2,468百万円と記載しました。
- businessModel: 前期比8.5％はMD&Aに印字された売上収益の増減率です。
- businessModel: セグメント区分の変更（2区分から3区分への変更と前年の組替え）は表示変更のみのため、financialNotesには入れずbusinessStructureのwarningsに記録しました。
- businessModel: suppliersは、MD&Aの資金需要の説明でビジネスパートナーへの外注費の支払いが印字されているため、その一般名詞を用いて記載しました。
- businessModel: 2026年6月に予定された静岡支店の移転は、設備の新設・除却等の計画として印字された計画であり、完了した出来事としては書いていません。
- businessStructure: 事業名はセグメント注記の印字どおりとし、外部顧客への売上収益の大きい順（コンサルティング・システム開発、ＢＰＯ＆マネージドサービス、ＳＥＳ共創ビジネス）に並べました。
- businessStructure: セグメント区分は当連結会計年度より従来の2区分から3区分に変更され、前連結会計年度の値は必要な組替えをした上で記載されています。表示変更のみの組替えのため、financialNotesには入れず本warningsに記録します。
- businessStructure: 金額は千円単位で印字された外部顧客への売上収益を百万円単位に切り捨てて記載しました（切り捨て convention）。3区分の切り捨て後の合計は42,098百万円となり、連結売上収益の切り捨て後の42,099百万円と1百万円異なりますが、印字の値をそのまま用いました。
- businessStructure: MD&Aに印字されたセグメント別売上収益はセグメント間収益を含む合計値のため使用せず、セグメント注記の外部顧客への売上収益を用いました。
- businessStructure: 連結子会社13社の資本金の金額は書いていません。
- history: 沿革の各行は年月まで印字されていますが、historyの形に月は書けないため年に畳み、月はdescriptionに残しました。子会社設立時の資本金の金額は書いていません。
- history: 2014年11月から2016年2月までの沿革表と2021年8月から2024年7月までの沿革表は、年月が連続して印字され事象文と分かれている崩れた表でした。年月の数と事象の数が一致したため行順で対応づけました。このうち本fragmentでは、他の節でも裏付けられる2015年8月のプロネクサスとの業務提携、2022年4月のプライム市場移行、2023年5月のグローバルセキュリティエキスパートの持分法適用関連会社化、2024年のＢＢＳマネージドサービス設立を用いました。
- industry: 報告セグメントはいずれもコンサルティング、システム開発、BPO等のITサービスであり、売上の大半を占めるためit（IT・ソフトウェア）を主たる業界としました。
- relatedCompanies: グローバルセキュリティエキスパート（global-security-experts）: 【関係会社の状況】で持分法適用会社（議決権39.9％、2026年3月31日現在）と印字される自社グループの関連会社のため、関連企業リンクにはしませんでした。
- relatedCompanies: ＧＳＩクレオス（gsi-creos）: 特定投資株式の保有目的は「安定的な取引関係（システム開発売上等）の維持」で、他の銘柄と同一の定型文のため、それだけでは結びませんでした。
- relatedCompanies: クリヤマホールディングス（kuriyama-holdings）: 特定投資株式の保有目的はＧＳＩクレオスと同一の定型文のため、それだけでは結びませんでした。
- relatedCompanies: ＯＤＫソリューションズ（odk-solutions）: その他の包括利益を通じて公正価値で測定する金融資産の銘柄として名前が挙がるだけで、個別の取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: 光通信（hikari-tsushin）: 大株主は光通信ＫＫ投資事業有限責任組合であり、株式会社光通信とは別法人のため結びませんでした。
- relatedCompanies: アルゴグラフィックス（argo-graphics）: 沿革で2004年12月のＰＬＭジャパン設立時の第三者割当増資の相手として挙がるだけの過去の事実のため結びませんでした。
- relatedCompanies: 株式会社日立ソリューションズ: 2005年12月28日付で資本・業務提携を締結し、2025年2月13日に資本提携を解消して業務提携を継続することで合意したと【重要な契約等】に印字されていますが、related-candidates.jsonに無く未上場の子会社のため結びませんでした。
- relatedCompanies: レイ（ray）: 社名の部分一致による機械抽出で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: ポート（port）: 社名の部分一致による機械抽出で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: イノベーション（innovation）: 「プロセスイノベーションサービス」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: エン（en）: 「エンタープライズ」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: ステップ（step）: 収益認識の「5ステップ」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: ゼロ（zero）: 「実質ゼロ」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: トラスト（trust）: 日本マスタートラスト信託銀行（信託口）等の信託口の記載による一致で、純投資の信託口のため結びませんでした。
- relatedCompanies: キャリア（career）: 「キャリア採用」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: イシン（ishin）: 語句の部分一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: ランド（land）: 「グランドデザイン」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: 日新（nissin）: 語句の部分一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: ベース（base-4481）: 「ベースとした」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: コア（core）: 語句の部分一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: レント（rent）: 「タレント」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: リックス（rix）: 語句の部分一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- relatedCompanies: ビジョン（vision）: 「長期ビジョン」等の語句の一致で、当社との取引・提携の説明が印字されていないため結びませんでした。
- terms: 助言: 用語「ＢＢＳサイクル」は、コンサルティング、情報技術の活用支援やシステム導入、業務のアウトソーシングを一体で提供する同社グループの提供形態を指します（経営方針に印字）。
- terms: 助言: 用語「ＢＰＯ」は、業務プロセスのアウトソーシングを指し、同社では人事給与・経理等の領域でサービスを提供しています（事業の内容・セグメント情報に印字）。
- terms: 助言: 用語「ＳＥＳ」は、システムエンジニアが顧客業務に従事する役務提供の契約形態を指します（収益の注記に印字）。
- terms: 助言: 用語「Act-Horizon」は、同社が加速するとした自社ソリューションのビジネスを指します（経営方針に印字）。

## 要確認（status に反映）

- businessModel: 株式分割: 2026年4月1日を効力発生日として、普通株式1株につき3株の割合で株式分割を実施しました。後発事象として印字された事項です。株式数に関する指標は2022年3月期の期首に当該分割が行われたと仮定して算定されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
