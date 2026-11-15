# みらいワークス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社みらいワークス |
| 証券コード | 6563 |
| docID（データを取り出した文書） | `S100XBZI` |
| 原本 docID | `S100XBZI` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XBZI.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社みらいワークス / 6563 / docID S100XBZI（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mirai-works: 4 件の数値を有報XBRLと照合
有報: 株式会社みらいワークス 有価証券報告書－第14期(2024/10/01－2025/09/30) (docID S100XBZI)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-09-30","previousFiling":8358621000,"latestFiling":8369907000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-09-30","previousFiling":313763000,"latestFiling":250081000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":2761904000,"latestFiling":2698605000},{"key":"NetAssetsSummaryOfBusinessResults|2023-09-30","previousFiling":1214898000,"latestFiling":1151198000},{"key":"NumberOfEmployees|2023-09-30","previousFiling":133,"latestFiling":138}]
利益・総資産・純資産・従業員数: 8 件を照合
すべて一致しました。
mirai-works: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との照合で第12期（2023年9月期）の売上高・従業員数等に差異が検出されました。前期有報（第13期）は連結子会社がなく個別財務諸表のみを作成しており、その経営指標は個別ベースであるのに対し、本有報の第12期の数値は連結ベースで印字されているため、登録数値は本有報の印字どおりとしました。差異の理由を断定する注記は本有報に印字されていません。
- businessModel: 当社グループはプロフェッショナル人材事業の単一セグメントのため、事業ごとの売上高は開示されておらず、各事業には金額を書きませんでした。
- businessModel: MD&Aの主要KPI（契約数・1契約当たり売上総利益・直接営業人員数・大手企業取引数）や利益の内訳金額は、投資指標・利益指標にあたるため本文に書きませんでした。固定資産の減損損失93,182千円の内訳も書きませんでした。
- businessModel: Wikipediaの記事は確認できましたが、抜粋は有報の事実の言い換えにとどまるため出典として追加しませんでした。
- businessStructure: 当社はプロフェッショナル人材事業の単一セグメントであり、有報にセグメント別の記載がないため、主要な設備（本社）は特定の事業に結びつけませんでした。設備の帳簿価額も書きませんでした。
- businessStructure: このツリーの旧スキーマのため suppliers キーは省略し、仕入先に関する個別の印字も有報にありません。
- history: 沿革のうち、本社移転（2018年・2022年）、関西支社・九州支社・東北支社・甲信越支社の開設、経営理念の革新（2016年）、個別の新サービス開始（2021年の3サービス、2023年の官庁出身者マッチングと『プロフェッショナル・キャンパス』、2024年の『ConsulNext.jp』開始）、2022年4月のマザーズからグロース市場への市場区分移行は、項目として採用せずここに記録します。
- history: 設立時の資本金の印字は、資本金額を沿革に書かない規則のため落としました。
- industry: 主たる業界は「human-resources」を直接付けました。プロフェッショナル人材事業が単一セグメントであり、業務委託・人材派遣・有料職業紹介による人材マッチングが事業の中核のため、閉じた分類に直接当てはまります。地方創生事業とソリューション事業は付随事業であり、独立した業界は付けませんでした。
- relatedCompanies: 候補14社（ビジョン、イノベーション、フリー、ベース、エン、ポート、セキ、キャリア、コロナ、パス、リード、note、ゼロ等）はすべて一般語・部分一致の一致であり、相手についての取引・提携・資本関係の印字がないため結んでいません。noteへの一致は自社サービス「GREEN NOTE」の名称によるものです。
- relatedCompanies: Creww株式会社（2022年4月に資本業務提携）、Freecracy株式会社（2023年11月に資本業務提携）は実質的な提携先ですが、related-candidates.json に含まれていないため結んでいません。
- relatedCompanies: 株式会社日本人材機構（2020年7月に事業譲渡の相手先）、株式会社ハイブ・株式会社 And Technologies（いずれも株式取得後に吸収合併）は候補にないため結んでいません。
- relatedCompanies: 連結子会社のGreenroom株式会社は自社グループのため結んでいません。
- terms: 用語の助言のみです。対象となりうる用語は「プロフェッショナル人材」「フリーランス」「リスキリング」「オープンイノベーション」などですが、本文の中で説明が完結しており、独立した用語データは作成していません。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
