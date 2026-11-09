# ポーラ・オルビスホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ポーラ・オルビスホールディングス |
| 証券コード | 4927 |
| docID（データを取り出した文書） | `S100XSDL` |
| 原本 docID | `S100XSDL` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSDL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ポーラ・オルビスホールディングス / 4927 / docID S100XSDL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
pola-orbis-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社ポーラ・オルビスホールディングス 有価証券報告書－第20期(2025/01/01－2025/12/31) (docID S100XSDL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
pola-orbis-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 売上高と当期純利益は、2025年12月期の有報の印字を採りました。
- businessModel: 本文に2022年改正会計基準の遡及適用の記載がありますが、修正再表示チェックで重複年度は全行一致し、売上高・親会社株主に帰属する当期純利益の範囲に変化がないため、financialNotes は書きませんでした。
- businessModel: 中期経営計画の数値目標は、本文の規則により strategy には書きませんでした。
- businessStructure: 事業の並び順は、2025年12月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- businessStructure: その他の区分は報告セグメントに含まれないため最後に置きました。
- history: 沿革は15件としました。採用しなかった出来事は、1948年の株式会社ポーラ化粧品本舗への社名変更、1958年の香港への初進出、1967年のタイ進出、1974年の香港での販売の本格化、1999年のオルビス・ザ・ネットの稼働、2000年のオルビス・ザ・ショップ1号店の出店、2005年の「ポーラ ザ ビューティー」の展開開始、2007年の株式会社ｄｅｃｅｎｃｉａの設立、2013年の中国直販ライセンスの取得、2017年の「リンクルショット メディカル セラム」の開発、2023年の宝麗奥蜜思（上海）企業管理有限公司の設立、2024年の株式会社ピーオーグローバルの設立などです。
- history: 当社の沿革の表で年月と事象が分かれて印字されていた箇所は、年月と事象の数が同じため行順で対応づけました。
- industry: 主たる業界は、売上高の最も大きいビューティケア事業と東証の業種分類（化学）から化学としました。
- industry: 不動産事業は報告セグメントのため、不動産を2つ目に付けました。
- industry: 東証の業種分類は化学です。
- relatedCompanies: ランド、エステー、エン、キャリア、ベース、コア、日新、ポート、セキ、イノベーション、高島、コロナ、インサイト、テイン、トラスト、ビジョン：社名の断片一致のみで、取引・提携・資本関係の根拠がないため結ばない。
- relatedCompanies: 鈴木（6785）：創業者の個人名との一致で、会社との関係の根拠がないため結ばない。
- relatedCompanies: 田谷（4679）：個人株主の姓との一致で、会社との関係の根拠がないため結ばない。
- relatedCompanies: 公益財団法人ポーラ美術振興財団：2025年12月31日現在で35.48％を保有する大株主だが、財団法人で上場しておらず related-candidates.json にないため結ばない。
- relatedCompanies: 連結子会社30社・持分法非適用関連会社18社：すべて非上場または海外法人のため結ばない。
- relatedCompanies: 日本マスタートラスト信託銀行・日本カストディ銀行：大株主だが、信託銀行で金融取引が理由のため結ばない。
- terms: 新たに提案する用語はありません。B.Aシリーズ、ホワイトショットシリーズなどのブランド名・製品名は本文で説明しています。

## 要確認（status に反映）

- businessModel: 2026年2月13日開催の取締役会において、連結子会社である株式会社ポーラの従業員を対象とした希望退職制度「ネクストキャリア特別支援策」の実施を決議しました。募集人数は160名程度、募集期間は2026年3月16日から2026年3月27日、退職日は原則2026年6月30日で、支援金等の費用は約14億円と見込まれ、2026年12月期に特別損失として計上する予定です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
