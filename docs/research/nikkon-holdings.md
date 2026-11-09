# ニッコンホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ニッコンホールディングス株式会社 |
| 証券コード | 9072 |
| docID（データを取り出した文書） | `S100YVHV` |
| 原本 docID | `S100YLI5` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YVHV／有効文書 S100YVHV（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YVHV.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ニッコンホールディングス株式会社 / 9072 / docID S100YLI5（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nikkon-holdings: 10 件の数値を有報XBRLと照合
有報: ニッコンホールディングス株式会社 訂正有価証券報告書－第85期(2025/04/01－2026/03/31) (docID S100YVHV)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":428759000000,"latestFiling":431273000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":249679000000,"latestFiling":250635000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第85期(2025/04/01－2026/03/31)、docID S100YVHV）を有効文書としてこのパックを作った。原本は docID S100YLI5。原本との主要財務の差異: S100YVHV（1件） — amendments.records[].comparedToBase を見ること
注意: 訂正有報の分類: financial-change — 数値が原本と異なる（主要財務 1 件／その他の数値 33 件: BasicEarningsLossPerShareSummaryOfBusinessResults・DilutedEarningsPerShareSummaryOfBusinessResults・ExtraordinaryIncome・GainOnSalesOfInvestmentSecuritiesEI・IncomeBeforeIncomeTaxes・IncomeTaxes・IncomeTaxesDeferred・LossGainOnSalesOfInvestmentSecuritiesOpeCF・LossOnSalesOfInvestmentSecuritiesEL・NetAssets・NetChangesOfItemsOtherThanShareholdersEquity・OtherComprehensiveIncome）。このパックの数値は有効文書のもの。原本の数値を出典にした記述が混ざっていないか確認すること
注意: 前期の窓に 訂正有価証券報告書－第83期(2023/04/01－2024/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
nikkon-holdings: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…償却費といった費用を差し引いた残りが利益になります。2026年3月期のは17…）

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesには、有効文書が訂正有価証券報告書である件と、中央紙器工業の買収に係る暫定的な会計処理の確定で第84期の主要指標が更新された件を記録した。訂正前の原本の数値は本文に使っていない。
- businessModel: perspectivesのstrategyは、中期経営計画について印字された売上高の目標のみを使い、営業利益や自己資本当期純利益率などの目標値は文章の規則により書かなかった。
- businessModel: 2024年10月1日付の株式分割（1株を2株）は1株当たり指標だけに関わるため、本文・financialNotesには書かなかった。
- businessStructure: 事業の並び順は、セグメント情報に印字された2026年3月期の外部顧客への売上高の大きい順（運送124,339百万円、梱包57,648百万円、倉庫42,976百万円、テスト24,569百万円）。「その他事業」は、有報が報告セグメントに含まれない事業セグメントと明記する区分のため、金額が印字されていても最後に置いた。
- businessStructure: 事業の内容に印字された関係会社数（運送57社・倉庫28社・梱包36社・テスト4社・その他37社）は事業間の重複を含む数で、そのまま説明に使った。
- businessStructure: 中核子会社の日本梱包運輸倉庫株式会社は、決算期末後の2026年4月1日にニッコン株式会社へ商号変更している（needsReviewに記録）。本文は2026年3月31日現在の商号で書いた。
- history: 沿革は通常の表形式で印字されており、年月と出来事の対応づけは不要だった。多数の子会社設立・買収の中から、創業、上場、商号変更、持株会社化、海外展開、近年の買収の節目を選んだ。
- history: wikipedia.jsonの記事「ニッコン」は主に事業子会社（旧・日本梱包運輸倉庫、現ニッコン）を扱うもので、補足に必要な事実は有報で足りたため使わなかった。
- industry: 主分類はtransportation。4つの報告セグメントはいずれも物流サービスで、最大の運送事業が連結売上高の46.1％を占め、残りも保管・梱包・テストと物流に付随する事業である。
- industry: その他事業には不動産の売買・賃貸、発電・売電、包装材の製造販売などが含まれるが、報告セグメントではなく、金額も独立して開示されていないため、real-estateやenergyなどの分類は付けなかった。
- relatedCompanies: honda: 主要な顧客として有報が売上高と割合を印字し、特定投資株式の保有理由にも70年にわたる取引の記述があるためcustomerで結んだ。大株主（4.19％）でもある点は説明に併記した。
- relatedCompanies: seino-holdings: 保有目的に「共同出資会社を設立するなど、物流分野における業務提携」と相手固有の提携の記述があるためbusiness-partnerで結んだ。
- relatedCompanies: aica-kogyo / eidai / hirata / iseki-and-co / nitto-kogyo / osaki-electric: 特定投資株式の保有目的が相手固有の取引関係（主要な取引先・重要な取引先・業容拡大方針に合致する取引先）を述べ、保有株式数も11万株以上と小さくないためbusiness-partnerで結んだ。取引の向きは相手ごとに印字されていないためcustomer/supplierにはしなかった。計上額は説明に書いていない。
- relatedCompanies: mitsubishi-ufj-financial-group / mizuho-financial-group: 保有目的は金融サービスの分野における取引関係の維持・強化であり、資金調達・金融取引が理由のため結ばなかった。
- relatedCompanies: yaskawa-electric: 出現箇所は、子会社の株式会社ニッコン北九の労働組合が安川電機関連労組協議会に加盟している旨のみで、同社との取引・提携の記述ではないため結ばなかった。
- relatedCompanies: saftec: 有報は非連結子会社として「株式会社セフテック」の名称を印字するが、証券コード・住所の印字がなく、上場しているセフテック（7464）と同一の会社か証拠パックからは確認できないため結ばなかった。
- relatedCompanies: nissin: 候補の上場区分が「コードリストにない」うえambiguousで、本文中の出現は一般語の断片のため結ばなかった。
- relatedCompanies: seki / en / zero / base-4481 / innovation / will / king / land / port / space / vision: 本文中の出現は一般語・地名（ウィルミントン等）・自社子会社名（エヌケイエンジニアリング）の一部などの断片で、相手企業についての取引・提携・資本関係の記述がないため結ばなかった（enは子会社名の一部、zeroは「ネットゼロ」、willは地名ウィルミントン、portは「トランスポートジャパン」の一部）。
- relatedCompanies: trust: 出現箇所は日本マスタートラスト信託銀行（信託口）の名称の一部で、候補企業そのものではないため結ばなかった。
- relatedCompanies: 大株主のうち本田技研工業以外の事業会社は候補にない。信託銀行・証券会社のカストディ口座、従業員持株会、創業家関係の一般社団法人などは結ぶ対象ではない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は、事業の内容に印字された業務名（梱包・流通加工・納入代行・通関業）から、一般の読者に分かりにくいものを選んだ。

## 要確認（status に反映）

- businessStructure: 決算期末後の2026年4月1日付で、連結子会社の日本梱包運輸倉庫株式会社がニッコン株式会社に、株式会社中国物流サービスが株式会社ニッコンウエストに商号変更しています（関係会社の状況の注記に記載）。このページの記載は2026年3月31日現在の商号に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
