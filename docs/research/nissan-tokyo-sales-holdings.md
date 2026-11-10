# 日産東京販売ホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日産東京販売ホールディングス株式会社 |
| 証券コード | 8291 |
| docID（データを取り出した文書） | `S100YGG9` |
| 原本 docID | `S100YGG9` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YGG9.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 日産東京販売ホールディングス株式会社 / 8291 / docID S100YGG9（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 4 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nissan-tokyo-sales-holdings: 10 件の数値を有報XBRLと照合
有報: 日産東京販売ホールディングス株式会社 有価証券報告書－第114期(2025/04/01－2026/03/31) (docID S100YGG9)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
nissan-tokyo-sales-holdings: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: パックの注意（本文に財務諸表の組替えの記載がある）について: 修正再表示チェックは前期有報と全8行が一致し、パック内の本文テキストに表示方法の変更にあたる具体的な注記は確認できないため、financialNotes は空とした。
- businessModel: 連結子会社の株式会社カーネット車楽は清算手続き中である旨が【関係会社の状況】に印字されている（2026年3月31日現在）。金額の開示はなく、needsReview には入れていない。
- businessModel: 中期経営計画の数値目標（電動車販売比率等）は経営指標・目標にあたるため、perspectives には記載しなかった。
- businessStructure: 報告セグメントは「自動車関連事業」の単一セグメントのため、事業は【事業の内容】の区分に沿って記載した。不動産事業は報告セグメントではないが、【事業の内容】に独立した事業として印字されているため分けて記載した。
- businessStructure: children の金額は、MD&A の販売実績に印字された新車・中古車の金額のみを用いた。販売実績は新車と中古車のみを対象としており、部用品販売や整備の金額は含まれていないため、children の合計は連結売上高と一致しない。
- businessStructure: 主要な設備は単一セグメントに属するため、拠点と事業の対応づけはしていない。
- history: 1942年の設立時の資本金額は、本文ルールのため記載していない。
- history: 沿革のうち本社移転や小規模な子会社設立・商号変更などは、主要な節目に絞って収録した。
- industry: 主たる業界は、日産車の販売（新車・中古車）を最終顧客向けに行う自動車ディーラーであるため retail とした。automotive は自動車・部品のメーカーに使われている区分であり、当社のような販売会社には付けなかった。不動産事業は賃貸が中心で規模の開示もないため、real-estate は付けなかった。
- relatedCompanies: キヤノン（canon）は結ばなかった: 2023年に全株式を譲渡したのは東京日産コンピュータシステム株式会社（現 キヤノンＩＴソリューションズ株式会社）であり、譲渡の相手先はキヤノン株式会社自体ではなく、その子会社が存続会社であるため。
- relatedCompanies: 株式会社アルファ（alpha、大株主2.25％）は結ばなかった: 大株主の状況に住所・持株の印字はあるが、取引・提携関係の印字がないため。なお候補の alpha-4760 は住所の異なる同名の別会社である。
- relatedCompanies: career、en、port、base-4481、freee、vector は一般語・部分一致の誤マッチのため結ばなかった。
- relatedCompanies: zero、seki、shinto、taya、takashima-and-co は、本文中の語句や地名・旧社名の一部（新東京日産自動車販売、日産ネットワークホールディングスの所在地「高島」等）との部分一致のため結ばなかった。
- terms: 助言: 用語「ｅ－ＰＯＷＥＲ」（エンジンは発電専用とし、モーターのみで駆動する日産の電動パワートレイン）は、この会社の電動車ラインナップを理解する要点として用語集への追加候補と考える。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
