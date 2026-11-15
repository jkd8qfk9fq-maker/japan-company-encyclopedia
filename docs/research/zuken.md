# 図研 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社図研 |
| 証券コード | 6947 |
| docID（データを取り出した文書） | `S100YD7O` |
| 原本 docID | `S100YD7O` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YD7O.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社図研 / 6947 / docID S100YD7O（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
zuken: 10 件の数値を有報XBRLと照合
有報: 株式会社図研 有価証券報告書－第50期(2025/04/01－2026/03/31) (docID S100YD7O)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
zuken: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の金額は主要な経営指標等の百万円印字と、セグメント注記の千円印字を百万円に切り捨てた金額を用いた。千円印字の切り捨てのため、地域別の金額の合計は連結売上高の百万円表記と一致しない場合がある。
- businessModel: businessModel.suppliersは省いた。調達について一般名詞で述べられた仕入先は印字されておらず、子会社の仕入先として個別の会社名が印字されるのみであるためである。
- businessModel: 表示方法の変更は、連結キャッシュ・フロー計算書で棚卸資産の増減額を独立掲記することに伴う前連結会計年度分の組替えであり、表示の変更のみである。前期有報との修正再表示チェックでは全ての系列で差異がなく、5年間の指標に影響は確認できなかったため、financialNotesには書かず本warningsに記録した。
- businessModel: 重要な後発事象は該当事項なしと印字されているため、needsReviewには入れていない。
- businessModel: 経営方針に印字される指標のうち投資に関する語を含むものは、本文の規則に従い転記していない。戦略は定性的な内容のみを記載した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（日本、欧州、米国、アジア）とした。MD&Aのセグメント業績に印字される地域別の売上高はセグメント間の内部売上高を含む金額であるため用いず、セグメント注記の外部顧客への売上高を用いた。
- businessStructure: 子区分はセグメント注記の収益の分解情報（ソリューションとクライアントサービス）に基づく。本文の金額は千円単位で印字された金額を百万円に切り捨てたものである。
- businessStructure: 千円印字の各セグメント外部顧客への売上高の単純合計は43,101,747千円で、印字の合計43,101,750千円と3千円異なる。印字の合計をそのまま用いた。百万円への切り捨てにより、区分の金額の合計と連結売上高の百万円表記は一致しない場合がある。
- businessStructure: 事業名はセグメント注記の報告セグメント名どおり「日本」「欧州」「米国」「アジア」とした。
- history: 沿革から主要な出来事を選んだ。営業所や支社の開設、本店移転などの小規模な出来事は省いた。
- history: 沿革に金額は印字されておらず、本文にも金額は書いていない。関係会社の資本金の金額も沿革には用いていない。
- history: 2014年の資本業務提携の相手は、現在のビジネスエンジニアリング株式会社であり、沿革の当時の名称である東洋ビジネスエンジニアリング株式会社と併記した。
- industry: 主たる業界はitとした。基板設計、回路設計とITの各ソリューションはいずれもソフトウェアとその関連サービスであり、売上の中心を占めるためである。
- industry: 半導体は付けていない。同社は半導体そのものや製造装置を作る会社ではなく、次世代半導体の実装プロセスを支援するソフトウェアを提供する会社であるためである。electronicsも、電子部品を作る事業ではないため付けていない。
- relatedCompanies: ビジネスエンジニアリング（business-engineering、4828）だけを関連付けした。同社は持分法適用関連会社として関係会社の状況に印字され、資本業務提携の事実も沿革に印字されている。
- relatedCompanies: 三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group、8306）、三井住友フィナンシャルグループ（sumitomo-mitsui-financial-group、8316）、横浜フィナンシャルグループ（yokohama-financial-group、7186）は特定投資株式に載るが、保有目的は情報収集を目的とした関係強化・維持という共通の文言のみで、金融機関でもあるため関連付けしなかった。
- relatedCompanies: Fortinet,Inc.は子会社の仕入先として特定投資株式に個別に印字され、EIZO株式会社は製品のユーザとして個別に印字されるが、いずれも関連候補に含まれていないため関連付けしなかった。事実は本warningsに記録した。
- relatedCompanies: 自社グループの連結子会社各社は、百科事典で別に扱う関連会社リンクの対象としなかった。ビジネスエンジニアリングは上場する持分法適用関連会社であり、候補にも含まれるため上記のとおり関連付けした。
- relatedCompanies: career（キャリア）、port（ポート）、base-4481（ベース）、alpha（アルファ）、alpha-4760（アルファ）、stg（STG）、kohsoku（高速）、seki（セキ）、suzuken（スズケン）、trust（トラスト）、freee（フリー）、ic（IC）、ray（レイ）、the-lead（リード）は、いずれも一般語、通貨表記、子会社名の一部、信託口表記などへの語の一致であり、その相手について取引・提携・資本関係を述べる印字はないため関連付けしなかった。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。候補となる用語はMBSE、ワイヤハーネス、設計データ管理などであるが、本工程では用語の登録は行わない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
