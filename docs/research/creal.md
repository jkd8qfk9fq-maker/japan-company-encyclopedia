# クリアル — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | クリアル株式会社 |
| 証券コード | 2998 |
| docID（データを取り出した文書） | `S100YTD0` |
| 原本 docID | `S100YIOE` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YTD0／有効文書 S100YTD0（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YTD0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | クリアル株式会社 / 2998 / docID S100YIOE（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 3 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 5 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 20 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 4 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
creal: 10 件の数値を有報XBRLと照合
有報: クリアル株式会社 訂正有価証券報告書－第15期(2025/04/01－2026/03/31) (docID S100YTD0)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第15期(2025/04/01－2026/03/31)、docID S100YTD0）を有効文書としてこのパックを作った。原本は docID S100YIOE。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはCriticalContractsTextBlock・DetailsOfEmployeeShareOptionProgramTextBlock・InformationAboutEmployeesTextBlock・AverageAnnualSalaryInformationAboutReportingCompanyInformationAboutEmployees（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
creal: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額の表記は千円表記の印字を百万円未満切り捨てとした（売上高37,795,040千円→37,795百万円、親会社株主に帰属する当期純利益1,938,877千円→1,938百万円、サービス別も同様）。切り上げはしていない。累計投資金額1,047億円はMD&Aの億円表記どおりとした。
- businessModel: 訂正有報（docID S100YTD0、2026年7月31日提出）が有効文書のため、出典は訂正有報のタイトル・URL・提出日とした。分類はrecord-onlyで、財務数値と本文は原本（S100YIOE）と同一であり、差異はエントリーが引用しない節のみのため、訂正自体はneedsReviewにしていない。
- businessModel: 表示方法の変更（営業外収益の組替えとキャッシュ・フロー計算書の独立掲記）は表示の組替えのみのため、financialNotesには入れず本warningsに記録した。前期有報との修正再表示チェックは全行一致している。
- businessModel: 臼木証券株式会社との企業結合に係る暫定的な会計処理は当期に確定したが、確定に伴う金額の変動はない旨が印字されているため、financialNotesには入れず本warningsに記録した。
- businessModel: 期後の自己株式取得（2026年5月15日取締役会決議、2026年6月2日取得終了）は資本政策の決議事項のため、needsReviewではなく本warningsに記録した。ストック・オプションとしての新株予約権の発行は重要な後発事象として印字されているためneedsReviewに記録した。
- businessModel: suppliers キーは本ワークツリーのスキーマに無いため省略し、仕入・物件供給に関する事実は事業の内容の記載（物件供給の業務提携契約締結先等からの情報収集）として businessStructure 側の説明に留めた。
- businessModel: セグメント利益にあたるサービス別の金額や、売上総利益・営業利益等の金額は規則により本文に書かなかった。GMVの金額（千円表記のみで億円表記がないもの）は本文に書かなかった。
- businessStructure: 単一セグメントのため、事業の区分は【関連情報】の製品及びサービスごとの情報を children とし、外部顧客への売上高の大きい順（CREAL、CREAL PB、CREAL PRO、その他）に並べた。
- businessStructure: 金額はセグメント関連情報の千円表記（CREAL 23,384,040千円、CREAL PB 9,142,091千円、CREAL PRO 3,791,999千円、その他 1,476,908千円、合計 37,795,040千円）を百万円未満切り捨てで表記した。
- businessStructure: MD&Aの販売実績も同じ4区分・同じ金額であり、セグメント関連情報と一致する。
- businessStructure: 鎌倉青山合同会社は2026年3月31日現在の名称で記載した（2026年6月1日付でステイシー鎌倉合同会社へ商号変更。needsReview参照）。
- businessStructure: suppliers キーは本ワークツリーのスキーマに無いため、businessModel fragment を含め全 fragment で省略した。
- history: 沿革に印字された資本金の増資に関する行（2015年、2018年、2020年、2025年12月など）は、資本金の金額を含むため規則により記載しなかった。
- history: 2013年の日本不動産イニシアティブ株式会社の株式取得と2014年の譲渡による兄弟会社化の経緯は、2017年の株式移転の行に集約して記録した。
- history: 2026年3月の鎌倉青山合同会社の持分取得は当連結会計年度中に完了し期末の構成に反映されているため、needsReviewではなく沿革に含めた。同社の期後の商号変更はneedsReviewに記録した。
- history: 軽微な行（店舗・サービス細目など）は省いた。
- industry: 単一セグメントである資産運用プラットフォーム事業は不動産投資のファンド組成・運用、実物不動産の販売、不動産の賃貸管理・ホテル運営で構成され、売上の大半が不動産領域のため real-estate を主たる業界として1つだけ付けた。
- industry: 第二種金融商品取引業の登録や連結子会社の証券業は、不動産投資プラットフォームに付随するもので独立したセグメント売上高の開示がないため、finance は付けていない。
- relatedCompanies: ntt（NTT）: 提携パートナーとして印字されているのは株式会社NTTドコモであり、NTT株式会社とは別の法人であるため結ばなかった。
- relatedCompanies: orix（オリックス）: 提携パートナーとして印字されているのはオリックス銀行株式会社であり、オリックス株式会社とは別の法人であるため結ばなかった。
- relatedCompanies: sbi-shinsei-bank（SBI新生銀行）: 関連当事者情報に資金の借入の取引が印字されているが、資金調達の取引であるため結ばなかった。
- relatedCompanies: japan-securities-finance（日本証券金融）: 大株主の状況に載る金融機関であり、事業上の取引・提携の印字がないため結ばなかった。
- relatedCompanies: nissin（日新）: コードリストになく、印字も一般語句の部分一致（ambiguous）のため結ばなかった。
- relatedCompanies: corona（コロナ）: 『コロナ禍』等の一般語句の部分一致であり、株式会社コロナへの言及はないため結ばなかった。
- relatedCompanies: en（エン）: 『エンジニアリング』等の語句の部分一致（ambiguous）であり、株式会社エンへの言及はないため結ばなかった。
- relatedCompanies: port（ポート）: 『レポート』等の語句の部分一致であり、ポート株式会社への言及はないため結ばなかった。
- relatedCompanies: innovation（イノベーション）: 一般名詞としての使用のみで、株式会社イノベーションへの言及はないため結ばなかった。
- relatedCompanies: base-4481（ベース）: 『連結ベース』等の一般語句の部分一致であり、株式会社ベースへの言及はないため結ばなかった。
- relatedCompanies: como（コモ）: 『NTTドコモ』の部分一致（ambiguous）であり、株式会社コモへの言及はないため結ばなかった。
- relatedCompanies: ray（レイ）: 施設名『レイサー沖縄』等の部分一致（ambiguous）であり、株式会社レイへの言及はないため結ばなかった。
- relatedCompanies: s-t（エステー）: 旧社名『ブリッジ・シー・エステート』の部分一致であり、エステー株式会社への言及はないため結ばなかった。
- relatedCompanies: land（ランド）: 『ブランド』等の語句の部分一致であり、株式会社ランドへの言及はないため結ばなかった。
- relatedCompanies: no-1（No.1）: 『No.1プラットフォーマー』という表現の部分一致であり、株式会社No.1への言及はないため結ばなかった。
- relatedCompanies: seki（セキ）: 一般語句の部分一致（ambiguous）であり、セキ株式会社への言及はないため結ばなかった。
- relatedCompanies: suzuki-6785（鈴木）: 会計監査人の個人名の部分一致（ambiguous）であり、株式会社鈴木への言及はないため結ばなかった。
- relatedCompanies: taya（田谷）: 住所等の部分一致（ambiguous）であり、株式会社田谷への言及はないため結ばなかった。
- relatedCompanies: trust（トラスト）: コードリストになく、信託銀行名の部分一致のため結ばなかった。
- relatedCompanies: 提携パートナーのうち、Vポイントマーケティング株式会社、株式会社SBJ銀行、楽天証券株式会社は related-candidates.json に掲載がないため結ばなかった。連結子会社7社と持分法適用関連会社1社はグループ会社のため関連企業としては結ばなかった。
- terms: 助言: 用語『CREAL』は、クラウドファンディングを活用した不動産ファンドオンラインマーケットのサービス名。一口1万円から不動産へ投資でき、投資の申込みから運用・売却までをオンラインで完結できる仕組みを指します。
- terms: 助言: 用語『GMV』は流通取引総額（Gross Merchandise Value）の略で、『CREAL』においてファンド組成のため投資家から調達した資金額を指す当社の経営指標です。
- terms: 助言: 用語『プロフィットシェア』は、ファンドの不動産売却で得られた利益があらかじめ投資家へ提示した目標利益を上回ったときに、その全部または一部を当社が成功報酬として受け取る仕組みを指します。
- terms: 助言: 用語『不動産ST（セキュリティ・トークン）』は、受益証券発行信託を用いたデジタル証券による不動産ファンド商品を指し、申告分離課税の対象となる点が不動産クラウドファンディングと異なると説明されています。

## 要確認（status に反映）

- businessModel: 主要な顧客の金額に有報内の不一致があります。セグメント関連情報の主要な顧客ごとの情報では合同会社SML J HOTELへの売上高が24,600,153千円と印字され、MD&Aの主な相手先別の販売実績では同社への販売高が4,600,153千円（割合12.2％）と印字されています。登録本文では金額を用いず社名のみを記載しました。公開前に人の確認を要します。
- businessModel: 期後の商号変更が2件印字されています。連結子会社の鎌倉青山合同会社は2026年6月1日付でステイシー鎌倉合同会社へ、持分法適用関連会社の株式会社ティーエーティーは2026年4月3日付で株式会社PIECEへ商号変更しました。登録は2026年3月31日現在の名称・構造で記載しています。
- businessModel: 重要な後発事象として、2026年5月15日開催の取締役会で、役員・従業員等へのストック・オプションとしての新株予約権の発行が決議された旨が印字されています（割当日2026年6月2日）。期後の事項のため本文には含めていません。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
