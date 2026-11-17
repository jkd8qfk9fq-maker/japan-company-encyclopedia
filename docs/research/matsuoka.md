# マツオカコーポレーション — research log

Registered: 2026-11-17（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社マツオカコーポレーション |
| 証券コード | 3611 |
| docID（データを取り出した文書） | `S100YHK4` |
| 原本 docID | `S100YHK4` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-16 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHK4.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社マツオカコーポレーション / 3611 / docID S100YHK4（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 4 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 4 | スキーマ・整合性ルールともOK |
| registration | running | 2 |  |

## 数値の照合（verify-financials.mjs）

```
matsuoka: 10 件の数値を有報XBRLと照合
有報: 株式会社マツオカコーポレーション 有価証券報告書－第70期(2025/04/01－2026/03/31) (docID S100YHK4)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
matsuoka: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 報告セグメントは当連結会計年度より「縫製事業」「ラミネーションフィルム事業」の2区分に変更され、前期のセグメント情報は変更後の区分で作成されています。表示区分の変更であり、前期有報との照合では5年間の主要な経営指標等の全行が一致したため、financialNotesには入れませんでした。
- businessModel: 経営者による分析の国別の売上高は生産国ベースの数値のため本文には使わず、セグメント注記の外部顧客への売上高と、関連情報の顧客所在地ベースの地域別売上高を用いました。
- businessModel: SAHA PATHANA INTER-HOLDING PUBLIC COMPANY LIMITED（タイ）とは、タイ国での新たなサプライチェーンの構築を目的として2022年12月16日に資本提携を行っており、当連結会計年度にThanulux PCLからその株式を追加取得しました（期中の出来事で、期末の保有状況に反映されています）。取得金額は本文には書きませんでした。
- businessModel: 新中期経営計画『BEYOND2028』の定量目標（2029年3月期の売上高・純利益の金額やROEの水準）は将来の目標値のため、本文には書きませんでした。
- businessModel: 為替差損益調整後営業利益は当社の独自指標（監査対象外）のため、本文の財務数値には使いませんでした。
- businessStructure: 当社グループはこれまでアパレルOEM事業のみの単一セグメントとして開示を省略していましたが、当連結会計年度より経営管理区分の見直しに伴い「縫製事業」と「ラミネーションフィルム事業」の2つの報告セグメントで開示されています（前期のセグメント情報は変更後の区分で作成）。表示区分の変更であり、5年間の主要な経営指標等への影響はありません。
- history: 設立時や子会社の資本金の金額は、禁止される財務金額にあたるため沿革には書きませんでした。
- history: 1998年4月の司エステート株式会社を存続会社とする吸収合併は、株式の額面変更と単位株制度の導入のための技術的な手続きのため省略しました。
- history: 浙江茉織華貿易有限公司（2006年）、MATSUOKA APPARELS LTD.（2008年）、MK APPARELS LTD.（2010年）、BAC GIANG MATSUOKA CO.,LTD（2017年）、AN NAM MATSUOKA GARMENT CO.,LTD（2019年）、ISHWARDI MATSUOKA BANGLADESH.LTD.（2021年）、THANH CHUONG MATSUOKA GARMENT CO.,LTD（2021年）の設立・子会社化と、2005年の茉織華実業（集団）有限公司の完全子会社化は、生産拠点の細かな変遷のため省略しました。
- industry: 主たる事業はアパレル製品のOEM生産と機能性素材の生産であり、閉じた分類に該当する区分がないため、繊維・素材メーカーの先例に揃えてchemicals（化学）を暫定の主分類としました。該当する区分が無いため、taxonomyGapsに記録しています。
- relatedCompanies: vision、king、ray、base-4481、cota、hit、land、career、quick、zero、en、nissin、port、s-t、seki、will、trust: 一般的な語（中期経営計画『ビジョン2025』の名称、ワーキングウェア、クイックレスポンス等）や部分一致のみで、当社との取引・提携・資本関係の記載がないため結びませんでした。
- relatedCompanies: SAHA PATHANA INTER-HOLDING PUBLIC COMPANY LIMITED: タイ国での新たなサプライチェーンの構築を目的に2022年12月16日に資本提携を行った相手ですが、タイの上場会社で候補（EDINETのコードリスト）にないため結びませんでした。資本提携の事実はbusinessModelのwarningsに記録しています。
- relatedCompanies: 東レインターナショナル株式会社、Toray Industries (H.K.) Ltd.、株式会社ユニクロはいずれも未上場の子会社で候補にないため、親会社の東レ株式会社と株式会社ファーストリテイリングを結びました。上海鶴山針織服装有限公司はTM Textiles & Garments (HK) Ltd.の合弁相手ですが、未上場で候補にないため結びませんでした。
- relatedCompanies: 連結子会社21社と持分法適用関連会社1社（浙江舒海堂家紡制品有限公司）は当社グループの会社のため結びませんでした。
- terms: 助言: 用語『OEM』は、相手先のブランドで販売される製品を受託して生産することです。当社はブランド事業者や小売店から受注し、海外自社工場でアパレル製品を生産するOEM生産を事業の中核としています。
- terms: 助言: 用語『透湿防水フィルム』は、水滴は通さず水蒸気を通す性質を持つフィルムのことです。当社はこのフィルムを自社で生産し、生地に貼り合わせた透湿防水生地をアウトドアウェアやスポーツウェア向けに提供しています。

## 要確認（status に反映）

- businessModel: 連結子会社のMATSUOKA APPARELS LTD.は清算手続き中である旨が【関係会社の状況】に注記されています。登録は2026年3月31日現在の連結子会社21社の構成に基づきます。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

- [industry] マツオカコーポレーション（matsuoka）の主たる業界 → 提案: textiles（繊維・アパレル製品）。アパレル製品のOEM生産（縫製）と透湿防水フィルム等の機能性素材の生産が事業の中心で、東京証券取引所の業種区分は繊維製品ですが、閉じた分類に繊維・アパレルに当たる区分がありません。繊維・素材メーカーの先例（東レ、帝人）に揃えて chemicals を暫定としました。
