# ラクス — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ラクス |
| 証券コード | 3923 |
| docID（データを取り出した文書） | `S100YL65` |
| 原本 docID | `S100YL65` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YL65.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ラクス / 3923 / docID S100YL65（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
rakus: 10 件の数値を有報XBRLと照合
有報: 株式会社ラクス 有価証券報告書－第26期(2025/04/01－2026/03/31) (docID S100YL65)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
rakus: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: businessModel.suppliersは省いた。有報は当社グループの調達先を一般名詞では述べておらず、データセンターは自社の設備として記載されているためである。
- businessModel: 証拠パックの「財務諸表の組替え」の注意について、該当箇所は収益認識に関する注記の区分表示の変更（前連結会計年度の組替えにより「その他」が減少）とサービス名称の変更（「配配メール」→「楽楽メールマーケティング」、「メールディーラー」→「楽楽自動応対」）であり、表示方法の変更にとどまる。前期有報との修正再表示チェックも全項目一致で差異がなかったため、financialNotesではなくwarningsに記録した。
- businessModel: 中期経営計画の数値目標（クラウド事業売上高の成長率、Rule of 50、正社員１名当たり売上高など）は、利益率や将来数値を含むため転記せず、戦略の要約は定性的に記した。
- businessModel: 自己株式の取得・消却や配当は資本政策の事項のため、warningsへの記録にとどめ、本文には書いていない。
- businessModel: 株式会社ラクスパートナーズの主要な損益情報等（売上高など）は、同社の個別数値であり転記していない。
- businessStructure: 本登録は2026年3月31日現在の構造による。連結子会社は4社（RAKUS Vietnam Co., Ltd.、株式会社ラクスライトクラウド、株式会社ラクスパートナーズ、PT. Reformasi Kerja Solusi）で、このほか重要性が乏しいため記載を省略された非連結子会社1社がある。
- businessStructure: 株式会社ラクスパートナーズは2026年4月1日付で全株式が譲渡され連結子会社から外れている（提出日現在は連結子会社3社）。期後の事項のため、needsReviewに記録した。
- businessStructure: 各クラウドサービスの金額は独立して開示されていないため、子事業の説明に金額は書いていない。
- businessStructure: PT. Reformasi Kerja Solusiは2025年4月に設立され、期末の構造に反映されているため、沿革とwarningsに記録した。
- history: 沿革の各行には月も印字されているが、スキーマの規則により年だけを記録した（monthキーは付けていない）。
- history: 創業時・子会社設立時の資本金の額は、禁止される財務金額にあたるため転記していない。
- history: 株式会社ラクスパートナーズの譲渡（2026年4月）は提出後の出来事だが、沿革に印字された完了済みの事実として記録し、構造への影響はneedsReviewに記録した。
- industry: 主たる業界は、売上高の大半を占めるクラウド事業（クラウドサービスの企画・開発・運用）のためitとした。
- industry: human-resourcesは、報告セグメントとして金額が開示されているIT人材事業（ITエンジニア派遣）のため2つ目に付けた。
- relatedCompanies: 株式会社BREXA Technology: 株式会社ラクスパートナーズの株式の譲渡先だが、上場しておらず候補一覧にないため結ばなかった（譲渡の事実は沿革とneedsReviewに記録）。
- relatedCompanies: HOYA株式会社: 2023年に株式会社ラクスＨＲテックの株式を取得した際の新設分割会社だが、過去の1回限りの取引であり候補一覧にもないため結ばなかった。
- relatedCompanies: NHNテコラス株式会社・ライド株式会社: 会社分割による事業の承継先だが、候補一覧になく継続的な取引・提携の印字もないため結ばなかった。
- relatedCompanies: PT. Cipta Piranti Sejahtera（インドネシア共和国）: 2024年12月に出資した会社だが、上場しておらず候補一覧にないため結ばなかった。
- relatedCompanies: seki（情報セキュリティの一般語）、en（ITエンジニアの部分文字列）、career（キャリア形成の一般語）、land（ブランドの部分文字列）、port（サポートの部分文字列）、vision（ビジョンの一般語）、base-4481（データベースの一般語）、core（コア人財の一般語）、king（ランキングの部分文字列）、rent（タレントパレットの部分文字列）、ray（曖昧な一致）、innovation（一般語）、zero（一般語）、trust（コードリストにない）は、いずれも社名の一致や部分文字列の一致のみで、関係性の根拠がないため結ばなかった。
- terms: 助言: 用語「楽楽精算」は、当社グループの主力クラウドサービスで、経費の申請から仕訳までをデータ化し経費精算業務を効率化するシステムである。
- terms: 助言: 用語「楽楽クラウド」は、当社グループのクラウドサービスのブランド統合の名称で、2025年10月に「メールディーラー」を「楽楽自動応対」に、「配配メール」を「楽楽メールマーケティング」に名称変更した。
- terms: 助言: 用語「タレントパレット」は、株式会社プラスアルファ・コンサルティングが展開するタレントマネジメントシステムで、当社は資本業務提携に基づきそのOEM開発及び販売を行う。

## 要確認（status に反映）

- businessModel: 連結子会社である株式会社ラクスパートナーズ（IT人材事業）は、2026年２月13日付の決議により全株式を株式会社BREXA Technologyに譲渡することが決まり、2026年４月１日に譲渡が実施されております（重要な後発事象として有報に記載）。本登録は、2026年３月31日現在の連結子会社４社（株式会社ラクスパートナーズを含みます）の構造によります。
- businessModel: 2025年10月１日付で普通株式１株につき２株の割合で株式分割を実施しております。株式数に関する指標は、第22期の期首に当該分割が行われたと仮定して算定されております。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
