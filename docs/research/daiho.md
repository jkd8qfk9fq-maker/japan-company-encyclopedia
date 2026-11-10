# 大豊建設 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大豊建設株式会社 |
| 証券コード | 1822 |
| docID（データを取り出した文書） | `S100YI2K` |
| 原本 docID | `S100YI2K` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YI2K.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大豊建設株式会社 / 1822 / docID S100YI2K（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daiho: 10 件の数値を有報XBRLと照合
有報: 大豊建設株式会社 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100YI2K)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
daiho: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは空です。決算期の変更や変則決算はなく、修正再表示チェックも全行一致でした。本文中の「財務諸表の組替え」は、税効果会計の注記で「外国法人税」を「法人税額の特別控除」から独立掲記した表示方法の変更に伴う前期の組替えで、売上高や純利益に影響しないため note にはしませんでした。
- businessModel: 中期経営計画の目標のうち本文に書けるのは売上高だけとし、営業利益とROEの目標数値は記載していません。
- businessModel: セグメント利益の金額は本文ルールのため記載していません。
- businessModel: 重要な後発事象として開示された自己株式の取得（2026年5月20日取締役会決議、2026年5月21日に4,048,500株を2,999百万円で取得、東京証券取引所の自己株式立会外買付取引（ToSTNeT-3）による）は、決算日後に実施済みの資本政策のため、needsReviewにはせずここに記録します。
- businessStructure: 報告セグメントは「土木事業」「建築事業」「その他の事業」の3つで、外部顧客への売上高の合計は連結売上高139,818百万円に一致します。
- businessStructure: セグメント内部の区分ごとの金額は開示されていないため、各 children にその旨を明記しました。
- businessStructure: セグメント利益の金額は本文ルールのため記載していません。
- history: 沿革の末尾は有報の印字で年月と事象の対応が読み取りにくいため、年月順と事象の並び順に対応させて記載しました（2019年3月＝創立70周年、2022年4月＝プライム市場へ移行、2023年10月＝スタンダード市場へ移行）。創立70周年は1949年3月の設立から70年後に当たります。
- industry: 主たる業界は、土木事業と建築事業を中心とする建設事業であるため construction（建設）としました。その他の事業には不動産事業を含みますが、売上高の約3％にとどまります。
- relatedCompanies: 住友不動産（sumitomo-realty-and-development）: 特定投資株式の保有目的に「工事請負に係る取引先であり、保有による取引関係の強化により工事受注量の確保等が見込めるため」と銘柄固有の取引内容が印字され、大株主の状況にも3.37％の保有が印字されているため customer として結びました。
- relatedCompanies: 太平電業（taihei-dengyo-kaisha）・京浜急行電鉄（keikyu）・コムシスホールディングス（comsys-holdings）・丸八倉庫（maruhachi-warehouse）・小田急電鉄（odakyu-electric-railway）・第一交通産業（daiichi-koutsu-sangyo）: 特定投資株式の保有目的は「工事請負に係る取引先」という7銘柄共通の定型文（「上記に同じ」）のみで、銘柄固有の取引内容の印字がなく、大株主でもないため結びませんでした。
- relatedCompanies: MS＆ADインシュアランスグループホールディングス（ms-and-ad-insurance-group-holdings）: 保有目的が保険契約等の取引のため対象外としました。
- relatedCompanies: 第一生命ホールディングス・旭コンクリート工業・富山第一銀行: 当事業年度において全株式を売却したため対象外としました。
- relatedCompanies: 株式会社麻生: 親会社（2026年3月31日現在50.12％保有）ですが非上場のため結びませんでした。2022年3月24日の取締役会で同社への第三者割当増資と資本業務提携契約の締結を決議しています。
- relatedCompanies: 株式会社ATRA: 大株主（2026年3月31日現在13.18％保有）ですが非上場のため結びませんでした。
- relatedCompanies: エスコン・オリックス不動産・三菱地所レジデンス: 完成工事高の主な工事の発注者としての言及のみで、継続的な取引・提携を述べる印字がないため結びませんでした。
- relatedCompanies: 連結子会社11社（森本組・大豊塗装工業・大豊不動産・進和機工・タイ大豊ほか）: いずれも非上場のため対象外としました。
- relatedCompanies: その他（ベース・エン・コア・ステップ・ゼロ・高速・レイ・キャリア・ランド・トラスト・日新・進和・建設技術研究所・No.1等）: 一般語や部分一致の誤マッチのため結びませんでした。
- terms: 用語候補： ニューマチックケーソン工法（圧縮空気を用いて地下に構造物を築造する工法）、シールド工法（シールドマシンでトンネルを掘削する工法）、DOT工法（多連形泥土圧シールド工法）、DREAM工法（ニューマチックケーソン無人化システム工法）、維持修繕事業（既存インフラの修繕・更新を行う事業）、PPP事業（官民連携による公共事業）——いずれも有報の本文で同社が事業の説明に使う語です。

## 要確認（status に反映）

- businessModel: 2025年4月1日付で普通株式1株につき5株の割合で株式分割を実施しました。経営指標等の注記に、第73期の期首に当該株式分割が行われたと仮定して過年度の指標を算定し直した旨が印字されています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
