# ネクステージ — research log

Registered: 2026-11-08（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社ネクステージ |
| 証券コード | 3186 |
| docID（データを取り出した文書） | `S100XM1X` |
| 原本 docID | `S100XM1X` |
| 提出日（原本） | 2026-02-19 |
| 決算期 | 2025-11-30 |
| 訂正報告書 | なし（2026-11-06 まで確認） |

entry の `sources`: `yuho-2025` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XM1X.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社ネクステージ / 3186 / docID S100XM1X（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 3 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 3 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 11 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 2 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
nextage: 10 件の数値を有報XBRLと照合
有報: 株式会社ネクステージ 有価証券報告書－第27期(2024/12/01－2025/11/30) (docID S100XM1X)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
nextage: 本文の金額 2 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 確認: [other-profit-wording] businessModel.flow[4].description: 売上高と当期純利益以外の利益に触れていないか確認する（…拠点あたりの収益性を高める店舗運営で利益を確保しています。2025年11月期…）
- 確認: [other-profit-wording] businessModel.flow[4].title: 売上高と当期純利益以外の利益に触れていないか確認する（…利益の確保…）

## エージェントの判断記録（fragment warnings）

- businessModel: 経営方針に印字された数値目標のうち、売上高と当期純利益以外の利益の予想額は、本文・perspectives には書かなかった。
- businessModel: 配当に関する記述は、投資の語に関する規則に従い本文には書かなかった。
- businessModel: financialNotes は、主要な経営指標等の注記（収益認識に関する会計基準等を第24期の期首から適用）に基づき1件だけ記録した。前期有報との修正再表示チェックは全項目一致している。
- businessStructure: 報告セグメントは自動車販売及びその附帯業務の単一セグメント（セグメント情報に明記）のため事業は1つとし、【事業の内容】に掲げる中古車販売・新車販売・整備・保険代理店・自動車買取の各事業と、その他事業として区分されるカーコーティング事業を children とした。事業ごとの売上高は開示されていないため、children には金額を書いていない。
- businessStructure: listings の market は表紙の印字「東京証券取引所（プライム市場） 名古屋証券取引所（プレミア市場）」から付けた。
- businessStructure: 拠点数は【事業の内容】の2025年11月30日現在の印字どおり（中古車販売事業125拠点は複合店を1拠点として数えた数）。
- history: 沿革に印字された資本金額（設立時の資本金など）は、金額を書かない規則に従い本文に書かなかった。
- history: 【沿革】の項目から主な出来事を選んだ。2008年の中古車輸出事業の開始と2016年の終了、本店所在地の移転など、現在の事業の形に直接つながらない項目は省いた。
- industry: 主たる業界は、単一セグメントである自動車販売事業（中古車・新車の販売とその附帯業務）が売上のほぼすべてを占めるため retail とした。自動車の製造は行っていないため automotive は付けなかった。
- relatedCompanies: career: 「キャリア形成支援」など人材に関する一般語の文脈での一致で、株式会社キャリアについての記載はないため結ばなかった。
- relatedCompanies: port: 「サポート体制」等の一般語の断片一致で、ポート株式会社についての記載はないため結ばなかった。
- relatedCompanies: en: 「エンゲージメント」の断片一致で、エン株式会社についての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: land: 店舗ブランド「SUV LAND」や「JAGUAR・LAND ROVER」のブランド名に含まれる断片の一致で、株式会社ランドについての記載はないため結ばなかった。
- relatedCompanies: ne: 自社連結子会社「株式会社ONEモトーレン」の社名に含まれる断片の一致で、NE株式会社についての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: seki: 「情報セキュリティ」の断片一致で、セキ株式会社についての記載はないため結ばなかった（ambiguous）。
- relatedCompanies: smn: 【大株主の状況】（2025年11月30日現在）に株式会社SMNが発行済株式の35.08％を保有する筆頭株主として載るが、住所は名古屋市千種区であり、候補のSMN株式会社（証券コード6185）との同一性を確認できる記載が有報になく、【関係会社の状況】にも載らず、取引・提携の記載もないため、同一性が確認できない相手として結ばなかった。
- relatedCompanies: the-lead: 「リードタイム」の断片一致で、株式会社リードについての記載はないため結ばなかった。
- relatedCompanies: base-4481: 「連結ベース」の一般語の一致で、ベース株式会社についての記載はないため結ばなかった。
- relatedCompanies: trust: 候補の listing が上場でなく、大株主欄の日本マスタートラスト信託銀行株式会社（信託口）の名称に含まれる断片の一致でもあるため結ばなかった。
- relatedCompanies: なお、【関係会社の状況】に載るのは連結子会社10社（いずれも非上場）のみで、親会社・持分法適用関連会社・その他の関係会社の区分に当たる上場会社はない。大株主の状況に載る損害保険ジャパン株式会社（4.38％）は候補に含まれず、保険会社でもあるため結ばなかった。
- terms: 助言: 「出張買取」は用語集に未登録です。お客様の自宅まで伺って中古車の査定と買取を行うサービスで、この会社の買取事業の柱のため、登録候補になります。
- terms: 助言: 「総合店」は用語集に未登録です。販売・整備・買取をワンストップで行う大型店舗の業態を指し、この会社の中古車販売の中核のため、登録候補になります。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
