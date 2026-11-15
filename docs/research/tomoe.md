# 巴コーポレーション — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　巴コーポレーション |
| 証券コード | 1921 |
| docID（データを取り出した文書） | `S100YLBY` |
| 原本 docID | `S100YLBY` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLBY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 3 | 株式会社　巴コーポレーション / 1921 / docID S100YLBY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 8 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tomoe: 10 件の数値を有報XBRLと照合
有報: 株式会社　巴コーポレーション 有価証券報告書－第94期(2025/04/01－2026/03/31) (docID S100YLBY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tomoe: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社巴コーポレーション」が EDINET の提出者名「株式会社　巴コーポレーション」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報に百万円単位で印字された金額をそのまま用いた。セグメント金額はMD&Aの売上実績表の百万円印字を用い、セグメント注記の千円額を切り捨てて百万円にした値と一致することを確認した（換算の丸め上げはしていない）。
- businessModel: financialNotesは2025年3月期の1件のみとした。経営指標等の注記に、株式会社巴技研及び株式会社泉興産の連結子会社化に伴う段階取得に係る差益と負ののれん発生益等の計上で当期純利益が大幅に増加した理由が印字されているためである。変則決算・決算期変更はなく（summaryのirregularPeriods・fiscalYearChangeとも空）、前期有報との修正再表示チェックは全系列一致し、重要な後発事象は「該当事項なし」と印字されている。
- businessModel: 経営方針に印字された指標の名称には本文で使えない財務用語が含まれるため、perspectivesのstrategyには転記していない。同じく、経営方針の「高営業利益率」に当たる表現は使わず、付加価値と収益重視の方針の要約にとどめた。
- businessModel: 特定投資株式の脚注に、川田テクノロジーズ、三十三フィナンシャルグループ、キヤノンマーケティングジャパンが2026年4月1日に株式分割を行った旨が印字されている。当社の株式の分割ではなく、保有銘柄に関する注記であるため、本文とneedsReviewには入れず、この警告に記録した。
- businessModel: 賃貸等不動産や設備投資、受注の金額は、本文の規則により書いていない。セグメントの利益の金額と増減理由も書いていない。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順とした（鉄構建設事業27,938百万円、不動産事業7,013百万円）。金額はMD&Aの売上実績表に百万円単位で印字された金額を用い、セグメント注記の千円額（鉄構建設事業27,938,748千円、不動産事業7,013,213千円）を切り捨てて百万円にした値と一致する。
- businessStructure: セグメント注記の外部顧客への売上高の合計は34,951,962千円で、連結売上高の印字34,951百万円とは千円単位で差がある。有報の印字どおり百万円単位の金額を用い、差異はこの警告に記録した。
- businessStructure: グループは当社、子会社5社及び関連会社1社で構成される（2026年3月31日現在）。関連会社1社は持分法を適用しない関連会社の門真市立中学校ＰＦＩ事業株式会社で、重要性がないため持分法の適用から除外されている旨が印字されている。自社の子会社・関連会社は関連企業リンクの対象にしていない。
- businessStructure: suppliersキーは本ツリーのスキーマに無いため、businessModelには書いていない。資材の仕入先に関する事実は関連企業の判断とwarningsに記録した。
- history: 沿革は年月と事項が崩れた表で印字されているため、日付と事項の対応が明確な行だけを選んだ。小山工場の建設、株式会社巴技研の設立、工場・支店の開設など、対応づけが判然としない行は落とした。
- history: 沿革に印字された設立時の資本金額は、財務金額に当たるため本文には書いていない。株式会社九州巴コーポレーションの解散（2012年3月）と株式会社ＯＴＣの解散（2015年10月）は、現在のグループ構成に直接関わらないため選ばなかった。
- history: 2024年の令和建設株式会社の連結子会社化は、沿革で株式会社巴技研の連結子会社化の記事に続けて印字され、みなし取得日が2024年9月30日と明記されているため、同じ2024年の出来事として1行にまとめた。
- industry: 主たる業界は、外部顧客への売上高の約8割を占める鉄構建設事業からconstructionとした。不動産事業は報告セグメントとして金額が開示されているため、real-estateを2つ目に付けた。閉じた分類で言えない区分はないためtaxonomyGapsは空とした。
- relatedCompanies: 候補 taisei（大成建設）は前連結会計年度の主要な顧客として印字があるが、当連結会計年度は外部顧客への売上高の10％以上を占める相手先がないと印字されており、当期の継続的な関係の根拠が弱いためリンクしなかった。
- relatedCompanies: 候補 obayashi（大林組）と候補 shimizu（清水建設）と候補 alps-alpine（アルプスアルパイン）は、完成工事や次期繰越工事の相手先として1件ずつ名前が挙がるだけで、継続的な取引関係の印字がないためリンクしなかった。
- relatedCompanies: 候補 mitsubishi-ufj-financial-group、候補 mizuho-financial-group、候補 sumitomo-mitsui-financial-group、候補 san-ju-san-financial-groupは、いずれも取引金融機関の持株会社として金融取引関係の維持・強化のため保有すると印字された金融持株会社で、資金調達が理由のためリンクしなかった。
- relatedCompanies: 候補 kawada-technologies、候補 asia-pile-holdings、候補 kyokuto-boeki-kaisha、候補 lec、候補 nakanishi-mfg、候補 nasu-denki-tekko、候補 nippon-concrete-industries、候補 nishikawa-keisoku、候補 oenon-holdings、候補 okabe、候補 taihei-dengyo-kaisha、候補 takadakiko-steel-construction、候補 takamisawa-cybernetics、候補 tsukishima-holdings、候補 wakachiku-construction、候補 infroneer-holdings、候補 canon-marketing-japan、候補 yamato-holdingsは、特定投資株式の保有目的が全銘柄共通の定型句（協力関係・取引関係の維持・強化のため）だけであり、それだけでは関係の根拠にしないためリンクしなかった。ヤマトホールディングスとキヤノンマーケティングジャパンについては、総合建設工事の取引関係の円滑化という記載はあるが、具体的な工事や継続関係の印字がないため同様にリンクしなかった。
- relatedCompanies: 候補 en、候補 career、候補 port、候補 freee、候補 gridは、一般語や文章の一部への一致で、当該会社への言及ではないためリンクしなかった。
- relatedCompanies: 候補 nagawa（ナガワ）は大株主として名前があるが、事業会社としての取引関係の印字は特定投資株式の定型句だけのためリンクしなかった。
- relatedCompanies: 候補 komaihaltec、候補 ms-and-ad-insurance-group-holdings、候補 sumitomo-mitsui-trust-group、候補 sumitomo-realty-and-developmentは、当事業年度に売却した銘柄として印字されており、現在の関係がないためリンクしなかった。
- relatedCompanies: 自社の連結子会社（札幌巴コーポレーション、東北巴コーポレーション、泉興産、巴技研、令和建設）と持分法非適用の関連会社（門真市立中学校ＰＦＩ事業株式会社）は、グループ内の会社であり関連企業リンクの対象にしていない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として3件を提案した。いずれも有報本文に現れる当社の事業を理解するうえで有用な語である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
