# Genki Global Dining Concepts — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社Ｇｅｎｋｉ　Ｇｌｏｂａｌ　Ｄｉｎｉｎｇ　Ｃｏｎｃｅｐｔｓ |
| 証券コード | 9828 |
| docID（データを取り出した文書） | `S100YCXM` |
| 原本 docID | `S100YCXM` |
| 提出日（原本） | 2026-06-17 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YCXM.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社Ｇｅｎｋｉ　Ｇｌｏｂａｌ　Ｄｉｎｉｎｇ　Ｃｏｎｃｅｐｔｓ / 9828 / docID S100YCXM（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
genki-global-dining-concepts: 10 件の数値を有報XBRLと照合
有報: 株式会社Ｇｅｎｋｉ　Ｇｌｏｂａｌ　Ｄｉｎｉｎｇ　Ｃｏｎｃｅｐｔｓ 有価証券報告書－第47期(2025/04/01－2026/03/31) (docID S100YCXM)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
genki-global-dining-concepts: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社Genki Global Dining Concepts」が EDINET の提出者名「株式会社Ｇｅｎｋｉ　Ｇｌｏｂａｌ　Ｄｉｎｉｎｇ　Ｃｏｎｃｅｐｔｓ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 連結貸借対照表の表示方法の変更（有形固定資産の「その他」に含めていた「建設仮勘定」の独立掲記と前連結会計年度の財務諸表の組替え）は表示区分の変更であり、前期有報との照合では5年間の主要な経営指標等の全行が一致したため、financialNotesには入れませんでした。
- businessModel: 中期経営計画の定量目標（2029年3月期の売上高・店舗数などの目標値）は将来の目標値のため、本文には書きませんでした。
- businessModel: 経営者による分析の「その他」の経営成績36億4千8百万円はセグメント間の内部売上高を含む数値のため、本文にはセグメント注記の外部顧客への売上高3,482百万円を用いました。
- businessModel: 当連結会計年度に株式会社ゴダック及び株式会社神戸まるかんを子会社化したことに伴う負ののれん発生益は、本文の財務数値には使っていません。
- businessStructure: 報告セグメントは「国内事業」「グローバル事業」の2つで、「その他」は報告セグメントに含まれない事業セグメントの区分です。前連結会計年度には「その他」の区分はなく、当連結会計年度中に子会社化した株式会社ゴダック及び株式会社神戸まるかん並びに2025年9月より開始した養殖事業の業績を含むため、当連結会計年度から設けられています。
- businessStructure: 経営者による分析で示される「その他」の売上高3,648百万円はセグメント間の内部売上高165百万円を含む数値のため、事業の説明にはセグメント注記の外部顧客への売上高3,482百万円を用いました。
- businessStructure: 当社は株式会社神明ホールディングスの子会社ですが、同社は非上場で百科事典のエントリーがないため、事業構造には含めていません。親会社との関係はrelatedCompaniesのwarningsに記録しています。
- history: 設立時や子会社の資本金の金額は、禁止される財務金額にあたるため沿革には書きませんでした。
- history: 海外フランチャイズ契約の個別の締結・終了（1993年シンガポール、1997年GENKI ICHI CORP.、2005年BURGAN GROUP HOLDING CO.及びGENKI SUSHI HONG KONG LTD.、2012年ME CONCEPT CO.,LTD.及びPT.AGUNG MANDIRI LESTARI、2014年MOTHER SPICE FOOD CORP.、2017年EDEN HOTELS & RESORTS CO.,LTD.及びJAPANESE DINING CONCEPTS (ASIA) LTD.、2019年GENKI SUSHI (THAILAND) CO.,LTD.）は、フランチャイズ展開の細かな変遷のため省略しました。
- history: 株式会社グルメ杵屋との業務・資本提携（1998年）と共同出資会社杵屋元気寿司東海株式会社の設立・解散（2000年・2008年）、カッパ・クリエイト株式会社との業務提携（2013年、2014年解消）、株式会社FOOD & LIFE COMPANIESとの資本業務提携（2017年、2019年解消）は、いずれも終了・解消済みの関係のため沿革には入れず、relatedCompaniesのwarningsに記録しました。
- history: 鹿沼物流センターの開設（1995年）、新潟県の3店舗の営業譲受（2009年）、GENKI SUSHI SINGAPORE PTE.LTD.の子会社化と売却（2016年・2017年）、株式会社麺庄との業務提携（2023年）は、事業運営上の細かな出来事のため省略しました。
- industry: 主たる事業は寿司レストランの運営を中心とする外食であり、閉じた分類に外食に当たる区分がないため、掲載済みの外食会社の先例（すかいらーくホールディングス、ゼンショーホールディングス、FOOD & LIFE COMPANIES等）に揃えてfood（食品）を暫定の主分類としました。該当する区分が無いため、taxonomyGapsに記録しています。
- relatedCompanies: 株式会社神明ホールディングス: 当社の親会社（議決権の被所有割合40.8％、支配力基準による親会社）ですが、非上場で百科事典のエントリーがなく、候補（EDINETのコードリスト）にもないため結びませんでした。親会社との間では、当連結会計年度に株式会社ゴダック及び株式会社神戸まるかんの全株式の取得を行っています。
- relatedCompanies: 株式会社神明、モチクリームジャパン株式会社: いずれも親会社グループの未上場会社で候補にないため結びませんでした。株式会社神明とは食材の仕入取引があります。
- relatedCompanies: gourmet-kineya（株式会社グルメ杵屋）: 1998年5月に業務・資本提携に合意し、2000年5月に共同出資により杵屋元気寿司東海株式会社を設立しましたが、同社は2008年3月に解散しており、現在の関係を示す記載がないため結びませんでした。
- relatedCompanies: kappa-create（カッパ・クリエイト株式会社）: 2013年11月に業務提携に合意しましたが、2014年12月に解消済みのため結びませんでした。
- relatedCompanies: food-and-life-companies（株式会社FOOD & LIFE COMPANIES）: 2017年9月に資本業務提携に合意しましたが、2019年6月に解消済みのため結びませんでした。
- relatedCompanies: mebuki-financial-group（株式会社めぶきフィナンシャルグループ）: 特定投資株式として10,000株を保有していますが、保有目的は安定的かつ継続的な資金調達体制の構築であり、金融取引に係る保有のため結びませんでした。
- relatedCompanies: yakiniku-sakai-holdings（株式会社焼肉坂井ホールディングス）: 前身の株式会社元禄との「元禄寿司商標使用に関する契約」は1990年2月に解約済みで、現在の関係を示す記載がないため結びませんでした。
- relatedCompanies: land、en、innovation、port、ishin、base-4481、career、suzuki-6785、vision、king: 一般的な語や人名・部分一致のみで、当社との取引・提携・資本関係の記載がないため結びませんでした。
- relatedCompanies: trust: 日本マスタートラスト信託銀行株式会社（信託口）の信託口表記への一致で、コードリストにもないため結びませんでした。
- relatedCompanies: 連結子会社4社（GENKI SUSHI USA,INC.、株式会社ゴダック、株式会社神戸まるかん、その他1社）と非連結子会社の株式会社味の法則は当社グループの会社のため結びませんでした。
- terms: 助言: 用語『フランチャイズ』は、本部が加盟店にブランドや店舗運営の仕組みの使用を認め、加盟店が対価としてロイヤリティを支払う事業形態のことです。当社は海外でフランチャイズ展開を行い、ロイヤリティ収入と食材等の販売を行っています。
- terms: 助言: 用語『川上戦略』は、店舗での販売という川下だけでなく、原材料の調達や生産といった川上の領域まで自社グループで担い、調達力を高める戦略のことです。当社は水産物の加工・販売会社の子会社化や養殖事業への参入を進めています。

## 要確認（status に反映）

- businessModel: 2023年11月1日付で普通株式1株につき2株の株式分割を行いました。株式数に関する指標は2022年3月期（第43期）の期首に当該分割が行われたと仮定して算定されています。
- businessModel: 当社は2026年4月2日付で、オーストラリアで「Sushi Sushi」ブランドの寿司事業を展開するFood Odyssey Pty. Ltd.の全株式を取得し、完全子会社化しました。登録は2026年3月31日現在の連結子会社4社の構成に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] Genki Global Dining Concepts（genki-global-dining-concepts）の主たる業界 → 提案: 外食（飲食店の運営・フードサービス）。事業の内容は「魚べい」「元気寿司」「千両」などの寿司レストランの直営運営と海外フランチャイズ展開が中心で、2026年3月期の外部顧客への売上高73,711百万円の大部分が飲食店の運営によるものです。事業の中身は料理を店で提供する外食で、閉じた分類に外食に当たる区分がありません。food（食品）は食品・飲料メーカーを指す例が多く、掲載済みの外食会社（すかいらーくホールディングス、ゼンショーホールディングス、FOOD & LIFE COMPANIES等）も同じ理由でfoodを暫定としているため、それに揃えました。
