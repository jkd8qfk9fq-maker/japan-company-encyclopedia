# 橋本総業ホールディングス — research log

Registered: 2026-11-09（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 橋本総業ホールディングス株式会社 |
| 証券コード | 7570 |
| docID（データを取り出した文書） | `S100YK09` |
| 原本 docID | `S100YK09` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-08 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YK09.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 橋本総業ホールディングス株式会社 / 7570 / docID S100YK09（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 1 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
hashimoto-sogyo-holdings: 10 件の数値を有報XBRLと照合
有報: 橋本総業ホールディングス株式会社 有価証券報告書－第89期(2025/04/01－2026/03/31) (docID S100YK09)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 本文に 財務諸表の組替え の記載がある。前期有報との一致は「範囲が同じ」ことの証明にはならない（前期の時点で組替済みの場合がある）。該当注記を読んで basis の要否を判断すること
すべて一致しました。
hashimoto-sogyo-holdings: 本文の金額 6 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文に財務諸表の組替えの記載がありますが、修正再表示チェックで重複年度は全行一致し、売上高・当期純利益の範囲に変化がないため financialNotes は書きませんでした。
- businessModel: 目標とする経営指標のうち、前期対比経常利益成長率3.0％以上は経常利益の語を含むため strategy には書きませんでした。
- businessModel: 本文の財務数値は売上高と当期純利益だけにしました。
- businessStructure: セグメントは外部顧客への売上高の大きい順に並べました。その他は報告セグメントに含まれない区分のため最後にしました。
- history: 沿革は15件に絞りました。支店・配送センターの開設や移転の多くは省きました。
- industry: 主たる業界は、管材類や住宅設備機器類の卸売が主たる事業であることから商社としました。東証の業種分類も卸売業です。
- relatedCompanies: 特定投資株式の表に載る銘柄は、保有目的が全銘柄共通の「友好的な関係の維持、拡充を目的に株式を保有しております。」の定型句のみのため結びませんでした。（高砂熱学工業、ダイキン工業、TOTO、パナソニック ホールディングス、三菱電機、積水化学工業、キッツ、荏原製作所、タカラスタンダード、ノーリツ、鶴見製作所ほか）
- relatedCompanies: 沿革に特約販売店・代理店となった旨の印字があるメーカー（TOTO、パナソニック ホールディングス、三菱電機、荏原製作所、キッツ、積水化学工業）は、現行の取引を示す印字がないため結びませんでした。
- relatedCompanies: 東京ガスは、2004年に旧ハットリビングがエネスタ業務の営業を譲り受けた一回限りの取引で、同社は2008年に株式を売却し連結から除外されているため結びませんでした。
- relatedCompanies: 大株主は有限会社ハット企画、従業員持株会、取引先持株会、個人、信託銀行、銀行、保険会社などで、事業会社の大株主として結べる相手はありませんでした。
- relatedCompanies: 連結子会社10社はすべて非上場のため結びませんでした。
- terms: 新たに提案する用語はありません。管材類、衛生陶器・金具類などの事業用語は本文で説明しています。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
