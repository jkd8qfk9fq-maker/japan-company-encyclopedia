# 三ッ星 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社三ッ星 |
| 証券コード | 5820 |
| docID（データを取り出した文書） | `S100YG3G` |
| 原本 docID | `S100YG3G` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG3G.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社三ッ星 / 5820 / docID S100YG3G（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
mitsuboshi: 10 件の数値を有報XBRLと照合
有報: 株式会社三ッ星 有価証券報告書－第81期(2025/04/01－2026/03/31) (docID S100YG3G)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":10876358000,"latestFiling":10875060000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":168237000,"latestFiling":215541000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":106987000,"latestFiling":154885000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":12702046000,"latestFiling":12728362000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":6614138000,"latestFiling":6663340000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 前期の窓に 訂正有価証券報告書－第80期(2024/04/01－2025/03/31) がある。過年度の修正再表示の可能性があるため内容を確認すること
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
mitsuboshi: 本文の金額 12 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報の当初値と当期有報の第80期の値の差異は、連結経営指標等の注記が示す決算訂正の反映によるものとして financialNotes に記録した。値は当期有報のものを登録している。
- businessModel: 自社の株式分割（2023年4月21日付、普通株式1株につき3株）については、指標注記の全文をここに記録する: 「当社は、2023年４月21日付で普通株式１株につき３株の割合で株式分割を行っております。第77期の期首に当該株式分割が行われたと仮定して１株当たり純資産額、１株当たり当期純利益又は１株当たり当期純損失（△）を算定しております。」株式分割自体は needsReview にも記録した。
- businessModel: 本文に財務諸表の組替えの記載がある旨の注意については、連結経営指標等の数値の差異が決算訂正の注記で説明されているため、組替えを理由とする financialNote は置かなかった。
- businessModel: MD&Aに印字された中長期的な経営目標の指標は、本文の規則により perspectives や本文には書かなかった。
- businessModel: 重要な後発事象は連結・個別とも該当事項なしと印字されているため、後発事象に関する needsReview は置かなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順（電線8,349百万円、ポリマテック2,490百万円、電熱線888百万円）とした。切り捨て後の3事業の合計は11,727百万円で、印字の連結売上高11,728百万円と1百万円異なるが、千円単位では合計が一致するため印字どおりとした。
- businessStructure: 電線の子区分の切り捨て後の合計は8,348百万円で電線の外部売上高8,349百万円と1百万円異なり、ポリマテックの子区分の合計は2,489百万円でポリマテックの外部売上高2,490百万円と1百万円異なる。いずれも千円単位の切り捨てによる差であり、印字どおりとした。
- businessStructure: suppliers はこのツリーの旧スキーマに従い省略した。主な原材料は銅、ニッケルなどであり、個別の仕入先名は本文に印字されていない。
- businessStructure: 設備と事業の対応は有報のセグメント欄どおりとした。滋賀工場は電線、羽曳野工場はポリマテック、シルバー鋼機の本庄工場は電熱線、河南伸銅所は電線である。本社及び大阪支店と東京支店は複数セグメントの連記行のため、どの事業にも結びつけなかった。帳簿価額は書いていない。
- history: 沿革から落とした行: 支店・出張所・営業所の開設と移転、本社新社屋の竣工、工場の廃止、ビニル電線や硬質異形押出製品など個別品目の製造開始、防水工事の許可、ISO認証の取得、技術開発センターの開設などは、事業の転機として選んだ行以外は落とした。
- history: 設立時の資本金の金額は history には書いていない（資本の金額は書かない規則による）。
- history: Wikipediaの記事「三ッ星」はキャブタイヤケーブル製造販売のメーカーである旨の冒頭にとどまり、有報にない補足はなかったため使わなかった。
- industry: 主たる業界は、売上高の最大区分である電線事業（2026年3月期の外部顧客への売上高8,349百万円）がゴム電線やプラスチック電線の製造販売であることから electronics とした。閉じた分類に直接合うため taxonomyGaps は記録していない。ポリマテック事業と電熱線事業に独立した業界は付けなかった。
- relatedCompanies: 泉州電業株式会社への売上高の金額は relatedCompanies の説明には書いていない（金額は書かない規則による）。同社は特定投資株式としても保有されているが、結んだ根拠は主要な顧客としての印字である。
- relatedCompanies: bunka-shutter（文化シヤッター株式会社）、wakita-and-co（株式会社ワキタ）: 特定投資株式として保有するが、保有目的は全銘柄に共通する定型句であり、本文に個別の取引の記述がないため結ばなかった。
- relatedCompanies: en、base-4481、kel、corona、kohsoku、seki、will、career、daiwa、japan-securities-finance: 社名の一部や一般語の一致による機械抽出であり、有報がその相手について取引・提携・資本関係を述べていないため結ばなかった。nissin はコードリストにない相手であり、文脈も新株予約権に関するものであるため結ばなかった。
- relatedCompanies: 株式会社LIXIL: 特定投資株式として印字されるが、関連企業候補に含まれていないため結ばなかった。
- relatedCompanies: 連結子会社5社は自社の子会社であるため relatedCompanies には含めていない。関係会社の状況に印字されたシルバー鋼機株式会社、MITSUBOSHI PHILIPPINES CORPORATION、株式会社河南伸銅所、エムシーレフィラ株式会社などがこれに当たる。
- terms: 助言のみ。用語としては「キャブタイヤケーブル」「架橋ポリエチレンケーブル」「異形押出」「電熱線」などが候補だが、本工程ではデータを持たないため空とした。

## 要確認（status に反映）

- businessModel: 自社の株式分割：主要な経営指標等の推移の注記に、2023年４月21日付で普通株式１株につき３株の割合で株式分割を行った旨が記載されています。自社の株式分割の取扱いには人の確認が必要です。
- businessModel: 第80期の決算訂正を反映した前期値：第80期（2025年３月期）の数値は決算訂正を反映した数値となっており、訂正後の有価証券報告書が2025年10月23日に提出されています。前期有報の当初値と当期有報の第80期の値が売上高や親会社株主に帰属する当期純利益などで異なりますが、登録は当期有報の訂正反映後の値で行っています。訂正を反映した前期値の取扱いには人の確認が必要です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
