# 川口化学工業 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 川口化学工業株式会社 |
| 証券コード | 4361 |
| docID（データを取り出した文書） | `S100XLSD` |
| 原本 docID | `S100XLSD` |
| 提出日（原本） | 2026-02-20 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XLSD.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 川口化学工業株式会社 / 4361 / docID S100XLSD（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 6 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kawaguchi-chemical-industry: 10 件の数値を有報XBRLと照合
有報: 川口化学工業株式会社 有価証券報告書－第124期(2024/12/01－2025/11/30) (docID S100XLSD)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
kawaguchi-chemical-industry: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の注記１（潜在株式がないため潜在株式調整後１株当たり当期純利益を記載していない）と注記２（従業員数は就業人員）は表示事項のため financialNotes に入れていません。注記３（収益認識基準の適用）は2022年11月期の financialNote として記録しました。
- businessModel: 「法人税、住民税及び事業税等に関する会計基準」等の適用に伴う会計方針の変更が本文に印字され、一部は前連結会計年度に遡及適用されていますが、有報は当該変更による前連結会計年度の連結財務諸表への影響はないと明記し、経営指標等の注記にも対応する注記がなく、前期有報との修正再表示照合も全6系列×4行で差異ゼロのため、financialNote には入れず、この警告に記録しました。
- businessModel: 目標とする経営指標は売上高経常利益率ですが、具体的な数値目標は印字されていないうえ、利益率の目標は書かない方針のため、 perspectives には数値を書いていません。
- businessModel: MD&Aに印字された段階利益の金額や増減率、理由、キャッシュ・フローの金額、生産実績の金額は本文に書いていません。売上高と親会社株主に帰属する当期純利益と、その増減理由だけを書きました。
- businessModel: 【重要な後発事象】は連結・個別とも「該当事項はありません」で、提出後の予定事項も印字されていないため needsReview は空です。
- businessModel: Wikipedia（「川口化学工業」）は見つかりましたが、有報で足りるため使っていません。その抜粋にある売上構成の数値も使っていません。
- businessModel: 前期有報（S100V9D5）との修正再表示照合は全6系列×4行で差異ゼロで、訂正有価証券報告書もありません（訂正状況は2026年11月12日まで確認）。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高の大きい順としました（化学工業薬品事業8,776百万円、不動産賃貸事業38百万円。合計8,814百万円で連結売上高と一致）。
- businessStructure: 化学工業薬品事業の内訳（ゴム薬品・その他・樹脂薬品・中間体）の金額は、MD&Aの販売実績の印字を用い、金額の大きい順に並べました。千円額の合計は8,776,077千円で、セグメント注記の化学工業薬品事業8,776,078千円と1千円の印字差があります。切り捨て後の合計（8,773百万円）はセグメント売上高（8,776百万円）と一致しませんが、印字どおり記載しました。
- businessStructure: 主要な顧客として山田化成株式会社が【関連情報】の主要な顧客ごとの情報とMD&Aの相手先別販売実績に印字されています。化学工業薬品事業の customers に社名を入れましたが、金額は書いていません。
- businessStructure: 【主要な設備の状況】の本社事務所・川口工場・研究所の行はセグメント欄が化学工業薬品事業と全社的業務の併記、本社（千代田区）と大阪営業所の行は化学工業薬品事業、賃貸用土地の行は不動産賃貸事業、上海子会社の店舗・事務所は化学工業薬品事業と印字されています。帳簿価額は書いていません。
- businessStructure: suppliers キーはこのツリーの旧スキーマにないため省略しました。原材料の仕入れは連結子会社の開溪愛(上海)貿易有限公司が担う旨を化学工業薬品事業の説明に書きました。
- businessStructure: 不動産賃貸事業の顧客は有報に印字されていないため、customers は空にしました。
- history: 沿革は年月と事象が一体で印字された一覧で、行の対応は明確でした。
- history: 1958年の大阪営業所開設と1976年の本社移転は、主要な転機でないため落としました。1974年と1977年の増資は資本金の金額が中心の出来事のため落としました（沿革に資本金の金額は書かない方針）。
- history: Wikipediaは見つかりましたが、有報で足りるため使いませんでした。
- industry: この工程は「sourceIds」を書けません（担当は industries）— 無視しました
- industry: この工程は「locator」を書けません（担当は industries）— 無視しました
- industry: 主たる業界は chemicals としました。有機化学工業薬品の製造販売が売上高のほぼ全て（8,776百万円／8,814百万円）を占めるためです。DEIの別記事業も cte（化学）です。
- industry: real-estate は付けませんでした。不動産賃貸事業は報告セグメントですが、売上高は38百万円（全体の0.4％）で、自社保有地の賃貸にとどまるためです。
- relatedCompanies: mitsubishi-chemical-group・nishikawa-rubber・okamoto-industries: 特定投資株式の保有目的が「化学工業薬品事業の取引を行っており、安定的な取引関係を強化・維持するため」と全銘柄で同一の定型句であり、その相手について個別の取引・提携を述べる記載がないため結びませんでした。
- relatedCompanies: 三井化学は特定投資株式としても保有していますが、そちらの保有目的も同一の定型句のため、結んだ関係は【大株主の状況】の大株主としての記載に基づく major-shareholder のみです。
- relatedCompanies: sumitomo-riko: 関連企業候補の掲載区分がコードリストにない上に、有報が提出日現在で全ての株式を売却したと印字しているため結びませんでした。
- relatedCompanies: mitsubishi-ufj-financial-group: 退職給付信託による みなし保有株式であり、取引関係ではないため結びませんでした。
- relatedCompanies: 山田化成株式会社は最大の顧客であり筆頭株主（2025年11月30日現在16.6％）ですが、関連企業候補に含まれない非上場会社のため関連企業としては結ばず、businessStructure の customers に社名を記録しました。
- relatedCompanies: base-4481・cota・zero・seki・career・path・suzuki-6785: 「時価ベース」「インコタームズ」「残存価額をゼロ」「情報セキュリティ」「キャリアパス」「役員名」などの一般語・部分文字列の一致のみで、相手企業についての記載がないため結びませんでした。
- relatedCompanies: 連結子会社の開溪愛(上海)貿易有限公司と非連結子会社の有限会社ケーシーアイサービスは自社グループの会社のため結びませんでした。
- terms: 助言のみ: 用語候補として 加硫促進剤、老化防止剤、重合防止剤、中間体、有機合成、しゃく解剤、特定投資株式、政策保有株式 などが挙げられます。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
