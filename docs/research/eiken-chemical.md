# 栄研化学 — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 栄研化学株式会社 |
| 証券コード | 4549 |
| docID（データを取り出した文書） | `S100YFP4` |
| 原本 docID | `S100YD7R` |
| 提出日（原本） | 2026-06-18 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100YFP4／有効文書 S100YFP4（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFP4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 栄研化学株式会社 / 4549 / docID S100YD7R（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 4 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
eiken-chemical: 10 件の数値を有報XBRLと照合
有報: 栄研化学株式会社 訂正有価証券報告書－第88期(2025/04/01－2026/03/31) (docID S100YFP4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第88期(2025/04/01－2026/03/31)、docID S100YFP4）を有効文書としてこのパックを作った。原本は docID S100YD7R。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: record-only — 財務の数値も本文も原本と同一。違うのはOverviewOfCorporateGovernanceTextBlock（エントリーが引用しない節・開示数値）だけ。「訂正の中身を確認できない」を理由に needsReview にしない
すべて一致しました。
eiken-chemical: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 有効文書は訂正有価証券報告書（docID S100YFP4、2026年6月22日提出）である。原本（docID S100YD7R）との差異はコーポレート・ガバナンスの概要のテキストブロックのみで、財務の数値も本文も原本と同一であり、5年間の経営指標にも影響はないことを証拠パックの修正再表示チェック（全行一致）と訂正分類（record-only）で確認したため、needsReviewには入れず本warningsに記録した。出典の題名・URL・公表日は訂正有報の値に合わせた。
- businessModel: financialNotesは空とした。変則決算や決算期変更はなく、前期有報との修正再表示チェックも全行一致であった。
- businessModel: 経営計画の数値目標（2031年3月期の売上高や海外向け売上高比率など）は、本文の数値規則により戦略の文章には記載せず、施策のみを要約した。売上高の目標値は有報に印字された参考情報として本warningsに留めるにとどめ、本文の実績値とは区別した。
- businessModel: 研究開発費の総額は有報に印字されているが、本文の財務数値は売上高と当期純利益に限る規則のため本文には記載していない。
- businessModel: 東ソー株式会社から導入・販売している製品の事実は、供給関係として関連企業（supplier）に記録した。businessModelには供給者の欄を設けていないため、本文では事業構造の免疫血清検査用試薬の説明に留めた。
- businessModel: 親会社株主に帰属する当期純利益の増加について、理由に当たる語句は本文の財務用語規則に触れるため、流れの利益の段には金額と増減率のみを記載した。
- businessStructure: 単一セグメント（検査薬事業のみ）のため、事業の子区分はセグメント情報の関連情報（製品及びサービスごとの情報）の外部顧客への売上高の大きい順に並べた。
- businessStructure: 製品及びサービスごとの情報の各区分の単純合計は41,896百万円で、印字された合計41,899百万円との差3百万円は各区分が百万円単位で印字されていることによるものとして、印字どおりに記載した。
- businessStructure: 主要な設備では、野木事業所が検査薬全般の製造・物流・研究を、那須事業所が免疫血清検査用試薬と遺伝子検査用試薬の製造・研究を担う旨が印字されている。設備の金額は本文の数値規則により記載していない。
- businessStructure: 2025年9月に栄研生物科技(中国)有限公司の全持分を譲渡して連結子会社から除外し、2025年5月に設立した栄研医薬(上海)有限公司を連結の範囲に含めた。いずれも期中に完了し、2026年3月31日現在のグループ構成（連結子会社2社・持分法適用関連会社1社）に反映されているため、needsReviewには入れず沿革と本warningsに記録した。
- history: 創立時の資本金の金額は、本文の数値規則（資本金の金額は書かない）により沿革に記載していない。
- history: 1943年の田辺製薬株式会社による資本参加は歴史的な印字のみで、現在の関係を示すものではないため、沿革の本文には含めなかった。
- history: 2026年6月のICPP棟完成は決算日（2026年3月31日）後の出来事だが、有報提出前に完了し【沿革】自体に印字されているため沿革に含めた。重要な後発事象としては該当事項なしと印字されているため、needsReviewには入れていない。
- history: 東金事業所と王子事業所は後年に閉鎖され野木事業所へ集約された旨も沿革に印字されているが、主な転機に絞って記載した。
- industry: 主分類は pharmaceuticals（検査薬事業のみの単一セグメントで、外部顧客への売上高41,899百万円の全てが臨床検査薬の製造販売によるもの）。副次分類は付けていない。
- relatedCompanies: 大塚製薬株式会社: 重要な契約等に資本参加を含む業務提携契約（2006年9月7日締結、期間終了後は1年毎の更新）が印字され、研究開発活動でも業務提携契約に基づく共同開発の検討継続が印字されているが、同社も上場親会社もrelated-candidates.jsonの候補にないため、候補外の相手は結ばない規則によりリンクしなかった。提携の事実は本warningsに記録する。
- relatedCompanies: アルフレッサ株式会社・東邦薬品株式会社: 主要な顧客ごとの情報に印字される主要な販売先だが、両社とも候補リストになく（上場親会社も候補にない）、リンクしなかった。
- relatedCompanies: 西川計測とアドバンスト・メディアは、特定投資株式の保有目的が銘柄ごとに異なる具体的な協力関係の構築（DX推進／音声認識技術を活用したヘルスケア）として印字され、当事業年度に株式数が増加しているため、全銘柄共通の定型句とは区別してbusiness-partnerとして結んだ。
- relatedCompanies: mitsubishi-ufj-financial-group（三菱UFJフィナンシャル・グループ）: 大量保有報告書に関する変更報告書の記載のみで、2026年3月31日現在における実質所有は確認できていない旨が注記されており、金融機関でもあるためリンクしなかった。
- relatedCompanies: 連結子会社である栄研医薬(上海)有限公司とEIKEN MEDICAL AMERICA INC.、持分法適用関連会社であるナノティス株式会社は、自社グループの会社であるため関連企業のリンクには含めていない。
- relatedCompanies: innovation（イノベーション）、career（キャリア）、port（ポート）、vision（ビジョン）、base-4481（ベース）、en（エン）、core（コア）、lec（レック）、rion（リオン）、seki（セキ）、rix（リックス）、corona（コロナ）、kohsoku（高速）、will（ウィル）、shochiku（松竹）、nissin（日新）、trust（トラスト）: 一般語・人名・信託口名義・地名等への部分一致であり、相手企業への言及ではないためリンクしなかった。
- terms: 用語の助言: 「LAMP法」（遺伝子を増幅する当社グループの技術で、結核検査システムTB-LAMPやLoopamp試薬に使われている）、「便潜血検査」（大腸がんのスクリーニングに使う便中の血液を調べる検査）、「臨床検査薬」（病気の診断のために検体を調べる試薬の総称）を候補として挙げる。いずれも有報本文に印字された用語である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
