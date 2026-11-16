# 東京自働機械製作所 — research log

Registered: 2026-11-16（登録パイプライン。このログはパイプラインの記録から機械的に生成した）

数値・ラベル・会計基準は EDINET の XBRL から機械的に取り出し（`scripts/research/evidence-pack.mjs`）、
`scripts/research/verify-financials.mjs` でタグと突き合わせた。PDF の読み取り、手計算、
比較スクリプトの自作はしていない。判断を要する記述（事業構造・沿革・ビジネスモデル・業界・関連企業）は
evidence pack だけを読むエージェントが書いた。下の警告欄がその判断の記録である。

## Document

| 項目 | 値 |
|---|---|
| 提出者名（EDINET） | 株式会社　東京自働機械製作所 |
| 証券コード | 6360 |
| docID（データを取り出した文書） | `S100YHZL` |
| 原本 docID | `S100YHZL` |
| 提出日（原本） | 2026-06-24 |
| 決算期 | 2026-03-31 |
| 訂正報告書 | なし（2026-11-12 まで確認） |

entry の `sources`: `yuho-2026` https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YHZL.pdf

## Stages

| 工程 | 状態 | 試行 | メモ |
|---|---|---|---|
| identity | completed | 0 | 株式会社　東京自働機械製作所 / 6360 / docID S100YHZL（bootstrap: intake と同じ規則で再構築） |
| edinet | completed | 0 | pack + draft 作成（warnings 1 件） |
| businessStructure | completed | 0 | businessStructure-agent の成果物あり（警告 4 件） |
| businessModel | completed | 0 | businessModel-agent の成果物あり（警告 5 件） |
| history | completed | 0 | history-agent の成果物あり（警告 2 件） |
| industry | completed | 0 | industry-agent の成果物あり（警告 1 件） |
| relatedCompanies | completed | 0 | relatedCompanies-agent の成果物あり（警告 7 件） |
| terms | completed | 0 | terms-agent の成果物あり（警告 1 件） |
| sourceValidation | completed | 2 | 出典 1 件・数値照合OK（注意 2 件） |
| qualityControl | completed | 2 | スキーマ・整合性ルールともOK |
| registration | running | 1 |  |

## 数値の照合（verify-financials.mjs）

```
tokyo-automatic-machinery-works: 10 件の数値を有報XBRLと照合
有報: 株式会社　東京自働機械製作所 有価証券報告書－第77期(2025/04/01－2026/03/31) (docID S100YHZL)
前期有報との比較: 24 行一致（修正再表示なし）
利益・総資産・純資産・従業員数: 20 件を照合
注意: 連結のセグメント情報のテキストブロック（segments.txt）は無い。sections.txt の「セグメント情報等、財務諸表」にセグメント情報の注記があるので、そこから読むこと（会計基準はこの有無からは判断できない。表紙・経理の状況で確認する）
すべて一致しました。
tokyo-automatic-machinery-works: 本文の金額 4 件を照合
すべて有報の印字に一致しました。
```

## 出典の検証

- 正式名称「株式会社東京自働機械製作所」が EDINET の提出者名「株式会社　東京自働機械製作所」と違います
- 確認: [other-profit-wording] perspectives.strategy.disclosed.text: 売上高と当期純利益以外の利益に触れていないか確認する（…アップ、生産機械事業量の安定的確保と利益確保、サステナビリティ経営の実践を基…）

## エージェントの判断記録（fragment warnings）

