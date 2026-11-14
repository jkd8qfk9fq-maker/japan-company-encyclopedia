# オカムラ食品工業 — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社オカムラ食品工業 |
| 証券コード | 2938 |
| docID（データを取り出した文書） | `S100Z3GH` |
| 原本 docID | `S100Z3GH` |
| 提出日（原本） | 2026-09-24 |
| 決算期 | 2026-06-30 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z3GH.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社オカムラ食品工業 / 2938 / docID S100Z3GH（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
okamura-foods: 10 件の数値を有報XBRLと照合
有報: 株式会社オカムラ食品工業 有価証券報告書－第56期(2025/07/01－2026/06/30) (docID S100Z3GH)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
okamura-foods: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて有報の百万円印字のまま引用した（千円額の換算・四捨五入はしていない）。
- businessModel: 地域ごとの情報でマレーシアを「その他アジア」から独立掲記した表示方法の変更と前年度の組替は、表示だけの変更のためfinancialNotesではなく本warningsに記録する。
- businessModel: 株式分割（2023年7月29日付で1株を30株、2025年1月1日付で1株を2株、2025年7月1日付で1株を3株）は売上高・純利益の数値に影響しないためfinancialNotesには入れていない。
- businessModel: 前期有報との重複年度は全て一致しており、修正再表示はない。briefの組替に関する注意については、本文で確認できた組替は上記の地域表示の組替のみだった。
- businessModel: セグメント外部売上高の単純合計（42,723百万円）と連結売上高（42,726百万円）の3百万円の差は印字の丸めによるもので、印字どおり引用した。
- businessStructure: 事業の並びは【セグメント情報】の2026年6月期の外部顧客への売上高の大きい順（海外卸売15,271・国内加工10,505・海外加工9,418・養殖7,529百万円）。MD&Aのセグメント売上高は内部売上高を含むため使っていない。
- businessStructure: セグメント外部売上高の単純合計は42,723百万円で、連結売上高42,726百万円と3百万円異なる。有報の印字どおりに各値を引用し、合計との差は印字の丸めによるものとして記録する。
- businessStructure: 養殖事業の子区分（国内・デンマーク）は金額が独立して開示されていないため、金額を書いていない。
- history: 沿革は事実の多い行から主要な出来事を選んだ。設立・子会社設立・買収に資本金の金額は書いていない（禁止される財務金額のため）。
- history: 2026年の第三工場取得は【事業の内容】の国内加工事業の記載（2026年3月に委託加工先の工場を取得）による出来事で、沿革表には載っていない。
- history: Okamura USA Inc.の設立（2014年）と清算（2018年）、Xenka Tradingの買収（2018年）などは紙幅の都合で落とした。Xenka Tradingは現在のマレーシア卸売子会社として事業の内容で触れている。
- industry: 主たる業界は売上の大半を占める水産食品の養殖・加工・卸売であるためfood（食品）とした。閉じた分類に水産業の区分は無いが、食品が実態に合うためtaxonomyGapは出していない。
- relatedCompanies: okamura（株式会社オカムラ、7994）: 大株主の状況に載る株式会社オカムラは代表取締役社長の資産管理会社で非上場であり、候補の上場会社（家具メーカーの株式会社オカムラ）とは別の法人であるため結ばなかった。
- relatedCompanies: procrea-holdings（株式会社プロクレアホールディングス）: 特定投資株式として20,200株を保有するが、保有目的は主要取引金融機関からの資金調達等の円滑化であり、資金調達を理由とする金融機関は結ばないため結ばなかった。
- relatedCompanies: port（ポート株式会社、7047）: 沿革の株式会社ポートは当社の旧子会社（2019年に吸収合併）であり、候補の上場会社とは別の会社であるため結ばなかった。
- relatedCompanies: en、career、step、base-4481、land、cover、imura-and-co、seki、nissin、trust: いずれも「エンジン」「キャリア形成」「ステップアップ」「営業利益ベース」「ブランド」「カバーエリア」「タイムラグ」「セキュリティ」「日新（新株予約権の文脈）」「日本マスタートラスト信託銀行（信託口）」などの一般語や信託口の一致であり、当該上場会社についての取引・提携・資本関係の記載が無いため結ばなかった。
- relatedCompanies: 株式会社みずほ銀行は重要な契約（コミットメントライン契約）の相手方だが、資金調達の契約であり、候補にも無いため結んでいない。
- relatedCompanies: ベトナムのTrung Sonグループは製品加工委託契約の相手方だが上場会社ではなく候補にも無いため結んでいない。グループの子会社・持分法適用関連会社は関連企業リンクの対象外とした。
- terms: 用語の助言: 「ASC認証」（養殖に関する国際認証）、「増肉係数（FCR）」、「バージ船」（自動給餌システムを備えた給餌用船舶）、「区画漁業権」が解説候補。
- terms: 用語の助言: 「有償支給取引」（加工委託先への原料の有償支給）も読者に分かりにくいため解説候補。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
