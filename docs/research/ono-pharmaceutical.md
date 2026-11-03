# 小野薬品工業 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 小野薬品工業株式会社 |
| 証券コード | 4528 |
| docID（データを取り出した文書） | `S100YOIE` |
| 原本 docID | `S100YA20` |
| 提出日（原本） | 2026-06-15 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YOIE／有効文書 S100YOIE（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YOIE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 小野薬品工業株式会社 / 4528 / docID S100YA20（id は英語表記「ONO PHARMACEUTICAL CO., LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ono-pharmaceutical: 10 件の数値を有報XBRLと照合
有報: 小野薬品工業株式会社 訂正有価証券報告書－第78期(2025/04/01－2026/03/31) (docID S100YOIE)
前期有報との比較: 28 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第78期(2025/04/01－2026/03/31)、docID S100YOIE）を有効文書としてこのパックを作った。原本は docID S100YA20。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはDescriptionOfMetricsRelatedToPolicyOnDevelopmentOfHumanResourcesAndInternalEnvironmentAndTargetsAndPerformanceUsingSuchMetricsMetricsAndTargetsTextBlock・DisclosureOfSustainabilityRelatedFinancialInformationTextBlock・InformationAboutEmployeesTextBlock・MetricsAndTargetsHumanCapitalTextBlock・AverageAgeYearsInformationAboutReportingCompanyInformationAboutEmployees（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
注意: 前期の窓に 訂正有価証券報告書－第77期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
すべて一致しました。
ono-pharmaceutical: 本文の金額 15 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…％増えました。会社は売上収益の拡大で利益を増やしたい考えを示しています。…）

## エージェントの判断記録（fragment warnings）

- businessModel: profit 段は、売上と純利益の間の利益項目（営業利益・税引前利益・コアベースの利益）を書かず、当期利益（親会社の所有者帰属）だけにしました。
- businessModel: ロイヤルティの支払元（ブリストル・マイヤーズ スクイブ社、メルク社、ロシュ社）は MD&A の記載による。オプジーボの共同開発契約は【重要な契約等】の（4）に印字されています。
- businessModel: フォシーガのアストラゼネカ社との共同販促契約は2026年3月に終了と印字されています。事業モデルの要約には入れていません。
- businessStructure: 単一セグメント（医薬品事業）のため、【関連情報】の売上収益の内訳（製品商品／ロイヤルティ・その他）を children にしました。金額の大きい順（342,607／173,178百万円）です。
- businessStructure: 売上収益の金額は百万円表記と MD&A の億円表記の両方を印字どおりに使い、書き換えていません。
- businessStructure: 「オプジーボ」とBMS社の関係は【重要な契約等】（共同開発・商業化）と売上上位の相手先の記載による。地域別売上（日本・米国ほか）は構造の区分ではないため children にしていません。
- businessStructure: 訂正有報は record-only 分類で、本文・財務は原本と同一。needsReview にしていません。
- history: 沿革表は年と事象が連続して印字されており、行の対応は明瞭でした。
- history: 2025年の社名は沿革で「Ono Grobal Reinsurance, Inc.」と印字されていますが、事業の内容と関係会社の状況は「Ono Global Reinsurance, Inc.」で、後者を採りました。
- history: 2024年のDeciphera買収の月（6月）は MD&A の「2024年６月米国デサイフェラ社の買収」による。見出しには年だけを書きました。
- history: 1918年の東洋製薬化成、1982年のビーブランド・メディコーデンタル、工場・研究所の完成、2023年の株式会社OPhrs設立などは省きました。
- industry: 事業は医薬品事業の単一セグメントのため、医薬品のみとしました。
- relatedCompanies: 証拠パックに related-candidates.json が無く、掲載済みの上場企業として同一性を確認できる相手がいないため、1社も結びませんでした。
- relatedCompanies: 子会社（デサイフェラ社ほか）は有報で連結子会社と印字されていますが、いずれも非上場・海外または掲載対象外です。
- relatedCompanies: 参天製薬㈱：ONO-9054の契約（2016年3月）が印字されているが、候補一覧が無く同一性を確認できないため見送り。
- relatedCompanies: 生化学工業㈱：Gel-One・SI-613の技術導入契約が印字されているが、候補一覧が無く同一性を確認できないため見送り。
- relatedCompanies: ペプチドリーム㈱：創薬開発プラットフォームの非独占的ライセンス契約が印字されているが、候補一覧が無く同一性を確認できないため見送り。
- relatedCompanies: ブリストル・マイヤーズ スクイブ社、メルク社、ロシュ社、バーテックス社、アストラゼネカ社などは海外企業で掲載対象外。
- relatedCompanies: 大阪ソーダ、三浦工業は仕入先として保有株式の表に載るのみで、取引の内容が印字されていないため見送り。大塚ホールディングス、杏林製薬、ゼリア新薬工業などは保有目的が定型句のため見送り。
- relatedCompanies: 大株主は信託銀行、生命保険相互会社、財団、資産管理会社、金融機関が中心で、事業会社に当たる相手がいないため結んでいません。
- terms: 用語の追加提案：「ロイヤルティ」（特許などの使用料）、「導出入」（医薬品の権利を他社へ出す・他社から入れる）、「コアベース」は読者に説明が要る語ですが、既存の用語集との照合ができないため助言のみとします。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
