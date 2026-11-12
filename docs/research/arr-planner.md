# アールプランナー — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社アールプランナー |
| 証券コード | 2983 |
| docID（データを取り出した文書） | `S100Y03C` |
| 原本 docID | `S100Y03C` |
| 提出日（原本） | 2026-04-21 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y03C.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社アールプランナー / 2983 / docID S100Y03C（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 2 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
arr-planner: 10 件の数値を有報XBRLと照合
有報: 株式会社アールプランナー 有価証券報告書－第23期(2025/02/01－2026/01/31) (docID S100Y03C)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
arr-planner: 本文の金額 10 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額は千円印字を百万円へ切り捨てて記載した。MD&Aが印字する戸建住宅事業の売上高48,341百万円はセグメント間取引を含む合計であり、本文ではセグメント注記の外部顧客への売上高48,340百万円を用いた。
- businessModel: 会社は投資株式を保有していない旨を印字しており、特定投資株式に基づく関連付けは行っていない（関連企業フラグメントに記録）。
- businessModel: 2022年2月1日付の1株につき4株の株式分割は指標等の注記に印字されるが、既に過去の分割であり当期の指標に反映済みであるため、needsReviewには2026年2月1日付の分割のみを記録した。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした。その他は有報が報告セグメントに含まれない区分と明記するもので、金額も最も小さいため最後に置いた。
- businessStructure: 戸建住宅事業の子区分の金額はMD&Aの販売実績の印字（注文住宅12,128百万円、分譲住宅34,368百万円、不動産仲介934百万円、エクステリア590百万円、リフォーム318百万円）を用いた。各区分を千円印字から百万円へ切り捨てた合計は48,338百万円で、セグメント外部売上高48,340百万円と2百万円差があるが、印字のとおり記載した。
- businessStructure: 関係会社の状況に印字される連結子会社の資本金は、金額に関する記載制限のため転記していない。
- businessStructure: 金額は千円印字を百万円へ切り捨てて記載した（切り捨て convention）。
- history: 沿革に印字される設立時の資本金は、金額に関する記載制限のため転記していない。
- history: 沿革のうち展示場・ショールームの個別の開設は、事業の転機となるもの（首都圏進出、埼玉県初出店等）に絞って記載し、その他の個別開設は省いた。
- industry: 主たる業界は real-estate とした。販売実績で最も大きいのは分譲住宅の販売であり、土地の仕入・販売、不動産仲介、中古不動産・収益不動産の販売も不動産関連であるためである。注文住宅の請負やリフォーム・エクステリアの請負もあるため construction を副次区分とした。閉じた集合の既存値で足りるため taxonomy gap は記録していない。
- relatedCompanies: 会社は投資株式を保有していない旨を印字しており、大株主は個人と従業員持株会・証券会社等で、関連候補に該当する事業会社との取引・提携・資本関係の印字はないため、関連付けは行わなかった。
- relatedCompanies: 関連候補のエン、ランド、ポート、ベース、リズム、パス、ビジョン、イムラ、スカラ、セキ、ゼロは、エンゲージメント、ブランド説明文中の一般語句、ライフタイムバリュー等の語の一致による誤検出であり、有報がその相手について取引・提携・資本関係を述べる印字はないため関連付けしなかった。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。

## 要確認（status に反映）

- businessModel: 株式分割: 2026年1月5日開催の取締役会決議に基づき、2026年1月31日を基準日として2026年2月1日付で普通株式1株につき2株の割合で株式分割を行い、あわせて発行可能株式総数の定款変更を行った（重要な後発事象として記載）。株式数に関する指標は、前連結会計年度の期首に当該分割が行われたと仮定して算定されている。登録は2026年1月31日現在の構造に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
