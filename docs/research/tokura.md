# 徳倉建設 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 徳倉建設株式会社 |
| 証券コード | 1892 |
| docID（データを取り出した文書） | `S100YKW2` |
| 原本 docID | `S100YKW2` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YKW2.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 徳倉建設株式会社 / 1892 / docID S100YKW2（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 6 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokura: 10 件の数値を有報XBRLと照合
有報: 徳倉建設株式会社 有価証券報告書－第81期(2025/04/01－2026/03/31) (docID S100YKW2)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tokura: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象は、連結・個別のいずれの注記にも「該当事項はありません」と印字されており、needsReviewはない。
- businessModel: 重要な契約等は「該当事項はありません」と印字されている。
- businessModel: 前期有報との修正再表示チェックでは全ての行が一致し、会計基準の変更等の注記もないため、financialNotesは空とした。
- businessModel: 報告セグメントの外部顧客への売上高の内訳（建築44,909百万円、土木22,057百万円、不動産624百万円）の単純合計は67,590百万円で、セグメント情報に印字された報告セグメント計67,592百万円と２百万円異なる。印字どおりに転記し、差異はここに記録する。
- businessModel: 経営上の目標の指標として印字された総資本経常利益率、売上高経常利益率の水準は将来の比率目標のため、本文には転記していない。
- businessModel: 関係会社の状況に印字された坂田建設株式会社・九州建設株式会社の主要な損益情報等（個別会社の経営指標）は、本文には当社連結の売上高と当期純利益のみを書く規則のため転記していない。
- businessStructure: グループは当社、連結子会社６社、非連結子会社７社、関連会社６社で構成される（2026年3月31日現在）。
- businessStructure: 報告セグメントは建築・土木・不動産の３つであり、その他は報告セグメントに含まれない事業セグメント（資材販売事業等）である。
- businessStructure: 報告セグメントの外部顧客への売上高の内訳（建築44,909百万円、土木22,057百万円、不動産624百万円）の単純合計は67,590百万円で、セグメント情報に印字された報告セグメント計67,592百万円と２百万円異なる。印字どおりに転記し、差異はここに記録する。
- businessStructure: セグメント利益は本文の規則により書いていない。
- history: 沿革の2012年から2022年にかけての記載は日付と出来事の印字が圧縮されているため、行の順序どおりに日付と出来事を対応づけて読み取った。
- history: 支店・営業所の開設や名称変更等の軽微な沿革は省略した。
- history: 関係会社の状況に印字された子会社の資本金の金額は、本文の規則により書いていない。
- industry: 建設事業（建築・土木）が売上の中心であり、不動産セグメントは建設事業に関連する小規模な事業、その他の事業も建設資材の販売・賃貸やＰＦＩ事業の運営であるため、主たる業界は construction のみとした。
- relatedCompanies: nitto-kogyo、the-takigami-steel-construction、chubu-steel-plate、mino-ceramic、taiyo-kisokogyo、chubu-electric-power、nagawa、amg-holdings、marufuji-sheet-piling、kikusui-chemical-industries: 特定投資株式として保有するが、保有目的は全銘柄に共通する定型文「企業間取引の維持強化」であり、業務提携の概要も工事受注実績あり・施工協力等という定型的な補足にとどまるため、定型文のみでは結ばない先例に従い結ばなかった。
- relatedCompanies: fukuoka-financial-group、aichi-financial-group、mitsubishi-ufj-financial-group、san-ju-san-financial-group、the-bank-of-nagoya、sumitomo-mitsui-trust-group、mizuho-financial-group: 特定投資株式として保有するが、主要取引金融機関との資金調達・営業情報交換のための保有であり、事業上の提携関係の印字がないため結ばなかった。
- relatedCompanies: tokai-senko: 特定投資株式として保有するが、保有目的は「企業間取引の維持強化」の定型文のみで、業務提携の概要の印字もないため結ばなかった。
- relatedCompanies: hikari-tsushin: 大株主として印字されているのは光通信ＫＫ投資事業有限責任組合（投資事業組合）であり、光通信株式会社そのものではないため結ばなかった。
- relatedCompanies: 株式会社三菱ＵＦＪ銀行: 当社の株式4.77％を保有する大株主だが、銀行本体であり、三菱ＵＦＪフィナンシャル・グループとは別の法人であるため、大株主としての関係では結ばなかった。
- relatedCompanies: arcs: 非連結子会社の株式会社アークスは当社グループの会社であり、北海道でスーパーマーケットを営む株式会社アークス（9948）とは別の同名会社であるため結ばなかった。
- relatedCompanies: create: 完成工事の主なものに印字された小林クリエイト株式会社の部分一致であり、クリエイト株式会社（3024）ではないため結ばなかった。
- relatedCompanies: hino-motors-7205: 完成工事の主なものに印字された愛知日野自動車株式会社の部分一致であり、日野自動車株式会社とは別の法人であるため結ばなかった。
- relatedCompanies: meiwa-estate: 前事業年度の完成工事の主なものに、他の会社との共同の発注者として名前があるのみで、継続的な取引・提携関係の印字がないため結ばなかった。
- relatedCompanies: career、en、zero、base-4481、kohsoku、path、core、port、step、innovation、sojitz: いずれも一般語・文言の部分一致（キャリア採用、エンゲージメント、ネット・ゼロ・エネルギー・ビル、売上総利益ベース等）で、当該企業についての記載ではないため結ばなかった。
- relatedCompanies: 当社の連結子会社６社、非連結子会社７社、関連会社６社は、当社グループの会社であり関連企業には含めていない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
