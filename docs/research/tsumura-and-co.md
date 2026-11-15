# ツムラ — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ツムラ |
| 証券コード | 4540 |
| docID（データを取り出した文書） | `S100YFC1` |
| 原本 docID | `S100YFC1` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YFC1.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ツムラ / 4540 / docID S100YFC1（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 2 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 1 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tsumura-and-co: 10 件の数値を有報XBRLと照合
有報: 株式会社ツムラ 有価証券報告書－第90期(2025/04/01－2026/03/31) (docID S100YFC1)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
tsumura-and-co: 本文の金額 9 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益…）

## エージェントの判断記録（fragment warnings）

- businessModel: 2026年3月期に企業結合に係る暫定的な会計処理の確定を行っていますが、修正再表示チェックは重複年度の全行で一致したため、financialNotes には記載していません。
- businessModel: 2031年度の数値目標と2027年度の営業利益目標は、本文に書けない区分のため strategy.disclosed には入れていません。売上高2,340億円の目標のみ記載しました。
- businessModel: 上海虹橋中薬飲片有限公司の持分取得（2025年8月）は当期中の出来事で、連結子会社として記載しています。
- businessStructure: 単一セグメントのため、children は【関連情報】の地域ごとの情報（顧客の所在地別）を使いました。製品・サービスごとの情報は、単一の製品・サービスの区分の外部顧客への売上高が連結売上高の90％を超えているため記載が省略されています。
- businessStructure: 地域別の売上高の合計（192,614百万円）と連結売上高（192,615百万円）の1百万円の差は、有報の丸めによるものです。印字の金額をそのまま記載しています。
- history: 1962年の津村交易の吸収合併、1983年の富士枝急送への出資と茨城工場の新設、1986年と2007年の本社移転、2001年のTSUMURA USA, INC.の設立、2009年の夕張ツムラの設立、2018年の津村盛実製薬の設立、2019年の平村（深セン）の設立、2020年の平安津村薬業の持分取得は、15件に絞るため省きました。
- history: 設立時の資本金の金額は本文に書けないため記載していません。
- industry: 医薬品事業の単一セグメントが売上高の大半を占めるため、pharmaceuticals を主たる業界としました。
- relatedCompanies: dai-nippon-printing と toppan-holdings、hokuyaku-takeyama-holdings、taisei は、当事業年度中に全株式を売却したため結びませんでした。
- relatedCompanies: mitsubishi-ufj-financial-group、hachijuni-nagano-bank、the-shiga-bank、shizuoka-financial-group は、財務活動への協力関係が保有目的で、金融機関のため結びませんでした（銀行ルール）。
- relatedCompanies: 中国平安保険（集団）股份有限公司とは資本業務提携がありますが、掲載企業リストになく、関連候補にないため結びませんでした。平安人寿保険は2026年3月31日現在で当社株式の10.20％を保有する大株主ですが、掲載企業リストにないため結びませんでした。
- relatedCompanies: vision・career・en・path・port・base-4481・imura-and-co・trust・innovation・reskill・freee・seki・care-service・land・lec・oro・ray・ricoh・rohm・vector・zero は語の断片一致のみのため結びませんでした。
- relatedCompanies: 連結子会社（ロジテムツムラ、夕張ツムラ、中国の各社、TSUMURA USA, INC.）はすべて非上場のため候補になく、結んでいません。
- terms: 新たに提案する用語はありません。漢方製剤や中薬飲片などの用語は本文で説明しています。

## 要確認（status に反映）

- businessModel: 平安津村薬業有限公司の持分20％の追加取得（完全子会社化）は、企業結合日が2026年6月30日（予定）で、有報の提出日（2026年6月23日）時点では完了していない予定事項です。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
