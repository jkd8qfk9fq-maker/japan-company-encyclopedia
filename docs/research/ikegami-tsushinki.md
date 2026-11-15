# 池上通信機 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 池上通信機株式会社 |
| 証券コード | 6771 |
| docID（データを取り出した文書） | `S100YGW1` |
| 原本 docID | `S100YGW1` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGW1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 池上通信機株式会社 / 6771 / docID S100YGW1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 9 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ikegami-tsushinki: 10 件の数値を有報XBRLと照合
有報: 池上通信機株式会社 有価証券報告書－第85期(2025/04/01－2026/03/31) (docID S100YGW1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ikegami-tsushinki: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は有報の百万円の印字どおりに表記した。情報通信機器の単一セグメントのため、事業別の売上高内訳は開示されていない（放送システム事業・産業システム事業は事業の呼称であり、報告セグメントではない）。
- businessModel: 受注高20,050百万円・受注残高17,317百万円は本文の数値として使わなかった（受注高は禁止対象の数値）。
- businessModel: 2027年３月期の業績目標（売上高21,000百万円、営業利益300百万円、経常利益100百万円、親会社株主に帰属する当期純利益500百万円）は、利益指標を含む目標のため本文にも戦略にも書かず、本警告に記録した。
- businessModel: 2026年５月14日の取締役会で決議された固定資産の譲渡に係る買換え資産の圧縮記帳の実施（塩浜事業所の土地・建物の譲渡を予定し、固定資産圧縮損569百万円を翌連結会計年度に計上する予定）は、期後の資産・会計方針の事項であり、会社の構造や事業体制の変更ではないため、needsReviewにはせず本警告に記録した。
- businessModel: 前期有報との修正再表示チェックは全系列で差異ゼロだった。指標注記の法人税等に関する会計基準（2022年改正基準）の遡及適用については、financialNotesに2025年３月期の注記として記録した（これがパック警告のいう財務諸表の組替えの実質である）。
- businessModel: 本ツリーのスキーマには businessModel の suppliers キーが無いため省略した。有報に特定の仕入先の記載はない。
- businessModel: 連結子会社は株式会社テクノイケガミ、Ikegami Electronics(U.S.A.),Inc.、Ikegami Electronics(Europe)GmbHの３社、非連結子会社はIkegami Electronics Asia Pacific Pte.Ltd.と株式会社池上ソリューションの２社で、いずれも非上場のため関連リンクにはしていない。
- businessModel: 最大の顧客である日本放送協会（2026年３月期の売上高2,582百万円、連結売上高の12.1％）は上場企業ではなく関連企業候補にも含まれないためリンクしなかった。顧客の事実は本文フローと分析に記載した。
- businessModel: Wikipediaの記事は確認していない（証拠パックの記載で足りるため）。有報の記載のみで作成した。
- businessStructure: 当社グループは情報通信機器の単一セグメントであり、事業の並びは有報のＭＤ＆Ａおよび人材戦略で使われる事業の呼称（放送システム事業、産業システム事業）の記載順とした。両事業の売上高内訳は開示されていない。
- businessStructure: 連結子会社３社（株式会社テクノイケガミ、Ikegami Electronics(U.S.A.),Inc.、Ikegami Electronics(Europe)GmbH）と非連結子会社２社（Ikegami Electronics Asia Pacific Pte.Ltd.、株式会社池上ソリューション）はいずれも非上場のため businesses の children には入れず、各事業の説明と関係会社の状況の記載に委ねた。子会社の資本金額は記載していない。
- businessStructure: 本社は東京都大田区池上にあり、連結従業員数は774人（提出会社630人）である。
- history: 沿革の資本金額（1948年の設立時の資本金等）は記載していない。
- history: 工場の新設・統合（川崎、水戸、藤沢、宇都宮、池上、湘南）や池上エルダー株式会社の清算（2010年）などの拠点再編の細目は、主要な節目に絞って省略した。
- industry: 情報通信機器の単一セグメントであり、放送・通信機器の製造販売は閉じた分類に直接合う electronics（電子機器）とした。第２の業界は付けず、分類ギャップは記録していない。
- relatedCompanies: 関連企業は、特定投資株式の保有目的に個別の取引内容（取引する事業分野）が記載された相手のみとした。各社の保有目的は取引分野の点で個別化されており、定型文のみの相手はいなかった。
- relatedCompanies: 最大の顧客である日本放送協会は上場企業ではなく関連企業候補にも含まれないためリンクしなかった。顧客の事実は本文に記載した。
- relatedCompanies: 連結子会社・非連結子会社（テクノイケガミ、Ikegami Electronics(U.S.A.)、Ikegami Electronics(Europe)、Ikegami Electronics Asia Pacific、池上ソリューション）はいずれも非上場で候補に含まれないためリンクしていない。
- relatedCompanies: 候補の vision、seki、core、path、base-4481、zero、en、the-lead、career、port、rhythm、sharp はいずれも一般語（経営ビジョン、セキュリティー、コア技術、パーパス、ベース、ゼロ、エンコーダー、キャリア等）との語の一致であり、当該企業との関係の記載がないためリンクしなかった。
- terms: 助言のみ。『ＩＰ＆Ｔ』は同社のコア技術（撮像・画像処理・伝送技術）の呼称で、有報中で説明とともに使われている。『Ikegami Way』は経営ビジョンの文言であり、用語登録の対象ではない。『パーパス』は一般的な概念である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
