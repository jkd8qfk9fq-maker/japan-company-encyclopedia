# 八洲電機 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 八洲電機株式会社 |
| 証券コード | 3153 |
| docID（データを取り出した文書） | `S100YE8H` |
| 原本 docID | `S100YE8H` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YE8H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 八洲電機株式会社 / 3153 / docID S100YE8H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
yashima-denki: 10 件の数値を有報XBRLと照合
有報: 八洲電機株式会社 有価証券報告書－第82期(2025/04/01－2026/03/31) (docID S100YE8H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
yashima-denki: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意にある財務諸表の組替えの記載は、報告セグメントの変更（産業・設備事業の一部をプラント事業へ変更し、公共・設備事業へ名称変更。前連結会計年度のセグメント情報は変更後の区分表示により作成）に伴う表示の組替えであり、前期有報との照合では5年間の主要な経営指標等の全行が一致したため、登録する指標に影響はないと判断し、financialNotesには入れませんでした。
- businessModel: セグメントの売上高は、セグメント注記の外部顧客への売上高を用いました（経営者による分析の販売実績とも一致します）。
- businessModel: 中期経営計画の目標値（連結経常利益の金額）は本文の財務数値の範囲外のため、本文には書きませんでした。
- businessStructure: 事業の並び順は、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順としました（公共・設備事業32,137百万円、プラント事業26,341百万円、交通事業16,089百万円）。
- businessStructure: 当連結会計年度より、従来「産業・設備事業」に含めていた一部の事業を「プラント事業」に変更し、「産業・設備事業」から「公共・設備事業」へ名称を変更しています。前連結会計年度のセグメント情報は変更後の区分表示により作成されており、表示区分の変更のため warnings のみとしました。
- businessStructure: 各事業の子区分は【事業の内容】と報告セグメントの概要に印字された製品・サービスの区分から構成し、金額が独立して開示されていないため金額は書いていません。
- history: 【沿革】は年月と事象が対で印字されており、行順に対応づけました。
- history: 営業所・出張所の開設や小規模な子会社の設立・商号変更などの細目は省きました（理由: 事業の転機ではないため）。2026年4月の八洲EIテクノロジーの商号変更は期後の構造変更のため収録し、needsReviewにも記録しました。
- history: 資本金の金額は【沿革】に印字されていないため、書いていません。
- industry: 日立グループの特約店として電気機器・産業用設備・空調関連機器の販売を中核とする技術商社であり、主たる業界は商社としました。設備工事や保守・メンテナンスは設備の販売に付随するもので、工事単独の金額が独立して開示されていないため、第二の業界は付けませんでした。
- relatedCompanies: en、core、career、vision、base-4481、seki、king、land、lec、port、rent、rix、tear、innovation、slogan: 一般的な語や部分一致のみで、当社との取引・提携・資本関係の記載がないため結びませんでした。
- relatedCompanies: trust: 日本マスタートラスト信託銀行株式会社（信託口）の表記に一致したもので、コードリストにない相手のため結びませんでした。
- relatedCompanies: power-solutions: 【重要な契約等】に印字された日立パワーソリューションズ株式会社（日立グループ会社）に一致したもので、候補の株式会社パワーソリューションズとは別の法人です。
- relatedCompanies: asahi-kogyosha、dai-dan、dainichiseika-color-and-chemicals-mfg、daiwa-industries、keiyo-gas、matsui-construction、nippon-light-metal-holdings、nishimatsu-construction、sanki-engineering、t-and-d-holdings、takasago-thermal-engineering: 当事業年度に保有株式を全て売却しており、2026年3月31日時点で保有がないため結びませんでした。
- relatedCompanies: eneos-holdings、hibiya-engineering、hokuetsu、iyogin-holdings、jfe-holdings、keikyu、mitsui-kinzoku、nippon-steel、nof、obayashi、okamura、resonac-holdings、ricoh、seven-and-i-holdings、tokyu: 特定投資株式の保有目的が「事業機会の創出、取引関係の維持・強化等」という全銘柄共通の定型的な記載のみで、個別の取引・提携の事実が印字されていないため結びませんでした。
- relatedCompanies: mitsubishi-ufj-financial-group、mizuho-financial-group: 金融機関であり、資金調達等の金融取引が中心のため結びませんでした。
- relatedCompanies: 日立グローバルライフソリューションズ株式会社と株式会社日立産機システムは当社の大株主ですが、いずれも未上場の日立グループ会社であり、候補にないため結びませんでした（親会社の株式会社日立製作所は仕入先として結んでいます）。
- terms: 助言: 用語『特約店』は、メーカーと特約店契約を結んでその製品を販売する販売店のことです。当社は1950年に株式会社日立製作所と特約店契約を締結して以来、日立グループ製品の販売を中核としています。
- terms: 助言: 用語『受変電設備』は、電力会社から受けた電気を工場やビルで使える電圧に変換して配る設備のことです。当社の各事業で取り扱う主要な設備として【事業の内容】に印字されています。

## 要確認（status に反映）

- businessModel: 連結子会社の八洲ＥＩテクノロジー株式会社は、2026年4月1日付の会社分割（吸収分割）により情報・通信事業を当社へ承継し、同日付で八洲冷熱株式会社へ商号変更しております。登録は2026年3月31日現在の構成（八洲ＥＩテクノロジー株式会社、公共・設備事業の関係会社）に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
