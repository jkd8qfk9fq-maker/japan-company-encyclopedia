# ＩＭＶ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＩＭＶ株式会社 |
| 証券コード | 7760 |
| docID（データを取り出した文書） | `S100XAL6` |
| 原本 docID | `S100XAL6` |
| 提出日（原本） | 2025-12-18 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XAL6.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＩＭＶ株式会社 / 7760 / docID S100XAL6（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
imv: 10 件の数値を有報XBRLと照合
有報: ＩＭＶ株式会社 有価証券報告書－第79期(2024/10/01－2025/09/30) (docID S100XAL6)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-09-30","previousFiling":11576008000,"latestFiling":11576000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-09-30","previousFiling":11888459000,"latestFiling":11888000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-09-30","previousFiling":13727527000,"latestFiling":13727000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-09-30","previousFiling":15340372000,"latestFiling":15340000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2021-09-30","previousFiling":937265000,"latestFiling":937000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-09-30","previousFiling":1065888000,"latestFiling":1065000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-09-30","previousFiling":1126156000,"latestFiling":1126000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-09-30","previousFiling":1428824000,"latestFiling":1428000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-09-30","previousFiling":1310239000,"latestFiling":1310000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-09-30","previousFiling":1237642000,"latestFiling":1237000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-09-30","previousFiling":1574156000,"latestFiling":1574000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-09-30","previousFiling":1853110000,"latestFiling":1853000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":17121775000,"latestFiling":17121000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":16964175000,"latestFiling":16964000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":17286085000,"latestFiling":17286000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":19284295000,"latestFiling":19284000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-09-30","previousFiling":7529872000,"latestFiling":7529000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-09-30","previousFiling":8275614000,"latestFiling":8275000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":9243329000,"latestFiling":9243000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-09-30","previousFiling":10217254000,"latestFiling":10217000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
imv: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「IMV株式会社」が EDINET の提出者名「ＩＭＶ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の印字どおりの百万円表記（売上高17,941百万円、親会社株主に帰属する当期純利益1,935百万円）を使った。売上高の前期比は販売実績の印字（前期比117.0％）から17.0％増とした。
- businessModel: 前期有報との修正再表示チェックの差異は、前期有報の千円単位の精密な値と当期有報の百万円単位の表示値との端数の差であり、遡及修正ではない。証拠パックの注意にある「遡及適用」の記載は、連結経営指標等の注記における収益認識基準の適用を指すものと判断し、financialNotesに記録した。
- businessModel: 経営上の数値目標である投下資本利益率（ＲＯＩＣ）８％以上と、2026年9月期の連結業績予想（売上高20,000百万円等）は、投資指標と将来予想であるため本文には書かず、ここに記録する。受注高21,757百万円と受注残高15,463百万円も本文には書いていない。
- businessModel: 期末配当（30円）は2025年12月19日開催予定の定時株主総会で決議して実施する予定と印字されており、提出時点では予定であるため本文には書かず、ここに記録する。2025年11月19日に開示した資本コストや株価を意識した経営の対応も、投資の語を含むため本文には書いていない。
- businessModel: suppliersキーはこのツリーのスキーマに無いため付けていない。同社の生産形態は重要部品を除く部品を外部パートナーに委託する形であり、個別の仕入先名は印字されていない。
- businessModel: 売上高・利益の両面で過去最高を更新した旨はMD&Aの印字どおりだが、利益の内訳（営業利益・経常利益の金額）は本文には書いていない。
- businessStructure: 単一セグメント（振動に関する事業）のため、子区分は【関連情報】の製品及びサービスごとの情報（外部顧客への売上高：振動シミュレーションシステム13,021百万円、テスト＆ソリューションサービス3,687百万円、メジャリングシステム1,232百万円）を使った。3部門の合計は17,940百万円で、印字の売上高17,941百万円とは1百万円異なるが、これは有報の丸めによるもので、印字の合計をそのまま引用した。
- businessStructure: 連結子会社は7社すべて未上場の自社グループ会社であり、関連企業としては結ばない。各社の資本金は本文の金額に当たるため書いていない。
- businessStructure: 従業員数は2025年9月30日現在で連結373人（外、平均臨時雇用者数106人）です。
- history: 沿革のうち、工場・営業所・テストラボの設置と移転の行（1957年伊丹の大阪工場設置、1960年東京工場設置、1964年東京工場移転、1971年東京営業所移転、1980年本社移転、1997年名古屋営業所移転、2005年本社・大阪工場の移転、2007年名古屋テストラボ開設、2009年鉄道車両用テストラボ開設、2015年東京テストラボ上野原サイト開設、2018年入間テストラボ開設、2019年春日井テストラボ開設、2021年東京営業所移転、2023年静岡営業所開設、2024年宇都宮営業所開設、2024年大阪本社の多目的試験所新設、2025年ベトナムのホーチミン支店設置、2025年横浜営業所開設）は拠点の変遷であり、採用しなかった。
- history: 取引所の再編に伴う形式的な上場先の変更（2010年大阪証券取引所ＪＡＳＤＡＱへの上場、2013年東京証券取引所ＪＡＳＤＡＱ（スタンダード）への上場）は採用せず、2005年の上場と2022年のスタンダード市場への移行のみを採用した。2011年の欧州テクニカルセンター設置は2013年の法人化の行で採用した。2017年の１G DYNAMICS LIMITEDの51％子会社化は2022年の100％子会社化の行で採用した。
- history: 株式会社データ・テクノの株式取得（2009年）と売却（2021年）は、小規模な子会社の取得と売却であり、採用しなかった。資本金の金額は沿革に書いていない。
- history: Wikipediaの記事「IMV」は、振動試験装置や計測器のメーカーである旨と本社所在地を述べるだけで、有報に無い補足が無いため使わなかった。
- industry: 主たる業界は振動試験装置・複合環境試験装置・振動計測装置等の製造・販売であり、閉じた集合ではmachineryがそのまま当てはまるため暫定の当てはめではない。単一セグメント（振動に関する事業）のため、2つ目の業界は付けなかった。
- relatedCompanies: 協立電機株式会社、日本電計株式会社、明治電機工業株式会社は、特定投資株式の保有目的に「主として振動シミュレーションシステムの販売取引先」と取引の役割が個別に印字されているため、販売取引先（customer）として結んだ。明治電機工業株式会社は200株と保有は小さいが、保有目的の印字が販売取引先であることを明示しているため、同じ判断とした。計上額は説明に書いていない。
- relatedCompanies: 国際計測器株式会社（特定投資株式4,000株）は、保有目的が「安定的な取引関係の維持・強化の為」という定型句のみで、取引の役割や分野の個別の印字がないため結ばなかった。
- relatedCompanies: エスペック株式会社は【大株主の状況】に載る事業会社であり、関係会社の4区分には当たらないため、major-shareholderとして結んだ。有報に同社との取引の印字はない。
- relatedCompanies: career（キャリア形成の文脈）、innovation（イノベーションの創出の文脈）、lec（フレックスタイムの一部）、core（「コア事業」の語で曖昧な一致）、en（東京エンジニアリングサービスという自社の事業所名の一部で曖昧な一致）、rhythm（振動設備診断の技術説明の文脈）、slogan（自社のスローガンの語）、the-lead（リードタイムの語）はいずれも一般語や別文脈の語への一致で、相手についての取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: 大株主のうち、有限会社ＳＥＩＫＯ、有限会社アフロ、ＩＭＶ取引先持株会、ＩＭＶ従業員持株会、個人株主、信託銀行・外国ファンドの保管口座は候補に含まれないか純投資であるため結ばなかった。連結子会社7社はすべて未上場の自社グループ会社で、候補に含まれない。
- terms: 助言のみ。用語候補: 振動シミュレーションシステム（振動試験装置の総称）、オールウェザーシミュレーションシステム（複合環境試験装置）、メジャリングシステム（振動計測装置・振動監視装置・地震監視装置・環境信頼性評価システムの総称）、テスト＆ソリューションサービス（受託試験サービス）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
