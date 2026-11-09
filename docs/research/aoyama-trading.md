# 青山商事 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 青山商事株式会社 |
| 証券コード | 8219 |
| docID（データを取り出した文書） | `S100YJ44` |
| 原本 docID | `S100YJ44` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YJ44.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 青山商事株式会社 / 8219 / docID S100YJ44（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 9 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
aoyama-trading: 10 件の数値を有報XBRLと照合
有報: 青山商事株式会社 有価証券報告書－第62期(2025/04/01－2026/03/31) (docID S100YJ44)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":194790000000,"latestFiling":195714000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
aoyama-trading: 本文の金額 14 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 2025年3月期の売上高は、前期有報の194,790百万円から今期有報の195,714百万円に変わっている。理由は第62期の表示方法の変更（店舗用不動産の一部賃貸に係る収入・費用を販売費及び一般管理費の純額計上から売上高・売上原価への計上に変更）による組替えで、financialNotes に記載した。
- businessModel: 2026年3月31日付で連結子会社のWTWを解散したことは、当期中の出来事のため沿革に入れ、needsReview には入れていない。
- businessModel: 2026年4月1日付の1株につき3株の株式分割は1株当たり数値のみのため注記していない。
- businessModel: 中期経営計画の数値目標のうち、連結営業利益と親会社株主に帰属する当期純利益の目標値は文章規則により省き、連結売上高の目標値のみ記載した。
- businessStructure: セグメントの並びは2026年3月期の外部顧客への売上高の大きい順とした。「その他」は報告セグメントに含まれないため最後に置いた。
- businessStructure: ビジネスウェア事業の子ども3行の合計（124,223百万円）とセグメントの売上高（124,224百万円）の1百万円の差は有報の丸めによるもので、印字の金額をそのまま記載した。
- businessStructure: 当連結会計年度より店舗用不動産の一部賃貸に係る収入・費用を売上高・売上原価に計上する方法に変更し、前連結会計年度のセグメント情報も変更後の区分で作成されている。店舗用不動産の一部賃貸の区分も、ビジネスウェア事業から不動産事業へ変更されている。
- businessStructure: 2026年4月1日付の普通株式1株につき3株の株式分割は1株当たり数値のみのため注記していない。
- history: 1990年は本社の福山市への移転と東京証券取引所市場第二部への上場の2件の出来事があるため、1行にまとめた。
- history: 2011年はglobの設立と服良の全株式取得の2件の出来事があるため、1行にまとめた。
- history: 1991年のブルーリバースの設立、1993年の台湾青五の設立、1997年のアスコンの子会社化、2007年の栄商の子会社化、2020年のイーグルリテイリングの解散とSYGの取得、2023年のスーツスクエア1号店の開店、2025年の青山ストーリーの設立は、15件の枠に入らなかったため落とした。
- industry: ビジネスウェア事業が売上高の大半を占めるため、小売を主たる業界とした。カード事業と不動産事業は売上高に占める割合が小さいため、業界は付けていない。
- relatedCompanies: nisshinbo-holdings・toray・the-japan-wool-textile・teijin・toyobo：特定投資株式の保有目的に取引の向き（仕入・販売）の印字がないため、supplier ではなく business-partner とした。
- relatedCompanies: hirogin-holdings：保有目的が地元金融機関としての財務活動の円滑化のみのため、銀行ルールで結ばない。
- relatedCompanies: geo-holdings：有報にセカンドストリートのフランチャイズ契約の印字があるが、related-candidates.json にないため結ばない。
- relatedCompanies: fast-fitness-japan：有報にエニタイムフィットネスのフランチャイズ契約の印字があるが、related-candidates.json の listing が「コードリストにない」ため結ばない。
- relatedCompanies: pisola・nobitel：フランチャイズ契約の相手だが、掲載企業リストになく結ばない。
- relatedCompanies: port・career・en・land・zero・seki・base-4481・como・core・daiwa・ishin・trust・corona・step・max：語の断片一致のみで、取引・提携の印字がないため結ばない。
- relatedCompanies: ntt：eNPS業界別分析レポートの出典としての印字のみで、取引・提携の印字がないため結ばない。
- relatedCompanies: 大株主の状況の信託銀行2行は信託口、株式会社HK・星野商事・青山物産は非上場、青山理は個人、海外の保管機関は結ばない。三井住友DSアセットマネジメントと三井住友銀行の大量保有報告は、会社が実質所有を確認できていないため大株主の状況に含まれておらず、結ばない。
- relatedCompanies: 連結子会社32社はすべて非上場のため結ばない。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
