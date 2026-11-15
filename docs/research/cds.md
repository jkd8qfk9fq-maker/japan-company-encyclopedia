# ＣＤＳ株式会社 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ＣＤＳ株式会社 |
| 証券コード | 2169 |
| docID（データを取り出した文書） | `S100XULK` |
| 原本 docID | `S100XULK` |
| 提出日（原本） | 2026-03-30 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XULK.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ＣＤＳ株式会社 / 2169 / docID S100XULK（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
cds: 10 件の数値を有報XBRLと照合
有報: ＣＤＳ株式会社 有価証券報告書－第46期(2025/01/01－2025/12/31) (docID S100XULK)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
cds: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「CDS株式会社」が EDINET の提出者名「ＣＤＳ株式会社」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。
- businessModel: セグメントの外部顧客への売上高を切り捨てた合計は8,826百万円となり、連結売上高8,827百万円との間に１百万円の差があるが、これは切り捨てによるものである。
- businessModel: 目標とする経営指標である営業利益率10％は利益率であるため、本文や戦略の記述には含めず warnings にとどめた。
- businessModel: 受注実績の受注高・受注残高は本文の数値ではないため記載していない。
- businessModel: 重要な後発事象は連結・個別とも「該当事項はありません。」であり、後発事象に係る確認事項はない。
- businessModel: suppliers はこのツリーのスキーマに無いため businessModel から省略した。仕入先の個別開示は有報に無い。
- businessModel: 連結子会社である株式会社ＭＣＯＲおよび株式会社バイナスの単体の損益情報等は、本文の数値（売上高と純利益）ではないため本文には書いていない。
- businessStructure: 金額は千円の印字を百万円に切り捨てて記載した（切り上げはしていない）。
- businessStructure: 連結子会社５社（株式会社ＭＣＯＲ、株式会社バイナス、SAS SB Traduction、株式会社東輪堂、株式会社ＰＭＣ）は当社グループの会社であるため関連企業には含めていない。
- history: 沿革に印字された設立時や分社化時の資本金額は、沿革に資本金額を書かない規則により記載していない。
- history: 2013年１月の株式分割（普通株式１株を200株）は沿革のみの印字であり、主要な経営指標等の推移の注記には記載がなく５年間の指標にも影響しないため、確認事項にはせず沿革にも行を設けていない。
- industry: 主たる業界は、３事業ともＩＴ技術を駆使した設計支援・システム開発・デジタルコンテンツ制作等のサービス提供が中核であり、当社自身が「技術情報統合マネジメント企業」を掲げていることから it とした。
- industry: ＦＡロボットソリューション事業はロボット・ＦＡシステムと教育用装置の製造を独立した報告セグメントとして営むため machinery を付けた。合う値が無い区分は無く、taxonomyGapsは無い。
- relatedCompanies: the-bank-of-nagoya（株式会社名古屋銀行）と aichi-financial-group（株式会社あいちフィナンシャルグループ）は特定投資株式として保有しているが、保有目的の文言が両銘柄とも「地元の金融機関として金融取引を行っており、機動的かつ円滑な資金調達、国内情報の収集等の取引関係の維持・強化を図るため」と同一の定型句であり、個別の取引事実の記載がないため結ばなかった。なお、株式会社名古屋銀行は2025年10月１日付で普通株式１株を３株とする株式分割を行っているが、これは保有先の分割であり当社の株式分割ではない。
- relatedCompanies: 株式会社あいち銀行は2025年12月31日現在の大株主の状況に所有株式数140,000株（2.05％）の大株主として記載されているが、候補に無く金融機関であるため結ばなかった。筆頭株主のしばざき株式会社（13.20％）は非上場で候補に無い。
- relatedCompanies: base-4481（「技術情報をベースとしたコンサルティング」の文言）、port（「サポート」の文言）、career（「キャリアビジョン」の文言）、vision（「キャリアビジョン」の文言）、core（「コア技術」の文言）、en（「ＦＡエンジニアリング」の文言）、karula（「テクニカルライティング」の文言）は社名の単語一致のみで取引・提携・資本関係の記載がないため結ばなかった。
- relatedCompanies: seki、densan、daiwa、kohsoku は曖昧な一致であり（「情報セキュリティ」「電算写植」「大和郡山市」「高速化」の文言）、相手を特定できないため結ばなかった。
- terms: 用語の候補として、ＣＡＤ（コンピュータ支援設計）、ＣＡＥ（設計・開発工程を支援するコンピュータシステム）、ＭＢＤ（モデルベース開発、シミュレーションを積極的に取り入れた製品開発の手法）、ＰＬＭ（製品ライフサイクル管理）、ＰＤＭ（製品データ管理）、ＢｏＭ（部品表）、ＡＭＲ（自律走行搬送ロボット）、ＣＡＴ（製品の検査や検査支援を行うシステム）、テクニカルライティング、Robo-Trainer（株式会社バイナスのロボット実習装置）、技術情報統合マネジメント企業、ストレート・スルー・プロセシングを挙げる。助言のみで、用語データは作成していない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
