# ＳＩＧグループ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ＳＩＧグループ |
| 証券コード | 4386 |
| docID（データを取り出した文書） | `S100YH0Q` |
| 原本 docID | `S100YH0Q` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YH0Q.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ＳＩＧグループ / 4386 / docID S100YH0Q（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 19 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
sig-group: 10 件の数値を有報XBRLと照合
有報: 株式会社ＳＩＧグループ 有価証券報告書－第35期(2025/04/01－2026/03/31) (docID S100YH0Q)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
sig-group: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社SIGグループ」が EDINET の提出者名「株式会社ＳＩＧグループ」と違います

## エージェントの判断記録（fragment warnings）

- businessModel: 主要な経営指標等の推移の注記は、連結初年度（第31期）の自己資本利益率の計算基礎と従業員数の定義の２件のみで、いずれも表示上の事項のため financialNotes には記録しませんでした。
- businessModel: ブートストラップ時の「財務諸表の組替え」の注意については、前期有報との照合で売上高・純利益を含む全系列に差異がなく、主要な経営指標等の推移の注記にも組替えや会計基準の変更の記載がないため、financialNote は不要と判断し、ここに記録します。
- businessModel: 受注高・受注残高の金額、セグメント利益に当たる金額、設備の帳簿価額は書いていません。
- businessModel: 重要な後発事象は「該当事項はありません」と印字されています。
- businessStructure: 単一セグメントのため、子区分の金額はセグメント注記ではなく【関連情報】の製品及びサービスごとの情報（外部顧客への売上高）から採りました。
- businessStructure: 主要な顧客として、株式会社テプコシステムズ、日本電気株式会社、株式会社日立製作所が【関連情報】に開示されています（金額は本文に書いていません）。
- businessStructure: 設備の帳簿価額は書いていません。
- history: 資本金の増資に関する行（2001年、2006年、2017年）は資本金の金額を含むため省きました。
- history: 事業所の開設・分室の開設（1992年九州、1996年関西、2006年総合研究所、2008年名古屋、2011年甲府、2013年仙台、2017年横浜分室、2019年クラウドビジネスセンター）、プライバシーマーク認定取得（2006年）、一般労働者派遣事業許可取得（2006年）、米国SecuGen社との販売契約（2011年）は、転機に絞るため省きました。
- history: 株式会社ＲＭＡの設立・事業譲受け・解散（2014年〜2016年）、株式会社アクロホールディングスの関連会社化（2020年）と持分法適用関連会社からの除外（2024年）、株式会社Ｙ．Ｃ．Ｏ．との資本・業務提携契約の締結（2021年）と全部売却による子会社からの除外（2025年）は省きました（子会社化した2022年の出来事は採用）。
- industry: 主たる業界は、単一セグメントのシステム開発及びインフラ・セキュリティサービス事業がITサービスであるため、it としました。
- industry: semiconductors は付けていません。半導体製造装置のシステム開発支援はシステム開発事業の一分野として行うソフトウェア開発であり、半導体や製造装置そのものを作る事業ではなく、金額が独立して開示されていないためです。
- industry: 閉じた分類で表しきれない事業はないと判断したため、taxonomyGaps は記録していません。
- relatedCompanies: seki（セキ）: 「セキュリティ」等の一般語の部分一致のみで、相手についての取引・提携・資本関係の印字がないため結びませんでした。
- relatedCompanies: innovation（イノベーション）: 経営理念の「ITイノベーションにより社会の高度化に貢献する」という文言の部分一致のみのため結びませんでした。
- relatedCompanies: career（キャリア）: 「キャリア採用」という採用活動の文言の部分一致のみのため結びませんでした。
- relatedCompanies: en（エン）: 一般語の部分一致のみで曖昧なため結びませんでした。
- relatedCompanies: base-4481（ベース）: 「連結ベースの数値」という文言の部分一致のみのため結びませんでした。
- relatedCompanies: king（キング）: 「ウォーキング大会」という文言の部分一致のみのため結びませんでした。
- relatedCompanies: nissin（日新）: コードリストにない相手で、新株予約権の文言中の部分一致のみのため結びませんでした。
- relatedCompanies: port（ポート）: 「サポート」という文言の部分一致のみのため結びませんでした。
- relatedCompanies: corona（コロナ）: 「コロナ禍」という情勢の文言のみのため結びませんでした。
- relatedCompanies: nippon-steel（日本製鉄）: 1991年の設立時に前身の住友金属工業がグループ会社として出資した経緯は【沿革】にありますが、2000年にグループから独立しており、現在の取引・資本関係の印字がないため結びませんでした。
- relatedCompanies: path（パス）: 一般語の部分一致のみで曖昧なため結びませんでした。
- relatedCompanies: ray（レイ）: 一般語の部分一致のみで曖昧なため結びませんでした。
- relatedCompanies: s-e（エスイー）: 一般語の部分一致のみのため結びませんでした。
- relatedCompanies: system-integrator（システムインテグレータ）: 当社自身を指す「独立系システムインテグレーター会社」という業態の文言であり、相手企業を指す印字ではないため結びませんでした。
- relatedCompanies: tear（ティア）: 一般語の部分一致のみのため結びませんでした。
- relatedCompanies: vision（ビジョン）: 一般語の部分一致のみのため結びませんでした。
- relatedCompanies: 候補にない相手: 株式会社テプコシステムズは【関連情報】で最大の主要顧客として開示され、【大株主の状況】にも載りますが、related-candidates に含まれないため結んでいません。事業構造の顧客には社名を記載しました。
- relatedCompanies: 候補にない相手: 株式会社ＩＧカンパニーは【大株主の状況】の筆頭（28.37％、2026年３月31日現在）ですが、related-candidates に含まれないため結んでいません。
- relatedCompanies: 特定投資株式は「該当事項はありません」と印字されており、政策保有株式からの関連付けはありません。
- terms: 助言のみ。用語の追加提案はありません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
