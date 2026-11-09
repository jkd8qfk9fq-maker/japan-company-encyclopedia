# 日本製鋼所 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社日本製鋼所 |
| 証券コード | 5631 |
| docID（データを取り出した文書） | `S100Y7BQ` |
| 原本 docID | `S100Y7BQ` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y7BQ.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社日本製鋼所 / 5631 / docID S100Y7BQ（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 27 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
the-japan-steel-works: 10 件の数値を有報XBRLと照合
有報: 株式会社日本製鋼所 有価証券報告書－第100期(2025/04/01－2026/03/31) (docID S100Y7BQ)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
the-japan-steel-works: 本文の金額 13 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）
- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…造にかかる費用などを差し引いた残りが利益になります。2026年3月期のは19…）

## エージェントの判断記録（fragment warnings）

- businessModel: 財務数値の基準は機械ドラフト（draft-entry）と一致する日本基準で、5年分すべて同一基準のためfinancialNotesは置かなかった。
- businessModel: 証拠パックの注意に「財務諸表の組替え」の記載がある旨があったが、前期有報との重複年度の数値は修正再表示チェックで全て一致しており、5年数値は当期有報の印字どおりのため、組替えに関する注記は置かなかった。
- businessModel: 中期経営計画の数値目標のうち営業利益や自己資本利益率の目標は、文章の規則により書いていない。受注高・受注残高も書いていない。
- businessModel: 2026年4月1日付の日本製鋼所M&Eの吸収合併（重要な後発事象）は、businessStructureのneedsReviewに記録した。
- businessStructure: 事業の並び順と子区分の金額は、セグメント注記の収益分解情報（2026年3月期の外部顧客への売上高: 産業機械事業226,248百万円、素形材・エンジニアリング事業45,795百万円、その他事業2,808百万円）に基づく。「その他事業」も報告セグメントであるため、売上順の最後に置いた。
- businessStructure: shortNameEnは、有報の本文でグループ各社名や製品ブランドに使われている略称「JSW」とした。英訳名THE JAPAN STEEL WORKS, LTD.は機械側が入れる。
- businessStructure: 2026年3月期の有報では、日本製鋼所M&E株式会社は連結子会社として素形材・エンジニアリング事業を担うと記載されている。決算日後の同社の吸収合併についてはneedsReviewに記録した。
- history: 沿革は【沿革】の印字どおりに年月と事象を対応づけた。2026年4月の日本製鋼所M&Eの吸収合併は、沿革の最終行と重要な後発事象の注記の双方に記載がある。
- industry: 主分類はmachinery。最大の報告セグメントである産業機械事業（2026年3月期の外部顧客への売上高226,248百万円、連結の約82％）は、樹脂機械・成形機・防衛関連機器などの機械の製造・販売である。
- industry: 副分類としてchemicalsを付けた。素形材・エンジニアリング事業（45,795百万円）は、鋳鍛鋼製品やクラッド鋼板などの素材製品を製造・販売する事業であり、閉じた分類では化学・素材系が最も近い。
- industry: energyは付けなかった。発電用部材の供給先は電力業界だが、自社の事業は素材と機械の製造であり、エネルギー事業者ではないため。防衛関連機器に対応する分類値は閉じた一覧にないが、machineryに含まれるため分類の不足とはしなかった。
- relatedCompanies: en（エン・4849）: 一致した文字列は「エンジニアリング」などの一般語の断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: path（パス・3840）: 一致した文字列は「パーパス（Purpose）」の断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: innovation（イノベーション・3970）: 一致した文字列は一般語「イノベーション」の断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: port（ポート・7047）: 一致した文字列は「ポートフォリオ」などの断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: core（コア・2359）: 一致した文字列は一般語の断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: vision（ビジョン・9416）: 一致した文字列は一般語「ビジョン」の断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: land（ランド・8918）: 一致した文字列は在外子会社の商号（Sp. z o.o.等）の断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: ray（レイ・4317）: 一致した文字列は「ディスプレイ」などの断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: seki（セキ・7857）: 一致した文字列は一般語の断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: base-4481（ベース・4481）: 一致した文字列は「時価ベース」などの断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: zero（ゼロ・9028）: 一致した文字列は「CO2排出ゼロ」などの断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: rix（リックス・7525）: 一致した文字列は「マトリックス」などの断片で、同社への言及ではないため結ばなかった。
- relatedCompanies: nikko（ニッコー・5343）: 一致した文字列は連結子会社のニッコー厚産株式会社（未上場）で、ニッコー株式会社とは別の会社のため結ばなかった。
- relatedCompanies: toyo-innovex（TOYOイノベックス・6210）: 資本業務提携契約と小型射出成形機の部品供給の記載はあるが、候補のlistingが「コードリストにない」ため結ばなかった。
- relatedCompanies: nissei-plastic-industrial（日精樹脂工業・6293）: 候補のlistingが「コードリストにない」うえ、有報の記載はTOYOイノベックスの株式移転に関するもので、当社との関係の根拠にならないため結ばなかった。
- relatedCompanies: yokohama-financial-group（横浜フィナンシャルグループ・7186）: 保有目的は良好な金融取引関係の維持で、銀行との資金調達関係は結ばない規則により結ばなかった。
- relatedCompanies: hirogin-holdings（ひろぎんホールディングス・7337）: 保有目的は良好な金融取引関係の維持で、銀行との資金調達関係は結ばない規則により結ばなかった。
- relatedCompanies: hokuhoku-financial-group（ほくほくフィナンシャルグループ・8377）: 子会社の北海道銀行からの借入に関する保有で、銀行との資金調達関係は結ばない規則により結ばなかった。
- relatedCompanies: north-pacific-bank（北洋銀行・8524）: 当社及び子会社からの借入に関する保有で、銀行との資金調達関係は結ばない規則により結ばなかった。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ・8306）: 借入に関する記載のみで、銀行との資金調達関係は結ばない規則により結ばなかった。
- relatedCompanies: mizuho-financial-group（みずほフィナンシャルグループ・8411）: 退職給付を目的とする信託設定に関する保有で、事業上の取引の根拠がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-trust-group（三井住友トラストグループ・8309）: 金融取引に関する保有で、事業上の取引の根拠がないため結ばなかった。
- relatedCompanies: sumitomo-mitsui-financial-group（三井住友フィナンシャルグループ・8316）: 退職給付を目的とする信託設定に関する保有で、事業上の取引の根拠がないため結ばなかった。
- relatedCompanies: ms-and-ad-insurance-group-holdings（MS&ADインシュアランスグループホールディングス・8725）: 子会社の三井住友海上火災保険との保険契約が理由の保有で、保険取引は結ばない規則により結ばなかった。
- relatedCompanies: tokio-marine-holdings（東京海上ホールディングス・8766）: 子会社の東京海上日動火災保険との保険契約が理由の保有で、保険取引は結ばない規則により結ばなかった。
- relatedCompanies: kajima（鹿島建設・1812）: 一致箇所は三井不動産株式会社の大株主一覧の中の記載で、当社の大株主・取引先としての記載ではないため結ばなかった。
- relatedCompanies: 東レ（3402）は候補でambiguousとされていたが、特定投資株式の表に東レ（株）として株式数とともに印字され、当社が株式を保有し取引内容も明記されているため、同一性を確認して結んだ。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言扱い（登録は別工程）。この会社の事業を理解するうえで中心的な語として、素形材、造粒機、二軸混練押出機、クラッド鋼板、レーザアニール装置、中空成形機を選んだ。

## 要確認（status に反映）

- businessStructure: 重要な後発事象: 2026年1月19日の取締役会決議に基づき、2026年4月1日付で完全子会社（連結子会社）の日本製鋼所M&E株式会社を吸収合併し、室蘭製作所を設置した。2026年3月期の有報では同社は連結子会社として記載されており、本エントリーの事業・関係会社の記載は2026年3月期の有報に基づく構成のままにしている。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
