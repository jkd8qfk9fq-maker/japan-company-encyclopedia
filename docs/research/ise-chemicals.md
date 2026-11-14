# 伊勢化学工業 — research log

Registered: 2026-11-14（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 伊勢化学工業株式会社 |
| 証券コード | 4107 |
| docID（データを取り出した文書） | `S100XT8H` |
| 原本 docID | `S100XT8H` |
| 提出日（原本） | 2026-03-27 |
| 決算期 | 2025-12-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XT8H.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 伊勢化学工業株式会社 / 4107 / docID S100XT8H（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
ise-chemicals: 10 件の数値を有報XBRLと照合
有報: 伊勢化学工業株式会社 有価証券報告書－第105期(2025/01/01－2025/12/31) (docID S100XT8H)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
ise-chemicals: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 金額はすべて百万円単位の印字どおりとした。MD&Aの億円単位の表記（392億5千8百万円など）は使っていない。
- businessModel: セグメント別の外部顧客への売上高の合計（34,656百万円＋4,601百万円＝39,257百万円）は印字の連結売上高39,258百万円と1百万円異なる。いずれも印字どおりとし、差異は丸めによるものとして本文では合計を再計算していない。
- businessModel: 財務目標として印字される指標の名称と目標数値は、投資指標にあたる語と将来の目標数値を含むため perspectives には転記せず、方針の内容だけを要約した。
- businessModel: 未適用のリースに関する会計基準等（2028年12月期の期首から適用予定、影響は評価中）は、5年表の数値に影響していないため financialNotes には入れていない。
- businessModel: 調達先は、事業の内容と関係会社の状況に原料かん水等の仕入れが印字されているため、一般名詞「原料の仕入先」として suppliers に1行だけ書いた。仕入先の社名そのものは suppliers の name にはしていない。
- businessStructure: 事業の並び順は報告セグメント注記の外部顧客への売上高の大きい順（ヨウ素及び天然ガス事業34,656百万円、金属化合物事業4,601百万円）とした。2事業の合計は39,257百万円で、印字の連結売上高39,258百万円と1百万円異なり、いずれも印字どおりとした。
- businessStructure: セグメント間の内部売上高は印字が無い（「－」）ため、MD&Aのセグメント別売上高は外部顧客への売上高と同額である。並び順と本文の金額にはセグメント注記の外部顧客への売上高を用いた。
- businessStructure: 連結子会社ウッドワード・アイオダイン・コーポレーションはヨウ素及び天然ガス事業に属するグループ内部の会社であるため、事業構造ではグループ構成として businessModel に記載し、関連企業には結んでいない。
- history: 沿革に印字される子会社等の資本金額は、金額記載の禁止ルールに従い転記していない。
- history: 工場の新設・閉鎖やISO認証取得などの細かな沿革は、事業の節目となるものを選んで省略した。
- history: Wikipediaは数値を使わず、沿革の裏付けにも使っていない。有報に印字のない事実は沿革に加えていない。
- industry: 主たる業界は chemicals とした。外部顧客への売上高の大半をヨウ素及び天然ガス事業と金属化合物事業という化学品の製造販売が占めるためである。
- industry: 天然ガスはヨウ素及び天然ガス事業の中の一製品であり、金額が独立して開示されていないため、energy は付けていない。
- relatedCompanies: 三菱商事株式会社は販売と仕入の両方の取引が印字されているが、主要な顧客ごとの情報にも主要な顧客として載るため customer とした。大株主である事実は説明に併記した。
- relatedCompanies: 主要な顧客として開示されるＪＦＥミネラル株式会社と丸善薬品産業株式会社は、関連候補（related-candidates.json）に含まれていないため関連付けしなかった。
- relatedCompanies: 連結子会社ウッドワード・アイオダイン・コーポレーションはグループ内部の会社であるため関連企業には結んでいない。
- relatedCompanies: ケル（kel）は「塩化ニッケル」等の語の一致、ゼロ（zero）・コア（core）・ポート（port）・ベース（base-4481）・フロンティア（frontier）・コタ（cota）・セキ（seki）・あらた（arata）・コロナ（corona）・レイ（ray）は一般語や方針・リスク等の文脈の語の一致によるもので、有報にその相手についての取引・提携・資本関係の印字がないため関連付けしなかった。
- relatedCompanies: 大株主のうち株式会社日本カストディ銀行（信託口）等は信託・資産管理にあたるため関連付けしなかった。その他の大株主は関連候補に含まれていない。
- terms: 用語フラグメントは助言のみのため、データ本体は空とした。説明に使う用語としては、ヨウ素、地下かん水、ブローイングアウト法、塩化ニッケル、積層セラミックコンデンサ（ＭＬＣＣ）が候補になる。

## 要確認（status に反映）

- businessModel: 株式分割：2026年1月1日付けで普通株式1株につき10株の割合で株式分割を行った（2025年10月31日開催の取締役会決議に基づき、重要な後発事象として印字）。株式数に関する指標は2024年12月期の期首に当該分割が行われたと仮定して算定されている旨が、連結経営指標等の注記に印字されている。登録は当期有報の印字どおりの数値に基づく。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
