# ダイイチ — research log

Registered: 2026-11-12（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ダイイチ |
| 証券コード | 7643 |
| docID（データを取り出した文書） | `S100XC2D` |
| 原本 docID | `S100XC2D` |
| 提出日（原本） | 2025-12-22 |
| 決算期 | 2025-09-30 |
| 訂正報告書 | なし（2026-11-11 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XC2D.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ダイイチ / 7643 / docID S100XC2D（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 1 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 2 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 5 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 3 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 3 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
daiichi: 10 件の数値を有報XBRLと照合
有報: 株式会社ダイイチ 有価証券報告書－第71期(2024/10/01－2025/09/30) (docID S100XC2D)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
daiichi: 本文の金額 5 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: 中期経営計画のKPI数値目標（最終年度2026年9月期の売上高615億円・当期純利益12億円・来店客数2,300万人）、総資産経常利益率（ROA）10％超の目標、株価純資産倍率（PBR）に関する経営指標、および2026年9月期の業績予想は、利益率・投資関連の指標や将来情報を含むため本文に転記せず、strategy には基本方針と重点項目のみを要約した。
- businessModel: 商品別売上高は千円単位の表でのみ開示されるため、本文では金額を記載せず、売上高の大きい順の品目名のみを記載した。
- businessModel: 2022年に発覚した不適切会計問題については、財務諸表の注記に、当社費用の当時の役員の負担に関する解決金を2024年12月に全額受領した旨が記載されている。5年間の経営指標は前期有報との照合で差異がなく、当期の数値への影響はないため、needsReview には挙げず本警告に記録した。
- businessModel: 株式会社イトーヨーカ堂との資本業務提携契約（2013年7月23日締結、目的は北海道地区での食品小売分野の事業基盤強化）は【重要な契約等】に記載されている。相手方は未上場で百科事典に登録がないため、関連企業には結んでいない（relatedCompanies の警告にも記載）。
- businessStructure: 単一セグメント（スーパーマーケット事業）のため、children はMD&Aの地域別売上高のブロック区分（帯広・札幌・旭川）と【事業の内容】の付帯業務とし、外部売上高に相当する地域別売上高の大きい順に並べた。
- businessStructure: ブロック別売上高の合計は585億67百万円で、売上高585億70百万円との差3百万円は、MD&Aの地域別売上高の「その他」（惣菜センターの直売、2,663千円）によるものである。
- businessStructure: 商品別売上高は千円単位の表でのみ開示されるため、children には金額を付けず、地域別区分を用いた。
- history: 設立時の資本金など、沿革に印字された資本金の金額は本文に転記していない。
- industry: 主たる業界は retail とした。食料品主体のスーパーマーケット事業の単一セグメントであり、一般小売にあたるためである。
- industry: 付帯業務（テナント賃貸）は独立した金額開示がなく、事業の中心ではないため、副たる業界は付けていない。
- relatedCompanies: 株式会社イトーヨーカ堂: 【関係会社の状況】で「その他の関係会社」（被所有・直接30.57％）として載り、資本業務提携契約（2013年7月23日締結）も【重要な契約等】に記載されているが、未上場で百科事典に登録がないため結ばなかった。株式会社ヨーク・ホールディングスと株式会社BCJ-95（いずれも被所有・間接30.57％のその他の関係会社）も未上場で登録がないため結ばなかった。
- relatedCompanies: hokuhoku-financial-group（ほくほくフィナンシャルグループ）、mizuho-financial-group（みずほフィナンシャルグループ）、north-pacific-bank（北洋銀行）: 特定投資株式の保有目的が3銘柄でほぼ同一の定型文（主要な金融機関として、資金調達、M＆Aや出店候補地の情報提供、ビジネスマッチング、サステナビリティに関するソリューション提供等）であり、個別の提携・取引の事実が印字されていないため結ばなかった（koa先例）。
- relatedCompanies: itochu-shokuhin（伊藤忠食品）: 買掛金の主要な相手先として開示される食品卸売業者だが、関連候補の listing が「（コードリストにない）」で、EDINETコードリストによる検証ができないため結ばなかった。国分北海道株式会社（買掛金の最大の相手先）と日本アクセス北海道株式会社も未上場で登録がないため結ばなかった。
- relatedCompanies: 株式会社北陸銀行: 【大株主の状況】に発行済株式（自己株式を除く。）の1.72％を保有する株主として載るが、保有目的や取引関係の記載がなく、株主という関係は分類に無いため結ばなかった。
- relatedCompanies: career、base-4481、port、path、land、seki、basic、core、en、will: 自社の人事施策の文言（キャリアパス等）や一般語の部分一致であり、企業としての関係がないため結ばなかった。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）
- terms: 助言: 「フレカプラス」は2016年8月に導入した同社の電子マネーの名称であり、用語集での解説が有用です。
- terms: 助言: 「とくし丸」は同社が20台を稼働させる移動スーパー（移動販売車）の仕組みの名称であり、買い物支援の文脈で用語集での解説が有用です。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
