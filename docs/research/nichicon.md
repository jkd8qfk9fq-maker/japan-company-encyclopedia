# ニチコン — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ニチコン株式会社 |
| 証券コード | 6996 |
| docID（データを取り出した文書） | `S100YLMG` |
| 原本 docID | `S100YLMG` |
| 提出日（原本） | 2026-06-26 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YLMG.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ニチコン株式会社 / 6996 / docID S100YLMG（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nichicon: 10 件の数値を有報XBRLと照合
有報: ニチコン株式会社 有価証券報告書－第91期(2025/04/01－2026/03/31) (docID S100YLMG)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nichicon: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えの記載は、保証債務の注記におけるニチコン製箔株式会社の区分掲記への表示方法の変更で、売上高・当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- businessModel: 無錫ニチコン エレクトロニクス Ｒ＆Ｄセンターの清算は2026年4月20日付で結了しており、有報の重要な後発事象は該当事項なしのため needsReview には入れていません。
- businessStructure: 事業の並び順は、2026年3月期の外部顧客への売上高の大きい順です。
- businessStructure: セグメント利益は本文の規則により書きませんでした。
- history: 沿革は15件に絞りました。2026年2月の京都フュージョニアリングへの協力や2026年4月の無錫ニチコン エレクトロニクス Ｒ＆Ｄセンターの清算結了は、件数の都合で省きました。
- industry: 主たる業界は、売上高の最も大きいコンデンサ事業が電子部品の製造販売であるためelectronicsとしました。NECST事業は蓄電システムやEV関連機器などエネルギー関連の製品を手がける報告セグメントのため、energyを2つ目に付けました。
- relatedCompanies: 京都フィナンシャルグループは主要取引銀行で、資金調達等の金融取引が理由のため結びませんでした。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、三井住友フィナンシャルグループ、みずほフィナンシャルグループは、資金調達等金融取引が理由のため結びませんでした。
- relatedCompanies: ＳＯＭＰＯホールディングスは、保険の安定利用が理由のため結びませんでした。
- relatedCompanies: 萩原電気ホールディングスは取引先ですが、候補情報では上場でなく、2026年4月1日付で佐鳥電機と経営統合しMIRAINIホールディングスへ移行したため結びませんでした。
- relatedCompanies: キヤノン電子、新光商事、オプテックスグループは、いずれも当事業年度中に全株式を売却済みのため結びませんでした。
- relatedCompanies: ＥＩＺＯは特定投資株式の表に載る取引先ですが、related-candidates.json にないため結びませんでした。
- relatedCompanies: 村田製作所との2017年の電源事業譲受の意向確認書は過去の1回限りの出来事で、継続的な取引・提携の記載がないため結びませんでした。
- relatedCompanies: 富士通との2009年の事業譲渡契約は過去の1回限りの出来事で、契約相手は子会社の富士通メディアデバイスのため結びませんでした。
- relatedCompanies: 三和電機とタイコンは持分法適用関連会社ですが、いずれも非上場のため結びませんでした。
- relatedCompanies: 連結子会社25社は、すべて非上場または海外法人のため結びませんでした。
- relatedCompanies: 断片一致の候補（セキ、エン、ゼロ、イオン、ベース、ランド、コア、フュージョン、イノベーション、カバー、フリー、ポート、リード、高島、トラスト、佐鳥電機）は、社名の断片一致のみで、有報が取引・提携・資本関係を述べていないため結びませんでした。
- terms: 新たに提案する用語はありません。コンデンサや蓄電システムなどの用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
