# 壱番屋 — research log

Registered: 2026-11-13（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社壱番屋 |
| 証券コード | 7630 |
| docID（データを取り出した文書） | `S100Y73F` |
| 原本 docID | `S100Y73F` |
| 提出日（原本） | 2026-05-28 |
| 決算期 | 2026-02-28 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y73F.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社壱番屋 / 7630 / docID S100Y73F（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 7 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ichibanya: 10 件の数値を有報XBRLと照合
有報: 株式会社壱番屋 有価証券報告書－第44期(2025/03/01－2026/02/28) (docID S100Y73F)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-02-28","previousFiling":45022168000,"latestFiling":45022000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-02-28","previousFiling":48286993000,"latestFiling":48286000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-02-29","previousFiling":55137331000,"latestFiling":55137000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-02-28","previousFiling":61006655000,"latestFiling":61006000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-02-28","previousFiling":2921798000,"latestFiling":2921000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-02-28","previousFiling":2538631000,"latestFiling":2538000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-02-29","previousFiling":2685925000,"latestFiling":2685000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-02-28","previousFiling":3171652000,"latestFiling":3171000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-02-28","previousFiling":4042965000,"latestFiling":4042000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-02-29","previousFiling":5021228000,"latestFiling":5021000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-02-28","previousFiling":5194230000,"latestFiling":5194000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-02-28","previousFiling":42467340000,"latestFiling":42467000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-02-28","previousFiling":42432899000,"latestFiling":42432000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-02-29","previousFiling":44267912000,"latestFiling":44267000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":46585556000,"latestFiling":46585000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-02-28","previousFiling":30607755000,"latestFiling":30607000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-02-28","previousFiling":30945588000,"latestFiling":30945000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-02-29","previousFiling":31378383000,"latestFiling":31378000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-02-28","previousFiling":32600040000,"latestFiling":32600000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
ichibanya: 本文の金額 8 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 重要な後発事象は、連結財務諸表・財務諸表のいずれの注記でも「該当事項はありません」と印字されている。重要な契約等についても構造に関わる事項の印字はなく、needsReview は付けていない。
- businessModel: 前期有報との修正再表示チェックの差異はすべて、経営指標等の注記4（第44期より金額の表示単位を千円単位から百万円単位に変更し、第43期以前も百万円単位に変更した）に伴う端数差であり、実質的な差異はない。注記3の企業結合に係る暫定的な会計処理の確定（第42期の指標への反映）は financialNotes に書いた。表示単位の変更自体は表示方法の変更としてここに記録する。
- businessModel: 経営成績の分析に印字された中間の利益の金額や、減損損失・固定資産除却損の金額と理由は本文に書いていない。本文の財務数値は連結売上高と親会社株主に帰属する当期純利益だけである。
- businessModel: 長期ビジョン2030及び第8次中期経営計画の目標数値（店舗数・金額・比率）は将来に関する事項のため本文に転記していない。
- businessModel: 当社は2024年3月1日付で普通株式1株につき5株の割合で株式分割を行っており、経営指標等の株式数に関する指標は第40期の期首に当該分割が行われたと仮定して算定されている（注記2）。当期中の完了事項としてここに記録する。
- businessModel: 株式会社GAKU（2025年12月に株式取得）の企業結合については暫定的な会計処理が行われている旨が印字されている。当期中の取得で期末の構造に反映済みのため、needsReview には入れていない。
- businessModel: wikipedia.json は記事「壱番屋」が見つかったが、抜粋は有報の印字内容の範囲にとどまるため、出典には加えていない。
- businessStructure: 当社グループは単一セグメントのため、セグメント情報の記載は省略されている。事業部門別の金額は、経営成績の分析における販売実績（事業部門別）の印字を用いた。
- businessStructure: カレー事業の販売実績の内訳（直営店売上高19,696百万円、FC向売上高39,243百万円、その他の収入1,091百万円）の合計は、小計60,031百万円と1百万円の端数差がある（有報の印字どおり）。
- businessStructure: 海外店舗数は経営成績の分析に218店と印字されている（2026年2月期）。連結子会社14社及び関連会社2社でグループを構成する。
- history: 沿革に印字された資本金の額は本文に書いていない。店舗の新設・工場の竣工等の個別の行は選別して記載し、すべての行を転記してはいない。
- history: 株式会社GAKUの取得（2025年12月）と壱番屋国際台湾株式会社の設立（2025年4月）は当連結会計年度中の完了事項で、2026年2月末時点の構造に反映されているため needsReview には入れていない。
- industry: 飲食店の経営は閉じたリストの food（食品・飲食）に当たる。単一セグメント（飲食事業及びこれらの付帯業務）のため副業種は付けていない。
- relatedCompanies: セントラルフォレストグループ（7675）は、保有目的が純投資目的以外の投資株式の唯一の銘柄だが、保有目的の印字は「取引関係の維持・強化」という定型文のみで、個別の提携・取引内容の印字がないため関連付けていない。
- relatedCompanies: 株式会社エージーピー（9377）は、2020年10月に植物工場の事業譲受を受けた相手として沿革に印字されているが、候補リスト上はコードリストにない会社とされており、現在の資本関係・提携関係の印字もないため関連付けていない。事業譲受の事実は沿革側の選別対象とした。
- relatedCompanies: vision、base-4481、en、path、freee、port、land、trust、arata の各候補は、「長期ビジョン」「全店ベース」「エンターテイメント」「パスタ」「CO2フリー」「サポート」「ブランド」「信託口」「あらためて」等の一般語・部分一致であり、会社としての関係の印字がないため関連付けていない。
- relatedCompanies: 当社グループの連結子会社14社及び関連会社2社は、グループの会社であるため関連企業には含めていない。
- terms: 助言: 用語「ブルームシステム（BS）」は、社員の独立を支援するのれん分け制度の同社における呼び方で、沿革に印字されている。
- terms: 助言: 用語「QSC」は、飲食店の基本として品質・サービス・清潔さを指す業界用語で、経営方針の対処すべき課題に印字されている。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