- businessModel: セグメント情報の外部顧客への売上高は、包装機械6,541,363千円、生産機械3,151,629千円と千円単位で印字されており、千円額を百万円に切り捨てて記載した。合計は売上高9,692,993千円と一致する。
- businessModel: MD&Aに印字された利益の金額や増減率は本文に書かなかった。本文の財務数値は売上高と当期純利益だけである。受注高・受注残高の金額も書かなかった。
- businessModel: 経営指標等の注記は、潜在株式が存在しないための表示事項、株式給付信託（BBT）に係る表示事項、最高・最低株価の市場表示、第75期の特別配当、第77期の配当が2026年6月25日開催予定の定時株主総会の決議事項である旨のいずれも表示・配当政策に関する事項であり、変則決算・決算期変更・会計基準変更の事実はないため financialNotes には記録しなかった。第77期の期末配当は提出後の株主総会決議（予定）という資本政策事項のため warnings にとどめる。
- businessModel: 主要な顧客であるJOHNSON & JOHNSON VISION（2026年3月期の売上高の24.5％）は related-candidates.json にないため、関連企業として登録せず、本文の顧客の段に社名だけを記載した。関連会社の東京施設工業株式会社も候補にない自社の関連会社であるため登録しなかった。
- businessModel: industryPosition は、順位・シェア等の裏付けが印字されていないため省いた。
- businessStructure: suppliers はこのツリーの旧スキーマのため省略した。個別の仕入先の社名は印字されていない。
- businessStructure: 事業の並び順は、セグメント情報の外部顧客への売上高の大きい順（包装機械6,541百万円、生産機械3,151百万円）とした。合計は売上高9,692百万円と一致する。
- businessStructure: 設備の帳簿価額は書かなかった。柏工場と設計開発部の行は包装機械・生産機械の両セグメントが連記された行であり、特定の事業に結びつけなかった。富里の設備は包装機械の生産設備で、関連会社東京施設工業株式会社に賃貸されている。
- businessStructure: 当社グループは当社、子会社1社（有限会社東祐、非連結子会社）及び関連会社1社（東京施設工業株式会社、持分法適用関連会社、議決権所有割合34.2％）で構成される。東京施設工業は包装機械の製造を担っている。
- history: 沿革の資本金額（1985年5月の増資）は、沿革に資本金額を書かない規則のため落とした。
- history: 落とした行：1957年大阪営業所開設、1963年8月の柏工場への移転、1974年エンタープライズ・カンパニーとの技術導入契約、1980年名古屋・福岡営業所開設、1984年流山研究所完成、1985年札幌営業所開設と東京施設工業の富里移転、1995年マレーシア子会社の設立と2007年の全株式売却、1996年ISO9001取得、2013年PT TAM PACKAGING ASIAの営業開始。いずれも拠点の開設・移転、認証取得、または現在のグループ構成に残らない過去の出来事であるためである。
- industry: 主たる業界は machinery とした。包装機械（売上高の67.5％）と生産機械（同32.5％）はいずれも機械の製造・販売であり、閉じた分類の machinery に直接当てはまるため、暫定分類は使わず taxonomyGaps は記録しなかった。
- relatedCompanies: 日本たばこ産業株式会社、寿スピリッツ株式会社、明治ホールディングス株式会社、森永製菓株式会社、株式会社資生堂、ゼネラルパッカー株式会社、カンロ株式会社、株式会社meito、キーコーヒー株式会社は、特定投資株式の保有目的が全社同一の定型文（包装機械等の取引を行っており、営業取引における関係強化のため保有）だけであるため登録しなかった。日本精工株式会社も同じ定型文の型（生産機械等の取引を行っており）だけであるため登録しなかった。
- relatedCompanies: 日機装株式会社、株式会社朝日工業社、株式会社トミタは、特定投資株式の保有目的が業界動向等の情報収集を主とする定型文だけであるため登録しなかった。
- relatedCompanies: 株式会社みずほフィナンシャルグループ、株式会社三菱ＵＦＪフィナンシャル・グループ、株式会社千葉銀行は、保有目的が資金借入等の金融取引関係の維持であり、銀行・金融機関の資金調達関係のため登録しなかった。
- relatedCompanies: 株式会社光通信は、大株主の状況に載るのが光通信KK投資事業有限責任組合という別法人であり、株式会社光通信そのものではないため登録しなかった。
- relatedCompanies: 不二家（株式会社不二家）は、債務の相手先一覧に金額とともに載るだけで、個別の取引関係の記述がないため登録しなかった。
- relatedCompanies: zero、en、innovation、career、i-ll、land、lec、vision、base-4481、king、kohsoku、corona は、一般語・製品名・地名などの部分一致であるため登録しなかった。
- relatedCompanies: 主要な顧客であるJOHNSON & JOHNSON VISIONは related-candidates.json にないため登録しなかった。関連会社の東京施設工業株式会社は自社の持分法適用関連会社であり、候補にもないため登録しなかった。
- terms: 助言のみ。用語の追加提案：上包機（製品をフィルム等で包む包装機械）、製袋充填機（袋を作りながら内容物を充填する包装機械）、圧縮梱包機（古紙・廃棄物等を圧縮して梱包する機械）。

## 要確認（status に反映）

なし。

## 分類の不足（status には反映しない）

データは正しいが、現在の分類（RELATIONSHIP_KINDS / INDUSTRY_IDS）では言い表せないもの。会社を止める理由ではなく、
分類を決めるための記録（全社分は `pipeline/taxonomy-gaps.tsv`）。

なし。
