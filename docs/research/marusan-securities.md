# 丸三証券 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 丸三証券株式会社 |
| 証券コード | 8613 |
| docID（データを取り出した文書） | `S100YC95` |
| 原本 docID | `S100YC95` |
| 提出日（原本） | 2026-06-16 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YC95.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 丸三証券株式会社 / 8613 / docID S100YC95（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
marusan-securities: 10 件の数値を有報XBRLと照合
有報: 丸三証券株式会社 有価証券報告書－第106期(2025/04/01－2026/03/31) (docID S100YC95)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:OperatingRevenue1SummaryOfBusinessResults|2025-03-31","previousFiling":18849000000,"latestFiling":18850000000},{"key":"jpcrp030000-asr_E03760-000:NetOperatingRevenueSummaryOfBusinessResults|2022-03-31","previousFiling":18602000000,"latestFiling":18595000000},{"key":"jpcrp030000-asr_E03760-000:NetOperatingRevenueSummaryOfBusinessResults|2023-03-31","previousFiling":14872000000,"latestFiling":14865000000},{"key":"jpcrp030000-asr_E03760-000:NetOperatingRevenueSummaryOfBusinessResults|2024-03-31","previousFiling":18556000000,"latestFiling":18549000000},{"key":"jpcrp030000-asr_E03760-000:NetOperatingRevenueSummaryOfBusinessResults|2025-03-31","previousFiling":18800000000,"latestFiling":18795000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":3647000000,"latestFiling":3630000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":852000000,"latestFiling":843000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":4187000000,"latestFiling":4194000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":4048000000,"latestFiling":4113000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":90885000000,"latestFiling":90080000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":67601000000,"latestFiling":66841000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":84075000000,"latestFiling":82704000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":73363000000,"latestFiling":71596000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":47133000000,"latestFiling":45501000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":46086000000,"latestFiling":44484000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":52524000000,"latestFiling":50666000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":49008000000,"latestFiling":47723000000},{"key":"NumberOfEmployees|2022-03-31","previousFiling":1106,"latestFiling":1103},{"key":"NumberOfEmployees|2023-03-31","previousFiling":1098,"latestFiling":1095}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: revenue の候補が 2 件ある（営業収益 / 純営業収益）。indicators.txt で有報が実際に掲げている行を確認し、どれを採ったかをリサーチログに書くこと
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
marusan-securities: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.revenueSources[1]: 売上高と当期純利益以外の利益に触れていないか確認する（…トレーディング損益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高の行の選択：主要な経営指標等には「営業収益」と「純営業収益」の両方が印字されています。証券会社の収益の表示として先に掲げられ、MD&Aでも業績の総額として用いられている「営業収益」を採用しました（2026年3月期21,725百万円）。純営業収益（同21,674百万円）は本文には書いていません。
- businessModel: 前期有報との数値の差異：前期（第105期）の有価証券報告書は連結で作成されており、その印字は連結ベースです。今期有報の5年表は提出会社単体の数値のため、純営業収益・経常利益・総資産・純資産・従業員数などで前期有報の印字と異なります。理由が有報に印字されている（第105期以前は連結財務諸表を作成していた旨の注記と、丸三ファイナンスの吸収合併の記載）ため、needsReview ではなく financialNotes（2026年3月期）に記録し、値は今期有報のものを登録します。
- businessModel: 金額の表記：本文の金額は有報の印字どおりです。主要な経営指標等とMD&Aは百万円単位の印字のため、そのまま百万円で記載しました（換算・切り捨てはしていません）。株式投資信託の残高はMD&Aの印字どおり「1兆2,104億円」と記載しました。
- businessModel: 中期経営計画の数値目標（株式投資信託の預り資産純増額3,000億円、日本株の個別銘柄の預り資産純増額1,000億円、ROE8％以上、投資信託の信託報酬による販管費カバー率55％）は、投資に関する指標を含むため本文（perspectives を含む）には書かず、この warnings に記録します。
- businessModel: 「トレーディング損益」は有報の損益計算書に掲げられた収益の科目名そのままを revenueSources に記載しました。
- businessModel: 第106期の期末配当は2026年6月19日開催予定の定時株主総会の決議事項である旨が指標の注記にありますが、配当に関する事項は本文に書いていません。
- businessStructure: 報告セグメントは「投資・金融サービス業」の単一セグメントであり、セグメント情報等でも区分すべき事業セグメントは存在しないとされています。そのため事業は1つだけとし、部門別の内訳（株式部門・債券部門・投資信託・ファンドラップ部門）を children にしました。部門別の金額はMD&Aの印字（百万円）どおりです。
- businessStructure: 当事業年度末において関係会社は存在しません。連結子会社だった丸三ファイナンス株式会社は2025年4月1日付で当社が吸収合併しました（【関係会社の状況】・【企業結合等関係】）。そのため子会社は businesses の children には入れていません。
- businessStructure: 店舗数は【主要な設備の状況】に載る本店と支店・営業所28か所を数えたものです。
- history: 沿革に印字された資本金の金額（1909年の出資金、1944年の入サ証券の資本金、1983年・1986年・1996年の増資額）は本文に書いていません。1986年の行は上場の事実のみ、1996年の資本金増資のみの行は落としました。
- history: 丸三ファイナンス株式会社の吸収合併は2025年4月1日（当事業年度の期首）に完了し、当事業年度末の体制に反映済みのため、needsReview ではなく沿革に記載しました。
- industry: 主たる事業は有価証券を中核商品とする投資・金融サービス業（金融商品取引業）であり、報告セグメントもこの単一セグメントのみのため、finance を主たる業界としました。閉じた分類に直接合うため、暫定や taxonomyGaps はありません。
- relatedCompanies: 当事業年度末において関係会社は存在しません（【関係会社の状況】）。親会社・子会社・関連会社に当たる相手はいません。
- relatedCompanies: 岡三証券株式会社：2022年7月にマルサントレードに係る事業等を吸収分割により承継した相手ですが、過去1回限りの事業承継であり、現在の取引・提携の記載がないため結びませんでした（出来事は沿革に記載）。
- relatedCompanies: 特定投資株式の各銘柄：保有目的が「株式等の引受をはじめとする証券関連ビジネスの取引先として、取引関係の維持・強化を目的として株式を保有しております」という全銘柄共通の定型句（債券等・証券関連ビジネス等の語の置き換えを含む）だけであり、相手ごとの個別の取引の記載がないため結びませんでした。対象は東京応化工業、都築電気、サンワテクノス、東陽テクニカ、日本電波工業、日清食品ホールディングス、丸全昭和運輸、朝日印刷、平和不動産、ジーエルテクノホールディングス、有沢製作所、ヤマトインターナショナル、ミツバ、ヤマタネ、高砂香料工業、両毛システムズ、飯野海運、ニチモウ、イトーキ、リョーサン菱洋ホールディングス、技研ホールディングス、古林紙工、ハリマビステム、ベルク、三精テクノロジーズ、ソーダニッカ、SRAホールディングス、ソレキア、オリジン、マースグループホールディングス、千代田インテグレ、アルフレッサホールディングス、NCS&Aなどです。
- relatedCompanies: 株式会社三菱UFJフィナンシャル・グループ、株式会社みずほフィナンシャルグループ：保有目的が資金借入等を行う主要な取引金融機関としての資金調達であり、資金調達が理由のため結びませんでした。
- relatedCompanies: 日本証券金融株式会社：保有目的が貸借取引等を行う主要な取引金融機関としての資金調達等のため、資金調達が理由として結びませんでした。
- relatedCompanies: 第一生命ホールディングス株式会社：特定投資株式の定型句（債券等の引受をはじめとする証券関連ビジネスの取引先）のみのため結びませんでした。
- relatedCompanies: 日本生命保険相互会社：大株主の状況に7.89％（2026年3月31日現在）の保有が載りますが、保険会社であり、当社との取引の記載がないため major-shareholder としては結びませんでした。
- relatedCompanies: 株式会社みずほ銀行：大株主の状況に1.42％の保有が載りますが、銀行であり資金調達等の関係のため結びませんでした。
- relatedCompanies: 日本マスタートラスト信託銀行株式会社、三菱UFJ信託銀行株式会社、株式会社日本カストディ銀行、STATE STREET BANK AND TRUST COMPANY、JP MORGAN CHASE BANK：信託口・カストディとしての保有であり、純投資・管理業務のため結びませんでした。
- relatedCompanies: 公益財団法人長尾自然環境財団、丸三証券従業員持株会：事業会社ではなく、当社との取引の記載もないため結びませんでした。
- terms: 助言のみの工程です。用語候補：「ファンドラップ」（顧客と契約を結び、資産運用の方針の相談から実際の売買や管理までを一括して任せるサービス）、「信託報酬」（投資信託を保有している間に運用や管理の対価として継続的に差し引かれる費用で、販売会社にも配分される）、「受入手数料」（証券会社が売買の取次ぎや引受け、募集の取扱いなどの対価として受け取る手数料）。いずれも本文で使った語です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
