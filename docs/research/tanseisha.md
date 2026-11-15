# 丹青社 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社丹青社 |
| 証券コード | 9743 |
| docID（データを取り出した文書） | `S100Y04L` |
| 原本 docID | `S100Y04L` |
| 提出日（原本） | 2026-04-22 |
| 決算期 | 2026-01-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Y04L.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社丹青社 / 9743 / docID S100Y04L（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 23 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tanseisha: 10 件の数値を有報XBRLと照合
有報: 株式会社丹青社 有価証券報告書－第68期(2025/02/01－2026/01/31) (docID S100Y04L)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-01-31","previousFiling":62714360000,"latestFiling":62714000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-01-31","previousFiling":64221452000,"latestFiling":64221000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-01-31","previousFiling":81200945000,"latestFiling":81200000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-01-31","previousFiling":91858442000,"latestFiling":91858000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-01-31","previousFiling":1434618000,"latestFiling":1434000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-01-31","previousFiling":459763000,"latestFiling":459000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-01-31","previousFiling":2771111000,"latestFiling":2771000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-01-31","previousFiling":3875520000,"latestFiling":3875000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-01-31","previousFiling":2209629000,"latestFiling":2209000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-01-31","previousFiling":793880000,"latestFiling":793000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-01-31","previousFiling":3995137000,"latestFiling":3995000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-01-31","previousFiling":5316536000,"latestFiling":5316000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-01-31","previousFiling":45244932000,"latestFiling":45244000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-01-31","previousFiling":41858043000,"latestFiling":41858000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-01-31","previousFiling":50651905000,"latestFiling":50651000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-01-31","previousFiling":54195724000,"latestFiling":54195000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-01-31","previousFiling":29059038000,"latestFiling":29059000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-01-31","previousFiling":29414299000,"latestFiling":29414000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-01-31","previousFiling":31626744000,"latestFiling":31626000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-01-31","previousFiling":33370772000,"latestFiling":33370000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tanseisha: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックの差異は、いずれも百万円未満の端数の差である。第68期から金額の表示単位が千円単位から百万円単位に変更され、第64期から第67期についても百万円単位に変更して表示されているためであり、表示単位の変更によるものと判断してfinancialNotesには記載していない（主要な経営指標等の注記）。
- businessModel: 収益認識に関する会計基準等の適用（第65期の期首から）は、主要な経営指標等の注記に基づきfinancialNotesに記録した。
- businessModel: 報告セグメント3区分の外部顧客への売上高の単純合計は106,702百万円で、印字された小計106,703百万円と1百万円の差がある（有報の丸め）。全体の数値は印字された連結売上高107,222百万円を用いた。
- businessModel: セグメント利益・損失の金額と増減率、受注高・手持工事高の金額は、規則により本文に記載していない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とし、報告セグメントに含まれない「その他」を最後に置いた。各事業の子区分は金額が独立して開示されていないため、金額を記載していない。
- history: 沿革の末尾は、年月セル（2016年4月・2022年4月・2025年4月）と事象文が分かれて印字される崩れた表である。年月の数と事象の数がともに3つで一致するため、行順に対応づけた。
- history: 1959年の設立行に印字された資本金額は、規則により記載していない。沿革冒頭の前文（1949年に三光株式会社として設立された会社が母体で、商号変更を経て1978年に被合併会社の営業を全面的に承継した経緯）は年月表ではないため、1978年の吸収合併の事象に要約して含めた。
- history: 2003年に設立した丹青創藝設計咨詢（上海）有限公司は、当期の【関係会社の状況】には記載がない。沿革の印字どおり転記し、当時の連結子会社と明記した。
- industry: 主たる事業は商業施設・文化施設の内装や展示の調査、企画、設計、施工、監理であり、建設業者登録（大臣登録）と一級建築士事務所登録を持ち施工を中核とするため、construction を主たる業界とした。閉じた分類にディスプレイ業の値はないが、施工を中核とする実態は建設で表せるため、taxonomyGaps には挙げていない。その他区分の労働者派遣、事務機器等のレンタル・販売、情報提供サービスは金額が小さく他の区分と混在するため、業界は追加していない。
- relatedCompanies: 住友不動産（300,000株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: オカムラ（209,000株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: J.フロントリテイリング（22,994株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: 京浜急行電鉄（33,856株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: オリエンタルランド（10,119株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: 三越伊勢丹ホールディングス（10,000株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: キヤノンマーケティングジャパン（3,400株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: 京成電鉄（15,000株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: 電通グループ（4,976株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: 乃村工藝社（8,580株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: 小田急電鉄（3,530株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: アサヒグループホールディングス（3,000株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: スペース（2,530株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: キリンホールディングス（1,000株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: インターライフホールディングス（1,500株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: ラックランド（100株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: テー・オー・ダブリュー（400株）: 特定投資株式として株式を保有しているが、保有目的は全銘柄に共通の定型句「ディスプレイ関連事業の取引の安定的、長期的な維持・強化のため」のみで、個別の取引・提携の事実の印字がないため結ばない。
- relatedCompanies: 三菱UFJフィナンシャル・グループ: 特定投資株式の保有目的が「安定的な銀行取引の関係強化のため」であり、金融機関との銀行取引は関係として結ばない。変更報告書に基づく共同保有は、当社が2026年1月31日現在の実質所有を確認できないとして大株主の状況に含まれておらず、結ばない。
- relatedCompanies: 三井住友フィナンシャルグループ: 特定投資株式の保有目的が「安定的な銀行取引の関係強化のため」であり、金融機関との銀行取引は関係として結ばない。
- relatedCompanies: 第一生命ホールディングスは候補に含まれていないが、特定投資株式の保有目的が「安定的な生命保険取引の関係強化のため」であり、保険取引は関係として結ばない。
- relatedCompanies: レイ、キャリア、ベース、ポート、ビジョン、パス、リオン、アミューズ、イノベーション、レック、セキ、コア、コロナ: 一般語や部分一致（パビリオン、キャリア開発、ビジョン、コロナ禍等）による機械抽出で、当社との関係を示す印字がないため結ばない。
- relatedCompanies: トラスト、日新: コードリストにない相手（信託口の表記への一致、毎日新聞社の部分一致）で、結ばない。
- relatedCompanies: 連結子会社6社（丹青TDC、丹青ディスプレイ、丹青ビジネス、丹青研究所、JDN、丹青ヒューマネット）はいずれも有価証券報告書の提出会社ではなく、候補に含まれないため結ばない。各社との関係は【事業の内容】【関係会社の状況】に基づきbusinessStructureに記載した。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
