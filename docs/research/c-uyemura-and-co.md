# 上村工業 — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 上村工業株式会社 |
| 証券コード | 4966 |
| docID（データを取り出した文書） | `S100YIOW` |
| 原本 docID | `S100YIOW` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YIOW.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 上村工業株式会社 / 4966 / docID S100YIOW（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
c-uyemura-and-co: 10 件の数値を有報XBRLと照合
有報: 上村工業株式会社 有価証券報告書－第98期(2025/04/01－2026/03/31) (docID S100YIOW)
前期有報との差異（修正再表示の可能性・要記録）: [{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2022-03-31","previousFiling":72303623000,"latestFiling":72303000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2023-03-31","previousFiling":85749416000,"latestFiling":85749000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2024-03-31","previousFiling":80256031000,"latestFiling":80256000000},{"key":"jpcrp_cor:NetSalesSummaryOfBusinessResults|2025-03-31","previousFiling":83845427000,"latestFiling":83845000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2022-03-31","previousFiling":9681594000,"latestFiling":9681000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2023-03-31","previousFiling":10545507000,"latestFiling":10545000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2024-03-31","previousFiling":10920792000,"latestFiling":10920000000},{"key":"jpcrp_cor:ProfitLossAttributableToOwnersOfParentSummaryOfBusinessResults|2025-03-31","previousFiling":14078236000,"latestFiling":14078000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2022-03-31","previousFiling":14606115000,"latestFiling":14606000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2023-03-31","previousFiling":15832547000,"latestFiling":15832000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2024-03-31","previousFiling":15871562000,"latestFiling":15871000000},{"key":"OrdinaryIncomeLossSummaryOfBusinessResults|2025-03-31","previousFiling":20041345000,"latestFiling":20041000000},{"key":"TotalAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":101189162000,"latestFiling":101189000000},{"key":"TotalAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":107267707000,"latestFiling":107267000000},{"key":"TotalAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":118174840000,"latestFiling":118174000000},{"key":"TotalAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":130589127000,"latestFiling":130589000000},{"key":"NetAssetsSummaryOfBusinessResults|2022-03-31","previousFiling":78712311000,"latestFiling":78712000000},{"key":"NetAssetsSummaryOfBusinessResults|2023-03-31","previousFiling":84364303000,"latestFiling":84364000000},{"key":"NetAssetsSummaryOfBusinessResults|2024-03-31","previousFiling":92713748000,"latestFiling":92713000000},{"key":"NetAssetsSummaryOfBusinessResults|2025-03-31","previousFiling":106119189000,"latestFiling":106119000000}]
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
c-uyemura-and-co: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 前期有報との修正再表示チェックで売上高・純利益等に差異が出たが、いずれも1百万円未満の差であり、連結経営指標等の注記2にあるとおり第98期から金額の表示単位を千円単位から百万円単位に変更し過去分も百万円単位に換えたことに伴う丸めである。誤謬の訂正ではないため financialNotes には入れず、登録は当期有報の印字どおりの数値で行う。
- businessModel: 連結キャッシュ・フロー計算書で「契約負債の増減額」を独立掲記した表示方法の変更（前期分の組替え）は表示上の変更のみで5年指標に影響しないため、financialNotes ではなく warnings に記録した。
- businessModel: 経営指標の目標として掲げられたROE10％以上・1株当たり配当金200円以上の維持は、投資指標にあたる数値のため本文・要約には書かず warnings に記録した。
- businessModel: 表面処理用資材事業の減損損失1,476百万円は、本文の財務数値を売上高と当期純利益に限る規則のため本文に書かなかった。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした。MD&Aのセグメント別売上高（資材77,661百万円など）はセグメント間の内部売上高を含むため使わず、セグメント注記の外部顧客への売上高を用いた。
- businessStructure: 外部顧客への売上高の内訳合計（77,658＋8,406＋4,829＋860＝91,753百万円）は印字の報告セグメント計91,754百万円と1百万円、その他29百万円を加えた合計も連結売上高91,784百万円と1百万円異なるが、いずれも印字表内の丸めであり、印字の数値をそのまま引用した。
- businessStructure: 製品区分ごとの金額は独立して開示されていないため、子区分には金額を書かなかった。
- businessStructure: 表面処理用資材事業に計上された減損損失1,476百万円は、本文の財務数値を売上高と当期純利益に限る規則のため本文に書かなかった。
- history: 沿革は印字された全行のうち、営業所・支店の設置や移転、工場の閉鎖などの細目を省き、事業の転機となる25件を選んだ。年月は行の印字どおりで、崩れた表ではないため行順の対応づけは不要だった。
- history: 設立時の資本金額は沿革に印字されていないため書かなかった。
- industry: 主たる業界は chemicals とした。連結売上高の8割以上を占める表面処理用資材事業はめっき用化学品の製造販売が中心であり、閉じた分類に表面処理・めっきの独立した値はなく、最も近い chemicals を当てた。
- industry: semiconductors を副次に付けた。半導体パッケージ基板向けのめっき薬品が主力製品として事業開示され、表面処理用機械事業では半導体ウェハー用めっき装置を販売しており、半導体向けの部材・装置が事業として開示されているためである。市場環境の文脈だけの言及ではない。
- relatedCompanies: 三菱UFJフィナンシャル・グループ（mitsubishi-ufj-financial-group）: 主要取引金融機関であり、実際の取引相手は傘下の三菱UFJ銀行（銀行本体）で、資金調達等の財務面の取引が保有理由のため結ばなかった。大株主の状況でも株式会社三菱UFJ銀行が4.32％を保有するが、銀行本体であり同様に結ばない。
- relatedCompanies: 新家工業（araya-industrial）: 2025年3月期に事業での取引関係がなくなり、保有目的が純投資目的に変更されたことが印字されているため結ばなかった。
- relatedCompanies: 曙ブレーキ工業: 特定投資株式に表面処理用資材事業での取引を理由として載るが、related-candidates.json に含まれないため結ばなかった。
- relatedCompanies: ランド（land）・ケル（kel）・フリー（freee）・フレンドリー（friendly）・ゼロ（zero）・ベース（base-4481）・セキ（seki）・コア（core）: いずれも一般語や部分一致による抽出で、当該会社との取引・提携・資本関係の印字がないため結ばなかった。
- relatedCompanies: トラスト（trust）: 大株主の状況に現れる日本マスタートラスト信託銀行（信託口）は信託口座名義であり、株式会社トラストとは別の法人のため結ばなかった。
- relatedCompanies: 大株主の浪花殖産株式会社（28.29％）は非上場で候補に含まれず、上村共栄会・個人株主・信託銀行・資産運用会社は事業会社でないため結ばなかった。
- relatedCompanies: 取引・提携の向きが印字されている資材調達先3社は supplier とし、向きが印字されず「表面処理用資材事業で取引があり」とだけある5社は business-partner とした。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 用語は助言的な候補として2件を提案した。いずれも有報本文に固有の技術・製品名として現れる語である。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
