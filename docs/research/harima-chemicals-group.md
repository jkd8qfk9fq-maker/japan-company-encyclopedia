# ハリマ化成グループ — research log

Registered: 2026-11-10（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | ハリマ化成グループ株式会社 |
| 証券コード | 4410 |
| docID（データを取り出した文書） | `S100YEIE` |
| 原本 docID | `S100YEIE` |
| 提出日（原本） | 2026-06-25 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-09 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YEIE.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | ハリマ化成グループ株式会社 / 4410 / docID S100YEIE（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 0 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 4 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 3 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 24 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 0 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 0 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
harima-chemicals-group: 10 件の数値を有報XBRLと照合
有報: ハリマ化成グループ株式会社 有価証券報告書－第84期(2025/04/01－2026/03/31) (docID S100YEIE)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
すべて一致しました。
harima-chemicals-group: 本文の金額 7 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

なし。

## エージェントの判断記録（fragment warnings）

- businessModel: financialNotesは空とした。経営指標等の注記に会計基準の変更や表示方法の変更に関する記載がなく、修正再表示チェックも前期有報と全行一致したためである。
- businessModel: MD&Aのセグメント別売上高はセグメント注記の外部顧客への売上高と一致しており、内部売上高を含む数値ではないため、セグメント注記の数値を使用した。
- businessModel: 関係会社の状況の注記にある特定子会社単体の損益情報は、連結の数値ではないため本文には使用していない。
- businessModel: 中期経営計画の業績目標（売上高・営業利益率等の数値目標）は将来の目標値であり、実績ではないため本文には記載していない。
- businessStructure: 事業の並び順はセグメント注記の外部顧客への売上高の大きい順とした（ローター35,931百万円、製紙用薬品事業28,716百万円、樹脂・化成品事業21,420百万円、電子材料事業13,718百万円）。
- businessStructure: 「その他」は報告セグメントに含まれない区分（主に不動産管理事業等）のため最後に置いた。金額3,946百万円はセグメント注記の外部顧客への売上高の印字どおり。
- businessStructure: 報告セグメント計99,787百万円と「その他」3,946百万円の合計は103,734百万円で、連結売上高103,763百万円との差28百万円はセグメント注記の調整額の印字どおりである。
- businessStructure: 製品区分ごとの金額は独立して開示されていないため、childrenには金額を書いていない。
- history: 沿革は有報の印字どおり全37行を転記した。1990年・2003年・2007年・2011年・2012年・2014年・2022年・2023年・2024年は同一年に複数の事象があり、それぞれ独立した項目として収録した（スキーマ上、月は保持されない）。
- history: 1947年の設立行には資本金額の印字がないため、金額には触れていない。
- industry: 全ての報告セグメントが化学製品の製造販売であり、主たる業界はchemicals（化学）とした。
- industry: 電子材料事業ははんだ付け材料や半導体レジスト用樹脂などの化学素材であり、半導体レジスト用樹脂だけの金額が独立して開示されていないため、semiconductorsは付けていない。
- industry: その他区分の不動産管理・ホテル・ゴルフ場・食品は報告セグメントではなく事業の中核でもないため、real-estateやfoodは付けていない。
- relatedCompanies: career（キャリア）は一般語「キャリア面談」等への部分一致で、同社との取引・提携・資本関係の記載がないため見送った。
- relatedCompanies: en（エン）はambiguousな候補で、一般語・略称への部分一致のみであり、同社との関係の記載がないため見送った。
- relatedCompanies: port（ポート）は一般語「事業ポートフォリオ」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: land（ランド）は「ニュージーランド」等への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: seki（セキ）はambiguousな候補で、一般語への部分一致のみであり、同社との関係の記載がないため見送った。
- relatedCompanies: base-4481（ベース）は「連結ベース」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: vision（ビジョン）は「長期ビジョン」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: freee（フリー）は「CO2フリー」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: rent（レント）は「リカレント」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: reskill（リスキル）は一般語「リスキル」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: zero（ゼロ）はambiguousな候補で、「発生件数ゼロ」等への部分一致のみであり、同社との関係の記載がないため見送った。
- relatedCompanies: corona（コロナ）は「コロナ禍」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: ray（レイ）はambiguousな候補で、「ディスプレイ」への部分一致のみであり、同社との関係の記載がないため見送った。
- relatedCompanies: core（コア）はambiguousな候補で、「コア技術」への部分一致のみであり、同社との関係の記載がないため見送った。
- relatedCompanies: aeon（イオン）は「リチウムイオン」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: opro（オプロ）は「バイオプロセス」への部分一致で、同社との関係の記載がないため見送った。
- relatedCompanies: trust（トラスト）はコードリストにない候補で、印字は日本マスタートラスト信託銀行株式会社（信託口）の大株主表記であり、信託口のため見送った。
- relatedCompanies: daiichi-jitsugyo（第一実業）は、2003年12月のHarimatec Malaysia Sdn.Bhd.設立時の合弁相手として沿革に記載があるのみで、同子会社は現在100.0％出資の連結子会社となっており、当期における同社との取引・提携の記載がないため見送った。
- relatedCompanies: daio-paper（大王製紙）は特定投資株式として前期まで保有していたが、当事業年度に全株を売却し当期の株式数がないため見送った。
- relatedCompanies: sakata-inx（サカタインクス）は当事業年度に全株を売却し当期の株式数がないため見送った。
- relatedCompanies: kansai-paint（関西ペイント）は当事業年度に全株を売却し当期の株式数がないため見送った。
- relatedCompanies: artience株式会社は特定投資株式に印刷インキ用樹脂事業の販売を中心とする取引先として印字されているが、百科事典の掲載済み企業（関連企業候補）に含まれないため結ばず、取引先としての役割のみをここに記録する。
- relatedCompanies: 特定投資株式の株式会社三井住友FGは資金調達取引等を目的とする金融機関であり、関連企業候補にも含まれないため結んでいない。
- relatedCompanies: 大株主の長谷川興産株式会社と松川株式会社はいずれも未上場で関連企業候補に含まれないため結んでいない。株式会社三井住友銀行は金融機関の大株主であり結んでいない。
- terms: 助言工程なのでエントリーには書き込みません（「terms」は無視）

## 要確認（status に反映）

- businessModel: 2026年6月5日開催の取締役会において、電子材料事業カンパニーの半導体レジスト用樹脂事業を樹脂・化成品事業カンパニーへ移管する組織変更が決議されました（2026年7月1日付実施）。これに伴い、翌連結会計年度より、従来「電子材料事業」に含めていた半導体レジスト用樹脂事業は「樹脂・化成品事業」に含めて開示される予定です。本登録は2026年3月31日現在の構成（半導体レジスト用樹脂事業は電子材料事業に含まれる）に基づいています。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
