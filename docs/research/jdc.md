# 日本国土開発 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本国土開発株式会社 |
| 証券コード | 1887 |
| docID（データを取り出した文書） | `S100YXXI` |
| 原本 docID | `S100YXXI` |
| 提出日（原本） | 2026-08-21 |
| 決算期 | 2026-05-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YXXI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日本国土開発株式会社 / 1887 / docID S100YXXI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 26 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
jdc: 10 件の数値を有報XBRLと照合
有報: 日本国土開発株式会社 有価証券報告書－第97期(2025/06/01－2026/05/31) (docID S100YXXI)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
jdc: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えは、費用項目の金額的重要性が増したことに伴う独立掲記（表示区分の変更）であり、修正再表示チェックでも前期有報と重複年度は全行一致しています。financialNotes には表示区分の変更のみである旨を金額なしで記録しました。
- businessModel: 主要な顧客である野村不動産株式会社への売上高（2026年5月期15,989百万円、建築事業）は、セグメント情報の関連情報の印字に基づき flow と industryPosition に記載しました。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高（2026年5月期）の大きい順とし、報告セグメントに含まれない「その他」は最後に置きました。
- businessStructure: 2026年5月期の期首より報告セグメントの区分が変更されています（従来の「関連事業」を「不動産事業」と「エネルギー事業」に分け、「その他」を新設）。本登録は変更後の区分に基づきます。前連結会計年度のセグメント情報は変更後の区分で組み替えて記載されています。
- businessStructure: 各事業の内訳（children）は【事業の内容】の記載に基づく区分で、金額は区分ごとに開示されていないため、その旨を各 children に明記しました。
- history: 沿革の冒頭に印字された設立時の資本金額は、本文の財務数値の規則のため記載していません。
- history: 健康経営銘柄・健康経営優良法人への選定、認証・認定の取得、個別の受注・竣工などの細目は、主な変遷に絞るため省略しました。
- industry: 主たる業界は、土木事業と建築事業で外部顧客への売上高の9割超を占めるため construction としました。不動産事業とエネルギー事業は報告セグメントとして独立開示されていますが、いずれも売上構成が小さく（不動産事業2,470百万円、エネルギー事業3,471百万円）、2つ目の業界は付けていません。
- relatedCompanies: ゼロ： 「ネットゼロ」の部分一致（ambiguous）で、株式会社ゼロとの関係の印字がないため結びません。
- relatedCompanies: エン： 「エンジニアリング」などの部分一致（ambiguous）で、エン株式会社との関係の印字がないため結びません。
- relatedCompanies: リコー： 「ノンリコース債務」の部分一致で、株式会社リコーとの関係の印字がないため結びません。
- relatedCompanies: セキ： 「セキュリティ」などの部分一致（ambiguous）で、セキ株式会社との関係の印字がないため結びません。
- relatedCompanies: コア： 「中核技術」などの一般語の一致（ambiguous）で、株式会社コアとの関係の印字がないため結びません。
- relatedCompanies: キャリア： 「キャリアパス」の一般語の一致で、株式会社キャリアとの関係の印字がないため結びません。
- relatedCompanies: ポート： 「サポート」の部分一致で、ポート株式会社との関係の印字がないため結びません。
- relatedCompanies: 高速： 「高速化」などの一般語の一致（ambiguous）で、株式会社高速との関係の印字がないため結びません。
- relatedCompanies: マックス： 一致箇所は大株主の状況に載る株式会社ザイマックスグループ（2026年5月31日現在7.28％）の記載で、マックス株式会社とは別会社のため結びません。なお、ザイマックスグループは related-candidates.json に掲載がないため結んでいません。
- relatedCompanies: 日建工学： 特定投資株式の保有目的は営業情報収集と資材調達における取引関係への言及にとどまり、取引の向きが明確に印字されていないため結びません。
- relatedCompanies: 山忠： ambiguous の候補で、一致箇所も部分一致のため結びません。
- relatedCompanies: 東急： 工事の発注者として工事名に現れるのみ（ambiguous）で、関係の印字がないため結びません。
- relatedCompanies: 大東建託： 工事名に発注者として現れるのみで、関係の印字がないため結びません。
- relatedCompanies: 長谷工コーポレーション： 工事名に現れるのみで、関係の印字がないため結びません。
- relatedCompanies: MIRARTHホールディングス： 工事名に発注者として現れるのみで、関係の印字がないため結びません。
- relatedCompanies: 平和： 住所の「平和通」の一致（ambiguous）で、株式会社平和との関係の印字がないため結びません。
- relatedCompanies: ビジョン： 「長期ビジョン」の一般語の一致で、株式会社ビジョンとの関係の印字がないため結びません。
- relatedCompanies: アトラエ： 同社が提供するエンゲージメント解析ツール「Wevox」の脚注の記載のみで、取引・提携の印字がないため結びません。
- relatedCompanies: イノベーション： 子会社の事業地名「松島イノベーションヒルズ」の一致で、株式会社イノベーションとの関係の印字がないため結びません。
- relatedCompanies: レント： 「タレントマネジメント」の部分一致で、株式会社レントとの関係の印字がないため結びません。
- relatedCompanies: ウィル： 「コンピューターウィルス」の部分一致で、株式会社ウィルとの関係の印字がないため結びません。
- relatedCompanies: 日新： コードリストにない相手で、一致箇所も新株予約権の記載中の部分一致のため結びません。
- relatedCompanies: トラスト： 日本マスタートラスト信託銀行（信託口）の記載中の一致で、信託銀行の信託口のため結びません。
- relatedCompanies: 主要な顧客である野村不動産株式会社（2026年5月期の売上高15,989百万円、建築事業）は related-candidates.json に掲載がないため結んでいません。
- relatedCompanies: 大株主の状況に載る須賀工業株式会社（2026年5月31日現在2.63％）は related-candidates.json に掲載がないため結んでいません。株式会社西京銀行（同4.10％）は金融機関のため結んでいません。
- relatedCompanies: 関係会社の状況に載る連結子会社18社と持分法適用関連会社1社はすべて非上場で候補外です。
- terms: 用語候補： ツイスター工法（建設材料のリサイクルを実現する同社の独自工法）、キャピラリーバリア（自然材料を利用した処分場覆土技術）、動圧密工法（ゴミの減容化に対応する地盤改良の工法）——いずれも有報の本文で同社の技術の説明に使われる語です。

## 要確認（status に反映）

- businessStructure: 2026年5月期の期首より報告セグメントの区分を変更しています（「土木事業」「建築事業」「関連事業」の3区分から、「土木事業」「建築事業」「不動産事業」「エネルギー事業」の4つの報告セグメントと「その他」の区分へ）。本登録の事業構成は変更後の区分に基づいており、前連結会計年度のセグメント情報は変更後の区分に組み替えられています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
