# 北恵 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 北恵株式会社 |
| 証券コード | 9872 |
| docID（データを取り出した文書） | `S100XM1D` |
| 原本 docID | `S100XM1D` |
| 提出日（原本） | 2026-02-18 |
| 決算期 | 2025-11-20 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XM1D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 北恵株式会社 / 9872 / docID S100XM1D（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kitakei: 10 件の数値を有報XBRLと照合
有報: 北恵株式会社 有価証券報告書－第67期(2024/11/21－2025/11/20) (docID S100XM1D)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2021-11-20","previousFiling":57225522000,"latestFiling":57225000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-11-20","previousFiling":60874559000,"latestFiling":60874000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-11-20","previousFiling":62368994000,"latestFiling":62368000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-11-20","previousFiling":61286027000,"latestFiling":61286000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2021-11-20","previousFiling":644112000,"latestFiling":644000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2022-11-20","previousFiling":641133000,"latestFiling":641000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2023-11-20","previousFiling":812621000,"latestFiling":812000000},{"key":"jpcrp_cor:NetIncomeLossSummaryOfBusinessResults|2024-11-20","previousFiling":718919000,"latestFiling":718000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2021-11-20","previousFiling":920064000,"latestFiling":920000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-11-20","previousFiling":1005149000,"latestFiling":1005000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-11-20","previousFiling":1172995000,"latestFiling":1172000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-11-20","previousFiling":1096869000,"latestFiling":1096000000},{"key":"TotalAssetsSummaryOfBusinessResults|2021-11-20","previousFiling":27381510000,"latestFiling":27381000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-11-20","previousFiling":28697910000,"latestFiling":28697000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-11-20","previousFiling":29008667000,"latestFiling":29008000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-11-20","previousFiling":29082740000,"latestFiling":29082000000},{"key":"NetAssetsSummaryOfBusinessResults|2021-11-20","previousFiling":12400270000,"latestFiling":12400000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-11-20","previousFiling":12816595000,"latestFiling":12816000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-11-20","previousFiling":13355482000,"latestFiling":13355000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-11-20","previousFiling":13748987000,"latestFiling":13748000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
kitakei: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の前期有報（第66期）との突合では、売上高・当期純利益・経常利益・総資産額・純資産額の各系列に差異があったが、いずれも百万円未満の端数の切り捨てによるものである。第67期より金額の表示単位を千円単位から百万円単位に変更し、第66期以前についても百万円単位に変更した旨が主要な経営指標等の注記および財務諸表の注記に明示されており、５年間の指標に実質的な影響はないため、warnings のみの記録とし、登録は当期有報の印字どおりとする。
- businessModel: 当社が主な目標数値とする経営指標の名称（収益性に関する比率の名称を含む）は転記せず、経営方針の定性的な要約のみとした。当該指標の実績値やROE・PBRの数値も転記していない。
- businessModel: MD&Aの利益項目は売上高と当期純利益のみを本文に転記し、その他の利益項目や比率は転記していない。売上高総利益率等の比率も転記していない。
- businessModel: Wikipediaの記事（北恵）は見つかったが、有報の記載を超える内容を含まないため、情報源には加えていない（情報源は有報のみ）。
- businessStructure: 当社は連結財務諸表を作成しておらず、事業は新建材、住宅設備機器等の建材販売事業（施工付販売含む）並びにこれらの付帯業務の単一事業であり、開示対象となるセグメントはないため、セグメント情報の記載は省略されている。各事業の内訳には、収益認識関係の注記に印字された顧客との契約から生じる収益の分解情報（完成工事高24,953百万円、建材・木材製品等14,128百万円、住宅設備機器14,081百万円、その他4,235百万円、施工付販売1,578百万円、合計58,977百万円で印字合計と一致）を用いた。
- businessStructure: MD&Aの販売実績に印字された品目別金額（木質建材6,621百万円、非木質建材3,667百万円、合板1,387百万円、木材製品2,451百万円）は、その合計が収益認識関係の注記の建材・木材製品等14,128百万円と２百万円相違し、商品販売の小計も印字小計34,024百万円と４百万円相違する。いずれも印字どおりとし、構成要素の細分は事業の内容の取扱主要商品の記載で補った。
- businessStructure: 非連結子会社は有限会社古賀文化瓦工業所の１社であり、持分法適用会社はない旨が事業の内容に印字されている。関係会社の状況は「該当事項はありません」とされている。子会社の資本金の額は転記していない。
- history: 沿革の各行には資本金の額を転記していない。1950年２月７日は額面変更のための合併に伴う形式上の設立登記年月日であり、実質上の存続会社の設立以後の経緯として沿革に印字された内容を記録した。
- history: 営業所の開設・移転等の細目は主要なものに絞って記録した。
- industry: 主たる業界は trading とした。当社は東証の業種分類では卸売業に属し、木材店、建材店、工務店、住宅会社等への住宅資材の卸売が事業の中心である。完成工事高は売上高の42.3％を占めるが、有報では建材販売事業（施工付販売含む）並びにこれらの付帯業務の単一事業とされており、施工付販売は商品販売に付帯する工事として一体で営まれているため、建設業は２つ目の業界として付けていない。
- relatedCompanies: 関連企業は０件とした。株式の保有状況の特定投資株式には11銘柄が印字されているが、各銘柄の保有目的は、取引の品目（外壁材等の仕入、キッチンパネル等の仕入、内装建材等の仕入、給湯器等の仕入、住宅設備機器等の販売・仕入、外構工事等の売上、外壁材等の販売）を入れ替えた同一の定型文であり、業務提携等の具体的な内容の印字はないため、この定型文のみでは結ばなかった。各銘柄の印字された取引の役割は次のとおり。ニチハ：外壁材等の仕入。アイカ工業：キッチンパネル等の仕入。永大産業：内装建材等の仕入。ノーリツ：給湯器等の仕入。株式会社ＬＩＸＩＬ：住宅設備機器等の仕入（候補一覧に無い）。住友不動産：外構工事等の売上。飯田グループホールディングス：住宅設備機器等の販売。ヤマダホールディングス：外構工事等の売上。ナガワ：外壁材等の販売。
- relatedCompanies: 株式会社三菱ＵＦＪフィナンシャル・グループおよび株式会社りそなホールディングスの保有目的は、両社とも同一の資金調達・業務支援に関する定型文（金融取引に関するもの）であり、結ばなかった。なお、大株主の状況に印字された株式会社りそな銀行および三菱ＵＦＪ信託銀行株式会社は、各ホールディングスとは別の法人である。
- relatedCompanies: 吉野石膏株式会社は発行済株式の3.77％を保有する大株主だが、候補一覧に無く、取引関係の印字も無いため結ばなかった。
- relatedCompanies: 光通信は、大株主の状況の印字が光通信ＫＫ投資事業有限責任組合（無限責任組合員は光通信株式会社）であり、株式会社光通信とは別の主体であるため結ばなかった。
- relatedCompanies: 住友林業、クリナップ、タカラスタンダード、日本アクア、ケイアイスター不動産、アークランズ、ミサワ（売掛金の相手先別内訳のミサワホームとは別の会社）は、受取手形・電子記録債権・売掛金・支払手形の相手先別内訳に名称が現れるのみで、提携関係の印字は無く、金額は関連企業の説明に転記できないため結ばなかった。双日は双日建材株式会社の部分一致であり別の会社である。
- relatedCompanies: 有限会社古賀文化瓦工業所は当社の非連結子会社であり、グループ内の会社であるため結ばなかった。
- relatedCompanies: その他の候補（エン、ランド、キャリア、イノベーション、パス、セキ、シントウ（新東京ビル等の部分一致）、タヤ（個人株主の氏名の部分一致）、ゼット（建材の品目名の部分一致）等）は一般語・部分文字列の一致であり、相手についての取引・提携・資本関係の印字がないため結ばなかった。
- terms: 助言: 用語「KITAKEI商品」は、同社のオリジナル商品（プライベートブランド商品）の名称で、1978年に開発・販売を開始した。海外の提携工場にて生産された無垢フローリングや、国内外の提携工場にて生産された総合建材商品等を指す。
- terms: 助言: 用語「施工付販売」は、商品の販売に施工を組み合わせた販売形態で、仕入メーカーの責任施工により行っている工事（メーカー施工）と、当社の手配による協力会社により行っている工事（完成工事高）の２種類がある。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
