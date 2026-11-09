# 東京精密 — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社東京精密 |
| 証券コード | 7729 |
| docID（データを取り出した文書） | `S100YEOP` |
| 原本 docID | `S100YEOP` |
| 提出日（原本） | 2026-06-19 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEOP.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社東京精密 / 7729 / docID S100YEOP（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-seimitsu: 10 件の数値を有報XBRLと照合
有報: 株式会社東京精密 有価証券報告書－第103期(2025/04/01－2026/03/31) (docID S100YEOP)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え・遡及適用 の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
tokyo-seimitsu: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 修正再表示チェックで重複年度は全行一致しました。2022年3月期は在外子会社の円貨換算方法の変更を遡及適用した後の数値のため、financialNotesに記載しました。
- businessModel: 重要な後発事象は該当事項なしのため、needsReviewには入れていません。
- businessStructure: 当社グループは、当社及び子会社27社、関連会社２社で構成されています。
- businessStructure: 八王子新工場の建設は投資予定額・着工時期ともに未定のため、needsReviewには入れていません。
- history: 沿革の表は年月と事象が順に並んでおり、対応づけに問題はありませんでした。
- industry: 計測機器事業は、閉じた分類に精密機器を表す値がないため、最も近い機械を2つ目としました。
- relatedCompanies: 特定投資株式の銘柄（みずほフィナンシャルグループ、旭ダイヤモンド工業、東亜建設工業、ＴＨＫ、ＴＰＲ、三菱ＵＦＪフィナンシャル・グループ、トミタ、山善、英和、めぶきフィナンシャルグループ、ミクロン精密、日本電計、佐藤商事、大豊工業、筑波銀行、サンケン電気、オークマ、黒田精工、杉本商事、第一生命ホールディングス、三井住友フィナンシャルグループ、京セラ、ニコン、イノテック、沖電気工業）は、保有目的が全銘柄共通の「取引関係の安定・維持」という定型句のみで、個別の取引・提携の記載がないため結びませんでした。
- relatedCompanies: 富士通は、富士通テレコムネットワークス福島の株式取得の記載のみで、富士通株式会社自体との取引・提携の記載がないため結びませんでした。
- relatedCompanies: みずほ銀行は2026年3月31日現在1.65％の大株主ですが、金融機関のため結びませんでした。
- relatedCompanies: 連結子会社16社、非連結子会社及び関連会社2社はすべて非上場のため結びませんでした。
- relatedCompanies: エン、ステップ、No.1、キャリア、パス、ポート、イシン、トーセ、セキ、キング、高速、コア、クリエイト、ランド、ビジョン、ベース、レック、イノベーション、レイ、スペース、リード、テクノロジーズなどは、社名の断片一致のみで、有報がその相手について述べる取引・提携・資本関係がないため結びませんでした。
- relatedCompanies: 日新とトラストはコードリストにないため結びませんでした。
- relatedCompanies: 主要な顧客は、連結売上高の10％以上を占める相手先がないため記載がなく、結べる相手がありませんでした。

## 要確認（status に反映）

- businessModel: 飯能新工場（埼玉県飯能市）の建設を進めており、2026年5月に着工し、2028年3月に完成する予定です。投資予定額は未定です。
- businessStructure: 飯能新工場（埼玉県飯能市）の建設を進めており、2026年5月に着工し、2028年3月に完成する予定です。投資予定額は未定です。
- history: 飯能新工場（埼玉県飯能市）の建設を進めており、2026年5月に着工し、2028年3月に完成する予定です。投資予定額は未定です。
- industry: 飯能新工場（埼玉県飯能市）の建設を進めており、2026年5月に着工し、2028年3月に完成する予定です。投資予定額は未定です。
- relatedCompanies: 飯能新工場（埼玉県飯能市）の建設を進めており、2026年5月に着工し、2028年3月に完成する予定です。投資予定額は未定です。
- terms: 飯能新工場（埼玉県飯能市）の建設を進めており、2026年5月に着工し、2028年3月に完成する予定です。投資予定額は未定です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
