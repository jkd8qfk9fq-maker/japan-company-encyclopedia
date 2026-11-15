# 大成ラミックグループ — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 大成ラミックグループ株式会社 |
| 証券コード | 4994 |
| docID（データを取り出した文書） | `S100YG2P` |
| 原本 docID | `S100YG2P` |
| 提出日（原本） | 2026-06-22 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-13 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YG2P.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 大成ラミックグループ株式会社 / 4994 / docID S100YG2P（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 2 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 6 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 3 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
taisei-lamick-group-head-quarter-and-innovation: 10 件の数値を有報XBRLと照合
有報: 大成ラミックグループ株式会社 有価証券報告書－第61期(2025/04/01－2026/03/31) (docID S100YG2P)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
taisei-lamick-group-head-quarter-and-innovation: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは、変則決算・決算期変更・会計基準の変更等の事実が5年表の注記にないため空としました。
- businessModel: 2026年3月期の純利益の減少要因（税金費用の増加）は金額を伴わない範囲で本文に書かず、フローには金額のみを記載しました。
- businessStructure: 単一セグメントのため、【関連情報】の製品区分（包装フィルム・包装機械）を children としました。金額はセグメント注記の外部顧客への売上高です。
- businessStructure: Taisei Lamick (Thailand) Co., Ltd.は2025年9月に設立され、出資比率49.0％ながら支配力基準により連結子会社化されています（【関係会社の状況】に印字）。期末時点のグループ構成として登録しています。
- businessStructure: このツリーのスキーマには suppliers キーがないため、原材料の調達関係は relatedCompanies と warnings に記録しました。
- history: 1966年の設立は実質上の存続会社である大成包材株式会社についての記載です（【沿革】冒頭の注記どおり）。資本金の金額は沿革に書かないため落としました。
- history: 2017年の増資の行は資本金の金額が中心のため落としました。
- industry: EDINETの業種分類は化学であり、売上高の約87％を占める包装フィルム（プラスチックフィルムの製造販売）が中核のため chemicals を primary としました。包装機械は製品区分として金額が独立開示されているため machinery を2つ目に付けました。新たなタクソノミーギャップは申告しません。
- relatedCompanies: 候補の理研ビタミン、ブルドックソース、アリアケジャパン、ヱスビー食品、コーセーホールディングスは、特定投資株式の保有目的が全銘柄同一の定型文（営業関係取引の維持・強化による将来的な企業価値向上のため）で、個別の取引の印字がないため登録しませんでした。
- relatedCompanies: 候補の武蔵野銀行は、特定投資株式の保有目的が資金調達や金融取引の協力関係の維持・強化であり、大株主の状況にも金融機関として載るため登録しませんでした。
- relatedCompanies: 候補の日本精機は、1992年の液体充填機の共同開発と2006年の開発成果等の権利譲受という過去の関係のみで、現在の取引・提携の印字がないため登録しませんでした。
- relatedCompanies: 大株主の株式会社タイパック（7.91％）と新生紙パルプ商事株式会社（2.20％）は候補にないため登録しませんでした。大株主である事実はここに記録します。
- relatedCompanies: 候補の seki、en、suzuki-6785、kohsoku、zero、trust、base-4481、port は一般語の一致によるもので、関係の印字がないため登録しませんでした。
- relatedCompanies: 特定投資株式の注記にあるヱスビー食品の株式分割は、保有先である同社の分割であり、当社自身の分割ではありません。
- terms: DANGAN：液体充填用フィルムに液体・粘体の内容物を充填する液体充填機のシリーズ名称です（【事業の内容】に印字）。用語集への登録を提案します。
- terms: H.U.G.Home：液体充填機の稼働状況の遠隔把握、生産状況の可視化・分析、機械の保守管理などの機能を備えたクラウドサービスです（【事業の内容】に印字）。用語集への登録を提案します。
- terms: 液体充填用フィルム：即席麺の液体スープやドレッシング、タレ類など液体・粘体の食品を包むためのラミネートフィルムです（【事業の内容】に印字）。用語集への登録を提案します。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
