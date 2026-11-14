# ＪＣＲファーマ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＪＣＲファーマ株式会社 |
| 証券コード | 4552 |
| docID（データを取り出した文書） | `S100YSOS` |
| 原本 docID | `S100YF19` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YSOS, S100YF1L／有効文書 S100YSOS（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YSOS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 3 | ＪＣＲファーマ株式会社 / 4552 / docID S100YF19（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 4 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jcr-pharmaceuticals: 10 件の数値を有報XBRLと照合
有報: ＪＣＲファーマ株式会社 訂正有価証券報告書－第51期(2025/04/01－2026/03/31) (docID S100YSOS)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":-4759000000,"latestFiling":-4460000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":-7477000000,"latestFiling":-7046000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":104855000000,"latestFiling":104849000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":47435000000,"latestFiling":47734000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第51期(2025/04/01－2026/03/31)、docID S100YSOS）を有効文書としてこのパックを作った。原本は docID S100YF19。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（ManagementAnalysisOfFinancialPositionOperatingResultsAndCashFlowsTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 訂正有価証券報告書－第50期(2024/04/01－2025/03/31) が提出されている（当期以外）。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
jcr-pharmaceuticals: 本文の金額 3 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「JCRファーマ株式会社」が EDINET の提出者名「ＪＣＲファーマ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YSOS、2026年7月29日提出）です。原本（docID S100YF19）との主要財務数値の差異はなく、分類はtext-changeで、本文は有効文書から書いています。出典のtitle・url・publishedAtは有効文書の値にしました。
- businessModel: 表示方法の変更は表示区分の組替えだけのため、financialNotesには載せていません。
- businessModel: MD&Aの主要な売上の表は主要な製品だけの表で、製品計と契約金収入の合計は連結売上高と一致しません。そのため製品別の金額は本文に書いていません。
- businessModel: 調達先は、有報が外部の調達先を一般名詞で示していないため、suppliersは省きました。購買業務は連結子会社の株式会社クロマテックが担う旨だけが印字されています。
- businessModel: 金額はすべて有報の百万円印字のまま用い、換算や丸めはしていません。
- businessModel: 2026年4月1日より新しい経営体制に移行した旨が経営方針に印字されていますが、決算日後の体制変更のため、本文の構造説明には含めていません。
- businessModel: 研究開発費の金額は本文の財務数値の対象外のため、本文には書いていません。
- businessStructure: 報告セグメントは医薬品事業の単一セグメントであり、セグメント情報の記載は省略されています。そのため事業は1つだけとし、【事業の内容】に印字されたグループ各社の役割をchildrenにしました。
- businessStructure: 製品及びサービスごとの情報と地域ごとの情報は、いずれも単一区分・本邦の割合が90％を超えるため記載が省略されています。金額が独立して開示されていない区分には金額を書いていません。
- businessStructure: 主要な顧客は、セグメント情報の【関連情報】の主要な顧客ごとの情報に印字された2社をcustomersにしました。
- businessStructure: 神戸市西区に工場と研究所が集中し、本社は兵庫県芦屋市、東京事務所は東京都港区にありますが、設備と事業の対応はすべて医薬品事業のため、拠点は事業に結びつけていません。
- history: 沿革は年月と事象が対応して印字されており、崩れた表ではないため、行順の対応づけは行っていません。選んだのは設立、商号変更、上場・市場移行、主要製品の発売、提携と拠点の主な出来事です。
- history: 沿革に印字された子会社設立や工場・研究所の開設のうち、設備管理会社や海外子会社の設立など小さな出来事は省きました。
- history: 子会社や関連会社の設立に伴う資本金の金額は、本文の財務数値の対象外のため、沿革には書いていません。
- history: 2022年10月に台湾のマイセナックス　バイオテック　インクの株式を取得した出来事は、沿革では年月が2022年10月の行に続けて印字され、対応が読み取りにくいため、沿革には入れていません。
- industry: 主たる業界はpharmaceuticalsとしました。報告セグメントは医薬品事業の単一セグメントで、売上高のすべてが医薬品事業によるものです。
- industry: 再生医療等製品も医薬品事業の中の製品のため、副次分類は付けていません。
- relatedCompanies: medipal-holdingsは【関係会社の状況】の区分が「その他の関係会社」のため、relationshipはother-affiliated-companyとしました。顧客関係と提携関係は説明に含めています。
- relatedCompanies: kissei-pharmaceuticalは主要な顧客ごとの情報と大株主の状況の両方に載りますが、主な関係は顧客としての取引のため、relationshipはcustomerとしました。
- relatedCompanies: mochida-pharmaceuticalは特定投資株式に載るだけです。保有目的は中長期的な関係維持で、現時点では事業上の取引は終了していると印字されているため、結びませんでした。
- relatedCompanies: sumitomo-pharmaは販売権の許諾先であり、仕向が販売そのものではないため、customerやsupplierではなくbusiness-partnerとしました。
- relatedCompanies: sysmexとmodalis-therapeuticsは、共同での会社設立と共同研究という具体的な協力の事実が印字されているため、business-partnerとしました。
- relatedCompanies: イタルファルマコ、アレクシオン・アストラゼネカ・レアディジーズ、アンジェリーニ・ファーマ、アキュメン・ファーマシューティカルズ、フェーリング・ファーマ、メナジェン・ファーマシューティカル・インダストリーズ、メゾブラストは、重要な契約等の相手先ですが、関連候補になくEDINETコードリストで確認できない海外企業等のため、結ばず事実だけをここに記録します。イタルファルマコとは2025年12月にGivinostatの日本における開発および商業化の独占的ライセンス契約と、希少疾病治療薬の戦略的提携契約を締結しています。
- relatedCompanies: グラクソ・スミスクライングループは2009年の包括契約と2017年までの筆頭株主の事実がありますが、関連候補になく、現在の提携関係は印字されていないため、結びませんでした。
- relatedCompanies: step、en、alpha-4760、alpha、port、base-4481、cedar、cota、vision、core、corona、king、brass、career、future、nac、seki、slogan、trustは、一般語や製品名の一部、株主名簿の信託口などの部分一致であり、その相手についての取引・提携・資本関係の記述がないため、結びませんでした。
- relatedCompanies: 連結子会社8社と持分法適用関連会社1社は当社グループ自身のため、関連企業のリンクとはしませんでした。
- terms: 助言: 「J-Brain Cargo®」は用語集の登録候補になります。同社独自の血液脳関門通過技術で、ライソゾーム病治療薬の研究開発に適用されています。
- terms: 助言: 「JUST-AAV」は用語集の登録候補になります。アデノ随伴ウイルスベクターを用いた新しい遺伝子治療技術で、特定の組織へベクターを送達し、肝臓への集積を減らすことが期待されています。
- terms: 助言: 「ライソゾーム病」は用語集の登録候補になります。同社が治療薬の研究開発に重点的に取り組む希少疾病の領域です。
- terms: 助言: 「オーファンドラッグ（希少疾病用医薬品）」は用語集の登録候補になります。開発品が欧州委員会、米国食品医薬品局、厚生労働省から指定を受けています。

## 要確認（status に反映）

- businessModel: 2025年3月期の親会社株主に帰属する当期純損失などの5年間指標が前期有報の印字と異なりますが、当期有報の本文に差異の理由の説明が見当たらず、第50期の訂正有価証券報告書が2026年6月23日に提出されたことだけが確認できます。登録数値は当期有報の値を使っています。
- history: 沿革の2026年「先進バイオ医薬研究所を開設」は、決算日（2026年3月31日）後の2026年4月1日に稼働した出来事として印字されています。2026年3月31日現在の体制には、この研究所は含まれていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
