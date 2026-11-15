# 日本プラスト — research log

Registered: 2026-11-15（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 日本プラスト株式会社 |
| 証券コード | 7291 |
| docID（データを取り出した文書） | `S100YHRY` |
| 原本 docID | `S100YHRY` |
| 提出日（原本） | 2026-06-23 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHRY.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 3 | 日本プラスト株式会社 / 7291 / docID S100YHRY（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 3 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 10 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nihon-plast: 10 件の数値を有報XBRLと照合
有報: 日本プラスト株式会社 有価証券報告書－第88期(2025/04/01－2026/03/31) (docID S100YHRY)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nihon-plast: 本文の金額 11 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 本文の財務数値は売上高と当期純利益のみで、営業利益・経常利益・セグメント利益の金額や増減率は書いていない。
- businessModel: financialNotes は空とした。変則決算・決算期変更はなく、経営指標に影響する会計基準の変更等の印字もない。前期有報との修正再表示チェックは全行一致している。経営指標の注記は株式給付信託（BBT）の株式の扱いと潜在株式の不存在に関するもので、指標自体の修正ではないため financialNotes には入れなかった。
- businessModel: 第6次中期経営計画と2027年3月期の経営目標にある営業利益率の数値目標は、利益率の目標であり将来目標のため、本文と perspectives には書いていない。
- businessModel: 地域別売上高の単純合計（114,859百万円）と連結売上高（114,861百万円）の2百万円の差は、有報の丸めとして印字どおり残した。
- businessModel: Nissan North America, Inc. は日産自動車株式会社の子会社で非上場のため関連企業には結ばず、顧客としての役割を businessModel と industryPosition に記録した。
- businessStructure: 報告セグメントは地域別の「日本」「北米」「中国」「東南アジア」の4つで、事業はこの4地域とし、セグメント注記の外部顧客への売上高（2026年3月期）の大きい順に並べた。セグメント利益は書いていない。
- businessStructure: 4地域の外部顧客への売上高の単純合計は114,859百万円で、連結売上高114,861百万円と2百万円異なる。有報の印字どおりとし、差額は有報の丸めとして記録する。
- businessStructure: 【事業の内容】の部門別記載（安全部品部門・樹脂部品部門・その他事業部門）は地域をまたぐため businesses の children にはせず、製品区分は businessModel に記録した。その他事業部門（ゲーム機用ハンドル等と事務処理・輸送サービス）は日本の当社と日本の子会社・関連会社が行うため、日本の説明に含めた。
- businessStructure: Wikipedia は補足を確認したが、有報にない旧社名・ブランド名等の追加情報はなく、使わなかった。
- history: 沿革表の全行を収録した（37件）。年月は行順の印字どおりで、月は schema に従い書いていない。
- history: 1948年4月の日本プラスト工芸（個人営業）の設立は沿革表の前文に印字された事実で、表の1948年10月の行とは別の出来事として分けて収録した。
- history: 沿革に設立・増資の資本金額の印字はないため、金額は書いていない。
- industry: 主たる業界は automotive とした。報告セグメントは地域別だが、いずれの地域も自動車部品の製造販売であり、連結売上高のすべてが自動車部品による。
- industry: 閉じた分類に該当値があるため taxonomyGaps は無い。
- relatedCompanies: 伊藤忠商事株式会社：特定投資株式の保有目的に印字された取引の相手は、同社の子会社である伊藤忠プラスチックス株式会社であり、伊藤忠商事そのものとの取引の印字はないため結ばなかった。伊藤忠プラスチックスは非上場で候補データにもない（なお同社は2026年3月31日現在、当社の株式を1.64％保有する大株主である）。
- relatedCompanies: 株式会社みずほフィナンシャルグループ：保有目的は子会社のみずほ銀行との資金借入取引等で、金融取引のため結ばなかった。
- relatedCompanies: 株式会社りそなホールディングス：保有目的は子会社のりそな銀行との資金借入取引等で、金融取引のため結ばなかった。
- relatedCompanies: 株式会社しずおかフィナンシャルグループ：保有目的は子会社の静岡銀行との資金借入取引等で、金融取引のため結ばなかった。
- relatedCompanies: 第一生命ホールディングス株式会社：保有理由は子会社の第一生命保険との保険取引等で金融取引にあたり、当事業年度に全株式を売却済みのため結ばなかった。
- relatedCompanies: ローム株式会社：出現は連結子会社ニートン・ロームの社名の一部で、ローム株式会社そのものとの関係の印字はないため結ばなかった。
- relatedCompanies: ニッタ株式会社：出現は株式会社シンニッタンの社名の部分一致で別法人であり、同社の株式は当事業年度に全て売却済みのため結ばなかった。
- relatedCompanies: ＮＯＫ株式会社：特定投資株式の保有目的は「将来の取引関係を構築するため」で現在の取引の印字はなく、候補データにもないため結ばなかった。
- relatedCompanies: ゼロ、エン、ビジョン、ランド、ベース、パス、セキ、コア、キャリア、カバー、コロナ、キング、スローガン、スペース、ウィル：一般語または製品名等の部分一致による誤抽出で、当社との取引・提携・資本関係を述べる印字はないため結ばなかった。
- relatedCompanies: 連結子会社12社と持分法適用関連会社1社（日本プラスト運輸株式会社）はすべて非上場で候補データにないため結ばなかった。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
