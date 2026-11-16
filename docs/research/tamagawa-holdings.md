# 多摩川ホールディングス — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社多摩川ホールディングス |
| 証券コード | 6838 |
| docID（データを取り出した文書） | `S100XHR9` |
| 原本 docID | `S100XHR9` |
| 提出日（原本） | 2026-01-28 |
| 決算期 | 2025-10-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XHR9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社多摩川ホールディングス / 6838 / docID S100XHR9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 2 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tamagawa-holdings: 10 件の数値を有報XBRLと照合
有報: 株式会社多摩川ホールディングス 有価証券報告書－第58期(2024/11/01－2025/10/31) (docID S100XHR9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 変則決算: 2024-10 の期は 7 か月。決算期の変更による移行期間で、他の年と期間の長さが違う。人が financials の note にその旨を書くまで登録しないこと
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tamagawa-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 財務諸表の組替えについて、主要経営指標の前期の有報との照合では売上高、純利益、総資産、自己資本、従業員数などの6つの系列すべてに差異がなかったため、金額の修正を伴う組替えとは判断せず、本文にも書きませんでした。
- businessModel: 重要な後発事象の新株予約権（Cantor Fitzgerald Europeを割当先とする第15回、第16回、第17回新株予約権の第三者割当。2025年12月4日の取締役会決議、2025年12月26日に払込完了、提出日現在で未行使）は、提出後の資本政策の事項としてここに記録し、needsReviewには入れませんでした。
- businessModel: 継続企業の前提に関する重要事象等は、2023年3月期から2024年10月期にかけて存在しましたが、2025年10月期に黒字へ転じたことから当連結会計年度末で解消したと有報が判断しているため、needsReviewには入れませんでした。
- businessModel: 第55期から第57期は当期純損失のため希薄化後1株当たり情報が開示されていませんが、表示の事項としてここに記録するだけにしました。
- businessModel: セグメントの金額は外部顧客への売上高だけを用い、内部売上高を含む金額は書いていません。2セグメントの外部売上高の合計5,587百万円は連結売上高と一致します。
- businessStructure: セグメントの金額はセグメント間内部売上高を含まない外部顧客への売上高だけを用いました。内部売上高を含む金額は書いていません。
- businessStructure: 親会社の本社は統括業務施設で、設備の状況でも特定のセグメントに結び付けられていないため、どの事業にも結び付けませんでした。親会社が保有する太陽光発電所の土地はグループ外へ賃貸しているもので、事業の説明には含めていません。
- businessStructure: 設備の状況では一部の発電所のセグメント欄が「再エネ発電所事業」と印字されていますが、報告セグメントの名称である「再生可能エネルギー事業」にそろえました。
- history: 沿革の2022年4月の東京証券取引所スタンダード市場への移行の行は、市場再編に伴う機械的な市場区分の変更のため落とし、ここに記録しました。
- history: 沿革の年月は年だけを year に入れ、月は書いていません。
- industry: 主たる業界は electronics としました。電子・通信用機器事業が売上高の約9割を占め、高周波電子部品や光伝送装置などの電子機器の開発、製造、販売が中核であるため、閉じた分類の中で直接に合います。暫定分類ではないため taxonomyGaps は付けていません。
- industry: 副たる業界は energy としました。再生可能エネルギー事業は報告セグメントとして金額が開示されており、太陽光・風力発電所の売電と発電所の開発、譲渡を行っています。
- industry: 自らは通信サービスを行っていないため、telecommunications は付けていません。
- relatedCompanies: 株式会社東芝：セグメント情報の主要な顧客ごとの情報に電子・通信用機器事業の顧客として載り、2025年10月期の売上高に占める割合は15.3％ですが、related-candidates.json に候補がないため結ばず、ここに記録しました。
- relatedCompanies: 日清紡ホールディングス株式会社（nisshinbo-holdings）：提出会社の特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、その相手についての取引の記載がないため結びませんでした。
- relatedCompanies: 株式会社りそなホールディングス（resona-holdings）：提出会社の特定投資株式に載りますが、保有目的は全銘柄共通の定型句のみで、銀行でもあるため結びませんでした。
- relatedCompanies: 大株主の状況に載る相手は保管機関や個人、証券会社などで、候補にある事業会社はありませんでした。
- relatedCompanies: 連結子会社18社は自らの子会社のため結びませんでした。TMY Technology Inc.は出資先ですが候補にありません。
- relatedCompanies: en、nissin、base-4481、career、space、core、cover、kohsoku、suzuki-6785、zero は一般語や部分一致であり、その相手との関係の記載はありません。
- terms: 助言のみ。用語の候補としては「アッテネータ」「周波数シンセサイザ」「ミリ波」「系統用蓄電所」「小形風力発電」「固定価格買取制度」などが挙げられますが、本工程ではデータを持ちません。

## 要確認（status に反映）

- businessModel: 決算期変更と変則決算：2024年10月21日の臨時株主総会の決議により決算期を3月31日から10月31日に変更し、第57期（2024年10月期）は2024年4月1日から10月31日までの7か月間の変則決算となりました。登録は第58期（2025年10月期）の期末時点の構造で行っています。
- 財務: 変則決算。2024-10 の期は 7 か月。他の年と期間の長さが違うので、businessModel の data.financialNotes にその旨を書くこと

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
