# 藤井産業 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 藤井産業株式会社 |
| 証券コード | 9906 |
| docID（データを取り出した文書） | `S100YJUL` |
| 原本 docID | `S100YJUL` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJUL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 藤井産業株式会社 / 9906 / docID S100YJUL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
fujii-sangyo: 10 件の数値を有報XBRLと照合
有報: 藤井産業株式会社 有価証券報告書－第72期(2025/04/01－2026/03/31) (docID S100YJUL)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":74928970000,"latestFiling":74928000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":82714719000,"latestFiling":82714000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":91059805000,"latestFiling":91059000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":96100124000,"latestFiling":96100000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":2397190000,"latestFiling":2397000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":2742971000,"latestFiling":2742000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":3657766000,"latestFiling":3657000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":4123829000,"latestFiling":4123000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":3649444000,"latestFiling":3649000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":4208982000,"latestFiling":4208000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":5585900000,"latestFiling":5585000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":6028113000,"latestFiling":6028000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":54001549000,"latestFiling":54001000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":58735130000,"latestFiling":58735000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":64630362000,"latestFiling":64630000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":66704285000,"latestFiling":66704000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":30556827000,"latestFiling":30556000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":33065862000,"latestFiling":33065000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":36730747000,"latestFiling":36730000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":40078698000,"latestFiling":40078000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
fujii-sangyo: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: セグメント別外部売上高の合計は105,854百万円で、連結売上高105,856百万円と2百万円の差があります。地域別売上高の合計は105,855百万円で、連結売上高と1百万円の差があります。いずれも有報の印字どおりで、丸めによるものとして記録します。
- businessModel: 前期有報との修正再表示チェックでは、売上高・純利益等の前期比較値に千円単位と百万円単位の表示による差異のみがあり、実質的な修正再表示はありません。本文の「組替え」はその他の包括利益の組替調整額の注記を指すもので、表示の組替えではありません。会計方針の変更は該当事項なしと印字されています。
- businessModel: 売上高の10％以上を占める相手先はありません（主要な顧客ごとの情報）。海外売上高はありません（地域ごとの情報）。
- businessModel: 杉本電機産業株式会社とは2010年6月に資本・業務提携契約を締結し、同社は2026年3月31日現在で当社の発行済株式（自己株式を除く）の3.54％を保有する大株主ですが、非上場のため関連企業には結んでいません。
- businessModel: パナソニック株式会社とは照明器具等の販売代理店契約を結んでいますが、契約の相手先は非上場のパナソニック株式会社であり、パナソニック ホールディングス株式会社とは別会社のため関連企業には結んでいません。なお、パナソニック ホールディングス株式会社の株式は今後の売却を予定していると印字されています。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順です。マテリアルイノベーションズカンパニー59,382百万円、インフラソリューションズカンパニー38,461百万円、コマツ栃木6,490百万円、その他1,521百万円です。4セグメントの単純合計は105,854百万円で、連結売上高105,856百万円と2百万円の差があります。有報の印字どおりで、丸めによるものとして記録します。
- businessStructure: 連結子会社は8社、持分法適用関連会社は1社です（2026年3月31日現在）。すべて非上場のため関連企業には結んでいません。
- businessStructure: 2022年4月に社内カンパニー制を導入し、報告セグメントはマテリアルイノベーションズカンパニー、インフラソリューションズカンパニー、コマツ栃木、その他で構成されています。
- history: 1955年12月の設立時の資本金額は印字されていますが、沿革の金額の規則により記載していません。
- history: 沿革は有報の【沿革】の前文に印字された1883年の創業、1947年の藤井産業有限会社の設立、1949年の商号変更と、株式会社設立以後の沿革表の全行を記載しています。
- history: 2026年5月の吸収分割契約の締結は、持株会社体制への移行に向けたもので、効力発生日は2026年10月1日（予定）です。決算日時点では未実施のため、登録内容は決算日時点の構成としています（needsReviewに記録）。
- industry: 電設資材・電気機器・工作機械・情報機器・土木建設機械等の卸売を主な事業とする商社であるため、tradingを主たる業界としました。総合建築・設備工事は販売に附帯する施工であり、金額が独立して開示されていないためconstructionは付けていません。太陽光発電による売電はその他セグメントの一部で、金額が独立して開示されていないためenergyは付けていません。
- relatedCompanies: 富士電機・阪和興業・高島は特定投資株式の表に事業ごとの仕入先として個別の保有目的が印字されているためsupplierとして、東プレ・横浜ゴム・ＳＵＢＡＲＵ・ＪＳＰ・東京精密・古河機械金属・チノー・レオン自動機は同表に事業ごとの得意先として個別の保有目的が印字されているためcustomerとして結びました。
- relatedCompanies: めぶきフィナンシャルグループ・群馬銀行・栃木銀行・東邦銀行は取引金融機関が保有目的のため結びませんでした。群馬銀行は3.63％の大株主ですが、保有目的が金融取引のため結んでいません。足利銀行は4.66％の大株主ですが非上場のため結んでいません。
- relatedCompanies: 日東工業・日産自動車・未来工業・パナソニック ホールディングス・長谷工コーポレーションは今後の売却を予定していると印字されているため結びませんでした。中野冷機は当事業年度において売却しているため結びませんでした。カンセキと滝沢ハムは「地域上場企業との関係強化のため」という定型的な目的のみで、具体的な取引の印字がないため結びませんでした。
- relatedCompanies: コマツは、印字が連結子会社コマツ栃木株式会社に関するもので、株式会社小松製作所自体との取引・提携の印字がないため結びませんでした。サンユウは、印字が非上場の連結子会社株式会社サンユウに関するもので、上場の株式会社サンユウ（5697）とは別会社のため結びませんでした。
- relatedCompanies: 杉本電機産業株式会社は資本・業務提携契約の相手先で3.54％の大株主ですが、非上場で候補外のため結んでいません。役割はbusinessModelのindustryPositionに記録しています。
- relatedCompanies: イノベーション、エン、コア、キャリア、ゼロ、ベース、ポート、高速は一般語・部分一致の誤抽出のため結びませんでした（イノベーションは「マテリアルイノベーションズカンパニー」、エンは「エンジニアリング」、コアは「コアミ計測機」、キャリアは「キャリア形成」、ゼロは「Netゼロ」、ベースは「経常利益ベース」、ポートは「事業ポートフォリオ」、高速は「超高速通信技術」の部分一致）。
- relatedCompanies: 連結子会社8社と持分法適用関連会社1社はすべて非上場のため関連企業には結んでいません。
- relatedCompanies: 大株主のうち、藤井昌一・藤井幸子・小林保子は個人、藤和コンサル・藤井コンサルは非上場の資産管理会社、藤井産業取引先持株会・藤井産業社員持株会は持株会のため結んでいません。
- relatedCompanies: ＪＳＰは特定投資株式の表に産業システム事業の得意先として個別の保有目的が印字されていますが、有報の印字は「ＪＳＰ」のみで、登録名ジェイエスピーと照合できずゲートの名前確認を満たせないため結んでいません。

## 要確認（status に反映）

- businessModel: 2026年5月15日開催の取締役会において、2026年4月1日付けで設立した当社100％子会社である藤井産業マテリアルイノベーション株式会社及び藤井産業インフラソリューション株式会社と、2026年10月1日（予定）を効力発生日とする吸収分割契約の締結を決議した。2026年6月25日開催予定の定時株主総会による承認を条件として実施する。当社を分割会社、承継会社を吸収分割承継会社とする吸収分割で、当社は持株会社として引き続き上場を維持する。決算日（2026年3月31日）時点では持株会社体制への移行は未実施のため、登録内容は決算日時点の構成とした。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
