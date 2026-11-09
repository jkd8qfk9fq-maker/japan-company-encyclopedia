# 小林製薬 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 小林製薬株式会社 |
| 証券コード | 4967 |
| docID（データを取り出した文書） | `S100XSXS` |
| 原本 docID | `S100XSXS` |
| 提出日（原本） | 2026-03-25 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XSXS.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 小林製薬株式会社 / 4967 / docID S100XSXS（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 12 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
kobayashi-pharmaceutical: 10 件の数値を有報XBRLと照合
有報: 小林製薬株式会社 有価証券報告書－第108期(2025/01/01－2025/12/31) (docID S100XSXS)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
kobayashi-pharmaceutical: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで重複年度は全行一致しました。
- businessModel: 2025年12月期の当期純利益の減少には、仙台新工場及びタイ工場の減損損失の計上がありますが、特別損失の金額は本文の規則により書きませんでした。
- businessModel: 自社通販サイト及びコールセンターを通じた製品の販売は2025年12月末をもって終了しました。
- businessStructure: 当社グループは、当社及び子会社37社により構成されています。
- businessStructure: 国内事業と国際事業の売上高は、セグメント注記の外部顧客への売上高の順に並べました。その他は報告セグメントに含まれないため最後にしました。
- history: 沿革の表は、2009年から2015年までと2016年から2025年までの2か所で年月と事象が分離して印字されていました。年月と事象の数が同じため、行順で対応づけました。
- history: 1886年の創業は、前身である合名会社小林盛大堂の創業です。
- industry: 主たる業界は医薬品としました。国内事業のヘルスケア製品の売上が日用品を上回り、一般用医薬品が事業の中核のためです。日用品の事業があるため、化学を2つ目としました。
- relatedCompanies: 株式会社PALTAC：2025年12月期の主要な顧客（売上高65,860百万円、連結売上高の39.7％）だが、related-candidates.json にないため結ばない。
- relatedCompanies: エーザイ、小野薬品工業、参天製薬、武田薬品工業、アステラス製薬、味の素、アサヒグループホールディングス、カルビー、ライオン、資生堂、大塚ホールディングス、ツムラ、ロート製薬、ユニ・チャーム、ゼリア新薬工業、カゴメ、花王、エステー、アース製薬、ニデック、コマツ、三菱ケミカルグループ、T＆Dホールディングス：各100株のみの保有で、保有目的が株主総会出席のためだけのため結ばない。
- relatedCompanies: 三菱ＵＦＪフィナンシャル・グループ、みずほフィナンシャルグループ、三井住友フィナンシャルグループ、野村ホールディングス：預金・証券等の取引のみの金融機関のため結ばない。
- relatedCompanies: 三菱商事：2012年の小林メディカル株式の譲渡は過去1回限りの取引のため結ばない。沿革に記載した。
- relatedCompanies: カナデビア：2002年の健康食品事業の営業権譲受は過去1回限りの取引のため結ばない。
- relatedCompanies: メディパルホールディングス：2008年の株式交換は過去の出来事のため結ばない。沿革に記載した。
- relatedCompanies: 扶桑薬品工業、マンダム、プラネット：保有目的が協力関係の維持などの定型句のみで、個別の取引の記載がないため結ばない。
- relatedCompanies: エンチョー、久光製薬、日新、トラスト：コードリストにないため結ばない。
- relatedCompanies: フジ：社名「フジ」が曖昧なため結ばない。
- relatedCompanies: ポート、ランド、キャリア、ゼロ、大和、ビジョン、パス、ベース、コア、フリー、セキ、キング、スローガン、リックス、ガーデン、ミサワ、レイ、日本航空、京セラ：社名の断片一致のみで、有報がその相手について述べる取引・提携・資本関係がないため結ばない。
- relatedCompanies: 連結子会社37社はすべて非上場のため結ばない。
- relatedCompanies: 大株主は個人・財団・信託銀行・ファンドのため、事業会社の大株主として結べる相手はない。

## 要確認（status に反映）

- businessModel: 紅麹関連製品に関する事案について、健康被害にあわれたお客様及び損害を受けられた企業への補償対応を進めており、2024年9月に公表した再発防止策を実行中です。
- businessStructure: 紅麹関連製品に関する事案について、健康被害にあわれたお客様及び損害を受けられた企業への補償対応を進めており、2024年9月に公表した再発防止策を実行中です。
- history: 紅麹関連製品に関する事案について、健康被害にあわれたお客様及び損害を受けられた企業への補償対応を進めており、2024年9月に公表した再発防止策を実行中です。
- industry: 紅麹関連製品に関する事案について、健康被害にあわれたお客様及び損害を受けられた企業への補償対応を進めており、2024年9月に公表した再発防止策を実行中です。
- relatedCompanies: 紅麹関連製品に関する事案について、健康被害にあわれたお客様及び損害を受けられた企業への補償対応を進めており、2024年9月に公表した再発防止策を実行中です。
- terms: 紅麹関連製品に関する事案について、健康被害にあわれたお客様及び損害を受けられた企業への補償対応を進めており、2024年9月に公表した再発防止策を実行中です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
