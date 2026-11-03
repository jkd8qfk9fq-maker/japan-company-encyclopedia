# 東海理化 — research log

Registered: 2026-11-03（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社東海理化電機製作所 |
| 証券コード | 6995 |
| docID（データを取り出した文書） | `S100Z2Z0` |
| 原本 docID | `S100Y9M2` |
| 提出日（原本） | 2026-06-09 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | S100Z2Z0／有効文書 S100Z2Z0（2026-11-02 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z2Z0.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社東海理化電機製作所 / 6995 / docID S100Y9M2（id は英語表記「TOKAI RIKA CO.,LTD.」から） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokai-rika: 10 件の数値を有報XBRLと照合
有報: 株式会社東海理化電機製作所 訂正有価証券報告書－第79期(2025/04/01－2026/03/31) (docID S100Z2Z0)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":487303000000,"latestFiling":487243000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":553124000000,"latestFiling":553379000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":623558000000,"latestFiling":623363000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":3569000000,"latestFiling":2981000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":10900000000,"latestFiling":10381000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":24850000000,"latestFiling":24824000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":27808000000,"latestFiling":26047000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":15557000000,"latestFiling":15355000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":24063000000,"latestFiling":24430000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":39592000000,"latestFiling":39491000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":34479000000,"latestFiling":34310000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":447834000000,"latestFiling":447332000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":456146000000,"latestFiling":455659000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":519718000000,"latestFiling":519495000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":510942000000,"latestFiling":510894000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":285538000000,"latestFiling":279827000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":296401000000,"latestFiling":290155000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":339488000000,"latestFiling":333261000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":337877000000,"latestFiling":329699000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 訂正有価証券報告書（訂正有価証券報告書－第79期(2025/04/01－2026/03/31)、docID S100Z2Z0）を有効文書としてこのパックを作った。原本は docID S100Y9M2。原本と主要財務（5系列・従業員数）は同一
注意: 訂正有報の分類: text-change — 数値は同一だが本文が原本と異なる（ShareholdingsTextBlock）。本文は有効文書から書くこと。原本の記述が混ざっていないか確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tokai-rika: 本文の金額 23 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 最上位の description を businessModel 工程でも書いた（businessStructure と同文）。
- businessModel: 連結子会社37社は国内10社と海外27社の合計、持分法適用関連会社5社は国内2社と海外3社の合計（事業の内容の印字による）。
- businessModel: トヨタ自動車㈱への売上高は、売上先別の表（139,286百万円、21.6％）と、グループ向け（478,831百万円）を区別して書いた。
- businessModel: 営業利益・経常利益・セグメント利益は書いていない。
- businessStructure: この工程は「description」を書けません（担当は businesses, name, shortNameEn, listings）— 無視しました
- businessStructure: 報告セグメントは地域別（日本・北米・アジア）のため、製品別の売上高は地域に結びつけず、businessModel の売上源にまとめた。
- businessStructure: 並びは2026年3月期の外部顧客への売上高の大きい順。「その他」は報告セグメントに含まれないため最後。
- businessStructure: セグメント利益・営業利益は本文に書いていない。
- history: 沿革は表が正常に読めたため、年月と事象は印字どおりに対応づけた。
- history: 2025年11月の出来事は事業年度末(2026年3月)より前で、完了した事実として書いた。
- industry: 全セグメントが自動車用部品の製造・販売のため automotive のみ。半導体などの2つ目は付けない。
- relatedCompanies: related-candidates.json が証拠パックに無かったため、掲載済みの企業ファイル（toyota, toyota-tsusho）の存在で同一性を確認した。
- relatedCompanies: 豊田自動織機・トヨタ紡織: 有報本文に社名が見つからず、結ばない（沿革の「豊田紡織株式会社」はタイシートベルトの合弁相手で、現在のトヨタ紡織との同一性が印字されていない）。
- relatedCompanies: デンソー: 退職給付信託として保有するみなし保有株式と、売却した政策保有株式の表に載るだけで取引関係の記載がなく、結ばない。
- relatedCompanies: SUBARU・スズキ・フォード: 販売先として金額は載るが、フォードは上場企業としての同定が無く、SUBARU・スズキは掲載済みか未確認のため、結ばない。
- relatedCompanies: 子会社・関連会社は掲載済みの上場企業ではないため結ばない。
- terms: 助言: 「HMI（ヒューマン・マシン・インターフェース）」は主力製品の区分名で、読者に説明が要る。用語集に無ければ追加を検討。
- terms: 助言: 「スマートシステム」「デジタルキー」も同様。有報に定義文が無いため、用語として書く場合は別の根拠が要る。

## 要確認（status に反映）

- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: financialNotes の年度「undefined」が5年表にありません
- businessModel: 過去5期のうち2022年3月期〜2025年3月期の売上高・当期純利益が前期有報の印字と異なる。2026年5月15日に第74期〜第78期の訂正報告書が出ているが、訂正の理由は証拠パックの本文からは確認できなかった。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
