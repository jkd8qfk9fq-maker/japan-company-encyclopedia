# 三ツ星ベルト — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 三ツ星ベルト株式会社 |
| 証券コード | 5192 |
| docID（データを取り出した文書） | `S100YJBU` |
| 原本 docID | `S100YJBU` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJBU.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 三ツ星ベルト株式会社 / 5192 / docID S100YJBU（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 25 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsuboshi-belting: 10 件の数値を有報XBRLと照合
有報: 三ツ星ベルト株式会社 有価証券報告書－第111期(2025/04/01－2026/03/31) (docID S100YJBU)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
mitsuboshi-belting: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは空とした。5年間の指標に影響する会計基準の変更や変則決算の印字はなく、前期有報との照合も全行一致している。
- businessModel: 調達先（suppliers）は記載していない。有報は原材料であるケーブルコードを子会社三ツ星コード株式会社が製造している旨を述べるのみで、外部調達先の一般名詞での言及がないため。
- businessModel: 「'24中期経営計画」の数値目標（2030年度のありたい姿の売上高1,000億円・営業利益130億円・ROE10％、2026年度KPIの売上高915億円・営業利益105億円・ROE9％、DOEの目安5.4％程度）は本文の財務数値の規則に触れるため要約には入れず、ここに記録する。
- businessModel: 地域ごとの売上高の合計は92,296百万円となり、印字の連結売上高92,298百万円と2百万円異なりますが、有報の表の印字どおりに記載しています。
- businessModel: 地域ごとの情報では、前連結会計年度に「北米」に含めて表示していた「米国」を、当連結会計年度より連結売上高の10％を超えたため独立掲記しており、前連結会計年度分も変更後の区分に組み替えて表示しています。表示方法の変更のみで、5年間の指標への影響はありません。
- businessModel: 2025年4月にドバイの子会社MITSUBOSHI BELTING MIDDLE EAST FZCOが事業を開始したことは期中の出来事のため沿革に記録し、needsReviewには入れていない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（海外ベルト事業50,787百万円、国内ベルト事業28,975百万円、建設資材事業6,769百万円、その他5,765百万円）。
- businessStructure: セグメント注記の外部顧客への売上高の合計は92,296百万円となり、印字の連結売上高92,298百万円と2百万円異なりますが、有報の表の印字どおりに記載しています（報告セグメント計86,532百万円も内訳の合計86,531百万円と1百万円異なり、有報の表の丸めによるものです）。
- businessStructure: 製品別の売上高は独立して開示されていないため、childrenには金額を記載していません。
- history: 沿革は有報の【沿革】の印字順に全57行を記載した。設立時の資本金などの金額は本文には記載していない。
- industry: 主たる業界はmachineryとした。ベルトの製造・販売が中核で、報告セグメントの海外ベルト事業と国内ベルト事業が外部顧客への売上高の86.9％を占めるため。
- industry: 自動車は主要な需要先の業界だが当社の事業そのものではないため、副次分類は付けなかった。建設資材事業は外部顧客への売上高の7.3％にとどまるため、副次分類は付けなかった。
- relatedCompanies: 結ばなかった候補：en（4849）—「エン」は「エンジニアリング」の部分一致で、エン株式会社との取引・提携の印字はない。
- relatedCompanies: 結ばなかった候補：trust（3347）—「トラスト」は日本マスタートラスト信託銀行（信託口）の部分一致で、株式会社トラストとの関係の印字はない。
- relatedCompanies: 結ばなかった候補：seki（7857）—「セキ」は「情報セキュリティ」等の部分一致で、セキ株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：tear（2485）—「ティア」は「サステナビリティアーカイブ」等の部分一致で、株式会社ティアとの関係の印字はない。
- relatedCompanies: 結ばなかった候補：base-4481—「ベース」は「スキルマトリックスをベースに」等の部分一致で、ベース株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：king（8118）—「キング」は「ワーキンググループ」等の部分一致で、株式会社キングとの関係の印字はない。
- relatedCompanies: 結ばなかった候補：ishin（143A）—「イシン」は「インターナルカーボンプライシング」等の部分一致で、イシン株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：takashima-and-co（8007）—「高島」は三ツ星コード株式会社の所在地「滋賀県高島市」の部分一致で、高島株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：land（8918）—「ランド」は「MITSUBOSHI BELTING POLAND」の部分一致で、株式会社ランドとの関係の印字はない。
- relatedCompanies: 結ばなかった候補：lec（7874）—「レック」は「ケミフレックス製品」等の部分一致で、レック株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：port（7047）—「ポート」は「エム・ビ・エル・総合サポート」の部分一致で、ポート株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：core（2359）—「コア」は「従業員エンゲージメントの向上スコア」等の部分一致で、株式会社コアとの関係の印字はない。
- relatedCompanies: 結ばなかった候補：corona（5909）—「コロナ」は「新型コロナウイルス感染症」の部分一致で、株式会社コロナとの関係の印字はない。
- relatedCompanies: 結ばなかった候補：freee（4478）—「フリー」は「フリーランス保護法」の部分一致で、フリー株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：future（4722）—「フューチャー」は「GXフューチャー・コンソーシアム」の団体名の部分一致で、フューチャー株式会社との取引・提携の印字はない。
- relatedCompanies: 結ばなかった候補：innovation（3970）—「イノベーション」は経営方針文中の一般語で、株式会社イノベーションとの関係の印字はない。
- relatedCompanies: 結ばなかった候補：mitsubishi-ufj-financial-group（8306）—特定投資株式の保有目的は資金借入等の取引のみで、資金調達が理由のため結ばない。
- relatedCompanies: 結ばなかった候補：sumitomo-mitsui-financial-group（8316）—特定投資株式の保有目的は資金借入等の取引のみで、資金調達が理由のため結ばない。
- relatedCompanies: 結ばなかった候補：resona-holdings（8308）—特定投資株式の保有目的は資金借入等の取引のみで、資金調達が理由のため結ばない。
- relatedCompanies: 結ばなかった候補：rix（7525）—「リックス」は「スキルマトリックス」の部分一致で、リックス株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：teijin（3401）—当事業年度に保有株式の全株式を売却し、期末保有はゼロのため結ばない。
- relatedCompanies: 結ばなかった候補：honda（7267）—当事業年度に保有株式の全株式を売却し、期末保有はゼロのため結ばない。
- relatedCompanies: 結ばなかった候補：torq（8077）—「トルク」は製品名「スーパートルクGPLUS」の部分一致で、トルク株式会社との関係の印字はない。
- relatedCompanies: 結ばなかった候補：zero（9028）—「ゼロ」は「森林破壊ゼロ」の部分一致で、株式会社ゼロとの関係の印字はない。
- relatedCompanies: 大株主の状況（2026年3月31日現在）に載る事業会社はいないため、major-shareholderのリンクはない。筆頭は日本マスタートラスト信託銀行（信託口）で、他は三菱UFJ銀行・三井住友銀行（銀行 proper）、持株会、信託銀行、未上場会社及び個人である。
- terms: 特段の用語の助言はない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
