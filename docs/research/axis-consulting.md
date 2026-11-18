# アクシスコンサルティング株式会社 — research log

Registered: 2026-11-18（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | アクシスコンサルティング株式会社 |
| 証券コード | 9344 |
| docID（データを取り出した文書） | `S100Z3ZU` |
| 原本 docID | `S100Z3ZU` |
| 提出日（原本） | 2026-09-28 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3ZU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | アクシスコンサルティング株式会社 / 9344 / docID S100Z3ZU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
axis-consulting: 8 件の数値を有報XBRLと照合
有報: アクシスコンサルティング株式会社 有価証券報告書－第25期(2025/07/01－2026/06/30) (docID S100Z3ZU)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-06-30","previousFiling":3008000000,"latestFiling":3513000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-06-30","previousFiling":3912000000,"latestFiling":4342000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-06-30","previousFiling":4082000000,"latestFiling":4665000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-06-30","previousFiling":410000000,"latestFiling":493000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-06-30","previousFiling":619000000,"latestFiling":644000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-06-30","previousFiling":614000000,"latestFiling":831000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-06-30","previousFiling":1950000000,"latestFiling":2104000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-06-30","previousFiling":3401000000,"latestFiling":3497000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-06-30","previousFiling":3824000000,"latestFiling":4112000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-06-30","previousFiling":838000000,"latestFiling":862000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-06-30","previousFiling":2614000000,"latestFiling":2654000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-06-30","previousFiling":2995000000,"latestFiling":3168000000},{"key":"NumberOfEmployees|2022-06-30","previousFiling":62,"latestFiling":85},{"key":"NumberOfEmployees|2023-06-30","previousFiling":86,"latestFiling":102}]
利益・総資産・純資産・従業員数: 16 件を照合
すべて一致しました。
axis-consulting: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報（第24期）との数値の差異（2022年6月期から2024年6月期の売上高・経常利益・総資産・純資産・従業員数）は、第24期に連結財務諸表を作成しておらず前期有報の主要な経営指標等が提出会社単体の数値であったのに対し、今期有報の表が連結の数値であることによる表示ベースの違いです。訂正ではなく、今期有報の印字値を採用しました。
- businessModel: 主要な経営指標等の注記１から４（新規上場に伴う潜在株式調整後１株当たり当期純利益のみなし算定、非上場であった第21期の潜在株式調整後１株当たり当期純利益と株価収益率を記載しない理由、従業員数の定義）は表示・定義事項のため、financialNotesではなくここに記録します。
- businessModel: 会社が重要な経営指標と位置づける売上高と営業利益のうち、営業利益は利益指標のため、本文と戦略には数値目標として書かず、存在のみをここに記録します。経営成績等の分析の利益ラインの金額と理由は本文に書いていません。
- businessModel: 株式会社サン・システムプランニングの全株式取得による子会社化（2026年2月3日）は当連結会計年度中の出来事であり、期末現在の構造として本文に反映しているため、needsReviewには書いていません。同社の売上高はスキルシェアの売上高に含まれており、個別の金額は開示されていません。
- businessModel: 配当や内部留保に関する財務政策は資本政策の事項のため、本文には書かずここに記録します。
- businessModel: 主要な経営指標等の注記７（第25期は連結財務諸表の作成を再開した初年度のため、自己資本に対する収益性の指標は期末自己資本に基づいて算出されている旨）は、指標の算出方法の説明であり、financialNotesの注記には再開初年度である旨までを記録し、算出基礎の詳細はここに記録します。
- businessStructure: suppliersキーは旧スキーマのため省略しました。スキルシェアでは、役務提供を受ける企業と当社が業務委託の基本契約・個別契約を締結し、当社とフリーコンサルタントとの間でも業務委託契約を締結する形式であり、この供給側の構図は事業の説明に含めています。
- businessStructure: 当社グループはヒューマンキャピタル事業の単一セグメントであり、サービス別の金額は【セグメント情報等】の関連情報（製品及びサービスごとの情報）の外部顧客への売上高から採りました。株式会社サン・システムプランニングの売上高はスキルシェアに含まれると注記されており、分離できないため同社の金額は書いていません。
- history: 沿革のうち、本社の移転（2010年・2013年）、大阪オフィスの開設（2020年）と移転（2025年）、2025年7月のコーポレートリブランディングとサービスリニューアルは事業の転機ではないため落とし、ここに列挙します。
- history: 中国向けシニア人材派遣・海外進出支援のための日中管理学院株式会社の設立（2010年）、ＪＣＭＳ株式会社への商号変更（2015年）、アクシス・グローバルパートナーズ株式会社の設立（2019年）と両社の合併・吸収合併（2019年・2020年）は、現在の事業構造に残っていない海外関連子会社の変遷のため落とし、ここに記録します。
- history: 沿革には年月まで印字されていますが、monthキーは書かず年だけを記録しました。設立時の資本金額は沿革に書いていません。
- industry: ヒューマンキャピタル事業の単一セグメントは、人材紹介とスキルシェアによる人材サービスそのものであるため、human-resources が直接適合し、暫定分類は付けていません。
- industry: 連結子会社の株式会社サン・システムプランニングはシステム開発・運用を行いますが、その売上高はスキルシェアの売上高に含まれ個別に開示されておらず、ヒューマンキャピタル事業の一部として運営されているため、it の副次分類は付けませんでした。
- relatedCompanies: acmos（アクモス株式会社）は、2002年の設立時の親会社であり2009年にMBO方式で独立しましたが、今期有報の関係会社の状況・大株主の状況に現在の資本・取引関係の記載がないため、結びませんでした。
- relatedCompanies: 主要な顧客であるＰｗＣコンサルティング合同会社（売上高1,593百万円、19.2％）とアクセンチュア株式会社（同927百万円、11.2％）は、いずれも非上場で関連企業候補に含まれていないため、結びませんでした。
- relatedCompanies: 大株主の株式会社創（38.53％）は非上場で関連企業候補に含まれていないため、結びませんでした。その他の大株主は個人と従業員持株会、投資事業有限責任組合です。
- relatedCompanies: 株式の保有状況では、純投資目的以外の目的である投資株式はすべて非上場株式（貸借対照表計上額126百万円）とされており、銘柄名の開示がないため、結べる相手はありませんでした。
- relatedCompanies: 2023年3月の上場時の第三者割当増資の割当先である野村證券株式会社は、資本政策上の割当のみであり、上場会社の野村ホールディングスとは別の法人であるため、結びませんでした。
- relatedCompanies: 連結子会社である株式会社サン・システムプランニングは自社の子会社のため、関連企業には含めませんでした。

## 要確認（status に反映）

- businessModel: 2022年11月７日付で普通株式１株につき30株の割合で株式分割を行っています。主要な経営指標等の注記に、当該株式分割が第21期の期首に行われたと仮定して指標が算出されている旨が記載されています。本登録は株式分割後の株式数に基づく指標で登録しています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
